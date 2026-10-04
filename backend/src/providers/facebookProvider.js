const { config } = require('../config')
const logger = require('../config/logger')

const GRAPH_HOSTS = new Set(['graph.facebook.com', 'graph.facebook.net'])
const POST_FIELDS = [
  'id',
  'message',
  'created_time',
  'updated_time',
  'permalink_url',
  'full_picture',
  'shares',
  'reactions.limit(0).summary(true)',
  'attachments.limit(10){media,subattachments.limit(10){media}}'
].join(',')

let activePageAccessToken = ''

const buildError = (statusCode, message, code) => Object.assign(new Error(message), { statusCode, code })

const sanitizeFacebookUrl = (url) => {
  const parsedUrl = new URL(url)
  parsedUrl.searchParams.delete('access_token')
  return parsedUrl.toString()
}

const getConfiguration = () => ({
  pageId: config.FACEBOOK_PAGE_ID,
  accessToken: activePageAccessToken || config.FACEBOOK_PAGE_ACCESS_TOKEN,
  apiVersion: config.FACEBOOK_GRAPH_API_VERSION,
  timeoutMs: config.FACEBOOK_REQUEST_TIMEOUT_MS
})

const setPageAccessToken = accessToken => {
  const normalizedToken = String(accessToken || '').trim()
  if (!normalizedToken) throw buildError(400, 'Facebook Page access token is required', 'FACEBOOK_TOKEN_REQUIRED')
  if (normalizedToken.length > 4096) throw buildError(400, 'Facebook Page access token is invalid', 'FACEBOOK_TOKEN_INVALID')
  activePageAccessToken = normalizedToken
  return getConfigurationStatus()
}

const getConfigurationStatus = () => {
  const settings = getConfiguration()
  return {
    configured: Boolean(settings.pageId && settings.accessToken),
    pageId: settings.pageId || '',
    apiVersion: settings.apiVersion,
    hasAccessToken: Boolean(settings.accessToken)
  }
}

const ensureConfigured = () => {
  const settings = getConfiguration()
  if (!settings.pageId || !settings.accessToken) {
    throw buildError(503, 'Facebook News sync is not configured', 'FACEBOOK_NOT_CONFIGURED')
  }
  return settings
}

const requestJson = async (url, accessToken, timeoutMs) => {
  const parsedUrl = new URL(url)
  if (!GRAPH_HOSTS.has(parsedUrl.hostname)) {
    throw buildError(502, 'Facebook API returned an invalid pagination URL', 'FACEBOOK_INVALID_PAGING_URL')
  }
  parsedUrl.searchParams.set('access_token', accessToken)

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  if (typeof timeout.unref === 'function') timeout.unref()

  try {
    const response = await fetch(parsedUrl, {
      headers: {
        Accept: 'application/json'
      },
      signal: controller.signal
    })
    const payload = await response.json().catch(() => ({}))

    if (!response.ok || payload.error) {
      const providerCode = payload.error?.code ? ` (${payload.error.code})` : ''
      const isRateLimited = response.status === 429 || [4, 17, 32, 613].includes(payload.error?.code)
      const error = buildError(
        isRateLimited ? 429 : 502,
        `Facebook API request failed${providerCode}`,
        payload.error?.code || 'FACEBOOK_REQUEST_FAILED'
      )
      error.providerMessage = payload.error?.message || ''
      logger.error('Facebook API request failed', {
        statusCode: response.status,
        providerCode: payload.error?.code || null,
        providerMessage: payload.error?.message || '',
        url: sanitizeFacebookUrl(parsedUrl.toString())
      })
      throw error
    }

    return payload
  } catch (error) {
    if (error.name === 'AbortError') {
      throw buildError(504, 'Facebook API request timed out', 'FACEBOOK_TIMEOUT')
    }
    if (error.statusCode) throw error
    throw buildError(502, 'Unable to reach Facebook API', 'FACEBOOK_NETWORK_ERROR')
  } finally {
    clearTimeout(timeout)
  }
}

const getPagePosts = async ({ limit } = {}) => {
  const settings = ensureConfigured()
  const maxPosts = Math.min(Math.max(Number(limit) || config.FACEBOOK_INITIAL_POST_LIMIT, 1), 350)
  const endpoint = new URL(`https://graph.facebook.com/${settings.apiVersion}/${encodeURIComponent(settings.pageId)}/posts`)
  endpoint.searchParams.set('fields', POST_FIELDS)
  endpoint.searchParams.set('limit', String(Math.min(maxPosts, 100)))

  const posts = []
  let nextUrl = endpoint.toString()

  while (nextUrl && posts.length < maxPosts) {
    const payload = await requestJson(nextUrl, settings.accessToken, settings.timeoutMs)
    const remaining = maxPosts - posts.length
    posts.push(...(Array.isArray(payload.data) ? payload.data.slice(0, remaining) : []))
    nextUrl = payload.paging?.next || ''
  }

  return posts
}

module.exports = { getPagePosts, getConfigurationStatus, setPageAccessToken }
