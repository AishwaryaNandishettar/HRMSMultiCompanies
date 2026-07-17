# 💰 PAYROLL CALCULATION EXAMPLES - VISUAL BREAKDOWN

## 📊 **HOW THE SYSTEM CALCULATES SALARY**

This document shows **exactly** how the payroll system calculates salary for different attendance scenarios.

---

## 🧮 **CALCULATION FORMULA**

```
GROSS SALARY = Basic + HRA + Allowance + Conveyance + Variable Salary
             + Incentive + Bonus + Attendance Bonus + Overtime Pay

DEDUCTIONS = PF + ESI + Tax + Professional Tax + Other Deduction
           + Late Deduction + LOP Deduction

NET SALARY = GROSS SALARY - DEDUCTIONS
```

---

## 📋 **EXAMPLE 1: PERFECT ATTENDANCE (Aishwarya)**

### **Input Data:**
- **Employee:** Aishwarya Sunil Nandishettar
- **Employee ID:** 2920
- **Month:** July 2026
- **Working Days:** 30

### **Base Salary Components:**
```
Basic Salary:           ₹50,000
HRA (40% of Basic):     ₹20,000
Allowance:              ₹6,000
Conveyance:             ₹2,000
Variable Salary:        ₹0
Incentive:              ₹0
Bonus:                  ₹0
```

### **Attendance Record:**
```
Present Days:           30 / 30
Attendance %:           100%
Late Arrivals:          0
LOP Days:               0
Overtime Hours:         0
```

### **System Auto-Calculates:**

#### **Step 1: Calculate Attendance Bonus**
```
Attendance % = 100%
Rule: ≥98% → ₹2,000 bonus
✅ Attendance Bonus = ₹2,000
```

#### **Step 2: Calculate Late Deduction**
```
Late Arrivals = 0
Penalty = ₹100 per late arrival
✅ Late Deduction = ₹0
```

#### **Step 3: Calculate LOP Deduction**
```
LOP Days = 0
Daily Rate = ₹50,000 / 30 = ₹1,666.67
✅ LOP Deduction = ₹0
```

#### **Step 4: Calculate Gross Salary**
```
Basic:                  ₹50,000
HRA:                    ₹20,000
Allowance:              ₹6,000
Conveyance:             ₹2,000
Attendance Bonus:       ₹2,000 ⬅ Auto-calculated
────────────────────────────────
GROSS SALARY:           ₹80,000
```

#### **Step 5: Calculate Total Deductions**
```
PF:                     ₹6,000
Tax:                    ₹4,000
Professional Tax:       ₹200
Late Deduction:         ₹0 ⬅ Auto-calculated
LOP Deduction:          ₹0 ⬅ Auto-calculated
────────────────────────────────
TOTAL DEDUCTIONS:       ₹10,200
```

#### **Step 6: Calculate Net Salary**
```
Gross Salary:           ₹80,000
- Total Deductions:     ₹10,200
════════════════════════════════
NET SALARY:             ₹69,800 ✅
```

---

## 📋 **EXAMPLE 2: GOOD ATTENDANCE WITH LATE ARRIVALS (Mahesh)**

### **Input Data:**
- **Employee:** Mahesh Panchal
- **Employee ID:** GN-EMP-0018
- **Month:** July 2026
- **Working Days:** 30

### **Base Salary Components:**
```
Basic Salary:           ₹40,000
HRA (40% of Basic):     ₹16,000
Allowance:              ₹5,000
Conveyance:             ₹2,000
Variable Salary:        ₹0
Incentive:              ₹0
Bonus:                  ₹0
```

### **Attendance Record:**
```
Present Days:           28 / 30
Attendance %:           93.33%
Late Arrivals:          2 (Jul 2, Jul 8)
LOP Days:               0
Overtime Hours:         0
```

### **System Auto-Calculates:**

#### **Step 1: Calculate Attendance Bonus**
```
Attendance % = 93.33%
Rule: ≥90% AND <95% → ₹1,000 bonus
✅ Attendance Bonus = ₹1,000
```

#### **Step 2: Calculate Late Deduction**
```
Late Arrivals = 2
Penalty = ₹100 per late arrival
✅ Late Deduction = ₹200
```

#### **Step 3: Calculate LOP Deduction**
```
LOP Days = 0 (2 days absent but not marked as LOP)
✅ LOP Deduction = ₹0
```

#### **Step 4: Calculate Gross Salary**
```
Basic:                  ₹40,000
HRA:                    ₹16,000
Allowance:              ₹5,000
Conveyance:             ₹2,000
Attendance Bonus:       ₹1,000 ⬅ Auto-calculated
────────────────────────────────
GROSS SALARY:           ₹64,000
```

#### **Step 5: Calculate Total Deductions**
```
PF:                     ₹4,800
Tax:                    ₹3,000
Professional Tax:       ₹200
Late Deduction:         ₹200 ⬅ Auto-calculated (2 × ₹100)
LOP Deduction:          ₹0 ⬅ Auto-calculated
────────────────────────────────
TOTAL DEDUCTIONS:       ₹8,200
```

#### **Step 6: Calculate Net Salary**
```
Gross Salary:           ₹64,000
- Total Deductions:     ₹8,200
════════════════════════════════
NET SALARY:             ₹55,800 ✅
```

---

## 📋 **EXAMPLE 3: AVERAGE ATTENDANCE WITH LOP (Nikita/Sunil)**

### **Input Data:**
- **Employee:** Nikita/Sunil
- **Employee ID:** GN-EMP-0019
- **Month:** July 2026
- **Working Days:** 30

### **Base Salary Components:**
```
Basic Salary:           ₹35,000
HRA (40% of Basic):     ₹14,000
Allowance:              ₹4,000
Conveyance:             ₹2,000
Variable Salary:        ₹0
Incentive:              ₹0
Bonus:                  ₹0
```

### **Attendance Record:**
```
Present Days:           26 / 30
Attendance %:           86.67%
Late Arrivals:          1 (Jul 7)
LOP Days:               2 (Jul 3, Jul 10)
Overtime Hours:         0
```

### **System Auto-Calculates:**

#### **Step 1: Calculate Attendance Bonus**
```
Attendance % = 86.67%
Rule: ≥85% AND <90% → ₹500 bonus
✅ Attendance Bonus = ₹500
```

#### **Step 2: Calculate Late Deduction**
```
Late Arrivals = 1
Penalty = ₹100 per late arrival
✅ Late Deduction = ₹100
```

#### **Step 3: Calculate LOP Deduction**
```
LOP Days = 2
Daily Rate = ₹35,000 / 30 = ₹1,166.67
LOP Deduction = ₹1,166.67 × 2 = ₹2,333.34
✅ LOP Deduction = ₹2,333
```

#### **Step 4: Calculate Gross Salary**
```
Basic:                  ₹35,000
HRA:                    ₹14,000
Allowance:              ₹4,000
Conveyance:             ₹2,000
Attendance Bonus:       ₹500 ⬅ Auto-calculated
────────────────────────────────
GROSS SALARY:           ₹55,500
```

#### **Step 5: Calculate Total Deductions**
```
PF:                     ₹4,200
Tax:                    ₹2,500
Professional Tax:       ₹200
Late Deduction:         ₹100 ⬅ Auto-calculated (1 × ₹100)
LOP Deduction:          ₹2,333 ⬅ Auto-calculated
────────────────────────────────
TOTAL DEDUCTIONS:       ₹9,333
```

#### **Step 6: Calculate Net Salary**
```
Gross Salary:           ₹55,500
- Total Deductions:     ₹9,333
════════════════════════════════
NET SALARY:             ₹46,167 ✅
```

---

## 📊 **ATTENDANCE BONUS RULES**

The system automatically applies these rules:

| Attendance % | Bonus Amount | Example |
|--------------|--------------|---------|
| ≥ 98% | ₹2,000 | 30/30 days = 100% → ₹2,000 |
| ≥ 95% and < 98% | ₹1,500 | 29/30 days = 96.67% → ₹1,500 |
| ≥ 90% and < 95% | ₹1,000 | 28/30 days = 93.33% → ₹1,000 |
| ≥ 85% and < 90% | ₹500 | 26/30 days = 86.67% → ₹500 |
| < 85% | ₹0 | 24/30 days = 80% → ₹0 |

---

## 🕐 **LATE ARRIVAL RULES**

| Condition | Penalty |
|-----------|---------|
| Check-in **before 10:00 AM** | No penalty |
| Check-in **at or after 10:00 AM** | ₹100 deduction |

**Examples:**
- Check-in at 09:59 AM → No penalty
- Check-in at 10:00 AM → ₹100 penalty
- Check-in at 10:30 AM → ₹100 penalty (not ₹150, flat rate)

---

## 💸 **LOP DEDUCTION CALCULATION**

```
Daily Rate = Basic Salary / Total Working Days

LOP Deduction = Daily Rate × Number of LOP Days
```

**Examples:**

| Basic Salary | Working Days | LOP Days | Daily Rate | LOP Deduction |
|--------------|--------------|----------|------------|---------------|
| ₹50,000 | 30 | 1 | ₹1,666.67 | ₹1,667 |
| ₹40,000 | 30 | 2 | ₹1,333.33 | ₹2,667 |
| ₹35,000 | 30 | 2 | ₹1,166.67 | ₹2,333 |
| ₹30,000 | 30 | 3 | ₹1,000.00 | ₹3,000 |

---

## 🎯 **COMPARISON TABLE**

| Component | Aishwarya | Mahesh | Sunil/Nikita |
|-----------|-----------|--------|--------------|
| **Basic** | ₹50,000 | ₹40,000 | ₹35,000 |
| **HRA** | ₹20,000 | ₹16,000 | ₹14,000 |
| **Allowance** | ₹6,000 | ₹5,000 | ₹4,000 |
| **Conveyance** | ₹2,000 | ₹2,000 | ₹2,000 |
| **Attendance Bonus** | ₹2,000 ✨ | ₹1,000 ✨ | ₹500 ✨ |
| **Gross** | ₹80,000 | ₹64,000 | ₹55,500 |
| | | | |
| **PF** | -₹6,000 | -₹4,800 | -₹4,200 |
| **Tax** | -₹4,000 | -₹3,000 | -₹2,500 |
| **Prof Tax** | -₹200 | -₹200 | -₹200 |
| **Late Penalty** | ₹0 | -₹200 ⚠️ | -₹100 ⚠️ |
| **LOP** | ₹0 | ₹0 | -₹2,333 ⚠️ |
| **Total Deductions** | -₹10,200 | -₹8,200 | -₹9,333 |
| | | | |
| **NET SALARY** | **₹69,800** ✅ | **₹55,800** ✅ | **₹46,167** ✅ |
| | | | |
| **Attendance %** | 100% | 93.33% | 86.67% |
| **Late Arrivals** | 0 | 2 | 1 |
| **LOP Days** | 0 | 0 | 2 |

---

## 🔍 **WHAT THE AUTO-CALCULATE MODAL SHOWS**

When you click "🔄 Auto Calculate", the system displays:

```
┌─────────────────────────────────────────────────┐
│  SALARY CALCULATION RESULT                      │
│  ═════════════════════════════════════════════  │
│                                                  │
│  Employee: Mahesh Panchal                       │
│  ID: GN-EMP-0018                                │
│  Department: IT                                 │
│  Month: July-2026                               │
│                                                  │
│  ─────────────────────────────────────────────  │
│  ATTENDANCE SUMMARY                             │
│  ─────────────────────────────────────────────  │
│  Working Days:        30                        │
│  Present Days:        28                        │
│  Absent Days:         2                         │
│  Attendance %:        93.33%                    │
│  Late Arrivals:       2                         │
│  LOP Days:            0                         │
│                                                  │
│  ═════════════════════════════════════════════  │
│  EARNINGS                                       │
│  ─────────────────────────────────────────────  │
│  Basic Salary             ₹40,000.00            │
│  HRA                      ₹16,000.00            │
│  Allowance                ₹5,000.00             │
│  Conveyance               ₹2,000.00             │
│  Attendance Bonus ✨      ₹1,000.00             │
│  ═════════════════════════════════════════════  │
│  GROSS SALARY             ₹64,000.00            │
│                                                  │
│  ═════════════════════════════════════════════  │
│  DEDUCTIONS                                     │
│  ─────────────────────────────────────────────  │
│  PF                       ₹4,800.00             │
│  Tax                      ₹3,000.00             │
│  Professional Tax         ₹200.00               │
│  Late Deduction ⚠️        ₹200.00               │
│  ═════════════════════════════════════════════  │
│  TOTAL DEDUCTIONS         ₹8,200.00             │
│                                                  │
│  ═════════════════════════════════════════════  │
│  NET SALARY               ₹55,800.00  ✅        │
│  ═════════════════════════════════════════════  │
│                                                  │
│  Calculation Mode: AUTO                         │
│  Calculated At: July 14, 2026 10:30 AM         │
│                                                  │
│  [Apply to Payroll]  [Preview Only]  [Close]   │
└─────────────────────────────────────────────────┘
```

---

## ✅ **SUMMARY**

**The system automatically calculates:**
1. ✅ Attendance percentage from real check-in records
2. ✅ Attendance bonus based on percentage ranges
3. ✅ Late deductions (₹100 per late arrival)
4. ✅ LOP deductions (pro-rated from basic salary)
5. ✅ Overtime pay (1.5× hourly rate)
6. ✅ Gross salary (all earnings)
7. ✅ Total deductions
8. ✅ Final net salary

**You only need to:**
- Enter base salary components once
- Mark attendance using the UI
- Click "Auto Calculate"
- Review and save

**That's it! The system does all the math! 🎉**
