const mongoose = require('mongoose')
const { Feedback, Halloween } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeCreate(payload = {}) {
  const data = {
    halloween_id: payload.halloween_id,
    full_name: String(payload.full_name || '').trim(),
    phone_number: String(payload.phone_number || '').trim(),
    title: String(payload.title || '').trim(),
    rating: Number(payload.rating),
    feedback: String(payload.feedback || '')
  }
  if (!data.halloween_id) throw new Error('Thiếu halloween_id')
  if (!data.full_name) throw new Error('Thiếu full_name')
  if (!data.title) throw new Error('Thiếu title')
  if (!(data.rating >= 1 && data.rating <= 5)) throw new Error('rating phải trong [1..5]')
  return data
}

const sanitizeUpdate = sanitizeCreate

function buildFilter(params = {}) {
  const filter = {}
  if (params.halloween_id) {
    ensureId(params.halloween_id, 'halloween_id')
    filter.halloween_id = params.halloween_id
  }
  if (params.minRating || params.maxRating) {
    filter.rating = {}
    if (params.minRating) filter.rating.$gte = Number(params.minRating)
    if (params.maxRating) filter.rating.$lte = Number(params.maxRating)
  }
  if (params.q) {
    const q = String(params.q).trim()
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { feedback: { $regex: q, $options: 'i' } },
      { full_name: { $regex: q, $options: 'i' } }
    ]
  }
  return filter
}

async function listFeedbacks(params = {}) {
  const { page = 1, limit = 20, sort = 'created_at', order = 'desc' } = params
  const filter = buildFilter(params)
  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit))
  const sortObj = { [sort]: order === 'desc' ? -1 : 1 }

  const [items, total] = await Promise.all([
    Feedback.find(filter).populate('halloween_id', 'event_name event_year').sort(sortObj).skip(skip).limit(Math.max(1, Number(limit))),
    Feedback.countDocuments(filter)
  ])

  return { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Math.max(1, Number(limit))) }
}

async function listFeedbacksByHalloween(halloweenId, params = {}) {
  ensureId(halloweenId, 'halloween_id')
  const { page = 1, limit = 20, sort = 'created_at', order = 'desc' } = params
  const filter = { ...buildFilter(params), halloween_id: halloweenId }
  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit))
  const sortObj = { [sort]: order === 'desc' ? -1 : 1 }

  const [items, total] = await Promise.all([
    Feedback.find(filter).populate('halloween_id', 'event_name event_year').sort(sortObj).skip(skip).limit(Math.max(1, Number(limit))),
    Feedback.countDocuments(filter)
  ])

  return { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Math.max(1, Number(limit))) }
}

async function getFeedbackById(id) {
  ensureId(id)
  const doc = await Feedback.findById(id).populate('halloween_id', 'event_name event_year')
  if (!doc) throw new Error('Feedback not found')
  return doc
}

async function createFeedback(payload) {
  const data = sanitizeCreate(payload)
  ensureId(data.halloween_id, 'halloween_id')
  const exists = await Halloween.exists({ _id: data.halloween_id })
  if (!exists) throw new Error('halloween_id không tồn tại')
  const doc = await Feedback.create(data)
  return doc
}

async function updateFeedback(id, payload) {
  ensureId(id)
  const data = sanitizeUpdate(payload)
  ensureId(data.halloween_id, 'halloween_id')
  const exists = await Halloween.exists({ _id: data.halloween_id })
  if (!exists) throw new Error('halloween_id không tồn tại')
  const doc = await Feedback.findByIdAndUpdate(id, data, { new: true })
  if (!doc) throw new Error('Feedback not found')
  return doc
}

async function deleteFeedback(id) {
  ensureId(id)
  const doc = await Feedback.findByIdAndDelete(id)
  if (!doc) throw new Error('Feedback not found')
  return { deleted: true }
}

module.exports = { listFeedbacks, listFeedbacksByHalloween, getFeedbackById, createFeedback, updateFeedback, deleteFeedback }


