package com.omoikaneinnovation.hmrsbackend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

/**
 * DTO for meeting room information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRoomDto {

    private String id;
    private String meetingId;
    private String roomCode;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant startedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant endedAt;

    private String status;              // ACTIVE, ENDED, PAUSED

    private List<ParticipantStatusDto> participants;

    private Boolean isRecording;
    private String recordingUrl;

    private Integer participantCount;
}
