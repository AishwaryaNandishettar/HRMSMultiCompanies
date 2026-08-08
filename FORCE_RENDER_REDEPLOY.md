# 🚨 FORCE Render to Redeploy with New Code

## Problem
Render is still running OLD code that uses Gmail SMTP, even though:
- ✅ You updated environment variables
- ✅ You committed and pushed the fixed code
- ❌ Render hasn't picked up the changes

## Solution: Force Clear Cache and Redeploy

### Step 1: Clear Build Cache

1. Go to https://dashboard.render.com
2. Click on your **HRMS Backend** service
3. Click **"Settings"** (left sidebar)
4. Scroll down to **"Build & Deploy"** section
5. Find **"Clear build cache"** button
6. Click **"Clear Build Cache"**
7. Confirm the action

### Step 2: Manual Deploy with Clean Build

1. Go back to your service dashboard
2. Click **"Manual Deploy"** (top right dropdown)
3. Select **"Clear build cache & deploy"**
4. Wait for deployment (3-5 minutes)

### Step 3: Monitor Deployment Logs

Watch the logs during deployment. You should see:

```
==> Building...
==> Cloning from GitHub...
==> Running: mvn clean install -DskipTests
==> BUILD SUCCESS
==> Starting application...
```

### Step 4: Check Application Startup Logs

After deployment completes, check the application logs. Look for:

```
✅ SSL certificate validation disabled for development
✅ Started HRMSApplication in X seconds
```

**Most importantly, you should NOT see:**
```
❌ Creating JavaMailSender bean...
❌ DEBUG SMTP: trying to connect...
```

### Step 5: Test Email Sending

1. Go to https://omoi-hrms.vercel.app
2. Send a test invitation
3. Watch Render logs for:
   ```
   ================================
   📧 EMAIL PROVIDER: RESEND
   📧 RESEND ENABLED: true
   ✅ RESEND EMAIL SENT SUCCESSFULLY
   ================================
   ```

---

## Alternative: Trigger Redeploy via Git

If the above doesn't work, make a small change and commit:

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"

# Add a comment to trigger rebuild
echo "# Force redeploy" >> README.md

git add README.md
git commit -m "Force redeploy"
git push origin main
```

Render will automatically redeploy when it detects a new commit.

---

## Verify Environment Variables Are Loaded

After redeployment, check the logs for these lines at startup:

```
resend.enabled = true
resend.from.email = onboarding@resend.dev
```

If you see these, the environment variables are loaded correctly.

---

## If STILL Not Working

### Check Render Service URL

Make sure you're checking logs for the CORRECT service:
- Go to Render Dashboard
- Verify the service name
- Check if there are multiple services running
- Make sure you're not checking an old/stopped service

### Check Deploy Branch

1. In Render → Settings
2. Find **"Branch"** setting
3. Make sure it's set to **"main"** (or your correct branch)
4. If it's set to a different branch, change it and redeploy

### Check Build Command

1. In Render → Settings → "Build & Deploy"
2. Verify **Build Command**: `mvn clean install -DskipTests`
3. Verify **Start Command**: `java -jar target/*.jar`

---

## Expected Timeline

- Clear cache: 10 seconds
- Build: 2-3 minutes
- Start: 30-60 seconds
- **Total: ~4 minutes**

After this, emails should work immediately!

---

**Do this NOW and report back with the new logs!** 🚀
