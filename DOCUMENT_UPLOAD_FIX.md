# Document Upload & Viewing Fix

## 🔍 Issue Identified

When clicking "View File" in BGV page, files show **404 Error** or "Whitelabel Error Page":
- Error: `No static resource uploads/tasks/4abec310-3a45-407f-a89c-cc4f697346aa.pdf`
- Files ARE being uploaded to backend
- Files ARE saved in `uploads/tasks/` folder
- But Spring Boot is NOT serving them properly

---

## ✅ Fixes Applied

### Fix 1: Corrected URL Construction in BGV.jsx

**Problem:** URL was being constructed as `/uploads/uploads/tasks/file.pdf` (double uploads)

**Solution:** Fixed `getDocumentUrl()` function to handle paths correctly

```javascript
// ✅ FIXED: Now handles all path formats correctly
const getDocumentUrl = (docPath) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
  
  // If path already starts with /uploads/, use it as-is
  if (docPath.startsWith('/uploads/')) {
    return `${baseUrl}${docPath}`;  // ✅ Result: http://localhost:8082/uploads/tasks/file.pdf
  }
  
  // If path starts with uploads/ (no leading slash), add the slash
  if (docPath.startsWith('uploads/')) {
    return `${baseUrl}/${docPath}`;
  }
  
  // Otherwise, add /uploads/ prefix
  return `${baseUrl}/uploads/${docPath}`;
};
```

---

### Fix 2: Enhanced WebConfig for Static File Serving

**Added:**
- Absolute path resolution
- Debug logging
- Cache control

```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Get absolute path to uploads directory
    String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
    
    System.out.println("🔧 WebConfig: Serving uploads from: " + uploadPath);
    
    // Serve uploads directory
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations(uploadPath, "file:uploads/")
            .setCachePeriod(3600); // Cache for 1 hour
}
```

---

### Fix 3: Added Debugging to FileController

**Added logging to track:**
- File upload requests
- File save location
- Generated file URLs

```java
System.out.println("📤 File upload request received");
System.out.println("   File name: " + file.getOriginalFilename());
System.out.println("   ✅ File saved to: " + filePath.toAbsolutePath());
System.out.println("   📂 File URL: /uploads/tasks/" + uniqueFilename);
```

---

### Fix 4: Added Test Endpoint

**New endpoint:** `GET /api/files/test-upload`

Tests if upload directory is configured correctly:

```bash
curl http://localhost:8082/api/files/test-upload
```

**Response:**
```json
{
  "uploadDirectory": "/path/to/HRMS-Backend/uploads/tasks",
  "directoryExists": true,
  "isDirectory": true,
  "fileCount": 15
}
```

---

## 🧪 Testing Steps

### Step 1: Restart Backend

```bash
cd HRMS-Backend

# Stop backend if running (Ctrl+C)

# Restart backend
./mvnw spring-boot:run
```

**Look for this log:**
```
🔧 WebConfig: Serving uploads from: file:/path/to/HRMS-Backend/uploads/
```

---

### Step 2: Test Upload Directory

Open browser or use curl:

```bash
curl http://localhost:8082/api/files/test-upload
```

**Expected:**
```json
{
  "uploadDirectory": "/Users/you/HRMS-Backend/uploads/tasks",
  "directoryExists": true,
  "isDirectory": true,
  "fileCount": 0
}
```

---

### Step 3: Upload a Test Document

1. Go to Onboarding page: `http://localhost:5176/onboarding`
2. Fill minimal required fields
3. Upload ONE document (e.g., Resume - any PDF)
4. Click Submit

**Backend Console Should Show:**
```
📤 File upload request received
   File name: resume.pdf
   File size: 245678 bytes
   ✅ File saved to: /path/to/HRMS-Backend/uploads/tasks/a1b2c3d4-uuid.pdf
   📂 File URL: /uploads/tasks/a1b2c3d4-uuid.pdf
```

---

### Step 4: Verify File Was Saved

```bash
cd HRMS-Backend
ls -la uploads/tasks/

# Should show:
# a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf
```

---

### Step 5: Test Direct File Access

Get the file URL from the backend log (e.g., `/uploads/tasks/a1b2c3d4-uuid.pdf`)

Test in browser:
```
http://localhost:8082/uploads/tasks/a1b2c3d4-uuid.pdf
```

**Expected:** PDF should open in browser

**If 404 Error:**
- Backend not serving static files
- Check WebConfig is loaded
- Check SecurityConfig allows `/uploads/**`

---

### Step 6: Test Document Viewing in BGV Page

1. Go to BGV page: `http://localhost:5176/BGV`
2. Find the employee record
3. Click "View Details"
4. Scroll to Documents section
5. Click **📄 View File** button next to Resume

**Expected:** Document opens in new tab

**If still 404:**
- Check browser console for the URL being accessed
- Verify URL format: `http://localhost:8082/uploads/tasks/uuid.pdf`
- NOT: `http://localhost:8082/uploads/uploads/tasks/uuid.pdf` (double uploads)

---

## 🐛 Troubleshooting

### Issue: 404 on /uploads/tasks/file.pdf

**Check 1: Is file actually saved?**
```bash
ls -la uploads/tasks/
```

**Check 2: Is WebConfig loading?**
Look for log: `🔧 WebConfig: Serving uploads from: ...`

**Check 3: Is SecurityConfig blocking?**
Check `SecurityConfig.java` - should have:
```java
.requestMatchers("/uploads/**").permitAll()
```

**Check 4: Test direct access**
```bash
curl -I http://localhost:8082/uploads/tasks/YOUR-FILE-UUID.pdf
```

Should return `200 OK`, not `404 Not Found`

---

### Issue: "Whitelabel Error Page"

This means Spring Boot cannot find the resource.

**Solution:**
1. Restart backend (WebConfig changes need restart)
2. Verify uploads folder exists:
   ```bash
   mkdir -p uploads/tasks
   ```
3. Check file permissions:
   ```bash
   chmod -R 755 uploads/
   ```

---

### Issue: CORS Error

If you see CORS error in browser console:

**Check:** `FileController` has `@CrossOrigin`:
```java
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app"})
```

**Also check:** Frontend is using correct backend URL

---

### Issue: Works in localhost but not after Vercel deployment

**For Production (Vercel Frontend + Railway/Render Backend):**

1. **Backend must have persistent storage:**
   - Railway: Add volume/disk
   - Render: Add persistent disk
   - Or use S3/Cloudinary for file storage

2. **Frontend must use production backend URL:**
   ```env
   # .env.production
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

3. **Backend CORS must allow Vercel domain:**
   ```java
   @CrossOrigin(originPatterns = {"https://*.vercel.app"})
   ```

---

## 📊 Verification Checklist

After applying fixes, verify:

- [ ] Backend restarts without errors
- [ ] Log shows: "🔧 WebConfig: Serving uploads from: ..."
- [ ] Test endpoint works: `GET /api/files/test-upload`
- [ ] Can upload document in Onboarding
- [ ] Backend log shows: "📤 File upload request received"
- [ ] File exists in `uploads/tasks/` folder
- [ ] Direct file access works: `http://localhost:8082/uploads/tasks/uuid.pdf`
- [ ] "View File" button works in BGV page
- [ ] Document opens in new tab
- [ ] No 404 errors in browser console

---

## 🎯 Expected Behavior

### Correct Flow:

```
User clicks "View File" in BGV →
Frontend calls getDocumentUrl("/uploads/tasks/uuid.pdf") →
Constructs: "http://localhost:8082/uploads/tasks/uuid.pdf" →
Opens in new tab →
Backend WebConfig serves file from uploads/ folder →
✅ Document displays
```

### Incorrect Flow (Before Fix):

```
User clicks "View File" →
Frontend constructs: "http://localhost:8082/uploads/uploads/tasks/uuid.pdf" ❌
Opens in new tab →
Backend cannot find /uploads/uploads/... →
❌ 404 Error / Whitelabel Error Page
```

---

## 📁 Files Modified

1. **HRMS-Frontend/src/Pages/BGV.jsx**
   - Fixed `getDocumentUrl()` to avoid double `/uploads/`

2. **HRMS-Backend/.../config/WebConfig.java**
   - Added absolute path resolution
   - Added debug logging
   - Added cache control

3. **HRMS-Backend/.../controller/FileController.java**
   - Added detailed upload logging
   - Added test endpoint `/api/files/test-upload`

---

## 🚀 Quick Fix Summary

If documents still not viewing after these changes:

**1. Restart Backend** (REQUIRED - Java changes need restart)
```bash
cd HRMS-Backend
./mvnw spring-boot:run
```

**2. Clear Browser Cache** (F5 or Ctrl+Shift+R)

**3. Test Direct File Access**
```bash
# Upload a file via Onboarding
# Get URL from backend log
# Test in browser: http://localhost:8082/uploads/tasks/UUID.pdf
```

**4. Check Backend Logs for Errors**
- Look for WebConfig log
- Look for file upload logs
- Look for any errors

---

## 💡 Why This Happens

### Root Cause:
Spring Boot's `ResourceHandler` needs explicit configuration to serve files from custom directories. By default, it only serves from:
- `/static/`
- `/public/`
- `/resources/`
- `/META-INF/resources/`

Our uploads are in `/uploads/`, which is NOT a default location.

### Solution:
We configure `WebConfig.addResourceHandlers()` to tell Spring Boot:
- "When someone requests `/uploads/**` URL"
- "Serve files from `file:uploads/` directory"

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Upload logs appear in backend console
2. ✅ Files appear in `uploads/tasks/` folder
3. ✅ Direct URL access shows the file (not 404)
4. ✅ BGV "View File" button opens documents
5. ✅ No "Whitelabel Error Page"
6. ✅ No 404 errors in browser console

---

## 📞 Still Having Issues?

**Debug Steps:**

1. **Enable Spring Boot debug logging:**
   ```properties
   # application.properties
   logging.level.org.springframework.web=DEBUG
   ```

2. **Check what Spring Boot sees:**
   ```bash
   # In backend console, look for:
   # "Mapped URL path [/uploads/**] onto handler"
   ```

3. **Verify file path vs URL:**
   ```
   File Path: /Users/you/HRMS-Backend/uploads/tasks/uuid.pdf
   URL: http://localhost:8082/uploads/tasks/uuid.pdf
   
   ✅ Both should match (minus the base directory)
   ```

4. **Test with curl:**
   ```bash
   curl -v http://localhost:8082/uploads/tasks/YOUR-FILE.pdf
   # Should return file content, not HTML error page
   ```

---

Need more help? Check backend console logs carefully!
