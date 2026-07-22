const mongoose = require('mongoose')
const { Schema } = mongoose

const cartItemSchema = new Schema({
  ticketTypeId: { type: Schema.Types.ObjectId, ref: 'TicketTypes', required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false })

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, unique: true, index: true },
  items: { type: [cartItemSchema], default: [] }
}, { collection: 'Carts', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.Carts || mongoose.model('Carts', schema)
