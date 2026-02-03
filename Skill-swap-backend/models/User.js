const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    jwt_token : {
        type: String,        
    },
    googleId: {
        type: String,
    },
     githubId: {
        type:String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    }    
},
{timestamps: true})

module.exports = mongoose.model("User", userSchema)