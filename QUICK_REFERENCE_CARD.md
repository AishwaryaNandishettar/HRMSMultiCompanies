# 📇 PAYROLL TESTING - QUICK REFERENCE CARD

## 🚀 **3-STEP QUICK START**

```
1. SET BASE SALARIES        2. MARK ATTENDANCE         3. AUTO-CALCULATE
   ↓                           ↓                          ↓
   Update Payroll page         Attendance page            Update Payroll page
   Enter once per employee     8-10 days per employee     Click button
   ↓                           ↓                          ↓
   Basic, HRA, PF, Tax         Check In / Check Out       Review & Apply
```

---

## 💰 **BASE SALARY QUICK VALUES**

| Employee | Basic | HRA | Allow | Conv | PF | Tax | Prof Tax |
|----------|-------|-----|-------|------|----|-----|----------|
| **Aishwarya** | 50000 | 20000 | 6000 | 2000 | 6000 | 4000 | 200 |
| **Mahesh** | 40000 | 16000 | 5000 | 2000 | 4800 | 3000 | 200 |
| **Nikita** | 35000 | 14000 | 4000 | 2000 | 4200 | 2500 | 200 |

---

## 📅 **ATTENDANCE SCENARIOS**

### **Scenario A: Perfect (100%)**
- Present: 30/30 days
- Late: 0
- LOP: 0
- **Bonus:** ₹2,000

### **Scenario B: Good (93%)**
- Present: 28/30 days
- Late: 2
- LOP: 0
- **Bonus:** ₹1,000
- **Deduction:** ₹200

### **Scenario C: Average (87%)**
- Present: 26/30 days
- Late: 1
- LOP: 2
- **Bonus:** ₹500
- **Deduction:** ₹100 + ₹2,333

---

## 🎯 **EXPECTED NET SALARIES**

```
Aishwarya:  ₹69,800  (100% attendance)
Mahesh:     ₹55,800  (93% with 2 late)
Nikita:     ₹46,167  (87% with 2 LOP)
```

---

## 🔄 **CALCULATION RULES**

### **Attendance Bonus:**
```
≥98% → ₹2,000
≥95% → ₹1,500
≥90% → ₹1,000
≥85% → ₹500
<85% → ₹0
```

### **Late Deduction:**
```
Check-in ≥ 10:00 AM → ₹100 per occurrence
```

### **LOP Deduction:**
```
(Basic / 30) × LOP Days
Example: (₹35,000 / 30) × 2 = ₹2,333
```

---

## 🖥️ **URL QUICK ACCESS**

```
Login:          http://localhost:5176/login
Home:           http://localhost:5176/home
Attendance:     http://localhost:5176/attendance
Payroll:        http://localhost:5176/payroll
Update Payroll: http://localhost:5176/update-payroll
```

---

## 🎯 **BUTTON LOCATIONS**

### **Attendance Page:**
- Top right: `[Check In] [Check Out] [Work From Home]`
- Date picker: Top left

### **Update Payroll Page:**
- Top: `[Edit Mode] [Calculate All] [Save Payroll]`
- Each row: `[🔄 Auto Calculate]` (scroll right)

---

## ✅ **TESTING CHECKLIST**

### **Phase 1: Setup (5 min)**
- [ ] Login as admin
- [ ] Go to Update Payroll
- [ ] Enter base salaries for 3 employees
- [ ] Don't save yet

### **Phase 2: Attendance (10 min)**
- [ ] Go to Attendance page
- [ ] Mark 8-10 days per employee
- [ ] Create variety (late/absent)
- [ ] Verify in table

### **Phase 3: Calculate (5 min)**
- [ ] Go back to Update Payroll
- [ ] Click "Calculate All Salaries"
- [ ] Review modal
- [ ] Click "Apply All"
- [ ] Click "Save Payroll"

### **Phase 4: Verify (2 min)**
- [ ] Check Payroll table
- [ ] Verify net amounts
- [ ] ✅ Testing complete!

---

## 🐛 **QUICK FIXES**

| Problem | Fix |
|---------|-----|
| Button grayed out | Click [Edit Mode] |
| Can't see Auto Calculate | Scroll right |
| 0 attendance days | Check employee ID matches |
| Wrong bonus | Check attendance % |
| Can't save | Fill all required fields |

---

## 📊 **FORMULA CHEAT SHEET**

```
GROSS = Basic + HRA + Allowance + Conveyance 
        + Bonus + Att.Bonus + Overtime

DEDUCTIONS = PF + Tax + Prof.Tax + Late 
             + LOP + Other

NET = GROSS - DEDUCTIONS

ATTENDANCE % = (Present Days / Total Days) × 100

LOP DEDUCTION = (Basic / 30) × LOP Days

LATE DEDUCTION = Late Count × ₹100
```

---

## 📞 **HELP DOCUMENTS**

| Issue | Read This |
|-------|-----------|
| **Getting started** | TESTING_SUMMARY.md |
| **Detailed steps** | PAYROLL_TESTING_GUIDE.md |
| **Attendance UI** | HOW_TO_MARK_ATTENDANCE.md |
| **Verify calculations** | PAYROLL_CALCULATION_EXAMPLES.md |
| **Understand system** | PAYROLL_SYSTEM_FLOW.md |
| **UI navigation** | UI_WALKTHROUGH_GUIDE.md |

---

## 🎯 **SUCCESS INDICATORS**

✅ Modal opens with data  
✅ Attendance % shown  
✅ Bonuses calculated  
✅ Deductions calculated  
✅ Net salary displayed  
✅ Values saved  
✅ Payroll table updated  

---

## 💡 **PRO TIPS**

1. **Use Edit Mode** - Always enable before entering values
2. **Scroll Right** - Auto Calculate button is at the end
3. **Check Console** - Look for errors if something fails
4. **Verify Employee ID** - Must match between Attendance & Payroll
5. **Apply Before Save** - Click "Apply" in modal first
6. **Test with Variety** - Different scenarios show system works

---

## 📈 **EXPECTED TIMELINE**

```
First Time:  30 minutes
With Guide:  20 minutes
Experienced: 10 minutes
```

---

## 🎊 **FINAL RESULT**

After completing all steps:

```
✅ 3 employees with realistic salaries
✅ Automatic calculations working
✅ Attendance integration verified
✅ No hardcoded values
✅ Ready for production use
```

---

**Print this card for quick reference while testing!**

---

**Version:** 1.0  
**Last Updated:** July 14, 2026
