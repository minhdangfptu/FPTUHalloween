const mongoose = require('mongoose');
const { Schema } = mongoose;

const HalloweenSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // người tạo/sở hữu
    event_name: { type: String, required: true, trim: true },
    event_year: { type: Number, required: true, min: 1900, max: 3000 },
    event_description: { type: String, default: '' },
    event_concept: { type: String, default: '' },
    event_start_time: { type: Date, required: true },
    event_end_time: { type: Date, required: true },
    event_location: { type: String, default: '' },
    event_status: { type: Number, enum: [0,1,2,3], default: 1 }, // 0=draft,1=upcoming/active,2=finished,3=canceled
    event_image_url: { type: String, default: '' },
    ticket_url: { type: String, default: '' },
    ticket_image_url: { type: String, default: '' }
  },
  {
    collection: 'Halloween',
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
);

HalloweenSchema.index({ event_year: 1, event_name: 1 }, { unique: false });
HalloweenSchema.index({ user_id: 1 });
HalloweenSchema.index({ event_status: 1, event_start_time: 1 });

HalloweenSchema.pre('validate', function(next) {
  if (this.event_start_time && this.event_end_time && this.event_end_time < this.event_start_time) {
    return next(new Error('event_end_time phải sau event_start_time'));
  }
  next();
});

module.exports = mongoose.models.Halloween || mongoose.model('Halloween', HalloweenSchema)
console.log('Halloween model loaded')
