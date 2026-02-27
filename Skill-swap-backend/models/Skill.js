// import mongoose from "mongoose"
const mongoose = require("mongoose")

const instructorSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  major: String,
  year: String
})

const skillSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  instructor: instructorSchema,
  rating: Number,
  reviews: Number,
  duration: String,
  level: String,
  image: String,
  credits: Number,
  isGroupSession: Boolean,
  maxParticipants: Number
}, { timestamps: true })

module.exports = mongoose.model("Skill", skillSchema)