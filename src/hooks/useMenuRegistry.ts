import { useEffect, useState } from "react";

import { moduleAdminService } from "../modules/system-admin/services/moduleAdminService";
import { MenuItem } from "../modules/system-admin/types";

const STORAGE_KEY = "mappa.menu.registry";

export const useMenuRegistry = () => {
  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setMenus(JSON.parse(cached));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const loadMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await moduleAdminService.getMenus();
        setMenus(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load menus.");
      } finally {
        setLoading(false);
      }
    };

    void loadMenus();
  }, []);

  return { menus, loading, error };
};
