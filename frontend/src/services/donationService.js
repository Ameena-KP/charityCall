import api from "./api";

export const donateItem = async (donationData) => {
  const response = await api.post("/donations", donationData);
  return response.data;
};

export const getMyDonations = async () => {
  const response = await api.get("/donations/my");
  return response.data;
};

export const getReceivedDonations = async () => {
  const response = await api.get("/donations/received");
  return response.data;
};

export const getAllDonations = async () => {
  const response = await api.get("/donations/all");
  return response.data;
};

export const completeDonation = async (id) => {
  const response = await api.put(`/donations/${id}/complete`);
  return response.data;
};
