# Multi-Tenant HRMS Testing Guide

## Overview

This guide shows you how to test the multi-tenant HRMS system locally and verify that all three company themes work correctly **without any business logic changes**.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Testing Setup](#local-testing-setup)
3. [Testing Company A](#testing-company-a-talenthub-solutions)
4. [Testing Company B](#testing-company-b-workforce-pro)
5. [Testing Company C](#testing-company-c-peoplesync-enterprise)
6. [Responsive Design Testing](#responsive-design-testing)
7. [Business Logic Verification](#business-logic-verification)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

✅ Node.js installed (v16 or higher)
✅ npm installed
✅ Backend running on `localhost:8082`
✅ MongoDB Atlas accessible

---

## Local Testing Setup

### Step 1: Install Dependencies

```bash
cd HRMS-Frontend
npm install
```

### Step 2: Verify Environment Files Exist

Check that these files exist:
- `.env.company-a`
- `.env.company-b`
- `.env.company-c`

---

## Testing Company A (TalentHub Solutions)

### Start Company A Theme

```bash
cd HRMS-Frontend
npm run dev:company-a
```

**Expected Output:**
```
VITE v7.0.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Open Browser

1. **Go to**: http://localhost:5173
2. **Wait for theme to load** (you may see a loading spinner)

### Verify Company A Branding

✅ **Browser Tab:**
- Title: "TalentHub Solutions - HRMS"
- Favicon: (will show "TH" placeholder until replaced)

✅ **Login Screen:**
- Company Name: "TalentHub Solutions" displayed above login form
- Logo: "TH" initials in **blue background** (#1E40AF)
- Primary color: **Deep Blue**

✅ **After Login - Navigation Header:**
- Company Name: "TalentHub Solutions" in header
- Logo: "TH" initials in navigation bar
- Header background: **Blue theme**

✅ **Colors Throughout App:**
- Primary buttons: **Blue** (#1E40AF)
- Links: **Blue**
- Hover states: **Darker blue**

### Test Business Logic (Company A)

1. **Login**: Enter credentials → Should work normally
2. **Navigate to Dashboard**: Should load data correctly
3. **Check Attendance**: Should display attendance records
4. **Check Leave**: Should show leave applications
5. **Check Payroll**: Should load payroll data
6. **Check all other features**: All should work identically

### Stop Server

Press `Ctrl+C` in the terminal

---

## Testing Company B (WorkForce Pro)

### Start Company B Theme

```bash
cd HRMS-Frontend
npm run dev:company-b
```

### Open Browser

1. **Go to**: http://localhost:5173
2. **Wait for theme to load**

### Verify Company B Branding

✅ **Browser Tab:**
- Title: "WorkForce Pro - HRMS"

✅ **Login Screen:**
- Company Name: "WorkForce Pro"
- Logo: "WP" initials in **green background** (#047857)
- Primary color: **Forest Green**

✅ **After Login:**
- Company Name: "WorkForce Pro" in header
- Logo: "WP" initials
- Header background: **Green theme**

✅ **Colors Throughout App:**
- Primary buttons: **Green** (#047857)
- Links: **Green**
- Hover states: **Darker green**

### Test Business Logic (Company B)

- Same tests as Company A
- All features should work identically
- Only colors/branding different

### Stop Server

Press `Ctrl+C` in the terminal

---

## Testing Company C (PeopleSync Enterprise)

### Start Company C Theme

```bash
cd HRMS-Frontend
npm run dev:company-c
```

### Open Browser

1. **Go to**: http://localhost:5173
2. **Wait for theme to load**

### Verify Company C Branding

✅ **Browser Tab:**
- Title: "PeopleSync Enterprise - HRMS"

✅ **Login Screen:**
- Company Name: "PeopleSync Enterprise"
- Logo: "PS" initials in **purple background** (#5B21B6)
- Primary color: **Deep Purple**

✅ **After Login:**
- Company Name: "PeopleSync Enterprise" in header
- Logo: "PS" initials
- Header background: **Purple theme**

✅ **Colors Throughout App:**
- Primary buttons: **Purple** (#5B21B6)
- Links: **Purple**
- Hover states: **Darker purple**

### Test Business Logic (Company C)

- Same tests as Company A & B
- All features should work identically
- Only colors/branding different

### Stop Server

Press `Ctrl+C` in the terminal

---

## Responsive Design Testing

### Test on Different Screen Sizes

1. **Open DevTools**: Press `F12`
2. **Click Device Toolbar**: Icon in top-left (or `Ctrl+Shift+M`)
3. **Select Devices**:

#### Mobile (iPhone SE - 375px)
- Navigation: Hamburger menu should appear
- Logo: Should display (48x48px)
- Content: Single column layout
- Touch targets: Minimum 44x44 pixels
- All interactive elements clickable with finger

#### Tablet (iPad - 768px)
- Navigation: Full sidebar or collapsible
- Logo: Should display clearly
- Content: Two-column layout where appropriate
- Tables: Horizontal scroll if needed

#### Desktop (1920px)
- Navigation: Full sidebar visible
- Logo: Should display clearly
- Content: Multi-column layout
- Tables: Full width display
- Hover effects: Should work on mouse over

### Test Orientation Changes

1. **Rotate device** (in DevTools)
2. **Verify**: Layout adjusts within 300ms
3. **Check**: No content cutoff or overflow

---

## Business Logic Verification

### Critical Features to Test (All Companies)

#### Authentication
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (should fail)
- ✅ Forgot password
- ✅ Logout
- ✅ Session persistence

#### Dashboard
- ✅ KPI cards display correctly
- ✅ Charts render properly
- ✅ Recent activity shows
- ✅ Notifications work

#### Employee Management
- ✅ View employee list
- ✅ View employee details
- ✅ Create new employee (if admin)
- ✅ Update employee info
- ✅ Search/filter employees

#### Attendance
- ✅ Check-in/Check-out
- ✅ View attendance history
- ✅ Edit attendance (if manager)
- ✅ Export attendance data

#### Leave Management
- ✅ Apply for leave
- ✅ View leave balance
- ✅ Approve/reject leave (if manager)
- ✅ View leave history

#### Payroll
- ✅ View payslips
- ✅ Download payslips
- ✅ Process payroll (if admin)
- ✅ Update salary details (if admin)

#### Recruitment
- ✅ View job postings
- ✅ Apply for internal jobs
- ✅ View candidates (if recruiter)
- ✅ Schedule interviews (if recruiter)

#### Performance
- ✅ View performance reviews
- ✅ Submit self-assessment
- ✅ View team performance (if manager)
- ✅ Set goals

#### Tasks
- ✅ Create task
- ✅ Update task status
- ✅ Assign task to others
- ✅ View task history

#### WorkChat
- ✅ Send messages
- ✅ Receive messages
- ✅ Voice/Video calls
- ✅ Screen sharing

### Verification Checklist

| Feature | Company A | Company B | Company C |
|---------|-----------|-----------|-----------|
| Login | ⬜ | ⬜ | ⬜ |
| Dashboard | ⬜ | ⬜ | ⬜ |
| Attendance | ⬜ | ⬜ | ⬜ |
| Leave | ⬜ | ⬜ | ⬜ |
| Payroll | ⬜ | ⬜ | ⬜ |
| Recruitment | ⬜ | ⬜ | ⬜ |
| Performance | ⬜ | ⬜ | ⬜ |
| Tasks | ⬜ | ⬜ | ⬜ |
| WorkChat | ⬜ | ⬜ | ⬜ |
| Responsive | ⬜ | ⬜ | ⬜ |

---

## Console Verification

### Open Browser Console (F12 → Console)

**Expected Messages (No Errors):**

```
[ThemeLoader] Loading theme for tenant: company-a
[ThemeLoader] Successfully loaded theme: TalentHub Solutions
[CSSInjector] Injecting theme colors...
[CSSInjector] Theme colors injected successfully
[CSSInjector] Primary: #1E40AF | Hover: #1E3A8A | Active: #1E3A8A
[ThemeContext] Theme initialized successfully: TalentHub Solutions
```

**No Errors Like:**
- ❌ Theme validation failed
- ❌ Missing required property
- ❌ Invalid hex color code
- ❌ Failed to load logo image (unless logo file doesn't exist yet)

---

## Troubleshooting

### Theme Not Loading

**Symptom**: Default blue theme shows instead of company theme

**Solutions**:
1. Check that `VITE_TENANT_ID` is set correctly in `.env.company-x` file
2. Verify you started the correct npm script (`npm run dev:company-a`)
3. Hard refresh browser (`Ctrl+Shift+R`)
4. Clear browser cache
5. Check console for errors

### Logo Not Displaying

**Symptom**: No logo shows, or "TH/WP/PS" initials show

**This is Expected** if you haven't added logo files yet!

**Solutions**:
1. Check if logo files exist in `public/logos/company-x/`
2. If logos don't exist, initials are correct fallback
3. To add logos, see CUSTOMIZATION_GUIDE.md

### Colors Not Applying

**Symptom**: All pages show same default colors

**Solutions**:
1. Check browser console for CSS injection errors
2. Verify theme JSON files are valid
3. Clear browser cache completely
4. Restart dev server

### Business Logic Broken

**Symptom**: Features don't work (login fails, data doesn't load, etc.)

**Solutions**:
1. **Verify backend is running**: `http://localhost:8082`
2. Check API URLs in `.env.company-x` files
3. Check MongoDB connection
4. Check browser console for API errors
5. Check backend logs

### Port Already in Use

**Symptom**: Error: `Port 5173 is already in use`

**Solutions**:
```bash
# Stop other Vite processes
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use different port:
npm run dev:company-a -- --port 5174
```

---

## Performance Testing

### Check Load Times

1. **Open DevTools** → **Network** tab
2. **Reload page** (`Ctrl+R`)
3. **Verify**:
   - Page loads < 3 seconds
   - Theme loads < 500ms
   - Logo loads < 200ms (if exists)

### Check Memory Usage

1. **Open DevTools** → **Memory** tab
2. **Take heap snapshot**
3. **Verify**: No memory leaks after navigation

---

## Comparison Testing

### Visual Comparison

**Open all 3 companies side-by-side:**

1. **Browser 1**: http://localhost:5173 (Company A - Blue)
2. **Browser 2**: http://localhost:5174 (Company B - Green)  
3. **Browser 3**: http://localhost:5175 (Company C - Purple)

**Verify:**
- Only colors and branding differ
- All layouts identical
- All features work identically
- Data displays same way

---

## Test Summary Checklist

### Before Deployment

- [ ] All 3 company themes load correctly
- [ ] Company names display correctly
- [ ] Logo/initials display correctly
- [ ] Colors apply throughout app
- [ ] Browser title updates per company
- [ ] No console errors
- [ ] All business logic works identically
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Login/logout works for all companies
- [ ] Data loads correctly for all companies
- [ ] Navigation works for all companies
- [ ] Forms submit correctly for all companies

### After Passing All Tests

✅ **Ready for Deployment!**

Follow DEPLOYMENT_GUIDE.md to deploy to Vercel and Render.

---

## Quick Test Commands

```bash
# Test Company A (Blue Theme)
npm run dev:company-a

# Test Company B (Green Theme)
npm run dev:company-b

# Test Company C (Purple Theme)
npm run dev:company-c

# Build for production (Company A)
npm run build:company-a

# Build for production (Company B)
npm run build:company-b

# Build for production (Company C)
npm run build:company-c
```

---

## Support

If you encounter issues:

1. Check browser console for errors (F12 → Console)
2. Check this guide's troubleshooting section
3. Verify environment variables are correct
4. Ensure backend is running
5. Clear browser cache and try again

---

**Happy Testing! 🎉**

Remember: Only colors and branding change - all business logic remains identical!
