const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  identifier: { type: String, required: true, lowercase: true, trim: true },
  purpose: { type: String, enum: ['register', 'reset-password'], required: true },
  otpHash: { type: String, required: true, select: false },
  expiresAt: { type: Date, required: true },
  attemptCount: { type: Number, default: 0 },
  consumedAt: { type: Date },
  resetTokenHash: { type: String, select: false }
}, { collection: 'Otps', timestamps: true })
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
module.exports = mongoose.models.Otps || mongoose.model('Otps', schema)
