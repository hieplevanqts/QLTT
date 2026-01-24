import { useEffect, useState } from "react";

import { moduleAdminService } from "../modules/system-admin/services/moduleAdminService";
import type { MenuItem } from "../modules/system-admin/types";

const STORAGE_KEY = "mappa.menu.registry";

const ADMIN_MENU_SEED: Array<Omit<MenuItem, "parentId">> = [
  { id: "admin-dashboard", label: "Dashboard Quản trị", path: "/system-admin", order: 10, moduleId: "system-admin", icon: "LayoutDashboard" },
  { id: "admin-org-units", label: "Đơn vị tổ chức", path: "/system-admin/master-data/org-units", order: 21, moduleId: "system-admin-master-data", icon: "Building2" },
  { id: "admin-departments", label: "Phòng ban", path: "/system-admin/master-data/departments", order: 22, moduleId: "system-admin-master-data", icon: "Users" },
  { id: "admin-jurisdictions", label: "Địa bàn quản lý", path: "/system-admin/master-data/jurisdictions", order: 23, moduleId: "system-admin-master-data", icon: "MapPin" },
  { id: "admin-catalogs-common", label: "Danh mục dùng chung", path: "/system-admin/master-data/catalogs?group=COMMON", order: 24, moduleId: "system-admin-master-data", icon: "Folder" },
  { id: "admin-catalogs-domain", label: "Danh mục nghiệp vụ QLTT", path: "/system-admin/master-data/catalogs?group=DOMAIN", order: 25, moduleId: "system-admin-master-data", icon: "Layers" },
  { id: "admin-catalogs-system", label: "Danh mục kỹ thuật", path: "/system-admin/master-data/catalogs?group=SYSTEM", order: 26, moduleId: "system-admin-master-data", icon: "GitBranch" },
  { id: "admin-users", label: "Người dùng", path: "/system-admin/iam/users", order: 31, moduleId: "system-admin-iam", icon: "Users" },
  { id: "admin-roles", label: "Vai trò", path: "/system-admin/iam/roles", order: 32, moduleId: "system-admin-iam", icon: "Shield" },
  { id: "admin-permissions", label: "Permissions", path: "/system-admin/iam/permissions", order: 33, moduleId: "system-admin-iam", icon: "KeyRound" },
  { id: "admin-assignments", label: "Phân quyền", path: "/system-admin/iam/assignments", order: 34, moduleId: "system-admin-iam", icon: "UserCheck" },
  { id: "admin-modules", label: "Phân hệ", path: "/system-admin/iam/modules", order: 35, moduleId: "system-admin-iam", icon: "Boxes" },
  { id: "admin-menus", label: "Menu", path: "/system-admin/iam/menus", order: 36, moduleId: "system-admin-iam", icon: "Menu" },
  { id: "admin-parameters", label: "Thông số hệ thống", path: "/system-admin/system-config/parameters", order: 41, moduleId: "system-admin-config", icon: "Sliders" },
  { id: "admin-organization-info", label: "Thông tin tổ chức", path: "/system-admin/system-config/organization-info", order: 42, moduleId: "system-admin-config", icon: "Landmark" },
  { id: "admin-operations", label: "Cài đặt vận hành", path: "/system-admin/system-config/operations", order: 43, moduleId: "system-admin-config", icon: "Settings" },
  { id: "admin-notifications", label: "Mẫu thông báo", path: "/system-admin/system-config/notifications", order: 44, moduleId: "system-admin-config", icon: "Bell" },
  { id: "admin-security", label: "Cài đặt bảo mật", path: "/system-admin/system-config/security", order: 45, moduleId: "system-admin-config", icon: "ShieldCheck" },
  { id: "admin-db-logs", label: "Database Logs", path: "/system-admin/system-config/database/logs", order: 46, moduleId: "system-admin-config", icon: "FileBox" },
  { id: "admin-db-backups", label: "Database Backups", path: "/system-admin/system-config/database/backups", order: 47, moduleId: "system-admin-config", icon: "HardDrive" },
  { id: "admin-module-registry", label: "Quản trị Module", path: "/system/modules", order: 90, moduleId: "system-admin" },
  { id: "admin-menu-registry", label: "Quản trị Menu", path: "/system/menus", order: 91, moduleId: "system-admin" },
  { id: "admin-users-legacy", label: "Người dùng (cũ)", path: "/system/users", order: 92, moduleId: "system-admin" },
  { id: "admin-roles-legacy", label: "Vai trò (cũ)", path: "/system/roles", order: 93, moduleId: "system-admin" },
  { id: "admin-settings-legacy", label: "Cấu hình hệ thống", path: "/system/settings", order: 94, moduleId: "system-admin" },
];

const ensureAdminMenus = (items: MenuItem[]) => {
  const merged = items
    .map(item => ({ ...item }))
    .filter(item => item.path !== "/system-admin/master-data/catalogs");
  const byPath = new Map(merged.filter(item => item.path).map(item => [item.path as string, item]));
  const byId = new Map(merged.map(item => [item.id, item]));
  const seedByPath = new Map(
    ADMIN_MENU_SEED.filter(item => item.path).map(item => [item.path as string, item]),
  );

  let admin = merged.find(item => item.path === "/admin") ?? merged.find(item => item.label === "Quản trị");
  if (!admin) {
    admin = { id: "admin", label: "Quản trị", path: "/admin", order: 0, isEnabled: true, icon: "Settings" };
    merged.push(admin);
    byId.set(admin.id, admin);
    byPath.set(admin.path as string, admin);
  } else {
    admin.icon = admin.icon ?? "Settings";
    admin.isEnabled = admin.isEnabled ?? true;
  }

  merged.forEach((item, index) => {
    if (!item.path) return;
    const seed = seedByPath.get(item.path);
    if (!seed) return;
    merged[index] = {
      ...item,
      icon: item.icon ?? seed.icon,
      moduleId: item.moduleId ?? seed.moduleId,
      order: item.order ?? seed.order,
      parentId: admin!.id,
      isEnabled: item.isEnabled ?? true,
    };
  });

  ADMIN_MENU_SEED.forEach((seed) => {
    if (seed.path && byPath.has(seed.path)) return;
    merged.push({ ...seed, parentId: admin!.id, order: seed.order, isEnabled: true });
  });

  return merged;
};

export const useMenuRegistry = () => {
  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as MenuItem[];
        const seeded = ensureAdminMenus(parsed);
        setMenus(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    const loadMenus = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await moduleAdminService.getMenus();
        const seeded = ensureAdminMenus(data);
        setMenus(seeded);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
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
