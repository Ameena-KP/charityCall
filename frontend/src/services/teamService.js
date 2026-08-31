import axios from "axios";

const API = "http://localhost:5000/api/team";

const getToken = () => {
    return localStorage.getItem("token");
};

export const getPendingRequests = async () => {

    const response = await axios.get(
        `${API}/pending`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
};

export const approveRequest = async (id) => {

    const response = await axios.put(
        `${API}/approve/${id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
};

export const rejectRequest = async (id) => {

    const response = await axios.put(
        `${API}/reject/${id}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.data;
};