const authSvc = require('../services/auth')

function requireAuth(req, res, next) {
  try {
    const header = String(req.headers.authorization || '')
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
    if (!token) return res.status(401).json({ message: 'Missing Authorization header' })
    const decoded = authSvc.verifyAccessToken(token)
    req.user = { id: String(decoded.uid), role: String(decoded.role) }
    return next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(403).json({ message: 'Forbidden' })
    if (String(req.user.role) !== roleName) return res.status(403).json({ message: 'Forbidden' })
    return next()
  }
}

module.exports = { requireAuth, requireRole }


