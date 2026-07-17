# Timesheet EMP ID from Attendance ✅

## Problem
The Timesheet page was showing incorrect EMP IDs that didn't match the actual employee IDs:

| Employee | Shown in Timesheet | Correct EMP ID |
|----------|-------------------|----------------|
| Aishwarya | **EMP-Aishw** ❌ | IT-EMP-0041 |
| Lata | **EMP-lata.** ❌ | IT-EMP-0041 |
| Mahesh | **EMP-mahes** ❌ | GN-EMP-0018 |
| Nikita | **EMP-nikt** ❌ | GN-EMP-0019 |
| Unknown | **UNKNOWN** ❌ | (actual employee) |

## Root Cause

The Timesheet service was generating EMP IDs from the **email prefix** when the User.employeeId field was blank:

```java
String empId = u.getEmployeeId();
if (empId == null || empId.isBlank()) {
    // ❌ WRONG: Generates "EMP-Aishw" from "Aishwarya@company.com"
    empId = "EMP-" + u.getEmail().substring(0, Math.min(5, u.getEmail().indexOf("@")));
}
```

But the **Attendance records** already have the correct EMP IDs stored (like "IT-EMP-0041", "GN-EMP-0018", etc.) because they were set during check-in.

## Solution Implemented

### Updated Data Source Priority
**File:** `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/service/TimesheetService.java`

Changed the timesheet service to **prioritize data from Attendance records** first:

```java
// ✅ PRIORITY 1: Use empId from Attendance record (most reliable)
String empId = r.getEmpId();

// ✅ PRIORITY 2: If Attendance doesn't have empId, get from User
if (empId == null || empId.isBlank() || empId.equals("-")) {
    User u = userRepo.findByEmail(r.getUserId()).orElse(null);
    if (u != null) {
        empId = u.getEmployeeId();
    }
}

// ✅ PRIORITY 3: Last resort fallback
if (empId == null || empId.isBlank()) {
    empId = "EMP-" + email_prefix;
}
```

### Data Flow

**Before (Broken):**
```
Timesheet ← User.employeeId (blank) → Generated "EMP-Aishw"
```

**After (Fixed):**
```
Timesheet ← Attendance.empId (correct) → "IT-EMP-0041" ✅
          ← User.employeeId (fallback)
          ← Generated (last resort)
```

## How It Works

### Step 1: Check Attendance Record First
```java
String empId = r.getEmpId(); // Gets "IT-EMP-0041" from Attendance
```

### Step 2: Fallback to User if Needed
```java
if (empId == null || empId.isBlank()) {
    User u = userRepo.findByEmail(r.getUserId()).orElse(null);
    empId = u.getEmployeeId(); // Use User.employeeId if available
}
```

### Step 3: Last Resort Generation
```java
if (empId == null || empId.isBlank()) {
    empId = "EMP-" + u.getEmail().substring(0, 5); // Only if nothing else works
}
```

## Benefits

1. ✅ **Uses correct EMP IDs** from Attendance (IT-EMP-0041, GN-EMP-0018, etc.)
2. ✅ **No more generated IDs** like "EMP-Aishw", "EMP-lata."
3. ✅ **Same EMP IDs** across Attendance and Timesheet pages
4. ✅ **No "UNKNOWN" rows** - uses actual attendance data
5. ✅ **Works for all fields** - empId, name, department, manager all from Attendance first

## Testing Steps

### 1. Restart Backend
```bash
cd HRMS-Backend
mvn spring-boot:run
```

### 2. Check Timesheet Page

**Go to:** `http://localhost:5173/timesheet`

**Expected Results:**

| Employee | EMP ID (Before) | EMP ID (After) |
|----------|----------------|----------------|
| Aishwarya | EMP-Aishw ❌ | IT-EMP-0041 ✅ |
| Lata | EMP-lata. ❌ | IT-EMP-0041 ✅ |
| Mahesh | EMP-mahes ❌ | GN-EMP-0018 ✅ |
| Nikita | EMP-nikt ❌ | GN-EMP-0019 ✅ |

### 3. Check Backend Logs

Look for these logs:
```
✅ Timesheet: Set empId=IT-EMP-0041 for userId=Aishwarya@company.com
✅ Timesheet: Set empId=IT-EMP-0041 for userId=lata.b@omoikaneinnovations.com
✅ Timesheet: Set empId=GN-EMP-0018 for userId=mahesh.p@omoikaneinnovations.com
✅ Timesheet: Set empId=GN-EMP-0019 for userId=nikita.a@omoikaneinnovations.com
```

### 4. Verify Consistency

**Check Attendance Page:**
- Lata → IT-EMP-0041

**Check Timesheet Page:**
- Lata → IT-EMP-0041 (same as Attendance) ✅

**Check Employee Directory:**
- Lata → IT-EMP-0041 (same everywhere) ✅

## Data Consistency

### Attendance Record Structure
```json
{
  "userId": "lata.b@omoikaneinnovations.com",
  "empId": "IT-EMP-0041",  // ← Timesheet now uses this
  "name": "Lata Benakop",
  "department": "IT",
  "reportingManager": "Padmanabh"
}
```

### Timesheet Summary Output
```json
{
  "empId": "IT-EMP-0041",  // ✅ Pulled from Attendance
  "empName": "Lata Benakop",
  "department": "IT",
  "reportingManager": "Padmanabh",
  "present": 6,
  "month": "2026-07"
}
```

## Why This Works

1. **Attendance records are created during check-in** with correct EMP IDs
2. **Timesheet aggregates attendance records** by userId and month
3. **Timesheet now reads empId directly from Attendance** instead of generating it
4. **Fallback to User collection** only if Attendance doesn't have empId
5. **Generation only as last resort** (should rarely happen)

## Status
✅ **COMPLETE** - Timesheet now shows correct EMP IDs from Attendance records

No frontend changes needed! Just restart the backend.
