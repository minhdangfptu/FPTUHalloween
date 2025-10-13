const mongoose = require('mongoose')
const { User, Role } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeUser(doc) {
  if (!doc) return null
  const { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at } = doc.toObject({ getters: false, virtuals: false })
  return { _id, email, full_name, phone_number, role_id, user_status, created_at, update_at }
}

async function promoteUserToStaff(userId) {
  ensureId(userId, 'userId')
  const staffRole = await Role.findOne({ role_name: 'Staff', role_active: true })
  if (!staffRole) throw new Error('Vai trò Staff không tồn tại')
  const updated = await User.findByIdAndUpdate(userId, { role_id: staffRole._id }, { new: true })
  if (!updated) throw new Error('Người dùng không tồn tại')
  return sanitizeUser(updated)
}

module.exports = { promoteUserToStaff }


