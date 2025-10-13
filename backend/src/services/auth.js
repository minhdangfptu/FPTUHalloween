/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const { User, Role } = require('../models')

function getAccessSecret() { return process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret' }
function getRefreshSecret() { return process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret' }

async function hashPassword(password) { return await bcrypt.hash(password, 10) }
async function verifyPassword(password, hash) { return await bcrypt.compare(password, hash) }

function signAccessToken(payload, expiresIn = '15m') {
  return jwt.sign(payload, getAccessSecret(), { algorithm: 'HS256', expiresIn })
}
function signRefreshToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, getRefreshSecret(), { algorithm: 'HS256', expiresIn })
}
function verifyAccessToken(token) { return jwt.verify(token, getAccessSecret()) }
function verifyRefreshToken(token) { return jwt.verify(token, getRefreshSecret()) }

function sanitizeUser(doc) {
  if (!doc) return null
  const { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at } =
    doc.toObject({ getters: false, virtuals: false })
  return { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at }
}

/* -------------------- Refresh token denylist (in-memory) -------------------- */
// --- added: simple in-memory blacklist with auto-expiry cleanup
const revokedRefreshTokens = new Set()

function blacklistRefreshToken(token) {
  try {
    // Lấy exp để set auto-clean
    const decoded = jwt.decode(token) || {} // không verify để vẫn cleanup được
    const nowSec = Math.floor(Date.now() / 1000)
    const ttlMs = decoded.exp ? Math.max(0, (decoded.exp - nowSec) * 1000) : 0

    revokedRefreshTokens.add(token)
    if (ttlMs > 0) {
      setTimeout(() => revokedRefreshTokens.delete(token), ttlMs).unref?.()
    }
  } catch (_) {
    revokedRefreshTokens.add(token)
  }
}
function isRefreshTokenRevoked(token) {
  return revokedRefreshTokens.has(token)
}
/* --------------------------------------------------------------------------- */

async function register(payload = {}) {
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '')
  const full_name = String(payload.full_name || '').trim()
  const phone_number = String(payload.phone_number || '').trim()
  if (!email || !password || !full_name) throw new Error('Thiếu thông tin bắt buộc')
  const existed = await User.exists({ email })
  if (existed) throw new Error('Email đã tồn tại')
  const role = await Role.findOne({ role_name: 'User', role_active: true })
  if (!role) throw new Error('Vai trò mặc định không tồn tại')
  const roleId = role._id
  const created = await User.create({ email, password: await hashPassword(password), full_name, phone_number, role_id: roleId })
  return sanitizeUser(created)
}

async function login(payload = {}) {
  const email = String(payload.email || '').trim().toLowerCase()
  const password = String(payload.password || '')
  if (!email || !password) throw new Error('Thiếu email hoặc mật khẩu')
  const user = await User.findOne({ email })
  if (!user) throw new Error('Sai thông tin đăng nhập')
  if (user.user_status !== 1) throw new Error('Tài khoản không hoạt động')
  const ok = await verifyPassword(password, user.password)
  if (!ok) throw new Error('Sai thông tin đăng nhập')
  const claims = { uid: String(user._id), role: String(user.role_id) }
  const accessToken = signAccessToken(claims)
  const refreshToken = signRefreshToken(claims)
  return { accessToken, refreshToken, user: sanitizeUser(user) }
}

async function refreshTokens(refreshToken) {
  if (!refreshToken) throw new Error('Thiếu refresh token')

  if (isRefreshTokenRevoked(refreshToken)) {
    throw new Error('Refresh token đã bị thu hồi')
  }

  let decoded
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch (e) {
    throw new Error('Refresh token không hợp lệ')
  }

  blacklistRefreshToken(refreshToken)

  const claims = { uid: String(decoded.uid), role: String(decoded.role) }
  const accessToken = signAccessToken(claims)
  const newRefreshToken = signRefreshToken(claims)
  return { accessToken, refreshToken: newRefreshToken }
}

async function logout(refreshToken) {
  if (refreshToken) {
    blacklistRefreshToken(refreshToken)
  }
  return { loggedOut: true }
}

module.exports = {
  register,
  login,
  refreshTokens,
  logout,
  verifyAccessToken,
  verifyRefreshToken
}
