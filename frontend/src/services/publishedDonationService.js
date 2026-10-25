import api from "./api";

// Get all published donations with optional category/status/search query
export const getAllPublishedDonations = async (params = {}) => {
  const response = await api.get("/published-donations", { params });
  return response.data;
};

// Get items published by the current logged-in user
export const getMyPublishedDonations = async () => {
  const response = await api.get("/published-donations/my");
  return response.data;
};

// Publish a new donation item
export const createPublishedDonation = async (data) => {
  const response = await api.post("/published-donations", data);
  return response.data;
};

// Update existing published donation item
export const updatePublishedDonation = async (id, data) => {
  const response = await api.put(`/published-donations/${id}`, data);
  return response.data;
};

// Update item status (Available / Reserved / Donated)
export const updatePublishedDonationStatus = async (id, status) => {
  const response = await api.patch(`/published-donations/${id}/status`, { status });
  return response.data;
};

// Delete published donation item
export const deletePublishedDonation = async (id) => {
  const response = await api.delete(`/published-donations/${id}`);
  return response.data;
};
