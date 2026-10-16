const mongoose = require('mongoose')
const { LuckyDraw } = require('../models')

const PAGE_SIZE = 10

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const normalizeEntry = (payload = {}) => {
  const data = {
    name: String(payload.name || '').trim(),
    phoneNumber: String(payload.phoneNumber || '').trim(),
    prize: String(payload.prize || '').trim()
  }

  if (!data.name) throw buildError(400, 'Name is required')
  if (data.name.length > 120) throw buildError(400, 'Name must be at most 120 characters')
  if (!data.phoneNumber) throw buildError(400, 'Phone number is required')
  if (!/^[0-9+\-\s().]{7,20}$/.test(data.phoneNumber)) {
    throw buildError(400, 'Phone number is invalid')
  }
  if (data.prize.length > 160) throw buildError(400, 'Prize must be at most 160 characters')
  return data
}

const createLuckyDraw = async payload => LuckyDraw.create(normalizeEntry(payload))

const getLuckyDraws = async query => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1)
  const pageSize = Math.min(Math.max(Number.parseInt(query.pageSize, 10) || PAGE_SIZE, 1), 50)
  const search = String(query.search || '').trim()
  const prize = String(query.prize || '').trim()
  const from = String(query.from || '').trim()
  const to = String(query.to || '').trim()
  const filter = {}

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phoneNumber: { $regex: search, $options: 'i' } }
    ]
  }
  if (prize) filter.prize = { $regex: prize, $options: 'i' }
  if (from || to) {
    filter.createAt = {}
    if (from) filter.createAt.$gte = new Date(`${from}T00:00:00.000Z`)
    if (to) filter.createAt.$lte = new Date(`${to}T23:59:59.999Z`)
  }

  const [entries, total] = await Promise.all([
    LuckyDraw.find(filter).sort({ createAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).lean(),
    LuckyDraw.countDocuments(filter)
  ])

  return {
    entries,
    pagination: { page, pageSize, total, totalPages: Math.max(Math.ceil(total / pageSize), 1) }
  }
}

const updatePrize = async (id, prize) => {
  if (!mongoose.isValidObjectId(id)) throw buildError(400, 'Invalid lucky draw ID')
  const value = String(prize || '').trim()
  if (value.length > 160) throw buildError(400, 'Prize must be at most 160 characters')
  const entry = await LuckyDraw.findByIdAndUpdate(id, { $set: { prize: value } }, { new: true, runValidators: true }).lean()
  if (!entry) throw buildError(404, 'Lucky draw entry not found')
  return entry
}

module.exports = { createLuckyDraw, getLuckyDraws, updatePrize }
