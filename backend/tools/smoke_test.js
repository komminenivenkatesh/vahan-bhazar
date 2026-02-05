const axios = require('axios');
const connectDB = require('../config/db');
const User = require('../models/User');
require('dotenv').config();

const BASE = process.env.BACKEND_URL || 'http://localhost:5000';
const MONGO = process.env.MONGO_URI;

async function wait(ms){return new Promise(r=>setTimeout(r,ms));}

async function run(email){
  const phone = '9999999999';
  const password = 'Pass1234';
  const newPassword = 'NewPass123';

  console.log('1) Registering user...');
  try{
    const r = await axios.post(`${BASE}/api/auth/register`, { name: 'Smoke Test', email, phone, password }, { timeout: 5000 });
    console.log(' register response:', r.status, r.data && r.data.message ? r.data.message : 'OK');
  }catch(e){
    console.error(' register error (may already exist):', e.response ? e.response.status : e.message);
  }

  console.log('2) Triggering forgot-password...');
  try{
    const f = await axios.post(`${BASE}/api/auth/forgot-password`, { email }, { timeout: 5000 });
    console.log(' forgot response:', f.status, f.data && f.data.message);
  }catch(e){
    console.error(' forgot error:', e.response ? e.response.status : e.message);
  }

  console.log('3) Connecting to DB to read token...');
  try{
    await connectDB(MONGO);
    await wait(500);
    const user = await User.findOne({ email }).lean();
    if(!user){
      console.error(' User not found in DB');
      process.exit(1);
    }
    console.log(' resetToken (from DB):', user.resetToken || '(none)');

    if(!user.resetToken){
      console.error('No reset token — aborting test.');
      process.exit(1);
    }

    console.log('4) Resetting password using token...');
    try{
      const rp = await axios.post(`${BASE}/api/auth/reset-password`, { token: user.resetToken, newPassword }, { timeout: 5000 });
      console.log(' reset response:', rp.status, rp.data && rp.data.message);
    }catch(e){
      console.error(' reset error:', e.response ? e.response.status : e.message);
      process.exit(1);
    }

    console.log('5) Logging in with new password...');
    try{
      const lg = await axios.post(`${BASE}/api/auth/login`, { emailOrPhone: email, password: newPassword }, { timeout: 5000 });
      console.log(' login response:', lg.status, lg.data && lg.data.message);
      console.log(' token:', lg.data && lg.data.token ? lg.data.token.substring(0,20) + '...' : '(no token)');
    }catch(e){
      console.error(' login error:', e.response ? e.response.status : e.message);
      process.exit(1);
    }

  }catch(err){
    console.error('DB/read error:', err);
    process.exit(1);
  }

  console.log('Smoke test finished.');
  process.exit(0);
}

const email = process.argv[2] || 'testreset@example.com';
run(email).catch(e=>{console.error(e); process.exit(1);});
