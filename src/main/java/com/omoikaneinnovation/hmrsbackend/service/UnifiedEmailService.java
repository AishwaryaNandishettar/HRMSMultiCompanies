package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Unified Email Service - Switches between Gmail SMTP and Resend API
 * 
 * Configure which service to use via application.properties:
 * email.service.provider=gmail  (for Gmail SMTP)
 * email.service.provider=resend (for Resend API) - RECOMMENDED
 */
@Slf4j
@Service
public class UnifiedEmailService {

    private final GmailSmtpService gmailSmtpService;
    private final ResendEmailService resendEmailService;

    @Value("${email.service.provider:resend}")
    private String emailServiceProvider;

    public UnifiedEmailService(
            GmailSmtpService gmailSmtpService,
            ResendEmailService resendEmailService) {
        this.gmailSmtpService = gmailSmtpService;
        this.resendEmailService = resendEmailService;
    }

    /**
     * Send email using configured provider (Gmail or Resend)
     */
    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        log.info("📧 Email Service Provider: {}", emailServiceProvider);

        if ("gmail".equalsIgnoreCase(emailServiceProvider)) {
            log.warn("⚠️ Using Gmail SMTP - Not recommended for production");
            return gmailSmtpService.sendEmail(toEmail, subject, htmlContent);
        } else {
            log.info("✅ Using Resend API (Recommended)");
            return resendEmailService.sendEmail(toEmail, subject, htmlContent);
        }
    }
}
