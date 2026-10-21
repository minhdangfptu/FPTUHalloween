const crypto = require('crypto')
const mongoose = require('mongoose')
const { PayOS } = require('@payos/node')
const { Cart, Order, TicketType, User, UserTicket } = require('../models')
const { isSuccessfulPayOSWebhook } = require('../utils/payOSWebhook')
const { isSupportedPromotion, isPromotionActive, getDiscountedPrice } = require('../utils/ticketPromotion')
const { validateCheckoutSnapshot } = require('../utils/checkout-snapshot')
const { sendTicketEmail } = require('../providers/zepToMailEmailProvicer')

const payos = new PayOS()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const PAYMENT_EXPIRY_SECONDS = 15 * 60
const ORDER_SAVE_MAX_ATTEMPTS = 3
const ORDER_SAVE_RETRY_DELAY_MS = 250
const MAX_TICKETS_PER_ACCOUNT = 5
const AUTOMATIC_PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
const canProcessAutomatically = order => Boolean(order.createdAt) &&
  Date.now() - new Date(order.createdAt).getTime() <= AUTOMATIC_PAYMENT_WINDOW_MS

const saveOrderWithRetry = async order => {
  let lastError
  for (let attempt = 1; attempt <= ORDER_SAVE_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await order.save()
    } catch (error) {
      lastError = error
      if (attempt < ORDER_SAVE_MAX_ATTEMPTS) await wait(ORDER_SAVE_RETRY_DELAY_MS * attempt)
    }
  }
  throw lastError
}

const reserveTicketStock = async items => {
  const reserved = []
  try {
    for (const item of items) {
      const ticketType = await TicketType.findOneAndUpdate(
        { _id: item.ticketTypeId, ticketTypeStatus: 'active', $expr: { $gte: ['$availableQuantity', item.quantity] } },
        { $inc: { availableQuantity: -item.quantity } },
        { new: true }
      )
      if (!ticketType) throw new Error('Some tickets are no longer available')
      reserved.push(item)
    }
    return reserved
  } catch (error) {
    await restoreTicketStock(reserved)
    throw error
  }
}

const restoreTicketStock = async (items, session = null) => {
  for (const item of items) {
    await TicketType.findByIdAndUpdate(
      item.ticketTypeId,
      { $inc: { availableQuantity: item.quantity } },
      session ? { session } : undefined
    )
  }
}

const cancelReservedOrder = async order => {
  const session = await mongoose.startSession()
  try {
    let cancelledOrder = null
    await session.withTransaction(async () => {
      cancelledOrder = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: 'Pending', stockReserved: true },
        { $set: { orderStatus: 'Cancelled', stockReserved: false, 'paymentData.status': 'CANCELLED' } },
        { new: true, session }
      )
      if (cancelledOrder) await restoreTicketStock(cancelledOrder.items, session)
    })
    return cancelledOrder?.toObject?.() || cancelledOrder
  } finally {
    await session.endSession()
  }
}

const createOrderCode = () => {
  const timestampPart = String(Date.now()).slice(-7)
  const randomPart = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return Number(`${timestampPart}${randomPart}`)
}

const getAccountTicketCount = async userId => {
  const [issuedCount, activeOrders] = await Promise.all([
    UserTicket.countDocuments({ userId, ticketStatus: { $ne: 'Cancelled' } }),
    Order.find({ userId, orderStatus: { $in: ['Pending', 'Processing'] }, stockReserved: true }).select('items').lean()
  ])
  const reservedCount = activeOrders.reduce(
    (total, order) => total + (order.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    0
  )
  return issuedCount + reservedCount
}

const markOrderAsPaid = async (order, paidAmount) => {
  if (order.orderStatus === 'Paid') return order
  const session = await mongoose.startSession()
  let shouldSendTicketEmail = false
  try {
    let processedOrder
    await session.withTransaction(async () => {
      const lockedOrder = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: { $in: ['Pending', 'Cancelled'] } },
        { $set: { orderStatus: 'Processing' } },
        { new: true, session }
      )
      if (!lockedOrder) {
        processedOrder = await Order.findById(order._id).session(session)
        return
      }
      processedOrder = lockedOrder
      shouldSendTicketEmail = true
      const needsStockReservation = !lockedOrder.stockReserved
      for (const item of processedOrder.items) {
        if (needsStockReservation) {
          const ticketType = await TicketType.findOneAndUpdate(
            { _id: item.ticketTypeId, ticketTypeStatus: 'active', $expr: { $gte: ['$availableQuantity', item.quantity] } },
            { $inc: { availableQuantity: -item.quantity } },
            { new: true, session }
          )
          if (!ticketType) throw new Error('Some tickets are no longer available for payment recovery')
        }
        await UserTicket.insertMany(Array.from({ length: item.quantity }, () => ({
          userId: order.userId,
          orderId: order._id,
          ticketTypeId: item.ticketTypeId,
          qrCodeData: `FPTUHalloween-2026-${crypto.randomUUID()}`,
          ticketStatus: 'Pending'
        })), { session })
      }
      processedOrder.orderStatus = 'Paid'
      processedOrder.stockReserved = false
      processedOrder.paymentData = {
        ...(processedOrder.paymentData || {}),
        status: 'PAID',
        amountPaid: Number(paidAmount)
      }
      await processedOrder.save({ session })
      const cart = await Cart.findOne({ userId: processedOrder.userId }).session(session)
      if (cart) {
        const purchasedQuantities = new Map(
          processedOrder.items.map(item => [String(item.ticketTypeId), Number(item.quantity || 0)])
        )
        cart.items = cart.items.reduce((remainingItems, cartItem) => {
          const purchasedQuantity = purchasedQuantities.get(String(cartItem.ticketTypeId)) || 0
          const remainingQuantity = Number(cartItem.quantity) - purchasedQuantity

          if (remainingQuantity > 0) {
            remainingItems.push({
              ticketTypeId: cartItem.ticketTypeId,
              quantity: remainingQuantity
            })
          }
          return remainingItems
        }, [])
        await cart.save({ session })
      }
    })
    if (shouldSendTicketEmail) {
      const tickets = await UserTicket.find({ orderId: processedOrder._id }).populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketTypeTime').lean()
      const orderPrices = new Map(processedOrder.items.map(item => [String(item.ticketTypeId), item.price]))
      if (processedOrder.buyerInfo?.email) {
        await sendTicketEmail({
          recipient: { email: processedOrder.buyerInfo.email, name: processedOrder.buyerInfo.fullName, phone: processedOrder.buyerInfo.phone },
          tickets: tickets.map(ticket => ({
            ticketTypeName: ticket.ticketTypeId?.ticketTypeName,
            ticketTypePrice: orderPrices.get(String(ticket.ticketTypeId?._id)) ?? ticket.ticketTypeId?.ticketTypePrice,
            qrCodeData: ticket.qrCodeData
          })),
          event: {
            name: 'FPTU Halloween 2026',
            date: tickets[0]?.ticketTypeId?.ticketTypeDate,
            time: tickets[0]?.ticketTypeId?.ticketTypeTime,
            location: 'Đại học FPT Hà Nội'
          }
        }).catch(error => {
          const responseData = error?.response?.data
          console.error('Ticket email delivery failed:', {
            message: error?.message || responseData?.message || responseData?.error || 'Unknown ZeptoMail error',
            status: error?.status || error?.response?.status,
            code: error?.code || responseData?.code
          })
        })
      }
    }
    return processedOrder
  } finally {
    await session.endSession()
  }
}

const confirmPaidOrder = async (order, paidAmount) => {
  if (order.orderStatus === 'Paid') return order
  if (!canProcessAutomatically(order)) return order
  if (!Number.isFinite(Number(paidAmount)) || Number(paidAmount) !== Number(order.totalAmount)) throw new Error('PayOS payment amount does not match order total')
  if (!['Pending', 'Cancelled'].includes(order.orderStatus)) return order
  const existingTickets = await UserTicket.countDocuments({ orderId: order._id })
  if (existingTickets > 0) throw new Error('Paid order already has tickets; manual reconciliation is required')
  return markOrderAsPaid(order, paidAmount)
}

const getPaidAmount = payment => Number(payment.amountPaid == null ? payment.amount : payment.amountPaid)

const createPayment = async (userId, checkoutData = {}) => {
  const promoCode = String(checkoutData.promoCode || '').trim().toUpperCase()
  if (promoCode && !isSupportedPromotion(promoCode)) throw new Error('Invalid promo code')

  if (checkoutData.existingOrderCode) {
    const existingOrder = await Order.findOne({ userId, payosOrderId: String(checkoutData.existingOrderCode) })
    if (existingOrder) {
      if (existingOrder.orderStatus === 'Paid') return { orderId: existingOrder._id, ...existingOrder.paymentData, status: 'PAID' }
      if (!canProcessAutomatically(existingOrder)) throw Object.assign(new Error('Old payment requires manual reconciliation'), { statusCode: 409 })
      const requestedItems = Array.isArray(checkoutData.selectedTicketTypeIds)
        ? checkoutData.selectedTicketTypeIds.map(String).sort()
        : null
      const existingItems = existingOrder.items
        .map(item => `${String(item.ticketTypeId)}:${Number(item.quantity)}`)
        .sort()
      const requestedQuantities = Array.isArray(checkoutData.selectedItems)
        ? checkoutData.selectedItems.map(item => `${String(item.ticketTypeId)}:${Number(item.quantity)}`).sort()
        : requestedItems
      const sameItems = (!requestedQuantities || JSON.stringify(requestedQuantities) === JSON.stringify(existingItems)) &&
        (existingOrder.promoCode || '') === promoCode
      if (!sameItems || Number(checkoutData.expectedAmount) !== Number(existingOrder.totalAmount)) {
        throw Object.assign(new Error('Existing payment does not match checkout; resolve it before creating another order'), { statusCode: 409 })
      }
      const existingPayment = await payos.paymentRequests.get(Number(existingOrder.payosOrderId))
      if (existingPayment.status === 'PAID') {
        const settled = await confirmPaidOrder(existingOrder, getPaidAmount(existingPayment))
        if (settled?.orderStatus !== 'Paid') throw Object.assign(new Error('Paid order requires manual reconciliation'), { statusCode: 409 })
      }
      if (existingOrder.orderStatus !== 'Pending' && existingPayment.status !== 'PAID') {
        throw Object.assign(new Error('This payment link is no longer available'), { statusCode: 409 })
      }
      if (existingOrder.paymentData && ['PENDING', 'PROCESSING', 'PAID'].includes(existingPayment.status)) {
        return {
          orderId: existingOrder._id,
          ...existingOrder.paymentData,
          status: existingPayment.status
        }
      }
    }
  }

  if (promoCode && !isPromotionActive(Date.now(), promoCode)) throw new Error('Promo code is not active')

  const cart = await Cart.findOne({ userId }).populate('items.ticketTypeId').lean()
  const selectedIds = Array.isArray(checkoutData.selectedItems)
    ? checkoutData.selectedItems.map(item => String(item.ticketTypeId))
    : []
  const cartItems = cart?.items?.filter(item => item.ticketTypeId && selectedIds.includes(String(item.ticketTypeId._id))) || []
  if (!cartItems.length) throw new Error('Cart is empty')

  const items = cartItems.map(item => {
    const originalPrice = Number(item.ticketTypeId.ticketTypePrice)
    const price = promoCode ? getDiscountedPrice(originalPrice, promoCode) : originalPrice
    return {
      ticketTypeId: item.ticketTypeId._id,
      quantity: Number(item.quantity),
      name: item.ticketTypeId.ticketTypeName,
      originalPrice,
      price,
      subtotal: price * Number(item.quantity)
    }
  })
  validateCheckoutSnapshot(checkoutData.selectedItems, items, checkoutData.expectedAmount)
  const requestedTicketCount = items.reduce((sum, item) => sum + item.quantity, 0)
  if (requestedTicketCount > MAX_TICKETS_PER_ACCOUNT) {
    throw new Error(`Each account can purchase up to ${MAX_TICKETS_PER_ACCOUNT} tickets`)
  }
  const accountTicketCount = await getAccountTicketCount(userId)
  if (accountTicketCount + requestedTicketCount > MAX_TICKETS_PER_ACCOUNT) {
    throw new Error(`Each account can purchase up to ${MAX_TICKETS_PER_ACCOUNT} tickets`)
  }
  const buyerInfo = {
    fullName: String(checkoutData.customer?.fullName || '').trim(),
    email: String(checkoutData.customer?.email || '').trim().toLowerCase(),
    phone: String(checkoutData.customer?.phone || '').trim()
  }
  if (!buyerInfo.fullName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyerInfo.email) || !/^0\d{9}$/.test(buyerInfo.phone)) {
    throw new Error('Valid buyer information is required')
  }
  const amount = items.reduce((sum, item) => sum + item.subtotal, 0)
  const orderCode = createOrderCode()
  const user = await User.findById(userId).select('fullName email phone').lean()
  if (!user) throw new Error('User not found')

  await reserveTicketStock(items)

  const reservationExpiresAt = new Date(Date.now() + PAYMENT_EXPIRY_SECONDS * 1000)
  let order

  try {
    order = await Order.create({ userId, buyerInfo, items, promoCode: promoCode || null, totalAmount: amount, paymentMethod: 'PayOS', paymentData: { reservationExpiresAt }, payosOrderId: String(orderCode), stockReserved: true, reservationExpiresAt })
    const paymentLink = await payos.paymentRequests.create({
      orderCode, amount, description: `FPTU Halloween ${orderCode}`.slice(0, 25),
      expiredAt: Math.floor(reservationExpiresAt.getTime() / 1000),
      returnUrl: `${FRONTEND_URL}/complete-payment?orderCode=${orderCode}`,
      cancelUrl: `${FRONTEND_URL}/qr-payment?cancelled=true`, buyerName: buyerInfo.fullName,
      buyerEmail: buyerInfo.email, buyerPhone: buyerInfo.phone,
      items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
    })
    order.paymentData = paymentLink
    order.reservationExpiresAt = reservationExpiresAt
    await saveOrderWithRetry(order)
    return { orderId: order._id, ...paymentLink }
  } catch (error) {
    if (order) {
      await cancelReservedOrder(order)
    } else {
      await restoreTicketStock(items)
    }
    if (error?.code === 11000) throw new Error('Payment order code already exists. Please try again')
    throw error
  }
}

const resumePayment = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) }).lean()
  if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 })
  if (order.orderStatus === 'Paid') return { orderId: order._id, ...order.paymentData, status: 'PAID' }
  if (!canProcessAutomatically(order)) throw Object.assign(new Error('Old payment requires manual reconciliation'), { statusCode: 409 })
  const payment = await payos.paymentRequests.get(Number(orderCode))
  if (payment.status === 'PAID') {
    const settled = await confirmPaidOrder(order, getPaidAmount(payment))
    if (settled?.orderStatus !== 'Paid') throw Object.assign(new Error('Paid order requires manual reconciliation'), { statusCode: 409 })
    return { orderId: order._id, ...order.paymentData, status: 'PAID' }
  }
  if (order.orderStatus !== 'Pending' || !['PENDING', 'PROCESSING'].includes(payment.status)) {
    throw Object.assign(new Error('This payment link is no longer available'), { statusCode: 409 })
  }
  if (order.reservationExpiresAt && new Date(order.reservationExpiresAt).getTime() <= Date.now()) {
    const settled = await reconcileExpiredOrder(order)
    if (settled?.orderStatus === 'Paid') return { orderId: order._id, ...order.paymentData, status: 'PAID' }
    throw Object.assign(new Error('This payment link has expired; check order status before paying again'), { statusCode: 409 })
  }
  if (!order.paymentData?.orderCode) throw Object.assign(new Error('Payment link is unavailable'), { statusCode: 409 })
  return { orderId: order._id, ...order.paymentData, status: payment.status }
}

const reconcileExpiredOrder = async candidate => {
  const order = await Order.findById(candidate._id).lean()
  if (!order || order.orderStatus === 'Paid' || !['Pending', 'Cancelled'].includes(order.orderStatus)) return order
  if (!canProcessAutomatically(order)) return order
  let payment = await payos.paymentRequests.get(Number(order.payosOrderId))
  if (payment.status === 'PAID') return confirmPaidOrder(order, getPaidAmount(payment))
  if (order.orderStatus === 'Pending' && ['EXPIRED', 'CANCELLED'].includes(payment.status)) return cancelReservedOrder(order)
  if (payment.status === 'PENDING') {
    try {
      payment = await payos.paymentRequests.cancel(Number(order.payosOrderId), 'Payment time expired')
    } catch {
      payment = await payos.paymentRequests.get(Number(order.payosOrderId))
    }
    if (payment.status === 'PAID') return confirmPaidOrder(order, getPaidAmount(payment))
    if (order.orderStatus === 'Pending' && ['EXPIRED', 'CANCELLED'].includes(payment.status)) return cancelReservedOrder(order)
  }
  return order
}

const getPaymentStatus = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) })
  if (!order) throw new Error('Order not found')
  if (order.orderStatus === 'Paid') return { orderId: order._id, orderCode: Number(orderCode), status: 'PAID' }
  if (!canProcessAutomatically(order)) return { orderId: order._id, orderCode: Number(orderCode), status: 'MANUAL_REVIEW' }
  const payment = await payos.paymentRequests.get(Number(orderCode))
  if (payment.status === 'PAID') {
    const settled = await confirmPaidOrder(order, getPaidAmount(payment))
    const status = settled?.orderStatus === 'Paid' ? 'PAID' : 'PROCESSING'
    return { orderId: order._id, orderCode: Number(orderCode), status }
  }
  if (['EXPIRED', 'CANCELLED'].includes(payment.status)) {
    await cancelReservedOrder(order)
  }
  return { orderId: order._id, orderCode: Number(orderCode), status: payment.status }
}

const cancelPayment = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) })
  if (!order) throw new Error('Order not found')
  if (order.orderStatus === 'Paid') throw new Error('Paid orders cannot be cancelled')
  if (!canProcessAutomatically(order)) throw Object.assign(new Error('Old payment requires manual reconciliation'), { statusCode: 409 })

  let payment
  try {
    payment = await payos.paymentRequests.cancel(Number(orderCode), 'Cancelled by customer')
  } catch (error) {
    const currentPayment = await payos.paymentRequests.get(Number(orderCode))
    if (!['EXPIRED', 'CANCELLED', 'PAID'].includes(currentPayment.status)) throw error
    payment = currentPayment
  }
  if (payment.status === 'PAID') {
    const settled = await confirmPaidOrder(order, getPaidAmount(payment))
    return { orderId: order._id, orderCode: Number(orderCode), status: settled?.orderStatus === 'Paid' ? 'PAID' : 'REVIEW' }
  }
  if (['EXPIRED', 'CANCELLED'].includes(payment.status)) await cancelReservedOrder(order)
  return { orderId: order._id, orderCode: Number(orderCode), status: payment.status }
}

const handleWebhook = async payload => {
  const webhook = await payos.webhooks.verify(payload)
  const orderCode = webhook.orderCode || webhook.data?.orderCode
  if (!orderCode) throw new Error('Webhook order code is missing')

  const order = await Order.findOne({ payosOrderId: String(orderCode) })
  if (!order) return { received: true, processed: false }
  if (order.orderStatus === 'Paid') return { received: true, processed: true, orderCode: Number(orderCode) }
  if (!canProcessAutomatically(order)) return { received: true, processed: false, orderCode: Number(orderCode) }
  // A valid signature only proves that the notification came from PayOS. It
  // does not prove that the payment succeeded.
  const isSuccessful = isSuccessfulPayOSWebhook(webhook)

  if (!isSuccessful) {
    const payment = await payos.paymentRequests.get(Number(orderCode))
    if (payment.status === 'PAID') {
      const settled = await confirmPaidOrder(order, getPaidAmount(payment))
      return { received: true, processed: settled?.orderStatus === 'Paid', orderCode: Number(orderCode) }
    }
    if (['EXPIRED', 'CANCELLED'].includes(payment.status)) await cancelReservedOrder(order)
    return { received: true, processed: false, orderCode: Number(orderCode) }
  }

  const payment = await payos.paymentRequests.get(Number(orderCode))
  if (payment.status !== 'PAID') return { received: true, processed: false, orderCode: Number(orderCode) }
  const settled = await confirmPaidOrder(order, getPaidAmount(payment))
  return { received: true, processed: settled?.orderStatus === 'Paid', orderCode: Number(orderCode) }
}

module.exports = { createPayment, resumePayment, reconcileExpiredOrder, getPaymentStatus, cancelPayment, handleWebhook }
