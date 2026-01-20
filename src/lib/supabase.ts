/**
 * Supabase Client Configuration - MAPPA Portal
 * 
 * Type-safe Supabase client với database schema cho MAPPA Portal.
 * Tất cả UI components sử dụng design tokens từ /src/styles/theme.css
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

// Debug logging

// Construct Supabase URL from projectId
const supabaseUrl = `https://${projectId}.supabase.co`;
const supabaseAnonKey = publicAnonKey;


// Validate credentials
if (!projectId || projectId === 'undefined' || projectId === 'null') {
  throw new Error(
    'Missing or invalid Supabase projectId. Check src/utils/supabase/info.ts or .env'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined' || supabaseAnonKey === 'null') {
  throw new Error(
    'Missing or invalid Supabase publicAnonKey. Check src/utils/supabase/info.ts or .env'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Disable checkout/payment features to avoid "No checkout popup config found" error
    flowType: 'pkce',
    // Set redirect URL to current origin
    redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey, // Explicitly set apikey header
    },
  },
});


// ============================================
// DATABASE TYPES
// ============================================

/**
 * Module - 9 modules của MAPPA Portal
 */
export interface Module {
  id: string;
  code: string;
  name: string;
  icon?: string;
  path: string;
  description?: string;
  order_index: number;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * Permission - Quyền hạn trong hệ thống
 */
export interface Permission {
  id: string;
  code: string;
  name: string;
  description?: string;
  module_id: string;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * Role - Vai trò người dùng
 */
export interface Role {
  _id?: string; // Added _id to match database schema
  id: string; // UUID from database
  code: string;
  name: string;
  description?: string;
  status: number; // INTEGER: 0 = inactive, 1 = active
  is_system?: boolean; // System roles cannot be deleted
  created_at?: string;
  updated_at?: string;
}

/**
 * RolePermission - Ma trận phân quyền vai trò
 */
export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at?: string;
}

/**
 * User - Người dùng hệ thống
 */
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * UserRole - Vai trò của người dùng
 */
export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at?: string;
}

/**
 * Facility - Cơ sở (tab Cơ sở & Địa bàn)
 */
export interface Facility {
  id: string;
  code: string;
  name: string;
  type?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * Team - Đội/nhóm
 */
export interface Team {
  id: string;
  code: string;
  name: string;
  description?: string;
  leader_id?: string;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * Territory - Địa bàn
 */
export interface Territory {
  id: string;
  code: string;
  name: string;
  type?: string; // province, district, ward
  parent_id?: string;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

/**
 * Category - Danh mục chung
 */
export interface Category {
  id: string;
  code: string;
  name: string;
  type: string;
  parent_id?: string;
  order_index?: number;
  status: number; // 0 = inactive, 1 = active
  created_at?: string;
  updated_at?: string;
}

// ============================================
// TABLE NAMES CONSTANTS
// ============================================

export const Tables = {
  MODULES: 'modules',
  PERMISSIONS: 'permissions',
  ROLES: 'roles',
  ROLE_PERMISSIONS: 'role_permissions',
  USERS: 'users',
  USER_ROLES: 'user_roles',
  FACILITIES: 'facilities',
  TEAMS: 'teams',
  TERRITORIES: 'territories',
  CATEGORIES: 'categories',
} as const;

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Generic response type for Supabase queries
 */
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

/**
 * Create data type (without id, timestamps)
 */
export type CreateData<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

/**
 * Update data type (without id, created_at)
 */
export type UpdateData<T> = Partial<Omit<T, 'id' | 'created_at'>>;
