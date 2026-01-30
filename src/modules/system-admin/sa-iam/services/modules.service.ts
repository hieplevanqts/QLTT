import { supabase } from '@/api/supabaseClient';

export type ModuleStatusValue = 0 | 1;

export type ModuleRecord = {
  id: string;
  key: string;
  code: string;
  name: string;
  group: string;
  description?: string | null;
  icon?: string | null;
  status: ModuleStatusValue;
  sort_order: number;
  permission_count?: number | null;
  menu_count?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type ModuleListParams = {
  q?: string;
  group?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type ModuleListResult = {
  data: ModuleRecord[];
  total: number;
};

export type ModulePayload = {
  key: string;
  name: string;
  group: string;
  description?: string | null;
  icon?: string | null;
  status?: ModuleStatusValue;
  sort_order?: number;
  meta?: Record<string, unknown> | null;
};

const normalizeStatus = (value: unknown): ModuleStatusValue => {
  if (value === 0 || value === "INACTIVE") return 0;
  return 1;
};

const mapRow = (row: any): ModuleRecord => ({
  id: row._id ?? row.id,
  key: row.key ?? row.code ?? "",
  code: row.code ?? row.key ?? "",
  name: row.name ?? "",
  group: row.group ?? row.permission_type ?? "SYSTEM",
  description: row.description ?? null,
  icon: row.icon ?? null,
  status: normalizeStatus(row.status),
  sort_order: Number(row.sort_order ?? row.order_index ?? 0),
  permission_count:
    row.permission_count == null ? null : Number(row.permission_count),
  menu_count: row.menu_count == null ? null : Number(row.menu_count),
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
  deleted_at: row.deleted_at ?? null,
});

const normalizeStatusFilter = (value: ModuleListParams["status"]) => {
  if (!value || value === "all") return null;
  return value === "active" ? 1 : 0;
};

const stripMissingColumn = (
  payload: Record<string, unknown>,
  message?: string,
) => {
  if (!message) return payload;
  const match = message.match(/column \"([^\"]+)\"/i);
  if (!match) return payload;
  const missing = match[1];
  if (missing in payload) {
    const next = { ...payload };
    delete next[missing];
    return next;
  }
  return payload;
};

export const modulesService = {
  async listModules(params: ModuleListParams): Promise<ModuleListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const sortBy = params.sortBy ?? "sort_order";
    const sortDir = params.sortDir ?? "asc";

    const buildQuery = (source: "v_modules_stats" | "modules") => {
      let query = supabase
        .from(source)
        .select("*", { count: "exact" })
        .range(from, to);

      const search = params.q?.trim();
      if (search) {
        query = query.or(
          `key.ilike.%${search}%,code.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`,
        );
      }

      if (params.group && params.group !== "all") {
        query = query.eq("group", params.group);
      }

      const statusFilter = normalizeStatusFilter(params.status ?? "all");
      if (statusFilter !== null) {
        query = query.eq("status", statusFilter);
      }

      query = query
        .order(sortBy, { ascending: sortDir === "asc", nullsFirst: false })
        .order("name", { ascending: true });

      return query;
    };

    let response = await buildQuery("v_modules_stats");
    const missingView =
      response.error && response.error.message.includes("v_modules_stats");
    if (missingView) {
      response = await buildQuery("modules");
    }

    // Fallback ordering when sort_order is missing.
    if (
      response.error &&
      response.error.message.toLowerCase().includes("sort_order")
    ) {
      const fallback = supabase
        .from(missingView ? "modules" : "v_modules_stats")
        .select("*", { count: "exact" })
        .range(from, to)
        .order("order_index", { ascending: true })
        .order("name", { ascending: true });
      response = await fallback;
    }

    if (response.error) {
      throw new Error(`modules select failed: ${response.error.message}`);
    }

    return {
      data: (response.data || []).map(mapRow),
      total: response.count ?? 0,
    };
  },

  async createModule(payload: ModulePayload): Promise<ModuleRecord> {
    const basePayload: Record<string, unknown> = {
      key: payload.key,
      code: payload.key,
      name: payload.name,
      group: payload.group,
      description: payload.description ?? null,
      icon: payload.icon ?? null,
      status: payload.status ?? 1,
      sort_order: payload.sort_order ?? 0,
      meta: payload.meta ?? {},
    };

    let response = await supabase
      .from("modules")
      .insert([basePayload])
      .select("*")
      .single();

    if (response.error) {
      const stripped = stripMissingColumn(basePayload, response.error.message);
      if (stripped !== basePayload) {
        response = await supabase
          .from("modules")
          .insert([stripped])
          .select("*")
          .single();
      }
    }

    if (response.error) {
      throw new Error(`module insert failed: ${response.error.message}`);
    }

    return mapRow(response.data);
  },

  async updateModule(id: string, payload: Partial<ModulePayload>): Promise<ModuleRecord> {
    const basePayload: Record<string, unknown> = {
      ...(payload.key ? { key: payload.key, code: payload.key } : {}),
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.group ? { group: payload.group } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
      ...(payload.icon !== undefined ? { icon: payload.icon } : {}),
      ...(payload.status !== undefined ? { status: payload.status } : {}),
      ...(payload.sort_order !== undefined ? { sort_order: payload.sort_order } : {}),
      ...(payload.meta !== undefined ? { meta: payload.meta ?? {} } : {}),
      updated_at: new Date().toISOString(),
    };

    let response = await supabase
      .from("modules")
      .update(basePayload)
      .eq("_id", id)
      .select("*")
      .single();

    if (response.error && response.error.message.includes("_id")) {
      response = await supabase
        .from("modules")
        .update(basePayload)
        .eq("id", id)
        .select("*")
        .single();
    }

    if (response.error) {
      const stripped = stripMissingColumn(basePayload, response.error.message);
      if (stripped !== basePayload) {
        response = await supabase
          .from("modules")
          .update(stripped)
          .eq("_id", id)
          .select("*")
          .single();
      }
    }

    if (response.error) {
      throw new Error(`module update failed: ${response.error.message}`);
    }

    return mapRow(response.data);
  },

  async setModuleStatus(id: string, status: ModuleStatusValue): Promise<void> {
    let response = await supabase
      .from("modules")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("_id", id);

    if (response.error && response.error.message.includes("_id")) {
      response = await supabase
        .from("modules")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    if (response.error) {
      throw new Error(`module status update failed: ${response.error.message}`);
    }
  },

  async softDeleteModule(id: string): Promise<void> {
    let response = await supabase
      .from("modules")
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("_id", id);

    if (response.error && response.error.message.includes("_id")) {
      response = await supabase
        .from("modules")
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", id);
    }

    if (response.error) {
      throw new Error(`module delete failed: ${response.error.message}`);
    }
  },
};

