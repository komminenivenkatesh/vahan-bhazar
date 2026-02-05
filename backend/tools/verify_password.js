require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function run(email, plain){
  await connectDB(process.env.MONGO_URI);
  const u = await User.findOne({ email });
  if(!u){ console.error('User not found'); process.exit(1); }
  console.log('isEmailVerified:', u.isEmailVerified);
  const match = await bcrypt.compare(plain, u.passwordHash);
  console.log('password matches:', match);
  process.exit(0);
}

const [,,email,plain] = process.argv;
if(!email || !plain){ console.error('Usage: node verify_password.js <email> <password>'); process.exit(1); }
run(email,plain).catch(e=>{ console.error(e); process.exit(1); });
