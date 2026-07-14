# Multi-Tenant HRMS Deployment Guide

## Overview

This guide covers deploying three separate instances of the HRMS system for three different companies, each with unique branding but sharing the same codebase and database.

---

## Architecture

```
GitHub Repository (HRMS-MultiCompany)
    ↓
    ├── Company A (TalentHub Solutions - Blue Theme)
    │   ├── Frontend: Vercel
    │   └── Backend: Render
    │
    ├── Company B (WorkForce Pro - Green Theme)
    │   ├── Frontend: Vercel
    │   └── Backend: Render
    │
    └── Company C (PeopleSync Enterprise - Purple Theme)
        ├── Frontend: Vercel
        └── Backend: Render
        
All connect to → MongoDB Atlas (Shared Database)
```

---

## Prerequisites

- GitHub account with HRMS-MultiCompany repository
- Vercel account (free tier supports 3 projects)
- Render account (free tier available)
- MongoDB Atlas account (existing database)

---

## Part 1: Backend Deployment (Render)

### Step 1: Deploy Company A Backend

1. **Login to Render Dashboard**
   - Go to: https://dashboard.render.com
   - Sign in with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `HRMS-MultiCompany`
   - Select the repository

3. **Configure Service**
   - **Name**: `hrms-backend-company-a`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `HRMS-Backend`
   - **Runtime**: `Java`
   - **Build Command**: `mvn clean package -DskipTests`
   - **Start Command**: `java -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar`

4. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
   SPRING_PROFILES_ACTIVE=prod
   SPRING_MAIL_USERNAME=aishushettar95@gmail.com
   SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
   JWT_SECRET=MyFixedSecretKey123456
   SERVER_PORT=8082
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the deployment URL (e.g., `https://hrms-backend-company-a.onrender.com`)

### Step 2: Deploy Company B Backend

Repeat the same steps as Company A with these changes:
- **Name**: `hrms-backend-company-b`
- Use the **same environment variables** (shared database)
- Copy the deployment URL

### Step 3: Deploy Company C Backend

Repeat the same steps as Company A with these changes:
- **Name**: `hrms-backend-company-c`
- Use the **same environment variables** (shared database)
- Copy the deployment URL

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Deploy Company A Frontend

1. **Login to Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import `HRMS-MultiCompany` repository

3. **Configure Project**
   - **Project Name**: `hrms-frontend-company-a`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `HRMS-Frontend`
   - **Build Command**: `npm run build:company-a` (or leave default and set env vars)
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   ```
   VITE_TENANT_ID=company-a
   VITE_API_BASE_URL=[Company A Render Backend URL]
   VITE_API_URL=[Company A Render Backend URL]/api
   VITE_WS_URL=[Company A Render Backend URL]/ws
   VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
   VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
   ```

   **Example** (replace with actual URL):
   ```
   VITE_TENANT_ID=company-a
   VITE_API_BASE_URL=https://hrms-backend-company-a.onrender.com
   VITE_API_URL=https://hrms-backend-company-a.onrender.com/api
   VITE_WS_URL=https://hrms-backend-company-a.onrender.com/ws
   VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
   VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Copy the deployment URL (e.g., `https://hrms-frontend-company-a.vercel.app`)

### Step 2: Deploy Company B Frontend

1. **Import Project Again**
   - Click "Add New..." → "Project"
   - Import the same `HRMS-MultiCompany` repository

2. **Configure Project**
   - **Project Name**: `hrms-frontend-company-b`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `HRMS-Frontend`

3. **Set Environment Variables**
   ```
   VITE_TENANT_ID=company-b
   VITE_API_BASE_URL=[Company B Render Backend URL]
   VITE_API_URL=[Company B Render Backend URL]/api
   VITE_WS_URL=[Company B Render Backend URL]/ws
   VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
   VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
   ```

4. **Deploy** and copy the URL

### Step 3: Deploy Company C Frontend

Repeat the same steps as Company B with these changes:
- **Project Name**: `hrms-frontend-company-c`
- **VITE_TENANT_ID**: `company-c`
- Point API URLs to Company C Render backend

---

## Part 3: Verification

### Test Company A
1. Open Company A frontend URL
2. Verify **TalentHub Solutions** branding (blue theme, "TH" logo)
3. Test login functionality
4. Verify all features work

### Test Company B
1. Open Company B frontend URL
2. Verify **WorkForce Pro** branding (green theme, "WP" logo)
3. Test login functionality
4. Verify all features work

### Test Company C
1. Open Company C frontend URL
2. Verify **PeopleSync Enterprise** branding (purple theme, "PS" logo)
3. Test login functionality
4. Verify all features work

---

## Environment Variables Reference

### Required Frontend Variables (Vercel)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_TENANT_ID` | Company identifier | `company-a`, `company-b`, `company-c` |
| `VITE_API_BASE_URL` | Backend base URL | `https://hrms-backend-company-a.onrender.com` |
| `VITE_API_URL` | Backend API URL | `https://hrms-backend-company-a.onrender.com/api` |
| `VITE_WS_URL` | WebSocket URL | `https://hrms-backend-company-a.onrender.com/ws` |
| `VITE_TURN_USERNAME` | WebRTC TURN username | (from config) |
| `VITE_TURN_CREDENTIAL` | WebRTC TURN credential | (from config) |

### Required Backend Variables (Render)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | (shared across all backends) |
| `SPRING_PROFILES_ACTIVE` | Spring profile | `prod` |
| `SPRING_MAIL_USERNAME` | Email service username | (from config) |
| `SPRING_MAIL_PASSWORD` | Email service password | (from config) |
| `JWT_SECRET` | JWT signing secret | (shared across all backends) |
| `SERVER_PORT` | Backend port | `8082` |

---

## Local Development

### Run Company A Locally
```bash
cd HRMS-Frontend
npm run dev:company-a
# Opens on http://localhost:5173 with Company A theme
```

### Run Company B Locally
```bash
cd HRMS-Frontend
npm run dev:company-b
# Opens on http://localhost:5173 with Company B theme
```

### Run Company C Locally
```bash
cd HRMS-Frontend
npm run dev:company-c
# Opens on http://localhost:5173 with Company C theme
```

### Run Backend Locally
```bash
cd HRMS-Backend
mvn spring-boot:run
# Runs on http://localhost:8082
```

---

## Troubleshooting

### Frontend Not Loading Theme
- Check that `VITE_TENANT_ID` is set correctly
- Verify environment variables are saved in Vercel
- Trigger a redeploy after changing environment variables

### Backend Connection Error
- Verify backend is running (check Render logs)
- Check that API URLs match backend deployment URL
- Ensure MongoDB connection string is correct

### CORS Errors
- Verify backend allows requests from frontend domain
- Check CORS configuration in Spring Boot application

### Build Failures
- Check Render build logs for Maven errors
- Check Vercel build logs for npm/Vite errors
- Verify all dependencies are installed

---

## Updating Deployments

### Update Frontend (Vercel)
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Or manually trigger redeploy from Vercel dashboard

### Update Backend (Render)
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Or manually trigger redeploy from Render dashboard

### Update Environment Variables
**Vercel:**
- Go to Project Settings → Environment Variables
- Update variables
- Trigger redeploy

**Render:**
- Go to Service Dashboard → Environment
- Update variables
- Service auto-restarts

---

## Deployment URLs

After completing deployment, document your URLs here:

### Company A (TalentHub Solutions)
- **Frontend**: https://hrms-frontend-company-a.vercel.app
- **Backend**: https://hrms-backend-company-a.onrender.com

### Company B (WorkForce Pro)
- **Frontend**: https://hrms-frontend-company-b.vercel.app
- **Backend**: https://hrms-backend-company-b.onrender.com

### Company C (PeopleSync Enterprise)
- **Frontend**: https://hrms-frontend-company-c.vercel.app
- **Backend**: https://hrms-backend-company-c.onrender.com

---

## Notes

- All three backends share the same MongoDB database
- All three deployments use the same codebase
- Only environment variables differ between companies
- Logo files can be updated without redeployment (just replace files in `/public/logos/`)
- Theme colors can be changed by updating JSON files and redeploying

---

## Support

For issues or questions:
1. Check Vercel/Render logs
2. Review console errors in browser
3. Verify environment variables are correct
4. Check MongoDB connection status
