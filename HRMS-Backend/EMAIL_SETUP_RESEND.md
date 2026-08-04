# 📧 Email Setup with Resend (3rd Party Service)

## ✅ Why Resend?
- **FREE**: 3,000 emails/month free tier
- **NO Gmail issues**: No app passwords, no 2FA problems
- **ZERO code changes**: Just environment variables
- **Reliable**: 99.9% uptime, better deliverability

---

## 🚀 Setup Steps (5 minutes)

### Step 1: Create Resend Account
1. Go to: https://resend.com/signup
2. Sign up with your email
3. Verify your email address

### Step 2: Get API Key
1. Login to Resend
2. Go to: https://resend.com/api-keys
3. Click **"Create API Key"**
4. Give it a name: `HRMS-Backend`
5. Copy the API key (starts with `re_...`)
   - Example: `re_123abc456def789ghi`

### Step 3: Set Environment Variable

#### **For Localhost (Development):**

**Windows (CMD):**
```cmd
set RESEND_API_KEY=re_YOUR_ACTUAL_API_KEY_HERE
```

**Windows (PowerShell):**
```powershell
$env:RESEND_API_KEY="re_YOUR_ACTUAL_API_KEY_HERE"
```

**Permanent (Windows):**
1. Search "Environment Variables" in Windows
2. Click "Edit system environment variables"
3. Click "Environment Variables" button
4. Under "User variables" click "New"
5. Variable name: `RESEND_API_KEY`
6. Variable value: `re_YOUR_ACTUAL_API_KEY_HERE`
7. Click OK

#### **For Production (Vercel/Render/Railway):**

Add environment variable:
- Key: `RESEND_API_KEY`
- Value: `re_YOUR_ACTUAL_API_KEY_HERE`

### Step 4: Configure From Email

#### **For Testing (No Domain Required):**
Set environment variable:
```cmd
set FROM_EMAIL=onboarding@resend.dev
set REPLY_TO_EMAIL=onboarding@resend.dev
```

This works immediately! Resend provides `onboarding@resend.dev` for testing.

#### **For Production (With Your Domain):**
1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `omoikaneinnovations.com`)
4. Add DNS records shown by Resend
5. Wait for verification
6. Set environment variables:
```cmd
set FROM_EMAIL=noreply@yourdomain.com
set REPLY_TO_EMAIL=noreply@yourdomain.com
```

### Step 5: Restart Backend
```cmd
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

---

## 🎯 Testing Email

### Test 1: Invite an Employee
1. Go to Employee Directory
2. Click "Invite Employee"
3. Enter email (use your own email for testing)
4. Check logs for:
   ```
   📧 Sending invite email to: test@example.com
   ✅ Invite email sent successfully to: test@example.com
   ```
5. Check your inbox (or spam folder)

### Test 2: Check Resend Dashboard
1. Go to: https://resend.com/emails
2. You should see your sent email
3. Click on it to see delivery status

---

## 🐛 Troubleshooting

### Problem: "Authentication failed"
**Solution:** Check if `RESEND_API_KEY` is set correctly
```cmd
echo %RESEND_API_KEY%
```

### Problem: "Invalid from address"
**Solution:** Use `onboarding@resend.dev` for testing or verify your domain

### Problem: Emails in spam
**Solution:** 
- In testing, this is normal
- For production, verify your domain and add SPF/DKIM records

### Problem: No emails received
**Solution:** Check Resend dashboard logs at https://resend.com/emails

---

## 📊 Alternative Option: Use Gmail (If Resend doesn't work)

Uncomment Gmail configuration in `application.properties`:
```properties
# Option 1: Gmail (Current)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${SPRING_MAIL_USERNAME:aishushettar95@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:cdgqwbpdfxlqzinf}
```

And comment out Resend:
```properties
# Option 2: RESEND (Recommended)
#spring.mail.host=smtp.resend.com
#spring.mail.port=587
#spring.mail.username=resend
#spring.mail.password=${RESEND_API_KEY}
```

---

## 📝 Summary

### What was changed:
✅ Status now shows **ACTIVE** (not INVITED)
✅ Email configured to use **Resend SMTP**
✅ **NO code changes** - only configuration

### Environment Variables Required:
```cmd
RESEND_API_KEY=re_YOUR_API_KEY
FROM_EMAIL=onboarding@resend.dev
REPLY_TO_EMAIL=onboarding@resend.dev
MONGODB_URI=your_mongodb_connection
```

### To switch back to Gmail:
Just comment/uncomment the mail configuration sections in `application.properties`

---

## 🎉 Done!

After setting `RESEND_API_KEY`, your emails will work perfectly!

Questions? Check Resend docs: https://resend.com/docs
