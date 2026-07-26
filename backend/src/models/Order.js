const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String },
  paymentData: { type: Schema.Types.Mixed },
  stockReserved: { type: Boolean, default: false, index: true },
  reservationExpiresAt: { type: Date, index: true },
  payosOrderId: { type: String, required: true, unique: true, index: true },
  orderStatus: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Paid', 'Cancelled'] }
}, { collection: 'Orders', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.Orders || mongoose.model('Orders', schema)
