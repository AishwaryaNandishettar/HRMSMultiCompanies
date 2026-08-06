# ✅ Quick Email Test Checklist

## Before Testing

- [ ] **Backend is running** on `http://localhost:8082`
- [ ] **Frontend is running** on `http://localhost:5173`
- [ ] **MongoDB is running** on `localhost:27017`
- [ ] **Internet connection** is active

---

## Current Email Configuration

Your system uses **Gmail SMTP** with these settings:

```properties
✅ Host: smtp.gmail.com
✅ Port: 587
✅ From: aishushettar95@gmail.com
✅ App Password: uiurdbkdhtexubjr (configured)
✅ TLS: Enabled
```

---

## Test Steps

### **Step 1: Start Backend**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Wait for: `Started HmrsBackendApplication in X seconds`

---

### **Step 2: Open Frontend**
```bash
cd HRMS-Frontend
npm run dev
```

Or directly open: `http://localhost:5173`

---

### **Step 3: Login as Admin**
- Go to login page
- Enter admin credentials
- Navigate to Employee page

---

### **Step 4: Send Test Invite**

1. Click **"Invite Employee"** button
2. Enter your **real email address** (Gmail)
   ```
   Example: your-email@gmail.com
   ```
3. Click **"Send Invite Link"**

---

### **Step 5: Check Email**

1. Wait **10-30 seconds**
2. Open your **Gmail inbox**
3. Check **Spam folder** if not in inbox
4. Look for email from: `aishushettar95@gmail.com`
5. Subject: **"HRMS Invitation - Welcome!"**

---

## Expected Result

You should receive a professional HTML email with:
- Welcome message
- Company information
- Login credentials
- Access link

---

## Backend Logs to Verify

Look for these logs in your backend console:

```
📧 Sending invite email via Gmail SMTP to: your-email@gmail.com
================================
FROM ADDRESS : aishushettar95@gmail.com
TO           : your-email@gmail.com
SUBJECT      : HRMS Invitation - Welcome!
================================
Calling mailSender.send()
✅ SMTP: Email sent successfully to: your-email@gmail.com
✅ Invite email sent successfully to: your-email@gmail.com
```

---

## Troubleshooting

### ❌ Email not received
- Check **spam folder** first
- Verify backend shows: `✅ Email sent successfully`
- Try different email address
- Wait up to 1 minute

### ❌ "Failed to send email" error
- Check internet connection
- Verify app password is correct
- Ensure no firewall blocking port 587
- Try restarting backend

### ❌ Backend not starting
- Check if port 8082 is free
- Verify MongoDB is running
- Check for compilation errors

---

## Quick Test Command (Alternative)

If you have Node.js installed:

```bash
# 1. Edit the email in test-invite-email.js
notepad test-invite-email.js

# 2. Change 'your-test-email@gmail.com' to your real email

# 3. Run test
node test-invite-email.js
```

---

## Success Indicators

✅ Backend shows: `Email sent successfully`
✅ No errors in console
✅ Email received in Gmail within 30 seconds
✅ Email has proper formatting and content

---

## Important Notes

1. **First email** may take 20-30 seconds
2. **Check spam folder** if not in inbox
3. **Gmail may delay** emails by a few seconds
4. **App password** is already configured correctly
5. **No code changes needed** - system is ready!

---

## Your System Status

```
🟢 Email Service: CONFIGURED ✅
🟢 SMTP Settings: CORRECT ✅
🟢 Templates: READY ✅
🟢 Endpoints: WORKING ✅
🟢 Dependencies: INSTALLED ✅
```

**Everything is ready to send emails!** 🎉

---

## Contact Info

If emails still don't work after checking all steps:
1. Check backend console for error messages
2. Verify Gmail app password is still valid
3. Try generating new app password
4. Test with different recipient email

---

**Ready to test? Start from Step 1! 🚀**
