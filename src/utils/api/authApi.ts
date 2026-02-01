/**
 * Authentication API
 * Handles login, logout, and token management
 */

import axios from 'axios';
import { apiKey } from './config';
import { supabase } from '@/api/supabaseClient';

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
  // Validate expiresIn
  if (expiresIn && expiresIn < 60) {
    console.warn('⚠️ StoreToken: expiresIn is very short:', expiresIn, 'seconds. This might cause premature logout.');
  }
  
  await tokenStorage.setToken(token, expiresIn);
  
  // Store refresh token if provided
  if (refreshToken) {
    await tokenStorage.setRefreshToken(refreshToken);
  }
}

let refreshInFlight: Promise<LoginResponse | null> | null = null;

async function syncSupabaseSession(accessToken: string, refreshToken?: string | null): Promise<void> {
  if (!refreshToken) return;
  try {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.warn('⚠️ Sync Supabase session failed:', error);
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(): Promise<LoginResponse | null> {
  if (refreshInFlight) {
    return await refreshInFlight;
  }

  const refreshPromise = (async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    
    if (!refreshToken) {
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
      await syncSupabaseSession(response.data.access_token, response.data.refresh_token || refreshToken);
    }

    return response.data;
  })();

  refreshInFlight = refreshPromise;
  try {
    return await refreshPromise;
  } catch (error: any) {
    console.error('❌ RefreshToken: Error refreshing token:', error);
    // Don't logout on refresh failure - let the app continue with existing token
    // Only logout if token is actually expired (handled by restoreSession)
    // This prevents premature logout when refresh fails but token is still valid
    return null;
  } finally {
    if (refreshInFlight === refreshPromise) {
      refreshInFlight = null;
    }
  }
}

/**
 * Get stored access token
 */
export async function getStoredToken(): Promise<string | null> {
  const token = await tokenStorage.getToken();
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
    
    // Fetch profile details from v_user_profile/users table
    let profileDetails: Partial<User> | null = null;
    try {
      profileDetails = await fetchUserProfileDetails(userData.id, token, {
        email: userData.email,
        username: userData.user_metadata?.username,
      });
    } catch (error) {
      console.warn('⚠️ Failed to fetch user profile details:', error);
    }

    const profileRoleNames = normalizeToArray((profileDetails as any)?.role_names);

    let roleCodes: string[] = [];
    const profileRoleCodes = normalizeToArray((profileDetails as any)?.role_codes);
    if (profileRoleCodes.length > 0) {
      roleCodes = profileRoleCodes;
    } else {
      try {
        roleCodes = await fetchUserRoleCodes(userData.id, token);
      } catch (error) {
        console.warn('⚠️ Failed to fetch user role codes:', error);
      }
    }
  
    const roleDisplay =
      profileRoleNames.length > 0
        ? profileRoleNames.join(', ')
        : userData.user_metadata?.roleDisplay || undefined;

    return {
      id: userData.id,
      email: profileDetails?.email || userData.email,
      name:
        (profileDetails as any)?.full_name ||
        userData.user_metadata?.name ||
        userData.user_metadata?.full_name ||
        userData.email,
      roleDisplay,
      roleCodes: roleCodes.length > 0 ? roleCodes : undefined,
      roleCode: roleCodes[0] || undefined,
      role_names: (profileDetails as any)?.role_names,
      username: (profileDetails as any)?.username || userData.user_metadata?.username || userData.email,
      full_name: (profileDetails as any)?.full_name || userData.user_metadata?.full_name,
      phone: (profileDetails as any)?.phone,
      department_id: (profileDetails as any)?.department_id,
      department_name: (profileDetails as any)?.department_name,
      department_level: (profileDetails as any)?.department_level,
      department_code: (profileDetails as any)?.department_code,
      cap_quan_ly: (profileDetails as any)?.cap_quan_ly,
      don_vi_cong_tac_departments: (profileDetails as any)?.don_vi_cong_tac_departments,
      ...userData.user_metadata,
      ...profileDetails,
    };
  } catch (error: any) {
    console.error('Error fetching user info:', error);
    if (error.response?.status === 401) {
      // Check if token is actually expired before logging out
      const expired = await isTokenExpired(0);
      if (expired) {
        await logout();
      }
    }
    return null;
  }
}

async function fetchUserRoleCodes(userId: string, token: string): Promise<string[]> {
  try {
    if (!AUTH_API_BASE_URL) {
      return [];
    }

    const headers = {
      'Content-Type': 'application/json',
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
    };

    const viewUrl = `${AUTH_API_BASE_URL}/rest/v1/v_user_profile?user_id=eq.${userId}&select=role_codes`;
    const viewResponse = await axios.get<any[]>(viewUrl, { headers });
    const roleCodes = normalizeToArray(viewResponse.data?.[0]?.role_codes);
    return roleCodes;
  } catch (error: any) {
    console.error('Error fetching user role codes:', error);
    return [];
  }
}

async function fetchUserProfileDetails(
  userId: string,
  token: string,
  identifiers?: { email?: string | null; username?: string | null }
): Promise<Partial<User> | null> {
  try {
    if (!AUTH_API_BASE_URL) {
      return null;
    }

    const headers = {
      'Content-Type': 'application/json',
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
    };

    const selectFields = '_id,username,full_name,email,phone,department_id';
    const viewFields = 'user_id,email,full_name,cap_quan_ly,role_codes,role_names,don_vi_cong_tac_departments,is_super_admin';
    let row: any = null;
    let viewRow: any = null;

    try {
      const viewUrl = `${AUTH_API_BASE_URL}/rest/v1/v_user_profile?user_id=eq.${userId}&select=${viewFields}`;
      const viewResponse = await axios.get<any[]>(viewUrl, { headers });
      viewRow = viewResponse.data?.[0] ?? null;
      if (import.meta.env.DEV) {
        console.debug('[profile] v_user_profile by user_id', userId, viewRow);
      }
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('[profile] v_user_profile by user_id error', {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        });
      }
    }

    if (!viewRow && identifiers?.email) {
      const email = encodeURIComponent(identifiers.email);
      try {
        const viewByEmailUrl = `${AUTH_API_BASE_URL}/rest/v1/v_user_profile?email=eq.${email}&select=${viewFields}`;
        const viewByEmailResponse = await axios.get<any[]>(viewByEmailUrl, { headers });
        viewRow = viewByEmailResponse.data?.[0] ?? null;
        if (import.meta.env.DEV) {
          console.debug('[profile] v_user_profile by email', identifiers.email, viewRow);
        }
      } catch (error: any) {
        if (import.meta.env.DEV) {
          console.error('[profile] v_user_profile by email error', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
          });
        }
      }
    }

    try {
      const userUrl = `${AUTH_API_BASE_URL}/rest/v1/users?_id=eq.${userId}&select=${selectFields}`;
      const userResponse = await axios.get<any[]>(userUrl, { headers });
      row = userResponse.data?.[0];
    } catch (error: any) {
      if (import.meta.env.DEV) {
        console.error('[profile] users by id error', {
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
        });
      }
    }

    if (!row && identifiers?.email) {
      try {
        const email = encodeURIComponent(identifiers.email);
        const byEmailUrl = `${AUTH_API_BASE_URL}/rest/v1/users?email=eq.${email}&select=${selectFields}`;
        const byEmailResponse = await axios.get<any[]>(byEmailUrl, { headers });
        row = byEmailResponse.data?.[0];
      } catch (error: any) {
        if (import.meta.env.DEV) {
          console.error('[profile] users by email error', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
          });
        }
      }
    }

    if (!row && identifiers?.username) {
      try {
        const username = encodeURIComponent(identifiers.username);
        const byUsernameUrl = `${AUTH_API_BASE_URL}/rest/v1/users?username=eq.${username}&select=${selectFields}`;
        const byUsernameResponse = await axios.get<any[]>(byUsernameUrl, { headers });
        row = byUsernameResponse.data?.[0];
      } catch (error: any) {
        if (import.meta.env.DEV) {
          console.error('[profile] users by username error', {
            message: error?.message,
            status: error?.response?.status,
            data: error?.response?.data,
          });
        }
      }
    }

    let departmentName = row?.department_name ?? null;
    let departmentLevel = row?.department_level ?? null;
    let departmentCode = null;
    const departmentsArray = normalizeToArray(viewRow?.don_vi_cong_tac_departments);
    if (!departmentName && departmentsArray.length > 0) {
      departmentName = departmentsArray.join(', ');
    }

    if (!departmentName || departmentLevel == null || !departmentCode) {
      const departmentUserId = row?._id ?? userId;
      const deptUrl = `${AUTH_API_BASE_URL}/rest/v1/department_users?user_id=eq.${departmentUserId}&select=department_id,departments(_id,name,code,level)`;
      const deptResponse = await axios.get<any[]>(deptUrl, { headers });
      const deptRow = deptResponse.data?.[0]?.departments;
      if (deptRow) {
        departmentName = departmentName ?? deptRow.name ?? null;
        departmentLevel = departmentLevel ?? deptRow.level ?? null;
        departmentCode = deptRow.code ?? departmentCode;
      }
    }

    if (!row && !viewRow) {
      return null;
    }

    const roleCodes = normalizeToArray(viewRow?.role_codes);
    const roleNames = normalizeToArray(viewRow?.role_names);

    return {
      id: row?._id ?? row?.id ?? viewRow?.user_id ?? userId,
      username: row?.username ?? null,
      full_name: row?.full_name ?? viewRow?.full_name ?? null,
      email: row?.email ?? viewRow?.email ?? null,
      phone: row?.phone ?? null,
      department_id: row?.department_id ?? null,
      department_name: departmentName ?? null,
      department_level: departmentLevel ?? null,
      department_code: departmentCode ?? null,
      cap_quan_ly: viewRow?.cap_quan_ly ?? null,
      is_super_admin: viewRow?.is_super_admin ?? null,
      role_codes: roleCodes.length > 0 ? roleCodes : undefined,
      role_names: roleNames.length > 0 ? roleNames : undefined,
      don_vi_cong_tac_departments: departmentsArray.length > 0 ? departmentsArray : undefined,
    };
  } catch (error: any) {
    if (import.meta.env.DEV) {
      console.error('Error fetching user profile details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } else {
      console.error('Error fetching user profile details:', error);
    }
    return null;
  }
}

function normalizeToArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

/**
 * Fetch user role name from database
 */
export async function fetchUserRoleName(userId: string, token: string): Promise<string | null> {
  try {
    if (!AUTH_API_BASE_URL) {
      return null;
    }

    const viewUrl = `${AUTH_API_BASE_URL}/rest/v1/v_user_profile?user_id=eq.${userId}&select=role_names`;
    const viewResponse = await axios.get<any[]>(viewUrl, {
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const roleNames = normalizeToArray(viewResponse.data?.[0]?.role_names);
    return roleNames.length > 0 ? roleNames.join(', ') : null;
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
      return null;
    }

    // Check if token is actually expired (no buffer - only check if truly expired)
    // Buffer time is handled by auto-refresh service, not here
    const expired = await isTokenExpired(0);
    if (expired) {
      // Try to refresh token
      const refreshResponse = await refreshAccessToken();
      if (refreshResponse && refreshResponse.access_token) {
        token = refreshResponse.access_token;
      } else {
        // Don't logout here - let ProtectedRoute handle it
        // This allows user to continue using the app if refresh fails but token is still valid
        // The auto-refresh service will handle refresh before expiry
        return null;
      }
    }

    // Fetch user info - if it fails, still return token (user can be fetched later)
    let user: User | null = null;
    try {
      user = await fetchUserInfo(token);
    } catch (error: any) {
      console.warn('⚠️ RestoreSession: Failed to fetch user info, but token is valid. Will fetch later.', error?.response?.status, error?.message);
      // Don't fail restore if user info fetch fails - token is still valid
      // User info can be fetched later via fetchUserInfoRequest
      // Return token anyway so user can stay authenticated
    }
    
    return { token, user };
  } catch (error: any) {
    console.error('❌ RestoreSession: Error restoring session:', error?.message || error);
    // Try to get token anyway - might be a network issue
    try {
      const token = await getStoredToken();
      if (token) {
        return { token, user: null };
      }
    } catch (e) {
      // Ignore
    }
    return null;
  }
}

