const mongoose = require('mongoose');
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    halloween_id: { type: Schema.Types.ObjectId, ref: 'Halloween', required: true },
    full_name: { type: String, required: true, trim: true },
    phone_number: { type: String, trim: true, default: '' },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    feedback: { type: String, default: '' }
  },
  {
    collection: 'Feedback',
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
);

module.exports = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema) 
console.log('Feedback model loaded')
