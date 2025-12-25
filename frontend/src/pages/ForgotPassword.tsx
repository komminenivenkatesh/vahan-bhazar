import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        return;
      }

      setMessage("Reset link sent to your email");
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: "100vh", 
        background: "#000000", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(192,192,192,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }} />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "40px",
            background: "rgba(26, 26, 26, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: "24px",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            zIndex: 1
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 style={{ 
              fontSize: "2rem", 
              fontWeight: 800, 
              marginBottom: "12px",
              background: "linear-gradient(135deg, #d4af37 0%, #e5e5e5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>
              Forgot Password?
            </h2>
            <p style={{ color: "#a0a0a0", fontSize: "0.95rem", lineHeight: 1.6 }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{ 
                background: "rgba(220, 38, 38, 0.1)", 
                border: "1px solid rgba(220, 38, 38, 0.2)", 
                color: "#ef4444", 
                padding: "12px", 
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              style={{ 
                background: "rgba(212, 175, 55, 0.1)", 
                border: "1px solid rgba(212, 175, 55, 0.2)", 
                color: "#d4af37", 
                padding: "12px", 
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}
            >
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: "#e5e5e5", marginBottom: "8px", fontSize: "0.9rem", fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#d4af37";
                  e.target.style.boxShadow = "0 0 0 2px rgba(212, 175, 55, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(135deg, #d4af37 0%, #c9a22e 100%)",
                color: "#000",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 10px 20px rgba(212, 175, 55, 0.2)"
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </motion.button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link 
              to="/login" 
              style={{ 
                color: "#c0c0c0", 
                textDecoration: "none", 
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "#d4af37"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#c0c0c0"}
            >
              ← Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;

