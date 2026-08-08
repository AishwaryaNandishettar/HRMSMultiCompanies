# 📧 Gmail SMTP Setup Guide

## ⚠️ CRITICAL WARNING

**Using Gmail SMTP for business/transactional emails is NOT recommended because:**

1. **Violates Gmail Terms of Service** - Gmail is for personal use, not bulk transactional emails
2. **Daily sending limit** - Only 500 emails per day
3. **Account suspension risk** - Gmail may suspend your account
4. **Higher spam rates** - Gmail SMTP emails often go to spam folder
5. **Security risk** - Your personal Gmail exposed to all recipients
6. **No analytics** - No delivery tracking or bounce management

**Recommendation:** Wait for Resend domain verification (currently in progress)

---

## But if you MUST use Gmail SMTP...

### Step 1: Generate Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Sign in** with your Gmail account
3. **Enable 2-Factor Authentication** (required for app passwords)
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"
4. **Create App Password:**
   - App name: "HRMS Backend"
   - Click "Create"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Update application.properties (Local Testing)

Edit: `src/main/resources/application.properties`

```properties
# Switch to Gmail SMTP
email.service.provider=gmail

# Gmail Configuration
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=YOUR-16-CHAR-APP-PASSWORD-HERE
spring.mail.from-name=HRMS System
```

**⚠️ NEVER commit app password to Git!**

### Step 3: Update Render Environment Variables (Production)

1. Go to: https://dashboard.render.com/
2. Select your backend service
3. Click "Environment" tab
4. **Add/Update these variables:**

   ```
   EMAIL_SERVICE_PROVIDER = gmail
   GMAIL_USERNAME = aishushettar95@gmail.com
   GMAIL_APP_PASSWORD = your-16-char-app-password
   MAIL_FROM_NAME = Omoikane Innovations HRMS
   ```

5. Save and wait for redeploy

### Step 4: Update OnboardingService (If Needed)

If your `OnboardingService` is using `ResendEmailService` directly, update it to use `UnifiedEmailService`:

```java
@Autowired
private UnifiedEmailService emailService;  // Instead of ResendEmailService

// Then use it normally:
emailService.sendEmail(toEmail, subject, htmlContent);
```

### Step 5: Test

1. Restart your backend
2. Send a test invite email
3. Check Gmail inbox

---

## Switching Between Gmail and Resend

### Use Gmail SMTP:
```properties
email.service.provider=gmail
```

### Use Resend API (Recommended):
```properties
email.service.provider=resend
```

---

## 🔍 Troubleshooting Gmail SMTP

### Error: "Invalid credentials" or "Username and Password not accepted"

**Solutions:**
1. **Enable 2-Factor Authentication** first
2. **Generate App Password** (not your regular Gmail password)
3. **Check username** - use full email: `aishushettar95@gmail.com`
4. **Remove spaces** from app password

### Error: "Daily sending quota exceeded"

**Solution:**
- Gmail limit: 500 emails/day
- Wait 24 hours or switch to Resend

### Error: "Mail server connection failed"

**Solutions:**
1. **Check firewall** - Allow port 587
2. **Verify SMTP settings:**
   ```
   Host: smtp.gmail.com
   Port: 587
   TLS: Enabled
   ```
3. **Test from terminal:**
   ```bash
   telnet smtp.gmail.com 587
   ```

### Emails Still Go to Spam

**Why?**
- Gmail SMTP has poor reputation for bulk emails
- No SPF/DKIM records for your domain
- Gmail detects automated sending

**Solutions:**
1. **Ask recipients** to mark "Not Spam"
2. **Warm up account** - Send 10-20 emails/day first
3. **Add unsubscribe link** in email
4. **Switch to Resend** with custom domain (best solution)

---

## 📊 Gmail SMTP vs Resend Comparison

| Feature | Gmail SMTP | Resend API |
|---------|-----------|------------|
| **Daily Limit** | 500 emails | 100+ emails/day (free tier) |
| **Spam Rate** | High | Low (with domain) |
| **Deliverability** | Poor | Excellent |
| **Analytics** | None | Full tracking |
| **Cost** | Free | Free up to 3,000/month |
| **TOS Compliant** | ❌ No | ✅ Yes |
| **Domain Setup** | Not needed | Required |
| **Professional** | ❌ No | ✅ Yes |
| **Account Risk** | High | None |

---

## 🎯 Recommendation

### For Testing/Development:
✅ Use Gmail SMTP (quick and easy)

### For Production:
✅ Use Resend API with custom domain (professional and reliable)

---

## 🔄 How to Switch Back to Resend

When your Resend domain is verified (currently checking DNS):

### Step 1: Update application.properties
```properties
email.service.provider=resend
```

### Step 2: Update Render Environment Variables
```
EMAIL_SERVICE_PROVIDER = resend
RESEND_FROM_EMAIL = noreply@omoikaneinnovations.com
```

### Step 3: Redeploy and Test

That's it! The `UnifiedEmailService` will automatically switch to Resend.

---

## 📁 Files Created

1. ✅ `GmailSmtpService.java` - Gmail SMTP implementation
2. ✅ `UnifiedEmailService.java` - Switches between Gmail/Resend
3. ✅ Updated `application.properties` - Added Gmail config
4. ✅ This guide

---

## 🆘 Still Having Issues?

### Gmail Account Suspended?
- Contact Google Support
- May need to verify account ownership
- Consider using a dedicated email service (Resend, SendGrid, Mailgun)

### Emails Going to Spam?
- **With Gmail SMTP:** Expected behavior, very hard to fix
- **With Resend + Domain:** Should work perfectly

### Need Higher Limits?
- **Gmail:** Max 500/day, cannot be increased
- **Resend:** Upgrade to paid plan for unlimited

---

## 🎉 Summary

**Quick Setup (5 minutes):**
1. Enable 2FA on Gmail
2. Generate App Password
3. Update `application.properties` → `email.service.provider=gmail`
4. Update Render env vars
5. Test

**Production Setup (30 minutes):**
1. Wait for Resend domain verification
2. Update env vars → `email.service.provider=resend`
3. Enjoy professional email delivery! 🚀

---

**Current Status:**
- ✅ Code updated with Gmail SMTP support
- ✅ UnifiedEmailService created (can switch providers)
- ⏳ Resend domain verification in progress
- 🎯 **Recommended:** Wait for Resend domain, use Gmail only for testing

---

**Security Note:** 
🔒 Never commit Gmail app password to Git
🔒 Use environment variables for sensitive data
🔒 Rotate app passwords regularly
