const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        require: [true, "Please input your OTP"]
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {type: Date, default: Date.now(), index: {expires: 1200}}
},{timestamps: true})

module.exports = mongoose.model("otp", otpSchema)