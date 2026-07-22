# Email Fix - Quick Reference Card

## 🚀 3-Minute Fix (Most Common Issue)

### Problem: Invalid Gmail App Password

**Fix Steps:**

1. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select App: **Mail**
   - Select Device: **Other** → Type "HRMS"
   - Click **Generate**
   - Copy 16-character password (remove spaces)

2. **Update Backend:**
   ```properties
   # File: HRMSProject/HRMS-Backend/src/main/resources/application.properties
   spring.mail.username=aishushettar95@gmail.com
   spring.mail.password=YOUR_NEW_16_CHAR_PASSWORD_HERE
   ```

3. **Restart Backend:**
   ```bash
   cd HRMSProject/HRMS-Backend
   ./mvnw spring-boot:run
   ```

4. **Test:**
   - Open `test-email.html` in browser
   - Click "Send Test Email"
   - Check Gmail inbox and spam

---

## 📋 Quick Test

### Method 1: Use HTML Test Page

1. Open `HRMSProject/test-email.html` in browser
2. Enter your email
3. Click "Send Test Email"
4. Watch backend console
5. Check Gmail

### Method 2: Use Postman

```
POST http://localhost:8082/api/employee/test-email
Headers: Content-Type: application/json
Body: {"email": "your.email@gmail.com"}
```

### Method 3: Use curl

```bash
curl -X POST http://localhost:8082/api/employee/test-email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your.email@gmail.com\"}"
```

---

## ✅ Success Indicators

**Backend Console Shows:**
```
🔵 Testing email send to: your.email@gmail.com
📩 Bulk invite sent to: your.email@gmail.com
✅ Test email sent successfully to: your.email@gmail.com
Email sent successfully
```

**API Response:**
```json
{
  "success": true,
  "message": "Test email sent to your.email@gmail.com"
}
```

**Gmail:**
- Email arrives in Inbox (or Spam/Promotions)
- Subject: "HRMS Invitation - Welcome!"
- Contains onboarding link and OTP

---

## ❌ Common Errors & Fixes

### Error 1: "Authentication failed"
```
535-5.7.8 Username and Password not accepted
```
**Fix:** Generate new Gmail App Password (see above)

### Error 2: "Connection timeout"
```
Connection timed out to smtp.gmail.com:587
```
**Fix:** Try port 465 instead:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
```

### Error 3: "Template not found"
```
TemplateInputException: Error resolving template "email/invite-email"
```
**Fix:** Verify file exists:
```
HRMSProject/HRMS-Backend/src/main/resources/templates/email/invite-email.html
```

### Error 4: "Connection refused"
```
Connection refused to localhost:8082
```
**Fix:** Backend is not running. Start it:
```bash
cd HRMSProject/HRMS-Backend
./mvnw spring-boot:run
```

---

## 📁 Files Created

1. **test-email.html** - HTML test page (open in browser)
2. **EMAIL_TROUBLESHOOTING_STEPS.md** - Detailed guide
3. **FIX_EMAIL_NOT_RECEIVED.md** - Complete troubleshooting
4. **EMAIL_FIX_QUICK_REFERENCE.md** - This quick reference

---

## 🔍 What to Check

### Before Testing:
- [ ] Backend running on port 8082
- [ ] Gmail App Password is correct (16 chars, no spaces)
- [ ] 2-Step Verification enabled on Gmail account
- [ ] `application.properties` has correct username/password

### After Sending:
- [ ] Backend console shows "Email sent successfully"
- [ ] No errors in backend console
- [ ] Checked Gmail Inbox
- [ ] Checked Gmail Spam folder
- [ ] Checked Promotions tab
- [ ] Checked Updates tab
- [ ] Waited 2-5 minutes

---

## 🆘 Still Not Working?

### Share These Details:

1. **Backend Console Output:**
   - What errors do you see?
   - Copy full error message

2. **Test Result:**
   - What did test-email.html show?
   - Success or error message?

3. **Gmail Settings:**
   - Is App Password newly generated?
   - Is 2-Step Verification enabled?

4. **Email Checked:**
   - Inbox? Spam? Promotions? Updates?
   - Tried different email address?

---

## 🎯 Most Likely Solution

**60% of issues:** Wrong Gmail App Password
→ **Fix:** Generate new one at https://myaccount.google.com/apppasswords

**25% of issues:** Email in Spam
→ **Fix:** Check Spam folder

**10% of issues:** Wrong configuration
→ **Fix:** Verify `spring.mail.username` and `spring.mail.password`

**5% of issues:** Firewall/port blocked
→ **Fix:** Try port 465

---

## 📞 Immediate Action

1. **Open** `test-email.html` in browser
2. **Click** "Send Test Email"
3. **Watch** backend console
4. **Check** Gmail (all folders)
5. **Share** any errors you see

---

**The test endpoint will help us quickly identify the exact issue!**
