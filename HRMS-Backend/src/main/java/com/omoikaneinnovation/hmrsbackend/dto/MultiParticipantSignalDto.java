package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for multi-participant WebRTC signaling
 * Extends CallSignalDto for group meetings
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MultiParticipantSignalDto {

    private String meetingId;           // Meeting identifier
    private String roomId;              // Room identifier
    private String fromEmail;           // Sender email
    private String toEmail;             // Recipient email (null for broadcast)

    private String action;              // OFFER, ANSWER, ICE_CANDIDATE, etc.
    private String type;                // AUDIO, VIDEO, SCREEN

    // WebRTC SDP and ICE
    private String sdp;                 // Session Description Protocol
    private String candidate;           // ICE candidate
    private String sdpMid;              // Media stream identification
    private Integer sdpMLineIndex;      // Media line index

    // Media state
    private Boolean audioEnabled;
    private Boolean videoEnabled;
    private Boolean screenShareEnabled;

    // Metadata
    private Long timestamp;
    private String connectionState;
    private String iceConnectionState;

    // For broadcast messages
    private String messageType;         // PARTICIPANT_JOINED, PARTICIPANT_LEFT, MEDIA_STATE_CHANGED, etc.
}
