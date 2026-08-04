package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Job;
import com.omoikaneinnovation.hmrsbackend.service.JobService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
public class JobController {

    private final JobService service;

    public JobController(JobService service) {
        this.service = service;
    }

    // CREATE JOB
    @PostMapping("/create")
    public Job createJob(@RequestBody Job job) {
        return service.createJob(job);
    }

    // GET ALL JOBS
    @GetMapping("/all")
    public List<Job> getAllJobs() {
        return service.getAllJobs();
    }

    // UPDATE STATUS
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

    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable String id) {
        service.deleteJob(id);
    }

    /**
     * ✅ NEW: Update candidate status + Send Email + Send SMS
     * This endpoint handles the complete workflow:
     * 1. Update database
     * 2. Send email to candidate (if email provided)
     * 3. Send SMS to candidate (if phone provided)
     * 4. Send SMS to HR team (Padmanabh/Aishwarya based on assignedTo)
     */
    @PostMapping("/update-status")
    public ResponseEntity<?> updateStatusAndSendEmailSms(@RequestBody Map<String, Object> data) {
        try {
            System.out.println("📥 Received update-status request: " + data);

            // Extract data from request
            String candidateId = (String) data.get("candidateId");
            String candidateName = (String) data.get("candidateName");
            String candidateEmail = (String) data.get("candidateEmail");
            String candidatePhone = (String) data.get("candidatePhone");
            String newStatus = (String) data.get("newStatus");
            String comments = (String) data.get("comments");

            // Validate required fields
            if (candidateId == null || newStatus == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Missing required fields: candidateId and newStatus are required"));
            }

            System.out.println("✅ Parsed data:");
            System.out.println("   - Candidate ID: " + candidateId);
            System.out.println("   - Candidate Name: " + candidateName);
            System.out.println("   - Email: " + candidateEmail);
            System.out.println("   - Phone: " + candidatePhone);
            System.out.println("   - New Status: " + newStatus);
            System.out.println("   - Comments: " + comments);

            // Call JobService to update status + send email + send SMS
            // This method handles:
            // 1. Database update
            // 2. Email notification to candidate
            // 3. SMS notification to candidate
            Job updatedJob = service.updateStatusWithEmailAndSms(
                candidateId, 
                newStatus, 
                comments, 
                candidateEmail, 
                candidatePhone
            );

            System.out.println("✅ Status updated successfully for candidate: " + candidateName);

            // Return success response
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Status updated successfully! Email and SMS notifications sent.",
                "candidate", updatedJob.getJobTitle(),
                "newStatus", newStatus,
                "emailSent", candidateEmail != null && !candidateEmail.isEmpty(),
                "smsSent", candidatePhone != null && !candidatePhone.isEmpty()
            ));

        } catch (Exception e) {
            System.err.println("❌ Error in updateStatusAndSendEmailSms: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "error", "Failed to update status: " + e.getMessage()
                ));
        }
    }

    /**
     * ✅ TEST ENDPOINT: Send SMS directly to test Twilio functionality
     * Use this to verify SMS works without updating database
     * GET /api/jobs/test-sms?phone=9606408912&message=Test
     */
    @GetMapping("/test-sms")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> testSms(@RequestParam String phone, 
                                    @RequestParam(defaultValue = "Test message from HRMS system") String message) {
        try {
            System.out.println("🧪 SMS Test Request:");
            System.out.println("   - Phone: " + phone);
            System.out.println("   - Message: " + message);

            // Test Twilio directly
            SmsService smsService = service.getSmsService();
            smsService.testTwilioDirectly(phone, message);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Test SMS sent successfully!",
                "phone", phone,
                "testMessage", "Check your phone for SMS"
            ));

        } catch (Exception e) {
            System.err.println("❌ Test SMS failed: " + e.getMessage());
            e.printStackTrace();

            return ResponseEntity.status(500)
                .body(Map.of(
                    "success", false,
                    "error", "Test SMS failed: " + e.getMessage()
                ));
        }
    }
}