package com.omoikaneinnovation.hmrsbackend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to track active chats (1-to-1 and group)
 * Helps determine if a user is actively viewing a chat
 * Used to avoid sending notifications for messages the user is already seeing
 */
@Service
@Slf4j
public class ActiveChatTracker {

    // Track active 1-to-1 chats: userEmail -> Set of emails they're chatting with
    private final Map<String, Set<String>> activePersonalChats = new ConcurrentHashMap<>();

    // Track active group chats: userEmail -> Set of group IDs they're viewing
    private final Map<String, Set<String>> activeGroupChats = new ConcurrentHashMap<>();

    /**
     * Mark a 1-to-1 chat as active for a user
     */
    public void setActivePersonalChat(String userEmail, String otherUserEmail) {
        activePersonalChats.computeIfAbsent(userEmail, k -> ConcurrentHashMap.newKeySet())
                .add(otherUserEmail);
        log.debug("✅ Active personal chat set: {} <-> {}", userEmail, otherUserEmail);
    }

    /**
     * Clear a 1-to-1 chat as active for a user
     */
    public void clearActivePersonalChat(String userEmail, String otherUserEmail) {
        Set<String> chats = activePersonalChats.get(userEmail);
        if (chats != null) {
            chats.remove(otherUserEmail);
            if (chats.isEmpty()) {
                activePersonalChats.remove(userEmail);
            }
        }
        log.debug("❌ Active personal chat cleared: {} <-> {}", userEmail, otherUserEmail);
    }

    /**
     * Clear all active chats for a user
     */
    public void clearActiveChat(String userEmail) {
        clearAllActiveChats(userEmail);
    }

    /**
     * Clear all active chats for a user (alias)
     */
    public void clearAllActiveChats(String userEmail) {
        activePersonalChats.remove(userEmail);
        activeGroupChats.remove(userEmail);
        log.debug("❌ All active chats cleared for: {}", userEmail);
    }

    /**
     * Check if a user is actively viewing a specific 1-to-1 chat
     */
    public boolean isViewingPersonalChat(String userEmail, String otherUserEmail) {
        Set<String> chats = activePersonalChats.get(userEmail);
        return chats != null && chats.contains(otherUserEmail);
    }

    /**
     * Mark a group chat as active for a user
     */
    public void setActiveGroupChat(String userEmail, String groupId) {
        activeGroupChats.computeIfAbsent(userEmail, k -> ConcurrentHashMap.newKeySet())
                .add(groupId);
        log.debug("✅ Active group chat set: {} in group {}", userEmail, groupId);
    }

    /**
     * Clear a group chat as active for a user
     */
    public void clearActiveGroupChat(String userEmail, String groupId) {
        Set<String> groups = activeGroupChats.get(userEmail);
        if (groups != null) {
            groups.remove(groupId);
            if (groups.isEmpty()) {
                activeGroupChats.remove(userEmail);
            }
        }
        log.debug("❌ Active group chat cleared: {} from group {}", userEmail, groupId);
    }

    /**
     * Check if a user is actively viewing a specific group chat
     */
    public boolean isViewingGroupChat(String userEmail, String groupId) {
        Set<String> groups = activeGroupChats.get(userEmail);
        return groups != null && groups.contains(groupId);
    }

    /**
     * Get all active personal chats for a user
     */
    public Set<String> getActivePersonalChats(String userEmail) {
        return activePersonalChats.getOrDefault(userEmail, Collections.emptySet());
    }

    /**
     * Get all active group chats for a user
     */
    public Set<String> getActiveGroupChats(String userEmail) {
        return activeGroupChats.getOrDefault(userEmail, Collections.emptySet());
    }

    /**
     * Check if user has any active chats
     */
    public boolean hasActiveChats(String userEmail) {
        return activePersonalChats.containsKey(userEmail) || activeGroupChats.containsKey(userEmail);
    }
}
