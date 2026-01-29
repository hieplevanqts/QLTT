import { supabase } from '@/api/supabaseClient';

export type RoleStatusValue = 0 | 1;

export type RoleRecord = {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  status: RoleStatusValue;
  sort_order?: number | null;
  is_system?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  user_count?: number | null;
};

export type RoleListParams = {
  q?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  pageSize?: number;
};

export type RoleListResult = {
  data: RoleRecord[];
  total: number;
};

export type RolePayload = {
  code: string;
  name: string;
  description?: string | null;
  status: RoleStatusValue;
  sort_order?: number | null;
};

export type RoleUserRecord = {
  id: string;
  username?: string | null;
  full_name?: string | null;
  email?: string | null;
  status?: number | string | null;
  lastLoginAt?: string | null;
};

export type RoleUserListParams = {
  q?: string;
  status?: "all" | "active" | "inactive" | "locked";
  page?: number;
  pageSize?: number;
};

export type RoleUserListResult = {
  data: RoleUserRecord[];
  total: number;
};

const mapRow = (row: any): RoleRecord => ({
  id: row._id ?? row.id,
  code: row.code,
  name: row.name,
  description: row.description ?? null,
  status: Number(row.status) as RoleStatusValue,
  sort_order: row.sort_order ?? null,
  is_system: row.is_system ?? null,
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
  deleted_at: row.deleted_at ?? null,
  user_count: row.user_count == null ? null : Number(row.user_count),
});

const normalizeStatusFilter = (value: "all" | "active" | "inactive") => {
  if (value === "all") return null;
  return value === "active" ? 1 : 0;
};

export const rolesService = {
  async listRoles(params: RoleListParams): Promise<RoleListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("v_roles_with_user_count")
      .select("*", { count: "exact" })
      .is("deleted_at", null)
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

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`roles select failed: ${error.message}`);
    }

    return {
      data: (data || []).map(mapRow),
      total: count ?? 0,
    };
  },

  async getRoleById(id: string): Promise<RoleRecord | null> {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("_id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`role select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async getRoleByCode(code: string): Promise<RoleRecord | null> {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (error) {
      throw new Error(`role select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async createRole(payload: RolePayload): Promise<RoleRecord> {
    const { data, error } = await supabase
      .from("roles")
      .insert([
        {
          ...payload,
          sort_order: payload.sort_order ?? 0,
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`role insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateRole(id: string, payload: Partial<RolePayload>): Promise<RoleRecord> {
    const { data, error } = await supabase
      .from("roles")
      .update({
        ...payload,
        updated_at: new Date().toISOString(),
      })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`role update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async setRoleStatus(id: string, status: RoleStatusValue): Promise<RoleRecord> {
    return rolesService.updateRole(id, { status });
  },

  async softDeleteRole(id: string): Promise<void> {
    const { error } = await supabase
      .from("roles")
      .update({
        deleted_at: new Date().toISOString(),
        status: 0,
      })
      .eq("_id", id);

    if (error) {
      throw new Error(`role delete failed: ${error.message}`);
    }
  },

  async listRoleUsers(roleId: string, params: RoleUserListParams): Promise<RoleUserListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const search = params.q?.trim() || null;
    const statusValue =
      params.status === "active" ? 1 : params.status === "inactive" ? 0 : params.status === "locked" ? 2 : null;

    const { data, error } = await supabase.rpc("rpc_users_by_role", {
      p_role_id: roleId,
      p_q: search,
      p_status: statusValue,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      throw new Error(`role users select failed: ${error.message}`);
    }

    const mapped = (data || []).map((user: any) => ({
      id: user._id ?? user.id,
      username: user.username ?? null,
      full_name: user.full_name ?? null,
      email: user.email ?? null,
      status: user.status ?? null,
      lastLoginAt: user.last_login_at ?? user.lastLoginAt ?? null,
    }));

    const total = data && data.length > 0 ? Number(data[0].total_count) : 0;

    return { data: mapped, total };
  },
};
