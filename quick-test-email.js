/**
 * 🚀 Quick Email Test Script
 * Tests the invitation email functionality
 * 
 * BEFORE RUNNING:
 * 1. Make sure backend is running: mvnw spring-boot:run
 * 2. Change TEST_EMAIL to your actual email
 * 3. Install axios: npm install axios
 * 4. Run: node quick-test-email.js
 */

const axios = require('axios');

// ⚠️⚠️⚠️ CHANGE THIS TO YOUR TEST EMAIL ⚠️⚠️⚠️
const TEST_EMAIL = 'your-test-email@gmail.com';

const API_BASE = 'http://localhost:8082';

async function testInviteEmail() {
  console.log('='.repeat(60));
  console.log('🚀 HRMS Email Invitation Test');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    console.log('📧 Sending test invite email...');
    console.log('📬 To:', TEST_EMAIL);
    console.log('🔗 API:', `${API_BASE}/api/onboarding/invite`);
    console.log('');

    const response = await axios.post(`${API_BASE}/api/onboarding/invite`, {
      email: TEST_EMAIL,
      fullName: 'Test Employee',
      department: 'IT',
      designation: 'Developer',
      password: 'TestPassword123'
    });

    console.log('✅ SUCCESS! Email sent!');
    console.log('');
    console.log('Response:', response.data);
    console.log('');
    console.log('📬 Check your email inbox:');
    console.log('   Email:', TEST_EMAIL);
    console.log('   Subject: "HRMS Invitation - Welcome!"');
    console.log('');
    console.log('⚠️  If you don\'t see the email:');
    console.log('   1. Check your spam folder');
    console.log('   2. Check backend logs for errors');
    console.log('   3. Verify Gmail credentials in application.properties');
    console.log('');
    
  } catch (error) {
    console.log('');
    console.log('❌ TEST FAILED!');
    console.log('='.repeat(60));
    console.log('');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      console.log('');
      
      if (error.response.status === 500) {
        console.log('💡 Possible causes:');
        console.log('   1. Backend is not running on port 8082');
        console.log('   2. Gmail SMTP credentials are incorrect');
        console.log('   3. MongoDB connection failed');
        console.log('   4. Email service error');
        console.log('');
        console.log('🔍 Check backend logs for detailed error message');
      }
      
    } else if (error.request) {
      console.log('❌ No response from server');
      console.log('');
      console.log('💡 Make sure:');
      console.log('   1. Backend is running on http://localhost:8082');
      console.log('   2. Run: mvnw spring-boot:run');
      console.log('   3. Or run the main application class in your IDE');
      
    } else {
      console.log('Error:', error.message);
    }
    
    console.log('');
  }
  
  console.log('='.repeat(60));
}

// Check if axios is installed
try {
  require.resolve('axios');
} catch (e) {
  console.log('❌ axios is not installed!');
  console.log('');
  console.log('Run: npm install axios');
  console.log('');
  process.exit(1);
}

// Run the test
testInviteEmail();
