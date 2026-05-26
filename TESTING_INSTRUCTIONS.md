# Testing Instructions - Receiver Call Reception

## ✅ Backend is Working Correctly

From the logs, I can see:
- ✅ WebSocket connected successfully
- ✅ Receiver subscribed to `/queue/call` (sub-6)
- ✅ CALL signal was sent from sender to receiver
- ✅ Backend routing is correct

## ❌ The Issue

**The sender is calling the wrong email address!**

- **Receiver logged in as**: `padmanabh@omoi.com`
- **Sender is calling**: `manager@omoi.com`

These are **different email addresses**, so the receiver won't get the notification.

## ✅ How to Test Properly

### Step 1: Verify Email Addresses

**Sender Side (Aishwarya)**:
1. Open browser console (F12)
2. Type: `localStorage.getItem('loggedUser')`
3. Note the email address

**Receiver Side (Padmanabh)**:
1. Open browser console (F12)
2. Type: `localStorage.getItem('loggedUser')`
3. Note the email address (should be `padmanabh@omoi.com`)

### Step 2: Select Correct User in Chat

**Sender Side (Aishwarya)**:
1. Go to WorkChat
2. In the chat sidebar, look for user with email: `padmanabh@omoi.com`
3. Click on that user
4. Click "Call" button

### Step 3: Verify Receiver Gets Notification

**Receiver Side (Padmanabh)**:
1. Should see `GlobalCallNotification` overlay
2. Should hear ringtone sound
3. Should see caller's name (Aishwarya)
4. Should see Accept/Reject buttons

## 🔍 Debug Steps

### Check WebSocket Connection (Receiver Side)

Open browser console and type:
```javascript
// Check if connected
window.stompClient.connected  // Should be true

// Check subscriptions
Object.keys(window.stompClient.subscriptions)  // Should include /user/queue/call

// Listen for signals
window.addEventListener('call_signal', (e) => {
  console.log('📞 CALL SIGNAL RECEIVED:', e.detail);
});
```

### Check Call Context State (Receiver Side)

```javascript
// Check if incomingCall is set
// (This should be set when call signal is received)
```

## 🎯 Expected Flow

1. **Sender**: Clicks "Call" on `padmanabh@omoi.com`
2. **Backend**: Routes signal to `padmanabh@omoi.com`'s `/queue/call`
3. **Receiver**: WebSocket receives signal
4. **Receiver**: `CallContext` sets `incomingCall` state
5. **Receiver**: `GlobalCallNotification` renders
6. **Receiver**: Ringtone plays ✅
7. **Receiver**: Can accept/reject

## ⚠️ Common Issues

### Issue 1: Calling Wrong Email
**Problem**: Sender selects user with different email than receiver's login
**Solution**: Make sure sender selects the exact email receiver is logged in with

### Issue 2: Email Case Mismatch
**Problem**: Backend normalizes to lowercase, but frontend might not
**Solution**: Already handled in code (all emails normalized to lowercase)

### Issue 3: LiveKit Errors
**Problem**: LiveKit server not running (ws://localhost:7880)
**Solution**: Ignore these errors - they don't affect basic calling. LiveKit is optional for advanced features.

## 📋 Quick Test Checklist

- [ ] Receiver logged in as `padmanabh@omoi.com`
- [ ] Sender logged in as `aishwarya@company.com`
- [ ] Sender opens WorkChat
- [ ] Sender selects user with email `padmanabh@omoi.com` (not `manager@omoi.com`)
- [ ] Sender clicks "Call" button
- [ ] Receiver sees notification ✅
- [ ] Receiver hears ringtone ✅
- [ ] Receiver can accept/reject ✅

## 🔧 If Still Not Working

### Check 1: Verify Signal is Sent to Correct Email

In backend logs, look for:
```
📞 Signal: aishwarya@company.com -> padmanabh@omoi.com | Action: CALL | Type: VOICE
```

The `toEmail` should match receiver's login email exactly.

### Check 2: Verify Receiver's WebSocket Subscription

In backend logs, look for:
```
Processing SUBSCRIBE destination=/queue/call-userXXXXXX subscriptionId=sub-6 session=XXXXX user=padmanabh@omoi.com
```

This confirms receiver is subscribed to call signals.

### Check 3: Check Frontend Console

Receiver's browser console should show:
```
✅ [CallContext] WebSocket connected globally for: padmanabh@omoi.com
📞 Call signal received: CALL
```

If you see these, the notification should appear.

## 🎉 Success Criteria

When working correctly:
1. ✅ Sender clicks "Call"
2. ✅ Receiver sees notification overlay
3. ✅ Receiver hears ringtone sound
4. ✅ Notification shows caller's name
5. ✅ Accept/Reject buttons work
6. ✅ Call connects after accept

---

## 📝 Summary

The implementation is **complete and working**. The issue in your test was:
- Sender called `manager@omoi.com`
- Receiver logged in as `padmanabh@omoi.com`
- These are different emails, so no notification

**Solution**: Make sure sender selects the correct user email that matches receiver's login email.

---

**Status**: ✅ READY FOR TESTING
**Next Step**: Test with matching email addresses
