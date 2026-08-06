# ✉️ Email Invitation System - Quick Start

## 🎯 Summary

Your HRMS application **already has email invitations configured**! This system automatically sends invitation emails with a link to your application.

## ✅ What's Already Working

- ✉️ Gmail SMTP configured
- 🔗 Invitation link included in email
- 🔑 Temporary credentials sent
- 🌐 Works on localhost and production (Vercel)

## 🚀 Quick Test (3 Steps)

### **1. Start Backend**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

### **2. Start Frontend**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

### **3. Test Email**
```bash
# Edit quick-test-email.js and change the email address
node quick-test-email.js
```

## 📬 What the Email Contains

When an employee is invited, they receive:

```
Subject: HRMS Invitation - Welcome!

👋 Welcome to HRMS!

Application Link: http://localhost:5173
Username: employee@example.com
Temporary Password: Temp@123

[Complete Your Profile] Button
```

## 🌐 Production Setup

When deploying to Vercel, just set this environment variable in Railway/Render:

```bash
FRONTEND_URL=https://your-app.vercel.app
```

The email will automatically contain the correct production URL!

## 📚 Detailed Guides

- **Testing & Setup**: See `TEST_EMAIL_SETUP.md`
- **Deployment**: See `DEPLOYMENT_GUIDE.md`

## 🔧 Troubleshooting

**Email not received?**
1. Check spam folder
2. Verify backend is running on port 8082
3. Check backend logs for errors
4. Verify Gmail credentials in `application.properties`

**Wrong URL in email?**
- Localhost: Default is `http://localhost:5173` ✅
- Production: Set `FRONTEND_URL` environment variable

## ✨ That's It!

Your email invitation system is ready to use. Just test it and deploy! 🚀
