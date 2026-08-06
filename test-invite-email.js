/**
 * Quick Email Invite Test Script
 * Tests the /api/onboarding/invite endpoint
 */

const axios = require('axios');

const API_BASE = 'http://localhost:8082';

async function testInviteEmail() {
  try {
    console.log('📧 Testing invite email endpoint...');
    console.log('🔗 API:', `${API_BASE}/api/onboarding/invite`);

    const response = await axios.post(`${API_BASE}/api/onboarding/invite`, {
      email: 'your-test-email@gmail.com', // ⚠️ CHANGE THIS TO YOUR TEST EMAIL
      fullName: 'Test Employee',
      department: 'IT',
      designation: 'Developer',
      password: 'TestPassword123'
    });

    console.log('✅ Response:', response.data);
    console.log('\n📬 Check your email inbox for the invite!');
    console.log('   Email:', 'your-test-email@gmail.com');
    
  } catch (error) {
    console.error('❌ Test failed!');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server. Is backend running?');
      console.error('   Make sure backend is running on http://localhost:8082');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run test
console.log('='.repeat(60));
console.log('🚀 HRMS Email Invite Test');
console.log('='.repeat(60));
console.log('');

testInviteEmail();
