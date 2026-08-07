# 🔍 Debug Instructions - Find The Real Issue

The backend is working and CORS is configured correctly. We need to see what's actually happening when you try to invite from Vercel.

## Step 1: Open Your Vercel App with Browser DevTools

1. Open your Vercel app: https://omoi-hrms.vercel.app
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Go to the **Network** tab

## Step 2: Login and Try to Invite

1. Login as admin
2. Go to "Invite Employee" page
3. Enter an email address
4. Click "Send Invite"

## Step 3: Check Console Tab

Look for any RED error messages in the Console tab. Common errors:

❌ **"Failed to fetch"** → CORS or network issue
❌ **"401 Unauthorized"** → Authentication issue  
❌ **"Network request failed"** → Backend not reachable
❌ **"VITE_API_BASE_URL is undefined"** → Environment variables not loading

**Screenshot or copy any error messages you see!**

## Step 4: Check Network Tab

1. Look for a request to `/api/onboarding/invite` or `/api/onboarding/bulk-invite`
2. Click on that request
3. Check the **Status Code**:
   - 200 ✅ = Success (check your email!)
   - 401 = Authentication failed
   - 403 = Forbidden (not authorized)
   - 404 = Endpoint not found
   - 500 = Server error
4. Check the **Response** tab to see what the server returned
5. Check the **Headers** tab to see if it's calling the right URL

**What URL is it calling?**
- ✅ Should be: `https://latestfinalhrmsapplication.onrender.com/api/onboarding/invite`
- ❌ Wrong: `http://localhost:8082/api/onboarding/invite`

## Step 5: Check Render Logs

While you have the browser DevTools open:

1. Open another tab: https://dashboard.render.com
2. Click on your service: **LatestFinalHrmsApplication**
3. Click **Logs** tab
4. Go back to Vercel and try inviting again
5. Watch the Render logs for any errors

**Look for:**
- ✅ `📧 Sending invite email to: [email]`
- ✅ `✅ Invite email sent successfully`
- ❌ `❌ Email sending failed`
- ❌ Any red error messages

## Step 6: Common Issues & Solutions

### Issue 1: Environment variables not loaded on Vercel
**Symptom:** Console shows `VITE_API_BASE_URL is undefined` or calling `localhost`

**Solution:**
1. Go to Vercel project settings
2. Environment Variables
3. Make sure these are set for **Production**:
   ```
   VITE_API_BASE_URL=https://latestfinalhrmsapplication.onrender.com
   VITE_API_URL=https://latestfinalhrmsapplication.onrender.com/api
   ```
4. **Redeploy** after adding variables

### Issue 2: Authentication required
**Symptom:** Network tab shows 401 or 403 status

**Solution:** The invite endpoint might require authentication. Check if you need to pass a JWT token in the Authorization header.

### Issue 3: Old build cached
**Symptom:** Still calling localhost even though env vars are set

**Solution:**
1. In Vercel, go to Deployments
2. Click **"Redeploy"** on the latest deployment
3. Clear your browser cache (Ctrl+Shift+Delete)
4. Hard refresh (Ctrl+F5)

### Issue 4: Render backend not responding
**Symptom:** Request takes forever or times out

**Solution:**
1. Check if Render service is running (might be sleeping on free tier)
2. Open backend URL in browser: https://latestfinalhrmsapplication.onrender.com
3. Wait for it to wake up (takes 30-60 seconds on free tier)
4. Try invite again

## What To Tell Me

After following these steps, tell me:

1. **What error do you see in Console tab?** (exact message)
2. **What is the Status Code in Network tab?** (for the invite request)
3. **What URL is it calling?** (from Network tab → Headers → Request URL)
4. **What do Render logs show?** (any error messages)
5. **Screenshot** of Console and Network tabs would be very helpful!

This will help me identify the EXACT issue and fix it! 🎯
