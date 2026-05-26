# Call Testing Guide

## Issue Summary
- **Problem**: Calls connect but no audio is heard
- **Root Cause**: Advanced calling mode (LiveKit) is enabled by default, but LiveKit server is not running
- **Solution**: Disabled advanced calling by default to use basic WebRTC mode

## Changes Made
1. **WorkChat.jsx**: Changed `useAdvancedCalling` default from `true` to `false`
   - This ensures basic WebRTC mode is used by default
   - Advanced mode (LiveKit) can still be toggled via the UI if LiveKit server is running

## Testing Steps

### 1. Restart Frontend
```bash
# Stop the frontend if running (Ctrl+C)
# Start it again
cd HRMS-Frontend
npm run dev
```

### 2. Test Basic Voice Call
1. **Open two browser windows/tabs**:
   - Window 1: Login as `aishwarya@company.com` (ADMIN)
   - Window 2: Login as `padmanabh@omoi.com` (MANAGER)

2. **In Window 1 (Aishwarya)**:
   - Go to WorkChat
   - Select "Padmanabh" from the user list
   - Click the **phone icon** (voice call)

3. **In Window 2 (Padmanabh)**:
   - You should see an incoming call notification with sound
   - Click "Accept"

4. **Verify**:
   - ✅ Call connects (timer starts)
   - ✅ You can hear each other speaking
   - ✅ Microphone mute/unmute works
   - ✅ End call button works

### 3. Test Video Call
1. **Same setup as above**
2. **In Window 1**: Click the **video camera icon** instead
3. **In Window 2**: Accept the call
4. **Verify**:
   - ✅ Video streams appear
   - ✅ Audio works
   - ✅ Camera on/off works
   - ✅ Microphone mute/unmute works

## Expected Console Output (Normal)

### Sender Side:
```
📞 CallScreen rendered with props: { user, type: 'voice', isInitiator: true, ... }
🚀 Initializing WebRTC...
✅ WebRTC peer connection initialized
🎥 Starting local media for voice call
✅ Local media started successfully
📞 Creating offer as initiator (call accepted)...
✅ Offer created and sent
📡 ICE candidate generated: { type: 'host', protocol: 'udp', ... }
🔗 Connection state: connected
✅ FULLY CONNECTED
```

### Receiver Side:
```
📞 CallScreen rendered with props: { user, type: 'voice', isInitiator: false, ... }
🚀 Initializing WebRTC...
✅ WebRTC peer connection initialized
🎥 Starting local media for voice call
✅ Local media started successfully
📞 Handling incoming offer...
✅ Remote description set from offer
✅ Answer created and sent
📺 Remote stream received
🔗 Connection state: connected
✅ FULLY CONNECTED
```

## Troubleshooting

### Issue: Still seeing LiveKit errors
**Solution**: These are expected if LiveKit server isn't running. They can be ignored. The app should automatically use basic WebRTC mode.

### Issue: No audio after call connects
**Checklist**:
1. Check browser permissions - allow microphone access
2. Check system audio settings - microphone not muted
3. Check browser console for WebRTC errors
4. Try refreshing both browser windows
5. Check if `useAdvancedCalling` is `false` in WorkChat.jsx

### Issue: "No peer connection available for ICE candidate"
**Solution**: This happens when ICE candidates arrive before the peer connection is ready. The code queues them and processes them later. This is normal and should resolve automatically.

### Issue: Call doesn't connect at all
**Checklist**:
1. Backend server running on port 8082
2. Frontend running on port 5173
3. WebSocket connected (check browser console for "✅ WebSocket connected")
4. Both users logged in with correct emails
5. Sender selected the exact email that receiver is logged in with

## Advanced Mode (LiveKit)

If you want to use advanced calling features (multiple participants, screen sharing, etc.), you need to:

1. **Install and run LiveKit server**:
   ```bash
   # Download from https://livekit.io/
   # Or use Docker:
   docker run --rm -p 7880:7880 -p 7881:7881 -p 7882:7882/udp \
     -e LIVEKIT_KEYS="devkey: devsecret12345678901234567" \
     livekit/livekit-server
   ```

2. **Toggle advanced mode in UI**:
   - In WorkChat header, there's a toggle for "Advanced Calling"
   - Enable it to use LiveKit features

## Browser Compatibility

**Recommended Browsers**:
- Chrome/Edge (best WebRTC support)
- Firefox (good support)
- Safari (limited support)

**Not Supported**:
- Internet Explorer
- Old browser versions

## Network Requirements

- **Ports**: 8082 (backend), 5173 (frontend)
- **Protocols**: WebSocket (ws://), WebRTC (UDP)
- **Firewall**: Allow WebRTC traffic
- **NAT**: STUN/TURN servers configured in `webrtc.js` config

## Success Criteria

✅ Call notification appears with sound
✅ Call connects within 5 seconds
✅ Audio is clear and bidirectional
✅ Video works (for video calls)
✅ Controls work (mute, camera, end call)
✅ No console errors (except LiveKit errors which are expected)
