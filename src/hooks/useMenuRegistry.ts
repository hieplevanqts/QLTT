import { useEffect, useState, useCallback } from "react";
import { supabase } from '@/api/supabaseClient';
import type { MenuItem } from "../modules/system-admin/types";

const STORAGE_KEY = "mappa.menu.registry";
const STORAGE_VERSION_KEY = "mappa.menu.version";

export const useMenuRegistry = () => {
  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Hàm kiểm tra lỗi liên quan đến DB Schema
  const isMissingRelationError = (message: string) =>
    message.includes("Could not find the table") ||
    message.includes("does not exist") ||
    message.includes("schema cache");

  // 2. Hàm lấy version mới nhất từ DB
  const loadMenuVersion = useCallback(async (): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from("menus")
        .select("updated_at")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) return null;
      return data?.updated_at ?? null;
    } catch {
      return null;
    }
  }, []);

  // 3. Hàm fetch dữ liệu menu từ view/table
  const loadMenusFromDb = useCallback(async (): Promise<MenuItem[] | null> => {
    const runQuery = async (orderField?: string | null, labelField?: string | null) => {
      let query = supabase.from("v_my_menu").select("*");
      if (orderField) query = query.order(orderField, { ascending: true });
      if (labelField) query = query.order(labelField, { ascending: true });
      return query;
    };

    let response = await runQuery("order_index", "name");

    // Xử lý fallback nếu các cột không tồn tại (hỗ trợ các phiên bản DB khác nhau)
    if (response.error) {
      if (isMissingRelationError(response.error.message)) return null;
      
      if (response.error.message.includes("order_index") || response.error.message.includes("name")) {
        response = await runQuery("sort_order", "label");
      }
      if (response.error && (response.error.message.includes("sort_order") || response.error.message.includes("label"))) {
        response = await runQuery(null, null);
      }
      if (response.error) throw new Error(`Menu select failed: ${response.error.message}`);
    }

    const rows = response.data || [];
    return rows.map((row: any) => ({
      id: row._id ?? row.id,
      label: row.label ?? row.name ?? "",
      path: row.route_path ?? row.path ?? null,
      icon: row.icon ?? undefined,
      order: row.sort_order ?? row.order_index ?? row.order ?? 0,
      parentId: row.parent_id ?? null,
      moduleId: row.module_id ?? null,
      permissionsAny: Array.isArray(row.permission_codes) ? row.permission_codes : [],
      isEnabled: row.is_active ?? row.is_visible ?? true,
    }));
  }, []);

  // 4. Hàm điều phối chính (Tải và Lưu cache)
  const loadMenus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [dbMenus, version] = await Promise.all([
        loadMenusFromDb(),
        loadMenuVersion()
      ]);

      if (dbMenus !== null) {
        setMenus(dbMenus);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbMenus));
        if (version) {
          localStorage.setItem(STORAGE_VERSION_KEY, version);
        }
      } else {
        throw new Error("Không thể tải menu từ cơ sở dữ liệu.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load menus.");
    } finally {
      setLoading(false);
    }
  }, [loadMenusFromDb, loadMenuVersion]);

  // 5. Effect khởi tạo dữ liệu khi lần đầu vào App
  useEffect(() => {
    const initialize = async () => {
      // Ưu tiên load từ cache để UI nhanh
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          setMenus(JSON.parse(cached));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // So sánh version để quyết định có cập nhật ngầm hay không
      const cachedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
      const latestVersion = await loadMenuVersion();

      if (!cached || (latestVersion && latestVersion !== cachedVersion)) {
        await loadMenus();
      }
    };

    initialize();
  }, [loadMenus, loadMenuVersion]); // menus không còn nằm trong dependency array

  // 6. Effect lắng nghe các sự kiện refresh toàn hệ thống
  useEffect(() => {
    const handleRefresh = () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_VERSION_KEY);
      void loadMenus();
    };

    window.addEventListener("mappa:menu-refresh", handleRefresh);
    window.addEventListener("mappa:menu-updated", handleRefresh);

    return () => {
      window.removeEventListener("mappa:menu-refresh", handleRefresh);
      window.removeEventListener("mappa:menu-updated", handleRefresh);
    };
  }, [loadMenus]);

  return { menus, loading, error };
};