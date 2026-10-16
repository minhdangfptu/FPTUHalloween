const mongoose = require('mongoose')
const { LuckyDraw } = require('../models')
const { config } = require('../config/environment')

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

const syncLuckyDrawWheel = async () => {
  if (!config.WHEEL_OF_NAME_APIKEY) {
    return { synced: false, reason: 'Wheel of Names API key is not configured' }
  }

  const entries = await LuckyDraw.find({})
    .select('name')
    .sort({ createAt: 1 })
    .lean()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.WHEEL_OF_NAME_TIMEOUT_MS)

  try {
    const response = await fetch(config.WHEEL_OF_NAME_API_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.WHEEL_OF_NAME_APIKEY
      },
      body: JSON.stringify({
        title: config.WHEEL_OF_NAME_TITLE,
        description: 'FPTU Halloween lucky draw participants',
        wheelConfigs: [{
          entries: entries.map(entry => ({ text: entry.name, enabled: true }))
        }]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw buildError(502, `Wheel of Names sync failed (${response.status}): ${errorBody.slice(0, 200)}`)
    }

    const result = await response.json()
    return { synced: true, path: result.data?.path || null }
  } finally {
    clearTimeout(timeout)
  }
}

const getLuckyDrawWheel = async () => {
  if (!config.WHEEL_OF_NAME_APIKEY) {
    throw buildError(503, 'Wheel of Names API key is not configured')
  }

  const response = await fetch(`${config.WHEEL_OF_NAME_API_URL.replace('/private', '/private')}?fields=title,path`, {
    headers: { 'x-api-key': config.WHEEL_OF_NAME_APIKEY }
  })
  if (!response.ok) throw buildError(502, `Unable to load Wheel of Names (${response.status})`)

  const result = await response.json()
  const wheel = (result.data?.wheels || []).find(item => item.title === config.WHEEL_OF_NAME_TITLE)
  if (!wheel?.path) throw buildError(404, 'Lucky draw wheel not found')
  return { path: wheel.path, url: `https://wheelofnames.com/${wheel.path}` }
}

const createLuckyDrawAndSync = async payload => {
  const entry = await createLuckyDraw(payload)
  let wheelSync
  try {
    wheelSync = await syncLuckyDrawWheel()
  } catch (error) {
    wheelSync = { synced: false, reason: error.message }
  }
  return { entry, wheelSync }
}

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

module.exports = { createLuckyDraw, createLuckyDrawAndSync, syncLuckyDrawWheel, getLuckyDrawWheel, getLuckyDraws, updatePrize }
