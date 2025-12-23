// backend/routes/bookings.js
const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// create booking
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    console.error('booking create error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list bookings
router.get('/', async (req, res) => {
  try {
    const list = await Booking.find().limit(100).exec();
    res.json(list);
  } catch (err) {
    console.error('booking list error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
