package com.omoikaneinnovation.hmrsbackend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

/**
 * Issues LiveKit access tokens for meeting participants.
 *
 * LiveKit tokens are standard JWTs (HS256) where:
 *   - iss  = API key
 *   - sub  = participant identity (email)
 *   - name = display name
 *   - video = { room, roomJoin, canPublish, canSubscribe, canPublishData }
 *
 * We build the JWT manually using raw HMAC-SHA256 so the signature matches
 * exactly what LiveKit's Go server (go-jose) expects — no key-wrapping or
 * padding that JJWT's Keys.hmacShaKeyFor() would add.
 *
 * Security: requires a valid HRMS JWT. The participant identity is taken
 * from the authenticated principal, never from a request parameter.
 */
@RestController
@RequestMapping("/api/livekit")
@Slf4j
public class LiveKitController {

    @Value("${livekit.api-key}")
    private String apiKey;

    @Value("${livekit.api-secret}")
    private String apiSecret;

    @Value("${livekit.url:ws://localhost:7880}")
    private String livekitUrl;

    private final ObjectMapper mapper = new ObjectMapper();

    @GetMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(
            @RequestParam String meetingId,
            @RequestParam(required = false, defaultValue = "") String displayName,
            Authentication auth) {

        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).build();
        }

        String identity = auth.getName().trim().toLowerCase();
        String name     = displayName.isBlank() ? identity : displayName;

        log.info("🎟️ LiveKit token: participant={} room={}", identity, meetingId);

        try {
            // ── Header ────────────────────────────────────────────────────
            ObjectNode header = mapper.createObjectNode();
            header.put("alg", "HS256");
            header.put("typ", "JWT");

            // ── Video grant claim ─────────────────────────────────────────
            ObjectNode video = mapper.createObjectNode();
            video.put("room",            meetingId);
            video.put("roomJoin",        true);
            video.put("canPublish",      true);
            video.put("canSubscribe",    true);
            video.put("canPublishData",  true);

            // ── Payload ───────────────────────────────────────────────────
            long now = System.currentTimeMillis() / 1000L;
            long ttl = 6 * 60 * 60L; // 6 hours

            ObjectNode payload = mapper.createObjectNode();
            payload.put("iss",  apiKey);
            payload.put("sub",  identity);
            payload.put("iat",  now);
            payload.put("exp",  now + ttl);
            payload.put("name", name);
            payload.set("video", video);

            // ── Encode header.payload ─────────────────────────────────────
            String encodedHeader  = base64url(mapper.writeValueAsBytes(header));
            String encodedPayload = base64url(mapper.writeValueAsBytes(payload));
            String signingInput   = encodedHeader + "." + encodedPayload;

            // ── Sign with raw HMAC-SHA256 (no key wrapping) ───────────────
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(
                    apiSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] sig = mac.doFinal(signingInput.getBytes(StandardCharsets.UTF_8));

            String jwt = signingInput + "." + base64url(sig);

            log.info("✅ LiveKit token issued for {} in room {}", identity, meetingId);
            return ResponseEntity.ok(Map.of("token", jwt, "url", livekitUrl));

        } catch (Exception e) {
            log.error("❌ LiveKit token error: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /** URL-safe Base64 without padding — required by JWT spec. */
    private static String base64url(byte[] data) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(data);
    }
}