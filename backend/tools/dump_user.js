require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function run(email){
  await connectDB(process.env.MONGO_URI);
  const u = await User.findOne({ email }).lean();
  if(!u) return console.log('User not found');
  console.log(JSON.stringify({ email: u.email, isEmailVerified: u.isEmailVerified, resetToken: u.resetToken ? 'SET' : null }, null, 2));
  process.exit(0);
}

const email = process.argv[2];
if(!email) return console.log('Usage: node tools/dump_user.js <email>');
run(email).catch(e=>{console.error(e); process.exit(1);});
