const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: true 
    },
    swapSkill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",        
    },
    isSwap: {
        type: Boolean,
        default: false
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: String,
    status: {
        type: String, enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED","COMPLETED"],
        default: "PENDING"
    },
    isLearning: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

module.exports = mongoose.model("request", requestSchema);