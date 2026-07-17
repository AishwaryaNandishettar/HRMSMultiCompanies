# Quick Test: Document Viewing Fix

## 🚀 Steps to Test (5 Minutes)

### Step 1: Restart Backend (REQUIRED)
```bash
cd HRMS-Backend
# Press Ctrl+C to stop if running
./mvnw spring-boot:run
```

**Look for this line in console:**
```
🔧 WebConfig: Serving uploads from: file:/path/to/uploads/
```

✅ If you see this, WebConfig is loaded correctly.

---

### Step 2: Test Upload Directory Endpoint

Open browser and go to:
```
http://localhost:8082/api/files/test-upload
```

**Expected Response:**
```json
{
  "uploadDirectory": "/your/path/HRMS-Backend/uploads/tasks",
  "directoryExists": true,
  "isDirectory": true,
  "fileCount": 10
}
```

✅ If you see this, upload directory is configured correctly.

---

### Step 3: Upload ONE Test Document

1. Open: `http://localhost:5176/onboarding`
2. Fill only these fields:
   - Full Name: "Test User"
   - Employee ID: "TEST-001"
3. Scroll to Documents section
4. Upload ONLY Resume (any PDF file)
5. Click Submit

**Backend console should show:**
```
📤 File upload request received
   File name: resume.pdf
   File size: 123456 bytes
   ✅ File saved to: /path/to/uploads/tasks/uuid.pdf
   📂 File URL: /uploads/tasks/uuid.pdf
```

✅ If you see this, file upload is working.

---

### Step 4: Check File Was Saved

```bash
ls -la HRMS-Backend/uploads/tasks/
```

**Expected:**
```
-rw-r--r--  1 user  staff  123456  Jul 15 12:00 a1b2c3d4-uuid.pdf
```

✅ File exists in uploads folder.

---

### Step 5: Test Direct File Access

Copy the UUID filename from the previous step, then open in browser:
```
http://localhost:8082/uploads/tasks/a1b2c3d4-uuid.pdf
```

**Expected:** PDF opens in browser

**If 404:** Backend is not serving files correctly
- Restart backend again
- Check SecurityConfig allows `/uploads/**`

✅ File is accessible directly.

---

### Step 6: Test "View File" Button in BGV

1. Open: `http://localhost:5176/BGV`
2. Find "Test User" record
3. Click "View Details"
4. Scroll to Documents section
5. Click green **📄 View File** button next to Resume

**Expected:** Document opens in new tab

**If 404:**
- Open browser DevTools → Network tab
- Click "View File" again
- Check the URL it's trying to access
- Should be: `http://localhost:8082/uploads/tasks/uuid.pdf`
- NOT: `http://localhost:8082/uploads/uploads/tasks/uuid.pdf` (double uploads)

✅ Document viewing works!

---

## 🎯 Success = All 6 Steps Pass

If all steps pass:
- ✅ WebConfig loaded
- ✅ Upload directory configured
- ✅ File upload working
- ✅ File saved to disk
- ✅ Direct file access working
- ✅ View File button working

---

## 🐛 If Any Step Fails

### Step 1 Fails (No WebConfig log):
```bash
# Check if WebConfig.java was saved
cat src/main/java/com/omoikaneinnovation/hmrsbackend/config/WebConfig.java | grep "WebConfig: Serving"

# Should see the System.out.println line
```

### Step 2 Fails (404 on test endpoint):
```bash
# Check if FileController.java was saved
cat HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/controller/FileController.java | grep "test-upload"

# Should see the @GetMapping("/test-upload") method
```

### Step 3 Fails (No upload log):
- Check if frontend is using correct backend URL
- Check CORS in FileController
- Check browser console for errors

### Step 4 Fails (File not in folder):
- File upload failed
- Check backend logs for errors
- Check disk space

### Step 5 Fails (404 on direct access):
- WebConfig not loading static files
- Restart backend
- Check SecurityConfig

### Step 6 Fails (404 in BGV):
- BGV.jsx not using correct URL
- Check browser console for actual URL accessed
- Verify it's not `/uploads/uploads/...` (double)

---

## 🔍 Debug Commands

### Check Backend is Running:
```bash
curl http://localhost:8082/api/files/test-upload
```

### Check File Exists:
```bash
ls -la HRMS-Backend/uploads/tasks/
```

### Check File is Accessible:
```bash
curl -I http://localhost:8082/uploads/tasks/YOUR-UUID.pdf
# Should return: HTTP/1.1 200
# Not: HTTP/1.1 404
```

### Check Frontend URL:
Open browser DevTools → Console, then type:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
// Should show: http://localhost:8082
```

---

## 📞 Quick Fixes

### Fix 1: Clear Everything and Start Fresh
```bash
# Backend
cd HRMS-Backend
rm -rf uploads/
mkdir -p uploads/tasks
./mvnw spring-boot:run

# Frontend
cd HRMS-Frontend
# Ctrl+C to stop dev server
npm run dev
```

### Fix 2: Hard Refresh Browser
```
Windows: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

### Fix 3: Check Ports
```bash
# Backend should be on 8082
lsof -i :8082

# Frontend should be on 5176
lsof -i :5176
```

---

## ✅ Final Verification

After all fixes, this should work:

```
1. Upload document in Onboarding ✅
2. Document saves to uploads/tasks/ ✅
3. Can access file directly via URL ✅
4. Can view file from BGV page ✅
5. No 404 errors ✅
6. No Whitelabel Error Page ✅
```

---

## 🎓 Understanding the Fix

**The Problem:**
- BGV.jsx was constructing URLs as `/uploads/uploads/tasks/file.pdf`
- This caused 404 because the actual path is `/uploads/tasks/file.pdf`

**The Solution:**
- Fixed `getDocumentUrl()` to check if path already starts with `/uploads/`
- If yes, don't add `/uploads/` again
- Now constructs correct URL: `http://localhost:8082/uploads/tasks/file.pdf`

**Why It Matters:**
- Without this fix, NO documents can be viewed
- Users see "Whitelabel Error Page"
- Files upload successfully but can't be accessed
- Breaking user experience

---

## 🚀 For Deployment (Vercel)

Once working in localhost, for Vercel deployment:

1. **Backend (Railway/Render):**
   - Add persistent storage volume
   - Set environment variable: `UPLOAD_DIR=/persistent/uploads/tasks/`

2. **Frontend (Vercel):**
   - Set environment variable: `VITE_API_BASE_URL=https://your-backend.railway.app`

3. **CORS:**
   - Backend must allow Vercel domain in `@CrossOrigin`

---

That's it! Test these 6 steps in order. If all pass, document viewing is working! 🎉
