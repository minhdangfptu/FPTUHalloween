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
    qrCodeData: `FPTU-TICKET-${crypto.randomUUID()}`,
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

module.exports = { createTestTickets, getMyTickets }
