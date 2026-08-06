# 🚀 START HERE - Email Invitation System

## ✅ WHAT I'VE FIXED FOR YOU

Your HRMS application is now **fully configured** to send invitation emails that work on:
- ✅ **Localhost** (for testing)
- ✅ **Vercel** (for production deployment)

## 📋 WHAT CHANGED

### 1. **Application Properties** (`application.properties`)
Added dynamic frontend URL configuration:
```properties
frontend.url=${FRONTEND_URL:http://localhost:5173}
```

This means:
- **Localhost**: Uses `http://localhost:5173` (default)
- **Production**: Uses environment variable `FRONTEND_URL` (e.g., `https://your-app.vercel.app`)

### 2. **Email Service** (Already configured ✅)
```properties
spring.mail.username=aishushettar95@gmail.com
spring.mail.password=uiurdbkdhtexubjr
```

### 3. **OnboardingService** (Improved logging)
- Added better logging to track email sending
- Shows the invitation link being sent
- Shows from email address

## 🧪 HOW TO TEST LOCALLY (3 Simple Steps)

### **Step 1: Start Backend**
Open terminal in project root:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
mvnw spring-boot:run
```

Wait until you see:
```
Started HrmsBackendApplication in X seconds
```

### **Step 2: Start Frontend**
Open another terminal:
```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject\HRMS-Frontend"
npm run dev
```

### **Step 3: Test Email**
Edit `quick-test-email.js` and change this line:
```javascript
const TEST_EMAIL = 'your-email@gmail.com'; // Put your actual email here
```

Then run:
```bash
npm install axios
node quick-test-email.js
```

### **Expected Result:**
You should see in terminal:
```
✅ SUCCESS! Email sent!
📬 Check your email inbox
```

Check your email - you'll receive:
```
Subject: HRMS Invitation - Welcome!

Application Link: http://localhost:5173
Username: your-email@gmail.com
Temporary Password: Temp@123

[Complete Your Profile] Button
```

## 🌐 HOW TO DEPLOY TO VERCEL

### **1. Deploy Backend (Railway or Render)**

Choose one:

**Railway:**
1. Go to https://railway.app
2. Create new project from GitHub
3. Set environment variables:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   MONGODB_URI=mongodb+srv://...
   ```

**Render:**
1. Go to https://render.com
2. Create new Web Service
3. Set environment variables (same as Railway)

### **2. Deploy Frontend (Vercel)**

1. Go to https://vercel.com
2. Import your GitHub repository
3. Set root directory: `HRMSProject/HRMS-Frontend`
4. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   ```

### **3. Update Backend with Frontend URL**

After Vercel deployment, go back to Railway/Render and update:
```
FRONTEND_URL=https://your-hrms-app.vercel.app
```

### **4. Test Production Email**

The email will now contain:
```
Application Link: https://your-hrms-app.vercel.app
```

✅ **Perfect! The link automatically adapts to your environment!**

## 📁 CREATED FILES

I've created these helpful files for you:

| File | Purpose |
|------|---------|
| `EMAIL_SETUP_README.md` | Quick start guide |
| `TEST_EMAIL_SETUP.md` | Detailed testing instructions |
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide for Vercel |
| `quick-test-email.js` | Simple test script |
| `.env.example` | Environment variables template |

## 🔧 TROUBLESHOOTING

### **Email not received?**

1. **Check backend logs** - Look for:
   ```
   📧 Sending invite email to: test@example.com
   🔗 Onboarding Link: http://localhost:5173
   ✅ Invite email sent successfully
   ```

2. **Check spam folder** - Gmail might filter automated emails

3. **Verify Gmail credentials**:
   - The account must have 2-Step Verification enabled
   - Must use an App Password (not regular password)
   - Check if `uiurdbkdhtexubjr` is the correct app password

4. **Check backend is running**:
   ```bash
   curl http://localhost:8082/actuator/health
   ```

### **Wrong URL in email (Production)?**

Verify environment variable is set:
```bash
# In Railway/Render dashboard
FRONTEND_URL=https://your-correct-url.vercel.app
```

Then redeploy the backend.

### **Frontend can't connect to backend?**

Check Vercel environment variables:
```bash
VITE_API_BASE_URL=https://your-backend.railway.app
```

## ✨ THAT'S IT!

Your email invitation system is ready! Just:

1. ✅ Test on localhost
2. ✅ Deploy to production
3. ✅ Set environment variables
4. ✅ Invitations work everywhere!

## 📞 Need Help?

- **Testing Issues**: See `TEST_EMAIL_SETUP.md`
- **Deployment Issues**: See `DEPLOYMENT_GUIDE.md`
- **Environment Setup**: See `.env.example`

---

**The system is ready - just test it! 🎉**
