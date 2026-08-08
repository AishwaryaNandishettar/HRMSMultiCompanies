# 🚀 Render Deployment Checklist

## Step 1: Add Environment Variables to Render

1. Go to https://dashboard.render.com
2. Select your **HRMS Backend** service
3. Click on **Environment** tab (left sidebar)
4. Click **Add Environment Variable** button

---

## Step 2: Copy-Paste These Variables

### ✅ Copy all of these and add them one by one:

```bash
RESEND_ENABLED=true
```

```bash
RESEND_API_KEY=re_E8tppa8S_7WTNWajr9LZdb74GStPt6GF
```

```bash
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
```

```bash
RESEND_FROM_NAME=HRMS System
```

```bash
MONGODB_URI=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
```

```bash
JWT_SECRET=MyFixedSecretKey123456
```

```bash
JWT_EXPIRATION=86400
```

```bash
FRONTEND_URL=https://omoi-hrms.vercel.app
```

---

## Step 3: Remove Old SendGrid Variables (if they exist)

If you have these old variables, **DELETE THEM**:
- ❌ `SENDGRID_ENABLED`
- ❌ `SENDGRID_API_KEY`
- ❌ `SENDGRID_FROM_EMAIL`
- ❌ `SENDGRID_FROM_NAME`

To delete:
1. Click the **⋮** (three dots) next to the variable
2. Click **Delete**
3. Confirm deletion

---

## Step 4: Save Changes

1. After adding all variables, click **Save Changes** button
2. Render will automatically redeploy your backend
3. Wait 2-3 minutes for deployment to complete

---

## Step 5: Verify Deployment

### Check 1: Deployment Status
- Go to **Logs** tab
- Look for: `Started HmrsBackendApplication` (success message)

### Check 2: Email Configuration
In the logs, search for:
```
📧 EMAIL PROVIDER: RESEND
```

If you see `📧 EMAIL PROVIDER: SMTP` instead, something is wrong!

### Check 3: Send Test Email
From your frontend:
1. Go to **Invite Employee** page
2. Enter a test email
3. Click **Send Invite**

### Check 4: Verify in Resend Dashboard
1. Go to: https://resend.com/emails
2. You should see your sent email in the list
3. Status should be: **Delivered** ✅

---

## 🎯 Quick Verification Commands

### Test Email Locally (before deploying):
```bash
node test-resend-email.js
```

### Check if Render Variables are Set:
1. Go to Render Dashboard
2. Click on your service
3. Go to Environment tab
4. Verify all RESEND_* variables exist

---

## 🐛 Common Issues & Solutions

### Issue 1: Email not sending
**Solution:**
- Check if `RESEND_ENABLED=true` in Render
- Verify `RESEND_API_KEY` is correct
- Check Render logs for errors

### Issue 2: 401 Unauthorized Error
**Solution:**
- Double-check your API key in Render
- Make sure there are no extra spaces
- API Key should be: `re_E8tppa8S_7WTNWajr9LZdb74GStPt6GF`

### Issue 3: Backend showing SMTP instead of Resend
**Solution:**
- Make sure `RESEND_ENABLED=true` (not `false`)
- Redeploy after adding variables
- Check logs after deployment

### Issue 4: "RESEND_API_KEY not found"
**Solution:**
- Add the variable in Render environment
- Make sure you clicked "Save Changes"
- Wait for automatic redeployment

---

## ✅ Final Checklist

Before going live, verify:

- [ ] All environment variables added to Render
- [ ] Old SendGrid variables removed
- [ ] Changes saved in Render
- [ ] Backend redeployed successfully
- [ ] Logs show: `📧 EMAIL PROVIDER: RESEND`
- [ ] Test email sent successfully
- [ ] Email visible in Resend dashboard
- [ ] Frontend can send invites

---

## 📊 Expected Render Environment Variables

After setup, your Render environment should have:

| Variable | Value | Status |
|----------|-------|--------|
| `RESEND_ENABLED` | true | ✅ Must have |
| `RESEND_API_KEY` | re_E8tppa8S... | ✅ Must have |
| `RESEND_FROM_EMAIL` | aishushettar95@gmail.com | ✅ Must have |
| `RESEND_FROM_NAME` | HRMS System | ✅ Must have |
| `MONGODB_URI` | mongodb+srv://... | ✅ Must have |
| `JWT_SECRET` | MyFixedSecretKey123456 | ✅ Must have |
| `JWT_EXPIRATION` | 86400 | ✅ Must have |
| `FRONTEND_URL` | https://omoi-hrms... | ✅ Must have |
| `SENDGRID_*` | (any) | ❌ Must delete |

---

## 🎉 You're Done!

Once you see this in your Render logs:
```
================================
📧 EMAIL PROVIDER: RESEND
📧 TO: user@example.com
================================
✅ RESEND EMAIL SENT SUCCESSFULLY TO: user@example.com
```

**Your migration is complete and working! 🎊**

---

## 📞 Need Help?

- Check Resend dashboard: https://resend.com/emails
- Check Render logs: https://dashboard.render.com
- Review migration doc: `SENDGRID_TO_RESEND_MIGRATION_COMPLETE.md`
