require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

async function run(){
  await connectDB(process.env.MONGO_URI);
  const users = await User.find().limit(20).lean();
  if(!users || users.length===0){
    console.log('No users found');
    process.exit(0);
  }
  users.forEach(u=> console.log(u.email));
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
