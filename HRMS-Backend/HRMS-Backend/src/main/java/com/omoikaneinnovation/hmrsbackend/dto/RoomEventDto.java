package com.omoikaneinnovation.hmrsbackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * DTO for room events (participant joined/left, media state changes, etc.)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomEventDto {

    private String eventType;           // PARTICIPANT_JOINED, PARTICIPANT_LEFT, MEDIA_STATE_CHANGED, ROOM_CREATED, ROOM_ENDED

    private String meetingId;
    private String roomId;

    private String participantEmail;
    private String participantName;

    // For media state changes
    private String mediaType;           // AUDIO, VIDEO, SCREEN
    private Boolean enabled;

    // For hand-raise events
    private Boolean handRaised;

    // List of current participants
    private List<ParticipantStatusDto> participants;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant timestamp;

    private String message;             // Optional message
}
