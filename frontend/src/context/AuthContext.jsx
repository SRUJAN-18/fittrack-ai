import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { userService } from '../api/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage on page load
  useEffect(() => {
    const initAuth = async () => {
      const stored = authService.getStoredUser();
      if (stored && stored.userId) {
        setUser(stored);
        try {
          const prof = await userService.getProfile(stored.userId);
          setProfile(prof);
        } catch (err) {
          console.warn('Could not load profile for stored user:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const authData = await authService.login(credentials);
    authService.saveAuth(authData);
    setUser({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
    });

    try {
      const prof = await userService.getProfile(authData.userId);
      setProfile(prof);
    } catch (e) {
      console.warn('Failed to load profile on login:', e);
    }
    return authData;
  };

  const register = async (userData) => {
    const authData = await authService.register(userData);
    authService.saveAuth(authData);
    setUser({
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
    });

    try {
      const prof = await userService.getProfile(authData.userId);
      setProfile(prof);
    } catch (e) {
      console.warn('Failed to load profile on registration:', e);
    }
    return authData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user && user.userId) {
      try {
        const prof = await userService.getProfile(user.userId);
        setProfile(prof);
        return prof;
      } catch (e) {
        console.error('Error refreshing profile:', e);
      }
    }
  };

  const value = {
    user,
    profile,
    setProfile,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
