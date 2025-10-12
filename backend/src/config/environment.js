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
  get IS_PROD() { return this.NODE_ENV === 'production' },
  get IS_DEV() { return this.NODE_ENV === 'development' }
}

module.exports = { config }
