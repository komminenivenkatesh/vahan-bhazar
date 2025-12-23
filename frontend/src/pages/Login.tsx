import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // ⭐ NEW: store user info (backend sends data.user)
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
      <div className="auth-page">
        <div className="auth-card">
          <h2>{isLogin ? "Login" : "Create Account"}</h2>

          {/* Toggle buttons */}
          <div className="auth-toggle">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => handleModeChange(true)}
              type="button"
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => handleModeChange(false)}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`auth-message ${
                messageType === "error" ? "error" : "success"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Enter your name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">
                {isLogin ? "Email or Phone (email only now)" : "Email"}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isLogin && (
  <div
    style={{
      textAlign: "right",
      marginBottom: "10px",
      color: "#007bff",
      cursor: "pointer",
      fontSize: "14px",
    }}
    onClick={() => navigate("/forgot-password")}
  >
    Forgot password?
  </div>
)}


            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Creating account..."
                : isLogin
                ? "Login"
                : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
