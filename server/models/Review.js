const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    request: {
      type: mongoose.Schema.Types.ObjectId, 
        ref: "request",
        required: true,
        unique: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1, max: 5
    },
    review: {
        type: String, 
        trim: true,
        required: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

reviewSchema.index({teacher: 1, createdAt: -1})

module.exports = mongoose.model("Review", reviewSchema)