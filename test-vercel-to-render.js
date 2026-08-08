const https = require('https');

// Test if Vercel can reach Render backend
const RENDER_BACKEND_URL = 'hrms-backend-p5pq.onrender.com'; // Replace with your actual Render URL

console.log('🔍 Testing Vercel → Render → SendGrid Flow');
console.log('═══════════════════════════════════════════\n');

// Simulate what Vercel frontend does
const inviteData = JSON.stringify({
  email: 'aishushettar95@gmail.com',
  name: 'Test User',
  department: 'IT',
  role: 'Employee'
});

const options = {
  hostname: RENDER_BACKEND_URL,
  port: 443,
  path: '/api/onboarding/invite',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': inviteData.length,
    'Origin': 'https://omoi-hrms.vercel.app'
  }
};

console.log('📤 Sending invite request to Render backend...');
console.log(`URL: https://${RENDER_BACKEND_URL}/api/onboarding/invite`);
console.log(`Email: aishushettar95@gmail.com\n`);

const req = https.request(options, (res) => {
  console.log(`📥 Response Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`Headers:`, JSON.stringify(res.headers, null, 2));
  console.log('');
  
  let responseBody = '';
  
  res.on('data', (chunk) => {
    responseBody += chunk;
  });
  
  res.on('end', () => {
    console.log('📄 Response Body:');
    console.log(responseBody);
    console.log('');
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ SUCCESS! Backend accepted the request.');
      console.log('');
      console.log('Now check:');
      console.log('1. Render logs for SendGrid messages');
      console.log('2. Your email inbox for the invitation');
      console.log('3. SendGrid Activity Feed for delivery status');
    } else if (res.statusCode === 401) {
      console.log('❌ AUTHENTICATION FAILED');
      console.log('Backend requires authentication token.');
    } else if (res.statusCode === 403) {
      console.log('❌ CORS ERROR');
      console.log('Backend is rejecting requests from Vercel origin.');
    } else if (res.statusCode === 404) {
      console.log('❌ ENDPOINT NOT FOUND');
      console.log('The /api/onboarding/invite endpoint does not exist.');
    } else {
      console.log('❌ REQUEST FAILED');
      console.log('Check the response body above for error details.');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ REQUEST ERROR:', error.message);
  console.error('');
  console.error('Possible causes:');
  console.error('1. Render backend is down');
  console.error('2. Network connectivity issue');
  console.error('3. Invalid Render URL');
});

req.write(inviteData);
req.end();
