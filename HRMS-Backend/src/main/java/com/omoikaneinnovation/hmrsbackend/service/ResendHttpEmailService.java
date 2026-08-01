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

    @Value("${meeting.email.from-address:onboarding@resend.dev}")
    private String fromAddress;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            String url = "https://api.resend.com/emails";

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
            
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                log.info("✅ Email sent successfully to: {}", toEmail);
                return true;
            } else {
                log.error("❌ Failed to send email. Status: {}", response.getStatusCode());
                return false;
            }

        } catch (Exception e) {
            log.error("❌ Error sending email via Resend HTTP API: {}", e.getMessage(), e);
            return false;
        }
    }
}
