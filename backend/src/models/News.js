const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: [String], required: true },
  fbPostId: { type: String, required: true },
  reacts: { type: Number }
}, { collection: 'News', timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

module.exports = mongoose.models.News || mongoose.model('News', schema)
