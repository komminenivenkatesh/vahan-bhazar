import React from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

type User = {
  id: string;
  name: string;
  email: string;
  role?: string; // make role optional
};

export default function Navbar() {
  const navigate = useNavigate();

  // 🔑 Read from localStorage every render
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
    navigate("/login"); // back to login after logout
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.brand}>
          BikeZone
        </Link>

        <nav style={styles.nav}>
          <Link to="/motorcycle" style={styles.navLink}>
            MotorCycle
          </Link>
          <Link to="/buyer" style={styles.navLink}>
            Buyer
          </Link>
          <Link to="/seller" style={styles.navLink}>
            Sell Bike
          </Link>
          <Link to="/support" style={styles.navLink}>
            Support
          </Link>
          <Link to="/about" style={styles.navLink}>
            About
          </Link>
        </nav>

        <div style={styles.right}>
          <SearchBar />

          {!isLoggedIn ? (
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          ) : (
            <>
              <span style={styles.welcomeMsg}>
                Hi, {user?.name || "User"}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
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
