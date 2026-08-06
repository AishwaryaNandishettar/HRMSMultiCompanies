# 🚀 Email Invitation System - Complete Setup Guide

## ✅ What's Already Working

Your HRMS application is **already configured** to send invitation emails with:
- ✉️ Invitation link to the frontend
- 🔑 Username (employee email)
- 🔐 Temporary password
- 🔢 OTP for verification

## 📋 Configuration for Localhost & Vercel

### **1. Localhost Configuration (Already Done ✅)**

Your `application.properties` is already configured:

```properties
# Gmail SMTP (Working)
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=uiurdbkdhtexubjr

# Frontend URL (Dynamic - supports both local and production)
frontend.url=${FRONTEND_URL:http://localhost:5173}
```

### **2. For Vercel Deployment**

When you deploy to Vercel/Railway/Render, set these environment variables:

```bash
# Backend Environment Variables (Railway/Render)
FRONTEND_URL=https://your-frontend.vercel.app
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

```bash
# Frontend Environment Variables (Vercel)
VITE_API_BASE_URL=https://your-backend.railway.app
```

## 🧪 How to Test on Localhost

### **Step 1: Start Backend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Or if using IDE, run the main application class.

### **Step 2: Start Frontend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

### **Step 3: Test Email Sending**

**Option A: Use the test script**

```bash
# Install axios if not installed
npm install axios

# Edit test-invite-email.js and change the email
# Then run:
node test-invite-email.js
```

**Option B: Use the UI**

1. Open http://localhost:5173
2. Login as admin
3. Navigate to "Invite Employee" section
4. Click "Invite Employee" button
5. Enter email address
6. Click "Send Invite Link"

### **Step 4: Check Your Email**

The employee will receive an email with:

```
Subject: HRMS Invitation - Welcome!

Application Link: http://localhost:5173
Username: employee@example.com
Temporary Password: Temp@123

[Complete Your Profile] (Button)
```

## 🔧 Quick Test Script

Create a file `quick-test-email.js`:

```javascript
const axios = require('axios');

async function testEmail() {
  try {
    const response = await axios.post('http://localhost:8082/api/onboarding/invite', {
      email: 'your-test-email@gmail.com', // ⚠️ CHANGE THIS
      fullName: 'Test Employee',
      department: 'IT',
      designation: 'Developer'
    });
    
    console.log('✅ Success:', response.data);
    console.log('\n📬 Check your email inbox!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testEmail();
```

Run it:
```bash
node quick-test-email.js
```

## 🚨 Troubleshooting

### **Problem: Email not received**

**Check 1: Backend logs**
```bash
# Look for these log messages:
📧 Sending invite email to: employee@example.com
🔗 Onboarding Link: http://localhost:5173
✅ Invite email sent successfully
```

**Check 2: Gmail security**
- Verify the Gmail account has 2-Step Verification enabled
- Verify the app password is correct (`uiurdbkdhtexubjr`)
- Check spam folder

**Check 3: SMTP connection**
```bash
# If you see connection errors, check:
# - Internet connection
# - Firewall settings
# - Gmail SMTP is accessible (smtp.gmail.com:587)
```

### **Problem: Wrong URL in email**

**For Localhost:**
- Default is `http://localhost:5173`
- No changes needed

**For Production:**
- Set environment variable: `FRONTEND_URL=https://your-app.vercel.app`

## 📧 What the Invitation Email Contains

```html
Subject: HRMS Invitation - Welcome!

👋 Welcome to HRMS!

Welcome, New Employee!

We are excited to have you join our team.

┌─────────────────────────────────┐
│ Company: Omoikane Innovations   │
│ Your Email: employee@domain.com │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Application Link:               │
│ http://localhost:5173           │
│                                 │
│ Username: employee@domain.com   │
│ Temporary Password: Temp@123    │
└─────────────────────────────────┘

[Complete Your Profile] (Button)

📋 Next Steps:
1. Click the button to complete your profile
2. Set up your account credentials
3. Review company policies
4. Complete onboarding documents
5. Connect with your team
```

## ✅ Verification Checklist

Before testing, ensure:

- [ ] Backend is running on port 8082
- [ ] Frontend is running on port 5173
- [ ] MongoDB is running (if using local MongoDB)
- [ ] Gmail account credentials are correct
- [ ] Test email address is valid
- [ ] Internet connection is active

## 🎯 Production Deployment Steps

### **Backend (Railway/Render)**

1. Deploy Spring Boot backend
2. Set environment variables:
   ```
   FRONTEND_URL=https://your-frontend.vercel.app
   MONGODB_URI=mongodb+srv://...
   ```

### **Frontend (Vercel)**

1. Deploy React frontend
2. Set environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

### **Test Production**

1. Open https://your-frontend.vercel.app
2. Use the invite feature
3. Check that the email contains the correct Vercel URL

## 📞 Support

If you encounter issues:

1. Check backend logs for error messages
2. Verify all environment variables are set
3. Test with a different email address
4. Check Gmail account settings
5. Verify firewall/antivirus isn't blocking SMTP

---

**Everything is already configured! Just test it! 🚀**
