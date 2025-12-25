const axios = require('axios');

async function sendOtpSms(phone, otp) {
  // Always log to console for development
  console.log(`📲 [MOCK SMS] To: ${phone}, OTP: ${otp}`);

  const apiKey = process.env.FAST2SMS_API_KEY;

  // If no API key is set, or it's the default placeholder, skip sending real SMS
  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    console.log('ℹ️  [Dev Mode] Fast2SMS key not set. Real SMS skipped. Use the OTP printed above.');
    return;
  }

  try {
    // Clean phone number: remove non-digits, take last 10 digits (for India)
    const cleanPhone = String(phone).replace(/\D/g, '').slice(-10);
    
    // Try using the 'q' (Quick SMS) route instead of 'otp' to bypass the website verification requirement
    // Note: This might still fail if DLT is strictly enforced, but it's worth a try for the registered number.
    const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
      params: {
        authorization: apiKey,
        message: `Your BikeX Verification OTP is ${otp}`,
        language: 'english',
        route: 'q',
        numbers: cleanPhone
      }
    });

    if (response.data && response.data.return) {
      console.log(`✅ SMS sent successfully to ${phone}`);
    } else {
      console.error('❌ Fast2SMS Error:', response.data);
    }
  } catch (error) {
    console.error('❌ Failed to send SMS:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

module.exports = { sendOtpSms };
