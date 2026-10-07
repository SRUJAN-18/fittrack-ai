import { apiRequest } from './apiClient';

export const authService = {
  async register(userData) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    // res is ApiResponse<AuthResponse>
    return res.data;
  },

  async login(credentials) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return res.data;
  },

  saveAuth(authData) {
    if (authData) {
      if (authData.token) {
        localStorage.setItem('fittrack_token', authData.token);
      }
      localStorage.setItem('fittrack_user', JSON.stringify({
        userId: authData.userId,
        name: authData.name,
        email: authData.email
      }));
    }
  },

  getStoredUser() {
    const raw = localStorage.getItem('fittrack_user');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout() {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
  }
};
