const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsSchema = new Schema(
  {
    halloween_id: { type: Schema.Types.ObjectId, ref: 'Halloween', required: true },
    news__title: { type: String, required: true, trim: true }, // theo đúng key bạn đang dùng
    news_image_url: { type: String, default: '' },
    news_type: {
      type: [String],
      default: [],
      validate: {
        validator(arr) {
          const allowed = ['announcement', 'concept', 'ghost_house', 'sale', 'update', 'general'];
          return arr.every(t => allowed.includes(t));
        },
        message: 'news_type chứa giá trị không hợp lệ'
      }
    },
    news_date: { type: Date, required: true },
    news_url: { type: String, default: '' }
  },
  {
    collection: 'News',
    timestamps: { createdAt: 'created_at', updatedAt: 'update_at' }
  }
);

module.exports = mongoose.models.News || mongoose.model('News', NewsSchema)
console.log('News model loaded')

