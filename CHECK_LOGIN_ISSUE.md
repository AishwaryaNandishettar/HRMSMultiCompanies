# 🔍 Diagnose Login Issue

## Step 1: Check if Frontend Restarted

**CRITICAL**: Environment variables (`.env` file) are only loaded when the dev server **starts**.

Did you:
1. ✅ Stop the frontend (Ctrl+C)?
2. ✅ Restart with `npm run dev`?

**If NO** → That's why it's still failing! The `VITE_TENANT_ID` wasn't loaded.

## Step 2: Verify Environment Variable Loaded

After restarting frontend, check the browser console:

1. Open DevTools (F12)
2. Go to Console tab
3. Type: `import.meta.env.VITE_TENANT_ID`
4. Press Enter

**Expected output**: `"omoikaneinnovations"`
**If undefined**: Frontend didn't load the .env file

## Step 3: Check Backend Logs

When you click "Login", check the backend terminal for these logs:

```
EMAIL: Aishwarya@company.com
PASSWORD INPUT: ********
TENANT ID: omoikaneinnovations   <-- Should show this now!
```

**If TENANT ID shows**: `undefined` or `null` → Frontend not restarted
**If TENANT ID shows**: `omoikaneinnovations` → Good, continue

## Step 4: Check Password

The error "Invalid credentials" means either:
- Wrong password
- User not found
- Password hash mismatch

### Check what password you're using:

Run this script to check the user in database:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
node check_user_password.js
```

This will show:
- If user exists
- What companyId user has
- Try to match common passwords

## Step 5: Backend Console Logs to Check

When login fails, backend should print:

```
==================================
Logged User : Aishwarya@company.com
CompanyId   : omoikaneinnovations
TenantId    : omoikaneinnovations   <-- MUST MATCH!
==================================
```

**If these don't match** → Tenant validation will fail

## Quick Checklist

```
[ ] Frontend stopped and restarted?
[ ] Browser console shows VITE_TENANT_ID = "omoikaneinnovations"?
[ ] Backend logs show TENANT ID: omoikaneinnovations?
[ ] Using correct password?
[ ] User exists in database?
[ ] User has companyId = "omoikaneinnovations"?
```

## Most Likely Issues

### 1. Frontend Not Restarted (90% of cases)
**Solution**: 
```bash
# Press Ctrl+C in frontend terminal
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

### 2. Wrong Password
**Solution**: Run `node check_user_password.js` to verify

### 3. Browser Cache (even in incognito)
**Solution**: 
- Close ALL incognito windows
- Open fresh incognito window
- Try again

## Commands to Run

```bash
# Terminal 1 - Check user in database
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
node check_user_password.js

# Terminal 2 - Restart frontend
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
# Press Ctrl+C first!
npm run dev

# Terminal 3 - Backend should already be running
# Watch the logs when you try to login
```

## What to Send Me

If still failing, send me:

1. **Frontend console output** (when you type `import.meta.env.VITE_TENANT_ID`)
2. **Backend logs** (the full output when you click Login)
3. **What password you're using**

---

**Most important**: Make sure you restarted the frontend! 🔄
