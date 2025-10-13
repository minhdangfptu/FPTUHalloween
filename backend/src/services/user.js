const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { User } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeUser(doc) {
  if (!doc) return null
  const { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at } = doc.toObject({ getters: false, virtuals: false })
  return { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at }
}

async function viewUserprofile(userId) {
  ensureId(userId, 'userId')
  const user = await User.findById(userId).populate('role_id', 'role_name')
  if (!user) throw new Error('Người dùng không tồn tại')
  return sanitizeUser(user)
}

async function editUserProfile(userId, payload = {}) {
  ensureId(userId, 'userId')
  const update = {}
  if (payload.full_name !== undefined) update.full_name = String(payload.full_name || '').trim()
  if (payload.phone_number !== undefined) update.phone_number = String(payload.phone_number || '').trim()
  if (Object.keys(update).length === 0) throw new Error('Không có trường nào để cập nhật')
  const updated = await User.findByIdAndUpdate(userId, update, { new: true })
  if (!updated) throw new Error('Người dùng không tồn tại')
  return sanitizeUser(updated)
}

async function changePassword(userId, payload = {}) {
  ensureId(userId, 'userId')
  const oldPassword = String(payload.old_password || '')
  const newPassword = String(payload.new_password || '')
  if (!oldPassword || !newPassword) throw new Error('Thiếu mật khẩu cũ hoặc mới')
  const user = await User.findById(userId)
  if (!user) throw new Error('Người dùng không tồn tại')
  const ok = await bcrypt.compare(oldPassword, user.password)
  if (!ok) throw new Error('Mật khẩu cũ không đúng')
  const hashed = await bcrypt.hash(newPassword, 10)
  await User.updateOne({ _id: userId }, { $set: { password: hashed } })
  return { changed: true }
}

module.exports = { viewUserprofile, editUserProfile, changePassword }



