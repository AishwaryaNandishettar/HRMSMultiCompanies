# 🧪 Testing Checklist - Update Status Feature

## ✅ Phase 1: Visual Test (No Backend Required)

### **Test 1: Check Columns Appear**

1. Open your pipeline page: http://localhost:5176/recruitment/pipeline
2. Look at the table headers
3. ✅ Verify you see these columns:
   - ID
   - Name
   - **Email** ← NEW
   - Role
   - Exp
   - Status
   - Recruiter
   - Stage
   - **Comments** ← NEW
   - Action

**Expected Result:** ✅ You should see Email and Comments columns (they might show "-" if no data)

---

### **Test 2: Check Action Menu Opens**

1. Click the **"⋯"** (three dots) button on any candidate
2. A dropdown menu should appear

**Expected Result:** ✅ Menu opens

---

### **Test 3: Check "Update Status" Button**

1. In the action menu, look at the top
2. You should see **"✏️ Update Status"** in blue text
3. It should be the first option

**Expected Result:** ✅ "Update Status" appears at top in blue

---

### **Test 4: Open Modal**

1. Click **"✏️ Update Status"**
2. A modal should slide up from bottom

**Expected Result:** ✅ Modal opens with animation

**If Modal Doesn't Open:**
- Press F12 to open browser console
- Look for red error messages
- Take a screenshot and show me

---

### **Test 5: Check Modal Content**

When modal opens, you should see:

1. ✅ Header: "Update Candidate Status"
2. ✅ Candidate info: Name (email)
3. ✅ Status dropdown with options:
   - Received / Applied
   - Shortlisted
   - Interview Stage
   - Selected
   - Rejected
4. ✅ Comments textarea
5. ✅ Email notification info box
6. ✅ Two buttons: Cancel | Save & Notify Candidate

**Expected Result:** ✅ All elements visible

---

### **Test 6: Fill Form**

1. Select a status from dropdown (e.g., "Shortlisted")
2. Type in comments: "Great candidate, moving forward"
3. Try clicking "Save & Notify Candidate"

**Expected Result:** 
- If backend not ready: Error message appears
- This is OK! It means frontend is working correctly

---

## ✅ Phase 2: Backend Test (After API Created)

### **Test 7: Add Test Email Data**

**Option A: Using MongoDB Compass**

1. Open MongoDB Compass
2. Connect to your database
3. Find `candidates` or `jobs` collection
4. Edit the first candidate document:
   ```json
   {
     "_id": "696cb175c2b8b04848f4a39a",
     "jobTitle": "Frontend Developer",
     "designation": "Web Developer",
     "status": "Selected",
     "email": "test@example.com",  ← ADD THIS
     "comments": ""                 ← ADD THIS
   }
   ```
5. Save changes
6. Repeat for 2-3 more candidates

**Option B: Using Script**

1. Update `ADD_TEST_DATA.js` with your real candidate IDs
2. Run: `node ADD_TEST_DATA.js`

---

### **Test 8: Verify Email Appears in Table**

1. Refresh your pipeline page
2. Check the Email column
3. You should now see email addresses instead of "-"

**Expected Result:** ✅ Email addresses visible in table

---

### **Test 9: Test Backend API (Using Postman)**

Before testing from frontend, test the API directly:

1. Open Postman or Thunder Client
2. Create new POST request
3. URL: `http://localhost:5000/api/candidates/update-status`
4. Headers:
   ```
   Content-Type: application/json
   ```
5. Body (JSON):
   ```json
   {
     "candidateId": "696cb175c2b8b04848f4a39a",
     "candidateName": "Frontend Developer",
     "candidateEmail": "test@example.com",
     "newStatus": "Shortlisted",
     "comments": "Test comment from Postman",
     "emailSubject": "Application Shortlisted",
     "emailBody": "Dear Candidate, You have been shortlisted!"
   }
   ```
6. Click **Send**

**Expected Result:**
```json
{
  "success": true,
  "message": "Status updated and email sent",
  "candidate": { ... }
}
```

**If Error:**
- Check if backend server is running
- Check .env file has email credentials
- Check MongoDB connection

---

### **Test 10: Full Flow Test (Frontend → Backend → Email)**

Now test the complete flow:

1. Go to pipeline page
2. Click "⋯" on a candidate
3. Click "✏️ Update Status"
4. Modal opens
5. Select status: "Shortlisted"
6. Add comment: "Excellent technical skills"
7. Click "Save & Notify Candidate"
8. Wait 2-3 seconds

**Expected Results:**

1. ✅ Success alert appears: "Status updated! Email sent to..."
2. ✅ Modal closes
3. ✅ Table updates immediately:
   - Status badge changes to "Shortlisted"
   - Comments column shows your comment
4. ✅ Check candidate's email inbox
   - Email should arrive within 1-2 minutes
   - Subject: "Application Shortlisted - Congratulations!"

---

## 🐛 Troubleshooting

### **Problem 1: Modal Not Opening**

**Check Console:**
1. Press F12
2. Go to Console tab
3. Look for errors like:
   - "UpdateStatusModal is not defined"
   - "Cannot find module"

**Solution:**
- Make sure `UpdateStatusModal.jsx` file exists
- Check import statement in PipelineTable.jsx
- Restart frontend server

---

### **Problem 2: Email Column Shows "-"**

**Reason:** Database doesn't have email field yet

**Solution:**
1. Add email field to database manually
2. Or use the ADD_TEST_DATA.js script
3. Refresh page

---

### **Problem 3: Backend API Not Working**

**Check:**
1. Is backend server running?
   ```bash
   npm start  # or node server.js
   ```
2. Check terminal for errors
3. Verify .env file has:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```
4. Is nodemailer installed?
   ```bash
   npm install nodemailer
   ```

---

### **Problem 4: Email Not Sending**

**Common Issues:**

1. **Wrong Email Password**
   - Use App Password, not regular Gmail password
   - Get from: https://myaccount.google.com/apppasswords

2. **Gmail Blocking SMTP**
   - Enable "Less secure app access" (not recommended)
   - OR use App Password (recommended)

3. **Network Issue**
   - Check internet connection
   - Try sending test email from Postman first

---

## 📊 Expected Behavior Summary

### **When HR Updates Status to "Shortlisted":**

```
1. HR clicks "⋯" → "Update Status"
2. Modal opens
3. HR selects "Shortlisted"
4. HR adds comment: "Good communication skills"
5. HR clicks "Save & Notify Candidate"

Backend:
├─ Updates database
├─ Saves comment
└─ Sends email

Frontend:
├─ Shows success message
├─ Closes modal
└─ Updates table immediately

Candidate:
└─ Receives email within 1-2 minutes
```

---

## 📸 Screenshots to Take

When testing, take screenshots of:

1. ✅ Pipeline table showing Email & Comments columns
2. ✅ Action menu with "Update Status" button
3. ✅ Modal opened and filled
4. ✅ Success message after save
5. ✅ Table updated with new status and comments
6. ✅ Email received in candidate's inbox

---

## ✅ Final Checklist

### Frontend:
- [ ] Email column visible in table
- [ ] Comments column visible in table
- [ ] "⋯" action button works
- [ ] "Update Status" button appears (in blue)
- [ ] Modal opens when clicked
- [ ] Modal has all form fields
- [ ] Modal closes with Cancel button
- [ ] No console errors

### Backend:
- [ ] Backend server running
- [ ] .env file configured
- [ ] nodemailer installed
- [ ] API endpoint created
- [ ] Database has email & comments fields
- [ ] Postman test successful

### Email:
- [ ] Email credentials correct
- [ ] Test email sends from Postman
- [ ] Email arrives in inbox
- [ ] Subject and body correct
- [ ] Candidate name personalized

### Complete Flow:
- [ ] Update status from frontend
- [ ] Success message appears
- [ ] Database updates
- [ ] Table updates immediately
- [ ] Email sends to candidate
- [ ] Comments saved

---

## 🎯 Quick Test Commands

```bash
# Start frontend
cd HRMS-Frontend
npm run dev

# Start backend (in separate terminal)
cd HRMS-Backend
npm start

# Test API with curl
curl -X POST http://localhost:5000/api/candidates/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "696cb175c2b8b04848f4a39a",
    "candidateName": "Test Candidate",
    "candidateEmail": "test@example.com",
    "newStatus": "Shortlisted",
    "comments": "Test comment",
    "emailSubject": "Test Email",
    "emailBody": "This is a test email"
  }'
```

---

## 🆘 If Stuck

1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify .env file configuration
4. Test backend API with Postman first
5. Add console.log() statements to debug
6. Share error messages for help

---

**Remember:** Test in phases! Don't try to test everything at once.

**Start with:** Frontend visual test → Then backend API → Then complete flow

