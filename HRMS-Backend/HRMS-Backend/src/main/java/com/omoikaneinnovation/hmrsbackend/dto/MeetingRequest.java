package com.omoikaneinnovation.hmrsbackend.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeetingRequest {

    private String title;
    private String description;
    private List<String> participantEmails;

    // 👇 frontend sends string
    private String startTime;
    private String endTime;
}
