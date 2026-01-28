import { useEffect, useState } from "react";

import { supabase } from "../lib/supabase";
import type { MenuItem } from "../modules/system-admin/types";

const STORAGE_KEY = "mappa.menu.registry";

export const useMenuRegistry = () => {
  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as MenuItem[];
        setMenus(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const isMissingRelationError = (message: string) =>
      message.includes("Could not find the table") ||
      message.includes("does not exist") ||
      message.includes("schema cache");

    const loadMenusFromDb = async (): Promise<MenuItem[] | null> => {
      const runQuery = async (orderField?: string | null, labelField?: string | null) => {
        let query = supabase.from("v_my_menu").select("*");
        if (orderField) {
          query = query.order(orderField, { ascending: true });
        }
        if (labelField) {
          query = query.order(labelField, { ascending: true });
        }
        return query;
      };

      let response = await runQuery("sort_order", "label");
      if (response.error) {
        if (isMissingRelationError(response.error.message)) {
          return null;
        }

        if (response.error.message.includes("sort_order") || response.error.message.includes("label")) {
          response = await runQuery("order_index", "name");
        }

        if (response.error && (response.error.message.includes("order_index") || response.error.message.includes("name"))) {
          response = await runQuery(null, null);
        }

        if (response.error) {
          throw new Error(`menu select failed: ${response.error.message}`);
        }
      }

      const rows = response.data || [];
      if (rows.length === 0) return [];

      return rows.map((row: any) => ({
        id: row._id ?? row.id,
        label: row.label ?? row.name ?? "",
        path: row.route_path ?? row.path ?? null,
        icon: row.icon ?? undefined,
        order: row.sort_order ?? row.order_index ?? row.order ?? 0,
        parentId: row.parent_id ?? null,
        moduleId: row.module_id ?? null,
        permissionsAny: Array.isArray(row.permission_codes) ? row.permission_codes : [],
        isEnabled: row.is_visible ?? row.is_active ?? true,
      }));
    };

    const loadMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        const dbMenus = await loadMenusFromDb();
        if (dbMenus !== null) {
          setMenus(dbMenus);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(dbMenus));
          return;
        }
        throw new Error("Không thể tải menu từ cơ sở dữ liệu.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menus.");
      } finally {
        setLoading(false);
      }
    };

    const handleRefresh = () => {
      localStorage.removeItem(STORAGE_KEY);
      void loadMenus();
    };

    void loadMenus();
    window.addEventListener("mappa:menu-refresh", handleRefresh);
    return () => {
      window.removeEventListener("mappa:menu-refresh", handleRefresh);
    };
  }, []);

  return { menus, loading, error };
};
