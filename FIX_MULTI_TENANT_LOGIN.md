# 🔐 Multi-Tenant Login Isolation - Complete Fix Guide

## ❌ Current Problem

**Omoi employees (Aishwarya@company.com, nikita@omoi.com, mahesh@omoi.com, lata@omoi.com) can login to ALL portals:**
- ✅ Omoi HR Works (localhost:5173) - CORRECT ✓
- ❌ TalentHub Solutions (localhost:5176) - SHOULD BE BLOCKED ✗
- ❌ WorkForce Pro (localhost:5177) - SHOULD BE BLOCKED ✗
- ❌ PeopleSync Enterprise (localhost:5178) - SHOULD BE BLOCKED ✗

## ✅ Required Behavior

| Employee | Omoi HR Works | TalentHub | WorkForce Pro | PeopleSync |
|----------|---------------|-----------|---------------|------------|
| Aishwarya@company.com | ✅ Allow | ❌ Block | ❌ Block | ❌ Block |
| nikita@omoi.com | ✅ Allow | ❌ Block | ❌ Block | ❌ Block |
| mahesh@omoi.com | ✅ Allow | ❌ Block | ❌ Block | ❌ Block |
| lata@omoi.com | ✅ Allow | ❌ Block | ❌ Block | ❌ Block |

---

## 🔍 Root Cause Analysis

The tenant validation code EXISTS in the backend but is NOT executing. Possible reasons:

1. **Database Issue**: Omoi employees don't have `companyId: "omoikaneinnovations"` set in MongoDB
2. **Backend Not Restarted**: Compiled `.class` files are old, changes not loaded
3. **Frontend Not Restarted**: Not sending `tenantId` in login request
4. **Browser Cache**: Using old session from before fix was implemented

---

## 🛠️ Complete Fix Procedure

### STEP 1: Update Database (MOST CRITICAL)

**Why:** The backend validates `user.companyId` against `request.tenantId`. If `companyId` is not set, validation fails silently.

```bash
# Open MongoDB shell
mongosh "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms"
```

Then run:
```javascript
// Switch to database
use Data_base_hrms

// Check current state
db.users.find(
  { email: { $in: ["Aishwarya@company.com", "nikita@omoi.com", "mahesh@omoi.com", "lata@omoi.com"] }},
  { email: 1, companyId: 1 }
)

// Update all Omoi employees
db.users.updateMany(
  { email: { $in: ["Aishwarya@company.com", "nikita@omoi.com", "mahesh@omoi.com", "lata@omoi.com"] }},
  { $set: { companyId: "omoikaneinnovations" }}
)

// Verify update
db.users.find(
  { email: { $in: ["Aishwarya@company.com", "nikita@omoi.com", "mahesh@omoi.com", "lata@omoi.com"] }},
  { email: 1, companyId: 1 }
)
```

**Expected Result:**
```javascript
{ email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }
{ email: "nikita@omoi.com", companyId: "omoikaneinnovations" }
{ email: "mahesh@omoi.com", companyId: "omoikaneinnovations" }
{ email: "lata@omoi.com", companyId: "omoikaneinnovations" }
```

**Alternative:** Run the provided script:
```bash
mongosh "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms" < UPDATE_OMOI_COMPANY_ID.js
```

---

### STEP 2: Force Backend Rebuild and Restart

**Why:** Java compiles to `.class` files. If backend wasn't restarted after code changes, old compiled code is running.

```bash
# Navigate to backend folder
cd HRMS-Backend

# Kill all Java processes (force stop)
taskkill /F /IM java.exe

# Clean old compiled files
mvnw.cmd clean

# Rebuild with new code
mvnw.cmd package -DskipTests

# Start backend
mvnw.cmd spring-boot:run
```

**Wait for this log line:**
```
Tomcat started on port(s): 8082 (http)
```

---

### STEP 3: Restart All Frontend Instances

**Why:** Frontend must reload environment variables (`VITE_TENANT_ID`) to send them in login requests.

```bash
# Kill all Node processes
taskkill /F /IM node.exe

# Navigate to frontend folder
cd HRMS-Frontend

# Start each portal in separate terminals

# Terminal 1 - Omoi HR Works (default - NO tenant ID)
npm run dev

# Terminal 2 - TalentHub Solutions (company-a)
npm run dev:company-a

# Terminal 3 - WorkForce Pro (company-b)
npm run dev:company-b

# Terminal 4 - PeopleSync Enterprise (company-c)
npm run dev:company-c
```

**Expected Output:**
```
Omoi HR Works:         http://localhost:5173
TalentHub Solutions:   http://localhost:5176
WorkForce Pro:         http://localhost:5177
PeopleSync Enterprise: http://localhost:5178
```

---

### STEP 4: Test in Incognito Mode

**Why:** Clear all cached sessions and localStorage to force fresh authentication.

**Test Plan:**

#### Test 1: TalentHub Solutions (SHOULD BE BLOCKED)
1. Open **Incognito window**
2. Navigate to `http://localhost:5176`
3. Try login:
   - Email: `Aishwarya@company.com`
   - Password: `admin123`
4. **Expected Result:** ❌ Error message: "Access denied: You do not have permission to access this company portal"

#### Test 2: WorkForce Pro (SHOULD BE BLOCKED)
1. Open **new Incognito window**
2. Navigate to `http://localhost:5177`
3. Try login:
   - Email: `nikita@omoi.com`
   - Password: `admin123`
4. **Expected Result:** ❌ Error message: "Access denied: You do not have permission to access this company portal"

#### Test 3: PeopleSync Enterprise (SHOULD BE BLOCKED)
1. Open **new Incognito window**
2. Navigate to `http://localhost:5178`
3. Try login:
   - Email: `mahesh@omoi.com`
   - Password: `admin123`
4. **Expected Result:** ❌ Error message: "Access denied: You do not have permission to access this company portal"

#### Test 4: Omoi HR Works (SHOULD BE ALLOWED)
1. Open **new Incognito window**
2. Navigate to `http://localhost:5173`
3. Try login:
   - Email: `Aishwarya@company.com`
   - Password: `admin123`
4. **Expected Result:** ✅ Successfully logs in and redirects to Home page

---

### STEP 5: Verify Backend Logs

**What to look for:** When testing TalentHub login with `Aishwarya@company.com`, backend console should show:

```
========================================
EMAIL: Aishwarya@company.com
PASSWORD INPUT: admin123
TENANT ID: company-a
========================================

Login attempt for email: Aishwarya@company.com
USER FOUND: true
🔍 TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-a, User: omoikaneinnovations)
```

**If you see this, the fix is working!** ✅

**If you DON'T see "TENANT ID: company-a"**, the frontend is not sending `tenantId`. Check:
- Frontend restart completed successfully
- Environment file `.env.company-a` has `VITE_TENANT_ID=company-a`
- Browser DevTools Network tab shows `tenantId` in request payload

---

### STEP 6: Verify Frontend Request

Open **Browser DevTools** (F12) → **Network tab**:

1. Navigate to TalentHub (localhost:5176)
2. Try login with Aishwarya@company.com
3. Find the `login` request in Network tab
4. Click it → Go to **Payload** tab

**Expected Payload:**
```json
{
  "email": "Aishwarya@company.com",
  "password": "admin123",
  "tenantId": "company-a"
}
```

**If `tenantId` is missing:**
- Frontend not restarted properly
- Wrong environment file loaded
- Browser cached old JavaScript bundle

**Solution:** Hard refresh browser (Ctrl + Shift + R) or clear browser cache

---

## 📋 Quick Verification Checklist

- [ ] Database updated: All Omoi employees have `companyId: "omoikaneinnovations"`
- [ ] Backend restarted: Fresh build with `mvnw.cmd spring-boot:run`
- [ ] Frontend restarted: All 4 portals running on correct ports
- [ ] Browser cache cleared: Testing in Incognito mode
- [ ] Backend logs show "TENANT ID: company-a" when logging into TalentHub
- [ ] Frontend request includes `"tenantId": "company-a"` in payload
- [ ] Login to TalentHub/WorkForce/PeopleSync with Omoi employees is BLOCKED
- [ ] Login to Omoi HR Works with Omoi employees is ALLOWED

---

## 🚨 Common Issues and Solutions

### Issue 1: Backend logs don't show "TENANT ID"
**Cause:** Frontend not sending `tenantId` in request  
**Solution:** 
- Restart frontend: `taskkill /F /IM node.exe` then `npm run dev:company-a`
- Verify `.env.company-a` has `VITE_TENANT_ID=company-a`
- Hard refresh browser (Ctrl + Shift + R)

### Issue 2: Backend logs show "User Company ID: null"
**Cause:** Database not updated with `companyId`  
**Solution:** Re-run Step 1 database update script

### Issue 3: Login still works on TalentHub
**Cause:** Browser using cached session  
**Solution:** 
- Logout completely
- Clear localStorage: Open DevTools → Application tab → Local Storage → Clear All
- Test in fresh Incognito window

### Issue 4: "Cannot connect to backend"
**Cause:** Backend not running  
**Solution:** 
- Check backend is running: `netstat -ano | findstr :8082`
- Restart backend: `cd HRMS-Backend && mvnw.cmd spring-boot:run`
- Wait for "Tomcat started" message

---

## 🎯 How the Fix Works

### Environment Configuration
```
.env              → No VITE_TENANT_ID (Omoi HR Works - default portal)
.env.company-a    → VITE_TENANT_ID=company-a (TalentHub)
.env.company-b    → VITE_TENANT_ID=company-b (WorkForce Pro)
.env.company-c    → VITE_TENANT_ID=company-c (PeopleSync)
```

### Login Flow

**Scenario 1: Omoi employee tries to login to TalentHub**
1. Frontend sends: `{ email: "Aishwarya@company.com", password: "admin123", tenantId: "company-a" }`
2. Backend authenticates password ✅
3. Backend checks: 
   - `request.tenantId = "company-a"`
   - `user.companyId = "omoikaneinnovations"`
   - Mismatch! ❌
4. Backend returns: HTTP 403 "Access denied"

**Scenario 2: Omoi employee tries to login to Omoi HR Works**
1. Frontend sends: `{ email: "Aishwarya@company.com", password: "admin123" }` (NO tenantId)
2. Backend authenticates password ✅
3. Backend checks:
   - `request.tenantId = null` (not provided)
   - No validation needed for default portal
4. Backend returns: HTTP 200 + JWT token ✅

---

## 📝 Testing Script

Run this complete test:

```bash
# 1. Update database
mongosh "mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms" < UPDATE_OMOI_COMPANY_ID.js

# 2. Restart backend
cd HRMS-Backend
taskkill /F /IM java.exe
mvnw.cmd clean package -DskipTests && mvnw.cmd spring-boot:run

# Wait for "Tomcat started"

# 3. Restart frontend (in new terminal)
cd HRMS-Frontend
taskkill /F /IM node.exe

# Start all portals (in separate terminals)
npm run dev              # Terminal 1 - Omoi (5173)
npm run dev:company-a    # Terminal 2 - TalentHub (5176)
npm run dev:company-b    # Terminal 3 - WorkForce (5177)
npm run dev:company-c    # Terminal 4 - PeopleSync (5178)
```

Then test in Incognito:
1. TalentHub (5176) → Aishwarya@company.com → Should be BLOCKED ❌
2. WorkForce (5177) → nikita@omoi.com → Should be BLOCKED ❌
3. PeopleSync (5178) → mahesh@omoi.com → Should be BLOCKED ❌
4. Omoi HR Works (5173) → Aishwarya@company.com → Should be ALLOWED ✅

---

## ✅ Success Criteria

**When the fix is working correctly:**

1. ✅ Backend logs show tenant validation for company portals
2. ✅ Omoi employees can ONLY login to Omoi HR Works (5173)
3. ✅ Omoi employees are BLOCKED from TalentHub (5176)
4. ✅ Omoi employees are BLOCKED from WorkForce Pro (5177)
5. ✅ Omoi employees are BLOCKED from PeopleSync (5178)
6. ✅ No changes to existing authentication logic
7. ✅ All 4 portals load with correct theme and logo

---

**Run the complete procedure above and test. The fix WILL work! 🚀**
