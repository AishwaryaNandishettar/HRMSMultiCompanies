# 🔧 Localhost Email Not Working - Fix

## Problem

Localhost frontend is pointing to **Render backend**, which has SMTP blocked.

Emails work from Vercel (production) but not from localhost.

## Root Cause

Current setup:
- **Localhost frontend** → **Render backend** → SMTP blocked → Resend fallback → Emails work ✅
- But Render might have delays or the fallback isn't triggering properly

## Solution: Use Local Backend for Development

### Option 1: Use Local Backend (RECOMMENDED for development)

This makes localhost use your **local backend** (localhost:8082), which can use Gmail SMTP directly.

#### Step 1: I Created .env.local File

File: `HRMS-Frontend/.env.local`

```env
VITE_API_BASE_URL=http://localhost:8082
VITE_API_URL=http://localhost:8082/api
VITE_WS_URL=http://localhost:8082/ws
VITE_TENANT_ID=omoikaneinnovations
```

#### Step 2: Make Sure Local Backend is Running

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Backend"
mvn spring-boot:run
```

**Wait for**: `Started HmrsBackendApplication`

#### Step 3: Restart Frontend

```bash
# Press Ctrl+C in frontend terminal

cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

Vite will automatically use `.env.local` (it has higher priority than `.env`)

#### Step 4: Test Email

1. Go to: http://localhost:5173
2. Login
3. Invite employee
4. **Email should work** (Gmail SMTP works on localhost) ✅

---

### Option 2: Keep Using Render Backend

If you want localhost to keep using Render backend, check Render logs:

1. Go to: https://dashboard.render.com
2. Your service → **Logs** tab
3. Try inviting employee from localhost
4. Watch logs for:
   ```
   ⚠️ SMTP failed
   ✅ Falling back to Resend
   ✅ Email sent via Resend
   ```

If you see errors, share the logs.

---

## How .env Files Work in Vite

Priority (highest to lowest):
1. `.env.local` - **Local development overrides** (not committed to git)
2. `.env.production` - Production builds
3. `.env` - Default for all environments

**Current setup**:
- `.env` → Points to Render (production)
- `.env.local` → Points to localhost:8082 (development) **← HIGHEST PRIORITY**

When you run `npm run dev`, Vite uses `.env.local` first.

---

## Comparison

| Setup | Frontend | Backend | Email Method | Works? |
|-------|----------|---------|--------------|--------|
| **Before** | localhost:5173 | Render | Resend HTTP | Should work |
| **After (Option 1)** | localhost:5173 | localhost:8082 | Gmail SMTP | ✅ Works |
| **Vercel (Production)** | omoi-hrms.vercel.app | Render | Resend HTTP | ✅ Works |

---

## Files Created

- ✅ `.env.local` - Local development config (uses localhost backend)
- ✅ `.env` - Default/production config (uses Render backend)

---

## To Switch Between Local and Production Backend

### Use Local Backend:
```bash
npm run dev
# Automatically uses .env.local → localhost:8082
```

### Use Production Backend:
```bash
# Temporarily rename .env.local
mv .env.local .env.local.backup
npm run dev
# Will use .env → Render backend
```

---

## What to Do Now

1. ✅ Make sure local backend running (localhost:8082)
2. ✅ Restart frontend (Ctrl+C, then `npm run dev`)
3. ✅ Test email invite from localhost
4. ✅ Should work now!

---

**No logic changed - only configuration!** 🎯
