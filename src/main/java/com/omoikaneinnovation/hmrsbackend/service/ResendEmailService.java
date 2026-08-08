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

    @Value("${resend.from.email:onboarding@resend.dev}")
    private String fromEmail;

    @Value("${resend.from.name:HRMS System}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {

        try {

            String url = "https://api.resend.com/emails";

            // =====================================================
            // DEBUG
            // =====================================================

            log.info("==========================================");
            log.info("📧 RESEND EMAIL");
            log.info("📧 From: {}", fromName + " <" + fromEmail + ">");
            log.info("📧 To: {}", toEmail);
            log.info("📧 Subject: {}", subject);
            log.info(
                "🔑 Resend API Key configured: {}",
                resendApiKey != null && !resendApiKey.isBlank() ? "YES" : "NO"
            );
            log.info("==========================================");

            // =====================================================
            // EMAIL DATA
            // =====================================================

            Map<String, Object> emailData = new HashMap<>();

            emailData.put(
                "from",
                fromName + " <" + fromEmail + ">"
            );

            emailData.put(
                "to",
                List.of(toEmail)
            );

            emailData.put(
                "subject",
                subject
            );

            emailData.put(
                "html",
                htmlContent
            );

            // Reply-To
            emailData.put(
                "reply_to",
                fromEmail
            );

            // =====================================================
            // PLAIN TEXT VERSION
            // =====================================================

            String textContent = htmlContent
                    .replaceAll("(?s)<style[^>]*>.*?</style>", "")
                    .replaceAll("(?s)<script[^>]*>.*?</script>", "")
                    .replaceAll("<[^>]*>", "")
                    .replaceAll("&nbsp;", " ")
                    .replaceAll("&amp;", "&")
                    .replaceAll("&lt;", "<")
                    .replaceAll("&gt;", ">")
                    .replaceAll("\\s+", " ")
                    .trim();

            emailData.put("text", textContent);

            // =====================================================
            // HEADERS
            // =====================================================

            Map<String, String> customHeaders = new HashMap<>();

            customHeaders.put(
                "X-Entity-Ref-ID",
                "hrms-system-" + System.currentTimeMillis()
            );

            customHeaders.put(
                "X-Mailer",
                "HRMS-Backend-v1.0"
            );

            emailData.put(
                "headers",
                customHeaders
            );

            // =====================================================
            // TAGS
            // =====================================================

            emailData.put(
                "tags",
                List.of(
                    Map.of(
                        "name",
                        "category",
                        "value",
                        "transactional"
                    ),
                    Map.of(
                        "name",
                        "environment",
                        "value",
                        "production"
                    )
                )
            );

            // =====================================================
            // HTTP HEADERS
            // =====================================================

            HttpHeaders headers = new HttpHeaders();

            headers.setContentType(
                MediaType.APPLICATION_JSON
            );

            headers.set(
                "Authorization",
                "Bearer " + resendApiKey
            );

            headers.set(
                "User-Agent",
                "HRMS-Backend/1.0"
            );

            // =====================================================
            // REQUEST
            // =====================================================

            HttpEntity<String> request = new HttpEntity<>(
                objectMapper.writeValueAsString(emailData),
                headers
            );

            log.info("📤 Sending request to Resend...");

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                        url,
                        request,
                        String.class
                    );

            // =====================================================
            // RESPONSE
            // =====================================================

            log.info(
                "📨 Resend response status: {}",
                response.getStatusCode()
            );

            log.info(
                "📨 Resend response body: {}",
                response.getBody()
            );

            if (response.getStatusCode().is2xxSuccessful()) {

                log.info(
                    "✅ EMAIL SENT SUCCESSFULLY TO: {}",
                    toEmail
                );

                return true;
            }

            log.error(
                "❌ RESEND FAILED. Status: {}, Body: {}",
                response.getStatusCode(),
                response.getBody()
            );

            return false;

        } catch (Exception e) {

            log.error(
                "❌ RESEND EMAIL ERROR TO {}: {}",
                toEmail,
                e.getMessage(),
                e
            );

            return false;
        }
    }
}