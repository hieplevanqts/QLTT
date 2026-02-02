export type MenuStatus = "ACTIVE" | "INACTIVE";

export interface MenuRecord {
  _id: string;
  code: string;
  name: string;
  parent_id?: string | null;
  module_id?: string | null;
  path?: string | null;
  icon?: string | null;
  order_index?: number | null;
  is_active?: boolean | null;
  permission_ids?: string[];
  permission_codes?: string[];
  module_code?: string | null;
  module_name?: string | null;
  module_group?: string | null;
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
  key?: string | null;
  code: string;
  name: string;
  group?: string | null;
  meta?: Record<string, unknown> | string | null;
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
  moduleCode?: string;
  category?: string;
  action?: string;
  resource?: string;
  status?: "active" | "inactive" | "all";
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface PagedResult<T> {
  data: T[];
  total: number;
}
