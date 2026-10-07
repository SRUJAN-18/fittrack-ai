import { apiRequest } from './apiClient';

export const aiService = {
  async sendChatMessage(userId, message) {
    const res = await apiRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ userId, message }),
    });
    return res.data;
  }
};
