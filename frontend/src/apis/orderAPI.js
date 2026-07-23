import axiosClient from "./axiosClient";

const orderAPI = {
  getAdminOrders: (params = {}) => axiosClient.get("/orders", { params }),
  getAdminOrderById: (id) => axiosClient.get(`/orders/${id}`),
};

export default orderAPI;
