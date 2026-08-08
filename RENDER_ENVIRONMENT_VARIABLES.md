# Render Environment Variables Configuration

## 🔧 Required Environment Variables for Render Deployment

Add these environment variables in your Render dashboard:

### **Email Configuration (Resend)**
```
RESEND_ENABLED=true
RESEND_API_KEY=re_E8tppa8S_7WTNWajr9LZdb74GStPt6GF
RESEND_FROM_EMAIL=noreply@omoikaneinnovations.com
RESEND_FROM_NAME=HRMS System
```

### **Database Configuration**
```
MONGODB_URI=mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
```

### **JWT Configuration**
```
JWT_SECRET=MyFixedSecretKey123456
JWT_EXPIRATION=86400
```

### **Frontend URL**
```
FRONTEND_URL=https://omoi-hrms.vercel.app
```

### **Payment (Razorpay)**
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### **Twilio (If using)**
```
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_API_KEY=your_twilio_api_key
TWILIO_API_SECRET=your_twilio_api_secret
```

---

## 📝 How to Add Environment Variables in Render

1. Go to your Render dashboard
2. Select your HRMS backend service
3. Click on **Environment** tab
4. Click **Add Environment Variable**
5. Copy and paste each variable from above
6. Click **Save Changes**

---

## ✅ Migration from SendGrid to Resend - Complete!

### What was changed:
- ✅ Removed SendGrid dependency from `pom.xml`
- ✅ Deleted `SendGridEmailService.java`
- ✅ Created new `ResendEmailService.java`
- ✅ Updated `EmailService.java` to use Resend
- ✅ Updated `application.properties` with Resend configuration
- ✅ Updated `.env` file with Resend API key
- ✅ Updated `.env.example` for future reference

### No logic changes were made:
- All email sending logic remains the same
- Only the email provider was swapped from SendGrid to Resend
- Same HTML templates are used
- Same async/queue system is used
- Same fallback to SMTP if needed

---

## 🚀 Next Steps

1. **Deploy to Render** with new environment variables
2. **Test email functionality** after deployment
3. **Verify** that invite emails are working

---

## 📧 Resend API Details

- **Dashboard**: https://resend.com/emails
- **API Key Name**: HRMS
- **API Key**: `re_E8tppa8S_7WTNWajr9LZdb74GStPt6GF`
- **Permission**: Full access
- **Status**: Active ✅

---

## ⚠️ Important Notes

- Make sure to add the Resend API key to Render environment variables
- Do NOT commit `.env` file to git (it's in .gitignore)
- Resend has better deliverability than SendGrid for transactional emails
- Free tier: 100 emails/day, 3,000 emails/month
