const crypto = require('crypto');
require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function run(email){
  await connectDB(process.env.MONGO_URI);
  const user = await User.findOne({ email });
  if(!user){
    console.error('User not found');
    process.exit(1);
  }
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpiresAt = Date.now() + 15*60*1000;
  await user.save();
  console.log('Set resetToken for', email);
  console.log('token:', token);
  process.exit(0);
}

const email = process.argv[2];
if(!email){ console.error('Usage: node set_reset_token.js <email>'); process.exit(1); }
run(email).catch(e=>{ console.error(e); process.exit(1); });
