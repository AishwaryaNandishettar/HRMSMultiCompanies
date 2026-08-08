# 🔧 Troubleshooting Guide

## Common Issues and Solutions

---

## ❌ Issue 1: Still Seeing Gmail SMTP Errors

### Symptoms:
```
Couldn't connect to host, port: smtp.gmail.com, 587
SocketTimeoutException: Connect timed out
```

### Solutions:

#### ✅ Solution 1: Verify Environment Variables
1. Go to Render Dashboard → Your Service → Environment
2. Check that `RESEND_ENABLED=true` (exactly, case-sensitive)
3. Check that you removed ALL Gmail-related variables:
   - `GMAIL_USERNAME`
   - `GMAIL_APP_PASSWORD`
   - `spring.mail.host`
   - `spring.mail.port`
   - `spring.mail.username`
   - `spring.mail.password`

#### ✅ Solution 2: Force Redeploy
1. After updating environment variables
2. Click "Manual Deploy" in Render
3. Wait for deployment to complete
4. Check logs again

#### ✅ Solution 3: Clear Cache
1. In Render Dashboard, go to Settings
2. Scroll to "Clear Build Cache"
3. Click "Clear Cache"
4. Trigger a new deployment

---

## ❌ Issue 2: "Resend API Key Invalid" Error

### Symptoms:
```
❌ RESEND EMAIL ERROR
401 Unauthorized
Invalid API Key
```

### Solutions:

#### ✅ Solution 1: Verify API Key Format
1. API key must start with `re_`
2. Check for spaces before/after the key
3. Make sure you copied the entire key

#### ✅ Solution 2: Regenerate Key
1. Go to https://resend.com/api-keys
2. Delete old key
3. Create new key
4. Update Render environment variable
5. Redeploy

#### ✅ Solution 3: Check Key Permissions
1. In Resend dashboard, click on your API key
2. Verify it has "Send emails" permission
3. If not, create a new key with correct permissions

---

## ❌ Issue 3: Emails Not Arriving in Inbox

### Symptoms:
- Render logs show "✅ EMAIL SENT SUCCESSFULLY"
- Resend dashboard shows "Delivered"
- But recipient doesn't receive email

### Solutions:

#### ✅ Solution 1: Check Spam Folder
1. Ask recipient to check their spam/junk folder
2. If found there, mark as "Not Spam"
3. This improves future delivery

#### ✅ Solution 2: Verify Email Address
1. Check Render logs for the exact email address sent to
2. Verify there are no typos
3. Make sure the email address is valid

#### ✅ Solution 3: Check Resend Logs
1. Go to https://resend.com/emails
2. Click on the email
3. Check delivery status
4. Look for bounce/rejection reasons

---

## ❌ Issue 4: Rate Limit Exceeded

### Symptoms:
```
❌ RESEND ERROR
429 Too Many Requests
Rate limit exceeded
```

### Solutions:

#### ✅ Solution 1: Check Usage
1. Go to https://resend.com/overview
2. Check current usage
3. Free tier: 100 emails/day

#### ✅ Solution 2: Wait
1. Rate limits reset every 24 hours
2. Wait until next day
3. Or upgrade to paid plan

#### ✅ Solution 3: Implement Queuing
1. Already implemented in `EmailService.java`
2. Uses `EmailQueue` for throttling
3. Automatically retries failed emails

---

## ❌ Issue 5: Build Fails in Render

### Symptoms:
```
[ERROR] Failed to execute goal
[ERROR] BUILD FAILURE
```

### Solutions:

#### ✅ Solution 1: Check Java Version
1. In Render Dashboard → Environment
2. Add: `JAVA_VERSION=21`
3. Redeploy

#### ✅ Solution 2: Check Maven Goals
1. In Render Dashboard → Settings
2. Build Command should be: `mvn clean install -DskipTests`
3. Start Command should be: `java -jar target/*.jar`

#### ✅ Solution 3: Check Dependencies
1. Verify `pom.xml` is present
2. Check for any missing dependencies
3. Try building locally first: `mvn clean compile`

---

## ❌ Issue 6: Application Crashes on Startup

### Symptoms:
```
Failed to start application
Bean creation exception
```

### Solutions:

#### ✅ Solution 1: Check MongoDB Connection
1. Verify `MONGODB_URI` is set correctly
2. Test MongoDB connection from MongoDB Compass
3. Check IP whitelist in MongoDB Atlas

#### ✅ Solution 2: Check Required Environment Variables
Ensure these are all set:
```
MONGODB_URI
RESEND_ENABLED=true
RESEND_API_KEY
RESEND_FROM_EMAIL
FRONTEND_URL
JWT_SECRET
```

#### ✅ Solution 3: Review Startup Logs
1. In Render logs, look for the first ERROR
2. It usually indicates which bean failed
3. Check if that service needs environment variables

---

## ❌ Issue 7: Frontend Shows "Failed to Send"

### Symptoms:
- Frontend alert: "❌ 10 failed"
- But backend logs show success

### Solutions:

#### ✅ Solution 1: Check CORS
1. Verify `FRONTEND_URL` environment variable
2. Should match your Vercel URL exactly
3. No trailing slash

#### ✅ Solution 2: Check API Response
1. Open browser DevTools → Network tab
2. Look for the bulk-onboard request
3. Check response status and body

#### ✅ Solution 3: Check Backend Logs
1. Even if frontend shows error
2. Backend logs are source of truth
3. If logs show ✅, emails were sent

---

## ❌ Issue 8: "resend.enabled" Not Recognized

### Symptoms:
```
Could not resolve placeholder 'resend.enabled'
```

### Solutions:

#### ✅ Solution 1: Set Environment Variable
1. In Render → Environment
2. Add: `RESEND_ENABLED=true`
3. Exactly as shown (case-sensitive)

#### ✅ Solution 2: Check application.properties
1. Should have: `resend.enabled=${RESEND_ENABLED:true}`
2. The `:true` provides default value

---

## ❌ Issue 9: Multiple Emails Sent (Duplicates)

### Symptoms:
- Recipient receives 2+ identical emails
- Resend dashboard shows duplicates

### Solutions:

#### ✅ Solution 1: Check for Retry Logic
1. Review `EmailService.java`
2. Check `retryCount` in logs
3. May indicate network issues causing retries

#### ✅ Solution 2: Check Frontend
1. Verify user isn't clicking "Send" multiple times
2. Add loading state to button
3. Disable button after first click

---

## ❌ Issue 10: Invitation Link Doesn't Work

### Symptoms:
- Email arrives successfully
- But clicking link shows 404 or error

### Solutions:

#### ✅ Solution 1: Verify Frontend URL
1. Check `FRONTEND_URL` in Render
2. Should be: `https://omoi-hrms.vercel.app`
3. No trailing slash
4. Must match actual Vercel deployment

#### ✅ Solution 2: Check Link in Email
1. Check Resend dashboard → Email preview
2. Verify link format is correct
3. Should be: `https://omoi-hrms.vercel.app/accept-invite` or similar

#### ✅ Solution 3: Check Frontend Routes
1. Verify route exists in your React app
2. Check `Routes` configuration
3. Test link in browser manually

---

## 🔍 Debugging Checklist

When something goes wrong, check these in order:

### 1. Environment Variables (Render Dashboard)
- [ ] `RESEND_ENABLED=true`
- [ ] `RESEND_API_KEY` starts with `re_`
- [ ] `RESEND_FROM_EMAIL` is set
- [ ] No Gmail variables present

### 2. Render Logs
- [ ] Application started successfully
- [ ] No errors during startup
- [ ] Look for `📧 EMAIL PROVIDER: RESEND`
- [ ] Look for `✅ EMAIL SENT SUCCESSFULLY`

### 3. Resend Dashboard
- [ ] Login to https://resend.com
- [ ] Check recent emails
- [ ] Verify status is "Delivered" or "Opened"
- [ ] Check for any errors/bounces

### 4. Frontend
- [ ] Check browser console for errors
- [ ] Check Network tab for failed requests
- [ ] Verify API endpoint URL is correct

### 5. Local Testing
- [ ] Can you build locally? `mvn clean compile`
- [ ] Any compilation errors?
- [ ] Check `application.properties` syntax

---

## 📞 Getting Help

If none of these solutions work:

### 1. Gather Information
Collect these details:
- Exact error message from Render logs
- Screenshot of Render environment variables
- Screenshot of Resend dashboard
- Any browser console errors

### 2. Check Documentation
- Review **SUCCESS_INDICATORS.md** for what success looks like
- Review **WHAT_WAS_FIXED.md** for technical details
- Review **RESEND_EMAIL_SETUP_GUIDE.md** for setup steps

### 3. Common Mistakes
- API key has spaces before/after
- Environment variable names are case-sensitive
- Forgot to save environment variables in Render
- Forgot to redeploy after changing variables
- Using wrong email address format

---

## ✅ Quick Fixes

### Reset Everything
If totally stuck, start fresh:

1. **Delete all environment variables** in Render
2. **Re-add them one by one** from RENDER_ENV_VARIABLES.txt
3. **Clear build cache** in Render
4. **Trigger manual deploy**
5. **Test with single email** first

### Verify Resend Works
Test Resend independently:

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-email@example.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

If this works, Resend is fine. Problem is in your app config.

---

## 📊 Success Checklist

Everything working when you see:

- ✅ Render logs: "EMAIL PROVIDER: RESEND"
- ✅ Render logs: "✅ EMAIL SENT SUCCESSFULLY"
- ✅ Resend dashboard: Status "Delivered"
- ✅ Frontend: Success message shown
- ✅ Recipient: Email in inbox
- ✅ No Gmail SMTP errors in logs

---

**Most issues are resolved by:**
1. ✅ Verifying all environment variables are set correctly
2. ✅ Removing all Gmail-related configuration
3. ✅ Redeploying after changes
4. ✅ Checking Render logs for actual errors

Good luck! 🚀
