import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const OtpVerification: React.FC = () => {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);

  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPhone, setLoadingPhone] = useState(false);

  // Get userId from route OR localStorage
  useEffect(() => {
    if (routeUserId) {
      setUserId(routeUserId);
      localStorage.setItem("pendingUserId", routeUserId);
    } else {
      const stored = localStorage.getItem("pendingUserId");
      if (stored) {
        setUserId(stored);
      }
    }
  }, [routeUserId]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      showMessage("User not found. Please register again.", "error");
      return;
    }
    if (!emailOtp) {
      showMessage("Please enter email OTP.", "error");
      return;
    }

    try {
      setLoadingEmail(true);
      setMessage(null);

      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: emailOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to verify email.", "error");
        return;
      }

      showMessage("Email verified successfully ✅", "success");
    } catch (err) {
      console.error(err);
      showMessage("Network error while verifying email.", "error");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleVerifyPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      showMessage("User not found. Please register again.", "error");
      return;
    }
    if (!phoneOtp) {
      showMessage("Please enter phone OTP.", "error");
      return;
    }

    try {
      setLoadingPhone(true);
      setMessage(null);

      const res = await fetch("http://localhost:5000/api/auth/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: phoneOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to verify phone.", "error");
        return;
      }

      showMessage("Phone number verified successfully ✅", "success");
    } catch (err) {
      console.error(err);
      showMessage("Network error while verifying phone.", "error");
    } finally {
      setLoadingPhone(false);
    }
  };

  const handleGoToLogin = () => {
    // once both verified (or at least email), you can send user to login
    localStorage.removeItem("pendingUserId");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-card">
          <h2>Verify your account</h2>
          <p className="auth-subtitle">
            Enter the OTPs sent to your email and phone number.
          </p>

          {message && (
            <div
              className={`auth-message ${
                messageType === "error" ? "error" : "success"
              }`}
            >
              {message}
            </div>
          )}

          {!userId && (
            <p className="auth-warning">
              No user found. Please go back and register again.
            </p>
          )}

          {/* Email OTP */}
          <form onSubmit={handleVerifyEmail} className="auth-form">
            <div className="form-group">
              <label htmlFor="emailOtp">Email OTP</label>
              <input
                id="emailOtp"
                type="text"
                value={emailOtp}
                placeholder="Enter email OTP"
                onChange={(e) => setEmailOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="auth-btn"
              disabled={loadingEmail || !userId}
            >
              {loadingEmail ? "Verifying email..." : "Verify Email"}
            </button>
          </form>

          {/* Phone OTP */}
          <form onSubmit={handleVerifyPhone} className="auth-form">
            <div className="form-group">
              <label htmlFor="phoneOtp">Phone OTP</label>
              <input
                id="phoneOtp"
                type="text"
                value={phoneOtp}
                placeholder="Enter phone OTP"
                onChange={(e) => setPhoneOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="auth-btn"
              disabled={loadingPhone || !userId}
            >
              {loadingPhone ? "Verifying phone..." : "Verify Phone"}
            </button>
          </form>

          <div className="auth-footer">
            <button className="link-btn" onClick={handleGoToLogin}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
