# 🔧 Fix: Onboarding Link for Production Deployment

## 📋 Problem

**Issue:**
Email invitation contains localhost URL that doesn't work after deployment:
```
❌ http://localhost:5176/onboarding?token=...
```

**Should be:**
```
✅ https://your-app.vercel.app/onboarding?token=...
```

---

## ✅ Solution Implemented

### Changes Made:

#### 1. **application.properties** - Added Frontend URL Configuration
```properties
# ===============================
# FRONTEND URL CONFIGURATION
# ===============================
# Use environment variable for deployed frontend URL
# For local development: http://localhost:5176
# For production: https://your-app.vercel.app
frontend.url=${FRONTEND_URL:http://localhost:5176}
```

#### 2. **OnboardingService.java** - Use Dynamic Frontend URL

**Added:**
```java
@Value("${frontend.url}")
private String frontendUrl;
```

**Changed from:**
```java
String onboardingLink = "http://localhost:5176/onboarding?token=" + token;
```

**To:**
```java
String onboardingLink = frontendUrl + "/onboarding?token=" + token;
```

---

## 🚀 How to Deploy

### **Option 1: Local Development (No Changes Needed)**

For localhost testing, everything works as before:
```properties
frontend.url=http://localhost:5176  (default)
```

---

### **Option 2: Production Deployment (Set Environment Variable)**

When deploying to Render/Railway/Heroku:

#### Step 1: Get Your Vercel Frontend URL

After deploying frontend to Vercel, you'll get a URL like:
```
https://hrms-system-abc123.vercel.app
```

#### Step 2: Set Environment Variable in Backend

**For Render:**
1. Go to your backend service dashboard
2. Click "Environment"
3. Add new environment variable:
   - Key: `FRONTEND_URL`
   - Value: `https://hrms-system-abc123.vercel.app`
4. Save and redeploy

**For Railway:**
1. Go to your backend service
2. Click "Variables"
3. Add new variable:
   - Key: `FRONTEND_URL`
   - Value: `https://hrms-system-abc123.vercel.app`
4. Save (auto-redeploys)

**For Heroku:**
```bash
heroku config:set FRONTEND_URL=https://hrms-system-abc123.vercel.app
```

---

### **Option 3: Manual Configuration (application.properties)**

If you don't want to use environment variables, you can directly edit `application.properties`:

```properties
# For production
frontend.url=https://hrms-system-abc123.vercel.app
```

**Note:** This method requires redeployment every time URL changes.

---

## 🧪 Testing

### Test Locally:

1. **Start backend:**
   ```bash
   cd HRMS-Backend
   mvn spring-boot:run
   ```

2. **Check logs for frontend URL:**
   ```
   Frontend URL: http://localhost:5176
   ```

3. **Send invite email from Employee Directory**
4. **Check email - should contain:**
   ```
   http://localhost:5176/onboarding?token=...
   ```

---

### Test in Production:

1. **Set FRONTEND_URL environment variable**
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```

2. **Deploy backend**

3. **Send invite email from Employee Directory**

4. **Check email - should contain:**
   ```
   https://your-app.vercel.app/onboarding?token=...
   ```

5. **Click the link**
   - ✅ Should open your deployed app
   - ✅ Should show onboarding page
   - ✅ Token should work

---

## 📊 Before vs After

### Before Fix:
```
Email Link: http://localhost:5176/onboarding?token=...
             ↓
           ❌ Doesn't work in production
```

### After Fix:
```
Local Development:
Email Link: http://localhost:5176/onboarding?token=...
             ↓
           ✅ Works on localhost

Production:
Email Link: https://your-app.vercel.app/onboarding?token=...
             ↓
           ✅ Works in production
```

---

## 🔒 Environment Variables Summary

Add these environment variables to your backend deployment:

| Variable | Value (Local) | Value (Production) |
|----------|---------------|-------------------|
| `FRONTEND_URL` | `http://localhost:5176` | `https://your-app.vercel.app` |

---

## 📝 Deployment Checklist

### Backend Deployment:
```
☐ Code changes committed
☐ Pushed to Git repository
☐ Environment variable FRONTEND_URL set
☐ Backend redeployed
☐ Backend logs show correct frontend URL
```

### Testing:
```
☐ Open Employee Directory as admin
☐ Click "Invite Employee"
☐ Fill in employee details
☐ Click "Send Invite"
☐ Check employee's email inbox
☐ Verify link contains production URL (not localhost)
☐ Click the link in email
☐ Verify it opens production app
☐ Complete onboarding process
```

---

## 🎯 Example: Complete Deployment Flow

### Step 1: Deploy Frontend to Vercel
```bash
cd HRMS-Frontend
vercel --prod
```

**Output:**
```
✅ Deployed to: https://hrms-system-abc123.vercel.app
```

### Step 2: Set Backend Environment Variable

**Render Dashboard:**
```
FRONTEND_URL = https://hrms-system-abc123.vercel.app
```

### Step 3: Deploy Backend to Render
```bash
cd HRMS-Backend
git push origin main
```

Render auto-deploys after git push.

### Step 4: Test Email Invite

1. Login to production: `https://hrms-system-abc123.vercel.app`
2. Go to Employee Directory (admin only)
3. Click "Invite Employee"
4. Enter: `test@example.com`
5. Click "Send Invite"
6. Check email
7. Verify link:
   ```
   ✅ https://hrms-system-abc123.vercel.app/onboarding?token=...
   ```

---

## 🔧 Troubleshooting

### Issue: Email still shows localhost URL

**Solution 1: Check environment variable**
```bash
# On Render dashboard, verify FRONTEND_URL is set correctly
FRONTEND_URL = https://your-app.vercel.app  ✅
```

**Solution 2: Restart backend**
- Environment variables only load on startup
- Redeploy or restart the backend service

**Solution 3: Check backend logs**
```
Look for: "Frontend URL: https://your-app.vercel.app"
If shows: "Frontend URL: http://localhost:5176"
Then: Environment variable not loaded correctly
```

---

### Issue: Link works but shows "This site can't be reached"

**Solution:**
Check if frontend is deployed and running:
```bash
# Test frontend URL
curl https://your-app.vercel.app
```

Should return HTML, not error.

---

### Issue: Link opens but onboarding fails

**Possible causes:**
1. JWT token expired (24 hour expiry)
2. Backend API_URL not configured in frontend
3. CORS not allowing frontend domain

**Solution:**
Check `HRMS-Frontend/.env`:
```env
VITE_API_URL=https://your-backend.render.com
```

---

## 📄 Files Modified

1. `HRMS-Backend/src/main/resources/application.properties`
   - Added `frontend.url` configuration

2. `HRMS-Backend/src/main/java/.../service/OnboardingService.java`
   - Added `@Value("${frontend.url}")` injection
   - Replaced hardcoded localhost with dynamic `frontendUrl`

---

## ✅ Benefits

1. ✅ **Works in all environments** (local, staging, production)
2. ✅ **No code changes needed** when deploying
3. ✅ **Easy to configure** via environment variables
4. ✅ **Secure** - sensitive URLs not hardcoded
5. ✅ **Flexible** - can use different URLs for different environments

---

## 🎉 Summary

**What was the problem?**
- Invitation emails contained `http://localhost:5176` URL
- Links didn't work after deployment to production

**What did we fix?**
- Made frontend URL configurable via environment variable
- Backend now uses `${FRONTEND_URL}` instead of hardcoded localhost

**How to use?**
- Local: Works automatically with localhost
- Production: Set `FRONTEND_URL` environment variable to your Vercel URL

**No logic changes:**
- ✅ Same email template
- ✅ Same token generation
- ✅ Same onboarding flow
- ✅ Only URL is now dynamic

---

**Status:** ✅ Fixed and Ready for Deployment
**Testing:** ⏳ Pending your deployment
**Impact:** High - Fixes production onboarding issue
