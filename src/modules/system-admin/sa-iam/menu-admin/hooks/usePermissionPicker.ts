import * as React from "react";
import type { PermissionFilter, PermissionRecord, PagedResult } from "../menu.types";
import { menuService } from "../services/supabase/menu.service";

export interface UsePermissionPickerState {
  filters: PermissionFilter;
  setFilters: React.Dispatch<React.SetStateAction<PermissionFilter>>;
  data: PermissionRecord[];
  total: number;
  loading: boolean;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  refresh: () => Promise<void>;
  assignSelected: () => Promise<void>;
  removeSelected: () => Promise<void>;
}

export const usePermissionPicker = (): UsePermissionPickerState => {
  const [filters, setFilters] = React.useState<PermissionFilter>({
    page: 1,
    pageSize: 20,
    category: "PAGE",
    status: "active",
  });
  const [data, setData] = React.useState<PermissionRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const refresh = React.useCallback(async () => {
    const hasModule = Boolean(filters.moduleCode);
    if (!hasModule) {
      setData([]);
      setTotal(0);
      setSelectedIds([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const normalizedFilters: PermissionFilter = {
        ...filters,
        category: "PAGE",
        status: "active",
      };
      const result: PagedResult<PermissionRecord> =
        await menuService.listPermissions(normalizedFilters);
      setData(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  React.useEffect(() => {
    setSelectedIds([]);
  }, [filters.moduleCode]);

  const assignSelected = React.useCallback(async () => undefined, []);
  const removeSelected = React.useCallback(async () => undefined, []);

  return {
    filters,
    setFilters,
    data,
    total,
    loading,
    selectedIds,
    setSelectedIds,
    refresh,
    assignSelected,
    removeSelected,
  };
};
