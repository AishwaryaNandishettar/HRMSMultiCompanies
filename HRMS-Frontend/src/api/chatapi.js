import axios from "axios";
const API = `${import.meta.env.VITE_API_BASE_URL}/api/chat`;
const BASE = import.meta.env.VITE_API_BASE_URL;

export const fetchChatMessages = async (sender, receiver, token) => {
  const res = await axios.get(`${API}/history`, {
    params: { sender, receiver },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* =========================
   MARK PRIVATE MESSAGES AS SEEN
========================= */
export const markChatMessagesSeen = async (sender, receiver, token) => {
  try {
    const res = await axios.put(
      `${API}/mark-seen`,
      null,
      {
        params: { sender, receiver },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to mark messages as seen:", err);
    return null;
  }
};

/* =========================
   UNREAD USERS COUNT
========================= */
export const fetchUnreadUsersCount = async (email, token) => {
  const res = await axios.get(
    `${BASE}/api/chat/unread-users-count?email=${email}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

/* =========================
   UNREAD PER USER
========================= */
export const fetchUnreadMessagesPerUser = async (email, token) => {
  const res = await axios.get(
    `${BASE}/api/chat/unread-per-user?email=${email}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};