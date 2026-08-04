# Render Deployment — Environment Variables Setup

This guide walks through setting up all environment variables on Render for the HRMS
Spring Boot backend. No logic changes needed — just set these in your Render service's
**Environment** tab.

All variables have fallback defaults so local development works without any .env file.

---

## Step 1 — Create a Web Service on Render

1. Go to https://dashboard.render.com
2. Click **New → Web Service**
3. Connect your GitHub/GitLab repo
4. Set **Root Directory**: `HRMSProject/HRMS-Backend`
5. Set **Build Command**: `./mvnw clean package -DskipTests`
6. Set **Start Command**: `java -jar target/*.jar`
7. Choose your instance type (Free or Starter)

---

## Step 2 — Add Environment Variables

Go to your Render service → **Environment → Environment Variables** and add each key.

### MongoDB

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0` |

### Gmail SMTP (OTP & Onboarding Emails)

| Key | Value |
|-----|-------|
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` |
| `SPRING_MAIL_PASSWORD` | `bbfskhrhtnujkokk` |

> This is a Gmail App Password. Keep it secret — do not commit it to git.

### JWT

| Key | Value |
|-----|-------|
| `JWT_SECRET` | `MyFixedSecretKey123456` (or any long random string for production) |

### URLs

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://hrms-frontend-production.vercel.app` |
| `BACKEND_URL` | Your Render URL e.g. `https://hrms-backend.onrender.com` |
| `MEETING_EMAIL_FROM_ADDRESS` | `aishwarya.n@omoikaneinnovations.com` |
| `MEETING_EMAIL_REPLY_TO` | `noreply@omoikaneinnovations.com` |
| `MEETING_EMAIL_BASE_URL` | `https://hrms-frontend-production.vercel.app` |

### Twilio SMS

| Key | Value |
|-----|-------|
| `TWILIO_ACCOUNT_SID` | Your Twilio Account SID from console.twilio.com |
| `TWILIO_AUTH_TOKEN` | Your Twilio Auth Token from console.twilio.com |
| `TWILIO_API_KEY` | Your Twilio API Key |
| `TWILIO_PHONE_NUMBER` | `+19103874278` |
| `TWILIO_VERIFIED_NUMBERS` | `+919606408912,+919930145419` |

### LiveKit (only if using video meetings in production)

| Key | Value |
|-----|-------|
| `LIVEKIT_URL` | `wss://your-livekit-server` |
| `LIVEKIT_API_KEY` | Your LiveKit API key |
| `LIVEKIT_API_SECRET` | Your LiveKit API secret |

### TextLocal SMS (optional)

| Key | Value |
|-----|-------|
| `TEXTLOCAL_API_KEY` | Your TextLocal API key |
| `TEXTLOCAL_USERNAME` | Your TextLocal username |

### MSG91 SMS (optional)

| Key | Value |
|-----|-------|
| `MSG91_API_KEY` | Your MSG91 API key |
| `MSG91_AUTH_KEY` | `523182AORxp3aywDyl6a23a208P1` |

---

## Step 3 — CORS

If your Vercel frontend URL is different from the defaults, add it to this line in
`application.properties`:

```
app.cors.allowedOrigins=http://localhost:5173,https://omoi-hrms.vercel.app,https://hrms-frontend-production.vercel.app
```

---

## Step 4 — Deploy

After setting all env variables, click **Manual Deploy** or push a commit.
Check the **Logs** tab if startup fails.

---

## Local Development

No `.env` file needed locally. All variables fall back to the working defaults
already set in `application.properties`, so everything runs as before.
