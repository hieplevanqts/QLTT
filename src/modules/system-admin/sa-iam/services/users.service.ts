import { supabase } from '@/api/supabaseClient';

export type UserStatusValue = 0 | 1 | 2;

export type UserRoleInfo = {
  role_id: string;
  code: string;
  name: string;
  is_primary?: boolean | null;
};

export type UserRecord = {
  _id: string;
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
  department_path?: string | null;
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
  scopeDepartmentPath?: string | null;
  scopeLevel?: number | null;
  viewerUserId?: string | null;
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
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

const uniq = (items: string[]) => Array.from(new Set(items));

const requestAdmin = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message = payload?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return (await response.json()) as T;
};

const requestAdminRaw = async (path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  return { response, payload };
};

const mapRow = (row: any): UserRecord => ({
  _id: row._id ?? row.id ?? "",
  id: row._id ?? row.id ?? "",
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
  department_path: row.department_path ?? row.departmentPath ?? null,
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
  path?: string | null;
  order_index?: number | null;
  is_active?: boolean | null;
};

const mapDepartmentRow = (row: any): DepartmentScopeRecord => ({
  id: row._id ?? "",
  parent_id: row.parent_id ?? null,
  name: row.name ?? "",
  code: row.code ?? null,
  level: row.level ?? null,
  path: row.path ?? null,
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

const resolveSortColumn = (sortBy?: string) => {
  const mapping: Record<string, string> = {
    username: "username",
    full_name: "full_name",
    email: "email",
    phone: "phone",
    status: "status",
    last_login_at: "lastLoginAt",
    created_at: "created_at",
    updated_at: "updated_at",
  };
  if (sortBy && mapping[sortBy]) return mapping[sortBy];
  return "created_at";
};

const fetchDepartmentsByIds = async (departmentIds: string[]) => {
  if (departmentIds.length === 0) return new Map<string, DepartmentScopeRecord>();
  const { data, error } = await supabase
    .from("departments")
    .select("_id, parent_id, name, code, level, path, order_index, is_active")
    .in("_id", departmentIds);

  if (error) {
    throw new Error(`departments select failed: ${error.message}`);
  }

  return new Map((data || []).map((row: any) => [row._id ?? row.id, mapDepartmentRow(row)]));
};

const fetchDepartmentsByPath = async (scopePath: string) => {
  const { data, error } = await supabase
    .from("departments")
    .select("_id, parent_id, name, code, level, path, order_index, is_active")
    .like("path", `${scopePath}%`)
    .order("level", { ascending: true })
    .order("order_index", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`departments scope select failed: ${error.message}`);
  }

  return (data || []).map(mapDepartmentRow);
};

const fetchUserIdsByRole = async (roleId: string) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id")
    .eq("role_id", roleId);

  if (error) {
    throw new Error(`user roles select failed: ${error.message}`);
  }

  return (data || []).map((row: any) => String(row.user_id)).filter(Boolean);
};

const fetchUserRolesByUserIds = async (userIds: string[]) => {
  if (userIds.length === 0) return new Map<string, UserRoleInfo[]>();
  const { data, error } = await supabase
    .from("user_roles")
    .select("user_id, role_id, is_primary, roles(_id, code, name, status)")
    .in("user_id", userIds);

  if (error) {
    throw new Error(`user roles select failed: ${error.message}`);
  }

  const roleMap = new Map<string, UserRoleInfo[]>();

  (data || []).forEach((row: any) => {
    const userId = String(row.user_id);
    if (!userId) return;
    const role = row.roles;
    const roleId = String(row.role_id ?? role?._id ?? "");
    if (!roleId) return;
    const record: UserRoleInfo = {
      role_id: roleId,
      code: role?.code ?? roleId,
      name: role?.name ?? roleId,
      is_primary: row.is_primary ?? false,
    };
    const list = roleMap.get(userId) ?? [];
    list.push(record);
    roleMap.set(userId, list);
  });

  return roleMap;
};

export const usersService = {
  async listUsers(params: UserListParams): Promise<UserListResult> {
    const {
      q,
      status,
      roleId,
      departmentId,
      scopeDepartmentId,
      scopeDepartmentPath,
      scopeLevel,
      viewerUserId,
      isSuperAdmin,
      isAdmin,
      page = 1,
      pageSize = 10,
      sortBy = "created_at",
      sortDir = "desc",
    } = params;

    const isSuper = Boolean(isSuperAdmin);
    const isScopedAdmin = Boolean(isAdmin) && !isSuper;
    const isSelfOnly = !isSuper && !isScopedAdmin;

    let allowedDepartmentIds: string[] | null = null;
    if (isScopedAdmin) {
      if (scopeDepartmentPath != null) {
        const scopedDepartments = await fetchDepartmentsByPath(scopeDepartmentPath);
        allowedDepartmentIds = scopedDepartments
          .filter((dept) => dept.is_active !== false)
          .map((dept) => dept.id);
      } else if (scopeDepartmentId && scopeLevel) {
        const cacheKey = `scope:${scopeDepartmentId}:${scopeLevel}`;
        const scopeDepartments =
          departmentScopeCache.get(cacheKey) ||
          (await usersService.listDepartmentScope(scopeDepartmentId, scopeLevel));
        if (!departmentScopeCache.has(cacheKey)) {
          departmentScopeCache.set(cacheKey, scopeDepartments);
        }
        allowedDepartmentIds = scopeDepartments
          .filter((dept) => dept.is_active !== false)
          .map((dept) => dept.id);
      } else {
        allowedDepartmentIds = [];
      }

      if (!allowedDepartmentIds || allowedDepartmentIds.length === 0) {
        return { data: [], total: 0 };
      }
    }

    if (isSelfOnly && !viewerUserId) {
      return { data: [], total: 0 };
    }

    let roleUserIds: string[] | null = null;
    if (roleId) {
      roleUserIds = uniq(await fetchUserIdsByRole(roleId));
      if (roleUserIds.length === 0) {
        return { data: [], total: 0 };
      }
    }

    const trimmedQuery = q?.trim();
    const statusValue = mapStatusFilter(status);

    let query = supabase
      .from("users")
      .select(
        "_id, username, full_name, email, phone, status, \"lastLoginAt\", created_at, updated_at, note, department_id, \"departmentId\"",
        { count: "exact" },
      );

    if (statusValue != null) {
      query = query.eq("status", statusValue);
    }

    if (trimmedQuery) {
      query = query.or(
        `username.ilike.%${trimmedQuery}%,full_name.ilike.%${trimmedQuery}%,email.ilike.%${trimmedQuery}%`,
      );
    }

    if (roleUserIds) {
      query = query.in("_id", roleUserIds);
    }

    if (isSelfOnly && viewerUserId) {
      query = query.eq("_id", viewerUserId);
    }

    if (isScopedAdmin && allowedDepartmentIds) {
      query = query.in("department_id", allowedDepartmentIds);
    }

    if (departmentId) {
      query = query.eq("department_id", departmentId);
    }

    query = query.order(resolveSortColumn(sortBy), {
      ascending: sortDir === "asc",
    });

    const rangeFrom = Math.max(0, (page - 1) * pageSize);
    const rangeTo = Math.max(rangeFrom, rangeFrom + pageSize - 1);
    query = query.range(rangeFrom, rangeTo);

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`users select failed: ${error.message}`);
    }

    const rows = data || [];
    const userIds = rows
      .map((row: any) => String(row._id ?? row.id ?? ""))
      .filter(Boolean);
    const departmentIds = rows
      .map((row: any) => row.department_id ?? row.departmentId ?? null)
      .filter(Boolean) as string[];

    const [departmentMap, roleMap] = await Promise.all([
      fetchDepartmentsByIds(uniq(departmentIds)),
      fetchUserRolesByUserIds(userIds),
    ]);

    const mapped = rows.map((row: any) => {
      const id = String(row._id ?? row.id ?? "");
      const roles = roleMap.get(id) ?? [];
      const primary = roles.find((role) => role.is_primary);
      const departmentIdValue = row.department_id ?? row.departmentId ?? null;
      const department = departmentIdValue
        ? departmentMap.get(departmentIdValue)
        : undefined;
      return {
        _id: id,
        id,
        username: row.username ?? null,
        full_name: row.full_name ?? null,
        email: row.email ?? null,
        phone: row.phone ?? null,
        status: Number(row.status) as UserStatusValue,
        last_login_at: row.last_login_at ?? row.lastLoginAt ?? null,
        created_at: row.created_at ?? null,
        updated_at: row.updated_at ?? null,
        note: row.note ?? null,
        department_id: departmentIdValue,
        department_name: department?.name ?? row.department_name ?? null,
        department_level: department?.level ?? row.department_level ?? null,
        department_path: department?.path ?? row.department_path ?? row.departmentPath ?? null,
        roles,
        primary_role_code: primary?.code ?? null,
        primary_role_name: primary?.name ?? null,
      } as UserRecord;
    });

    return { data: mapped, total: count ?? mapped.length };
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

  async updateUser(
    id: string,
    payload: UserPayload,
    opts?: { actorIsSuperAdmin?: boolean },
  ): Promise<UserRecord> {
    if (!id) {
      throw new Error("Thiếu mã người dùng để cập nhật.");
    }
    if (opts?.actorIsSuperAdmin) {
      try {
        const data = await requestAdmin<any>(`/system-admin/admin/users/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload ?? {}),
        });
        return mapRow(data);
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("[iam] admin update API failed, fallback to direct update", error);
        }
        // Fallback to direct update when admin API is unavailable.
      }
    }
    const { default_password, ...rest } = payload;
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (rest.username != null) updatePayload.username = rest.username;
    if (rest.full_name != null) updatePayload.full_name = rest.full_name;
    if (rest.email != null) updatePayload.email = rest.email;
    if (rest.phone != null) updatePayload.phone = rest.phone;
    if (rest.status != null) updatePayload.status = rest.status;
    if (rest.note != null) updatePayload.note = rest.note;

    if (Object.prototype.hasOwnProperty.call(rest, "department_id")) {
      updatePayload.department_id = rest.department_id ?? null;
      updatePayload.departmentId = rest.department_id ?? null;
    }

    const nextPassword = default_password?.trim();
    if (nextPassword) {
      updatePayload.metadata = { defaultPassword: nextPassword };
    }

    const pickSingleRow = (data: any) => {
      if (Array.isArray(data)) {
        if (data.length === 1) return data[0];
        if (data.length === 0) return null;
        return undefined;
      }
      return data ?? null;
    };

    let response = await supabase
      .from("users")
      .update(updatePayload)
      .eq("_id", id)
      .select("*");

    if (response.error) {
      const message = response.error.message || "";
      const retryPayload = { ...updatePayload };
      let shouldRetry = false;
      if (message.includes("department_id")) {
        delete retryPayload.department_id;
        shouldRetry = true;
      }
      if (message.includes("departmentId")) {
        delete retryPayload.departmentId;
        shouldRetry = true;
      }
      if (message.includes("metadata")) {
        delete retryPayload.metadata;
        shouldRetry = true;
      }
      if (shouldRetry) {
        response = await supabase
          .from("users")
          .update(retryPayload)
          .eq("_id", id)
          .select("*");
      }
    }

    if (response.error) {
      throw new Error(`user update failed: ${response.error.message}`);
    }

    const row = pickSingleRow(response.data);
    if (row === null) {
      if (!opts?.actorIsSuperAdmin) {
        throw new Error("Bạn không có quyền cập nhật người dùng thuộc đơn vị khác.");
      }
      const fallback = await supabase
        .from("users")
        .select("*")
        .eq("_id", id)
        .maybeSingle();
      if (!fallback.error && fallback.data) {
        return mapRow(fallback.data);
      }
      if (import.meta.env.DEV) {
        console.warn("[iam] updateUser: no data returned after update", {
          id,
          error: fallback.error,
        });
      }
      return mapRow({
        _id: id,
        id,
        status: payload.status ?? 1,
        ...payload,
      });
    }
    if (!row) {
      throw new Error("Không thể xác định dữ liệu người dùng sau khi cập nhật.");
    }
    return mapRow(row);
  },

  async resetUserPassword(userId: string, password: string): Promise<void> {
    if (!userId) {
      throw new Error("Thiếu mã người dùng để khởi tạo mật khẩu.");
    }
    const nextPassword = password?.trim();
    if (!nextPassword) {
      throw new Error("Mật khẩu mới không hợp lệ.");
    }

    // 1) Preferred endpoint: reset-password
    const firstTry = await requestAdminRaw(`/system-admin/admin/users/${userId}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: nextPassword }),
    });
    if (firstTry.response.ok) return;

    // 2) Fallback: update user with default_password
    const fallback = await requestAdminRaw(`/system-admin/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ default_password: nextPassword }),
    });
    if (fallback.response.ok) return;

    const message =
      firstTry.payload?.message ||
      fallback.payload?.message ||
      "Không thể khởi tạo mật khẩu.";
    throw new Error(message);
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
      .eq("status", 1)
      .order("sort_order", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      throw new Error(`roles select failed: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row._id ?? "",
      code: row.code,
      name: row.name,
      status: row.status,
      is_system: row.is_system ?? null,
      sort_order: row.sort_order ?? null,
    }));
  },

  async listDepartmentScope(
    scopeDepartmentId: string | null,
    scopeLevel: number | null,
    scopeDepartmentPath?: string | null,
  ): Promise<DepartmentScopeRecord[]> {
    if (scopeDepartmentPath != null) {
      const cacheKey = `path:${scopeDepartmentPath}`;
      if (departmentScopeCache.has(cacheKey)) {
        return departmentScopeCache.get(cacheKey) || [];
      }
      const scoped = await fetchDepartmentsByPath(scopeDepartmentPath);
      const filtered = scoped.filter((dept) => dept.is_active !== false);
      departmentScopeCache.set(cacheKey, filtered);
      return filtered;
    }

    if (!scopeDepartmentId || !scopeLevel) return [];
    const cacheKey = `scope:${scopeDepartmentId}:${scopeLevel}`;
    if (departmentScopeCache.has(cacheKey)) {
      return departmentScopeCache.get(cacheKey) || [];
    }

    const rpcResult = await supabase.rpc("rpc_my_department_scope", {
      p_scope_department_id: scopeDepartmentId,
      p_scope_level: scopeLevel,
    });

    if (rpcResult.error && rpcResult.error.message.includes("rpc_my_department_scope")) {
      const fallback = await supabase
        .from("departments")
        .select("_id, parent_id, name, code, level, path, order_index, is_active")
        .order("level", { ascending: true })
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });

      if (fallback.error) {
        throw new Error(`departments scope select failed: ${fallback.error.message}`);
      }

      const mapped = (fallback.data || []).map(mapDepartmentRow);
      const scoped = computeScopeDepartments(mapped, scopeDepartmentId, scopeLevel);
      const filtered = scoped.filter((dept) => dept.is_active !== false);
      departmentScopeCache.set(cacheKey, filtered);
      return filtered;
    }

    if (rpcResult.error) {
      throw new Error(`departments scope select failed: ${rpcResult.error.message}`);
    }

    const mapped = (rpcResult.data || []).map(mapDepartmentRow);
    departmentScopeCache.set(cacheKey, mapped);
    return mapped;
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
