# 🔧 Fix Login - Complete Instructions

## Problem
Login failing with "Invalid credentials" error.

## Root Causes (2 possible issues)

### Issue 1: Frontend Not Restarted
The `.env` file change (adding `VITE_TENANT_ID`) requires frontend restart.

### Issue 2: Wrong Password
You might be using a different password than what's in the database.

## Solution: Fix Both Issues

### STEP 1: Reset Password to Known Value

Run this command:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
node reset_admin_password.js
```

**Or Windows**: Double-click `FIX_LOGIN_NOW.bat`

This will set the password to: `admin123`

### STEP 2: Restart Frontend (CRITICAL!)

```bash
# Go to terminal running frontend
# Press Ctrl+C to stop it

cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

Wait for: `➜  Local:   http://localhost:5173/`

### STEP 3: Test Login

1. **Close ALL incognito windows**
2. **Open NEW incognito window**
3. Go to: http://localhost:5173
4. Login with:
   - Email: `Aishwarya@company.com`
   - Password: `admin123`

## Expected Result

✅ Login should work!
✅ You'll be redirected to the dashboard
✅ Employee Directory will show employees

## If Still Failing

Check backend terminal logs when you click Login. You should see:

```
===== LOGIN DEBUG =====
EMAIL: Aishwarya@company.com
RAW PASSWORD: admin123
DB PASSWORD: $2a$10$...
MATCH: true   <-- This should be true!
```

And also:
```
EMAIL: Aishwarya@company.com
PASSWORD INPUT: admin123
TENANT ID: omoikaneinnovations   <-- Should show this!
```

### If TENANT ID shows null/undefined
→ Frontend not restarted! Go back to STEP 2.

### If MATCH shows false
→ Password still wrong. Run reset script again.

### If you don't see these logs at all
→ Backend not running! Start it:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
mvn spring-boot:run
```

## Quick Checklist

```
[ ] Backend running on port 8082?
[ ] Ran reset_admin_password.js?
[ ] Password changed to admin123?
[ ] Frontend STOPPED (Ctrl+C)?
[ ] Frontend RESTARTED (npm run dev)?
[ ] Closed ALL incognito windows?
[ ] Opened FRESH incognito window?
[ ] Trying with password: admin123?
```

## Files Created

| File | Purpose |
|------|---------|
| `reset_admin_password.js` | Reset password to admin123 |
| `FIX_LOGIN_NOW.bat` | Windows shortcut |
| `check_user_password.js` | Check user in database |
| `CHECK_LOGIN_ISSUE.md` | Diagnostic guide |
| `LOGIN_FIX_INSTRUCTIONS.md` | This file |

## Summary

1. ✅ Run: `node reset_admin_password.js`
2. ✅ Restart frontend: Ctrl+C, then `npm run dev`  
3. ✅ Fresh incognito window
4. ✅ Login: `Aishwarya@company.com` / `admin123`

---

**The fix requires BOTH steps - reset password AND restart frontend!**
