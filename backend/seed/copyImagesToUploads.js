// backend/seed/createVehiclesFromUploads.js
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://komminenivenkatesh045_db_user:%40Venky210606@vahan-bazar-db.ethum2q.mongodb.net/';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({}, { strict: false, collection: 'vehicles' }));

  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const files = fs.readdirSync(uploadsDir).filter(f => /\.(png|jpg|jpeg|avif|webp)$/i.test(f));
  if (!files.length) {
    console.log('No files in uploads folder.');
    process.exit(0);
  }

  // sample templates - you can expand or modify titles/prices
  const templates = [
    { title: 'Auto Bike 1', brand: 'BrandA', cc: 150, price: 90000, type: 'bike' },
    { title: 'Auto Bike 2', brand: 'BrandB', cc: 200, price: 120000, type: 'bike' },
    { title: 'Auto Scooter 1', brand: 'BrandC', cc: 125, price: 65000, type: 'scooter' },
    { title: 'Electric 1', brand: 'BrandE', cc: 0, price: 140000, type: 'ev' },
    { title: 'Cruiser 1', brand: 'BrandR', cc: 650, price: 250000, type: 'cruiser' },
  ];

  // create vehicles — map filenames round-robin to templates
  const ops = templates.map((t, i) => {
    const filename = files[i % files.length];
    return {
      title: t.title,
      brand: t.brand,
      cc: t.cc,
      price: t.price,
      type: t.type,
      imageUrl: `/uploads/${filename}`
    };
  });

  await Vehicle.insertMany(ops);
  console.log('Inserted vehicles:', ops.length);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
