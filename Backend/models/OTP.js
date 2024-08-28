const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    phoneNumber:{
        type:Number,

    },
    otp: {
        type:String,
        required:true,
    },
    createdAt: {
        type:Date,
        default:Date.now(),
        expires: 30*60,
    }
});


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;