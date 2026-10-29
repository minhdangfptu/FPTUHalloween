const mongoose = require('mongoose')
const { LuckyDraw } = require('../models')
const { config } = require('../config/environment')
const { normalizeWheelPath, getWheelPath, buildWheelLink } = require('../utils/wheel-path')

const PAGE_SIZE = 10

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const getWheelApiBaseUrl = () => config.WHEEL_OF_NAME_API_URL.replace(/\/private$/, '')

const getWheelApiUrl = path => {
  const baseUrl = getWheelApiBaseUrl()
  return path ? `${baseUrl}/${path}` : baseUrl
}

const getWheelEntryText = entry => {
  const phoneDigits = String(entry.phoneNumber || '').replace(/\D/g, '')
  const phoneSuffix = phoneDigits.slice(-4)
  return `${entry.name} - ${phoneSuffix}`
}

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

const createLuckyDraw = async payload => {
  const data = normalizeEntry(payload)
  const existingEntry = await LuckyDraw.exists({ phoneNumber: data.phoneNumber })
  if (existingEntry) throw buildError(409, 'Phone number already exists')
  try {
    return await LuckyDraw.create(data)
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.phoneNumber) {
      throw buildError(409, 'Phone number already exists')
    }
    throw error
  }
}

const syncLuckyDrawWheel = async () => {
  if (!config.WHEEL_OF_NAME_APIKEY) {
    return { synced: false, reason: 'Wheel of Names API key is not configured' }
  }

  const entries = await LuckyDraw.find({})
    .select('name phoneNumber')
    .sort({ createAt: 1 })
    .lean()

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.WHEEL_OF_NAME_TIMEOUT_MS)

  try {
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': config.WHEEL_OF_NAME_APIKEY
    }
    const listResponse = await fetch(`${getWheelApiUrl()}?fields=title,path,shareMode`, {
      headers,
      signal: controller.signal
    })

    if (!listResponse.ok) {
      const errorBody = await listResponse.text()
      throw buildError(502, `Unable to list Wheel of Names wheels (${listResponse.status}): ${errorBody.slice(0, 200)}`)
    }

    const listResult = await listResponse.json()
    const existingWheel = (listResult.data?.wheels || [])
      .find(item => item.title === config.WHEEL_OF_NAME_TITLE)
    const existingPath = normalizeWheelPath(existingWheel?.path)
    const response = await fetch(getWheelApiUrl(existingPath), {
      method: existingPath ? 'PUT' : 'POST',
      headers,
      body: JSON.stringify({
        title: config.WHEEL_OF_NAME_TITLE,
        description: 'Vòng quay may mắn sự kiện FPTU Halloween 2026',
        shareMode: 'spin-only',
        wheelConfigs: [{
          entries: entries.map(entry => ({ text: getWheelEntryText(entry) }))
        }]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw buildError(502, `Wheel of Names sync failed (${response.status}): ${errorBody.slice(0, 200)}`)
    }

    const result = await response.json()
    const path = existingPath || getWheelPath(result)
    if (!path) throw buildError(502, 'Wheel of Names did not return a valid wheel path')
    return { synced: true, path }
  } finally {
    clearTimeout(timeout)
  }
}

const getLuckyDrawWheel = async () => {
  if (!config.WHEEL_OF_NAME_APIKEY) {
    throw buildError(503, 'Wheel of Names API key is not configured')
  }

  const syncedWheel = await syncLuckyDrawWheel()
  const syncedWheelLink = buildWheelLink(syncedWheel.path)
  if (syncedWheelLink) return syncedWheelLink

  const response = await fetch(`${getWheelApiUrl()}?fields=title,path,shareMode`, {
    headers: { 'x-api-key': config.WHEEL_OF_NAME_APIKEY }
  })
  if (!response.ok) throw buildError(502, `Unable to load Wheel of Names (${response.status})`)

  const result = await response.json()
  const wheel = (result.data?.wheels || []).find(item => item.title === config.WHEEL_OF_NAME_TITLE)
  const wheelLink = buildWheelLink(wheel?.path)
  if (wheelLink) return wheelLink

  throw buildError(404, 'Lucky draw wheel not found')
}

const createLuckyDrawAndSync = async payload => ({ entry: await createLuckyDraw(payload) })

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
