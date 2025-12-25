// backend/routes/vehicles.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Vehicle = require("../models/Vehicle");

// ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9\-_]/g, '');
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// POST /api/vehicles/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('=== /api/vehicles/upload called ===');
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);

  try {
    const { title, brand, cc, price, type } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file (field: image) is required'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // prepare data to save
    const vehicleData = {
      title,
      brand,
      cc: Number(cc || 0),
      price: Number(price || 0),
      type,
      imageUrl
    };

    // save to DB
    const createdVehicle = await Vehicle.create(vehicleData);

    return res.status(201).json({
      success: true,
      message: 'Vehicle uploaded and saved successfully',
      data: createdVehicle
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message || String(err)
    });
  }
});

// GET /api/vehicles (list)
router.get("/", async (req, res) => {
  console.log("== GET /api/vehicles called ==");
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    console.error("GET /api/vehicles error:", err);
    res.status(500).json({ message: "Server error", error: err.message || String(err) });
  }
});

// GET /api/vehicles/:id (detail)
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    console.error("GET /api/vehicles/:id error:", err);
    res.status(500).json({ message: "Server error", error: err.message || String(err) });
  }
});

module.exports = router;
