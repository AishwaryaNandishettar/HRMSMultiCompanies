package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Job;
import com.omoikaneinnovation.hmrsbackend.service.JobService;
import com.omoikaneinnovation.hmrsbackend.service.SmsService;
import com.omoikaneinnovation.hmrsbackend.service.JobNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.vercel.app", "https://*.ngrok-free.dev"})
public class JobController {

    private final JobService service;
    private final SmsService smsService;
    private final JobNotificationService jobNotificationService; // ✅ NEW: Job notification service

    public JobController(JobService service, SmsService smsService, JobNotificationService jobNotificationService) {
        this.service = service;
        this.smsService = smsService;
        this.jobNotificationService = jobNotificationService;
    }

    // CREATE JOB
    @PostMapping("/create")
    public Job createJob(@RequestBody Job job) {
        System.out.println("📝 Creating new job: " + job.getJobTitle());
        
        // Create the job
        Job createdJob = service.createJob(job);
        
        // ✅ NEW: Send notification to all employees if job status is "Open"
        if (createdJob != null && "Open".equalsIgnoreCase(createdJob.getStatus())) {
            try {
                System.out.println("📧 Triggering job notifications for: " + createdJob.getJobTitle());
                jobNotificationService.notifyEmployeesAboutNewJob(createdJob);
            } catch (Exception e) {
                System.err.println("⚠️ Failed to send job notifications (job still created): " + e.getMessage());
                // Don't fail the job creation if notifications fail
            }
        } else {
            System.out.println("ℹ️ Job status is not 'Open', skipping notifications");
        }
        
        return createdJob;
    }

    // GET ALL JOBS
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return service.getAllJobs();
    }

    // ✅ NEW: GET ONLY OPEN JOBS (for internal job board)
    @GetMapping("/open")
    public List<Job> getOpenJobs() {
        System.out.println("📋 Fetching all open jobs for internal job board");
        List<Job> allJobs = service.getAllJobs();
        
        // Filter only jobs with status "Open"
        List<Job> openJobs = allJobs.stream()
                .filter(job -> "Open".equalsIgnoreCase(job.getStatus()))
                .toList();
        
        System.out.println("✅ Found " + openJobs.size() + " open positions");
        return openJobs;
    }

    // UPDATE STATUS (simple)
    @PutMapping("/status/{id}")
    public Job updateStatus(@PathVariable String id,
                            @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    // FULL UPDATE (status + level + dates)
    @PutMapping("/update/{id}")
    public Job updateJob(@PathVariable String id, @RequestBody Job updates) {
        return service.updateJob(id, updates);
    }

    // ✅ NEW: UPDATE STATUS + SAVE COMMENTS + SEND EMAIL + SEND SMS
    @PostMapping("/update-status")
    public ResponseEntity<?> updateStatusWithEmail(@RequestBody Map<String, String> request) {
        try {
            String candidateId    = request.get("candidateId");
            String newStatus      = request.get("newStatus");
            String comments       = request.get("comments");
            String candidateEmail = request.get("candidateEmail");
            String candidatePhone = request.get("candidatePhone"); // ✅ NEW: Accept phone number

            // ✅ DEBUG: Log all received parameters
            System.out.println("=== UPDATE STATUS REQUEST DEBUG ===");
            System.out.println("candidateId: " + candidateId);
            System.out.println("newStatus: " + newStatus);
            System.out.println("comments: " + comments);
            System.out.println("candidateEmail: " + candidateEmail);
            System.out.println("candidatePhone: " + candidatePhone);
            System.out.println("Full request: " + request);
            System.out.println("===================================");

            if (candidateId == null || newStatus == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "candidateId and newStatus are required"));
            }

            Job updated = service.updateStatusWithEmailAndSms(candidateId, newStatus, comments, candidateEmail, candidatePhone);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Status updated successfully! " +
                              "📧 Email sent to " + candidateEmail + 
                              (candidatePhone != null && !candidatePhone.trim().isEmpty() 
                                ? " | 📱 SMS notification sent to " + candidatePhone 
                                : " | ⚠️ No phone number provided for SMS"),
                    "candidate", updated
            ));

        } catch (Exception e) {
            System.err.println("❌ Error in updateStatusWithEmail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable String id) {
        service.deleteJob(id);
    }

    // ✅ NEW: GET HR CONTACT INFORMATION
    @GetMapping("/hr-contacts")
    public ResponseEntity<?> getHrContacts() {
        return ResponseEntity.ok(Map.of(
                "contacts", List.of(
                        Map.of("name", "Padmanabh", "phone", "9663743316", "role", "HR Manager"),
                        Map.of("name", "Aishwarya", "phone", "9606408912", "role", "HR Executive")
                ),
                "message", "SMS notifications are sent to these HR contacts for all recruitment updates"
        ));
    }

    // ✅ DEBUG: Test SMS functionality
    @PostMapping("/test-sms")
    public ResponseEntity<?> testSms(@RequestBody Map<String, String> request) {
        try {
            String phoneNumber = request.get("phoneNumber");
            String message = request.get("message");
            
            if (phoneNumber == null || message == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "phoneNumber and message are required"));
            }
            
            System.out.println("🧪 TEST SMS REQUEST:");
            System.out.println("Phone: " + phoneNumber);
            System.out.println("Message: " + message);
            
            // Use injected SMS service for testing
            smsService.sendCandidateStatusSms(phoneNumber, "TestUser", "Test Job", "Selected");
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Test SMS sent to " + phoneNumber + " via Twilio/Fast2SMS"
            ));
            
        } catch (Exception e) {
            System.err.println("❌ Test SMS Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    // ✅ NEW: Check Twilio Configuration
    @GetMapping("/twilio-status")
    public ResponseEntity<?> checkTwilioStatus() {
        return ResponseEntity.ok(Map.of(
                "twilioEnabled", "Check application.properties for twilio.enabled",
                "accountSid", "Check application.properties for twilio.account.sid",
                "phoneNumber", "Check application.properties for twilio.phone.number",
                "message", "Update your Twilio credentials in application.properties to enable SMS"
        ));
    }
}