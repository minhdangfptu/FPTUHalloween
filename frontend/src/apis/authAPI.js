import axiosClient from './axiosClient';

const saveAuthData = (data) => {
  if (data?.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
  }
  if (data?.refreshToken) {
    localStorage.setItem('refreshToken', data.refreshToken);
  }
  if (data?.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

export const authAPI = {
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return saveAuthData(response.data);
  },

  register: async (payload) => {
    const response = await axiosClient.post('/auth/register', payload);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    clearAuthData();

    if (!refreshToken) {
      return { success: true };
    }

    try {
      await axiosClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }

    return { success: true };
  },

  getMe: async () => {
    const response = await axiosClient.get('/users/me');
    return response.data;
  },

  refreshToken: async (token) => {
    const response = await axiosClient.post('/auth/refresh', { refreshToken: token });
    return saveAuthData(response.data);
  },
};

export default authAPI;
