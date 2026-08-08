# 🚀 Quick Deployment Checklist

## ✅ Files Changed (Already Done)
- [x] `EmailConfig.java` - Made JavaMailSender conditional
- [x] `GmailSmtpService.java` - Disabled when using Resend
- [x] `OtpService.java` - Made JavaMailSender optional
- [x] `MailService.java` - Made JavaMailSender optional
- [x] `LinkService.java` - Made JavaMailSender optional
- [x] `OfferLetterEmailService.java` - Made JavaMailSender optional
- [x] `OfferLetterController.java` - Made JavaMailSender optional

## 📋 What You Need to Do Now

### 1. ✅ Get Resend API Key
- [ ] Go to https://resend.com
- [ ] Sign up / Log in
- [ ] Create API Key
- [ ] Copy the key (starts with `re_`)

### 2. ✅ Update Render Environment Variables

Go to Render Dashboard → Your Service → Environment Tab

**ADD/UPDATE these:**
```
RESEND_ENABLED=true
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=HRMS System
```

**REMOVE these (if they exist):**
```
GMAIL_USERNAME
GMAIL_APP_PASSWORD
spring.mail.host
spring.mail.port
spring.mail.username
spring.mail.password
```

### 3. ✅ Deploy Code to Render

```bash
# In your terminal
cd "d:\New folder\HRMSProject (2)\HRMSProject"
git add .
git commit -m "Fix: Switch from Gmail SMTP to Resend API for email delivery"
git push origin main
```

### 4. ✅ Test Email Sending

1. Wait for Render deployment to complete
2. Go to https://omoi-hrms.vercel.app
3. Login as admin
4. Go to Employee Directory
5. Click "Invite Employee"
6. Select 1 employee
7. Click "Send Bulk Invites"
8. Check Render logs for: `✅ RESEND EMAIL SENT SUCCESSFULLY`

### 5. ✅ Verify in Resend Dashboard

1. Go to https://resend.com/emails
2. Check for your sent emails
3. Verify status is "Delivered"

---

## 🔍 Quick Verification

After deployment, check Render logs for these lines:

```
📧 EMAIL PROVIDER: RESEND
📧 RESEND ENABLED: true
✅ RESEND EMAIL SENT SUCCESSFULLY TO: email@example.com
```

**If you see these, you're all set! ✅**

---

## ❌ If It Still Doesn't Work

1. Check Render logs for exact error message
2. Verify all environment variables are set correctly
3. Make sure `RESEND_API_KEY` starts with `re_`
4. Ensure you removed ALL Gmail-related variables
5. Try redeploying: Render Dashboard → Manual Deploy

---

## 📞 Need Help?

Paste the error from Render logs and we'll debug together!
