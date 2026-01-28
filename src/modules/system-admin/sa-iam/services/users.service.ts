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
  department_id?: string | null;
  department_name?: string | null;
  department_level?: number | null;
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
  departmentId?: string | null;
  scopeDepartmentId?: string | null;
  scopeLevel?: number | null;
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
  department_id?: string | null;
  default_password?: string | null;
};

const API_BASE = import.meta.env.VITE_SYSTEM_ADMIN_API ?? "http://localhost:7788";

const mapStatusFilter = (value: UserListParams["status"]) => {
  if (!value || value === "all") return null;
  if (value === "active") return 1;
  if (value === "inactive") return 0;
  return 2;
};

const requestAdmin = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return (await response.json()) as T;
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
  department_id: row.department_id ?? row.departmentId ?? null,
  department_name: row.department_name ?? null,
  department_level: row.department_level ?? null,
  roles: Array.isArray(row.roles) ? row.roles : [],
  primary_role_code: row.primary_role_code ?? null,
  primary_role_name: row.primary_role_name ?? null,
});

export type DepartmentScopeRecord = {
  id: string;
  parent_id?: string | null;
  name: string;
  code?: string | null;
  level?: number | null;
  order_index?: number | null;
  is_active?: boolean | null;
};

const mapDepartmentRow = (row: any): DepartmentScopeRecord => ({
  id: row._id ?? row.id,
  parent_id: row.parent_id ?? null,
  name: row.name ?? "",
  code: row.code ?? null,
  level: row.level ?? null,
  order_index: row.order_index ?? null,
  is_active: row.is_active ?? null,
});

const departmentScopeCache = new Map<string, DepartmentScopeRecord[]>();

const collectDescendants = (
  rootId: string,
  byParent: Map<string | null, DepartmentScopeRecord[]>,
): DepartmentScopeRecord[] => {
  const result: DepartmentScopeRecord[] = [];
  const stack = [...(byParent.get(rootId) || [])];
  while (stack.length > 0) {
    const next = stack.pop()!;
    result.push(next);
    const children = byParent.get(next.id);
    if (children && children.length > 0) {
      stack.push(...children);
    }
  }
  return result;
};

const computeScopeDepartments = (
  departments: DepartmentScopeRecord[],
  scopeDepartmentId: string,
  scopeLevel: number,
) => {
  const byId = new Map(departments.map((dept) => [dept.id, dept]));
  const byParent = new Map<string | null, DepartmentScopeRecord[]>();
  departments.forEach((dept) => {
    const key = dept.parent_id ?? null;
    const list = byParent.get(key) || [];
    list.push(dept);
    byParent.set(key, list);
  });

  if (scopeLevel === 1) return departments;

  const root = byId.get(scopeDepartmentId);
  if (!root) return [];
  if (scopeLevel === 3) return [root];

  const descendants = collectDescendants(scopeDepartmentId, byParent);
  return [root, ...descendants];
};

export const usersService = {
  async listUsers(params: UserListParams): Promise<UserListResult> {
    const {
      q,
      status,
      roleId,
      departmentId,
      scopeDepartmentId,
      scopeLevel,
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortDir = "desc",
    } = params;

    const primaryRpc = await supabase.rpc("rpc_iam_users_search", {
      p_q: q?.trim() || null,
      p_status: mapStatusFilter(status),
      p_role_id: roleId || null,
      p_department_id: departmentId || null,
      p_scope_department_id: scopeDepartmentId || null,
      p_scope_level: scopeLevel ?? null,
      p_sort_by: sortBy,
      p_sort_dir: sortDir,
      p_page: page,
      p_page_size: pageSize,
    });

    const missingScopedRpc =
      primaryRpc.error && primaryRpc.error.message.includes("rpc_iam_users_search");
    const fallbackRpc = missingScopedRpc
      ? await supabase.rpc("rpc_users_search", {
          p_q: q?.trim() || null,
          p_status: mapStatusFilter(status),
          p_role_id: roleId || null,
          p_sort_by: sortBy,
          p_sort_dir: sortDir,
          p_page: page,
          p_page_size: pageSize,
        })
      : primaryRpc;

    if (fallbackRpc.error) {
      throw new Error(`users select failed: ${fallbackRpc.error.message}`);
    }

    let rows = (fallbackRpc.data || []).map(mapRow);
    let total =
      fallbackRpc.data && fallbackRpc.data.length > 0
        ? Number(fallbackRpc.data[0].total_count)
        : 0;

    if (missingScopedRpc && scopeDepartmentId && scopeLevel) {
      const cacheKey = `${scopeDepartmentId}:${scopeLevel}`;
      const scopeDepartments =
        departmentScopeCache.get(cacheKey) ||
        (await usersService.listDepartmentScope(scopeDepartmentId, scopeLevel));
      if (!departmentScopeCache.has(cacheKey)) {
        departmentScopeCache.set(cacheKey, scopeDepartments);
      }

      let allowed = scopeDepartments;
      if (departmentId) {
        allowed = computeScopeDepartments(scopeDepartments, departmentId, 2);
      }
      const allowedIds = new Set(allowed.map((dept) => dept.id));
      rows = rows.filter((row) => row.department_id && allowedIds.has(row.department_id));
      total = rows.length;
    }

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
    const { default_password, ...rest } = payload;
    if (!default_password || !default_password.trim()) {
      throw new Error("Vui lòng nhập mật khẩu mặc định để tạo tài khoản đăng nhập.");
    }
    const data = await requestAdmin<any>("/system-admin/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...rest,
        status: rest.status ?? 1,
        department_id: rest.department_id ?? null,
        default_password: default_password.trim(),
      }),
    });
    return mapRow(data);
  },

  async updateUser(id: string, payload: UserPayload): Promise<UserRecord> {
    const { default_password, ...rest } = payload;
    const updatePayload: Record<string, unknown> = {
      ...rest,
      departmentId: rest.department_id ?? null,
      metadata: default_password ? { defaultPassword: default_password } : undefined,
      updated_at: new Date().toISOString(),
    };

    let response = await supabase
      .from("users")
      .update(updatePayload)
      .eq("_id", id)
      .select("*")
      .single();

    if (response.error && rest.department_id && response.error.message.includes("department_id")) {
      const retryPayload = { ...updatePayload };
      delete retryPayload.department_id;
      response = await supabase
        .from("users")
        .update(retryPayload)
        .eq("_id", id)
        .select("*")
        .single();
    }

    if (response.error) {
      throw new Error(`user update failed: ${response.error.message}`);
    }

    return mapRow(response.data);
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

  async listDepartmentScope(scopeDepartmentId: string | null, scopeLevel: number | null): Promise<DepartmentScopeRecord[]> {
    if (!scopeDepartmentId || !scopeLevel) return [];
    const rpcResult = await supabase.rpc("rpc_my_department_scope", {
      p_scope_department_id: scopeDepartmentId,
      p_scope_level: scopeLevel,
    });

    if (rpcResult.error && rpcResult.error.message.includes("rpc_my_department_scope")) {
      const fallback = await supabase
        .from("departments")
        .select("_id, parent_id, name, code, level, order_index, is_active")
        .order("level", { ascending: true })
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });

      if (fallback.error) {
        throw new Error(`departments scope select failed: ${fallback.error.message}`);
      }

      const mapped = (fallback.data || []).map(mapDepartmentRow);
      const scoped = computeScopeDepartments(mapped, scopeDepartmentId, scopeLevel);
      return scoped.filter((dept) => dept.is_active !== false);
    }

    if (rpcResult.error) {
      throw new Error(`departments scope select failed: ${rpcResult.error.message}`);
    }

    return (rpcResult.data || []).map(mapDepartmentRow);
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
