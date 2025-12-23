// backend/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { generateOtp } = require("../utils/otp");
const { sendOtpSms } = require("../utils/sendSms");
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

   const resetLink = `http://192.168.1.5:3000/reset-password/${token}`;


    await sendResetPasswordEmail(
      email,
      "Password Reset",
      `Click this link to reset your password:\n${resetLink}`
    );

    res.json({ message: "Reset link sent to email" });
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
    const phoneOtp = generateOtp(6);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = new User({
      name,
      email,
      phone,
      passwordHash,
      isEmailVerified: false,
      isPhoneVerified: false,
      emailOtp,
      emailOtpExpiresAt: otpExpiry,
      phoneOtp,
      phoneOtpExpiresAt: otpExpiry,
    });

    await user.save();

    await sendOtpEmail(email, emailOtp);
    await sendOtpSms(phone, phoneOtp);

    return res.status(201).json({
      message: "User registered. OTPs sent to email and phone.",
      userId: user._id,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error." });
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
      return res.status(403).json({ message: "Please verify your email first." });
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

module.exports = router;
