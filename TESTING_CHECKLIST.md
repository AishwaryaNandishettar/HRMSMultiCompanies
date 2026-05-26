# Receiver Call Reception - Testing Checklist

## Pre-Testing Setup

- [ ] Backend is running on port 8082
- [ ] Frontend is running on port 5173
- [ ] Two browser windows/tabs open
- [ ] Both users logged in
- [ ] WebSocket connection is working

---

## Test 1: Basic Call Reception ✅

### Setup
- [ ] User A logged in on Window 1
- [ ] User B logged in on Window 2
- [ ] Both on WorkChat page

### Execution
- [ ] User A: Open WorkChat
- [ ] User A: Select User B from chat list
- [ ] User A: Click "Voice Call" button
- [ ] Wait 2 seconds

### Verification
- [ ] User B: See `GlobalCallNotification` overlay
- [ ] User B: Hear ringtone sound
- [ ] User B: See caller's name (User A)
- [ ] User B: See "Incoming Voice Call" text
- [ ] User B: See Accept button (green)
- [ ] User B: See Reject button (red)
- [ ] User A: See "Calling..." screen
- [ ] User A: See User B's name

### Result
- [ ] PASS / [ ] FAIL

---

## Test 2: Call Acceptance ✅

### Setup
- [ ] From Test 1, User B sees notification

### Execution
- [ ] User B: Click "Accept" button
- [ ] Wait 3 seconds

### Verification
- [ ] User B: Notification disappears
- [ ] User B: Navigated to WorkChat (if not already there)
- [ ] User B: See AdvancedCallScreen
- [ ] User A: See AdvancedCallScreen
- [ ] Both: See video/audio controls
- [ ] Both: See participant list
- [ ] Both: See call duration timer

### Result
- [ ] PASS / [ ] FAIL

---

## Test 3: Call Rejection ✅

### Setup
- [ ] User A: Initiate new call to User B
- [ ] User B: See notification

### Execution
- [ ] User B: Click "Reject" button
- [ ] Wait 2 seconds

### Verification
- [ ] User B: Notification disappears
- [ ] User A: See "Call rejected" or timeout
- [ ] User A: Call screen closes
- [ ] User A: Back to chat screen
- [ ] User B: Back to chat screen

### Result
- [ ] PASS / [ ] FAIL

---

## Test 4: Call Timeout ✅

### Setup
- [ ] User A: Initiate call to User B
- [ ] User B: See notification

### Execution
- [ ] User B: Don't respond
- [ ] Wait 30 seconds

### Verification
- [ ] User A: Call times out after ~30 seconds
- [ ] User A: See "Call ended" or similar
- [ ] User A: Call screen closes
- [ ] User B: Notification disappears
- [ ] User B: Back to chat screen

### Result
- [ ] PASS / [ ] FAIL

---

## Test 5: Multiple Pages ✅

### Setup
- [ ] User B logged in
- [ ] User B on Home page (not WorkChat)

### Execution
- [ ] User A: Initiate call to User B
- [ ] Wait 2 seconds

### Verification
- [ ] User B: See `GlobalCallNotification` overlay on Home page
- [ ] User B: Hear ringtone sound
- [ ] User B: See caller's name
- [ ] User B: Click "Accept"
- [ ] User B: Navigated to WorkChat
- [ ] Both: Call connects

### Result
- [ ] PASS / [ ] FAIL

---

## Test 6: Video Call ✅

### Setup
- [ ] User A: Open WorkChat
- [ ] User A: Select User B

### Execution
- [ ] User A: Click "Video Call" button
- [ ] Wait 2 seconds

### Verification
- [ ] User B: See notification
- [ ] User B: See "Incoming Video Call" text
- [ ] User B: Hear ringtone
- [ ] User B: Click "Accept"
- [ ] Both: See video streams

### Result
- [ ] PASS / [ ] FAIL

---

## Test 7: Ringtone Sound ✅

### Setup
- [ ] User B: Volume is ON
- [ ] User B: Not muted

### Execution
- [ ] User A: Initiate call
- [ ] Wait for notification

### Verification
- [ ] User B: Hear ringtone sound
- [ ] Sound continues until Accept/Reject
- [ ] Sound stops after Accept/Reject

### Result
- [ ] PASS / [ ] FAIL

---

## Test 8: Browser Notification ✅

### Setup
- [ ] Browser notifications enabled
- [ ] User B: Notification permission granted

### Execution
- [ ] User A: Initiate call
- [ ] Wait for notification

### Verification
- [ ] User B: See browser notification (if enabled)
- [ ] Notification shows caller's name
- [ ] Notification shows call type (Voice/Video)

### Result
- [ ] PASS / [ ] FAIL

---

## Test 9: Call Controls ✅

### Setup
- [ ] Call is connected between User A and User B

### Execution
- [ ] User A: Click mute button
- [ ] User B: See mute indicator
- [ ] User A: Click camera off button
- [ ] User B: See video off indicator
- [ ] User A: Click end call button

### Verification
- [ ] Mute/unmute works
- [ ] Camera on/off works
- [ ] End call works
- [ ] Both: Call disconnects
- [ ] Both: Back to chat screen

### Result
- [ ] PASS / [ ] FAIL

---

## Test 10: Concurrent Calls ✅

### Setup
- [ ] User A, User B, User C all logged in

### Execution
- [ ] User A: Call User B
- [ ] User B: Accept
- [ ] User A: Call User C (while on call with B)
- [ ] User C: See notification

### Verification
- [ ] User C: See notification
- [ ] User C: Can accept/reject
- [ ] User A: Can manage both calls
- [ ] No errors in console

### Result
- [ ] PASS / [ ] FAIL

---

## Test 11: WebSocket Connection ✅

### Setup
- [ ] User B: Open browser console

### Execution
- [ ] Type: `window.stompClient.connected`
- [ ] Type: `Object.keys(window.stompClient.subscriptions)`

### Verification
- [ ] `window.stompClient.connected` returns `true`
- [ ] Subscriptions include `/user/queue/call`
- [ ] Subscriptions include `/user/queue/call-chat`

### Result
- [ ] PASS / [ ] FAIL

---

## Test 12: No Console Errors ✅

### Setup
- [ ] User B: Open browser console (F12)

### Execution
- [ ] User A: Initiate call
- [ ] User B: Accept call
- [ ] User A: End call

### Verification
- [ ] No red errors in console
- [ ] No warnings about subscriptions
- [ ] No WebSocket errors
- [ ] No undefined errors

### Result
- [ ] PASS / [ ] FAIL

---

## Test 13: Performance ✅

### Setup
- [ ] Monitor browser performance (F12 → Performance)

### Execution
- [ ] User A: Initiate call
- [ ] User B: Accept call
- [ ] Monitor for 10 seconds

### Verification
- [ ] No memory leaks
- [ ] CPU usage normal
- [ ] No lag or stuttering
- [ ] Smooth animations

### Result
- [ ] PASS / [ ] FAIL

---

## Test 14: Mobile Responsiveness ✅

### Setup
- [ ] Open browser on mobile device
- [ ] User B logged in

### Execution
- [ ] User A (desktop): Initiate call
- [ ] User B (mobile): See notification

### Verification
- [ ] Notification displays correctly on mobile
- [ ] Buttons are clickable on mobile
- [ ] Ringtone plays on mobile
- [ ] Accept/Reject works on mobile

### Result
- [ ] PASS / [ ] FAIL

---

## Test 15: Network Interruption ✅

### Setup
- [ ] Call is connected

### Execution
- [ ] Disconnect network (turn off WiFi)
- [ ] Wait 5 seconds
- [ ] Reconnect network

### Verification
- [ ] Call handles disconnection gracefully
- [ ] No crashes
- [ ] Can reconnect
- [ ] Or see appropriate error message

### Result
- [ ] PASS / [ ] FAIL

---

## Summary

### Total Tests: 15
- [ ] Passed: ___
- [ ] Failed: ___
- [ ] Skipped: ___

### Overall Result
- [ ] ALL PASS - Ready for deployment
- [ ] SOME FAIL - Fix issues and retest
- [ ] CRITICAL FAIL - Do not deploy

### Issues Found
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

### Notes
```
_______________________________________________
_______________________________________________
_______________________________________________
```

---

## Sign-Off

**Tested By**: ___________________
**Date**: ___________________
**Time**: ___________________
**Environment**: Development / Staging / Production

**Approval**: ___________________

---

## Deployment Decision

- [ ] APPROVED - Ready for production
- [ ] CONDITIONAL - Fix issues first
- [ ] REJECTED - Do not deploy

**Reason**: _______________________________________________

---

## Post-Deployment Monitoring

- [ ] Monitor error logs
- [ ] Monitor user feedback
- [ ] Monitor performance metrics
- [ ] Check for WebSocket issues
- [ ] Verify ringtone plays
- [ ] Verify notifications appear

---

**Testing Checklist Version**: 1.0
**Last Updated**: May 16, 2026
**Status**: Ready for Testing
