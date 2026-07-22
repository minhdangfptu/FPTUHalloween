const mongoose = require('mongoose')
const { User, Role } = require('../models')

const ensureId = id => {
  if (!mongoose.isValidObjectId(id)) throw new Error('Invalid user ID')
}

const sanitizeUser = doc => {
  if (!doc) return null
  const user = typeof doc.toObject === 'function' ? doc.toObject({ getters: false, virtuals: false }) : doc
  return {
    _id: user._id,
    userName: user.userName,
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    department: user.department,
    department_position: user.department_position,
    roleId: user.roleId,
    isVerified: user.isVerified,
    isDisabled: user.isDisabled,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

const promoteUserToStaff = async userId => {
  ensureId(userId)
  const staffRole = await Role.findOne({ roleName: 'Staff', roleActive: true }).lean()
  if (!staffRole) throw new Error('Staff role not found')
  const updated = await User.findByIdAndUpdate(
    userId,
    { $set: { roleId: staffRole._id } },
    { new: true, runValidators: true }
  ).populate('roleId', 'roleName').lean()
  if (!updated) throw new Error('User not found')
  return sanitizeUser(updated)
}

module.exports = { promoteUserToStaff }
