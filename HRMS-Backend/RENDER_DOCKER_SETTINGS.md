# Render Docker Settings for HRMS Backend

## Correct Settings in "Verify Settings" Dialog

When you change Root Directory to `.`, Render will ask you to verify Docker settings.

### Fill in these values:

1. **Root Directory**: 
   ```
   .
   ```

2. **Dockerfile Path**: 
   ```
   ./Dockerfile
   ```
   ❌ NOT: `./$ /Dockerfile`
   ✅ YES: `./Dockerfile`

3. **Docker Build Context Directory**: 
   ```
   ./
   ```

4. **Docker Command**: 
   ```
   (leave empty or just remove the ./)
   ```

### After Updating
1. Click **"Update Fields"** button
2. Then click **"Save Changes"**
3. Go to **Events** tab
4. Click **"Manual Deploy"**

## Environment Variables to Verify

Make sure these are set in Render Environment:
- `MONGODB_URI`
- `JWT_SECRET`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `TWILIO_ACCOUNT_SID` (if using SMS)
- `TWILIO_AUTH_TOKEN` (if using SMS)
- `PORT` (Render sets this automatically)

## Expected Build Process
1. Render will use Maven to compile your Spring Boot app
2. It will create a JAR file: `hmrs-backend-0.0.1-SNAPSHOT.jar`
3. Then run it with Java 21

## Verify Deployment
Once deployed, check:
- https://your-app.onrender.com/actuator/health
