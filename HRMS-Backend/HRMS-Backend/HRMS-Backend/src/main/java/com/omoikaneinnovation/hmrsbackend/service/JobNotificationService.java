package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Employee;
import com.omoikaneinnovation.hmrsbackend.model.Job;
import com.omoikaneinnovation.hmrsbackend.repository.EmployeeRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobNotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send email notification to all active employees when a new job is posted
     */
    public void notifyEmployeesAboutNewJob(Job job) {
        try {
            System.out.println("📧 Starting job notification process for: " + job.getJobTitle());

            // Get all active employees
            List<Employee> employees = employeeRepository.findAll();
            
            if (employees == null || employees.isEmpty()) {
                System.out.println("⚠️ No employees found to notify");
                return;
            }

            System.out.println("📧 Found " + employees.size() + " employees to notify");

            int successCount = 0;
            int failCount = 0;

            for (Employee employee : employees) {
                try {
                    // Skip employees without email or inactive employees
                    if (employee.getEmail() == null || employee.getEmail().trim().isEmpty()) {
                        System.out.println("⚠️ Skipping employee " + employee.getFullName() + " - no email");
                        continue;
                    }

                    // Skip inactive employees
                    if (employee.getStatus() != null && 
                        (employee.getStatus().equalsIgnoreCase("DISABLED") || 
                         employee.getStatus().equalsIgnoreCase("INVITED"))) {
                        System.out.println("⚠️ Skipping employee " + employee.getFullName() + " - status: " + employee.getStatus());
                        continue;
                    }

                    sendJobNotificationEmail(employee, job);
                    successCount++;
                    System.out.println("✅ Email sent to: " + employee.getEmail());

                } catch (Exception e) {
                    failCount++;
                    System.err.println("❌ Failed to send email to " + employee.getEmail() + ": " + e.getMessage());
                }
            }

            System.out.println("📊 Job notification summary:");
            System.out.println("   ✅ Successfully sent: " + successCount);
            System.out.println("   ❌ Failed: " + failCount);

        } catch (Exception e) {
            System.err.println("❌ Error in job notification process: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send individual job notification email to an employee
     */
    private void sendJobNotificationEmail(Employee employee, Job job) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(employee.getEmail());
        helper.setSubject("🆕 New Job Opening: " + job.getJobTitle());

        // Build email body
        String emailBody = buildEmailBody(employee, job);
        helper.setText(emailBody, false); // false = plain text, true = HTML

        mailSender.send(message);
    }

    /**
     * Build professional email body for job notification
     */
    private String buildEmailBody(Employee employee, Job job) {
        StringBuilder body = new StringBuilder();

        body.append("Dear ").append(employee.getFullName()).append(",\n\n");
        body.append("Great news! A new position is now open at OMOIKANE INNOVATIONS.\n\n");
        
        body.append("📋 Job Details:\n");
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        body.append("• Position: ").append(job.getJobTitle()).append("\n");
        body.append("• Job ID: ").append(job.getJobId() != null ? job.getJobId() : "N/A").append("\n");
        body.append("• Department: ").append(job.getDepartment() != null ? job.getDepartment() : "N/A").append("\n");
        
        if (job.getLocation() != null && !job.getLocation().trim().isEmpty()) {
            body.append("• Location: ").append(job.getLocation()).append("\n");
        }
        
        if (job.getJobType() != null && !job.getJobType().trim().isEmpty()) {
            body.append("• Job Type: ").append(job.getJobType()).append("\n");
        }
        
        if (job.getWorkMode() != null && !job.getWorkMode().trim().isEmpty()) {
            body.append("• Work Mode: ").append(job.getWorkMode()).append("\n");
        }
        
        if (job.getExperience() != null && !job.getExperience().trim().isEmpty()) {
            body.append("• Experience Required: ").append(job.getExperience()).append("\n");
        }
        
        if (job.getPostedDate() != null && !job.getPostedDate().trim().isEmpty()) {
            body.append("• Posted Date: ").append(job.getPostedDate()).append("\n");
        }
        
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
        
        if (job.getDescription() != null && !job.getDescription().trim().isEmpty()) {
            body.append("📝 Job Description:\n");
            body.append(job.getDescription()).append("\n\n");
        }
        
        body.append("💼 Interested in this opportunity?\n");
        body.append("Are you interested in applying for this position or know someone who would be a great fit?\n\n");
        
        body.append("🔗 To view all open positions and apply:\n");
        body.append("   • Login to HRMS\n");
        body.append("   • Navigate to 'Internal Jobs' or 'Career Opportunities'\n");
        body.append("   • Click 'Apply Now' for positions you're interested in\n\n");
        
        body.append("This is a great opportunity for career growth within OMOIKANE INNOVATIONS!\n\n");
        
        body.append("Best regards,\n");
        body.append("HR Team\n");
        body.append("OMOIKANE INNOVATIONS PVT LTD\n\n");
        
        body.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        body.append("📧 This is an automated notification. Please do not reply to this email.\n");
        body.append("For any queries, please contact your HR representative.\n");

        return body.toString();
    }
}
