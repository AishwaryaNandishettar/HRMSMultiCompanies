# 📧 Email Invite System Testing Guide

## ✅ Your System is Already Configured!

Everything is set up correctly:
- ✅ Gmail SMTP configured
- ✅ Email Service implemented
- ✅ Thymeleaf templates ready
- ✅ Controller endpoints working
- ✅ Async email sending enabled

---

## 🚀 How to Test Email Sending

### **Method 1: Using the Frontend (Recommended)**

1. **Start the Backend:**
   ```bash
   cd "d:\New folder\HRMSProject (2)\HRMSProject"
   mvnw spring-boot:run
   ```

2. **Start the Frontend:**
   ```bash
   cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
   npm run dev
   ```

3. **Login as Admin:**
   - Open: http://localhost:5173
   - Login with admin credentials

4. **Send Invite:**
   - Go to Employee page
   - Click "Invite Employee" button
   - Enter a **real email address** (your Gmail)
   - Click "Send Invite Link"

5. **Check Your Gmail Inbox:**
   - Wait 10-30 seconds
   - Check inbox (and spam folder)
   - You should receive a beautiful HTML email!

---

### **Method 2: Using Test Script**

1. **Edit the test script:**
   ```bash
   notepad test-invite-email.js
   ```
   
   Change this line:
   ```javascript
   email: 'your-test-email@gmail.com', // ⚠️ CHANGE THIS
   ```

2. **Run the test:**
   ```bash
   node test-invite-email.js
   ```

3. **Check your email inbox!**

---

### **Method 3: Using Postman/Thunder Client**

**POST** `http://localhost:8082/api/onboarding/invite`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "your-email@gmail.com",
  "fullName": "Test Employee",
  "department": "IT",
  "designation": "Developer",
  "password": "TestPassword123"
}
```

---

## 🔍 Troubleshooting

### Issue 1: Email not received after 1 minute
- ✅ Check **Spam/Junk folder**
- ✅ Verify backend logs show: `✅ Invite email sent successfully to: your-email@gmail.com`
- ✅ Ensure Gmail App Password is correct (not regular password)

### Issue 2: "Failed to send email" error
- ✅ Verify internet connection
- ✅ Check if Gmail SMTP is accessible (firewall/antivirus)
- ✅ Verify the app password in `application.properties`:
  ```properties
  spring.mail.password=uiurdbkdhtexubjr
  ```

### Issue 3: "Invalid login" error
- ✅ Use Gmail **App Password**, not your regular password
- ✅ Generate new one: https://myaccount.google.com/apppasswords
- ✅ Enable 2-Step Verification first

### Issue 4: Email takes too long
- ✅ First email always takes 10-30 seconds
- ✅ Subsequent emails are faster
- ✅ Check backend logs to confirm sending progress

---

## 📊 Backend Logs to Watch

When sending email, you should see:
```
================================
FROM ADDRESS : aishushettar95@gmail.com
TO           : recipient@gmail.com
SUBJECT      : HRMS Invitation - Welcome!
================================
Calling mailSender.send()
✅ SMTP: Email sent successfully to: recipient@gmail.com
```

---

## 🎯 What the Employee Receives

The employee will receive a **professional HTML email** with:
- 👋 Welcome message
- 🏢 Company information
- 📋 Next steps
- 🔗 Login link to HRMS portal
- 👤 Username (their email)
- 🔒 Temporary password

---

## 🔒 Security Notes

1. **App Password:** The password in `application.properties` is a Gmail App Password, not your actual password
2. **Change Before Production:** Update to company email service before going live
3. **Environment Variables:** For production, use environment variables:
   ```properties
   spring.mail.username=${EMAIL_USERNAME}
   spring.mail.password=${EMAIL_PASSWORD}
   ```

---

## ✨ Features Already Working

1. **Single Invite:** Send to one employee
2. **Bulk Invite:** Send to multiple employees
3. **HTML Templates:** Beautiful, professional emails
4. **Retry Logic:** Automatic retry on failure
5. **Fallback:** Falls back to Resend API if SMTP fails
6. **Queue System:** Emails are queued for reliable delivery

---

## 📝 API Endpoints

### 1. Send Single Invite
```
POST /api/onboarding/invite
```

### 2. Send Bulk Invites
```
POST /api/onboarding/bulk-invite
```

### 3. Accept Invite
```
POST /api/onboarding/accept-invite
```

---

## 🎉 You're All Set!

Your email system is **production-ready** on localhost. Just:
1. Start backend
2. Click "Invite Employee"
3. Enter email
4. Click "Send Invite"
5. Email arrives in Gmail inbox! ✉️

**No additional configuration needed!**
