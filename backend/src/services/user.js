const mongoose = require('mongoose')
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

module.exports = { viewUserprofile }


