# Fix Documents - Quick 5-Minute Guide

## Problem
- Documents show "N/A" in BGV page ❌
- Can't view or download documents ❌
- Documents stored as file paths (won't work after deployment) ❌

## Solution
Convert uploaded files to Base64 and store in database ✅

---

## 🚀 Quick Fix (5 Minutes)

### Step 1: Run PowerShell Script

Open PowerShell in `HRMSProject` folder:

```powershell
cd "D:\New folder\HRMSProject (2)\HRMSProject"
.\convert_documents_to_base64.ps1
```

This will:
- Find all uploaded documents
- Convert them to Base64
- Generate MongoDB update script
- Save script to `update_aishwarya_documents.js`

### Step 2: Run MongoDB Script

1. Open **MongoDB Compass**
2. Connect to your database
3. Click **MONGOSH** at bottom
4. Open `update_aishwarya_documents.js` (created by step 1)
5. Copy all contents
6. Paste into MONGOSH
7. Press Enter

### Step 3: Test

1. **Login as Aishwarya:**
   - Email: aishushettar9@gmail.com
   - Password: Welcome@123
   
2. **Go to Profile page**

3. **Scroll to Documents section**

4. **You should see:**
   - Resume.pdf [Download] [View]
   - PAN_Card.pdf [Download] [View]
   - Aadhaar.pdf [Download] [View]
   - Offer_Letter.pdf [Download] [View]
   - Education_Certificate.pdf [Download] [View]

5. **Click View** - Opens PDF in new tab ✅

6. **Click Download** - Downloads file ✅

---

## Alternative: Manual Conversion

If PowerShell script doesn't work:

### Convert Single File:

```bash
cd HRMSProject
node convert_pdf_to_base64.js "HRMS-Backend/uploads/tasks/FILENAME.pdf"
```

### Update MongoDB Manually:

```javascript
// Replace BASE64_HERE with output from above command

db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,BASE64_HERE"
    }
  }
);
```

---

## Test Documents

If you can't find original files, use test PDF:

```javascript
// Add test PDF to see if it works
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L0xlbmd0aCA0Mz4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooVGVzdCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE3OCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAwMDggMDAwMDAgbiAKMDAwMDAwMDIzNyAwMDAwMCBuIAowMDAwMDAwMjg2IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDQgMCBSCj4+CnN0YXJ0eHJlZgozODQKJSVFT0YK"
    }
  }
);

// Then check Profile page - Resume should appear and be viewable
```

---

## After Fix

### BGV Page (Admin View):
```
Documents
Resume:  f441508b-...docx  [View File] ✅ Works!
Aadhaar: 765e956f-...pdf   [View File] ✅ Works!
PAN:     0a601170-...pdf   [View File] ✅ Works!
```

### Profile Page (Employee View):
```
Documents
Resume.pdf          [Download] [View] ✅ Both work!
Aadhaar.pdf         [Download] [View] ✅ Both work!
PAN_Card.pdf        [Download] [View] ✅ Both work!
```

---

## Works After Deployment

✅ Documents stored in MongoDB (database)
✅ No file system dependency  
✅ Base64 travels with database
✅ Works on Vercel/Railway/any platform
✅ No localhost file paths

---

## Summary

**Problem:** File paths in database → "N/A" in UI
**Solution:** Base64 data in database → Documents work everywhere
**Time:** 5 minutes to fix
**Code changes:** ZERO (backend already supports it!)

---

## Quick Commands

```powershell
# Convert documents
.\convert_documents_to_base64.ps1

# Update MongoDB (paste generated script)
# Then test in Profile page
```

**Documents will now be viewable and downloadable! 📄✅**
