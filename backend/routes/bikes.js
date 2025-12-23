// backend/routes/bikes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Bike = require("../models/Bike");

const router = express.Router();

// where to store images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder relative to backend root
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/bikes  (seller uploads bike + image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, brand, cc, price, type } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const bike = await Bike.create({
      title,
      brand,
      cc,
      price,
      type,
      imageUrl,
    });

    res.status(201).json(bike);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bikes  (buyer sees all bikes)
router.get("/", async (req, res) => {
  try {
    const bikes = await Bike.find().sort({ createdAt: -1 });
    res.json(bikes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
