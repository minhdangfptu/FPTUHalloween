const authService = require('../services/auth')
const staffChatService = require('../services/staffChat')

const PRESENCE_ROOM = 'staff-chat:presence'
const conversationRoom = conversationId => `staff-chat:conversation:${conversationId}`
const connectedUsers = new Map()

const getToken = socket => {
  const authToken = socket.handshake.auth?.token
  if (authToken) return String(authToken).replace(/^Bearer\s+/i, '')
  const header = socket.handshake.headers?.authorization || ''
  return header.startsWith('Bearer ') ? header.slice(7).trim() : ''
}

const getPresence = () => [...connectedUsers.entries()].map(([userId, sockets]) => ({
  userId,
  status: sockets.size > 0 ? 'online' : 'offline'
}))

const initializeStaffChatSocket = io => {
  io.use(async (socket, next) => {
    try {
      const token = getToken(socket)
      if (!token) return next(new Error('Authentication required'))
      const decoded = authService.verifyAccessToken(token)
      const user = await staffChatService.ensureStaffUser(decoded.id)
      socket.user = staffChatService.serializeUser(user)
      socket.userId = String(user._id)
      return next()
    } catch (error) {
      return next(new Error(error.message || 'Invalid authentication'))
    }
  })

  io.on('connection', socket => {
    const userId = socket.userId
    const sockets = connectedUsers.get(userId) || new Set()
    const wasOffline = sockets.size === 0
    sockets.add(socket.id)
    connectedUsers.set(userId, sockets)
    socket.join(PRESENCE_ROOM)
    socket.emit('presence:list', getPresence())
    if (wasOffline) io.to(PRESENCE_ROOM).emit('presence:update', { userId, status: 'online' })

    socket.on('conversation:join', async (payload = {}, ack = () => {}) => {
      try {
        const conversation = await staffChatService.assertConversationMember(payload.conversationId, userId)
        socket.join(conversationRoom(conversation._id))
        ack({ ok: true, conversationId: String(conversation._id) })
      } catch (error) {
        ack({ ok: false, message: error.message })
      }
    })

    socket.on('conversation:leave', (payload = {}) => {
      if (payload.conversationId) socket.leave(conversationRoom(payload.conversationId))
    })

    socket.on('message:send', async (payload = {}, ack = () => {}) => {
      try {
        const message = await staffChatService.sendMessage(userId, payload.conversationId, payload.content)
        io.to(conversationRoom(payload.conversationId)).emit('message:new', message)
        ack({ ok: true, message })
      } catch (error) {
        ack({ ok: false, message: error.message })
      }
    })

    socket.on('typing:start', async (payload = {}) => {
      if (!payload.conversationId) return
      try {
        await staffChatService.assertConversationMember(payload.conversationId, userId)
        socket.to(conversationRoom(payload.conversationId)).emit('typing:update', { conversationId: String(payload.conversationId), user: socket.user, isTyping: true })
      } catch (error) {
        void error
      }
    })

    socket.on('typing:stop', async (payload = {}) => {
      if (!payload.conversationId) return
      try {
        await staffChatService.assertConversationMember(payload.conversationId, userId)
        socket.to(conversationRoom(payload.conversationId)).emit('typing:update', { conversationId: String(payload.conversationId), user: socket.user, isTyping: false })
      } catch (error) {
        void error
      }
    })

    socket.on('conversation:read', async (payload = {}, ack = () => {}) => {
      try {
        const result = await staffChatService.markAsRead(userId, payload.conversationId)
        io.to(conversationRoom(payload.conversationId)).emit('conversation:read', result)
        ack({ ok: true, data: result })
      } catch (error) {
        ack({ ok: false, message: error.message })
      }
    })

    socket.on('disconnect', () => {
      const currentSockets = connectedUsers.get(userId)
      if (!currentSockets) return
      currentSockets.delete(socket.id)
      if (currentSockets.size === 0) {
        connectedUsers.delete(userId)
        io.to(PRESENCE_ROOM).emit('presence:update', { userId, status: 'offline' })
      }
    })
  })
}

module.exports = { initializeStaffChatSocket }
