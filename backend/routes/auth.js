// backend/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateOtp } = require("../utils/otp");
const crypto = require("crypto");
const {
  sendOtpEmail,
  sendResetPasswordEmail,
} = require("../utils/mailer");

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { name, email, phone, password }
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    try {
      await sendResetPasswordEmail(email, resetLink);
    } catch (e) {
      console.error("Warning: failed to send reset email", e);
    }

    res.json({ message: "Reset link processed (if email configured, link was sent)." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already in use." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const emailOtp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      isEmailVerified: false,
      isPhoneVerified: true, // phone verification bypassed
      emailOtp,
      emailOtpExpiresAt: otpExpiry,
    });

    await user.save();

    let emailStatusMessage = "OTP sent to your email address.";
    try {
      await Promise.race([
        sendOtpEmail(email, emailOtp),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email server timed out")), 4000))
      ]);
      console.log(`📧 OTP email sent to ${email}`);
    } catch (e) {
      console.error("Warning: email sending failed:", e.message);
      emailStatusMessage = `Notice: Render Free blocks SMTP (${e.message}). Verification OTP: ${emailOtp}`;
    }

    return res.status(201).json({
      message: emailStatusMessage,
      userId: user._id,
      otp: emailOtp,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/auth/resend-otp
 * Body: { userId, email }
 */
router.post("/resend-otp", async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId && !email) {
      return res.status(400).json({ message: "User ID or registered email is required." });
    }

    let user = null;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email: email.trim().toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ message: "Account not found for the provided information." });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified. You can log in directly." });
    }

    const newOtp = generateOtp(6);
    user.emailOtp = newOtp;
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      await Promise.race([
        sendOtpEmail(user.email, newOtp),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Email server timed out")), 4000))
      ]);
      console.log(`📧 Resent OTP to ${user.email}`);
      return res.json({
        message: `New OTP sent to ${user.email}! Please check inbox and spam folder.`,
        userId: user._id,
        email: user.email,
        otp: newOtp
      });
    } catch (mailErr) {
      console.error("Failed to resend email:", mailErr.message);
      return res.json({
        message: `Notice: Render Free blocks SMTP (${mailErr.message}). Your verification OTP is: ${newOtp}`,
        userId: user._id,
        email: user.email,
        otp: newOtp
      });
    }
  } catch (err) {
    console.error("Resend OTP error:", err);
    return res.status(500).json({ message: "Server error while resending OTP." });
  }
});

/**
 * POST /api/auth/login
 * Body: { emailOrPhone, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "Email/phone and password required." });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email first.",
        isEmailVerified: false,
        userId: user._id,
        email: user.email,
      });
    }

    // Optional: enforce phone verification too
    // if (!user.isPhoneVerified) {
    //   return res.status(403).json({ message: "Please verify your phone number first." });
    // }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "dev-secret-key",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/auth/verify-email
 * Body: { userId, otp }
 */
router.post("/verify-email", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and otp are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.emailOtp || !user.emailOtpExpiresAt) {
      return res.status(400).json({ message: "No OTP generated for this user." });
    }

    if (user.emailOtpExpiresAt < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.emailOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("verify-email error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/auth/verify-phone
 * Body: { userId, otp }
 */
router.post("/verify-phone", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "userId and otp are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (!user.phoneOtp || !user.phoneOtpExpiresAt) {
      return res
        .status(400)
        .json({ message: "No OTP generated for this user." });
    }

    if (user.phoneOtpExpiresAt < new Date()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    if (user.phoneOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    user.isPhoneVerified = true;
    user.phoneOtp = undefined;
    user.phoneOtpExpiresAt = undefined;
    await user.save();

    return res.json({ message: "Phone number verified successfully." });
  } catch (error) {
    console.error("verify-phone error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/auth/reset-password
 * Body: { token, newPassword }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and newPassword are required." });
    }

    const user = await User.findOne({ resetToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token." });

    if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiresAt = undefined;
    // mark email as verified after successful password reset to allow login
    user.isEmailVerified = true;
    await user.save();

    try {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const loginUrl = `${frontendUrl}/login`;
      await sendResetPasswordEmail(user.email, loginUrl);
    } catch (e) {
      console.error("Warning: failed to send confirmation email", e);
    }

    return res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error("reset-password error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
