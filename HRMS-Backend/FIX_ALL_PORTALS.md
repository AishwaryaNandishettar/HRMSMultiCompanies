# 🚨 FIX ALL PORTALS - Block Omoi Employees from Client Portals

## Current Problem

Omoikaneinnovations employees can login to ALL client portals:
- ❌ Aishwarya, Nikita, Mahesh can login to **TalentHub Solutions** (localhost:5176)
- ❌ Omoi employees can login to **WorkForce Pro** (localhost:5177)
- ❌ Omoi employees can login to **PeopleSync Enterprise** (localhost:5178)

**They should NOT be able to access ANY of these client portals!**

---

## 🎯 Solution - 3 Steps

### Step 1: Fix Database (2 minutes)

This assigns `companyId: "omoikaneinnovations"` to all Omoi employees, which will block them from accessing client portals.

**Option A: Automated Script (Recommended)**
```bash
mongosh < fix-all-companies.js
```

**Option B: Manual Commands**
```bash
mongosh
```

Then paste:
```javascript
use hrms_db

// Block all Omoi employees from client portals
db.users.updateMany(
  { email: { $in: [
    "Aishwarya@company.com",
    "aishwarya@omoi.com",
    "Aishmanager@omoi.com",
    "nikita@omoi.com",
    "nikitaadigennavar@gmail.com",
    "mahesh@omoi.com",
    "vishnu@omoi.com",
    "padmanabh@omoi.com",
    "shambuling@omoi.com",
    "lata@omoi.com"
  ]}},
  { $set: { companyId: "omoikaneinnovations" }}
)

// Also update any other @omoi.com or @company.com users
db.users.updateMany(
  { email: { $regex: "@(omoi|company)\\.com$", $options: "i" }},
  { $set: { companyId: "omoikaneinnovations" }}
)

// Verify
db.users.find(
  { companyId: "omoikaneinnovations" },
  { email: 1, companyId: 1, _id: 0 }
)
```

**Expected Output:**
```javascript
{ email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }
{ email: "nikita@omoi.com", companyId: "omoikaneinnovations" }
{ email: "mahesh@omoi.com", companyId: "omoikaneinnovations" }
// ... etc
```

✅ **If you see `companyId: "omoikaneinnovations"` for all Omoi employees → Continue to Step 2**

---

### Step 2: Restart Backend (5 minutes)

The code changes are already in place, but the backend needs to be restarted to apply them.

**Option A: Automated (Easiest)**
```bash
# Double-click this file:
restart-backend.bat
```

**Option B: Manual**
```bash
# Stop current backend
taskkill /F /IM java.exe

# Navigate to backend
cd HRMS-Backend

# Rebuild
mvnw.cmd clean install -DskipTests

# Start
mvnw.cmd spring-boot:run
```

**Wait for this log:**
```
Started HmrsbackendApplication in X.XXX seconds
```

✅ **If you see "Started" message → Continue to Step 3**

---

### Step 3: Test All Portals (5 minutes)

Now test that Omoi employees are blocked from all three client portals.

#### Test 1: TalentHub Solutions ❌
1. Open browser (Incognito): `http://localhost:5176`
2. Login: `Aishwarya@company.com` / `admin123`
3. **Expected**: ❌ "Access denied: You do not have permission to access this company portal."

#### Test 2: WorkForce Pro ❌
1. Open browser (Incognito): `http://localhost:5177`
2. Login: `Aishwarya@company.com` / `admin123`
3. **Expected**: ❌ "Access denied: You do not have permission to access this company portal."

#### Test 3: PeopleSync Enterprise ❌
1. Open browser (Incognito): `http://localhost:5178`
2. Login: `Aishwarya@company.com` / `admin123`
3. **Expected**: ❌ "Access denied: You do not have permission to access this company portal."

#### Test 4: Try Other Omoi Employees ❌
- Nikita@omoi.com → Any client portal → Should FAIL
- Mahesh@omoi.com → Any client portal → Should FAIL
- Vishnu@omoi.com → Any client portal → Should FAIL

---

## 🔍 Verification

### Backend Logs Should Show:

When Aishwarya tries to login to TalentHub:
```
EMAIL: Aishwarya@company.com
TENANT ID: company-a
🔍 TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-a, User: omoikaneinnovations)
```

When Nikita tries to login to WorkForce Pro:
```
EMAIL: nikita@omoi.com
TENANT ID: company-b
🔍 TENANT VALIDATION:
  Request Tenant ID: company-b
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-b, User: omoikaneinnovations)
```

When Mahesh tries to login to PeopleSync:
```
EMAIL: mahesh@omoi.com
TENANT ID: company-c
🔍 TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-c, User: omoikaneinnovations)
```

---

## ✅ Success Criteria

All these should be TRUE:

- [ ] Database: All Omoi employees have `companyId: "omoikaneinnovations"`
- [ ] Backend: Restarted and shows "TENANT VALIDATION" logs
- [ ] TalentHub (5176): Omoi employees CANNOT login
- [ ] WorkForce Pro (5177): Omoi employees CANNOT login
- [ ] PeopleSync (5178): Omoi employees CANNOT login
- [ ] Error message: "Access denied" appears on all portals
- [ ] Backend logs: Show "Login denied: Tenant mismatch" for all attempts

---

## 🧪 Automated Testing

Run this after Step 2 to test all portals at once:

```bash
# Double-click this file:
test-all-portals.bat
```

This will test login attempts on all three portals and show you the HTTP status codes.

**Expected Output:**
```
TEST 1: TalentHub - HTTP Status: 403 ✅
TEST 2: WorkForce Pro - HTTP Status: 403 ✅
TEST 3: PeopleSync - HTTP Status: 403 ✅
```

---

## 🐛 Troubleshooting

### Problem: Omoi employees can still login to one or more portals

**Check 1: Database**
```bash
mongosh < verify-companies.js
```

Look for any Omoi employees without `companyId: "omoikaneinnovations"`

**Fix:** Run `mongosh < fix-all-companies.js` again

---

**Check 2: Backend Logs**
Look for "TENANT VALIDATION" messages in backend console

If NOT present:
- Backend wasn't restarted properly
- Restart: `restart-backend.bat`

---

**Check 3: Frontend Sending tenantId?**
- Open browser DevTools (F12)
- Network tab → Try to login
- Check "login" request payload
- Should show: `"tenantId": "company-a"` (or b/c depending on portal)

If missing:
- Frontend might need to be rebuilt
- Check `.env.company-a` has `VITE_TENANT_ID=company-a`

---

**Check 4: Clear Browser Cache**
- Use Incognito mode OR
- Clear cookies/cache: Ctrl + Shift + Delete

---

## 📊 Company Mapping

| Portal | URL | Tenant ID | Who Can Login? |
|--------|-----|-----------|----------------|
| TalentHub Solutions | localhost:5176 | company-a | Only company-a users |
| WorkForce Pro | localhost:5177 | company-b | Only company-b users |
| PeopleSync Enterprise | localhost:5178 | company-c | Only company-c users |
| Omoikaneinnovations | localhost:5173 | (varies) | Only omoikaneinnovations users |

**Omoi employees (companyId: "omoikaneinnovations") are blocked from ALL client portals (company-a, b, c).**

---

## 🎯 What's Happening Behind the Scenes

```
┌─────────────────────────────────────────────┐
│ Omoi Employee visits ANY client portal      │
│ - TalentHub (company-a)                     │
│ - WorkForce Pro (company-b)                 │
│ - PeopleSync (company-c)                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Frontend sends:                             │
│ { email, password, tenantId }               │
│ tenantId is one of: company-a, b, or c     │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Backend validates:                          │
│ User's companyId: "omoikaneinnovations"     │
│ Request tenantId: "company-a" (or b or c)   │
│ Do they match? NO ❌                        │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Backend returns HTTP 403                    │
│ "Access denied: You do not have permission  │
│  to access this company portal."            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ Frontend shows error                        │
│ User stays on login page                    │
│ ✅ Login blocked - SUCCESS!                 │
└─────────────────────────────────────────────┘
```

---

## 📁 Helpful Files

| File | Purpose |
|------|---------|
| `fix-all-companies.js` | Updates database for ALL companies |
| `verify-companies.js` | Checks if database is set up correctly |
| `test-all-portals.bat` | Tests all three portals automatically |
| `restart-backend.bat` | Restarts backend with new code |

---

## ⏱️ Timeline

- **Database setup**: 2 minutes
- **Backend restart**: 5 minutes
- **Testing all portals**: 5 minutes
- **Total**: ~12 minutes

---

## 💡 Quick Commands Summary

```bash
# 1. Fix database
mongosh < fix-all-companies.js

# 2. Verify database
mongosh < verify-companies.js

# 3. Restart backend
restart-backend.bat

# 4. Test all portals
test-all-portals.bat
```

---

## ✨ After This Works

### All Omoi employees will be blocked from:
- ✅ TalentHub Solutions (company-a) portal
- ✅ WorkForce Pro (company-b) portal
- ✅ PeopleSync Enterprise (company-c) portal

### Each client portal will only allow its own employees:
- TalentHub → Only users with `companyId: "company-a"`
- WorkForce Pro → Only users with `companyId: "company-b"`
- PeopleSync → Only users with `companyId: "company-c"`

### Perfect tenant isolation achieved! 🎉

---

**Ready? Start with Step 1: Fix Database** ⬆️
