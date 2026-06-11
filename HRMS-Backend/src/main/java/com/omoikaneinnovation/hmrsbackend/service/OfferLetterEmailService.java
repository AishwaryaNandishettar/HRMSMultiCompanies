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
public class OfferLetterEmailService {

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

        System.out.println("========== EMAIL SERVICE ==========");
        System.out.println("FROM: " + fromEmail);
        System.out.println("TO: " + to);
        System.out.println("SUBJECT: " + subject);
        System.out.println("FILE: " + file.getOriginalFilename());
        System.out.println("SIZE: " + file.getSize());

        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper =
                new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);

        helper.setText(
                "Dear " + candidateName +
                ",\n\nPlease find attached your offer letter.\n\nRegards,\nHR Team"
        );

        helper.addAttachment(
                file.getOriginalFilename(),
                new ByteArrayResource(file.getBytes())
        );

        System.out.println("Sending email now...");

        mailSender.send(message);

        System.out.println("EMAIL SENT SUCCESSFULLY");
    }
}