# 🚀 HRMS Deployment Guide - Localhost & Vercel

## 📋 Overview

This guide covers:
- ✅ Testing email invitations on localhost
- 🌐 Deploying backend to Railway/Render
- 🌐 Deploying frontend to Vercel
- ✉️ Ensuring email invitations work in production

---

## 🏠 PART 1: Localhost Setup (Testing)

### **Step 1: Prerequisites**

Ensure you have:
- ✅ Node.js (v16+)
- ✅ Java 17+
- ✅ Maven
- ✅ MongoDB (local or Atlas)

### **Step 2: Configure Environment**

The application is already configured! Just verify:

**File: `application.properties`**
```properties
frontend.url=${FRONTEND_URL:http://localhost:5173}
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=uiurdbkdhtexubjr
```

### **Step 3: Start Backend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"

# Option A: Using Maven wrapper
mvnw spring-boot:run

# Option B: Using Maven
mvn spring-boot:run

# Backend will start on: http://localhost:8082
```

### **Step 4: Start Frontend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"

# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Frontend will start on: http://localhost:5173
```

### **Step 5: Test Email Invitation**

**Method A: Using Test Script**

1. Edit `quick-test-email.js`:
```javascript
const TEST_EMAIL = 'your-email@gmail.com'; // Change this
```

2. Run the test:
```bash
npm install axios
node quick-test-email.js
```

**Method B: Using UI**

1. Open http://localhost:5173
2. Login as admin (or HR)
3. Navigate to employee management
4. Click "Invite Employee"
5. Enter email and details
6. Click "Send Invite Link"

### **Step 6: Verify Email**

Check the email inbox. You should receive:

```
Subject: HRMS Invitation - Welcome!

Application Link: http://localhost:5173
Username: employee@example.com
Temporary Password: Temp@123

[Complete Your Profile] Button
```

---

## 🌐 PART 2: Production Deployment

### **Backend Deployment (Railway/Render)**

#### **Option A: Railway**

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your HRMS repository

3. **Configure Environment Variables**
   ```
   FRONTEND_URL=https://your-app.vercel.app
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hrms_db
   SPRING_MAIL_USERNAME=aishushettar95@gmail.com
   SPRING_MAIL_PASSWORD=uiurdbkdhtexubjr
   ```

4. **Deploy**
   - Railway will auto-detect Spring Boot
   - Wait for deployment to complete
   - Copy the generated URL: `https://your-app.railway.app`

#### **Option B: Render**

1. **Create Render Account**
   - Go to https://render.com
   - Sign up

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: hrms-backend
     - **Environment**: Java
     - **Build Command**: `./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/HRMS-Backend-0.0.1-SNAPSHOT.jar`

3. **Set Environment Variables** (same as Railway above)

4. **Deploy**
   - Click "Create Web Service"
   - Copy the URL: `https://hrms-backend.onrender.com`

---

### **Frontend Deployment (Vercel)**

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - **Root Directory**: `HRMSProject/HRMS-Frontend`

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy the URL: `https://your-hrms.vercel.app`

---

### **Connect Backend to Frontend**

1. **Update Backend Environment**
   
   Go to Railway/Render dashboard and update:
   ```
   FRONTEND_URL=https://your-hrms.vercel.app
   ```

2. **Redeploy Backend**
   - Railway: Automatically redeploys
   - Render: Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ Testing Production Deployment

### **1. Test Backend Health**

```bash
curl https://your-backend.railway.app/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### **2. Test Email Invitation**

```bash
curl -X POST https://your-backend.railway.app/api/onboarding/invite \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test User",
    "department": "IT",
    "designation": "Developer"
  }'
```

### **3. Verify Email Content**

The email should now contain:
```
Application Link: https://your-hrms.vercel.app
Username: test@example.com
Temporary Password: Temp@123
```

✅ **The link should point to your Vercel URL, not localhost!**

---

## 🔧 Troubleshooting

### **Problem: Email has localhost URL in production**

**Solution:**
- Verify `FRONTEND_URL` environment variable is set correctly
- Redeploy backend after changing environment variables
- Check backend logs to confirm the correct URL is being used

### **Problem: Email not received in production**

**Check 1: Backend Logs**
```bash
# Railway: View logs in dashboard
# Render: View logs in service dashboard
```

Look for:
```
📧 Sending invite email to: test@example.com
🔗 Onboarding Link: https://your-hrms.vercel.app
✅ Invite email sent successfully
```

**Check 2: SMTP Connection**
- Ensure Gmail credentials are correct
- Check if deployment platform allows SMTP connections
- Some platforms block port 587 - check documentation

**Check 3: Firewall/Security**
- Railway: SMTP is allowed ✅
- Render: SMTP is allowed ✅
- Heroku: Requires SendGrid add-on ⚠️

### **Problem: Frontend can't connect to backend**

**Solution:**
- Verify `VITE_API_BASE_URL` in Vercel
- Check CORS configuration in backend
- Verify backend is running and accessible

---

## 📊 Environment Variables Checklist

### **Backend (Railway/Render)**

| Variable | Localhost | Production |
|----------|-----------|------------|
| `FRONTEND_URL` | `http://localhost:5173` | `https://your-hrms.vercel.app` |
| `MONGODB_URI` | `mongodb://localhost:27017/hrms` | `mongodb+srv://...` |
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` | Same |
| `SPRING_MAIL_PASSWORD` | App password | Same |

### **Frontend (Vercel)**

| Variable | Localhost | Production |
|----------|-----------|------------|
| `VITE_API_BASE_URL` | `http://localhost:8082` | `https://your-backend.railway.app` |

---

## 🎯 Quick Deployment Commands

### **Deploy Backend to Railway**
```bash
# Railway CLI
railway login
railway link
railway up
```

### **Deploy Frontend to Vercel**
```bash
# Vercel CLI
npm i -g vercel
vercel login
cd HRMS-Frontend
vercel --prod
```

---

## 📞 Support & Resources

### **Documentation**
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs

### **Gmail App Password**
- Guide: https://support.google.com/accounts/answer/185833

### **MongoDB Atlas**
- Setup: https://www.mongodb.com/cloud/atlas

---

**🎉 Your HRMS is now ready for production!**

The invitation emails will work seamlessly on both localhost and production with the correct URLs automatically!
