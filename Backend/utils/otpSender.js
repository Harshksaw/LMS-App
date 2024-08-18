const axios = require('axios');

const sendOtp = async function sendOTP(otp, phone) {
    console.log(`OTP for ${phone} is ${otp} ${process.env.SMSKEY}`);
    // Send OTP to the phone number
    await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMSKEY}&route=otp&variables_values=${otp}&flash=0&numbers=${phone}`)
    return true;

}

module.exports = sendOtp