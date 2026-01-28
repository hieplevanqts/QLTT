import { supabase } from "../../../../lib/supabase";
import type {
  MenuListParams,
  MenuMoveParams,
  MenuPayload,
  MenuPermissionListParams,
  MenuPermissionListResult,
  MenuPermissionUpdateResult,
  MenuRecord,
} from "./menu.types";
import { buildMenuTree, sortMenuNodes } from "./menu.utils";

type ModuleRow = {
  _id?: string | null;
  id?: string | null;
  key?: string | null;
  code?: string | null;
  name?: string | null;
  group?: string | null;
  sort_order?: number | null;
  order_index?: number | null;
  status?: number | string | null;
};

type PermissionRow = {
  _id?: string | null;
  id?: string | null;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  module_id?: string | null;
  module?: string | null;
  permission_type?: string | null;
  resource?: string | null;
  action?: string | null;
  status?: number | string | null;
};

type RoleRow = {
  _id?: string | null;
  id?: string | null;
  code?: string | null;
  name?: string | null;
  status?: number | string | null;
  is_system?: boolean | null;
};

const safeArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

const normalizeRoute = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const mapMenuRow = (row: any): MenuRecord => {
  const isActive =
    row.is_active !== undefined
      ? Boolean(row.is_active)
      : row.status !== undefined
        ? row.status
        : "ACTIVE";

  return {
    _id: row._id ?? row.id,
    code: row.code ?? "",
    label: row.label ?? row.name ?? "",
    parent_id: row.parent_id ?? null,
    module_id: row.module_id ?? null,
    route_path: row.route_path ?? row.path ?? null,
    icon: row.icon ?? null,
    sort_order: Number(row.sort_order ?? row.order_index ?? row.order ?? 0),
    status: row.status ?? isActive,
    is_visible: row.is_visible ?? row.is_active ?? true,
    meta: row.meta ?? null,
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
    deleted_at: row.deleted_at ?? null,
    module_code: row.module_code ?? null,
    module_name: row.module_name ?? null,
    module_group: row.module_group ?? null,
    permission_ids: safeArray<string>(row.permission_ids),
    permission_codes: safeArray<string>(row.permission_codes),
  };
};

const mapModuleRow = (row: ModuleRow) => ({
  _id: row._id ?? row.id ?? "",
  key: row.key ?? row.code ?? "",
  code: row.code ?? row.key ?? "",
  name: row.name ?? row.code ?? row.key ?? "",
  group: row.group ?? null,
  sort_order: row.sort_order ?? row.order_index ?? 0,
  status: row.status ?? null,
});

const mapPermissionRow = (row: PermissionRow) => ({
  _id: row._id ?? row.id ?? "",
  code: row.code ?? "",
  name: row.name ?? row.code ?? "",
  description: row.description ?? null,
  module_id: row.module_id ?? null,
  module: row.module ?? row.permission_type ?? null,
  permission_type: row.permission_type ?? null,
  category: row.category ?? null,
  resource: row.resource ?? null,
  action: row.action ?? null,
  status: row.status ?? null,
});

let modulesCache: ReturnType<typeof mapModuleRow>[] | null = null;
let permissionsCache: ReturnType<typeof mapPermissionRow>[] | null = null;

const isMissingRelationError = (message: string) =>
  message.includes("Could not find the table") ||
  message.includes("does not exist") ||
  message.includes("schema cache");

const listMenusViaView = async (): Promise<MenuRecord[] | null> => {
  const runQuery = async (orderField?: string | null, labelField?: string | null) => {
    let query = supabase.from("v_menus_full").select("*");
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

  return safeArray<any>(response.data).map(mapMenuRow);
};

const listMenusFallback = async (): Promise<MenuRecord[]> => {
  const runQuery = async (withDeletedFilter: boolean, orderField?: string | null, labelField?: string | null) => {
    let query = supabase.from("menus").select("*");
    if (orderField) {
      query = query.order(orderField, { ascending: true });
    }
    if (labelField) {
      query = query.order(labelField, { ascending: true });
    }
    if (withDeletedFilter) {
      query = query.is("deleted_at", null);
    }
    return query;
  };

  const attempts: Array<[boolean, string | null, string | null]> = [
    [true, "sort_order", "label"],
    [false, "sort_order", "label"],
    [true, "order_index", "name"],
    [false, "order_index", "name"],
    [true, null, null],
    [false, null, null],
  ];

  let menuRows: any[] = [];
  let lastError: string | null = null;
  for (const [withDeleted, orderField, labelField] of attempts) {
    const { data, error } = await runQuery(withDeleted, orderField, labelField);
    if (!error) {
      menuRows = safeArray<any>(data);
      lastError = null;
      break;
    }

    lastError = error.message;
    if (!error.message.includes("column") && !error.message.includes("does not exist")) {
      break;
    }
  }

  if (lastError) {
    throw new Error(`menus select failed: ${lastError}`);
  }

  if (menuRows.length === 0) return [];

  const menuIds = menuRows.map((row: any) => row._id ?? row.id).filter(Boolean);

  const { data: mappings, error: mappingError } = await supabase
    .from("menu_permissions")
    .select("menu_id, permission_id")
    .in("menu_id", menuIds);

  if (mappingError) {
    throw new Error(`menu permissions select failed: ${mappingError.message}`);
  }

  const permissionIds = safeArray<any>(mappings).map((m) => m.permission_id).filter(Boolean);

  let permissionsById = new Map<string, ReturnType<typeof mapPermissionRow>>();
  if (permissionIds.length > 0) {
    const { data: permissions, error: permissionsError } = await supabase
      .from("permissions")
      .select("*")
      .in("_id", permissionIds);
    if (permissionsError) {
      throw new Error(`permissions select failed: ${permissionsError.message}`);
    }
    permissionsById = new Map(
      safeArray<PermissionRow>(permissions).map((row) => {
        const mapped = mapPermissionRow(row);
        return [mapped._id, mapped] as const;
      }),
    );
  }

  const modules = await menuRepo.listModules();
  const modulesById = new Map(modules.map((mod) => [mod._id, mod] as const));

  const permsByMenu = new Map<string, string[]>();
  const permCodesByMenu = new Map<string, string[]>();
  safeArray<any>(mappings).forEach((row) => {
    const menuId = row.menu_id;
    const permId = row.permission_id;
    if (!menuId || !permId) return;
    const perms = permsByMenu.get(menuId) ?? [];
    if (!perms.includes(permId)) perms.push(permId);
    permsByMenu.set(menuId, perms);

    const perm = permissionsById.get(permId);
    if (perm?.code) {
      const codes = permCodesByMenu.get(menuId) ?? [];
      if (!codes.includes(perm.code)) codes.push(perm.code);
      permCodesByMenu.set(menuId, codes);
    }
  });

  return menuRows.map((row: any) => {
    const menuId = row._id ?? row.id;
    const module = modulesById.get(row.module_id ?? "");
    return mapMenuRow({
      ...row,
      module_code: module?.code ?? null,
      module_name: module?.name ?? null,
      module_group: module?.group ?? null,
      permission_ids: permsByMenu.get(menuId) ?? [],
      permission_codes: permCodesByMenu.get(menuId) ?? [],
    });
  });
};

const applyFilters = (items: MenuRecord[], params: MenuListParams) => {
  const search = params.search?.trim().toLowerCase();
  const status = params.status ?? "all";
  const moduleGroup = params.moduleGroup?.trim();
  const moduleId = params.moduleId?.trim();

  return items.filter((item) => {
    if (search) {
      const haystack = `${item.code} ${item.label} ${item.route_path ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (status !== "all") {
      const isActive = String(item.status) === "ACTIVE" || String(item.status) === "1";
      if (status === "active" && !isActive) return false;
      if (status === "inactive" && isActive) return false;
    }

    if (moduleGroup && item.module_group !== moduleGroup) return false;
    if (moduleId && item.module_id !== moduleId) return false;

    return true;
  });
};

export const menuRepo = {
  async listMenus(params: MenuListParams = {}): Promise<MenuRecord[]> {
    const viaView = await listMenusViaView();
    const items = viaView ?? (await listMenusFallback());
    return applyFilters(items, params);
  },

  async getMenuTree(params: MenuListParams = {}) {
    const items = await menuRepo.listMenus(params);
    return buildMenuTree(items);
  },

  async createMenu(payload: MenuPayload): Promise<MenuRecord> {
    const normalizedRoute = normalizeRoute(payload.route_path ?? null);
    const legacyPayload = {
      code: payload.code?.trim(),
      name: payload.label?.trim(),
      path: normalizedRoute,
      icon: payload.icon ?? null,
      parent_id: payload.parent_id ?? null,
      module_id: payload.module_id ?? null,
      order_index: payload.sort_order ?? 0,
      is_active:
        payload.is_visible === false
          ? false
          : payload.status === "INACTIVE" || payload.status === 0
            ? false
            : true,
    };

    const modernPayload = {
      code: payload.code?.trim(),
      label: payload.label?.trim(),
      parent_id: payload.parent_id ?? null,
      module_id: payload.module_id ?? null,
      route_path: normalizedRoute,
      icon: payload.icon ?? null,
      sort_order: payload.sort_order ?? 0,
      status: payload.status ?? "ACTIVE",
      is_visible: payload.is_visible ?? true,
      meta: payload.meta ?? {},
    };

    const attemptInsert = async (data: Record<string, unknown>) =>
      supabase.from("menus").insert([data]).select("*").single();

    let response = await attemptInsert(legacyPayload);
    if (response.error && response.error.message.includes("column")) {
      response = await attemptInsert(modernPayload);
    }

    if (response.error) {
      throw new Error(`menu insert failed: ${response.error.message}`);
    }

    return mapMenuRow(response.data);
  },

  async updateMenu(menuId: string, payload: Partial<MenuPayload>): Promise<MenuRecord> {
    const normalizedRoute = payload.route_path !== undefined ? normalizeRoute(payload.route_path) : undefined;

    const legacyPayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (payload.code !== undefined) legacyPayload.code = payload.code?.trim();
    if (payload.label !== undefined) legacyPayload.name = payload.label?.trim();
    if (payload.parent_id !== undefined) legacyPayload.parent_id = payload.parent_id ?? null;
    if (payload.module_id !== undefined) legacyPayload.module_id = payload.module_id ?? null;
    if (normalizedRoute !== undefined) legacyPayload.path = normalizedRoute;
    if (payload.icon !== undefined) legacyPayload.icon = payload.icon ?? null;
    if (payload.sort_order !== undefined) legacyPayload.order_index = payload.sort_order ?? 0;
    if (payload.status !== undefined || payload.is_visible !== undefined) {
      legacyPayload.is_active =
        payload.is_visible === false
          ? false
          : payload.status === "INACTIVE" || payload.status === 0
            ? false
            : true;
    }

    const modernPayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (payload.code !== undefined) modernPayload.code = payload.code?.trim();
    if (payload.label !== undefined) modernPayload.label = payload.label?.trim();
    if (payload.parent_id !== undefined) modernPayload.parent_id = payload.parent_id ?? null;
    if (payload.module_id !== undefined) modernPayload.module_id = payload.module_id ?? null;
    if (normalizedRoute !== undefined) modernPayload.route_path = normalizedRoute;
    if (payload.icon !== undefined) modernPayload.icon = payload.icon ?? null;
    if (payload.sort_order !== undefined) modernPayload.sort_order = payload.sort_order ?? 0;
    if (payload.status !== undefined) modernPayload.status = payload.status;
    if (payload.is_visible !== undefined) modernPayload.is_visible = payload.is_visible ?? true;
    if (payload.meta !== undefined) modernPayload.meta = payload.meta ?? {};

    const attemptUpdate = async (data: Record<string, unknown>) =>
      supabase.from("menus").update(data).eq("_id", menuId).select("*").single();

    let response = await attemptUpdate(legacyPayload);
    if (response.error && response.error.message.includes("column")) {
      response = await attemptUpdate(modernPayload);
    }

    if (response.error) {
      throw new Error(`menu update failed: ${response.error.message}`);
    }

    return mapMenuRow(response.data);
  },

  async softDeleteMenu(menuId: string): Promise<void> {
    const attempt = async (payload: Record<string, unknown>) =>
      supabase.from("menus").update(payload).eq("_id", menuId);

    let response = await attempt({ deleted_at: new Date().toISOString(), status: "INACTIVE" });
    if (response.error && response.error.message.includes("deleted_at")) {
      response = await attempt({ is_active: false });
    }
    if (response.error) {
      throw new Error(`menu delete failed: ${response.error.message}`);
    }
  },

  async moveMenu(params: MenuMoveParams): Promise<void> {
    const trySelect = async (withDeletedFilter: boolean, fields: string) => {
      let query = supabase.from("menus").select(fields);
      if (withDeletedFilter) {
        query = query.is("deleted_at", null);
      }
      return query;
    };

    let selectResponse = await trySelect(true, "_id, parent_id, sort_order, label");
    if (selectResponse.error && selectResponse.error.message.includes("column")) {
      selectResponse = await trySelect(false, "_id, parent_id, order_index, name");
    }
    if (selectResponse.error) {
      throw new Error(`menus select failed: ${selectResponse.error.message}`);
    }

    const rows = safeArray<any>(selectResponse.data).map((row) => ({
      ...row,
      sort_order: row.sort_order ?? row.order_index ?? 0,
      label: row.label ?? row.name ?? "",
    }));
    const dragRow = rows.find((row) => (row._id ?? row.id) === params.dragId);
    if (!dragRow) return;

    const oldParentId = dragRow.parent_id ?? null;
    const newParentId = params.dropParentId ?? null;

    const reorder = (parentId: string | null, includeDrag: boolean, targetIndex = 0) => {
      const siblings = rows
        .filter((row) => (row.parent_id ?? null) === parentId)
        .filter((row) => includeDrag || (row._id ?? row.id) !== params.dragId)
        .sort(sortMenuNodes);

      if (includeDrag) {
        const dragNode = siblings.find((row) => (row._id ?? row.id) === params.dragId) ?? dragRow;
        const withoutDrag = siblings.filter((row) => (row._id ?? row.id) !== params.dragId);
        const index = Math.max(0, Math.min(targetIndex, withoutDrag.length));
        withoutDrag.splice(index, 0, { ...dragNode, parent_id: parentId });
        return withoutDrag.map((row, idx) => ({
          _id: row._id ?? row.id,
          parent_id: parentId,
          sort_order: (idx + 1) * 10,
        }));
      }

      return siblings.map((row, idx) => ({
        _id: row._id ?? row.id,
        parent_id: parentId,
        sort_order: (idx + 1) * 10,
      }));
    };

    const updates: Array<{ _id: string; parent_id: string | null; sort_order: number }> = [];

    if (oldParentId !== newParentId) {
      updates.push(...reorder(oldParentId, false));
    }
    updates.push(...reorder(newParentId, true, params.targetIndex));

    const deduped = new Map<string, { _id: string; parent_id: string | null; sort_order: number }>();
    updates.forEach((row) => deduped.set(row._id, row));

    const payload = Array.from(deduped.values());
    if (payload.length === 0) return;

    let upsertResponse = await supabase
      .from("menus")
      .upsert(payload, { onConflict: "_id" });

    if (upsertResponse.error && upsertResponse.error.message.includes("sort_order")) {
      const legacyPayload = payload.map((row) => ({
        _id: row._id,
        parent_id: row.parent_id,
        order_index: row.sort_order,
      }));
      upsertResponse = await supabase.from("menus").upsert(legacyPayload, { onConflict: "_id" });
    }

    if (upsertResponse.error) {
      throw new Error(`menu move failed: ${upsertResponse.error.message}`);
    }
  },

  async setMenuPermissions(menuId: string, permissionIds: string[]): Promise<MenuPermissionUpdateResult> {
    const { data: existingRows, error: existingError } = await supabase
      .from("menu_permissions")
      .select("permission_id")
      .eq("menu_id", menuId);

    if (existingError) {
      throw new Error(`menu permissions select failed: ${existingError.message}`);
    }

    const existingIds = new Set(safeArray<any>(existingRows).map((row) => row.permission_id));
    const targetIds = new Set(permissionIds.filter(Boolean));

    const toAdd = Array.from(targetIds).filter((id) => !existingIds.has(id));
    const toRemove = Array.from(existingIds).filter((id) => !targetIds.has(id));

    if (toAdd.length > 0) {
      const insertPayload = toAdd.map((permission_id) => ({
        menu_id: menuId,
        permission_id,
      }));
      const { error: insertError } = await supabase
        .from("menu_permissions")
        .upsert(insertPayload, { onConflict: "menu_id,permission_id" });
      if (insertError) {
        throw new Error(`menu permissions insert failed: ${insertError.message}`);
      }
    }

    if (toRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from("menu_permissions")
        .delete()
        .eq("menu_id", menuId)
        .in("permission_id", toRemove);
      if (deleteError) {
        throw new Error(`menu permissions delete failed: ${deleteError.message}`);
      }
    }

    return { added: toAdd.length, removed: toRemove.length };
  },

  async listModules(force = false) {
    if (modulesCache && !force) return modulesCache;
    const loadModules = async (withDeletedFilter: boolean, withOrdering: boolean) => {
      let query = supabase
        .from("modules")
        .select("*");
      if (withOrdering) {
        query = query
          .order("sort_order", { ascending: true })
          .order("order_index", { ascending: true })
          .order("name", { ascending: true });
      }
      if (withDeletedFilter) {
        query = query.is("deleted_at", null);
      }
      return query;
    };

    let rows: ModuleRow[] = [];
    const { data, error } = await loadModules(true, true);
    if (error) {
      const needsNoDeletedAt = error.message.includes("deleted_at");
      const needsNoOrdering =
        error.message.includes("sort_order") || error.message.includes("order_index");
      const fallback = await loadModules(!needsNoDeletedAt, !needsNoOrdering);
      if (fallback.error) {
        throw new Error(`modules select failed: ${fallback.error.message}`);
      }
      rows = safeArray<ModuleRow>(fallback.data);
    } else {
      rows = safeArray<ModuleRow>(data);
    }

    modulesCache = rows.map(mapModuleRow);
    return modulesCache;
  },

  async listPermissions(params: MenuPermissionListParams = {}): Promise<MenuPermissionListResult> {
    const pageSize = params.pageSize ?? 20;
    const page = params.page ?? 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const search = params.search?.trim();
    const moduleId = params.moduleId ?? null;
    const action = params.action?.trim();
    const category = params.category?.trim();
    const resource = params.resource?.trim();
    const status = params.status ?? "active";
    const sortBy = params.sortBy ?? "code";
    const sortDir = params.sortDir ?? "asc";

    let query = supabase.from("permissions").select("*", { count: "exact" });

    if (moduleId) {
      query = query.or(`module_id.eq.${moduleId},module_id.is.null`);
    }
    if (category) {
      query = query.ilike("category", category);
    }
    if (action) {
      const upperAction = action.trim().toUpperCase();
      const lowerAction = action.trim().toLowerCase();
      query = query.or(
        `action.eq.${upperAction},action.ilike.%${upperAction}%,action.ilike.%${lowerAction}%,code.ilike.%${lowerAction}%`,
      );
    }
    if (resource) {
      query = query.ilike("resource", `%${resource}%`);
    }
    if (status !== "all") {
      const statusValue = status === "active" ? 1 : 0;
      query = query.eq("status", statusValue);
    }
    if (search) {
      const escaped = search.replace(/,/g, "\\,");
      query = query.or(
        `code.ilike.%${escaped}%,name.ilike.%${escaped}%,description.ilike.%${escaped}%`,
      );
    }

    query = query
      .order(sortBy, { ascending: sortDir === "asc" })
      .order("code", { ascending: true })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) {
      throw new Error(`permissions select failed: ${error.message}`);
    }

    return {
      data: safeArray<PermissionRow>(data).map(mapPermissionRow),
      total: count ?? 0,
    };
  },

  async listRoles() {
    const loadRoles = async (withDeletedFilter: boolean, withOrdering: boolean) => {
      let query = supabase
        .from("roles")
        .select("*");
      if (withOrdering) {
        query = query.order("sort_order", { ascending: true }).order("code", { ascending: true });
      }
      if (withDeletedFilter) {
        query = query.is("deleted_at", null);
      }
      return query;
    };

    const { data, error } = await loadRoles(true, true);
    let rows: RoleRow[] = [];
    if (error) {
      const needsNoDeletedAt = error.message.includes("deleted_at");
      const needsNoOrdering = error.message.includes("sort_order");
      const fallback = await loadRoles(!needsNoDeletedAt, !needsNoOrdering);
      if (fallback.error) {
        throw new Error(`roles select failed: ${fallback.error.message}`);
      }
      rows = safeArray<RoleRow>(fallback.data);
    } else {
      rows = safeArray<RoleRow>(data);
    }

    return rows.map((row) => ({
      _id: row._id ?? row.id ?? "",
      code: row.code ?? "",
      name: row.name ?? row.code ?? "",
      status: row.status ?? null,
      is_system: row.is_system ?? null,
    }));
  },

  async listRolePermissionCodes(roleId: string) {
    const { data: rolePerms, error: rolePermError } = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("role_id", roleId);

    if (rolePermError) {
      throw new Error(`role permissions select failed: ${rolePermError.message}`);
    }

    const permissionIds = safeArray<any>(rolePerms).map((row) => row.permission_id).filter(Boolean);
    if (permissionIds.length === 0) return [];

    const { data: permissions, error: permError } = await supabase
      .from("permissions")
      .select("_id, code")
      .in("_id", permissionIds);

    if (permError) {
      throw new Error(`permissions select failed: ${permError.message}`);
    }

    return safeArray<any>(permissions).map((row) => row.code).filter(Boolean);
  },
};
