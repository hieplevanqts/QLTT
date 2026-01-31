import { supabase } from '@/api/supabaseClient';
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
  category?: string | null;
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

const normalizePath = (value: string | null | undefined) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
};

const mapMenuRow = (row: any): MenuRecord => {
  const isActive =
    row.is_active !== undefined
      ? Boolean(row.is_active)
      : row.is_visible !== undefined
        ? Boolean(row.is_visible)
        : row.status !== undefined
          ? Boolean(row.status === 1 || String(row.status).toLowerCase() === "active")
          : true;

  return {
    _id: row._id ?? "",
    code: row.code ?? "",
    name: row.name ?? row.label ?? "",
    parent_id: row.parent_id ?? null,
    module_id: row.module_id ?? null,
    path: row.path ?? row.route_path ?? null,
    icon: row.icon ?? null,
    order_index: Number(row.order_index ?? row.sort_order ?? row.order ?? 0),
    is_active: isActive,
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
  _id: row._id ?? "",
  key: row.key ?? row.code ?? "",
  code: row.code ?? row.key ?? "",
  name: row.name ?? row.code ?? row.key ?? "",
  group: row.group ?? null,
  sort_order: row.sort_order ?? row.order_index ?? 0,
  status: row.status ?? null,
});

const mapPermissionRow = (row: PermissionRow) => ({
  _id: row._id ?? "",
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

const isMissingRelationError = (message: string) =>
  message.includes("Could not find the table") ||
  message.includes("does not exist") ||
  message.includes("schema cache");

const MENU_VIEW_FIELDS =
  "_id, code, name, path, icon, parent_id, module_id, order_index, is_active, updated_at, module_code, module_name, module_group, permission_ids, permission_codes";
const MENU_TABLE_FIELDS =
  "_id, code, name, path, icon, parent_id, module_id, order_index, is_active, updated_at";

type MenuQueryMeta = {
  source: string;
  select: string;
  filters: Record<string, unknown>;
  order: string[];
};

const logMenuQueryError = (meta: MenuQueryMeta, error: any) => {
  console.log("[menus] query error", meta.source);
  console.log(error);
  console.log("message", error?.message);
  console.log("details", error?.details);
  console.log("hint", error?.hint);
  console.log("code", error?.code);
  console.log("query", {
    select: meta.select,
    filters: meta.filters,
    order: meta.order,
  });
};

const logMenuMutationError = (action: string, payload: Record<string, unknown>, error: any) => {
  console.log(`[menus] ${action} error`);
  console.log(error);
  console.log("message", error?.message);
  console.log("details", error?.details);
  console.log("hint", error?.hint);
  console.log("code", error?.code);
  console.log("payload", payload);
};

const applyMenuFilters = <T>(
  query: T,
  params: MenuListParams,
  meta: MenuQueryMeta,
  options?: { allowModuleGroup?: boolean },
) => {
  const search = params.search?.trim();
  const status = params.status ?? "all";
  const moduleGroup = params.moduleGroup?.trim();
  const moduleId = params.moduleId?.trim();

  const filters: Record<string, unknown> = {};

  if (search) {
    const escaped = search.replace(/,/g, "\\,");
    filters.search = search;
    // @ts-expect-error supabase query builder typing
    query = query.or(`code.ilike.%${escaped}%,name.ilike.%${escaped}%,path.ilike.%${escaped}%`);
  }

  if (status !== "all") {
    const isActive = status === "active";
    filters.is_active = isActive;
    // @ts-expect-error supabase query builder typing
    query = query.eq("is_active", isActive);
  }

  if (moduleId) {
    filters.module_id = moduleId;
    // @ts-expect-error supabase query builder typing
    query = query.eq("module_id", moduleId);
  }

  if (moduleGroup && options?.allowModuleGroup) {
    filters.module_group = moduleGroup;
    // @ts-expect-error supabase query builder typing
    query = query.eq("module_group", moduleGroup);
  }

  meta.filters = filters;
  return query;
};

const applyMenuOrdering = <T>(query: T, meta: MenuQueryMeta) => {
  meta.order = ["parent_id.asc.nullsfirst", "order_index.asc", "name.asc"];
  // @ts-expect-error supabase query builder typing
  query = query.order("parent_id", { ascending: true, nullsFirst: true });
  // @ts-expect-error supabase query builder typing
  query = query.order("order_index", { ascending: true });
  // @ts-expect-error supabase query builder typing
  query = query.order("name", { ascending: true });
  return query;
};

const listMenusViaView = async (params: MenuListParams): Promise<MenuRecord[] | null> => {
  const meta: MenuQueryMeta = {
    source: "v_menus_full",
    select: MENU_VIEW_FIELDS,
    filters: {},
    order: [],
  };

  let query = supabase.from("v_menus_full").select(MENU_VIEW_FIELDS);
  query = applyMenuFilters(query, params, meta, { allowModuleGroup: true });
  query = applyMenuOrdering(query, meta);

  const { data, error } = await query;
  if (error) {
    if (isMissingRelationError(error.message)) {
      return null;
    }
    logMenuQueryError(meta, error);
    throw new Error(`menus select failed: ${error.message}`);
  }

  return safeArray<any>(data).map(mapMenuRow);
};

const listMenusFallback = async (params: MenuListParams): Promise<MenuRecord[]> => {
  const meta: MenuQueryMeta = {
    source: "menus",
    select: MENU_TABLE_FIELDS,
    filters: {},
    order: [],
  };

  let query = supabase.from("menus").select(MENU_TABLE_FIELDS);
  query = applyMenuFilters(query, params, meta);
  query = applyMenuOrdering(query, meta);

  const { data, error } = await query;
  if (error) {
    logMenuQueryError(meta, error);
    throw new Error(`menus select failed: ${error.message}`);
  }

  const rawRows = safeArray<any>(data);
  let modules: ReturnType<typeof mapModuleRow>[] = [];
  try {
    modules = await menuRepo.listModules();
  } catch {
    modules = [];
  }

  const modulesById = new Map(modules.map((mod) => [mod._id, mod] as const));
  let rows = rawRows.map((row) => {
    const module = modulesById.get(row.module_id ?? "");
    return mapMenuRow({
      ...row,
      module_code: module?.code ?? null,
      module_name: module?.name ?? null,
      module_group: module?.group ?? null,
    });
  });

  if (params.moduleGroup) {
    rows = rows.filter((menu) => menu.module_group === params.moduleGroup);
  }

  return rows;
};

export const menuRepo = {
  async listMenus(params: MenuListParams = {}): Promise<MenuRecord[]> {
    const viaView = await listMenusViaView(params);
    const items = viaView ?? (await listMenusFallback(params));
    return items;
  },

  async getMenuTree(params: MenuListParams = {}) {
    const items = await menuRepo.listMenus(params);
    return buildMenuTree(items);
  },

  async getMenuById(menuId: string): Promise<MenuRecord | null> {
    const viewMeta: MenuQueryMeta = {
      source: "v_menus_full",
      select: MENU_VIEW_FIELDS,
      filters: { _id: menuId },
      order: [],
    };

    const { data: viewData, error: viewError } = await supabase
      .from("v_menus_full")
      .select(MENU_VIEW_FIELDS)
      .eq("_id", menuId)
      .maybeSingle();

    if (viewError) {
      if (!isMissingRelationError(viewError.message)) {
        logMenuQueryError(viewMeta, viewError);
        throw new Error(`menus select failed: ${viewError.message}`);
      }
    } else if (viewData) {
      return mapMenuRow(viewData);
    }

    const tableMeta: MenuQueryMeta = {
      source: "menus",
      select: MENU_TABLE_FIELDS,
      filters: { _id: menuId },
      order: [],
    };

    const { data, error } = await supabase
      .from("menus")
      .select(MENU_TABLE_FIELDS)
      .eq("_id", menuId)
      .maybeSingle();

    if (error) {
      logMenuQueryError(tableMeta, error);
      throw new Error(`menus select failed: ${error.message}`);
    }

    return data ? mapMenuRow(data) : null;
  },

  async getMenuByIdTable(menuId: string): Promise<MenuRecord | null> {
    const meta: MenuQueryMeta = {
      source: "menus",
      select: MENU_TABLE_FIELDS,
      filters: { _id: menuId },
      order: [],
    };

    const { data, error } = await supabase
      .from("menus")
      .select(MENU_TABLE_FIELDS)
      .eq("_id", menuId)
      .maybeSingle();

    if (error) {
      logMenuQueryError(meta, error);
      throw new Error(`menus select failed: ${error.message}`);
    }

    return data ? mapMenuRow(data) : null;
  },

  async createMenu(payload: MenuPayload): Promise<MenuRecord> {
    const normalizedPath = normalizePath(payload.path ?? null);
    const insertPayload = {
      code: payload.code?.trim(),
      name: payload.name?.trim(),
      path: normalizedPath,
      icon: payload.icon ?? null,
      parent_id: payload.parent_id ?? null,
      module_id: payload.module_id ?? null,
      order_index: payload.order_index ?? 0,
      is_active: payload.is_active ?? true,
    };

    const { data, error } = await supabase
      .from("menus")
      .insert([insertPayload])
      .select(MENU_TABLE_FIELDS)
      .single();

    if (error) {
      throw new Error(`menu insert failed: ${error.message}`);
    }

    return mapMenuRow(data);
  },

  async updateMenu(menuId: string, payload: Partial<MenuPayload>): Promise<MenuRecord> {
    const normalizedPath = payload.path !== undefined ? normalizePath(payload.path) : undefined;
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (payload.code !== undefined) updatePayload.code = payload.code?.trim();
    if (payload.name !== undefined) updatePayload.name = payload.name?.trim();
    if (payload.parent_id !== undefined) updatePayload.parent_id = payload.parent_id ?? null;
    if (payload.module_id !== undefined) updatePayload.module_id = payload.module_id ?? null;
    if (normalizedPath !== undefined) updatePayload.path = normalizedPath;
    if (payload.icon !== undefined) updatePayload.icon = payload.icon ?? null;
    if (payload.order_index !== undefined) updatePayload.order_index = payload.order_index ?? 0;
    if (payload.is_active !== undefined) updatePayload.is_active = payload.is_active ?? true;

    const { error } = await supabase
      .from("menus")
      .update(updatePayload)
      .eq("_id", menuId);

    if (error) {
      logMenuMutationError("updateMenu", { menuId, ...updatePayload }, error);
      throw new Error(`menu update failed: ${error.message}`);
    }

    if (import.meta.env.DEV) {
      console.info("[menus] update ok, refetch via view", { menuId });
    }

    const fresh = await menuRepo.getMenuById(menuId);
    if (!fresh) {
      return {
        _id: menuId,
        code: payload.code?.trim() ?? "",
        name: payload.name?.trim() ?? "",
        parent_id: payload.parent_id ?? null,
        module_id: payload.module_id ?? null,
        path: normalizedPath ?? null,
        icon: payload.icon ?? null,
        order_index: payload.order_index ?? 0,
        is_active: payload.is_active ?? true,
        permission_ids: [],
        permission_codes: [],
        module_code: null,
        module_name: null,
        module_group: null,
        meta: null,
        created_at: null,
        updated_at: new Date().toISOString(),
      };
    }

    const expected: Array<[keyof MenuRecord, unknown]> = [];
    if (payload.code !== undefined) expected.push(["code", payload.code?.trim() ?? ""]);
    if (payload.name !== undefined) expected.push(["name", payload.name?.trim() ?? ""]);
    if (payload.parent_id !== undefined) expected.push(["parent_id", payload.parent_id ?? null]);
    if (payload.module_id !== undefined) expected.push(["module_id", payload.module_id ?? null]);
    if (normalizedPath !== undefined) expected.push(["path", normalizedPath]);
    if (payload.icon !== undefined) expected.push(["icon", payload.icon ?? null]);
    if (payload.order_index !== undefined) expected.push(["order_index", payload.order_index ?? 0]);
    if (payload.is_active !== undefined) expected.push(["is_active", payload.is_active ?? true]);

    const mismatch = expected.find(([key, value]) => fresh[key] !== value);
    if (mismatch) {
      throw new Error("menu update failed: Không thể cập nhật (kiểm tra quyền hoặc RLS).");
    }

    return fresh;
  },

  async softDeleteMenu(menuId: string): Promise<void> {
    const { error } = await supabase
      .from("menus")
      .update({ is_active: false })
      .eq("_id", menuId);
    if (error) {
      throw new Error(`menu delete failed: ${error.message}`);
    }
  },

  async moveMenu(params: MenuMoveParams): Promise<void> {
    const loadRows = async (fields: string, orderBy: string[]) => {
      let query = supabase.from("menus").select(fields);
      orderBy.forEach((field) => {
        const isParent = field === "parent_id";
        // @ts-expect-error supabase query builder typing
        query = query.order(field, { ascending: true, nullsFirst: isParent });
      });
      return query;
    };

    const primaryOrder = ["parent_id", "order_index", "name"];
    const { data, error } = await loadRows("_id, parent_id, order_index, name", primaryOrder);

    if (error) {
      const needsLegacyOrder = error.message.includes("order_index") || error.message.includes("name");
      if (!needsLegacyOrder) {
        throw new Error(`menus select failed: ${error.message}`);
      }
      const fallback = await loadRows("_id, parent_id, sort_order, label", ["parent_id", "sort_order", "label"]);
      if (fallback.error) {
        throw new Error(`menus select failed: ${fallback.error.message}`);
      }
      const legacyRows = safeArray<any>(fallback.data).map((row) => ({
        ...row,
        order_index: row.sort_order ?? 0,
        name: row.label ?? "",
      }));
      const rows = legacyRows;
      const dragRow = rows.find((row) => row._id === params.dragId);
      if (!dragRow) return;
      const oldParentId = dragRow.parent_id ?? null;
      const newParentId = params.dropParentId ?? null;

      const reorder = (parentId: string | null, includeDrag: boolean, targetIndex = 0) => {
        const siblings = rows
          .filter((row) => (row.parent_id ?? null) === parentId)
          .filter((row) => includeDrag || row._id !== params.dragId)
          .sort(sortMenuNodes);

        if (includeDrag) {
          const dragNode = siblings.find((row) => row._id === params.dragId) ?? dragRow;
          const withoutDrag = siblings.filter((row) => row._id !== params.dragId);
          const index = Math.max(0, Math.min(targetIndex, withoutDrag.length));
          withoutDrag.splice(index, 0, { ...dragNode, parent_id: parentId });
          return withoutDrag.map((row, idx) => ({
            _id: row._id,
            parent_id: parentId,
            order_index: (idx + 1) * 10,
          }));
        }

        return siblings.map((row, idx) => ({
          _id: row._id,
          parent_id: parentId,
          order_index: (idx + 1) * 10,
        }));
      };

      const updates: Array<{ _id: string; parent_id: string | null; order_index: number }> = [];
      if (oldParentId !== newParentId) {
        updates.push(...reorder(oldParentId, false));
      }
      updates.push(...reorder(newParentId, true, params.targetIndex));
      const deduped = new Map<string, { _id: string; parent_id: string | null; order_index: number }>();
      updates.forEach((row) => deduped.set(row._id, row));
      const payload = Array.from(deduped.values());
      if (payload.length === 0) return;

      const upsertResponse = await supabase.from("menus").upsert(
        payload.map((row) => ({
          _id: row._id,
          parent_id: row.parent_id,
          sort_order: row.order_index,
        })),
        { onConflict: "_id" },
      );
      if (upsertResponse.error) {
        throw new Error(`menu move failed: ${upsertResponse.error.message}`);
      }
      return;
    }

    const rows = safeArray<any>(data).map((row) => ({
      ...row,
      order_index: row.order_index ?? 0,
      name: row.name ?? "",
    }));
    const dragRow = rows.find((row) => row._id === params.dragId);
    if (!dragRow) return;

    const oldParentId = dragRow.parent_id ?? null;
    const newParentId = params.dropParentId ?? null;

    const reorder = (parentId: string | null, includeDrag: boolean, targetIndex = 0) => {
      const siblings = rows
        .filter((row) => (row.parent_id ?? null) === parentId)
        .filter((row) => includeDrag || row._id !== params.dragId)
        .sort(sortMenuNodes);

      if (includeDrag) {
        const dragNode = siblings.find((row) => row._id === params.dragId) ?? dragRow;
        const withoutDrag = siblings.filter((row) => row._id !== params.dragId);
        const index = Math.max(0, Math.min(targetIndex, withoutDrag.length));
        withoutDrag.splice(index, 0, { ...dragNode, parent_id: parentId });
        return withoutDrag.map((row, idx) => ({
          _id: row._id,
          parent_id: parentId,
          order_index: (idx + 1) * 10,
        }));
      }

      return siblings.map((row, idx) => ({
        _id: row._id,
        parent_id: parentId,
        order_index: (idx + 1) * 10,
      }));
    };

    const updates: Array<{ _id: string; parent_id: string | null; order_index: number }> = [];

    if (oldParentId !== newParentId) {
      updates.push(...reorder(oldParentId, false));
    }
    updates.push(...reorder(newParentId, true, params.targetIndex));

    const deduped = new Map<string, { _id: string; parent_id: string | null; order_index: number }>();
    updates.forEach((row) => deduped.set(row._id, row));

    const payload = Array.from(deduped.values());
    if (payload.length === 0) return;

    const upsertResponse = await supabase.from("menus").upsert(payload, { onConflict: "_id" });

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
      _id: row._id ?? "",
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
