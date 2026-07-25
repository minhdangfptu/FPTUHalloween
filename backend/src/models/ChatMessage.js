const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversations', required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  deletedAt: { type: Date, default: null }
}, { collection: 'ChatMessages', timestamps: true })

schema.index({ conversationId: 1, createdAt: -1 })

module.exports = mongoose.models.ChatMessages || mongoose.model('ChatMessages', schema)
