import { supabase } from "@/api/supabaseClient";

export type IamIdentity = {
  authUid: string;
  userId: string;
  roleIds: string[];
  roleCodes: string[];
  permissionIds: string[];
  permissionCodes: string[];
  primaryRoleCode?: string;
  isSuperAdmin?: boolean;
};

type SupabaseError = {
  message?: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
let identityCache:
  | { authUid: string; expiresAt: number; data: IamIdentity }
  | null = null;

const isActiveStatus = (status: unknown) =>
  status === 1 || status === true || status === "1";

const normalizeStringArray = (values: unknown[]): string[] =>
  values.map((value) => String(value).trim()).filter(Boolean);

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

const resolvePrimaryRoleCode = (roleCodes: string[]): string | undefined => {
  if (roleCodes.length === 0) return undefined;
  const priority = ["super-admin", "super_admin", "superadmin", "admin"];
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

export const getCurrentUser = async (): Promise<{ authUid: string; email?: string | null } | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    logSupabaseError("auth.getUser", error as SupabaseError);
    return null;
  }
  if (!data?.user?.id) return null;
  return { authUid: data.user.id, email: data.user.email };
};

const resolveUserProfile = async (authUid: string, email?: string | null) => {
  const select = "user_id,email,is_super_admin";
  const { data, error } = await supabase
    .from("v_user_profile")
    .select(select)
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
    .select(select)
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
    .select("_id, email")
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
    .select("_id, email")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (fallback.error) {
    logSupabaseError("users by email", fallback.error as SupabaseError);
  }

  return fallback.data ?? null;
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
    return { permissionIds: [], permissionCodes: [] };
  }

  const { data, error } = await supabase
    .from("role_permissions")
    .select("permission_id, permissions(code, status)")
    .in("role_id", roleIds);

  if (error) {
    logSupabaseError("role_permissions", error as SupabaseError);
    return { permissionIds: [], permissionCodes: [] };
  }

  const permissionIds: string[] = [];
  const permissionCodes: string[] = [];

  (data ?? []).forEach((row: any) => {
    if (row?.permission_id) {
      permissionIds.push(String(row.permission_id));
    }
    const permission = row?.permissions;
    if (permission?.code && isActiveStatus(permission?.status)) {
      permissionCodes.push(String(permission.code));
    }
  });

  return {
    permissionIds: normalizeStringArray(permissionIds),
    permissionCodes: normalizeStringArray(permissionCodes),
  };
};

export const getPermissionsByIds = async (permissionIds: string[]) => {
  if (permissionIds.length === 0) {
    return { permissionIds: [], permissionCodes: [] };
  }

  const { data, error } = await supabase
    .from("permissions")
    .select("_id, code, status")
    .in("_id", permissionIds);

  if (error) {
    logSupabaseError("permissions by ids", error as SupabaseError);
    return { permissionIds: [], permissionCodes: [] };
  }

  const codes = (data ?? [])
    .filter((row: any) => isActiveStatus(row?.status))
    .map((row: any) => row?.code)
    .filter(Boolean);

  return {
    permissionIds: normalizeStringArray(permissionIds),
    permissionCodes: normalizeStringArray(codes),
  };
};

const fetchRolesWithPermissions = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select(
      "role_id, roles(_id, code, status, role_permissions(permission_id, permissions(code, status)))",
    )
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("user_roles with roles/permissions", error as SupabaseError);
    return {
      roleIds: [] as string[],
      roleCodes: [] as string[],
      rolePermissionIds: [] as string[],
      rolePermissionCodes: [] as string[],
    };
  }

  const roleIds = new Set<string>();
  const roleCodes = new Set<string>();
  const permissionIds = new Set<string>();
  const permissionCodes = new Set<string>();

  (data ?? []).forEach((row: any) => {
    if (row?.role_id) {
      roleIds.add(String(row.role_id));
    }

    const role = row?.roles;
    if (role?.code) {
      roleCodes.add(String(role.code));
    }
    if (role?._id) {
      roleIds.add(String(role._id));
    }

    const rolePermissions = Array.isArray(role?.role_permissions)
      ? role.role_permissions
      : [];
    rolePermissions.forEach((rp: any) => {
      if (rp?.permission_id) {
        permissionIds.add(String(rp.permission_id));
      }
      const permission = rp?.permissions;
      if (permission?.code && isActiveStatus(permission?.status)) {
        permissionCodes.add(String(permission.code));
      }
    });
  });

  return {
    roleIds: Array.from(roleIds),
    roleCodes: Array.from(roleCodes),
    rolePermissionIds: Array.from(permissionIds),
    rolePermissionCodes: Array.from(permissionCodes),
  };
};

export const getUserPermissions = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_permissions")
    .select("permission_id, permissions(code, status)")
    .eq("user_id", userId);

  if (error) {
    logSupabaseError("user_permissions", error as SupabaseError);
    return { permissionIds: [], permissionCodes: [] };
  }

  const permissionIds: string[] = [];
  const permissionCodes: string[] = [];

  (data ?? []).forEach((row: any) => {
    if (row?.permission_id) {
      permissionIds.push(String(row.permission_id));
    }
    const permission = row?.permissions;
    if (permission?.code && isActiveStatus(permission?.status)) {
      permissionCodes.push(String(permission.code));
    }
  });

  return {
    permissionIds: normalizeStringArray(permissionIds),
    permissionCodes: normalizeStringArray(permissionCodes),
  };
};

export const getIamIdentity = async (opts?: { force?: boolean }): Promise<IamIdentity | null> => {
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

  const rolesInfo = await fetchRolesWithPermissions(userId);
  const userPerms = await getUserPermissions(userId);

  const roleIds = uniq(rolesInfo.roleIds);
  const roleCodes = uniq(rolesInfo.roleCodes);
  const permissionIds = uniq([
    ...rolesInfo.rolePermissionIds,
    ...userPerms.permissionIds,
  ]);
  const permissionCodes = uniq([
    ...rolesInfo.rolePermissionCodes,
    ...userPerms.permissionCodes,
  ]);

  const identity: IamIdentity = {
    authUid: authUser.authUid,
    userId,
    roleIds,
    roleCodes,
    permissionIds,
    permissionCodes,
    primaryRoleCode: resolvePrimaryRoleCode(roleCodes),
    isSuperAdmin: Boolean(profile?.is_super_admin),
  };

  setCachedIdentity(authUser.authUid, identity);

  if (import.meta.env.DEV) {
    console.debug("[iam]", {
      authUid: identity.authUid,
      userId: identity.userId,
      roleCodes: identity.roleCodes,
      permCount: identity.permissionCodes.length,
    });
  }

  return identity;
};
