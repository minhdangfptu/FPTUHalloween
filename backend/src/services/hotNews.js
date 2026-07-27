const mongoose = require('mongoose')
const { HotNews } = require('../models')

const MAX_CONTENT_LENGTH = 500
const MAX_LINK_LENGTH = 2048
const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:'])

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const ensureId = (id, fieldName = 'hot news ID') => {
  if (!mongoose.isValidObjectId(id)) throw buildError(400, `Invalid ${fieldName}`)
}

const isValidDisplayOrder = value => Number.isInteger(value) && value > 0

const ensureDisplayOrder = async () => {
  const items = await HotNews.find({})
    .select('_id displayOrder createdAt')
    .sort({ createdAt: -1 })
    .lean()

  let nextOrder = items.reduce(
    (max, item) => isValidDisplayOrder(item.displayOrder) ? Math.max(max, item.displayOrder) : max,
    0
  ) + 1
  const updates = items
    .filter(item => !isValidDisplayOrder(item.displayOrder))
    .map(item => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { displayOrder: nextOrder++ } }
      }
    }))

  if (updates.length) await HotNews.bulkWrite(updates)
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
  await ensureDisplayOrder()
  const latest = await HotNews.findOne({}).sort({ displayOrder: -1 }).select('displayOrder').lean()
  const displayOrder = (latest?.displayOrder || 0) + 1
  return HotNews.create({ ...data, userId, displayOrder })
}

const getHotNews = async () => {
  await ensureDisplayOrder()
  return HotNews.find({}).sort({ displayOrder: 1, createdAt: -1 }).lean()
}

const getActiveHotNews = async () => {
  await ensureDisplayOrder()
  return HotNews.find({ isActive: true })
    .select('content link displayOrder createdAt updatedAt')
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean()
}

const reorderHotNews = async orderIds => {
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw new Error('Hot news order is required')
  }

  const ids = orderIds.map(id => String(id))
  if (new Set(ids).size !== ids.length) throw new Error('Hot news order contains duplicates')
  ids.forEach(id => ensureId(id))

  const existingCount = await HotNews.countDocuments({ _id: { $in: ids } })
  if (existingCount !== ids.length) throw buildError(404, 'Hot news not found')

  await HotNews.bulkWrite(ids.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { $set: { displayOrder: index + 1 } }
    }
  })))

  return getHotNews()
}

const updateHotNews = async (id, payload, userId) => {
  ensureId(id)
  ensureId(userId, 'user ID')
  const data = normalizePayload(payload, { partial: true })
  const hotNews = await HotNews.findByIdAndUpdate(
    id,
    { $set: { ...data, userId } },
    { new: true, runValidators: true }
  ).lean()

  if (!hotNews) throw buildError(404, 'Hot news not found')
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

  if (!hotNews) throw buildError(404, 'Hot news not found')
  return hotNews
}

const deleteHotNews = async (id) => {
  ensureId(id)

  const deletedHotNews = await HotNews.findByIdAndDelete(id).lean()
  if (!deletedHotNews) throw buildError(404, 'Hot news not found')

  return deletedHotNews
}

module.exports = {
  getHotNews,
  getActiveHotNews,
  reorderHotNews,
  createHotNews,
  updateHotNews,
  changeHotNewsStatus,
  deleteHotNews
}
