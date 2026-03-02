// import mongoose from "mongoose"
const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    reg: "User",
    required: true
  },
  title: {
    type: String,
    required: "true"
  },
  category: {
    type: String,
    required: "true"
  },
  description: {
    type: String,
    required: "true"
  },
  duration: String,
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  imageUrl: {
    type: String,
    required: "true"
  }

}, { timestamps: true })

module.exports = mongoose.model("Skill", skillSchema)