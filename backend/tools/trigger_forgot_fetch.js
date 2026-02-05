async function run(email){
  try{
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      // keep short timeout by using AbortController if needed
    });
    const data = await res.text();
    console.log('status', res.status);
    console.log('body', data);
  }catch(e){
    console.error('error', e.message || e);
    process.exit(1);
  }
}

const email = process.argv[2] || 'doeverything@example.com';
run(email).then(()=>process.exit(0));
