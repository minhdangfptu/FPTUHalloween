const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userName: { type: String, unique: true, sparse: true, trim: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: function () { return this.authProvider === 'local' }, select: false },
  phone: { type: String, required: function () { return this.authProvider === 'local' }, unique: true, sparse: true, trim: true },
  fullName: { type: String, trim: true },
  department: { type: String, default: null, trim: true },
  department_position: { type: String, default: null, trim: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local', required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Roles', required: true },
  isVerified: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false }
}, { collection: 'Users', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, toJSON: { transform(doc, ret) { delete ret.password; delete ret.__v; return ret } } })

module.exports = mongoose.models.Users || mongoose.model('Users', schema)
