import { supabase } from '@/api/supabaseClient';

export type PermissionStatusValue = 0 | 1;

export type PermissionRecord = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
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
  id: row._id ?? row.id,
  code: row.code,
  name: row.name,
  description: row.description ?? null,
  module_id: row.module_id ?? null,
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
        query = query.or(
          `code.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`,
        );
      }

      const statusFilter = normalizeStatusFilter(params.status ?? "all");
      if (statusFilter !== null) {
        query = query.eq("status", statusFilter);
      }

      const moduleId = params.moduleId?.trim();
      const moduleCode = params.moduleCode?.trim();
      if (moduleId && moduleCode) {
        query = query.or(`module_id.eq.${moduleId},permission_type.eq.${moduleCode}`);
      } else if (moduleId) {
        query = query.eq("module_id", moduleId);
      } else if (moduleCode) {
        query = query.eq("permission_type", moduleCode);
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
    const trySelect = async (idField: "_id" | "id") => {
      const { data, error } = await supabase
        .from("modules")
        .select(`${idField}, code, name`)
        .order("order_index", { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map((row: any) => ({
        id: row[idField],
        code: row.code,
        name: row.name,
      }));
    };

    try {
      return await trySelect("id");
    } catch (_err) {
      try {
        return await trySelect("_id");
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "Không thể tải danh sách phân hệ.",
        );
      }
    }
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
