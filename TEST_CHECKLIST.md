# ✅ WebRTC Call Testing Checklist

**Date**: _______________  
**Tester**: _______________

---

## 🚨 CRITICAL FIRST STEP

- [ ] **Clear browser cache in BOTH windows**
  - Press: **Ctrl + Shift + R** (Windows/Linux)
  - Or: **Cmd + Shift + R** (Mac)
  - Window 1: ✅ Done
  - Window 2: ✅ Done

---

## 📋 Pre-Test Setup

- [ ] Backend running on port 8082
- [ ] Frontend running on port 5176
- [ ] Browser Window 1 open at `http://localhost:5176/`
- [ ] Browser Window 2 open at `http://localhost:5176/`
- [ ] Console open (F12) in Window 1
- [ ] Console open (F12) in Window 2
- [ ] Logged in as `aishwarya@company.com` in Window 1
- [ ] Logged in as `adhviti@gmail.com` in Window 2
- [ ] Both users in WorkChat section

---

## 🎤 Voice Call Test

### Initiate Call
- [ ] Window 1: Select `adhviti@gmail.com` from chat list
- [ ] Window 1: Click phone icon (voice call)
- [ ] Window 1: See "Calling..." status
- [ ] Window 2: See incoming call notification

### Accept Call
- [ ] Window 2: Click "Accept" button
- [ ] Window 1: Status changes to "Connecting..."
- [ ] Window 2: Status changes to "Connecting..."

### Verify Connection
- [ ] Window 1: Console shows "✅ FULLY CONNECTED"
- [ ] Window 2: Console shows "✅ FULLY CONNECTED"
- [ ] Window 1: Console shows "🔗 Connection state: connected"
- [ ] Window 2: Console shows "🔗 Connection state: connected"
- [ ] Window 1: Console shows "🧊 ICE connection state: connected"
- [ ] Window 2: Console shows "🧊 ICE connection state: connected"
- [ ] Window 1: Timer starts counting
- [ ] Window 2: Timer starts counting
- [ ] **NO errors** about "closePeerConnection is not a function"
- [ ] **NO errors** about "Failed to parse SessionDescription"

### Test Audio
- [ ] Speak in Window 1 → Hear in Window 2
- [ ] Speak in Window 2 → Hear in Window 1
- [ ] Audio quality is good (no distortion/echo)

### Test Controls
- [ ] Window 1: Click mute button → Audio stops in Window 2
- [ ] Window 1: Click unmute → Audio resumes in Window 2
- [ ] Window 2: Click mute button → Audio stops in Window 1
- [ ] Window 2: Click unmute → Audio resumes in Window 1

### End Call
- [ ] Window 1: Click end call button
- [ ] Window 2: Call ends automatically
- [ ] Both windows return to chat view
- [ ] No errors in console

**Voice Call Result**: ✅ Pass / ❌ Fail

**Notes**: _______________________________________________

---

## 📹 Video Call Test

### Initiate Call
- [ ] Window 1: Select `adhviti@gmail.com` from chat list
- [ ] Window 1: Click video icon (video call)
- [ ] Window 1: See "Calling..." status
- [ ] Window 1: See local video (self)
- [ ] Window 2: See incoming video call notification

### Accept Call
- [ ] Window 2: Click "Accept" button
- [ ] Window 1: Status changes to "Connecting..."
- [ ] Window 2: Status changes to "Connecting..."
- [ ] Window 2: See local video (self)

### Verify Connection
- [ ] Window 1: Console shows "✅ FULLY CONNECTED"
- [ ] Window 2: Console shows "✅ FULLY CONNECTED"
- [ ] Window 1: See remote video (other user)
- [ ] Window 2: See remote video (other user)
- [ ] Window 1: Timer starts counting
- [ ] Window 2: Timer starts counting
- [ ] Both video streams are smooth (no freezing)

### Test Video Controls
- [ ] Window 1: Click camera off → Video stops in Window 2
- [ ] Window 1: Click camera on → Video resumes in Window 2
- [ ] Window 2: Click camera off → Video stops in Window 1
- [ ] Window 2: Click camera on → Video resumes in Window 1

### Test Audio (in video call)
- [ ] Speak in Window 1 → Hear in Window 2
- [ ] Speak in Window 2 → Hear in Window 1
- [ ] Window 1: Mute works
- [ ] Window 2: Mute works

### End Call
- [ ] Window 1: Click end call button
- [ ] Window 2: Call ends automatically
- [ ] Both windows return to chat view
- [ ] No errors in console

**Video Call Result**: ✅ Pass / ❌ Fail

**Notes**: _______________________________________________

---

## 🖥️ Screen Share Test

### Setup
- [ ] Start video call between users (as above)
- [ ] Wait for "✅ FULLY CONNECTED" in console
- [ ] Verify video call is working

### Start Screen Share
- [ ] Window 1: Click screen share button
- [ ] Window 1: Browser shows screen picker dialog
- [ ] Window 1: Select screen/window to share
- [ ] Window 1: Click "Share" button
- [ ] Window 1: Screen share button shows active state
- [ ] Window 2: See shared screen (instead of camera video)
- [ ] Window 2: Shared screen is clear and smooth

### Verify Screen Share
- [ ] Window 1: Move windows around → Window 2 sees movement
- [ ] Window 1: Type text → Window 2 sees typing
- [ ] Window 1: Open applications → Window 2 sees them
- [ ] Audio still works during screen share

### Stop Screen Share
- [ ] Window 1: Click screen share button again
- [ ] Window 1: Screen sharing stops
- [ ] Window 2: See camera video again (not screen)
- [ ] Window 1: Screen share button shows inactive state

### Alternative Stop Method
- [ ] Window 1: Start screen share again
- [ ] Window 1: Click browser's "Stop sharing" button
- [ ] Window 1: Screen sharing stops
- [ ] Window 2: See camera video again
- [ ] No errors in console

### End Call
- [ ] Window 1: Click end call button
- [ ] Call ends cleanly
- [ ] No errors in console

**Screen Share Result**: ✅ Pass / ❌ Fail

**Notes**: _______________________________________________

---

## 🔍 Error Checks

### Console Errors (Should NOT see these)
- [ ] ❌ "closePeerConnection is not a function" → **If seen: Cache not cleared!**
- [ ] ❌ "Failed to parse SessionDescription" → **If seen: Cache not cleared!**
- [ ] ❌ "getUserMedia failed" → **If seen: Check permissions**
- [ ] ❌ "ICE connection state: failed" → **If seen: Network issue**

### Expected Console Messages (Should see these)
- [ ] ✅ "FULLY CONNECTED"
- [ ] ✅ "Connection state: connected"
- [ ] ✅ "ICE connection state: connected"
- [ ] ✅ "Remote stream received"
- [ ] ✅ "Local media started successfully"

---

## 🎯 Overall Test Results

| Test | Result | Time to Connect | Notes |
|------|--------|-----------------|-------|
| Voice Call | ⬜ Pass / ⬜ Fail | _____ seconds | _____________ |
| Video Call | ⬜ Pass / ⬜ Fail | _____ seconds | _____________ |
| Screen Share | ⬜ Pass / ⬜ Fail | N/A | _____________ |

---

## 📝 Issues Found

**Issue 1**: _______________________________________________

**Issue 2**: _______________________________________________

**Issue 3**: _______________________________________________

---

## ✅ Sign-Off

- [ ] All tests completed
- [ ] All tests passed
- [ ] No critical errors found
- [ ] Ready for next phase

**Tester Signature**: _______________  
**Date**: _______________  
**Time**: _______________

---

## 🆘 If Tests Fail

### Cache Issues
If you see old errors:
1. Close ALL browser tabs
2. Restart browser
3. Clear cache from settings
4. Try Incognito mode

### Connection Issues
If call doesn't connect:
1. Check backend running (port 8082)
2. Check frontend running (port 5176)
3. Check WebSocket in console
4. Check browser permissions

### Audio/Video Issues
If no audio/video:
1. Check browser permissions
2. Close other apps using camera/mic
3. Check console for errors
4. Try different browser

---

**Quick Reference**:
- Backend: `http://localhost:8082`
- Frontend: `http://localhost:5176`
- Verification Tool: `http://localhost:5176/verify-webrtc-fix.html`
- Test Users: `aishwarya@company.com` & `adhviti@gmail.com`
- Hard Refresh: **Ctrl + Shift + R**
