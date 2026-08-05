# Fix Employee Directory Data Mismatch

## Problem
The Employee Directory page shows different employees than what exists in MongoDB database.

**Example:**
- MongoDB has: "Lata Benakop (IT-EMP-0041)", "Swati Yadav (IT-EMP-0042)", etc.
- Frontend shows: "Rahul Sharma (EMP101)", "Rahul Mandre (EMP102)", etc.

## Root Cause

The backend filters employees by `companyId`:

```java
// EmployeeController.java - /api/employee/all endpoint
String companyId = user.getCompanyId(); // e.g., "omoikaneinnovations"
List<Employee> employees = employeeService.getAllEmployees(companyId);
```

The mismatch happens when:
1. **Your logged-in user** has `companyId = "omoikaneinnovations"`
2. **Employees in database** have different `companyId` values (null, "company-a", "company-b", etc.)

When the backend calls `employeeRepo.findByCompanyId("omoikaneinnovations")`, it returns NO employees, so it falls back to `findAll()` which returns ALL employees from ALL companies.

## Solution

Run the provided script to sync all employees to the same `companyId` as your admin user.

### Steps to Fix

#### 1. Navigate to Backend Directory
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
```

#### 2. Run the Fix Script
```bash
mongosh "mongodb://localhost:27017/Data_base_hrms" fix_employee_companyid.js
```

**OR if you're using MongoDB Atlas:**
```bash
mongosh "YOUR_MONGODB_ATLAS_URI" fix_employee_companyid.js
```

#### 3. Restart Backend Server
```bash
# Stop current backend (Ctrl+C)
mvn spring-boot:run
```

#### 4. Clear Browser Cache
- Open Chrome DevTools (F12)
- Go to Application tab → Storage → Clear site data
- Close and reopen browser

#### 5. Login and Verify
- Login to the frontend
- Go to Employee Directory
- You should now see the correct employees from MongoDB

## What the Script Does

1. **Checks** your admin user's `companyId`
2. **Analyzes** employee distribution across different `companyId` values
3. **Updates** ALL employees to use the same `companyId` as your admin
4. **Updates** ALL users (except admins) to match
5. **Verifies** the fix was successful

## Expected Output

```
╔═══════════════════════════════════════════════════╗
║   FIX EMPLOYEE DIRECTORY - CompanyId Sync        ║
╚═══════════════════════════════════════════════════╝

📊 STEP 1: Checking logged-in user's companyId...
─────────────────────────────────────────────────────
✅ Found 1 admin user(s):

   👤 admin@omoikaneinnovations.com
      Name: Admin User
      CompanyId: omoikaneinnovations

📊 STEP 2: Checking employees' companyId distribution...
─────────────────────────────────────────────────────

   🏢 CompanyId: omoikaneinnovations
      Count: 50 employees

🔧 STEP 3: Fixing companyId mismatch...
─────────────────────────────────────────────────────
   Setting all employees to companyId: 'omoikaneinnovations'
   ✅ Updated 50 employees
   ✅ Updated 50 users

✅ All employees now have companyId: 'omoikaneinnovations'
```

## Alternative: Manual MongoDB Fix

If the script doesn't work, run these MongoDB commands directly:

```javascript
// Connect to MongoDB
use Data_base_hrms

// 1. Check your admin's companyId
db.users.findOne(
  { role: "ADMIN" },
  { email: 1, companyId: 1 }
)

// 2. Update ALL employees (replace "omoikaneinnovations" with your admin's companyId)
db.employees.updateMany(
  {},
  { $set: { companyId: "omoikaneinnovations" }}
)

// 3. Update ALL users (except admins)
db.users.updateMany(
  { role: { $ne: "ADMIN" }},
  { $set: { companyId: "omoikaneinnovations" }}
)

// 4. Verify
db.employees.find({}, { fullName: 1, companyId: 1 }).limit(5)
```

## Verification Checklist

- [ ] Script ran successfully without errors
- [ ] Backend restarted
- [ ] Browser cache cleared
- [ ] Can login to frontend
- [ ] Employee Directory shows correct employees from MongoDB
- [ ] Employee count matches MongoDB count

## Still Not Working?

If the issue persists, check:

1. **MongoDB Connection**: Verify backend is connected to correct database
   ```bash
   # Check logs when backend starts
   mvn spring-boot:run
   # Look for: "MongoDB connected to: mongodb://localhost:27017/Data_base_hrms"
   ```

2. **Frontend API URL**: Check if frontend is calling correct backend
   ```javascript
   // HRMS-Frontend/.env
   VITE_API_BASE_URL=http://localhost:8080
   ```

3. **User CompanyId**: Verify your logged-in user has the correct companyId
   ```javascript
   // In MongoDB
   db.users.findOne({ email: "your-email@example.com" })
   ```

4. **Backend Logs**: Check what companyId is being used
   ```java
   // Look for this log in backend console:
   "✅ Fetching employees for company: omoikaneinnovations"
   ```

## Technical Details

### Backend Flow
```
1. User logs in → JWT token contains user email
2. EmployeeController.getAllEmployees() extracts email from JWT
3. Finds user in database → gets user.companyId
4. Calls employeeService.getAllEmployees(companyId)
5. Repository queries: employees.find({ companyId: "omoikaneinnovations" })
6. Returns only matching employees
```

### Database Schema
```javascript
// User
{
  email: "user@example.com",
  name: "User Name",
  role: "ADMIN",
  companyId: "omoikaneinnovations", // ← Must match
  ...
}

// Employee
{
  fullName: "Lata Benakop",
  email: "lata@example.com",
  employeeId: "IT-EMP-0041",
  companyId: "omoikaneinnovations", // ← Must match
  ...
}
```

## Prevention

To avoid this issue in the future:

1. **Always set companyId** when creating new users/employees
2. **Use consistent companyId** across all records
3. **Run verification scripts** after bulk imports
4. **Set default companyId** in backend configuration

## No Logic Changes

This fix only updates the `companyId` field in the database to ensure consistency. No backend or frontend logic has been modified.
