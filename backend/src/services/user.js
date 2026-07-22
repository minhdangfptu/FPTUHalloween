const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { User, Role } = require('../models')

const { isValidObjectId } = mongoose

function ensureId(id, name = 'id') {
  if (!isValidObjectId(id)) throw new Error(`Invalid ${name}`)
}

function sanitizeUser(doc) {
  if (!doc) return null
  const user = typeof doc.toObject === 'function' ? doc.toObject({ getters: false, virtuals: false }) : doc
  return {
    _id: user._id,
    userName: user.userName,
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

async function getUsers({ page = 1, pageSize = 20, search = '', role = '', department = '', position = '', status = '' } = {}) {
  const filter = {}
  const normalizedSearch = String(search).trim()
  if (normalizedSearch) filter.$or = [
    { fullName: { $regex: normalizedSearch, $options: 'i' } },
    { email: { $regex: normalizedSearch, $options: 'i' } },
  ]
  if (department) filter.department = department
  if (position) filter.department_position = position
  if (status === 'active') filter.isDisabled = false
  if (status === 'disabled') filter.isDisabled = true
  if (role) {
    const selectedRole = await Role.findOne({ roleName: role }).select('_id').lean()
    filter.roleId = selectedRole?._id || null
  }
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const skip = (currentPage - 1) * limit
  const [users, total, departments, positions, roles] = await Promise.all([
    User.find(filter).select('-password').populate('roleId', 'roleName').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
    User.distinct('department', { department: { $nin: [null, ''] } }),
    User.distinct('department_position', { department_position: { $nin: [null, ''] } }),
    Role.find({ roleActive: true }).select('roleName -_id').sort({ roleName: 1 }).lean()
  ])
  return {
    users: users.map(sanitizeUser),
    filterOptions: { departments: departments.sort(), positions: positions.sort(), roles: roles.map(({ roleName }) => roleName) },
    pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) }
  }
}

async function getUserById(userId) {
  ensureId(userId, 'userId')
  const user = await User.findById(userId).select('-password').populate('roleId', 'roleName').lean()
  if (!user) throw new Error('User not found')
  return sanitizeUser(user)
}

async function disableUser(userId, adminId) {
  ensureId(userId, 'userId')
  if (String(userId) === String(adminId)) throw new Error('Administrators cannot disable their own account')
  const user = await User.findByIdAndUpdate(userId, { $set: { isDisabled: true } }, { new: true, runValidators: true }).select('-password').populate('roleId', 'roleName').lean()
  if (!user) throw new Error('User not found')
  return sanitizeUser(user)
}

async function enableUser(userId) {
  ensureId(userId, 'userId')
  const user = await User.findByIdAndUpdate(userId, { $set: { isDisabled: false } }, { new: true, runValidators: true }).select('-password').populate('roleId', 'roleName').lean()
  if (!user) throw new Error('User not found')
  return sanitizeUser(user)
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

module.exports = { viewUserprofile, editUserProfile, changePassword, getUsers, getUserById, disableUser, enableUser }
