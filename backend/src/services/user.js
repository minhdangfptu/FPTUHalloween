const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { User } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeUser(doc) {
  if (!doc) return null
  const user = doc.toObject({ getters: false, virtuals: false })
  return {
    _id: user._id,
    email: user.email,
    phone: user.phone,
    fullName: user.fullName,
    department: user.department,
    department_position: user.department_position,
    authProvider: user.authProvider,
    roleId: user.roleId,
    isVerified: user.isVerified,
    isDisabled: user.isDisabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

async function viewUserprofile(userId) {
  ensureId(userId, 'userId')
  const user = await User.findById(userId).populate('roleId', 'roleName')
  if (!user) throw new Error('User not found')
  return sanitizeUser(user)
}

async function editUserProfile(userId, payload = {}) {
  ensureId(userId, 'userId')
  const update = {}
  if (payload.fullName !== undefined || payload.full_name !== undefined) update.fullName = String(payload.fullName ?? payload.full_name ?? '').trim()
  if (payload.phone !== undefined || payload.phone_number !== undefined) update.phone = String(payload.phone ?? payload.phone_number ?? '').trim()
  if (Object.keys(update).length === 0) throw new Error('No editable fields provided')
  const updated = await User.findByIdAndUpdate(userId, update, { new: true, runValidators: true }).populate('roleId', 'roleName')
  if (!updated) throw new Error('User not found')
  return sanitizeUser(updated)
}

async function changePassword(userId, payload = {}) {
  ensureId(userId, 'userId')
  const oldPassword = String(payload.old_password || '')
  const newPassword = String(payload.new_password || '')
  if (!oldPassword || !newPassword) throw new Error('Current and new passwords are required')
  const user = await User.findById(userId).select('+password')
  if (!user) throw new Error('User not found')
  const ok = await bcrypt.compare(oldPassword, user.password)
  if (!ok) throw new Error('Current password is incorrect')
  const hashed = await bcrypt.hash(newPassword, 10)
  await User.updateOne({ _id: userId }, { $set: { password: hashed } })
  return { changed: true }
}

module.exports = { viewUserprofile, editUserProfile, changePassword }
