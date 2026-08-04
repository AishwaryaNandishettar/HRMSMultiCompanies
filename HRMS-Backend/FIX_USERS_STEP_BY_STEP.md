# 🔧 Fix All Users - Add companyId Field

## 🎯 The Problem

Your users **don't have the `companyId` field** in MongoDB. This is why the validation doesn't work.

**Your current user:**
```json
{
  "email": "Aishwarya@company.com",
  "role": "ADMIN",
  // ❌ NO companyId field!
}
```

**What it should be:**
```json
{
  "email": "Aishwarya@company.com",
  "role": "ADMIN",
  "companyId": null   // ✅ NULL = Omoi employee
}
```

---

## ✅ Solution: Add companyId to All Users

---

## 🚀 Method 1: Run the Fix Script (Easiest)

### Step 1: Open Terminal/Command Prompt
```bash
# Windows: Press Win + R, type cmd, press Enter
```

### Step 2: Navigate to Your Project
```bash
cd E:\HRMSProject\hrms-frontend
```

### Step 3: Run the Script
```bash
mongosh < FIX_ALL_USERS_ADD_COMPANYID.js
```

**You should see:**
```
✅ Updated X users
✅ FIX COMPLETE!
All existing users are now Omoi employees (companyId: null)
```

### Step 4: Restart Backend
```bash
cd ..\HRMS-Backend
./mvnw spring-boot:run
```

**Done!**

---

## 🚀 Method 2: MongoDB Compass (Visual)

### Step 1: Open MongoDB Compass
- Connect to `mongodb://localhost:27017`
- Click database: `hrms`
- Click collection: `users`

### Step 2: Add companyId to Aishwarya User
1. Find user: `Aishwarya@company.com`
2. Click edit (pencil icon)
3. At the bottom of the fields, click **"Add Field"**
4. Field name: `companyId`
5. Field type: **Null**
6. Click **"Update"**

### Step 3: Repeat for All Users
- Do the same for every user in your database
- Set all `companyId` to `null` (they're all Omoi employees)

### Step 4: Restart Backend

**Done!**

---

## 🚀 Method 3: MongoDB Shell Commands (Fast)

### Step 1: Open mongosh
```bash
mongosh
```

### Step 2: Connect to Database
```javascript
use hrms
```

### Step 3: Add companyId to ALL Users
```javascript
db.users.updateMany(
  { companyId: { $exists: false } },
  { $set: { companyId: null } }
)
```

**You should see:**
```json
{
  acknowledged: true,
  matchedCount: 5,
  modifiedCount: 5
}
```

### Step 4: Verify
```javascript
db.users.find({}, { email: 1, companyId: 1 }).pretty()
```

**You should see:**
```json
{ "_id": ..., "email": "Aishwarya@company.com", "companyId": null }
{ "_id": ..., "email": "other@company.com", "companyId": null }
```

### Step 5: Also Fix Employees Collection
```javascript
db.employees.updateMany(
  { companyId: { $exists: false } },
  { $set: { companyId: null } }
)
```

### Step 6: Exit
```javascript
exit
```

### Step 7: Restart Backend

**Done!**

---

## ✅ After Running the Fix

### 1. Restart Backend
```bash
cd HRMS-Backend
./mvnw spring-boot:run
```

**Watch for:**
```
ℹ️  User already has null companyId (Omoi): Aishwarya@company.com
```

### 2. Clear Browser Cache
Open DevTools (F12) → Console:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 3. Test Login

**Port 5173 (Omoi) - Should SUCCEED ✅**
- Email: `Aishwarya@company.com`
- Password: [your password]
- Expected: LOGIN SUCCESS

**Port 5176 (TalentHub) - Should FAIL ❌**
- Email: `Aishwarya@company.com`
- Password: [your password]
- Expected: Error "Your account is not associated with any company"

**Port 5177 (WorkforcePro) - Should FAIL ❌**
- Expected: Same error

**Port 5178 (PeopleSync) - Should FAIL ❌**
- Expected: Same error

---

## 🎯 How to Create Users for Other Companies

After fixing existing users, here's how to create users for client companies:

### Create TalentHub User (Company A)
```javascript
db.users.insertOne({
  email: "john@talenthub.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  employeeName: "John Doe",
  role: "EMPLOYEE",
  companyId: "company-a",    // ✅ TalentHub
  department: "HR",
  active: true
})
```

### Create WorkforcePro User (Company B)
```javascript
db.users.insertOne({
  email: "jane@workforcepro.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  employeeName: "Jane Smith",
  role: "EMPLOYEE",
  companyId: "company-b",    // ✅ WorkforcePro
  department: "Finance",
  active: true
})
```

### Create PeopleSync User (Company C)
```javascript
db.users.insertOne({
  email: "bob@peoplesync.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  employeeName: "Bob Johnson",
  role: "EMPLOYEE",
  companyId: "company-c",    // ✅ PeopleSync
  department: "Operations",
  active: true
})
```

**Note:** The password hash above is for "password". Replace with your own hash.

---

## 📋 Summary of companyId Values

```
┌─────────────────────┬─────────────┬────────────────┐
│ Company             │ companyId   │ Can Access     │
├─────────────────────┼─────────────┼────────────────┤
│ Omoi HR Works       │ null        │ Port 5173 ONLY │
│ TalentHub Solutions │ "company-a" │ Port 5176 ONLY │
│ WorkforcePro        │ "company-b" │ Port 5177 ONLY │
│ PeopleSync          │ "company-c" │ Port 5178 ONLY │
└─────────────────────┴─────────────┴────────────────┘
```

---

## 🚨 Common Issues

### Issue 1: Field still doesn't appear
**Cause:** MongoDB Compass cache
**Fix:** Close and reopen MongoDB Compass

### Issue 2: Backend doesn't see the field
**Cause:** Backend not restarted
**Fix:** Restart backend with `./mvnw spring-boot:run`

### Issue 3: Still can login to wrong portal
**Cause:** Browser cache
**Fix:** Use incognito mode or clear cache

---

## ✅ Quick Commands (Copy-Paste)

```javascript
// Open mongosh
use hrms

// Add companyId to all users
db.users.updateMany(
  { companyId: { $exists: false } },
  { $set: { companyId: null } }
)

// Add companyId to all employees
db.employees.updateMany(
  { companyId: { $exists: false } },
  { $set: { companyId: null } }
)

// Verify
db.users.find({}, { email: 1, companyId: 1 }).pretty()
```

---

**After running these commands:**
1. ✅ Restart backend
2. ✅ Clear browser cache  
3. ✅ Test on all portals

**Aishwarya@company.com should now ONLY be able to login to port 5173! 🎉**
