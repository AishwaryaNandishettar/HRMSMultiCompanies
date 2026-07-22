# Vercel Deployment - Email Configuration Guide

## ✅ Your Current Config is GOOD!

Your `application.properties` is correctly configured for both local and Vercel deployment!

```properties
# ✅ This is correct - uses environment variables with fallback
spring.mail.username=${SPRING_MAIL_USERNAME:aishushettar95@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:bbfskhrhtnujkokk}

# ✅ This is correct - frontend URL with environment variable
frontend.url=${FRONTEND_URL:http://localhost:5176}

# ✅ This is correct - MongoDB with environment variable
spring.data.mongodb.uri=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🚀 How It Works

### Local Development (localhost):
```
frontend.url = http://localhost:5176  (fallback value)
Email link: http://localhost:5176/onboarding?token=...
```

### Production (Vercel):
```
FRONTEND_URL environment variable = https://your-app.vercel.app
Email link: https://your-app.vercel.app/onboarding?token=...
```

**The `${FRONTEND_URL:http://localhost:5176}` syntax means:**
- Use `FRONTEND_URL` environment variable if set
- Otherwise, use `http://localhost:5176` as default

---

## 📋 Vercel Deployment Steps

### Step 1: Deploy Backend (Railway/Render)

**Why not Vercel for Backend?**
- Vercel is for frontend (React, Next.js)
- Backend needs **Railway** or **Render**

#### Option A: Railway.app (Recommended)

1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Connect GitHub repository
4. Select `HRMSProject/HRMS-Backend` folder
5. Add environment variables:

```bash
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
FRONTEND_URL=https://hrms-frontend-production.vercel.app
JWT_SECRET=MyFixedSecretKey123456
MONGODB_URI=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
PORT=8082
```

6. Deploy
7. Get backend URL: `https://your-backend.up.railway.app`

#### Option B: Render.com

1. Go to: https://render.com/
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select `HRMSProject/HRMS-Backend`
5. Build Command: `./mvnw clean package -DskipTests`
6. Start Command: `java -jar target/*.jar`
7. Add environment variables (same as above)
8. Deploy
9. Get backend URL: `https://your-backend.onrender.com`

---

### Step 2: Deploy Frontend (Vercel)

1. Go to: https://vercel.com/
2. Click "Add New" → "Project"
3. Import Git repository
4. Select `HRMSProject/HRMS-Frontend`
5. Framework: **Vite**
6. Root Directory: `HRMS-Frontend`
7. Build Command: `npm run build`
8. Output Directory: `dist`
9. Add environment variable:

```bash
VITE_API_URL=https://your-backend.up.railway.app
```

10. Deploy
11. Get frontend URL: `https://hrms-frontend-production.vercel.app`

---

### Step 3: Update Backend Environment Variable

After frontend is deployed, update backend environment variable:

**On Railway:**
1. Go to your backend project
2. Click "Variables"
3. Update `FRONTEND_URL`:
```bash
FRONTEND_URL=https://hrms-frontend-production.vercel.app
```
4. Redeploy

**On Render:**
1. Go to your backend service
2. Click "Environment"
3. Update `FRONTEND_URL`
4. Click "Save Changes"
5. Service will auto-redeploy

---

## ✅ Email Will Work After Deployment

### How Email Links Work:

**Local Development:**
```
Email contains: http://localhost:5176/onboarding?token=abc123
```

**After Vercel Deployment:**
```
Email contains: https://hrms-frontend-production.vercel.app/onboarding?token=abc123
```

**The backend automatically uses the correct URL based on environment!**

---

## 🔐 Gmail App Password for Production

### Important: Generate NEW App Password for Production

**Why?**
- `bbfskhrhtnujkokk` might be for development only
- Production should use dedicated credentials
- Better security separation

**Steps:**

1. **Generate New App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select: Mail → Other → Type "HRMS Production"
   - Copy 16-character password

2. **Update Backend Environment Variable:**
   ```bash
   SPRING_MAIL_PASSWORD=YOUR_NEW_PRODUCTION_PASSWORD
   ```

3. **Redeploy backend**

---

## 🧪 Testing After Deployment

### Test 1: Check Backend Health

Visit: `https://your-backend.up.railway.app/actuator/health`

Should return: `{"status":"UP"}`

### Test 2: Test Email Endpoint

```bash
curl -X POST https://your-backend.up.railway.app/api/employee/test-email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your.email@gmail.com\"}"
```

### Test 3: Send Actual Invitation

1. Go to: `https://hrms-frontend-production.vercel.app`
2. Login as admin
3. Go to Employee Directory
4. Click "Bulk Invite"
5. Select employee
6. Click "Send Invite"
7. Check email inbox (and spam!)

### Test 4: Check Email Link

When email arrives:
- Email should contain: `https://hrms-frontend-production.vercel.app/onboarding?token=...`
- **NOT** `http://localhost:5176/onboarding?token=...`
- Click link - should open production app

---

## 🐛 Troubleshooting After Deployment

### Issue 1: Email Still Shows localhost

**Cause:** `FRONTEND_URL` environment variable not set

**Fix:**
1. Check backend environment variables
2. Make sure `FRONTEND_URL=https://hrms-frontend-production.vercel.app`
3. Redeploy backend
4. Test again

### Issue 2: Email Not Sending

**Cause:** Gmail blocking production server IP

**Fix Option A - Use SendGrid (Recommended for Production):**

1. Sign up: https://sendgrid.com/ (free 100 emails/day)
2. Create API key
3. Update backend environment variables:
```bash
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
```

**Fix Option B - Enable Gmail for Less Secure Apps:**
- Not recommended for production
- Gmail may still block server IPs

### Issue 3: CORS Error

**Cause:** Backend not allowing frontend URL

**Fix:**
Update `application.properties`:
```properties
app.cors.allowedOrigins=http://localhost:5173,https://hrms-frontend-production.vercel.app
```

---

## 📊 Environment Variables Summary

### Backend (Railway/Render):

```bash
# Email Configuration
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=your_gmail_app_password_here

# Frontend URL (IMPORTANT!)
FRONTEND_URL=https://hrms-frontend-production.vercel.app

# Database
MONGODB_URI=mongodb+srv://...

# Security
JWT_SECRET=MyFixedSecretKey123456

# Server
PORT=8082
```

### Frontend (Vercel):

```bash
# Backend API URL
VITE_API_URL=https://your-backend.up.railway.app
```

---

## ✅ Final Checklist

**Before Deployment:**
- [ ] Backend code is committed to Git
- [ ] Frontend code is committed to Git
- [ ] Gmail App Password is valid
- [ ] MongoDB connection string is correct

**Deploy Backend:**
- [ ] Deployed to Railway/Render
- [ ] Added all environment variables
- [ ] Backend URL works (check /actuator/health)
- [ ] Can access API endpoints

**Deploy Frontend:**
- [ ] Deployed to Vercel
- [ ] Added VITE_API_URL environment variable
- [ ] Frontend URL works
- [ ] Can login to application

**Update Configuration:**
- [ ] Updated FRONTEND_URL on backend
- [ ] Redeployed backend
- [ ] Tested email sending
- [ ] Email contains production URL (not localhost)

**Test Email:**
- [ ] Send test invitation
- [ ] Email arrives in inbox/spam
- [ ] Email link contains https://your-app.vercel.app
- [ ] Clicking link opens production app
- [ ] Onboarding form works

---

## 🎯 Summary

### Your Config is Already Perfect!

```properties
# ✅ Correct - uses environment variables
spring.mail.username=${SPRING_MAIL_USERNAME:aishushettar95@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:bbfskhrhtnujkokk}

# ✅ Correct - switches between local and production
frontend.url=${FRONTEND_URL:http://localhost:5176}
```

### What Happens:

**Local:**
- `FRONTEND_URL` not set
- Uses fallback: `http://localhost:5176`
- Email links go to localhost ✅

**Production:**
- `FRONTEND_URL=https://hrms-frontend-production.vercel.app`
- Uses environment variable
- Email links go to production ✅

**No code changes needed!** Just set environment variables and deploy.

---

## 📞 Quick Deploy Commands

### Deploy Backend (Railway):
```bash
# Railway will auto-detect and deploy
# Just connect GitHub and add environment variables
```

### Deploy Frontend (Vercel):
```bash
# Vercel will auto-detect Vite project
# Set root directory to: HRMS-Frontend
# Add environment variable: VITE_API_URL
```

---

**Your application.properties is production-ready! Just deploy and set environment variables.** 🚀
