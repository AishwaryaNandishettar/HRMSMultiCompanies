# Manager Sync Diagnostic Guide

## Issue
After updating Mahesh's manager to Padmanabh@omoi.com in the Employee Directory:
- ✅ Mahesh can see his own attendance record for tomorrow (2026-06-07)
- ❌ Admin view shows Mahesh's record but not with updated manager
- ❌ Padmanabh's manager view doesn't show Mahesh's new records

## Diagnostic Tool

I've created a diagnostic tool to help identify the exact issue.

### Step 1: Open Diagnostic Tool
1. Make sure your backend is running on port 8082
2. Open the file: `e:\HRMSProject\debug_manager_sync.html` in your browser

### Step 2: Run Diagnostics

#### Check 1: User Manager Assignments
- Click "Check User Manager Assignments"
- Look for Mahesh's entry
- **Expected**: Mahesh should have `managerEmail: "Padmanabh@omoi.com"`
- **If NOT**: This means the Employee → User sync didn't work

#### Check 2: Employee Manager Assignments  
- Click "Check Employee Manager Assignments"
- Look for Mahesh's entry
- **Expected**: Mahesh should have `managerEmail: "Padmanabh@omoi.com"`

#### Check 3: Team Members for Padmanabh
- Click "Check Padmanabh's Team"
- **Expected**: Should show Mahesh in the list
- **If NOT**: The User table wasn't updated properly

#### Check 4: Recent Attendance Records
- Click "Check Recent Attendance"
- Look for Mahesh's 2026-06-07 record
- **Expected**: Should show `managerEmail: "Padmanabh@omoi.com"`

### Step 3: Fix Issues (if found)

#### If User Table Not Synced:
- Click "Force Sync All Manager Data"
- This will sync all Employee → User manager assignments
- Re-run Check 3 to verify Mahesh now appears under Padmanabh

#### If Attendance Record Has Wrong Manager:
- The attendance record was created before the sync
- New check-ins should have correct manager info
- Old records keep their original manager (this is expected)

## Manual Database Check (Alternative)

If the diagnostic tool doesn't work, you can check the database directly:

### Check User Collection:
```javascript
// In MongoDB shell or compass
db.users.find({"email": "mahesh@gmail.com"}, {"email": 1, "managerEmail": 1, "managerName": 1})
```
**Expected Result:**
```json
{
  "email": "mahesh@gmail.com",
  "managerEmail": "Padmanabh@omoi.com",
  "managerName": "Padmanabh"
}
```

### Check Employee Collection:
```javascript
db.employees.find({"email": "mahesh@gmail.com"}, {"email": 1, "managerEmail": 1, "manager": 1})
```

### Check Attendance Collection:
```javascript
db.attendances.find(
  {"date": "2026-06-07", "name": "Mahesh"}, 
  {"date": 1, "name": 1, "managerEmail": 1, "reportingManager": 1}
)
```

## What Should Happen After Fix:

1. **User Table**: Mahesh's `managerEmail` = "Padmanabh@omoi.com"
2. **Manager Query**: `findByManagerEmail("Padmanabh@omoi.com")` returns Mahesh
3. **Attendance Visibility**: Padmanabh sees Mahesh's attendance records
4. **New Check-ins**: Will automatically have Padmanabh as manager

## Next Steps:

1. Run the diagnostic tool
2. Share the results with me
3. If sync is needed, use "Force Sync" button
4. Test by having Mahesh check-in again
5. Verify Padmanabh can see the new record