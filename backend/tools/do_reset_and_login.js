const email = process.argv[2];
const token = process.argv[3];
const newPassword = process.argv[4] || 'NewP@ssw0rd1';

if(!email || !token){
  console.error('Usage: node do_reset_and_login.js <email> <token> [newPassword]');
  process.exit(1);
}

async function run(){
  try{
    const base = 'http://localhost:5000';
    const resetRes = await fetch(`${base}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const resetBody = await resetRes.text();
    console.log('reset status', resetRes.status);
    console.log('reset body', resetBody);

    // try login
    const loginRes = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: email, password: newPassword }),
    });
    const loginBody = await loginRes.text();
    console.log('login status', loginRes.status);
    console.log('login body', loginBody);
  }catch(e){
    console.error('error', e.message || e);
    process.exit(1);
  }
}

run().then(()=>process.exit(0));
