package com.omoikaneinnovation.hmrsbackend.model;
import lombok.Data;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "group_messages")
@Data
@NoArgsConstructor
@Builder
@AllArgsConstructor

public class GroupMessage {

    @Id
    private String id;

    private String groupId;
    private String senderEmail;
    private String senderName;
    private String content;
    private Instant createdAt;

    // File attachment fields
    private String fileUrl;
    private String fileName;
    private String fileType;

    // List of user emails who have seen this message
    @Builder.Default
    private List<String> seenBy = new ArrayList<>();
}
