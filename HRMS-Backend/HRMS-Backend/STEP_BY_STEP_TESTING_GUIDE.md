# 🧪 Step-by-Step Testing Guide: Company Isolation

## 🎯 What You're Testing

**Verify that each employee can ONLY access their own company's portal:**
- Omoi → Port 5173 ONLY
- TalentHub → Port 5176 ONLY
- WorkforcePro → Port 5177 ONLY
- PeopleSync → Port 5178 ONLY

---

## 📋 Prerequisites

Before testing, ensure you have:
- ✅ Backend running (port 8082)
- ✅ MongoDB running
- ✅ Test users created in database

---

## 🚀 Step 1: Start Backend

Open a terminal and run:

```bash
cd HRMS-Backend
./mvnw spring-boot:run
```

**Wait for backend to start and watch for these console messages:**

```
✅ Reset Omoi User to null companyId: admin@omoi.com
✅ Client user preserved: john@talenthub.com → company-a
✅ Client user preserved: jane@workforcepro.com → company-b
✅ Client user preserved: bob@peoplesync.com → company-c
```

✅ **Checkpoint:** Backend is running and data migration completed

---

## 🌐 Step 2: Start All 4 Frontend Portals

You need to open **4 separate terminals** and run each portal:

### Terminal 1 - Omoi HR Works (Port 5173)
```bash
cd HRMS-Frontend
npm run dev
```

**Expected output:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Checkpoint:** Omoi portal running on http://localhost:5173

---

### Terminal 2 - TalentHub Solutions (Port 5176)
```bash
cd HRMS-Frontend
npm run dev:company-a
```

**Expected output:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5176/
  ➜  Network: use --host to expose
```

✅ **Checkpoint:** TalentHub portal running on http://localhost:5176

---

### Terminal 3 - WorkforcePro (Port 5177)
```bash
cd HRMS-Frontend
npm run dev:company-b
```

**Expected output:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5177/
  ➜  Network: use --host to expose
```

✅ **Checkpoint:** WorkforcePro portal running on http://localhost:5177

---

### Terminal 4 - PeopleSync Enterprise (Port 5178)
```bash
cd HRMS-Frontend
npm run dev:company-c
```

**Expected output:**
```
  VITE v7.0.4  ready in XXX ms

  ➜  Local:   http://localhost:5178/
  ➜  Network: use --host to expose
```

✅ **Checkpoint:** PeopleSync portal running on http://localhost:5178

---

## 🔍 Step 3: Verify All Portals Are Running

Open 4 browser tabs/windows:

1. **Tab 1:** http://localhost:5173 → Should show **Omoi HR Works** logo/name
2. **Tab 2:** http://localhost:5176 → Should show **TalentHub Solutions** (TH logo)
3. **Tab 3:** http://localhost:5177 → Should show **WorkforcePro** (WP logo)
4. **Tab 4:** http://localhost:5178 → Should show **PeopleSync Enterprise** (PS logo)

✅ **Checkpoint:** All 4 portals display their respective branding

---

## 🧪 Step 4: Test Omoi Employee Access

### Test 4.1: Omoi Employee → Omoi Portal ✅ (Should SUCCEED)

**Portal:** http://localhost:5173 (Omoi)

**Credentials:**
```
Email: admin@omoi.com
Password: admin123
```

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to Home page
- ✅ Shows Omoi branding

**Backend Console Shows:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: (empty)
  User Company ID: null
  Portal Type: Default HRMS Portal (Omoi)
✅ Validation passed for Omoi portal (user has no companyId)
```

✅ **Checkpoint:** Omoi employee can access Omoi portal

---

### Test 4.2: Omoi Employee → TalentHub Portal ❌ (Should FAIL)

**Portal:** http://localhost:5176 (TalentHub)

**Credentials:**
```
Email: admin@omoi.com
Password: admin123
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: Your account is not associated with any company. Please contact your administrator."
- ❌ Stays on login page

**Backend Console Shows:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: null
  Portal Type: Client Portal (company-a)
❌ Login denied: User has no company assigned
```

✅ **Checkpoint:** Omoi employee BLOCKED from TalentHub portal

---

### Test 4.3: Omoi Employee → WorkforcePro Portal ❌ (Should FAIL)

**Portal:** http://localhost:5177 (WorkforcePro)

**Credentials:**
```
Email: admin@omoi.com
Password: admin123
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: Your account is not associated with any company."
- ❌ Stays on login page

✅ **Checkpoint:** Omoi employee BLOCKED from WorkforcePro portal

---

### Test 4.4: Omoi Employee → PeopleSync Portal ❌ (Should FAIL)

**Portal:** http://localhost:5178 (PeopleSync)

**Credentials:**
```
Email: admin@omoi.com
Password: admin123
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: Your account is not associated with any company."
- ❌ Stays on login page

✅ **Checkpoint:** Omoi employee BLOCKED from PeopleSync portal

---

## 🧪 Step 5: Test TalentHub Employee Access

First, make sure you have a TalentHub test user. Check in MongoDB:

```javascript
db.users.findOne({ email: "john@talenthub.com" })
// Should have: companyId: "company-a"
```

If not, create one:
```javascript
db.users.insertOne({
  email: "john@talenthub.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // "password"
  name: "John Doe",
  role: "EMPLOYEE",
  companyId: "company-a",
  department: "HR"
})
```

---

### Test 5.1: TalentHub Employee → Omoi Portal ❌ (Should FAIL)

**Portal:** http://localhost:5173 (Omoi)

**Credentials:**
```
Email: john@talenthub.com
Password: password
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: Please login through TalentHub portal (port 5176). This portal is only for Omoi employees."
- ❌ Stays on login page

**Backend Console Shows:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: (empty)
  User Company ID: company-a
  Portal Type: Default HRMS Portal (Omoi)
❌ Login denied: Client employee attempting to access Omoi portal
   User belongs to: company-a
```

✅ **Checkpoint:** TalentHub employee BLOCKED from Omoi portal

---

### Test 5.2: TalentHub Employee → TalentHub Portal ✅ (Should SUCCEED)

**Portal:** http://localhost:5176 (TalentHub)

**Credentials:**
```
Email: john@talenthub.com
Password: password
```

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to Home page
- ✅ Shows TalentHub branding (TH logo)

**Backend Console Shows:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: company-a
  Portal Type: Client Portal (company-a)
✅ Tenant validation passed for client portal
```

✅ **Checkpoint:** TalentHub employee can access TalentHub portal

---

### Test 5.3: TalentHub Employee → WorkforcePro Portal ❌ (Should FAIL)

**Portal:** http://localhost:5177 (WorkforcePro)

**Credentials:**
```
Email: john@talenthub.com
Password: password
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: You do not have permission to access this company portal. Please login through your company's portal."
- ❌ Stays on login page

**Backend Console Shows:**
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-b
  User Company ID: company-a
  Portal Type: Client Portal (company-b)
❌ Login denied: Tenant mismatch
   Expected: company-a
   Attempted: company-b
```

✅ **Checkpoint:** TalentHub employee BLOCKED from WorkforcePro portal

---

### Test 5.4: TalentHub Employee → PeopleSync Portal ❌ (Should FAIL)

**Portal:** http://localhost:5178 (PeopleSync)

**Credentials:**
```
Email: john@talenthub.com
Password: password
```

**Expected Result:**
- ❌ Login fails
- ❌ Shows error: "Access denied: You do not have permission to access this company portal."
- ❌ Stays on login page

✅ **Checkpoint:** TalentHub employee BLOCKED from PeopleSync portal

---

## 🧪 Step 6: Test WorkforcePro Employee Access

Create test user if needed:
```javascript
db.users.insertOne({
  email: "jane@workforcepro.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // "password"
  name: "Jane Smith",
  role: "EMPLOYEE",
  companyId: "company-b",
  department: "Finance"
})
```

### Test 6.1: WorkforcePro Employee → Omoi Portal ❌ (Should FAIL)
**Portal:** http://localhost:5173
**Email:** jane@workforcepro.com
**Expected:** ❌ BLOCKED with error about WorkforcePro portal (5177)

### Test 6.2: WorkforcePro Employee → TalentHub Portal ❌ (Should FAIL)
**Portal:** http://localhost:5176
**Email:** jane@workforcepro.com
**Expected:** ❌ BLOCKED (tenant mismatch)

### Test 6.3: WorkforcePro Employee → WorkforcePro Portal ✅ (Should SUCCEED)
**Portal:** http://localhost:5177
**Email:** jane@workforcepro.com
**Expected:** ✅ LOGIN SUCCESS with WP branding

### Test 6.4: WorkforcePro Employee → PeopleSync Portal ❌ (Should FAIL)
**Portal:** http://localhost:5178
**Email:** jane@workforcepro.com
**Expected:** ❌ BLOCKED (tenant mismatch)

---

## 🧪 Step 7: Test PeopleSync Employee Access

Create test user if needed:
```javascript
db.users.insertOne({
  email: "bob@peoplesync.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // "password"
  name: "Bob Johnson",
  role: "EMPLOYEE",
  companyId: "company-c",
  department: "Operations"
})
```

### Test 7.1: PeopleSync Employee → Omoi Portal ❌ (Should FAIL)
**Portal:** http://localhost:5173
**Email:** bob@peoplesync.com
**Expected:** ❌ BLOCKED with error about PeopleSync portal (5178)

### Test 7.2: PeopleSync Employee → TalentHub Portal ❌ (Should FAIL)
**Portal:** http://localhost:5176
**Email:** bob@peoplesync.com
**Expected:** ❌ BLOCKED (tenant mismatch)

### Test 7.3: PeopleSync Employee → WorkforcePro Portal ❌ (Should FAIL)
**Portal:** http://localhost:5177
**Email:** bob@peoplesync.com
**Expected:** ❌ BLOCKED (tenant mismatch)

### Test 7.4: PeopleSync Employee → PeopleSync Portal ✅ (Should SUCCEED)
**Portal:** http://localhost:5178
**Email:** bob@peoplesync.com
**Expected:** ✅ LOGIN SUCCESS with PS branding

---

## 📊 Final Test Results Matrix

Fill this out as you test:

```
┌────────────────────┬──────────┬──────────┬──────────┬───────┐
│                    │  Omoi    │ TalentHub│WorkForce │People │
│   USER TYPE        │  (5173)  │  (5176)  │ Pro(5177)│Sync   │
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ Omoi               │    ✅     │    ❌     │    ❌     │   ❌   │
│ admin@omoi.com     │  [ ]     │  [ ]     │  [ ]     │ [ ]   │
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ TalentHub          │    ❌     │    ✅     │    ❌     │   ❌   │
│ john@talenthub.com │  [ ]     │  [ ]     │  [ ]     │ [ ]   │
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ WorkforcePro       │    ❌     │    ❌     │    ✅     │   ❌   │
│ jane@workforcepro  │  [ ]     │  [ ]     │  [ ]     │ [ ]   │
├────────────────────┼──────────┼──────────┼──────────┼───────┤
│ PeopleSync         │    ❌     │    ❌     │    ❌     │   ✅   │
│ bob@peoplesync.com │  [ ]     │  [ ]     │  [ ]     │ [ ]   │
└────────────────────┴──────────┴──────────┴──────────┴───────┘

Mark each box with ✅ or ❌ as you test
```

---

## ✅ Success Criteria

All these must be TRUE:

- [ ] Backend started successfully
- [ ] All 4 portals running on correct ports (5173, 5176, 5177, 5178)
- [ ] Each portal shows correct branding
- [ ] Omoi employee can ONLY login to port 5173
- [ ] TalentHub employee can ONLY login to port 5176
- [ ] WorkforcePro employee can ONLY login to port 5177
- [ ] PeopleSync employee can ONLY login to port 5178
- [ ] Error messages are clear and helpful
- [ ] Backend logs show validation process

---

## 🔧 Troubleshooting

### Issue: Port already in use
```
Error: listen EADDRINUSE: address already in use :::5173
```

**Solution:** Kill the process using that port
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

---

### Issue: Frontend not connecting to backend
**Check:**
1. Backend is running on port 8082
2. `.env` files have correct `VITE_API_BASE_URL`
3. CORS is configured in AuthController.java

---

### Issue: User companyId is "omoi" string instead of null
**Fix in MongoDB:**
```javascript
db.users.updateMany(
  { companyId: "omoi" },
  { $set: { companyId: null } }
)
```
Then restart backend to trigger DataLoader.

---

## 🎉 Expected Final Result

**All 16 tests passed:**
- ✅ 4 successful logins (each user to their own portal)
- ✅ 12 blocked logins (cross-company access denied)

**Perfect company isolation achieved! 🔒**

---

## 📝 Quick Command Reference

```bash
# Start Backend
cd HRMS-Backend && ./mvnw spring-boot:run

# Start Omoi Portal (5173)
cd HRMS-Frontend && npm run dev

# Start TalentHub Portal (5176)
cd HRMS-Frontend && npm run dev:company-a

# Start WorkforcePro Portal (5177)
cd HRMS-Frontend && npm run dev:company-b

# Start PeopleSync Portal (5178)
cd HRMS-Frontend && npm run dev:company-c
```

**Now start testing! 🚀**
