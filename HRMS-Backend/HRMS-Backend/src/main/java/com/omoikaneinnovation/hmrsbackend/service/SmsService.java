package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.config.SmsConfig;
import com.omoikaneinnovation.hmrsbackend.config.TwilioConfig;
import com.omoikaneinnovation.hmrsbackend.config.MsgConfig91;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import java.util.HashMap;
import java.util.Map;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
@Service
public class SmsService {


   @Autowired
private MsgConfig91 msg91Config;
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private TwilioConfig twilioConfig;

@PostConstruct
public void checkTwilioConfig() {
    System.out.println("========== TWILIO CONFIG ==========");
    System.out.println("Enabled: " + twilioConfig.isEnabled());
    System.out.println("SID: " + twilioConfig.getAccountSid());
    System.out.println("From Number: " + twilioConfig.getPhoneNumber());
    System.out.println("===================================");

     // MSG91 CONFIG
    System.out.println("========== MSG91 CONFIG ==========");
    System.out.println("MSG91 ENABLED = " + msg91Config.isEnabled());
    System.out.println("MSG91 AUTH KEY = " + msg91Config.getAuthKey());
    System.out.println("MSG91 SENDER ID = " + msg91Config.getSenderId());
    System.out.println("==================================");
}

private void sendViaMsg91(String phoneNumber, String message) {

    String url = "https://control.msg91.com/api/v5/flow/";

    HttpHeaders headers = new HttpHeaders();
    headers.set("authkey", msg91Config.getAuthKey());
    headers.setContentType(MediaType.APPLICATION_JSON);

    Map<String, Object> body = new HashMap<>();
    body.put("sender", msg91Config.getSenderId());
    body.put("mobiles", "91" + phoneNumber);
    body.put("message", message);

    HttpEntity<Map<String, Object>> request =
            new HttpEntity<>(body, headers);

    String response = restTemplate.postForObject(
            url,
            request,
            String.class
    );

    System.out.println("MSG91 RESPONSE = " + response);
}
    /**
     * ✅ NEW: Send SMS notification to CANDIDATE about their recruitment status change
     * This works parallel to email - same recipient (candidate), SMS format
     */
    public void sendCandidateStatusSms(String candidatePhone, String candidateName, String jobTitle, String status) {
        System.out.println("📱 === SMS SERVICE CALLED ===");
        System.out.println("SMS_ENABLED: " + SmsConfig.SMS_ENABLED);
        System.out.println("SMS_SIMULATION_MODE: " + SmsConfig.SMS_SIMULATION_MODE);
        System.out.println("candidatePhone: '" + candidatePhone + "'");
        System.out.println("candidateName: '" + candidateName + "'");
        System.out.println("jobTitle: '" + jobTitle + "'");
        System.out.println("status: '" + status + "'");
        
        if (!SmsConfig.SMS_ENABLED || candidatePhone == null || candidatePhone.trim().isEmpty()) {
            System.out.println("📱❌ Candidate SMS not sent: SMS disabled or no phone number");
            System.out.println("SMS_ENABLED: " + SmsConfig.SMS_ENABLED);
            System.out.println("Phone null check: " + (candidatePhone == null));
            System.out.println("Phone empty check: " + (candidatePhone != null ? candidatePhone.trim().isEmpty() : "phone is null"));
            return;
        }
        
        String message = createCandidateSmsMessage(candidateName, jobTitle, status);
        System.out.println("📱💬 SMS Message created: '" + message + "'");
        
        try {
            System.out.println("📱🚀 Calling sendSmsMessage...");
            sendSmsMessage(candidatePhone, message);
            System.out.println("✅ SMS sent to candidate " + candidateName + " (" + candidatePhone + ") for status: " + status);
            
        } catch (Exception e) {
            System.err.println("⚠️ Candidate SMS sending failed (non-critical): " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("📱 === SMS SERVICE COMPLETED ===");
    }

    /**
     * Create candidate-focused SMS message (different from HR notification messages)
     */
    private String createCandidateSmsMessage(String candidateName, String jobTitle, String status) {
        String name = candidateName != null ? candidateName : "Candidate";
        
        switch (status) {
            case "Shortlisted":
                return "Congratulations " + name + "! You have been SHORTLISTED for " + jobTitle + 
                       ". Our team will contact you shortly with interview details. - HR Team";
                       
            case "Interview Stage":
                return "Good news " + name + "! You are selected for INTERVIEW STAGE for " + jobTitle + 
                       ". Please check your email for interview schedule. - HR Team";
                       
            case "Selected":
                return "Congratulations " + name + "! You have been SELECTED for " + jobTitle + 
                       "! Our HR team will contact you shortly with offer details. Welcome aboard! - HR Team";
                       
            case "Rejected":
                return "Dear " + name + ", Thank you for your interest in " + jobTitle + 
                       ". We have decided not to proceed at this time. Best wishes for future opportunities. - HR Team";
                       
            default:
                return "Hi " + name + ", Your application status for " + jobTitle + 
                       " has been updated to: " + status + ". Please check your email for details. - HR Team";
        }
    }
    /**
     * EXISTING: Send SMS notification to Padmanabh and Aishwarya (HR team) about recruitment status changes
     * This is for HR internal notifications
     */
    public void sendRecruitmentStatusSms(String jobTitle, String status, String candidateEmail) {
        if (!SmsConfig.SMS_ENABLED) {
            System.out.println("📱 SMS notifications are disabled");
            return;
        }
        
        String message = createSmsMessage(jobTitle, status, candidateEmail);
        
        try {
            // Send to Padmanabh
            sendSmsMessage(SmsConfig.PADMANABH_PHONE, message);
            System.out.println("✅ SMS sent to Padmanabh (" + SmsConfig.PADMANABH_PHONE + ") for status: " + status);
            
            // Send to Aishwarya  
            sendSmsMessage(SmsConfig.AISHWARYA_PHONE, message);
            System.out.println("✅ SMS sent to Aishwarya (" + SmsConfig.AISHWARYA_PHONE + ") for status: " + status);
            
        } catch (Exception e) {
            // Log but don't fail the whole request if SMS fails (same pattern as email)
            System.err.println("⚠️ SMS sending failed (non-critical): " + e.getMessage());
        }
    }

    /**
     * Create SMS message content based on recruitment status
     * Uses similar templates as email but shorter for SMS format
     */
    private String createSmsMessage(String jobTitle, String status, String candidateEmail) {
        String candidateName = candidateEmail != null ? candidateEmail.split("@")[0] : "Candidate";
        
        switch (status) {
            case "Shortlisted":
                return "🎉 RECRUITMENT UPDATE: " + candidateName + " has been SHORTLISTED for " + jobTitle + 
                       ". Contact: " + candidateEmail + " - HR Team";
                       
            case "Interview Stage":
                return "📅 RECRUITMENT UPDATE: " + candidateName + " moved to INTERVIEW STAGE for " + jobTitle + 
                       ". Contact: " + candidateEmail + " - HR Team";
                       
            case "Selected":
                return "🎊 RECRUITMENT UPDATE: " + candidateName + " has been SELECTED for " + jobTitle + 
                       "! Contact: " + candidateEmail + " - HR Team";
                       
            case "Rejected":
                return "RECRUITMENT UPDATE: " + candidateName + " application for " + jobTitle + 
                       " has been rejected. Contact: " + candidateEmail + " - HR Team";
                       
            default:
                return "RECRUITMENT UPDATE: " + candidateName + " status for " + jobTitle + 
                       " changed to: " + status + ". Contact: " + candidateEmail + " - HR Team";
        }
    }

    /**
     * Send SMS using Twilio with trial account verification
     */
    private void sendSmsMessage(String phoneNumber, String message) {
        System.out.println("📱 === SMS MESSAGE REQUEST ===");
        System.out.println("TWILIO ENABLED = " + twilioConfig.isEnabled());
        System.out.println("TWILIO_ONLY_MODE = " + SmsConfig.TWILIO_ONLY_MODE);
        System.out.println("SMS_SIMULATION_MODE = " + SmsConfig.SMS_SIMULATION_MODE);
        
        try {
            if (SmsConfig.SMS_SIMULATION_MODE) {
                // For development/testing - just log the message
                System.out.println("📱 [SMS SIMULATION] TO +" + SmsConfig.COUNTRY_CODE.replace("+", "") + phoneNumber + ": " + message);
                return;
            }
            
            // ✅ SAFETY CHECK: In testing mode, only send to test phone number
            if (SmsConfig.SMS_TESTING_MODE) {
                System.out.println("⚠️ SMS TESTING MODE: Only sending to test number");
                System.out.println("Original recipient: " + phoneNumber);
                System.out.println("Redirecting to test number: " + SmsConfig.TEST_PHONE_NUMBER);
                phoneNumber = SmsConfig.TEST_PHONE_NUMBER; // Replace with test number
            }
            
            // ✅ TWILIO ONLY MODE with trial account verification
            if (SmsConfig.TWILIO_ONLY_MODE && twilioConfig.isEnabled()) {
                System.out.println("🚀 Using Twilio (TRIAL ACCOUNT - VERIFIED NUMBERS ONLY)...");
                
                // Check if the number is verified
                if (!twilioConfig.isVerifiedNumber(phoneNumber)) {
                    System.out.println("⚠️ WARNING: Phone number " + phoneNumber + " is not verified in Twilio trial account");
                    System.out.println("Verified numbers: " + twilioConfig.getVerifiedNumbers());
                    
                    // Option 1: Send to a verified number instead (for testing)
                    System.out.println("🔄 Redirecting SMS to first verified number for testing purposes");
                    phoneNumber = twilioConfig.getVerifiedNumbers().get(0).replaceAll("[^0-9]", "");
                    
                    // Option 2: Skip sending (uncomment this if you prefer)
                    // System.out.println("❌ Skipping SMS - number not verified");
                    // return;
                }
                
                System.out.println("=================================");
                System.out.println("Twilio Account SID: " + twilioConfig.getAccountSid());
                System.out.println("Twilio From Number: " + twilioConfig.getPhoneNumber());
                System.out.println("Sending to: " + phoneNumber);
                System.out.println("Message: " + message);
                System.out.println("=================================");

                sendViaTwilio(phoneNumber, message);
                System.out.println("✅ Twilio SMS sent successfully!");
                return;
            }
            
            // Fallback to MSG91 if Twilio is disabled
            if (msg91Config.isEnabled()) {
                System.out.println("🚀 Using MSG91 as fallback...");
                sendViaMsg91(phoneNumber, message);
                System.out.println("✅ MSG91 SMS sent successfully!");
                return;
            }
            
            // Final fallback - just log
            System.out.println("📱 [FALLBACK LOG] SMS TO " + phoneNumber + ": " + message);
            
        } catch (Exception e) {
            System.err.println("❌ SMS sending failed: " + e.getMessage());
            e.printStackTrace();
            
            // In Twilio-only mode, don't try fallbacks
            if (SmsConfig.TWILIO_ONLY_MODE) {
                System.out.println("⚠️ Twilio SMS failed, but TWILIO_ONLY_MODE is enabled - no fallback attempted");
                return;
            }
            
            // Fallback - Log the message (old behavior for non-Twilio mode)
            System.out.println("📱 [FALLBACK LOG] SMS TO " + phoneNumber + ": " + message);
        }
    }

    /**
     * ✅ SIMPLE TEST: Just test Twilio directly without any fallbacks
     */
    public void testTwilioDirectly(String phoneNumber, String message) {
        System.out.println("🧪 TESTING TWILIO DIRECTLY");
        System.out.println("Phone: " + phoneNumber);
        System.out.println("Message: " + message);
        System.out.println("Twilio Enabled: " + twilioConfig.isEnabled());
        System.out.println("Account SID: " + twilioConfig.getAccountSid());
        System.out.println("Auth Token exists: " + (twilioConfig.getAuthToken() != null));
        System.out.println("Phone Number: " + twilioConfig.getPhoneNumber());
        
        try {
            // Initialize Twilio
            Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
            System.out.println("✅ Twilio initialized successfully");
            
            // Clean phone number
            String digits = phoneNumber.replaceAll("[^0-9]", "");
            if (digits.startsWith("91") && digits.length() == 12) {
                digits = digits.substring(2);
            }
            String to = "+91" + digits;
            
            System.out.println("Sending from: " + twilioConfig.getPhoneNumber());
            System.out.println("Sending to: " + to);
            System.out.println("Message: " + message);
            
            // Send SMS
            Message twilioMessage = Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(twilioConfig.getPhoneNumber()),
                message
            ).create();
            
            System.out.println("✅ SUCCESS! SMS SID: " + twilioMessage.getSid());
            System.out.println("✅ Status: " + twilioMessage.getStatus());
            
        } catch (Exception e) {
            System.err.println("❌ TWILIO DIRECT TEST FAILED:");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    private void sendViaTwilio(String phoneNumber, String messageText) {
        System.out.println("📱 === TWILIO SMS SENDING ===");
        
        try {
            // Initialize Twilio
            Twilio.init(twilioConfig.getAccountSid(), twilioConfig.getAuthToken());
            System.out.println("✅ Twilio initialized successfully");

            // Clean phone number
            String digits = phoneNumber.replaceAll("[^0-9]", "");

            System.out.println("Original phone: '" + phoneNumber + "'");
            System.out.println("Digits only: '" + digits + "'");

            // Remove country code if present
            if (digits.startsWith("91") && digits.length() == 12) {
                digits = digits.substring(2);
            }

            // Validate Indian number
            if (!digits.matches("^[6-9]\\d{9}$")) {
                throw new RuntimeException("Invalid Indian mobile number: " + digits);
            }

            String to = "+91" + digits;

            System.out.println("Final Twilio Number: " + to);
            System.out.println("================================");
            System.out.println("FROM : " + twilioConfig.getPhoneNumber());
            System.out.println("TO   : " + to);
            System.out.println("TEXT : " + messageText);
            System.out.println("================================");

            // Send SMS
            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(twilioConfig.getPhoneNumber()),
                    messageText
            ).create();

            System.out.println("✅ SUCCESS! SMS SID: " + message.getSid());
            System.out.println("✅ Status: " + message.getStatus());

        } catch (Exception ex) {
            System.err.println("❌ TWILIO ERROR");
            System.err.println("Message: " + ex.getMessage());
            ex.printStackTrace();
            throw ex;
        }
    }
    /**
     * Send SMS via Fast2SMS API (Updated for candidate SMS)
     */
    private void sendViaFast2SMS(String phoneNumber, String message) {
        try {
            System.out.println("📞 Fast2SMS - Input phone: '" + phoneNumber + "'");
            
            // ✅ IMPROVED: Clean phone number more carefully
            String cleanPhone = phoneNumber.replaceAll("[^0-9]", ""); // Remove non-digits
            System.out.println("📞 Fast2SMS - After cleaning: '" + cleanPhone + "' (length: " + cleanPhone.length() + ")");
            
            // Handle different phone number formats
            if (cleanPhone.startsWith("91") && cleanPhone.length() > 10) {
                cleanPhone = cleanPhone.substring(2); // Remove country code
                System.out.println("📞 Fast2SMS - Removed country code: '" + cleanPhone + "'");
            }
            
            // If still too long, take the first 10 digits (not last)
            if (cleanPhone.length() > 10) {
                System.out.println("⚠️ Phone number too long (" + cleanPhone.length() + " digits): " + cleanPhone);
                
                // DON'T truncate - try to find valid 10-digit pattern starting with 6-9
                String validPhone = null;
                for (int i = 0; i <= cleanPhone.length() - 10; i++) {
                    String candidate = cleanPhone.substring(i, i + 10);
                    if (candidate.matches("^[6-9]\\d{9}$")) {
                        validPhone = candidate;
                        System.out.println("✅ Found valid 10-digit pattern at position " + i + ": " + validPhone);
                        break;
                    }
                }
                
                if (validPhone != null) {
                    cleanPhone = validPhone;
                } else {
                    // Fallback: take first 10 digits
                    cleanPhone = cleanPhone.substring(0, 10);
                    System.out.println("⚠️ No valid pattern found, using first 10 digits: " + cleanPhone);
                }
            }
            
            // Ensure it's exactly 10 digits and starts with valid Indian mobile prefix
            if (cleanPhone.length() == 10 && (cleanPhone.startsWith("9") || cleanPhone.startsWith("8") || cleanPhone.startsWith("7") || cleanPhone.startsWith("6"))) {
                // Valid Indian mobile number
                System.out.println("🚀 Attempting to send SMS via Fast2SMS...");
                System.out.println("Original Phone: " + phoneNumber);
                System.out.println("Cleaned Phone: " + cleanPhone);
                System.out.println("Message: " + message);
                System.out.println("API Key: " + (SmsConfig.SMS_API_KEY != null ? SmsConfig.SMS_API_KEY.substring(0, 10) + "..." : "NULL"));
                
                // Try the simple route first (better for transactional messages)
                boolean success = trySimpleRoute(cleanPhone, message);
                
                if (!success) {
                    // Fallback to OTP route
                    System.out.println("Trying OTP route as fallback...");
                    tryOTPRoute(cleanPhone, message);
                }
            } else {
                System.err.println("❌ Invalid phone number format: " + cleanPhone + " (length: " + cleanPhone.length() + ")");
                throw new RuntimeException("Invalid phone number format: " + cleanPhone);
            }
            
        } catch (Exception e) {
            System.err.println("❌ Fast2SMS API call failed: " + e.getMessage());
            e.printStackTrace();
            // For demo/development - just log the SMS instead of failing
            System.out.println("📱 [SMS FALLBACK] TO " + phoneNumber + ": " + message);
            throw e; // Re-throw to trigger fallback in calling method
        }
    }
    
    /**
     * Try Fast2SMS simple route (for transactional messages)
     */
    private boolean trySimpleRoute(String cleanPhone, String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("authorization", SmsConfig.SMS_API_KEY);
            
            // Simple route parameters
            String formData;
            try {
                formData = "message=" + java.net.URLEncoder.encode(message, "UTF-8") + 
                                "&language=english" + 
                                "&route=p" + 
                                "&numbers=" + cleanPhone;
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("UTF-8 encoding not supported", e);
            }
            
            HttpEntity<String> request = new HttpEntity<>(formData, headers);
            
            System.out.println("Trying Simple Route...");
            System.out.println("URL: " + SmsConfig.SMS_GATEWAY_URL);
            System.out.println("Form Data: " + formData);
            
            String response = restTemplate.exchange(
                SmsConfig.SMS_GATEWAY_URL,
                HttpMethod.POST,
                request,
                String.class
            ).getBody();

            System.out.println("✅ Fast2SMS Simple Route Response: " + response);
            
            // Check if response indicates success
            if (response != null && (response.contains("\"return\":true") || response.contains("successfully"))) {
                System.out.println("🎉 SMS sent successfully via Simple Route!");
                return true;
            }
            
            return false;
            
        } catch (Exception e) {
            System.err.println("Simple route failed: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Try Fast2SMS OTP route (fallback)
     */
    private boolean tryOTPRoute(String cleanPhone, String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("authorization", SmsConfig.SMS_API_KEY);
            
            // OTP route parameters  
            String formData;
            try {
                formData = "variables_values=" + java.net.URLEncoder.encode(message, "UTF-8") + 
                                "&route=otp" + 
                                "&numbers=" + cleanPhone;
            } catch (java.io.UnsupportedEncodingException e) {
                throw new RuntimeException("UTF-8 encoding not supported", e);
            }
            
            HttpEntity<String> request = new HttpEntity<>(formData, headers);
            
            System.out.println("Trying OTP Route...");
            System.out.println("Form Data: " + formData);
            
            String response = restTemplate.exchange(
                SmsConfig.SMS_GATEWAY_URL,
                HttpMethod.POST,
                request,
                String.class
            ).getBody();

            System.out.println("✅ Fast2SMS OTP Route Response: " + response);
            
            // Check if response indicates success
            if (response != null && (response.contains("\"return\":true") || response.contains("successfully"))) {
                System.out.println("🎉 SMS sent successfully via OTP Route!");
                return true;
            }
            
            return false;
            
        } catch (Exception e) {
            System.err.println("OTP route failed: " + e.getMessage());
            return false;
        }
    }

    /**
     * Alternative method to send WhatsApp messages (if WhatsApp Business API is preferred)
     * This is a placeholder - implement based on your WhatsApp API provider
     */
    public void sendWhatsAppMessage(String phoneNumber, String message) {
        // Placeholder for WhatsApp integration
        System.out.println("💬 [WHATSAPP SIMULATION] TO +" + phoneNumber + ": " + message);
        
        // TODO: Implement actual WhatsApp Business API integration
        // Popular options:
        // 1. Twilio WhatsApp API
        // 2. WhatsApp Business API directly  
        // 3. Third-party services like Gupshup, MessageBird, etc.
    }

    /**
     * Send both SMS and WhatsApp notification
     */
    public void sendMultiChannelNotification(String jobTitle, String status, String candidateEmail) {
        String message = createSmsMessage(jobTitle, status, candidateEmail);
        
        // Send SMS to both contacts
        sendSmsMessage(SmsConfig.PADMANABH_PHONE, message);
        sendSmsMessage(SmsConfig.AISHWARYA_PHONE, message);
        
        // Also send WhatsApp (if implemented and enabled)
        if (SmsConfig.WHATSAPP_ENABLED) {
            sendWhatsAppMessage(SmsConfig.PADMANABH_PHONE, message);
            sendWhatsAppMessage(SmsConfig.AISHWARYA_PHONE, message);
        }
    }
}