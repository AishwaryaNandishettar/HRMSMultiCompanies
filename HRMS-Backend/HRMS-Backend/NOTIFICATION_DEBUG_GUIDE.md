# 🔍 Notification Debug Guide

## Issue: No Notifications Showing

If you're seeing an empty notification panel, follow these steps:

---

## 🛠️ Quick Fix Steps

### Step 1: Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Find **Local Storage** → `http://localhost:5176`
4. Find the key `readNotifications`
5. Right-click → **Delete**
6. Refresh the page (F5)

**OR**

### Step 2: Use the Reset Button
1. Look for the red "Reset" button in the notification panel header
2. Click it to clear all read notification tracking
3. Notifications should immediately reappear

---

## 🔍 Debugging Steps

### Check Console Logs
Open browser console (F12) and look for these log messages:

```
📢 System Notifications loaded: [...]
🔔 Total systemNotifications: X
🔔 Unread notifications: Y
🔔 Read notification IDs: [...]
```

**What they mean:**
- **System Notifications loaded:** Shows the notifications created for your role
- **Total systemNotifications:** Total count of all notifications
- **Unread notifications:** Count of notifications not yet marked as read
- **Read notification IDs:** Array of notification IDs stored in localStorage

---

## 🐛 Common Issues & Solutions

### Issue 1: All Notifications Marked as Read
**Symptom:** 
- Console shows `Total systemNotifications: 3`
- Console shows `Unread notifications: 0`
- Panel is empty or not visible

**Solution:**
1. Click the "Reset" button in the notification panel header
2. OR manually clear localStorage key `readNotifications`
3. OR run this in browser console:
   ```javascript
   localStorage.removeItem('readNotifications');
   location.reload();
   ```

---

### Issue 2: No Notifications Being Created
**Symptom:**
- Console shows `Total systemNotifications: 0`
- No log message "📢 System Notifications loaded"

**Solution:**
1. Check if `user` object is loaded
2. Check browser console for errors
3. Verify `loadRoleBasedData()` is being called
4. Check network tab for API errors

**Debug in console:**
```javascript
// Check user object
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Check if notifications state exists
// (Open React DevTools → Components → Home → hooks → systemNotifications)
```

---

### Issue 3: Wrong Role Showing Wrong Notifications
**Symptom:**
- You're an admin but seeing employee notifications
- Or vice versa

**Solution:**
1. Check your user role:
   ```javascript
   console.log('User role:', JSON.parse(localStorage.getItem('user')).role);
   ```
2. Verify role is lowercase in code
3. Check `loadSystemNotifications()` function logic

---

### Issue 4: Notifications Not Refreshing
**Symptom:**
- Clicked a notification but it still shows
- Count doesn't decrease

**Solution:**
1. Check if localStorage is working:
   ```javascript
   localStorage.setItem('test', 'works');
   console.log(localStorage.getItem('test')); // Should show 'works'
   ```
2. Clear browser cache and try again
3. Check if you're in incognito/private mode (localStorage might be restricted)

---

## 🧪 Manual Testing

### Test 1: Check Notification State
1. Open browser console
2. Run:
   ```javascript
   // Check systemNotifications state (needs React DevTools)
   // OR add this temporarily to Home.jsx:
   console.log('systemNotifications:', systemNotifications);
   ```

### Test 2: Force Create Notifications
Add this temporarily in your code to force create notifications:

```javascript
// Add after const [systemNotifications, setSystemNotifications] = useState([]);
useEffect(() => {
  console.log('🔔 Force creating test notifications');
  setSystemNotifications([
    { id: 'test-1', type: 'success', message: 'Test notification 1', badge: 0, link: '/home' },
    { id: 'test-2', type: 'info', message: 'Test notification 2', badge: 1, link: '/home' },
    { id: 'test-3', type: 'warning', message: 'Test notification 3', badge: 2, link: '/home' },
  ]);
}, []);
```

### Test 3: Check Read Status
1. Open browser console
2. Run:
   ```javascript
   console.log('Read notifications:', localStorage.getItem('readNotifications'));
   ```
3. Should show JSON array like: `["1","2","3"]`

---

## 📊 Expected Behavior

### For Admin Users:
Should see 3 notifications:
1. ⚠️ "John Doe missed check-in yesterday" (warning, badge: 1)
2. ℹ️ "Payroll processed for April 2026" (info, badge: 0)
3. ⚠️ "3 employees forgot to checkout" (warning, badge: 3)

### For Employee/Manager Users:
Should see 3 notifications:
1. ✅ "Payroll credited for April 2026" (success, badge: 0)
2. ℹ️ "Insurance claim approved" (info, badge: 0)
3. 🟣 "Reimbursement request pending" (pending, badge: 1)

---

## 🔧 Reset Everything

If nothing works, try this complete reset:

### 1. Clear All Browser Data
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Clear Backend Notifications (if needed)
If using MongoDB backend notifications:
```javascript
// Connect to MongoDB
use hrms_db;
db.notifications.deleteMany({});
```

### 3. Restart Frontend
```bash
# Stop the dev server (Ctrl+C)
cd e:\HRMSProject\HRMS-Frontend
npm run dev
```

---

## 📝 Quick Checklist

Before reporting an issue, verify:

- [ ] Browser console shows no errors
- [ ] User is logged in (`localStorage.getItem('user')` exists)
- [ ] Role is correct (`user.role` is 'admin', 'employee', or 'manager')
- [ ] `systemNotifications` state has data (check console logs)
- [ ] `readNotifications` localStorage key is checked
- [ ] Tried clicking "Reset" button
- [ ] Tried clearing localStorage manually
- [ ] Page was refreshed after clearing localStorage
- [ ] No ad blockers or extensions blocking localStorage

---

## 🎯 Current Fix Applied

The notification IDs now use timestamps to avoid localStorage conflicts:
- Old: `{ id: 1, ... }`
- New: `{ id: 'emp-notif-1-1234567890', ... }`

This ensures every page load creates fresh notification IDs that won't match old localStorage entries.

---

## 💡 Quick Commands

### Clear read notifications (browser console):
```javascript
localStorage.removeItem('readNotifications');
location.reload();
```

### Check current state (browser console):
```javascript
console.log('User:', localStorage.getItem('user'));
console.log('Read:', localStorage.getItem('readNotifications'));
```

### Force show all notifications (temporary code):
Add to Home.jsx temporarily:
```javascript
setReadNotifications([]); // Clear read status
```

---

## 🆘 Still Not Working?

1. Check browser console for errors
2. Check network tab for API call failures
3. Verify backend is running
4. Check if MongoDB has notifications collection
5. Try a different browser
6. Clear browser cache completely
7. Check if localStorage is enabled in browser settings

---

**Remember:** The "Reset" button in the notification panel is your quickest fix! Just click it and all notifications will reappear.
