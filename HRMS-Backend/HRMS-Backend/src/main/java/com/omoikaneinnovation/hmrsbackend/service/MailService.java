package com.omoikaneinnovation.hmrsbackend.service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOfferLetter(
            String to,
            String subject,
            String candidateName,
            MultipartFile file
    ) throws Exception {

        System.out.println("📧 MailService: Starting email send process");
        System.out.println("📧 From: " + fromEmail);
        System.out.println("📧 To: " + to);
        System.out.println("📧 Subject: " + subject);

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);

            String emailBody = String.format(
                "Dear %s,\n\n" +
                "Congratulations! Please find attached your official offer letter.\n\n" +
                "We are excited to have you join our team.\n\n" +
                "If you have any questions, please feel free to reach out to us.\n\n" +
                "Best regards,\n" +
                "OMOIKANE INNOVATIONS PVT LTD\n" +
                "HR Team",
                candidateName
            );

            helper.setText(emailBody);

            if (file != null && !file.isEmpty()) {
                helper.addAttachment(
                    file.getOriginalFilename(),
                    new ByteArrayResource(file.getBytes())
                );
                System.out.println("📎 Attachment added: " + file.getOriginalFilename());
            }

            System.out.println("📤 Sending email...");
            mailSender.send(message);
            System.out.println("✅ Email sent successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
            e.printStackTrace();
            throw new Exception("Failed to send email: " + e.getMessage(), e);
        }
    }
}