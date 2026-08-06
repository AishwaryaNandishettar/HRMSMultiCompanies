# ⚡ RESTART & TEST - Do This Now

## I've Fixed the Code!

The problem was: **Your backend was silently catching email errors**
- The API said "success" even when email failed
- Now it will show the actual error message

---

## Step 1: Restart Backend (Required!)

**Stop your current backend:** Press `Ctrl+C` in the backend terminal

**Restart it:**
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Wait for: `Started HmrsBackendApplication`

---

## Step 2: Run Diagnostic Test

Open **PowerShell** and run:

```powershell
cd "d:\New folder\HRMSProject (2)\HRMSProject"
powershell -ExecutionPolicy Bypass -File test-gmail-connection.ps1
```

This will:
- ✅ Test Gmail SMTP connection
- ✅ Test backend connection  
- ✅ Test email API
- ❌ **Show you the REAL error!**

---

## Step 3: Read the Error

The test will now show you the **exact error** message!

Common errors:

### ❌ "Authentication failed" 
**Problem:** Gmail app password is wrong

**Fix:**
1. Go to: https://myaccount.google.com/apppasswords
2. Generate new password
3. Update `application.properties` line 19:
   ```properties
   spring.mail.password=YOUR_NEW_PASSWORD
   ```
4. Restart backend

---

### ❌ "Connection timed out"
**Problem:** Firewall blocking Gmail

**Fix:** Update `application.properties` to use port 465:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
```
Restart backend

---

### ❌ "Must issue STARTTLS"
**Problem:** TLS not configured

**Fix:** Already in your config, just restart backend

---

## Step 4: After Fixing Error

Run the test again:
```powershell
powershell -ExecutionPolicy Bypass -File test-gmail-connection.ps1
```

You should see:
```
✅ PASS: Can reach smtp.gmail.com
✅ PASS: Backend is running
✅ PASS: API endpoint works
📧 Check inbox: aishushettar95@gmail.com
```

---

## Quick Actions:

### If you see "Authentication failed":
```
1. Get new app password from: https://myaccount.google.com/apppasswords
2. Open: d:\New folder\HRMSProject (2)\HRMSProject\src\main\resources\application.properties
3. Line 19: spring.mail.password=PUT_NEW_PASSWORD_HERE
4. Save file
5. Restart backend: Ctrl+C then mvnw spring-boot:run
6. Test again: powershell -File test-gmail-connection.ps1
```

---

## DO THIS NOW:

1. ⏹️ **Stop backend** (Ctrl+C)
2. ▶️ **Restart backend** (mvnw spring-boot:run)
3. 🧪 **Run test** (powershell -File test-gmail-connection.ps1)
4. 📖 **Read the error**
5. 🔧 **Apply the fix**
6. 🔄 **Test again**

---

**The error message will tell us exactly what's wrong! Let's see it! 🎯**
