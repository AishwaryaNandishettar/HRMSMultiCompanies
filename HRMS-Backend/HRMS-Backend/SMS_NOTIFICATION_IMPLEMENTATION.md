# SMS Notification Implementation for Recruitment System

## Overview
Added SMS notifications for Padmanabh (9663743316) and Aishwarya (9606408912) that work parallel to existing email notifications without changing any existing logic.

## What Was Added

### 1. SMS Service (`SmsService.java`)
- **Location**: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/service/SmsService.java`
- **Purpose**: Handles SMS notifications for recruitment status changes
- **Features**:
  - Sends SMS to both Padmanabh and Aishwarya automatically
  - Uses same message templates as email but optimized for SMS format
  - Non-blocking: SMS failures won't break recruitment flow
  - Supports both real SMS and simulation modes

### 2. SMS Configuration (`SmsConfig.java`)
- **Location**: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/config/SmsConfig.java`
- **Purpose**: Centralized configuration for SMS settings
- **Settings**:
  - Phone numbers: Padmanabh (9663743316), Aishwarya (9606408912)
  - SMS gateway configuration
  - Feature flags (enable/disable SMS, simulation mode)

### 3. Updated Job Service
- **Location**: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/service/JobService.java`
- **Changes**:
  - Added SMS service integration
  - SMS notifications run parallel to email notifications
  - Same error handling pattern as email (non-critical failures)

### 4. Spring Configuration
- **Location**: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/HmrsBackendApplication.java`
- **Added**: RestTemplate bean for HTTP requests to SMS gateway

## How It Works

### Current Flow (Unchanged)
1. User updates recruitment status in the frontend
2. Frontend calls `/update-status` endpoint
3. Backend updates database
4. Email is sent to candidate (existing functionality)

### New SMS Flow (Added)
1. After email is sent, SMS service is called
2. SMS service creates appropriate message based on status
3. SMS is sent to both Padmanabh and Aishwarya
4. Success/failure is logged (non-critical)

## SMS Message Templates

### Status-Based Messages:
- **Shortlisted**: "🎉 RECRUITMENT UPDATE: {candidate} has been SHORTLISTED for {job}. Contact: {email} - HR Team"
- **Interview Stage**: "📅 RECRUITMENT UPDATE: {candidate} moved to INTERVIEW STAGE for {job}. Contact: {email} - HR Team"
- **Selected**: "🎊 RECRUITMENT UPDATE: {candidate} has been SELECTED for {job}! Contact: {email} - HR Team"
- **Rejected**: "RECRUITMENT UPDATE: {candidate} application for {job} has been rejected. Contact: {email} - HR Team"

## Configuration Options

### Enable/Disable SMS
```java
// In SmsConfig.java
public static final boolean SMS_ENABLED = true; // Set to false to disable all SMS
```

### Simulation Mode (Default: ON)
```java
// In SmsConfig.java  
public static final boolean SMS_SIMULATION_MODE = true; // Logs SMS instead of sending
```

### Change Phone Numbers
```java
// In SmsConfig.java
public static final String PADMANABH_PHONE = "9663743316";
public static final String AISHWARYA_PHONE = "9606408912";
```

## SMS Gateway Options

### Current Implementation: TextBelt (Free Tier)
- **Service**: TextBelt.com
- **Limits**: Limited free messages per day
- **Cost**: Free tier available, paid plans for production

### Alternative SMS Providers (Easy to Replace):
1. **Twilio** - Popular, reliable, good documentation
2. **MSG91** - Indian provider, good for India
3. **Fast2SMS** - Indian SMS service
4. **Amazon SNS** - AWS SMS service
5. **Google Cloud Messaging**

## WhatsApp Integration (Future Enhancement)

The system is prepared for WhatsApp integration:

```java
// Enable WhatsApp in SmsConfig.java
public static final boolean WHATSAPP_ENABLED = true;

// Then implement WhatsApp Business API in SmsService.sendWhatsAppMessage()
```

### Recommended WhatsApp Providers:
1. **Twilio WhatsApp API**
2. **WhatsApp Business API (Official)**
3. **Gupshup**
4. **MessageBird**

## Testing

### Test SMS Notifications:
1. Update any recruitment status in the system
2. Check console logs for SMS simulation messages
3. Look for messages like:
   ```
   📱 [SMS SIMULATION] TO +919663743316: 🎉 RECRUITMENT UPDATE: ...
   📱 [SMS SIMULATION] TO +919606408912: 🎉 RECRUITMENT UPDATE: ...
   ```

### Enable Real SMS Sending:
1. Set `SMS_SIMULATION_MODE = false` in `SmsConfig.java`
2. Restart the application
3. SMS will be sent to actual phone numbers via TextBelt

## Error Handling

- SMS failures are **non-critical** - they won't break recruitment flow
- All SMS errors are logged but don't affect database operations
- Same error handling pattern as existing email notifications
- If SMS gateway is down, system continues working normally

## Benefits

1. **No Impact on Existing System**: Email notifications continue working exactly as before
2. **Real-time HR Notifications**: Padmanabh and Aishwarya get instant SMS updates
3. **Flexible Configuration**: Easy to enable/disable or change phone numbers
4. **Future-Ready**: Prepared for WhatsApp and other messaging platforms
5. **Safe Implementation**: Non-blocking, error-resistant design

## Maintenance

### To Change Phone Numbers:
Update `SmsConfig.java` and restart the application.

### To Switch SMS Provider:
Replace the implementation in `SmsService.sendViaTextBelt()` method.

### To Add More Recipients:
Add phone numbers to `SmsConfig.java` and update the loop in `sendRecruitmentStatusSms()`.

## Next Steps (Optional Enhancements)

1. **Add WhatsApp Integration** for richer messaging
2. **Admin Panel** to manage SMS settings via UI
3. **SMS Templates Management** through database
4. **Delivery Status Tracking** for sent messages
5. **Bulk SMS** for announcement purposes