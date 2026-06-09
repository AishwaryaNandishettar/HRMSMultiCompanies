package com.omoikaneinnovation.hmrsbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import java.util.Arrays;
import java.util.List;

/**
 * Twilio SMS Configuration
 * Automatically reads values from application.properties
 */
@Configuration
public class TwilioConfig {
    
 @Value("${twilio.account.sid}")
public String accountSid;

@Value("${twilio.auth.token}")
public String authToken;
    
 @Value("${twilio.phone.number}")
    public String phoneNumber;
    
    @Value("${twilio.enabled:true}")
    public boolean enabled;
    
   @Value("${twilio.verified.numbers}")
    private String verifiedNumbersString;
    
    // Getters for easy access
    public String getAccountSid() { return accountSid; }
    public String getAuthToken() { return authToken; }
    public String getPhoneNumber() { return phoneNumber; }
    public boolean isEnabled() { return enabled; }
    
    /**
     * Get list of verified numbers for trial account
     */
    public List<String> getVerifiedNumbers() {
        return Arrays.asList(verifiedNumbersString.split(","));
    }
    
    /**
     * Check if a phone number is verified for trial account
     */
    public boolean isVerifiedNumber(String phoneNumber) {
        List<String> verified = getVerifiedNumbers();
        
        // Clean the input number
        String cleanNumber = phoneNumber.replaceAll("[^0-9]", "");
        
        // Check against all verified numbers
        for (String verifiedNum : verified) {
            String cleanVerified = verifiedNum.replaceAll("[^0-9]", "");
            if (cleanNumber.equals(cleanVerified) || 
                cleanNumber.endsWith(cleanVerified) || 
                cleanVerified.endsWith(cleanNumber)) {
                return true;
            }
        }
        
        return false;
    }
}