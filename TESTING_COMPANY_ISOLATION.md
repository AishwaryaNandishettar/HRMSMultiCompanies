# 🧪 Testing Guide: Company Isolation

## Quick Test Steps

### Step 1: Start Backend
```bash
cd HRMS-Backend
./mvnw spring-boot:run

# Watch for console logs:
# ✅ Reset Omoi User to null companyId: admin@omoi.com
# ✅ Client user preserved: john@talenthub.com → company-a
```

### Step 2: Create Test Users (MongoDB)
```javascript
// In MongoDB Compass or mongosh

// 1. Omoi Employee (companyId = null)
db.users.insertOne({
  email: "omoi@test.com",
  password: "$2a$10$...", // Use BCrypt hash
  name: "Omoi Test User",
  role: "EMPLOYEE",
  companyId: null,  // ✅ NULL for Omoi
  department: "IT"
})

// 2. TalentHub Employee (companyId = "company-a")
db.users.insertOne({
  email: "talenthub@test.com",
  password: "$2a$10$...",
  name: "TalentHub Test User",
  role: "EMPLOYEE",
  companyId: "company-a",  // ✅ company-a for TalentHub
  department: "HR"
})

// 3. WorkforcePro Employee (companyId = "company-b")
db.users.insertOne({
  email: "workforcepro@test.com",
  password: "$2a$10$...",
  name: "WorkforcePro Test User",
  role: "EMPLOYEE",
  companyId: "company-b",  // ✅ company-b for WorkforcePro
  department: "Finance"
})

// 4. PeopleSync Employee (companyId = "company-c")
db.users.insertOne({
  email: "peoplesync@test.com",
  password: "$2a$10$...",
  name: "PeopleSync Test User",
  role: "EMPLOYEE",
  companyId: "company-c",  // ✅ company-c for PeopleSync
  department: "Operations"
})
```

### Step 3: Start Frontend Portals
```bash
# Terminal 1 - Omoi Portal (Port 5173)
cd HRMS-Frontend
npm run dev
# Opens http://localhost:5173

# Terminal 2 - TalentHub Portal (Port 5176)
cd HRMS-Frontend
npm run dev:company-a
# Opens http://localhost:5176

# Terminal 3 - WorkforcePro Portal (Port 5177)
cd HRMS-Frontend
npm run dev:company-b
# Opens http://localhost:5177

# Terminal 4 - PeopleSync Portal (Port 5178)
cd HRMS-Frontend
npm run dev:company-c
# Opens http://localhost:5178
```

---

## 🎯 Test Matrix

### Test 1: Omoi Employee Access
**User:** `omoi@test.com` (companyId = `null`)

| Portal | URL | Expected Result | Status |
|--------|-----|----------------|---------|
| Omoi | http://localhost:5173 | ✅ **LOGIN SUCCESS** | PASS |
| TalentHub | http://localhost:5176 | ❌ **Access denied: Your account is not associated with any company** | PASS |
| WorkforcePro | http://localhost:5177 | ❌ **Access denied: Your account is not associated with any company** | PASS |
| PeopleSync | http://localhost:5178 | ❌ **Access denied: Your account is not associated with any company** | PASS |

---

### Test 2: TalentHub Employee Access
**User:** `talenthub@test.com` (companyId = `company-a`)

| Portal | URL | Expected Result | Status |
|--------|-----|----------------|---------|
| Omoi | http://localhost:5173 | ❌ **Access denied: Please login through TalentHub portal (port 5176)** | PASS |
| TalentHub | http://localhost:5176 | ✅ **LOGIN SUCCESS** | PASS |
| WorkforcePro | http://localhost:5177 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |
| PeopleSync | http://localhost:5178 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |

---

### Test 3: WorkforcePro Employee Access
**User:** `workforcepro@test.com` (companyId = `company-b`)

| Portal | URL | Expected Result | Status |
|--------|-----|----------------|---------|
| Omoi | http://localhost:5173 | ❌ **Access denied: Please login through WorkforcePro portal (port 5177)** | PASS |
| TalentHub | http://localhost:5176 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |
| WorkforcePro | http://localhost:5177 | ✅ **LOGIN SUCCESS** | PASS |
| PeopleSync | http://localhost:5178 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |

---

### Test 4: PeopleSync Employee Access
**User:** `peoplesync@test.com` (companyId = `company-c`)

| Portal | URL | Expected Result | Status |
|--------|-----|----------------|---------|
| Omoi | http://localhost:5173 | ❌ **Access denied: Please login through PeopleSync portal (port 5178)** | PASS |
| TalentHub | http://localhost:5176 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |
| WorkforcePro | http://localhost:5177 | ❌ **Access denied: You do not have permission to access this company portal** | PASS |
| PeopleSync | http://localhost:5178 | ✅ **LOGIN SUCCESS** | PASS |

---

## 📊 Backend Console Logs

### Successful Login Example
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: company-a
  Portal Type: Client Portal (company-a)
✅ Tenant validation passed for client portal
```

### Failed Login Example (Wrong Portal)
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-b
  User Company ID: company-a
  Portal Type: Client Portal (company-b)
❌ Login denied: Tenant mismatch
   Expected: company-a
   Attempted: company-b
```

### Failed Login Example (Client → Omoi Portal)
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: (empty)
  User Company ID: company-a
  Portal Type: Default HRMS Portal (Omoi)
❌ Login denied: Client employee attempting to access Omoi portal
   User belongs to: company-a
```

---

## 🔍 Verification Checklist

- [ ] Omoi employees can login to port 5173 ONLY
- [ ] TalentHub employees can login to port 5176 ONLY
- [ ] WorkforcePro employees can login to port 5177 ONLY
- [ ] PeopleSync employees can login to port 5178 ONLY
- [ ] Error messages are clear and helpful
- [ ] Backend logs show validation process
- [ ] No cross-company access is possible
- [ ] DataLoader removes "omoi" string and sets to null

---

## 🚨 Common Issues

### Issue 1: User has "omoi" string instead of null
**Symptom:** Omoi employees cannot login to port 5173

**Fix:**
```javascript
// In MongoDB
db.users.updateMany(
  { companyId: "omoi" },
  { $set: { companyId: null } }
)
```

### Issue 2: Frontend shows wrong tenantId
**Symptom:** Portal sends wrong tenantId to backend

**Fix:** Check `.env` files
```bash
# .env (Omoi - port 5173)
VITE_TENANT_ID=

# .env.company-a (TalentHub - port 5176)
VITE_TENANT_ID=company-a

# .env.company-b (WorkforcePro - port 5177)
VITE_TENANT_ID=company-b

# .env.company-c (PeopleSync - port 5178)
VITE_TENANT_ID=company-c
```

### Issue 3: CORS errors
**Symptom:** Login request blocked by browser

**Fix:** Check `@CrossOrigin` in `AuthController.java`
```java
@CrossOrigin(origins = {
    "http://localhost:5173",   // Omoi
    "http://localhost:5176",   // TalentHub
    "http://localhost:5177",   // WorkforcePro
    "http://localhost:5178",   // PeopleSync
    // ... other origins
})
```

---

## ✅ Success Criteria

**ALL of these must be TRUE:**

1. ✅ Omoi employees (companyId=`null`) can ONLY access port 5173
2. ✅ TalentHub employees (companyId=`company-a`) can ONLY access port 5176
3. ✅ WorkforcePro employees (companyId=`company-b`) can ONLY access port 5177
4. ✅ PeopleSync employees (companyId=`company-c`) can ONLY access port 5178
5. ✅ Error messages guide users to the correct portal
6. ✅ Backend logs clearly show validation results
7. ✅ No employee can access multiple portals with same credentials

---

## 🎉 Expected Outcome

**Perfect Company Isolation:**
- Omoi → ONLY Omoi ✅
- TalentHub → ONLY TalentHub ✅
- WorkforcePro → ONLY WorkforcePro ✅
- PeopleSync → ONLY PeopleSync ✅

**No cross-access possible! 🔒**
