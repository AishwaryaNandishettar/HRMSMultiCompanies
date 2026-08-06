# 📊 Email Invitation Flow - Visual Guide

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    HR/Admin (Frontend)                           │
│                   http://localhost:5173                          │
│                  https://your-app.vercel.app                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 1. Click "Invite Employee"
                             │    Enter: email, name, dept
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              POST /api/onboarding/invite                         │
│              Backend: http://localhost:8082                      │
│              Backend: https://your-backend.railway.app           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 2. OnboardingService processes
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                     OnboardingService                            │
│  - Create/Update Employee record                                 │
│  - Create/Update User account                                    │
│  - Generate OTP                                                  │
│  - Get frontend URL from config                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 3. Send email via EmailService
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EmailService                               │
│  - Load HTML template (invite-email.html)                        │
│  - Fill in variables:                                            │
│    * inviteLink → frontendUrl                                    │
│    * email → employee email                                      │
│    * password → Temp@123                                         │
│    * otp → generated OTP                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 4. Send via Gmail SMTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Gmail SMTP Server                           │
│              smtp.gmail.com:587                                  │
│         aishushettar95@gmail.com                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 5. Email delivered
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Employee Email Inbox                           │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Subject: HRMS Invitation - Welcome!                      │   │
│  │                                                           │   │
│  │ 👋 Welcome to HRMS!                                      │   │
│  │                                                           │   │
│  │ Application Link: http://localhost:5173                  │   │
│  │                   https://your-app.vercel.app            │   │
│  │                                                           │   │
│  │ Username: employee@example.com                           │   │
│  │ Temporary Password: Temp@123                             │   │
│  │                                                           │   │
│  │ [Complete Your Profile] Button                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ 6. Employee clicks link
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Employee Login Page (Frontend)                      │
│         - Enters username (email)                                │
│         - Enters temporary password                              │
│         - Completes onboarding                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          LOCALHOST SETUP                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Frontend (React + Vite)         Backend (Spring Boot)               │
│  ┌────────────────────┐         ┌──────────────────────┐            │
│  │ http://localhost:   │         │ http://localhost:    │            │
│  │ 5173                │────────>│ 8082                 │            │
│  │                     │         │                      │            │
│  │ - InviteEmployee.jsx│         │ - OnboardingService  │            │
│  │ - UI Components     │         │ - EmailService       │            │
│  │ - Axios calls       │         │ - Thymeleaf          │            │
│  └────────────────────┘         └───────────┬──────────┘            │
│                                              │                        │
│                                              │                        │
│                                 ┌────────────▼─────────────┐         │
│                                 │  Gmail SMTP              │         │
│                                 │  smtp.gmail.com:587      │         │
│                                 │  aishushettar95@gmail... │         │
│                                 └──────────────────────────┘         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                       PRODUCTION SETUP (Vercel)                       │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Frontend (Vercel)               Backend (Railway/Render)             │
│  ┌────────────────────┐         ┌──────────────────────┐            │
│  │ https://your-app.  │         │ https://your-backend.│            │
│  │ vercel.app         │────────>│ railway.app          │            │
│  │                     │         │                      │            │
│  │ Env:                │         │ Env:                 │            │
│  │ VITE_API_BASE_URL= │         │ FRONTEND_URL=        │            │
│  │ https://...railway │         │ https://...vercel    │            │
│  └────────────────────┘         └───────────┬──────────┘            │
│                                              │                        │
│                                              │                        │
│                                 ┌────────────▼─────────────┐         │
│                                 │  Gmail SMTP              │         │
│                                 │  (Same credentials)      │         │
│                                 └──────────────────────────┘         │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 📧 Email Template Variables

```javascript
{
  email: "employee@example.com",           // Employee's email
  inviteLink: "http://localhost:5173",     // Frontend URL (dynamic)
  password: "Temp@123",                    // Temporary password
  otp: "123456",                           // Generated OTP
  recipientName: "John Doe",               // Employee name
  companyName: "Omoikane Innovations",     // Company
  department: "IT",                        // Department
  position: "Developer"                    // Position
}
```

## 🔑 Configuration Matrix

| Environment | Frontend URL | Backend URL | Configuration |
|-------------|-------------|-------------|---------------|
| **Localhost** | `http://localhost:5173` | `http://localhost:8082` | Default (no env vars needed) |
| **Production** | `https://your-app.vercel.app` | `https://your-backend.railway.app` | Set `FRONTEND_URL` env var |

## 🎯 Key Files

```
HRMSProject/
├── src/main/resources/
│   ├── application.properties          ← Main configuration
│   └── templates/email/
│       └── invite-email.html           ← Email HTML template
│
├── src/main/java/.../service/
│   ├── OnboardingService.java          ← Invitation logic
│   └── EmailService.java               ← Email sending
│
├── HRMS-Frontend/
│   └── src/Components/
│       └── InviteEmployee.jsx          ← UI component
│
└── Documentation/
    ├── START_HERE.md                   ← Quick start guide
    ├── EMAIL_SETUP_README.md           ← Setup instructions
    ├── TEST_EMAIL_SETUP.md             ← Testing guide
    ├── DEPLOYMENT_GUIDE.md             ← Deployment steps
    └── quick-test-email.js             ← Test script
```

## 🔄 Testing Workflow

```
┌──────────────────┐
│ 1. Edit Test     │
│    Script        │
│                  │
│ Change email to  │
│ your address     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 2. Start Backend │
│                  │
│ mvnw spring-boot:│
│ run              │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3. Run Test      │
│                  │
│ node quick-test- │
│ email.js         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 4. Check Email   │
│                  │
│ Look for email   │
│ with invite link │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 5. Verify Link   │
│                  │
│ Should be:       │
│ localhost:5173   │
└──────────────────┘
```

## ✅ Success Indicators

### **Backend Logs (Success):**
```
📧 Sending invite email to: test@example.com
🔗 Onboarding Link: http://localhost:5173
📬 From Email: aishushettar95@gmail.com
✅ Invite email sent successfully to: test@example.com
```

### **Backend Logs (Failure):**
```
❌ Email sending failed for test@example.com: Connection timeout
```

### **Test Script Output (Success):**
```
✅ SUCCESS! Email sent!
📬 Check your email inbox:
   Email: test@example.com
   Subject: "HRMS Invitation - Welcome!"
```

## 🎬 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run

# Terminal 2: Start Frontend (Optional)
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev

# Terminal 3: Test Email
npm install axios
node quick-test-email.js
```

---

**Everything is visual and ready to use! 🎨**
