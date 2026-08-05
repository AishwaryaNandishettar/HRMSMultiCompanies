# Testing Checklist - Fixes Verification

## 🔧 Before Testing

### Backend Restart Required
```bash
cd HRMS-Backend
# Stop the backend if running
# Then restart:
./mvnw spring-boot:run
# OR if using IDE, restart the Spring Boot application
```

### Frontend Refresh
```bash
cd HRMS-Frontend
# If dev server is running, it should auto-reload
# If not, restart:
npm run dev
```

---

## ✅ TEST 1: Document Upload Fix (QuotaExceededError)

### Scenario: Upload documents without localStorage quota error

**Steps:**
1. Open browser DevTools → Console tab (to see any errors)
2. Navigate to **Onboarding page** (`/onboarding`)
3. Fill in minimal required fields:
   - Personal Details:
     - ✏️ Full Name: "Test Employee"
     - ✏️ Email: "test@example.com"
   - Job Details:
     - ✏️ Employee ID: "TEST-001"
     - ✏️ Department: "IT"
4. Scroll to **Documents section**
5. Upload at least 3 files:
   - 📎 Resume (any PDF/DOCX)
   - 📎 Aadhaar File (any image/PDF)
   - 📎 PAN File (any image/PDF)
6. Click **Submit** button

**Expected Result:**
- ✅ Form submits successfully
- ✅ No `QuotaExceededError` in console
- ✅ Success message: "Onboarding submitted successfully ✅"
- ✅ Redirects to BGV page

**Backend Console Should Show:**
```
Uploading documents to backend...
Uploaded document URLs: { photo: "/uploads/tasks/...", resume: "/uploads/tasks/...", ... }
```

### Verify Document Storage

**Steps:**
1. Check backend `uploads/tasks/` folder
2. Verify uploaded files exist with UUID filenames

**Expected Result:**
- ✅ Files exist in `uploads/tasks/` directory
- ✅ Filenames follow pattern: `uuid.extension` (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf`)

---

## ✅ TEST 2: Document Viewing in BGV Page

### Scenario: View uploaded documents from BGV page

**Steps:**
1. Navigate to **BGV page** (`/BGV`)
2. Find the employee record you just created
3. Click **View Details** button
4. Scroll to **Documents** section
5. Click **📄 View File** button next to Resume
6. Click **📄 View File** button next to Aadhaar
7. Click **📄 View File** button next to PAN

**Expected Result:**
- ✅ Each document opens in new browser tab
- ✅ Document content is visible (PDF viewer or image)
- ✅ No "Document not available" error

### Test Confidential Document Masking

**Steps:**
1. If you uploaded any bank-related documents (passbook, cheque)
2. Check Documents section in BGV page
3. Verify bank documents show: `********** (Confidential) 🔒`
4. Click **🔒 View Confidential** button
5. Confirm dialog appears: "⚠️ CONFIDENTIAL DOCUMENT"
6. Click OK

**Expected Result:**
- ✅ Bank documents masked with stars
- ✅ Confirmation dialog appears before viewing
- ✅ Document opens after confirmation

---

## ✅ TEST 3: Payroll Calculation with Timesheet Data

### Scenario: Payroll uses Timesheet data, not raw Attendance

**Preparation:**
1. Navigate to **Attendance page**
2. Check in for employee "Aishwarya Sunil Nandishettar" (or create a test employee)
3. Mark attendance for **5 different days** in current month
4. Navigate to **Timesheet page**
5. Verify Timesheet shows:
   - Present: **5**
   - Absent: **3** (or any non-zero value)
   - Working Days: **31**

**Steps:**
1. Navigate to **Payroll page** (`/payroll`)
2. Select Employee: "Aishwarya Sunil Nandishettar"
3. Select Month: Current month (e.g., "July-2026")
4. Click **Calculate Payroll** or equivalent button
5. Check the attendance summary section

**Expected Result:**
- ✅ Present Days: **5** (matches Timesheet)
- ✅ Absent Days: **3** (matches Timesheet)
- ✅ Working Days: **31** (matches Timesheet)
- ✅ Attendance Percentage: **16.13%** (5/31)
- ✅ NOT showing 0 present days anymore!

**Backend Console Should Show:**
```
✅ TIMESHEET DATA USED:
   Employee: GN-EMP-0018
   Month: July-2026
   Present: 5
   Absent: 3
   LOP: 0
   Working Days: 31
   Late Arrivals: 0
   Attendance %: 16.13
```

### Verify Bonus Calculation

**Expected Bonus Rules:**
- Attendance ≥ 98%: ₹2,000
- Attendance ≥ 95%: ₹1,500
- Attendance ≥ 90%: ₹1,000
- Attendance ≥ 85%: ₹500
- Attendance < 85%: ₹0

**For 16.13% attendance:**
- ✅ Attendance Bonus: **₹0** (below 85%)

**Steps to test higher bonus:**
1. Go to Timesheet
2. Manually edit to increase present days to 28
3. Recalculate payroll
4. Verify Attendance Bonus = ₹1,000 (90.32% attendance)

---

## ✅ TEST 4: Late Deduction Calculation

### Scenario: Late arrivals deduct ₹100 each

**Preparation:**
1. Go to Attendance page
2. Check in for employee with time **after 10:00 AM** (e.g., 10:30 AM)
3. Do this for 3 different days
4. Verify Timesheet shows Late Count: **3**

**Steps:**
1. Navigate to Payroll page
2. Calculate payroll for that employee
3. Check "Late Deduction" field

**Expected Result:**
- ✅ Late Arrivals: **3**
- ✅ Late Deduction: **₹300** (3 × ₹100)

---

## ✅ TEST 5: LOP Deduction from Timesheet

### Scenario: Loss of Pay days deducted from salary

**Preparation:**
1. Go to Timesheet page
2. Verify employee has LOP days (e.g., LOP: 2)

**Steps:**
1. Navigate to Payroll page
2. Calculate payroll
3. Check LOP deduction calculation

**Formula:**
```
LOP Deduction = (Base Salary / Working Days) × LOP Days
Example: (₹30,000 / 31) × 2 = ₹1,935.48
```

**Expected Result:**
- ✅ LOP Days: **2** (from Timesheet)
- ✅ LOP Deduction: **₹1,935.48** (or proportional amount)

---

## 🔍 Troubleshooting Guide

### Issue: QuotaExceededError still appears

**Solution:**
1. Clear browser localStorage:
   ```javascript
   // In browser console:
   localStorage.clear();
   ```
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Try in Incognito/Private window
4. Check if `useEffect` for docs is really removed

---

### Issue: Files not uploading to backend

**Check 1: Backend running?**
```bash
# Backend should be running on:
http://localhost:8082

# Test upload endpoint:
curl http://localhost:8082/api/files/upload
# Should return 400 or method not allowed, not 404
```

**Check 2: CORS enabled?**
- Backend should allow `http://localhost:5173` origin
- Check `FileController.java` has `@CrossOrigin` annotation

**Check 3: uploads/ directory exists?**
```bash
cd HRMS-Backend
ls -la uploads/tasks/
# Should create automatically, but verify
```

---

### Issue: Payroll still shows 0 present days

**Check 1: Timesheet has data?**
1. Navigate to Timesheet page
2. Verify employee has present days > 0
3. Check month matches payroll calculation month

**Check 2: Backend logs?**
- Look for: "✅ TIMESHEET DATA USED"
- If not found, TimesheetService not being called

**Check 3: Employee ID matches?**
- Timesheet employee ID must match payroll employee ID
- Check for case sensitivity or extra spaces

**Debug Query:**
```java
// Add to AttendanceIntegrationService.getMonthlyAttendance()
System.out.println("Querying timesheet for: " + employeeId + ", month: " + month);
TimesheetSummary summary = timesheetService.getMonthlySummary(employeeId, month);
System.out.println("Timesheet result: " + summary);
```

---

### Issue: Documents not viewable in BGV page

**Check 1: Document URLs in database**
```javascript
// In browser console on BGV page:
const records = JSON.parse(localStorage.getItem("bgv_records"));
console.log(records[0].documents);
// Should show URLs like "/uploads/tasks/uuid.pdf", not null
```

**Check 2: Backend serving files?**
```bash
# Test file access directly:
curl http://localhost:8082/uploads/tasks/YOUR-FILE-UUID.pdf
# Should return file content, not 404
```

**Check 3: WebConfig.java configured?**
- Verify `addResourceHandlers` maps `/uploads/**` to `file:uploads/`

---

## 📊 Test Results Template

Copy and fill this out after testing:

```
=== TEST RESULTS ===
Date: _______________
Tester: _______________

[ ] TEST 1: Document Upload (QuotaExceededError fix)
    Result: PASS / FAIL
    Notes: ________________________________

[ ] TEST 2: Document Viewing in BGV
    Result: PASS / FAIL
    Notes: ________________________________

[ ] TEST 3: Payroll with Timesheet Data
    Result: PASS / FAIL
    Present Days Shown: ____
    Expected: ____
    Notes: ________________________________

[ ] TEST 4: Late Deduction
    Result: PASS / FAIL
    Late Count: ____
    Deduction: ₹____
    Notes: ________________________________

[ ] TEST 5: LOP Deduction
    Result: PASS / FAIL
    LOP Days: ____
    Deduction: ₹____
    Notes: ________________________________

Overall Status: ALL PASS / NEEDS FIXES
```

---

## 🎯 Success Criteria

All fixes are working correctly when:

✅ Documents upload without QuotaExceededError
✅ Uploaded files visible in backend `uploads/` folder
✅ Documents viewable from BGV page
✅ Bank documents show confidentiality warning
✅ Payroll shows correct present days from Timesheet (not 0)
✅ Attendance bonus calculates correctly
✅ Late deductions apply at ₹100 per late arrival
✅ LOP deductions calculate from Timesheet LOP days
✅ Backend logs show "TIMESHEET DATA USED"

---

## 📝 Notes for Production Deployment

### Vercel Frontend
- No changes needed - file upload uses relative API paths
- Ensure `VITE_API_BASE_URL` points to production backend

### Railway/Render Backend
- Ensure `uploads/` directory persists (use volume/storage)
- Or use cloud storage (S3, Cloudinary) for production
- Set proper file size limits in `application.properties`:
  ```properties
  spring.servlet.multipart.max-file-size=10MB
  spring.servlet.multipart.max-request-size=10MB
  ```

---

Need help? Check the logs and error messages carefully!
