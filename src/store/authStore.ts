import { create } from 'zustand';
import { axiosInstance } from '../api/axiosInstance';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => {
  // Expose logout function globally for high reliability interceptors
  (globalThis as any).__muse_logout_fn__ = () => {
    (globalThis as any).__muse_access_token__ = null;
    try {
      localStorage.removeItem('muse_refresh_token');
    } catch (e) {}
    set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
  };

  return {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isInitializing: true,

    login: async (usernameOrEmail, password) => {
      try {
        const response = await axiosInstance.post('/api/auth/login', {
          usernameOrEmail,
          password,
        });
        const { user, accessToken, refreshToken } = response.data;
        
        // Save access token globally for axios request interceptor
        (globalThis as any).__muse_access_token__ = accessToken;
        
        // Save refresh token back in localStorage as fallback
        try {
          if (refreshToken) {
            localStorage.setItem('muse_refresh_token', refreshToken);
          }
        } catch (e) {}

        set({
          user,
          accessToken,
          isAuthenticated: true,
          isInitializing: false,
        });
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed log in');
      }
    },

    register: async (username, email, password, avatar, bio) => {
      try {
        const response = await axiosInstance.post('/api/auth/register', {
          username,
          email,
          password,
          avatar,
          bio,
        });
        const { user, accessToken, refreshToken } = response.data;

        // Save access token globally for axios request interceptor
        (globalThis as any).__muse_access_token__ = accessToken;

        // Save refresh token back in localStorage as fallback
        try {
          if (refreshToken) {
            localStorage.setItem('muse_refresh_token', refreshToken);
          }
        } catch (e) {}

        set({
          user,
          accessToken,
          isAuthenticated: true,
          isInitializing: false,
        });
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },

    updateProfile: async (bio, avatar) => {
      try {
        const response = await axiosInstance.put('/api/auth/profile', {
          bio,
          avatar,
        });
        const { user } = response.data;
        set({ user });
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Profile update failed');
      }
    },

    logout: async () => {
      try {
        await axiosInstance.post('/api/auth/logout');
      } catch (e) {
        // Suppress and clear state anyway
      }
      (globalThis as any).__muse_logout_fn__();
    },

    refresh: async () => {
      try {
        // Read from local storage fallback if cookies are blocked inside iframe
        let storedRefresh = '';
        try {
          storedRefresh = localStorage.getItem('muse_refresh_token') || '';
        } catch (e) {}

        const response = await axiosInstance.post('/api/auth/refresh', {
          refreshToken: storedRefresh,
        });
        const { user, accessToken, refreshToken } = response.data;

        (globalThis as any).__muse_access_token__ = accessToken;
        try {
          if (refreshToken) {
            localStorage.setItem('muse_refresh_token', refreshToken);
          }
        } catch (e) {}

        set({
          user,
          accessToken,
          isAuthenticated: true,
          isInitializing: false,
        });
      } catch (error) {
        // Failed refresh or expired; clear states quietly
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isInitializing: false,
        });
      }
    },
  };
});
