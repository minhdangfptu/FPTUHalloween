const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 300 },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  image: { type: [String], default: [] },
  fbPostId: { type: String, required: true, trim: true },
  pageId: { type: String, trim: true, default: 'legacy' },
  permalinkUrl: { type: String, trim: true, maxlength: 2048, default: '' },
  publishedAt: { type: Date, index: true, default: null },
  facebookUpdatedAt: { type: Date, default: null },
  lastSyncedAt: { type: Date, default: null },
  reacts: { type: Number, min: 0, default: 0 },
  shares: { type: Number, min: 0, default: 0 },
  isFeatured: { type: Boolean, default: false, index: true },
  featuredOrder: { type: Number, min: 0, default: 0 },
  featuredAt: { type: Date, default: null },
  isAvailable: { type: Boolean, default: true, index: true }
}, {
  collection: 'News',
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.__v
      return ret
    }
  }
})

schema.index({ pageId: 1, fbPostId: 1 }, { unique: true })
schema.index({ title: 'text', content: 'text' })
schema.index({ isAvailable: 1, publishedAt: -1 })
schema.index({ isAvailable: 1, isFeatured: 1, featuredOrder: -1, publishedAt: -1 })

module.exports = mongoose.models.News || mongoose.model('News', schema)
