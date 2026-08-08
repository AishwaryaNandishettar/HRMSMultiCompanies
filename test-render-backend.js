const https = require('https');

const BACKEND_URL = 'latestfinalhrmsapplication.onrender.com';

console.log('🔍 Testing Render Backend Connection');
console.log('═══════════════════════════════════════════\n');
console.log(`Backend URL: https://${BACKEND_URL}`);
console.log('');

// Test 1: Check if backend is alive
console.log('Test 1: Health Check');
console.log('─────────────────────────────────');

const healthOptions = {
  hostname: BACKEND_URL,
  port: 443,
  path: '/actuator/health',
  method: 'GET',
  timeout: 10000
};

const healthReq = https.request(healthOptions, (res) => {
  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Backend is ALIVE and responding\n');
      console.log('Response:', data);
      testOnboardingEndpoint();
    } else if (res.statusCode === 404) {
      console.log('⚠️  /actuator/health not found, trying root endpoint...\n');
      testRootEndpoint();
    } else {
      console.log('❌ Backend returned error');
      console.log('Response:', data);
    }
  });
});

healthReq.on('error', (error) => {
  console.error('❌ Health check failed:', error.message);
  console.log('\nTrying root endpoint instead...\n');
  testRootEndpoint();
});

healthReq.on('timeout', () => {
  console.error('❌ Request timed out (10 seconds)');
  console.log('This means backend is not responding');
  healthReq.destroy();
});

healthReq.end();

function testRootEndpoint() {
  console.log('Test 2: Root Endpoint Check');
  console.log('─────────────────────────────────');
  
  const rootOptions = {
    hostname: BACKEND_URL,
    port: 443,
    path: '/',
    method: 'GET',
    timeout: 10000
  };
  
  const rootReq = https.request(rootOptions, (res) => {
    console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 || res.statusCode === 404) {
        console.log('✅ Backend server is responding\n');
        testOnboardingEndpoint();
      } else {
        console.log('❌ Unexpected response');
        console.log('Response:', data);
      }
    });
  });
  
  rootReq.on('error', (error) => {
    console.error('❌ Root endpoint failed:', error.message);
    console.log('\n════════════════════════════════════════════');
    console.log('DIAGNOSIS: Backend is DOWN or URL is incorrect');
    console.log('════════════════════════════════════════════');
    console.log('\nPlease check:');
    console.log('1. Render dashboard - is the service "Live"?');
    console.log('2. Render logs - any deployment errors?');
    console.log('3. Render URL - does it match:', BACKEND_URL);
  });
  
  rootReq.on('timeout', () => {
    console.error('❌ Request timed out');
    rootReq.destroy();
  });
  
  rootReq.end();
}

function testOnboardingEndpoint() {
  console.log('Test 3: Onboarding Endpoint (CORS Test)');
  console.log('─────────────────────────────────');
  
  const onboardingOptions = {
    hostname: BACKEND_URL,
    port: 443,
    path: '/api/onboarding/validate?token=test',
    method: 'GET',
    headers: {
      'Origin': 'https://omoi-hrms.vercel.app'
    },
    timeout: 10000
  };
  
  const onboardingReq = https.request(onboardingOptions, (res) => {
    console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`CORS Header: ${res.headers['access-control-allow-origin'] || 'MISSING'}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.headers['access-control-allow-origin']) {
        console.log('✅ CORS is configured correctly');
      } else {
        console.log('❌ CORS header is missing - Vercel cannot access backend');
      }
      
      console.log('\nResponse:', data);
      console.log('\n════════════════════════════════════════════');
      console.log('BACKEND STATUS: OPERATIONAL');
      console.log('════════════════════════════════════════════');
    });
  });
  
  onboardingReq.on('error', (error) => {
    console.error('❌ Onboarding endpoint failed:', error.message);
  });
  
  onboardingReq.on('timeout', () => {
    console.error('❌ Request timed out');
    onboardingReq.destroy();
  });
  
  onboardingReq.end();
}
