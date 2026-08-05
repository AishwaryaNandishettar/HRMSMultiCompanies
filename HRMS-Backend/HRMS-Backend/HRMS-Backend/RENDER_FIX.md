# Render Deployment Fix

## Problem
Error: "Root directory 'HRMS-Backend' does not exist, please check settings"

## Why This Happened
The HRMS-Backend code was force-pushed to the main branch at the root level, but Render is still looking for it in a subdirectory called "HRMS-Backend".

## Solution

### Step 1: Update Render Settings
1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your service: **LatestFinalHrmsApplication**
3. Click **Settings** in the left sidebar
4. Find the **Root Directory** field
5. Change from: `HRMS-Backend`
6. Change to: `.` (just a dot) OR leave it **empty**
7. Click **Save Changes**

### Step 2: Redeploy
1. Go to **Events** tab
2. Click **Manual Deploy** button
3. Select **Deploy latest commit**
4. Wait for deployment to complete

## Alternative: Keep Directory Structure
If you want to keep "HRMS-Backend" as a subdirectory:
1. Go back to parent repository
2. Remove the separate backend .git
3. Include backend as subdirectory in main repo
4. Push everything together

## Verify After Deployment
Check these endpoints to ensure backend is running:
- https://your-app.onrender.com/actuator/health
- https://your-app.onrender.com/api/auth/login (should return method not allowed for GET)
