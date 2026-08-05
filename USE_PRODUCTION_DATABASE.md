# ✅ Use Production Database on Localhost

## Problem

After restarting frontend with `.env.local`, it shows **old test employees** again because:
- Localhost frontend → Local backend (localhost:8082) → **Local MongoDB** → Old test data ❌

## Solution

Make local backend use **MongoDB Atlas** (production database) instead of local MongoDB.

---

## How to Fix

### Step 1: Stop Current Backend

If backend is running, press **Ctrl+C** to stop it.

### Step 2: Start Backend with MongoDB Atlas

**Option A: Use Batch File (Windows)**

Double-click this file:
```
HRMS-Backend/START_BACKEND_WITH_ATLAS.bat
```

**Option B: Manual Command**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"

set MONGODB_URI=mongodb+srv://hrms_user:HRMS%%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true^&w=majority^&appName=Cluster0

mvn spring-boot:run
```

### Step 3: Frontend Should Already Be Running

If not, restart it:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

### Step 4: Test

1. Go to: http://localhost:5173
2. Login: `Aishwarya@company.com` / `admin123`
3. Go to Employee Directory
4. **Should now show PRODUCTION employees**:
   - ✅ Lata Benakop
   - ✅ Mahesh Panchal
   - ✅ Nikita adigennanavar
   - ✅ Padmanabh Chikkanoor

---

## What This Does

**Before**:
```
Localhost Frontend → Local Backend → Local MongoDB → Old test data ❌
```

**After**:
```
Localhost Frontend → Local Backend → MongoDB Atlas → Production data ✅
```

---

## Comparison

| Setup | Frontend | Backend | Database | Employees | Emails |
|-------|----------|---------|----------|-----------|--------|
| **Current** | localhost:5173 | localhost:8082 | MongoDB Atlas | Production ✅ | Gmail SMTP ✅ |
| **Vercel** | omoi-hrms.vercel.app | Render | MongoDB Atlas | Production ✅ | Resend HTTP ✅ |

Both use the **same database** (MongoDB Atlas) = Same employees! ✅

---

## Benefits

1. ✅ Localhost shows **production employees** (not test data)
2. ✅ Emails work via **Gmail SMTP** (fast, reliable on localhost)
3. ✅ Same data as Vercel/Render
4. ✅ No code changes needed

---

## Alternative: If You Want to Use Local MongoDB

If you want to keep using local MongoDB but sync the data:

### Option 1: Run the Employee Fix Scripts

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
node check_mongodb_data.js
node fix_all_employee_companyid.js
```

This updates your local MongoDB to have correct employees.

### Option 2: Import Production Data to Local

Export from Atlas, import to local MongoDB (complex, not recommended).

---

## Recommended Setup

**For Development (Localhost)**:
- Frontend: localhost:5173
- Backend: localhost:8082
- Database: **MongoDB Atlas** (production) ← Use this!
- Emails: Gmail SMTP

**For Production (Vercel)**:
- Frontend: omoi-hrms.vercel.app
- Backend: Render
- Database: MongoDB Atlas
- Emails: Resend HTTP API

---

## Summary

1. ✅ Stop current backend (Ctrl+C)
2. ✅ Run: `START_BACKEND_WITH_ATLAS.bat`
3. ✅ Frontend should show production employees
4. ✅ Emails will work
5. ✅ No logic changed!

---

**Double-click `START_BACKEND_WITH_ATLAS.bat` now!** 🚀
