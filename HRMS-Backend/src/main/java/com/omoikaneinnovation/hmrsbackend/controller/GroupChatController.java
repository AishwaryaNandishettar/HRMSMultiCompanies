package com.omoikaneinnovation.hmrsbackend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.omoikaneinnovation.hmrsbackend.dto.AddGroupMembersRequest;
import com.omoikaneinnovation.hmrsbackend.dto.CreateGroupRequest;
import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.model.GroupMessage;
import com.omoikaneinnovation.hmrsbackend.repository.GroupMessageRepository;
import com.omoikaneinnovation.hmrsbackend.service.ActiveChatTracker;
import com.omoikaneinnovation.hmrsbackend.service.GroupChatService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/groups")
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.ngrok-free.dev"})
@RequiredArgsConstructor
public class GroupChatController {

    private final GroupChatService groupChatService;
    private final GroupMessageRepository groupMessageRepository;
    private final ActiveChatTracker activeChatTracker;
    private final SimpMessagingTemplate messagingTemplate;

    private static final String UPLOAD_DIR = "uploads/";

    // 1️⃣ CREATE GROUP
    @PostMapping("/create")
    public ChatGroup createGroup(
            Authentication auth,
            @RequestBody CreateGroupRequest request
    ) {
        return groupChatService.createGroup(auth.getName(), request);
    }

    // 1️⃣-A UPLOAD FILE TO GROUP
    @PostMapping("/{groupId}/upload")
    public GroupMessage uploadGroupFile(
            Authentication auth,
            @PathVariable String groupId,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(required = false) String senderName,
            @RequestParam(required = false) String text,
            @RequestParam(required = false) String replyTo
    ) throws Exception {
        String senderEmail = auth.getName();
        
        System.out.println("📤 Group file upload request received:");
        System.out.println("   Group ID: " + groupId);
        System.out.println("   Sender Email: " + senderEmail);
        System.out.println("   Sender Name: " + senderName);
        System.out.println("   Files count: " + (files != null ? files.size() : 0));
        System.out.println("   Text: " + text);

        GroupMessage lastSaved = null;

        for (MultipartFile file : files) {
            System.out.println("   Processing file: " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");
            
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            
            System.out.println("   File saved to: " + path.toAbsolutePath());

            // Auto-mark as seen by sender
            List<String> seenBy = new ArrayList<>();
            seenBy.add(senderEmail);

            GroupMessage message = GroupMessage.builder()
                    .groupId(groupId)
                    .senderEmail(senderEmail)
                    .senderName(senderName != null ? senderName : senderEmail)
                    .content(text)
                    .fileUrl("/uploads/" + fileName)
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .createdAt(Instant.now())
                    .seenBy(seenBy)
                    .build();

            GroupMessage saved = groupMessageRepository.save(message);
            System.out.println("   Message saved with ID: " + saved.getId());

            // Broadcast to all group subscribers
            messagingTemplate.convertAndSend("/topic/group." + groupId, saved);
            System.out.println("   Broadcasted to /topic/group." + groupId);

            lastSaved = saved;
        }
        
        System.out.println("✅ Group file upload completed successfully");
        return lastSaved;
    }

    // 2️⃣ GET MY GROUPS
    @GetMapping("/my")
    public List<ChatGroup> myGroups(Authentication auth) {
        return groupChatService.getGroupsForUser(auth.getName());
    }

    // 3️⃣ GET GROUP CHAT HISTORY
    @GetMapping("/{groupId}/messages")
    public List<GroupMessage> getGroupMessages(
            @PathVariable String groupId
    ) {
        return groupMessageRepository
                .findByGroupIdOrderByCreatedAtAsc(groupId);
    }

    // 4️⃣ ADD MEMBERS (ADMIN ONLY)
    @PostMapping("/{groupId}/members")
    public ChatGroup addMembers(
            Authentication auth,
            @PathVariable String groupId,
            @RequestBody AddGroupMembersRequest request
    ) {
        return groupChatService.addMembers(
                auth.getName(),
                groupId,
                request.getMembers()
        );
    }

    // 5️⃣ REMOVE MEMBER (ADMIN ONLY)
    @DeleteMapping("/{groupId}/members/{email}")
    public ChatGroup removeMember(
            Authentication auth,
            @PathVariable String groupId,
            @PathVariable String email
    ) {
        return groupChatService.removeMember(
                auth.getName(),
                groupId,
                email
        );
    }

    // 5️⃣-A LEAVE GROUP (any member can leave)
    @DeleteMapping("/{groupId}/leave")
    public void leaveGroup(
            Authentication auth,
            @PathVariable String groupId
    ) {
        groupChatService.leaveGroup(auth.getName(), groupId);
    }

    // 5️⃣-B UPDATE GROUP NAME (ADMIN ONLY)
    @PutMapping("/{groupId}/name")
    public ChatGroup updateGroupName(
            Authentication auth,
            @PathVariable String groupId,
            @RequestBody java.util.Map<String, String> body
    ) {
        return groupChatService.updateGroupName(
                auth.getName(),
                groupId,
                body.get("name")
        );
    }

    // 6️⃣ MARK GROUP MESSAGES AS SEEN
    @PutMapping("/{groupId}/seen")
    public void markGroupMessagesSeen(
            Authentication auth,
            @PathVariable String groupId
    ) {
        String userEmail = auth.getName();
        List<GroupMessage> unseenMessages = groupMessageRepository
                .findUnseenByGroupIdAndUser(groupId, userEmail);
        
        unseenMessages.forEach(msg -> {
            if (!msg.getSeenBy().contains(userEmail)) {
                msg.getSeenBy().add(userEmail);
            }
        });
        
        groupMessageRepository.saveAll(unseenMessages);
    }

    // 6️⃣-A SET ACTIVE GROUP CHAT (REST endpoint)
    @PostMapping("/{groupId}/active")
    public void setActiveGroupChat(
            Authentication auth,
            @PathVariable String groupId
    ) {
        String userEmail = auth.getName();
        activeChatTracker.setActiveGroupChat(userEmail, groupId);
        
        // Also mark existing unseen messages as seen
        List<GroupMessage> unseenMessages = groupMessageRepository
                .findUnseenByGroupIdAndUser(groupId, userEmail);
        
        unseenMessages.forEach(msg -> {
            if (!msg.getSeenBy().contains(userEmail)) {
                msg.getSeenBy().add(userEmail);
            }
        });
        
        groupMessageRepository.saveAll(unseenMessages);
    }

    // 6️⃣-B CLEAR ACTIVE GROUP CHAT (REST endpoint)
    @DeleteMapping("/active")
    public void clearActiveGroupChat(Authentication auth) {
        activeChatTracker.clearActiveChat(auth.getName());
    }

    // 7️⃣ GET UNREAD GROUPS COUNT
    @GetMapping("/unread-count")
    public int getUnreadGroupsCount(Authentication auth) {
        String userEmail = auth.getName();
        List<ChatGroup> userGroups = groupChatService.getGroupsForUser(userEmail);
        
        int unreadCount = 0;
        for (ChatGroup group : userGroups) {
            List<GroupMessage> unseenMessages = groupMessageRepository
                    .findUnseenByGroupIdAndUser(group.getId(), userEmail);
            
            // Only count groups where there are unseen messages from OTHER users (not from yourself)
            boolean hasUnseenFromOthers = unseenMessages.stream()
                    .anyMatch(msg -> !msg.getSenderEmail().equalsIgnoreCase(userEmail));
            
            if (hasUnseenFromOthers) {
                unreadCount++;
            }
        }
        
        return unreadCount;
    }

    // 8️⃣ GET UNREAD MESSAGES PER GROUP
    @GetMapping("/unread-per-group")
    public Map<String, Integer> getUnreadMessagesPerGroup(Authentication auth) {
        String userEmail = auth.getName();
        List<ChatGroup> userGroups = groupChatService.getGroupsForUser(userEmail);
        
        Map<String, Integer> unreadCounts = new HashMap<>();
        
        for (ChatGroup group : userGroups) {
            List<GroupMessage> unseenMessages = groupMessageRepository
                    .findUnseenByGroupIdAndUser(group.getId(), userEmail);
            
            // Only count messages from OTHER users (not from yourself)
            int unseenCount = (int) unseenMessages.stream()
                    .filter(msg -> !msg.getSenderEmail().equalsIgnoreCase(userEmail))
                    .count();
            
            if (unseenCount > 0) {
                unreadCounts.put(group.getId(), unseenCount);
            }
        }
        
        return unreadCounts;
    }
}
