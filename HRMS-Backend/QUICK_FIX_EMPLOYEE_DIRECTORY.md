# Quick Fix: Employee Directory Shows Wrong Data

## The Problem
- MongoDB shows: "Lata Benakop (IT-EMP-0041)" 
- Frontend shows: "Rahul Sharma (EMP101)"
- **They don't match!**

## Why This Happens
Your employees in MongoDB have different `companyId` values than your logged-in user. The backend filters employees by `companyId`, so you see the wrong data.

## Quick Fix (Windows)

### Option 1: Run Batch Script (Easiest)
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
fix_employee_directory.bat
```

### Option 2: Run MongoDB Script
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
mongosh "mongodb://localhost:27017/Data_base_hrms" fix_employee_companyid.js
```

### Option 3: Manual MongoDB Commands
```bash
mongosh "mongodb://localhost:27017/Data_base_hrms"
```

Then run:
```javascript
use Data_base_hrms

// Update all employees to same companyId
db.employees.updateMany(
  {},
  { $set: { companyId: "omoikaneinnovations" }}
)

// Update all users
db.users.updateMany(
  { role: { $ne: "ADMIN" }},
  { $set: { companyId: "omoikaneinnovations" }}
)
```

## After Running Fix

1. **Restart Backend**
   ```bash
   # Stop current server (Ctrl+C)
   cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
   mvn spring-boot:run
   ```

2. **Clear Browser Cache**
   - Press `Ctrl+Shift+Delete`
   - Select "Cached images and files"
   - Click "Clear data"

3. **Login and Verify**
   - Login to frontend
   - Go to Employee Directory
   - You should see correct employees now!

## Files Created
1. `HRMS-Backend/fix_employee_companyid.js` - MongoDB fix script
2. `HRMS-Backend/fix_employee_directory.bat` - Windows batch file
3. `FIX_EMPLOYEE_DIRECTORY_MISMATCH.md` - Detailed explanation

## No Logic Changed
This fix only updates database records. No backend or frontend code was modified.
