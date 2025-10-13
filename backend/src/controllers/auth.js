const authSvc = require('../services/auth')

const wrap = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch((err) =>
    res.status(400).json({ message: err?.message || 'Bad Request' })
  )

const register = wrap(async (req, res) => {
  const user = await authSvc.register(req.body)
  return res.status(201).json(user)
})

const login = wrap(async (req, res) => {
  const result = await authSvc.login(req.body)
  return res.json(result)
})

const refresh = wrap(async (req, res) => {
  const { refreshToken } = req.body || {}
  const tokens = await authSvc.refreshTokens(refreshToken)
  return res.json(tokens)
})

const logout = wrap(async (req, res) => {
  const result = await authSvc.logout()
  return res.json(result)
})

module.exports = { register, login, refresh, logout }


