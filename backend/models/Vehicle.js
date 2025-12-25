
// backend/models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String },
    model: { type: String },
    
    // Support both old 'type' and new 'category'
    type: { type: String }, 
    category: { type: String }, // 'bike', 'scooter', 'ev'

    cc: { type: Number },
    engine_cc: { type: Number },
    displacement: { type: Number },
    
    price: { type: Number, required: true },
    
    // Images
    imageUrl: { type: String }, // legacy single image
    images: [{ type: String }], // new array of images
    
    // Details
    year: { type: Number },
    fuel_type: { type: String },
    battery_range: { type: Number },
    odometer_km: { type: Number },
    condition: { type: String },
    description: { type: String },
    
    dealership: {
      name: String,
      shop_id: String,
      contact_phone: String
    }
  },
  { timestamps: true, strict: false } // strict: false allows fields not in schema to be returned
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
