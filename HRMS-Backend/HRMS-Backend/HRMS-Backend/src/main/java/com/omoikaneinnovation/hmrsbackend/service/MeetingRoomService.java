package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.dto.MeetingRoomDto;
import com.omoikaneinnovation.hmrsbackend.dto.ParticipantStatusDto;
import com.omoikaneinnovation.hmrsbackend.model.MeetingRoom;
import com.omoikaneinnovation.hmrsbackend.repository.MeetingRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MeetingRoomService {

    private final MeetingRoomRepository meetingRoomRepository;

    /**
     * Create or get existing active room for a meeting.
     * If an active room exists, clear any stale participants (leftAt == null
     * from a previous crashed session) before returning it.
     */
    public MeetingRoom createOrGetRoom(String meetingId) {
        log.info("🔍 Looking for active room for meeting: {}", meetingId);

        Optional<MeetingRoom> existingRoom = meetingRoomRepository.findByMeetingIdAndStatus(meetingId, "ACTIVE");
        if (existingRoom.isPresent()) {
            MeetingRoom room = existingRoom.get();
            // Clear stale participants — anyone whose leftAt is null but the server
            // restarted or they disconnected without sending meeting.leave.
            boolean hadStale = room.getParticipants().stream()
                    .anyMatch(p -> p.getLeftAt() == null);
            if (hadStale) {
                log.info("🧹 Clearing {} stale participant(s) from room {}",
                        room.getParticipants().stream().filter(p -> p.getLeftAt() == null).count(),
                        room.getId());
                room.getParticipants().stream()
                        .filter(p -> p.getLeftAt() == null)
                        .forEach(p -> {
                            p.setLeftAt(Instant.now());
                            p.setConnectionState("DISCONNECTED");
                        });
                room = meetingRoomRepository.save(room);
            }
            log.info("✅ Reusing active room: {}", room.getId());
            return room;
        }

        log.info("📝 Creating new meeting room for meeting: {}", meetingId);
        MeetingRoom room = MeetingRoom.builder()
                .meetingId(meetingId)
                .roomCode(generateRoomCode())
                .createdAt(Instant.now())
                .startedAt(Instant.now())
                .status("ACTIVE")
                .isRecording(false)
                .build();

        MeetingRoom savedRoom = meetingRoomRepository.save(room);
        log.info("✅ Meeting room created: {} with code: {}", savedRoom.getId(), savedRoom.getRoomCode());
        return savedRoom;
    }

    /**
     * Add participant to room
     */
    public MeetingRoom addParticipant(String roomId, String email, String displayName) {
        log.info("👤 Adding participant {} to room {}", email, roomId);

        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        // Check if participant already exists
        boolean exists = room.getParticipants().stream()
                .anyMatch(p -> p.getEmail().equalsIgnoreCase(email) && p.getLeftAt() == null);

        if (exists) {
            log.warn("⚠️ Participant {} already in room {}", email, roomId);
            return room;
        }

        // Add new participant
        MeetingRoom.ParticipantRecord participant = MeetingRoom.ParticipantRecord.builder()
                .email(email.toLowerCase())
                .displayName(displayName)
                .joinedAt(Instant.now())
                .audioEnabled(true)
                .videoEnabled(true)
                .screenShareEnabled(false)
                .connectionState("CONNECTING")
                .iceConnectionState("NEW")
                .build();

        room.getParticipants().add(participant);
        MeetingRoom updatedRoom = meetingRoomRepository.save(room);

        log.info("✅ Participant {} added to room {}. Total participants: {}", 
                email, roomId, updatedRoom.getParticipants().size());

        return updatedRoom;
    }

    /**
     * Remove participant from room
     */
    public MeetingRoom removeParticipant(String roomId, String email) {
        log.info("👤 Removing participant {} from room {}", email, roomId);

        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        room.getParticipants().stream()
                .filter(p -> p.getEmail().equalsIgnoreCase(email) && p.getLeftAt() == null)
                .forEach(p -> {
                    p.setLeftAt(Instant.now());
                    if (p.getJoinedAt() != null) {
                        long duration = Instant.now().toEpochMilli() - p.getJoinedAt().toEpochMilli();
                        p.setTotalDuration(duration);
                    }
                    p.setConnectionState("DISCONNECTED");
                });

        MeetingRoom updatedRoom = meetingRoomRepository.save(room);
        log.info("✅ Participant {} removed from room {}. Active participants: {}", 
                email, roomId, getActiveParticipantCount(updatedRoom));

        // End room if no active participants
        if (getActiveParticipantCount(updatedRoom) == 0) {
            endRoom(roomId);
        }

        return updatedRoom;
    }

    /**
     * Update participant media state
     */
    public MeetingRoom updateParticipantMediaState(String roomId, String email, 
                                                   Boolean audioEnabled, Boolean videoEnabled, 
                                                   Boolean screenShareEnabled) {
        log.info("🎙️ Updating media state for {} in room {}: audio={}, video={}, screen={}", 
                email, roomId, audioEnabled, videoEnabled, screenShareEnabled);

        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        room.getParticipants().stream()
                .filter(p -> p.getEmail().equalsIgnoreCase(email) && p.getLeftAt() == null)
                .forEach(p -> {
                    if (audioEnabled != null) p.setAudioEnabled(audioEnabled);
                    if (videoEnabled != null) p.setVideoEnabled(videoEnabled);
                    if (screenShareEnabled != null) p.setScreenShareEnabled(screenShareEnabled);
                });

        MeetingRoom updatedRoom = meetingRoomRepository.save(room);
        log.info("✅ Media state updated for {}", email);

        return updatedRoom;
    }

    /**
     * Update participant connection state
     */
    public MeetingRoom updateParticipantConnectionState(String roomId, String email, 
                                                        String connectionState, String iceConnectionState) {
        log.info("🔗 Updating connection state for {} in room {}: connection={}, ice={}", 
                email, roomId, connectionState, iceConnectionState);

        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        room.getParticipants().stream()
                .filter(p -> p.getEmail().equalsIgnoreCase(email) && p.getLeftAt() == null)
                .forEach(p -> {
                    if (connectionState != null) p.setConnectionState(connectionState);
                    if (iceConnectionState != null) p.setIceConnectionState(iceConnectionState);
                });

        MeetingRoom updatedRoom = meetingRoomRepository.save(room);
        return updatedRoom;
    }

    /**
     * Get all active participants in room
     */
    public List<ParticipantStatusDto> getActiveParticipants(String roomId) {
        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        return room.getParticipants().stream()
                .filter(p -> p.getLeftAt() == null)
                .map(this::toParticipantStatusDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active participant count
     */
    public int getActiveParticipantCount(MeetingRoom room) {
        return (int) room.getParticipants().stream()
                .filter(p -> p.getLeftAt() == null)
                .count();
    }

    /**
     * End meeting room
     */
    public MeetingRoom endRoom(String roomId) {
        log.info("🛑 Ending meeting room: {}", roomId);

        MeetingRoom room = meetingRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        room.setStatus("ENDED");
        room.setEndedAt(Instant.now());

        // Mark all participants as left if not already
        room.getParticipants().stream()
                .filter(p -> p.getLeftAt() == null)
                .forEach(p -> {
                    p.setLeftAt(Instant.now());
                    if (p.getJoinedAt() != null) {
                        long duration = Instant.now().toEpochMilli() - p.getJoinedAt().toEpochMilli();
                        p.setTotalDuration(duration);
                    }
                });

        MeetingRoom updatedRoom = meetingRoomRepository.save(room);
        log.info("✅ Meeting room ended: {}", roomId);

        return updatedRoom;
    }

    /**
     * Get room by ID
     */
    public Optional<MeetingRoom> getRoom(String roomId) {
        return meetingRoomRepository.findById(roomId);
    }

    /**
     * Get room by meeting ID
     */
    public Optional<MeetingRoom> getRoomByMeetingId(String meetingId) {
        return meetingRoomRepository.findByMeetingIdAndStatus(meetingId, "ACTIVE");
    }

    /**
     * Convert MeetingRoom to DTO
     */
    public MeetingRoomDto toMeetingRoomDto(MeetingRoom room) {
        List<ParticipantStatusDto> participants = room.getParticipants().stream()
                .filter(p -> p.getLeftAt() == null)
                .map(this::toParticipantStatusDto)
                .collect(Collectors.toList());

        return MeetingRoomDto.builder()
                .id(room.getId())
                .meetingId(room.getMeetingId())
                .roomCode(room.getRoomCode())
                .createdAt(room.getCreatedAt())
                .startedAt(room.getStartedAt())
                .endedAt(room.getEndedAt())
                .status(room.getStatus())
                .participants(participants)
                .participantCount(participants.size())
                .isRecording(room.getIsRecording())
                .recordingUrl(room.getRecordingUrl())
                .build();
    }

    /**
     * Convert ParticipantRecord to DTO
     */
    private ParticipantStatusDto toParticipantStatusDto(MeetingRoom.ParticipantRecord record) {
        long duration = 0;
        if (record.getJoinedAt() != null) {
            Instant endTime = record.getLeftAt() != null ? record.getLeftAt() : Instant.now();
            duration = endTime.toEpochMilli() - record.getJoinedAt().toEpochMilli();
        }

        return ParticipantStatusDto.builder()
                .email(record.getEmail())
                .displayName(record.getDisplayName())
                .audioEnabled(record.getAudioEnabled())
                .videoEnabled(record.getVideoEnabled())
                .screenShareEnabled(record.getScreenShareEnabled())
                .connectionState(record.getConnectionState())
                .iceConnectionState(record.getIceConnectionState())
                .joinedAt(record.getJoinedAt())
                .duration(duration)
                .build();
    }

    /**
     * Generate unique room code
     */
    private String generateRoomCode() {
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
