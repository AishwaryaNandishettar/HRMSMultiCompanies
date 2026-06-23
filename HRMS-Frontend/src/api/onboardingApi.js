import api from "./axios";

export const submitOnboarding = async (payload) => {
  const res = await api.post("/api/onboarding/submit", payload);
  return res.data;
};
export const getAllOnboardingRecords = async () => {
  const res = await api.get("/api/onboarding/all");
  return res.data;
};