# Test Absent Status Timing ✅

## Quick Test Steps

### 1. Restart Backend
```bash
cd HRMS-Backend
mvn spring-boot:run
```

### 2. Test Before 6 PM (Current Time: 10:26 AM)

**Go to:** `http://localhost:5173/attendance`

**Expected Result:**
- ✅ Only employees who **already checked in** should show as "Present"
- ✅ Employees who **haven't checked in yet** should **NOT appear** in the list
- ✅ NO "Absent" status should be visible

**Example:**
- If Lata checked in → Shows as "Present"
- If Mahesh didn't check in → **NOT shown** (no record displayed)

### 3. Check Backend Logs

Look for these logs in your terminal:
```
🕐 Current Time (IST): 10:26:15.123456
🕐 End of Work Hours: 18:00
🕐 Is After Work Hours: false
⏰ Hiding Absent status for Lata Benakop (before 6 PM)
⏰ Hiding Absent status for Mahesh Panchal (before 6 PM)
```

### 4. Test Che ck-In

1. **Check in** as any employee (e.g., Lata)
2. **Refresh** the attendance page
3. **Expected:** Lata now shows as "Present"

### 5. Test After 6 PM (Optional - Change System Time)

**To test the "after 6 PM" behavior without waiting:**

**Option A: Wait until 6 PM naturally** 🕐

**Option B: Temporarily change the work hours end time in code:**

Edit `AttendanceService.java` line 295:
```java
// Change from 18:00 (6 PM) to current hour + 1 minute for testing
LocalTime endOfWorkHours = LocalTime.of(10, 27); // One minute from now
```

Then restart backend and refresh attendance page.

**Expected after "6 PM":**
- ✅ Employees who checked in → Show as "Present"
- ❌ Employees who didn't check in → Show as "Absent"

### 6. Verify for Different Roles

Test the attendance page as:
- **Admin** (Aishwarya) - Should see all employees
- **Manager** (any manager) - Should see their team
- **Employee** (any employee) - Should see their own attendance

**All roles should have the same behavior:**
- Before 6 PM: No "Absent" status for today
- After 6 PM: "Absent" status shows for those who didn't check in

## What You Should See

### Before 6 PM (Morning/Afternoon)
```
| EMP ID | NAME | STATUS |
|---------|------|--------|
| IT-0041 | Lata | Present |
| (Mahesh not shown - hasn't checked in yet)
| (Nikita not shown - hasn't checked in yet)
```

### After 6 PM (Evening)
```
| EMP ID | NAME | STATUS |
|---------|------|--------|
| IT-0041 | Lata | Present |
| GN-0018 | Mahesh | Absent |
| GN-0019 | Nikita | Absent |
```

## Troubleshooting

### If "Absent" still shows before 6 PM:
1. Check backend logs for the current time
2. Verify the timezone is set to "Asia/Kolkata"
3. Make sure you restarted the backend after the code change

### If no one shows in the attendance list:
1. Check if today's date has any attendance records in the database
2. Try checking in as one employee first
3. Check backend logs for filtering messages

## Status
✅ Ready to test! The absent status will only show after 6 PM now.
