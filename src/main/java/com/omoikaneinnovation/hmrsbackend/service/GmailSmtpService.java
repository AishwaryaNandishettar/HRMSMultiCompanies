package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

/**
 * ⚠️ WARNING: Using Gmail SMTP for business emails is NOT recommended
 * - Violates Gmail TOS for transactional emails
 * - Daily limit: 500 emails
 * - Higher spam rates
 * - Security risks
 * 
 * Use only for testing or small-scale applications
 * This service is DISABLED when resend.enabled=true
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "resend.enabled", havingValue = "false", matchIfMissing = false)
public class GmailSmtpService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:#{null}}")
    private String fromEmail;

    @Value("${spring.mail.from-name:HRMS System}")
    private String fromName;

    public GmailSmtpService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            log.info("📧 Sending email via Gmail SMTP to: {}", toEmail);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Set email properties
            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            
            // Set both HTML and plain text versions
            String textContent = htmlContent
                .replaceAll("<style[^>]*>.*?</style>", "")
                .replaceAll("<script[^>]*>.*?</script>", "")
                .replaceAll("<[^>]*>", "")
                .replaceAll("&nbsp;", " ")
                .replaceAll("&amp;", "&")
                .replaceAll("&lt;", "<")
                .replaceAll("&gt;", ">")
                .replaceAll("\\s+", " ")
                .trim();
            
            helper.setText(textContent, htmlContent);

            // Send email
            mailSender.send(message);

            log.info("✅ Gmail SMTP: Email sent successfully to: {}", toEmail);
            return true;

        } catch (Exception e) {
            log.error("❌ Gmail SMTP: Failed to send email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
}
