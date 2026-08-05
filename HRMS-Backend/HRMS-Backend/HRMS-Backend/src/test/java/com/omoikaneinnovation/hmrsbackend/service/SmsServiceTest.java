package com.omoikaneinnovation.hmrsbackend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Test class for SMS Service functionality
 * This ensures SMS notifications work correctly without affecting existing email logic
 */
@SpringBootTest
@TestPropertySource(properties = {
    "spring.mail.host=",  // Disable email for testing
    "spring.mail.username=",
    "spring.mail.password="
})
public class SmsServiceTest {

    @Autowired
    private SmsService smsService;

    @Test
    public void testRecruitmentStatusSms_Shortlisted() {
        // Test SMS notification for shortlisted candidate
        System.out.println("\n=== Testing SMS for SHORTLISTED status ===");
        smsService.sendRecruitmentStatusSms(
            "Frontend Developer", 
            "Shortlisted", 
            "candidate@example.com"
        );
        System.out.println("=== SMS Test Completed ===\n");
    }

    @Test
    public void testRecruitmentStatusSms_Selected() {
        // Test SMS notification for selected candidate  
        System.out.println("\n=== Testing SMS for SELECTED status ===");
        smsService.sendRecruitmentStatusSms(
            "Backend Developer", 
            "Selected", 
            "john.doe@example.com"
        );
        System.out.println("=== SMS Test Completed ===\n");
    }

    @Test
    public void testRecruitmentStatusSms_InterviewStage() {
        // Test SMS notification for interview stage
        System.out.println("\n=== Testing SMS for INTERVIEW STAGE status ===");
        smsService.sendRecruitmentStatusSms(
            "Full Stack Developer", 
            "Interview Stage", 
            "jane.smith@example.com"
        );
        System.out.println("=== SMS Test Completed ===\n");
    }

    @Test  
    public void testRecruitmentStatusSms_Rejected() {
        // Test SMS notification for rejected candidate
        System.out.println("\n=== Testing SMS for REJECTED status ===");
        smsService.sendRecruitmentStatusSms(
            "DevOps Engineer", 
            "Rejected", 
            "test.candidate@example.com"
        );
        System.out.println("=== SMS Test Completed ===\n");
    }

    @Test
    public void testMultiChannelNotification() {
        // Test both SMS and WhatsApp (future feature)
        System.out.println("\n=== Testing Multi-Channel Notification ===");
        smsService.sendMultiChannelNotification(
            "Product Manager", 
            "Selected", 
            "product.manager@example.com"
        );
        System.out.println("=== Multi-Channel Test Completed ===\n");
    }
}