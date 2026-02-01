import * as React from "react";
import {
  permissionsService,
  type PermissionActionOption,
  type PermissionLegacyTypeOption,
  type PermissionModuleOption,
  type PermissionRecord,
} from "../services/permissions.service";

export type PermissionCategoryFilter = "all" | "PAGE" | "FEATURE";
export type PermissionStatusFilter = "all" | "active" | "inactive";

export type PermissionsFilters = {
  search: string;
  status: PermissionStatusFilter;
  category: PermissionCategoryFilter;
  action: string;
  moduleId: string;
  permissionType: string;
  unnormalizedOnly: boolean;
};

const DEFAULT_FILTERS: PermissionsFilters = {
  search: "",
  status: "all",
  category: "all",
  action: "all",
  moduleId: "all",
  permissionType: "all",
  unnormalizedOnly: false,
};

const useDebouncedValue = <T,>(value: T, delay = 350): T => {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

const hasValue = (value?: string | null) => Boolean(value && value.trim());

export const usePermissionsList = () => {
  const [filters, setFilters] = React.useState<PermissionsFilters>(DEFAULT_FILTERS);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [loading, setLoading] = React.useState(false);
  const [rawPermissions, setRawPermissions] = React.useState<PermissionRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [modules, setModules] = React.useState<PermissionModuleOption[]>([]);
  const [legacyTypes, setLegacyTypes] = React.useState<PermissionLegacyTypeOption[]>([]);
  const [actions, setActions] = React.useState<PermissionActionOption[]>([]);

  const debouncedSearch = useDebouncedValue(filters.search);

  const refreshLookups = React.useCallback(async () => {
    const [mods, legacy, act] = await Promise.all([
      permissionsService.listPermissionModules(),
      permissionsService.listPermissionLegacyTypes(),
      permissionsService.listPermissionActions(),
    ]);
    setModules(mods);
    setLegacyTypes(legacy);
    setActions(act);
  }, []);

  const refreshPermissions = React.useCallback(async () => {
    setLoading(true);
    try {
      const moduleOption =
        modules.find((item) => item.id === filters.moduleId) ??
        modules.find((item) => item.code === filters.moduleId);
      const moduleId = filters.moduleId === "all" ? undefined : moduleOption?.id;
      const moduleCode =
        filters.moduleId === "all"
          ? undefined
          : moduleOption?.code ?? (moduleId ? undefined : filters.moduleId);

      const result = await permissionsService.listPermissions({
        q: hasValue(debouncedSearch) ? debouncedSearch : undefined,
        status: filters.status,
        category: filters.category,
        action: filters.action === "all" ? undefined : filters.action,
        moduleId,
        moduleCode,
        permissionType: filters.permissionType === "all" ? undefined : filters.permissionType,
        page,
        pageSize,
      });
      setRawPermissions(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [filters, modules, debouncedSearch, page, pageSize]);

  React.useEffect(() => {
    void refreshLookups();
  }, [refreshLookups]);

  React.useEffect(() => {
    void refreshPermissions();
  }, [refreshPermissions]);

  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters.status, filters.category, filters.action, filters.moduleId, filters.permissionType, filters.unnormalizedOnly]);

  return {
    filters,
    setFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    loading,
    rawPermissions,
    total,
    modules,
    legacyTypes,
    actions,
    refreshPermissions,
    refreshLookups,
  };
};

export type { PermissionRecord };
