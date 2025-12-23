// backend/models/Bike.js
const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },      // e.g. "Classic 350"
    brand: { type: String, required: true },
    cc: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["motorcycles", "scooters"], required: true },
    imageUrl: { type: String, required: true },   // <-- path to image file
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bike", bikeSchema);
