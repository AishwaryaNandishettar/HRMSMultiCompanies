# 🔍 SMS Debug Guide

## Current Status
- ✅ Backend compiles and starts
- ❌ Twilio SMS fails with stack trace
- ❌ Shows "SMS sent successfully" but actual SMS not delivered

## 🧪 Debug Steps

### Step 1: Check Twilio Credentials
Run this to verify Twilio config:
```
GET http://localhost:8082/api/jobs/twilio-status
```

### Step 2: Test with Simple Number
Try updating a candidate status and look for these logs:
```
🔄 Initializing Twilio with credentials...
✅ Twilio initialized successfully
📞 Final TO number: +919606408912
📞 Final FROM number: +19103874278
```

### Step 3: Check for Specific Errors
Look for these error patterns in logs:
- `❌ PHONE LENGTH ERROR`
- `❌ PHONE FORMAT ERROR` 
- `❌ TWILIO SPECIFIC ERROR`
- `❌ Twilio Account SID is null`

## 🔧 Common Issues & Solutions

### Issue 1: Phone Number Format
**Problem**: Indian numbers not validating correctly
**Solution**: Check if number has correct format (10 digits, starts with 6-9)

### Issue 2: Twilio Account Limits
**Problem**: Trial account restrictions
**Solution**: Check Twilio console for account status

### Issue 3: Missing Configuration
**Problem**: Twilio credentials not loaded
**Solution**: Verify application.properties has correct values

### Issue 4: Network/Firewall Issues  
**Problem**: Can't connect to Twilio API
**Solution**: Check internet connection and firewall

## 📱 Current Phone Numbers to Test
- Aishwarya: `9606408912` ✅ (should work - you received SMS before)
- Padmanabh: `935327825` 
- Mahesh: `8197977894`
- Nikita: `9930145419`

## 🎯 Expected Working Flow
```
📱 === SEND SMS MESSAGE DEBUG ===
🚀 Attempting Twilio SMS...
🔄 Initializing Twilio with credentials...
✅ Twilio initialized successfully
📞 Final TO number: +919606408912
📞 Final FROM number: +19103874278
✅ SUCCESS: Twilio SMS sent successfully!
📋 Message SID: SMxxxxxxxxx
```

## ❌ Current Error Pattern
```
📱 [TWILIO FAILED] SMS not sent to 9606408912
[Long Java stack trace]
✅ HR notification SMS sent successfully! (WRONG!)
```

The issue is likely in the Twilio call itself - we need to see the actual Twilio error message to understand why it's failing.