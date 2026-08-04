# MongoDB Connection Fix for Render ✅

## Problem Identified

The Render logs showed:
```
Error in scheduled task process: Timed out after 30000 ms while waiting for a server that matches ReadPreferenceServerSelector
```

**Root Cause**: MongoDB connection string was hardcoded to `localhost:27017` which doesn't work on Render. Render needs to connect to MongoDB Atlas using the `MONGODB_URI` environment variable.

## Fix Applied

### Code Change (application.properties)

**Before** (Hardcoded localhost):
```properties
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=Data_base_hrms
```

**After** (Environment variable):
```properties
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/Data_base_hrms}
```

This allows:
- **Production (Render)**: Uses `MONGODB_URI` environment variable
- **Local Development**: Falls back to `mongodb://localhost:27017/Data_base_hrms`

## Commit Details

**Commit**: `22e41b8`
**Message**: "Fix MongoDB connection: Use MONGODB_URI environment variable for production"
**Status**: ✅ Pushed to GitHub

## CRITICAL: Set Environment Variable in Render

### Step 1: Go to Render Dashboard
URL: https://dashboard.render.com

### Step 2: Open Your Service
Click on: **LatestFinalHrmsApplication**

### Step 3: Go to Environment Tab
Click **"Environment"** in the left sidebar

### Step 4: Add MONGODB_URI Variable

Click **"Add Environment Variable"** button

**Key**: `MONGODB_URI`

**Value**: Your MongoDB Atlas connection string, example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**⚠️ IMPORTANT**: 
- Replace `username` with your MongoDB Atlas username
- Replace `password` with your MongoDB Atlas password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Keep `/Data_base_hrms` at the end (your database name)

### Step 5: Save Changes
Click **"Save Changes"** button

### Step 6: Redeploy
1. Go to **"Events"** tab
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"** (commit 22e41b8)
4. Wait 5-10 minutes

## Finding Your MongoDB Atlas Connection String

### If You Already Have MongoDB Atlas:

1. Go to: https://cloud.mongodb.com
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `Data_base_hrms`

### If You DON'T Have MongoDB Atlas Yet:

You need to create one:

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a **FREE M0 Cluster**
4. Create database user (username/password)
5. Whitelist IP: `0.0.0.0/0` (allow all - for Render)
6. Get connection string
7. Add to Render environment variables

## Example Connection String

```
mongodb+srv://hrmsuser:MyP@ssw0rd@cluster0.abc123.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

Replace:
- `hrmsuser` → Your MongoDB username
- `MyP@ssw0rd` → Your MongoDB password
- `cluster0.abc123.mongodb.net` → Your cluster URL
- `Data_base_hrms` → Your database name (keep this!)

## After Setting Environment Variable

### Expected Behavior:

1. **Backend will connect to MongoDB Atlas** ✅
2. **Login will work** ✅
3. **No more timeout errors** ✅

### Test After Deployment:

1. Check Render logs - should see:
   ```
   Connected to MongoDB successfully
   ```

2. Test health endpoint:
   ```
   https://latestfinalhrmsapplication.onrender.com/actuator/health
   ```
   Should return: `{"status":"UP"}`

3. Try login from frontend:
   ```
   https://omoi-hrms.vercel.app
   ```
   Should work! ✅

## Current Environment Variables Needed in Render

After this fix, make sure these are set:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | `mongodb+srv://...` | ✅ YES |
| `JWT_SECRET` | Your secret key | ✅ YES |
| `SPRING_MAIL_USERNAME` | Email address | ✅ YES |
| `SPRING_MAIL_PASSWORD` | App password | ✅ YES |
| `FRONTEND_URL` | `https://omoi-hrms.vercel.app` | ✅ YES |
| `PORT` | (Auto-set by Render) | ✅ YES |

## Troubleshooting

### If Login Still Fails After Deploy:

1. **Check Render Logs**:
   - Go to **Logs** tab
   - Look for "Connected to MongoDB" message
   - Look for any connection errors

2. **Verify MongoDB URI**:
   - Go to **Environment** tab
   - Check `MONGODB_URI` is set correctly
   - Make sure password is correct (no special chars encoded)

3. **Check MongoDB Atlas**:
   - Verify cluster is running
   - Check IP whitelist includes `0.0.0.0/0`
   - Verify database user exists

4. **Test MongoDB Connection**:
   - Use MongoDB Compass to test connection string
   - If Compass can't connect, fix Atlas settings first

## Quick Checklist

- [ ] Code pushed to GitHub (commit 22e41b8)
- [ ] `MONGODB_URI` added in Render Environment
- [ ] MongoDB Atlas cluster is running
- [ ] IP whitelist allows `0.0.0.0/0`
- [ ] Database user credentials are correct
- [ ] Redeployed on Render
- [ ] Checked logs for successful connection
- [ ] Tested login from frontend

## No Logic Changed ✅

Only configuration changed:
- Removed hardcoded localhost MongoDB
- Added support for `MONGODB_URI` environment variable
- Kept fallback to localhost for development

This is a configuration fix, not a logic change!
