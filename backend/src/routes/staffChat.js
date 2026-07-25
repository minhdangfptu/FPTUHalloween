const express = require('express')
const controller = require('../controllers/staffChat')
const { requireAuth, requireRole } = require('../middlewares/auth')

const router = express.Router()
router.use(requireAuth, requireRole('Admin', 'Staff'))

router.get('/users/search', controller.searchUsers)
router.get('/conversations', controller.getConversations)
router.get('/conversations/:conversationId/messages', controller.getMessages)
router.post('/direct/:userId', controller.getDirectConversation)

router.get('/groups', controller.getGroups)
router.post('/groups', requireRole('Admin'), controller.createGroup)
router.patch('/groups/:groupId', requireRole('Admin'), controller.updateGroup)
router.patch('/groups/:groupId/status', requireRole('Admin'), controller.setGroupStatus)
router.post('/groups/:groupId/members', requireRole('Admin'), controller.addGroupMembers)
router.delete('/groups/:groupId/members/:userId', requireRole('Admin'), controller.removeGroupMember)

module.exports = router
