const mongoose = require('mongoose')
const { Schema } = mongoose

const questionSchema = new Schema({
  question: { type: String, required: true, trim: true, maxlength: 500 },
  type: {
    type: String,
    enum: ['rating', 'text', 'single_choice', 'multiple_choice'],
    required: true
  },
  options: [{ type: String, trim: true, maxlength: 200 }],
  required: { type: Boolean, default: false },
  order: { type: Number, required: true, min: 1 }
}, { _id: true })

const schema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000 },
  targetType: {
    type: String,
    enum: ['attendee', 'staff'],
    required: true,
    index: true
  },
  openAt: { type: Date, required: true, index: true },
  closeAt: { type: Date, required: true, index: true },
  questions: { type: [questionSchema], required: true, validate: value => value.length > 0 },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft',
    index: true
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Users' }
}, { collection: 'FeedbackForms', timestamps: true })

schema.index({ targetType: 1 }, { unique: true })
schema.pre('validate', function (next) {
  if (this.openAt && this.closeAt && this.openAt >= this.closeAt) {
    this.invalidate('closeAt', 'Close time must be later than open time')
  }
  next()
})

module.exports = mongoose.models.FeedbackForms || mongoose.model('FeedbackForms', schema)
