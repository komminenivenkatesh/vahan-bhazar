const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  shop: String,
  bookingDate: Date,
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
