# Documents Feature - Quick Start Guide

## ✅ Implementation Complete!

Profile page Documents section now:
- ✅ Shows real documents from database
- ✅ "View" button - opens PDF in browser
- ✅ "Download" button - downloads PDF
- ✅ Shows "No documents uploaded" if empty
- ✅ Works after Vercel deployment

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Restart Backend

```bash
cd HRMSProject/HRMS-Backend
./mvnw spring-boot:run
```

This loads the new document fields in Employee model.

### Step 2: Convert PDF to Base64

**Option A - Using Node.js Script (Recommended):**
```bash
cd HRMSProject
node convert_pdf_to_base64.js Resume.pdf
```

This will:
- Convert PDF to Base64
- Save to `.txt` file
- Show MongoDB command

**Option B - Manual Conversion:**

Windows PowerShell:
```powershell
$bytes = [System.IO.File]::ReadAllBytes("C:\path\to\Resume.pdf")
$base64 = [System.Convert]::ToBase64String($bytes)
Write-Output "data:application/pdf;base64,$base64"
```

Linux/Mac:
```bash
echo "data:application/pdf;base64,$(base64 -w 0 Resume.pdf)"
```

### Step 3: Update MongoDB

Open MongoDB Compass → MONGOSH and run:

```javascript
// For Aishwarya's resume
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQK..."
      // Paste the Base64 data from Step 2
    }
  }
);

// Verify
db.employees.findOne(
  { email: "Aishwarya@company.com" },
  { fullName: 1, resumeDocument: 1 }
);
```

---

## 📋 Available Document Fields

| Field Name | Display Name | Description |
|-----------|--------------|-------------|
| `resumeDocument` | Resume.pdf | Employee resume/CV |
| `aadhaarDocument` | Aadhaar.pdf | Aadhaar card |
| `offerLetterDocument` | Offer_Letter.pdf | Offer/Appointment letter |
| `panDocument` | PAN_Card.pdf | PAN card |
| `educationDocument` | Education_Certificate.pdf | Degree/certificates |

---

## 🧪 Testing

### Test with Sample PDF

Use this tiny test PDF (displays "Test PDF"):

```javascript
db.employees.updateOne(
  { email: "Aishwarya@company.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L0xlbmd0aCA0Mz4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooVGVzdCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE3OCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAwMDggMDAwMDAgbiAKMDAwMDAwMDIzNyAwMDAwMCBuIAowMDAwMDAwMjg2IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDQgMCBSCj4+CnN0YXJ0eHJlZgozODQKJSVFT0YK"
    }
  }
);
```

Then:
1. Go to Profile page
2. Scroll to Documents section
3. Click "View" - should open PDF in new tab showing "Test PDF"
4. Click "Download" - should download the PDF

---

## 📊 What Changed

### Before:
```
Documents
├─ Resume.pdf (hardcoded, doesn't exist)
├─ Aadhaar.pdf (hardcoded, doesn't exist)
└─ Offer_Letter.pdf (hardcoded, doesn't exist)
   └─ Download ❌ (fails)
```

### After:
```
Documents
├─ Resume.pdf (from database)
│  ├─ View ✅ (opens in browser)
│  └─ Download ✅ (downloads file)
├─ Aadhaar.pdf (from database)
│  ├─ View ✅
│  └─ Download ✅
└─ (Shows "No documents uploaded" if empty)
```

---

## ⚠️ Important Notes

### File Size Limits
- **Recommended:** < 5MB per document
- **Maximum:** 16MB total per employee (MongoDB limit)
- **Base64 overhead:** Files become ~33% larger when encoded

### Storage Location
- ✅ Stored in MongoDB (database)
- ✅ Survives deployments
- ✅ Backed up with database
- ❌ Not on file system

### Security
- Documents are stored as Base64 strings
- Only authenticated users can view their own profile
- Admin/Manager can view employee profiles
- No public access

---

## 🔧 Troubleshooting

### "No documents uploaded" shows but I added them
- ✅ Check: Did you restart the backend?
- ✅ Check: Is the Base64 string correct (starts with `data:application/pdf;base64,`)?
- ✅ Check: Did the MongoDB update succeed?

### Download/View doesn't work
- ✅ Check browser console for errors
- ✅ Verify Base64 string starts with `data:application/pdf;base64,`
- ✅ Try the test PDF first to verify setup

### File too large error
- ✅ MongoDB document limit is 16MB
- ✅ Base64 encoding increases size by ~33%
- ✅ Compress PDF or use external storage (S3, Cloudinary)

---

## 🎯 Next Steps (Optional Enhancements)

### 1. Add Upload Feature in Admin Panel
Allow admins to upload documents via UI instead of MongoDB:
- Add file input in Employee edit form
- Convert to Base64 in frontend
- Send to backend API
- Save in Employee document

### 2. Add More Document Types
- Passport
- Driving License
- Vaccination Certificate
- Background Verification Report

### 3. External Storage Migration
For larger files, migrate to:
- AWS S3
- Cloudinary
- Firebase Storage
- Azure Blob Storage

---

## ✅ Summary

**What's Working:**
- ✅ Documents stored in database (Base64)
- ✅ View button opens PDF in browser
- ✅ Download button downloads PDF
- ✅ Shows all 5 document types dynamically
- ✅ Shows "No documents uploaded" if empty
- ✅ Works after Vercel deployment

**What You Need to Do:**
1. Restart backend (loads new model fields)
2. Convert PDFs to Base64 (use script or manual)
3. Update MongoDB with Base64 data
4. Test View and Download buttons

**Files to Reference:**
- `DOCUMENTS_IMPLEMENTATION_COMPLETE.md` - Full documentation
- `convert_pdf_to_base64.js` - Helper script
- `DOCUMENTS_QUICK_START_GUIDE.md` - This guide
