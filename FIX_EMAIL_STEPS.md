# 🔧 Fix Email - Step by Step

## Changes Made:

1. ✅ **Added exception re-throw** in OnboardingService
   - Now errors will be visible in API response
   - Before: Silently caught exceptions
   - After: Throws exception with error message

2. ✅ **Added service logging** in application.properties
   - Can now see detailed logs from EmailService
   - Can track the email sending process

---

## Next Steps to Fix Email:

### Step 1: Restart Backend
The changes need a backend restart to take effect.

```bash
# Stop current backend (Ctrl+C)
# Then restart:
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

### Step 2: Test Again
```powershell
cd "d:\New folder\HRMSProject (2)\HRMSProject"
powershell -ExecutionPolicy Bypass -File test-api.ps1
```

### Step 3: Check the Error
Now when you test, you'll see the ACTUAL error message!

---

## Common Email Errors & Solutions:

### Error: "Authentication failed" or "Invalid login"
**Cause:** Gmail app password is wrong or expired

**Solution:**
1. Go to: https://myaccount.google.com/apppasswords
2. Login as: aishushettar95@gmail.com
3. Create new App Password
4. Update `application.properties`:
   ```properties
   spring.mail.password=YOUR_NEW_16_CHAR_PASSWORD
   ```
5. Restart backend

---

### Error: "Connection timed out" or "Could not connect to SMTP host"
**Cause:** Network/firewall blocking port 587

**Solution 1 - Check firewall:**
```powershell
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

**Solution 2 - Try different port:**
Update `application.properties`:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
```

---

### Error: "530 5.7.0 Must issue a STARTTLS command first"
**Cause:** TLS configuration issue

**Solution:**
Verify these settings in `application.properties`:
```properties
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

---

### Error: No error but email not received
**Cause 1:** Email in spam folder
- Check spam/junk folder

**Cause 2:** Gmail blocked the email
- Check: https://myaccount.google.com/notifications
- Look for security alerts

**Cause 3:** Wrong recipient email
- Verify the email address in database

---

## Diagnostic Commands:

### 1. Test SMTP Connection:
```powershell
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

### 2. Test Backend API:
```powershell
powershell -File test-api.ps1
```

### 3. Check Backend Logs:
Look for these in console:
```
📧 Sending invite email via Gmail SMTP to: xxx@gmail.com
✅ SMTP: Email sent successfully
```

Or errors:
```
❌ Email sending failed for xxx: [ERROR MESSAGE]
```

---

## Quick Fix Checklist:

- [ ] Restart backend with new changes
- [ ] Test API and check for error message
- [ ] Verify Gmail app password is correct
- [ ] Check firewall allows port 587
- [ ] Check spam folder
- [ ] Try sending to different email
- [ ] Check Gmail security settings

---

## If Still Not Working:

### Generate New Gmail App Password:

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Sign in** with aishushettar95@gmail.com
3. **Click:** "Select app" → "Other (Custom name)"
4. **Type:** "HRMS Backend"
5. **Click:** "Generate"
6. **Copy** the 16-character password
7. **Update** application.properties:
   ```properties
   spring.mail.password=xxxx xxxx xxxx xxxx (no spaces)
   ```
8. **Restart** backend

---

## Alternative: Use Port 465 (SSL)

If port 587 doesn't work, try SSL on port 465:

Update `application.properties`:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
spring.mail.properties.mail.smtp.auth=true
```

---

## Next Steps:

1. **Restart backend now**
2. **Run test-api.ps1**
3. **Read the error message**
4. **Follow the solution for that specific error**

The error message will tell us exactly what's wrong! 🎯
