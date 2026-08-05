# Chat Unread Buzzer Count Fix

## Problem

When Lata opened a chat with Adhviti, the unread badge (buzzer count showing "4") stayed visible even after viewing the messages. The badge should disappear once the chat is opened.

## Root Cause

**Backend parameter bug in `ChatRestController.java`:**

The `/api/chat/seen` endpoint had swapped parameters when calling `messageRepository.findUnseen()`.

### Before (❌ Bug):
```java
@PutMapping("/seen")
public void markSeen(
        @RequestParam String sender,
        @RequestParam String receiver
) {
    List<ChatMessage> messages =
            messageRepository.findUnseen(sender, receiver);  // ❌ WRONG ORDER
```

The `findUnseen` method expects:
```java
findUnseen(String receiver, String sender)
```

But the controller was passing:
```java
findUnseen(sender, receiver)  // ❌ swapped!
```

### After (✅ Fixed):
```java
@PutMapping("/seen")
public void markSeen(
        @RequestParam String sender,
        @RequestParam String receiver
) {
    // Frontend sends: sender=loggedInUser, receiver=otherUser
    // But we need to mark messages where receiver=loggedInUser AND sender=otherUser as seen
    // So swap the parameters when calling findUnseen
    List<ChatMessage> messages =
            messageRepository.findUnseen(receiver, sender);  // ✅ CORRECT ORDER
```

## What Was Changed

**File:** `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/controller/ChatRestController.java`

**Line:** ~86

**Change:** Swapped the parameter order from `findUnseen(sender, receiver)` to `findUnseen(receiver, sender)`

## How It Works Now

1. **Lata opens chat with Adhviti**
2. Frontend calls:
   ```js
   markChatMessagesSeen(
     "lata@example.com",      // sender (logged-in user)
     "adhviti@gmail.com",     // receiver (other user)
     TOKEN
   )
   ```

3. Backend now correctly finds messages where:
   - `receiverEmail = "lata@example.com"` (Lata received these)
   - `senderEmail = "adhviti@gmail.com"` (Adhviti sent these)
   
4. Marks those messages as `seen = true`

5. Frontend refreshes the unread count → badge disappears ✅

## Testing

**Restart the backend** for changes to take effect.

**Test Steps:**
1. Login as Lata
2. Go to Work Chat
3. See unread badge "4" on Adhviti's chat
4. Click on Adhviti's chat
5. **Expected:** Badge disappears immediately
6. Refresh page
7. **Expected:** Badge stays gone (messages were marked as seen in database)

---

## No Logic Changed

The fix only corrected the parameter order to match what `findUnseen()` expects — no functional logic was altered.
