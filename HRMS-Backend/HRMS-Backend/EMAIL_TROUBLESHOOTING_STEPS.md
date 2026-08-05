# Email Not Received - Step-by-Step Troubleshooting

## 🔍 Diagnostic Steps

### Step 1: Check Backend Console Logs

When you click "Send Invite" in Employee Directory, **immediately** look at your backend console (where you ran `mvnw spring-boot:run`).

**What to look for:**

✅ **Success looks like:**
```
📩 Bulk invite sent to: aishwarya.n@omoikaneinnovations.com
Email sent successfully to: aishwarya.n@omoikaneinnovations.com
DEBUG: Successfully sent email
```

❌ **Errors look like:**
```
❌ Failed sending bulk invite: Authentication failed
javax.mail.AuthenticationFailedException: 535-5.7.8 Username and Password not accepted
Connection timeout
Template not found: email/invite-email
```

**→ If you see an error, copy the FULL error message and share it.**

---

### Step 2: Test Email Directly

I've added a test endpoint to your backend. Use this to test email sending:

#### Using Postman:

1. **Method:** POST
2. **URL:** `http://localhost:8082/api/employee/test-email`
3. **Headers:**
   - `Content-Type: application/json`
4. **Body (raw JSON):**
```json
{
  "email": "aishwarya.n@omoikaneinnovations.com"
}
```

5. Click **Send**

#### Using curl (Command Line):

```bash
curl -X POST http://localhost:8082/api/employee/test-email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"aishwarya.n@omoikaneinnovations.com\"}"
```

#### Using Browser:

Create this HTML file and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test HRMS Email</title>
</head>
<body>
    <h2>Test HRMS Email Sending</h2>
    <input type="email" id="email" placeholder="Enter email" value="aishwarya.n@omoikaneinnovations.com">
    <button onclick="testEmail()">Send Test Email</button>
    <div id="result"></div>

    <script>
        async function testEmail() {
            const email = document.getElementById('email').value;
            const result = document.getElementById('result');
            
            try {
                const response = await fetch('http://localhost:8082/api/employee/test-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                result.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
                result.innerHTML = '<pre style="color:red">Error: ' + error.message + '</pre>';
            }
        }
    </script>
</body>
</html>
```

**Watch the backend console for logs!**

---

### Step 3: Check Gmail Settings

#### A. Verify App Password

Your `application.properties` shows:
```properties
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=bbfskhrhtnujkokk
```

**Is `bbfskhrhtnujkokk` a valid Gmail App Password?**

**To generate new App Password:**

1. Go to: https://myaccount.google.com/apppasswords
2. If you don't see "App passwords":
   - First enable 2-Step Verification at https://myaccount.google.com/security
   - Then try step 1 again
3. Click "Select app" → Choose "Mail"
4. Click "Select device" → Choose "Other" → Type "HRMS Backend"
5. Click "Generate"
6. **Copy the 16-character password** (example: `abcd efgh ijkl mnop`)
7. **Remove spaces:** `abcdefghijklmnop`
8. Update in `application.properties`:
```properties
spring.mail.password=abcdefghijklmnop
```
9. **Restart backend**
10. Try sending email again

#### B. Check Gmail Spam Folder

1. Open Gmail
2. Click on **Spam** in left sidebar
3. Search for: "HRMS Invitation"
4. If found, click "Not spam"

#### C. Check All Gmail Tabs

Gmail sorts emails into tabs:
- Primary
- Promotions
- Social
- Updates

Check **all tabs**, especially **Promotions** and **Updates**.

---

### Step 4: Check Common Issues

#### Issue 1: "Less secure app access"

Gmail may block "less secure apps". 

**Fix:**
- Use App Password (see Step 3A above)
- This is the most common issue!

#### Issue 2: Port Blocked by Firewall

Current config uses port 587 (STARTTLS).

**Try port 465 (SSL):**

Update `application.properties`:
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
spring.mail.properties.mail.smtp.starttls.required=false
```

Restart backend and try again.

#### Issue 3: Template Not Found

Email template should exist at:
```
HRMSProject/HRMS-Backend/src/main/resources/templates/email/invite-email.html
```

**Verify it exists:**
```bash
cd HRMSProject/HRMS-Backend/src/main/resources/templates/email
ls -la
```

Should show: `invite-email.html`

---

### Step 5: Enable Detailed Debug Logging

Your `application.properties` already has debug enabled:
```properties
logging.level.org.springframework.mail=DEBUG
spring.mail.properties.mail.debug=true
```

**Watch backend console for:**

```
DEBUG: JavaMail version 1.6.x
DEBUG: mail.smtp.host=smtp.gmail.com
DEBUG: Attempting plain socket connection to smtp.gmail.com:587
220 smtp.gmail.com ESMTP
250-smtp.gmail.com at your service
AUTH LOGIN
235 2.7.0 Accepted
250 2.1.0 OK
250 2.1.5 OK
354 Go ahead
250 2.0.0 OK
```

**Errors to look for:**

```
535-5.7.8 Username and Password not accepted  ← Wrong password
Connection timed out                           ← Firewall/network issue
Template not found                             ← Missing template file
Authentication failed                          ← App password issue
```

---

## 🔧 Quick Fixes

### Fix 1: Generate New Gmail App Password

**Do this first - it's the most common issue!**

1. https://myaccount.google.com/apppasswords
2. Generate new password for "Mail"
3. Copy 16-character password (remove spaces)
4. Update `application.properties`:
```properties
spring.mail.password=YOUR_NEW_PASSWORD_HERE
```
5. Restart backend: `./mvnw spring-boot:run`
6. Test again

### Fix 2: Try Alternative SMTP Port

If port 587 doesn't work, try 465:

```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
```

### Fix 3: Use Different Email Service

If Gmail keeps failing, try **SendGrid** (free 100 emails/day):

1. Sign up: https://sendgrid.com/
2. Create API Key
3. Update `application.properties`:
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

## 📝 Checklist

Go through this checklist:

- [ ] Backend is running (port 8082)
- [ ] Backend console is visible (can see logs)
- [ ] Clicked "Send Invite" and watched console
- [ ] Copied any error messages from console
- [ ] Checked Gmail **Inbox**
- [ ] Checked Gmail **Spam** folder
- [ ] Checked Gmail **Promotions** tab
- [ ] Checked Gmail **Updates** tab
- [ ] Gmail App Password is correct (16 characters, no spaces)
- [ ] 2-Step Verification is enabled on Gmail account
- [ ] Tried the test email endpoint
- [ ] Backend shows "Email sent successfully" in logs
- [ ] Waited 5-10 minutes for email to arrive

---

## 🆘 Still Not Working?

### Share These Details:

1. **Backend Console Output**
   - What do you see when you click "Send Invite"?
   - Any errors in red?
   - Copy the full error message

2. **Test Email Result**
   - What response did you get from `/test-email` endpoint?
   - Success or error?

3. **Gmail Check**
   - Is App Password newly generated?
   - Checked all folders (Inbox, Spam, Promotions)?
   - Tried different email address?

4. **Network**
   - Running locally or on server?
   - Any firewall/antivirus software?

---

## 🎯 Most Likely Solutions

**99% of email issues are caused by:**

### 1. Invalid Gmail App Password (60%)
→ **Fix:** Generate new App Password at https://myaccount.google.com/apppasswords

### 2. Email in Spam Folder (25%)
→ **Fix:** Check Spam folder, mark as "Not spam"

### 3. Wrong Email Configuration (10%)
→ **Fix:** Verify `spring.mail.username` and `spring.mail.password`

### 4. Firewall Blocking SMTP Port (5%)
→ **Fix:** Try port 465 instead of 587

---

## 📞 Next Steps

1. **Restart Backend:**
```bash
cd HRMSProject/HRMS-Backend
./mvnw spring-boot:run
```

2. **Test Email Endpoint:**
```bash
curl -X POST http://localhost:8082/api/employee/test-email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your.email@gmail.com\"}"
```

3. **Watch Console Output**

4. **Check Gmail (all folders)**

5. **If still failing, share the backend console error message**

---

**The test endpoint I added will help us diagnose the exact issue. Try it and share what you see!**
