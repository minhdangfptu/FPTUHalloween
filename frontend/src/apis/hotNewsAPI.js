import axiosClient from "./axiosClient";

const hotNewsAPI = {
  getActiveList: async () => {
    const response = await axiosClient.get("/hot-news/active");
    return response.data?.data || [];
  },

  getList: async () => {
    const response = await axiosClient.get("/hot-news");
    return response.data?.data || [];
  },

  reorder: async (orderIds) => {
    const response = await axiosClient.patch("/hot-news/order", { orderIds });
    return {
      message: response.data?.message,
      hotNews: response.data?.data || [],
    };
  },

  create: async (payload) => {
    const response = await axiosClient.post("/hot-news", payload);
    return { message: response.data?.message, hotNews: response.data?.data };
  },

  update: async (hotNewsId, payload) => {
    const response = await axiosClient.put(`/hot-news/${hotNewsId}`, payload);
    return { message: response.data?.message, hotNews: response.data?.data };
  },

  changeStatus: async (hotNewsId, isActive) => {
    const response = await axiosClient.patch(`/hot-news/${hotNewsId}/status`, {
      isActive,
    });
    return { message: response.data?.message, hotNews: response.data?.data };
  },

  delete: async (hotNewsId) => {
    const response = await axiosClient.delete(`/hot-news/${hotNewsId}`);
    return { message: response.data?.message };
  },
};

export default hotNewsAPI;
