package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * DTO for meeting chat messages
 * Used for real-time chat communication during video meetings
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeetingChatMessageDto {
    
    @NotNull(message = "Meeting ID is required")
    private String meetingId;
    
    @NotBlank(message = "Sender email is required")
    private String senderEmail;
    
    @NotBlank(message = "Sender name is required")
    private String senderName;
    
    @NotBlank(message = "Message cannot be empty")
    @Size(max = 1000, message = "Message too long (max 1000 characters)")
    private String message;
    
    private String timestamp;
}