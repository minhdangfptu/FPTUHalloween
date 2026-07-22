import axiosClient from "./axiosClient";

const cartAPI = {
  get: async () => {
    const response = await axiosClient.get("/cart");
    return response.data?.data || { items: [], totalAmount: 0 };
  },

  addItem: async (ticketTypeId, quantity) => {
    const response = await axiosClient.post("/cart/items", {
      ticketTypeId,
      quantity,
    });
    return response.data?.data;
  },

  updateItem: async (ticketTypeId, quantity) => {
    const response = await axiosClient.patch(`/cart/items/${ticketTypeId}`, {
      quantity,
    });
    return response.data?.data;
  },

  removeItem: async (ticketTypeId) => {
    const response = await axiosClient.delete(`/cart/items/${ticketTypeId}`);
    return response.data?.data;
  },
};

export default cartAPI;
