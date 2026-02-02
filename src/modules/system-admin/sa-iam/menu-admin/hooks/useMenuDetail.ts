import * as React from "react";
import type { MenuPermissionRecord, MenuRecord, PermissionRecord } from "../menu.types";
import { menuService } from "../services/supabase/menu.service";

export interface UseMenuDetailState {
  menu?: MenuRecord;
  setMenu: (menu?: MenuRecord) => void;
  permissions: MenuPermissionRecord[];
  assignedPermissions: PermissionRecord[];
  setPermissions: (rows: MenuPermissionRecord[]) => void;
  saving: boolean;
  saveMenu: (payload: Partial<MenuRecord>) => Promise<void>;
  savePermissions: (permissionIds: string[]) => Promise<void>;
}

export const useMenuDetail = (menuId?: string): UseMenuDetailState => {
  const [menu, setMenu] = React.useState<MenuRecord | undefined>(undefined);
  const [permissions, setPermissions] = React.useState<MenuPermissionRecord[]>([]);
  const [assignedPermissions, setAssignedPermissions] = React.useState<PermissionRecord[]>([]);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!menuId) {
      setPermissions([]);
      setAssignedPermissions([]);
      return;
    }

    void (async () => {
      const rows = await menuService.listMenuPermissions(menuId);
      setPermissions(rows);
      try {
        const detailed = await menuService.listAssignedPermissions(menuId);
        setAssignedPermissions(detailed);
      } catch {
        const ids = rows.map((row) => row.permission_id).filter(Boolean);
        const detailed = await menuService.listPermissionsByIds(ids);
        setAssignedPermissions(detailed);
      }
    })();
  }, [menuId]);

  const saveMenu = React.useCallback(
    async (payload: Partial<MenuRecord>) => {
      if (!menuId) return;
      setSaving(true);
      try {
        const updated = await menuService.updateMenu(menuId, payload);
        setMenu(updated);
      } catch (err) {
        console.error("[menus] update failed", { menuId, payload, err });
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [menuId],
  );

  const savePermissions = React.useCallback(
    async (permissionIds: string[]) => {
      if (!menuId) return;
      setSaving(true);
      try {
        await menuService.saveMenuPermissions(menuId, permissionIds);
        const rows = await menuService.listMenuPermissions(menuId);
        setPermissions(rows);
        try {
          const detailed = await menuService.listAssignedPermissions(menuId);
          setAssignedPermissions(detailed);
        } catch {
          const ids = rows.map((row) => row.permission_id).filter(Boolean);
          const detailed = await menuService.listPermissionsByIds(ids);
          setAssignedPermissions(detailed);
        }
      } finally {
        setSaving(false);
      }
    },
    [menuId],
  );

  return {
    menu,
    setMenu,
    permissions,
    assignedPermissions,
    setPermissions,
    saving,
    saveMenu,
    savePermissions,
  };
};
