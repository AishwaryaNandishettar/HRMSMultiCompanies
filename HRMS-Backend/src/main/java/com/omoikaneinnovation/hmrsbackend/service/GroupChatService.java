package com.omoikaneinnovation.hmrsbackend.service;
import lombok.RequiredArgsConstructor;


import com.omoikaneinnovation.hmrsbackend.dto.CreateGroupRequest;
import com.omoikaneinnovation.hmrsbackend.model.ChatGroup;
import com.omoikaneinnovation.hmrsbackend.repository.ChatGroupRepository;

import org.springframework.stereotype.Service;


import java.time.Instant;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GroupChatService {

    private final ChatGroupRepository groupRepository;

    /* ===============================
       CREATE GROUP
       =============================== */
    public ChatGroup createGroup(
            String adminEmail,
            CreateGroupRequest request
    ) {

        HashSet<String> members =
                new HashSet<>(request.getMembers());

        members.add(adminEmail);

        ChatGroup group = ChatGroup.builder()
                .name(request.getGroupName())
                .adminEmail(adminEmail)
                .memberEmails(members.stream().toList())
                .createdAt(Instant.now())
                .build();

        return groupRepository.save(group);
    }

    /* ===============================
       GET MY GROUPS
       =============================== */
    public List<ChatGroup> getGroupsForUser(String email) {
        return groupRepository
                .findByMemberEmailsContaining(email);
    }

    /* ===============================
       ADD MEMBERS (ADMIN ONLY)
       =============================== */
    public ChatGroup addMembers(
            String adminEmail,
            String groupId,
            List<String> newMembers
    ) {

        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        if (!group.getAdminEmail().equals(adminEmail)) {
            throw new RuntimeException("Only admin can add members");
        }

        HashSet<String> updatedMembers =
                new HashSet<>(group.getMemberEmails());

        updatedMembers.addAll(newMembers);
        updatedMembers.add(adminEmail); // safety

        group.setMemberEmails(updatedMembers.stream().toList());
        return groupRepository.save(group);
    }

    /* ===============================
       REMOVE MEMBER (ADMIN ONLY)
       =============================== */
    public ChatGroup removeMember(
            String adminEmail,
            String groupId,
            String memberEmail
    ) {

        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() ->
                        new RuntimeException("Group not found")
                );

        if (!group.getAdminEmail().equals(adminEmail)) {
            throw new RuntimeException("Only admin can remove members");
        }

        if (adminEmail.equals(memberEmail)) {
            throw new RuntimeException("Admin cannot remove self");
        }

        List<String> updatedMembers =
                group.getMemberEmails()
                        .stream()
                        .filter(e -> !e.equals(memberEmail))
                        .toList();

        group.setMemberEmails(updatedMembers);
        return groupRepository.save(group);
    }

    /* ===============================
       LEAVE GROUP (any member)
       =============================== */
    public void leaveGroup(String memberEmail, String groupId) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // If admin leaves, assign admin to next member or delete group
        if (group.getAdminEmail().equals(memberEmail)) {
            List<String> remaining = group.getMemberEmails()
                    .stream()
                    .filter(e -> !e.equals(memberEmail))
                    .toList();
            if (remaining.isEmpty()) {
                groupRepository.delete(group);
                return;
            }
            group.setAdminEmail(remaining.get(0));
            group.setMemberEmails(remaining);
        } else {
            List<String> updatedMembers = group.getMemberEmails()
                    .stream()
                    .filter(e -> !e.equals(memberEmail))
                    .toList();
            group.setMemberEmails(updatedMembers);
        }
        groupRepository.save(group);
    }

    /* ===============================
       UPDATE GROUP NAME (ADMIN ONLY)
       =============================== */
    public ChatGroup updateGroupName(String adminEmail, String groupId, String newName) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        if (!group.getAdminEmail().equals(adminEmail)) {
            throw new RuntimeException("Only admin can rename the group");
        }
        if (newName == null || newName.isBlank()) {
            throw new RuntimeException("Group name cannot be empty");
        }
        group.setName(newName.trim());
        return groupRepository.save(group);
    }
}




