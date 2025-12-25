import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import "../App.css";
import Navbar from "../components/Navbar";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { scrollYProgress } = useScroll();
  const layerBgY = useTransform(scrollYProgress, [0, 1], ["0%", "-16%"]);
  const layerGlowY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const layerGrainY = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);

  const float = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { type: "spring", stiffness: 120, damping: 18 },
  } as const;

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  const handleModeChange = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setMessage(null);
    setMessageType(null);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setMessageType(null);

    // Basic validation
    if (!email || !password || (!isLogin && (!name || !phone))) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      let body: any;

      if (isLogin) {
        // backend expects: { emailOrPhone, password }
        body = {
          emailOrPhone: email,
          password,
        };
      } else {
        // backend expects: { name, email, phone, password }
        body = {
          name,
          email,
          phone,
          password,
        };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
  // backend sends specific messages
  if (data.message === "Invalid email") {
    setMessage("Invalid email");
  } else if (data.message === "Incorrect password") {
    setMessage("Incorrect password");
  } else {
    setMessage(data.message || "Something went wrong. Please try again.");
  }
  setMessageType("error");
  return;
}


      if (isLogin) {
  // login success
  setMessage("Login successful!");
  setMessageType("success");

  // store token
  if (data.token) {
    localStorage.setItem("token", data.token);
  } else {
    console.warn("No token returned from login API.");
  }

  // Store user info for BikeX authentication
  const userData = {
    name: data.user?.name || data.name || email,
    email: data.user?.email || email,
    token: data.token
  };
  
  localStorage.setItem("bikeXUser", JSON.stringify(userData));
  
  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  // go home
  navigate("/");
}

else {
        // signup success – go to OTP verification
        const userId = data.userId;
        if (!userId) {
          setMessage("Signup succeeded but no userId returned from server.");
          setMessageType("error");
          return;
        }

        localStorage.setItem("pendingUserId", userId);
        navigate(`/verify-otp/${userId}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated Background Orbs matching PreLoader */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "10%",
            right: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.08, 0.15, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{
            position: "absolute",
            bottom: "20%",
            left: "10%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192, 192, 192, 0.12), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          {...float}
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 480,
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(20, 184, 166, 0.3)",
            borderRadius: 24,
            padding: "clamp(2rem, 4vw, 3rem)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <motion.h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.8rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #d4af37 0%, #c0c0c0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "0.5rem",
                letterSpacing: "-0.02em",
              }}
            >
              {isLogin ? "Welcome Back" : "Join BikeX"}
            </motion.h1>
            <p style={{ color: "#cbd5e1", fontSize: "1rem" }}>
              {isLogin ? "Sign in to access your account" : "Create your account to get started"}
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            background: "rgba(15, 23, 42, 0.6)",
            padding: "0.25rem",
            borderRadius: 12,
          }}>
            <button
              style={{
                padding: "0.75rem",
                borderRadius: 10,
                border: "none",
                background: isLogin ? "linear-gradient(135deg, #d4af37, #c9a22e)" : "transparent",
                color: isLogin ? "#ffffff" : "#94a3b8",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: isLogin ? "0 8px 16px rgba(20, 184, 166, 0.3)" : "none",
              }}
              onClick={() => handleModeChange(true)}
              type="button"
            >
              Login
            </button>
            <button
              style={{
                padding: "0.75rem",
                borderRadius: 10,
                border: "none",
                background: !isLogin ? "linear-gradient(135deg, #d4af37, #c9a22e)" : "transparent",
                color: !isLogin ? "#ffffff" : "#94a3b8",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: !isLogin ? "0 8px 16px rgba(20, 184, 166, 0.3)" : "none",
              }}
              onClick={() => handleModeChange(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>

            {message && (
              <div style={{
                marginBottom: "1rem",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                fontSize: "0.9rem",
                background: messageType === "error" ? "rgba(220, 38, 38, 0.2)" : "rgba(34, 197, 94, 0.2)",
                color: messageType === "error" ? "#fca5a5" : "#86efac",
                border: `1px solid ${messageType === "error" ? "rgba(220, 38, 38, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
              }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {!isLogin && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 10,
                        border: "1px solid rgba(20, 184, 166, 0.3)",
                        background: "rgba(15, 23, 42, 0.6)",
                        color: "#f1f5f9",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      placeholder="Enter your phone"
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: 10,
                        border: "1px solid rgba(20, 184, 166, 0.3)",
                        background: "rgba(15, 23, 42, 0.6)",
                        color: "#f1f5f9",
                        fontSize: "1rem",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    background: "rgba(15, 23, 42, 0.6)",
                    color: "#f1f5f9",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", color: "#cbd5e1", fontSize: "0.9rem", fontWeight: 600 }}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: 10,
                    border: "1px solid rgba(20, 184, 166, 0.3)",
                    background: "rgba(15, 23, 42, 0.6)",
                    color: "#f1f5f9",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                />
              </div>

              {isLogin && (
                <div 
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    textAlign: "right",
                    color: "#d4af37",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    marginTop: "-0.5rem",
                  }}
                >
                  Forgot password?
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg, #d4af37, #c9a22e)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: "0 12px 24px rgba(20, 184, 166, 0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (isLogin ? "Logging in..." : "Creating account...") : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
        </motion.div>
      </section>
    </>
  );
};

export default Login;

