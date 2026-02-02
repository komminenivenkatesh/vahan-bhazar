import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let user: User | null = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      user = null;
    }
  }

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("bikeXUser");
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/market?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: "🏠" },
    { path: "/market", label: "Buy", icon: "🛒" },
    { path: "/sell", label: "Sell", icon: "💰" },
    { path: "/about", label: "About", icon: "ℹ️" },
    { path: "/support", label: "Help", icon: "💬" },
  ];

  return (
    <motion.header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        width: "100%",
        opacity: navOpacity as any,
      }}
    >
      <nav
        style={{
          background: scrolled
            ? "linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%)"
            : "linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)",
          backdropFilter: `blur(${scrolled ? 30 : 24}px)`,
          WebkitBackdropFilter: `blur(${scrolled ? 30 : 24}px)`,
          borderBottom: "1px solid rgba(212, 175, 55, 0.2)",
          boxShadow: scrolled
            ? "0 12px 40px rgba(0, 0, 0, 0.9)"
            : "0 8px 32px rgba(0, 0, 0, 0.8)",
          padding: "16px clamp(1.5rem, 4vw, 3rem)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo with animated gradient */}
        <Link
          to="/"
          style={{
            fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #d4af37 0%, #e5e5e5 50%, #d4af37 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            animation: "shimmer 3s ease-in-out infinite",
            position: "relative",
          }}
        >
          Vahan Bazar
           <motion.div
            style={{
              position: "absolute",
              bottom: -4,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, #d4af37, #c0c0c0)",
              borderRadius: 2,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </Link>

        {/* Navigation Links */}
        <div
          style={{
            display: "flex",
            gap: "clamp(0.5rem, 2vw, 2rem)",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 999,
                    color: isActive ? "#000" : "rgba(229, 229, 229, 0.9)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    background: isActive ? "linear-gradient(135deg, #d4af37, #c9a22e)" : "transparent",
                    border: "1px solid transparent",
                    transition: "all 0.3s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(212, 175, 55, 0.3)" : "none"
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#d4af37";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "rgba(229, 229, 229, 0.9)";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Search Bar */}
        <div style={{ flex: 1, maxWidth: 400, margin: "0 20px" }}>
          <form onSubmit={handleSearch} style={{ position: "relative" }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bikes..."
              style={{
                width: "100%",
                padding: "10px 40px 10px 16px",
                borderRadius: 999,
                background: "rgba(10, 10, 10, 0.6)",
                border: "1px solid rgba(212, 175, 55, 0.3)",
                color: "#e5e5e5",
                fontSize: "0.9rem",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 175, 55, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.3)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                color: "#d4af37",
                cursor: "pointer",
                padding: 6,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </form>
        </div>

        {/* User Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!isLoggedIn ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/login"
                style={{
                  padding: "10px 24px",
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #d4af37, #c9a22e)",
                  color: "#000",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 8px 20px rgba(212, 175, 55, 0.4)",
                  border: "none",
                  display: "inline-block",
                }}
              >
                Login
              </Link>
            </motion.div>
          ) : (
            <>
              <Link
                to="/profile"
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(212, 175, 55, 0.1)",
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                  color: "#d4af37",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  cursor: "pointer"
                }}
              >
                <span>👤</span>
                <span>{user?.name || "User"}</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  borderRadius: 999,
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                Logout
              </motion.button>
            </>
          )}
        </div>
      </nav>

      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </motion.header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    borderBottom: "1px solid #e6e6e6",
    background: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "12px 16px",
    justifyContent: "space-between",
  },
  brand: {
    fontWeight: 700,
    fontSize: 20,
    color: "#111",
    textDecoration: "none",
  },
  nav: { display: "flex", gap: 12, alignItems: "center" },
  navLink: {
    color: "#333",
    textDecoration: "none",
    padding: "6px 8px",
    borderRadius: 6,
    fontSize: 14,
  },
  right: { display: "flex", gap: 12, alignItems: "center" },
  loginBtn: {
    textDecoration: "none",
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    color: "#111",
  },
  logoutBtn: {
    padding: "6px 10px",
    background: "#d9534f",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  welcomeMsg: {
    fontSize: 14,
    color: "#333",
  },
};
