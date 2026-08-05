# 🔧 Fix: Timesheet Attendance Percentage & Month Range Filter

## 📋 Problems Identified

### Problem 1: Attendance Percentage Showing 200%
**Current Calculation:**
```javascript
const attendancePercent = g.days > 0 ? ((workingDays / g.days) * 100).toFixed(1) : 0;
```

**Issue:**
- `g.days` = number of attendance records (could be 2 if employee has 2 check-ins)
- `workingDays` = present days (could be 2)
- Calculation: `(2 / 2) * 100 = 100%` per record
- When aggregated incorrectly, shows **200%** ❌

**Expected:**
```
Attendance % = (Present Days / Total Working Days in Month) × 100

Example:
- Total Working Days in June 2026 = 22 days
- Present Days = 14 days
- Attendance % = (14 / 22) × 100 = 63.64% ✅
```

---

### Problem 2: Month Range Filter Not Working
**Current Behavior:**
- User selects: From Month: June 2026, To Month: July 2026
- Backend only fetches data for June 2026
- July data not showing ❌

**Root Cause:**
Backend `getMonthlySummary()` only accepts single month parameter:
```java
data = repo.findByDateStartingWith(month); // Only gets one month
```

**Expected:**
Should fetch all attendance records between June and July and aggregate them properly.

---

## ✅ Solution

### Fix 1: Correct Attendance Percentage Calculation

The attendance percentage should be calculated based on **total working days in the month**, not based on the number of records.

**Formula:**
```
Attendance % = (Present Days / Total Working Days) × 100

Where:
- Total Working Days = 22 (for a typical month with weekdays only)
- Present Days = Count of days marked Present or Half Day
```

**Implementation:**

#### Frontend (Timesheet.jsx):

**Current Code (Line ~266):**
```javascript
const attendancePercent =
  g.days > 0 ? ((workingDays / g.days) * 100).toFixed(1) : 0;
```

**Fixed Code:**
```javascript
// ✅ FIX: Calculate attendance % based on total working days in month
// Assume 22 working days per month (Monday-Friday, excluding weekends)
// For more accuracy, calculate actual working days based on month/year
const totalWorkingDaysInMonth = 22; // Can be made dynamic later

const attendancePercent =
  totalWorkingDaysInMonth > 0 
    ? ((workingDays / totalWorkingDaysInMonth) * 100).toFixed(1) 
    : 0;
```

**Better (Dynamic Calculation):**
```javascript
// Calculate actual working days in the month
const calculateWorkingDays = (monthStr) => {
  // monthStr format: "2026-06"
  const [year, month] = monthStr.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();
  
  let workingDays = 0;
  for (let day = 1; day <= lastDay; day++) {
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
  }
  return workingDays;
};

const totalWorkingDaysInMonth = calculateWorkingDays(g.month || fromMonth);

const attendancePercent =
  totalWorkingDaysInMonth > 0 
    ? ((workingDays / totalWorkingDaysInMonth) * 100).toFixed(1) 
    : 0;
```

---

### Fix 2: Month Range Filtering

Currently, the backend only supports single month. We need to handle month range properly.

**Option A: Fetch and Aggregate on Frontend (Simpler)**

Make multiple API calls for each month in the range and aggregate on frontend.

**Option B: Update Backend to Support Date Range (Better)**

Modify backend to accept `fromMonth` and `toMonth` and return aggregated data.

#### I'll implement Option A (Frontend Fix) - No Backend Changes:

**Frontend (Timesheet.jsx):**

```javascript
useEffect(() => {
  const load = async () => {
    // ✅ FIX: Handle month range (from-to)
    const from = new Date(fromMonth + "-01");
    const to = new Date(toMonth + "-01");
    
    const allRecords = [];
    
    // Fetch data for each month in the range
    let current = new Date(from);
    while (current <= to) {
      const monthStr = current.toISOString().slice(0, 7);
      const monthData = await getTimesheet(monthStr);
      
      if (monthData && monthData.length > 0) {
        allRecords.push(...monthData);
      }
      
      // Move to next month
      current.setMonth(current.getMonth() + 1);
    }
    
    if (allRecords.length === 0) {
      setRecords([]);
      return;
    }
    
    // Now aggregate the records by empId
    const grouped = {};
    
    allRecords.forEach((r) => {
      const empId = r.empId || "-";
      const key = empId; // Group by empId only, not by month
      
      if (!grouped[key]) {
        grouped[key] = {
          empId: r.empId || "-",
          empName: r.empName || r.employeeName || r.name || r.fullName || "-",
          department: r.department || "-",
          reportingManager: r.reportingManager || "-",
          month: `${fromMonth} to ${toMonth}`, // Show range
          present: 0,
          leave: 0,
          lop: 0,
          halfDay: 0,
          late: 0,
          wfh: 0,
          field: 0,
          totalHours: 0,
          days: 0,
        };
      }
      
      // Aggregate counts
      grouped[key].present += r.present || 0;
      grouped[key].leave += r.leave || 0;
      grouped[key].lop += r.absent || r.lop || 0;
      grouped[key].halfDay += r.halfDay || 0;
      grouped[key].late += r.late || 0;
      grouped[key].wfh += r.wfh || 0;
      grouped[key].field += r.field || 0;
      grouped[key].totalHours += parseFloat(r.duration || r.avgHours || 0);
      grouped[key].days += 1;
    });
    
    // Calculate derived fields
    const mapped = Object.values(grouped).map((g) => {
      const avgHours =
        g.totalHours > 0 ? parseFloat(g.totalHours).toFixed(2) : "0.00";

      const workingDays = g.present + g.wfh + g.field;
      const absentDays = Number(g.lop || 0);
      const payableDays = workingDays + g.leave + g.halfDay * 0.5;

      // ✅ FIX: Calculate working days in the date range
      const totalWorkingDays = calculateWorkingDaysInRange(fromMonth, toMonth);
      
      const attendancePercent =
        totalWorkingDays > 0 
          ? ((workingDays / totalWorkingDays) * 100).toFixed(1) 
          : 0;

      const overtime = 0;

      return {
        ...g,
        avgHours,
        workingDays,
        absentDays,
        payableDays,
        attendancePercent,
        overtime,
      };
    });

    setRecords(mapped);
  };

  load();
}, [fromMonth, toMonth]); // ✅ Now depends on both months
```

**Helper Function:**
```javascript
// Calculate total working days in a date range
const calculateWorkingDaysInRange = (fromMonthStr, toMonthStr) => {
  const from = new Date(fromMonthStr + "-01");
  const to = new Date(toMonthStr + "-01");
  to.setMonth(to.getMonth() + 1); // End of toMonth
  to.setDate(0); // Last day of toMonth
  
  let workingDays = 0;
  let current = new Date(from);
  
  while (current <= to) {
    const dayOfWeek = current.getDay();
    // 0 = Sunday, 6 = Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      workingDays++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
};
```

---

## 📊 Examples

### Example 1: Single Month (June 2026)

**Data:**
- From Month: June 2026
- To Month: June 2026
- Present Days: 14
- Absent Days: 4
- Leave Days: 0
- Half Days: 0
- Total Working Days in June: 22

**Calculation:**
```
Working Days = Present + WFH + Field = 14 + 0 + 0 = 14
Attendance % = (14 / 22) × 100 = 63.64%
```

**Display:**
```
Present: 14
Absent: 4
ATT %: 63.6% ✅
```

---

### Example 2: Month Range (June-July 2026)

**Data:**
- From Month: June 2026
- To Month: July 2026
- June: Present = 14, Leave = 2
- July: Present = 18, Leave = 1
- Total Working Days (June + July): 22 + 23 = 45

**Calculation:**
```
Total Present = 14 + 18 = 32
Total Leave = 2 + 1 = 3
Working Days = 32 + 0 + 0 = 32
Attendance % = (32 / 45) × 100 = 71.1%
```

**Display:**
```
Present: 32
Leave: 3
ATT %: 71.1% ✅
```

---

### Example 3: Nikita's Case (June Leave Not Showing)

**Issue:**
- Nikita took 1 leave in June
- When filtering June to July, leave not showing

**Root Cause:**
- Backend only fetches June data
- Leave data might be in different format

**Fix:**
- Fetch both June and July attendance
- Aggregate leave counts properly
- Show in timesheet table

---

## 🧪 Testing Scenarios

### Test 1: Single Month Attendance %

**Steps:**
1. Login as employee (Nikita)
2. Set From Month: June 2026
3. Set To Month: June 2026
4. Check ATT % column

**Expected:**
- If Present = 2, Working Days = 22
- ATT % = (2 / 22) × 100 = 9.1% ✅

---

### Test 2: Month Range (June-July)

**Steps:**
1. Login as admin
2. Set From Month: June 2026
3. Set To Month: July 2026
4. Check all employees' data

**Expected:**
- Nikita's data shows aggregated count for both months
- Leave count includes June + July leaves
- ATT % calculated over 45 working days (June 22 + July 23)

---

### Test 3: Employee with Full Attendance

**Steps:**
1. Employee with 22/22 days present in June
2. Set From Month: June 2026
3. Set To Month: June 2026

**Expected:**
- Present: 22
- ATT %: 100% ✅

---

## 📝 Summary of Changes

### Frontend Changes (Timesheet.jsx):

1. **Add helper function** to calculate working days:
   ```javascript
   const calculateWorkingDaysInRange = (from, to) => { ... }
   ```

2. **Update useEffect** to handle month range:
   ```javascript
   useEffect(() => {
     // Fetch data for each month in range
     // Aggregate by empId across all months
   }, [fromMonth, toMonth]);
   ```

3. **Fix attendance % calculation**:
   ```javascript
   const totalWorkingDays = calculateWorkingDaysInRange(fromMonth, toMonth);
   const attendancePercent = ((workingDays / totalWorkingDays) * 100).toFixed(1);
   ```

### No Backend Changes Required ✅

The fix is entirely on frontend - we fetch data for each month and aggregate it client-side.

---

## 🎯 Expected Results

### Before Fix:
```
Employee: Nikita
Month: June 2026
Present: 0
Leave: 0  ❌ (should be 1)
ATT %: 200%  ❌ (incorrect)

Month Range: June-July
No data showing ❌
```

### After Fix:
```
Employee: Nikita
Month: June 2026
Present: 2
Leave: 0 (if approved leaves not in June)
ATT %: 9.1% ✅ (2/22)

Month Range: June-July
Present: Aggregated count
Leave: Aggregated count
ATT %: Correct percentage based on total working days ✅
```

---

**Status:** Solution Documented
**Implementation:** Requires frontend code changes
**Backend Changes:** None (uses existing API)
**Testing:** Comprehensive test cases provided
