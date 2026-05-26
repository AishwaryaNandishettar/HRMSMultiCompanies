import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/meetings`;
export const createMeeting = async (data, token) => {
  const res = await axios.post(BASE_URL, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const fetchMyMeetings = async (email, token) => {
  const res = await axios.get(
    `${BASE_URL}/user?email=${email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        
      },
    }
  );
  return res.data;
};

export const fetchMeetingById = async (id, token) => {
  const res = await axios.get(
    `${BASE_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ✅ ADD THIS (USED BY EDIT) */
export const updateMeeting = async (id, data, token) => {
  const res = await axios.put(
    `${BASE_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ✅ DELETE MEETING */
export const deleteMeeting = async (id, token) => {
  const res = await axios.delete(
    `${BASE_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

/* ✅ CHECK PARTICIPANT CONFLICT */
export const checkParticipantConflict = async (email, start, end, token, excludeId = "") => {
  const params = new URLSearchParams({ email, start, end });
  if (excludeId) params.append("excludeId", excludeId);

  const res = await axios.get(`${BASE_URL}/check-conflict?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // { hasConflict: bool, conflictingMeetingTitle, conflictingMeetingStart, conflictingMeetingEnd }
};