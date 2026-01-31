import { supabase } from "@/api/supabaseClient";
import type { MenuItem } from "@/modules/system-admin/types";

export type RuntimeMenuItem = MenuItem & {
  moduleCode?: string | null;
  moduleName?: string | null;
  moduleGroup?: string | null;
};

const MENU_SELECT =
  "_id, code, name, path, icon, parent_id, module_id, order_index, is_active, permission_codes, module_code, module_name, module_group";

const mapMenuRow = (row: any): RuntimeMenuItem => ({
  id: row._id ?? "",
  label: row.name ?? row.label ?? "",
  path: row.path ?? row.route_path ?? null,
  icon: row.icon ?? undefined,
  order: row.order_index ?? row.sort_order ?? row.order ?? 0,
  parentId: row.parent_id ?? null,
  moduleId: row.module_id ?? null,
  permissionsAny: Array.isArray(row.permission_codes) ? row.permission_codes : [],
  isEnabled: row.is_active !== undefined ? Boolean(row.is_active) : row.is_visible !== undefined ? Boolean(row.is_visible) : true,
  moduleCode: row.module_code ?? null,
  moduleName: row.module_name ?? null,
  moduleGroup: row.module_group ?? null,
});

export const menuService = {
  async getMenuVersion(): Promise<string | null> {
    const { data, error } = await supabase
      .from("menus")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return null;
    }
    return data?.updated_at ?? null;
  },

  async getMyMenu(): Promise<RuntimeMenuItem[]> {
    const { data, error } = await supabase
      .from("v_my_menu")
      .select(MENU_SELECT)
      .eq("is_active", true);
    if (error) {
      throw new Error(`menu select failed: ${error.message}`);
    }
    return (data ?? []).map(mapMenuRow).filter((row) => row.id);
  },
};
