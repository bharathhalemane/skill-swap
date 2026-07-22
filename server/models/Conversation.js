const mongoose = require("mongoose")

const conversationSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "request",
        required: true,
        unique: true
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    lastMessageSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

conversationSchema.index({ participants: 1 })

module.exports = mongoose.model("Conversation", conversationSchema)