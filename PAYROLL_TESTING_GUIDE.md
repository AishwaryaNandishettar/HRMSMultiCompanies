# 🧪 PAYROLL SYSTEM - COMPLETE TESTING GUIDE

## 📌 **OVERVIEW**
This guide will help you test the payroll system with **realistic calculations** for employees like Mahesh, Aishwarya, and Sunil Nandishettar. We'll use the **existing attendance system** (no hardcoding needed).

---

## 🎯 **STEP 1: SET UP BASE SALARIES (ONE-TIME SETUP)**

### **Instructions:**
1. **Navigate to:** `http://localhost:5176/update-payroll` (or your deployed URL)
2. **Login as Admin:** Use Aishwarya's admin credentials
3. You'll see a table with all employees

### **Enter Base Salary Components for 3 Employees:**

#### **Employee 1: Aishwarya Sunil Nandishettar (Admin - EMP ID: 2920)**
| Component | Amount (₹) | Notes |
|-----------|-----------|-------|
| **Basic** | 50,000 | Base salary |
| **HRA** | 20,000 | 40% of Basic |
| **Allowance** | 6,000 | Fixed |
| **Conveyance** | 2,000 | Transport |
| **Variable Salary** | 0 | Changes monthly |
| **Incentive** | 0 | Performance based |
| **Bonus** | 0 | System calculates |
| | | |
| **PF** | 6,000 | 12% of Basic |
| **ESI** | 0 | Salary > ₹21k |
| **Tax** | 4,000 | TDS |
| **Professional Tax** | 200 | State tax |
| **Deduction** | 0 | Other deductions |

**Expected Monthly Net:** ₹67,800 (with 100% attendance)

---

#### **Employee 2: Mahesh Panchal (IT - Employee ID: GN-EMP-0018)**
| Component | Amount (₹) | Notes |
|-----------|-----------|-------|
| **Basic** | 40,000 | Base salary |
| **HRA** | 16,000 | 40% of Basic |
| **Allowance** | 5,000 | Fixed |
| **Conveyance** | 2,000 | Transport |
| **Variable Salary** | 0 | Changes monthly |
| **Incentive** | 0 | Performance based |
| **Bonus** | 0 | System calculates |
| | | |
| **PF** | 4,800 | 12% of Basic |
| **ESI** | 0 | Salary > ₹21k |
| **Tax** | 3,000 | TDS |
| **Professional Tax** | 200 | State tax |
| **Deduction** | 0 | Other deductions |

**Expected Monthly Net:** ₹55,000 (with 100% attendance)

---

#### **Employee 3: Sunil (if available - or use Nikita/Lata)**
| Component | Amount (₹) | Notes |
|-----------|-----------|-------|
| **Basic** | 35,000 | Base salary |
| **HRA** | 14,000 | 40% of Basic |
| **Allowance** | 4,000 | Fixed |
| **Conveyance** | 2,000 | Transport |
| **Variable Salary** | 0 | Changes monthly |
| **Incentive** | 0 | Performance based |
| **Bonus** | 0 | System calculates |
| | | |
| **PF** | 4,200 | 12% of Basic |
| **ESI** | 0 | Salary > ₹21k |
| **Tax** | 2,500 | TDS |
| **Professional Tax** | 200 | State tax |
| **Deduction** | 0 | Other deductions |

**Expected Monthly Net:** ₹46,100 (with 100% attendance)

---

### **How to Enter:**
1. Find the employee row in the table
2. **Click on each input field** and enter the amount
3. The system will **auto-calculate Gross and Net** as you type
4. **Important:** Don't click "Save Payroll" yet - we'll do that after testing auto-calculate

---

## ✅ **STEP 2: MARK ATTENDANCE (JULY 2026)**

### **Instructions:**
Now we'll create realistic attendance data using the **existing Attendance page**.

### **Navigate to:** `http://localhost:5176/attendance`

---

### **Scenario A: AISHWARYA (Perfect Attendance)**

**Goal:** 100% attendance with 0 late arrivals

**Steps:**
1. **Login as Aishwarya** (admin account)
2. **For each working day (July 1-14, 2026):**
   - Select the date (use date picker)
   - Click **"Check In"** at 9:00 AM or earlier
   - Click **"Check Out"** at 6:00 PM
   - The system will automatically capture location

**Expected Result:**
- Present Days: 10 (Mon-Fri, excluding weekends)
- Attendance %: 100%
- Late Arrivals: 0
- LOP Days: 0
- **Attendance Bonus: ₹2,000** (≥98%)
- **Late Deduction: ₹0**

---

### **Scenario B: MAHESH (Good Attendance with Late Arrivals)**

**Goal:** 93% attendance with 2 late arrivals

**Steps:**
1. **Login as Mahesh** (or have admin mark attendance for him)
2. **Mark attendance as follows:**

| Date | Action | Check-In | Check-Out | Notes |
|------|--------|----------|-----------|-------|
| Jul 1 (Tue) | Check In | 09:00 | 18:00 | On time |
| Jul 2 (Wed) | Check In | **10:30** | 18:00 | **Late** |
| Jul 3 (Thu) | Check In | 09:00 | 18:00 | On time |
| Jul 4 (Fri) | Check In | 09:00 | 18:00 | On time |
| Jul 7 (Mon) | Check In | 09:00 | 18:00 | On time |
| Jul 8 (Tue) | Check In | **10:15** | 18:00 | **Late** |
| Jul 9 (Wed) | Check In | 09:00 | 18:00 | On time |
| Jul 10 (Thu) | Check In | 09:00 | 18:00 | On time |
| Jul 11 (Fri) | **ABSENT** | - | - | No check-in |
| Jul 14 (Mon) | Check In | 09:00 | 18:00 | On time |

**Expected Result:**
- Present Days: 9 out of 10
- Attendance %: 90%
- Late Arrivals: 2
- LOP Days: 0 (1 day absent but not LOP)
- **Attendance Bonus: ₹1,000** (≥90%)
- **Late Deduction: ₹200** (2 × ₹100)

---

### **Scenario C: SUNIL/NIKITA (Average Attendance with LOP)**

**Goal:** 80% attendance with 1 late arrival and 2 LOP days

**Steps:**
1. **Login as the employee** (or have admin mark)
2. **Mark attendance as follows:**

| Date | Action | Check-In | Check-Out | Notes |
|------|--------|----------|-----------|-------|
| Jul 1 (Tue) | Check In | 09:00 | 18:00 | On time |
| Jul 2 (Wed) | Check In | 09:00 | 18:00 | On time |
| Jul 3 (Thu) | **LOP** | - | - | Leave without pay |
| Jul 4 (Fri) | Check In | 09:00 | 18:00 | On time |
| Jul 7 (Mon) | Check In | **10:30** | 18:00 | **Late** |
| Jul 8 (Tue) | Check In | 09:00 | 18:00 | On time |
| Jul 9 (Wed) | Check In | 09:00 | 18:00 | On time |
| Jul 10 (Thu) | **LOP** | - | - | Leave without pay |
| Jul 11 (Fri) | Check In | 09:00 | 18:00 | On time |
| Jul 14 (Mon) | Check In | 09:00 | 18:00 | On time |

**Expected Result:**
- Present Days: 8 out of 10
- Attendance %: 80%
- Late Arrivals: 1
- LOP Days: 2
- **Attendance Bonus: ₹0** (<85%)
- **Late Deduction: ₹100** (1 × ₹100)
- **LOP Deduction: ₹2,333** (₹35,000 / 30 × 2)

---

## 🔄 **STEP 3: TEST AUTO-CALCULATE FEATURE**

### **Method 1: Individual Employee Auto-Calculate**

1. **Go back to:** `http://localhost:5176/update-payroll`
2. **Find Aishwarya's row** in the table
3. **Scroll right** to the last column "🧮 Auto Calculate"
4. **Click the "🔄 Auto Calculate" button**
5. A **modal will pop up** showing:
   - Real-time attendance data
   - Calculated bonuses and deductions
   - Breakdown of all salary components
   - Net salary after all calculations

**What the modal shows:**
```
SALARY CALCULATION RESULT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Employee: Aishwarya Sunil Nandishettar
Employee ID: 2920
Month: July-2026

ATTENDANCE SUMMARY:
  Total Working Days: 30
  Present Days: 30
  Absent Days: 0
  Attendance %: 100%
  Late Arrivals: 0

EARNINGS:
  Basic Salary:           ₹50,000.00
  HRA:                    ₹20,000.00
  Allowance:              ₹6,000.00
  Conveyance:             ₹2,000.00
  Variable Salary:        ₹0.00
  Incentive:              ₹0.00
  Bonus:                  ₹0.00
  ─────────────────────────────────
  Attendance Bonus:       ₹2,000.00 ✨
  Performance Bonus:      ₹0.00
  Overtime Pay:           ₹0.00
  ═════════════════════════════════
  GROSS SALARY:           ₹80,000.00

DEDUCTIONS:
  PF:                     ₹6,000.00
  ESI:                    ₹0.00
  Tax:                    ₹4,000.00
  Professional Tax:       ₹200.00
  Other Deduction:        ₹0.00
  ─────────────────────────────────
  Late Deduction:         ₹0.00
  LOP Deduction:          ₹0.00
  ═════════════════════════════════
  TOTAL DEDUCTIONS:       ₹10,200.00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET SALARY:               ₹69,800.00
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Apply to Payroll]  [Close]
```

6. **Click "Apply to Payroll"** to save the calculated values
7. **Repeat for Mahesh and Sunil**

---

### **Method 2: Bulk Auto-Calculate (All Employees)**

1. **At the top of the Update Payroll page**, find the button:
   **"🔄 Calculate All Salaries"**
2. **Click it**
3. The system will:
   - Fetch attendance for **ALL employees**
   - Calculate salaries automatically
   - Show a **summary table** with all results
4. **Review the results** in the modal
5. **Click "Apply All"** to save all calculations at once

---

## 📊 **STEP 4: VERIFY CALCULATIONS**

### **Expected Results After Auto-Calculate:**

#### **Aishwarya:**
```
Gross:               ₹80,000
- Deductions:        ₹10,200
─────────────────────────────
Net Salary:          ₹69,800 ✅
```

#### **Mahesh:**
```
Gross:               ₹64,000
- Deductions:        ₹8,200
─────────────────────────────
Net Salary:          ₹55,800 ✅
```

#### **Sunil/Nikita:**
```
Gross:               ₹55,500
- Deductions:        ₹11,833
─────────────────────────────
Net Salary:          ₹43,667 ✅
```

---

## 💾 **STEP 5: SAVE PAYROLL**

1. After reviewing all calculations
2. **Click "Save Payroll"** button at the top
3. System will save all payroll records to database
4. You'll be redirected to the Payroll table page
5. **Verify:** All 3 employees show correct Net Salary amounts

---

## 🎯 **KEY FEATURES BEING TESTED**

### ✅ **What Works Automatically:**
1. ✅ Fetches **real attendance data** from attendance records
2. ✅ Calculates **attendance percentage** automatically
3. ✅ Awards **attendance bonus** based on percentage
4. ✅ Deducts **late penalties** (₹100 per late arrival)
5. ✅ Calculates **LOP deduction** (pro-rated from basic salary)
6. ✅ Computes **overtime pay** (1.5× hourly rate)
7. ✅ Shows **complete breakdown** in modal
8. ✅ Saves calculated values to payroll table

### ✅ **No Hardcoding Required:**
- ❌ No need to manually enter attendance bonus
- ❌ No need to manually calculate LOP deduction
- ❌ No need to manually count present/absent days
- ✅ Everything is fetched from **real attendance records**

---

## 🐛 **TROUBLESHOOTING**

### **Issue: Auto-Calculate shows 0 present days**
**Solution:** 
- Ensure attendance is marked for the correct month (July 2026)
- Check that employee ID in attendance matches payroll
- Verify date format is correct (YYYY-MM-DD)

### **Issue: Attendance bonus not showing**
**Solution:**
- Check attendance percentage calculation
- Verify the attendance bonus rules in `AttendanceIntegrationService.java`
- Ensure present days are being counted correctly

### **Issue: LOP deduction not calculating**
**Solution:**
- Check if leave records exist with LOP flag
- Verify `LeaveIntegrationService` is working
- Check if leave is marked as "LOP" type in leave management

---

## 📝 **SUMMARY**

This testing approach:
- ✅ Uses **real attendance data** from the Attendance page
- ✅ No hardcoding or manual calculation needed
- ✅ Tests the **complete payroll flow** end-to-end
- ✅ Verifies **all automatic calculations** work correctly
- ✅ Shows **realistic salary amounts** for 3 employees
- ✅ Tests both **individual** and **bulk** calculation modes

**You now have a fully functional, realistic payroll testing setup!**

---

## 🚀 **NEXT STEPS**

After testing, you can:
1. Add more employees with different salary structures
2. Test with different attendance scenarios (sick leave, half days, etc.)
3. Add performance bonus calculations
4. Generate payslips for employees
5. Export payroll reports

**Happy Testing! 🎉**
