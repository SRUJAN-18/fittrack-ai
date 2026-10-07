import { apiRequest } from './apiClient';

export const weightService = {
  async addWeight(recordData) {
    const res = await apiRequest('/weight', {
      method: 'POST',
      body: JSON.stringify(recordData),
    });
    return res.data;
  },

  async getWeightHistory(userId) {
    const res = await apiRequest(`/weight/${userId}`, {
      method: 'GET',
    });
    return res.data;
  },

  async getWeightStats(userId) {
    const res = await apiRequest(`/weight/${userId}/stats`, {
      method: 'GET',
    });
    return res.data;
  },

  async deleteWeight(recordId, userId) {
    const res = await apiRequest(`/weight/${recordId}?userId=${userId}`, {
      method: 'DELETE',
    });
    return res.data;
  }
};
