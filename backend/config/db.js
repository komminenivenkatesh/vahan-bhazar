// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  try {
    const uri = mongoUri || process.env.MONGO_URI || 'mongodb+srv://komminenivenkatesh045_db_user:%40Venky210606@vahan-bazar-db.ethum2q.mongodb.net/';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
