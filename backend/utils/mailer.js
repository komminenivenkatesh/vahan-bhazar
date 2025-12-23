// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/* =========================================================
   OTP EMAIL (UNCHANGED LOGIC – SAFE)
========================================================= */
async function sendOtpEmail(toEmail, otp, opts = {}) {
  const minutesValid = opts.minutesValid ?? 10;
  const appName = opts.appName ?? "Vahan Bazar";
  const logoUrl =
    opts.logoUrl ??
    "https://w7.pngwing.com/pngs/816/905/png-transparent-motorcycle-motorbike-logo.png";

  const textBody = `Your ${appName} verification code: ${otp}
It will expire in ${minutesValid} minutes.
Do not share this code with anyone.`;

  const htmlBody = `
  <!doctype html>
  <html>
    <body style="font-family: Arial; background:#f5f5f7; padding:20px;">
      <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;">
        <div style="padding:20px;text-align:center;">
          <img src="${logoUrl}" height="50" alt="${appName}" />
          <h2>Verify your email</h2>
          <p>Use the OTP below to verify your account</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code expires in ${minutesValid} minutes.</p>
        </div>
        <div style="padding:10px;text-align:center;color:#888;">
          ${appName}
        </div>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: `${appName} <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${appName} - Email Verification Code`,
    text: textBody,
    html: htmlBody,
  };

  return transporter.sendMail(mailOptions);
}

/* =========================================================
   RESET PASSWORD EMAIL (NEW)
========================================================= */
async function sendResetPasswordEmail(toEmail, resetLink, opts = {}) {
  const appName = opts.appName ?? "Vahan Bazar";
  const logoUrl =
    opts.logoUrl ??
    "https://w7.pngwing.com/pngs/816/905/png-transparent-motorcycle-motorbike-logo.png";

  const textBody = `Reset your ${appName} password using the link below:
${resetLink}

This link is valid for 15 minutes.
If you did not request this, ignore this email.`;

  const htmlBody = `
  <!doctype html>
  <html>
    <body style="font-family: Arial; background:#f5f5f7; padding:20px;">
      <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;">
        <div style="padding:24px;text-align:center;">
          <img src="${logoUrl}" height="50" alt="${appName}" />
          <h2>Password Reset Request</h2>
          <p>Click the button below to reset your password.</p>

          <a href="${resetLink}"
             style="display:inline-block;margin:20px 0;
             padding:12px 22px;background:#111827;color:#fff;
             text-decoration:none;border-radius:6px;">
             Reset Password
          </a>

          <p style="font-size:13px;color:#666;">
            This link expires in 15 minutes.
          </p>
        </div>

        <div style="padding:10px;text-align:center;color:#888;">
          If you didn’t request this, you can safely ignore this email.
        </div>
      </div>
    </body>
  </html>
  `;

  const mailOptions = {
    from: `${appName} <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${appName} - Reset Your Password`,
    text: textBody,
    html: htmlBody,
  };

  return transporter.sendMail(mailOptions);
}

/* ========================================================= */

module.exports = {
  sendOtpEmail,
  sendResetPasswordEmail,
};
