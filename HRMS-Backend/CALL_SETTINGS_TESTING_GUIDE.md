# Call Settings Testing Guide

## Quick Start

### Prerequisites
1. ✅ Backend running on port 8082
2. ✅ Frontend running on port 5176
3. ✅ Two browser windows/tabs for testing
4. ✅ Camera and microphone permissions granted

### Test Users
- **Admin**: `aishwarya@company.com`
- **Employee**: `adhviti@gmail.com`

## Step-by-Step Testing

### Test 1: Device Enumeration
**Goal**: Verify all devices are detected and listed

1. Login as admin in first browser
2. Go to WorkChat
3. Start a video call to employee
4. Click the **Settings** button (⚙️ icon) in call controls
5. **Expected Results**:
   - ✅ Settings panel opens on the right side
   - ✅ "Audio Input" dropdown shows all microphones
   - ✅ "Video Input" dropdown shows all cameras
   - ✅ "Speaker Output" dropdown shows all speakers
   - ✅ Device names are readable (not just IDs)

**Screenshot Location**: Settings panel with device lists

---

### Test 2: Microphone Switching During Call
**Goal**: Switch microphone without dropping the call

1. Start a call between admin and employee
2. Admin: Click Settings button
3. Admin: Select a different microphone from "Audio Input" dropdown
4. **Expected Results**:
   - ✅ Dropdown value changes to selected device
   - ✅ Console shows: "🎤 Switching audio device to: [device-id]"
   - ✅ Console shows: "✅ Audio device switched successfully"
   - ✅ Employee can hear admin speaking through new microphone
   - ✅ Call continues without interruption
   - ✅ Mute button state is preserved

**Test Mute State**:
1. Mute microphone
2. Switch to different microphone
3. **Expected**: Microphone remains muted after switch

---

### Test 3: Camera Switching During Call
**Goal**: Switch camera without dropping the call

1. Start a video call between admin and employee
2. Admin: Click Settings button
3. Admin: Select a different camera from "Video Input" dropdown
4. **Expected Results**:
   - ✅ Dropdown value changes to selected device
   - ✅ Console shows: "📹 Switching video device to: [device-id]"
   - ✅ Console shows: "✅ Video device switched successfully"
   - ✅ Admin's local video preview updates to show new camera
   - ✅ Employee sees admin's video from new camera
   - ✅ Call continues without interruption
   - ✅ Video on/off button state is preserved

**Test Video Off State**:
1. Turn off video
2. Switch to different camera
3. **Expected**: Video remains off after switch

---

### Test 4: Speaker Switching During Call
**Goal**: Change audio output device

1. Start a call between admin and employee
2. Admin: Click Settings button
3. Admin: Select a different speaker from "Speaker Output" dropdown
4. Employee: Speak into microphone
5. **Expected Results**:
   - ✅ Dropdown value changes to selected device
   - ✅ Console shows: "🔊 Switching speaker device to: [device-id]"
   - ✅ Console shows: "✅ Speaker device switched successfully"
   - ✅ Admin hears employee's voice from new speaker
   - ✅ Call continues without interruption

**Note**: Speaker switching requires browser support for `setSinkId()` API (Chrome, Edge, Opera)

---

### Test 5: Device Hot-Plugging
**Goal**: Verify device list updates when devices are added/removed

1. Start a call
2. Open Settings panel
3. Note the current device lists
4. **Plug in a new USB microphone or webcam**
5. **Expected Results**:
   - ✅ New device appears in appropriate dropdown
   - ✅ Console shows: "🎤 Available devices: { audio: X, video: Y, speakers: Z }"
6. **Unplug the device**
7. **Expected Results**:
   - ✅ Device disappears from dropdown
   - ✅ If it was selected, switches to default device

---

### Test 6: Error Handling
**Goal**: Verify graceful error handling

**Scenario A: No Devices Found**
1. Disable all microphones in system settings
2. Start a call
3. Open Settings panel
4. **Expected**: "No microphones found" shown in dropdown

**Scenario B: Device Switch Failure**
1. Start a call
2. Select a device
3. Quickly unplug it before switch completes
4. **Expected**:
   - ✅ Alert shown: "Failed to switch microphone. Please try again."
   - ✅ Call continues normally
   - ✅ Previous device remains active

---

### Test 7: Settings Panel UI/UX
**Goal**: Verify settings panel behavior

1. Start a call
2. Click Settings button
3. **Expected Results**:
   - ✅ Settings panel slides in from right
   - ✅ Panel has dark background with good contrast
   - ✅ Close button (×) works
   - ✅ Panel can be opened/closed multiple times
   - ✅ Dropdowns are styled consistently
   - ✅ "Record Call" checkbox is visible
   - ✅ Panel doesn't block video grid

---

### Test 8: Multiple Device Switches
**Goal**: Verify stability with multiple switches

1. Start a call
2. Open Settings panel
3. Switch microphone → wait 2 seconds
4. Switch camera → wait 2 seconds
5. Switch speaker → wait 2 seconds
6. Switch microphone again → wait 2 seconds
7. **Expected Results**:
   - ✅ All switches complete successfully
   - ✅ No console errors
   - ✅ Call remains stable
   - ✅ Audio/video quality is good

---

## Console Logs to Watch For

### Success Logs
```
🎤 Available devices: { audio: 2, video: 1, speakers: 2 }
🎤 Switching audio device to: abc123...
✅ Audio device switched successfully
📹 Switching video device to: def456...
✅ Video device switched successfully
🔊 Switching speaker device to: ghi789...
✅ Speaker device switched successfully
```

### Error Logs
```
❌ Failed to enumerate devices: [error]
❌ Failed to switch audio device: [error]
❌ Failed to switch video device: [error]
❌ Failed to switch speaker device: [error]
```

---

## Browser Compatibility

| Browser | Device Enumeration | Mic Switch | Camera Switch | Speaker Switch |
|---------|-------------------|------------|---------------|----------------|
| Chrome | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Edge | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Firefox | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Limited |
| Safari | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| Opera | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |

**Note**: Speaker switching uses `setSinkId()` API which has limited browser support.

---

## Troubleshooting

### Issue: Devices not showing in list
**Solution**: 
- Grant camera/microphone permissions
- Refresh the page
- Check browser console for errors

### Issue: Device labels show as "Microphone abc123"
**Solution**: 
- This happens when permissions are not granted before enumeration
- Refresh the page after granting permissions

### Issue: Speaker switching doesn't work
**Solution**: 
- Check if browser supports `setSinkId()` (Chrome, Edge, Opera)
- Try a different browser
- Check console for "setSinkId is not a function" error

### Issue: Device switch causes call to drop
**Solution**: 
- Check LiveKit connection status
- Verify backend is running
- Check console for WebRTC errors
- Try basic calling mode instead

### Issue: Settings panel doesn't open
**Solution**: 
- Check if call is connected
- Look for JavaScript errors in console
- Verify AdvancedCallScreen component is loaded

---

## Performance Checklist

- [ ] Device enumeration completes in < 1 second
- [ ] Device switching completes in < 2 seconds
- [ ] No audio/video glitches during switch
- [ ] Call quality remains stable
- [ ] No memory leaks after multiple switches
- [ ] UI remains responsive during switches

---

## Comparison with CallLobby

| Feature | CallLobby (Pre-call) | AdvancedCallScreen (During call) |
|---------|---------------------|----------------------------------|
| Device Selection | ✅ Yes | ✅ Yes |
| Device Preview | ✅ Yes | ✅ Yes |
| Device Switching | ✅ Pre-call only | ✅ During call |
| Mute/Video Toggle | ✅ Yes | ✅ Yes |
| Device Hot-plug | ✅ Yes | ✅ Yes |

---

## Success Criteria

✅ **All tests pass**
✅ **No console errors**
✅ **Call remains stable during device switches**
✅ **UI is responsive and intuitive**
✅ **Error messages are user-friendly**
✅ **Device changes are reflected immediately**

---

## Next Steps After Testing

1. If all tests pass → Mark task as complete
2. If issues found → Document them and fix
3. Test on different browsers
4. Test with different device combinations
5. Test with poor network conditions
6. Get user feedback on UX

---

## Quick Test Command

```bash
# Start backend
cd HRMS-Backend
mvn spring-boot:run

# Start frontend (in new terminal)
cd HRMS-Frontend
npm run dev
```

Then open:
- Admin: http://localhost:5176 (login as aishwarya@company.com)
- Employee: http://localhost:5176 (login as adhviti@gmail.com in incognito)

---

**Happy Testing! 🎉**
