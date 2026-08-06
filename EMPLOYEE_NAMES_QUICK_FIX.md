# 🔧 Employee Names Issue - Quick Fix Guide

## ❓ Problem

Employee names in the Employee Directory showing different names than expected:
- "Rahul Sharma" (EMP101)
- "Rahul Mandre" (EMP102)  
- "Silk Smitha" (EMP103)
- "ABCD" (EMP105)

## ✅ Diagnosis (2 Minutes)

### **Step 1: Open the Debug Tool**

```bash
# Open this file in your browser:
file:///d:/New folder/HRMSProject (2)/HRMSProject/check-employee-names.html
```

Or simply double-click: `check-employee-names.html`

### **Step 2: Login First**

1. Open http://localhost:5173
2. Login with your credentials
3. Go back to the debug tool

### **Step 3: Check Data**

Click "Fetch Employee Data" button in the debug tool.

You will see one of two scenarios:

---

## 🎯 Scenario A: Backend Has Wrong Names

**If the debug tool shows the same wrong names** (Rahul Sharma, Silk Smitha, etc.):

### **Root Cause:**
Your MongoDB database contains test/demo data with fake names.

### **Solution:**
Update MongoDB data with correct names.

**Method 1: Using MongoDB Compass (GUI)**

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `Data_base_hrms`
4. Select collection: `employees`
5. Find the employee record
6. Edit the `fullName` field
7. Click "Update"

**Method 2: Using MongoDB Shell**

```bash
# Open MongoDB shell
mongosh

# Switch to your database
use Data_base_hrms

# View current data
db.employees.find({}, {employeeId: 1, fullName: 1, email: 1})

# Update a specific employee
db.employees.updateOne(
  { employeeId: "EMP101" },
  { $set: { fullName: "John Doe" } }
)

# Update by email
db.employees.updateOne(
  { email: "employee@company.com" },
  { $set: { fullName: "Jane Smith" } }
)

# Update multiple employees
db.employees.updateMany(
  { department: "Engineering" },
  { $set: { manager: "New Manager Name" } }
)
```

**Method 3: Bulk Update Script**

Create `update-employee-names.js`:

```javascript
// Connect to MongoDB
use Data_base_hrms

// Update multiple employees
db.employees.updateOne(
  { employeeId: "EMP101" },
  { $set: { fullName: "Correct Name 1" } }
);

db.employees.updateOne(
  { employeeId: "EMP102" },
  { $set: { fullName: "Correct Name 2" } }
);

db.employees.updateOne(
  { employeeId: "EMP103" },
  { $set: { fullName: "Correct Name 3" } }
);

print("✅ Employee names updated successfully");
```

Run it:
```bash
mongosh < update-employee-names.js
```

### **After Updating:**

1. Refresh the debug tool
2. Click "Fetch Employee Data" again
3. Verify names are now correct
4. Refresh your HRMS application

---

## 🎯 Scenario B: Frontend Has Cached Data

**If the debug tool shows CORRECT names, but the Employee Directory shows WRONG names:**

### **Root Cause:**
Browser is displaying cached/stale data.

### **Solution:**

**Method 1: Use the Debug Tool**

1. In the debug tool, click "Clear Browser Cache"
2. Login to HRMS again
3. Navigate to Employee Directory

**Method 2: Manual Browser Clear**

```javascript
// Open Browser Console (F12) on HRMS app
localStorage.clear();
sessionStorage.clear();

// Also clear IndexedDB if exists
indexedDB.deleteDatabase('workbox-expiration');

// Clear all caches
caches.keys().then(names => names.forEach(name => caches.delete(name)));

// Reload
location.reload();
```

**Method 3: Hard Refresh**

- Windows: Press `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: Press `Cmd + Shift + R`

---

## 📋 Verification Checklist

After applying the fix:

- [ ] Debug tool shows correct names
- [ ] Browser cache cleared
- [ ] Logged in again
- [ ] Employee Directory shows correct names
- [ ] Profile images loading correctly
- [ ] No console errors in browser (F12)

---

## 🔍 Still Not Working?

### **Check Backend Console**

When you access Employee Directory, backend should log:

```
✅ Fetching employees for company: omoikaneinnovations
✅ Found X employees
```

### **Check Frontend Console**

Browser console (F12) should show:

```
🔍 getAllEmployees API response: [array of employees]
✅ Fetched employees: [array]
```

### **Check MongoDB Connection**

Ensure you're connected to the correct database:

In `application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/Data_base_hrms
```

Make sure `Data_base_hrms` is the correct database name.

### **Check for Multiple Databases**

```bash
mongosh
show dbs
# Check if you have multiple databases like:
# - Data_base_hrms (test)
# - hrms_production (real)
```

You might be connected to the wrong database!

---

## 💡 Common Causes Summary

| Symptom | Cause | Fix |
|---------|-------|-----|
| Debug tool shows wrong names | MongoDB has test data | Update MongoDB records |
| Debug tool shows correct names, but UI shows wrong names | Browser cache | Clear browser cache |
| Some names correct, some wrong | Mixed data sources | Update specific records in MongoDB |
| All names are "undefined" | Backend API issue | Check backend logs and API response |

---

## 🚀 Quick Commands Reference

### **Check MongoDB Data:**
```bash
mongosh
use Data_base_hrms
db.employees.find().pretty()
```

### **Update Single Employee:**
```bash
db.employees.updateOne(
  { email: "employee@company.com" },
  { $set: { fullName: "New Name" } }
)
```

### **Clear Browser Cache:**
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### **Restart Backend:**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

### **Restart Frontend:**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

---

## 📞 Tools Created for You

| File | Purpose |
|------|---------|
| `check-employee-names.html` | **Use this first!** Debug tool to check backend data |
| `EMPLOYEE_NAME_FIX.md` | Detailed diagnosis guide |
| `EMPLOYEE_NAMES_QUICK_FIX.md` | This file - quick reference |

---

## 🎯 Most Likely Solution

**Based on the names you're seeing ("Rahul Sharma", "Silk Smitha", "ABCD")**, this is almost certainly **test/demo data in MongoDB**.

**Quick Fix:**

1. Open `check-employee-names.html` in browser
2. Login to HRMS
3. Use debug tool to see actual data
4. Update MongoDB with correct names
5. Refresh HRMS application

**No code changes needed!** The frontend is working correctly - it's just displaying what's in the database.

