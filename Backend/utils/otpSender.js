export async function sendOTP(otp, phone) {
    console.log(`OTP for ${phone} is ${otp}`);
    // Send OTP to the phone number
    await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMSKEY}&route=otp&variables_values=${otp}&flash=1&numbers=${phone}`)
    return true;

}