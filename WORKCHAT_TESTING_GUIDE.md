# WorkChat Testing Guide

## 🚀 Quick Start

### Prerequisites
- Backend running on `http://localhost:8080`
- Frontend running on `http://localhost:5173`
- MongoDB running
- Two test user accounts

### Step 1: Start Backend
```bash
cd HRMS-Backend
mvn spring-boot:run
```

Expected output:
```
✅ Application started successfully
✅ WebSocket configured
✅ MongoDB connected
```

### Step 2: Start Frontend
```bash
cd HRMS-Frontend
npm run dev
```

Expected output:
```
✅ Vite dev server running at http://localhost:5173
```

### Step 3: Login
1. Open `http://localhost:5173`
2. Login with test user account
3. Navigate to WorkChat

---

## 🧪 Test Cases

### Test 1: 1-to-1 Chat Basic Flow

**Objective**: Verify basic 1-to-1 messaging works

**Steps**:
1. Login as User A
2. Open WorkChat
3. Select User B from sidebar
4. Type message: "Hello User B"
5. Press Enter or click Send
6. Verify message appears in chat

**Expected Results**:
- ✅ Message appears immediately in chat
- ✅ Message shows timestamp
- ✅ Message shows sender name
- ✅ Message is saved to database

**Browser Console Check**:
```javascript
// Should see:
// ✅ Message sent via WebSocket
// ✅ Message received and displayed
```

---

### Test 2: 1-to-1 Chat - Recipient View

**Objective**: Verify recipient receives messages in real-time

**Steps**:
1. Open two browser windows
2. Window 1: Login as User A
3. Window 2: Login as User B
4. Window 1: Send message to User B
5. Window 2: Verify message appears

**Expected Results**:
- ✅ Message appears in Window 2 immediately
- ✅ Message shows as unread initially
- ✅ Message marked as delivered
- ✅ Message marked as seen when viewed

---

### Test 3: Message History

**Objective**: Verify chat history loads correctly

**Steps**:
1. Login as User A
2. Open WorkChat
3. Select User B (who you've chatted with before)
4. Scroll up to see older messages
5. Verify all messages load

**Expected Results**:
- ✅ Previous messages load
- ✅ Messages are in chronological order
- ✅ Timestamps are correct
- ✅ Sender names are correct

---

### Test 4: Group Chat Creation

**Objective**: Verify group creation works

**Steps**:
1. Login as User A
2. Open WorkChat
3. Click "Create Group" button
4. Enter group name: "Test Group"
5. Select members: User B, User C
6. Click Create

**Expected Results**:
- ✅ Group created successfully
- ✅ Group appears in sidebar
- ✅ Group members are added
- ✅ User A is set as admin

---

### Test 5: Group Chat Messaging

**Objective**: Verify group messaging works

**Steps**:
1. Open group chat
2. Type message: "Hello Group"
3. Send message
4. Verify message appears

**Expected Results**:
- ✅ Message appears in group chat
- ✅ Message shows sender name
- ✅ Message shows timestamp
- ✅ All group members can see message

---

### Test 6: Group Chat - Multiple Recipients

**Objective**: Verify all group members receive messages

**Steps**:
1. Open 3 browser windows
2. Window 1: Login as User A (admin)
3. Window 2: Login as User B (member)
4. Window 3: Login as User C (member)
5. Window 1: Send message to group
6. Verify message appears in Windows 2 and 3

**Expected Results**:
- ✅ Message appears in all windows
- ✅ Message marked as seen for each user
- ✅ Seen count updates correctly

---

### Test 7: File Upload in Chat

**Objective**: Verify file uploads work

**Steps**:
1. Open 1-to-1 or group chat
2. Click attachment icon
3. Select a file (image, PDF, etc.)
4. Verify file uploads
5. Verify file appears in chat

**Expected Results**:
- ✅ File uploads successfully
- ✅ File appears as attachment in chat
- ✅ File can be downloaded
- ✅ File type is correct

---

### Test 8: Active Chat Tracking

**Objective**: Verify active chat tracking prevents duplicate notifications

**Steps**:
1. Open 1-to-1 chat with User B
2. Have User B send you a message
3. Verify you receive notification (or not, if chat is active)
4. Close chat
5. Have User B send another message
6. Verify you receive notification

**Expected Results**:
- ✅ No notification when chat is active
- ✅ Notification received when chat is closed
- ✅ Active chat status tracked correctly

---

### Test 9: Meeting Room Creation

**Objective**: Verify meeting room creation works

**Steps**:
1. Navigate to Meetings section
2. Click "Create Meeting"
3. Enter meeting details:
   - Title: "Test Meeting"
   - Start time: Now + 5 minutes
   - End time: Now + 35 minutes
   - Participants: User B, User C
4. Click Create

**Expected Results**:
- ✅ Meeting created successfully
- ✅ Meeting appears in calendar
- ✅ Participants receive invitation
- ✅ Meeting room code generated

---

### Test 10: Join Meeting Room

**Objective**: Verify joining meeting room works

**Steps**:
1. Click on meeting in calendar
2. Click "Join Meeting"
3. Allow camera/microphone permissions
4. Verify WebRTC connection

**Expected Results**:
- ✅ Meeting room loads
- ✅ WebRTC connection established
- ✅ Camera/microphone working
- ✅ Participant list shows

---

### Test 11: Meeting Chat

**Objective**: Verify chat during meeting works

**Steps**:
1. Join meeting room
2. Open chat panel
3. Send message: "Hello from meeting"
4. Verify message appears

**Expected Results**:
- ✅ Message appears in meeting chat
- ✅ Message shows sender name
- ✅ All participants can see message

---

### Test 12: Leave Meeting

**Objective**: Verify leaving meeting works

**Steps**:
1. Join meeting room
2. Click "Leave Meeting" button
3. Verify meeting room closes
4. Verify participant list updates for others

**Expected Results**:
- ✅ Meeting room closes
- ✅ WebRTC connection closes
- ✅ Other participants see you left
- ✅ Participant count decreases

---

## 🔍 Browser Console Checks

### Expected WebSocket Logs

```javascript
// Connection
✅ WebSocket connected
✅ STOMP client connected
✅ Subscribed to /user/queue/messages
✅ Subscribed to /user/queue/call
✅ Subscribed to /topic/tasks

// Messages
✅ Message sent: {...}
✅ Message received: {...}
✅ Group message sent: {...}
✅ Group message received: {...}

// Calls
✅ Call signal received: OFFER
✅ Call signal received: ANSWER
✅ Call signal received: ICE_CANDIDATE
```

### Error Checks

```javascript
// Should NOT see:
❌ WebSocket connection failed
❌ STOMP connection failed
❌ Message send failed
❌ Subscription failed
❌ Unhandled promise rejection
```

---

## 📊 Performance Checks

### Load Time
- Page load: < 3 seconds
- Chat load: < 1 second
- Message send: < 500ms
- Message receive: < 100ms

### Network
- WebSocket connection: Persistent
- Message size: < 10KB
- File upload: Depends on file size

### Memory
- No memory leaks
- Subscriptions cleaned up on unmount
- WebSocket reconnects on disconnect

---

## 🐛 Troubleshooting

### Issue: WebSocket Connection Failed

**Symptoms**:
- Messages not sending
- Real-time updates not working
- Console shows "WebSocket connection failed"

**Solutions**:
1. Check backend is running: `http://localhost:8080/actuator/health`
2. Check WebSocket endpoint: `ws://localhost:8080/ws`
3. Check browser console for errors
4. Restart backend and frontend
5. Clear browser cache

### Issue: Messages Not Appearing

**Symptoms**:
- Message sent but doesn't appear
- No error in console
- Other features work

**Solutions**:
1. Check MongoDB connection
2. Check message repository queries
3. Verify user email is correct
4. Check browser console for errors
5. Restart backend

### Issue: File Upload Fails

**Symptoms**:
- File upload button doesn't work
- Upload progress bar stuck
- Error message appears

**Solutions**:
1. Check file size (max 10MB)
2. Check file type is allowed
3. Check upload directory exists
4. Check disk space
5. Check backend logs

### Issue: Meeting Room Won't Connect

**Symptoms**:
- Meeting room page loads but no video
- WebRTC connection fails
- Console shows connection errors

**Solutions**:
1. Check camera/microphone permissions
2. Check browser supports WebRTC
3. Check STUN/TURN servers configured
4. Check firewall allows WebRTC
5. Try different browser

---

## ✅ Final Verification Checklist

- [ ] Backend compiles without errors
- [ ] Frontend runs without errors
- [ ] WebSocket connects successfully
- [ ] 1-to-1 chat works
- [ ] Group chat works
- [ ] File uploads work
- [ ] Meeting rooms work
- [ ] Active chat tracking works
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable
- [ ] All tests pass

---

## 📝 Test Report Template

```
Test Date: [DATE]
Tester: [NAME]
Environment: [DEV/STAGING/PROD]

Test Results:
- Test 1 (1-to-1 Chat): ✅ PASS / ❌ FAIL
- Test 2 (Group Chat): ✅ PASS / ❌ FAIL
- Test 3 (File Upload): ✅ PASS / ❌ FAIL
- Test 4 (Meeting Room): ✅ PASS / ❌ FAIL
- Test 5 (Active Chat): ✅ PASS / ❌ FAIL

Issues Found:
1. [Issue description]
2. [Issue description]

Notes:
[Any additional notes]
```

---

**Last Updated**: May 16, 2026
**Status**: Ready for Testing
