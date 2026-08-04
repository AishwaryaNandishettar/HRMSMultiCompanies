package com.omoikaneinnovation.hmrsbackend;

import com.omoikaneinnovation.hmrsbackend.config.TwilioConfig;
import com.omoikaneinnovation.hmrsbackend.service.SmsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Test class to verify Twilio SMS functionality
 * This will send a test SMS to your phone: 9606408912
 */
@SpringBootTest
public class TwilioSmsTest {

    @Autowired
    private SmsService smsService;

    @Autowired
    private TwilioConfig twilioConfig;

    @Test
    public void testTwilioConfiguration() {
        System.out.println("========== TWILIO CONFIG TEST ==========");
        System.out.println("Enabled: " + twilioConfig.isEnabled());
        System.out.println("Account SID: " + twilioConfig.getAccountSid());
        System.out.println("Auth Token: " + (twilioConfig.getAuthToken() != null ? "SET" : "NULL"));
        System.out.println("From Number: " + twilioConfig.getPhoneNumber());
        System.out.println("=======================================");

        // Verify configuration is complete
        assert twilioConfig.isEnabled();
        assert twilioConfig.getAccountSid() != null;
        assert twilioConfig.getAuthToken() != null;
        assert twilioConfig.getPhoneNumber() != null;
    }

    @Test
    public void testSendSmsToYourPhone() {
        System.out.println("========== SMS TEST ==========");
        System.out.println("Testing SMS to: 9606408912");
        
        try {
            // Test candidate SMS (this will go to your phone due to testing mode)
            smsService.sendCandidateStatusSms(
                "9606408912",
                "Test User",
                "Software Engineer",
                "Selected"
            );
            
            System.out.println("✅ SMS test completed! Check your phone.");
            
        } catch (Exception e) {
            System.err.println("❌ SMS test failed: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=============================");
    }

    @Test
    public void testSmsWithDifferentStatuses() {
        System.out.println("========== TESTING DIFFERENT STATUS MESSAGES ==========");
        
        String[] statuses = {"Shortlisted", "Interview Stage", "Selected", "Rejected"};
        
        for (String status : statuses) {
            System.out.println("Testing status: " + status);
            try {
                smsService.sendCandidateStatusSms(
                    "9606408912",  // Your phone
                    "Aishwarya",   // Your name
                    "HRMS Developer",
                    status
                );
                
                // Wait 2 seconds between messages
                Thread.sleep(2000);
                
            } catch (Exception e) {
                System.err.println("Failed to send SMS for status: " + status);
                e.printStackTrace();
            }
        }
        
        System.out.println("✅ All status tests completed! Check your phone for messages.");
    }
}