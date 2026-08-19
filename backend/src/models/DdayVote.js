const mongoose = require('mongoose')
const { Schema } = mongoose

const choiceSchema = new Schema({
  categoryId: { type: String, required: true, trim: true },
  optionId: { type: String, required: true, trim: true }
}, { _id: false })

const schema = new Schema({
  googleSubHash: { type: String, required: true, unique: true, index: true, select: false },
  googleEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 320 },
  googleName: { type: String, trim: true, maxlength: 200, default: '' },
  choices: { type: [choiceSchema], required: true },
  submissionId: { type: String, required: true, unique: true, index: true, trim: true },
  requestHash: { type: String, required: true, trim: true },
  submittedAt: { type: Date, required: true, default: Date.now, index: true }
}, { collection: 'DdayVotes', timestamps: false })

schema.index({ submittedAt: -1 })

module.exports = mongoose.models.DdayVotes || mongoose.model('DdayVotes', schema)
