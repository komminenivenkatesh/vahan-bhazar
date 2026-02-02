import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<{ name: string; email: string; phone: string }>({ name: '', email: '', phone: '' });
  const [activeTab, setActiveTab] = useState<"details" | "listings" | "bookings">("details");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditData({
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || ''
      });
    } catch (e) {
      console.error("Failed to parse user", e);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("bikeXUser");
    // navigate to login and force a reload so other components pick up cleared auth state
    navigate("/login", { replace: true });
    setTimeout(() => window.location.reload(), 50);
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#000000", padding: "120px 20px 40px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "linear-gradient(135deg, rgba(26, 26, 26, 0.9), rgba(10, 10, 10, 0.95))",
              borderRadius: "24px",
              padding: "40px",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "32px",
              marginBottom: "40px",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Decorative Glow */}
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(212, 175, 55, 0.15), transparent 70%)",
              filter: "blur(60px)",
              borderRadius: "50%"
            }} />

            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #d4af37, #c9a22e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#000",
              boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)"
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ 
                fontSize: "2.5rem", 
                fontWeight: 800, 
                color: "#e5e5e5", 
                marginBottom: "8px",
                lineHeight: 1
              }}>
                {user.name}
              </h1>
              <p style={{ color: "#d4af37", fontSize: "1.1rem" }}>Member since 2025</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.3)",
                color: "#ef4444",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <span>Logout</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
            </motion.button>
          </motion.div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
            {[
              { id: "details", label: "My Details", icon: "👤" },
              { id: "listings", label: "My Listings", icon: "🏍️" },
              { id: "bookings", label: "My Bookings", icon: "📅" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "12px 24px",
                  background: activeTab === tab.id ? "rgba(212, 175, 55, 0.15)" : "transparent",
                  border: activeTab === tab.id ? "1px solid rgba(212, 175, 55, 0.4)" : "1px solid transparent",
                  borderRadius: "12px",
                  color: activeTab === tab.id ? "#d4af37" : "#808080",
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(26, 26, 26, 0.6)",
                backdropFilter: "blur(20px)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                padding: "40px",
                minHeight: "400px"
              }}
            >
              {activeTab === "details" && (
                <div style={{ maxWidth: "600px" }}>
                  <h2 style={{ color: "#e5e5e5", marginBottom: "32px", fontSize: "1.5rem" }}>Personal Information</h2>
                  {!editing ? (
                    <>
                      <div style={{ display: "grid", gap: "24px" }}>
                        {[
                          { label: "Full Name", value: user.name },
                          { label: "Email Address", value: user.email },
                          { label: "Phone Number", value: user.phone || "Not provided" },
                          { label: "Account Type", value: "Standard Member" }
                        ].map((field, idx) => (
                          <div key={idx} style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center" }}>
                            <span style={{ color: "#808080", fontSize: "0.95rem" }}>{field.label}</span>
                            <div style={{ 
                              padding: "16px", 
                              background: "rgba(0, 0, 0, 0.3)", 
                              borderRadius: "12px", 
                              color: "#e5e5e5",
                              border: "1px solid rgba(255, 255, 255, 0.05)"
                            }}>
                              {field.value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        style={{
                          marginTop: "40px",
                          padding: "14px 32px",
                          background: "linear-gradient(135deg, #d4af37, #c9a22e)",
                          color: "#000",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "1rem",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </button>
                    </>
                  ) : (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const updated = { ...user, ...editData };
                        setUser(updated);
                        localStorage.setItem("user", JSON.stringify(updated));
                        setEditing(false);
                      }}
                    >
                      <div style={{ display: "grid", gap: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center" }}>
                          <span style={{ color: "#808080", fontSize: "0.95rem" }}>Full Name</span>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                            style={{
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #d4af37",
                              background: "#181818",
                              color: "#e5e5e5",
                              fontSize: "1rem"
                            }}
                            required
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center" }}>
                          <span style={{ color: "#808080", fontSize: "0.95rem" }}>Email Address</span>
                          <input
                            type="email"
                            value={editData.email}
                            onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
                            style={{
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #d4af37",
                              background: "#181818",
                              color: "#e5e5e5",
                              fontSize: "1rem"
                            }}
                            required
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center" }}>
                          <span style={{ color: "#808080", fontSize: "0.95rem" }}>Phone Number</span>
                          <input
                            type="text"
                            value={editData.phone}
                            onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
                            style={{
                              padding: "12px",
                              borderRadius: "8px",
                              border: "1px solid #d4af37",
                              background: "#181818",
                              color: "#e5e5e5",
                              fontSize: "1rem"
                            }}
                          />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", alignItems: "center" }}>
                          <span style={{ color: "#808080", fontSize: "0.95rem" }}>Account Type</span>
                          <div style={{ 
                            padding: "16px", 
                            background: "rgba(0, 0, 0, 0.3)", 
                            borderRadius: "12px", 
                            color: "#e5e5e5",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                          }}>
                            Standard Member
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: "40px", display: "flex", gap: "16px" }}>
                        <button
                          type="submit"
                          style={{
                            padding: "14px 32px",
                            background: "linear-gradient(135deg, #d4af37, #c9a22e)",
                            color: "#000",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          style={{
                            padding: "14px 32px",
                            background: "transparent",
                            border: "1px solid #d4af37",
                            color: "#d4af37",
                            borderRadius: "12px",
                            fontSize: "1rem",
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                          onClick={() => {
                            setEditing(false);
                            setEditData({ name: user.name, email: user.email, phone: user.phone });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {activeTab === "listings" && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🏍️</div>
                  <h3 style={{ color: "#e5e5e5", fontSize: "1.5rem", marginBottom: "12px" }}>No Listings Yet</h3>
                  <p style={{ color: "#808080", marginBottom: "32px" }}>You haven't listed any vehicles for sale yet.</p>
                  <button 
                    onClick={() => navigate("/sell")}
                    style={{
                      padding: "14px 32px",
                      background: "transparent",
                      border: "1px solid #d4af37",
                      color: "#d4af37",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Create Listing
                  </button>
                </div>
              )}

              {activeTab === "bookings" && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <div style={{ fontSize: "4rem", marginBottom: "20px" }}>📅</div>
                  <h3 style={{ color: "#e5e5e5", fontSize: "1.5rem", marginBottom: "12px" }}>No Bookings Found</h3>
                  <p style={{ color: "#808080", marginBottom: "32px" }}>You haven't made any bookings yet.</p>
                  <button 
                    onClick={() => navigate("/market")}
                    style={{
                      padding: "14px 32px",
                      background: "linear-gradient(135deg, #d4af37, #c9a22e)",
                      color: "#000",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "1rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    Browse Market
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </>
  );
};

export default Profile;
