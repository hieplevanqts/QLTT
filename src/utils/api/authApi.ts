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
  expiresIn?: number; // Optional: Request specific expiration time in seconds (may not be supported by Supabase)
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
    // Note: Supabase Auth may not support custom expires_in, but we can try
    let url = `${AUTH_API_BASE_URL}/auth/v1/token?grant_type=password`;
    
    // Try to add expires_in parameter if provided (Supabase may ignore this)
    if (credentials.expiresIn) {
      url += `&expires_in=${credentials.expiresIn}`;
      console.log('🔧 Login: Attempting to set custom expires_in:', credentials.expiresIn, 'seconds');
    }
    
    // Supabase Auth expects JSON body { email, password }
    // Note: expires_in in body may not be supported by Supabase Auth
    const requestBody: any = {
      email: credentials.email,
      password: credentials.password,
    };
    
    // Try adding expires_in to body (Supabase may ignore this)
    if (credentials.expiresIn) {
      requestBody.expires_in = credentials.expiresIn;
    }
    
    const response = await axios.post<LoginResponse>(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        // Supabase Auth requires api key in request headers
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const loginResponse = response.data;
    
    // Log token expiry info
    if (loginResponse.expires_in) {
      const expiresInMinutes = Math.round(loginResponse.expires_in / 60);
      const expiresInHours = (loginResponse.expires_in / 3600).toFixed(2);
      console.log('🔑 Login Response:', {
        hasAccessToken: !!loginResponse.access_token,
        hasRefreshToken: !!loginResponse.refresh_token,
        expiresIn: `${loginResponse.expires_in}s (${expiresInMinutes} minutes / ${expiresInHours} hours)`,
      });
    } else {
      console.warn('⚠️ Login Response: No expires_in provided');
    }
    
    return loginResponse;
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
 * Store access token and refresh token using professional storage
 */
export async function storeToken(token: string, expiresIn?: number, refreshToken?: string): Promise<void> {
  console.log('💾 StoreToken: Storing token...', { 
    hasToken: !!token, 
    expiresIn: expiresIn ? `${expiresIn}s (${Math.round(expiresIn / 60)} minutes)` : 'not provided',
    hasRefreshToken: !!refreshToken 
  });
  
  // Validate expiresIn
  if (expiresIn && expiresIn < 60) {
    console.warn('⚠️ StoreToken: expiresIn is very short:', expiresIn, 'seconds. This might cause premature logout.');
  }
  
  await tokenStorage.setToken(token, expiresIn);
  
  // Store refresh token if provided
  if (refreshToken) {
    await tokenStorage.setRefreshToken(refreshToken);
  }
  
  const stored = await tokenStorage.getToken();
  console.log('✅ StoreToken: Token stored successfully', { hasStoredToken: !!stored });
  
  // Verify expiry was stored correctly
  if (expiresIn) {
    const expiresAt = await tokenStorage.getTokenExpiry();
    if (expiresAt) {
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      const minutesUntilExpiry = Math.round(timeUntilExpiry / 1000 / 60);
      console.log('✅ StoreToken: Expiry verified', {
        expiresAt: new Date(expiresAt).toISOString(),
        now: new Date(now).toISOString(),
        minutesUntilExpiry: `${minutesUntilExpiry} minutes`,
        hoursUntilExpiry: `${(minutesUntilExpiry / 60).toFixed(2)} hours`
      });
    }
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<LoginResponse | null> {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
      console.log('❌ RefreshToken: No refresh token found');
      return null;
    }

    if (!AUTH_API_BASE_URL) {
      throw new Error('Thiếu cấu hình AUTH_API_BASE_URL');
    }
    if (!apiKey) {
      throw new Error('Thiếu Supabase anon key');
    }

    const url = `${AUTH_API_BASE_URL}/auth/v1/token?grant_type=refresh_token`;
    
    const response = await axios.post<LoginResponse>(url, {
      refresh_token: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
      },
    });

    // Store new tokens
    if (response.data.access_token) {
      await storeToken(
        response.data.access_token, 
        response.data.expires_in,
        response.data.refresh_token
      );
    }

    return response.data;
  } catch (error: any) {
    console.error('❌ RefreshToken: Error refreshing token:', error);
    // Don't logout on refresh failure - let the app continue with existing token
    // Only logout if token is actually expired (handled by restoreSession)
    // This prevents premature logout when refresh fails but token is still valid
    return null;
  }
}

/**
 * Get stored access token
 */
export async function getStoredToken(): Promise<string | null> {
  const token = await tokenStorage.getToken();
  console.log('🔍 getStoredToken:', { 
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'null'
  });
  return token;
}

/**
 * Check if token is expired or will expire soon
 * @param bufferMinutes - Buffer time in minutes before actual expiry (default: 5 minutes)
 */
export async function isTokenExpired(bufferMinutes: number = 0): Promise<boolean> {
  return await tokenStorage.isTokenExpired(bufferMinutes);
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
    
    // Fetch user role name
    let roleDisplay: string | null = null;
    try {
      roleDisplay = await fetchUserRoleName(userData.id, token);
    } catch (error) {
      console.warn('⚠️ Failed to fetch user role name:', error);
    }
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.user_metadata?.name || userData.user_metadata?.full_name || userData.email,
      roleDisplay: roleDisplay || userData.user_metadata?.roleDisplay || undefined,
      ...userData.user_metadata,
    };
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    if (error.response?.status === 401) {
      // Check if token is actually expired before logging out
      const expired = await isTokenExpired(0);
      if (expired) {
        console.log('⚠️ FetchUserInfo: Token is expired, logging out...');
        await logout();
      } else {
        console.warn('⚠️ FetchUserInfo: Got 401 but token is not expired, might be temporary API issue');
        // Don't logout - token might still be valid, just API issue
      }
    }
    return null;
  }
}

/**
 * Fetch user role name from database
 */
export async function fetchUserRoleName(userId: string, token: string): Promise<string | null> {
  try {
    if (!AUTH_API_BASE_URL) {
      return null;
    }

    // Get user_roles
    const userRolesUrl = `${AUTH_API_BASE_URL}/rest/v1/user_roles?user_id=eq.${userId}&select=role_id&limit=1`;
    const userRolesResponse = await axios.get<{ role_id: string }[]>(userRolesUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const roleIds = userRolesResponse.data?.map(ur => ur.role_id) || [];
    
    if (roleIds.length === 0) {
      return null;
    }

    // Get role name from roles table
    const rolesUrl = `${AUTH_API_BASE_URL}/rest/v1/roles?_id=eq.${roleIds[0]}&select=name`;
    const rolesResponse = await axios.get<{ name: string }[]>(rolesUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    return rolesResponse.data?.[0]?.name || null;
  } catch (error: any) {
    console.error('Error fetching user role name:', error);
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
    let token = await getStoredToken();
    
    if (!token) {
      console.log('❌ RestoreSession: No token found in storage');
      return null;
    }

    console.log('✅ RestoreSession: Token found in storage', { tokenLength: token.length });

    // Check if token is actually expired (no buffer - only check if truly expired)
    // Buffer time is handled by auto-refresh service, not here
    const expired = await isTokenExpired(0);
    if (expired) {
      console.log('⚠️ RestoreSession: Token is expired, attempting to refresh...');
      
      // Try to refresh token
      const refreshResponse = await refreshAccessToken();
      if (refreshResponse && refreshResponse.access_token) {
        console.log('✅ RestoreSession: Token refreshed successfully');
        token = refreshResponse.access_token;
      } else {
        console.log('❌ RestoreSession: Failed to refresh token');
        // Don't logout here - let ProtectedRoute handle it
        // This allows user to continue using the app if refresh fails but token is still valid
        // The auto-refresh service will handle refresh before expiry
        return null;
      }
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

