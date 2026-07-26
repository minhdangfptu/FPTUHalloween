const mongoose = require('mongoose')

const memberStateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  lastReadAt: { type: Date, default: null }
}, { _id: false })

const schema = new mongoose.Schema({
  type: { type: String, enum: ['direct', 'group'], required: true, index: true },
  directKey: { type: String, unique: true, sparse: true, index: true },
  name: { type: String, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
  memberStates: { type: [memberStateSchema], default: [] },
  isActive: { type: Boolean, default: true, index: true },
  lastMessageAt: { type: Date, default: null, index: true },
  lastMessagePreview: { type: String, default: '' },
  lastMessageSenderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null }
}, { collection: 'ChatConversations', timestamps: true })

schema.index({ members: 1, lastMessageAt: -1 })
schema.index({ type: 1, isActive: 1, lastMessageAt: -1 })

module.exports = mongoose.models.ChatConversations || mongoose.model('ChatConversations', schema)
