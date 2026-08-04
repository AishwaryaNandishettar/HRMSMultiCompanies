# SMS Notification Feature - How It Works

## Overview
When HR/Admin updates a candidate's status in the Recruitment Pipeline, the system automatically sends:
1. ✅ **Email** to the candidate (with professional template)
2. ✅ **SMS** to the candidate's mobile phone (as normal text message)
3. ✅ **SMS** to HR team (Padmanabh/Aishwarya) for internal notification

## How SMS Appears on Mobile Phone

### Example SMS Messages (As seen on candidate's phone):

#### 1. Shortlisted Status
```
Congratulations [Name]! You have been SHORTLISTED for [Job Title]. Our team will contact you shortly with interview details. - HR Team
```

#### 2. Interview Stage
```
Good news [Name]! You are selected for INTERVIEW STAGE for [Job Title]. Please check your email for interview schedule. - HR Team
```

#### 3. Selected
```
Congratulations [Name]! You have been SELECTED for [Job Title]! Our HR team will contact you shortly with offer details. Welcome aboard! - HR Team
```

#### 4. Rejected
```
Dear [Name], Thank you for your interest in [Job Title]. We have decided not to proceed at this time. Best wishes for future opportunities. - HR Team
```

## Technical Setup

### Current Configuration

#### 1. Twilio (Primary SMS Service)
- **Status**: ✅ ENABLED
- **Account SID**: ${TWILIO_ACCOUNT_SID} (from environment)
- **Phone Number**: ${TWILIO_PHONE_NUMBER} (from environment)
- **Works**: Sends SMS to any Indian mobile number

#### 2. Fast2SMS (Fallback Service)
- **Status**: ✅ ENABLED
- **API Key**: Configured
- **Used when**: Twilio fails (auto-fallback)

#### 3. SMS Configuration
```java
SMS_ENABLED = true
SMS_SIMULATION_MODE = false  // Real SMS sending enabled
```

## How It Works (Flow)

1. **HR Updates Status** in recruitment pipeline modal
   - Selects new status (Shortlisted, Interview Stage, Selected, Rejected)
   - Enters candidate email
   - Enters candidate phone (optional field)
   - Adds comments/remarks

2. **Backend Processing** (`JobService.java`)
   ```java
   // Sends email (existing)
   emailService.sendCandidateStatusEmail(...)
   
   // Sends SMS to candidate's phone (new)
   smsService.sendCandidateStatusSms(
       candidatePhone,      // e.g., "9876543210"
       candidateName,       // e.g., "Rakesh Kumar"
       jobTitle,           // e.g., "Software Engineer"
       newStatus           // e.g., "Selected"
   )
   
   // Sends SMS to HR team
   smsService.sendRecruitmentStatusSms(...)
   ```

3. **SMS Delivery** (`SmsService.java`)
   - First tries Twilio (reliable, works internationally)
   - If Twilio fails, tries Fast2SMS (Indian SMS service)
   - SMS appears as **normal text message** on candidate's phone

4. **Candidate Receives**
   - 📧 Professional email in their inbox
   - 📱 Normal SMS text message on their phone
   - Just like receiving any regular text message from a company

## Message Format (Mobile-Friendly)

### Design Principles:
- ✅ Short and concise (SMS character limit)
- ✅ Professional tone
- ✅ Clear action items
- ✅ Signed as "HR Team"
- ✅ No special formatting (works on all phones)
- ✅ English language
- ✅ No emojis in SMS (unlike in-app notifications)

### Character Count:
- Shortlisted: ~145 characters ✅
- Interview Stage: ~135 characters ✅
- Selected: ~155 characters ✅
- Rejected: ~145 characters ✅

All messages are within standard SMS limits (160 characters for single SMS).

## Phone Number Format

### Accepted Formats:
```
9876543210          ✅ 10-digit Indian number
+919876543210       ✅ With country code
919876543210        ✅ With country code (no +)
+91-9876543210      ✅ With dashes
(91) 9876543210     ✅ With parentheses
```

### Auto-Cleaning Logic:
The system automatically:
- Removes non-numeric characters (-, +, spaces, parentheses)
- Removes country code if present
- Validates it starts with 6, 7, 8, or 9
- Ensures it's exactly 10 digits
- Adds +91 prefix for Twilio

Example:
```
Input:  "+91-987-654-3210"
Cleaned: "9876543210"
Sent as: "+919876543210"
```

## Testing

### Test SMS Sending:
1. Open recruitment pipeline
2. Select a candidate
3. Click "Update Status"
4. Enter:
   - Status: "Shortlisted"
   - Email: candidate@example.com
   - Phone: 9876543210 (your test number)
   - Comments: "Test SMS"
5. Click "Send Email & SMS"

### Expected Result:
- ✅ Email arrives in inbox
- ✅ SMS arrives as normal text message
- ✅ Backend logs show "✅ SMS sent to candidate..."

### Check Logs:
```
📱 === SMS SERVICE CALLED ===
📱💬 SMS Message created: 'Congratulations...'
📱🚀 Calling sendSmsMessage...
FROM : +18658306022
TO   : +919876543210
TEXT : Congratulations Rakesh! You have been...
SMS SID: SM1234567890abcdef
✅ SMS sent to candidate Rakesh (9876543210) for status: Shortlisted
```

## Troubleshooting

### SMS Not Received?

#### Check 1: Is SMS Enabled?
```java
// In SmsConfig.java
SMS_ENABLED = true  // Should be true
SMS_SIMULATION_MODE = false  // Should be false for real sending
```

#### Check 2: Is Phone Number Valid?
- Must be 10 digits
- Must start with 6, 7, 8, or 9
- Must be Indian mobile number

#### Check 3: Check Twilio Balance
- Login to console.twilio.com
- Check account balance
- Check SMS logs

#### Check 4: Check Backend Logs
```
📱 === SMS SERVICE CALLED ===
Twilio Enabled = true
Account SID: [FROM ENVIRONMENT]
```

### Common Issues:

#### Issue: "SMS_ENABLED = false"
**Solution**: Set `SMS_ENABLED = true` in `SmsConfig.java`

#### Issue: "SMS_SIMULATION_MODE = true"
**Solution**: Set `SMS_SIMULATION_MODE = false` for real sending

#### Issue: "Invalid phone number format"
**Solution**: Enter 10-digit number starting with 6-9

#### Issue: Twilio error "Invalid 'To' phone number"
**Solution**: Check phone number format and country code

## Cost

### Twilio Pricing:
- SMS to India: ~$0.0098 per SMS (~₹0.80)
- Very affordable for recruitment notifications

### Fast2SMS Pricing:
- Bulk SMS plans starting from ₹200
- Pay-as-you-go option available

## Current Status

✅ **Twilio SMS**: Fully configured and working
✅ **Fast2SMS**: Configured as fallback
✅ **Phone Input**: Available in Update Status modal
✅ **SMS Messages**: Professional and mobile-friendly
✅ **Auto-Cleaning**: Phone numbers auto-formatted
✅ **Dual Notification**: Email + SMS sent together

## Verification

To verify SMS is working:

1. **Check Configuration**:
   ```
   twilio.enabled=true  ✅
   SMS_ENABLED=true     ✅
   SMS_SIMULATION_MODE=false  ✅
   ```

2. **Check Code**:
   - `JobService.java` line 157: calls `sendCandidateStatusSms()` ✅
   - `SmsService.java`: implements Twilio sending ✅
   - `UpdateStatusModal.jsx`: has phone input field ✅

3. **Test Send**:
   - Use your own number for testing
   - Check if message arrives as normal SMS

## Example Screenshot Flow

1. **HR Updates Status**:
   - [Screenshot showing modal with phone field]

2. **Candidate Receives SMS**:
   ```
   [9876543210]
   Congratulations Rakesh! You have been 
   SHORTLISTED for Software Engineer. Our 
   team will contact you shortly with 
   interview details. - HR Team
   
   [Received 11:23 AM]
   ```

3. **Just like normal SMS from company**:
   - Appears in phone's Messages app
   - Can reply (though system won't respond)
   - Looks professional and legitimate

## Summary

Your SMS feature is **already fully implemented** and configured to send normal text messages to candidates' phones via Twilio. The messages are:
- ✅ Professional and concise
- ✅ Appear as normal SMS
- ✅ Sent automatically when status is updated
- ✅ Formatted for mobile readability

No code changes needed - the feature is ready to use!
