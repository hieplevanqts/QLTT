import { supabase } from "../../../../lib/supabase";

export type UserStatusValue = 0 | 1 | 2;

export type UserRoleInfo = {
  role_id: string;
  code: string;
  name: string;
  is_primary?: boolean | null;
};

export type UserRecord = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status: UserStatusValue;
  last_login_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  note?: string | null;
  roles: UserRoleInfo[];
  primary_role_code?: string | null;
  primary_role_name?: string | null;
};

export type RoleOption = {
  id: string;
  code: string;
  name: string;
  status?: number | null;
  is_system?: boolean | null;
  sort_order?: number | null;
};

export type UserListParams = {
  q?: string;
  status?: "all" | "active" | "inactive" | "locked";
  roleId?: string | null;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type UserListResult = {
  data: UserRecord[];
  total: number;
};

export type UserPayload = {
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: UserStatusValue;
  note?: string | null;
};

const mapStatusFilter = (value: UserListParams["status"]) => {
  if (!value || value === "all") return null;
  if (value === "active") return 1;
  if (value === "inactive") return 0;
  return 2;
};

const mapRow = (row: any): UserRecord => ({
  id: row._id ?? row.id,
  username: row.username ?? null,
  full_name: row.full_name ?? null,
  email: row.email ?? null,
  phone: row.phone ?? null,
  status: Number(row.status) as UserStatusValue,
  last_login_at: row.last_login_at ?? row.lastLoginAt ?? null,
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
  note: row.note ?? null,
  roles: Array.isArray(row.roles) ? row.roles : [],
  primary_role_code: row.primary_role_code ?? null,
  primary_role_name: row.primary_role_name ?? null,
});

export const usersService = {
  async listUsers(params: UserListParams): Promise<UserListResult> {
    const {
      q,
      status,
      roleId,
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortDir = "desc",
    } = params;

    const { data, error } = await supabase.rpc("rpc_users_search", {
      p_q: q?.trim() || null,
      p_status: mapStatusFilter(status),
      p_role_id: roleId || null,
      p_sort_by: sortBy,
      p_sort_dir: sortDir,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      throw new Error(`users select failed: ${error.message}`);
    }

    const rows = (data || []).map(mapRow);
    const total = data && data.length > 0 ? Number(data[0].total_count) : 0;

    return { data: rows, total };
  },

  async getUserById(id: string): Promise<UserRecord | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`user select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async createUser(payload: UserPayload): Promise<UserRecord> {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          ...payload,
          status: payload.status ?? 1,
          updated_at: new Date().toISOString(),
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`user insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateUser(id: string, payload: UserPayload): Promise<UserRecord> {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`user update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async setUserStatus(id: string, status: UserStatusValue): Promise<void> {
    const payload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 2) {
      payload.locked_at = new Date().toISOString();
    } else {
      payload.locked_at = null;
    }

    const { error } = await supabase.from("users").update(payload).eq("_id", id);
    if (error) {
      throw new Error(`user status update failed: ${error.message}`);
    }
  },

  async softDeleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({
        deleted_at: new Date().toISOString(),
        status: 0,
        updated_at: new Date().toISOString(),
      })
      .eq("_id", id);

    if (error) {
      throw new Error(`user delete failed: ${error.message}`);
    }
  },

  async listRoles(): Promise<RoleOption[]> {
    const { data, error } = await supabase
      .from("roles")
      .select("_id, code, name, status, is_system, sort_order")
      .order("sort_order", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      throw new Error(`roles select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row._id ?? row.id,
      code: row.code,
      name: row.name,
      status: row.status,
      is_system: row.is_system ?? null,
      sort_order: row.sort_order ?? null,
    }));
  },

  async setUserRoles(userId: string, roleIds: string[], primaryRoleId?: string | null): Promise<void> {
    const { error } = await supabase.rpc("rpc_user_set_roles", {
      p_user_id: userId,
      p_role_ids: roleIds.length > 0 ? roleIds : null,
      p_primary_role_id: primaryRoleId ?? null,
      p_actor: null,
    });

    if (error) {
      throw new Error(`user roles update failed: ${error.message}`);
    }
  },

  async listUserRoles(userId: string): Promise<UserRoleInfo[]> {
    const { data: assignments, error: assignmentError } = await supabase
      .from("user_roles")
      .select("role_id, is_primary")
      .eq("user_id", userId);

    if (assignmentError) {
      throw new Error(`user roles select failed: ${assignmentError.message}`);
    }

    const roleIds = (assignments || []).map((row: any) => row.role_id).filter(Boolean);
    if (roleIds.length === 0) return [];

    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("_id, code, name")
      .in("_id", roleIds);

    if (rolesError) {
      throw new Error(`user roles select failed: ${rolesError.message}`);
    }

    const roleMap = new Map(
      (roles || []).map((role: any) => [role._id ?? role.id, role]),
    );

    return (assignments || []).map((assignment: any) => {
      const role = roleMap.get(assignment.role_id);
      return {
        role_id: assignment.role_id,
        code: role?.code ?? assignment.role_id,
        name: role?.name ?? assignment.role_id,
        is_primary: assignment.is_primary ?? false,
      } as UserRoleInfo;
    });
  },
};
