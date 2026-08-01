const mongoose = require('mongoose')
const { Schema } = mongoose

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true },
  value: { type: Schema.Types.Mixed, required: true }
}, { _id: false })

const schema = new Schema({
  formId: { type: Schema.Types.ObjectId, ref: 'FeedbackForms', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true, index: true },
  targetType: { type: String, enum: ['attendee', 'staff'], required: true, index: true },
  answers: { type: [answerSchema], required: true, validate: value => value.length > 0 },
  submittedAt: { type: Date, default: Date.now }
}, { collection: 'FeedbackResponses', timestamps: true })

schema.index({ formId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.models.FeedbackResponses || mongoose.model('FeedbackResponses', schema)
