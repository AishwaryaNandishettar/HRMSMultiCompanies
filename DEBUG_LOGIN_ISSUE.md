# 🔍 Debug: Why Omoi User Can Login to PeopleSync Portal

## Problem

Omoi HR Works employee is able to login to PeopleSync portal (port 5178), but should be blocked.

---

## ✅ Step 1: Check Backend Console Logs

When you try to login with an Omoi user to port 5178, look at your **backend terminal** (Terminal 1 where you ran `./mvnw spring-boot:run`).

You should see logs like:

```
==================================
Logged User : admin@omoi.com
CompanyId   : null
TenantId    : company-c
==================================
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: null
  Portal Type: Client Portal (company-c)
❌ Login denied: User has no company assigned
```

**If you see this:** The validation is working, but frontend might be caching the login.

**If you DON'T see these logs:** The backend is not running or you're using a different backend.

---

## ✅ Step 2: Check User's Company ID in Database

The most likely issue is: **Your user's companyId in MongoDB is NOT null.**

### Check in MongoDB:

```javascript
// Connect to MongoDB
use hrms

// Check the user you're testing with
db.users.findOne({ email: "admin@omoi.com" })

// Look at the companyId field
```

**Expected result for Omoi employee:**
```json
{
  "_id": ObjectId("..."),
  "email": "admin@omoi.com",
  "name": "Admin",
  "companyId": null,    ← Should be NULL
  "role": "ADMIN"
}
```

**If you see:**
```json
{
  "companyId": "company-c"    ← WRONG! This makes them PeopleSync employee
}
```

**Then this is why they can login to port 5178!**

---

## ✅ Step 3: Fix User's Company ID

If the user has `companyId: "company-c"` instead of `null`, fix it:

```javascript
// Fix single user
db.users.updateOne(
  { email: "admin@omoi.com" },
  { $set: { companyId: null } }
)

// Fix all Omoi users (that have "omoi" string)
db.users.updateMany(
  { companyId: "omoi" },
  { $set: { companyId: null } }
)

// Fix all users that shouldn't have companyId
db.users.updateMany(
  { email: /omoi\.com$/i },  // All emails ending with @omoi.com
  { $set: { companyId: null } }
)
```

---

## ✅ Step 4: Restart Backend

After fixing the database, restart the backend:

```bash
# In backend terminal, press Ctrl + C to stop
# Then restart:
./mvnw spring-boot:run

# Watch for:
✅ Reset Omoi User to null companyId: admin@omoi.com
```

---

## ✅ Step 5: Clear Browser Cache

The frontend might be caching the login token. Clear it:

### Method 1: Use Incognito Mode
1. Open a new Incognito/Private window
2. Go to http://localhost:5178
3. Try logging in with Omoi user

### Method 2: Clear Cookies
1. Open Developer Tools (F12)
2. Go to Application tab
3. Clear all cookies for localhost:5178
4. Refresh page
5. Try logging in again

### Method 3: Clear localStorage
1. Open Developer Tools (F12)
2. In Console, run:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 🔍 What to Check in Backend Logs

### Successful Block (CORRECT):
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: null
  Portal Type: Client Portal (company-c)
❌ Login denied: User has no company assigned
```

**Frontend shows:** Error message "Access denied: Your account is not associated with any company."

---

### Wrong CompanyId (PROBLEM):
```
🔍 STRICT TENANT VALIDATION:
  Request Tenant ID: company-c
  User Company ID: company-c
  Portal Type: Client Portal (company-c)
✅ Tenant validation passed for client portal
```

**Frontend shows:** Login succeeds (redirects to Home)

**This means:** User's companyId is "company-c" (PeopleSync employee), not null (Omoi employee)

---

## 🎯 Quick Diagnostic

Run this in MongoDB to see ALL users and their companyId:

```javascript
db.users.find({}, { email: 1, companyId: 1, _id: 0 }).pretty()
```

**Expected results:**
```
{ "email": "admin@omoi.com", "companyId": null }
{ "email": "manager@omoi.com", "companyId": null }
{ "email": "john@talenthub.com", "companyId": "company-a" }
{ "email": "jane@workforcepro.com", "companyId": "company-b" }
{ "email": "bob@peoplesync.com", "companyId": "company-c" }
```

---

## 🚨 Common Causes

### Cause 1: User has wrong companyId
**Symptom:** User can login to wrong portal
**Fix:** Update user's companyId in MongoDB

### Cause 2: Backend not restarted
**Symptom:** Old validation logic still running
**Fix:** Restart backend to load new code

### Cause 3: Frontend caching token
**Symptom:** Login succeeds even though backend blocks it
**Fix:** Clear browser cache/cookies or use incognito

### Cause 4: Using old backend
**Symptom:** No validation logs in console
**Fix:** Make sure backend is running the latest code

---

## ✅ Verification Steps

1. **Check backend logs** - Should show "STRICT TENANT VALIDATION"
2. **Check user in MongoDB** - Should have correct companyId
3. **Clear browser cache** - Remove old tokens
4. **Test in incognito** - Fresh browser state
5. **Watch backend console** - See validation in real-time

---

## 📝 Test Checklist

Try logging into port 5178 (PeopleSync) with these users:

- [ ] admin@omoi.com → Should be **BLOCKED** ❌
- [ ] john@talenthub.com → Should be **BLOCKED** ❌
- [ ] jane@workforcepro.com → Should be **BLOCKED** ❌
- [ ] bob@peoplesync.com → Should be **ALLOWED** ✅

---

## 🔧 Quick Fix Commands

```javascript
// Connect to MongoDB
use hrms

// Check all users
db.users.find({}, { email: 1, companyId: 1 }).pretty()

// Fix Omoi users
db.users.updateMany(
  { email: /omoi\.com$/i },
  { $set: { companyId: null } }
)

// Fix TalentHub users
db.users.updateMany(
  { email: /talenthub\.com$/i },
  { $set: { companyId: "company-a" } }
)

// Fix WorkforcePro users
db.users.updateMany(
  { email: /workforcepro\.com$/i },
  { $set: { companyId: "company-b" } }
)

// Fix PeopleSync users
db.users.updateMany(
  { email: /peoplesync\.com$/i },
  { $set: { companyId: "company-c" } }
)

// Verify changes
db.users.find({}, { email: 1, companyId: 1 }).pretty()
```

---

## 🎯 Next Steps

1. **Check backend console** when you try to login
2. **Check user's companyId** in MongoDB
3. **Fix if needed** using commands above
4. **Restart backend**
5. **Clear browser cache**
6. **Test again in incognito mode**

**The validation is already in place - this is likely a data issue! 🔍**
