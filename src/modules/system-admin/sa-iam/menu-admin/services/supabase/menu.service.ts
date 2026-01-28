import { supabase } from "../../../../../../lib/supabase";
import { menuRepo } from "../../../menu/menu.repo";
import type {
  MenuHistoryRecord,
  MenuRecord,
  MenuPermissionRecord,
  ModuleRecord,
  PermissionFilter,
  PermissionRecord,
  PagedResult,
  RoleRecord,
} from "../../menu.types";

export interface MenuService {
  listMenus: (params?: { search?: string; moduleId?: string; moduleGroup?: string; status?: string }) => Promise<MenuRecord[]>;
  getMenuTree: (params?: { search?: string; moduleId?: string; status?: string }) => Promise<MenuRecord[]>;
  listModules: () => Promise<ModuleRecord[]>;
  listPermissions: (filters: PermissionFilter) => Promise<PagedResult<PermissionRecord>>;
  listPermissionsByIds: (ids: string[]) => Promise<PermissionRecord[]>;
  listMenuPermissions: (menuId: string) => Promise<MenuPermissionRecord[]>;
  saveMenuPermissions: (menuId: string, permissionIds: string[]) => Promise<void>;
  listRoles: () => Promise<RoleRecord[]>;
  listRolePermissions: (roleId: string) => Promise<string[]>;
  createMenu: (payload: Partial<MenuRecord>) => Promise<MenuRecord>;
  updateMenu: (menuId: string, payload: Partial<MenuRecord>) => Promise<MenuRecord>;
  deleteMenu: (menuId: string) => Promise<void>;
  moveMenu: (menuId: string, parentId: string | null, orderIndex: number) => Promise<void>;
  getMenuVersion: () => Promise<string | null>;
  listMenuHistory: (limit?: number) => Promise<MenuHistoryRecord[]>;
}

export const menuService: MenuService = {
  async listMenus(params) {
    return menuRepo.listMenus({
      search: params?.search,
      status: params?.status as any,
      moduleId: params?.moduleId,
      moduleGroup: params?.moduleGroup,
    });
  },
  async getMenuTree() {
    const tree = await menuRepo.getMenuTree();
    return tree;
  },
  async listModules() {
    const rows = await menuRepo.listModules();
    return rows.map((row) => ({
      _id: row._id,
      code: row.code,
      name: row.name,
      group: row.group ?? null,
    }));
  },
  async listPermissions(filters) {
    return menuRepo.listPermissions(filters);
  },
  async listPermissionsByIds(ids) {
    if (!ids.length) return [];
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .in("_id", ids);
    if (error) {
      throw new Error(`permissions select failed: ${error.message}`);
    }
    return (data ?? []).map((row: any) => ({
      _id: row._id ?? row.id,
      code: row.code ?? "",
      name: row.name ?? row.code ?? "",
      description: row.description ?? null,
      module_id: row.module_id ?? null,
      module: row.module ?? row.permission_type ?? null,
      resource: row.resource ?? null,
      action: row.action ?? null,
      category: row.category ?? null,
      status: row.status ?? null,
    }));
  },
  async listMenuPermissions(menuId: string) {
    const { data, error } = await supabase
      .from("menu_permissions")
      .select("*")
      .eq("menu_id", menuId);
    if (error) {
      throw new Error(`menu permissions select failed: ${error.message}`);
    }
    return (data ?? []).map((row: any) => ({
      _id: row._id ?? row.id,
      menu_id: row.menu_id,
      permission_id: row.permission_id,
      created_at: row.created_at ?? null,
    }));
  },
  async saveMenuPermissions(menuId, permissionIds) {
    await menuRepo.setMenuPermissions(menuId, permissionIds ?? []);
  },
  async listRoles() {
    const rows = await menuRepo.listRoles();
    return rows.map((row) => ({
      _id: row._id,
      code: row.code,
      name: row.name,
      status: row.status ?? null,
    }));
  },
  async listRolePermissions(roleId) {
    const { data, error } = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("role_id", roleId);
    if (error) {
      throw new Error(`role permissions select failed: ${error.message}`);
    }
    return (data ?? []).map((row: any) => row.permission_id).filter(Boolean);
  },
  async createMenu(payload) {
    return menuRepo.createMenu({
      code: payload.code ?? "",
      label: payload.label ?? "",
      parent_id: payload.parent_id ?? null,
      module_id: payload.module_id ?? null,
      route_path: payload.route_path ?? null,
      icon: payload.icon ?? null,
      sort_order: payload.sort_order ?? 0,
      status: payload.status ?? "ACTIVE",
      is_visible: payload.is_visible ?? true,
    });
  },
  async updateMenu(_menuId, payload) {
    return menuRepo.updateMenu(_menuId, {
      code: payload.code,
      label: payload.label,
      parent_id: payload.parent_id,
      module_id: payload.module_id,
      route_path: payload.route_path,
      icon: payload.icon,
      sort_order: payload.sort_order,
      status: payload.status,
      is_visible: payload.is_visible,
      meta: payload.meta ?? undefined,
    });
  },
  async deleteMenu() {
    await menuRepo.softDeleteMenu(arguments[0]);
  },
  async moveMenu() {
    await menuRepo.moveMenu({
      dragId: arguments[0],
      dropParentId: arguments[1],
      targetIndex: arguments[2],
    });
  },
  async getMenuVersion() {
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
  async listMenuHistory(limit = 20) {
    const { data, error } = await supabase
      .from("menus")
      .select("_id, code, name, updated_at, created_at")
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) {
      throw new Error(`menus history select failed: ${error.message}`);
    }
    return (data ?? []).map((row: any) => ({
      _id: row._id ?? row.id,
      code: row.code ?? "",
      name: row.name ?? "",
      updated_at: row.updated_at ?? null,
      created_at: row.created_at ?? null,
    }));
  },
};
