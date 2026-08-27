import axiosClient from "./axiosClient";

const newsAPI = {
  getList: async (params = {}) => {
    const response = await axiosClient.get("/news", { params });
    return {
      items: response.data?.data || [],
      pagination: response.data?.pagination || {
        page: 1,
        pageSize: 12,
        total: 0,
        totalPages: 0,
      },
      filters: response.data?.filters || { years: [] },
      featured: response.data?.featured || [],
    };
  },

  getDetail: async (id) => {
    const response = await axiosClient.get(`/news/${id}`);
    return response.data?.data;
  },

  getFacebookSyncStatus: async () => {
    const response = await axiosClient.get("/admin/news/facebook/status");
    return response.data?.data;
  },

  syncFacebook: async () => {
    const response = await axiosClient.post("/admin/news/facebook/sync");
    return {
      message: response.data?.message,
      status: response.data?.data,
    };
  },

  setFeatured: async (id, isFeatured) => {
    const response = await axiosClient.patch(`/admin/news/${id}/featured`, { isFeatured });
    return response.data?.data;
  },

  reorderFeatured: async (orderedIds) => {
    const response = await axiosClient.patch("/admin/news/featured/order", { orderedIds });
    return response.data?.data || [];
  },
};

export default newsAPI;
