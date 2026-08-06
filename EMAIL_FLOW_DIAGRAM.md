# 📊 Email Invite System - Flow Diagram

## 🎯 Complete Email Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                              │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Add Employee │  │Invite Employee│  │  Bulk Invite │         │
│  └──────────────┘  └──────┬───────┘  └──────────────┘         │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
            ┌────────────────────────────────┐
            │  Admin Enters Email Address    │
            │  example: emp@gmail.com        │
            └────────────┬───────────────────┘
                         │
                         ▼
            ┌────────────────────────────────┐
            │  Click "Send Invite" Button    │
            └────────────┬───────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                             │
│                  InviteEmployee.jsx                             │
│                                                                 │
│  POST http://localhost:8082/api/onboarding/invite              │
│  {                                                              │
│    "email": "emp@gmail.com",                                   │
│    "fullName": "Test User",                                    │
│    "department": "IT",                                         │
│    "designation": "Developer"                                  │
│  }                                                              │
└────────────┬────────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  OnboardingController.java                                │ │
│  │  @PostMapping("/api/onboarding/invite")                  │ │
│  │  → inviteEmployee(@RequestBody)                          │ │
│  └────────────┬──────────────────────────────────────────────┘ │
│               │                                                 │
│               ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  OnboardingService.java                                   │ │
│  │  → onboard(payload)                                       │ │
│  │     1. Find or Create Employee                            │ │
│  │     2. Find or Create User                                │ │
│  │     3. Generate OTP                                       │ │
│  │     4. Generate temporary password                        │ │
│  │     5. Call EmailService                                  │ │
│  └────────────┬──────────────────────────────────────────────┘ │
│               │                                                 │
│               ▼                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  EmailService.java                                        │ │
│  │  → sendInviteEmail(email, link, otp, password)           │ │
│  │     1. Create MimeMessage                                 │ │
│  │     2. Set FROM: aishushettar95@gmail.com                │ │
│  │     3. Set TO: emp@gmail.com                             │ │
│  │     4. Process Thymeleaf template                         │ │
│  │     5. Send via Gmail SMTP                                │ │
│  └────────────┬──────────────────────────────────────────────┘ │
└───────────────┼─────────────────────────────────────────────────┘
                │
                ▼
┌────────────────────────────────────────────────────────────────┐
│                    GMAIL SMTP SERVER                            │
│                    smtp.gmail.com:587                           │
│                                                                 │
│  ┌─────────────────────────────────────────┐                  │
│  │  1. Authenticate with app password       │                  │
│  │  2. Validate sender                      │                  │
│  │  3. Validate recipient                   │                  │
│  │  4. Queue email for delivery             │                  │
│  │  5. Send to recipient's Gmail            │                  │
│  └─────────────┬────────────────────────────┘                  │
└────────────────┼───────────────────────────────────────────────┘
                 │
                 ▼
┌────────────────────────────────────────────────────────────────┐
│                  EMPLOYEE'S GMAIL INBOX                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ From: aishushettar95@gmail.com                           │ │
│  │ To: emp@gmail.com                                        │ │
│  │ Subject: HRMS Invitation - Welcome!                      │ │
│  │                                                           │ │
│  │ ┌─────────────────────────────────────────────────────┐ │ │
│  │ │ 👋 Welcome to HRMS!                                  │ │ │
│  │ │                                                       │ │ │
│  │ │ Welcome, Test User!                                  │ │ │
│  │ │ We are excited to have you join our team.           │ │ │
│  │ │                                                       │ │ │
│  │ │ Company: Omoikane Innovations                        │ │ │
│  │ │ Department: IT                                       │ │ │
│  │ │ Position: Developer                                  │ │ │
│  │ │                                                       │ │ │
│  │ │ Application Link: http://localhost:5173             │ │ │
│  │ │ Username: emp@gmail.com                              │ │ │
│  │ │ Temporary Password: Temp@123                         │ │ │
│  │ │                                                       │ │ │
│  │ │ [Complete Your Profile]                              │ │ │
│  │ └─────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ✅ EMAIL DELIVERED SUCCESSFULLY! ✉️                           │
└────────────────────────────────────────────────────────────────┘
```

---

## 📋 Component Breakdown

### 1. **Frontend Components**
```
HRMS-Frontend/
  └── src/
      └── Components/
          └── InviteEmployee.jsx  ← Handles UI and API call
```

### 2. **Backend Components**
```
src/main/java/.../
  ├── controller/
  │   └── OnboardingController.java  ← API endpoint
  ├── service/
  │   ├── OnboardingService.java     ← Business logic
  │   └── EmailService.java          ← Email sending
  └── config/
      └── EmailConfig.java           ← Email configuration

src/main/resources/
  ├── application.properties         ← Gmail SMTP config
  └── templates/email/
      └── invite-email.html          ← Email template
```

### 3. **Configuration**
```
application.properties:
  - spring.mail.host=smtp.gmail.com
  - spring.mail.port=587
  - spring.mail.username=aishushettar95@gmail.com
  - spring.mail.password=uiurdbkdhtexubjr (App Password)
```

---

## 🔄 Data Flow

### Request Data:
```javascript
{
  "email": "emp@gmail.com",
  "fullName": "Test User",
  "department": "IT",
  "designation": "Developer"
}
```

### Database Updates:
```
MongoDB Collections:
  ├── employees
  │   └── New employee record created
  └── users
      └── New user account created
```

### Email Variables:
```javascript
{
  "email": "emp@gmail.com",
  "inviteLink": "http://localhost:5173",
  "otp": "123456",
  "password": "Temp@123",
  "companyName": "Omoikane Innovations",
  "department": "IT",
  "designation": "Developer"
}
```

---

## ⏱️ Timing

```
Action                          Time
────────────────────────────────────────
Admin clicks "Send Invite"      0s
Frontend sends request          0.1s
Backend processes request       0.5s
Email service sends             2-5s
Gmail SMTP accepts              5-10s
Email arrives in inbox          10-30s
────────────────────────────────────────
Total:                          10-30 seconds
```

---

## 🎯 Success Indicators

### ✅ Backend Logs:
```
📧 Sending invite email via Gmail SMTP to: emp@gmail.com
================================
FROM ADDRESS : aishushettar95@gmail.com
TO           : emp@gmail.com
SUBJECT      : HRMS Invitation - Welcome!
================================
Calling mailSender.send()
✅ SMTP: Email sent successfully to: emp@gmail.com
```

### ✅ Frontend:
```
Alert: "Invite sent successfully 📩"
```

### ✅ Gmail Inbox:
```
New email from: aishushettar95@gmail.com
Subject: HRMS Invitation - Welcome!
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────┐
│ Gmail App Password (Not regular password)│
│ → Stored in application.properties      │
│ → Used for SMTP authentication          │
│ → More secure than regular password     │
│ → Can be revoked independently           │
└─────────────────────────────────────────┘
```

---

## 🚀 Quick Test Flow

```
1. Start Backend
   ↓
2. Open test-email-simple.html
   ↓
3. Enter your email
   ↓
4. Click "Send Invite"
   ↓
5. Check Gmail inbox
   ↓
6. ✅ Email received!
```

---

## 📊 Error Handling

```
If Gmail SMTP fails:
  ├── Log error
  ├── Try Resend API (fallback)
  └── If both fail:
      ├── Save to email queue
      └── Retry with exponential backoff
```

---

## 🎉 Result

**Employee receives a professional invitation email in their Gmail inbox!**

The email includes:
- ✅ Welcome message
- ✅ Company information
- ✅ Login credentials
- ✅ Access link
- ✅ Beautiful HTML design
- ✅ Clear next steps

---

**This is exactly what your system does! 🚀**
