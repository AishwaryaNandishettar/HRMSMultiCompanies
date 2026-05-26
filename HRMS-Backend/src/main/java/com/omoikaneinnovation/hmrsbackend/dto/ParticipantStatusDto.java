package com.omoikaneinnovation.hmrsbackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * DTO for participant status in a meeting room
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipantStatusDto {

    private String email;
    private String displayName;

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

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant joinedAt;

    private Long duration;  // Duration in milliseconds since joined
}
