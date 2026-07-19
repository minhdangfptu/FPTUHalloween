const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userId: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, required: true }
}, { collection: 'RefreshTokens', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.RefreshTokens || mongoose.model('RefreshTokens', schema)
