# 🚀 DEPLOY UPDATED CODE TO RENDER

## The Problem
Your Render backend is running **old code** without the email quote fix.

Localhost works because it has the latest code.
Vercel/Render doesn't work because it has old code.

---

## Solution: Push Code to GitHub & Redeploy

### STEP 1: Commit & Push Latest Code to GitHub (5 min)

Open terminal in your project root and run:

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"

# Check what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Fix: Email quote bug + updated Gmail credentials"

# Push to GitHub
git push origin main
```

**Note:** Replace `main` with `master` if that's your default branch name.

---

### STEP 2: Trigger Render Redeploy (2 min)

**Option A: Automatic (if connected to GitHub)**
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Render should **automatically detect** the new commit
4. It will start redeploying automatically
5. Wait for "Deploy succeeded" (takes 2-3 minutes)

**Option B: Manual Deploy**
1. Go to https://dashboard.render.com/
2. Select your backend service
3. Click "Manual Deploy" button (top right)
4. Select "Deploy latest commit"
5. Wait for "Deploy succeeded"

---

### STEP 3: Verify Deployment

After deployment succeeds:

1. **Check backend health:**
   ```
   https://latestfinalhrmsapplication.onrender.com/actuator/health
   ```
   Should show: `{"status":"UP"}`

2. **Check backend logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for: `MAIL PASSWORD Present : true`
   - This confirms environment variables are loaded

3. **Test invitation:**
   - Go to https://omoi-hrms.vercel.app
   - Login as admin
   - Send invite
   - Check email inbox

---

## What if I don't want to use GitHub?

If you can't push to GitHub, you can manually upload the JAR file:

### Alternative: Build & Deploy JAR Manually

**Step 1: Build locally**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
mvn clean package -DskipTests
```

This creates: `target/hmrs-backend-0.0.1-SNAPSHOT.jar`

**Step 2: Upload to Render**
Render doesn't support direct JAR upload. You MUST use GitHub.

---

## Why This is Needed

The fixes we made are in these files:
1. `OnboardingService.java` - Email quote cleanup
2. `EmailService.java` - Email quote cleanup  
3. `OtpService.java` - Email quote cleanup
4. `application.properties` - Gmail password updated

**Render doesn't have these changes yet!**

When you push to GitHub and Render redeploys, it will:
1. Pull latest code from GitHub
2. Rebuild the application with Maven
3. Start with new code + your environment variables
4. Email will work!

---

## Troubleshooting

### "Nothing to commit, working tree clean"
This means your changes are not in `HRMS-Backend/` folder.

**Solution:** The active files you edited are in the root `src/` folder, not `HRMS-Backend/src/`.

You need to **copy** the changes from root to `HRMS-Backend`:

```bash
# Copy OnboardingService.java
copy "d:\New folder\HRMSProject (2)\HRMSProject\src\main\java\com\omoikaneinnovation\hmrsbackend\service\OnboardingService.java" "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend\src\main\java\com\omoikaneinnovation\hmrsbackend\service\OnboardingService.java"

# Copy EmailService.java
copy "d:\New folder\HRMSProject (2)\HRMSProject\src\main\java\com\omoikaneinnovation\hmrsbackend\service\EmailService.java" "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend\src\main\java\com\omoikaneinnovation\hmrsbackend\service\EmailService.java"

# Copy OtpService.java
copy "d:\New folder\HRMSProject (2)\HRMSProject\src\main\java\com\omoikaneinnovation\hmrsbackend\service\OtpService.java" "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend\src\main\java\com\omoikaneinnovation\hmrsbackend\service\OtpService.java"

# Copy application.properties
copy "d:\New folder\HRMSProject (2)\HRMSProject\src\main\resources\application.properties" "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend\src\main\resources\application.properties"
```

Then do `git add .` and commit again.

---

### "Authentication failed"
You need to set up GitHub credentials.

**Solution:** Use GitHub Desktop or set up SSH keys.

---

### "Render deployment failed"
Check Render logs for the error.

Common issues:
- Maven build failed → Check `pom.xml`
- Port binding error → `PORT` env var should be `8080`
- Database connection failed → Check `MONGODB_URI`

---

## Summary

**What needs to happen:**
1. ✅ Code changes made (email quote fix)
2. ✅ Environment variables set in Render
3. ❌ Code needs to be deployed to Render ← **YOU ARE HERE**

**Next step:** Push code to GitHub, Render will auto-redeploy.
