package com.omoikaneinnovation.hmrsbackend.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class SendGridEmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email:noreply@yourdomain.com}")
    private String fromEmail;

    @Value("${sendgrid.from.name:HRMS System}")
    private String fromName;

    public boolean sendEmail(String toEmail, String subject, String htmlContent) {
        try {
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/html", htmlContent);
            Mail mail = new Mail(from, subject, to, content);

            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();
            
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("✅ SendGrid: Email sent successfully to: {} (Status: {})", toEmail, response.getStatusCode());
                return true;
            } else {
                log.error("❌ SendGrid: Failed to send email. Status: {}, Body: {}", 
                         response.getStatusCode(), response.getBody());
                return false;
            }

        } catch (IOException e) {
            log.error("❌ SendGrid: Exception sending email to {}: {}", toEmail, e.getMessage(), e);
            return false;
        }
    }
}
