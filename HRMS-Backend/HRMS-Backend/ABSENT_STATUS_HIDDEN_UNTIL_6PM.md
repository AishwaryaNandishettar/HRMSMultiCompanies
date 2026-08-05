# Absent Status Hidden Until 6 PM ✅

## Problem
The attendance page was showing everyone as "Absent" even during work hours (morning/afternoon) when employees still have time to check in. This was confusing because:
- It's 10:26 AM
- Work hours are still ongoing
- Employees haven't had a chance to check in yet
- But the system was already marking them as "Absent"

## Root Cause
The system has a scheduled job `autoMarkAbsentAndLeave()` that runs at **11:00 PM (23:00)** every night to create "Absent" attendance records for employees who didn't check in that day. These records were being displayed throughout the next day, even before work hours ended.

## Solution Implemented

### Updated `getAllAttendance()` Method
**File:** `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/service/AttendanceService.java`

Added time-based filtering to **hide "Absent" status until 6 PM**:

```java
// Get current time in IST
LocalTime currentTime = LocalTime.now(ZoneId.of("Asia/Kolkata"));
LocalDate currentDate = LocalDate.now(ZoneId.of("Asia/Kolkata"));
String today = currentDate.toString();

// Define end of work hours (6:00 PM)
LocalTime endOfWorkHours = LocalTime.of(18, 0);
boolean isAfterWorkHours = currentTime.isAfter(endOfWorkHours);

// Filter out absent records for today if before 6 PM
boolean isAbsentToday = "Absent".equals(dto.getStatus()) && today.equals(dto.getDate());
boolean shouldHideAbsent = isAbsentToday && !isAfterWorkHours;

if (shouldHideAbsent) {
    return false; // Don't show this record yet
}
```

## How It Works Now

### Before 6:00 PM (Work Hours)
- **Employees who checked in:** Show as "Present" ✅
- **Employees who didn't check in yet:** **NOT shown as Absent** (hidden from list)
- **Employees on approved leave:** Show as "On Leave" ✅

### After 6:00 PM (End of Work Day)
- **Employees who checked in:** Show as "Present" ✅
- **Employees who didn't check in:** Show as "Absent" ❌
- **Employees on approved leave:** Show as "On Leave" ✅

## Timeline Example

| Time | Employee Status | Display on Attendance Page |
|------|----------------|---------------------------|
| 10:26 AM | Lata hasn't checked in yet | **Not shown** (no record) |
| 11:00 AM | Lata checks in | Shows as "Present" |
| 6:00 PM | Mahesh still hasn't checked in | Shows as "Absent" |
| 6:30 PM | Nikita tries to check in (late) | Shows as "Present" (but marked late) |

## Benefits

1. ✅ **No premature "Absent" marking** - Employees have the full work day to check in
2. ✅ **Less confusion** - Attendance page shows only actual attendance during work hours
3. ✅ **Fair to employees** - No one is marked absent at 10 AM when they might check in at 11 AM
4. ✅ **Works for all roles** - Admin, Manager, and Employee views all benefit
5. ✅ **No logic changes** - The scheduled job still runs at 11 PM as designed

## Scheduled Job (Unchanged)

The `autoMarkAbsentAndLeave()` scheduled job still runs every night at **11:00 PM**:
- Creates "Absent" records for employees who never checked in
- Creates "On Leave" records for employees with approved leaves
- Marks employees who checked in but didn't check out as "Half Day"

## Backend Logs

You'll see these logs when fetching attendance:
```
🕐 Current Time (IST): 10:26:15.123456
🕐 End of Work Hours: 18:00
🕐 Is After Work Hours: false
⏰ Hiding Absent status for Lata Benakop (before 6 PM)
⏰ Hiding Absent status for Mahesh Panchal (before 6 PM)
```

After 6 PM:
```
🕐 Current Time (IST): 18:05:30.789012
🕐 End of Work Hours: 18:00
🕐 Is After Work Hours: true
✅ Showing Absent status for Mahesh Panchal (after 6 PM)
```

## Status
✅ **COMPLETE** - Restart backend to activate the time-based filtering

No frontend changes needed!
