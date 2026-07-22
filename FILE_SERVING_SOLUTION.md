# File Serving Solution - Documents Stored on Server

## ✅ What I Added

Added a file download endpoint to serve uploaded files from the server.

**File:** `FileController.java`

**New Endpoint:**
```
GET /api/files/download/{filename}
```

This allows documents to be accessed via HTTP.

---

## 🚀 How to Fix Documents Now

### Step 1: Restart Backend

```bash
cd HRMSProject/HRMS-Backend
./mvnw spring-boot:run
```

### Step 2: Update Document URLs in Database

Run this in MongoDB Compass → MONGOSH:

```javascript
// Update Aishwarya's document URLs to use backend API

const onboarding = db.onboarding_records.findOne({ 
  "personal.email": "aishushettar9@gmail.com" 
});

if (onboarding && onboarding.documents) {
  const docs = onboarding.documents;
  
  // Function to extract filename
  function getFilename(path) {
    if (!path || path === 'N/A') return null;
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  
  // Update with backend API URLs
  const updates = {};
  
  // Resume
  if (docs.resume) {
    const filename = getFilename(docs.resume);
    if (filename) {
      updates["documents.resume"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  // PAN
  if (docs.pan || docs.pancard_pdf) {
    const filename = getFilename(docs.pan || docs.pancard_pdf);
    if (filename) {
      updates["documents.pan"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.pancard_pdf"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  // Aadhaar
  if (docs.aadhaar || docs.aadharFile || docs.adharcard_pdf) {
    const filename = getFilename(docs.aadhaar || docs.aadharFile || docs.adharcard_pdf);
    if (filename) {
      updates["documents.aadhaar"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.aadharFile"] = `http://localhost:8082/api/files/download/${filename}`;
      updates["documents.adharcard_pdf"] = `http://localhost:8082/api/files/download/${filename}`;
    }
  }
  
  // Apply updates
  if (Object.keys(updates).length > 0) {
    db.onboarding_records.updateOne(
      { "personal.email": "aishwarya@gmail.com" },
      { $set: updates }
    );
    console.log("✅ Document URLs updated!");
  }
}
```

### Step 3: Test

1. Go to BGV page (as admin)
2. Find Aishwarya's record
3. Click "View Details"
4. Click "View File" on any document
5. Document should open in browser! ✅

---

## ⚠️ IMPORTANT: Production Deployment Issue

**This solution works for LOCALHOST ONLY!**

### Why it won't work after Vercel deployment:

1. **Vercel is serverless** - no file system
2. **Files disappear** after each deployment
3. **Backend restarts** lose uploaded files
4. **Railway/Render** - same issue (ephemeral file system)

---

## 🌐 Production Solution Required

For production deployment, you MUST use one of these:

### Option 1: Cloud Storage (Recommended)

**AWS S3, Cloudinary, Azure Blob, Google Cloud Storage**

**How it works:**
1. Files uploaded to cloud storage
2. Get permanent URL from cloud
3. Store URL in database
4. Works everywhere

**Example with Cloudinary:**
```java
// Upload returns permanent URL
String fileUrl = cloudinary.uploader.upload(file)
    .get("secure_url").toString();
// Store this URL in database
```

### Option 2: Base64 in Database

**Store files as Base64 strings in MongoDB**

**Pros:**
- ✅ Works everywhere (localhost and production)
- ✅ No external dependencies
- ✅ Survives deployments
- ✅ Already implemented in backend!

**Cons:**
- ❌ Increases database size by ~33%
- ❌ 16MB MongoDB document limit
- ❌ Not ideal for very large files

**This is what I recommended earlier!**

---

## 📋 Current Status

### ✅ Localhost (After applying fix):
- Files stored in `uploads/tasks/`
- Accessible via `http://localhost:8082/api/files/download/{filename}`
- Can view and download ✅

### ❌ After Deployment:
- Files lost on each deployment
- URLs won't work
- Need cloud storage OR Base64 solution

---

## 🎯 Recommendation

**Use Base64 in Database (No logic changes needed!)**

The backend ALREADY supports Base64 documents:
- `Employee` model has: `resumeDocument`, `aadhaarDocument`, etc.
- `Profile.jsx` already displays Base64 documents
- Just need to convert uploaded files to Base64

**Why Base64?**
- ✅ Works in localhost
- ✅ Works after Vercel deployment
- ✅ No external service needed
- ✅ No additional cost
- ✅ Backend already supports it
- ✅ No code changes needed

**Only downside:** File size limit (16MB per document)

For most HR documents (resumes, IDs, certificates), this is fine.

---

## 🚀 Quick Decision Guide

**If documents are < 5MB each:** Use Base64 (easiest)

**If documents are > 5MB:** Use cloud storage (AWS S3, Cloudinary)

**For now (testing):** Current file serving works on localhost

**Before deployment:** Must switch to Base64 or cloud storage

---

## Summary

✅ **Added:** File download endpoint (`/api/files/download/{filename}`)

✅ **Works:** Localhost only

❌ **Won't work:** After Vercel/Railway deployment (no file system)

✅ **Solution:** Use Base64 in database (already supported by backend!)

---

**For localhost testing, restart backend and update URLs in database. For production, we need to use Base64 storage (which I can help you set up).**
