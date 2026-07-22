const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  ticketTypeName: { type: String },
  ticketTypePrice: { type: Number },
  availableQuantity: { type: String, required: true },
  totalQuantity: { type: Number, required: true, min: 0 },
  ticketTypeDate: { type: Number, required: true, min: 0 },
  ticketTypeTime: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  ticketTypeStatus: { type: String, default: 'active', enum: ['active', 'inactive'] },
  ticketType3dModel: { type: String, required: true }
}, { collection: 'TicketTypes', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.TicketTypes || mongoose.model('TicketTypes', schema)
