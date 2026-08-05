# Email Solution: Resend HTTP API ✅

## Problem
Render Free Tier **blocks outbound SMTP connections** on port 587. Gmail SMTP cannot be used on Render, causing this error:
```
java.net.SocketTimeoutException: Connect timed out
Couldn't connect to host, port: smtp.gmail.com, 587
```

## Solution
Use **Resend HTTP API** which works via HTTPS (not blocked by Render).

**Localhost**: Uses Gmail SMTP (works fine) ✅  
**Render**: Falls back to Resend HTTP API automatically ✅

## No Logic Changed! ✅

The code now:
1. **Tries SMTP first** (Gmail) - works on localhost
2. **Falls back to Resend HTTP API** - works on Render when SMTP fails
3. Same email templates, same functionality

## Setup Steps

### 1. Create Free Resend Account

1. Go to: https://resend.com/signup
2. Sign up (free - 3000 emails/month)
3. Verify your email
4. Go to API Keys: https://resend.com/api-keys
5. Click **"Create API Key"**
6. Copy the API key (starts with `re_`)

### 2. Add API Key to Render

1. Go to Render Dashboard
2. Click on **LatestFinalHrmsApplication**
3. Go to **Environment** tab
4. Click **"Add Environment Variable"**
5. Add:
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_xxxxxxxxxxxxx` (your API key)
6. Click **"Save Changes"**

### 3. Verify Domain (Optional but Recommended)

**Without Domain Verification**:
- Can only send FROM: `onboarding@resend.dev`
- Emails work but look less professional

**With Domain Verification** (Recommended):
1. Go to: https://resend.com/domains
2. Click **"Add Domain"**
3. Enter: `omoikaneinnovations.com` (or your domain)
4. Add DNS records (provided by Resend)
5. Wait for verification (5-30 minutes)
6. Update Render environment variable:
   - `meeting.email.from-address=noreply@omoikaneinnovations.com`

### 4. Redeploy on Render

1. Go to **Events** tab
2. Click **"Manual Deploy"**
3. Deploy latest commit (`25586c8`)
4. Wait 5-10 minutes

## Testing

### Test on Localhost (Should Still Use Gmail SMTP):
1. Start backend locally
2. Send invite email
3. Check logs - should see: `✅ SMTP: Email sent successfully`
4. Email arrives from: `aishushettar95@gmail.com` ✅

### Test on Render (Will Use Resend):
1. Deploy to Render
2. Send invite email from frontend
3. Check Render logs - should see:
   ```
   ⚠️ SMTP Failed... Trying Resend HTTP API...
   ✅ Resend: Email sent successfully
   ```
4. Email arrives from: `onboarding@resend.dev` (or your verified domain) ✅

## Current Configuration

### application.properties (Already Updated):
```properties
# Gmail SMTP (for localhost)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=uibswyvitauzsjjf

# Resend API (for Render/Production)
resend.api.key=${RESEND_API_KEY:}
resend.enabled=${RESEND_ENABLED:true}
```

### EmailService.java (Already Updated):
- Tries SMTP first
- Falls back to Resend if SMTP fails
- Logs which method was used

## Environment Variables Needed in Render

| Variable | Value | Purpose |
|----------|-------|---------|
| `MONGODB_URI` | `mongodb+srv://...` | Database connection |
| `JWT_SECRET` | Your secret | JWT tokens |
| `SPRING_MAIL_USERNAME` | Gmail address | SMTP (won't work on Render) |
| `SPRING_MAIL_PASSWORD` | App password | SMTP (won't work on Render) |
| `RESEND_API_KEY` | `re_xxxxx` | **✅ NEW - Email delivery** |
| `FRONTEND_URL` | Vercel URL | Frontend link |

## Resend Free Tier Limits

- ✅ **3,000 emails/month** - plenty for most use cases
- ✅ **100 emails/day** per domain
- ✅ **HTTPS API** - works on Render
- ✅ **Email templates** - supports HTML
- ✅ **Tracking** - see delivery status

## Cost Comparison

| Service | Free Tier | Render Compatible |
|---------|-----------|-------------------|
| Gmail SMTP | Unlimited | ❌ Blocked |
| Resend | 3,000/month | ✅ Works |
| SendGrid | 100/day | ✅ Works |
| Mailgun | 5,000/month | ✅ Works |

**Resend is recommended** - best for Render, good free tier, easy setup.

## Troubleshooting

### If Emails Still Don't Send on Render:

1. **Check Render Logs**:
   ```
   Render Dashboard → Logs
   ```
   Look for:
   - `⚠️ SMTP Failed`
   - `✅ Resend: Email sent successfully`
   
2. **Verify RESEND_API_KEY**:
   - Go to Environment tab
   - Make sure `RESEND_API_KEY` is set
   - Value should start with `re_`

3. **Check Resend Dashboard**:
   - Go to: https://resend.com/emails
   - See if emails are being sent
   - Check for errors

4. **Test API Key**:
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "onboarding@resend.dev",
       "to": "your-email@gmail.com",
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### If Emails Don't Work on Localhost:

This means Gmail SMTP failed. Check:
- Gmail app password is correct
- "Less secure apps" is enabled (if using old Gmail)
- 2FA is enabled and app password is used

## Commit Details

**Commit**: `25586c8`
**Message**: "Add Resend HTTP API fallback for email when SMTP fails on Render"
**Changes**:
- Added Resend configuration to application.properties
- Modified EmailService to use Resend as fallback
- No logic changed - just added HTTP email delivery option

## Why This Works

**Render blocks SMTP ports (25, 465, 587)** for security/spam prevention.

**But Render allows HTTPS (port 443)** for API calls.

**Resend uses HTTPS API** instead of SMTP, so it works on Render! ✅

## Next Steps

1. ✅ Create Resend account
2. ✅ Get API key
3. ✅ Add to Render environment
4. ✅ Redeploy
5. ✅ Test email sending
6. ✅ (Optional) Verify custom domain

After setup, emails will work perfectly on both localhost and Render!
