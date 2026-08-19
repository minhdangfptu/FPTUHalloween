const mongoose = require('mongoose')
const { Schema } = mongoose

const optionSchema = new Schema({
  optionId: { type: String, required: true, trim: true, maxlength: 100 },
  label: { type: String, required: true, trim: true, maxlength: 200 }
}, { _id: false })

const categorySchema = new Schema({
  categoryId: { type: String, required: true, trim: true, maxlength: 100 },
  label: { type: String, required: true, trim: true, maxlength: 200 },
  options: {
    type: [optionSchema],
    required: true,
    validate: value => Array.isArray(value) && value.length >= 2
  }
}, { _id: false })

const schema = new Schema({
  configKey: { type: String, required: true, unique: true, immutable: true, default: 'dday' },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  categories: {
    type: [categorySchema],
    required: true,
    validate: value => Array.isArray(value) && value.length > 0
  },
  status: { type: String, enum: ['draft', 'open', 'closed'], default: 'draft', index: true },
  openAt: { type: Date, default: null, index: true },
  closeAt: { type: Date, default: null, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'Users', default: null },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'Users', default: null },
  openedBy: { type: Schema.Types.ObjectId, ref: 'Users', default: null },
  closedBy: { type: Schema.Types.ObjectId, ref: 'Users', default: null },
  closedAt: { type: Date, default: null }
}, { collection: 'DdayVoteConfigs', timestamps: true })

module.exports = mongoose.models.DdayVoteConfigs || mongoose.model('DdayVoteConfigs', schema)
