const authSvc = require('../services/auth')
const { Role } = require('../models')

function requireAuth(req, res, next) {
  try {
    const header = String(req.headers.authorization || '')
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
    if (!token) return res.status(401).json({ message: 'Missing Authorization header' })
    const decoded = authSvc.verifyAccessToken(token)
    req.user = { id: String(decoded.id), roleId: String(decoded.roleId || '') }
    return next()
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

function requireRole(...roleNames) {
  return async (req, res, next) => {
    try {
      if (!req.user?.roleId) return res.status(403).json({ message: 'Forbidden' })
      const role = await Role.findOne({ _id: req.user.roleId, roleActive: true }).select('roleName').lean()
      const allowedRoles = roleNames.map(roleName => String(roleName).toLowerCase())
      if (!role || !allowedRoles.includes(String(role.roleName).toLowerCase())) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = { requireAuth, requireRole }


