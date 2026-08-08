# 🚀 Quick Start: Switch to Gmail SMTP

## ⏱️ 5-Minute Setup

### ⚠️ Warning First
Gmail SMTP is **NOT recommended** for production:
- Daily limit: 500 emails
- Higher spam rates
- Account suspension risk
- Violates Gmail TOS for bulk emails

**Better option:** Wait for Resend domain verification (currently in progress)

---

## If You Still Want Gmail SMTP...

### Step 1: Get Gmail App Password (2 minutes)

1. **Enable 2-Factor Authentication:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - App name: "HRMS Backend"
   - Click "Create"
   - **Copy the 16-character password**

### Step 2: Update Local Config (1 minute)

Edit `src/main/resources/application.properties`:

```properties
# Switch to Gmail
email.service.provider=gmail

# Your Gmail credentials
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=YOUR-APP-PASSWORD-HERE
```

**🔒 Security:** Don't commit this file! Add to `.gitignore`

### Step 3: Update Render (2 minutes)

1. Go to: https://dashboard.render.com/
2. Select your backend service
3. Environment tab
4. Add these variables:

```
EMAIL_SERVICE_PROVIDER = gmail
GMAIL_USERNAME = aishushettar95@gmail.com
GMAIL_APP_PASSWORD = your-16-char-password
MAIL_FROM_NAME = HRMS System
```

5. Save (auto-deploys)

### Step 4: Test (30 seconds)

Send a test invite email and check inbox!

---

## 📊 Files Created for You

| File | Purpose |
|------|---------|
| `GmailSmtpService.java` | Gmail SMTP implementation |
| `UnifiedEmailService.java` | Auto-switches between Gmail/Resend |
| `application.properties` | Added Gmail config |
| `.env.example` | Environment variable examples |
| `GMAIL_SMTP_SETUP_GUIDE.md` | Detailed guide |

---

## 🔄 Switch Between Providers

### Use Gmail:
```properties
email.service.provider=gmail
```

### Use Resend (when domain verifies):
```properties
email.service.provider=resend
```

---

## ❓ Common Issues

### "Invalid credentials"
- ✅ Use App Password, not regular Gmail password
- ✅ Enable 2FA first
- ✅ No spaces in app password

### "Daily limit exceeded"
- ⏳ Wait 24 hours
- 🔄 Switch to Resend

### Emails go to spam
- ⚠️ Expected with Gmail SMTP
- ✅ Use Resend with custom domain instead

---

## 💡 Recommendation

### Testing/Dev:
Gmail SMTP works fine

### Production:
**Wait for Resend domain verification** (better deliverability, analytics, unlimited emails, professional)

---

## 🎯 Current Status

Your Resend domain `omoikaneinnovations.com` is:
- ✅ Added to Resend
- ⏳ Checking DNS (in progress)
- ⏱️ Expected: 15 min - 24 hours

**Best approach:**
1. Use Gmail SMTP for now (if urgent)
2. Switch to Resend when domain verifies
3. Update one environment variable: `EMAIL_SERVICE_PROVIDER=resend`

---

## 📞 Need Help?

- **Gmail issues:** Check `GMAIL_SMTP_SETUP_GUIDE.md`
- **Resend issues:** Check `EMAIL_DELIVERABILITY_GUIDE.md`
- **Code issues:** Check `UnifiedEmailService.java`

---

**Ready?** Get your Gmail App Password and update the config! 🚀
