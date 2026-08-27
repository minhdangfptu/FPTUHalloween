const mongoose = require('mongoose')
const { News } = require('../models')

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 50
const MAX_FEATURED_NEWS = 30
const VIETNAM_TIMEZONE_OFFSET_MS = 7 * 60 * 60 * 1000
const NEWS_SELECT = 'title content image fbPostId pageId permalinkUrl publishedAt facebookUpdatedAt lastSyncedAt reacts shares isFeatured featuredOrder featuredAt createdAt updatedAt'

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })
const escapeRegex = value => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizePagination = ({ page = 1, limit = DEFAULT_PAGE_SIZE } = {}) => {
  const safePage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || DEFAULT_PAGE_SIZE, 1), MAX_PAGE_SIZE)
  return { page: safePage, limit: safeLimit }
}

const parseOptionalInteger = (value, fieldName) => {
  if (value === undefined || value === null || String(value).trim() === '') return null

  const normalizedValue = String(value).trim()
  if (!/^\d+$/.test(normalizedValue)) throw buildError(400, `Invalid ${fieldName} filter`)
  return Number.parseInt(normalizedValue, 10)
}

const toVietnamDateBoundary = (year, monthIndex, day = 1) => (
  new Date(Date.UTC(year, monthIndex, day) - VIETNAM_TIMEZONE_OFFSET_MS)
)

const buildPublishedAtFilter = params => {
  const year = parseOptionalInteger(params.year, 'year')
  const month = parseOptionalInteger(params.month, 'month')
  const day = parseOptionalInteger(params.day, 'day')

  if (month !== null && year === null) throw buildError(400, 'A year is required when filtering by month')
  if (day !== null && month === null) throw buildError(400, 'A month is required when filtering by day')
  if (year === null) return null
  if (year < 1970 || year > 2100) throw buildError(400, 'Invalid year filter')
  if (month !== null && (month < 1 || month > 12)) throw buildError(400, 'Invalid month filter')

  if (day !== null) {
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
    if (day < 1 || day > daysInMonth) throw buildError(400, 'Invalid day filter')
  }

  if (day !== null) {
    return {
      $gte: toVietnamDateBoundary(year, month - 1, day),
      $lt: toVietnamDateBoundary(year, month - 1, day + 1)
    }
  }

  if (month !== null) {
    return {
      $gte: toVietnamDateBoundary(year, month - 1),
      $lt: toVietnamDateBoundary(year, month)
    }
  }

  return {
    $gte: toVietnamDateBoundary(year, 0),
    $lt: toVietnamDateBoundary(year + 1, 0)
  }
}

const serializeNews = item => ({
  id: String(item._id),
  title: item.title,
  content: item.content,
  images: Array.isArray(item.image) ? item.image.filter(Boolean) : [],
  facebookPostId: item.fbPostId,
  pageId: item.pageId,
  permalinkUrl: item.permalinkUrl || '',
  publishedAt: item.publishedAt || item.createdAt,
  facebookUpdatedAt: item.facebookUpdatedAt || null,
  lastSyncedAt: item.lastSyncedAt || null,
  reacts: Number(item.reacts) || 0,
  shares: Number(item.shares) || 0,
  isFeatured: item.isFeatured === true,
  featuredOrder: Number(item.featuredOrder) || 0,
  featuredAt: item.featuredAt || null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt
})

const getFeaturedNews = async () => {
  const items = await News.find({ isAvailable: { $ne: false }, isFeatured: true })
    .select(NEWS_SELECT)
    .sort({ featuredOrder: -1, featuredAt: -1, publishedAt: -1 })
    .limit(MAX_FEATURED_NEWS)
    .lean()

  return items.map(serializeNews)
}

const getNews = async (params = {}) => {
  const { page, limit } = normalizePagination(params)
  const search = String(params.search || '').trim().slice(0, 100)
  // Legacy news did not have this field; only an explicit false hides an item.
  const filter = { isAvailable: { $ne: false } }
  const publishedAtFilter = buildPublishedAtFilter(params)

  if (publishedAtFilter) filter.publishedAt = publishedAtFilter

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i')
    filter.$or = [{ title: pattern }, { content: pattern }]
  }

  const [items, total, availableYears, featured] = await Promise.all([
    News.find(filter)
      .select(NEWS_SELECT)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    News.countDocuments(filter),
    News.aggregate([
      { $match: { isAvailable: { $ne: false }, publishedAt: { $type: 'date' } } },
      {
        $group: {
          _id: {
            $year: { date: '$publishedAt', timezone: 'Asia/Ho_Chi_Minh' }
          }
        }
      },
      { $sort: { _id: -1 } }
    ]),
    getFeaturedNews()
  ])

  return {
    items: items.map(serializeNews),
    pagination: {
      page,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit)
    },
    filters: {
      years: availableYears.map(item => item._id)
    },
    featured
  }
}

const getNewsById = async id => {
  if (!mongoose.isValidObjectId(id)) throw buildError(400, 'Invalid news ID')

  const item = await News.findOne({ _id: id, isAvailable: { $ne: false } })
    .select(NEWS_SELECT)
    .lean()

  if (!item) throw buildError(404, 'News not found')
  return serializeNews(item)
}

const setNewsFeatured = async (id, isFeatured) => {
  if (!mongoose.isValidObjectId(id)) throw buildError(400, 'Invalid news ID')
  if (typeof isFeatured !== 'boolean') throw buildError(400, 'isFeatured must be a boolean')

  const existing = await News.findOne({ _id: id, isAvailable: { $ne: false } })
    .select('isFeatured')
    .lean()
  if (!existing) throw buildError(404, 'News not found')

  if (existing.isFeatured === isFeatured) return getNewsById(id)

  let featuredOrder = 0
  if (isFeatured) {
    const featuredCount = await News.countDocuments({
      isAvailable: { $ne: false },
      isFeatured: true
    })
    if (featuredCount >= MAX_FEATURED_NEWS) {
      throw buildError(409, `A maximum of ${MAX_FEATURED_NEWS} featured posts is allowed`)
    }

    const highestFeatured = await News.findOne({
      isAvailable: { $ne: false },
      isFeatured: true
    })
      .select('featuredOrder')
      .sort({ featuredOrder: -1 })
      .lean()
    featuredOrder = (Number(highestFeatured?.featuredOrder) || 0) + 1
  }

  const updated = await News.findOneAndUpdate(
    { _id: id, isAvailable: { $ne: false } },
    {
      $set: {
        isFeatured,
        featuredOrder,
        featuredAt: isFeatured ? new Date() : null
      }
    },
    { new: true }
  )
    .select(NEWS_SELECT)
    .lean()

  if (!updated) throw buildError(404, 'News not found')
  return serializeNews(updated)
}

const reorderFeaturedNews = async orderedIds => {
  if (!Array.isArray(orderedIds)) throw buildError(400, 'orderedIds must be an array')
  if (orderedIds.length > MAX_FEATURED_NEWS) {
    throw buildError(400, `A maximum of ${MAX_FEATURED_NEWS} featured posts is allowed`)
  }

  const normalizedIds = orderedIds.map(id => String(id || '').trim())
  if (normalizedIds.some(id => !mongoose.isValidObjectId(id))) {
    throw buildError(400, 'Featured post order contains an invalid news ID')
  }
  if (new Set(normalizedIds).size !== normalizedIds.length) {
    throw buildError(400, 'Featured post order contains duplicate news IDs')
  }

  const featuredItems = await News.find({
    isAvailable: { $ne: false },
    isFeatured: true
  })
    .select('_id')
    .lean()

  const featuredIdSet = new Set(featuredItems.map(item => String(item._id)))
  const hasSameItems = featuredIdSet.size === normalizedIds.length
    && normalizedIds.every(id => featuredIdSet.has(id))
  if (!hasSameItems) {
    throw buildError(409, 'Featured post list changed. Please refresh and try again')
  }

  if (normalizedIds.length > 0) {
    await News.bulkWrite(normalizedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, isAvailable: { $ne: false }, isFeatured: true },
        update: { $set: { featuredOrder: normalizedIds.length - index } }
      }
    })), { ordered: true })
  }

  return getFeaturedNews()
}

module.exports = {
  getNews,
  getNewsById,
  getFeaturedNews,
  setNewsFeatured,
  reorderFeaturedNews,
  serializeNews
}
