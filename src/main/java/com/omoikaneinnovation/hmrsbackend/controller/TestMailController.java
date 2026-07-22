package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.omoikaneinnovation.hmrsbackend.service.EmailService;

@RestController
@RequestMapping("/test")
public class TestMailController {

    @Autowired
    private EmailService emailService;

    @GetMapping("/mail")
    public String testMail() {

        String email = "aishushettar95@gmail.com";
        String link = "http://localhost:5173/login?email=" + email;

        System.out.println("=== TEST MAIL ENDPOINT CALLED ===");
        System.out.println("Attempting to send email to: " + email);

        try {
            emailService.sendInviteEmail(email, link, "123456", "Temp@123");
            System.out.println("✅ Email service returned successfully");
            return "✅ Invite Mail Sent Successfully to " + email;
        } catch (Exception e) {
            System.err.println("❌ Email service threw exception: " + e.getMessage());
            e.printStackTrace();
            return "❌ Email FAILED: " + e.getMessage();
        }
    }
}