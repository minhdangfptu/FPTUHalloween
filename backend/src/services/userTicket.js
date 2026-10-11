const mongoose = require('mongoose')
const crypto = require('crypto')
const { TicketType, UserTicket, Order } = require('../models')
const QR_PREFIX = 'FPTUHalloween-2026-'

const attachBuyerInfo = async ticket => {
  if (ticket.buyerName && ticket.buyerEmail && ticket.buyerPhone) return ticket
  const orderId = ticket.orderId?._id || ticket.orderId
  const order = await Order.findById(orderId).select('buyerInfo').lean()
  const buyerInfo = order?.buyerInfo || ticket.orderId?.buyerInfo || {}
  ticket.buyerName = ticket.buyerName || buyerInfo.fullName
  ticket.buyerEmail = buyerInfo.email
  ticket.buyerPhone = buyerInfo.phone
  return ticket
}

const createManualTicket = async ({ buyerName, buyerEmail, buyerPhone, ticketTypeId, adminUserId }) => {
  const normalizedName = String(buyerName || '').trim()
  const normalizedEmail = String(buyerEmail || '').trim().toLowerCase()
  const normalizedPhone = String(buyerPhone || '').trim()
  if (!normalizedName) throw Object.assign(new Error('Buyer name is required'), { statusCode: 400 })
  if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) throw Object.assign(new Error('Buyer email is invalid'), { statusCode: 400 })
  if (!normalizedPhone) throw Object.assign(new Error('Buyer phone is required'), { statusCode: 400 })
  if (!mongoose.isValidObjectId(ticketTypeId)) throw Object.assign(new Error('Invalid ticket type ID'), { statusCode: 400 })

  const ticketType = await TicketType.findOneAndUpdate(
    { _id: ticketTypeId, ticketTypeStatus: 'active', availableQuantity: { $gt: 0 } },
    { $inc: { availableQuantity: -1 } },
    { new: true }
  ).lean()
  if (!ticketType) throw Object.assign(new Error('Ticket type is not available'), { statusCode: 409 })

  const payosOrderId = `MANUAL-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`
  const order = await Order.create({
    userId: adminUserId,
    buyerInfo: { fullName: normalizedName, email: normalizedEmail, phone: normalizedPhone },
    items: [{ ticketTypeId, quantity: 1, unitPrice: ticketType.ticketTypePrice, ticketTypeName: ticketType.ticketTypeName }],
    totalAmount: Number(ticketType.ticketTypePrice || 0),
    paymentMethod: 'Manual',
    paymentData: { createdBy: adminUserId, reason: 'Payment failure recovery' },
    stockReserved: false,
    payosOrderId,
    orderStatus: 'Paid'
  })

  const ticket = await UserTicket.create({
    userId: adminUserId,
    buyerName: normalizedName,
    orderId: order._id,
    ticketTypeId,
    qrCodeData: `${QR_PREFIX}${crypto.randomUUID()}`
  })
  return UserTicket.findById(ticket._id)
    .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketEventDate ticketTypeTime')
    .populate('orderId', 'orderStatus paymentMethod buyerInfo')
    .lean()
}

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
    .populate('orderId', 'orderStatus paymentMethod totalAmount payosOrderId buyerInfo')
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
  const matches = Number(ticket.ticketTypeId?.ticketTypeDate) === Number(staffDate)
  if (!matches) throw Object.assign(new Error('Ticket is not available for the current staff date'), { statusCode: 403 })
}

const getTicketById = async (id, staffDate = null) => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid ticket ID')

  const ticket = await UserTicket.findById(id)
    .populate('userId', 'fullName email phone')
    .populate('ticketTypeId', 'ticketTypeName ticketTypePrice ticketTypeDate ticketEventDate ticketTypeTime')
    .populate('orderId', 'orderStatus paymentMethod totalAmount payosOrderId items buyerInfo')
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
    .populate('orderId', 'buyerInfo paymentMethod orderStatus')
    .lean()
  if (!ticket) throw Object.assign(new Error('Ticket not found'), { statusCode: 404 })
  await attachBuyerInfo(ticket)
  ensureTicketDateForStaff(ticket, staffDate)
  return ticket
}

const checkInByQrCode = async (qrCodeData, staffId) => {
  const ticket = await getTicketByQrCode(qrCodeData)
  const vietnamDay = Number(new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    day: 'numeric'
  }).format(new Date()))
  const sameEventDate = Number(ticket.ticketTypeId?.ticketTypeDate) === vietnamDay

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
  ).populate('userId', 'fullName email phone').populate('ticketTypeId', 'ticketTypeName ticketTypeDate ticketEventDate ticketTypeTime').populate('orderId', 'buyerInfo paymentMethod orderStatus').lean()

  if (!checkedTicket) throw Object.assign(new Error('Ticket has already been checked in'), { statusCode: 409 })
  await attachBuyerInfo(checkedTicket)
  return checkedTicket
}

module.exports = { getMyTickets, getTickets, getTicketById, getTicketByQrCode, checkInByQrCode, createManualTicket }
