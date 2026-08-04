package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.dto.MeetingChatMessageDto;
import com.omoikaneinnovation.hmrsbackend.dto.MultiParticipantSignalDto;
import com.omoikaneinnovation.hmrsbackend.dto.ParticipantStatusDto;
import com.omoikaneinnovation.hmrsbackend.dto.RoomEventDto;
import com.omoikaneinnovation.hmrsbackend.model.MeetingRoom;
import com.omoikaneinnovation.hmrsbackend.service.MeetingRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import jakarta.validation.Valid;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * WebSocket controller for multi-participant meeting rooms
 * Handles joining, leaving, signaling, and media state management
 */
@Controller
@Slf4j
@RequiredArgsConstructor
public class MeetingRoomSocketController {

    private final MeetingRoomService meetingRoomService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Join a meeting room
     * Endpoint: /app/meeting.join
     */
    @MessageMapping("/meeting.join")
    public void joinMeeting(@Payload JoinMeetingRequest request) {
        log.info("👤 Join meeting request: {} joining meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            // Create or get existing room
            MeetingRoom room = meetingRoomService.createOrGetRoom(request.getMeetingId());

            // Add participant to room
            meetingRoomService.addParticipant(
                    room.getId(),
                    request.getUserEmail(),
                    request.getDisplayName()
            );

            // Get list of existing participants (excluding the new one)
            List<ParticipantStatusDto> existingParticipants = meetingRoomService.getActiveParticipants(room.getId())
                    .stream()
                    .filter(p -> !p.getEmail().equalsIgnoreCase(request.getUserEmail()))
                    .toList();

            // Send room info to the joining participant
            RoomEventDto roomJoinedEvent = RoomEventDto.builder()
                    .eventType("ROOM_JOINED")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .participants(existingParticipants)
                    .timestamp(Instant.now())
                    .message("Successfully joined meeting room")
                    .build();

            messagingTemplate.convertAndSendToUser(
                    request.getUserEmail(),
                    "/queue/meeting-events",
                    roomJoinedEvent
            );

            // Notify existing participants about the new joiner.
            // Send ONLY to participants who were already in the room (not the joiner).
            // This prevents the joiner from receiving their own PARTICIPANT_JOINED event.
            existingParticipants.forEach(p ->
                messagingTemplate.convertAndSendToUser(
                        p.getEmail(),
                        "/queue/meeting-events",
                        RoomEventDto.builder()
                                .eventType("PARTICIPANT_JOINED")
                                .meetingId(request.getMeetingId())
                                .roomId(room.getId())
                                .participantEmail(request.getUserEmail())
                                .participantName(request.getDisplayName())
                                .participants(meetingRoomService.getActiveParticipants(room.getId()))
                                .timestamp(Instant.now())
                                .build()
                )
            );

            log.info("✅ Participant {} joined meeting room {}", request.getUserEmail(), room.getId());

        } catch (Exception e) {
            log.error("❌ Error joining meeting: {}", e.getMessage(), e);
            sendErrorToUser(request.getUserEmail(), "Failed to join meeting: " + e.getMessage());
        }
    }

    /**
     * Leave a meeting room
     * Endpoint: /app/meeting.leave
     */
    @MessageMapping("/meeting.leave")
    public void leaveMeeting(@Payload LeaveMeetingRequest request) {
        log.info("👤 Leave meeting request: {} leaving meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            // Get room
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(request.getMeetingId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Remove participant
            meetingRoomService.removeParticipant(room.getId(), request.getUserEmail());

            // Notify other participants
            RoomEventDto participantLeftEvent = RoomEventDto.builder()
                    .eventType("PARTICIPANT_LEFT")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .participants(meetingRoomService.getActiveParticipants(room.getId()))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    participantLeftEvent
            );

            log.info("✅ Participant {} left meeting room {}", request.getUserEmail(), room.getId());

        } catch (Exception e) {
            log.error("❌ Error leaving meeting: {}", e.getMessage(), e);
        }
    }

    /**
     * Send WebRTC signal (OFFER, ANSWER, ICE_CANDIDATE)
     * Endpoint: /app/meeting.signal
     */
    @MessageMapping("/meeting.signal")
    public void handleSignal(@Payload MultiParticipantSignalDto signal) {
        log.info("📡 Signal received: {} -> {} | Action: {} | Type: {}", 
                signal.getFromEmail(), signal.getToEmail(), signal.getAction(), signal.getType());

        try {
            signal.setTimestamp(System.currentTimeMillis());

            if (signal.getToEmail() != null) {
                // Unicast signal to specific participant
                log.info("📤 Sending signal to: {}", signal.getToEmail());
                messagingTemplate.convertAndSendToUser(
                        signal.getToEmail(),
                        "/queue/meeting-signals",
                        signal
                );
            } else {
                // Broadcast signal to all participants in meeting
                log.info("📢 Broadcasting signal to meeting: {}", signal.getMeetingId());
                messagingTemplate.convertAndSend(
                        "/topic/meeting/" + signal.getMeetingId(),
                        signal
                );
            }

            log.info("✅ Signal forwarded successfully");

        } catch (Exception e) {
            log.error("❌ Error forwarding signal: {}", e.getMessage(), e);
        }
    }

    /**
     * Toggle audio
     * Endpoint: /app/meeting.toggleAudio
     */
    @MessageMapping("/meeting.toggleAudio")
    public void toggleAudio(@Payload MediaStateRequest request) {
        log.info("🎙️ Toggle audio: {} in meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(request.getMeetingId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            meetingRoomService.updateParticipantMediaState(
                    room.getId(),
                    request.getUserEmail(),
                    request.getAudioEnabled(),
                    null,
                    null
            );

            // Notify all participants
            RoomEventDto mediaStateEvent = RoomEventDto.builder()
                    .eventType("MEDIA_STATE_CHANGED")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .mediaType("AUDIO")
                    .enabled(request.getAudioEnabled())
                    .participants(meetingRoomService.getActiveParticipants(room.getId()))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    mediaStateEvent
            );

            log.info("✅ Audio toggled for {}", request.getUserEmail());

        } catch (Exception e) {
            log.error("❌ Error toggling audio: {}", e.getMessage(), e);
        }
    }

    /**
     * Toggle video
     * Endpoint: /app/meeting.toggleVideo
     */
    @MessageMapping("/meeting.toggleVideo")
    public void toggleVideo(@Payload MediaStateRequest request) {
        log.info("📹 Toggle video: {} in meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(request.getMeetingId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            meetingRoomService.updateParticipantMediaState(
                    room.getId(),
                    request.getUserEmail(),
                    null,
                    request.getVideoEnabled(),
                    null
            );

            // Notify all participants
            RoomEventDto mediaStateEvent = RoomEventDto.builder()
                    .eventType("MEDIA_STATE_CHANGED")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .mediaType("VIDEO")
                    .enabled(request.getVideoEnabled())
                    .participants(meetingRoomService.getActiveParticipants(room.getId()))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    mediaStateEvent
            );

            log.info("✅ Video toggled for {}", request.getUserEmail());

        } catch (Exception e) {
            log.error("❌ Error toggling video: {}", e.getMessage(), e);
        }
    }

    /**
     * Start screen sharing
     * Endpoint: /app/meeting.startScreenShare
     */
    @MessageMapping("/meeting.startScreenShare")
    public void startScreenShare(@Payload ScreenShareRequest request) {
        log.info("🖥️ Start screen share: {} in meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(request.getMeetingId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            meetingRoomService.updateParticipantMediaState(
                    room.getId(),
                    request.getUserEmail(),
                    null,
                    null,
                    true
            );

            // Notify all participants
            RoomEventDto screenShareEvent = RoomEventDto.builder()
                    .eventType("SCREEN_SHARE_STARTED")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .participantName(request.getDisplayName())
                    .participants(meetingRoomService.getActiveParticipants(room.getId()))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    screenShareEvent
            );

            log.info("✅ Screen share started for {}", request.getUserEmail());

        } catch (Exception e) {
            log.error("❌ Error starting screen share: {}", e.getMessage(), e);
        }
    }

    /**
     * Stop screen sharing
     * Endpoint: /app/meeting.stopScreenShare
     */
    @MessageMapping("/meeting.stopScreenShare")
    public void stopScreenShare(@Payload ScreenShareRequest request) {
        log.info("🖥️ Stop screen share: {} in meeting {}", request.getUserEmail(), request.getMeetingId());

        try {
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(request.getMeetingId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            meetingRoomService.updateParticipantMediaState(
                    room.getId(),
                    request.getUserEmail(),
                    null,
                    null,
                    false
            );

            // Notify all participants
            RoomEventDto screenShareEvent = RoomEventDto.builder()
                    .eventType("SCREEN_SHARE_STOPPED")
                    .meetingId(request.getMeetingId())
                    .roomId(room.getId())
                    .participantEmail(request.getUserEmail())
                    .participants(meetingRoomService.getActiveParticipants(room.getId()))
                    .timestamp(Instant.now())
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    screenShareEvent
            );

            log.info("✅ Screen share stopped for {}", request.getUserEmail());

        } catch (Exception e) {
            log.error("❌ Error stopping screen share: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle chat message in meeting
     * Endpoint: /app/meeting.chat
     */
    @MessageMapping("/meeting.chat")
    public void handleChatMessage(@Payload @Valid MeetingChatMessageDto chatMessage) {
        log.info("📨 Chat message in meeting {} from {}: {}", 
            chatMessage.getMeetingId(), 
            chatMessage.getSenderEmail(), 
            chatMessage.getMessage());
        
        try {
            // Validate message
            if (chatMessage.getMeetingId() == null || chatMessage.getMeetingId().trim().isEmpty()) {
                log.error("❌ Meeting ID is null or empty");
                return;
            }
            
            if (chatMessage.getMessage() == null || chatMessage.getMessage().trim().isEmpty()) {
                log.error("❌ Message is empty");
                return;
            }
            
            // Set timestamp if not provided
            if (chatMessage.getTimestamp() == null || chatMessage.getTimestamp().isEmpty()) {
                chatMessage.setTimestamp(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            }
            
            // Verify meeting room exists
            MeetingRoom room = meetingRoomService.getRoomByMeetingId(chatMessage.getMeetingId())
                    .orElse(null);
            
            if (room == null) {
                log.warn("⚠️ Meeting room not found for meeting {}, but allowing chat message", 
                    chatMessage.getMeetingId());
            }
            
            // Broadcast message to all participants in the meeting
            messagingTemplate.convertAndSend(
                "/topic/meeting/" + chatMessage.getMeetingId() + "/chat",
                chatMessage
            );
            
            log.info("✅ Chat message broadcasted to meeting {}", chatMessage.getMeetingId());
            
        } catch (Exception e) {
            log.error("❌ Error handling chat message: {}", e.getMessage(), e);
        }
    }

    /**
     * Send error message to user
     */
    private void sendErrorToUser(String email, String message) {
        try {
            messagingTemplate.convertAndSendToUser(
                    email,
                    "/queue/errors",
                    message
            );
        } catch (Exception e) {
            log.error("Failed to send error message: {}", e.getMessage());
        }
    }

    /**
     * Raise / lower hand — broadcasts HAND_RAISE_CHANGED to all participants in the meeting.
     * Endpoint: /app/meeting.raiseHand
     */
    @MessageMapping("/meeting.raiseHand")
    public void raiseHand(@Payload RaiseHandRequest request) {
        log.info("✋ Hand raise: {} in meeting {} -> {}", request.getUserEmail(), request.getMeetingId(), request.getHandRaised());

        try {
            RoomEventDto event = RoomEventDto.builder()
                    .eventType("HAND_RAISE_CHANGED")
                    .meetingId(request.getMeetingId())
                    .participantEmail(request.getUserEmail())
                    .handRaised(request.getHandRaised())
                    .timestamp(Instant.now())
                    .build();

            // Broadcast to everyone in the meeting room (including the raiser so they get confirmation)
            messagingTemplate.convertAndSend(
                    "/topic/meeting/" + request.getMeetingId(),
                    event
            );

            log.info("✅ Hand raise broadcast for {} in meeting {}", request.getUserEmail(), request.getMeetingId());
        } catch (Exception e) {
            log.error("❌ Error broadcasting hand raise: {}", e.getMessage(), e);
        }
    }

    // ==================== Request DTOs ====================

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class JoinMeetingRequest {
        private String meetingId;
        private String userEmail;
        private String displayName;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class LeaveMeetingRequest {
        private String meetingId;
        private String userEmail;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class MediaStateRequest {
        private String meetingId;
        private String userEmail;
        private Boolean audioEnabled;
        private Boolean videoEnabled;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ScreenShareRequest {
        private String meetingId;
        private String userEmail;
        private String displayName;
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RaiseHandRequest {
        private String meetingId;
        private String userEmail;
        private Boolean handRaised;
    }
}
