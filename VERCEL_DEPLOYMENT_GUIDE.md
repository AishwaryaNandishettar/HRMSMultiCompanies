# 🚀 VERCEL + RENDER DEPLOYMENT GUIDE

## Current Status: ✅ Localhost Working

Now let's deploy to production!

---

## 📍 Your Deployment URLs

- **Frontend (Vercel)**: `https://omoi-hrms.vercel.app`
- **Backend (Render)**: `https://latestfinalhrmsapplication.onrender.com`

---

## STEP 1: Configure Render Backend (5 minutes)

### 1.1 Go to Render Dashboard
Visit: https://dashboard.render.com/

### 1.2 Select Your Backend Service
Find your service (likely named "HRMS-Backend" or "latestfinalhrmsapplication")

### 1.3 Add Environment Variables
Click **Environment** in left sidebar, then add these variables:

| Key | Value |
|-----|-------|
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` |
| `SPRING_MAIL_PASSWORD` | `uibswyvitauzsjjf` |
| `FRONTEND_URL` | `https://omoi-hrms.vercel.app` |
| `MONGODB_URI` | `mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0` |
| `JWT_SECRET` | `MyFixedSecretKey123456` |
| `PORT` | `8080` |

### 1.4 Save & Wait for Redeploy
- Click **"Save Changes"**
- Render will automatically redeploy (takes 2-3 minutes)
- Wait for "Deploy succeeded" message

---

## STEP 2: Configure Vercel Frontend (3 minutes)

### 2.1 Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2.2 Select Your Frontend Project
Find your project (likely named "HRMS-Frontend" or "omoi-hrms")

### 2.3 Add Environment Variables
1. Click **Settings** tab
2. Click **Environment Variables** in left sidebar
3. Add these variables (select "Production" environment):

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://latestfinalhrmsapplication.onrender.com` |
| `VITE_API_URL` | `https://latestfinalhrmsapplication.onrender.com/api` |
| `VITE_WS_URL` | `https://latestfinalhrmsapplication.onrender.com/ws` |

### 2.4 Redeploy Frontend
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for "Build Completed" (takes 1-2 minutes)

---

## STEP 3: Test Production Deployment

### 3.1 Test Backend Health
Open in browser: `https://latestfinalhrmsapplication.onrender.com/actuator/health`

Should show:
```json
{"status":"UP"}
```

### 3.2 Test Frontend
Open: `https://omoi-hrms.vercel.app`

Should load the HRMS login page.

### 3.3 Test Invitation Flow
1. Login as Admin
2. Click **"Invite Employee"**
3. Enter email address
4. Click **"Send Invite Link"**
5. **Check the email inbox** — should receive invitation

### 3.4 Check the Email Content
The email should contain:
- ✅ Subject: "HRMS Invite - Your Login Details"
- ✅ Login link: `https://omoi-hrms.vercel.app` (NOT localhost!)
- ✅ Email (username)
- ✅ OTP
- ✅ Password: Temp@123

---

## 🔍 Troubleshooting

### Issue 1: Email still shows localhost link
**Problem**: `FRONTEND_URL` not set in Render
**Solution**: Go back to Step 1.3 and add `FRONTEND_URL=https://omoi-hrms.vercel.app`

### Issue 2: Email not sending
**Problem**: Gmail credentials not set in Render
**Solution**: 
- Check `SPRING_MAIL_USERNAME` and `SPRING_MAIL_PASSWORD` in Render
- Password should be: `uibswyvitauzsjjf` (no spaces)

### Issue 3: Frontend can't reach backend
**Problem**: CORS or wrong API URL
**Solution**:
- Check `VITE_API_BASE_URL` in Vercel settings
- Should be: `https://latestfinalhrmsapplication.onrender.com`
- Check browser console for CORS errors

### Issue 4: Backend CORS error
**Problem**: Vercel URL not in CORS allowedOrigins
**Solution**: Already configured in `application.properties`:
```
app.cors.allowedOrigins=http://localhost:5173,https://omoi-hrms.vercel.app,https://hrms-frontend-production.vercel.app
```
This should already work!

---

## 📊 Verification Checklist

After deployment, verify:

### Backend (Render):
- ✅ Health endpoint working
- ✅ Environment variables set
- ✅ Logs show no errors
- ✅ SMTP connection working

### Frontend (Vercel):
- ✅ App loads correctly
- ✅ API calls reaching backend
- ✅ No console errors
- ✅ Login working

### Email System:
- ✅ Invitation email sent
- ✅ Email contains Vercel URL (not localhost)
- ✅ Email contains OTP
- ✅ Email arrives in inbox

---

## 🎯 What Happens After Deployment

### Flow on Production:
```
Admin clicks "Invite Employee"
        ↓
Frontend (Vercel) → POST to Backend (Render)
        ↓
Backend creates User + Employee
        ↓
Backend generates OTP
        ↓
Backend sends email via Gmail SMTP
        ↓
Employee receives email with:
  - Link: https://omoi-hrms.vercel.app
  - OTP: 6-digit code
  - Password: Temp@123
        ↓
Employee clicks link → Opens Vercel app
        ↓
Employee enters OTP + new password
        ↓
Account activated!
```

---

## 📝 Important Notes

1. **Email Link**: Will now point to `https://omoi-hrms.vercel.app` instead of localhost
2. **Gmail Password**: Using App Password `uibswyvitauzsjjf` (valid for production)
3. **No Code Changes**: All changes are in environment variables only
4. **Both Single & Bulk Invite**: Will work in production

---

## ✅ Summary

What we did:
1. ✅ Fixed email quote bug (already done)
2. ✅ Updated Gmail password (already done)
3. ✅ Fixed hardcoded ngrok URLs (already done)
4. ✅ Fixed bulk invite endpoint (already done)
5. 🔄 Now: Set environment variables in Render + Vercel
6. 🔄 Now: Redeploy both services

---

## Need Help?

If anything goes wrong:
1. Check Render logs: Dashboard → Your Service → Logs
2. Check Vercel logs: Dashboard → Deployments → Latest → Logs
3. Check browser console for frontend errors
4. Check backend logs for email sending errors

Let me know if you need help with any step!
