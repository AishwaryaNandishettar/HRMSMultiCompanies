# Call Flow Diagram - Receiver Side

## Complete Flow: Sender → Backend → Receiver

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SENDER INITIATES CALL                             │
└─────────────────────────────────────────────────────────────────────────────┘

WorkChat.jsx (Sender)
    ↓
    handleStartCall('voice')
    ↓
    startCall(type, targetUser)  [CallContext]
    ↓
    sendCallSignal({
      fromEmail: sender@email.com,
      toEmail: receiver@email.com,
      action: 'CALL',
      callId: 'call_xxx',
      type: 'VOICE'
    })
    ↓
    socket.js: stompClient.publish({
      destination: '/app/call.signal',
      body: JSON.stringify(payload)
    })
    ↓
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                         BACKEND PROCESSING                              │
    └─────────────────────────────────────────────────────────────────────────┘
    
    CallSocketController.java
    ↓
    @MessageMapping("/call.signal")
    handleCallSignal(CallSignalDto dto)
    ↓
    case "CALL":
      messagingTemplate.convertAndSendToUser(
        toEmail,
        "/queue/call",
        dto
      )
    ↓
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                      RECEIVER RECEIVES SIGNAL                           │
    └─────────────────────────────────────────────────────────────────────────┘
    
    Receiver's WebSocket Connection (socket.js)
    ↓
    stompClient.subscribe("/user/queue/call", (msg) => {
      const data = JSON.parse(msg.body);
      window.dispatchEvent(
        new CustomEvent("call_signal", { detail: data })
      );
    })
    ↓
    window.dispatchEvent("call_signal")
    ↓
    CallContext.jsx: window.addEventListener("call_signal", handleCallSignal)
    ↓
    handleCallSignal(e) {
      const data = e.detail;
      
      if (data.action === 'CALL' && normalizedToEmail === myEmail) {
        setIncomingCall({
          type: data.type?.toLowerCase() || 'voice',
          fromEmail: data.fromEmail,
          callId: data.callId,
          fromName: data.fromName || data.fromEmail,
          isParticipantInvite: false
        });
        
        setCallState('ringing');
        
        ringtoneManager.play();  // ✅ SOUND PLAYS HERE
        
        if (window.Notification?.permission === 'granted') {
          new Notification(`Incoming ${data.type} call`, {
            body: `From: ${data.fromName || data.fromEmail}`,
            icon: '/call-icon.png'
          });
        }
      }
    }
    ↓
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                    RECEIVER SEES NOTIFICATION                           │
    └─────────────────────────────────────────────────────────────────────────┘
    
    App.jsx: <GlobalCallNotification />
    ↓
    GlobalCallNotification.jsx
    ↓
    if (!incomingCall) return null;
    
    return (
      <div className="global-call-notification-overlay">
        <div className="global-call-notification">
          <h3>{incomingCall.fromName}</h3>
          <p>Incoming {incomingCall.type} call</p>
          
          <button onClick={handleAccept}>Accept</button>
          <button onClick={handleReject}>Reject</button>
        </div>
      </div>
    )
    ↓
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                    RECEIVER ACCEPTS/REJECTS                             │
    └─────────────────────────────────────────────────────────────────────────┘
    
    ACCEPT PATH:
    ├─ handleAccept() → acceptCall()
    ├─ sendCallSignal({
    │    action: 'ACCEPT',
    │    fromEmail: receiver@email.com,
    │    toEmail: sender@email.com,
    │    callId: 'call_xxx'
    │  })
    ├─ Backend routes to sender
    ├─ Sender receives ACCEPT
    ├─ Both create WebRTC peer connection
    └─ Call connects
    
    REJECT PATH:
    ├─ handleReject() → rejectCall()
    ├─ sendCallSignal({
    │    action: 'REJECT',
    │    fromEmail: receiver@email.com,
    │    toEmail: sender@email.com,
    │    callId: 'call_xxx'
    │  })
    ├─ Backend routes to sender
    ├─ Sender receives REJECT
    └─ Call ends
```

---

## Key Points

### 1. WebSocket Connection (socket.js)
```javascript
// connectSocket() now returns a Promise
export const connectSocket = (...) => {
  // ... setup code ...
  
  const connectionPromise = new Promise((resolve) => {
    resolveConnection = resolve;
  });
  
  stompClient = new Client({
    onConnect: () => {
      // ... subscriptions ...
      subscribeToCallSignals(stompClient);  // ✅ ALWAYS called
      subscribeToCallChat(stompClient);
      
      if (resolveConnection) {
        resolveConnection();  // ✅ Promise resolves here
      }
    }
  });
  
  stompClient.activate();
  return connectionPromise;  // ✅ Return Promise
};
```

### 2. CallContext Connection (CallContext.jsx)
```javascript
useEffect(() => {
  if (!token || !LOGGED_IN_EMAIL || socketConnected.current) return;

  const connectWithRetry = async () => {
    try {
      const activeToken = await TokenManager.getValidToken();
      
      // ✅ Await the Promise
      await connectSocket(LOGGED_IN_EMAIL, activeToken, () => {}, () => {}, () => {});
      
      // ✅ Only mark as connected after Promise resolves
      socketConnected.current = true;
      setWsConnected(true);
      
      console.log('✅ WebSocket connected');
    } catch (error) {
      console.error('❌ Failed to connect');
      setTimeout(() => {
        socketConnected.current = false;
        connectWithRetry();
      }, 3000);
    }
  };

  connectWithRetry();
}, [token, LOGGED_IN_EMAIL]);
```

### 3. Signal Handling (CallContext.jsx)
```javascript
useEffect(() => {
  const handleCallSignal = async (e) => {
    const data = e.detail;
    const myEmail = getMyEmail();
    const normalizedToEmail = data.toEmail?.trim().toLowerCase();

    if (data.action === 'CALL' && normalizedToEmail === myEmail) {
      // ✅ Set incoming call state
      setIncomingCall({
        type: data.type?.toLowerCase() || 'voice',
        fromEmail: data.fromEmail,
        callId: data.callId,
        fromName: data.fromName || data.fromEmail,
        isParticipantInvite: false
      });
      
      setCallState('ringing');
      
      // ✅ Play ringtone
      ringtoneManager.play();
      
      // ✅ Show browser notification
      if (window.Notification?.permission === 'granted') {
        new Notification(`Incoming ${data.type} call`, {
          body: `From: ${data.fromName || data.fromEmail}`,
          icon: '/call-icon.png'
        });
      }
    }
  };

  window.addEventListener('call_signal', handleCallSignal);
  return () => window.removeEventListener('call_signal', handleCallSignal);
}, [call, incomingCall, LOGGED_IN_EMAIL, ...]);
```

### 4. Notification Display (GlobalCallNotification.jsx)
```javascript
const GlobalCallNotification = () => {
  const { incomingCall, acceptCall, rejectCall } = useCall();
  const navigate = useNavigate();

  if (!incomingCall) return null;  // ✅ Only show if incomingCall is set

  const handleAccept = () => {
    acceptCall();
    if (!window.location.pathname.includes('workchat')) {
      navigate('/workchat');
    }
  };

  const handleReject = () => {
    rejectCall();
  };

  return (
    <div className="global-call-notification-overlay">
      <div className="global-call-notification">
        {/* Caller info */}
        <h3 className="caller-name">{incomingCall.fromName}</h3>
        <p className="call-type">Incoming {incomingCall.type} call</p>
        
        {/* Action buttons */}
        <button className="call-btn accept-btn" onClick={handleAccept}>
          Accept
        </button>
        <button className="call-btn reject-btn" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};
```

---

## Why This Works

1. **Promise-based connection**: Ensures socket is truly connected before marking as ready
2. **Always subscribe to calls**: `subscribeToCallSignals()` is called in `onConnect()` regardless of which component called `connectSocket()`
3. **Global notification**: `GlobalCallNotification` is rendered in `App.jsx`, so it appears on all pages
4. **Proper event flow**: Signal → Event → State → UI
5. **Sound plays**: `ringtoneManager.play()` is called when `incomingCall` is set

---

## No Logic Changes

- ✅ All existing call handling preserved
- ✅ All existing signal types work
- ✅ All existing features intact
- ✅ Only fixed the WebSocket subscription issue
- ✅ Receiver notification system was already there, just wasn't being triggered

---

## Testing the Flow

### Step 1: Verify WebSocket Connection
```javascript
// In browser console on receiver side:
window.stompClient.connected  // Should be true
window.stompClient.subscriptions  // Should have /user/queue/call
```

### Step 2: Verify Signal Reception
```javascript
// In browser console:
window.addEventListener('call_signal', (e) => {
  console.log('📞 Signal received:', e.detail);
});
```

### Step 3: Verify Notification
```javascript
// In browser console:
// Should see GlobalCallNotification render when incomingCall is set
```

### Step 4: Test Full Flow
1. Sender: Click "Call" button
2. Receiver: Should see notification with sound
3. Receiver: Click "Accept"
4. Both: Should see call connected
