package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.service.SmsService;
import com.omoikaneinnovation.hmrsbackend.config.TwilioConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * SMS Testing Controller
 * Use this to test SMS functionality with your Twilio trial account
 */
@RestController
@RequestMapping("/api/test/sms")
@CrossOrigin(origins = "*")
public class SmsTestController {

    @Autowired
    private SmsService smsService;
    
    @Autowired
    private TwilioConfig twilioConfig;

    /**
     * Test SMS with verified numbers only
     * GET /api/test/sms/send?phone=9606408912&message=Hello Test
     */
    @GetMapping("/send")
    public ResponseEntity<Map<String, Object>> testSendSms(
            @RequestParam String phone,
            @RequestParam(defaultValue = "Test SMS from HRMS System") String message) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            System.out.println("🧪 === SMS TEST REQUEST ===");
            System.out.println("Phone: " + phone);
            System.out.println("Message: " + message);
            
            // Check if number is verified
            boolean isVerified = twilioConfig.isVerifiedNumber(phone);
            response.put("phoneNumber", phone);
            response.put("isVerifiedNumber", isVerified);
            response.put("verifiedNumbers", twilioConfig.getVerifiedNumbers());
            
            if (!isVerified) {
                response.put("success", false);
                response.put("message", "Phone number not verified in Twilio trial account");
                response.put("note", "SMS will be redirected to first verified number for testing");
            }
            
            // Send SMS using the service
            smsService.testTwilioDirectly(phone, message);
            
            response.put("success", true);
            response.put("message", "SMS sent successfully!");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "SMS sending failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test candidate status SMS
     * POST /api/test/sms/candidate
     * Body: {"phone": "9606408912", "name": "Test User", "job": "Developer", "status": "Shortlisted"}
     */
    @PostMapping("/candidate")
    public ResponseEntity<Map<String, Object>> testCandidateSms(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String phone = request.get("phone");
            String name = request.get("name");
            String job = request.get("job");
            String status = request.get("status");
            
            System.out.println("🧪 === CANDIDATE SMS TEST ===");
            System.out.println("Phone: " + phone);
            System.out.println("Name: " + name);
            System.out.println("Job: " + job);
            System.out.println("Status: " + status);
            
            // Send candidate SMS
            smsService.sendCandidateStatusSms(phone, name, job, status);
            
            response.put("success", true);
            response.put("message", "Candidate SMS sent successfully!");
            response.put("phoneNumber", phone);
            response.put("candidateName", name);
            response.put("jobTitle", job);
            response.put("status", status);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Candidate SMS sending failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test HR notification SMS
     * POST /api/test/sms/hr
     * Body: {"job": "Developer", "status": "Shortlisted", "candidateEmail": "test@example.com"}
     */
    @PostMapping("/hr")
    public ResponseEntity<Map<String, Object>> testHrSms(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String job = request.get("job");
            String status = request.get("status");
            String candidateEmail = request.get("candidateEmail");
            
            System.out.println("🧪 === HR SMS TEST ===");
            System.out.println("Job: " + job);
            System.out.println("Status: " + status);
            System.out.println("Candidate Email: " + candidateEmail);
            
            // Send HR SMS
            smsService.sendRecruitmentStatusSms(job, status, candidateEmail);
            
            response.put("success", true);
            response.put("message", "HR SMS sent successfully!");
            response.put("jobTitle", job);
            response.put("status", status);
            response.put("candidateEmail", candidateEmail);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "HR SMS sending failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            e.printStackTrace();
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Get configuration info
     * GET /api/test/sms/config
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getConfig() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("twilioEnabled", twilioConfig.isEnabled());
        response.put("accountSid", twilioConfig.getAccountSid());
        response.put("phoneNumber", twilioConfig.getPhoneNumber());
        response.put("verifiedNumbers", twilioConfig.getVerifiedNumbers());
        
        // Don't expose auth token for security
        response.put("authTokenSet", twilioConfig.getAuthToken() != null && !twilioConfig.getAuthToken().isEmpty());
        
        return ResponseEntity.ok(response);
    }
}