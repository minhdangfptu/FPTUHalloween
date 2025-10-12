const mongoose = require('mongoose')
const { Halloween, User } = require('../models')
const { isValidObjectId } = mongoose

const ensureId = (id, name = 'id') => {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

const buildFilter = ({ year, status, owner }) => {
  const f = {}
  if (year !== undefined && year !== '') f.event_year = Number(year)
  if (status !== undefined && status !== '') f.event_status = Number(status)
  if (owner) { ensureId(owner, 'owner'); f.user_id = owner }
  return f
}

const sanitizeCreate = (payload) => {
  const allow = [
    'user_id', 'event_name', 'event_year', 'event_description', 'event_concept',
    'event_start_time', 'event_end_time', 'event_location', 'event_status',
    'event_image_url', 'ticket_url', 'ticket_image_url'
  ]
  const doc = {}
  for (const k of allow) if (payload[k] !== undefined) doc[k] = payload[k]
  if (doc.event_start_time && doc.event_end_time) {
    const s = new Date(doc.event_start_time); const e = new Date(doc.event_end_time)
    if (e < s) throw new Error('event_end_time must be after event_start_time')
  }
  return doc
}

const sanitizeUpdate = sanitizeCreate

async function listHalloweens(params = {}) {
  const { page = 1, limit = 20, sort = 'event_start_time', order = 'asc', year, status, owner } = params
  const filter = buildFilter({ year, status, owner })
  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit))
  const sortObj = { [sort]: order === 'desc' ? -1 : 1 }

  const [items, total] = await Promise.all([
    Halloween.find(filter).populate('user_id', 'full_name email').sort(sortObj).skip(skip).limit(Math.max(1, Number(limit))),
    Halloween.countDocuments(filter)
  ])

  return { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Math.max(1, Number(limit))) }
}

async function getHalloweenById(id) {
  ensureId(id)
  const doc = await Halloween.findById(id).populate('user_id', 'full_name email')
  if (!doc) throw new Error('Event not found')
  return doc
}

async function createHalloween(payload) {
  const data = sanitizeCreate(payload)
  if (data.user_id) {
    ensureId(data.user_id, 'user_id')
    const owner = await User.exists({ _id: data.user_id })
    if (!owner) throw new Error('Owner (user_id) not found')
  }
  const doc = await Halloween.create(data)
  return doc
}

async function updateHalloween(id, payload) {
  ensureId(id)
  const data = sanitizeUpdate(payload)
  if (data.user_id) {
    ensureId(data.user_id, 'user_id')
    const owner = await User.exists({ _id: data.user_id })
    if (!owner) throw new Error('Owner (user_id) not found')
  }
  const doc = await Halloween.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  if (!doc) throw new Error('Event not found')
  return doc
}

async function deleteHalloween(id) {
  ensureId(id)
  const doc = await Halloween.findByIdAndDelete(id)
  if (!doc) throw new Error('Event not found')
  return { deleted: true }
}

module.exports = { listHalloweens, getHalloweenById, createHalloween, updateHalloween, deleteHalloween }
