import axiosClient from "./axiosClient";

const feedbackAPI = {
  getForms: async (params = {}) => {
    const response = await axiosClient.get("/feedback/forms", { params });
    return response.data?.data || [];
  },

  getAvailableForms: async (params = {}) => {
    const response = await axiosClient.get("/feedback/forms", { params });
    return response.data?.data || [];
  },

  getById: async (formId) => {
    const response = await axiosClient.get(`/feedback/forms/${formId}`);
    return response.data?.data || null;
  },

  create: async (payload) => {
    const response = await axiosClient.post("/feedback/forms", payload);
    return { message: response.data?.message, form: response.data?.data };
  },

  update: async (formId, payload) => {
    const response = await axiosClient.put(`/feedback/forms/${formId}`, payload);
    return { message: response.data?.message, form: response.data?.data };
  },

  delete: async (formId) => {
    const response = await axiosClient.delete(`/feedback/forms/${formId}`);
    return { message: response.data?.message };
  },

  submit: async (formId, answers) => {
    const response = await axiosClient.post(`/feedback/forms/${formId}/responses`, { answers });
    return { message: response.data?.message, response: response.data?.data };
  },

  getResponses: async (formId, params = {}) => {
    const response = await axiosClient.get(`/feedback/forms/${formId}/responses`, { params });
    return {
      responses: response.data?.data || [],
      pagination: response.data?.pagination || null,
    };
  },

  getStatistics: async (formId) => {
    const response = await axiosClient.get(`/feedback/forms/${formId}/statistics`);
    return response.data?.data || null;
  },
};

export default feedbackAPI;
