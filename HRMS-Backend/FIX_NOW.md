# 🚨 FIX NOW - Aishwarya Login Issue

## Problem
Aishwarya@company.com can login to TalentHub Solutions (localhost:5176) but she SHOULD NOT be able to.

## Root Cause
Two things need to happen for the fix to work:
1. ✅ Code changes (already done)
2. ❌ Backend needs to be RESTARTED (not done yet)
3. ❌ Database needs companyId assigned (not done yet)

## 🚀 Quick Fix (3 Steps)

### Step 1: Update Database (2 minutes)

Open a terminal and run:

```bash
# Connect to MongoDB
mongosh

# Or with connection string if needed
mongosh "mongodb://localhost:27017"
```

Then paste this:

```javascript
// Switch to your database
use hrms_db

// Assign companyId to Aishwarya
db.users.updateOne(
  { email: "Aishwarya@company.com" },
  { $set: { companyId: "omoikaneinnovations" }}
)

// Verify it worked
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1 }
)

// Should show: { email: "Aishwarya@company.com", companyId: "omoikaneinnovations" }
```

Expected output:
```javascript
{
  email: "Aishwarya@company.com",
  companyId: "omoikaneinnovations",
  name: "Aishwarya"
}
```

✅ **If you see `companyId: "omoikaneinnovations"` - Success! Continue to Step 2**

❌ **If companyId is still null/empty - try the command again**

---

### Step 2: Restart Backend (5 minutes)

**Option A: Using the Batch File (Easiest)**

Double-click `restart-backend.bat` file in the project root

**Option B: Using PowerShell Script**

```powershell
# In PowerShell (as Administrator)
.\restart-backend.ps1
```

**Option C: Manual Steps**

```bash
# 1. Stop current backend
# Press Ctrl+C in the terminal where backend is running
# OR
taskkill /F /IM java.exe

# 2. Navigate to backend folder
cd HRMS-Backend

# 3. Rebuild
mvnw.cmd clean install -DskipTests

# 4. Start backend
mvnw.cmd spring-boot:run
```

**What to look for in logs:**

You should see:
```
Started HmrsbackendApplication in X.XXX seconds
Tomcat started on port(s): 8082
```

✅ **If you see "Started HmrsbackendApplication" - Success! Continue to Step 3**

---

### Step 3: Test Login (1 minute)

1. **Clear browser cache or use Incognito mode**
   - Ctrl + Shift + N (Chrome)
   - Ctrl + Shift + P (Firefox)

2. **Go to TalentHub Solutions portal**
   - URL: http://localhost:5176

3. **Try to login**
   - Email: `Aishwarya@company.com`
   - Password: `admin123`
   - Click Login

4. **Check the result**

**Expected Result: ❌ LOGIN SHOULD FAIL**

You should see:
```
Access denied: You do not have permission to access this company portal. 
Please use the correct company URL.
```

**Backend console should show:**
```
EMAIL: Aishwarya@company.com
TENANT ID: company-a
🔍 TENANT VALIDATION:
  Request Tenant ID: company-a
  User Company ID: omoikaneinnovations
❌ Login denied: Tenant mismatch (Request: company-a, User: omoikaneinnovations)
```

---

## ✅ Success Criteria

- [ ] Database: Aishwarya has `companyId: "omoikaneinnovations"`
- [ ] Backend: Restarted and showing version with tenant validation
- [ ] Login: Aishwarya CANNOT login to TalentHub (localhost:5176)
- [ ] Error: "Access denied" message appears
- [ ] Logs: Backend shows "Login denied: Tenant mismatch"

---

## 🐛 Troubleshooting

### Problem: Aishwarya can still login

**Check 1: Database**
```javascript
// In mongosh
use hrms_db
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { companyId: 1 }
)
```

If `companyId` is not "omoikaneinnovations":
- Run the update command again
- Make sure you're in the right database (`use hrms_db`)

**Check 2: Backend Logs**
Look for "TENANT VALIDATION" in backend console

If NOT present:
- Backend wasn't restarted properly
- Restart it again using the batch file

If present but still can login:
- Check what tenantId the frontend is sending
- Open browser DevTools → Network tab → Check login request

**Check 3: Frontend Sending tenantId?**
- Open browser DevTools (F12)
- Go to Network tab
- Try to login
- Click on the "login" request
- Check "Payload" section
- Should show:
  ```json
  {
    "email": "Aishwarya@company.com",
    "password": "admin123",
    "tenantId": "company-a"
  }
  ```

If tenantId is missing:
- Frontend might not have been rebuilt
- Check .env.company-a file has `VITE_TENANT_ID=company-a`

---

## 📞 Need Help?

### Quick Health Check Commands

**Check Database:**
```bash
mongosh
use hrms_db
db.users.findOne({ email: "Aishwarya@company.com" }, { email: 1, companyId: 1 })
```

**Check Backend:**
```bash
# Check if running
netstat -ano | findstr :8082

# Check process
tasklist | findstr java
```

**Check Frontend:**
```bash
# Check if running
netstat -ano | findstr :5176
```

---

## 🎯 What Should Happen

```
┌─────────────────────────────────────────┐
│ Aishwarya visits TalentHub (5176)       │
│ companyId: omoikaneinnovations          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Frontend sends:                         │
│ { email, password, tenantId:"company-a"}│
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Backend checks:                         │
│ User companyId: omoikaneinnovations     │
│ Request tenantId: company-a             │
│ Match? NO ❌                            │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Backend returns HTTP 403                │
│ "Access denied"                         │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Frontend shows error message            │
│ User stays on login page                │
│ ✅ SUCCESS - Login blocked              │
└─────────────────────────────────────────┘
```

---

## ⏱️ Timeline

- Database update: **2 minutes**
- Backend restart: **5 minutes**
- Testing: **1 minute**
- **Total: ~8 minutes**

---

## 📝 Alternative: Use MongoDB Script

Instead of typing commands manually:

```bash
# Run the automated script
mongosh < fix-aishwarya-company.js
```

This will:
1. Check Aishwarya's current companyId
2. Update it to "omoikaneinnovations"
3. Verify the update worked
4. Show you the results

---

## ✨ After This Works

You can apply the same fix to other users:

```javascript
// Nikita
db.users.updateOne(
  { email: "nikita@omoi.com" },
  { $set: { companyId: "omoikaneinnovations" }}
)

// Mahesh
db.users.updateOne(
  { email: "mahesh@omoi.com" },
  { $set: { companyId: "omoikaneinnovations" }}
)

// All Omoi employees at once
db.users.updateMany(
  { email: { $regex: "@omoi\\.com$" }},
  { $set: { companyId: "omoikaneinnovations" }}
)
```

---

**Start with Step 1: Update the database** ⬆️
