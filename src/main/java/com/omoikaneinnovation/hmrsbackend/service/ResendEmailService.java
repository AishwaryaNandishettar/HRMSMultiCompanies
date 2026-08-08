package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

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
            
            // Prepare email data with enhanced deliverability settings
            Map<String, Object> emailData = new HashMap<>();
            
            // Use proper email format
            emailData.put("from", fromName + " <" + fromEmail + ">");
            emailData.put("to", new String[]{toEmail});
            emailData.put("subject", subject);
            emailData.put("html", htmlContent);
            
            // Add reply-to for better engagement
            emailData.put("reply_to", fromEmail);

            // Add plain text version (CRITICAL for spam avoidance)
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
            emailData.put("text", textContent);

            // Add custom headers to improve deliverability
            Map<String, String> customHeaders = new HashMap<>();
            customHeaders.put("X-Entity-Ref-ID", "hrms-system-" + System.currentTimeMillis());
            customHeaders.put("X-Mailer", "HRMS-Backend-v1.0");
            customHeaders.put("List-Unsubscribe", "<mailto:" + fromEmail + "?subject=unsubscribe>");
            emailData.put("headers", customHeaders);

            // Add tags for tracking and categorization
            emailData.put("tags", List.of(
                Map.of("name", "category", "value", "transactional"),
                Map.of("name", "environment", "value", "production")
            ));

            // Prepare HTTP request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + resendApiKey);
            headers.set("User-Agent", "HRMS-Backend/1.0");

            HttpEntity<String> request = new HttpEntity<>(
                objectMapper.writeValueAsString(emailData), 
                headers
            );

            // Send email
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ Resend: Email sent successfully to: {} (Status: {})", 
                         toEmail, response.getStatusCode());
                log.debug("Response body: {}", response.getBody());
                return true;
            } else {
                log.error("❌ Resend: Failed to send email. Status: {}, Body: {}", 
                         response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (Exception e) {
            log.error("❌ Resend: Exception sending email to {}: {}", 
                     toEmail, e.getMessage(), e);
            return false;
        }
    }
}
