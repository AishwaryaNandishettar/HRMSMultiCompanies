# 🔧 Advanced Calling Troubleshooting Guide

## ❌ "Could not establish signal connection Failed to fetch" Error

This error occurs when the frontend cannot connect to the LiveKit server or fetch tokens from the backend. Here's how to fix it:

### 🚀 Quick Fix Steps

#### 1. Check LiveKit Server Status
The most common cause is that the LiveKit server is not running.

**Start LiveKit Server:**
```bash
# Download LiveKit server from: https://github.com/livekit/livekit/releases
# Then run with the exact credentials from application.properties:
livekit-server.exe --keys "devkey: devsecret12345678901234567"
```

**Expected Output:**
```
INFO    starting LiveKit server     {"addr": ":7880", "node-id": "..."}
INFO    starting HTTP server        {"addr": ":7880"}
```

#### 2. Verify Backend is Running
Make sure your HRMS backend is running on port 8082.

**Test Backend:**
```bash
# Check if backend is responding:
curl http://localhost:8082/api/livekit/config
```

**Expected Response:**
```json
{
  "url": "ws://localhost:7880",
  "apiKey": "devkey"
}
```

#### 3. Check Network Connectivity
Open browser developer tools (F12) and check:

**Console Tab:**
- Look for errors related to "Failed to fetch"
- Check for CORS errors
- Verify token requests to `/api/livekit/token`

**Network Tab:**
- Check if requests to `/api/livekit/token` are successful (200 status)
- Verify WebSocket connection attempts to `ws://localhost:7880`

### 🔍 Detailed Diagnostics

#### Use Built-in Diagnostics Tool
1. When you see the error screen, click **"🔍 Run Diagnostics"**
2. The tool will test:
   - Backend connectivity
   - Token generation
   - LiveKit server connectivity
   - Browser capabilities

#### Manual Testing Steps

**Test 1: Backend API**
```bash
# Test config endpoint
curl http://localhost:8082/api/livekit/config

# Test token endpoint (requires authentication)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     "http://localhost:8082/api/livekit/token?meetingId=test&displayName=TestUser"
```

**Test 2: LiveKit Server**
```bash
# Test if LiveKit server is listening
telnet localhost 7880
# Or use: nc -zv localhost 7880
```

**Test 3: Browser Console**
```javascript
// Test WebSocket connection in browser console
const ws = new WebSocket('ws://localhost:7880');
ws.onopen = () => console.log('✅ LiveKit server reachable');
ws.onerror = (e) => console.log('❌ LiveKit server unreachable', e);
```

### 🛠️ Common Solutions

#### Solution 1: Start LiveKit Server
```bash
# Download from GitHub releases
# Windows:
livekit-server.exe --keys "devkey: devsecret12345678901234567"

# Linux/Mac:
./livekit-server --keys "devkey: devsecret12345678901234567"
```

#### Solution 2: Fix Backend Configuration
Check `application.properties`:
```properties
# Ensure these settings match:
livekit.url=ws://localhost:7880
livekit.api-key=devkey
livekit.api-secret=devsecret12345678901234567
```

#### Solution 3: Fix CORS Issues
If you see CORS errors, add to `application.properties`:
```properties
app.cors.allowedOrigins=http://localhost:5173,http://localhost:3000
```

#### Solution 4: Check Firewall/Antivirus
- Ensure ports 7880 and 8082 are not blocked
- Temporarily disable firewall/antivirus to test
- Add exceptions for LiveKit server and Java backend

#### Solution 5: Browser Issues
- Use Chrome or Firefox (best WebRTC support)
- Ensure you're on `localhost` or `https://` (required for media access)
- Clear browser cache and cookies
- Disable browser extensions that might block WebRTC

### 📋 Verification Checklist

Before starting a call, verify:

- [ ] LiveKit server is running on port 7880
- [ ] Backend is running on port 8082
- [ ] Frontend is running on port 5173
- [ ] No firewall blocking ports 7880, 8082, 5173
- [ ] Browser supports WebRTC (Chrome/Firefox recommended)
- [ ] Using localhost or HTTPS (required for camera/microphone)
- [ ] Advanced calling mode is enabled (🚀 icon in chat header)

### 🔄 Step-by-Step Testing Process

1. **Start Services in Order:**
   ```bash
   # 1. Start LiveKit server
   livekit-server.exe --keys "devkey: devsecret12345678901234567"
   
   # 2. Start backend (in HRMS-Backend folder)
   mvn spring-boot:run
   
   # 3. Start frontend (in HRMS-Frontend folder)
   npm run dev
   ```

2. **Test Each Component:**
   - Open http://localhost:5173
   - Login to HRMS
   - Navigate to WorkChat
   - Click 🚀 to enable advanced calling
   - Select a user and start a video call

3. **Monitor Logs:**
   - LiveKit server console for connection logs
   - Backend console for token generation logs
   - Browser console for frontend errors

### 🆘 Still Having Issues?

If the problem persists:

1. **Check System Requirements:**
   - Windows 10+ / macOS 10.14+ / Linux
   - Chrome 80+ / Firefox 75+ / Safari 13+
   - Minimum 4GB RAM, 1GB free disk space

2. **Try Alternative Ports:**
   - Change LiveKit port in `application.properties` if 7880 is blocked
   - Update both backend config and LiveKit server startup command

3. **Use Basic Calling Mode:**
   - Click ⚙️ icon in chat header to switch to basic WebRTC mode
   - This bypasses LiveKit and uses direct peer-to-peer connection

4. **Network Troubleshooting:**
   - Try different network (mobile hotspot, different WiFi)
   - Check if corporate firewall is blocking WebRTC traffic
   - Test on different machine/browser

### 📞 Emergency Fallback

If advanced calling doesn't work, you can always use the basic calling mode:
1. Click the ⚙️ (gear) icon in the chat header
2. This switches to the original WebRTC implementation
3. Basic calling works without LiveKit server

### 🔗 Useful Resources

- [LiveKit Documentation](https://docs.livekit.io/)
- [WebRTC Troubleshooting](https://webrtc.org/getting-started/testing)
- [Browser WebRTC Support](https://caniuse.com/rtcpeerconnection)
- [Network Connectivity Test](https://test.webrtc.org/)

---

**Need more help?** Run the built-in diagnostics tool or check the browser console for specific error messages.