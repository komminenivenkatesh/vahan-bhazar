// backend/utils/sendSms.js

async function sendOtpSms(phone, otp) {
  // For now we just log the OTP to the terminal
  console.log(`📲 SMS OTP for ${phone}: ${otp}`);
}

module.exports = { sendOtpSms };
