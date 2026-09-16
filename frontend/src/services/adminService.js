import api from "./api";

export const loginAdmin = async (credentials) => {
  const response = await api.post("/admin/login", credentials);
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const blockUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/block`);
  return response.data;
};

export const unblockUser = async (id) => {
  const response = await api.put(`/admin/users/${id}/unblock`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAllTeams = async () => {
  const response = await api.get("/admin/teams");
  return response.data;
};

export const approveTeam = async (id) => {
  const response = await api.put(`/admin/teams/${id}/approve`);
  return response.data;
};

export const rejectTeam = async (id) => {
  const response = await api.put(`/admin/teams/${id}/reject`);
  return response.data;
};

export const deleteTeam = async (id) => {
  const response = await api.delete(`/admin/teams/${id}`);
  return response.data;
};

export const sendNotification = async (notifData) => {
  const response = await api.post("/admin/notifications", notifData);
  return response.data;
};

export const getAdminNotifications = async () => {
  const response = await api.get("/admin/notifications");
  return response.data;
};

export const getReports = async () => {
  const response = await api.get("/admin/reports");
  return response.data;
};

export const getFeedback = async () => {
  const response = await api.get("/admin/feedback");
  return response.data;
};
