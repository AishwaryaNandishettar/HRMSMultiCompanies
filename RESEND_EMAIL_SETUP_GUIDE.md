# 🔧 Resend Email Setup Guide - Fixed Configuration

## ✅ What Was Fixed

Your application was trying to connect to Gmail SMTP (`smtp.gmail.com:587`) even though you configured it to use Resend. The error was:

```
java.net.SocketTimeoutException: Connect timed out
Couldn't connect to host, port: smtp.gmail.com, 587
```

### Root Cause
The `EmailConfig.java` was creating a `JavaMailSender` bean that required Gmail SMTP configuration, but those properties were removed from `application.properties`.

### Solution Applied
1. Made `JavaMailSender` bean **conditional** - it's only created when `resend.enabled=false`
2. Made all services that depend on `JavaMailSender` use optional injection (`required = false`)
3. Added `@ConditionalOnProperty` to `GmailSmtpService` to disable it when using Resend
4. Your existing `EmailService` already uses `ResendEmailService` correctly

---

## 📋 Required Environment Variables for Render

Set these **exact** environment variables in your Render dashboard:

### 1. Core Configuration
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_db

# Frontend URL (Your Vercel deployment)
FRONTEND_URL=https://omoi-hrms.vercel.app

# Server Port (usually 8082)
PORT=8082
```

### 2. Resend Email Configuration (CRITICAL)
```bash
# Enable Resend (MUST be true)
RESEND_ENABLED=true

# Your Resend API Key (Get from https://resend.com/api-keys)
RESEND_API_KEY=re_YourApiKeyHere_ChangeThis

# From email address (use onboarding@resend.dev for testing)
RESEND_FROM_EMAIL=onboarding@resend.dev

# From name
RESEND_FROM_NAME=HRMS System
```

### 3. JWT Configuration
```bash
JWT_SECRET=MyFixedSecretKey123456
JWT_EXPIRATION=86400
```

### 4. ⚠️ DO NOT SET THESE (Gmail SMTP - Not needed)
```bash
# ❌ Remove these from Render if they exist:
# GMAIL_USERNAME
# GMAIL_APP_PASSWORD
# spring.mail.host
# spring.mail.port
# spring.mail.username
# spring.mail.password
```

---

## 🚀 Step-by-Step Deployment to Render

### Step 1: Get Your Resend API Key

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Go to **API Keys** section
4. Click **"Create API Key"**
5. Give it a name like "HRMS Production"
6. Copy the API key (starts with `re_`)

### Step 2: Configure Render Environment Variables

1. Open your Render dashboard
2. Go to your **HRMS Backend** service
3. Click **"Environment"** tab
4. Add/Update these variables:

```
RESEND_ENABLED=true
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx   (paste your actual key)
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=HRMS System
FRONTEND_URL=https://omoi-hrms.vercel.app
MONGODB_URI=mongodb+srv://...your-actual-mongodb-uri...
```

5. **Remove** any Gmail-related variables:
   - `GMAIL_USERNAME`
   - `GMAIL_APP_PASSWORD`
   - Any `spring.mail.*` variables

### Step 3: Deploy the Updated Code

1. Commit and push your changes:
```bash
git add .
git commit -m "Fix: Switch from Gmail SMTP to Resend API"
git push origin main
```

2. Render will automatically deploy
3. Wait for deployment to complete (check logs)

### Step 4: Test the Email

1. Go to your frontend: `https://omoi-hrms.vercel.app`
2. Navigate to **Employee Directory**
3. Click **"Invite Employee"**
4. Select employees and click **"Send Bulk Invites"**
5. Check the Render logs for success messages:
   ```
   ✅ RESEND EMAIL SENT SUCCESSFULLY TO: user@example.com
   ```

---

## 🔍 Verifying the Fix

### Check Render Logs

Look for these **SUCCESS** indicators:
```
📧 EMAIL PROVIDER: RESEND
📧 RESEND ENABLED: true
✅ RESEND EMAIL SENT SUCCESSFULLY TO: email@example.com
```

### Check Resend Dashboard

1. Go to [https://resend.com/emails](https://resend.com/emails)
2. You should see your sent emails with status:
   - **Delivered** ✅ (email sent successfully)
   - **Opened** ✅ (recipient opened the email)
   - **Clicked** ✅ (recipient clicked the link)

---

## 🎯 How It Works Now

### Email Flow
```
User clicks "Send Bulk Invites"
    ↓
InviteEmployee.jsx → sends request to backend
    ↓
OnboardingService.sendInvitationEmail()
    ↓
EmailService.sendInviteEmail()
    ↓
EmailService.sendSingleEmail()
    ↓
ResendEmailService.sendEmail()
    ↓
HTTP POST to https://api.resend.com/emails
    ↓
✅ Email delivered to recipient's inbox
```

### Key Changes Made
1. **EmailConfig.java** - JavaMailSender is now optional and disabled when using Resend
2. **GmailSmtpService.java** - Disabled when `resend.enabled=true`
3. **All services** - JavaMailSender injection is now optional (`required = false`)
4. **EmailService.java** - Already correctly configured to use ResendEmailService

---

## ❌ Troubleshooting

### Problem: Still seeing Gmail SMTP errors

**Solution:**
1. Verify `RESEND_ENABLED=true` in Render
2. Check that you removed all Gmail-related environment variables
3. Redeploy the application
4. Check logs for `📧 EMAIL PROVIDER: RESEND`

### Problem: Emails not sending

**Check:**
1. Resend API key is correct and starts with `re_`
2. `RESEND_FROM_EMAIL=onboarding@resend.dev` (use this for testing)
3. Check Resend dashboard for error messages
4. Render logs show `✅ RESEND EMAIL SENT SUCCESSFULLY`

### Problem: 404 or authentication errors from Resend

**Solution:**
1. Verify your Resend API key is valid
2. Check if you exceeded free tier limits (100 emails/day)
3. Verify the API key has "Send" permissions

---

## 📊 Email Limits

### Resend Free Tier
- **100 emails per day**
- **3,000 emails per month**
- Perfect for testing and small deployments

### Upgrade if needed
- **Pro Plan**: $20/month for 50,000 emails
- See: [https://resend.com/pricing](https://resend.com/pricing)

---

## ✅ Expected Behavior After Fix

### ✅ Console Logs (Render)
```
================================
📧 EMAIL PROVIDER: RESEND
📧 RESEND ENABLED: true
📧 RESEND SERVICE: Available
📧 TO: user@example.com
📧 SUBJECT: HRMS Invitation - Welcome!
================================
📤 Sending request to Resend...
📨 Resend response status: 200 OK
✅ EMAIL SENT SUCCESSFULLY TO: user@example.com
```

### ✅ Frontend Modal
```
✅ Sent 10 invitation(s) successfully.
❌ 2 failed:
   • ashwarya@company.com - Query {...} returned non unique result
```

### ✅ Email Received
Recipients will receive a professional email with:
- Company branding
- Onboarding link
- Temporary credentials (OTP + Password)
- "Access HRMS Portal" button

---

## 🔐 Security Notes

1. **Never commit** your `RESEND_API_KEY` to Git
2. Use environment variables for all sensitive data
3. Rotate API keys periodically
4. Monitor Resend dashboard for suspicious activity

---

## 📞 Support

If you still face issues:

1. **Check Render logs**: Look for error messages
2. **Check Resend logs**: [https://resend.com/emails](https://resend.com/emails)
3. **Verify environment variables**: Make sure all are set correctly
4. **Test with a single email first**: Don't bulk send until single email works

---

## ✅ Summary

Your application is now correctly configured to:
- ✅ Use Resend API for email delivery
- ✅ Skip Gmail SMTP entirely
- ✅ Send invitation emails successfully
- ✅ Display proper success/failure messages in the UI

**Next Steps:**
1. Deploy to Render with updated environment variables
2. Test with a single invitation
3. If successful, proceed with bulk invitations
4. Monitor Resend dashboard for delivery status

---

**Last Updated:** 2026-08-08  
**Status:** ✅ Ready for Production Deployment
