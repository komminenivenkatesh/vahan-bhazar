const axios = require('axios');

async function run(email){
  try{
    const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email }, { timeout: 5000 });
    console.log('status', res.status);
    console.log('data', res.data);
  }catch(e){
    if(e.response){
      console.error('response status', e.response.status, e.response.data);
    } else {
      console.error('error', e.message);
    }
    process.exit(1);
  }
}

const email = process.argv[2] || 'doeverything@example.com';
run(email).then(()=>process.exit(0));
