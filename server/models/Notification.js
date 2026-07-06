const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
        index: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: [
            "REQUEST_RECEIVED",
            "REQUEST_ACCEPTED",
            "REQUEST_REJECTED",
            "REQUEST_CANCELLED",
            "REVIEW_RECEIVED",
            "SESSION_COMPLETED"
        ],
        required: true
    },
    message: {
        type:String,
        required: true
    },
    link: {
        type:String,
        default: "/profile"
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    read: {
        type: Boolean,
        default: false,
        index: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Notification", notificationSchema)