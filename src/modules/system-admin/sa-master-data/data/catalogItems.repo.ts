import { supabase } from '@/api/supabaseClient';

export type CatalogItemStatus = "ACTIVE" | "INACTIVE" | "active" | "inactive" | string;

export type CatalogItemRecord = {
  id: string;
  catalog_id: string;
  parent_id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  badge_color?: string | null;
  is_default?: boolean | null;
  status?: CatalogItemStatus | null;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type CatalogItemPayload = {
  catalog_id: string;
  parent_id?: string | null;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  badge_color?: string | null;
  is_default?: boolean | null;
  status?: CatalogItemStatus | null;
  sort_order?: number | null;
  meta?: Record<string, unknown> | null;
};

export type CatalogItemListParams = {
  catalogId: string;
  search?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
  pageSize?: number;
};

export type CatalogItemListResult = {
  data: CatalogItemRecord[];
  total: number;
};

const mapRow = (row: any): CatalogItemRecord => ({
  id: row.id ?? row._id,
  catalog_id: row.catalog_id,
  parent_id: row.parent_id ?? null,
  code: row.code,
  name: row.name,
  description: row.description ?? null,
  icon: row.icon ?? null,
  badge_color: row.badge_color ?? null,
  is_default: row.is_default ?? null,
  status: row.status ?? null,
  sort_order: row.sort_order ?? null,
  meta: row.meta ?? null,
  created_at: row.created_at ?? null,
  updated_at: row.updated_at ?? null,
  deleted_at: row.deleted_at ?? null,
});

const normalizeStatusFilter = (value: "all" | "active" | "inactive") => {
  if (value === "all") return null;
  return value === "active" ? ["active", "ACTIVE"] : ["inactive", "INACTIVE"];
};

export const catalogItemsRepo = {
  async listItems(params: CatalogItemListParams): Promise<CatalogItemListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("catalog_items")
      .select("*", { count: "exact" })
      .eq("catalog_id", params.catalogId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .range(from, to);

    const search = params.search?.trim();
    if (search) {
      query = query.or(`code.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const statusFilter = normalizeStatusFilter(params.status ?? "all");
    if (statusFilter) {
      query = query.in("status", statusFilter);
    }

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`catalog_item select failed: ${error.message}`);
    }

    return { data: (data || []).map(mapRow), total: count ?? 0 };
  },

  async listItemsByCatalog(catalogId: string): Promise<CatalogItemRecord[]> {
    const { data, error } = await supabase
      .from("catalog_items")
      .select("*")
      .eq("catalog_id", catalogId)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`catalog_item select failed: ${error.message}`);
    }

    return (data || []).map(mapRow);
  },

  async createItem(payload: CatalogItemPayload): Promise<CatalogItemRecord> {
    const { data, error } = await supabase
      .from("catalog_items")
      .insert([
        {
          ...payload,
          is_default: payload.is_default ?? false,
          sort_order: payload.sort_order ?? 0,
          meta: payload.meta ?? {},
        },
      ])
      .select("*")
      .single();

    if (error) {
      throw new Error(`catalog_item insert failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async updateItem(id: string, payload: Partial<CatalogItemPayload>): Promise<CatalogItemRecord> {
    const { data, error } = await supabase
      .from("catalog_items")
      .update({
        ...payload,
        ...(payload.meta ? { meta: payload.meta } : {}),
      })
      .eq("_id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(`catalog_item update failed: ${error.message}`);
    }

    return mapRow(data);
  },

  async softDeleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from("catalog_items")
      .update({ deleted_at: new Date().toISOString() })
      .eq("_id", id);

    if (error) {
      throw new Error(`catalog_item delete failed: ${error.message}`);
    }
  },

  async setItemStatus(id: string, status: CatalogItemStatus): Promise<CatalogItemRecord> {
    return catalogItemsRepo.updateItem(id, { status });
  },
};
