// backend/server_clean_fixed.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const fs = require("fs");
const vehicleRoutes = require('./routes/vehicles');

// Optional: morgan for dev logging (npm i morgan)
let morgan;
try { morgan = require("morgan"); } catch (e) { morgan = null; }

// Ensure uploads/ folder exists at server start
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 uploads folder created at", uploadsDir);
}

// Route modules (keep just one vehicles router)
const authRoutes = fs.existsSync(path.join(__dirname, "routes", "auth.js")) ? require("./routes/auth") : null;

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
if (morgan) app.use(morgan("dev"));
else app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`${new Date().toISOString()} -> ${req.method} ${req.url}`);
  }
  next();
});

// Connect to MongoDB (pass MONGO_URI via env or fallback)
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/vahanbazar");

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount API routes (use only the merged vehicles route)
app.use("/api/vehicles", vehicleRoutes);
if (authRoutes) app.use("/api/auth", authRoutes);

// Simple root route
app.get("/", (req, res) => {
  res.send("Vahan Bazar API running smoothly! 🚀");
});

// Debug: list mounted routes after a short delay
setTimeout(() => {
  try {
    if (app._router && app._router.stack) {
      console.log("Mounted routes:");
      app._router.stack
        .filter((r) => r.route)
        .forEach((r) => {
          const methods = Object.keys(r.route.methods).map((m) => m.toUpperCase()).join(",");
          console.log(`${methods} ${r.route.path}`);
        });
    }
  } catch (err) {
    console.error("Error listing routes", err);
  }
}, 300);

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

// Start server with error handling for common issues (EADDRINUSE)
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`⚡ Server running at http://localhost:${PORT}`));

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Is another server running?`);
    console.error('If you intended to run multiple servers, set a different PORT in your env.');
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
