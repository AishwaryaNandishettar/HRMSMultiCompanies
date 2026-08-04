# 🔄 PAYROLL SYSTEM FLOW DIAGRAM

## 📊 **COMPLETE PAYROLL CALCULATION FLOW**

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│                    PAYROLL TESTING WORKFLOW                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │  START   │
                              └────┬─────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Step 1: SET BASE SALARIES   │
                    │  (Update Payroll Page)       │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  Enter for each employee:    │
                    │  • Basic Salary              │
                    │  • HRA                       │
                    │  • Allowances                │
                    │  • PF, Tax, etc.             │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Step 2: MARK ATTENDANCE     │
                    │  (Attendance Page)           │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────▼───────────────┐
                    │  For each working day:       │
                    │  • Check In (time recorded)  │
                    │  • Check Out (hours calc)    │
                    │  • Create variety (late/abs) │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  Step 3: AUTO-CALCULATE      │
                    │  (Update Payroll Page)       │
                    └──────────────┬───────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  │                                  │
                  ▼                                  ▼
     ┌────────────────────────┐      ┌────────────────────────┐
     │  Individual Calculate  │      │  Bulk Calculate All    │
     │  (per employee)        │      │  (all employees)       │
     └────────────┬───────────┘      └────────────┬───────────┘
                  │                                  │
                  └────────────────┬─────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │  SYSTEM FETCHES DATA         │
                    └──────────────┬───────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            │                      │                      │
            ▼                      ▼                      ▼
   ┌────────────────┐    ┌─────────────────┐   ┌────────────────┐
   │ Base Salary    │    │ Attendance      │   │ Leave Records  │
   │ Components     │    │ Records         │   │ (LOP)          │
   │ (from Payroll) │    │ (from Attend.)  │   │ (from Leaves)  │
   └────────┬───────┘    └────────┬────────┘   └────────┬───────┘
            │                     │                      │
            └──────────────────┬──┴──────────────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │  SYSTEM CALCULATES           │
                └──────────────┬───────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌──────────────────┐   ┌────────────────┐
│ Attendance %  │    │ Attendance Bonus │   │ Late Deduction │
│ (Present/Total│    │ (₹0-₹2000)       │   │ (₹100 × late)  │
│  days)        │    │                  │   │                │
└───────┬───────┘    └────────┬─────────┘   └────────┬───────┘
        │                     │                      │
        │                     ▼                      ▼
        │            ┌──────────────────┐   ┌────────────────┐
        │            │ LOP Deduction    │   │ Overtime Pay   │
        │            │ (Daily×LOP days) │   │ (1.5× rate)    │
        │            └────────┬─────────┘   └────────┬───────┘
        │                     │                      │
        └─────────────────────┴──────────────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │  CALCULATE TOTALS            │
                └──────────────┬───────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
        ┌───────────────────┐   ┌────────────────────┐
        │ GROSS SALARY      │   │ TOTAL DEDUCTIONS   │
        │ = Base + Bonuses  │   │ = PF + Tax + Late  │
        │   + Overtime      │   │   + LOP + Others   │
        └─────────┬─────────┘   └──────────┬─────────┘
                  │                        │
                  └───────────┬────────────┘
                              │
                              ▼
                ┌──────────────────────────────┐
                │  NET SALARY                  │
                │  = Gross - Deductions        │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │  DISPLAY MODAL               │
                │  • Show all components       │
                │  • Show attendance summary   │
                │  • Show breakdown            │
                └──────────────┬───────────────┘
                               │
                               ▼
                ┌──────────────────────────────┐
                │  USER REVIEWS                │
                │  ✓ Check calculations        │
                │  ✓ Verify amounts            │
                └──────────────┬───────────────┘
                               │
                      ┌────────┴────────┐
                      │                 │
                      ▼                 ▼
           ┌──────────────┐    ┌────────────────┐
           │ Apply to     │    │ Close Modal    │
           │ Payroll      │    │ (Don't save)   │
           └──────┬───────┘    └────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │ UPDATE PAYROLL DB   │
        │ • Save calculated   │
        │   values            │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ SAVE PAYROLL        │
        │ (Final Save)        │
        └──────────┬──────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │ VIEW IN PAYROLL     │
        │ TABLE               │
        └──────────┬──────────┘
                   │
                   ▼
              ┌─────────┐
              │  DONE   │
              └─────────┘
```

---

## 📊 **DATA FLOW DIAGRAM**

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA SOURCES & FLOW                         │
└─────────────────────────────────────────────────────────────────┘

   DATABASE TABLES                  CALCULATION SERVICE
   ===============                  ===================

┌──────────────────┐              ┌────────────────────┐
│  USERS TABLE     │──────────────▶│ SalaryCalculation  │
│  • Employee ID   │              │ Service            │
│  • Name          │              │                    │
│  • Department    │              │ • Gets user data   │
│  • Manager       │              │ • Fetches payroll  │
└──────────────────┘              │ • Calls attendance │
                                  │ • Calls leave      │
┌──────────────────┐              │ • Calculates all   │
│  PAYROLL TABLE   │──────────────▶│                    │
│  • Basic         │              └─────────┬──────────┘
│  • HRA           │                        │
│  • Allowances    │                        │
│  • PF, Tax       │              ┌─────────▼──────────┐
└──────────────────┘              │  INTEGRATION       │
                                  │  SERVICES          │
┌──────────────────┐              ├────────────────────┤
│  ATTENDANCE      │──────────────▶│ Attendance         │
│  TABLE           │              │ Integration        │
│  • Date          │              │ • Count present    │
│  • Check-in      │              │ • Calc percentage  │
│  • Check-out     │              │ • Count late       │
│  • Late flag     │              │ • Calc overtime    │
└──────────────────┘              └─────────┬──────────┘
                                            │
┌──────────────────┐              ┌─────────▼──────────┐
│  LEAVE TABLE     │──────────────▶│ Leave Integration  │
│  • Leave type    │              │ • Count LOP days   │
│  • Start date    │              │ • Calc LOP amount  │
│  • End date      │              └─────────┬──────────┘
│  • LOP flag      │                        │
└──────────────────┘              ┌─────────▼──────────┐
                                  │ Performance        │
┌──────────────────┐              │ Integration        │
│  PERFORMANCE     │──────────────▶│ • Get rating       │
│  TABLE           │              │ • Calc bonus       │
│  • Rating        │              └─────────┬──────────┘
│  • Goals         │                        │
└──────────────────┘                        │
                                            │
                                  ┌─────────▼──────────┐
                                  │ CALCULATION RESULT │
                                  ├────────────────────┤
                                  │ • Gross Salary     │
                                  │ • Deductions       │
                                  │ • Net Salary       │
                                  │ • Breakdown        │
                                  └─────────┬──────────┘
                                            │
                                            ▼
                                  ┌────────────────────┐
                                  │ FRONTEND MODAL     │
                                  │ • Display result   │
                                  │ • User review      │
                                  │ • Apply/Close      │
                                  └────────────────────┘
```

---

## 🧮 **CALCULATION STEPS**

```
STEP-BY-STEP CALCULATION FLOW
══════════════════════════════

1. FETCH BASE SALARY
   ├─ Basic Salary: ₹40,000
   ├─ HRA: ₹16,000
   ├─ Allowance: ₹5,000
   └─ Conveyance: ₹2,000

2. FETCH ATTENDANCE DATA
   ├─ Query: SELECT * FROM attendance WHERE userId='xxx' AND month='July-2026'
   ├─ Count present days: 28
   ├─ Count late arrivals: 2
   └─ Calculate %: 28/30 = 93.33%

3. APPLY ATTENDANCE RULES
   ├─ IF attendance >= 98% → Bonus = ₹2,000
   ├─ ELSE IF >= 95% → Bonus = ₹1,500
   ├─ ELSE IF >= 90% → Bonus = ₹1,000 ✓ (93.33% matches)
   ├─ ELSE IF >= 85% → Bonus = ₹500
   └─ ELSE → Bonus = ₹0

4. CALCULATE LATE DEDUCTION
   ├─ Late arrivals: 2
   └─ Deduction: 2 × ₹100 = ₹200

5. FETCH LEAVE DATA
   ├─ Query: SELECT * FROM leaves WHERE userId='xxx' AND month='July-2026'
   ├─ Count LOP days: 0
   └─ LOP Deduction: 0 × (₹40,000/30) = ₹0

6. CALCULATE OVERTIME
   ├─ Total minutes worked: 13,440 (28 days × 8 hours)
   ├─ Expected minutes: 13,440
   ├─ Overtime minutes: 0
   └─ Overtime pay: ₹0

7. SUM EARNINGS
   ├─ Basic: ₹40,000
   ├─ HRA: ₹16,000
   ├─ Allowance: ₹5,000
   ├─ Conveyance: ₹2,000
   ├─ Attendance Bonus: ₹1,000
   └─ GROSS: ₹64,000

8. SUM DEDUCTIONS
   ├─ PF: ₹4,800
   ├─ Tax: ₹3,000
   ├─ Prof Tax: ₹200
   ├─ Late Deduction: ₹200
   └─ TOTAL: ₹8,200

9. CALCULATE NET
   └─ NET = ₹64,000 - ₹8,200 = ₹55,800 ✓

10. RETURN RESULT
    └─ Send to frontend for display
```

---

## 🔄 **USER INTERACTION FLOW**

```
USER ACTIONS & SYSTEM RESPONSES
════════════════════════════════

USER                           SYSTEM
────                           ──────

1. Opens Update Payroll page
                              → Fetches all employees
                              → Fetches existing payroll data
                              → Populates table

2. Clicks "🔄 Auto Calculate"
   for Mahesh
                              → Sends request to backend
                              → Backend calls SalaryCalculationService
                              → Service fetches attendance
                              → Service fetches leave
                              → Service calculates all components
                              → Returns result

3. Views modal with results
   • Reviews attendance %
   • Checks bonuses
   • Verifies deductions
                              → Displays interactive modal
                              → Shows breakdown
                              → Waits for user action

4. Clicks "Apply to Payroll"
                              → Sends apply request
                              → Updates payroll record in DB
                              → Refreshes table
                              → Shows success message

5. Clicks "Save Payroll"
   (after all employees done)
                              → Batch saves all payroll records
                              → Redirects to Payroll table
                              → Shows confirmation

6. Views Payroll table
                              → Displays all saved payroll
                              → Shows net salaries
                              → Ready for payslip generation
```

---

## 📊 **SYSTEM ARCHITECTURE**

```
FRONTEND ←→ BACKEND ←→ DATABASE
════════     ═══════     ════════

React.js     Spring      MongoDB
────────     ──────      ───────

UpdatePayroll.jsx
     │
     ├─ calculateAllSalaries() ──────┐
     │                               │
     ├─ calculateAndApplySalary() ───┤
     │                               │
     └─ previewSalaryCalculation() ──┤
                                     │
                    ┌────────────────▼─────────────────┐
                    │  PayrollController.java          │
                    │  @PostMapping("/calculate")      │
                    └────────────────┬─────────────────┘
                                     │
                    ┌────────────────▼─────────────────┐
                    │  SalaryCalculationService.java   │
                    │  • calculateSalary()             │
                    │  • calculateBulkSalary()         │
                    │  • applySalaryCalculation()      │
                    └────┬────────┬────────┬───────────┘
                         │        │        │
        ┌────────────────┘        │        └────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
┌───────────────┐    ┌─────────────────────┐    ┌──────────────────┐
│ Attendance    │    │ Leave               │    │ Performance      │
│ Integration   │    │ Integration         │    │ Integration      │
│ Service       │    │ Service             │    │ Service          │
└───────┬───────┘    └─────────┬───────────┘    └────────┬─────────┘
        │                      │                         │
        └──────────────────────┴─────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Repository Layer   │
                    │  • AttendanceRepo   │
                    │  • LeaveRepo        │
                    │  • PayrollRepo      │
                    │  • UserRepo         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  MongoDB Database   │
                    │  • users            │
                    │  • attendance       │
                    │  • leaves           │
                    │  • payroll          │
                    └─────────────────────┘
```

---

## ✅ **SUCCESS INDICATORS**

```
HOW TO KNOW IT'S WORKING
═════════════════════════

✓ Base salary entered → Values saved in payroll table
✓ Attendance marked → Records visible in attendance table
✓ Click auto-calculate → Modal opens with data
✓ Attendance % shown → Matches manual count
✓ Bonus calculated → Based on attendance %
✓ Late deduction shown → Matches late arrivals count
✓ LOP deduction shown → Based on LOP days
✓ Net salary displayed → Gross minus deductions
✓ Apply to payroll → Values updated in table
✓ Save payroll → Redirects to payroll page
✓ View payroll table → Shows correct net amounts
```

---

**This flow ensures:**
- ✅ No hardcoded values
- ✅ Real data from database
- ✅ Automatic calculations
- ✅ User verification step
- ✅ Accurate payroll records

**Follow this flow for successful payroll testing!** 🎉
