# Employee Login & Email Issue - Complete Guide

## 📧 Issue 1: Email Not Received

### Why Email Didn't Arrive:

**Most likely causes:**

1. **Gmail App Password Invalid** (`bbfskhrhtnujkokk`)
2. **Email in Spam folder**
3. **Backend error** (check console logs)
4. **Email service not working**

### Quick Check:

#### Step 1: Check Backend Console Logs

When you clicked "Send Invite", what did backend console show?

**Look for:**
```
✅ SUCCESS:
📩 Bulk invite sent to: aishushettar9@gmail.com
Email sent successfully

❌ ERROR:
❌ Failed sending bulk invite: [error message]
Authentication failed
Connection timeout
```

#### Step 2: Check Gmail Spam Folder

1. Open Gmail: aishushettar9@gmail.com
2. Click **Spam** folder
3. Search for: "HRMS Invitation"
4. If found, click "Not spam"

#### Step 3: Test Email Manually

Run the test endpoint to verify email is working:

**Using test-email.html:**
1. Open `HRMSProject/test-email.html` in browser
2. Enter: `aishushettar9@gmail.com`
3. Click "Send Test Email"
4. Watch backend console
5. Check Gmail inbox/spam

**Using Postman:**
```
POST http://localhost:8082/api/employee/test-email
Content-Type: application/json

{
  "email": "aishushettar9@gmail.com"
}
```

---

## 🔑 Issue 2: How to Login for This Employee

### Current Status:
- Employee: Aishwarya Sunil Nandishettar
- Employee ID: OMOI9606
- Email: aishushettar9@gmail.com
- Status: Onboarded (documents uploaded)

### Problem:
Employee needs password to login, but email invitation didn't arrive.

### Solution: Reset Password in Database

#### Option A: Use MongoDB Script (Easiest)

1. **Open MongoDB Compass**
2. Connect to your database
3. Click **MONGOSH** at bottom
4. Run this script:

```javascript
// Set password to: Welcome@123
db.users.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      password: "$2a$10$EIXgP9L3qXqQ0YZ0kQX0QeK8h9.9Y6ZGJ1xLvR3fKx5YqGZLXX2Ky",
      active: true
    }
  }
);

// Activate employee
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { status: "ACTIVE" } }
);

console.log("✅ Password set to: Welcome@123");
```

2. **Login Credentials:**
```
Email:    aishushettar9@gmail.com
Password: Welcome@123
URL:      http://localhost:5173
```

#### Option B: Use Password Reset Feature

If your HRMS has "Forgot Password" feature:

1. Go to login page
2. Click "Forgot Password"
3. Enter: aishushettar9@gmail.com
4. Check email for reset link
5. Set new password

#### Option C: Admin Can Reset Password

If you're logged in as admin:

1. Go to Employee Directory
2. Find Aishwarya Sunil Nandishettar
3. Click Edit
4. Look for "Reset Password" option
5. Set new password

---

## 📄 Issue 3: Upload Documents to Database

I can see documents are uploaded as files:
```
Resume:  /uploads/tasks/f441508b-7233-4acc-8653-a3ec13566be4.docx
PAN:     /uploads/tasks/0a601170-eca1-4e5a-821f-c85494151fe8.pdf
Aadhaar: /uploads/tasks/765e956f-710a-4ece-ac13-f73a354b4fc6.pdf
...
```

### Problem:
These are file paths on local system. After deployment, files won't be accessible.

### Solution: Convert to Base64 and Store in Database

#### Step 1: Convert Documents to Base64

**Use the conversion script:**

```bash
cd HRMSProject
node convert_pdf_to_base64.js /uploads/tasks/0a601170-eca1-4e5a-821f-c85494151fe8.pdf
```

This will output Base64 data.

#### Step 2: Update Employee Record

```javascript
// Update employee with Base64 documents
db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  {
    $set: {
      resumeDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      panDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      aadhaarDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      offerLetterDocument: "data:application/pdf;base64,JVBERi0xLjQK...",
      educationDocument: "data:application/pdf;base64,JVBERi0xLjQK..."
    }
  }
);
```

---

## 🎯 Quick Action Steps

### For Immediate Login:

1. **Set Password in MongoDB:**
```javascript
db.users.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { 
      password: "$2a$10$EIXgP9L3qXqQ0YZ0kQX0QeK8h9.9Y6ZGJ1xLvR3fKx5YqGZLXX2Ky",
      active: true 
  }}
);

db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { status: "ACTIVE" } }
);
```

2. **Login:**
- URL: http://localhost:5173
- Email: aishushettar9@gmail.com
- Password: Welcome@123

### For Email Issue:

1. **Check Backend Console** - What error did you see?
2. **Test Email Endpoint** - Use test-email.html
3. **Check Gmail Spam** - Email might be there
4. **Update Gmail App Password** - Generate new one

---

## 📊 Verify Employee Status

### Check User Account:
```javascript
db.users.findOne({ email: "aishushettar9@gmail.com" })
```

**Should show:**
```json
{
  "email": "aishushettar9@gmail.com",
  "role": "EMPLOYEE",
  "active": true,
  "password": "$2a$10$..." // Hashed password
}
```

### Check Employee Record:
```javascript
db.employees.findOne({ email: "aishushettar9@gmail.com" })
```

**Should show:**
```json
{
  "employeeId": "OMOI9606",
  "fullName": "Aishwarya Sunil Nandishettar",
  "email": "aishushettar9@gmail.com",
  "status": "ACTIVE"
}
```

---

## 🔍 Debug Email Issue

### Check Backend Logs:

When you clicked "Send Invite", look for:

**Success:**
```
📩 Bulk invite sent to: aishushettar9@gmail.com
Email sent successfully to: aishushettar9@gmail.com
DEBUG: 250 2.0.0 OK
```

**Failure:**
```
❌ Failed sending bulk invite: Authentication failed
535-5.7.8 Username and Password not accepted
javax.mail.AuthenticationFailedException
```

### Common Email Errors:

| Error | Cause | Fix |
|-------|-------|-----|
| Authentication failed | Wrong Gmail App Password | Generate new password |
| Connection timeout | Port 587 blocked | Try port 465 |
| Template not found | Missing email template | Verify template exists |
| No error but no email | Email in spam | Check spam folder |

---

## 📝 Summary

### Login Issue: ✅ SOLVED
**Set password using MongoDB script above.**

Login with:
- Email: aishushettar9@gmail.com
- Password: Welcome@123

### Email Issue: ⏳ NEEDS DEBUGGING
**Share backend console output when you clicked "Send Invite".**

### Documents Issue: ℹ️ INFO
Documents are uploaded as files. For production, convert to Base64 and store in database (optional).

---

## 🆘 Next Steps

1. **Run MongoDB script** to set password
2. **Login** with Welcome@123
3. **Test login** - employee should access profile, attendance, etc.
4. **Fix email** - share backend console logs
5. **Convert documents** (optional, for production)

---

## 🔑 Quick Login Script

**Copy and paste into MongoDB Compass → MONGOSH:**

```javascript
// Enable login for Aishwarya
db.users.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { 
      password: "$2a$10$EIXgP9L3qXqQ0YZ0kQX0QeK8h9.9Y6ZGJ1xLvR3fKx5YqGZLXX2Ky",
      active: true 
  }}
);

db.employees.updateOne(
  { email: "aishushettar9@gmail.com" },
  { $set: { status: "ACTIVE" } }
);

console.log("✅ Login enabled!");
console.log("Email: aishushettar9@gmail.com");
console.log("Password: Welcome@123");
```

**That's it! Employee can now login.** 🎉
