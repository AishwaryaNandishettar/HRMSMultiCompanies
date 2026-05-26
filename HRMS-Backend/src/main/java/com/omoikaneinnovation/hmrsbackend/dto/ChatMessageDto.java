package com.omoikaneinnovation.hmrsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {

    private String id;              // message id (for edits)
    private String senderEmail;
    private String receiverEmail;
    private String content;
    private java.time.Instant timestamp;
    private Object replyTo;
    private boolean edited;
    private boolean isForwarded;

    // ---- getters & setters ----

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Object getReplyTo() {
        return replyTo;
    }

    public void setReplyTo(Object replyTo) {
        this.replyTo = replyTo;
    }
}
