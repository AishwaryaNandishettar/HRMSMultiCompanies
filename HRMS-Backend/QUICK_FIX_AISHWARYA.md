# 🔧 Quick Fix for Aishwarya@company.com

## Problem

`Aishwarya@company.com` can login to ALL portals, but should ONLY login to port 5173 (Omoi HR Works).

---

## ✅ Solution: Set companyId to NULL

The user's `companyId` in MongoDB needs to be `null` for them to be an Omoi employee.

---

## 🚀 Method 1: MongoDB Compass (Easiest)

### Step 1: Open MongoDB Compass
1. Connect to your MongoDB database
2. Select database: `hrms`
3. Select collection: `users`

### Step 2: Find the User
Search for: `{ email: "Aishwarya@company.com" }`

### Step 3: Edit the User
1. Click the pencil icon to edit
2. Find the `companyId` field
3. **Change it to:** `null` (not "null" string, actual null value)
4. Click "Update"

### Step 4: Do the Same for Employees Collection
1. Go to `employees` collection
2. Search for: `{ email: "Aishwarya@company.com" }`
3. Edit and set `companyId` to `null`

---

## 🚀 Method 2: MongoDB Shell Commands

### Option A: Run in mongosh

```bash
# Open mongosh terminal
mongosh

# Connect to your database
use hrms

# Fix Users collection
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: null } }
)

# Fix Employees collection
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: null } }
)

# Verify
db.users.findOne({ email: "Aishwarya@company.com" }, { email: 1, companyId: 1 })
```

### Option B: Run the Script

```bash
# Run the fix script
mongosh < FIX_AISHWARYA_USER.js
```

---

## 🔄 After Fixing Database

### Step 1: Restart Backend

```bash
# In backend terminal, press Ctrl + C
# Then restart:
cd HRMS-Backend
./mvnw spring-boot:run

# Watch for this message:
✅ Reset Omoi User to null companyId: Aishwarya@company.com
```

### Step 2: Clear Browser Cache

The frontend might have cached the old login. Clear it:

**Method 1: Use Incognito/Private Window**
- Open new incognito window
- Go to each portal and test

**Method 2: Clear Storage**
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage → Clear site data
4. Refresh page

**Method 3: Console Command**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 🧪 Test After Fix

### ✅ Port 5173 (Omoi) - Should SUCCEED
```
Email: Aishwarya@company.com
Password: [your password]

Expected: ✅ Login successful
```

### ❌ Port 5176 (TalentHub) - Should FAIL
```
Email: Aishwarya@company.com
Password: [your password]

Expected: ❌ Error "Your account is not associated with any company"
```

### ❌ Port 5177 (WorkforcePro) - Should FAIL
```
Email: Aishwarya@company.com
Password: [your password]

Expected: ❌ Error "Your account is not associated with any company"
```

### ❌ Port 5178 (PeopleSync) - Should FAIL
```
Email: Aishwarya@company.com
Password: [your password]

Expected: ❌ Error "Your account is not associated with any company"
```

---

## 🔍 Verify in Backend Console

When you try to login to port 5178 (PeopleSync), you should see:

```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: null               ← Should be NULL now
  Portal Type: Client Portal (company-c)
❌ Login denied: User has no company assigned
```

---

## 📝 Complete Fix Steps

1. ✅ Open MongoDB Compass or mongosh
2. ✅ Run update commands above
3. ✅ Verify companyId is now `null`
4. ✅ Restart backend
5. ✅ Clear browser cache
6. ✅ Test login on all 4 portals
7. ✅ Verify only port 5173 allows login

---

## 🎯 Expected Results

| Portal | Port | Should Allow Login? | Error Message |
|--------|------|---------------------|---------------|
| Omoi | 5173 | ✅ YES | (no error) |
| TalentHub | 5176 | ❌ NO | "Not associated with any company" |
| WorkforcePro | 5177 | ❌ NO | "Not associated with any company" |
| PeopleSync | 5178 | ❌ NO | "Not associated with any company" |

---

## 🚨 If Still Not Working

### Check 1: Verify Database Update
```javascript
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1 }
)

// Should show:
// { email: "Aishwarya@company.com", companyId: null }
```

### Check 2: Backend Logs
Look at backend terminal when you try to login. It should show:
```
User Company ID: null
```

If it still shows a company ID, the database update didn't work.

### Check 3: Browser Cache
Make sure you cleared all cache. Use incognito mode to be sure.

---

## ✅ Quick Command (Copy-Paste)

```javascript
// Run this in mongosh or MongoDB Compass query bar
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: null } }
);
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: null } }
);

// Verify
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1 }
);
```

**Expected output:**
```json
{
  "_id": ObjectId("..."),
  "email": "Aishwarya@company.com",
  "companyId": null
}
```

---

**After running these commands, restart backend and test again! The validation logic is already there - you just need to fix the data! 🔧**
