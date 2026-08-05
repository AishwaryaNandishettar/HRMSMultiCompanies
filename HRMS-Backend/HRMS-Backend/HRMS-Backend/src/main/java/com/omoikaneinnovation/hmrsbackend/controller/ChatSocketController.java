package com.omoikaneinnovation.hmrsbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.omoikaneinnovation.hmrsbackend.dto.ChatMessageDto;
import com.omoikaneinnovation.hmrsbackend.model.ChatMessage;
import com.omoikaneinnovation.hmrsbackend.repository.MessageRepository;
import com.omoikaneinnovation.hmrsbackend.service.ActiveChatTracker;

import java.time.Instant;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private final ActiveChatTracker activeChatTracker;

    /* ================= SEND MESSAGE ================= */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto dto) {

        if (dto == null ||
                dto.getSenderEmail() == null ||
                dto.getReceiverEmail() == null ||
                dto.getContent() == null ||
                dto.getContent().isBlank()) {
            return;
        }

        // Normalize emails to lowercase for consistent storage and routing
        String senderEmail   = dto.getSenderEmail().trim().toLowerCase();
        String receiverEmail = dto.getReceiverEmail().trim().toLowerCase();

        // Check if receiver is currently viewing this chat (WhatsApp-like behavior)
        boolean receiverIsViewingChat = activeChatTracker.isViewingPersonalChat(
                receiverEmail,
                senderEmail
        );

        // Extract replyTo fields from the DTO's replyTo object
        String replyToMessageId = null;
        String replyPreview = null;
        String replyToSenderEmail = null;

        if (dto.getReplyTo() != null) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper =
                        new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode replyNode =
                        mapper.valueToTree(dto.getReplyTo());

                if (replyNode.has("id"))          replyToMessageId  = replyNode.get("id").asText();
                if (replyNode.has("content"))     replyPreview      = replyNode.get("content").asText();
                if (replyNode.has("senderEmail")) replyToSenderEmail = replyNode.get("senderEmail").asText();
            } catch (Exception e) {
                // ignore parse errors — replyTo is optional
            }
        }

        ChatMessage message = ChatMessage.builder()
                .senderEmail(senderEmail)
                .receiverEmail(receiverEmail)
                .content(dto.getContent())
                .timestamp(Instant.now())
                .seen(receiverIsViewingChat)
                .delivered(true)
                .replyToMessageId(replyToMessageId)
                .replyPreview(replyPreview)
                .replyToSenderEmail(replyToSenderEmail)
                .build();

        // ✅ SAVE TO MONGODB
        ChatMessage savedMessage = messageRepository.save(message);

        // ✅ SEND TO RECEIVER (PRIVATE QUEUE) — email already normalized above
        messagingTemplate.convertAndSendToUser(
                receiverEmail,
                "/queue/messages",
                savedMessage
        );

        // ✅ SEND BACK TO SENDER (PRIVATE QUEUE) — email already normalized above
        messagingTemplate.convertAndSendToUser(
                senderEmail,
                "/queue/messages",
                savedMessage
        );
    }

    /* ================= EDIT MESSAGE ================= */
    @MessageMapping("/chat.edit")
    public void editMessage(@Payload ChatMessageDto dto) {
        if (dto == null || dto.getId() == null || dto.getContent() == null) return;

        messageRepository.findById(dto.getId()).ifPresent(existing -> {
            // Only the original sender can edit
            if (!existing.getSenderEmail().equalsIgnoreCase(dto.getSenderEmail())) return;

            existing.setContent(dto.getContent());
            existing.setEdited(true);
            existing.setEditedAt(Instant.now());
            ChatMessage saved = messageRepository.save(existing);

            // Notify both sender and receiver so both sides update in real-time
            messagingTemplate.convertAndSendToUser(
                    saved.getSenderEmail().trim().toLowerCase(), "/queue/messages", saved);
            messagingTemplate.convertAndSendToUser(
                    saved.getReceiverEmail().trim().toLowerCase(), "/queue/messages", saved);
        });
    }
    /* ================= SET ACTIVE CHAT ================= */
    @MessageMapping("/chat.setActive")
    public void setActiveChat(@Payload ChatMessageDto dto) {
        if (dto != null && dto.getSenderEmail() != null && dto.getReceiverEmail() != null) {
            activeChatTracker.setActivePersonalChat(dto.getSenderEmail(), dto.getReceiverEmail());
        }
    }

    /* ================= CLEAR ACTIVE CHAT ================= */
    @MessageMapping("/chat.clearActive")
    public void clearActiveChat(@Payload ChatMessageDto dto) {
        if (dto != null && dto.getSenderEmail() != null) {
            activeChatTracker.clearActiveChat(dto.getSenderEmail());
        }
    }
}
