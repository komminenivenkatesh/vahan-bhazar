const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Basic fields
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // Verification flags
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    // OTP fields
    emailOtp: {
      type: String,
    },

    emailOtpExpiresAt: {
      type: Date,
    },

    phoneOtp: {
      type: String,
    },

    phoneOtpExpiresAt: {
      type: Date,
    },

    // 🔐 FORGOT PASSWORD FIELDS (NEW)
    resetToken: {
      type: String,
    },

    resetTokenExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
