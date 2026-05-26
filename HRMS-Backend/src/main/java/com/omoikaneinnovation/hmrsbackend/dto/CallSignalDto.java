package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CallSignalDto {

    private String fromEmail;
    private String toEmail;
    private String fromName;        // Display name of the sender

    private String type;
    // "VOICE" | "VIDEO"

    private String action;
    // "CALL" | "ACCEPT" | "REJECT" | "END" | "OFFER" | "ANSWER" | "ICE_CANDIDATE"
    // "ADD_PARTICIPANT" | "PARTICIPANT_JOINED" | "PARTICIPANT_LEFT"
    // "REACTION" | "RAISE_HAND" | "MUTE_STATE" | "VIDEO_STATE"
    // "HOST_MUTE" | "REMOVE_PARTICIPANT" | "SPEAKING"
    // "WAITING_ROOM_JOIN" | "WAITING_ROOM_ADMIT" | "WAITING_ROOM_DENY"
    // "RECORDING_STARTED" | "RECORDING_STOPPED"

    private String data;
    // SDP / ICE candidate / reaction emoji (for WebRTC or reactions)

    // Enhanced WebRTC fields
    private String callId;              // Unique call identifier
    private String sdp;                 // Session Description Protocol
    private String candidate;           // ICE candidate
    private String sdpMid;              // Media stream identification
    private Integer sdpMLineIndex;      // Media line index
    private Long timestamp;             // For call tracking
    private String connectionState;     // WebRTC connection state
    private Object participant;         // Participant info for ADD_PARTICIPANT action

    // Multi-participant fields
    private List<String> existingParticipants; // All current members (sent with ADD_PARTICIPANT)
    private Boolean audioEnabled;       // For MUTE_STATE signal
    private Boolean videoEnabled;       // For VIDEO_STATE signal
    private Boolean handRaised;         // For RAISE_HAND signal
}
