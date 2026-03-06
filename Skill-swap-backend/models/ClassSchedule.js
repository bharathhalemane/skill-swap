const mongoose = require("mongoose")

const classScheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type : String,
        required: true 
    },
    day : {
        type: String,
        enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        required: true
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String
    }
}, { timeStamps: true })

module.exports = mongoose.model("ClassSchedule", classScheduleSchema)