import { supabase } from '@/api/supabaseClient';

export type CatalogStatus = "ACTIVE" | "INACTIVE" | "active" | "inactive" | string;

export type CatalogRecord = {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  group: "COMMON" | "DMS" | "SYSTEM" | string;
  is_hierarchical?: boolean | null;
  editable_scope?: string | null;
  status?: CatalogStatus | null;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  item_count?: number;
};

export type CatalogPayload = {
  key: string;
  name: string;
  description?: string | null;
  group: "COMMON" | "DMS" | "SYSTEM" | string;
  status?: CatalogStatus | null;
  sort_order?: number | null;
  is_hierarchical?: boolean | null;
  editable_scope: string;
  meta?: Record<string, unknown> | null;
};

export type CatalogListParams = {
  group: "COMMON" | "DMS" | "SYSTEM" | string;
  search?: string;
  status?: "all" | "active" | "inactive";
};

const mapRow = (row: any): CatalogRecord => ({
  id: row.id ?? row._id,
  key: row.key,
  name: row.name,
  description: row.description ?? null,
  group: row.group,
  is_hierarchical: row.is_hierarchical ?? null,
  editable_scope: row.editable_scope ?? null,
  status: row.status ?? null,
  sort_order: row.sort_order ?? null,
  meta: row.meta ?? null,
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
  deleted_at: row.deleted_at ?? null,
  item_count: row.item_count == null ? undefined : Number(row.item_count),
});

const normalizeStatusFilter = (value: "all" | "active" | "inactive") => {
  if (value === "all") return null;
  return value === "active" ? ["active", "ACTIVE"] : ["inactive", "INACTIVE"];
};

export const catalogsRepo = {
  async listCatalogsByGroup(params: CatalogListParams): Promise<CatalogRecord[]> {
    let query = supabase
      .from("v_catalogs_with_item_count")
      .select("*")
      .eq("group", params.group)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    const search = params.search?.trim();
    if (search) {
      query = query.or(`key.ilike.%${search}%,name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const statusFilter = normalizeStatusFilter(params.status ?? "all");
    if (statusFilter) {
      query = query.in("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(`catalog select failed: ${error.message}`);
    }

    return (data || []).map(mapRow);
  },

  async getCatalogById(id: string): Promise<CatalogRecord | null> {
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .eq("_id", id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(`catalog select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async getCatalogByKey(key: string): Promise<CatalogRecord | null> {
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      throw new Error(`catalog select failed: ${error.message}`);
    }

    return data ? mapRow(data) : null;
  },

  async createCatalog(payload: CatalogPayload): Promise<CatalogRecord> {
    const { data, error } = await supabase
      .from("catalogs")
      .insert([
        {
          ...payload,
          meta: payload.meta ?? {},
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`catalog insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateCatalog(id: string, payload: Partial<CatalogPayload>): Promise<CatalogRecord> {
    const { data, error } = await supabase
      .from("catalogs")
      .update({
        ...payload,
        ...(payload.meta ? { meta: payload.meta } : {}),
      })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`catalog update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async setCatalogStatus(id: string, status: CatalogStatus): Promise<CatalogRecord> {
    return catalogsRepo.updateCatalog(id, { status });
  },
};
