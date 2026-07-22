const { Contact, User, Role } = require('../models')
const mongoose = require('mongoose')

const normalize = value => String(value || '').trim()

const createContact = async (payload = {}, userId) => {
  const data = {
    receiverName: normalize(payload.receiverName),
    phone: normalize(payload.phone),
    email: normalize(payload.email).toLowerCase(),
    topic: normalize(payload.topic),
    message: normalize(payload.message)
  }

  const missing = Object.entries(data).filter(([, value]) => !value).map(([field]) => field)
  if (missing.length) throw new Error(`${missing.join(', ')} are required`)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) throw new Error('A valid email is required')

  if (userId) data.userId = userId
  const contact = await Contact.create(data)
  return { message: 'Contact sent successfully', contact }
}

const validateContactId = contactId => {
  if (!mongoose.Types.ObjectId.isValid(contactId)) throw new Error('Invalid contact ID')
}

const getContacts = async ({ page = 1, pageSize = 20, search = '', status = '', role = '', sort = 'newest' } = {}) => {
  const filter = {}
  const normalizedSearch = String(search).trim()
  if (normalizedSearch) filter.receiverName = { $regex: normalizedSearch, $options: 'i' }
  if (status === 'done') filter.isContactted = true
  if (status === 'pending') filter.isContactted = false
  if (role === 'guest') filter.userId = null
  if (role === 'user') filter.userId = { $ne: null }
  if (role === 'admin' || role === 'staff') {
    const selectedRole = await Role.findOne({ roleName: new RegExp(`^${role}$`, 'i') }).select('_id').lean()
    const matchingUsers = selectedRole ? await User.find({ roleId: selectedRole._id }).select('_id').lean() : []
    filter.userId = { $in: matchingUsers.map(({ _id }) => _id) }
  }
  const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(pageSize, 10) || 20, 1), 100)
  const skip = (currentPage - 1) * limit
  const sortDirection = sort === 'oldest' ? 1 : -1
  const [contacts, total] = await Promise.all([
    Contact.find(filter).populate({ path: 'userId', select: 'roleId', populate: { path: 'roleId', select: 'roleName' } }).sort({ createdAt: sortDirection }).skip(skip).limit(limit).lean(),
    Contact.countDocuments(filter)
  ])
  return { contacts, pagination: { page: currentPage, pageSize: limit, total, totalPages: Math.ceil(total / limit) } }
}

const getContactById = async contactId => {
  validateContactId(contactId)
  const contact = await Contact.findById(contactId).lean()
  if (!contact) throw new Error('Contact not found')
  return contact
}

const deleteContact = async contactId => {
  validateContactId(contactId)
  const contact = await Contact.findByIdAndDelete(contactId).lean()
  if (!contact) throw new Error('Contact not found')
  return { message: 'Contact deleted successfully', contact }
}

const updateContactStatus = async (contactId, isContactted) => {
  validateContactId(contactId)
  if (typeof isContactted !== 'boolean') throw new Error('isContactted must be a boolean')
  const contact = await Contact.findByIdAndUpdate(
    contactId,
    { $set: { isContactted } },
    { new: true, runValidators: true }
  ).lean()
  if (!contact) throw new Error('Contact not found')
  return { message: 'Contact status updated successfully', contact }
}

module.exports = { createContact, getContacts, getContactById, deleteContact, updateContactStatus }
