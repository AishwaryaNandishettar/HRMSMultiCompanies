package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ResendHttpEmailService {

    @Value("${resend.api.key}")
    private String resendApiKey;

    @Value("${meeting.email.from-address:noreply@omoikaneinnovations.com}")
    private String fromAddress;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            String url = "https://api.resend.com/emails";

            // Debug: Check API key configuration
            log.info("🔍 [DEBUG] API Key configured: {}", (resendApiKey != null && !resendApiKey.isEmpty()) ? "YES" : "NO");
            log.info("🔍 [DEBUG] From address: {}", fromAddress);
            log.info("🔍 [DEBUG] Target URL: {}", url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);

            Map<String, Object> emailData = new HashMap<>();
            emailData.put("from", fromAddress);
            emailData.put("to", List.of(toEmail));
            emailData.put("subject", subject);
            emailData.put("html", htmlContent);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailData, headers);

            log.info("📧 Sending email via Resend HTTP API to: {}", toEmail);
            log.info("🔍 [DEBUG] Email payload: from={}, to={}, subject={}", fromAddress, toEmail, subject);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
            );

            log.info("🔍 [DEBUG] HTTP Response Status: {}", response.getStatusCode());
            log.info("🔍 [DEBUG] HTTP Response Body: {}", response.getBody());

            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("✅ Email sent successfully to: {}", toEmail);
                return true;
            } else {
                log.error("❌ Failed to send email. Status: {} Body: {}", response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("❌ DETAILED ERROR sending email via Resend HTTP API: {}", e.getMessage());
            log.error("❌ ERROR CLASS: {}", e.getClass().getSimpleName());
            if (e.getCause() != null) {
                log.error("❌ ROOT CAUSE: {}", e.getCause().getMessage());
            }
            e.printStackTrace(); // This will show full stack trace in logs
            return false;
        }
    }
}
