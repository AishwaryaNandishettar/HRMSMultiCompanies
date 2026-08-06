# 🔧 Fix Employee Names - Complete Guide

## 🎯 Problem

Your **localhost shows wrong employee names**:
- Rahul Sharma (EMP101)
- Rahul Mandre (EMP102)
- Silk Smitha (EMP103)
- ABCD (EMP105)

But **Vercel shows correct names**:
- Pradyumna Mishra
- Badgjerrekha063
- Aishushettar95
- Aishwarya

## ✅ Solution

**Update your local MongoDB database** with correct employee names.

**No code changes needed!** The frontend/backend logic is correct.

---

## 🚀 Quick Fix (Choose One Method)

### **Method 1: One-Click Fix** ⭐ EASIEST

Just double-click this file:
```
FIX_EMPLOYEE_NAMES_NOW.bat
```

Follow the prompts to update your database.

---

### **Method 2: MongoDB Compass (Visual)**

**Step 1:** Open MongoDB Compass

**Step 2:** Connect to `mongodb://localhost:27017`

**Step 3:** Navigate to:
- Database: `Data_base_hrms`
- Collection: `employees`

**Step 4:** Find and update each employee:

| Find | Update |
|------|--------|
| `{ employeeId: "EMP101" }` | Change `fullName` to correct name |
| `{ employeeId: "EMP102" }` | Change `fullName` to correct name |
| `{ employeeId: "EMP103" }` | Change `fullName` to correct name |
| `{ employeeId: "EMP105" }` | Change `fullName` to correct name |

**Step 5:** Refresh browser

---

### **Method 3: MongoDB Shell Script**

**Step 1:** Open `fix-employee-names.js`

**Step 2:** Update the employee names in the script:

```javascript
// Change these lines to match your actual data:
db.employees.updateOne(
    { employeeId: "EMP101" },
    { $set: { fullName: "Your Real Employee Name" } }
);
```

**Step 3:** Run the script:

```bash
mongosh < fix-employee-names.js
```

**Step 4:** Refresh browser

---

### **Method 4: Auto-Sync from Production** ⚡ AUTOMATIC

This fetches data from your production backend and updates local MongoDB.

**Step 1:** Right-click `sync-employee-data.ps1` → "Run with PowerShell"

**Step 2:** Enter your JWT token when prompted
- Get token from browser: `localStorage.getItem('token')`
- Login to production site first to get token

**Step 3:** Script will:
- ✅ Fetch all employees from production
- ✅ Generate MongoDB update script
- ✅ Update your local database
- ✅ Show results

**Step 4:** Refresh browser

---

## 📋 Verification Steps

After updating:

1. **Check MongoDB:**
```bash
mongosh
use Data_base_hrms
db.employees.find({}, {employeeId: 1, fullName: 1})
```

You should see correct names in the database.

2. **Check Browser:**
- Open: http://localhost:5173/employee-card
- Press `Ctrl+Shift+R` (hard refresh)
- Verify names match what's in MongoDB

3. **Check Backend Console:**

Should show:
```
✅ Fetching employees for company: ...
✅ Found X employees
```

---

## 🔍 Why This Happens

You have TWO separate MongoDB databases:

```
┌─────────────────────────────────┐
│  LOCAL MONGODB                  │
│  localhost:27017                │
│  Contains: Test Data ❌         │
│  Names: Rahul, Silk, ABCD       │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  PRODUCTION MONGODB             │
│  MongoDB Atlas                  │
│  Contains: Real Data ✅         │
│  Names: Pradyumna, Aishushettar │
└─────────────────────────────────┘
```

Your localhost backend connects to local MongoDB (with test data).
Your Vercel backend connects to production MongoDB (with real data).

---

## 💡 Alternative: Use Production Database

Instead of updating local MongoDB, you can connect localhost to production database:

**Create `.env` file:**

```properties
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
```

Get the production MongoDB URI from Render/Railway environment variables.

**Restart backend:**
```bash
mvnw spring-boot:run
```

Now localhost will use the same database as production!

---

## 🛠️ Tools Created

| File | Purpose |
|------|---------|
| `FIX_EMPLOYEE_NAMES_NOW.bat` | ⭐ **Start here** - Interactive menu |
| `fix-employee-names.js` | MongoDB update script (manual) |
| `sync-employee-data.ps1` | Auto-sync from production |
| `README_FIX_EMPLOYEE_NAMES.md` | This guide |

---

## ❓ Troubleshooting

### **Problem: mongosh not found**

**Solution:** Install MongoDB Shell
- Download: https://www.mongodb.com/try/download/shell
- Install and add to PATH
- Restart terminal

### **Problem: MongoDB not running**

**Solution:** Start MongoDB service
```bash
net start MongoDB
```

Or install MongoDB:
- Download: https://www.mongodb.com/try/download/community

### **Problem: Cannot connect to MongoDB**

**Solution:** Check MongoDB is running
```bash
mongosh
# Should connect without errors
```

### **Problem: Names still wrong after update**

**Solution:** 
1. Clear browser cache: `Ctrl+Shift+R`
2. Clear localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear()
   location.reload()
   ```
3. Restart backend:
   ```bash
   # Stop backend (Ctrl+C)
   mvnw spring-boot:run
   ```

---

## ✅ Expected Result

After the fix:

### **MongoDB:**
```
EMP101: Pradyumna Mishra
EMP102: Badgjerrekha063
EMP103: Aishushettar95
EMP105: Aishwarya
```

### **Localhost Browser:**
```
✅ Shows same names as MongoDB
✅ Matches Vercel deployment
✅ No more test data
```

---

## 🎯 Summary

| Action | Result |
|--------|--------|
| **Before** | Localhost shows test names (Rahul, Silk, ABCD) |
| **Action** | Update local MongoDB with correct names |
| **After** | Localhost shows real names (matches Vercel) |

**No code changes needed!**
**No logic changes needed!**
**Just update the database!**

---

## 📞 Quick Start

1. Double-click: `FIX_EMPLOYEE_NAMES_NOW.bat`
2. Choose method 2 (Auto-sync)
3. Enter your token
4. Wait for completion
5. Refresh browser
6. Done! ✅

---

## 🎉 Final Notes

The frontend and backend code are **100% correct**! They properly display employee names from the database. Your local database just happened to have test data instead of real employee data.

After this fix, localhost will work exactly like Vercel!

