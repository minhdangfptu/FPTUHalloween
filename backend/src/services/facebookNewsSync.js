const { News, KnowledgeSyncState } = require('../models')
const { config } = require('../config')
const facebookProvider = require('../providers/facebookProvider')

const SOURCE = 'facebook-news'
let syncInProgress = false
let syncTimer = null
let initialSyncTimer = null

const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })

const validUrl = value => {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

const collectAttachmentImages = attachments => {
  const images = []

  const visit = items => {
    if (!Array.isArray(items)) return
    items.forEach(item => {
      const imageUrl = validUrl(item?.media?.image?.src)
      if (imageUrl) images.push(imageUrl)
      visit(item?.subattachments?.data)
    })
  }

  visit(attachments?.data)
  return images
}

const normalizePost = post => {
  const publishedAt = post.created_time ? new Date(post.created_time) : new Date()
  const rawMessage = String(post.message || '').replace(/\r\n/g, '\n').trim()
  const fallback = `Facebook post published on ${publishedAt.toLocaleDateString('vi-VN')}`
  const firstLine = rawMessage.split('\n').map(line => line.trim()).find(Boolean) || fallback
  const images = [validUrl(post.full_picture), ...collectAttachmentImages(post.attachments)].filter(Boolean)

  return {
    title: firstLine.slice(0, 300),
    content: (rawMessage || fallback).slice(0, 20000),
    image: [...new Set(images)],
    fbPostId: String(post.id),
    pageId: config.FACEBOOK_PAGE_ID,
    permalinkUrl: validUrl(post.permalink_url),
    publishedAt,
    facebookUpdatedAt: post.updated_time ? new Date(post.updated_time) : publishedAt,
    lastSyncedAt: new Date(),
    reacts: Math.max(Number(post.reactions?.summary?.total_count) || 0, 0),
    shares: Math.max(Number(post.shares?.count) || 0, 0),
    isAvailable: true
  }
}

const updateState = update => KnowledgeSyncState.findOneAndUpdate(
  { source: SOURCE },
  { $set: update, $setOnInsert: { source: SOURCE } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
).lean()

const getSyncStatus = async () => {
  const provider = facebookProvider.getConfigurationStatus()
  const state = await KnowledgeSyncState.findOne({ source: SOURCE }).lean()
  const wasInterrupted = state?.status === 'running' && !syncInProgress

  return {
    source: SOURCE,
    configured: provider.configured,
    pageId: provider.pageId,
    apiVersion: provider.apiVersion,
    status: wasInterrupted
      ? 'error'
      : state?.status || (provider.configured ? 'idle' : 'unconfigured'),
    isRunning: syncInProgress,
    lastAttemptAt: state?.lastAttemptAt || null,
    lastSuccessAt: state?.lastSuccessAt || null,
    lastError: wasInterrupted ? 'Previous sync was interrupted' : state?.lastError || '',
    stats: state?.stats || { received: 0, inserted: 0, updated: 0 }
  }
}

const syncFacebookNews = async ({ limit } = {}) => {
  if (syncInProgress) throw buildError(409, 'Facebook News sync is already running')
  syncInProgress = true
  const attemptAt = new Date()
  const provider = facebookProvider.getConfigurationStatus()

  try {
    await updateState({
      status: provider.configured ? 'running' : 'unconfigured',
      pageId: provider.pageId,
      lastAttemptAt: attemptAt,
      lastError: provider.configured ? '' : 'Facebook News sync is not configured'
    })

    if (!provider.configured) throw buildError(503, 'Facebook News sync is not configured')

    const posts = await facebookProvider.getPagePosts({ limit })
    const normalizedPosts = posts.filter(post => post?.id).map(normalizePost)
    const existingNews = await News.find({
      pageId: provider.pageId,
      fbPostId: { $in: normalizedPosts.map(item => item.fbPostId) }
    })
      .select('fbPostId facebookUpdatedAt reacts shares')
      .lean()
    const existingByPostId = new Map(existingNews.map(item => [item.fbPostId, item]))
    const inserted = normalizedPosts.filter(item => !existingByPostId.has(item.fbPostId)).length
    const updated = normalizedPosts.filter(item => {
      const existing = existingByPostId.get(item.fbPostId)
      if (!existing) return false

      const existingUpdatedAt = existing.facebookUpdatedAt
        ? new Date(existing.facebookUpdatedAt).getTime()
        : 0
      const incomingUpdatedAt = item.facebookUpdatedAt
        ? new Date(item.facebookUpdatedAt).getTime()
        : 0

      return existingUpdatedAt !== incomingUpdatedAt ||
        existing.reacts !== item.reacts ||
        existing.shares !== item.shares
    }).length
    const operations = normalizedPosts.map(item => ({
      updateOne: {
        filter: { pageId: item.pageId, fbPostId: item.fbPostId },
        update: { $set: item },
        upsert: true
      }
    }))

    if (operations.length) await News.bulkWrite(operations, { ordered: false })
    const stats = {
      received: normalizedPosts.length,
      inserted,
      updated
    }

    await updateState({
      status: 'success',
      pageId: provider.pageId,
      lastAttemptAt: attemptAt,
      lastSuccessAt: new Date(),
      lastError: '',
      stats
    })

    return { ...(await getSyncStatus()), isRunning: false, stats }
  } catch (error) {
    await updateState({
      status: provider.configured ? 'error' : 'unconfigured',
      pageId: provider.pageId,
      lastAttemptAt: attemptAt,
      lastError: String(error.providerMessage || error.message || 'Facebook News sync failed').slice(0, 2000)
    }).catch(() => null)
    throw error
  } finally {
    syncInProgress = false
  }
}

const startFacebookNewsScheduler = () => {
  const provider = facebookProvider.getConfigurationStatus()
  if (!provider.configured || syncTimer) return null

  const runSync = () => syncFacebookNews().catch(() => null)
  initialSyncTimer = setTimeout(runSync, 5000)
  syncTimer = setInterval(runSync, config.FACEBOOK_SYNC_INTERVAL_MS)
  if (typeof initialSyncTimer.unref === 'function') initialSyncTimer.unref()
  if (typeof syncTimer.unref === 'function') syncTimer.unref()
  return syncTimer
}

const stopFacebookNewsScheduler = () => {
  if (initialSyncTimer) clearTimeout(initialSyncTimer)
  if (syncTimer) clearInterval(syncTimer)
  initialSyncTimer = null
  syncTimer = null
}

module.exports = {
  getSyncStatus,
  syncFacebookNews,
  startFacebookNewsScheduler,
  stopFacebookNewsScheduler,
  normalizePost
}
