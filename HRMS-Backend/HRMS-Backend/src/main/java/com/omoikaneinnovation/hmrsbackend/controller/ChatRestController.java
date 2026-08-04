package com.omoikaneinnovation.hmrsbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.model.ChatMessage;
import com.omoikaneinnovation.hmrsbackend.repository.ChatGroupRepository;
import com.omoikaneinnovation.hmrsbackend.repository.MessageRepository;
import com.omoikaneinnovation.hmrsbackend.service.ActiveChatTracker;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
@RequiredArgsConstructor
public class ChatRestController {

    private final MessageRepository messageRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final ActiveChatTracker activeChatTracker;

    /* ================= CHAT HISTORY ================= */
    @GetMapping("/history")
    public List<Map<String, Object>> getChatHistory(
            @RequestParam String sender,
            @RequestParam String receiver
    ) {
        List<ChatMessage> messages = messageRepository.findChat(sender, receiver);

        // Build a lookup map of id -> message for resolving replyTo
        Map<String, ChatMessage> msgById = new HashMap<>();
        messages.forEach(m -> { if (m.getId() != null) msgById.put(m.getId(), m); });

        // Enrich each message with a replyTo object so the frontend can render the reply block
        return messages.stream().map(m -> {
            Map<String, Object> enriched = new LinkedHashMap<>();
            enriched.put("id",            m.getId());
            enriched.put("senderEmail",   m.getSenderEmail());
            enriched.put("receiverEmail", m.getReceiverEmail());
            enriched.put("content",       m.getContent());
            enriched.put("timestamp",     m.getTimestamp());
            enriched.put("seen",          m.isSeen());
            enriched.put("delivered",     m.isDelivered());
            enriched.put("deleted",       m.isDeleted());
            enriched.put("edited",        m.isEdited());
            enriched.put("fileUrl",       m.getFileUrl());
            enriched.put("fileName",      m.getFileName());
            enriched.put("fileType",      m.getFileType());
            enriched.put("editedAt",      m.getEditedAt());

            // Build replyTo object from stored fields
            if (m.getReplyToMessageId() != null || m.getReplyPreview() != null) {
                Map<String, Object> replyTo = new LinkedHashMap<>();
                replyTo.put("id",          m.getReplyToMessageId());
                replyTo.put("content",     m.getReplyPreview());
                replyTo.put("senderEmail", m.getReplyToSenderEmail());

                // Try to resolve the full replied-to message for richer display
                if (m.getReplyToMessageId() != null && msgById.containsKey(m.getReplyToMessageId())) {
                    ChatMessage original = msgById.get(m.getReplyToMessageId());
                    replyTo.put("content",     original.getContent());
                    replyTo.put("senderEmail", original.getSenderEmail());
                }

                enriched.put("replyTo", replyTo);
            } else {
                enriched.put("replyTo", null);
            }

            return enriched;
        }).collect(Collectors.toList());
    }

    /* ================= MARK SEEN ================= */
    @PutMapping("/seen")
    public void markSeen(
            @RequestParam String sender,
            @RequestParam String receiver
    ) {
        System.out.println("🔍 markSeen called - sender: " + sender + ", receiver: " + receiver);
        
        // Frontend sends: sender=loggedInUser, receiver=otherUser
        // We need to mark messages where receiverEmail=loggedInUser AND senderEmail=otherUser as seen
        // findUnseen(receiver, sender) → query: { receiverEmail: receiver, senderEmail: sender }
        // So pass: receiver=loggedInUser(sender param), sender=otherUser(receiver param)
        List<ChatMessage> messages =
                messageRepository.findUnseen(sender, receiver);  // ✅ sender=loggedInUser is the receiver of messages

        System.out.println("🔍 Found " + messages.size() + " unseen messages to mark as seen");
        
        messages.forEach(m -> {
            System.out.println("🔍 Marking message as seen - ID: " + m.getId() + ", from: " + m.getSenderEmail() + ", to: " + m.getReceiverEmail());
            m.setSeen(true);
        });
        
        messageRepository.saveAll(messages);
        System.out.println("✅ Saved " + messages.size() + " messages as seen");
    }

    /* ================= SET ACTIVE PERSONAL CHAT ================= */
    @PostMapping("/active")
    public void setActivePersonalChat(
            @RequestParam String userEmail,
            @RequestParam String otherUserEmail
    ) {
        activeChatTracker.setActivePersonalChat(userEmail, otherUserEmail);
        
        // Also mark existing unseen messages as seen
        List<ChatMessage> unseenMessages = messageRepository.findUnseen(userEmail, otherUserEmail);
        unseenMessages.forEach(m -> m.setSeen(true));
        messageRepository.saveAll(unseenMessages);
    }

    /* ================= CLEAR ACTIVE CHAT ================= */
    @DeleteMapping("/active")
    public void clearActiveChat(@RequestParam String userEmail) {
        activeChatTracker.clearActiveChat(userEmail);
    }

    /* ================= UNREAD USERS COUNT ================= */
    @GetMapping("/unread-count")
    public int getUnreadUsersCount(@RequestParam String receiver) {
        System.out.println("🔍 getUnreadUsersCount called for receiver: " + receiver);
        
        List<ChatMessage> unseenMessages = messageRepository.findAllUnseenForReceiver(receiver);
        
        System.out.println("🔍 Found " + unseenMessages.size() + " total unseen messages for " + receiver);
        
        // Get unique sender emails
        Set<String> uniqueSenders = unseenMessages.stream()
                .map(ChatMessage::getSenderEmail)
                .collect(Collectors.toSet());
        
        System.out.println("🔍 Unique senders with unseen messages: " + uniqueSenders);
        System.out.println("✅ Returning unread users count: " + uniqueSenders.size());
        
        return uniqueSenders.size();
    }

    /* ================= UNREAD MESSAGES PER USER ================= */
    @GetMapping("/unread-per-user")
    public Map<String, Integer> getUnreadMessagesPerUser(@RequestParam String receiver) {
        List<ChatMessage> unseenMessages = messageRepository.findAllUnseenForReceiver(receiver);
        
        // Group by sender and count messages
        Map<String, Integer> unreadCounts = unseenMessages.stream()
                .collect(Collectors.groupingBy(
                    ChatMessage::getSenderEmail,
                    Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
                ));
        
        return unreadCounts;
    }
    
    /* ================= GET LAST MESSAGE FOR USER ================= */
    @GetMapping("/last-message")
    public ChatMessage getLastMessage(
            @RequestParam String user1,
            @RequestParam String user2
    ) {
        List<ChatMessage> messages = messageRepository.findLastMessageBetween(user1, user2);
        ChatMessage lastMessage = messages != null && !messages.isEmpty() ? messages.get(0) : null;
        System.out.println("Last message between " + user1 + " and " + user2 + ": " + 
                          (lastMessage != null ? lastMessage.getContent() : "null"));
        return lastMessage;
    }

    /* ================= CREATE GROUP ================= */
    @PostMapping("/group")
    public ChatGroup createGroup(@RequestBody ChatGroup group) {
        return chatGroupRepository.save(group);
    }

    /* ================= GET GROUPS ================= */
    @GetMapping("/groups")
    public List<ChatGroup> getAllGroups() {
        return chatGroupRepository.findAll();
    }
}
