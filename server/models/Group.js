const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        mode: {
            type: String,
            enum: ["online", "offline"],
            required: true,
        },
        joinLink: {
            type: String
        },
        date: {
            type: Date, 
            required: true
        },
        time: {
            type: String,
            required: true
        },
        location: {
            type: String,
        },
        maxMembers: {
            type: Number,
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timeStamps: true }
);

module.exports = mongoose.model("Group", groupSchema);