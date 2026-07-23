import axiosClient from './axiosClient';

const paymentAPI = {
  createPayOSPayment: async (data) => (await axiosClient.post('/payments/payos', data)).data.data,
  getPayOSStatus: async (orderCode) => (await axiosClient.get(`/payments/payos/${orderCode}`)).data.data,
  cancelPayOSPayment: async (orderCode) => (await axiosClient.delete(`/payments/payos/${orderCode}`)).data.data,
};

export default paymentAPI;
