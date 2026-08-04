# ✅ INVITATION EMAIL SYSTEM - SETUP COMPLETE

## What Was Fixed (LOCALHOST)

### 1. Gmail App Password Updated ✅
- **New password**: `uibswyvitauzsjjf` (without spaces: `uibs wyvi tauz sjjf`)
- Updated in:
  - `HRMS-Backend/src/main/resources/application.properties`
  - `HRMS-Backend/.env`

### 2. Hardcoded ngrok URLs Removed ✅
- Fixed in `HRMS-Frontend/src/Components/InviteEmployee.jsx`
- Fixed in `HRMS-Frontend/src/Pages/InviteAccept.jsx`
- Now uses `http://localhost:8082` as fallback
- Will use `VITE_API_BASE_URL` from `.env` when set

### 3. Bulk Invite Endpoint Fixed ✅
- Frontend now calls `/api/onboarding/bulk-invite` (matches backend)
- Previously was calling `/invite-all` which didn't exist

---

## How to Test on LOCALHOST

### Step 1: Start Backend
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
mvn clean install
mvn spring-boot:run
```
**Backend will run on**: `http://localhost:8082`

### Step 2: Start Frontend
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm install
npm run dev
```
**Frontend will run on**: `http://localhost:5173`

### Step 3: Test Single Invite
1. Open browser: `http://localhost:5173`
2. Login as Admin
3. Click **"Invite Employee"** button
4. Enter email address (use your own email or a test email you have access to)
5. Click **"Send Invite Link"**
6. **Check the email inbox** — you should receive:
   - Subject: "HRMS Invitation - Welcome!"
   - Login link: `http://localhost:5173`
   - Username: (the email you entered)
   - OTP: (6-digit code)
   - Password: `Temp@123`

### Step 4: Test Bulk Invite
1. Click **"Send All Invites"** button
2. (You may need to modify the code to pass an array of employees)
3. Check that multiple emails are sent

### Step 5: Test Employee Acceptance Flow
1. Open the email you received
2. Click the login link (will open `http://localhost:5173`)
3. Enter the OTP from the email
4. Set a new password
5. Confirm password
6. Click **"Create Account"**
7. Should redirect to login page with success message

---

## Current Email Configuration

### SMTP Settings (Gmail)
```
Host: smtp.gmail.com
Port: 587
TLS: enabled
Auth: enabled
Username: aishushettar95@gmail.com
Password: uibswyvitauzsjjf (App Password)
```

### Email Template
Location: `HRMS-Backend/src/main/resources/templates/email/invite-email.html`

Template includes:
- Company name
- Department & Position
- Start date
- Manager name
- Login credentials (email, OTP, password)
- Login link

---

## Next Steps: VERCEL DEPLOYMENT

After confirming localhost works, we'll do:

### For Vercel Frontend:
1. Set environment variable: `VITE_API_BASE_URL=https://latestfinalhrmsapplication.onrender.com`
2. Redeploy frontend

### For Render Backend:
1. Set environment variable: `FRONTEND_URL=https://omoi-hrms.vercel.app`
2. Set environment variable: `SPRING_MAIL_USERNAME=aishushettar95@gmail.com`
3. Set environment variable: `SPRING_MAIL_PASSWORD=uibswyvitauzsjjf`
4. Redeploy backend

### Email links will then point to:
- Production: `https://omoi-hrms.vercel.app`
- Not localhost anymore

---

## Troubleshooting

### Email not sending?
**Check backend logs for**:
```
📧 Sending invite email via SendGrid to: [email]
⚠️ SendGrid not available. Falling back to JavaMail SMTP.
📤 Sending email to: [email] | from: aishushettar95@gmail.com
✅ Email sent successfully to: [email]
```

**Common issues**:
1. Gmail App Password expired → Generate new one
2. Port 587 blocked → Check firewall
3. Wrong email in template → Check `meeting.email.from-address` in properties

### Frontend can't reach backend?
**Check**:
1. Backend is running on `http://localhost:8082`
2. Frontend `.env` has: `VITE_API_BASE_URL=http://localhost:8082`
3. Browser console for CORS errors
4. Backend CORS config includes: `http://localhost:5173`

### Bulk invite not working?
**Make sure**:
1. You're passing an array like:
```js
handleInviteAll([
  { email: "user1@example.com", fullName: "User One", department: "IT", designation: "Developer" },
  { email: "user2@example.com", fullName: "User Two", department: "HR", designation: "Manager" }
])
```

---

## Files Modified

### Backend:
- ✅ `HRMS-Backend/src/main/resources/application.properties` (Gmail password)
- ✅ `HRMS-Backend/.env` (Gmail password)

### Frontend:
- ✅ `HRMS-Frontend/src/Components/InviteEmployee.jsx` (removed ngrok, fixed bulk endpoint)
- ✅ `HRMS-Frontend/src/Pages/InviteAccept.jsx` (removed ngrok)

### No Logic Changed ✅
All existing logic preserved — only configuration and URL fixes!
