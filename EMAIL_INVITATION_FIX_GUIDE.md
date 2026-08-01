# 📧 Email Invitation Fix Guide

## 🎯 Problem

When sending invitations from the Employee Card page:
- Frontend shows: ✅ "Invitations sent successfully to all 10 employee(s)"
- But emails are NOT received in Gmail
- Backend console shows errors:
  - `MailSendException`
  - `Request failed with status code 500`
  - Email authentication failure

## 🔍 Root Cause

The backend is configured to use **Brevo SMTP** for sending emails, but the required environment variables (`BREVO_SMTP_USERNAME` and `BREVO_SMTP_KEY`) are not set in your local environment.

## ✅ Solution: Set Up Brevo SMTP (FREE - 300 emails/day)

### Step 1: Create Brevo Account (5 minutes)

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Click **"Sign up free"**
3. Enter your email and create password
4. Verify your email address
5. Complete the registration

### Step 2: Get SMTP Credentials (2 minutes)

1. Log in to [Brevo Dashboard](https://app.brevo.com/)
2. Click your name (top right) → **"SMTP & API"**
3. Click **"SMTP"** tab
4. You'll see:
   - **Login**: Your Brevo email (e.g., `yourname@gmail.com`)
   - **SMTP Server**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **Master Password**: Click **"Generate a new SMTP key"**
5. Copy the generated SMTP key (looks like: `xsmtpsib-a1b2c3d4...`)

### Step 3: Update .env File (1 minute)

I've already created a `.env` file at:
```
d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend\.env
```

**Open this file** and replace these values:

```env
# Replace with your Brevo credentials
BREVO_SMTP_USERNAME=your-brevo-login-email@gmail.com
BREVO_SMTP_KEY=xsmtpsib-your-actual-smtp-key-here
```

**Example:**
```env
BREVO_SMTP_USERNAME=aishwarya@omoikaneinnovations.com
BREVO_SMTP_KEY=xsmtpsib-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

### Step 4: Restart Backend (1 minute)

Stop your backend if running, then restart it:

**Option A: Using Command Prompt**
```cmd
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

**Option B: Using the start script**
```cmd
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
start-backend.bat
```

**Option C: If using VS Code/IntelliJ**
- Stop the running backend
- Restart it

### Step 5: Test Email Sending

1. Go to: `http://localhost:5173/employee-card`
2. Select some employees
3. Click **"Send Invitation"**
4. Check your Gmail inbox

✅ **Emails should arrive within 1-2 minutes!**

---

## 📝 Alternative: Use Gmail SMTP (If you prefer Gmail)

If you prefer using Gmail instead of Brevo:

### Update application.properties:

Replace the email configuration in:
```
d:\New folder\HRMSProject (2)\HRMSProject\src\main\resources\application.properties
```

Change from:
```properties
spring.mail.host=smtp-relay.brevo.com
spring.mail.port=587
spring.mail.username=${BREVO_SMTP_USERNAME}
spring.mail.password=${BREVO_SMTP_KEY}
```

To:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
```

### Update .env file:

```env
# Gmail SMTP Configuration
SPRING_MAIL_USERNAME=your-gmail@gmail.com
SPRING_MAIL_PASSWORD=your-16-char-app-password
```

### Get Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **"2-Step Verification"** (if not already enabled)
3. Search for **"App Passwords"**
4. Generate a new app password for "Mail"
5. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
6. Use this password in `.env` file

---

## 🚀 For Vercel/Production Deployment

The same email configuration will work after deployment! Just add the environment variables in Vercel:

### Vercel Environment Variables:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add these variables:

```
BREVO_SMTP_USERNAME = your-brevo-login-email@gmail.com
BREVO_SMTP_KEY = xsmtpsib-your-actual-smtp-key-here
MAIL_FROM_ADDRESS = noreply@omoikaneinnovations.com
MONGODB_URI = your-mongodb-atlas-connection-string
```

✅ **No code changes needed!** The same backend code works on both localhost and Vercel.

---

## 🔧 Troubleshooting

### Problem: Still not receiving emails

**Check 1: SMTP Credentials**
- Make sure SMTP credentials are correct
- No extra spaces in the `.env` file
- SMTP key should start with `xsmtpsib-`

**Check 2: Backend Logs**
Look for these lines in console:
```
================================
FROM ADDRESS : noreply@omoikaneinnovations.com
TO           : employee@gmail.com
SUBJECT      : HRMS Invitation - Welcome!
================================
✅ Email sent successfully to: employee@gmail.com
```

**Check 3: Spam Folder**
- Check Gmail spam/junk folder
- Mark as "Not Spam" if found there

**Check 4: Brevo Account Limits**
- Free tier: 300 emails/day
- Check Brevo dashboard for usage stats

**Check 5: Email Verification**
- Some SMTP providers require domain verification
- For testing, use your actual Brevo login email as sender

### Problem: "Authentication failed" error

This means SMTP credentials are wrong. Double-check:
- Username is your Brevo login email
- Password is the SMTP key (not your Brevo account password!)

### Problem: Backend not reading .env file

**Solution:**
1. Make sure `.env` file is in `HRMS-Backend` folder
2. Restart backend completely
3. Check that there are no syntax errors in `.env`

---

## 📊 Expected Email Format

When invitation emails are sent, employees will receive:

**Subject:** HRMS Invitation - Welcome!

**Content:**
- Welcome message
- Invitation link to complete onboarding
- OTP (if applicable)
- Temporary password (if applicable)
- Company logo and branding

---

## ✨ Summary

| Issue | Solution | Time |
|-------|----------|------|
| Emails not sending | Add Brevo SMTP credentials to `.env` | 5 min |
| Backend not configured | Created `.env` file with proper variables | Done ✅ |
| Vercel deployment | Add same env vars in Vercel dashboard | 2 min |

**Total Time:** ~10 minutes to set up and test

---

## 🎯 Quick Checklist

- [ ] Created Brevo account
- [ ] Generated SMTP key
- [ ] Updated `.env` file with credentials
- [ ] Restarted backend
- [ ] Tested sending invitation
- [ ] Received email in Gmail
- [ ] Added env vars to Vercel (for production)

---

## 📞 Still Need Help?

If emails still don't work after following these steps:

1. Share the backend console logs (look for email-related errors)
2. Verify SMTP credentials in Brevo dashboard
3. Test with a simple email first
4. Check Brevo sending limits

---

**Last Updated:** August 1, 2026  
**Status:** Ready to implement  
**No Code Changes Required:** ✅ Just configuration!
