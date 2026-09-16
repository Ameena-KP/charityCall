import api from "./api";

export const registerTeam = async (teamData) => {
  const response = await api.post("/team/register", teamData);
  return response.data;
};

export const loginTeam = async (credentials) => {
  const response = await api.post("/team/login", credentials);
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await api.get("/team/pending");
  return response.data;
};

export const getApprovedRequests = async () => {
  const response = await api.get("/team/approved");
  return response.data;
};

export const approveRequest = async (id, category) => {
  const response = await api.put(`/team/approve/${id}`, { category });
  return response.data;
};

export const rejectRequest = async (id) => {
  const response = await api.put(`/team/reject/${id}`);
  return response.data;
};

export const updateCategory = async (id, category) => {
  const response = await api.put(`/team/category/${id}`, { category });
  return response.data;
};

export const getTeamDonations = async () => {
  const response = await api.get("/team/donations");
  return response.data;
};

export const completeTeamDonation = async (id) => {
  const response = await api.put(`/team/donations/${id}`);
  return response.data;
};