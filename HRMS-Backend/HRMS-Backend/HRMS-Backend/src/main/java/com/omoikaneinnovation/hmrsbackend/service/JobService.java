package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Job;
import com.omoikaneinnovation.hmrsbackend.repository.JobRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository repo;

    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Autowired
    private SmsService smsService;

    public JobService(JobRepository repo) {
        this.repo = repo;
    }

    // CREATE
    public Job createJob(Job job) {
        // Auto-generate jobId if not provided
        if (job.getJobId() == null || job.getJobId().isEmpty()) {
            long count = repo.count() + 1;
            job.setJobId(String.format("JOB-%03d", count)); // JOB-001, JOB-002, ...
        }
        return repo.save(job);
    }

    // GET ALL
    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    // UPDATE STATUS
    public Job updateStatus(String id, String status) {
        Job job = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(status);
        return repo.save(job);
    }

    // FULL UPDATE — status, interview level, selection level, dates
    public Job updateJob(String id, Job updates) {
        Job job = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (updates.getStatus() != null)         job.setStatus(updates.getStatus());
        if (updates.getInterviewLevel() != null)  job.setInterviewLevel(updates.getInterviewLevel());
        if (updates.getSelectionLevel() != null)  job.setSelectionLevel(updates.getSelectionLevel());
        if (updates.getAppliedDate() != null)     job.setAppliedDate(updates.getAppliedDate());
        if (updates.getL1InterviewDate() != null) job.setL1InterviewDate(updates.getL1InterviewDate());
        if (updates.getL2InterviewDate() != null) job.setL2InterviewDate(updates.getL2InterviewDate());
        if (updates.getOfferDate() != null)       job.setOfferDate(updates.getOfferDate());
        if (updates.getOnboardingDate() != null)  job.setOnboardingDate(updates.getOnboardingDate());

        // ✅ VALIDATION LOGIC (ADD THIS)
        if ("Interview Stage".equalsIgnoreCase(updates.getStatus())) {
            if (updates.getInterviewLevel() == null || updates.getInterviewLevel().isEmpty()) {
                throw new RuntimeException("Interview Level (L1/L2) is required for Interview Stage");
            }
        }

        if ("Selected".equalsIgnoreCase(updates.getStatus())) {
            if (updates.getSelectionLevel() == null || updates.getSelectionLevel().isEmpty()) {
                throw new RuntimeException("Selection Level (L1 Selected / L2 Selected) is required");
            }
        }
        return repo.save(job);
    }
    
    public void deleteJob(String id) {
        repo.deleteById(id);
    }

    // ✅ UPDATE STATUS + SAVE COMMENTS + SEND EMAIL + SEND SMS (NEW METHOD)
    public Job updateStatusWithEmailAndSms(String id, String newStatus, String comments, String candidateEmail, String candidatePhone) {
        Job job = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found: " + id));

        // Update fields
        job.setStatus(newStatus);
        if (comments != null && !comments.isEmpty()) {
            job.setComments(comments);
        }
        if (candidateEmail != null && !candidateEmail.isEmpty()) {
            job.setEmail(candidateEmail);
        }
        if (candidatePhone != null && !candidatePhone.isEmpty()) {
            // Clean the phone number before saving
            String cleanPhone = candidatePhone.replaceAll("[^0-9]", ""); // Remove all non-digits
            
            // Handle corrupted phone numbers with repetitions
            System.out.println("🔍 Original phone: '" + candidatePhone + "'");
            System.out.println("🔍 Digits only: '" + cleanPhone + "'");
            
            // If phone number is corrupted with repetitions, extract the valid part
            if (cleanPhone.length() > 10) {
                // Look for valid 10-digit Indian mobile number patterns
                for (int i = 0; i <= cleanPhone.length() - 10; i++) {
                    String candidate = cleanPhone.substring(i, i + 10);
                    // Check if it's a valid Indian mobile number (starts with 9, 8, 7, 6)
                    if (candidate.matches("^[9876]\\d{9}$")) {
                        cleanPhone = candidate;
                        System.out.println("✅ Found valid phone pattern: " + cleanPhone);
                        break;
                    }
                }
                
                // If no valid pattern found, try first 10 digits
                if (cleanPhone.length() > 10) {
                    cleanPhone = cleanPhone.substring(0, 10);
                    System.out.println("⚠️ Using first 10 digits: " + cleanPhone);
                }
            }
            
            job.setPhone(cleanPhone); // ✅ Save the cleaned phone number
            candidatePhone = cleanPhone; // ✅ Update the variable for SMS sending
        }

        Job saved = repo.save(job);

        // Send email notification if email provided and mail sender is available
        if (candidateEmail != null && !candidateEmail.isEmpty()
                && !candidateEmail.equals("-")
                && mailSender != null) {
            try {
                sendStatusEmail(candidateEmail, job.getJobTitle(), newStatus);
            } catch (Exception e) {
                // Log but don't fail the whole request if email fails
                System.err.println("⚠️ Email sending failed (non-critical): " + e.getMessage());
            }
        }

        // ✅ NEW: Send SMS notification to CANDIDATE (parallel to email)
        // This sends SMS to the candidate's phone number, not HR team
        if (candidatePhone != null && !candidatePhone.isEmpty() && !candidatePhone.equals("-")) {
            try {
                System.out.println("🔄 JobService: Attempting to send SMS...");
                System.out.println("📱 Cleaned Phone: '" + candidatePhone + "'");
                System.out.println("📧 Email: '" + candidateEmail + "'");
                System.out.println("🏢 Job Title: '" + job.getJobTitle() + "'");
                System.out.println("📊 Status: '" + newStatus + "'");
                
                // Extract candidate name from email or use job title
                String candidateName = candidateEmail != null ? candidateEmail.split("@")[0] : "Candidate";
                System.out.println("👤 Candidate Name: '" + candidateName + "'");
                
                smsService.sendCandidateStatusSms(candidatePhone, candidateName, job.getJobTitle(), newStatus);
                System.out.println("✅ SMS service called successfully!");
                
            } catch (Exception e) {
                System.err.println("❌ JobService SMS Error: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("⚠️ JobService: SMS not sent - Phone number is null, empty, or '-'");
            System.out.println("📱 Phone value: '" + candidatePhone + "'");
        }

        return saved;
    }

    /**
     * ✅ Helper method for testing SMS functionality
     */
    public SmsService getSmsService() {
        return smsService;
    }

    // ✅ LEGACY: UPDATE STATUS + SAVE COMMENTS + SEND EMAIL (EXISTING METHOD - BACKWARD COMPATIBILITY)
    public Job updateStatusWithEmail(String id, String newStatus, String comments, String candidateEmail) {
        // Just call the new method with null phone for backward compatibility
        return updateStatusWithEmailAndSms(id, newStatus, comments, candidateEmail, null);
    }

    // ✅ EMAIL TEMPLATES based on status
    private void sendStatusEmail(String toEmail, String jobTitle, String status) throws Exception {
        String subject;
        String body;
        String name = toEmail.split("@")[0]; // Use email prefix as name fallback

        switch (status) {
            case "Shortlisted":
                subject = "Application Shortlisted - Congratulations! 🎉";
                body = "Dear " + name + ",\n\n"
                     + "Congratulations! 🎉\n\n"
                     + "We are pleased to inform you that your profile has been shortlisted for the position of " + jobTitle + ".\n\n"
                     + "Our team will contact you shortly with further details regarding the interview schedule.\n\n"
                     + "Best regards,\nHR Team";
                break;

            case "Interview Stage":
                subject = "Interview Scheduled - Next Steps 📅";
                body = "Dear " + name + ",\n\n"
                     + "Good news! You have been selected for the interview stage for " + jobTitle + ".\n\n"
                     + "Our HR team will reach out to you shortly with the interview schedule and relevant details.\n\n"
                     + "Please keep your phone and email accessible for further communication.\n\n"
                     + "Best regards,\nHR Team";
                break;

            case "Selected":
                subject = "Congratulations - You're Selected! 🎊";
                body = "Dear " + name + ",\n\n"
                     + "Congratulations! 🎊\n\n"
                     + "We are delighted to inform you that you have been selected for the position of " + jobTitle + ".\n\n"
                     + "Our HR team will contact you shortly with the offer letter and next steps.\n\n"
                     + "Welcome to the team!\n\n"
                     + "Best regards,\nHR Team";
                break;

            case "Rejected":
                subject = "Application Status Update";
                body = "Dear " + name + ",\n\n"
                     + "Thank you for your interest in the position of " + jobTitle + " and for taking the time to go through our process.\n\n"
                     + "After careful consideration, we have decided not to proceed with your application at this time.\n\n"
                     + "We encourage you to apply for future openings that match your profile and wish you all the best.\n\n"
                     + "Best regards,\nHR Team";
                break;

            default:
                subject = "Application Status Updated";
                body = "Dear " + name + ",\n\n"
                     + "Your application status for " + jobTitle + " has been updated to: " + status + ".\n\n"
                     + "Best regards,\nHR Team";
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(body);
        mailSender.send(message);

        System.out.println("✅ Email sent to " + toEmail + " for status: " + status);
    }
}