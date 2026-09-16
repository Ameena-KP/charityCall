import api from "./api";

export const createCharityRequest = async (formData) => {
  const response = await api.post("/charity", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get("/charity/my-requests");
  return response.data;
};

export const getApprovedRequests = async () => {
  const response = await api.get("/charity/approved");
  return response.data;
};

export const getAllRequestsAdmin = async () => {
  const response = await api.get("/charity/all");
  return response.data;
};

export const deleteRequest = async (id) => {
  const response = await api.delete(`/charity/${id}`);
  return response.data;
};
