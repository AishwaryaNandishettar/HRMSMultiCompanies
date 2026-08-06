/**
 * Quick Email Test Script
 * Tests if email sending works before integrating with full backend
 */

const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'aishushettar95@gmail.com',
    pass: 'uiurdbkdhtexubjr'
  }
});

async function testEmail() {
  try {
    console.log('📧 Testing email sending...');

    const info = await transporter.sendMail({
      from: 'aishushettar95@gmail.com',
      to: 'aishushettar95@gmail.com',
      subject: '🎉 Test Email - HRMS System Test',
      text: 'This is a test email to verify Gmail SMTP configuration works correctly!'
    });

    console.log('✅ Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📧 Email sent to:', info.accepted);
    
  } catch (error) {
    console.error('❌ Email sending failed!');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Solution: Use Gmail App Password, not regular password');
      console.log('Get it from: https://myaccount.google.com/apppasswords');
    }
  }
}

// Run test
testEmail();
