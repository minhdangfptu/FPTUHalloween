const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true }, // lưu hash (bcrypt)
    full_name: { type: String, required: true, trim: true },
    phone_number: {
      type: String,
      trim: true,
      default: '',
      // VN: 84/0 + 9-10 số; chỉnh lại nếu bạn muốn format khác
      match: [/^(\+?84|0)\d{9,10}$/, 'Số điện thoại không hợp lệ']
    },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    user_status: { type: Number, enum: [0,1,2], default: 1 } // 0=inactive, 1=active, 2=banned
  },
  {
    collection: 'User',
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
);



module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
console.log('User model loaded')
