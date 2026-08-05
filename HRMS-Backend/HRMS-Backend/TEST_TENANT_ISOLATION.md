# Test Plan: Multi-Tenant Login Isolation

## 🧪 Pre-Test Setup

### 1. Verify Database Setup
```javascript
// Connect to MongoDB
use hrms_db

// Check sample users
db.users.find({
  email: { $in: [
    "Aishwarya@company.com",
    "talentemployee@talenthub.com"
  ]}
}, { email: 1, companyId: 1 }).pretty()
```

Expected output:
```javascript
{ email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }
{ email: "talentemployee@talenthub.com", companyId: "company-a" }
```

### 2. Start Backend Server
```bash
cd HRMS-Backend
./mvnw spring-boot:run
# OR
mvn spring-boot:run
```

### 3. Start Company Portals
```bash
# Terminal 1: TalentHub Solutions
cd HRMS-Frontend
npm run dev:company-a
# Opens on localhost:5176

# Terminal 2: WorkForce Pro
cd HRMS-Frontend
npm run dev:company-b
# Opens on localhost:5177

# Terminal 3: Omoi (for testing)
cd HRMS-Frontend  
npm run dev
# Opens on localhost:5173
```

## ✅ Test Cases

### Test Case 1: Valid Login - Same Company ✅

**Objective**: User from TalentHub logs into TalentHub portal

**Steps**:
1. Open browser: `http://localhost:5176`
2. Verify page shows "TalentHub Solutions" branding
3. Enter credentials:
   - Email: `talentemployee@talenthub.com`
   - Password: (their password)
4. Click "Login"

**Expected Result**: ✅
- Login successful
- Redirected to Home page
- User can access all features

**Backend Logs Should Show**:
```
EMAIL: talentemployee@talenthub.com
TENANT ID: company-a
🔍 TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: company-a
✅ Tenant validation passed
Login successful for: talentemployee@talenthub.com
```

---

### Test Case 2: Invalid Login - Different Company ❌

**Objective**: Omoi employee CANNOT login to TalentHub portal

**Steps**:
1. Open browser: `http://localhost:5176` (TalentHub)
2. Enter credentials:
   - Email: `Aishwarya@company.com` (Omoi employee)
   - Password: (their password)
3. Click "Login"

**Expected Result**: ❌
- Login FAILS with error message
- Error: "Access denied: You do not have permission to access this company portal. Please use the correct company URL."
- User stays on login page
- User CANNOT access the system

**Backend Logs Should Show**:
```
EMAIL: Aishwarya@company.com
TENANT ID: company-a
🔍 TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-a, User: omoikaneinnovations)
```

**Browser Console Should Show**:
```
❌ Login Error: Access denied: You do not have permission to access this company portal.
```

---

### Test Case 3: Valid Login - Omoi Portal ✅

**Objective**: Same Omoi employee CAN login to their own portal

**Steps**:
1. Open browser: `http://localhost:5173` (or appropriate Omoi portal)
2. Enter credentials:
   - Email: `Aishwarya@company.com`
   - Password: (their password)
3. Click "Login"

**Expected Result**: ✅
- Login successful
- User can access the system

---

### Test Case 4: User Without Company ❌

**Objective**: User with no companyId cannot login

**Prerequisites**: Create test user without companyId
```javascript
db.users.insertOne({
  email: "testuser@example.com",
  password: "$2a$10$...", // bcrypt hash
  role: "employee",
  // No companyId field
})
```

**Steps**:
1. Open browser: `http://localhost:5176`
2. Enter credentials:
   - Email: `testuser@example.com`
   - Password: (their password)
3. Click "Login"

**Expected Result**: ❌
- Login FAILS
- Error: "Access denied: Your account is not associated with any company. Please contact your administrator."

**Backend Logs Should Show**:
```
❌ Login denied: User has no company assigned
```

---

### Test Case 5: Cross-Company Tests (All Combinations) ❌

**Objective**: No user can access portals other than their own

| User Email | User's Company | Portal URL | tenantId | Should Login? |
|------------|---------------|------------|----------|---------------|
| talentemployee@talenthub.com | company-a | localhost:5176 | company-a | ✅ YES |
| talentemployee@talenthub.com | company-a | localhost:5177 | company-b | ❌ NO |
| talentemployee@talenthub.com | company-a | localhost:5178 | company-c | ❌ NO |
| workforceemployee@workforce.com | company-b | localhost:5176 | company-a | ❌ NO |
| workforceemployee@workforce.com | company-b | localhost:5177 | company-b | ✅ YES |
| workforceemployee@workforce.com | company-b | localhost:5178 | company-c | ❌ NO |
| Aishwarya@company.com | omoikaneinnovations | localhost:5176 | company-a | ❌ NO |
| Aishwarya@company.com | omoikaneinnovations | localhost:5177 | company-b | ❌ NO |
| Aishwarya@company.com | omoikaneinnovations | localhost:5178 | company-c | ❌ NO |

---

### Test Case 6: Verify Timesheet EMP ID Fix ✅

**Objective**: Timesheet page shows full EMP ID format

**Steps**:
1. Login to any company portal
2. Navigate to Timesheet Management page
3. Check EMP ID column

**Expected Result**: ✅
- EMP ID shows full format: `GN-EMP-0007`, `IT-EMP-0041`
- NOT abbreviated format: `EMP-Aishw`, `EMP-lata`
- Matches format in Employee Directory and Attendance pages

---

## 🔍 Debugging Checklist

If tests fail, check:

### Backend Checklist:
- [ ] Backend server running on port 8082
- [ ] Console shows "TENANT ID: company-a" in login logs
- [ ] Console shows tenant validation messages
- [ ] No errors in backend startup logs

### Frontend Checklist:
- [ ] Correct port (5176, 5177, 5178)
- [ ] Browser console shows no errors
- [ ] Network tab shows login request includes `tenantId`
- [ ] .env file has correct `VITE_TENANT_ID`

### Database Checklist:
- [ ] User exists in database
- [ ] User has `companyId` field
- [ ] `companyId` is not null or empty
- [ ] `companyId` matches expected value

## 📊 Verification Commands

### Check User's Company Assignment
```javascript
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1, role: 1 }
)
```

### List All Users by Company
```javascript
db.users.aggregate([
  { $group: { _id: "$companyId", users: { $push: "$email" }}},
  { $sort: { _id: 1 }}
])
```

### Find Users Without Company
```javascript
db.users.find({
  $or: [
    { companyId: { $exists: false }},
    { companyId: null },
    { companyId: "" }
  ]
}, { email: 1 })
```

## 📝 Test Results Template

```
Test Date: ______________
Tester: ______________

Test Case 1 (Valid Login - Same Company): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Test Case 2 (Invalid Login - Different Company): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Test Case 3 (Valid Login - Omoi Portal): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Test Case 4 (User Without Company): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Test Case 5 (Cross-Company Tests): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Test Case 6 (Timesheet EMP ID Fix): [ ] PASS [ ] FAIL
Notes: _________________________________________________

Overall Status: [ ] ALL PASS [ ] NEEDS FIX
```

## 🎯 Success Criteria

✅ **All tests pass when:**
1. Users can login to their assigned company portal
2. Users CANNOT login to other company portals
3. Error messages are clear and helpful
4. Backend logs show tenant validation
5. Timesheet shows correct EMP ID format
6. No regression in existing features

## 🐛 Common Issues & Solutions

### Issue 1: User can still login to wrong portal
**Check**: 
- Is backend updated with tenant validation code?
- Is frontend sending tenantId?
- Does user have correct companyId in database?

### Issue 2: All logins failing
**Check**:
- Is tenantId being sent in request?
- Backend logs for error messages
- Database connection working?

### Issue 3: No error message shown
**Check**:
- Frontend error handling in Login.jsx
- Backend returns 403 status
- Browser console for errors

### Issue 4: Timesheet still shows wrong EMP ID
**Check**:
- Frontend code updated in Timesheet.jsx
- Browser cache cleared
- Frontend rebuilt and restarted

## 🚀 Quick Test Script

Run this in your terminal for quick validation:

```bash
#!/bin/bash

echo "🧪 Testing Multi-Tenant Login Isolation"
echo "========================================"

# Test 1: Valid login
echo "\n✅ Test 1: Valid login (should succeed)"
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "talentemployee@talenthub.com",
    "password": "password123",
    "tenantId": "company-a"
  }'

# Test 2: Invalid login (wrong company)
echo "\n\n❌ Test 2: Wrong company (should fail)"
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Aishwarya@company.com",
    "password": "password123",
    "tenantId": "company-a"
  }'

echo "\n\n========================================"
echo "Check the responses above"
echo "Test 1 should return 200 with token"
echo "Test 2 should return 403 with error message"
```

Save as `test_tenant.sh`, make executable (`chmod +x test_tenant.sh`), and run.

## 📈 Performance Check

After all tests pass:
- [ ] Login time < 2 seconds
- [ ] No memory leaks
- [ ] Backend logs not excessive
- [ ] Frontend responsive

## ✨ Final Checklist

- [ ] All 6 test cases pass
- [ ] Backend logs show tenant validation
- [ ] Frontend shows proper error messages  
- [ ] Database has correct companyId assignments
- [ ] No regression in existing features
- [ ] Documentation updated
- [ ] Team notified of changes

---

**Test Status**: ⏳ Pending
**Last Updated**: 2026-07-15
**Next Review**: After database setup
