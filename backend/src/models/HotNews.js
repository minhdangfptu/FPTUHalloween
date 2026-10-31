import mongoose from "mongoose";

const DEFAULT_CONTENT = [
    "Xin chào và hẹn gặp lại tại FPTU Halloween 2027!",
    "こんにちは！FPTUハロウィン2027でまたお会いしましょう！",
    "Hello, and see you again at FPTU Halloween 2027!"
].join("\n");

const HotNews = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        maxlength: 500,
        default: DEFAULT_CONTENT
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
