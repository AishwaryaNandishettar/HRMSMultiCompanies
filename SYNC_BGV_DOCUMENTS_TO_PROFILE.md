# Sync BGV Documents to Profile - Complete Solution

## Problem

Documents uploaded during onboarding are stored as file paths:
```
/uploads/tasks/f441508b-7233-4acc-8653-a3ec13566be4.docx
```

These file paths:
- ❌ Show as "N/A" in BGV page
- ❌ Can't be viewed or downloaded
- ❌ Won't work after Vercel deployment (no file system)
- ❌ Don't appear in Profile page Documents section

## Solution

Store documents as **Base64 data in MongoDB** so they:
- ✅ Can be viewed and downloaded
- ✅ Work in localhost and production
- ✅ Persist across deployments
- ✅ Appear in Profile page

---

## Step 1: Convert Uploaded Files to Base64

### For Aishwarya's Documents:

You need to convert the uploaded files to Base64. The files are stored in:
```
D:/New folder/HRMSProject (2)/HRMSProject/HRMS-Backend/uploads/tasks/
```

**Convert each file:**

```bash
cd HRMSProject
node convert_pdf_to_base64.js "HRMS-Backend/uploads/tasks/f441508b-7233-4acc-8653-a3ec13566be4.docx"
```

This will output Base64 data that you can copy.

---

## Step 2: Update MongoDB with Base64 Documents

### Option A: Update OnboardingRecord

```javascript
// Find Aishwarya's onboarding record
db.onboarding_records.findOne({ 
  "personal.email": "aishushettar9@gmail.com" 
});

// Update with Base64 data
db.onboarding_records.updateOne(
  { "personal.email": "aishushettar9@gmail.com" },
  {
    $set: {
      "documents.resume": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.aadhaar": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.pan": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.offerLetter": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.education": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.experience": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.paySlips": "data:application/pdf;base64,JVBERi0xLjQK...",
      "documents.relieving": "data:application/pdf;base64,JVBERi0xLjQK..."
    }
  }
);
```

### Option B: Update Employee Record Directly

```javascript
// Update employee with Base64 documents
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      aadhaarDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      panDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      offerLetterDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      educationDocument: "data:application/pdf;base64,JVBERi0xLjQK..."
    }
  }
);
```

---

## Step 3: Quick Script for Aishwarya

### If you have the actual PDF files:

```javascript
// MongoDB Script to update Aishwarya's documents
// Replace BASE64_DATA_HERE with actual Base64 from conversion

// For Resume (if it's a DOCX, convert to PDF first or use application/docx)
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      // Resume - DOCX file
      resumeDocument: "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,BASE64_DATA_HERE",
      
      // PAN - PDF file
      panDocument: "data:application/pdf;base64,BASE64_DATA_HERE",
      
      // Aadhaar - PDF file
      aadhaarDocument: "data:application/pdf;base64,BASE64_DATA_HERE",
      
      // Offer Letter - PDF file
      offerLetterDocument: "data:application/pdf;base64,BASE64_DATA_HERE",
      
      // Education - PDF file
      educationDocument: "data:application/pdf;base64,BASE64_DATA_HERE"
    }
  }
);

console.log("✅ Documents updated for Aishwarya");

// Also update onboarding record
db.onboarding_records.updateOne(
  { "personal.email": "aishushettar9@gmail.com" },
  {
    $set: {
      "documents.resume": "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,BASE64_DATA_HERE",
      "documents.pan": "data:application/pdf;base64,BASE64_DATA_HERE",
      "documents.aadhaar": "data:application/pdf;base64,BASE64_DATA_HERE",
      "documents.offerLetter": "data:application/pdf;base64,BASE64_DATA_HERE",
      "documents.education": "data:application/pdf;base64,BASE64_DATA_HERE"
    }
  }
);

console.log("✅ Onboarding record updated");
```

---

## Step 4: Verify Documents Appear

### Check Employee Record:
```javascript
db.employees.findOne(
  { email: "aishushettar9@gmail.com" },
  { resumeDocument: 1, panDocument: 1, aadhaarDocument: 1 }
);
```

**Should show Base64 data:**
```json
{
  "resumeDocument": "data:application/pdf;base64,JVBERi0xLjQK...",
  "panDocument": "data:application/pdf;base64,JVBERi0xLjQK...",
  "aadhaarDocument": "data:application/pdf;base64,JVBERi0xLjQK..."
}
```

### Test in Profile Page:

1. Login as Aishwarya (aishushettar9@gmail.com / Welcome@123)
2. Go to Profile page
3. Scroll to Documents section
4. Documents should appear with View and Download buttons
5. Click View - opens PDF in new tab
6. Click Download - downloads the file

### Test in BGV Page (Admin):

1. Login as Admin
2. Go to BGV page
3. Find Aishwarya's record
4. Click "View Details"
5. Documents section should show filenames (not N/A)
6. Click "View File" - opens document in new tab

---

## Alternative: Test with Sample Documents

If you don't have the original files, use test PDFs:

### Sample Test PDF (tiny, displays "Test PDF"):

```javascript
// Update with test PDF
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L0xlbmd0aCA0Mz4+CnN0cmVhbQpCVAovRjEgMjQgVGYKMTAwIDcwMCBUZAooVGVzdCBQREYpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKMSAwIG9iago8PC9UeXBlIC9QYWdlcwovS2lkcyBbMyAwIFJdCi9Db3VudCAxCj4+CmVuZG9iago0IDAgb2JqCjw8L1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDEgMCBSCj4+CmVuZG9iago1IDAgb2JqCjw8L1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDE3OCAwMDAwMCBuIAowMDAwMDAwMDc5IDAwMDAwIG4gCjAwMDAwMDAwMDggMDAwMDAgbiAKMDAwMDAwMDIzNyAwMDAwMCBuIAowMDAwMDAwMjg2IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA2Ci9Sb290IDQgMCBSCj4+CnN0YXJ0eHJlZgozODQKJSVFT0YK"
    }
  }
);

console.log("✅ Test PDF added");
```

---

## How It Works After Fix

### BGV Page:
```
Documents
Resume:  f441508b-7233-4acc-8653-a3ec13566be4.docx  [View File]
Aadhaar: 765e956f-710a-4ece-ac13-f73a354b4fc6.pdf  [View File]
PAN:     0a601170-eca1-4e5a-821f-c85494151fe8.pdf  [View File]
```

Clicking "View File" opens the document in a new tab.

### Profile Page (Documents Section):
```
Documents
Resume.pdf          [Download] [View]
Aadhaar.pdf         [Download] [View]
PAN_Card.pdf        [Download] [View]
Offer_Letter.pdf    [Download] [View]
Education_Certificate.pdf [Download] [View]
```

Both View and Download work because documents are stored as Base64 in database.

---

## Production Deployment

### Works After Vercel Deployment Because:

✅ Documents stored in MongoDB (database)
✅ No file system dependency
✅ Base64 data travels with database
✅ Frontend reads from API
✅ No localhost file paths

---

## Quick Action for Aishwarya

### Minimum to make documents work:

1. **Find uploaded files:**
```
D:/New folder/HRMSProject (2)/HRMSProject/HRMS-Backend/uploads/tasks/
```

2. **Convert main documents:**
- Resume: f441508b-7233-4acc-8653-a3ec13566be4.docx
- PAN: 0a601170-eca1-4e5a-821f-c85494151fe8.pdf
- Aadhaar: 765e956f-710a-4ece-ac13-f73a354b4fc6.pdf

3. **Use conversion script:**
```bash
node convert_pdf_to_base64.js "HRMS-Backend/uploads/tasks/FILE_NAME_HERE.pdf"
```

4. **Update MongoDB** with Base64 data (script above)

5. **Test in Profile page** - documents should now work

---

## Summary

✅ **Solution:** Store documents as Base64 in MongoDB
✅ **Works:** Localhost and Vercel deployment
✅ **No code changes:** Backend already supports Base64 documents
✅ **Frontend ready:** Profile page already displays documents from database

**Just need to convert files to Base64 and update MongoDB!**
