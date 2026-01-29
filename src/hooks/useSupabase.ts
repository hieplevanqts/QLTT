/**
 * Custom Supabase Hooks - MAPPA Portal
 * 
 * React hooks để tương tác với Supabase database.
 * Tất cả UI components sử dụng design tokens từ /src/styles/theme.css
 */

import { useState, useEffect, useCallback } from 'react';
import {
  supabase,
  Tables,
  type Role,
  type Permission,
  type User,
  type Facility,
  type Team,
  type RolePermission,
  type UserRole,
  type CreateData,
  type UpdateData,
} from '@/api/supabaseClient';

// ============================================
// GENERIC HOOKS
// ============================================

/**
 * Generic hook để fetch data từ bất kỳ table nào
 */
export function useSupabaseQuery<T>(
  table: string,
  options: {
    select?: string;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    filter?: Record<string, any>;
  } = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(options.select || '*, id:_id');

      // Apply filters
      if (options.filter) {
        Object.entries(options.filter).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true,
        });
      }

      // Apply limit
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const { data: result, error: err } = await query;

      if (err) throw err;
      setData((result as T[]) || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [table, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Generic hook để mutations (create/update/delete)
 */
export function useSupabaseMutation<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (data: CreateData<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await supabase.from(table).insert(data).select('*, id:_id');
        if (result.error) throw result.error;
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Create failed');
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  const update = useCallback(
    async (id: string, data: UpdateData<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await supabase
          .from(table)
          .update(data)
          .eq('_id', id)
          .select('*, id:_id');
        if (result.error) throw result.error;
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Update failed');
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  const remove = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await supabase.from(table).delete().eq('_id', id);
        if (result.error) throw result.error;
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Delete failed');
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  return { create, update, remove, loading, error };
}

// ============================================
// SPECIFIC HOOKS
// ============================================

/**
 * Hook để quản lý Roles
 */
export function useRoles() {
  const { data, loading, error, refetch } = useSupabaseQuery<Role>(Tables.ROLES, {
    orderBy: { column: 'created_at', ascending: false },
  });

  const { create, update, remove } = useSupabaseMutation<Role>(Tables.ROLES);

  const createRole = useCallback(
    async (roleData: CreateData<Role>) => {
      const result = await create(roleData);
      if (!result.error) await refetch();
      return result;
    },
    [create, refetch]
  );

  const updateRole = useCallback(
    async (id: string, roleData: UpdateData<Role>) => {
      const result = await update(id, roleData);
      if (!result.error) await refetch();
      return result;
    },
    [update, refetch]
  );

  const deleteRole = useCallback(
    async (id: string) => {
      const result = await remove(id);
      if (!result.error) await refetch();
      return result;
    },
    [remove, refetch]
  );

  return {
    roles: data,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    refetch,
  };
}

/**
 * Hook để quản lý Permissions
 */
export function usePermissions() {
  const { data, loading, error, refetch } = useSupabaseQuery<Permission>(
    Tables.PERMISSIONS,
    {
      select: '*, modules(*)',
      orderBy: { column: 'module_id', ascending: true },
    }
  );

  return { permissions: data, loading, error, refetch };
}

/**
 * Hook để quản lý Role Permissions (Ma trận phân quyền)
 */
export function useRolePermissions(roleId?: string) {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch permissions for role
  useEffect(() => {
    if (!roleId) return;

    async function fetchRolePermissions() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from(Tables.ROLE_PERMISSIONS)
          .select('permission_id')
          .eq('role_id', roleId);

        if (err) throw err;
        setPermissions(data?.map((rp) => rp.permission_id) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fetch failed'));
      } finally {
        setLoading(false);
      }
    }

    fetchRolePermissions();
  }, [roleId]);

  // Assign permissions to role
  const assignPermissions = useCallback(
    async (permissionIds: string[]) => {
      if (!roleId) return { data: null, error: new Error('No role ID') };

      setLoading(true);
      setError(null);

      try {
        // Delete existing permissions
        await supabase.from(Tables.ROLE_PERMISSIONS).delete().eq('role_id', roleId);

        // Insert new permissions
        const inserts = permissionIds.map((permissionId) => ({
          role_id: roleId,
          permission_id: permissionId,
        }));

        const { data, error: err } = await supabase
          .from(Tables.ROLE_PERMISSIONS)
          .insert(inserts)
          .select();

        if (err) throw err;

        setPermissions(permissionIds);
        return { data, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Assign failed');
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [roleId]
  );

  // Toggle single permission
  const togglePermission = useCallback(
    async (permissionId: string) => {
      if (!roleId) return { data: null, error: new Error('No role ID') };

      const hasPermission = permissions.includes(permissionId);

      if (hasPermission) {
        // Remove permission
        const { error: err } = await supabase
          .from(Tables.ROLE_PERMISSIONS)
          .delete()
          .eq('role_id', roleId)
          .eq('permission_id', permissionId);

        if (!err) {
          setPermissions(permissions.filter((p) => p !== permissionId));
        }
        return { data: null, error: err };
      } else {
        // Add permission
        const { data, error: err } = await supabase
          .from(Tables.ROLE_PERMISSIONS)
          .insert({ role_id: roleId, permission_id: permissionId })
          .select();

        if (!err) {
          setPermissions([...permissions, permissionId]);
        }
        return { data, error: err };
      }
    },
    [roleId, permissions]
  );

  return {
    permissions,
    loading,
    error,
    assignPermissions,
    togglePermission,
  };
}

/**
 * Hook để quản lý Users
 */
export function useUsers() {
  const { data, loading, error, refetch } = useSupabaseQuery<User>(Tables.USERS, {
    orderBy: { column: 'created_at', ascending: false },
  });

  const { create, update, remove } = useSupabaseMutation<User>(Tables.USERS);

  const createUser = useCallback(
    async (userData: CreateData<User>) => {
      const result = await create(userData);
      if (!result.error) await refetch();
      return result;
    },
    [create, refetch]
  );

  const updateUser = useCallback(
    async (id: string, userData: UpdateData<User>) => {
      const result = await update(id, userData);
      if (!result.error) await refetch();
      return result;
    },
    [update, refetch]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      const result = await remove(id);
      if (!result.error) await refetch();
      return result;
    },
    [remove, refetch]
  );

  return {
    users: data,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch,
  };
}

/**
 * Hook để quản lý User Roles
 */
export function useUserRoles(userId?: string) {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch roles for user
  useEffect(() => {
    if (!userId) return;

    async function fetchUserRoles() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from(Tables.USER_ROLES)
          .select('role_id')
          .eq('user_id', userId);

        if (err) throw err;
        setRoles(data?.map((ur) => ur.role_id) || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Fetch failed'));
      } finally {
        setLoading(false);
      }
    }

    fetchUserRoles();
  }, [userId]);

  // Assign roles to user
  const assignRoles = useCallback(
    async (roleIds: string[]) => {
      if (!userId) return { data: null, error: new Error('No user ID') };

      setLoading(true);
      setError(null);

      try {
        // Delete existing roles
        await supabase.from(Tables.USER_ROLES).delete().eq('user_id', userId);

        // Insert new roles
        const inserts = roleIds.map((roleId) => ({
          user_id: userId,
          role_id: roleId,
        }));

        const { data, error: err } = await supabase
          .from(Tables.USER_ROLES)
          .insert(inserts)
          .select();

        if (err) throw err;

        setRoles(roleIds);
        return { data, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Assign failed');
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { roles, loading, error, assignRoles };
}

/**
 * Hook để quản lý Facilities
 */
export function useFacilities() {
  const { data, loading, error, refetch } = useSupabaseQuery<Facility>(
    Tables.FACILITIES,
    {
      orderBy: { column: 'created_at', ascending: false },
    }
  );

  const { create, update, remove } = useSupabaseMutation<Facility>(Tables.FACILITIES);

  const createFacility = useCallback(
    async (facilityData: CreateData<Facility>) => {
      const result = await create(facilityData);
      if (!result.error) await refetch();
      return result;
    },
    [create, refetch]
  );

  const updateFacility = useCallback(
    async (id: string, facilityData: UpdateData<Facility>) => {
      const result = await update(id, facilityData);
      if (!result.error) await refetch();
      return result;
    },
    [update, refetch]
  );

  const deleteFacility = useCallback(
    async (id: string) => {
      const result = await remove(id);
      if (!result.error) await refetch();
      return result;
    },
    [remove, refetch]
  );

  return {
    facilities: data,
    loading,
    error,
    createFacility,
    updateFacility,
    deleteFacility,
    refetch,
  };
}

/**
 * Hook để quản lý Teams
 */
export function useTeams() {
  const { data, loading, error, refetch } = useSupabaseQuery<Team>(Tables.TEAMS, {
    orderBy: { column: 'created_at', ascending: false },
  });

  const { create, update, remove } = useSupabaseMutation<Team>(Tables.TEAMS);

  const createTeam = useCallback(
    async (teamData: CreateData<Team>) => {
      const result = await create(teamData);
      if (!result.error) await refetch();
      return result;
    },
    [create, refetch]
  );

  const updateTeam = useCallback(
    async (id: string, teamData: UpdateData<Team>) => {
      const result = await update(id, teamData);
      if (!result.error) await refetch();
      return result;
    },
    [update, refetch]
  );

  const deleteTeam = useCallback(
    async (id: string) => {
      const result = await remove(id);
      if (!result.error) await refetch();
      return result;
    },
    [remove, refetch]
  );

  return {
    teams: data,
    loading,
    error,
    createTeam,
    updateTeam,
    deleteTeam,
    refetch,
  };
}
