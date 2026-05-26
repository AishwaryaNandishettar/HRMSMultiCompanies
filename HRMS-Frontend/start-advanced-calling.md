# 🚀 Quick Start Guide for Advanced Calling

## The Error You're Seeing

The "could not establish signal connection Failed to fetch" error means the **LiveKit server is not running**. This is the most common issue.

## ⚡ Quick Fix (3 Steps)

### Step 1: Download & Start LiveKit Server
1. **Download LiveKit Server:**
   - Go to: https://github.com/livekit/livekit/releases
   - Download `livekit_1.x.x_windows_amd64.zip` (latest version)
   - Extract to a folder (e.g., `C:\livekit\`)

2. **Start LiveKit Server:**
   ```cmd
   # Open Command Prompt in the LiveKit folder
   cd C:\livekit
   livekit-server.exe --keys "devkey: devsecret12345678901234567"
   ```

   **You should see:**
   ```
   INFO    starting LiveKit server     {"addr": ":7880"}
   INFO    starting HTTP server        {"addr": ":7880"}
   ```

### Step 2: Verify Backend is Running
Make sure your HRMS backend is running on port 8082:
```cmd
# In HRMS-Backend folder
mvn spring-boot:run
```

### Step 3: Test Advanced Calling
1. Open WorkChat: http://localhost:5173/workchat
2. Click the **🚀 rocket icon** in the chat header (enables advanced calling)
3. Select a user and start a video call
4. If you still see an error, click **"🔍 Run Diagnostics"** for detailed troubleshooting

## 🔍 Built-in Diagnostics

I've added a diagnostics tool that will help identify the exact issue:

1. When you see the error screen, click **"🔍 Run Diagnostics"**
2. It will test:
   - ✅ Backend connectivity (port 8082)
   - ✅ Token generation (authentication)
   - ✅ LiveKit server connectivity (port 7880)
   - ✅ Browser capabilities (WebRTC support)

## 🔄 Alternative: Use Basic Calling

If you can't get LiveKit working immediately, you can use the basic calling mode:

1. Click the **⚙️ gear icon** in the chat header
2. This switches to the original WebRTC implementation
3. Basic calling works without LiveKit server

## 📋 Complete Setup Checklist

- [ ] LiveKit server downloaded and running on port 7880
- [ ] HRMS backend running on port 8082  
- [ ] HRMS frontend running on port 5173
- [ ] Advanced calling enabled (🚀 icon clicked)
- [ ] No firewall blocking ports 7880, 8082, 5173
- [ ] Using Chrome or Firefox browser
- [ ] On localhost (required for camera/microphone access)

## 🆘 Still Not Working?

1. **Check the browser console (F12)** for specific error messages
2. **Run the built-in diagnostics** for detailed testing
3. **Try basic calling mode** as a fallback
4. **Check the troubleshooting guide** in `TROUBLESHOOTING_GUIDE.md`

## 🎯 Expected Result

Once everything is set up correctly, you should see:
- ✅ Professional video calling interface
- ✅ Multiple participant support
- ✅ Hand raising, screen sharing, in-call chat
- ✅ Participant management panel
- ✅ Real-time audio/video with excellent quality

The advanced calling system provides a significant upgrade over basic WebRTC with professional features matching modern video conferencing tools like Zoom or Teams.