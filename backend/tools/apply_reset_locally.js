require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function run(email, token, newPassword){
  if(!email || !token || !newPassword){
    console.error('Usage: node apply_reset_locally.js <email> <token> <newPassword>');
    process.exit(1);
  }
  await connectDB(process.env.MONGO_URI);
  const user = await User.findOne({ email });
  if(!user){ console.error('User not found'); process.exit(1); }
  if(!user.resetToken || user.resetToken !== token){
    console.error('Token mismatch or not set'); process.exit(1);
  }
  if(!user.resetTokenExpiresAt || user.resetTokenExpiresAt < Date.now()){
    console.error('Token expired'); process.exit(1);
  }
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.resetToken = undefined;
  user.resetTokenExpiresAt = undefined;
  user.isEmailVerified = true;
  await user.save();
  console.log('Password reset applied for', email);
  process.exit(0);
}

const [,,email,token,newPassword] = process.argv;
run(email,token,newPassword).catch(e=>{ console.error(e); process.exit(1); });
