# Answers to Your Questions

## Q1: Will email work after deployed to Vercel?

### ✅ YES! Your config is already set up correctly!

Your `application.properties` already uses environment variables:

```properties
frontend.url=${FRONTEND_URL:http://localhost:5176}
```

This means:
- **Local:** Uses `http://localhost:5176` (fallback)
- **Production:** Uses environment variable value from deployment platform

---

## Q2: Will it show localhost after deployment?

### ✅ NO! It will show production URL!

**How it works:**

### Local Development:
```
FRONTEND_URL environment variable = NOT SET
frontend.url = http://localhost:5176 (fallback value)

Email sent contains:
http://localhost:5176/onboarding?token=abc123
```

### Production Deployment:
```
FRONTEND_URL environment variable = https://hrms-frontend-production.vercel.app
frontend.url = https://hrms-frontend-production.vercel.app

Email sent contains:
https://hrms-frontend-production.vercel.app/onboarding?token=abc123
```

**The backend automatically uses the correct URL!**

---

## Q3: Will Gmail work in production?

### ⚠️ MAYBE - Gmail might block production servers

**Current config:**
```properties
spring.mail.username=${SPRING_MAIL_USERNAME:aishushettar95@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:bbfskhrhtnujkokk}
```

**Gmail Issues in Production:**
- Gmail may block server IPs (Railway/Render)
- Emails might not send or go to spam
- Not reliable for production use

**✅ Recommended Solution: Use SendGrid**

SendGrid is FREE (100 emails/day) and designed for production:

1. Sign up: https://sendgrid.com/
2. Create API key
3. Set environment variables on backend:
```bash
SPRING_MAIL_HOST=smtp.sendgrid.net
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=apikey
SPRING_MAIL_PASSWORD=YOUR_SENDGRID_API_KEY
```

**No code changes needed!** Just change environment variables.

---

## What You Need to Do for Deployment

### Step 1: Deploy Backend to Railway (NOT Vercel)

**Vercel is for frontend only!** Backend needs Railway/Render.

**Railway:**
1. Go to https://railway.app/
2. Connect GitHub
3. Select `HRMS-Backend` folder
4. Add environment variables:
```bash
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
FRONTEND_URL=https://hrms-frontend-production.vercel.app
MONGODB_URI=mongodb+srv://...
JWT_SECRET=MyFixedSecretKey123456
```
5. Deploy
6. Get backend URL: `https://your-app.up.railway.app`

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Connect GitHub
3. Select `HRMS-Frontend` folder
4. Add environment variable:
```bash
VITE_API_URL=https://your-app.up.railway.app
```
5. Deploy
6. Get frontend URL: `https://hrms-frontend-production.vercel.app`

### Step 3: Update Backend FRONTEND_URL

On Railway, update environment variable:
```bash
FRONTEND_URL=https://hrms-frontend-production.vercel.app
```

Redeploy backend.

---

## Testing

### After deployment, send test email:

```bash
curl -X POST https://your-backend.up.railway.app/api/employee/test-email \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your.email@gmail.com\"}"
```

### Check email:
- Email should arrive (check spam!)
- Link should contain: `https://hrms-frontend-production.vercel.app`
- **NOT** `http://localhost:5176`

---

## Summary

| Question | Answer |
|----------|--------|
| Will email work after Vercel deployment? | ✅ YES - Config is correct |
| Will it show localhost in production? | ❌ NO - Shows production URL |
| Do I need to change code? | ❌ NO - Just set environment variables |
| Will Gmail work in production? | ⚠️ MAYBE - Recommend using SendGrid |
| Where to deploy backend? | Railway or Render (NOT Vercel) |
| Where to deploy frontend? | Vercel ✅ |

---

## Your Config is Perfect!

```properties
# ✅ Already correct - no changes needed!
frontend.url=${FRONTEND_URL:http://localhost:5176}
spring.mail.username=${SPRING_MAIL_USERNAME:aishushettar95@gmail.com}
spring.mail.password=${SPRING_MAIL_PASSWORD:bbfskhrhtnujkokk}
```

Just deploy and set environment variables!

---

## Quick Reference

**Backend Environment Variables (Railway):**
```bash
FRONTEND_URL=https://hrms-frontend-production.vercel.app
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
MONGODB_URI=mongodb+srv://...
JWT_SECRET=MyFixedSecretKey123456
```

**Frontend Environment Variables (Vercel):**
```bash
VITE_API_URL=https://your-backend.up.railway.app
```

**That's it! No code changes needed.** 🎉
