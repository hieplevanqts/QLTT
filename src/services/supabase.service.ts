/**
 * MAPPA Portal - Supabase Service Layer
 * Replaces KV Store with PostgreSQL/YSQL
 * Based on supabase.md schema design
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type {
  Tenant,
  User,
  TenantMember,
  Department,
  Role,
  Location,
  AuditLog,
  ApiResponse,
  PaginatedResponse,
  BaseFilter,
} from '@/types/core.types';

// ============================================================================
// SUPABASE CLIENT SETUP
// ============================================================================

let supabaseClient: SupabaseClient | null = null;

export function initSupabase(supabaseUrl: string, supabaseKey: string): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return supabaseClient;
}

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    throw new Error('Supabase client not initialized. Call initSupabase() first.');
  }
  return supabaseClient;
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

export class SupabaseError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}

function handleError(error: any): never {
  console.error('Supabase error:', error);
  throw new SupabaseError(
    error.message || 'An error occurred',
    error.code,
    error.details
  );
}

// ============================================================================
// A. TENANT SERVICE
// ============================================================================

export const TenantService = {
  /**
   * Get tenant by code (slug)
   * Equivalent to KV: kv.get('tenant:{code}')
   */
  async getByCode(code: string): Promise<Tenant | null> {
    const { data, error } = await getSupabase()
      .from('tenants')
      .select('*, id:_id')
      .eq('code', code)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * Get tenant by ID
   */
  async getById(id: string): Promise<Tenant | null> {
    const { data, error } = await getSupabase()
      .from('tenants')
      .select('*, id:_id')
      .eq('_id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * List all active tenants
   * Equivalent to KV: kv.getByPrefix('tenant:')
   */
  async list(filter?: BaseFilter): Promise<PaginatedResponse<Tenant>> {
    let query = getSupabase()
      .from('tenants')
      .select('*, id:_id', { count: 'exact' })
      .is('deleted_at', null);

    // Search
    if (filter?.search) {
      query = query.or(`name.ilike.%${filter.search}%,code.ilike.%${filter.search}%`);
    }

    // Pagination
    const page = filter?.page || 1;
    const pageSize = filter?.page_size || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Sort
    const sortBy = filter?.sort_by || 'created_at';
    const sortOrder = filter?.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error, count } = await query;
    if (error) handleError(error);

    return {
      items: data || [],
      total: count || 0,
      page,
      page_size: pageSize,
      total_pages: Math.ceil((count || 0) / pageSize),
    };
  },

  /**
   * Create new tenant
   */
  async create(tenant: Omit<Tenant, '_id' | 'created_at' | 'updated_at' | 'version'>): Promise<Tenant> {
    const { data, error } = await getSupabase()
      .from('tenants')
      .insert({
        ...tenant,
        version: 1,
      })
      .select()
      .single();

    if (error) handleError(error);
    return data;
  },

  /**
   * Update tenant with optimistic locking
   */
  async update(id: string, updates: Partial<Tenant>, currentVersion: number): Promise<Tenant> {
    const { data, error } = await getSupabase()
      .from('tenants')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        version: currentVersion + 1,
      })
      .eq('_id', id)
      .eq('version', currentVersion)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new SupabaseError('Optimistic lock failed. Data has been modified by another user.', 'OPTIMISTIC_LOCK');
      }
      handleError(error);
    }

    return data;
  },

  /**
   * Soft delete tenant
   */
  async delete(id: string): Promise<void> {
    const { error } = await getSupabase()
      .from('tenants')
      .update({ deleted_at: new Date().toISOString() })
      .eq('_id', id);

    if (error) handleError(error);
  },
};

// ============================================================================
// B. USER SERVICE
// ============================================================================

export const UserService = {
  /**
   * Get user by email
   * Equivalent to KV: kv.get('user:{email}')
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await getSupabase()
      .from('users')
      .select('*, id:_id')
      .eq('email', email)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | null> {
    const { data, error } = await getSupabase()
      .from('users')
      .select('*, id:_id')
      .eq('_id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * Create new user
   */
  async create(user: Omit<User, '_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const { data, error } = await getSupabase()
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error) handleError(error);
    return data;
  },

  /**
   * Update user
   */
  async update(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await getSupabase()
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('_id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) handleError(error);
    return data;
  },

  /**
   * Update last login time
   */
  async updateLastLogin(id: string): Promise<void> {
    const { error } = await getSupabase()
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('_id', id);

    if (error) handleError(error);
  },
};

// ============================================================================
// C. TENANT MEMBER SERVICE
// ============================================================================

export const MemberService = {
  /**
   * Get member by tenant and user
   * Equivalent to KV: kv.get('member:{tenant_id}:{user_id}')
   */
  async getByTenantAndUser(tenantId: string, userId: string): Promise<TenantMember | null> {
    const { data, error } = await getSupabase()
      .from('tenant_members')
      .select('*, id:_id')
      .eq('tenant_id', tenantId)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * List members of a tenant
   * Equivalent to KV: kv.getByPrefix('member:tenant:{tenant_id}:')
   */
  async listByTenant(tenantId: string, filter?: BaseFilter): Promise<PaginatedResponse<TenantMember>> {
    let query = getSupabase()
      .from('tenant_members')
      .select('*, users(*, id:_id), departments(*, id:_id)', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('deleted_at', null);

    // Search
    if (filter?.search) {
      query = query.or(`display_name.ilike.%${filter.search}%,employee_code.ilike.%${filter.search}%`);
    }

    // Pagination
    const page = filter?.page || 1;
    const pageSize = filter?.page_size || 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    // Sort
    const sortBy = filter?.sort_by || 'created_at';
    const sortOrder = filter?.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error, count } = await query;
    if (error) handleError(error);

    return {
      items: data || [],
      total: count || 0,
      page,
      page_size: pageSize,
      total_pages: Math.ceil((count || 0) / pageSize),
    };
  },

  /**
   * List tenants of a user
   * Equivalent to KV: kv.getByPrefix('member:user:{user_id}:')
   */
  async listByUser(userId: string): Promise<TenantMember[]> {
    const { data, error } = await getSupabase()
      .from('tenant_members')
      .select('*, tenants(*, id:_id)')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('joined_at', { ascending: false });

    if (error) handleError(error);
    return data || [];
  },

  /**
   * Create member
   */
  async create(member: Omit<TenantMember, '_id' | 'created_at' | 'updated_at' | 'version'>): Promise<TenantMember> {
    const { data, error } = await getSupabase()
      .from('tenant_members')
      .insert({
        ...member,
        version: 1,
      })
      .select()
      .single();

    if (error) handleError(error);
    return data;
  },

  /**
   * Update member with optimistic locking
   */
  async update(id: string, updates: Partial<TenantMember>, currentVersion: number): Promise<TenantMember> {
    const { data, error } = await getSupabase()
      .from('tenant_members')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        version: currentVersion + 1,
      })
      .eq('_id', id)
      .eq('version', currentVersion)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new SupabaseError('Optimistic lock failed. Data has been modified by another user.', 'OPTIMISTIC_LOCK');
      }
      handleError(error);
    }

    return data;
  },
};

// ============================================================================
// D. DEPARTMENT SERVICE
// ============================================================================

export const DepartmentService = {
  /**
   * Get department by ID
   */
  async getById(id: string): Promise<Department | null> {
    const { data, error } = await getSupabase()
      .from('departments')
      .select('*, id:_id')
      .eq('_id', id)
      .is('deleted_at', null)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * List departments of tenant
   * Equivalent to KV: kv.getByPrefix('department:tenant:{tenant_id}:')
   */
  async listByTenant(tenantId: string): Promise<Department[]> {
    const { data, error } = await getSupabase()
      .from('departments')
      .select('*, id:_id')
      .eq('tenant_id', tenantId)
      .is('deleted_at', null)
      .order('path', { ascending: true });

    if (error) handleError(error);
    return data || [];
  },

  /**
   * Get department tree (using materialized path)
   * Equivalent to KV: kv.get('department:tenant:{tenant_id}:tree')
   */
  async getTree(tenantId: string): Promise<Department[]> {
    const departments = await this.listByTenant(tenantId);
    
    // Build tree structure using path
    const buildTree = (items: Department[], parentPath: string = ''): Department[] => {
      return items
        .filter(dept => {
          if (!dept.path) return !parentPath;
          const pathParts = dept.path.split('/').filter(Boolean);
          const parentPathParts = parentPath.split('/').filter(Boolean);
          return pathParts.length === parentPathParts.length + 1 &&
                 dept.path.startsWith(parentPath);
        })
        .map(dept => ({
          ...dept,
        }));
    };

    return buildTree(departments);
  },

  /**
   * Create department
   */
  async create(department: Omit<Department, '_id' | 'created_at' | 'updated_at' | 'version'>): Promise<Department> {
    const { data, error } = await getSupabase()
      .from('departments')
      .insert({
        ...department,
        version: 1,
      })
      .select()
      .single();

    if (error) handleError(error);
    return data;
  },

  /**
   * Update department
   */
  async update(id: string, updates: Partial<Department>, currentVersion: number): Promise<Department> {
    const { data, error } = await getSupabase()
      .from('departments')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        version: currentVersion + 1,
      })
      .eq('_id', id)
      .eq('version', currentVersion)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new SupabaseError('Optimistic lock failed.', 'OPTIMISTIC_LOCK');
      }
      handleError(error);
    }

    return data;
  },
};

// ============================================================================
// E. ROLE SERVICE
// ============================================================================

export const RoleService = {
  /**
   * Get role by ID
   */
  async getById(id: string): Promise<Role | null> {
    const { data, error } = await getSupabase()
      .from('roles')
      .select('*, id:_id')
      .eq('_id', id)
      .single();

    if (error && error.code !== 'PGRST116') handleError(error);
    return data;
  },

  /**
   * List roles of tenant
   */
  async listByTenant(tenantId: string): Promise<Role[]> {
    const { data, error } = await getSupabase()
      .from('roles')
      .select('*, id:_id')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true });

    if (error) handleError(error);
    return data || [];
  },

  /**
   * Get roles by member
   */
  async getByMember(memberId: string): Promise<Role[]> {
    const { data, error } = await getSupabase()
      .from('member_roles')
      .select('roles(*, id:_id)')
      .eq('member_id', memberId);

    if (error) handleError(error);
    return data?.map(item => item.roles).filter(Boolean) || [];
  },

  /**
   * Check if member has permission
   */
  async hasPermission(memberId: string, permission: string): Promise<boolean> {
    const roles = await this.getByMember(memberId);
    return roles.some(role => role.permissions.includes(permission));
  },
};

// ============================================================================
// F. AUDIT LOG SERVICE
// ============================================================================

export const AuditService = {
  /**
   * Create audit log
   */
  async log(log: Omit<AuditLog, '_id' | 'created_at'>): Promise<void> {
    const { error } = await getSupabase()
      .from('audit_logs')
      .insert(log);

    if (error) console.error('Failed to create audit log:', error);
  },

  /**
   * Get audit logs for resource
   */
  async getByResource(resourceType: string, resourceId: string, limit = 50): Promise<AuditLog[]> {
    const { data, error } = await getSupabase()
      .from('audit_logs')
      .select('*, users(full_name, id:_id)')
      .eq('resource_type', resourceType)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) handleError(error);
    return data || [];
  },
};

// ============================================================================
// G. HELPER FUNCTIONS
// ============================================================================

/**
 * Generate UUID v7 (time-sortable)
 * This should be generated on backend, but included here for reference
 */
export function generateUUIDv7(): string {
  // This is a simplified version
  // In production, use proper UUID v7 library
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
}

/**
 * Format ISO timestamp for display
 */
export function formatTimestamp(isoString: string, locale = 'vi-VN'): string {
  return new Date(isoString).toLocaleString(locale);
}
