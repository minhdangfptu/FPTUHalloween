require('dotenv/config')

const rawOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || ''
const parsedOrigins = rawOrigins
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ENABLED: process.env.CORS_ENABLED !== 'false',
  CORS_ORIGINS: parsedOrigins,
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  MONGODB_URI: process.env.MONGODB_URI || '',
  FACEBOOK_PAGE_ID: String(process.env.FACEBOOK_PAGE_ID || '').trim(),
  FACEBOOK_PAGE_ACCESS_TOKEN: String(process.env.FACEBOOK_PAGE_ACCESS_TOKEN || '').trim(),
  FACEBOOK_GRAPH_API_VERSION: String(process.env.FACEBOOK_GRAPH_API_VERSION || 'v26.0').trim(),
  FACEBOOK_SYNC_INTERVAL_MS: Math.max(Number(process.env.FACEBOOK_SYNC_INTERVAL_MS) || 60 * 60 * 1000, 60 * 1000),
  FACEBOOK_INITIAL_POST_LIMIT: Math.min(Math.max(Number(process.env.FACEBOOK_INITIAL_POST_LIMIT) || 350, 1), 350),
  FACEBOOK_REQUEST_TIMEOUT_MS: Math.max(Number(process.env.FACEBOOK_REQUEST_TIMEOUT_MS) || 15 * 1000, 1000),
  get IS_PROD() { return this.NODE_ENV === 'production' },
  get IS_DEV() { return this.NODE_ENV === 'development' }
}

module.exports = { config }
