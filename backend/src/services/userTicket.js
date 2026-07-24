const crypto = require('crypto')
const mongoose = require('mongoose')
const { TicketType, UserTicket, Order } = require('../models')

const createTestTickets = async (userId, ticketTypeId, quantity = 1) => {
  if (!mongoose.isValidObjectId(ticketTypeId)) throw new Error('Invalid ticket type ID')

  const normalizedQuantity = Number(quantity)
  if (!Number.isInteger(normalizedQuantity) || normalizedQuantity < 1 || normalizedQuantity > 10) {
    throw new Error('Quantity must be an integer between 1 and 10')
  }

  const ticketType = await TicketType.findById(ticketTypeId).lean()
  if (!ticketType) throw new Error('Ticket type not found')

  const testOrder = await Order.create({
    userId,
    items: [{ ticketTypeId, quantity: normalizedQuantity, name: ticketType.ticketTypeName, price: Number(ticketType.ticketTypePrice || 0) }],
    totalAmount: Number(ticketType.ticketTypePrice || 0) * normalizedQuantity,
    paymentMethod: 'Test',
    payosOrderId: `TEST-${Date.now()}-${crypto.randomUUID()}`,
    orderStatus: 'Paid'
  })

  const tickets = Array.from({ length: normalizedQuantity }, () => ({
    userId,
    orderId: testOrder._id,
    ticketTypeId,
    qrCodeData: `FPTUHalloween-2026-${crypto.randomUUID()}`,
    ticketStatus: 'Pending'
  }))

  const createdTickets = await UserTicket.insertMany(tickets)
  return {
    message: 'Test tickets created successfully',
    orderId: testOrder._id,
    tickets: createdTickets.map(ticket => ({
      id: ticket._id,
      userId: ticket.userId,
      ticketTypeId: ticket.ticketTypeId,
      qrCodeData: ticket.qrCodeData,
      ticketStatus: ticket.ticketStatus,
      createdAt: ticket.createdAt
    }))
  }
}

const getMyTickets = async userId => UserTicket.find({ userId })
  .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketTypeTime')
  .sort({ createdAt: -1 })
  .lean()

const getTickets = async ({ page = 1, pageSize = 20, status, userId, ticketTypeId, date } = {}) => {
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const filter = {}

  if (status) filter.ticketStatus = status
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) throw new Error('Invalid user ID')
    filter.userId = userId
  }
  if (ticketTypeId) {
    if (!mongoose.isValidObjectId(ticketTypeId)) throw new Error('Invalid ticket type ID')
    filter.ticketTypeId = ticketTypeId
  }
  if (date) {
    const ticketDate = Number.parseInt(date, 10)
    if (!Number.isInteger(ticketDate) || ticketDate < 1 || ticketDate > 31) throw new Error('Invalid ticket date')
    const ticketTypes = await TicketType.find({ ticketTypeDate: ticketDate }).select('_id').lean()
    filter.ticketTypeId = { $in: ticketTypes.map(ticketType => ticketType._id) }
  }

  const [tickets, total, checkedIn] = await Promise.all([
    UserTicket.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketTypeTime')
      .populate('orderId', 'orderStatus paymentMethod totalAmount payosOrderId')
      .populate('staffCheckInId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean(),
    UserTicket.countDocuments(filter)
    , UserTicket.countDocuments({ ...filter, ticketStatus: 'Checked' })
  ])

  return {
    tickets,
    pagination: {
      page: currentPage,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    summary: {
      sold: total,
      checkedIn,
      remaining: Math.max(total - checkedIn, 0)
    }
  }
}

const getTicketById = async id => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid ticket ID')

  const ticket = await UserTicket.findById(id)
    .populate('userId', 'fullName email phone')
    .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketTypeTime')
    .populate('orderId', 'orderStatus paymentMethod totalAmount payosOrderId items')
    .populate('staffCheckInId', 'fullName email')
    .lean()

  if (!ticket) throw new Error('Ticket not found')
  return ticket
}

const getTicketByQrCode = async qrCodeData => {
  const ticket = await UserTicket.findOne({ qrCodeData: String(qrCodeData || '').trim() })
    .populate('userId', 'fullName email phone')
    .populate('ticketTypeId', 'ticketTypeName ticketTypeDate ticketTypeTime')
    .lean()
  if (!ticket) throw Object.assign(new Error('Ticket not found'), { statusCode: 404 })
  return ticket
}

const checkInByQrCode = async (qrCodeData, staffId) => {
  const ticket = await getTicketByQrCode(qrCodeData)
  const today = new Date().getDate()
  const ticketDate = Number(ticket.ticketTypeId?.ticketTypeDate)

  if (ticket.ticketStatus !== 'Pending') {
    throw Object.assign(new Error('Ticket has already been checked in'), { statusCode: 409 })
  }
  if (ticketDate !== today) {
    throw Object.assign(new Error('Ticket can only be checked in on its ticket date'), { statusCode: 400 })
  }

  const checkedTicket = await UserTicket.findOneAndUpdate(
    { _id: ticket._id, ticketStatus: 'Pending' },
    { $set: { ticketStatus: 'Checked', checkedInAt: new Date(), staffCheckInId: staffId } },
    { new: true }
  ).populate('userId', 'fullName email phone').populate('ticketTypeId', 'ticketTypeName ticketTypeDate ticketTypeTime').lean()

  if (!checkedTicket) throw Object.assign(new Error('Ticket has already been checked in'), { statusCode: 409 })
  return checkedTicket
}

module.exports = { createTestTickets, getMyTickets, getTickets, getTicketById, getTicketByQrCode, checkInByQrCode }
