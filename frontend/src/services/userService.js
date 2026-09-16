import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post("/users/login", userData);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/users/profile", profileData);
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get("/users/notifications");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/users/notifications/${id}/read`);
  return response.data;
};

export const submitFeedback = async (message) => {
  const response = await api.post("/users/feedback", { message });
  return response.data;
};