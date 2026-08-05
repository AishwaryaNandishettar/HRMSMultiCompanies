# 🔧 Fix Timesheet EmpID - Step by Step Guide

## 📋 Problem Summary
- **Timesheet page shows:** `EMP-aishw`, `EMP-lata`, `UNKNOWN`
- **Should show:** `IT-EMP-0041`, `GN-EMP-0007` (like Attendance page)

---

## ✅ Solution: 3-Step Fix

### **Step 1: Sync Database** (MongoDB Script)
### **Step 2: Update Backend** (Java Code)
### **Step 3: Test & Verify**

---

## 🎯 Step 1: Sync Employee IDs in Database

### Option A: Using MongoDB Compass GUI

1. **Open MongoDB Compass**
2. **Connect to your database**
3. **Select `users` collection**
4. **For each user missing employeeId:**

```javascript
// Find the user's email
// Example: lata.b@omoikaneinnovations.com

// Go to employees collection
// Find employee with same email
// Copy their employeeId (e.g., "IT-EMP-0041")

// Go back to users collection
// Find the user document
// Click "Edit Document"
// Add or update field:
{
  "employeeId": "IT-EMP-0041"
}
// Click "Update"
```

---

### Option B: Using MongoDB Shell Script (Faster - Recommended)

**Step 1.1: Open Terminal/Command Prompt**

```bash
cd D:/HRMSProject
```

**Step 1.2: Connect to MongoDB**

If using MongoDB Atlas (cloud):
```bash
mongosh "mongodb+srv://username:password@cluster.mongodb.net/hrms_database"
```

If using local MongoDB:
```bash
mongosh "mongodb://localhost:27017/hrms_database"
```

**Step 1.3: Run the Sync Script**

```bash
load("sync_employee_ids.js")
```

OR directly paste the script:

```javascript
db.users.find().forEach(function(user) {
  var employee = db.employees.findOne({ email: user.email });
  
  if (employee && employee.employeeId) {
    db.users.updateOne(
      { _id: user._id },
      { $set: { employeeId: employee.employeeId } }
    );
    print("✅ Updated: " + user.email + " → " + employee.employeeId);
  }
});
```

**Expected Output:**
```
✅ Updated: lata.b@omoikaneinnovations.com → IT-EMP-0041
✅ Updated: aishwarya@company.com → ADMIN001
✅ Updated: vishnu@company.com → GN-EMP-0007
...
📊 Updated: 10 users
```

---

## 🛠️ Step 2: Update Backend Code (Optional but Recommended)

This adds a safety fallback to check Employee collection if User.employeeId is null.

### Step 2.1: Check if EmployeeRepository exists

<function_calls>
<invoke name="grepSearch">
<parameter name="explanation">Finding EmployeeRepository to see if it exists in the backend