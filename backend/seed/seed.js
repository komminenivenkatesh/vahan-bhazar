// backend/seed/seed.js
console.log("SEED SCRIPT STARTING...");
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// --- Vehicle model (inline) ---
const vehicleSchema = new mongoose.Schema({
  title: String,
  brand: String,
  model: String,
  category: { type: String, enum: ['bike','scooter','ev'] },
  variant: String,
  year: Number,
  price: Number,
  fuel_type: String,
  battery_range: Number,
  odometer_km: Number,
  condition: { type: String, enum: ['new','used'], default: 'new' },
  images: [String],
  description: String,
  dealership: {
    name: String,
    shop_id: String,
    contact_phone: String
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle_seed', vehicleSchema, 'vehicles'); // collection name 'vehicles'

// --- samples array (same as your list) ---
const samples = [
  { title: 'Hero Splendor Plus', brand: 'Hero', model: 'Splendor Plus', category: 'bike', year: 2023, price: 85000, fuel_type: 'Petrol', description: 'Reliable commuter.' },
  { title: 'TVS iQube S', brand: 'TVS', model: 'iQube S', category: 'ev', year: 2024, price: 120000, battery_range: 85, fuel_type: 'Electric', description: 'City EV scooter.' },
  { title: 'Bajaj Pulsar 150', brand: 'Bajaj', model: 'Pulsar 150', category: 'bike', year: 2022, price: 115000, fuel_type: 'Petrol', description: 'Sporty commuter.' },
  { title: 'Honda Activa 6G', brand: 'Honda', model: 'Activa 6G', category: 'scooter', year: 2023, price: 82000, fuel_type: 'Petrol', description: 'Popular scooter.' },
  { title: 'Ola S1 X', brand: 'Ola', model: 'S1 X', category: 'ev', year: 2024, price: 95000, battery_range: 90, fuel_type: 'Electric', description: 'Affordable EV scooter.' },
  { title: 'Royal Enfield Classic 350', brand: 'Royal Enfield', model: 'Classic 350', category: 'bike', year: 2023, price: 200000, fuel_type: 'Petrol', description: 'Classic cruiser.' },
  { title: 'Ather 450X', brand: 'Ather', model: '450X', category: 'ev', year: 2024, price: 150000, battery_range: 116, fuel_type: 'Electric', description: 'Premium EV scooter.' },
  { title: 'Yamaha FZ-S', brand: 'Yamaha', model: 'FZ-S', category: 'bike', year: 2022, price: 130000, fuel_type: 'Petrol', description: 'Sporty street bike.' },
  { title: 'TVS Apache RTR 160', brand: 'TVS', model: 'Apache RTR 160', category: 'bike', year: 2021, price: 125000, fuel_type: 'Petrol', description: 'Aggressive styling.' },
  { title: 'Hero Karizma XMR', brand: 'Hero', model: 'Karizma XMR', category: 'bike', year: 2024, price: 180000, fuel_type: 'Petrol', description: 'Performance bike.' },
  { title: 'Honda CB Shine', brand: 'Honda', model: 'CB Shine', category: 'bike', year: 2020, price: 90000, fuel_type: 'Petrol', description: 'Reliable and efficient.' },
  { title: 'Bajaj Chetak', brand: 'Bajaj', model: 'Chetak', category: 'ev', year: 2022, price: 110000, battery_range: 85, fuel_type: 'Electric', description: 'Stylish EV scooter.' },
  { title: 'Suzuki Access 125', brand: 'Suzuki', model: 'Access 125', category: 'scooter', year: 2023, price: 92000, fuel_type: 'Petrol', description: 'Comfortable daily ride.' },
  { title: 'KTM Duke 200', brand: 'KTM', model: 'Duke 200', category: 'bike', year: 2023, price: 190000, fuel_type: 'Petrol', description: 'Naked sport bike.' },
  { title: 'Gogoro Viva', brand: 'Gogoro', model: 'Viva', category: 'ev', year: 2024, price: 80000, battery_range: 60, fuel_type: 'Electric', description: 'Urban EV.' },
  { title: 'TVS NTORQ 125', brand: 'TVS', model: 'NTORQ 125', category: 'scooter', year: 2022, price: 97000, fuel_type: 'Petrol', description: 'Tech-focused scooter.' },
  { title: 'Royal Enfield Meteor 350', brand: 'Royal Enfield', model: 'Meteor 350', category: 'bike', year: 2021, price: 210000, fuel_type: 'Petrol', description: 'Comfort cruiser.' },
  { title: 'Yamaha RayZR', brand: 'Yamaha', model: 'RayZR', category: 'scooter', year: 2023, price: 78000, fuel_type: 'Petrol', description: 'Peppy city scooter.' },
  { title: 'Hero Xtreme 160R', brand: 'Hero', model: 'Xtreme 160R', category: 'bike', year: 2024, price: 125000, fuel_type: 'Petrol', description: 'Performance commuter.' },
  { title: 'Okinawa PraisePro', brand: 'Okinawa', model: 'PraisePro', category: 'ev', year: 2023, price: 98000, battery_range: 90, fuel_type: 'Electric', description: 'Value EV scooter.' }
];

(async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/vahanbazar';
  console.log('Using MONGO_URI =', mongoUri);

  // Path to the uploaded file you provided in this session:
  const uploadedPath = '/mnt/data/833ac447-1bd5-4653-85d8-18d4e6a105a0.png';

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected (seed)');

    // Ensure uploads dir exists relative to project root
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads'); // adjust if your seed location differs
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads dir:', uploadsDir);

    // Clear existing docs (dev only)
    const deleted = await Vehicle.deleteMany({});
    console.log('Deleted existing vehicles:', deleted.deletedCount);

    // Copy the same uploaded image to unique filenames and attach per sample
    const now = Date.now();
    const samplesWithImages = samples.map((s, idx) => {
      const destFilename = `seed-${now}-${idx}.png`;
      const destPath = path.join(uploadsDir, destFilename);

      try {
        // copy the original uploaded file into uploads multiple times (one per sample)
        fs.copyFileSync(uploadedPath, destPath);
      } catch (err) {
        console.error('Failed copying image for sample', idx, 'from', uploadedPath, 'to', destPath);
        throw err;
      }

      // set images array to the path served by your server
      return {
        ...s,
        images: [`/uploads/${destFilename}`]
      };
    });

    // Insert samples
    const inserted = await Vehicle.insertMany(samplesWithImages);
    console.log('Inserted vehicles:', inserted.length);
    console.log('Sample inserted id:', inserted[0]._id.toString());

    await mongoose.disconnect();
    console.log('Disconnected. Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
})();
