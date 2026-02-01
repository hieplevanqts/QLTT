import { useCallback } from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
  setFilters,
  setBusinessTypeFilters,
  setDepartmentFilters,
  setPendingFilters,
  setPendingBusinessTypeFilters,
  setPendingDepartmentFilters,
  applyPendingFilters,
  resetFilters,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
} from '../../store/slices/mapFiltersSlice';
import { buildFilterObjectFromStatuses } from '../../utils/api/pointStatusApi';
import { PointStatus } from '../../utils/api/pointStatusApi';
import { Category } from '../../utils/api/categoriesApi';

type CategoryFilter = { [key: string]: boolean };

interface UseMapFiltersProps {
  filters: CategoryFilter;
  businessTypeFilters: { [key: string]: boolean };
  departmentFilters: { [key: string]: boolean };
  pendingFilters: CategoryFilter;
  pendingBusinessTypeFilters: { [key: string]: boolean };
  pendingDepartmentFilters: { [key: string]: boolean };
  pointStatuses: PointStatus[];
  categories: Category[];
  setCustomStartDate: (date: string) => void;
  setCustomEndDate: (date: string) => void;
  setSearchQuery: (query: string) => void;
}

export const useMapFilters = ({
  filters,
  businessTypeFilters,
  departmentFilters,
  pendingFilters,
  pendingBusinessTypeFilters,
  pendingDepartmentFilters,
  pointStatuses,
  categories,
  setCustomStartDate,
  setCustomEndDate,
  setSearchQuery,
}: UseMapFiltersProps) => {
  const dispatch = useAppDispatch();

  const handleFilterChange = useCallback((category: keyof CategoryFilter) => {
    const newFilters = {
      ...filters,
      [category]: !filters[category]
    };
    
    dispatch(setFilters(newFilters));
    dispatch(setPendingFilters(newFilters));
  }, [filters, dispatch]);

  const handleBusinessTypeFilterChange = useCallback((key: string) => {
    const newFilters = {
      ...businessTypeFilters,
      [key]: !businessTypeFilters[key]
    };
    
    dispatch(setBusinessTypeFilters(newFilters));
    dispatch(setPendingBusinessTypeFilters(newFilters));
  }, [businessTypeFilters, dispatch]);

  const handleBusinessTypeFiltersChange = useCallback((selectedIds: string[]) => {
    const newFilters: { [key: string]: boolean } = {};
    selectedIds.forEach((id) => {
      if (id) {
        newFilters[id] = true;
      }
    });
    dispatch(setBusinessTypeFilters(newFilters));
    dispatch(setPendingBusinessTypeFilters(newFilters));
  }, [dispatch]);

  const handleBusinessTypeToggleAll = useCallback((checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(businessTypeFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    dispatch(setBusinessTypeFilters(newFilters));
    dispatch(setPendingBusinessTypeFilters(newFilters));
  }, [businessTypeFilters, dispatch]);

  const handleDepartmentFilterChange = useCallback((departmentId: string) => {
    const newFilters = {
      ...departmentFilters,
      [departmentId]: !departmentFilters[departmentId]
    };
    
    dispatch(setDepartmentFilters(newFilters));
    dispatch(setPendingDepartmentFilters(newFilters));
  }, [departmentFilters, dispatch]);

  const handleDepartmentToggleAll = useCallback((checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(departmentFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    dispatch(setDepartmentFilters(newFilters));
    dispatch(setPendingDepartmentFilters(newFilters));
  }, [departmentFilters, dispatch]);

  const handleApplyFilters = useCallback(() => {
    dispatch(applyPendingFilters());
  }, [dispatch]);

  const handleSaveFilters = useCallback(() => {
    // No-op: Filters are already in Redux store
    // This function is kept for compatibility with existing code that calls it
  }, []);

  const handleResetAllFilters = useCallback(() => {
    // Reset status filters - enable all
    const defaultFilters = buildFilterObjectFromStatuses(pointStatuses);
    dispatch(setFilters(defaultFilters));
    dispatch(setPendingFilters(defaultFilters));
    
    // Reset business type filters - enable all
    const defaultBusinessTypeFilters: { [key: string]: boolean } = {};
    categories.forEach((cat) => {
      defaultBusinessTypeFilters[cat.id] = true;
    });
    dispatch(setBusinessTypeFilters(defaultBusinessTypeFilters));
    dispatch(setPendingBusinessTypeFilters(defaultBusinessTypeFilters));
    
    // Reset location filters
    dispatch(setSelectedProvince(''));
    dispatch(setSelectedDistrict(''));
    dispatch(setSelectedWard(''));
    
    // Reset date range
    setCustomStartDate('');
    setCustomEndDate('');
    
    // Reset search query
    setSearchQuery('');
    
    // Clear localStorage (handled by resetFilters action)
    dispatch(resetFilters());
  }, [pointStatuses, categories, dispatch, setCustomStartDate, setCustomEndDate, setSearchQuery]);

  return {
    handleFilterChange,
    handleBusinessTypeFilterChange,
    handleBusinessTypeFiltersChange,
    handleBusinessTypeToggleAll,
    handleDepartmentFilterChange,
    handleDepartmentToggleAll,
    handleApplyFilters,
    handleSaveFilters,
    handleResetAllFilters,
  };
};

