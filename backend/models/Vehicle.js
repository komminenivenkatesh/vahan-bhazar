
// backend/models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },          // e.g. "Classic 350"
    brand: { type: String, required: true },
    cc: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["motorcycles", "scooters"], required: true },
    imageUrl: { type: String, required: true },       // path to uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
