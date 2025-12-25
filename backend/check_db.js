const mongoose = require('mongoose');
require('dotenv').config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/vahanbazar');
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