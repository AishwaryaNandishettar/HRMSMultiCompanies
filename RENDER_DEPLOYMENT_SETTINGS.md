# Render Deployment Settings - Exact Configuration

## Repository Structure on GitHub
```
HRMSMultiCompanies/
├── HRMS-Frontend/       (for Vercel)
└── HRMS-Backend/        (for Render - contains Dockerfile, pom.xml, src/)
```

## Step-by-Step Render Configuration

### 1. Go to Render Dashboard
URL: https://dashboard.render.com

### 2. Click on Your Service
Service Name: **LatestFinalHrmsApplication**

### 3. Go to Settings Tab

### 4. Update These Settings Exactly:

#### Root Directory
```
HRMS-Backend
```
**Important**: This tells Render to look inside the HRMS-Backend folder

#### Dockerfile Path  
```
./Dockerfile
```
**Note**: The `./` is relative to the Root Directory (HRMS-Backend)

#### Docker Build Context Directory
```
./
```
**Note**: This is also relative to Root Directory

#### Docker Command
```
(leave empty)
```

### 5. Environment Variables to Verify

Make sure these are set in **Environment** section:

**Required:**
- `MONGODB_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = your JWT secret key
- `SPRING_MAIL_USERNAME` = your email (e.g., Gmail)
- `SPRING_MAIL_PASSWORD` = your app password

**Optional (if using SMS):**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `MSG91_AUTH_KEY`

**Auto-set by Render:**
- `PORT` (Render sets this automatically, don't change it)

### 6. Save Changes
Click **"Save Changes"** button at the bottom

### 7. Manual Deploy
1. Go to **"Events"** tab
2. Click **"Manual Deploy"** button  
3. Select **"Deploy latest commit"**
4. Wait for deployment (this takes 5-10 minutes)

## Expected Build Process

Render will:
1. Clone your repository from GitHub
2. Navigate to `HRMS-Backend` directory
3. Read the `Dockerfile`
4. Run multi-stage build:
   - Stage 1: Use Maven to compile Java code → create JAR
   - Stage 2: Use Java 21 JRE to run the JAR
5. Expose port 8080 (mapped to Render's $PORT)
6. Start your Spring Boot application

## Troubleshooting

### If Build Fails with "Dockerfile not found"
- Check **Root Directory** is exactly: `HRMS-Backend`
- Check **Dockerfile Path** is exactly: `./Dockerfile`

### If Build Fails with Maven Errors
- This usually means dependency issues
- Check the build logs for specific error
- May need to update pom.xml dependencies

### If App Starts But Crashes
- Check **Environment Variables** are all set
- Especially check `MONGODB_URI` is correct
- Check logs in Render dashboard

## Verify Deployment

Once deployed successfully, test these endpoints:

1. **Health Check**:
   ```
   https://your-app.onrender.com/actuator/health
   ```
   Should return: `{"status":"UP"}`

2. **Login Endpoint** (should return 405 Method Not Allowed for GET):
   ```
   https://your-app.onrender.com/api/auth/login
   ```

3. **Swagger UI** (if enabled):
   ```
   https://your-app.onrender.com/swagger-ui.html
   ```

## After Successful Deployment

Update your Vercel frontend environment variable:
- Go to Vercel → Settings → Environment Variables
- Update `VITE_API_URL` or `REACT_APP_API_URL`
- Set to: `https://your-app.onrender.com`
- Redeploy Vercel frontend

## Quick Reference Card

| Setting | Value |
|---------|-------|
| Root Directory | `HRMS-Backend` |
| Dockerfile Path | `./Dockerfile` |
| Build Context | `./` |
| Docker Command | (empty) |
| Branch | `main` |
| Auto-Deploy | ✓ Yes |
