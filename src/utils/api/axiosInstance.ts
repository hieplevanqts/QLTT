/**
 * Axios Instance with Interceptors
 * Handles 401 errors globally and redirects to login
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';
import { logout, isTokenExpired } from './authApi';

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: SUPABASE_REST_URL,
  headers: getHeaders(),
});

// Request interceptor - Add token to requests if available
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Try to get token from storage
    try {
      const { getStoredToken } = await import('./authApi');
      const token = await getStoredToken();
      
      if (token && config.headers) {
        // Add token to Authorization header if we have user token
        // Note: Supabase REST API uses anon key by default, but we can override with user token
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Ignore errors when getting token
      console.warn('Failed to get token for request:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Check if token is actually expired
      try {
        const expired = await isTokenExpired(0);
        
        if (expired) {
          // Prevent multiple logout calls
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            
            // Logout and clear storage
            await logout();
            
            // Redirect to login page - use window.location.replace to prevent back button
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
              // Store current path for redirect after login
              const currentPath = window.location.pathname;
              window.location.replace(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            }
          }
        } else {
          console.warn('⚠️ AxiosInterceptor: Got 401 but token is not expired, might be temporary API issue');
        }
      } catch (checkError) {
        console.error('❌ AxiosInterceptor: Error checking token expiry:', checkError);
        // If we can't check, assume expired and logout
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          await logout();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            window.location.href = '/auth/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

