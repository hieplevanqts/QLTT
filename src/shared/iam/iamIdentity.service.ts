import { supabase } from "@/api/supabaseClient";

export type IamIdentity = {
  authUid: string;
  userId: string;
  email?: string | null;
  roleIds: string[];
  roleCodes: string[];
  permissionIds: string[];
  permissionCodes: string[];
  permissionMetaMap?: PermissionMetaMap;
  primaryRoleCode?: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  departmentId?: string | null;
  departmentPath?: string | null;
  departmentLevel?: number | null;
};

export type PermissionMeta = {
  code: string;
  category?: string | null;
  module?: string | null;
  resource?: string | null;
  action?: string | null;
};

export type PermissionMetaMap = Record<string, PermissionMeta>;

type SupabaseError = {
  message?: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
};

const CACHE_TTL_MS = 10 * 60 * 1000;
let identityCache:
  | { authUid: string; expiresAt: number; data: IamIdentity }
  | null = null;

const isActiveStatus = (status: unknown) =>
  status === 1 || status === true || status === "1";

const normalizeStringArray = (values: unknown[]): string[] =>
  values.map((value) => String(value).trim()).filter(Boolean);

const normalizeToArray = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return normalizeStringArray(value);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const uniq = (items: string[]) => Array.from(new Set(items));

const logSupabaseError = (context: string, error?: SupabaseError | null) => {
  if (!error || !import.meta.env.DEV) return;
  console.warn(`[iam] ${context} error`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
};

const resolvePrimaryRoleCode = (
  roleCodes: string[],
  preferred?: string | null,
): string | undefined => {
  if (roleCodes.length === 0) return undefined;
  if (preferred && roleCodes.includes(preferred)) return preferred;
  const priority = ["super-admin", "admin"];
  const byPriority = roleCodes.find((code) =>
    priority.includes(code.toLowerCase()),
  );
  return byPriority ?? roleCodes[0];
};

export const clearIamIdentityCache = () => {
  identityCache = null;
};

const getCachedIdentity = (authUid: string) => {
  if (!identityCache) return null;
  if (identityCache.authUid !== authUid) return null;
  if (Date.now() > identityCache.expiresAt) {
    identityCache = null;
    return null;
  }
  return identityCache.data;
};

const setCachedIdentity = (authUid: string, data: IamIdentity) => {
  identityCache = {
    authUid,
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  };
};

export const getCurrentUser = async (): Promise<{
  authUid: string;
  email?: string | null;
} | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    logSupabaseError("auth.getUser", error as SupabaseError);
    return null;
  }
  if (!data?.user?.id) return null;
  return { authUid: data.user.id, email: data.user.email };
};

const resolveUserProfile = async (authUid: string, email?: string | null) => {
  const { data, error } = await supabase
    .from("v_user_profile")
    .select("*")
    .eq("user_id", authUid)
    .limit(1)
    .maybeSingle();

  if (error) {
    logSupabaseError("v_user_profile by user_id", error as SupabaseError);
  }

  if (data?.user_id) return data;
  if (!email) return null;

  const fallback = await supabase
    .from("v_user_profile")
    .select("*")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (fallback.error) {
    logSupabaseError("v_user_profile by email", fallback.error as SupabaseError);
  }

  return fallback.data ?? null;
};

const resolveUserFromUsers = async (authUid: string, email?: string | null) => {
  const { data, error } = await supabase
    .from("users")
    .select("_id, email, department_id")
    .eq("_id", authUid)
    .limit(1)
    .maybeSingle();

  if (error) {
    logSupabaseError("users by _id", error as SupabaseError);
  }

  if (data?._id) return data;
  if (!email) return null;

  const fallback = await supabase
    .from("users")
    .select("_id, email, department_id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (fallback.error) {
    logSupabaseError("users by email", fallback.error as SupabaseError);
  }

  return fallback.data ?? null;
};

const resolveDepartmentInfo = async (
  userId: string,
  profile: any | null,
  userRow: any | null,
) => {
  let departmentId: string | null =
    profile?.department_id ?? userRow?.department_id ?? null;
  let departmentPath: string | null = profile?.department_path ?? null;
  let departmentLevel: number | null =
    profile?.department_level != null
      ? Number(profile.department_level)
      : null;

  if (Number.isNaN(departmentLevel)) {
    departmentLevel = null;
  }

  if (departmentId && (!departmentPath || departmentLevel == null)) {
    const { data, error } = await supabase
      .from("departments")
      .select("_id, path, level")
      .eq("_id", departmentId)
      .limit(1)
      .maybeSingle();
    if (error) {
      logSupabaseError("departments by _id", error as SupabaseError);
    }
    if (data) {
      if (!departmentPath && data.path) departmentPath = data.path;
      if (departmentLevel == null && data.level != null) {
        const next = Number(data.level);
        departmentLevel = Number.isNaN(next) ? departmentLevel : next;
      }
    }
  }

  if (!departmentId || !departmentPath || departmentLevel == null) {
    const { data, error } = await supabase
      .from("department_users")
      .select("department_id, departments(_id, path, level)")
      .eq("user_id", userId)
      .limit(1);

    if (error) {
      logSupabaseError("department_users", error as SupabaseError);
    }

    const deptRow = data?.[0]?.departments ?? null;
    const deptId = data?.[0]?.department_id ?? deptRow?._id ?? null;
    if (!departmentId && deptId) {
      departmentId = deptId;
    }
    if (!departmentPath && deptRow?.path) {
      departmentPath = deptRow.path;
    }
    if (departmentLevel == null && deptRow?.level != null) {
      const next = Number(deptRow.level);
      departmentLevel = Number.isNaN(next) ? departmentLevel : next;
    }
  }

  return { departmentId, departmentPath, departmentLevel };
};

export const getUserRoles = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role_id, roles(_id, code, status)")
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("user_roles", error as SupabaseError);
    return { roleIds: [], roleCodes: [] };
  }

  const roleIds = new Set<string>();
  const roleCodes = new Set<string>();

  (data ?? []).forEach((row: any) => {
    if (row?.role_id) {
      roleIds.add(String(row.role_id));
    }
    const role = row?.roles;
    if (role?._id) {
      roleIds.add(String(role._id));
    }
    if (role?.code) {
      roleCodes.add(String(role.code));
    }
  });

  return {
    roleIds: Array.from(roleIds),
    roleCodes: Array.from(roleCodes),
  };
};

export const getRolePermissions = async (roleIds: string[]) => {
  if (roleIds.length === 0) {
    return { permissionIds: [], permissionCodes: [], permissionMetaMap: {} };
  }

  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission_id, permissions(code, status, category, module, resource, action)")
    .in("role_id", roleIds);

  if (error) {
    logSupabaseError("role_permissions", error as SupabaseError);
    return { permissionIds: [], permissionCodes: [], permissionMetaMap: {} };
  }

  const permissionIds: string[] = [];
  const permissionCodes: string[] = [];
  const permissionMetaMap: PermissionMetaMap = {};

  (data ?? []).forEach((row: any) => {
    if (row?.permission_id) {
      permissionIds.push(String(row.permission_id));
    }
    const permission = row?.permissions;
    if (permission?.code && isActiveStatus(permission?.status)) {
      const code = String(permission.code);
      permissionCodes.push(code);
      permissionMetaMap[code] = {
        code,
        category: permission?.category ?? null,
        module: permission?.module ?? null,
        resource: permission?.resource ?? null,
        action: permission?.action ?? null,
      };
    }
  });

  return {
    permissionIds: normalizeStringArray(permissionIds),
    permissionCodes: normalizeStringArray(permissionCodes),
    permissionMetaMap,
  };
};

export const getUserPermissions = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_permissions")
    .select("permission_id, permissions(code, status, category, module, resource, action)")
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("user_permissions", error as SupabaseError);
    return { permissionIds: [], permissionCodes: [], permissionMetaMap: {} };
  }

  const permissionIds: string[] = [];
  const permissionCodes: string[] = [];
  const permissionMetaMap: PermissionMetaMap = {};

  (data ?? []).forEach((row: any) => {
    if (row?.permission_id) {
      permissionIds.push(String(row.permission_id));
    }
    const permission = row?.permissions;
    if (permission?.code && isActiveStatus(permission?.status)) {
      const code = String(permission.code);
      permissionCodes.push(code);
      permissionMetaMap[code] = {
        code,
        category: permission?.category ?? null,
        module: permission?.module ?? null,
        resource: permission?.resource ?? null,
        action: permission?.action ?? null,
      };
    }
  });

  return {
    permissionIds: normalizeStringArray(permissionIds),
    permissionCodes: normalizeStringArray(permissionCodes),
    permissionMetaMap,
  };
};

export const getIamIdentity = async (
  opts?: { force?: boolean },
): Promise<IamIdentity | null> => {
  const authUser = await getCurrentUser();
  if (!authUser) {
    clearIamIdentityCache();
    return null;
  }

  if (!opts?.force) {
    const cached = getCachedIdentity(authUser.authUid);
    if (cached) return cached;
  }

  const profile = await resolveUserProfile(authUser.authUid, authUser.email);
  const userRow = profile
    ? null
    : await resolveUserFromUsers(authUser.authUid, authUser.email);
  const userId = profile?.user_id ?? userRow?._id ?? authUser.authUid;

  if (import.meta.env.DEV && profile?.user_id && profile.user_id !== authUser.authUid) {
    console.warn("[iam] authUid differs from public user_id", {
      authUid: authUser.authUid,
      userId: profile.user_id,
    });
  }

  const viewRoleCodes = normalizeToArray(profile?.role_codes);
  const viewPermissionCodes = normalizeToArray(profile?.permission_codes);
  const preferredPrimaryRole = profile?.primary_role_code ?? null;

  const needsRoleFallback = viewRoleCodes.length === 0;
  const needsPermissionFallback = viewPermissionCodes.length === 0;

  const rolesInfo =
    needsRoleFallback || needsPermissionFallback
      ? await getUserRoles(userId)
      : { roleIds: [], roleCodes: [] };

  const roleCodes = uniq([...viewRoleCodes, ...rolesInfo.roleCodes]);
  const roleIds = uniq(rolesInfo.roleIds);

  let permissionIds: string[] = [];
  let permissionCodes: string[] = [];
  let permissionMetaMap: PermissionMetaMap | undefined;
  if (viewPermissionCodes.length > 0) {
    permissionCodes = uniq(viewPermissionCodes);
    permissionMetaMap = undefined;
  } else {
    const rolePerms = await getRolePermissions(roleIds);
    const userPerms = await getUserPermissions(userId);
    permissionIds = uniq([
      ...rolePerms.permissionIds,
      ...userPerms.permissionIds,
    ]);
    permissionCodes = uniq([
      ...rolePerms.permissionCodes,
      ...userPerms.permissionCodes,
    ]);
    permissionMetaMap = {
      ...rolePerms.permissionMetaMap,
      ...userPerms.permissionMetaMap,
    };
  }

  const normalizedRoles = roleCodes.map((code) => code.toLowerCase());
  const isSuperAdmin =
    Boolean(profile?.is_super_admin) || normalizedRoles.includes("super-admin");
  const isAdmin =
    Boolean(profile?.is_admin) || normalizedRoles.includes("admin");

  const { departmentId, departmentPath, departmentLevel } =
    await resolveDepartmentInfo(userId, profile, userRow);

  const identity: IamIdentity = {
    authUid: authUser.authUid,
    userId,
    email: profile?.email ?? userRow?.email ?? authUser.email ?? null,
    roleIds,
    roleCodes,
    permissionIds,
    permissionCodes,
    permissionMetaMap,
    primaryRoleCode: resolvePrimaryRoleCode(roleCodes, preferredPrimaryRole),
    isSuperAdmin,
    isAdmin,
    departmentId,
    departmentPath,
    departmentLevel,
  };

  setCachedIdentity(authUser.authUid, identity);

  if (import.meta.env.DEV) {
    console.debug("[iam]", {
      authUid: identity.authUid,
      userId: identity.userId,
      roleCodes: identity.roleCodes,
      permCount: identity.permissionCodes.length,
      isSuperAdmin: identity.isSuperAdmin,
    });
  }

  return identity;
};
