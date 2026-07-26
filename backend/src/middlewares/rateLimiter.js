const buckets = new Map()

const createRateLimiter = ({ windowMs, max, message, scope }) => (req, res, next) => {
  const key = `${req.ip}:${scope}`
  const now = Date.now()
  const current = buckets.get(key)
  const bucket = !current || now - current.startedAt >= windowMs
    ? { startedAt: now, count: 0 }
    : current

  bucket.count += 1
  buckets.set(key, bucket)

  if (bucket.count > max) {
    return res.status(429).json({ success: false, message, data: null })
  }

  return next()
}

const ticketRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  scope: 'tickets',
  message: 'Too many ticket requests. Please try again later.'
})

const paymentRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 10,
  scope: 'payments',
  message: 'Too many payment requests. Please try again later.'
})

module.exports = { ticketRateLimiter, paymentRateLimiter }
