# Fix: Restart Backend to Apply Changes

## ⚠️ Issue
Aishwarya@company.com is still able to login to TalentHub Solutions portal. This is because the backend code changes haven't been applied yet.

## ✅ Solution

### Step 1: Stop Current Backend

**Option A: From Terminal**
```bash
# Find the Java process
ps aux | grep java

# Kill the backend process (use the correct PID)
kill <PID>
```

**Option B: From IDE**
- If running from IntelliJ/Eclipse/VS Code: Stop the running application

**Option C: Windows (PowerShell)**
```powershell
# Find Java processes
Get-Process java

# Stop the backend (use Task Manager or)
Stop-Process -Name "java" -Force
```

### Step 2: Rebuild Backend

```bash
cd HRMS-Backend

# Clean and rebuild
./mvnw clean install

# Or on Windows
mvnw.cmd clean install

# Or if you have Maven installed globally
mvn clean install
```

### Step 3: Restart Backend

```bash
# Start the backend
./mvnw spring-boot:run

# Or
mvn spring-boot:run

# Or
java -jar target/hmrsbackend-0.0.1-SNAPSHOT.jar
```

### Step 4: Update Database (CRITICAL)

While the backend is restarting, open MongoDB and run:

```bash
mongosh
```

```javascript
// Use your database
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

// Should output:
// {
//   email: "Aishwarya@company.com",
//   companyId: "omoikaneinnovations",
//   name: "Aishwarya"
// }
```

### Step 5: Verify Backend Logs

After backend starts, you should see:

```
✅ Backend started successfully
✅ Connected to MongoDB
✅ Server running on port 8082
```

### Step 6: Test Login

1. **Logout from current session**
   - Clear browser cookies or use incognito mode

2. **Open TalentHub Portal**
   - URL: `http://localhost:5176`

3. **Try logging in**
   - Email: `Aishwarya@company.com`
   - Password: `admin123`

4. **Check backend console**
   - Should see these logs:
   ```
   EMAIL: Aishwarya@company.com
   TENANT ID: company-a
   🔍 TENANT VALIDATION:
     Request Tenant ID: company-a
     User Company ID: omoikaneinnovations
   ❌ Login denied: Tenant mismatch (Request: company-a, User: omoikaneinnovations)
   ```

5. **Expected Result**
   - ❌ Login should FAIL
   - Error message: "Access denied: You do not have permission to access this company portal. Please use the correct company URL."

## 🐛 Troubleshooting

### Issue: Still can login after restart
**Check 1**: Database companyId
```javascript
db.users.findOne({ email: "Aishwarya@company.com" }, { companyId: 1 })
```
- Should show: `{ companyId: "omoikaneinnovations" }`
- If null/empty, run the update command again

**Check 2**: Backend logs
- Look for "TENANT VALIDATION" in console
- If not present, backend may not have restarted properly

**Check 3**: Frontend sending tenantId
- Open browser DevTools (F12)
- Go to Network tab
- Try to login
- Check the login request payload
- Should include: `"tenantId": "company-a"`

**Check 4**: Clear browser cache
```bash
# Force reload
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# Or use Incognito/Private mode
```

### Issue: Backend won't start
**Check Maven/Java version**
```bash
java -version
mvn -version
```

**Check port 8082**
```bash
# Windows
netstat -ano | findstr :8082

# Linux/Mac
lsof -i :8082
```

If port is in use, kill the process or change port in `application.properties`

### Issue: Cannot connect to MongoDB
**Check MongoDB is running**
```bash
# Start MongoDB service
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community
```

## ✅ Quick Verification Script

Create this file as `test_tenant_validation.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Tenant Validation"
echo "============================="
echo ""

# Test valid login (should fail with 403)
echo "❌ Testing Aishwarya@company.com on TalentHub (should FAIL):"
curl -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Aishwarya@company.com",
    "password": "admin123",
    "tenantId": "company-a"
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "============================="
echo "Expected: HTTP Status: 403"
echo "Expected: 'Access denied' message"
echo ""
```

Run it:
```bash
chmod +x test_tenant_validation.sh
./test_tenant_validation.sh
```

## 📋 Checklist

Before testing:
- [ ] Backend stopped
- [ ] Backend rebuilt (`mvn clean install`)
- [ ] Backend restarted (`mvn spring-boot:run`)
- [ ] MongoDB running
- [ ] Aishwarya has `companyId: "omoikaneinnovations"` in database
- [ ] Browser cache cleared or using incognito
- [ ] Backend console shows "TENANT VALIDATION" logs

After testing:
- [ ] Aishwarya CANNOT login to TalentHub (localhost:5176)
- [ ] Backend logs show "Login denied: Tenant mismatch"
- [ ] Error message displays on frontend
- [ ] Other users can still login normally

## 🎯 Expected Flow

```
1. Aishwarya visits TalentHub (localhost:5176)
   ↓
2. Enters email + password
   ↓
3. Frontend sends: { email, password, tenantId: "company-a" }
   ↓
4. Backend validates password ✅
   ↓
5. Backend checks tenant:
   - User companyId: "omoikaneinnovations"
   - Request tenantId: "company-a"
   - Match? NO ❌
   ↓
6. Backend returns: HTTP 403 "Access denied"
   ↓
7. Frontend shows error message
   ↓
8. Aishwarya stays on login page ✅
```

## 🚨 Critical: Must Do Both

⚠️ **The fix requires BOTH:**
1. ✅ Code changes (already done)
2. ✅ Backend restart (**← YOU ARE HERE**)
3. ✅ Database update (companyId assignment)

If either is missing, the validation won't work!

---

**After completing these steps, Aishwarya should NOT be able to login to TalentHub Solutions portal.**
