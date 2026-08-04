# 🚨 COMPLETE RESTART - Frontend + Backend

## The REAL Problem

**The frontend is running OLD code (before tenantId was added to login request).**

Even though Login.jsx has the tenantId code, **the frontend dev server needs to be restarted** for the changes to apply.

## Solution - Restart EVERYTHING

### Step 1: Stop Frontend (All Company Portals)

Find all terminals where frontend is running:
- TalentHub Solutions (port 5176)
- WorkForce Pro (port 5177) 
- PeopleSync Enterprise (port 5178)

**In each terminal, press:** `Ctrl + C`

### Step 2: Stop Backend

Find terminal where backend is running (port 8082)

**Press:** `Ctrl + C`

### Step 3: Verify All Stopped

```bash
# Check no services running
netstat -ano | findstr "5176 5177 5178 8082"
```

Should show NOTHING.

If you see any ports in use:
```bash
# Kill all
taskkill /F /IM node.exe
taskkill /F /IM java.exe
```

### Step 4: Start Backend Fresh

```bash
cd HRMS-Backend
mvnw.cmd clean package -DskipTests
mvnw.cmd spring-boot:run
```

Wait for: **"Started HmrsbackendApplication"**

### Step 5: Start PeopleSync Frontend Fresh

```bash
cd HRMS-Frontend

# Make SURE you're using company-c environment
npm run dev:company-c
```

**OR if that doesn't work:**

```bash
cd HRMS-Frontend

# Copy company-c env to .env
copy .env.company-c .env

# Start dev server
npm run dev
```

Wait for: **"Local: http://localhost:5178"**

### Step 6: Test in Browser

1. **Open NEW Incognito window** (Ctrl + Shift + N)
2. **Go to:** `http://localhost:5178`
3. **Open DevTools** (F12) → Go to **Network tab**
4. **Try to login:** Aishwarya@company.com / admin123
5. **Click on the "login" request** in Network tab
6. **Check "Payload" section**

**You MUST see:**
```json
{
  "email": "Aishwarya@company.com",
  "password": "admin123",
  "tenantId": "company-c"    ← THIS MUST BE HERE
}
```

**If `tenantId` is missing → Frontend not restarted properly**

### Step 7: Check Backend Logs

**In backend console, you MUST see:**
```
EMAIL: Aishwarya@company.com
TENANT ID: company-c           ← THIS MUST BE HERE
🔍 TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch
```

**If you DON'T see "TENANT ID: company-c" → Frontend not sending it**

### Step 8: Expected Result

**Browser should show:**
```
Access denied: You do not have permission to access this company portal.
Please use the correct company URL.
```

**User stays on login page** ✅

---

## Why This Was Happening

### Frontend Issue:
- Login.jsx was updated with tenantId code ✅
- BUT frontend dev server was NOT restarted ❌
- So it was still running old code (without tenantId)
- Backend never received tenantId
- So validation was skipped

### Backend Issue:
- AuthController has validation code ✅
- BUT if tenantId is null/empty, validation is skipped:
  ```java
  if (requestTenantId != null && !requestTenantId.isEmpty()) {
      // validation happens here
  } else {
      // validation skipped!
      System.out.println("⚠️ Warning: No tenant ID provided");
  }
  ```

---

## Debug Checklist

If it STILL doesn't work after full restart:

### Check 1: Frontend Sending tenantId?
- Open DevTools (F12)
- Network tab
- Try login
- Check "login" request Payload
- **Must show:** `"tenantId": "company-c"`

### Check 2: Backend Receiving tenantId?
- Look at backend console
- Should see: `"TENANT ID: company-c"`
- If missing → Frontend not sending it

### Check 3: Backend Validating?
- Look for: `"🔍 TENANT VALIDATION:"`
- If missing → Validation code not running

### Check 4: Database Has companyId?
```bash
mongosh
use hrms_db
db.users.findOne({email:"Aishwarya@company.com"},{companyId:1})
# Must show: companyId: "omoikaneinnovations"
```

---

## Quick Test Command

After restart, run this to test backend directly:

```bash
test-backend-directly.bat
```

This sends a request WITH tenantId and shows you the response.

---

## Summary

**Both frontend AND backend need to be restarted:**

1. ✅ Backend: Restart to load new Java code
2. ✅ Frontend: Restart to load new React code  
3. ✅ Database: Update companyId for Omoi employees
4. ✅ Browser: Use Incognito to avoid cached session

**Do ALL 4 and it WILL work.**

---

## Commands in Order

```bash
# 1. Update database
EMERGENCY_COMPLETE_FIX.bat

# 2. Stop everything
Ctrl+C in all terminals
taskkill /F /IM node.exe
taskkill /F /IM java.exe

# 3. Start backend
cd HRMS-Backend
mvnw.cmd clean package -DskipTests
mvnw.cmd spring-boot:run

# 4. Start frontend (in new terminal)
cd HRMS-Frontend
npm run dev:company-c

# 5. Test in Incognito browser
# Go to http://localhost:5178
# Try Aishwarya@company.com / admin123
# Should see "Access denied"
```

---

**THE FIX WILL WORK IF YOU RESTART BOTH FRONTEND AND BACKEND COMPLETELY.**
