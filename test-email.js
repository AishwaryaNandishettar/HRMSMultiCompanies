/**
 * Quick Email Test Script
 * Tests if email sending works before integrating with full backend
 */

require('dotenv').config();
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com', // Change this
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'  // Change this
  }
});

async function testEmail() {
  try {
    console.log('📧 Testing email sending...');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'your-test-email@gmail.com', // Change this to your email
      subject: '🎉 Test Email - Recruitment Status Update',
      text: `
Dear Test Candidate,

This is a test email from your HRMS Recruitment System.

If you receive this email, the email notification feature is working correctly!

Best regards,
HR Team
      `
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
