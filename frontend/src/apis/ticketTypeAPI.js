import axiosClient from "./axiosClient";

const ticketTypeAPI = {
  getList: async (params = {}) => {
    const response = await axiosClient.get("/ticket-types", { params });
    return response.data?.data || { ticketTypes: [], pagination: null };
  },

  getById: async (ticketTypeId) => {
    const response = await axiosClient.get(`/ticket-types/${ticketTypeId}`);
    return response.data?.data || null;
  },

  create: async (payload) => {
    const response = await axiosClient.post("/ticket-types", payload);
    return { message: response.data?.message, ticketType: response.data?.data };
  },

  update: async (ticketTypeId, payload) => {
    const response = await axiosClient.put(`/ticket-types/${ticketTypeId}`, payload);
    return { message: response.data?.message, ticketType: response.data?.data };
  },

  changeStatus: async (ticketTypeId, ticketTypeStatus) => {
    const response = await axiosClient.patch(`/ticket-types/${ticketTypeId}/status`, { ticketTypeStatus });
    return { message: response.data?.message, ticketType: response.data?.data };
  },
};

export default ticketTypeAPI;
