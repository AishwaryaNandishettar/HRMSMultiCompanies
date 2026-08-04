package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.OtpToken;
import com.omoikaneinnovation.hmrsbackend.repository.OtpRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    private static final Duration OTP_TTL = Duration.ofMinutes(10);

    private Map<String, String> otpStorage = new HashMap<>();

    @Autowired
    private OtpRepository repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JavaMailSender mailSender;

    // ✅ EXISTING METHOD (UNCHANGED)
    public void generateAndSendOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setCreatedAt(Instant.now());

        repo.save(token);

        emailService.sendOtp(email, otp);
    }

    // ✅ EXISTING METHOD (UNCHANGED)
    public boolean verifyOtp(String email, String otp) {

        return repo.findByEmailAndOtp(email, otp)
                .filter(t -> t.getCreatedAt()
                        .plus(OTP_TTL)
                        .isAfter(Instant.now()))
                .isPresent();
    }

    // ✅ NEW METHOD (SAFE + CORRECT)
    public String generateOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setCreatedAt(Instant.now());

        repo.save(token);

        return otp;
    }

    // ✅ NEW METHOD (SEND OTP + LINK IN ONE EMAIL)
    public void sendInviteEmail(String email, String link, String otp) {

        // ✅ STRIP ANY QUOTES FROM EMAIL (safety check)
        email = email != null ? email.trim().replace("\"", "") : email;
        
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("HRMS Invite - Your Login Details");
        System.out.println("📩 [OtpService] Preparing invite email to: " + email);
        message.setText(
                "Hello,\n\n" +
                "You have been invited to join HRMS - Omoikane Innovations.\n\n" +
                "=== Your Login Details ===\n" +
                "Email    : " + email + "\n" +
                "Password : Temp@123\n" +
                "OTP      : " + otp + "\n\n" +
                "=== Login Here ===\n" +
                link + "\n\n" +
                "Steps:\n" +
                "1. Visit the link above\n" +
                "2. Login with your email and password: Temp@123\n" +
                "3. Change your password after first login\n\n" +
                "If you have any questions, contact HR.\n\n" +
                "Thanks,\nHR Team - Omoikane Innovations"
        );

        System.out.println("📤 [OtpService] Calling mailSender.send() for: " + email);
        mailSender.send(message);
        System.out.println("✅ [OtpService] Email sent successfully to: " + email);
    }
}