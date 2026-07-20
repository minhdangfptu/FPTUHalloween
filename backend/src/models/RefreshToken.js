const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date }
}, { collection: 'RefreshTokens', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.models.RefreshTokens || mongoose.model('RefreshTokens', schema)
