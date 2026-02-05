const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://komminenivenkatesh045_db_user:%40Venky210606@vahan-bazar-db.ethum2q.mongodb.net/');
    console.log('Connected to MongoDB');
    
    const count = await mongoose.connection.db.collection('vehicles').countDocuments();
    console.log('Total vehicles in DB:', count);
    
    const sample = await mongoose.connection.db.collection('vehicles').findOne();
    console.log('Sample vehicle:', sample);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();