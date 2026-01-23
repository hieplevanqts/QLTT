/**
 * Authentication API
 * Handles login, logout, and token management
 */

import axios from 'axios';
import { apiKey } from './config';

// Base URL for auth API - can be configured via environment variable
// Default to Supabase if not specified, or use custom auth API URL
const AUTH_API_BASE_URL = import.meta.env.VITE_AUTH_API_URL || import.meta.env.VITE_SUPABASE_URL || '';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    [key: string]: any;
  };
}

export interface LoginError {
  error: string;
  error_description?: string;
  message?: string;
}

/**
 * Login with email and password
 * @param credentials - Email and password
 * @returns Login response with access token
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    if (!AUTH_API_BASE_URL) {
      throw new Error('Thiếu cấu hình AUTH_API_BASE_URL (VITE_AUTH_API_URL hoặc VITE_SUPABASE_URL).');
    }
    if (!apiKey) {
      throw new Error('Thiếu Supabase anon key (VITE_SUPABASE_PUBLIC_ANON_KEY hoặc VITE_SUPABASE_ANON_KEY).');
    }

    // Build URL with query parameters
    const url = `${AUTH_API_BASE_URL}/auth/v1/token?grant_type=password`;
    
    // Supabase Auth expects JSON body { email, password }
    const response = await axios.post<LoginResponse>(url, {
      email: credentials.email,
      password: credentials.password,
    }, {
      headers: {
        'Content-Type': 'application/json',
        // Supabase Auth requires api key in request headers
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.data;
  } catch (error: any) {
    // Handle axios errors
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as LoginError;
      throw new Error(
        errorData.error_description || 
        errorData.message || 
        errorData.error || 
        `Đăng nhập thất bại: ${error.response.status}`
      );
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else {
      // Something else happened
      throw new Error(error.message || 'Có lỗi xảy ra khi đăng nhập.');
    }
  }
}

import { tokenStorage } from '../storage/tokenStorage';
import { User } from '../../store/slices/authSlice';

/**
 * Logout - clear token from storage
 */
export async function logout(): Promise<void> {
  await tokenStorage.clear();
}

/**
 * Store access token using professional storage
 */
export async function storeToken(token: string, expiresIn?: number): Promise<void> {
  console.log('💾 StoreToken: Storing token...', { hasToken: !!token, expiresIn });
  await tokenStorage.setToken(token, expiresIn);
  const stored = await tokenStorage.getToken();
  console.log('✅ StoreToken: Token stored successfully', { hasStoredToken: !!stored });
}

/**
 * Get stored access token
 */
export async function getStoredToken(): Promise<string | null> {
  return await tokenStorage.getToken();
}

/**
 * Check if token is expired
 */
export async function isTokenExpired(): Promise<boolean> {
  return await tokenStorage.isTokenExpired();
}

/**
 * Fetch current user info from Supabase using access token
 */
export async function fetchUserInfo(token: string): Promise<User | null> {
  try {
    if (!AUTH_API_BASE_URL) {
      throw new Error('Thiếu cấu hình AUTH_API_BASE_URL');
    }

    // Supabase Auth endpoint to get current user
    const url = `${AUTH_API_BASE_URL}/auth/v1/user`;
    
    const response = await axios.get<{
      id: string;
      email: string;
      user_metadata?: {
        name?: string;
        full_name?: string;
        [key: string]: any;
      };
      [key: string]: any;
    }>(url, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = response.data;
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.user_metadata?.name || userData.user_metadata?.full_name || userData.email,
      ...userData.user_metadata,
    };
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    if (error.response?.status === 401) {
      // Token invalid, clear it
      await logout();
    }
    return null;
  }
}

/**
 * Fetch user permissions from database
 */
export async function fetchUserPermissions(userId: string, token: string): Promise<string[]> {
  try {
    if (!AUTH_API_BASE_URL) {
      return [];
    }

    // Query user_roles -> role_permissions -> permissions
    // Using Supabase REST API
    // First get user_roles
    const userRolesUrl = `${AUTH_API_BASE_URL}/rest/v1/user_roles?user_id=eq.${userId}&select=role_id`;
    const userRolesResponse = await axios.get<{ role_id: string }[]>(userRolesUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const roleIds = userRolesResponse.data?.map(ur => ur.role_id) || [];
    
    if (roleIds.length === 0) {
      return [];
    }

    // Get role_permissions
    const rolePermsUrl = `${AUTH_API_BASE_URL}/rest/v1/role_permissions?role_id=in.(${roleIds.join(',')})&select=permission_id`;
    const rolePermsResponse = await axios.get<{ permission_id: string }[]>(rolePermsUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const permissionIds = rolePermsResponse.data?.map(rp => rp.permission_id) || [];
    
    if (permissionIds.length === 0) {
      return [];
    }

    // Get permission codes
    const permissionsUrl = `${AUTH_API_BASE_URL}/rest/v1/permissions?_id=in.(${permissionIds.join(',')})&select=code`;
    const permissionsResponse = await axios.get<{ code: string }[]>(permissionsUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    return permissionsResponse.data?.map(p => p.code).filter(Boolean) || [];
  } catch (error: any) {
    console.error('Error fetching user permissions:', error);
    // Return empty array on error, don't block login
    return [];
  }
}

/**
 * Restore session from storage
 */
export async function restoreSession(): Promise<{ token: string; user: User | null } | null> {
  try {
    console.log('🔄 RestoreSession: Starting session restore...');
    const token = await getStoredToken();
    
    if (!token) {
      console.log('❌ RestoreSession: No token found in storage');
      return null;
    }

    console.log('✅ RestoreSession: Token found in storage', { tokenLength: token.length });

    // Check if token is expired
    const expired = await isTokenExpired();
    if (expired) {
      console.log('❌ RestoreSession: Token is expired, clearing...');
      await logout();
      return null;
    }

    console.log('✅ RestoreSession: Token is valid, fetching user info...');

    // Fetch user info - if it fails, still return token (user can be fetched later)
    let user: User | null = null;
    try {
      user = await fetchUserInfo(token);
      console.log('✅ RestoreSession: User info fetched successfully', user ? { id: user.id, email: user.email } : 'null');
    } catch (error: any) {
      console.warn('⚠️ RestoreSession: Failed to fetch user info, but token is valid. Will fetch later.', error?.response?.status, error?.message);
      // Don't fail restore if user info fetch fails - token is still valid
      // User info can be fetched later via fetchUserInfoRequest
      // Return token anyway so user can stay authenticated
    }
    
    console.log('✅ RestoreSession: Session restored successfully', { hasToken: !!token, hasUser: !!user });
    return { token, user };
  } catch (error: any) {
    console.error('❌ RestoreSession: Error restoring session:', error?.message || error);
    // Try to get token anyway - might be a network issue
    try {
      const token = await getStoredToken();
      if (token) {
        console.log('⚠️ RestoreSession: Error occurred but token exists, returning token anyway');
        return { token, user: null };
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }
}

