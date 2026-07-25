const svc = require('../services/staffChat')

const wrap = (fn, status = 200) => (req, res, next) => Promise.resolve(fn(req)).then(data => res.status(status).json({ success: true, data })).catch(next)

const searchUsers = wrap(req => svc.searchStaffUsers(req.user.id, req.query.q))
const getConversations = wrap(req => svc.getConversations(req.user.id))
const getDirectConversation = wrap(req => svc.getOrCreateDirectConversation(req.user.id, req.params.userId))
const getMessages = wrap(req => svc.getMessages(req.user.id, req.params.conversationId, req.query))
const getGroups = wrap(req => svc.getGroups(req.user.id))
const createGroup = wrap(req => svc.createGroup(req.user.id, req.body), 201)
const updateGroup = wrap(req => svc.updateGroup(req.user.id, req.params.groupId, req.body))
const setGroupStatus = wrap(req => svc.setGroupStatus(req.user.id, req.params.groupId, req.body.isActive))
const addGroupMembers = wrap(req => svc.addGroupMembers(req.user.id, req.params.groupId, req.body.memberIds))
const removeGroupMember = wrap(req => svc.removeGroupMember(req.user.id, req.params.groupId, req.params.userId))

module.exports = { searchUsers, getConversations, getDirectConversation, getMessages, getGroups, createGroup, updateGroup, setGroupStatus, addGroupMembers, removeGroupMember }
