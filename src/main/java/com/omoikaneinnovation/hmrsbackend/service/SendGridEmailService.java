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
public class SendGridEmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${meeting.email.from-address:aishushettar95@gmail.com}")
    private String fromAddress;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            String url = "https://api.sendgrid.com/v3/mail/send";

            log.info("📧 Sending email via SendGrid to: {}", toEmail);
            log.info("🔍 From address: {}", fromAddress);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + sendGridApiKey);

            // Build SendGrid email payload
            Map<String, Object> toObj = new HashMap<>();
            toObj.put("email", toEmail);

            Map<String, Object> fromObj = new HashMap<>();
            fromObj.put("email", fromAddress);
            fromObj.put("name", "HRMS - Omoikane Innovations");

            Map<String, Object> content = new HashMap<>();
            content.put("type", "text/html");
            content.put("value", htmlContent);

            Map<String, Object> personalization = new HashMap<>();
            personalization.put("to", List.of(toObj));
            personalization.put("subject", subject);

            Map<String, Object> payload = new HashMap<>();
            payload.put("personalizations", List.of(personalization));
            payload.put("from", fromObj);
            payload.put("subject", subject);
            payload.put("content", List.of(content));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                String.class
            );

            // SendGrid returns 202 Accepted for success
            if (response.getStatusCode() == HttpStatus.ACCEPTED || 
                response.getStatusCode() == HttpStatus.OK) {
                log.info("✅ Email sent successfully via SendGrid to: {}", toEmail);
                return true;
            } else {
                log.error("❌ SendGrid failed. Status: {} Body: {}", 
                    response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("❌ SendGrid error for {}: {}", toEmail, e.getMessage());
            if (e.getCause() != null) {
                log.error("❌ Root cause: {}", e.getCause().getMessage());
            }
            return false;
        }
    }
}
