import axiosClient from "./axiosClient";

const ticketAPI = {
  getUserTickets: (params = {}) => axiosClient.get("/tickets", { params }),
  getUserTicketById: (id) => axiosClient.get(`/tickets/${id}`),
};

export default ticketAPI;
