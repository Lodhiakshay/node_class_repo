const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email should be unique"],
        trim: true
    },
    otp: {
        type: Number,
        default: 123456
    },
    isRegisterd: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User