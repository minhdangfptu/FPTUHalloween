const mongoose = require('mongoose')
const { Order, User, UserTicket, TicketType } = require('../models')
const { getOrderPricing } = require('../utils/order-pricing')
const { normalizeSearch, searchPattern, idContains } = require('../utils/adminSearch')

const expirePendingOrders = async () => {
  const expiredAt = Math.floor(Date.now() / 1000)
  const legacyResult = await Order.updateMany(
    { orderStatus: 'Pending', stockReserved: { $ne: true } },
    { $set: { orderStatus: 'Cancelled' } }
  )
  const expiredOrderFilter = {
    orderStatus: 'Pending',
    stockReserved: true,
    $or: [{ 'paymentData.expiredAt': { $lte: expiredAt } }, { reservationExpiresAt: { $lte: new Date() } }]
  }
  const expiredOrderCandidates = await Order.find(expiredOrderFilter).select('_id').lean()
  const cancelledOrders = (await Promise.all(expiredOrderCandidates.map(order =>
    Order.findOneAndUpdate(
      { _id: order._id, ...expiredOrderFilter },
      { $set: { orderStatus: 'Cancelled', stockReserved: false } },
      { new: true }
    ).select('items').lean()
  ))).filter(Boolean)
  await Promise.all(cancelledOrders.flatMap(order => (order.items || []).map(item =>
    TicketType.findByIdAndUpdate(item.ticketTypeId, { $inc: { availableQuantity: Number(item.quantity) } })
  )))
  return (legacyResult.modifiedCount || 0) + cancelledOrders.length
}

const ensureId = id => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid order ID')
}

const countOrderItems = items => (Array.isArray(items) ? items : [])
  .reduce((total, item) => total + Number(item.quantity || 0), 0)

const getOrders = async ({ page = 1, pageSize = 20, status, search } = {}) => {
  await expirePendingOrders()
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const filter = status ? { orderStatus: status } : {}
  const query = normalizeSearch(search)
  if (query) {
    const pattern = searchPattern(query)
    const users = await User.find({ $or: [{ fullName: pattern }, { email: pattern }, { phone: pattern }] }).select('_id').lean()
    filter.$or = [
      { payosOrderId: pattern },
      { promoCode: pattern },
      { 'buyerInfo.fullName': pattern },
      { 'buyerInfo.email': pattern },
      { 'buyerInfo.phone': pattern },
      { userId: { $in: users.map(user => user._id) } },
      idContains(query)
    ]
  }
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('userId', 'fullName email phone').sort({ createdAt: -1 }).skip((currentPage - 1) * limit).limit(limit).lean(),
    Order.countDocuments(filter)
  ])
  const ordersWithItemCount = orders.map(({ items, ...order }) => ({
    ...order,
    itemCount: countOrderItems(items),
    ...getOrderPricing({ items, totalAmount: order.totalAmount })
  }))
  return { orders: ordersWithItemCount, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const getOrderById = async id => {
  ensureId(id)
  const order = await Order.findById(id).populate('userId', 'fullName email phone').lean()
  if (!order) throw new Error('Order not found')

  const tickets = await UserTicket.find({ orderId: id })
    .populate(
      'ticketTypeId',
      'ticketTypeName ticketTypePrice availableQuantity totalQuantity ticketTypeDate ticketTypeTime ticketTypeStatus ticketType3dModel'
    )
    .sort({ createdAt: 1 })
    .lean()

  return { ...order, ...getOrderPricing(order), tickets }
}

const getMyOrders = async userId => {
  await expirePendingOrders()
  const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean()
  return orders.map(order => {
    const { paymentData, ...safeOrder } = order
    return {
      ...safeOrder,
      paymentExpiresAt: paymentData?.expiredAt || null,
      itemCount: countOrderItems(order.items)
    }
  })
}

const getMyOrderById = async (userId, id) => {
  ensureId(id)
  const order = await Order.findOne({ _id: id, userId }).lean()
  if (!order) throw new Error('Order not found')
  const tickets = await UserTicket.find({ orderId: id }).populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketTypeTime').sort({ createdAt: 1 }).lean()
  return { ...order, tickets }
}

const getTicketSalesStatistics = async ({ groupBy = 'type' } = {}) => {
  if (!['type', 'date', 'hour'].includes(groupBy)) throw new Error('groupBy must be type, date or hour')
  const tickets = await UserTicket.find({}).populate('ticketTypeId', 'ticketTypeName ticketTypeDate').populate('orderId', 'orderStatus').lean()
  const paidTickets = tickets.filter(ticket => ticket.orderId?.orderStatus === 'Paid')
  const grouped = new Map()
  paidTickets.forEach(ticket => {
    const date = new Date(ticket.createdAt)
    const key = groupBy === 'type'
      ? String(ticket.ticketTypeId?._id || 'unknown')
      : groupBy === 'date'
        ? date.toISOString().slice(0, 10)
        : `${String(date.getHours()).padStart(2, '0')}:00`
    const current = grouped.get(key) || { key, label: groupBy === 'type' ? ticket.ticketTypeId?.ticketTypeName || 'Unknown ticket type' : key, sold: 0 }
    current.sold += 1
    grouped.set(key, current)
  })
  return { groupBy, totalSold: paidTickets.length, statistics: [...grouped.values()].sort((a, b) => a.key.localeCompare(b.key)) }
}

module.exports = { expirePendingOrders, getOrders, getOrderById, getMyOrders, getMyOrderById, getTicketSalesStatistics }
