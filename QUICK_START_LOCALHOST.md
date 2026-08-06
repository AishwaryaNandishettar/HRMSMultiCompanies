# 🚀 Quick Start Guide - Localhost Setup

## ✅ What Was Fixed

The login was failing because the frontend `.env` was pointing to production (Render) instead of localhost.

**Fixed:** Updated `.env` to use `http://localhost:8082`

## 📋 Quick Start (3 Steps)

### **1. Start Backend**

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Wait for:
```
Started HrmsBackendApplication in X.XXX seconds
```

### **2. Start Frontend**

⚠️ **IMPORTANT**: If frontend was already running, you MUST restart it!

```bash
# Stop the frontend (Ctrl+C if running)

cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

**Why restart?** Vite caches `.env` variables. Changes only take effect after restart!

### **3. Login**

Open http://localhost:5173 and login with your test credentials.

## 🔑 Test Credentials

Try these credentials (if they exist in your database):

```
Email: Aishmanager@omoi.com
Password: admin123
```

Or any other account you've created.

## ✅ Verify Setup

### **Check Backend is Running:**
```bash
curl http://localhost:8082/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### **Test Login Endpoint:**
```bash
node test-login.js
```

This will test if the backend login endpoint is working.

### **Check Frontend Console:**

Open browser DevTools (F12) → Console. You should see:
```
🔍 VITE_API_BASE_URL: http://localhost:8082
🔍 Axios baseURL: http://localhost:8082
```

If you see `https://latestfinalhrmsapplication.onrender.com`, the frontend is still using old cache. Restart it!

## 🐛 Troubleshooting

### **Problem: "Error: Invalid credentials"**

**Solution 1: Check Backend Logs**

Look for:
```
EMAIL: your-email@example.com
PASSWORD INPUT: your-password
USER FOUND: true (or false)
Password Match: true (or false)
```

If `USER FOUND: false` → User doesn't exist in database
If `Password Match: false` → Wrong password

**Solution 2: Test Backend Directly**

```bash
node test-login.js
```

This bypasses the frontend and tests the backend directly.

**Solution 3: Check .env File**

```bash
# In HRMS-Frontend folder, check .env:
cat .env

# Should show:
VITE_API_BASE_URL=http://localhost:8082
```

If it shows Render URL, fix it and restart frontend!

### **Problem: "Failed to load resource: net::ERR_CONNECTION_REFUSED"**

**Cause:** Backend is not running

**Solution:**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

### **Problem: Frontend still showing old URL**

**Cause:** Vite cache

**Solution:**
```bash
# Stop frontend (Ctrl+C)
# Delete Vite cache
rm -rf HRMS-Frontend/node_modules/.vite

# Restart
cd HRMS-Frontend
npm run dev
```

### **Problem: "MongoDB connection failed"**

**Cause:** MongoDB is not running

**Solution:**

**If using local MongoDB:**
```bash
# Start MongoDB service
net start MongoDB
```

**If using MongoDB Atlas:**
Check `application.properties` has correct connection string:
```properties
spring.data.mongodb.uri=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

## 📁 Environment Files

### **Localhost (.env) - Current**
```env
VITE_API_BASE_URL=http://localhost:8082
VITE_API_URL=http://localhost:8082/api
VITE_WS_URL=http://localhost:8082/ws
```

### **Production (.env.production.backup) - For Vercel**
```env
VITE_API_BASE_URL=https://latestfinalhrmsapplication.onrender.com
VITE_API_URL=https://latestfinalhrmsapplication.onrender.com/api
VITE_WS_URL=https://latestfinalhrmsapplication.onrender.com/ws
```

## 🔄 Switching Environments

### **To Localhost:**
1. Update `.env` to use `http://localhost:8082`
2. Restart frontend
3. Ensure backend is running locally

### **To Production (Vercel):**
1. Set environment variables in Vercel dashboard
2. Deploy
3. Backend should be deployed on Render

## 🎯 Success Indicators

### **Backend Started:**
```
Started HrmsBackendApplication
Tomcat started on port(s): 8082
```

### **Frontend Started:**
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
```

### **Login Working:**

**Browser Console:**
```
✅ LOGIN SUCCESSFUL
```

**Backend Console:**
```
Login successful for: your-email@example.com
```

## 📚 Related Documentation

- **Login Fix Details**: `LOGIN_FIX_README.md`
- **Email Setup**: `EMAIL_SETUP_README.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Test Scripts**: `test-login.js`, `quick-test-email.js`

---

## 🎉 You're Ready!

Your HRMS is now configured for localhost development. 

**Remember:**
- Backend runs on port **8082**
- Frontend runs on port **5173**
- Always restart frontend after changing `.env`
- Use `test-login.js` to verify backend

Happy coding! 🚀
