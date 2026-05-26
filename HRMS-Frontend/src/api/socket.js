import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;
const subscriptions = {};

/* ─────────────────────────────────────────
   CALLBACK HANDLERS
───────────────────────────────────────── */
const handlers = {
  onPrivateMessage: null,
  onTask: null,
  onStatus: null,
  onCallSignal: null,
  onKpiUpdate: null,
};

/* ─────────────────────────────────────────
   UPDATE PRIVATE MESSAGE HANDLER
───────────────────────────────────────── */
export const setPrivateMessageHandler = (fn) => {
  handlers.onPrivateMessage = fn;
};

/* ─────────────────────────────────────────
   CLEAR SUBSCRIPTIONS
───────────────────────────────────────── */
const clearSubscriptions = () => {
  Object.keys(subscriptions).forEach((key) => {
    try {
      subscriptions[key]?.unsubscribe();
    } catch (_) {}

    delete subscriptions[key];
  });
};

/* ─────────────────────────────────────────
   CALL SIGNAL SUBSCRIPTION
───────────────────────────────────────── */
const subscribeToCallSignals = (client, onCallSignal) => {
  if (subscriptions.call) return;
  subscriptions.call = client.subscribe("/user/queue/call", (msg) => {
    const data = JSON.parse(msg.body);
    console.log("📞 Call signal received:", data.action);
    window.dispatchEvent(new CustomEvent("call_signal", { detail: data }));
    if (onCallSignal) onCallSignal(data);
  });
};

/* ─────────────────────────────────────────
   CALL CHAT SUBSCRIPTION
───────────────────────────────────────── */

const subscribeToCallChat = (client) => {
  if (subscriptions.callChat) return;
  subscriptions.callChat = client.subscribe("/user/queue/call-chat", (msg) => {
    const data = JSON.parse(msg.body);
    console.log("💬 Call chat message received:", data);
    window.dispatchEvent(new CustomEvent("call_chat_message", { detail: data }));
  });
};


/* ─────────────────────────────────────────
   CONNECT SOCKET
───────────────────────────────────────── */
export const connectSocket = (
  username,
  token,
  onPrivateMessage,
  onTask,
  onStatus,
  onCallSignal,
  onKpiUpdate
) => {

  /* UPDATE HANDLERS */
  if (onPrivateMessage)
    handlers.onPrivateMessage = onPrivateMessage;

  if (onTask)
    handlers.onTask = onTask;

  if (onStatus)
    handlers.onStatus = onStatus;

  if (onCallSignal)
    handlers.onCallSignal = onCallSignal;

  if (onKpiUpdate)
    handlers.onKpiUpdate = onKpiUpdate;

  /* TOKEN CHECK */
  if (!token) {
    console.error("❌ No token found for WebSocket");
    return Promise.reject(new Error("No token"));
  }

  /* PREVENT DUPLICATE CONNECTIONS */
  if (stompClient) {

    if (stompClient.connected) {
      console.log("⚠️ WebSocket already connected, reusing");

      subscribeToCallSignals(stompClient);
      subscribeToCallChat(stompClient);

      return Promise.resolve();
    }

    // Socket is still connecting — ensure call subscriptions will be set up
    // once the connection completes by polling until connected
    console.log(
      "⚠️ WebSocket still connecting — call subscriptions will be set up on connect"
    );

    // Return a promise that resolves when the socket actually connects
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (stompClient?.connected) {
          clearInterval(checkInterval);
          subscribeToCallSignals(stompClient);
          subscribeToCallChat(stompClient);
          resolve();
        }
      }, 200);
      // Timeout after 15 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(); // resolve anyway to not block callers
      }, 15000);
    });
  }

  console.log(
    "🔌 Creating new WebSocket connection for:",
    username
  );

  // Promise resolve callback — called when onConnect fires
  let resolveConnection = null;
  const connectionPromise = new Promise((resolve) => {
    resolveConnection = resolve;
  });

  stompClient = new Client({

    webSocketFactory: () =>
      new SockJS(
        `${import.meta.env.VITE_API_BASE_URL}/ws?token=${token}`,
        null,
        {
          transports: [
            "websocket",
            "xhr-streaming",
            "xhr-polling",
          ]
        }
      ),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,

    debug: (str) => console.log("STOMP:", str),

    onConnect: () => {

      console.log(
        "✅ WebSocket connected as:",
        username
      );

      window.stompClient = stompClient;

      /* ───────────────── KPI UPDATES ───────────────── */
      if (!subscriptions.kpi) {

        subscriptions.kpi = stompClient.subscribe(
          "/topic/kpi-updates",
          (msg) => {

            const data = JSON.parse(msg.body);

            console.log("📊 KPI UPDATE 👉", data);

            if (handlers.onKpiUpdate) {
              handlers.onKpiUpdate(data);
            }
          }
        );
      }

      /* ───────────────── CLAIMS ───────────────── */
      if (!subscriptions.claims) {

        subscriptions.claims = stompClient.subscribe(
          "/topic/claims",
          (msg) => {

            console.log(
              "📩 Claim update received:",
              msg.body
            );

            if (handlers.onStatus) {
              handlers.onStatus(msg.body);
            }
          }
        );
      }

      /* ───────────────── PRIVATE MESSAGES ───────────────── */
      if (subscriptions.messages) {
        try {
          subscriptions.messages.unsubscribe();
        } catch (_) {}

        delete subscriptions.messages;
      }

      subscriptions.messages = stompClient.subscribe(
        "/user/queue/messages",
        (msg) => {

          console.log(
            "📨 Private message received"
          );

          const parsed = JSON.parse(msg.body);

          console.log("📨 Message data:", parsed);

          if (handlers.onPrivateMessage) {
            handlers.onPrivateMessage(parsed);
          } else {
            console.warn(
              "⚠️ No onPrivateMessage handler registered!"
            );
          }
        }
      );

      console.log(
        "✅ Subscribed to /user/queue/messages"
      );

      /* ───────────────── TASKS ───────────────── */
      if (subscriptions.tasks) {
        try {
          subscriptions.tasks.unsubscribe();
        } catch (_) {}

        delete subscriptions.tasks;
      }

      subscriptions.tasks = stompClient.subscribe(
        "/user/queue/tasks",
        (msg) => {

          if (handlers.onTask) {
            handlers.onTask(JSON.parse(msg.body));
          }
        }
      );

      /* ───────────────── TOPIC TASKS ───────────────── */
      if (subscriptions.topicTasks) {
        try {
          subscriptions.topicTasks.unsubscribe();
        } catch (_) {}

        delete subscriptions.topicTasks;
      }

      subscriptions.topicTasks = stompClient.subscribe(
        "/topic/tasks",
        (msg) => {

          if (handlers.onTask) {
            handlers.onTask(JSON.parse(msg.body));
          }
        }
      );

      /* ───────────────── STATUS ───────────────── */
      if (subscriptions.status) {
        try {
          subscriptions.status.unsubscribe();
        } catch (_) {}

        delete subscriptions.status;
      }

      subscriptions.status = stompClient.subscribe(
        "/topic/status",
        (msg) => {

          if (handlers.onStatus) {
            handlers.onStatus(msg.body);
          }
        }
      );

      /* ───────────────── CALLS ───────────────── */
      subscribeToCallSignals(stompClient);

      /* ───────────────── CALL CHAT ───────────────── */
      subscribeToCallChat(stompClient);

      /* Resolve the connection promise so callers know we're truly connected */
      if (resolveConnection) {
        resolveConnection();
        resolveConnection = null;
      }
    },

    onDisconnect: () => {

      console.log("🔌 WebSocket disconnected");

      clearSubscriptions();
    },

    onStompError: (frame) => {

      console.error("❌ STOMP ERROR", frame);
      // Resolve anyway so callers don't hang forever
      if (resolveConnection) {
        resolveConnection();
        resolveConnection = null;
      }
    },
  });

  stompClient.activate();

  return connectionPromise;
};

/* ─────────────────────────────────────────
   DISCONNECT
───────────────────────────────────────── */
export const disconnectSocket = () => {

  if (stompClient) {

    stompClient.deactivate();

    stompClient = null;

    clearSubscriptions();

    console.log(
      "🔌 WebSocket manually disconnected"
    );
  }
};

/* ─────────────────────────────────────────
   SEND CALL SIGNAL
───────────────────────────────────────── */
export const sendCallSignal = (payload) => {

  if (!stompClient?.connected) {

    console.error(
      "❌ STOMP not connected - cannot send call signal"
    );

    return false;
  }

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify(payload),
  });

  return true;
};

/* ─────────────────────────────────────────
   SEND CALL CHAT MESSAGE
───────────────────────────────────────── */
export const sendCallChatMessage = (payload) => {

  if (!stompClient?.connected) {

    console.error(
      "❌ STOMP not connected - cannot send call chat"
    );

    return false;
  }

  stompClient.publish({
    destination: "/app/call.chat.send",
    body: JSON.stringify(payload),
  });

  console.log(
    "📨 Call chat message sent to:",
     payload.callId
  );

  return true;
};

/* ─────────────────────────────────────────
   SEND MUTE STATE
───────────────────────────────────────── */
export const sendMuteStateSignal = (payload) => {

  if (!stompClient?.connected) {
    return false;
  }

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify(payload),
  });

  return true;
};

/* ─────────────────────────────────────────
   SEND PRIVATE MESSAGE
───────────────────────────────────────── */
export const sendMessageWS = (payload) => {

  if (!stompClient?.connected) {

    console.warn(
      "⚠️ sendMessageWS: socket not connected"
    );

    return;
  }

  console.log(
    "📤 Sending private message:",
    payload
  );

  stompClient.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(payload),
  });
};

/* ─────────────────────────────────────────
   EDIT MESSAGE
───────────────────────────────────────── */
export const sendEditMessageWS = (payload) => {

  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/chat.edit",
    body: JSON.stringify({
      id: payload.id,
      senderEmail: payload.senderEmail,
      receiverEmail: payload.receiverEmail,
      content: payload.content,
      edited: true,
    }),
  });
};

/* ─────────────────────────────────────────
   GROUP SUBSCRIPTION
───────────────────────────────────────── */
export const subscribeToGroup = (
  groupId,
  callback
) => {

  if (!stompClient?.connected) {

    console.warn(
      "⚠️ subscribeToGroup called before socket connected"
    );

    return null;
  }

  const key = `group_${groupId}`;

  if (subscriptions[key]) {
    try {
      subscriptions[key].unsubscribe();
    } catch (_) {}

    delete subscriptions[key];
  }

  const sub = stompClient.subscribe(
    `/topic/group.${groupId}`,
    (msg) => {

      callback(JSON.parse(msg.body));
    }
  );

  subscriptions[key] = sub;

  return () => {
    try {
      sub.unsubscribe();
    } catch (_) {}

    if (subscriptions[key] === sub) {
      delete subscriptions[key];
    }
  };
};

/* ─────────────────────────────────────────
   SEND GROUP MESSAGE
───────────────────────────────────────── */
export const sendGroupMessageWS = (payload) => {

  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/group.send",
    body: JSON.stringify(payload),
  });
};

/* ─────────────────────────────────────────
   TASK UPDATE
───────────────────────────────────────── */
export const sendTaskUpdate = (task) => {

  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/task-update",
    body: JSON.stringify(task),
  });
};

/* ─────────────────────────────────────────
   TASK CHAT
───────────────────────────────────────── */
export const sendTaskChat = (msg) => {

  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/task-chat",
    body: JSON.stringify(msg),
  });
};

export const subscribeTaskChat = (
  taskId,
  callback
) => {

  if (!stompClient?.connected) return;

  const key = `taskChat_${taskId}`;

  if (subscriptions[key]) return;

  subscriptions[key] = stompClient.subscribe(
    `/topic/task-chat/${taskId}`,
    (msg) => {

      callback(JSON.parse(msg.body));
    }
  );
};

/* ─────────────────────────────────────────
   STATUS
───────────────────────────────────────── */
export const sendStatus = (username) => {

  if (!stompClient?.connected) return;

  stompClient.publish({
    destination: "/app/user-status",
    body: username,
  });
};

/* ─────────────────────────────────────────
   SOCKET STATUS
───────────────────────────────────────── */
export const isSocketConnected = () =>
  !!stompClient?.connected;

/* ─────────────────────────────────────────
   WAIT FOR SOCKET CONNECTION
───────────────────────────────────────── */
export const waitForSocketConnection = () => {
  return new Promise((resolve, reject) => {
    if (stompClient?.connected) {
      resolve(true);
      return;
    }

    let retries = 0;

    const interval = setInterval(() => {
      if (stompClient?.connected) {
        clearInterval(interval);
        resolve(true);
      }

      retries++;

      if (retries > 50) {
        clearInterval(interval);
        reject(new Error("Socket connection timeout"));
      }
    }, 200);
  });
};

/* ─────────────────────────────────────────
   PHASE 2 SIGNALS
───────────────────────────────────────── */
export const sendReactionSignal = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "REACTION",
    }),
  });

  return true;
};

export const sendWaitingRoomJoin = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "WAITING_ROOM_JOIN",
    }),
  });

  return true;
};

export const sendWaitingRoomAdmit = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "WAITING_ROOM_ADMIT",
    }),
  });

  return true;
};

export const sendWaitingRoomDeny = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "WAITING_ROOM_DENY",
    }),
  });

  return true;
};

export const sendRecordingStarted = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "RECORDING_STARTED",
    }),
  });

  return true;
};

export const sendRecordingStopped = (payload) => {

  if (!stompClient?.connected) return false;

  stompClient.publish({
    destination: "/app/call.signal",
    body: JSON.stringify({
      ...payload,
      action: "RECORDING_STOPPED",
    }),
  });

  return true;
};

export const subscribeToCallInfo = (
  callback
) => {

  if (
    !stompClient?.connected ||
    subscriptions.callInfo
  ) {
    return;
  }

  subscriptions.callInfo = stompClient.subscribe(
    "/user/queue/call-info",
    (msg) => {

      try {

        const data = JSON.parse(msg.body);

        if (callback) {
          callback(data);
        }

        window.dispatchEvent(
          new CustomEvent("call_info", {
            detail: data,
          })
        );

      } catch (e) {

        console.warn(
          "Failed to parse call-info message:",
          e
        );
      }
    }
  );
};