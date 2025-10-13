const adminSvc = require('../services/admin')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const promoteToStaff = wrap(async (req, res) => {
  const updated = await adminSvc.promoteUserToStaff(req.params.id)
  return res.json(updated)
})

module.exports = { promoteToStaff }
