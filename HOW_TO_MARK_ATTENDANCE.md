# 📋 HOW TO MARK ATTENDANCE - QUICK GUIDE

## 🎯 **OVERVIEW**
This guide shows you exactly how to mark attendance using the **Attendance page UI** (no hardcoding, no database scripts).

---

## 🖥️ **METHOD 1: EMPLOYEE MARKS OWN ATTENDANCE**

### **Step-by-Step Instructions:**

1. **Login to the system** with employee credentials
   - Example: Login as Mahesh

2. **Navigate to Attendance Page:**
   - URL: `http://localhost:5176/attendance`
   - Or click "Attendance" in the sidebar

3. **Select the date:**
   - Use the date picker at the top
   - Select the date you want to mark attendance for
   - Example: Select "July 1, 2026"

4. **Check In:**
   - Click the **"Check In"** button
   - Browser will ask for **location permission** → Click "Allow"
   - System will record:
     - ✅ Current time (e.g., 09:00 AM)
     - ✅ GPS location
     - ✅ Employee details
     - ✅ Whether arrival is late (after 10:00 AM)
   - You'll see an alert: **"Check-in successful"**

5. **Check Out (Later in the day):**
   - Select the **same date**
   - Click the **"Check Out"** button
   - System will record:
     - ✅ Current time (e.g., 06:00 PM)
     - ✅ GPS location
     - ✅ Total hours worked
   - You'll see an alert: **"Check-out successful"**

6. **Work From Home:**
   - If working from home, click **"Work From Home"** button
   - This marks attendance as "WFH" type
   - Location will be recorded as "WFH"

---

## 👨‍💼 **METHOD 2: ADMIN/MANAGER MARKS ATTENDANCE FOR TEAM**

### **Important:** Currently, the system doesn't have a direct "Mark for Others" UI. But managers can **edit attendance** after initial marking.

### **Workaround for Testing:**

**Option A: Login as Each Employee**
1. Logout from current account
2. Login as the employee (e.g., Mahesh)
3. Mark attendance using Method 1
4. Repeat for each employee

**Option B: Use Manager Edit Feature**
1. Login as Admin (Aishwarya)
2. Go to Attendance page
3. Find an employee with "Absent" status
4. Click **"Edit"** button (if available in manager/admin view)
5. Enter check-in and check-out times manually
6. Save

---

## 📅 **MARKING ATTENDANCE FOR PAST DATES**

The system **allows selecting past dates**. Here's how:

### **For July 1, 2026:**
1. Login as employee
2. Go to Attendance page
3. **Select date:** July 1, 2026 (use date picker)
4. Click "Check In" → System records with current time but for July 1
5. Click "Check Out" → System records checkout for July 1

**Note:** The system will use the **current time** when you click, but associate it with the **selected date**.

---

## 🕐 **SIMULATING LATE ARRIVALS**

To test late arrival penalties:

### **Method:** Mark attendance after 10:00 AM

1. Select the date
2. Make sure your **system time is after 10:00 AM**
3. Click "Check In"
4. System will automatically mark it as **"Late: Yes"**
5. This will trigger a **₹100 deduction** in payroll calculation

**To simulate early check-in:**
- Ensure your system time is **before 10:00 AM** when clicking "Check In"
- System will mark it as **"Late: No"**

---

## 📊 **CREATING REALISTIC TEST DATA**

### **Scenario: 10 Working Days in July 2026**

Here's a sample attendance pattern for **Mahesh**:

| Date | Day | Action | Notes |
|------|-----|--------|-------|
| Jul 1 | Tue | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 2 | Wed | Check In at 10:30 AM, Check Out at 6:00 PM | **Late** |
| Jul 3 | Thu | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 4 | Fri | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 5 | Sat | **Weekend - No attendance** | - |
| Jul 6 | Sun | **Weekend - No attendance** | - |
| Jul 7 | Mon | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 8 | Tue | Check In at 10:15 AM, Check Out at 6:00 PM | **Late** |
| Jul 9 | Wed | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 10 | Thu | Check In at 9:00 AM, Check Out at 6:00 PM | On time |
| Jul 11 | Fri | **No check-in** | Absent |
| Jul 12 | Sat | **Weekend - No attendance** | - |
| Jul 13 | Sun | **Weekend - No attendance** | - |
| Jul 14 | Mon | Check In at 9:00 AM, Check Out at 6:00 PM | On time |

**Result:**
- Present: 9 days
- Absent: 1 day
- Late: 2 days
- Attendance %: 90%

---

## 🔍 **VERIFYING ATTENDANCE RECORDS**

After marking attendance:

1. **Stay on the Attendance page**
2. **Table will show:**
   - ✅ Employee name
   - ✅ Date
   - ✅ Check-in time
   - ✅ Check-out time
   - ✅ Total hours worked
   - ✅ Location (GPS coordinates)
   - ✅ Late status (Yes/No)
   - ✅ Status (Present/Absent/Pending Approval)
   - ✅ Type (Office/WFH)

3. **Absent employees** will show automatically:
   - If an employee didn't check in for a working day
   - Status shows as "Absent"
   - Check-in/Check-out shows as "-"

---

## 💡 **TIPS FOR TESTING**

### **Tip 1: Use Multiple Browser Profiles**
- Open **Chrome Profile 1** → Login as Aishwarya
- Open **Chrome Profile 2** → Login as Mahesh
- Mark attendance simultaneously

### **Tip 2: Use Incognito Windows**
- Regular window → Admin login
- Incognito window → Employee login
- Mark attendance without logging out

### **Tip 3: Adjust System Time (Advanced)**
- If you need to simulate specific check-in times
- Temporarily change your computer's system time
- Mark attendance
- Change time back to normal

### **Tip 4: Use Manager Edit Feature**
- If available, admin can edit attendance directly
- Faster for creating test data
- Click "Edit" next to any attendance record

---

## 📝 **CHECKLIST FOR PAYROLL TESTING**

Before running payroll auto-calculate:

- [ ] Marked attendance for **at least 10 working days**
- [ ] Created **2-3 late arrivals** for one employee
- [ ] Created **1-2 absent days** for another employee
- [ ] Verified records appear in **Attendance table**
- [ ] Checked **attendance percentage** is calculating correctly
- [ ] Confirmed employee IDs match between **Attendance** and **Payroll**

---

## 🐛 **COMMON ISSUES**

### **Issue: "Already checked in for selected date"**
**Cause:** You already have a check-in record for that date  
**Solution:** 
- Select a different date, OR
- Click "Check Out" to complete that day, OR
- Have admin delete the existing record

### **Issue: Location access denied**
**Cause:** Browser blocked location permission  
**Solution:**
1. Click the 🔒 (lock) icon in browser address bar
2. Allow location permission
3. Refresh the page
4. Try check-in again

### **Issue: Check-in button disabled**
**Cause:** Selected date is a weekend (Saturday/Sunday)  
**Solution:** Select a weekday (Monday-Friday)

### **Issue: Attendance not showing in table**
**Cause:** Table hasn't refreshed  
**Solution:** 
- Refresh the page (F5)
- System auto-refreshes every 30 seconds
- Wait a moment and table will update

---

## 🎯 **SUMMARY**

**To mark attendance for payroll testing:**
1. ✅ Login as employee
2. ✅ Select the date
3. ✅ Click "Check In"
4. ✅ Click "Check Out" (later)
5. ✅ Repeat for multiple days
6. ✅ Create variety (late arrivals, absences)
7. ✅ Verify in attendance table
8. ✅ Run payroll auto-calculate

**That's it! No database scripts, no hardcoding needed!** 🎉
