// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    const uri = mongoUri || process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI environment variable is missing");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
