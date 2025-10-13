const mongoose = require('mongoose')
const { News, Halloween } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeCreate(payload = {}) {
  const data = {
    halloween_id: payload.halloween_id,
    news__title: String(payload.news__title || '').trim(),
    news_image_url: String(payload.news_image_url || ''),
    news_type: Array.isArray(payload.news_type) ? payload.news_type : [],
    news_date: payload.news_date ? new Date(payload.news_date) : null,
    news_url: String(payload.news_url || '')
  }
  if (!data.halloween_id) throw new Error('Thiếu halloween_id')
  if (!data.news__title) throw new Error('Thiếu news__title')
  if (!data.news_date || isNaN(data.news_date.getTime())) throw new Error('news_date không hợp lệ')
  return data
}

const sanitizeUpdate = sanitizeCreate

function buildFilter(params = {}) {
  const filter = {}
  if (params.halloween_id) {
    ensureId(params.halloween_id, 'halloween_id')
    filter.halloween_id = params.halloween_id
  }
  if (params.type) {
    filter.news_type = { $in: Array.isArray(params.type) ? params.type : [params.type] }
  }
  if (params.from || params.to) {
    filter.news_date = {}
    if (params.from) filter.news_date.$gte = new Date(params.from)
    if (params.to) filter.news_date.$lte = new Date(params.to)
  }
  return filter
}

async function listNews(params = {}) {
  const { page = 1, limit = 20, sort = 'news_date', order = 'desc' } = params
  const filter = buildFilter(params)
  const skip = (Math.max(1, Number(page)) - 1) * Math.max(1, Number(limit))
  const sortObj = { [sort]: order === 'desc' ? -1 : 1 }

  const [items, total] = await Promise.all([
    News.find(filter).populate('halloween_id', 'event_name event_year').sort(sortObj).skip(skip).limit(Math.max(1, Number(limit))),
    News.countDocuments(filter)
  ])

  return { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Math.max(1, Number(limit))) }
}

async function getNewsById(id) {
  ensureId(id)
  const doc = await News.findById(id).populate('halloween_id', 'event_name event_year')
  if (!doc) throw new Error('News not found')
  return doc
}

async function createNews(payload) {
  const data = sanitizeCreate(payload)
  ensureId(data.halloween_id, 'halloween_id')
  const exists = await Halloween.exists({ _id: data.halloween_id })
  if (!exists) throw new Error('halloween_id không tồn tại')
  const doc = await News.create(data)
  return doc
}

async function updateNews(id, payload) {
  ensureId(id)
  const data = sanitizeUpdate(payload)
  ensureId(data.halloween_id, 'halloween_id')
  const exists = await Halloween.exists({ _id: data.halloween_id })
  if (!exists) throw new Error('halloween_id không tồn tại')
  const doc = await News.findByIdAndUpdate(id, data, { new: true })
  if (!doc) throw new Error('News not found')
  return doc
}

async function deleteNews(id) {
  ensureId(id)
  const doc = await News.findByIdAndDelete(id)
  if (!doc) throw new Error('News not found')
  return { deleted: true }
}

module.exports = { listNews, getNewsById, createNews, updateNews, deleteNews }


