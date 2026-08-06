package com.omoikaneinnovation.hmrsbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;

@SpringBootTest
public class EmailTest {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Test
    public void testEmailSending() {
        if (mailSender == null) {
            System.out.println("❌ JavaMailSender is NULL - Email configuration not loaded!");
            return;
        }

        try {
            System.out.println("📧 Testing email sending...");
            
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("aishushettar95@gmail.com");
            helper.setTo("aishushettar95@gmail.com");
            helper.setSubject("Test Email from HRMS");
            helper.setText("This is a test email. If you receive this, email is working!", false);

            System.out.println("Sending email...");
            mailSender.send(message);
            
            System.out.println("✅ Email sent successfully!");
            System.out.println("Check your inbox: aishushettar95@gmail.com");
            
        } catch (Exception e) {
            System.out.println("❌ Email sending failed!");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
            
            if (e.getMessage().contains("Invalid login")) {
                System.out.println("\n💡 Solution: Update Gmail App Password in application.properties");
            } else if (e.getMessage().contains("Connection")) {
                System.out.println("\n💡 Solution: Check internet connection and firewall settings");
            }
        }
    }
}
