const svc = require('../services/user')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const me = wrap(async (req, res) => {
  const profile = await svc.viewUserprofile(req.user.id)
  return res.json(profile)
})

module.exports = { me }


