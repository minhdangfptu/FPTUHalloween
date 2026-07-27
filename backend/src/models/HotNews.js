import mongoose from "mongoose";

const HotNews = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500,
        default: "Sự kiện FPTU Halloween sắp bùng nổ! 🦇"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    link: {
        type: String,
        maxlength: 2048,
        default: ""
    },
    displayOrder: {
        type: Number,
        default: null,
        index: true,
        min: 1
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.models.HotNews || mongoose.model('HotNews', HotNews)
