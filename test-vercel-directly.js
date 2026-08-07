// Test Vercel app directly to see if it can call the backend
// Run this with: node test-vercel-directly.js

const https = require('https');

const BACKEND_URL = 'https://latestfinalhrmsapplication.onrender.com';
const TEST_EMAIL = 'aishushettar95@gmail.com';

console.log('🔍 Testing Backend Connection from Node.js (simulates Vercel)...\n');

// Test 1: Check if backend is responding
console.log('Test 1: Checking backend health...');
const healthOptions = {
    hostname: 'latestfinalhrmsapplication.onrender.com',
    port: 443,
    path: '/api/health',
    method: 'GET',
    headers: {
        'Origin': 'https://omoi-hrms.vercel.app',
        'User-Agent': 'Node.js Test Script'
    }
};

const healthReq = https.request(healthOptions, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`Response: ${data}\n`);
        
        if (res.statusCode === 200 || res.statusCode === 404) {
            console.log('✅ Backend is responding!\n');
            testInviteEndpoint();
        } else {
            console.log('❌ Backend health check failed\n');
        }
    });
});

healthReq.on('error', (error) => {
    console.error('❌ Health check error:', error.message);
});

healthReq.end();

// Test 2: Try to send invite
function testInviteEndpoint() {
    console.log('Test 2: Sending test invite...');
    
    const postData = JSON.stringify({
        email: TEST_EMAIL,
        fullName: 'Test User',
        department: 'IT',
        designation: 'Developer'
    });

    const inviteOptions = {
        hostname: 'latestfinalhrmsapplication.onrender.com',
        port: 443,
        path: '/api/onboarding/invite',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'Origin': 'https://omoi-hrms.vercel.app',
            'User-Agent': 'Node.js Test Script'
        }
    };

    const inviteReq = https.request(inviteOptions, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`Response: ${data}\n`);
            
            if (res.statusCode === 200) {
                console.log('✅ Invite API call successful!');
                console.log(`📧 Check email: ${TEST_EMAIL}`);
                console.log('\n🎉 If you received the email, everything is working!');
            } else if (res.statusCode === 401 || res.statusCode === 403) {
                console.log('⚠️ Authentication required (expected for this endpoint)');
            } else {
                console.log('❌ Invite API call failed');
                console.log('Check Render logs for more details');
            }
        });
    });

    inviteReq.on('error', (error) => {
        console.error('❌ Invite request error:', error.message);
    });

    inviteReq.write(postData);
    inviteReq.end();
}
