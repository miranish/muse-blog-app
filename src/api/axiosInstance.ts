import axios from 'axios';

// Access base URL securely
const API_URL = '';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for cookie transmission
});

// Request Interceptor: Attach bearer accessToken dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    // Lazily import authStore state to prevent circular dependencies
    try {
      const token = (globalThis as any).__muse_access_token__;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Could not extract token inside interceptor', e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401s, refresh token, and auto-retry
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if error is 401 unauthorized, and we have not retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === 'TOKEN_EXPIRED' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to call the refresh endpoint to obtain new tokens
        // For security, can fall back to reading from local storage if iframe blocks cookies
        let storedRefresh = '';
        try {
          storedRefresh = localStorage.getItem('muse_refresh_token') || '';
        } catch (e) {}

        const response = await axios.post('/api/auth/refresh', {
          refreshToken: storedRefresh
        });
        
        const { accessToken, refreshToken, user } = response.data;
        
        // Save token globally & in local storage fallback
        (globalThis as any).__muse_access_token__ = accessToken;
        try {
          if (refreshToken) {
            localStorage.setItem('muse_refresh_token', refreshToken);
          }
        } catch (e) {}

        // Retry the original failed request with the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid; clear global store and log out
        try {
          (globalThis as any).__muse_logout_fn__?.();
        } catch (e) {}
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
