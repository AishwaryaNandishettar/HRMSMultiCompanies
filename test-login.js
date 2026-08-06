/**
 * 🧪 Quick Login Test Script
 * Tests if the backend login endpoint is working
 */

const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:8082';
const TEST_EMAIL = 'Aishmanager@omoi.com';  // Change this to your test account
const TEST_PASSWORD = 'admin123';           // Change this to match your test account

async function testLogin() {
  console.log('='.repeat(60));
  console.log('🧪 Testing Login Endpoint');
  console.log('='.repeat(60));
  console.log('');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Test Email:', TEST_EMAIL);
  console.log('Test Password:', '***' + TEST_PASSWORD.slice(-3));
  console.log('');
  
  try {
    console.log('📤 Sending login request...');
    
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    console.log('');
    console.log('✅ LOGIN SUCCESSFUL!');
    console.log('='.repeat(60));
    console.log('');
    console.log('Response Data:');
    console.log('  User ID:', response.data.id);
    console.log('  Name:', response.data.name);
    console.log('  Email:', response.data.email);
    console.log('  Role:', response.data.role);
    console.log('  Token:', response.data.token ? response.data.token.substring(0, 30) + '...' : 'N/A');
    console.log('  Employee ID:', response.data.empId || response.data.employeeId);
    console.log('  Department:', response.data.department);
    console.log('');
    console.log('🎉 Backend is working correctly!');
    console.log('');
    console.log('Next Steps:');
    console.log('1. Make sure frontend .env has: VITE_API_BASE_URL=http://localhost:8082');
    console.log('2. Restart frontend: npm run dev');
    console.log('3. Try logging in through the UI');
    console.log('');
    
  } catch (error) {
    console.log('');
    console.log('❌ LOGIN FAILED');
    console.log('='.repeat(60));
    console.log('');
    
    if (error.response) {
      console.log('Status Code:', error.response.status);
      console.log('Error Message:', error.response.data);
      console.log('');
      
      if (error.response.status === 401) {
        console.log('💡 Possible causes:');
        console.log('   1. Wrong email or password');
        console.log('   2. User does not exist in database');
        console.log('   3. Password is not correctly hashed');
        console.log('');
        console.log('🔧 Solutions:');
        console.log('   1. Verify the test email exists in MongoDB');
        console.log('   2. Check the password in the database');
        console.log('   3. Try a different test account');
      }
      
    } else if (error.request) {
      console.log('❌ No response from server');
      console.log('');
      console.log('💡 Possible causes:');
      console.log('   1. Backend is not running on port 8082');
      console.log('   2. MongoDB is not running');
      console.log('   3. Firewall blocking connection');
      console.log('');
      console.log('🔧 Solutions:');
      console.log('   1. Start backend: mvnw spring-boot:run');
      console.log('   2. Check MongoDB is running');
      console.log('   3. Verify port 8082 is not in use');
      console.log('   4. Test backend health: curl http://localhost:8082/actuator/health');
      
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
testLogin();
