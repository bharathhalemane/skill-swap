const mongoose = require("mongoose")

const availabilitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true    
    },
    day: {
        type: String,
        enum: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]       
    },
    slots: [
            {
                startTime: String
            }
        ]
})

module.exports = mongoose.model("Availability", availabilitySchema)