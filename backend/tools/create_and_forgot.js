const axios = require('axios');
(async()=>{
  try{
    const email = process.argv[2] || 'manualtest@example.com';
    const phone = '9999998888';
    const password = 'Pass1234';
    await axios.post('http://127.0.0.1:5000/api/auth/register', { name: 'Manual Test', email, phone, password });
  }catch(e){/* ignore */}
  try{
    const email = process.argv[2] || 'manualtest@example.com';
    const f = await axios.post('http://127.0.0.1:5000/api/auth/forgot-password', { email });
    console.log('forgot response', f.status, f.data && f.data.message);
  }catch(e){
    console.error('forgot error', e.response ? e.response.status : e.message);
    process.exit(1);
  }
})();
