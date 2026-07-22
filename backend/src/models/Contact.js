const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  receiverName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  topic: { type: String, required: true },
  message: { type: String, required: true },
  isContactted: { type: Boolean, default: false }
}, { collection: 'Contacts', timestamps: { createdAt: 'createdAt', updatedAt: false } })

module.exports = mongoose.models.Contacts || mongoose.model('Contacts', schema)
