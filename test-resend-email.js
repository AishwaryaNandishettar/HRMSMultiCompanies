/**
 * Test Resend Email API
 * 
 * This script tests if the Resend API key is working correctly
 * Run this to verify email functionality before deploying
 * 
 * IMPORTANT: Update the API key in your .env file before running
 * This file should NOT contain the actual API key for security
 */

const RESEND_API_KEY = 'REPLACE_WITH_YOUR_API_KEY';
const FROM_EMAIL = 'onboarding@resend.dev';
const TO_EMAIL = 'aishushettar95@gmail.com'; // Change to your test email

async function testResendEmail() {
    console.log('🧪 Testing Resend Email API...\n');

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `HRMS System <${FROM_EMAIL}>`,
                to: [TO_EMAIL],
                subject: 'Test Email from HRMS - Resend Integration',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #4F46E5;">✅ Email Integration Test</h1>
                        <p>If you're reading this, your Resend integration is working perfectly!</p>
                        <hr style="margin: 20px 0;">
                        <h2>Configuration Details:</h2>
                        <ul>
                            <li><strong>API Key:</strong> ${RESEND_API_KEY.substring(0, 15)}...</li>
                            <li><strong>From Email:</strong> ${FROM_EMAIL}</li>
                            <li><strong>To Email:</strong> ${TO_EMAIL}</li>
                        </ul>
                        <hr style="margin: 20px 0;">
                        <p style="color: #10B981;">✅ Your HRMS email system is ready for deployment!</p>
                    </div>
                `
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ SUCCESS! Email sent successfully\n');
            console.log('📧 Email ID:', data.id);
            console.log('📬 Check your inbox:', TO_EMAIL);
            console.log('\n🎉 Resend integration is working perfectly!');
            console.log('\n📝 Next steps:');
            console.log('  1. Add these environment variables to Render:');
            console.log('     RESEND_ENABLED=true');
            console.log('     RESEND_API_KEY=' + RESEND_API_KEY);
            console.log('     RESEND_FROM_EMAIL=' + FROM_EMAIL);
            console.log('     RESEND_FROM_NAME=HRMS System');
            console.log('  2. Deploy your backend to Render');
            console.log('  3. Test the invite employee functionality');
        } else {
            console.error('❌ FAILED! Error response:\n');
            console.error('Status:', response.status);
            console.error('Error:', data);
        }

    } catch (error) {
        console.error('❌ ERROR! Exception occurred:\n');
        console.error(error.message);
    }
}

// Run the test
testResendEmail();
