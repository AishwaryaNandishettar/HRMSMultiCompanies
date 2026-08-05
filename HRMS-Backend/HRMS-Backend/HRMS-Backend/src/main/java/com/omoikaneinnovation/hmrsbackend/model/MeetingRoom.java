package com.omoikaneinnovation.hmrsbackend.model;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "meeting_rooms")
public class MeetingRoom {

    @Id
    private String id;

    private String meetingId;           // Reference to Meeting document
    private String roomCode;            // Unique room identifier

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant startedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant endedAt;

    @Builder.Default
    private String status = "ACTIVE";   // ACTIVE, ENDED, PAUSED

    @Builder.Default
    private List<ParticipantRecord> participants = new ArrayList<>();

    private String recordingUrl;        // URL to recording if recorded
    private Boolean isRecording;        // Recording status

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ParticipantRecord {
        private String email;
        private String displayName;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        private Instant joinedAt;

        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        private Instant leftAt;

        @Builder.Default
        private Boolean audioEnabled = true;

        @Builder.Default
        private Boolean videoEnabled = true;

        @Builder.Default
        private Boolean screenShareEnabled = false;

        @Builder.Default
        private String connectionState = "CONNECTING";  // CONNECTING, CONNECTED, DISCONNECTED

        @Builder.Default
        private String iceConnectionState = "NEW";      // NEW, CHECKING, CONNECTED, COMPLETED, FAILED, DISCONNECTED, CLOSED

        private Long totalDuration;                      // Duration in milliseconds
    }
}
