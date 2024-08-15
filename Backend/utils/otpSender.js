export async function sendOTP(otp, phone) {
    console.log(`OTP for ${phone} is ${otp}`);
    // Send OTP to the phone number
    await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=Pm9exZLyD0AiEMO4okUhnwpBqlHjuYza26KvN78tVsXC3G1bgIKhHDNdzI4cjTteSCaiwkmsMLyAfEFV&route=otp&variables_values=${otp}&flash=1&numbers=${phone}`)
    return true;

}