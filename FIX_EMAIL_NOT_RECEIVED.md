# Fix: Invitation Emails Not Received

## Problem
Sending invitation emails from Employee Directory but emails are not arriving in Gmail inbox.

---

## Common Causes & Solutions

### 1. ✅ Check Gmail App Password

Your current configuration uses:
```properties
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=bbfskhrhtnujkokk
```

**Verify:**
1. Is `bbfskhrhtnujkokk` a valid Gmail **App Password**? (Not your regular Gmail password)
2. Go to Google Account → Security → 2-Step Verification → App Passwords
3. Generate a new App Password if needed

### 2. ✅ Check Gmail Spam/Junk Folder

- Emails might be going to Spam
- Check **Spam**, **Promotions**, **Updates** tabs in Gmail
- Mark as "Not Spam" if found

### 3. ✅ Check Backend Logs

Look for email sending errors in backend console:

**Success logs:**
```
📩 Bulk invite sent to: aishwarya.n@omoikaneinnovations.com
Email sent successfully to: aishwarya.n@omoikaneinnovations.com
```

**Error logs:**
```
❌ Failed sending bulk invite: Authentication failed
Failed to send invite email to aishwarya.n@omoikaneinnovations.com
```

### 4. ✅ Verify SMTP Settings

Current settings in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

These are correct for Gmail.

### 5. ✅ Test Email Connection

Add this test endpoint to verify email is working:

---

## Quick Fix: Test Email Endpoint

### Add to EmployeeController.java

```java
// Test email endpoint
@PostMapping("/test-email")
public ResponseEntity<?> testEmail(@RequestBody Map<String, String> request) {
    try {
        String email = request.get("email");
        
        onboardingService.sendInvitationEmail(
                email,
                "Test User",
                "Temp@123"
        );
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test email sent to " + email
        ));
    } catch (Exception e) {
        return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "error", e.getMessage()
        ));
    }
}
```

**Test using Postman or curl:**
```bash
POST http://localhost:8082/api/employees/test-email
Content-Type: application/json

{
  "email": "aishwarya.n@omoikaneinnovations.com"
}
```

---

## Alternative Email Providers (If Gmail Doesn't Work)

### Option 1: Use Outlook/Office365

Uncomment in `application.properties`:
```properties
spring.mail.host=smtp.office365.com
spring.mail.port=587
spring.mail.username=mahesh.p@omoikaneinnovations.com
spring.mail.password=YOUR_PASSWORD
```

### Option 2: Use SMTP2GO (Free Tier)

1. Sign up at https://www.smtp2go.com/
2. Get SMTP credentials
3. Update `application.properties`:
```properties
spring.mail.host=mail.smtp2go.com
spring.mail.port=2525
spring.mail.username=your-smtp2go-username
spring.mail.password=your-smtp2go-password
```

### Option 3: Use SendGrid (Free 100 emails/day)

1. Sign up at https://sendgrid.com/
2. Create API key
3. Update `application.properties`:
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=YOUR_SENDGRID_API_KEY
```

---

## Debugging Steps

### Step 1: Enable Debug Logging

Already enabled in `application.properties`:
```properties
logging.level.org.springframework.mail=DEBUG
spring.mail.properties.mail.debug=true
```

### Step 2: Check Console Output

When you click "Send Invite", watch the backend console for:

**Look for:**
```
DEBUG: JavaMail version ...
DEBUG: mail.smtp.host=smtp.gmail.com
DEBUG: Attempting to connect to smtp.gmail.com
DEBUG: Sending message
220 smtp.gmail.com ESMTP ...
```

**Errors to watch for:**
```
❌ 535 Authentication failed
❌ Connection timeout
❌ javax.mail.AuthenticationFailedException
❌ javax.mail.MessagingException
```

### Step 3: Verify Email Service is Being Called

Add log statements in `OnboardingService.java`:

```java
public void sendInvitationEmail(...) {
    log.info("🔵 sendInvitationEmail called for: {}", email);
    
    try {
        // ... existing code ...
        
        log.info("🔵 Calling emailService.sendInviteEmail");
        emailService.sendInviteEmail(...);
        
        log.info("✅ Email sent successfully!");
    } catch (Exception e) {
        log.error("❌ Email failed: {}", e.getMessage());
        throw new RuntimeException(e.getMessage());
    }
}
```

### Step 4: Check Email Queue (If Using Async)

The EmailService uses an async queue. Check if emails are stuck in queue:

```java
// Add endpoint to check email queue
@GetMapping("/email-queue-stats")
public ResponseEntity<?> getEmailQueueStats() {
    return ResponseEntity.ok(emailService.getEmailQueueStats());
}
```

---

## Common Issues & Solutions

### Issue 1: "Authentication Failed"

**Cause:** Invalid app password or 2FA not enabled

**Fix:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate new password for "Mail"
5. Copy 16-character password (no spaces)
6. Update `application.properties`:
```properties
spring.mail.password=abcdabcdabcdabcd
```
7. Restart backend

### Issue 2: "Connection Timeout"

**Cause:** Firewall blocking SMTP port 587

**Fix:**
1. Try port 465 (SSL):
```properties
spring.mail.port=465
spring.mail.properties.mail.smtp.ssl.enable=true
spring.mail.properties.mail.smtp.starttls.enable=false
```

2. Or check firewall/antivirus settings

### Issue 3: Emails Going to Spam

**Fix:**
1. Check spam folder
2. Add sender to contacts
3. Mark as "Not Spam"
4. Set up SPF/DKIM records (for production)

### Issue 4: "Template Not Found"

**Cause:** Email template missing

**Fix:**
Verify file exists:
```
HRMSProject/HRMS-Backend/src/main/resources/templates/email/invite-email.html
```

---

## Production Deployment Fixes

### For Vercel/Railway/Render:

1. **Set Environment Variables:**
```bash
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=your_app_password_here
FRONTEND_URL=https://your-app.vercel.app
```

2. **Use Dedicated Email Service:**
- SendGrid (recommended)
- Mailgun
- AWS SES
- Postmark

### For Gmail in Production:

Gmail may block server IPs. Use:
- Google Workspace SMTP
- Or switch to SendGrid/Mailgun

---

## Testing Checklist

- [ ] Backend is running (port 8082)
- [ ] Check backend console for logs
- [ ] Gmail App Password is correct
- [ ] No firewall blocking port 587
- [ ] Email template exists
- [ ] Check Gmail Spam folder
- [ ] Try sending to different email address
- [ ] Test with test endpoint
- [ ] Check email queue stats

---

## Immediate Action Steps

### 1. Check Backend Console RIGHT NOW

When you click "Send Invite", immediately look at backend console.

**You should see:**
```
📩 Bulk invite sent to: email@example.com
```

**If you see error:**
```
❌ Failed sending bulk invite: [error message]
```
Copy the error message and we'll fix it.

### 2. Verify Gmail Settings

1. Go to https://myaccount.google.com/apppasswords
2. Generate new app password
3. Update `application.properties`:
```properties
spring.mail.password=NEW_16_CHAR_PASSWORD
```
4. Restart backend
5. Try again

### 3. Check Spam Folder

Open Gmail → Spam folder → Search for "HRMS Invitation"

### 4. Test with Simple Endpoint

Add this quick test:

**In EmployeeController.java:**
```java
@GetMapping("/test-email-simple")
public String testEmailSimple() {
    try {
        emailService.sendSimpleEmail(
                "aishwarya.n@omoikaneinnovations.com",
                "Test Email",
                "This is a test email from HRMS"
        );
        return "Email sent! Check inbox";
    } catch (Exception e) {
        return "Error: " + e.getMessage();
    }
}
```

Visit: `http://localhost:8082/api/employees/test-email-simple`

---

## Summary

**Most Common Cause:** Invalid Gmail App Password

**Quick Fix:**
1. Generate new Gmail App Password
2. Update application.properties
3. Restart backend
4. Check spam folder
5. Look at backend console logs

**Alternative Solution:**
Use SendGrid (free 100 emails/day) instead of Gmail for better reliability.

---

## Need More Help?

Share the **backend console output** when you click "Send Invite" and I can diagnose the exact issue.
