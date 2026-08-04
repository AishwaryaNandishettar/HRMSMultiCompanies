# URGENT: Steps to Fix Calling Issues

## Current Problems
1. ❌ Old code still running in browser (not reloaded)
2. ❌ "webrtcPeer.closePeerConnection is not a function" error
3. ❌ Video not showing on receiver side
4. ❌ Screen sharing not working
5. ❌ Chat messages not working

## IMMEDIATE STEPS TO FIX

### Step 1: Hard Refresh Both Browser Windows
**THIS IS CRITICAL - The browser is using old cached code!**

1. **In BOTH browser windows** (Aishwarya and Adhviti):
   - Press **Ctrl + Shift + R** (Windows/Linux)
   - Or **Cmd + Shift + R** (Mac)
   - Or press **F12** → Right-click refresh button → "Empty Cache and Hard Reload"

2. **Verify the refresh worked**:
   - Open browser console (F12)
   - Look for this message: `✅ [CallContext] WebSocket connected`
   - The error "closePeerConnection is not a function" should NOT appear

### Step 2: Clear Browser Cache Completely (If Step 1 Doesn't Work)

1. **Chrome/Edge**:
   - Press **Ctrl + Shift + Delete**
   - Select "Cached images and files"
   - Time range: "Last hour"
   - Click "Clear data"

2. **Close ALL browser tabs** for localhost:5173

3. **Restart browser completely**

4. **Open fresh tabs** and login again

### Step 3: Verify Backend is Running

Check backend logs for these messages:
```
✅ Tomcat started on port 8082
✅ WebSocket connected
📞 Signal: ... -> ... | Action: CALL
```

If not running, restart backend:
```bash
cd HRMS-Backend
.\mvnw.cmd spring-boot:run
```

### Step 4: Test Basic Call (After Hard Refresh)

1. **Window 1** (Aishwarya - Admin):
   - Login: `aishwarya@company.com`
   - Go to WorkChat
   - Select "Adhviti" from user list
   - Click **phone icon** (voice call)

2. **Window 2** (Adhviti - Employee):
   - Login: `adhviti@gmail.com`
   - Should see incoming call notification
   - Click "Accept"

3. **Expected Console Output** (Window 1 - Sender):
```
📞 [CallContext] Starting voice call to: adhviti@gmail.com
🚀 Initializing WebRTC...
✅ WebRTC peer connection initialized
🎥 Starting local media for voice call
✅ Local media started successfully
📞 Creating offer as initiator (call accepted)...
✅ Offer created and sent
📡 ICE candidate generated
📞 [CallScreen] Received ANSWER from adhviti@gmail.com
✅ Remote description set from answer
📺 Remote stream received
🔗 Connection state: connected
✅ FULLY CONNECTED
```

4. **Expected Console Output** (Window 2 - Receiver):
```
📞 [CallContext] Signal: CALL from aishwarya@company.com
🚀 Initializing WebRTC...
✅ WebRTC peer connection initialized
🎥 Starting local media for voice call
✅ Local media started successfully
📞 [CallScreen] Received OFFER from aishwarya@company.com
📞 Handling incoming offer...
✅ Remote description set from offer
✅ Answer created and sent
📺 Remote stream received
🔗 Connection state: connected
✅ FULLY CONNECTED
```

## What Should Work After Hard Refresh

✅ **Voice Calls**: Audio works both ways
✅ **Video Calls**: Video and audio work both ways  
✅ **Mute/Unmute**: Microphone control
✅ **Camera On/Off**: Camera control (video calls)
✅ **End Call**: Properly closes connection

## What WON'T Work (Requires LiveKit Server)

❌ **Screen Sharing** - Requires proper WebRTC connection (wait 10 seconds after call connects, then try)
❌ **In-call Chat** - This is an AdvancedCallScreen feature (requires LiveKit)
❌ **Hand Raise** - AdvancedCallScreen feature (requires LiveKit)
❌ **Settings Panel** - AdvancedCallScreen feature (requires LiveKit)

## About Chat Messages (WorkChat)

The chat messages in WorkChat (not in-call chat) should work. If they don't:

1. **Check WebSocket connection**:
   - Console should show: `✅ [CallContext] WebSocket connected`

2. **Check backend logs**:
   - Should show message being sent/received

3. **Try sending a simple text message** (no attachments first)

## Troubleshooting

### Issue: Still seeing "closePeerConnection is not a function"
**Solution**: 
- You didn't hard refresh properly
- Close ALL tabs for localhost:5173
- Clear browser cache completely
- Restart browser
- Open fresh tabs

### Issue: No video on receiver side
**Checklist**:
1. ✅ Hard refreshed BOTH windows
2. ✅ Camera permissions granted
3. ✅ Using video call (not voice)
4. ✅ Camera not disabled
5. ✅ Wait 5-10 seconds for connection to establish

### Issue: Screen sharing not working
**This is EXPECTED** - Screen sharing requires:
1. Call must be fully connected (wait 10 seconds)
2. Connection state must be "connected"
3. Both local and remote descriptions must be set

**To check if ready**:
- Look for "Connected • 00:XX" in call screen
- Console shows "✅ FULLY CONNECTED"
- Then try screen sharing

### Issue: Chat messages not working
**Different from in-call chat!**

WorkChat messages should work. If not:
1. Check WebSocket connected
2. Check backend running
3. Try simple text message first
4. Check browser console for errors

## Why Hard Refresh is Critical

The browser caches JavaScript files. Your old code had:
```javascript
webrtcPeer.closePeerConnection(email); // ❌ This method doesn't exist
```

The new code has:
```javascript
// Note: webrtcPeer.close() closes entire connection
// ✅ Removed the non-existent method call
```

**Without hard refresh, the browser uses the OLD cached code!**

## Verification Checklist

After hard refresh, verify:

- [ ] No "closePeerConnection is not a function" error
- [ ] Console shows "✅ WebRTC peer connection initialized"
- [ ] Console shows "📞 [CallScreen] Received OFFER/ANSWER"
- [ ] Console shows "✅ FULLY CONNECTED"
- [ ] Audio works both ways
- [ ] Video displays (for video calls)
- [ ] No WebRTC errors in console

## If Still Not Working

1. **Take screenshot of console errors** (F12 → Console tab)
2. **Check which file/line the error is from**
3. **Verify the error is from NEW code, not old code**
4. **Check backend logs** for any errors

## Quick Test Commands

**Check if frontend is running**:
```
http://localhost:5173
```

**Check if backend is running**:
```
http://localhost:8082/actuator/health
```

**Check WebSocket**:
- Open browser console
- Look for: `✅ [CallContext] WebSocket connected`

## Summary

The main issue is **browser cache**. The fixes have been applied to the code, but your browser is still running the OLD code.

**MUST DO**:
1. Hard refresh BOTH browser windows (Ctrl+Shift+R)
2. Or clear cache and restart browser
3. Then test the call again

After hard refresh, the calling should work properly!
