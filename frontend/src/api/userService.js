import { apiRequest } from './apiClient';

export const userService = {
  async getProfile(userId) {
    const res = await apiRequest(`/users/${userId}`, {
      method: 'GET',
    });
    return res.data;
  },

  async updateProfile(userId, profileData) {
    const res = await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return res.data;
  }
};
