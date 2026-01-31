export type MenuStatusValue = boolean | string | number | null | undefined;

export type MenuRecord = {
  _id: string;
  code: string;
  name: string;
  parent_id: string | null;
  module_id: string | null;
  path: string | null;
  icon: string | null;
  order_index: number;
  is_active: boolean;
  meta?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  module_code?: string | null;
  module_name?: string | null;
  module_group?: string | null;
  permission_ids: string[];
  permission_codes: string[];
};

export type MenuTreeNode = MenuRecord & { children: MenuTreeNode[] };

export type MenuListParams = {
  search?: string;
  status?: "all" | "active" | "inactive";
  moduleGroup?: string;
  moduleId?: string;
};

export type MenuMoveParams = {
  dragId: string;
  dropParentId: string | null;
  targetIndex: number;
};

export type MenuPayload = {
  code: string;
  name: string;
  parent_id?: string | null;
  module_id?: string | null;
  path?: string | null;
  icon?: string | null;
  order_index?: number | null;
  is_active?: boolean | null;
  meta?: Record<string, unknown> | null;
};

export type MenuPermissionUpdateResult = {
  added: number;
  removed: number;
};

export type MenuPermissionStatusFilter = "all" | "active" | "inactive";

export type MenuPermissionRecord = {
  _id: string;
  code: string;
  name: string;
  description?: string | null;
  module_id?: string | null;
  module?: string | null;
  permission_type?: string | null;
  category?: string | null;
  resource?: string | null;
  action?: string | null;
  status?: number | string | null;
};

export type MenuPermissionListParams = {
  search?: string;
  moduleId?: string | null;
  action?: string;
  category?: string;
  resource?: string | null;
  status?: MenuPermissionStatusFilter;
  page?: number;
  pageSize?: number;
  sortBy?: "code" | "name" | "resource" | "action";
  sortDir?: "asc" | "desc";
};

export type MenuPermissionListResult = {
  data: MenuPermissionRecord[];
  total: number;
};
