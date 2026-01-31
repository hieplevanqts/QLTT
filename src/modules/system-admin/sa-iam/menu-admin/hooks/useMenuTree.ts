import * as React from "react";
import type { MenuNode, MenuRecord, ModuleRecord } from "../menu.types";
import { menuService } from "../services/supabase/menu.service";
import { buildMenuTree } from "../../menu/menu.utils";

export interface UseMenuTreeState {
  flatMenus: MenuRecord[];
  treeMenus: MenuNode[];
  modules: ModuleRecord[];
  loading: boolean;
  selectedMenuId?: string;
  setSelectedMenuId: (menuId?: string) => void;
  refreshMenus: (params?: {
    search?: string;
    moduleId?: string;
    moduleGroup?: string;
    status?: string;
  }) => Promise<void>;
}

export const useMenuTree = (): UseMenuTreeState => {
  const [flatMenus, setFlatMenus] = React.useState<MenuRecord[]>([]);
  const [treeMenus, setTreeMenus] = React.useState<MenuNode[]>([]);
  const [modules, setModules] = React.useState<ModuleRecord[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedMenuId, setSelectedMenuId] = React.useState<string | undefined>(undefined);

  const refreshMenus = React.useCallback(
    async (params?: { search?: string; moduleId?: string; moduleGroup?: string; status?: string }) => {
      setLoading(true);
      try {
        const [menuRows, moduleRows] = await Promise.all([
          menuService.listMenusAdmin({
            search: params?.search,
            moduleId: params?.moduleId,
            moduleGroup: params?.moduleGroup,
            status: params?.status,
          }),
          menuService.getModules(),
        ]);
        setFlatMenus(menuRows);
        setModules(moduleRows);
        setTreeMenus(buildMenuTree(menuRows));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    void refreshMenus();
  }, [refreshMenus]);

  return {
    flatMenus,
    treeMenus,
    modules,
    loading,
    selectedMenuId,
    setSelectedMenuId,
    refreshMenus,
  };
};
