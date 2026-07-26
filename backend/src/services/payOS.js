const crypto = require('crypto')
const mongoose = require('mongoose')
const { PayOS } = require('@payos/node')
const { Cart, Order, TicketType, User, UserTicket } = require('../models')

const payos = new PayOS()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const PAYMENT_EXPIRY_SECONDS = 15 * 60
const ORDER_SAVE_MAX_ATTEMPTS = 3
const ORDER_SAVE_RETRY_DELAY_MS = 250

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

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

const restoreTicketStock = async items => {
  await Promise.all(items.map(item => TicketType.findByIdAndUpdate(item.ticketTypeId, { $inc: { availableQuantity: item.quantity } })))
}

const cancelReservedOrder = async order => {
  const cancelledOrder = await Order.findOneAndUpdate(
    { _id: order._id, orderStatus: 'Pending', stockReserved: true },
    { $set: { orderStatus: 'Cancelled', stockReserved: false } },
    { new: true }
  ).lean()
  if (cancelledOrder) await restoreTicketStock(cancelledOrder.items)
}

const createOrderCode = () => {
  const timestampPart = String(Date.now()).slice(-7)
  const randomPart = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return Number(`${timestampPart}${randomPart}`)
}

const markOrderAsPaid = async order => {
  if (order.orderStatus === 'Paid') return order
  const session = await mongoose.startSession()
  try {
    let processedOrder
    await session.withTransaction(async () => {
      const lockedOrder = await Order.findOneAndUpdate(
        { _id: order._id, orderStatus: 'Pending' },
        { $set: { orderStatus: 'Processing' } },
        { new: true, session }
      )
      if (!lockedOrder) {
        processedOrder = await Order.findById(order._id).session(session)
        return
      }
      processedOrder = lockedOrder
      for (const item of processedOrder.items) {
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
      await processedOrder.save({ session })
      await Cart.findOneAndUpdate({ userId: processedOrder.userId }, { $set: { items: [] } }, { session })
    })
    return processedOrder
  } finally {
    await session.endSession()
  }
}

const createPayment = async (userId, checkoutData = {}) => {
  if (checkoutData.existingOrderCode) {
    const existingOrder = await Order.findOne({ userId, payosOrderId: String(checkoutData.existingOrderCode) })
    if (existingOrder) {
      const requestedItems = Array.isArray(checkoutData.selectedTicketTypeIds)
        ? checkoutData.selectedTicketTypeIds.map(String).sort()
        : null
      const existingItems = existingOrder.items
        .map(item => `${String(item.ticketTypeId)}:${Number(item.quantity)}`)
        .sort()
      const requestedQuantities = Array.isArray(checkoutData.selectedItems)
        ? checkoutData.selectedItems.map(item => `${String(item.ticketTypeId)}:${Number(item.quantity)}`).sort()
        : requestedItems
      const sameItems = !requestedQuantities || JSON.stringify(requestedQuantities) === JSON.stringify(existingItems)
      const existingPayment = await payos.paymentRequests.get(Number(existingOrder.payosOrderId))
      if (sameItems && existingPayment.status === 'PAID') await markOrderAsPaid(existingOrder)
      if (sameItems && existingOrder.paymentData && ['PENDING', 'PROCESSING', 'PAID'].includes(existingPayment.status)) {
        return {
          orderId: existingOrder._id,
          ...existingOrder.paymentData,
          status: existingPayment.status
        }
      }
    }
  }

  const cart = await Cart.findOne({ userId }).populate('items.ticketTypeId').lean()
  const selectedIds = Array.isArray(checkoutData.selectedTicketTypeIds)
    ? checkoutData.selectedTicketTypeIds.map(String)
    : null
  const cartItems = cart?.items?.filter(item => !selectedIds || selectedIds.includes(String(item.ticketTypeId._id))) || []
  if (!cartItems.length) throw new Error('Cart is empty')

  const items = cartItems.map(item => ({
    ticketTypeId: item.ticketTypeId._id,
    quantity: Number(item.quantity),
    name: item.ticketTypeId.ticketTypeName,
    price: Number(item.ticketTypeId.ticketTypePrice),
    subtotal: Number(item.ticketTypeId.ticketTypePrice) * Number(item.quantity)
  }))
  const amount = items.reduce((sum, item) => sum + item.subtotal, 0)
  const orderCode = createOrderCode()
  const user = await User.findById(userId).select('fullName email phone').lean()
  if (!user) throw new Error('User not found')

  await reserveTicketStock(items)

  const reservationExpiresAt = new Date(Date.now() + PAYMENT_EXPIRY_SECONDS * 1000)
  let order

  try {
    order = await Order.create({ userId, items, totalAmount: amount, paymentMethod: 'PayOS', paymentData: { reservationExpiresAt }, payosOrderId: String(orderCode), stockReserved: true, reservationExpiresAt })
    const paymentLink = await payos.paymentRequests.create({
      orderCode, amount, description: `FPTU Halloween ${orderCode}`.slice(0, 25),
      expiredAt: Math.floor(reservationExpiresAt.getTime() / 1000),
      returnUrl: `${FRONTEND_URL}/complete-payment?orderCode=${orderCode}`,
      cancelUrl: `${FRONTEND_URL}/qr-payment?cancelled=true`, buyerName: user.fullName,
      buyerEmail: user.email, buyerPhone: user.phone,
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

const getPaymentStatus = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) })
  if (!order) throw new Error('Order not found')
  const payment = await payos.paymentRequests.get(Number(orderCode))
  if (payment.status === 'PAID') await markOrderAsPaid(order)
  if (['EXPIRED', 'CANCELLED'].includes(payment.status)) {
    const cancelledOrder = await Order.findOneAndUpdate({ _id: order._id, orderStatus: 'Pending', stockReserved: true }, { $set: { orderStatus: 'Cancelled', stockReserved: false } }, { new: true })
    if (cancelledOrder) await restoreTicketStock(cancelledOrder.items)
  }
  return { orderId: order._id, orderCode: Number(orderCode), status: payment.status }
}

const cancelPayment = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) })
  if (!order) throw new Error('Order not found')
  if (order.orderStatus === 'Paid') throw new Error('Paid orders cannot be cancelled')

  let payment
  try {
    payment = await payos.paymentRequests.cancel(Number(orderCode), 'Cancelled by customer')
  } catch (error) {
    const currentPayment = await payos.paymentRequests.get(Number(orderCode))
    if (!['EXPIRED', 'CANCELLED'].includes(currentPayment.status)) throw error
    payment = currentPayment
  }
  const cancelledOrder = await Order.findOneAndUpdate({ _id: order._id, orderStatus: 'Pending', stockReserved: true }, { $set: { orderStatus: 'Cancelled', stockReserved: false } }, { new: true })
  if (cancelledOrder) await restoreTicketStock(cancelledOrder.items)
  return { orderId: order._id, orderCode: Number(orderCode), status: payment.status }
}

const handleWebhook = async payload => {
  const webhook = await payos.webhooks.verify(payload)
  const orderCode = webhook.orderCode || webhook.data?.orderCode
  if (!orderCode) throw new Error('Webhook order code is missing')

  const order = await Order.findOne({ payosOrderId: String(orderCode) })
  if (!order) return { received: true, processed: false }
  if (order.orderStatus !== 'Paid') await markOrderAsPaid(order)

  return { received: true, processed: true, orderCode: Number(orderCode) }
}

module.exports = { createPayment, getPaymentStatus, cancelPayment, handleWebhook }
