const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function run(email) {
  await connectDB(process.env.MONGO_URI);
  const user = await User.findOne({ email }).lean();
  if (!user) {
    console.error('User not found');
    process.exit(1);
  }
  console.log('resetToken:', user.resetToken);
  process.exit(0);
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: node tools/get_reset_token.js <email>');
  process.exit(1);
}
run(email).catch(err => { console.error(err); process.exit(1); });
