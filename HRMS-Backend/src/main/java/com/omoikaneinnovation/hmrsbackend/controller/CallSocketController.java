package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.CallSignalDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * WebSocket controller for all call signaling.
 * Handles 1-on-1 and multi-participant calls, reactions, waiting room, and recording.
 */
@Controller
@Slf4j
@RequiredArgsConstructor
public class CallSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    // ── Active group call rooms: callId -> Set<participantEmail> ──────────────
    private final Map<String, Set<String>> activeGroupCalls = new ConcurrentHashMap<>();

    // ── Waiting rooms: callId -> Set<waitingEmail> ────────────────────────────
    private final Map<String, Set<String>> waitingRooms = new ConcurrentHashMap<>();

    // ── Recording state: callId -> isRecording ────────────────────────────────
    private final Map<String, Boolean> recordingState = new ConcurrentHashMap<>();

    /**
     * Main call signal handler.
     * Routes all call-related signals between participants.
     * Endpoint: /app/call.signal
     */
    @MessageMapping("/call.signal")
    public void handleCallSignal(@Payload CallSignalDto dto) {
        if (dto.getFromEmail() == null || dto.getToEmail() == null) {
            log.warn("❌ Call signal rejected: missing email addresses");
            return;
        }

        String fromEmail = dto.getFromEmail().trim().toLowerCase();
        String toEmail   = dto.getToEmail().trim().toLowerCase();
        dto.setFromEmail(fromEmail);
        dto.setToEmail(toEmail);
        dto.setTimestamp(System.currentTimeMillis());

        log.info("📞 Signal: {} -> {} | Action: {} | Type: {}",
                fromEmail, toEmail, dto.getAction(), dto.getType());

        try {
            switch (dto.getAction()) {

                // ── Call lifecycle ─────────────────────────────────────────────
                case "CALL" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    // Track participant in group call
                    activeGroupCalls.computeIfAbsent(dto.getCallId(), k -> ConcurrentHashMap.newKeySet()).add(fromEmail);
                }

                case "ACCEPT" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    messagingTemplate.convertAndSendToUser(fromEmail, "/queue/call", dto);
                    // Add acceptor to group call
                    if (dto.getCallId() != null) {
                        activeGroupCalls.computeIfAbsent(dto.getCallId(), k -> ConcurrentHashMap.newKeySet()).add(fromEmail);
                        // Remove from waiting room if present
                        Set<String> waiting = waitingRooms.get(dto.getCallId());
                        if (waiting != null) waiting.remove(fromEmail);
                    }
                }

                case "REJECT", "END" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    messagingTemplate.convertAndSendToUser(fromEmail, "/queue/call", dto);
                    // Clean up group call tracking on END
                    if ("END".equals(dto.getAction()) && dto.getCallId() != null) {
                        Set<String> participants = activeGroupCalls.get(dto.getCallId());
                        if (participants != null) {
                            participants.remove(fromEmail);
                            if (participants.isEmpty()) {
                                activeGroupCalls.remove(dto.getCallId());
                                waitingRooms.remove(dto.getCallId());
                                recordingState.remove(dto.getCallId());
                            }
                        }
                    }
                }

                // ── WebRTC signaling (unicast only, no echo to sender) ─────────
                case "OFFER", "ANSWER", "ICE_CANDIDATE" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                }

                // ── Participant management ─────────────────────────────────────
                case "ADD_PARTICIPANT" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    messagingTemplate.convertAndSendToUser(fromEmail, "/queue/call", dto);
                }

                case "PARTICIPANT_JOINED" -> {
                    // Broadcast to all participants in the call
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                    activeGroupCalls.computeIfAbsent(dto.getCallId(), k -> ConcurrentHashMap.newKeySet()).add(fromEmail);
                }

                case "PARTICIPANT_LEFT" -> {
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                    Set<String> participants = activeGroupCalls.get(dto.getCallId());
                    if (participants != null) participants.remove(fromEmail);
                }

                case "REMOVE_PARTICIPANT", "HOST_MUTE" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                }

                // ── Media state ────────────────────────────────────────────────
                case "MUTE_STATE", "VIDEO_STATE" -> {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                }

                // ── Raise hand ─────────────────────────────────────────────────
                case "RAISE_HAND" -> {
                    if (dto.getToEmail() != null && !dto.getToEmail().isBlank()) {
                        messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    } else {
                        broadcastToCall(dto.getCallId(), fromEmail, dto);
                    }
                }

                // ── Active speaker ─────────────────────────────────────────────
                case "SPEAKING" -> {
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                }

                // ── Reactions (Phase 2) ────────────────────────────────────────
                case "REACTION" -> {
                    log.info("😊 Reaction from {}: {}", fromEmail, dto.getData());
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                }

                // ── Waiting room (Phase 2) ─────────────────────────────────────
                case "WAITING_ROOM_JOIN" -> {
                    log.info("⏳ {} joined waiting room for call {}", fromEmail, dto.getCallId());
                    waitingRooms.computeIfAbsent(dto.getCallId(), k -> ConcurrentHashMap.newKeySet()).add(fromEmail);
                    // Notify host
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                }

                case "WAITING_ROOM_ADMIT" -> {
                    log.info("✅ {} admitted from waiting room to call {}", toEmail, dto.getCallId());
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    messagingTemplate.convertAndSendToUser(fromEmail, "/queue/call", dto);
                    Set<String> waiting = waitingRooms.get(dto.getCallId());
                    if (waiting != null) waiting.remove(toEmail);
                }

                case "WAITING_ROOM_DENY" -> {
                    log.info("❌ {} denied from waiting room for call {}", toEmail, dto.getCallId());
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                    Set<String> waiting = waitingRooms.get(dto.getCallId());
                    if (waiting != null) waiting.remove(toEmail);
                }

                // ── Recording (Phase 2) ────────────────────────────────────────
                case "RECORDING_STARTED" -> {
                    log.info("🔴 Recording started for call {} by {}", dto.getCallId(), fromEmail);
                    recordingState.put(dto.getCallId(), true);
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                }

                case "RECORDING_STOPPED" -> {
                    log.info("⏹ Recording stopped for call {} by {}", dto.getCallId(), fromEmail);
                    recordingState.put(dto.getCallId(), false);
                    broadcastToCall(dto.getCallId(), fromEmail, dto);
                }

                default -> {
                    log.warn("❓ Unknown call signal action: {}", dto.getAction());
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call", dto);
                }
            }

            log.debug("✅ Signal '{}' forwarded successfully", dto.getAction());

        } catch (Exception e) {
            log.error("❌ Error forwarding call signal: {}", e.getMessage(), e);
        }
    }

    /**
     * In-call chat message handler.
     * Receives ONE message from sender and broadcasts to ALL other participants.
     * The sender is NEVER sent their own message back (no echo).
     * Endpoint: /app/call.chat.send
     */
    @MessageMapping("/call.chat.send")
    public void handleCallChatMessage(@Payload String payload) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode json = mapper.readTree(payload);

            String fromEmail = json.get("fromEmail").asText().trim().toLowerCase();
            String message   = json.get("message").asText();
            String callId    = json.has("callId") ? json.get("callId").asText() : "";
            String fromName  = json.has("fromName") ? json.get("fromName").asText() : fromEmail;
            long   timestamp = System.currentTimeMillis();

            if (message == null || message.isBlank()) {
                log.warn("⚠️ Empty call chat message ignored");
                return;
            }

            log.info("💬 Call chat from {} ({}) | CallId: {}", fromName, fromEmail, callId);

            com.fasterxml.jackson.databind.node.ObjectNode chatPayload = mapper.createObjectNode()
                    .put("fromEmail", fromEmail)
                    .put("fromName", fromName)
                    .put("message", message)
                    .put("callId", callId)
                    .put("timestamp", timestamp);

            String chatPayloadStr = chatPayload.toString();

            // Broadcast to ALL participants EXCEPT the sender (no echo to self)
            Set<String> participants = activeGroupCalls.get(callId);
            if (participants != null && !participants.isEmpty()) {
                participants.stream()
                        .filter(p -> !p.equals(fromEmail))
                        .forEach(p -> {
                            messagingTemplate.convertAndSendToUser(p, "/queue/call-chat", chatPayloadStr);
                            log.debug("💬 Chat delivered to: {}", p);
                        });
                log.info("✅ Chat from {} broadcasted to {} recipients", fromName,
                        participants.stream().filter(p -> !p.equals(fromEmail)).count());
            } else {
                // Fallback for 1-on-1: send to toEmail if provided
                String toEmail = json.has("toEmail") ? json.get("toEmail").asText().trim().toLowerCase() : null;
                if (toEmail != null && !toEmail.equals(fromEmail)) {
                    messagingTemplate.convertAndSendToUser(toEmail, "/queue/call-chat", chatPayloadStr);
                    log.info("✅ Chat (1-on-1) delivered to {}", toEmail);
                }
            }

        } catch (Exception e) {
            log.error("❌ Error handling call chat: {}", e.getMessage(), e);
        }
    }

    /**
     * Get participants in a call (REST-like via WebSocket).
     * Endpoint: /app/call.participants
     */
    @MessageMapping("/call.participants")
    public void getCallParticipants(@Payload CallSignalDto dto) {
        String callId = dto.getCallId();
        if (callId == null) return;

        Set<String> participants = activeGroupCalls.getOrDefault(callId, Collections.emptySet());
        Set<String> waiting      = waitingRooms.getOrDefault(callId, Collections.emptySet());
        Boolean recording        = recordingState.getOrDefault(callId, false);

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.node.ObjectNode response = mapper.createObjectNode();
            response.put("callId", callId);
            response.put("participantCount", participants.size());
            response.put("isRecording", recording);
            response.set("participants", mapper.valueToTree(participants));
            response.set("waitingRoom", mapper.valueToTree(waiting));

            messagingTemplate.convertAndSendToUser(
                    dto.getFromEmail().trim().toLowerCase(),
                    "/queue/call-info",
                    response.toString()
            );
        } catch (Exception e) {
            log.error("❌ Error sending call participants: {}", e.getMessage(), e);
        }
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    /**
     * Broadcast a signal to all participants in a call except the sender.
     */
    private void broadcastToCall(String callId, String senderEmail, CallSignalDto dto) {
        if (callId == null) return;
        Set<String> participants = activeGroupCalls.get(callId);
        if (participants == null || participants.isEmpty()) return;

        participants.stream()
                .filter(p -> !p.equals(senderEmail))
                .forEach(p -> {
                    try {
                        messagingTemplate.convertAndSendToUser(p, "/queue/call", dto);
                    } catch (Exception e) {
                        log.warn("⚠️ Failed to broadcast to {}: {}", p, e.getMessage());
                    }
                });
    }
}
