# ⚡ IMMEDIATE FIX - Timesheet EMP IDs After Refresh

## Problem You're Seeing
After refresh, EMP IDs revert to:
- EMP-Aishw ❌
- EMP-lata. ❌
- EMP-mahes ❌
- EMP-nikt ❌

Instead of:
- IT-EMP-0041 ✅
- GN-EMP-0018 ✅
- GN-EMP-0019 ✅

## Root Cause
The **Employee collection** in MongoDB has the correct EMP IDs, but the **Attendance records** don't have them populated yet.

## Quick Fix (2 Steps)

### Step 1: Restart Backend
```bash
cd HRMS-Backend
mvn spring-boot:run
```

Wait for: `Started HrmsBackendApplication`

### Step 2: Run Backfill (Choose ONE method)

**Method A: PowerShell Script (EASIEST)**
```powershell
.\fix-timesheet-empids.ps1
```

**Method B: PowerShell Command**
```powershell
Invoke-WebRequest -Uri "http://localhost:8082/api/attendance/backfill-empids" -Method POST
```

**Method C: Browser Console (F12)**
```javascript
fetch('http://localhost:8082/api/attendance/backfill-empids', {
  method: 'POST'
}).then(r => r.text()).then(result => {
  console.log(result);
  alert(result);
});
```

**Method D: cURL**
```bash
curl -X POST http://localhost:8082/api/attendance/backfill-empids
```

### Step 3: Refresh Timesheet
1. Go to `http://localhost:5173/timesheet`
2. Press **F5** to refresh
3. EMP IDs should now be correct and **stay correct** ✅

## What the Backfill Does

The endpoint `/api/attendance/backfill-empids`:
1. Reads all attendance records from MongoDB
2. For each record with missing/incorrect empId:
   - Finds the Employee document by email
   - Gets the correct `employeeId` (IT-EMP-0041, GN-EMP-0018, etc.)
   - Updates the attendance record
   - Saves back to MongoDB
3. Also updates name, department, and manager info

## Expected Output

```
Backfill complete: 47 records updated, 3 records skipped (already have empId or user not found)
```

## Backend Logs Will Show

```
🔄 Starting attendance data backfill...
✅ Updated attendance: 2026-07-17 | Aishwarya@company.com | empId=IT-EMP-0041
✅ Updated attendance: 2026-07-17 | lata.b@omoikaneinnovations.com | empId=IT-EMP-0041
✅ Updated attendance: 2026-07-17 | mahesh.p@omoikaneinnovations.com | empId=GN-EMP-0018
✅ Updated attendance: 2026-07-17 | nikita.a@omoikaneinnovations.com | empId=GN-EMP-0019
🎉 Backfill complete: 47 records updated, 3 records skipped
```

## Verify It Worked

### Test 1: Initial Load
- Timesheet shows correct EMP IDs ✅

### Test 2: Regular Refresh (F5)
- EMP IDs stay correct ✅

### Test 3: Hard Refresh (Ctrl+Shift+R)
- EMP IDs stay correct ✅

### Test 4: Close Browser and Reopen
- EMP IDs stay correct ✅

## Why This Fixes It Permanently

**Before Fix:**
```
Attendance in MongoDB:
  empId: null  ❌

↓ Timesheet fetches

TimesheetService generates:
  empId: "EMP-lata."  ❌
```

**After Fix:**
```
Attendance in MongoDB:
  empId: "IT-EMP-0041"  ✅ (backfilled)

↓ Timesheet fetches

TimesheetService uses:
  empId: "IT-EMP-0041"  ✅ (from database)
```

## Future Check-Ins

The check-in process has been updated to **automatically fetch empId** from the Employee collection, so:
- ✅ New check-ins will have correct empId
- ✅ No need to run backfill again
- ✅ Will work after deployment

## Troubleshooting

### If backfill fails:
1. Check backend is running: `http://localhost:8082`
2. Check backend logs for errors
3. Verify MongoDB connection is working

### If EMP IDs still wrong after backfill:
1. Check backend logs to see how many records were updated
2. Verify Employee collection has correct employeeIds
3. Run backfill again (it's safe to run multiple times)

## Status
✅ **Run the backfill NOW** - Then refresh and test!

This is a **one-time fix** that updates all existing data.
