const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users' },
  orderId: { type: Schema.Types.ObjectId, ref: 'Orders' },
  ticketTypeId: { type: Schema.Types.ObjectId, ref: 'TicketTypes' },
  qrCodeData: { type: String, required: true },
  ticketStatus: { type: String, default: 'Pending', enum: ['Pending', 'Checked', 'Cancelled'] },
  checkedInAt: { type: Date },
  staffCheckInId: { type: Schema.Types.ObjectId, ref: 'Users' }
}, { collection: 'Tickets', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.Tickets || mongoose.model('Tickets', schema)
