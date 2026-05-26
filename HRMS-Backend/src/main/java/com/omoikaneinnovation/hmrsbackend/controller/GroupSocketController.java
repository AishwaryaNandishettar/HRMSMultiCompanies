package com.omoikaneinnovation.hmrsbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.omoikaneinnovation.hmrsbackend.dto.GroupMessageDto;
import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import com.omoikaneinnovation.hmrsbackend.repository.ChatGroupRepository;
import com.omoikaneinnovation.hmrsbackend.repository.GroupMessageRepository;
import com.omoikaneinnovation.hmrsbackend.service.ActiveChatTracker;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class GroupSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GroupMessageRepository groupMessageRepository;
    private final ChatGroupRepository chatGroupRepository;
    private final ActiveChatTracker activeChatTracker;

    @MessageMapping("/group.send")
    public void sendGroupMessage(GroupMessageDto dto) {

        List<String> seenBy = new java.util.ArrayList<>();
        seenBy.add(dto.getSenderEmail());

        GroupMessage message = GroupMessage.builder()
                .groupId(dto.getGroupId())
                .senderEmail(dto.getSenderEmail())
                .senderName(dto.getSenderName())
                .content(dto.getContent())
                .createdAt(Instant.now())
                .seenBy(seenBy)
                .build();
        
        // Auto-mark as seen for members who are currently viewing this group chat
        ChatGroup group = chatGroupRepository.findById(dto.getGroupId()).orElse(null);
        if (group != null && group.getMemberEmails() != null) {
            for (String memberEmail : group.getMemberEmails()) {
                if (memberEmail.equals(dto.getSenderEmail())) continue;
                if (activeChatTracker.isViewingGroupChat(memberEmail, dto.getGroupId())) {
                    message.getSeenBy().add(memberEmail);
                }
            }
        }

        GroupMessage savedMessage = groupMessageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/group." + dto.getGroupId(),
                savedMessage
        );
    }

    /* ================= SET ACTIVE GROUP CHAT ================= */
    @MessageMapping("/group.setActive")
    public void setActiveGroupChat(@Payload Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        String groupId = payload.get("groupId");
        
        if (userEmail != null && groupId != null) {
            activeChatTracker.setActiveGroupChat(userEmail, groupId);
        }
    }

    /* ================= CLEAR ACTIVE GROUP CHAT ================= */
    @MessageMapping("/group.clearActive")
    public void clearActiveGroupChat(@Payload Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        
        if (userEmail != null) {
            activeChatTracker.clearActiveChat(userEmail);
        }
    }
}
