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
    pageSize: 10,
    category: "PAGE",
    action: "READ",
    status: "active",
  });
  const [data, setData] = React.useState<PermissionRecord[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const result: PagedResult<PermissionRecord> = await menuService.listPermissions(filters);
      setData(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

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
