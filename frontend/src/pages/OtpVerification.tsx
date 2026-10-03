import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/Navbar";

const BACKEND_BASE = "https://vahan-bhazar-backend.onrender.com";

const OtpVerification: React.FC = () => {
  const { userId: routeUserId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [resending, setResending] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
    if (location.state && (location.state as any).infoMessage) {
      showMessage((location.state as any).infoMessage, "success");
    }
  }, [routeUserId, location.state]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);
  };

  const handleResendOtp = async (overrideEmail?: string) => {
    const targetEmail = overrideEmail || inputEmail;
    if (!userId && !targetEmail) {
      showMessage("Please enter your registered email address.", "error");
      return;
    }
    try {
      setResending(true);
      setMessage(null);

      const res = await fetch(`${BACKEND_BASE}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId || undefined, email: targetEmail || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        showMessage(data.message || "Failed to resend OTP.", "error");
      } else {
        if (data.userId) {
          setUserId(data.userId);
          localStorage.setItem("pendingUserId", data.userId);
        }
        showMessage(data.message || "New OTP sent! Please check your email inbox and spam folder.", "success");
      }
    } catch (err: any) {
      showMessage(err?.message ? `Network error: ${err.message}` : "Failed to resend OTP.", "error");
    } finally {
      setResending(false);
    }
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

      const res = await fetch(`${BACKEND_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp: emailOtp }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.message || "Failed to verify email.", "error");
        return;
      }

      showMessage("Email verified successfully! ✅ Redirecting to login...", "success");
      setTimeout(() => {
        localStorage.removeItem("pendingUserId");
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      showMessage("Network error while verifying email.", "error");
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("pendingUserId");
    navigate("/login");
  };

  return (
    <>
      <Navbar />
      <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', background: '#000000' }}>
        
        {/* Background Elements */}
        <motion.div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)',
            filter: 'blur(80px)',
            y: y1,
            zIndex: 0
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(192,192,192,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            y: y2,
            zIndex: 0
          }}
        />

        <div style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '120px 20px 40px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              width: '100%',
              maxWidth: '480px',
              background: 'rgba(20, 20, 20, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 700,
              textAlign: 'center',
              marginBottom: '10px',
              background: 'linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Verify Account
            </h2>
            
            <p style={{
              textAlign: 'center',
              color: '#a0a0a0',
              marginBottom: '30px',
              fontSize: '0.95rem'
            }}>
              Enter the 6-digit OTP sent to your email address.
            </p>

            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  background: messageType === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  border: `1px solid ${messageType === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
                  color: messageType === 'error' ? '#ef4444' : '#22c55e',
                  fontSize: '0.9rem',
                  textAlign: 'center'
                }}
              >
                {message}
              </motion.div>
            )}

            {!userId ? (
              <div style={{ marginBottom: '24px' }}>
                <p style={{ color: '#d4af37', fontSize: '0.9rem', marginBottom: '10px' }}>
                  Enter your registered email to receive an OTP:
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="email"
                    value={inputEmail}
                    placeholder="name@example.com"
                    onChange={(e) => setInputEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleResendOtp(inputEmail)}
                    disabled={resending || !inputEmail}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 18px',
                      color: '#000',
                      fontWeight: 600,
                      cursor: resending || !inputEmail ? 'not-allowed' : 'pointer',
                      opacity: resending || !inputEmail ? 0.7 : 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {resending ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Email OTP */}
            <form onSubmit={handleVerifyEmail} style={{ marginBottom: '30px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#d4af37', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Email OTP
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={emailOtp}
                    placeholder="Enter email OTP"
                    onChange={(e) => setEmailOtp(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loadingEmail || !userId}
                    style={{
                      background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 20px',
                      color: '#000',
                      fontWeight: 600,
                      cursor: loadingEmail || !userId ? 'not-allowed' : 'pointer',
                      opacity: loadingEmail || !userId ? 0.7 : 1
                    }}
                  >
                    {loadingEmail ? "..." : "Verify"}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                  <span style={{ color: '#888', fontSize: '0.85rem' }}>
                    Didn't get the email? Check Spam or
                  </span>
                  <button
                    type="button"
                    onClick={() => handleResendOtp()}
                    disabled={resending || !userId}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d4af37',
                      textDecoration: 'underline',
                      cursor: resending || !userId ? 'not-allowed' : 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      padding: 0
                    }}
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </div>
            </form>

            <button 
              onClick={handleGoToLogin}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '14px',
                color: '#d4af37',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Go to Login
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;

