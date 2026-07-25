const mongoose = require('mongoose')
const { ChatConversation, ChatMessage, Role, User } = require('../models')

const MAX_MESSAGE_LENGTH = 2000
const MAX_PAGE_SIZE = 50
const buildError = (statusCode, message) => Object.assign(new Error(message), { statusCode })
const ensureId = (value, name) => {
  if (!mongoose.isValidObjectId(value)) throw buildError(400, `Invalid ${name}`)
}
const escapeRegex = value => String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const getStaffRoleIds = async () => {
  const roles = await Role.find({ roleName: { $in: ['Admin', 'Staff'] }, roleActive: true }).select('_id').lean()
  return roles.map(role => role._id)
}

const ensureStaffUser = async userId => {
  ensureId(userId, 'user ID')
  const roleIds = await getStaffRoleIds()
  const user = await User.findOne({ _id: userId, roleId: { $in: roleIds }, isDisabled: false })
    .select('_id userName fullName roleId isDisabled')
    .populate('roleId', 'roleName')
    .lean()
  if (!user) throw buildError(403, 'Only active Admin or Staff users can use staff chat')
  return user
}

const serializeUser = user => ({
  id: String(user._id || user.id),
  userName: user.userName,
  fullName: user.fullName,
  role: user.roleId?.roleName || user.role
})

const serializeConversation = conversation => ({
  id: String(conversation._id),
  type: conversation.type,
  name: conversation.name || null,
  description: conversation.description || '',
  members: (conversation.members || []).map(member => member._id ? serializeUser(member) : { id: String(member) }),
  isActive: conversation.isActive,
  lastMessageAt: conversation.lastMessageAt,
  lastMessagePreview: conversation.lastMessagePreview,
  memberStates: (conversation.memberStates || []).map(state => ({
    userId: String(state.userId),
    lastReadAt: state.lastReadAt
  }))
})

const serializeMessage = message => ({
  id: String(message._id),
  conversationId: String(message.conversationId),
  sender: message.senderId?._id ? serializeUser(message.senderId) : { id: String(message.senderId) },
  content: message.content,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt
})

const assertConversationMember = async (conversationId, userId, requireActive = true) => {
  ensureId(conversationId, 'conversation ID')
  await ensureStaffUser(userId)
  const query = { _id: conversationId, members: userId }
  if (requireActive) query.isActive = true
  const conversation = await ChatConversation.findOne(query)
  if (!conversation) throw buildError(403, 'You do not have access to this conversation')
  return conversation
}

const searchStaffUsers = async (userId, query) => {
  await ensureStaffUser(userId)
  const value = String(query || '').trim()
  if (value.length < 2) return []
  const roleIds = await getStaffRoleIds()
  const users = await User.find({
    roleId: { $in: roleIds },
    isDisabled: false,
    userName: { $regex: escapeRegex(value), $options: 'i' }
  }).select('userName fullName roleId').populate('roleId', 'roleName').sort({ userName: 1 }).limit(20).lean()
  return users.map(serializeUser)
}

const getConversations = async userId => {
  await ensureStaffUser(userId)
  const conversations = await ChatConversation.find({ members: userId, isActive: true })
    .populate('members', 'userName fullName roleId')
    .populate('members.roleId', 'roleName')
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .lean()
  return conversations.map(serializeConversation)
}

const getOrCreateDirectConversation = async (userId, otherUserId) => {
  await ensureStaffUser(userId)
  const otherUser = await ensureStaffUser(otherUserId)
  if (String(userId) === String(otherUser._id)) throw buildError(400, 'You cannot start a direct chat with yourself')
  const members = [String(userId), String(otherUser._id)].sort()
  const directKey = members.join(':')
  let conversation = await ChatConversation.findOne({ directKey }).populate('members', 'userName fullName roleId').populate('members.roleId', 'roleName').lean()
  if (!conversation) {
    try {
      const created = await ChatConversation.create({
        type: 'direct',
        directKey,
        createdBy: userId,
        members,
        memberStates: members.map(member => ({ userId: member }))
      })
      conversation = await ChatConversation.findById(created._id).populate('members', 'userName fullName roleId').populate('members.roleId', 'roleName').lean()
    } catch (error) {
      if (error.code !== 11000) throw error
      conversation = await ChatConversation.findOne({ directKey }).populate('members', 'userName fullName roleId').populate('members.roleId', 'roleName').lean()
    }
  }
  return serializeConversation(conversation)
}

const getGroups = async userId => {
  const requester = await ensureStaffUser(userId)
  const groupQuery = requester.roleId?.roleName === 'Admin'
    ? { type: 'group' }
    : { type: 'group', members: userId }
  const groups = await ChatConversation.find(groupQuery)
    .populate('members', 'userName fullName roleId')
    .populate('members.roleId', 'roleName')
    .sort({ isActive: -1, name: 1 })
    .lean()
  return groups.map(serializeConversation)
}

const createGroup = async (userId, payload) => {
  await ensureStaffUser(userId)
  const name = String(payload.name || '').trim()
  if (!name || name.length > 100) throw buildError(400, 'Group name is required and must be at most 100 characters')
  const memberIds = [...new Set([String(userId), ...(payload.memberIds || []).map(String)])]
  await Promise.all(memberIds.map(ensureStaffUser))
  const group = await ChatConversation.create({
    type: 'group',
    name,
    description: String(payload.description || '').trim().slice(0, 500),
    createdBy: userId,
    members: memberIds,
    memberStates: memberIds.map(member => ({ userId: member }))
  })
  return getGroupById(userId, group._id)
}

const getGroupById = async (userId, groupId) => {
  ensureId(groupId, 'group ID')
  const requester = await ensureStaffUser(userId)
  const conversation = await ChatConversation.findOne({ _id: groupId, type: 'group' })
    .populate('members', 'userName fullName roleId')
    .populate('members.roleId', 'roleName')
    .lean()
  if (!conversation) throw buildError(404, 'Group not found')
  const isMember = conversation.members.some(member => String(member._id) === String(userId))
  if (!isMember && requester.roleId?.roleName !== 'Admin') throw buildError(403, 'You do not have access to this group')
  return serializeConversation(conversation)
}

const updateGroup = async (userId, groupId, payload) => {
  await ensureStaffUser(userId)
  ensureId(groupId, 'group ID')
  const group = await ChatConversation.findOne({ _id: groupId, type: 'group' })
  if (!group) throw buildError(404, 'Group not found')
  const name = payload.name === undefined ? group.name : String(payload.name).trim()
  if (!name || name.length > 100) throw buildError(400, 'Group name is required and must be at most 100 characters')
  group.name = name
  if (payload.description !== undefined) group.description = String(payload.description).trim().slice(0, 500)
  await group.save()
  return getGroupById(userId, groupId)
}

const setGroupStatus = async (userId, groupId, isActive) => {
  await ensureStaffUser(userId)
  ensureId(groupId, 'group ID')
  if (typeof isActive !== 'boolean') throw buildError(400, 'isActive must be a boolean')
  const group = await ChatConversation.findOneAndUpdate({ _id: groupId, type: 'group' }, { isActive }, { new: true })
  if (!group) throw buildError(404, 'Group not found')
  return getGroupById(userId, groupId)
}

const addGroupMembers = async (userId, groupId, memberIds) => {
  await ensureStaffUser(userId)
  ensureId(groupId, 'group ID')
  if (!Array.isArray(memberIds) || memberIds.length === 0) throw buildError(400, 'memberIds is required')
  const group = await ChatConversation.findOne({ _id: groupId, type: 'group' })
  if (!group) throw buildError(404, 'Group not found')
  const ids = [...new Set(memberIds.map(String))]
  await Promise.all(ids.map(ensureStaffUser))
  group.members = [...new Set([...group.members.map(String), ...ids])]
  group.memberStates = group.members.map(member => group.memberStates.find(state => String(state.userId) === String(member)) || { userId: member })
  await group.save()
  return getGroupById(userId, groupId)
}

const removeGroupMember = async (userId, groupId, memberId) => {
  await ensureStaffUser(userId)
  ensureId(groupId, 'group ID')
  ensureId(memberId, 'member ID')
  const group = await ChatConversation.findOne({ _id: groupId, type: 'group' })
  if (!group) throw buildError(404, 'Group not found')
  if (String(group.createdBy) === String(memberId)) throw buildError(400, 'The group creator cannot be removed')
  group.members = group.members.filter(member => String(member) !== String(memberId))
  group.memberStates = group.memberStates.filter(state => String(state.userId) !== String(memberId))
  await group.save()
  return getGroupById(userId, groupId)
}

const getMessages = async (userId, conversationId, { before, limit = 30 } = {}) => {
  await assertConversationMember(conversationId, userId)
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), MAX_PAGE_SIZE)
  const query = { conversationId, deletedAt: null }
  if (before) {
    if (!mongoose.isValidObjectId(before)) throw buildError(400, 'Invalid before message ID')
    const cursor = await ChatMessage.findById(before).select('createdAt').lean()
    if (!cursor) throw buildError(400, 'Invalid before message ID')
    query.createdAt = { $lt: cursor.createdAt }
  }
  const messages = await ChatMessage.find(query).populate('senderId', 'userName fullName roleId').populate('senderId.roleId', 'roleName').sort({ createdAt: -1 }).limit(safeLimit).lean()
  return { messages: messages.reverse().map(serializeMessage), hasMore: messages.length === safeLimit }
}

const sendMessage = async (userId, conversationId, content) => {
  const conversation = await assertConversationMember(conversationId, userId)
  const value = String(content || '').trim()
  if (!value || value.length > MAX_MESSAGE_LENGTH) throw buildError(400, `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters`)
  const message = await ChatMessage.create({ conversationId, senderId: userId, content: value })
  conversation.lastMessageAt = message.createdAt
  conversation.lastMessagePreview = value.slice(0, 120)
  await conversation.save()
  const populated = await ChatMessage.findById(message._id).populate('senderId', 'userName fullName roleId').populate('senderId.roleId', 'roleName').lean()
  return serializeMessage(populated)
}

const markAsRead = async (userId, conversationId) => {
  const conversation = await assertConversationMember(conversationId, userId)
  const state = conversation.memberStates.find(item => String(item.userId) === String(userId))
  if (state) state.lastReadAt = new Date()
  else conversation.memberStates.push({ userId, lastReadAt: new Date() })
  await conversation.save()
  return { conversationId: String(conversationId), userId: String(userId), lastReadAt: new Date() }
}

module.exports = {
  searchStaffUsers,
  getConversations,
  getOrCreateDirectConversation,
  getGroups,
  createGroup,
  getGroupById,
  updateGroup,
  setGroupStatus,
  addGroupMembers,
  removeGroupMember,
  getMessages,
  sendMessage,
  markAsRead,
  assertConversationMember,
  serializeUser,
  ensureStaffUser
}
