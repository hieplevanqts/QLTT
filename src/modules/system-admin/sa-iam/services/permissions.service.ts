import { supabase } from '@/api/supabaseClient';

export type PermissionStatusValue = 0 | 1;

export type PermissionRecord = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  module?: string | null;
  resource?: string | null;
  action?: string | null;
  category?: "PAGE" | "FEATURE" | string | null;
  is_default?: boolean | null;
  permission_type?: string | null;
  status: PermissionStatusValue;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
  role_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type PermissionListParams = {
  q?: string;
  status?: "all" | "active" | "inactive";
  moduleId?: string;
  moduleCode?: string;
  category?: "PAGE" | "FEATURE" | "all";
  action?: string;
  permissionType?: string;
  page?: number;
  pageSize?: number;
};

export type PermissionListResult = {
  data: PermissionRecord[];
  total: number;
};

export type PermissionPayload = {
  code: string;
  name: string;
  description?: string | null;
  module_id: string;
  permission_type: string;
  status: PermissionStatusValue;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
};

export type PermissionModuleOption = {
  id: string;
  code: string;
  name: string;
  group?: string | null;
};

export type PermissionActionOption = {
  code: string;
};

export type PermissionLegacyTypeOption = {
  code: string;
};

export type PermissionRoleRecord = {
  id: string;
  code: string;
  name: string;
  status: PermissionStatusValue;
};

export type PermissionRoleListParams = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export type PermissionRoleListResult = {
  data: PermissionRoleRecord[];
  total: number;
};

const mapRow = (row: any): PermissionRecord => ({
  id: row._id ?? "",
  code: row.code,
  name: row.name,
  description: row.description ?? null,
  module_id: row.module_id ?? null,
  module: row.module ?? null,
  resource: row.resource ?? null,
  action: row.action ?? null,
  category: row.category ?? null,
  is_default: row.is_default ?? null,
  permission_type: row.permission_type ?? null,
  status: Number(row.status) as PermissionStatusValue,
  sort_order: row.sort_order ?? null,
  meta: row.meta ?? null,
  role_count: row.role_count == null ? null : Number(row.role_count),
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
});

const normalizeStatusFilter = (value: "all" | "active" | "inactive") => {
  if (value === "all") return null;
  return value === "active" ? 1 : 0;
};

export const permissionsService = {
  async listPermissions(params: PermissionListParams): Promise<PermissionListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const buildQuery = (source: "v_permissions_stats" | "permissions") => {
      let query = supabase
        .from(source)
        .select("*", { count: "exact" })
        .order("sort_order", { ascending: true })
        .order("code", { ascending: true })
        .range(from, to);

      const search = params.q?.trim();
      if (search) {
        const escaped = search.replace(/,/g, "\\,");
        query = query.or(
          `code.ilike.%${escaped}%,name.ilike.%${escaped}%,description.ilike.%${escaped}%,resource.ilike.%${escaped}%,action.ilike.%${escaped}%,module.ilike.%${escaped}%,permission_type.ilike.%${escaped}%`,
        );
      }

      const statusFilter = normalizeStatusFilter(params.status ?? "all");
      if (statusFilter !== null) {
        query = query.eq("status", statusFilter);
      }

      if (params.category && params.category !== "all") {
        query = query.eq("category", params.category);
      }

      if (params.action) {
        query = query.eq("action", params.action);
      }

      if (params.permissionType) {
        query = query.eq("permission_type", params.permissionType);
      }

      const moduleId = params.moduleId?.trim();
      const moduleCode = params.moduleCode?.trim();
      if (moduleId && moduleCode) {
        query = query.or(
          `module_id.eq.${moduleId},module.eq.${moduleCode},permission_type.eq.${moduleCode}`,
        );
      } else if (moduleId) {
        query = query.eq("module_id", moduleId);
      } else if (moduleCode) {
        query = query.or(`module.eq.${moduleCode},permission_type.eq.${moduleCode}`);
      }

      return query;
    };

    let response = await buildQuery("v_permissions_stats");
    if (response.error && response.error.message.includes("v_permissions_stats")) {
      response = await buildQuery("permissions");
    }

    if (response.error) {
      throw new Error(`permissions select failed: ${response.error.message}`);
    }

    return {
      data: (response.data || []).map(mapRow),
      total: response.count ?? 0,
    };
  },

  async getPermissionById(id: string): Promise<PermissionRecord | null> {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`permission select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async getPermissionByCode(code: string): Promise<PermissionRecord | null> {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      throw new Error(`permission select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async createPermission(payload: PermissionPayload): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from("permissions")
      .insert([
        {
          ...payload,
          sort_order: payload.sort_order ?? 0,
          meta: payload.meta ?? {},
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`permission insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updatePermission(id: string, payload: Partial<PermissionPayload>): Promise<PermissionRecord> {
    const { data, error } = await supabase
      .from("permissions")
      .update({
        ...payload,
        ...(payload.meta ? { meta: payload.meta } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`permission update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async togglePermissionStatus(id: string, status: PermissionStatusValue): Promise<PermissionRecord> {
    return permissionsService.updatePermission(id, { status });
  },

  async listPermissionModules(): Promise<PermissionModuleOption[]> {
    const { data, error } = await supabase
      .from("modules")
      .select("_id, code, name, \"group\", sort_order, order_index")
      .order("sort_order", { ascending: true })
      .order("order_index", { ascending: true })
      .order("code", { ascending: true });

    if (error) {
      throw new Error(error.message || "Không thể tải danh sách phân hệ.");
    }

    return (data || []).map((row: any) => ({
      id: row._id ?? "",
      code: row.code,
      name: row.name,
      group: row.group ?? null,
    }));
  },

  async listPermissionActions(): Promise<PermissionActionOption[]> {
    const { data, error } = await supabase
      .from("permissions")
      .select("action");

    if (error) {
      return [];
    }

    const unique = Array.from(
      new Set((data || []).map((row: any) => row.action).filter(Boolean)),
    ) as string[];

    return unique.map((code) => ({ code }));
  },

  async listPermissionLegacyTypes(): Promise<PermissionLegacyTypeOption[]> {
    const { data, error } = await supabase
      .from("permission_actions")
      .select("code")
      .order("code", { ascending: true });

    if (!error) {
      return (data || []).map((row: any) => ({ code: row.code }));
    }

    const fallback = await supabase.from("permissions").select("permission_type");
    if (fallback.error) {
      return [];
    }
    const unique = Array.from(
      new Set((fallback.data || []).map((row: any) => row.permission_type).filter(Boolean)),
    ) as string[];
    return unique.map((code) => ({ code }));
  },

  async listRolesByPermission(
    permissionId: string,
    params: PermissionRoleListParams,
  ): Promise<PermissionRoleListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: roleMappings, error: mappingError } = await supabase
      .from("role_permissions")
      .select("role_id")
      .eq("permission_id", permissionId);

    if (mappingError) {
      throw new Error(`permission roles select failed: ${mappingError.message}`);
    }

    const roleIds = (roleMappings || []).map((row: any) => row.role_id).filter(Boolean);
    if (roleIds.length === 0) {
      return { data: [], total: 0 };
    }

    let rolesQuery = supabase
      .from("roles")
      .select("_id, code, name, status", { count: "exact" })
      .in("_id", roleIds)
      .order("code", { ascending: true })
      .range(from, to);

    const search = params.q?.trim();
    if (search) {
      rolesQuery = rolesQuery.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data: roles, error: rolesError, count } = await rolesQuery;
    if (rolesError) {
      throw new Error(`permission roles select failed: ${rolesError.message}`);
    }

    return {
      data: (roles || []).map((role: any) => ({
        id: role._id,
        code: role.code,
        name: role.name,
        status: Number(role.status) as PermissionStatusValue,
      })),
      total: count ?? 0,
    };
  },
};
