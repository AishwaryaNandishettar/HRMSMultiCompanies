# Recruitment - Admin & Manager Only

## Change Made

Removed **Employee** access from Recruitment module. Now only **Admin** and **Manager** can access Recruitment.

---

## Files Modified

### 1. App.jsx - Route Access
**File:** `HRMSProject/HRMS-Frontend/src/App.jsx`

**Changed:**
```javascript
// ❌ BEFORE (Employee had access)
<Route
  path="/Recruitment"
  element={
    <ProtectedRoute roles={["admin", "manager", "employee"]}>
      <RecruitmentDashboard />
    </ProtectedRoute>
  }
/>

// ✅ AFTER (Employee removed)
<Route
  path="/Recruitment"
  element={
    <ProtectedRoute roles={["admin", "manager"]}>
      <RecruitmentDashboard />
    </ProtectedRoute>
  }
/>
```

### 2. Sidebar.jsx - Navigation Visibility
**File:** `HRMSProject/HRMS-Frontend/src/Components/Sidebar.jsx`

**Changed:**
```javascript
// ❌ BEFORE (Visible to Employee)
{(role === "admin" || role === "manager" || role === "employee") && (
  <li>
    <NavLink to="/recruitment">
      <FaUserTie />
      {isOpen && <span>Recruitment</span>}
    </NavLink>
  </li>
)}

// ✅ AFTER (Employee removed)
{(role === "admin" || role === "manager") && (
  <li>
    <NavLink to="/recruitment">
      <FaUserTie />
      {isOpen && <span>Recruitment</span>}
    </NavLink>
  </li>
)}
```

---

## Updated Role-Based Access

### Recruitment Module

| Page | Admin | Manager | Employee |
|------|-------|---------|----------|
| Recruitment Dashboard | ✅ | ✅ | ❌ |
| Pipeline Table | ✅ | ✅ | ❌ |
| ATS Table | ✅ | ✅ | ❌ |

---

## What Employees Will See

- ❌ **No "Recruitment" menu item** in sidebar
- ❌ **Cannot access `/recruitment` URL** (protected route will block)
- ✅ Can still access all other employee features:
  - Home
  - Profile
  - Attendance
  - Timesheet
  - Leave
  - Payroll
  - Work Chat
  - Tasks

---

## What Admin & Manager Will See

- ✅ **"Recruitment" menu item** visible in sidebar
- ✅ **Full access** to all Recruitment features:
  - Recruitment Dashboard
  - Pipeline Table
  - ATS (Applicant Tracking System)

---

## Testing

### As Employee:
1. Login as employee
2. Check sidebar - "Recruitment" should **not** be visible
3. Try accessing `/recruitment` directly - Should be **blocked** by ProtectedRoute

### As Admin/Manager:
1. Login as admin or manager
2. Check sidebar - "Recruitment" should be **visible**
3. Click Recruitment - Should work normally
4. Can access Pipeline and ATS views

---

## Summary

✅ Recruitment removed from Employee role
✅ Only Admin and Manager can access Recruitment
✅ No logic changes - only role filter updated
✅ Navigation and routes updated consistently

**Employees now have no access to Recruitment module.**
