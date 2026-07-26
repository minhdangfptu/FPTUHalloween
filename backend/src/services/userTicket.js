const mongoose = require('mongoose')
const { TicketType, UserTicket } = require('../models')
const QR_PREFIX = 'FPTUHalloween-2026-'

const getMyTickets = async userId => UserTicket.find({ userId })
  .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketEventDate ticketTypeTime')
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
    const ticketTypes = await TicketType.find({ $or: [{ ticketTypeDate: ticketDate }, { $expr: { $eq: [{ $dayOfMonth: '$ticketEventDate' }, ticketDate] } }] }).select('_id').lean()
    filter.ticketTypeId = { $in: ticketTypes.map(ticketType => ticketType._id) }
  }

  const [tickets, total, checkedIn] = await Promise.all([
    UserTicket.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketEventDate ticketTypeTime')
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

const ensureTicketDateForStaff = (ticket, staffDate) => {
  if (!staffDate) return
  const eventDate = ticket.ticketTypeId?.ticketEventDate ? new Date(ticket.ticketTypeId.ticketEventDate) : null
  const matches = eventDate ? eventDate.getDate() === Number(staffDate) : Number(ticket.ticketTypeId?.ticketTypeDate) === Number(staffDate)
  if (!matches) throw Object.assign(new Error('Ticket is not available for the current staff date'), { statusCode: 403 })
}

const getTicketById = async (id, staffDate = null) => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid ticket ID')

  const ticket = await UserTicket.findById(id)
    .populate('userId', 'fullName email phone')
    .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketEventDate ticketTypeTime')
    .populate('orderId', 'orderStatus paymentMethod totalAmount payosOrderId items')
    .populate('staffCheckInId', 'fullName email')
    .lean()

  if (!ticket) throw new Error('Ticket not found')
  ensureTicketDateForStaff(ticket, staffDate)
  return ticket
}

const getTicketByQrCode = async (qrCodeData, staffDate = null) => {
  const normalizedQrCode = String(qrCodeData || '').trim()
  if (!normalizedQrCode.startsWith(QR_PREFIX)) {
    throw Object.assign(new Error('Invalid ticket QR code'), { statusCode: 400 })
  }
  const ticket = await UserTicket.findOne({ qrCodeData: normalizedQrCode })
    .populate('userId', 'fullName email phone')
    .populate('ticketTypeId', 'ticketTypeName ticketTypeDate ticketEventDate ticketTypeTime')
    .lean()
  if (!ticket) throw Object.assign(new Error('Ticket not found'), { statusCode: 404 })
  ensureTicketDateForStaff(ticket, staffDate)
  return ticket
}

const checkInByQrCode = async (qrCodeData, staffId) => {
  const ticket = await getTicketByQrCode(qrCodeData)
  const now = new Date()
  const eventDate = ticket.ticketTypeId?.ticketEventDate ? new Date(ticket.ticketTypeId.ticketEventDate) : null
  const sameEventDate = eventDate
    ? eventDate.getFullYear() === now.getFullYear() && eventDate.getMonth() === now.getMonth() && eventDate.getDate() === now.getDate()
    : Number(ticket.ticketTypeId?.ticketTypeDate) === now.getDate()

  if (ticket.ticketStatus !== 'Pending') {
    throw Object.assign(new Error('Ticket has already been checked in'), { statusCode: 409 })
  }
  if (!sameEventDate) {
    throw Object.assign(new Error('Ticket can only be checked in on its ticket date'), { statusCode: 400 })
  }

  const checkedTicket = await UserTicket.findOneAndUpdate(
    { _id: ticket._id, ticketStatus: 'Pending' },
    { $set: { ticketStatus: 'Checked', checkedInAt: new Date(), staffCheckInId: staffId } },
    { new: true }
  ).populate('userId', 'fullName email phone').populate('ticketTypeId', 'ticketTypeName ticketTypeDate ticketEventDate ticketTypeTime').lean()

  if (!checkedTicket) throw Object.assign(new Error('Ticket has already been checked in'), { statusCode: 409 })
  return checkedTicket
}

module.exports = { getMyTickets, getTickets, getTicketById, getTicketByQrCode, checkInByQrCode }
