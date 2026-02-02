import { supabase } from "@/api/supabaseClient";

export type MatrixCategory = "PAGE" | "FEATURE" | "ALL";

export type MatrixViewRow = {
  role_id: string;
  module_key: string | null;
  category: string | null;
  resource_group: string | null;
  resource_key: string | null;
  action: string | null;
  action_label: string | null;
  action_order: number | null;
  permission_id: string | null;
  permission_code: string | null;
  permission_name: string | null;
  is_granted: boolean | number | null;
};

export type MatrixModuleOption = {
  id: string;
  key: string;
  name: string;
  group?: string | null;
  status?: number | null;
  sort_order?: number | null;
};

export type MatrixActionCatalogItem = {
  code: string;
  name: string;
};

export const rolePermissionsMatrixService = {
  async listModules(): Promise<MatrixModuleOption[]> {
    const { data, error } = await supabase
      .from("v_modules_stats")
      .select("_id, key, code, name, \"group\", status, sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`v_modules_stats select failed: ${error.message}`);
    }

    return (data || [])
      .map((row: any) => ({
        id: row._id ?? "",
        key: row.key ?? row.code ?? "",
        name: row.name ?? row.key ?? row.code ?? "",
        group: row.group ?? null,
        status: row.status ?? null,
        sort_order: row.sort_order ?? null,
      }))
      .filter((row) => row.id && row.key);
  },

  async fetchMatrix(params: {
    roleId: string;
    moduleKey: string;
    category: MatrixCategory;
  }): Promise<MatrixViewRow[]> {
    const { roleId, moduleKey, category } = params;

    let query = supabase
      .from("v_role_permissions_matrix")
      .select("*")
      .eq("role_id", roleId)
      .eq("module_key", moduleKey)
      .order("resource_group", { ascending: true })
      .order("resource_key", { ascending: true })
      .order("action_order", { ascending: true });

    if (category !== "ALL") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`v_role_permissions_matrix select failed: ${error.message}`);
    }

    return (data || []) as MatrixViewRow[];
  },

  async listActions(): Promise<MatrixActionCatalogItem[]> {
    const { data, error } = await supabase
      .from("permission_actions")
      .select("code, name")
      .order("code", { ascending: true });

    if (error) {
      throw new Error(`permission_actions select failed: ${error.message}`);
    }

    const unique = new Map<string, MatrixActionCatalogItem>();
    (data || []).forEach((row: any) => {
      const code = String(row?.code ?? "").trim().toUpperCase();
      if (!code) return;
      const name = String(row?.name ?? "").trim();
      const existing = unique.get(code);
      if (!existing) {
        unique.set(code, { code, name });
        return;
      }
      if (!existing.name && name) {
        unique.set(code, { code, name });
      }
    });

    return Array.from(unique.values());
  },

  async saveChanges(roleId: string, toAdd: string[], toRemove: string[]): Promise<void> {
    if (toAdd.length > 0) {
      const payload = toAdd.map((permissionId) => ({
        role_id: roleId,
        permission_id: permissionId,
      }));
      const { error } = await supabase
        .from("role_permissions")
        .upsert(payload, { onConflict: "role_id,permission_id" });
      if (error) {
        throw new Error(`role_permissions insert failed: ${error.message}`);
      }
    }

    if (toRemove.length > 0) {
      const { error } = await supabase
        .from("role_permissions")
        .delete()
        .eq("role_id", roleId)
        .in("permission_id", toRemove);
      if (error) {
        throw new Error(`role_permissions delete failed: ${error.message}`);
      }
    }
  },
};
