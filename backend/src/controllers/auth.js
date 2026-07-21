const authSvc = require('../services/auth')

const send = (res, result, statusCode = 200, message = 'Operation successful') => {
  const { message: serviceMessage, ...data } = result || {}
  return res.status(statusCode).json({ success: true, statusCode, message: serviceMessage || message, data: Object.keys(data).length ? data : null, meta: null, errors: null })
}
const wrap = (fn, status = 200) => (req, res, next) => Promise.resolve(fn(req, res)).then(result => send(res, result, status)).catch(next)
const register = wrap(req => authSvc.register(req.body), 201)
const confirmOtp = wrap(req => authSvc.confirmOtp(req.body))
const login = wrap(req => authSvc.login(req.body))
const googleLogin = wrap(req => authSvc.googleLogin(req.body))
const forgotPassword = wrap(req => authSvc.forgotPassword(req.body))
const resetPassword = wrap(req => authSvc.resetPassword(req.body))
const changePassword = wrap(req => authSvc.changePassword(req.user.id, req.body))
const refresh = wrap(req => authSvc.refreshTokens(req.body?.refreshToken))
const logout = wrap(req => authSvc.logout(req.body?.refreshToken))
module.exports = { register, confirmOtp, login, googleLogin, forgotPassword, resetPassword, changePassword, refresh, logout }
