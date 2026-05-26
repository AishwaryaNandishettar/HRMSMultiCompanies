import axios from "axios";
const API = `${import.meta.env.VITE_API_BASE_URL}/api/chat`;

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