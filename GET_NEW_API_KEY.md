# 🔑 Get New Resend API Key

## ⚠️ Current Issue

API key is showing as invalid: `re_E8tppa8S_7WTNWajr9LZdb74GStPt6GF`

This happens when:
- Key was deleted
- Key was regenerated
- Key is not active

---

## 🔧 Get New API Key (2 Minutes)

### Step 1: Go to Resend API Keys
URL: https://resend.com/api-keys

### Step 2: Check Existing Keys

Look for your "HRMS" key:
- ✅ If it shows "Active" - copy the key
- ❌ If it's missing or inactive - create new one

### Step 3: Create New Key (If Needed)

1. Click **"+ Create API Key"** button
2. **Name**: HRMS
3. **Permission**: Full access
4. **Domain**: All domains
5. Click **"Add"**
6. **COPY THE KEY IMMEDIATELY** (you can only see it once!)

### Step 4: Update Your Files

Once you have the new key, update these files:

#### File 1: `.env`
```env
RESEND_API_KEY=your_new_key_here
```

#### File 2: `test-resend-email.js`
```javascript
const RESEND_API_KEY = 'your_new_key_here';
```

#### File 3: Render Environment Variables
```
RESEND_API_KEY=your_new_key_here
```

---

## 🧪 Test Again

After updating the key:

```bash
cd "d:\New folder\HRMSProject (2)\HRMSProject"
node test-resend-email.js
```

---

## ✅ Expected Result

```
🧪 Testing Resend Email API...

✅ SUCCESS! Email sent successfully

📧 Email ID: xxx-xxx-xxx
📬 Check your inbox: aishushettar95@gmail.com
```

---

## 📝 Files to Update

1. `.env` - Local development
2. `test-resend-email.js` - Testing
3. Render environment variables - Production

---

## 🔍 Alternative: Check If Key Still Works

Go to your Resend dashboard and check:
1. Go to: https://resend.com/api-keys
2. Look for "HRMS" key
3. Check status (Active/Inactive)
4. If inactive, create new one

---

## 🚀 Quick Fix

1. Get new API key from Resend
2. Update `.env` file
3. Update `test-resend-email.js`
4. Run test again
5. Update Render when deploying

---

## 💡 Note

The key format is correct (`re_...`), it's just not valid in Resend's system anymore.

This is a simple fix - just get a new key from Resend dashboard!
