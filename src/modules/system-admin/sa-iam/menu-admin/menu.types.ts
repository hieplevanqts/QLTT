export type MenuStatus = "ACTIVE" | "INACTIVE";

export interface MenuRecord {
  _id: string;
  code: string;
  label: string;
  parent_id?: string | null;
  module_id?: string | null;
  route_path?: string | null;
  icon?: string | null;
  sort_order?: number | null;
  status?: string | number | null;
  is_visible?: boolean | null;
  permission_ids?: string[];
  meta?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface MenuHistoryRecord {
  _id: string;
  code: string;
  name: string;
  updated_at?: string | null;
  created_at?: string | null;
}

export interface MenuNode extends MenuRecord {
  children?: MenuNode[];
}

export interface ModuleRecord {
  _id: string;
  code: string;
  name: string;
  group?: string | null;
}

export interface RoleRecord {
  _id: string;
  code: string;
  name: string;
  status?: number | null;
}

export interface PermissionRecord {
  _id: string;
  code: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  module?: string | null;
  resource?: string | null;
  action?: string | null;
  category?: string | null;
  status?: number | null;
}

export interface MenuPermissionRecord {
  _id: string;
  menu_id: string;
  permission_id: string;
  created_at?: string | null;
}

export interface PermissionFilter {
  search?: string;
  moduleId?: string;
  category?: string;
  action?: string;
  resource?: string;
  status?: number | "all";
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PagedResult<T> {
  data: T[];
  total: number;
}
