# 🚀 START HERE - Quick Fix Guide

## ✅ What Was Fixed
Your email system was trying to use Gmail SMTP but failing. It's now configured to use **Resend API** instead.

---

## 📋 What You Need to Do (5 Steps)

### Step 1: Get Resend API Key (2 minutes)
1. Go to: https://resend.com
2. Sign up (free)
3. Click "API Keys" → "Create API Key"
4. Copy the key (starts with `re_`)

---

### Step 2: Set Environment Variables in Render (3 minutes)

Go to: **Render Dashboard → Your Service → Environment**

**ADD THESE:**
```
RESEND_ENABLED=true
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=HRMS System
```

**REMOVE THESE (if they exist):**
```
GMAIL_USERNAME
GMAIL_APP_PASSWORD
spring.mail.host
spring.mail.port
spring.mail.username
spring.mail.password
```

Click "Save Changes"

---

### Step 3: Deploy Code (2 minutes)

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
git add .
git commit -m "Fix: Switch to Resend API for emails"
git push origin main
```

Wait for Render to finish deploying.

---

### Step 4: Test Email (1 minute)

1. Go to: https://omoi-hrms.vercel.app
2. Login as admin
3. Go to "Employee Directory"
4. Click "Invite Employee"
5. Select ONE employee
6. Click "Send Bulk Invites"

---

### Step 5: Verify Success (1 minute)

**Check Render Logs:**
```
✅ Should see: "📧 EMAIL PROVIDER: RESEND"
✅ Should see: "✅ RESEND EMAIL SENT SUCCESSFULLY"
❌ Should NOT see: "smtp.gmail.com"
```

**Check Resend Dashboard:**
- Go to: https://resend.com/emails
- Should see your email with status "Delivered"

---

## 📚 More Details (Optional)

If you need more information, read these files:

1. **DEPLOYMENT_CHECKLIST.md** - Detailed checklist
2. **RESEND_EMAIL_SETUP_GUIDE.md** - Complete setup guide
3. **WHAT_WAS_FIXED.md** - Technical explanation
4. **SUCCESS_INDICATORS.md** - What success looks like
5. **RESEND_API_KEY_SETUP.md** - API key setup guide
6. **RENDER_ENV_VARIABLES.txt** - Environment variables reference

---

## ❓ Need Help?

If something doesn't work:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Make sure `RESEND_API_KEY` starts with `re_`
4. Try redeploying from Render dashboard

---

## ✅ Expected Result

After following these steps:
- ✅ Emails send successfully
- ✅ No more Gmail SMTP errors
- ✅ Users receive invitation emails
- ✅ Frontend shows success message

---

**Total Time:** ~10 minutes  
**Difficulty:** Easy  
**Status:** Ready to Deploy 🚀
