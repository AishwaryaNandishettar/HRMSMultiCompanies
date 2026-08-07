# Production Email Issue - SOLUTION

## Problem
Emails work on localhost but not from Vercel deployment. The invite link in emails points to `http://localhost:5173` instead of the production Vercel URL.

## Root Cause
The backend service (Render) doesn't have the `FRONTEND_URL` environment variable set, so it defaults to `http://localhost:5173` when generating invite links.

## Solution

### Step 1: Find Your Vercel URL
1. Go to https://vercel.com
2. Open your HRMS project
3. Copy the production URL (e.g., `https://omoi-hrms.vercel.app`)

### Step 2: Set FRONTEND_URL on Render (Backend)
1. Go to https://dashboard.render.com
2. Click on service: **latestfinalhrmsapplication**
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add:
   ```
   Name: FRONTEND_URL
   Value: https://your-vercel-url.vercel.app
   ```
   (Replace with your actual Vercel URL from Step 1)
6. Click **Save Changes**
7. Render will automatically redeploy

### Step 3: Verify Vercel Environment Variables
1. Go to https://vercel.com
2. Open your HRMS project
3. Go to **Settings** → **Environment Variables**
4. Ensure these are set for **Production**:
   ```
   VITE_API_BASE_URL=https://latestfinalhrmsapplication.onrender.com
   VITE_API_URL=https://latestfinalhrmsapplication.onrender.com/api
   VITE_WS_URL=https://latestfinalhrmsapplication.onrender.com/ws
   ```
5. If missing, add them and click **Redeploy**

### Step 4: Test
1. Open your Vercel URL
2. Login as admin
3. Go to "Invite Employee"
4. Send an invitation
5. Check Gmail - the invite link should now point to your Vercel URL, not localhost

## Current Configuration Status

### ✅ Already Working:
- Email credentials configured on Render (Gmail SMTP)
- Backend API working on Render
- Frontend deployed on Vercel
- Emails being sent successfully

### ❌ Missing Configuration:
- `FRONTEND_URL` environment variable on Render
  - **This is why invite links point to localhost!**

## Environment Variables Summary

### Render (Backend) - Required:
```
MONGODB_URI=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=uiurdbkdhtexubjr
FRONTEND_URL=https://your-vercel-url.vercel.app  ⚠️ ADD THIS!
```

### Vercel (Frontend) - Required:
```
VITE_API_BASE_URL=https://latestfinalhrmsapplication.onrender.com
VITE_API_URL=https://latestfinalhrmsapplication.onrender.com/api
VITE_WS_URL=https://latestfinalhrmsapplication.onrender.com/ws
```

## Files Updated
- ✅ `application.properties` - Now supports environment variables
- ✅ `vercel.json` - Added all required environment variables

## No Logic Changed
All functionality remains exactly the same. Only configuration was updated to support production deployment.
