package com.omoikaneinnovation.hmrsbackend.model;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "meetings")
public class Meeting {

    @Id
    private String id;

    private String title;
    private String description;
    private List<String> participantEmails;
    private String createdByEmail;
    
    // ✅ ADD REMARKS FIELD
    private String remarks;

    // ✅ THIS IS THE FIX
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant endTime;

    private Instant createdAt;

    // ✅ ADD STATUS FIELD
    @Builder.Default
    private String status = "Scheduled"; // Default status

    // ✅ ADD REPEAT FIELD (used in frontend)
    @Builder.Default
    private String repeat = "none"; // Default repeat

    // ✅ ADD REPEAT UNTIL (end date for recurring meetings)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    private Instant repeatUntil;

    // ✅ ADD REPEAT COUNT (max occurrences for recurring meetings)
    private Integer repeatCount;

    // ✅ ADD DAYS OF WEEK (for weekly recurring meetings, e.g. ["MON","WED","FRI"])
    private List<String> daysOfWeek;
}