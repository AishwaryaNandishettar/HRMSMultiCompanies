package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class ResendEmailService {
    @Value("${resend.api.key}")
    private String resendApiKey;
    @Value("${resend.from.email:noreply@yourdomain.com}")
    private String fromEmail;
    @Value("${resend.from.name:HRMS System}")
    private String fromName;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            String url = "https://api.resend.com/emails";
            Map<String, Object> emailData = new HashMap<>();
            emailData.put("from", fromName + " <" + fromEmail + ">");
            emailData.put("to", new String[]{toEmail});
            emailData.put("subject", subject);
            emailData.put("html", htmlContent);
            emailData.put("reply_to", fromEmail);
            String textContent = htmlContent.replaceAll("<[^>]*>", "").replaceAll("\\s+", " ").trim();
            emailData.put("text", textContent);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);
            HttpEntity<String> request = new HttpEntity<>(objectMapper.writeValueAsString(emailData), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Resend: Email sent successfully to: {} (Status: {})", toEmail, response.getStatusCode());
                return true;
            } else {
                log.error("❌ Resend: Failed to send email. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
                return false;
            }
        } catch (Exception e) {
            log.error("❌ Resend: Exception sending email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
}
