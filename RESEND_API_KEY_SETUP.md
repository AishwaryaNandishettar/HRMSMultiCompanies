# 🔑 Resend API Key Setup - Step by Step

## 📋 Getting Your Resend API Key

### Step 1: Sign Up / Login
1. Go to: **https://resend.com**
2. Click **"Sign up"** or **"Login"**
3. Use your email or GitHub account
4. Verify your email if needed

### Step 2: Access API Keys Section
1. After login, you'll be on the dashboard
2. On the left sidebar, click **"API Keys"**
3. You'll see a list of your API keys (if any)

### Step 3: Create New API Key
1. Click the **"Create API Key"** button (top right)
2. Fill in the form:
   - **Name**: `HRMS Production` (or any name you prefer)
   - **Permission**: Select **"Full access"** or **"Sending access"**
   - **Domain**: Leave as **"All domains"** for now
3. Click **"Create"**

### Step 4: Copy Your API Key
```
⚠️ IMPORTANT: You can only see the API key ONCE!
Copy it immediately and save it securely.
```

The key will look like this:
```
re_123abc456def789ghi012jkl345mno678
```

It always starts with `re_`

---

## 🧪 Test Your API Key (Optional)

### Using curl (Windows PowerShell)
```powershell
curl -X POST https://api.resend.com/emails `
  -H "Authorization: Bearer re_your_api_key_here" `
  -H "Content-Type: application/json" `
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your-test-email@example.com",
    "subject": "Test Email from HRMS",
    "html": "<p>This is a test email!</p>"
  }'
```

### Expected Response (Success)
```json
{
  "id": "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794"
}
```

If you get this, your API key works! ✅

---

## 📧 Email Address Configuration

### For Testing (No Domain Required)
Use Resend's test address:
```
RESEND_FROM_EMAIL=onboarding@resend.dev
```

✅ Pros:
- Works immediately
- No domain verification needed
- Good for testing

⚠️ Cons:
- Emails may go to spam
- Not branded with your company

### For Production (Domain Verification Required)
Use your own domain:
```
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
```

**Requires:**
1. Go to Resend Dashboard → **Domains**
2. Click **"Add Domain"**
3. Enter: `omoikaneinnovations.com`
4. Add DNS records to your domain provider:
   - SPF record
   - DKIM record
   - Return-Path record
5. Wait for verification (5-30 minutes)
6. Once verified, you can use any email like:
   - `noreply@omoikaneinnovations.com`
   - `hr@omoikaneinnovations.com`
   - `invitations@omoikaneinnovations.com`

---

## 🎯 Recommended Configuration

### For Immediate Testing
```bash
RESEND_ENABLED=true
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_FROM_NAME=HRMS System
```

### For Production (After Domain Verification)
```bash
RESEND_ENABLED=true
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
RESEND_FROM_NAME=Omoikane Innovations HRMS
```

---

## 📊 Resend Free Tier Limits

| Metric | Free Tier |
|--------|-----------|
| Emails per day | 100 |
| Emails per month | 3,000 |
| API Keys | Unlimited |
| Domains | 1 verified domain |
| Team members | 1 |
| Support | Community |

**For most small companies, this is enough to start!**

---

## 🔐 Security Best Practices

### ✅ Do's
- ✅ Store API key in environment variables
- ✅ Never commit API key to Git
- ✅ Use separate keys for dev/staging/production
- ✅ Rotate keys periodically (every 3-6 months)
- ✅ Monitor usage in Resend dashboard

### ❌ Don'ts
- ❌ Never hardcode API key in source code
- ❌ Never share API key in Slack/Email
- ❌ Never commit `.env` file to Git
- ❌ Never use same key across multiple projects
- ❌ Never share API key with unauthorized people

---

## 🔄 Rotating Your API Key

If you need to change your API key:

### Step 1: Create New Key
1. Go to Resend Dashboard → API Keys
2. Click "Create API Key"
3. Name it (e.g., `HRMS Production v2`)
4. Copy the new key

### Step 2: Update Render
1. Go to Render Dashboard → Your Service → Environment
2. Update `RESEND_API_KEY` with the new key
3. Save changes
4. Wait for automatic redeployment

### Step 3: Delete Old Key
1. Go back to Resend Dashboard → API Keys
2. Find the old key
3. Click "Delete"
4. Confirm deletion

---

## 🐛 Troubleshooting API Key Issues

### Problem: "Invalid API Key" error

**Solutions:**
1. Check that key starts with `re_`
2. Verify no extra spaces before/after key
3. Regenerate key in Resend dashboard
4. Update Render environment variable

### Problem: "Rate limit exceeded" error

**Solutions:**
1. Check usage in Resend dashboard
2. Upgrade to paid plan if needed
3. Implement email queuing/throttling
4. Wait 24 hours for limit reset

### Problem: "Domain not verified" error

**Solutions:**
1. Use `onboarding@resend.dev` for testing
2. Or complete domain verification in Resend dashboard
3. Add DNS records as instructed
4. Wait for verification to complete

---

## 📞 Getting Help

### Resend Documentation
- API Docs: https://resend.com/docs
- SDKs: https://resend.com/docs/sdks
- Examples: https://resend.com/docs/examples

### Resend Community
- Discord: https://resend.com/discord
- GitHub: https://github.com/resendlabs/resend-java

### Your Application Logs
- Check Render logs for detailed error messages
- Look for `❌` indicators in logs
- Search for "RESEND" in logs

---

## ✅ Quick Verification

After setting up your API key in Render:

1. **Check Environment Variables**
   ```
   Render Dashboard → Environment → 
   RESEND_API_KEY=re_xxxxx... ✅
   ```

2. **Deploy and Check Logs**
   ```
   📧 EMAIL PROVIDER: RESEND ✅
   🔑 Resend API Key configured: YES ✅
   ```

3. **Send Test Email**
   ```
   ✅ RESEND EMAIL SENT SUCCESSFULLY ✅
   ```

4. **Check Resend Dashboard**
   ```
   Emails → Status: Delivered ✅
   ```

---

**All set! Your Resend API is ready to send emails! 🚀**
