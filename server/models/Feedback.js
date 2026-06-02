const mongoose = require("mongoose")

const FeedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "Anonymous"
    },
    email: {
        type: String,
        trim: true,
        lowerCase: true,
        default: ""
    },
    feedbackType: {
        type: String,
        enum: ["bug report", "suggestion", "praise", "other"],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    message: {
        type: String,
        required: true,
        trim: true
    },

}, {
    timestamps: true
});

module.exports = mongoose.model("Feedback", FeedbackSchema)
