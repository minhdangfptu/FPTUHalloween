const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { User, Role, RefreshToken, Otp } = require('../models')
const { sendOtpEmail } = require('../providers/emailProvider')

const accessSecret = () => process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.REFRESH_TOKEN_SECRET
const hash = value => crypto.createHash('sha256').update(value).digest('hex')
const normalize = value => String(value || '').trim().toLowerCase()
const normalizeEmail = email => {
  const value = normalize(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new Error('A valid email is required')
  return value
}
const validatePassword = (password, field = 'Password') => {
  const value = String(password || '')
  if (value.length < 8) throw new Error(`${field} must be at least 8 characters`)
  return value
}
const userQuery = (identifier, withPassword = false) => {
  const value = normalize(identifier)
  const query = User.findOne({ $or: [{ userName: value }, { email: value }, { phone: value }] }).populate('roleId', 'roleName roleActive')
  return withPassword ? query.select('+password') : query
}
const issueTokens = async user => {
  const accessToken = jwt.sign({ id: String(user._id), email: user.email, roleId: String(user.roleId?._id || user.roleId) }, accessSecret(), { expiresIn: '15m' })
  const refreshToken = jwt.sign({ id: String(user._id), tokenId: crypto.randomUUID() }, refreshSecret(), { expiresIn: '7d' })
  await RefreshToken.create({ userId: user._id, tokenHash: hash(refreshToken), expiresAt: new Date(Date.now() + 7 * 86400000) })
  return { accessToken, refreshToken }
}
const issueOtp = async (identifier, purpose) => {
  const otp = crypto.randomInt(100000, 1000000).toString()
  await Otp.updateMany({ identifier, purpose, consumedAt: { $exists: false } }, { consumedAt: new Date() })
  await Otp.create({ identifier, purpose, otpHash: await bcrypt.hash(otp, 10), expiresAt: new Date(Date.now() + 10 * 60000) })
  await sendOtpEmail(identifier, otp, purpose)
}
const register = async payload => {
  const email = normalize(payload.email); const phone = String(payload.phone || '').trim(); const userName = normalize(payload.userName)
  if (!email || !phone || !payload.password || !payload.fullName) throw new Error('email, phone, password and fullName are required')
  if (await User.exists({ $or: [{ userName }, { email }, { phone }] })) throw new Error('Username, email or phone already exists')
  const role = await Role.findOne({ roleName: 'User', roleActive: true })
  if (!role) throw new Error('Default role not found')
  const user = await User.create({ userName: userName || undefined, email, phone, fullName: String(payload.fullName).trim(), password: await bcrypt.hash(payload.password, 10), authProvider: 'local', roleId: role._id })
  await issueOtp(email, 'register')
  return { message: 'Register successfully. Please confirm OTP.', otpIdentifier: email, user: user.toJSON() }
}
const confirmOtp = async ({ identifier, otp, purpose }) => {
  const record = await Otp.findOne({ identifier: normalize(identifier), purpose, consumedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).select('+otpHash').sort({ createdAt: -1 })
  if (!record || record.attemptCount >= 3) throw new Error('Invalid or expired OTP')
  const validOtp = await bcrypt.compare(String(otp || ''), record.otpHash)
  if (!validOtp) {
    record.attemptCount += 1
    await record.save()
    throw new Error('Invalid or expired OTP')
  }
  record.consumedAt = new Date()
  const resetToken = purpose === 'reset-password' ? crypto.randomBytes(32).toString('hex') : null
  if (resetToken) record.resetTokenHash = hash(resetToken)
  await record.save()
  const user = await userQuery(identifier)
  if (!user) throw new Error('User not found')
  if (purpose === 'register') { user.isVerified = true; await user.save(); return { user: user.toJSON(), ...(await issueTokens(user)) } }
  if (resetToken) return { resetToken }
  return { resetToken: crypto.randomBytes(32).toString('hex') }
}
const login = async ({ identifier, userName, email, password } = {}) => {
  const loginIdentifier = identifier || userName || email
  if (!loginIdentifier || !password) throw new Error('Identifier and password are required')
  const user = await userQuery(loginIdentifier, true)
  if (!user || !user.password || !(await bcrypt.compare(password || '', user.password))) throw new Error('Invalid credentials')
  if (user.isDisabled || !user.isVerified) throw new Error(user.isDisabled ? 'User account is disabled' : 'Please confirm email before login')
  return { user: user.toJSON(), ...(await issueTokens(user)) }
}
const googleLogin = async ({ credential, accessToken } = {}) => {
  if (!credential && !accessToken) throw new Error('Google credential is required')
  const clientId = process.env.GOOGLE_CLIENT_ID
  let googleUser

  if (credential) {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`)
    if (!response.ok) throw new Error('Invalid Google credential')
    googleUser = await response.json()
    if (!clientId || googleUser.aud !== clientId) throw new Error('Invalid Google credential')
  } else {
    const tokenInfoResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`)
    if (!tokenInfoResponse.ok) throw new Error('Invalid Google credential')
    const tokenInfo = await tokenInfoResponse.json()
    if (!clientId || tokenInfo.aud !== clientId) throw new Error('Invalid Google credential')
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!userInfoResponse.ok) throw new Error('Invalid Google credential')
    googleUser = await userInfoResponse.json()
  }

  if (!googleUser.email_verified) throw new Error('Google email is not verified')

  const email = normalizeEmail(googleUser.email)
  let user = await User.findOne({ email }).populate('roleId', 'roleName roleActive')
  if (user && user.authProvider !== 'google') throw new Error('An email account already exists with this email')
  if (!user) {
    const role = await Role.findOne({ roleName: 'User', roleActive: true })
    if (!role) throw new Error('Default role not found')
    user = await User.create({ email, fullName: googleUser.name || email.split('@')[0], authProvider: 'google', roleId: role._id, isVerified: true })
    user = await User.findById(user._id).populate('roleId', 'roleName roleActive')
  }
  if (user.isDisabled) throw new Error('User account is disabled')
  return { user: user.toJSON(), ...(await issueTokens(user)) }
}
const forgotPassword = async ({ email } = {}) => {
  const normalizedEmail = normalizeEmail(email)
  const user = await User.findOne({ email: normalizedEmail })
  if (!user) throw new Error('User not found')
  if (user.authProvider === 'google') throw new Error('This account uses Google login')
  await issueOtp(normalizedEmail, 'reset-password')
  return { message: 'Reset password OTP sent successfully' }
}
const resetPassword = async ({ email, otp, resetToken, newPassword } = {}) => {
  const normalizedEmail = normalizeEmail(email)
  const password = validatePassword(newPassword, 'New password')
  if (resetToken) {
    const tokenRecord = await Otp.findOne({ identifier: normalizedEmail, purpose: 'reset-password', resetTokenHash: hash(resetToken), expiresAt: { $gt: new Date() } }).select('+resetTokenHash')
    if (!tokenRecord) throw new Error('Invalid or expired reset token')
  } else {
    await confirmOtp({ identifier: normalizedEmail, otp, purpose: 'reset-password' })
  }
  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user) throw new Error('User not found')
  user.password = await bcrypt.hash(password, 10)
  await user.save()
  await RefreshToken.updateMany({ userId: user._id, revokedAt: { $exists: false } }, { revokedAt: new Date() })
  return { message: 'Password reset successfully' }
}
const changePassword = async (id, { currentPassword, newPassword } = {}) => {
  const password = validatePassword(newPassword, 'New password')
  const user = await User.findById(id).select('+password')
  if (!user || !user.password || !(await bcrypt.compare(currentPassword || '', user.password))) throw new Error('Current password is incorrect')
  if (user.authProvider === 'google') throw new Error('Google accounts cannot change password here')
  user.password = await bcrypt.hash(password, 10)
  await user.save()
  await RefreshToken.updateMany({ userId: id, revokedAt: { $exists: false } }, { revokedAt: new Date() })
  return { message: 'Password changed successfully' }
}
const refreshTokens = async token => { let payload; try { payload = jwt.verify(token, refreshSecret()) } catch { throw new Error('Invalid or expired refresh token') } const record = await RefreshToken.findOne({ tokenHash: hash(token), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).select('+tokenHash'); if (!record) throw new Error('Invalid or expired refresh token'); const user = await User.findById(payload.id).populate('roleId'); if (!user || user.isDisabled) throw new Error('Invalid or expired refresh token'); record.revokedAt = new Date(); await record.save(); return issueTokens(user) }
const logout = async token => { if (token) await RefreshToken.findOneAndUpdate({ tokenHash: hash(token), revokedAt: { $exists: false } }, { revokedAt: new Date() }); return { message: 'Logout successfully' } }
module.exports = { register, confirmOtp, login, googleLogin, forgotPassword, resetPassword, changePassword, refreshTokens, logout, verifyAccessToken: token => jwt.verify(token, accessSecret()) }
