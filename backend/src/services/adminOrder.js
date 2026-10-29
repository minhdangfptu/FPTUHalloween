const mongoose = require('mongoose')
const { Order, User, UserTicket } = require('../models')
const { reconcileExpiredOrder } = require('./payOS')
const { getOrderPricing } = require('../utils/order-pricing')
const { normalizeSearch, searchPattern, idContains } = require('../utils/adminSearch')
const AUTOMATIC_RECONCILIATION_WINDOW_MS = 24 * 60 * 60 * 1000
const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000

const getVietnamTodayRange = () => {
  const vietnamNow = new Date(Date.now() + VIETNAM_OFFSET_MS)
  const startOfDay = new Date(Date.UTC(vietnamNow.getUTCFullYear(), vietnamNow.getUTCMonth(), vietnamNow.getUTCDate()) - VIETNAM_OFFSET_MS)
  return { startOfDay, endOfDay: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000) }
}

const expirePendingOrders = async userId => {
  const reconciliationSince = new Date(Date.now() - AUTOMATIC_RECONCILIATION_WINDOW_MS)
  const expiredAt = Math.floor(Date.now() / 1000)
  const scope = userId ? { userId } : {}
  const expiredOrderFilter = {
    ...scope,
    orderStatus: 'Pending',
    createdAt: { $gte: reconciliationSince },
    $or: [{ 'paymentData.expiredAt': { $lte: expiredAt } }, { reservationExpiresAt: { $lte: new Date() } }]
  }
  const cancelledOrderFilter = {
    ...scope,
    orderStatus: 'Cancelled',
    createdAt: { $gte: reconciliationSince }
  }
  const [expiredOrderCandidates, cancelledOrderCandidates] = await Promise.all([
    Order.find(expiredOrderFilter).select('_id').sort({ reservationExpiresAt: 1 }).limit(10).lean(),
    Order.find(cancelledOrderFilter).select('_id').sort({ updatedAt: -1 }).limit(10).lean()
  ])
  const candidateOrders = [...expiredOrderCandidates, ...cancelledOrderCandidates]
  const candidateIds = [...new Set(candidateOrders.map(order => String(order._id)))]
  const issuedTickets = await UserTicket.find({ orderId: { $in: candidateIds } }).select('orderId').lean()
  const ordersWithTickets = new Set(issuedTickets.map(ticket => String(ticket.orderId)))
  const candidatesWithoutTickets = candidateOrders.filter(order => !ordersWithTickets.has(String(order._id)))
  const results = await Promise.allSettled(candidatesWithoutTickets.map(reconcileExpiredOrder))
  for (const result of results) {
    if (result.status === 'rejected') console.error('Could not reconcile expired PayOS order:', result.reason)
  }
  return results.filter(result => result.status === 'fulfilled' && result.value?.orderStatus === 'Cancelled').length
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
  await expirePendingOrders(userId)
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

const getDashboardStatistics = async () => {
  const { startOfDay, endOfDay } = getVietnamTodayRange()
  const [orderSummary, userTotal, ticketSummary, checkedInToday, ticketDistribution] = await Promise.all([
    Order.aggregate([
      {
        $group: {
          _id: null,
          paidOrders: {
            $sum: { $cond: [{ $eq: ['$orderStatus', 'Paid'] }, 1, 0] }
          },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$orderStatus', 'Paid'] },
                { $ifNull: ['$totalAmount', 0] },
                0
              ]
            }
          }
        }
      }
    ]),
    User.countDocuments({}),
    UserTicket.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          checkedIn: {
            $sum: { $cond: [{ $eq: ['$ticketStatus', 'Checked'] }, 1, 0] }
          }
        }
      }
    ]),
    UserTicket.countDocuments({
      ticketStatus: 'Checked',
      checkedInAt: { $gte: startOfDay, $lt: endOfDay }
    }),
    UserTicket.aggregate([
      {
        $lookup: {
          from: 'TicketTypes',
          localField: 'ticketTypeId',
          foreignField: '_id',
          as: 'ticketType'
        }
      },
      { $unwind: '$ticketType' },
      {
        $group: {
          _id: {
            date: '$ticketType.ticketTypeDate',
            time: '$ticketType.ticketTypeTime'
          },
          count: { $sum: 1 },
          checkedIn: {
            $sum: { $cond: [{ $eq: ['$ticketStatus', 'Checked'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.date': 1, '_id.time': 1 } }
    ])
  ])

  const orders = orderSummary[0] || { paidOrders: 0, revenue: 0 }
  const tickets = ticketSummary[0] || { total: 0, checkedIn: 0 }

  return {
    revenue: orders.revenue,
    paidOrders: orders.paidOrders,
    ticketTotal: tickets.total,
    checkedTicketTotal: tickets.checkedIn,
    checkedInToday,
    userTotal,
    ticketDistribution: ticketDistribution.map(({ _id, count, checkedIn }) => ({
      date: _id.date,
      time: _id.time,
      count,
      checkedIn
    }))
  }
}

module.exports = { expirePendingOrders, getOrders, getOrderById, getMyOrders, getMyOrderById, getTicketSalesStatistics, getDashboardStatistics }
