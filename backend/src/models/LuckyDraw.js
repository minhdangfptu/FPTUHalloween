const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  createAt: { type: Date, default: Date.now, index: true },
  name: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, trim: true, unique: true, index: true },
  prize: { type: String, default: '', trim: true }
}, { collection: 'LuckyDraw', versionKey: false })

schema.index({ name: 'text', phoneNumber: 'text', prize: 'text' })

module.exports = mongoose.models.LuckyDraw || mongoose.model('LuckyDraw', schema)
