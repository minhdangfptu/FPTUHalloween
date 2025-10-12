const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      enum: ['Admin', 'Staff', 'User', 'Guest']
    },
    role_description: { type: String, trim: true, default: '' },
    role_active: { type: Boolean, default: true }
  },
  {
    collection: 'Role',
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
);


module.exports = mongoose.models.Role || mongoose.model('Role', RoleSchema)
console.log('Role model loaded')
