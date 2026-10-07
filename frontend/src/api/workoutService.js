import { apiRequest } from './apiClient';

export const workoutService = {
  /**
   * Create a new workout session with exercises
   */
  createSession: async (sessionData) => {
    const res = await apiRequest('/workout', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
    return res.data;
  },

  /**
   * Get all workout sessions for a user
   */
  getSessions: async (userId) => {
    const res = await apiRequest(`/workout/${userId}`, {
      method: 'GET',
    });
    return res.data || [];
  },

  /**
   * Get aggregate workout stats for a user
   */
  getStats: async (userId) => {
    const res = await apiRequest(`/workout/${userId}/stats`, {
      method: 'GET',
    });
    return res.data;
  },

  /**
   * Delete a workout session
   */
  deleteSession: async (sessionId, userId) => {
    const res = await apiRequest(`/workout/${sessionId}?userId=${userId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};
