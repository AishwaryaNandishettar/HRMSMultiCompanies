# Render Deployment Guide for HRMS Backend

## Important: Setting Environment Variables on Render

Since we removed hardcoded secrets from the code for security, you **MUST** set environment variables in your Render dashboard for the application to work.

### Step 1: Access Your Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your HRMS Backend service: **https://finalhrmsapplication.onrender.com**

### Step 2: Add Environment Variables

1. Click on your service
2. Go to **Environment** tab on the left sidebar
3. Click **Add Environment Variable**
4. Add the following variables:

#### Twilio SMS Configuration

**Important:** Replace these placeholder values with your actual Twilio credentials from https://console.twilio.com/

```
TWILIO_ACCOUNT_SID = <your_twilio_account_sid_here>
TWILIO_AUTH_TOKEN = <your_twilio_auth_token_here>
TWILIO_PHONE_NUMBER = <your_twilio_phone_number_here>
TWILIO_VERIFIED_NUMBERS = <comma_separated_verified_numbers>
```

Example format (DO NOT use these exact values - they are examples only):
```
TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN = your32characterauthtokenhere
TWILIO_PHONE_NUMBER = +19103874278
TWILIO_VERIFIED_NUMBERS = +919606408912,+919930145419
```

#### Database Configuration (if needed)

```
MONGODB_URI = <your_mongodb_connection_string>
```

#### JWT Secret (if needed)

```
JWT_SECRET = <your_jwt_secret>
```

#### Email Configuration (if needed)

```
SPRING_MAIL_USERNAME = <your_email>
SPRING_MAIL_PASSWORD = <your_email_app_password>
```

### Step 3: Save and Redeploy

1. Click **Save Changes**
2. Render will automatically redeploy your service
3. Wait for the deployment to complete (check the Logs tab)

### Step 4: Verify Deployment

Once deployment is complete, test your application:

1. Check if the backend is responding: https://finalhrmsapplication.onrender.com/
2. Test SMS functionality (Recruitment module)
3. Test all other features to ensure everything works

## ⚠️ Important Notes

- **Never commit `.env` files** or files with real credentials to GitHub
- The `application.properties` file now uses environment variable placeholders
- All actual credentials are stored securely in Render's environment variables
- This is the recommended approach for production deployments

## Vercel Frontend Configuration

If your frontend is deployed on Vercel and needs to connect to this backend:

1. Go to Vercel Project Settings
2. Go to Environment Variables
3. Add:
   ```
   VITE_API_URL=https://finalhrmsapplication.onrender.com
   ```
   (or whatever environment variable your frontend uses for API URL)

## Need Help?

If you encounter issues:

1. Check Render Logs tab for error messages
2. Verify all environment variables are set correctly
3. Ensure the variable names match exactly (case-sensitive)
4. Make sure there are no extra spaces in the values

## What Changed?

- ✅ Removed hardcoded Twilio secrets from all files
- ✅ Updated `application.properties` to use environment variables
- ✅ Updated all documentation files to reference environment variables
- ✅ All functionality remains the same - just more secure!

**Your application logic has NOT changed** - we only made it more secure by moving secrets to environment variables.
