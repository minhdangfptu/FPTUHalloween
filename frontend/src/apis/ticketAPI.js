import axiosClient from "./axiosClient";

const ticketAPI = {
  getUserTickets: (params = {}) => axiosClient.get("/tickets", { params }),
  getCheckedInTickets: (params = {}) => axiosClient.get("/tickets", { params }),
  getUserTicketById: (id) => axiosClient.get(`/tickets/${id}`),
  getByQrCode: (code) => axiosClient.get("/tickets/qr", { params: { code } }),
  checkIn: (code) => axiosClient.post("/tickets/check-in", { code }),
  createManual: (payload) => axiosClient.post("/tickets/manual", payload),
};

export default ticketAPI;
