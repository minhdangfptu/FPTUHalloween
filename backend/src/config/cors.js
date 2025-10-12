const cors = require('cors')
const { config } = require('./environment')

const normalize = (s = '') => s.trim().replace(/\/+$/, '')
const WHITELIST = (config.CORS_ORIGINS || []).map(normalize)

const corsConfig = config.CORS_ENABLED
  ? cors({
      origin(origin, callback) {
        if (!origin) return callback(null, true)
        const o = normalize(origin)
        if (WHITELIST.length > 0) {
          return WHITELIST.includes(o)
            ? callback(null, true)
            : callback(new Error(`CORS blocked for origin: ${origin}`))
        }
        if (config.IS_DEV) return callback(null, true)
        return callback(null, true)
      },
      credentials: config.CORS_CREDENTIALS,
      optionsSuccessStatus: 200,
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  : (req, res, next) => next()

module.exports = { corsConfig }
