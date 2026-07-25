const mongoose = require('mongoose')
const { HotNews } = require('../models')

const MAX_CONTENT_LENGTH = 500
const MAX_LINK_LENGTH = 2048
const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:'])

const ensureId = (id, fieldName = 'hot news ID') => {
  if (!mongoose.isValidObjectId(id)) throw new Error(`Invalid ${fieldName}`)
}

const normalizePayload = (payload = {}, { partial = false } = {}) => {
  const data = {}

  if (!partial || payload.content !== undefined) {
    data.content = String(payload.content || '').trim()
    if (!data.content) throw new Error('Hot news content is required')
    if (data.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Hot news content must be at most ${MAX_CONTENT_LENGTH} characters`)
    }
  }

  if (payload.link !== undefined) {
    data.link = String(payload.link || '').trim()
    if (data.link.length > MAX_LINK_LENGTH) {
      throw new Error(`Hot news link must be at most ${MAX_LINK_LENGTH} characters`)
    }

    if (data.link) {
      let parsedLink
      try {
        parsedLink = new URL(data.link)
      } catch {
        throw new Error('Hot news link is invalid')
      }

      if (!ALLOWED_LINK_PROTOCOLS.has(parsedLink.protocol)) {
        throw new Error('Hot news link must use http or https')
      }
    }
  }

  if (!Object.keys(data).length) throw new Error('At least one hot news field is required')
  return data
}

const createHotNews = async (payload, userId) => {
  ensureId(userId, 'user ID')
  const data = normalizePayload(payload)
  return HotNews.create({ ...data, userId })
}

const getHotNews = async () => HotNews.find({}).sort({ createdAt: -1 }).lean()

const getActiveHotNews = async () =>
  HotNews.find({ isActive: true })
    .select('content link createdAt updatedAt')
    .sort({ createdAt: -1 })
    .lean()

const updateHotNews = async (id, payload, userId) => {
  ensureId(id)
  ensureId(userId, 'user ID')
  const data = normalizePayload(payload, { partial: true })
  const hotNews = await HotNews.findByIdAndUpdate(
    id,
    { $set: { ...data, userId } },
    { new: true, runValidators: true }
  ).lean()

  if (!hotNews) throw new Error('Hot news not found')
  return hotNews
}

const changeHotNewsStatus = async (id, isActive, userId) => {
  ensureId(id)
  ensureId(userId, 'user ID')
  if (typeof isActive !== 'boolean') throw new Error('isActive must be a boolean')

  const hotNews = await HotNews.findByIdAndUpdate(
    id,
    { $set: { isActive, userId } },
    { new: true, runValidators: true }
  ).lean()

  if (!hotNews) throw new Error('Hot news not found')
  return hotNews
}

module.exports = {
  getHotNews,
  getActiveHotNews,
  createHotNews,
  updateHotNews,
  changeHotNewsStatus
}
