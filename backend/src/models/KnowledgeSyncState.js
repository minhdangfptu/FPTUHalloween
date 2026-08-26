const mongoose = require('mongoose')

const statsSchema = new mongoose.Schema({
  received: { type: Number, min: 0, default: 0 },
  inserted: { type: Number, min: 0, default: 0 },
  updated: { type: Number, min: 0, default: 0 }
}, { _id: false })

const schema = new mongoose.Schema({
  source: { type: String, required: true, unique: true, trim: true },
  status: {
    type: String,
    enum: ['idle', 'running', 'success', 'error', 'unconfigured'],
    default: 'idle',
    index: true
  },
  pageId: { type: String, trim: true, default: '' },
  lastAttemptAt: { type: Date, default: null },
  lastSuccessAt: { type: Date, default: null },
  lastError: { type: String, maxlength: 2000, default: '' },
  stats: { type: statsSchema, default: () => ({}) }
}, { collection: 'KnowledgeSyncStates', timestamps: true })

module.exports = mongoose.models.KnowledgeSyncStates || mongoose.model('KnowledgeSyncStates', schema)
