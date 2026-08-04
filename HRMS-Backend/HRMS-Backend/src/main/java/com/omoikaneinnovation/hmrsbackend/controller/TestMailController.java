package com.omoikaneinnovation.hmrsbackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.omoikaneinnovation.hmrsbackend.service.OtpService;

@RestController
@RequestMapping("/test")
public class TestMailController {

    @Autowired
    private OtpService otpService;

    @GetMapping("/mail")
    public String testMail() {
        String email = "aishushettar95@gmail.com";
        String link = "http://localhost:5173";
        String otp = "123456";

        System.out.println("🔵 [TestMail] Starting test mail to: " + email);
        try {
            otpService.sendInviteEmail(email, link, otp);
            return "✅ Test mail sent successfully to " + email;
        } catch (Exception e) {
            System.err.println("❌ [TestMail] Failed: " + e.getMessage());
            e.printStackTrace();
            return "❌ Failed: " + e.getMessage();
        }
    }
}