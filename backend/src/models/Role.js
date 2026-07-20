const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  roleName: { type: String, required: true },
  roleDescription: { type: String },
  roleActive: { type: Boolean, default: true }
}, { collection: 'Roles', timestamps: true })

module.exports = mongoose.models.Roles || mongoose.model('Roles', schema)
