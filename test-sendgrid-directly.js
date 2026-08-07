// Test SendGrid API directly to verify it's working
// Run with: node test-sendgrid-directly.js

const https = require('https');

// REPLACE THIS with your actual SendGrid API key from the screenshot
const SENDGRID_API_KEY = 'SG.3SKtXUmERfGDAtMxlXbP9dAYEckkIXq8dj5WWgdtIcfd14F2jtBhgE2VX2u0yN-B-c';

const FROM_EMAIL = 'aishushettar95@gmail.com';
const TO_EMAIL = 'aishushettar95@gmail.com'; // Change this if you want

const emailData = JSON.stringify({
    personalizations: [
        {
            to: [{ email: TO_EMAIL }],
            subject: 'Test Email from SendGrid - HRMS'
        }
    ],
    from: {
        email: FROM_EMAIL,
        name: 'HRMS System'
    },
    content: [
        {
            type: 'text/html',
            value: '<h1>✅ SendGrid is Working!</h1><p>This is a test email from your HRMS system.</p><p>If you received this, SendGrid is configured correctly!</p>'
        }
    ]
});

const options = {
    hostname: 'api.sendgrid.com',
    port: 443,
    path: '/v3/mail/send',
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': emailData.length
    }
};

console.log('🔍 Testing SendGrid API directly...\n');
console.log(`From: ${FROM_EMAIL}`);
console.log(`To: ${TO_EMAIL}\n`);

const req = https.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Status Message: ${res.statusMessage}\n`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 202) {
            console.log('✅ SUCCESS! Email sent via SendGrid!');
            console.log(`📧 Check your inbox: ${TO_EMAIL}`);
            console.log('\n🎉 SendGrid is working correctly!');
            console.log('If Render is still failing, it means Render hasn\'t deployed the new code yet.');
        } else {
            console.log('❌ FAILED! SendGrid returned an error:');
            console.log(data);
            
            if (res.statusCode === 403) {
                console.log('\n⚠️ Sender email not verified in SendGrid!');
                console.log('Go to: https://app.sendgrid.com/settings/sender_auth/senders');
                console.log('And verify your sender email.');
            } else if (res.statusCode === 401) {
                console.log('\n⚠️ Invalid API key!');
                console.log('Check if the API key is correct in Render environment variables.');
            }
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
});

req.write(emailData);
req.end();
