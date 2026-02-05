import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!token) return setError("Invalid reset token.");
    if (!password || password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to reset password");
        return;
      }
      setMessage("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ width: 420, padding: 32, borderRadius: 16, background: "rgba(20,20,20,0.85)", border: "1px solid rgba(212,175,55,0.12)" }}>
          <h2 style={{ color: "#fff", marginBottom: 8 }}>Reset Password</h2>
          <p style={{ color: "#aaa", marginBottom: 16 }}>Enter a new password for your account.</p>

          {error && <div style={{ marginBottom: 12, color: "#ff6b6b" }}>{error}</div>}
          {message && <div style={{ marginBottom: 12, color: "#d4af37" }}>{message}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)", color: "#fff" }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <input type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)", color: "#fff" }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: 12, borderRadius: 8, background: "linear-gradient(135deg,#d4af37,#c9a22e)", border: "none", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Submitting..." : "Reset Password"}</button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
