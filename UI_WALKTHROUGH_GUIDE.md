# 🖥️ PAYROLL TESTING - UI WALKTHROUGH

## 📸 **WHAT YOU'LL SEE IN THE UI**

This guide describes exactly what each screen looks like and what to do on each page.

---

## 🏠 **SCREEN 1: UPDATE PAYROLL PAGE**

### **URL:** `http://localhost:5176/update-payroll`

### **What You'll See:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Update Payroll                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Edit Mode] [Review Mode] [🔄 Calculate All] [Save] [Cancel]   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                        PAYROLL TABLE                             │
│                                                                  │
│ COMPANY | EMP ID | NAME | DEPT | ... | BASIC | HRA | ... |NET  │
├─────────┼────────┼──────┼──────┼─────┼───────┼─────┼─────┼─────┤
│ OMOIKANE│ 2920   │Aishw.│ IT   │ ... │[50000]│20000│ ... │69800│
│ OMOIKANE│GN-18   │Mahesh│ IT   │ ... │[40000]│16000│ ... │55800│
│ OMOIKANE│GN-19   │Nikita│ IT   │ ... │[35000]│14000│ ... │46167│
├─────────┴────────┴──────┴──────┴─────┴───────┴─────┴─────┴─────┤
│                                                                  │
│ ... (more columns to the right) ...                            │
│                                                                  │
│ | PROF TAX | LOP DED | GRATUITY | [🔄 Auto Calculate] |        │
├──┼──────────┼─────────┼──────────┼─────────────────────┤        │
│  │  [200]   │  [0]    │  [0]     │     [Button]        │        │
└─────────────────────────────────────────────────────────────────┘
```

### **What to Do:**

1. **Find the employee row** (e.g., Mahesh in row 2)
2. **Click in the input boxes** under these columns:
   - Basic → Enter `40000`
   - HRA → Enter `16000`
   - Allowance → Enter `5000`
   - Conveyance → Enter `2000`
   - PF → Enter `4800`
   - Tax → Enter `3000`
   - Professional Tax → Enter `200`

3. **Notice:** Gross and Net columns update automatically as you type!

4. **Scroll right** to see more columns including "🔄 Auto Calculate" button

---

## 📅 **SCREEN 2: ATTENDANCE PAGE**

### **URL:** `http://localhost:5176/attendance`

### **What You'll See:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Attendance Management                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Select Date: [📅 2026-07-01]    User: Mahesh (employee)       │
│                                                                  │
│  [Check In] [Check Out] [Work From Home] [Export ▾]            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  From: [📅 Start] To: [📅 End]  Search: [🔍 ________]          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                     ATTENDANCE TABLE                             │
│                                                                  │
│ EMP ID | NAME   | DEPT | DATE     | CHECK-IN | CHECK-OUT | ... │
├────────┼────────┼──────┼──────────┼──────────┼───────────┼─────┤
│ GN-18  │ Mahesh │ IT   │2026-07-01│  09:00   │  18:00    │ ... │
│ GN-18  │ Mahesh │ IT   │2026-07-02│  10:30   │  18:00    │ ... │
│ GN-18  │ Mahesh │ IT   │2026-07-03│  09:00   │  18:00    │ ... │
├────────┴────────┴──────┴──────────┴──────────┴───────────┴─────┤
│                                                                  │
│ ... | TOTAL HOURS | LATE | STATUS | TYPE | [ACTIONS] |         │
├─────┼─────────────┼──────┼────────┼──────┼───────────┤         │
│ ... │   9h 0m 0s  │  No  │Present │Office│           │         │
│ ... │   7h 30m 0s │  Yes │Present │Office│           │         │
│ ... │   9h 0m 0s  │  No  │Present │Office│           │         │
└─────────────────────────────────────────────────────────────────┘
```

### **What to Do:**

1. **Select today's date** using the date picker
2. **Click "Check In"** button
   - Browser asks for location → Click "Allow"
   - Alert pops up: "Check-in successful"
   - Table refreshes with new record

3. **Later in the day:**
   - Select the same date
   - Click "Check Out" button
   - Check-out time recorded

4. **Repeat for multiple days:**
   - Change date to July 2
   - Click "Check In" (after 10 AM for late arrival)
   - Click "Check Out"
   - Continue for 8-10 days

5. **Verify in table:**
   - See all your check-ins
   - "Late" column shows "Yes" if after 10 AM
   - "Status" shows "Present" or "Absent"

---

## 🧮 **SCREEN 3: AUTO-CALCULATE MODAL**

### **What You'll See After Clicking "🔄 Auto Calculate":**

```
┌─────────────────────────────────────────────────────────────────┐
│  SALARY CALCULATION RESULT                                  [X] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Employee: Mahesh Panchal                                       │
│  Employee ID: GN-EMP-0018                                       │
│  Department: IT                                                 │
│  Month: July-2026                                               │
│                                                                  │
│  ═════════════════════════════════════════════════════════════  │
│  📊 ATTENDANCE SUMMARY                                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Working Days:        30                                        │
│  Present Days:        28                                        │
│  Absent Days:         2                                         │
│  Attendance %:        93.33%                                    │
│  Late Arrivals:       2                                         │
│  LOP Days:            0                                         │
│                                                                  │
│  ═════════════════════════════════════════════════════════════  │
│  💰 EARNINGS                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Basic Salary             ₹40,000.00                            │
│  HRA                      ₹16,000.00                            │
│  Allowance                ₹5,000.00                             │
│  Conveyance               ₹2,000.00                             │
│  Variable Salary          ₹0.00                                 │
│  Incentive                ₹0.00                                 │
│  Bonus                    ₹0.00                                 │
│                                                                  │
│  🎁 Attendance Bonus      ₹1,000.00  ⬅ Auto-calculated         │
│  ⚡ Performance Bonus     ₹0.00                                 │
│  ⏰ Overtime Pay          ₹0.00                                 │
│  ─────────────────────────────────────────────────────────────  │
│  GROSS SALARY             ₹64,000.00                            │
│                                                                  │
│  ═════════════════════════════════════════════════════════════  │
│  📉 DEDUCTIONS                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  PF                       ₹4,800.00                             │
│  ESI                      ₹0.00                                 │
│  Tax                      ₹3,000.00                             │
│  Professional Tax         ₹200.00                               │
│  Other Deduction          ₹0.00                                 │
│                                                                  │
│  ⚠️ Late Deduction        ₹200.00  ⬅ Auto-calculated (2 late)  │
│  📅 LOP Deduction         ₹0.00                                 │
│  ─────────────────────────────────────────────────────────────  │
│  TOTAL DEDUCTIONS         ₹8,200.00                             │
│                                                                  │
│  ═════════════════════════════════════════════════════════════  │
│  💵 NET SALARY            ₹55,800.00                            │
│  ═════════════════════════════════════════════════════════════  │
│                                                                  │
│  Calculation Mode: AUTO                                         │
│  Calculated At: July 14, 2026 10:30:15 AM                      │
│                                                                  │
│  [Apply to Payroll]  [Preview Only]  [Close]                   │
└─────────────────────────────────────────────────────────────────┘
```

### **What to Do:**

1. **Review the data:**
   - Check attendance % matches your records
   - Verify attendance bonus is correct
   - Confirm late deduction (₹100 per late arrival)
   - Check LOP deduction if applicable

2. **Click "Apply to Payroll"** if everything looks good
   - Modal closes
   - Table updates with new values
   - Gross and Net columns show calculated amounts

3. **Or click "Close"** to cancel without applying

---

## 💾 **SCREEN 4: AFTER SAVE PAYROLL**

### **What You'll See After Clicking "Save Payroll":**

```
┌─────────────────────────────────────────────────────────────────┐
│  ✅ Payroll Saved Successfully!                                 │
└─────────────────────────────────────────────────────────────────┘

Redirecting to Payroll page...
```

### **Then You'll See:**

```
┌─────────────────────────────────────────────────────────────────┐
│  Payroll Management                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Initiate Payroll] [Process Payroll] [Update Payroll]         │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                     PAYROLL TABLE                                │
│                                                                  │
│ EMP ID | NAME    | DEPT | BASIC  | GROSS  | NET    | STATUS   │
├────────┼─────────┼──────┼────────┼────────┼────────┼──────────┤
│ 2920   │Aishwarya│ IT   │50,000  │80,000  │69,800  │ Active   │
│ GN-18  │Mahesh   │ IT   │40,000  │64,000  │55,800  │ Active   │
│ GN-19  │Nikita   │ IT   │35,000  │55,500  │46,167  │ Active   │
└────────┴─────────┴──────┴────────┴────────┴────────┴──────────┘
```

### **What to Verify:**

✅ **Check these values:**
- Aishwarya's Net: ₹69,800
- Mahesh's Net: ₹55,800
- Nikita's Net: ₹46,167

✅ **All employees show:**
- Status: "Active"
- Correct Gross amounts
- Correct Net amounts

---

## 📊 **SCREEN 5: BULK CALCULATE MODAL**

### **What You'll See After Clicking "🔄 Calculate All Salaries":**

```
┌─────────────────────────────────────────────────────────────────┐
│  🔄 BULK SALARY CALCULATION RESULTS                        [X]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ Successfully calculated 3 salaries                          │
│  Review the results below and click "Apply All" to save        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                     RESULTS TABLE                                │
│                                                                  │
│ EMPLOYEE        │ GROSS      │ DEDUCTIONS │ NET SALARY │STATUS │
├─────────────────┼────────────┼────────────┼────────────┼───────┤
│ Aishwarya       │            │            │            │       │
│ (2920)          │ ₹80,000    │ ₹10,200    │ ₹69,800    │  ✓    │
│                 │            │            │            │       │
│ Mahesh Panchal  │            │            │            │       │
│ (GN-EMP-0018)   │ ₹64,000    │ ₹8,200     │ ₹55,800    │  ✓    │
│                 │            │            │            │       │
│ Nikita          │            │            │            │       │
│ (GN-EMP-0019)   │ ₹55,500    │ ₹9,333     │ ₹46,167    │  ✓    │
└─────────────────┴────────────┴────────────┴────────────┴───────┘
│                                                                  │
│  [Apply All]  [Download Report]  [Close]                        │
└─────────────────────────────────────────────────────────────────┘
```

### **What to Do:**

1. **Review all results** in the table
2. **Click "Apply All"** to save all calculations at once
3. **Or click individual rows** to see detailed breakdown
4. **Click "Download Report"** to export results

---

## 🎯 **KEY UI ELEMENTS**

### **Buttons You'll Use:**

| Button | Location | Action |
|--------|----------|--------|
| **[Edit Mode]** | Update Payroll page | Enable editing of salary fields |
| **[Review Mode]** | Update Payroll page | Disable editing, view only |
| **[🔄 Calculate All]** | Update Payroll page | Bulk calculate all employees |
| **[🔄 Auto Calculate]** | In each employee row | Calculate single employee |
| **[Save Payroll]** | Update Payroll page | Save all changes to database |
| **[Check In]** | Attendance page | Mark check-in for selected date |
| **[Check Out]** | Attendance page | Mark check-out for selected date |
| **[Work From Home]** | Attendance page | Mark WFH for selected date |
| **[Apply to Payroll]** | Calculation modal | Save calculated values |
| **[Apply All]** | Bulk calculation modal | Save all calculations |

### **Input Fields You'll Fill:**

| Field | Where | Example Value |
|-------|-------|---------------|
| **Basic** | Update Payroll | 40000 |
| **HRA** | Update Payroll | 16000 |
| **Allowance** | Update Payroll | 5000 |
| **Conveyance** | Update Payroll | 2000 |
| **PF** | Update Payroll | 4800 |
| **Tax** | Update Payroll | 3000 |
| **Professional Tax** | Update Payroll | 200 |
| **Date** | Attendance | 2026-07-01 |

### **Colors & Indicators:**

| Color | Meaning | Example |
|-------|---------|---------|
| 🟢 Green | Success / Active | "Status: Active" |
| 🔴 Red | Alert / Deduction | Late Deduction: ₹200 |
| 🟡 Yellow | Warning / Pending | "Pending Approval" |
| 🔵 Blue | Info / Bonus | Attendance Bonus: ₹1,000 |
| ⚪ Gray | Disabled / Read-only | Gratuity field |

---

## 📝 **UI NAVIGATION FLOW**

```
1. Login (http://localhost:5176/login)
   │
   ├─ Enter credentials
   └─ Click "Login"
        │
        ▼
2. Home Page (http://localhost:5176/home)
   │
   ├─ See dashboard
   └─ Click "Attendance" in sidebar
        │
        ▼
3. Attendance Page (http://localhost:5176/attendance)
   │
   ├─ Select date
   ├─ Click "Check In"
   ├─ Click "Check Out"
   └─ Repeat for multiple days
        │
        ▼
4. Click "Payroll" in sidebar
        │
        ▼
5. Payroll Page (http://localhost:5176/payroll)
   │
   └─ Click "Update Payroll" button
        │
        ▼
6. Update Payroll Page (http://localhost:5176/update-payroll)
   │
   ├─ Enter base salaries
   ├─ Click "Auto Calculate" per employee
   ├─ OR click "Calculate All Salaries"
   ├─ Review modal
   ├─ Click "Apply"
   └─ Click "Save Payroll"
        │
        ▼
7. Back to Payroll Page
   │
   └─ Verify net salaries ✅
```

---

## 🎨 **VISUAL INDICATORS**

### **In Attendance Table:**

| Icon/Color | Meaning |
|-----------|---------|
| ✅ Green row | Present |
| ❌ Red row | Absent |
| ⚠️ Yellow badge | Late arrival |
| 🏠 Blue badge | Work From Home |
| - (dash) | No data |

### **In Payroll Table:**

| Icon/Color | Meaning |
|-----------|---------|
| ✨ Sparkle | Auto-calculated value |
| 🔒 Lock | Read-only field |
| 📝 Editable | Can be changed |
| ✅ Green | Active employee |
| ⚪ Gray | Inactive employee |

---

## 🐛 **COMMON UI ISSUES**

### **Issue: Buttons are grayed out**
**Reason:** Not in Edit Mode  
**Fix:** Click "[Edit Mode]" button at top

### **Issue: Can't see "Auto Calculate" button**
**Reason:** Need to scroll right in table  
**Fix:** Use horizontal scrollbar at bottom of table

### **Issue: Modal doesn't close**
**Reason:** Need to click specific button  
**Fix:** Click "Close" or [X] at top right

### **Issue: Values don't update**
**Reason:** Need to apply first  
**Fix:** Click "Apply to Payroll" before "Save Payroll"

---

## ✅ **SUCCESS CHECKLIST**

After completing all steps, you should see:

- [ ] ✅ All 3 employees have base salaries entered
- [ ] ✅ Attendance table shows 8-10 days per employee
- [ ] ✅ Some late arrivals marked (check "Late" column)
- [ ] ✅ Auto-calculate modal opens with data
- [ ] ✅ Attendance % shown in modal
- [ ] ✅ Bonuses and deductions calculated
- [ ] ✅ Net salary displayed
- [ ] ✅ Values applied to payroll table
- [ ] ✅ Payroll saved successfully
- [ ] ✅ Payroll page shows correct net amounts

**If all boxes checked → Testing Complete! 🎉**

---

**This UI walkthrough ensures you know exactly what to see and do at each step!**
