const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  fullName: { type: String, unique: true, trim: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Roles' },
  isVerified: { type: Boolean, default: false }
}, { collection: 'Users', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.Users || mongoose.model('Users', schema)
