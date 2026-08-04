# 🧪 SMS Notification Testing Guide

## 🎯 Quick Test Checklist

Use this guide to test your SMS notification system step by step.

---

## ✅ Pre-Test Checklist

Before testing, verify these configurations:

### **1. Backend Configuration**
```bash
# Check application.properties
Location: HRMS-Backend/src/main/resources/application.properties

Required Settings:
✅ twilio.enabled=true
✅ twilio.account.sid=${TWILIO_ACCOUNT_SID}
✅ twilio.auth.token=${TWILIO_AUTH_TOKEN}
✅ twilio.phone.number=${TWILIO_PHONE_NUMBER}
✅ sms.simulation.mode=false
```

### **2. SmsConfig.java**
```java
Location: HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/config/SmsConfig.java

Required Settings:
✅ SMS_ENABLED = true
✅ SMS_SIMULATION_MODE = false
✅ TWILIO_ENABLED = true

HR Contacts:
✅ PADMANABH_PHONE = "9663743316"
✅ AISHWARYA_PHONE = "9606408912"
```

### **3. Twilio Account**
```
Login: https://console.twilio.com/

Check:
✅ Account is active
✅ Phone number (+18658306022) is purchased
✅ Account has credits ($)
✅ India (+91) is enabled for SMS
```

---

## 🚀 Test Method 1: Via Frontend (Full Integration Test)

### **Step 1: Start Backend**
```bash
cd HRMS-Backend
mvn clean install
mvn spring-boot:run
```

**Expected Output:**
```
========== TWILIO CONFIG ==========
Enabled: true
SID: [FROM ENVIRONMENT]
From Number: [FROM ENVIRONMENT]
===================================

Started HmrsBackendApplication in 12.345 seconds
```

### **Step 2: Start Frontend**
```bash
cd HRMS-Frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### **Step 3: Navigate to Pipeline**
1. Open browser: `http://localhost:5173`
2. Login (if needed)
3. Click: **Recruitment** (left sidebar)
4. Click: **Received Applications** card (or any stage)

### **Step 4: Update Status**
1. Find a candidate in the table
2. Click the **⋯** (three dots) menu
3. Click: **✏️ Update Status**

### **Step 5: Fill Modal**
```
Status: [Select] Shortlisted
Email: test@example.com (or candidate's real email)
Phone: 9876543210 (or your test phone number)
Comments: Test SMS notification
```

### **Step 6: Submit**
Click: **📧📱 Send Email & SMS**

### **Step 7: Verify Success**
**Frontend:**
```
✅ Alert shown: "Status updated successfully! Email sent to test@example.com"
✅ Modal closes
✅ Table updates with new status
```

**Backend Console:**
```
📥 Received update-status request: {candidateId=..., candidatePhone=9876543210...}
✅ Parsed data:
   - Candidate Phone: 9876543210
   - New Status: Shortlisted
📱 === SMS SERVICE CALLED ===
SMS_ENABLED: true
candidatePhone: '9876543210'
📱💬 SMS Message created: 'Congratulations Test User! You have been SHORTLISTED...'
📱🚀 Calling sendSmsMessage...
=================================
Twilio Enabled: true
Account SID: [FROM ENVIRONMENT]
From Number: [FROM ENVIRONMENT]
To Number: 9876543210
=================================
FROM : +18658306022
TO   : +919876543210
TEXT : Congratulations Test User! You have been SHORTLISTED for Frontend Developer...
================================
SMS SID: SM1234567890abcdef1234567890abcdef
✅ SMS sent to candidate Test User (9876543210) for status: Shortlisted
📱 === SMS SERVICE COMPLETED ===
```

**Phone:**
```
📱 SMS received on 9876543210:
"Congratulations Test User! You have been SHORTLISTED for Frontend Developer. 
Our team will contact you shortly with interview details. - HR Team"
```

**HR Phone:**
```
📱 SMS received on 9663743316 (Padmanabh) or 9606408912 (Aishwarya):
"🎉 RECRUITMENT UPDATE: Test User has been SHORTLISTED for Frontend Developer. 
Contact: test@example.com - HR Team"
```

---

## 🧪 Test Method 2: Direct API Test

### **Test 1: Update Status with SMS**
```bash
curl -X POST http://localhost:8082/api/jobs/update-status \
  -H "Content-Type: application/json" \
  -d '{
    "candidateId": "YOUR_CANDIDATE_ID",
    "candidateName": "Test User",
    "candidateEmail": "test@example.com",
    "candidatePhone": "9876543210",
    "newStatus": "Shortlisted",
    "comments": "Test comment for SMS"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Status updated successfully! 📧 Email sent to test@example.com | 📱 SMS notification sent to 9876543210",
  "candidate": {
    "_id": "...",
    "jobTitle": "Frontend Developer",
    "status": "Shortlisted",
    "email": "test@example.com",
    "phone": "9876543210",
    "comments": "Test comment for SMS"
  }
}
```

### **Test 2: Direct SMS Test**
```bash
curl -X POST http://localhost:8082/api/jobs/test-sms \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "9876543210",
    "message": "This is a test SMS from HRMS system"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Test SMS sent to 9876543210 via Twilio/Fast2SMS"
}
```

### **Test 3: Get HR Contacts**
```bash
curl http://localhost:8082/api/jobs/hr-contacts
```

**Expected Response:**
```json
{
  "contacts": [
    {
      "name": "Padmanabh",
      "phone": "9663743316",
      "role": "HR Manager"
    },
    {
      "name": "Aishwarya",
      "phone": "9606408912",
      "role": "HR Executive"
    }
  ],
  "message": "SMS notifications are sent to these HR contacts for all recruitment updates"
}
```

---

## 🔍 Test Scenarios

### **Scenario 1: Successful SMS Delivery**
```
✅ Phone number: 9876543210
✅ Status: Shortlisted
✅ Expected: SMS delivered to candidate + HR team
✅ Backend log: "SMS SID: SM..."
✅ Phone receives SMS within 5-30 seconds
```

### **Scenario 2: Invalid Phone Number**
```
❌ Phone number: 1234567890
❌ Status: Shortlisted
⚠️ Expected: Status updated, but SMS fails
⚠️ Backend log: "Invalid Indian mobile number"
⚠️ Frontend still shows success (non-blocking)
```

### **Scenario 3: Missing Phone Number**
```
⚠️ Phone number: (empty)
✅ Status: Shortlisted
✅ Expected: Status updated, email sent, no SMS
✅ Backend log: "SMS not sent - Phone number is null"
✅ Frontend shows: "Email sent (no phone provided)"
```

### **Scenario 4: Different Status Templates**
```
Test each status to verify SMS templates:

1. Shortlisted → "Congratulations! You have been SHORTLISTED..."
2. Interview Stage → "Good news! You are selected for INTERVIEW..."
3. Selected → "Congratulations! You have been SELECTED..."
4. Rejected → "Thank you for your interest..."
```

### **Scenario 5: Phone Number Formats**
```
Test various phone number inputs:

✅ "9876543210" → Cleaned to "9876543210"
✅ "+919876543210" → Cleaned to "9876543210"
✅ "91-9876543210" → Cleaned to "9876543210"
✅ "09876543210" → Cleaned to "9876543210"
✅ "+91 9876 54321" → Cleaned to "9876543210"
✅ "  9876543210  " → Cleaned to "9876543210"
```

---

## 🛠️ Troubleshooting

### **Problem 1: SMS not received on phone**

**Check:**
```bash
# 1. Backend logs
Look for: "SMS SID: SM..." (means Twilio accepted it)
If missing: Check Twilio credentials

# 2. Twilio Console
Login: https://console.twilio.com/monitor/logs/sms
Check: SMS delivery status
- Delivered ✅
- Failed ❌ (check reason)
- Queued ⏳ (wait)

# 3. Phone number format
Must be: 10 digits, starts with 9/8/7/6
Invalid: "1234567890", "5876543210"

# 4. Twilio account
- Check balance (needs credits)
- Check India (+91) is enabled
- Check phone number (+18658306022) is active
```

### **Problem 2: Backend error "TWILIO ERROR"**

**Fix:**
```java
// Check application.properties
twilio.enabled=true  (must be true)
twilio.account.sid=ACd65c... (check SID is correct)
twilio.auth.token=9bf3fae... (check token is correct)
twilio.phone.number=+18658306022 (check number is correct)

// Restart backend after changes
mvn spring-boot:run
```

### **Problem 3: SMS shows as simulation**

**Fix:**
```java
// Check SmsConfig.java
SMS_ENABLED = true;  (not false)
SMS_SIMULATION_MODE = false;  (not true)

// Check application.properties
sms.simulation.mode=false  (not true)
```

### **Problem 4: HR team not receiving SMS**

**Check:**
```javascript
// Frontend: PipelineTable.jsx
console.log("ASSIGNED TO:", assignedTo);

// Should show:
// "padmanabh" → SMS to 9663743316
// "aishwarya" → SMS to 9606408912
// "mahesh" → SMS to 9876543210

// If wrong, check email mapping logic
```

### **Problem 5: Phone number validation fails**

**Debug:**
```java
// Backend console shows detailed logs
System.out.println("📞 Fast2SMS - Input phone: '" + phoneNumber + "'");
System.out.println("📞 After cleaning: '" + cleanPhone + "'");
System.out.println("📞 Length: " + cleanPhone.length());

// Valid: 10 digits, starts with 9/8/7/6
// Invalid: Any other format
```

---

## 📊 Test Results Template

Use this template to document your tests:

```
========================================
SMS NOTIFICATION SYSTEM TEST RESULTS
========================================

Date: _______________
Tester: _______________

CONFIGURATION CHECK:
✅/❌ Backend running
✅/❌ Frontend running
✅/❌ Twilio enabled
✅/❌ SMS enabled
✅/❌ Simulation mode OFF

TEST 1: Full Integration (Frontend)
Candidate Phone: _______________
Status: _______________
✅/❌ Modal submitted successfully
✅/❌ Backend logs show SMS sending
✅/❌ Candidate received SMS
✅/❌ HR team received SMS
✅/❌ Email sent
✅/❌ Database updated

TEST 2: Direct API
Phone: _______________
✅/❌ API call successful
✅/❌ SMS received
Response time: _______

TEST 3: Invalid Phone
Phone: 1234567890
✅/❌ System handled gracefully
✅/❌ Error logged (not crashed)

TEST 4: All Status Templates
✅/❌ Shortlisted SMS correct
✅/❌ Interview SMS correct
✅/❌ Selected SMS correct
✅/❌ Rejected SMS correct

TEST 5: Phone Number Formats
✅/❌ "+919876543210" cleaned correctly
✅/❌ "91-9876543210" cleaned correctly
✅/❌ "  9876543210  " cleaned correctly

ISSUES FOUND:
1. _________________________________
2. _________________________________
3. _________________________________

NOTES:
_____________________________________
_____________________________________
_____________________________________

Overall Status: ✅ PASSED / ❌ FAILED
========================================
```

---

## 🎯 Success Criteria

Your SMS system is working correctly if:

✅ **Candidate SMS:**
- Receives SMS within 30 seconds
- Message matches status template
- Contains candidate name
- Shows job title
- Ends with "- HR Team"

✅ **HR Team SMS:**
- Correct HR contact receives SMS
- Message shows candidate name
- Shows email and status
- Contains emoji indicators

✅ **Email:**
- Sent successfully
- Template matches status
- Professional formatting

✅ **Database:**
- Status updated
- Comments saved
- Phone saved (cleaned)
- Email saved

✅ **Frontend:**
- Success message shown
- Table refreshes
- No console errors

✅ **Backend:**
- Logs show Twilio success
- SMS SID returned
- No exceptions

---

## 📱 Real Phone Number Test

### **Important:**
- Use **YOUR OWN PHONE NUMBER** for testing
- Don't spam test numbers
- Twilio charges per SMS (few cents)
- Test with 1-2 SMS first

### **Recommended Test Numbers:**
```
Your phone: +91 YOUR_NUMBER (for candidate SMS)
Padmanabh: 9663743316 (for HR SMS)
Aishwarya: 9606408912 (for HR SMS)
```

---

## ✅ Final Verification

Before marking as complete, verify:

```bash
# 1. Backend health check
curl http://localhost:8082/api/jobs/all
# Should return list of jobs

# 2. Frontend loads
Open: http://localhost:5173/recruitment/pipeline
# Should show candidate table

# 3. SMS test
curl -X POST http://localhost:8082/api/jobs/test-sms \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "YOUR_NUMBER", "message": "Test"}'
# Should receive SMS on your phone

# 4. Full flow test
Navigate to pipeline → Update status → Check phone
# Should receive SMS
```

---

## 🎉 Test Complete!

If all tests pass:
✅ Your SMS notification system is **PRODUCTION READY**
✅ All features are working
✅ Multi-provider fallback works
✅ Phone validation works
✅ Email + SMS parallel delivery works

**You can now deploy and use the system!** 🚀

---

## 📞 Support

If you encounter issues:
1. Check **backend console logs** (most detailed)
2. Check **Twilio console** (delivery status)
3. Verify **phone number format** (10 digits)
4. Check **Twilio account balance** (needs credits)
5. Review this testing guide again

**Happy Testing!** 🧪✨
