const mongoose = require('mongoose')
const { TicketType } = require('../models')

const FIELDS = ['ticketTypeName', 'ticketTypePrice', 'availableQuantity', 'totalQuantity', 'ticketTypeDate', 'ticketTypeTime', 'ticketType3dModel']

const ensureId = id => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid ticket type ID')
}

const normalizePayload = payload => {
  const data = {}
  FIELDS.forEach(field => { if (payload[field] !== undefined) data[field] = payload[field] })
  if (data.ticketTypeName !== undefined) data.ticketTypeName = String(data.ticketTypeName).trim()
  if (data.availableQuantity !== undefined) data.availableQuantity = String(data.availableQuantity).trim()
  if (data.ticketTypeTime !== undefined) data.ticketTypeTime = String(data.ticketTypeTime).trim()
  return data
}

const validatePayload = data => {
  const required = ['ticketTypeName', 'ticketTypePrice', 'availableQuantity', 'totalQuantity', 'ticketTypeDate', 'ticketTypeTime', 'ticketType3dModel']
  const missing = required.filter(field => data[field] === undefined || data[field] === null || data[field] === '')
  if (missing.length) throw new Error(`${missing.join(', ')} are required`)
  if (!Number.isFinite(Number(data.ticketTypePrice)) || Number(data.ticketTypePrice) < 0) throw new Error('Ticket price must be a non-negative number')
  if (!Number.isInteger(Number(data.totalQuantity)) || Number(data.totalQuantity) < 0) throw new Error('Total quantity must be a non-negative integer')
  if (!Number.isInteger(Number(data.ticketTypeDate)) || Number(data.ticketTypeDate) < 1 || Number(data.ticketTypeDate) > 31) throw new Error('Ticket date must be between 1 and 31')
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.ticketTypeTime)) throw new Error('Ticket time must use HH:mm format')
}

const createTicketType = async payload => {
  const data = normalizePayload(payload)
  validatePayload(data)
  return TicketType.create(data)
}

const getTicketTypes = async ({ page = 1, pageSize = 20 } = {}) => {
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const [ticketTypes, total] = await Promise.all([
    TicketType.find({}).sort({ ticketTypeDate: 1, ticketTypeTime: 1 }).skip((currentPage - 1) * limit).limit(limit).lean(),
    TicketType.countDocuments({})
  ])
  return { ticketTypes, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const getTicketTypeById = async id => {
  ensureId(id)
  const ticketType = await TicketType.findById(id).lean()
  if (!ticketType) throw new Error('Ticket type not found')
  return ticketType
}

const updateTicketType = async (id, payload) => {
  ensureId(id)
  const data = normalizePayload(payload)
  const existing = await TicketType.findById(id).lean()
  if (!existing) throw new Error('Ticket type not found')
  validatePayload({ ...existing, ...data })
  const ticketType = await TicketType.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean()
  return ticketType
}

const deleteTicketType = async id => {
  ensureId(id)
  const ticketType = await TicketType.findByIdAndDelete(id).lean()
  if (!ticketType) throw new Error('Ticket type not found')
  return { message: 'Ticket type deleted successfully', ticketType }
}

const changeTicketTypeStatus = async (id, ticketTypeStatus) => {
  ensureId(id)
  if (!['active', 'inactive'].includes(ticketTypeStatus)) throw new Error('Ticket status must be active or inactive')
  const ticketType = await TicketType.findByIdAndUpdate(id, { ticketTypeStatus }, { new: true, runValidators: true }).lean()
  if (!ticketType) throw new Error('Ticket type not found')
  return { message: 'Ticket type status updated successfully', ticketType }
}

module.exports = { createTicketType, getTicketTypes, getTicketTypeById, updateTicketType, deleteTicketType, changeTicketTypeStatus }
