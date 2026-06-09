# 🧪 Notification System - Testing Guide

## 🎯 Overview
This guide will help you test the newly fixed sticky notification panel with buzzer count functionality.

---

## 🚀 Pre-requisites

### 1. Backend Running
```bash
cd e:\HRMSProject\HRMS-Backend
# Ensure MongoDB is running
# Start the Spring Boot application on port 8082
```

### 2. Frontend Running
```bash
cd e:\HRMSProject\HRMS-Frontend
npm run dev
# Application should start on http://localhost:5176
```

---

## 🧪 Test Cases

### ✅ Test 1: Notification Badge Visibility
**Goal:** Verify notification badges are visible

**Steps:**
1. Navigate to http://localhost:5176/home
2. Look for the "Notifications" panel at the top of the page
3. Verify buzzer count badge is visible next to "Notifications" title

**Expected Result:**
- If there are unread notifications, you should see `Notifications [X]` where X is the count
- Badge should be red circular with white text
- Badge should be clearly visible

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 2: Sticky Panel Positioning
**Goal:** Verify notification panel stays visible while scrolling

**Steps:**
1. Navigate to http://localhost:5176/home
2. Verify notification panel appears at the top (above KPI cards)
3. Scroll down the page slowly
4. Observe the notification panel behavior

**Expected Result:**
- Panel should stay at the top of the viewport (sticky behavior)
- Panel should not scroll away with other content
- Panel should remain visible until all notifications are read

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 3: Unread Count Accuracy
**Goal:** Verify buzzer count displays correct number

**Steps:**
1. Navigate to http://localhost:5176/home
2. Note the number in the buzzer count badge
3. Count the actual notification items in the panel
4. Verify they match

**Expected Result:**
- Buzzer count should match the number of visible notifications
- Count should update when notifications are clicked (marked as read)

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 4: Mark Notification as Read
**Goal:** Verify clicking a notification marks it as read

**Steps:**
1. Navigate to http://localhost:5176/home
2. Note the current buzzer count (e.g., 3)
3. Click on one notification
4. Observe the notification panel after clicking

**Expected Result:**
- Clicked notification should disappear from the list
- Buzzer count should decrease by 1
- User should be navigated to the notification's link (if provided)
- Read status should persist after page refresh

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 5: Panel Visibility Logic
**Goal:** Verify panel shows/hides correctly based on notification state

**Steps:**
1. Navigate to http://localhost:5176/home
2. Mark all notifications as read by clicking them one by one
3. Observe when the last notification is marked as read

**Expected Result:**
- Panel should be visible when there are unread notifications
- Panel should hide/disappear when all notifications are read
- Bottom notification panel should still exist but show no items

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 6: Individual Notification Badges
**Goal:** Verify individual notification item badges work

**Steps:**
1. Navigate to http://localhost:5176/home
2. Look for notifications that have a `badge` property > 0
3. Verify these notifications show a small badge on the right side

**Expected Result:**
- Notifications with badge > 0 should show a small red circular badge
- Badge should display the number from notification.badge property
- Badge should be positioned on the right side of the notification

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 7: Role-Based Notifications
**Goal:** Verify different roles see appropriate notifications

**Test 7a: Admin User**
**Steps:**
1. Login as admin
2. Navigate to home page
3. Check notification types

**Expected Notifications:**
- "John Doe missed check-in yesterday" (warning)
- "Payroll processed for April 2026" (info)
- "3 employees forgot to checkout" (warning)

**Status:** PASS ☐ FAIL ☐

**Test 7b: Employee/Manager User**
**Steps:**
1. Login as employee or manager
2. Navigate to home page
3. Check notification types

**Expected Notifications:**
- "Payroll credited for April 2026" (success)
- "Insurance claim approved" (info)
- "Reimbursement request pending" (pending)

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 8: Notification Navigation
**Goal:** Verify clicking notifications navigates correctly

**Steps:**
1. Navigate to http://localhost:5176/home
2. Click a notification that has a link (e.g., payroll notification)
3. Verify navigation

**Expected Result:**
- Should navigate to the page specified in notification.link
- State should be passed if notification.focus exists
- Notification should be marked as read even if navigation occurs

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 9: Auto-Refresh Functionality
**Goal:** Verify notifications refresh automatically

**Steps:**
1. Navigate to http://localhost:5176/home
2. Keep the page open for 30+ seconds
3. Monitor console for API calls to `/api/notifications`

**Expected Result:**
- Notifications should be fetched every 30 seconds
- New notifications should appear automatically
- No manual refresh needed

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 10: LocalStorage Persistence
**Goal:** Verify read notifications persist across sessions

**Steps:**
1. Navigate to http://localhost:5176/home
2. Click and read 2-3 notifications
3. Refresh the page (F5)
4. Check if the same notifications reappear

**Expected Result:**
- Previously read notifications should NOT reappear
- Only unread notifications should be visible
- localStorage key `readNotifications` should contain IDs of read notifications

**Verification:**
- Open browser DevTools → Application → Local Storage
- Look for `readNotifications` key
- Verify it contains array of notification IDs

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 11: Bottom Panel Sync
**Goal:** Verify both top and bottom notification panels show same data

**Steps:**
1. Navigate to http://localhost:5176/home
2. Scroll down to view the bottom notification panel
3. Compare notifications in top panel vs bottom panel

**Expected Result:**
- Both panels should show the same notifications
- Both should have the same buzzer count
- Clicking a notification in either panel should update both

**Status:** PASS ☐ FAIL ☐

---

### ✅ Test 12: Notification Colors
**Goal:** Verify different notification types have correct colors

**Steps:**
1. Navigate to http://localhost:5176/home
2. Check notification background colors

**Expected Colors:**
| Type | Color | CSS Class |
|------|-------|-----------|
| Success | Green | .notify.success |
| Info | Blue | .notify.info |
| Warning | Orange | .notify.warning |
| Pending | Purple | .notify.pending |
| Error | Red | .notify.red |

**Status:** PASS ☐ FAIL ☐

---

## 🐛 Common Issues & Solutions

### Issue 1: Notifications Not Appearing
**Solution:**
- Check if backend is running on port 8082
- Verify MongoDB is running and has notification collection
- Check browser console for API errors
- Verify API_BASE_URL in .env file

### Issue 2: Buzzer Count Shows 0
**Solution:**
- Check if `systemNotifications` state has data
- Verify `readNotifications` array in localStorage
- Clear localStorage and refresh page
- Check if notifications have valid `id` property

### Issue 3: Panel Not Sticky
**Solution:**
- Check if CSS class `notification-panel-sticky` is applied
- Verify CSS has `position: sticky` and `top: 80px`
- Adjust `top` value based on your header height
- Check z-index conflicts

### Issue 4: Badge Not Visible
**Solution:**
- Verify CSS has `display: flex` (not `display: none`)
- Check if notification has `badge` property > 0
- Inspect element in DevTools to verify CSS is applied

---

## 📊 Test Summary

**Total Tests:** 12  
**Tests Passed:** ____ / 12  
**Tests Failed:** ____ / 12  
**Status:** PASS ☐ FAIL ☐

---

## 🔍 Additional Verification

### DevTools Console Checks
1. Open browser DevTools (F12)
2. Check Console for:
   - No errors related to notifications
   - API calls to `/api/notifications` every 30 seconds
   - `systemNotifications` state updates

### Network Tab Verification
1. Open Network tab in DevTools
2. Filter by `notifications`
3. Verify:
   - Status: 200 OK
   - Response has array of notification objects
   - Headers show correct Content-Type

### Backend Logs
1. Check Spring Boot console for:
   - No errors on `/api/notifications` endpoint
   - MongoDB connection successful
   - NotificationController handling requests

---

## ✅ Sign-Off

**Tester Name:** ________________  
**Date:** ________________  
**Overall Status:** PASS ☐ FAIL ☐  
**Comments:**

---

**Note:** If any test fails, please document:
1. Steps to reproduce
2. Expected vs actual behavior
3. Screenshots/error messages
4. Browser and version used
