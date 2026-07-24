const crypto = require('crypto')
const mongoose = require('mongoose')
const { PayOS } = require('@payos/node')
const { Cart, Order, TicketType, User, UserTicket } = require('../models')

const payos = new PayOS()
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const PAYMENT_EXPIRY_SECONDS = 15 * 60

const createOrderCode = () => Number(`${Date.now()}`.slice(-9))

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
        const updatedTicketType = await TicketType.findOneAndUpdate(
          {
            _id: item.ticketTypeId,
            $expr: {
              $gte: [{ $convert: { input: '$availableQuantity', to: 'int', onError: -1, onNull: -1 } }, item.quantity]
            }
          },
          [{
            $set: {
              availableQuantity: {
                $subtract: [{ $convert: { input: '$availableQuantity', to: 'int', onError: 0, onNull: 0 } }, item.quantity]
              }
            }
          }],
          { new: true, session }
        )
        if (!updatedTicketType) throw new Error('Some tickets are no longer available')

        await UserTicket.insertMany(Array.from({ length: item.quantity }, () => ({
          userId: order.userId,
          orderId: order._id,
          ticketTypeId: item.ticketTypeId,
          qrCodeData: `FPTUHalloween-2026-${crypto.randomUUID()}`,
          ticketStatus: 'Pending'
        })), { session })
      }
      processedOrder.orderStatus = 'Paid'
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
      const requestedIds = Array.isArray(checkoutData.selectedTicketTypeIds)
        ? checkoutData.selectedTicketTypeIds.map(String).sort()
        : null
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

  const paymentLink = await payos.paymentRequests.create({
    orderCode,
    amount,
    description: `FPTU Halloween ${orderCode}`.slice(0, 25),
    expiredAt: Math.floor(Date.now() / 1000) + PAYMENT_EXPIRY_SECONDS,
    returnUrl: `${FRONTEND_URL}/complete-payment?orderCode=${orderCode}`,
    cancelUrl: `${FRONTEND_URL}/qr-payment?cancelled=true`,
    buyerName: user.fullName,
    buyerEmail: user.email,
    buyerPhone: user.phone,
    items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
  })

  const order = await Order.create({
    userId,
    items,
    totalAmount: amount,
    paymentMethod: 'PayOS',
    paymentData: paymentLink,
    payosOrderId: String(orderCode)
  })

  return { orderId: order._id, ...paymentLink }
}

const getPaymentStatus = async (userId, orderCode) => {
  const order = await Order.findOne({ userId, payosOrderId: String(orderCode) })
  if (!order) throw new Error('Order not found')
  const payment = await payos.paymentRequests.get(Number(orderCode))
  if (payment.status === 'PAID') await markOrderAsPaid(order)
  if (['EXPIRED', 'CANCELLED'].includes(payment.status) && order.orderStatus === 'Pending') {
    order.orderStatus = 'Cancelled'
    await order.save()
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
  order.orderStatus = 'Cancelled'
  await order.save()
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
