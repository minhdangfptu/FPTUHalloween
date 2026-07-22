const mongoose = require('mongoose')
const { Order, UserTicket } = require('../models')

const ensureId = id => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid order ID')
}

const getOrders = async ({ page = 1, pageSize = 20, status } = {}) => {
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const filter = status ? { orderStatus: status } : {}
  const [orders, total] = await Promise.all([
    Order.find(filter).select('-items').populate('userId', 'fullName email phone').sort({ createdAt: -1 }).skip((currentPage - 1) * limit).limit(limit).lean(),
    Order.countDocuments(filter)
  ])
  return { orders, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const getOrderById = async id => {
  ensureId(id)
  const order = await Order.findById(id).populate('userId', 'fullName email phone').lean()
  if (!order) throw new Error('Order not found')
  const tickets = await UserTicket.find({ orderId: id }).populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate').lean()
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

module.exports = { getOrders, getOrderById, getTicketSalesStatistics }
