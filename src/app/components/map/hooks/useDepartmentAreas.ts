import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { setDepartmentAreas, setLoading, setError, setCurrentDepartmentId } from '../../../../store/slices/departmentAreasSlice';
import { fetchDepartmentAreas, fetchDepartmentIdsByDivision } from '../../../../utils/api/departmentAreasApi';

/**
 * Custom hook to manage department areas fetching for map display
 * @param departmentId - Department ID to fetch (priority: selectedDepartmentId > teamId > divisionId)
 * @param enabled - Whether to fetch data (e.g., when showWardBoundaries is true)
 */
export function useDepartmentAreas(departmentId: string | null | undefined, enabled: boolean = true) {
  const dispatch = useAppDispatch();
  
  // Get selected department from officer filter
  const selectedDepartmentId = useAppSelector((state) => state.officerFilter.selectedDepartmentId);
  
  // Get current department areas state
  const departmentAreas = useAppSelector((state) => state.departmentAreas);
  
  // 🔥 Get divisionId and teamId from Redux to determine if departmentId is a division
  const reduxQLTTScope = useAppSelector((state) => state.qlttScope);
  const divisionId = reduxQLTTScope?.scope?.divisionId;
  const teamId = reduxQLTTScope?.scope?.teamId;
  
  // Determine which department ID to use
  // Priority: selectedDepartmentId (from filter) > departmentId (prop) > null
  const targetDepartmentId = selectedDepartmentId && selectedDepartmentId !== '' 
    ? selectedDepartmentId 
    : departmentId || null;
  
  // 🔥 NEW: Check if targetDepartmentId is a division (need to fetch child departments)
  // If targetDepartmentId equals divisionId (and not teamId), it's a division
  // We need to fetch all child departments for a division
  const isDivision = !selectedDepartmentId && 
                     !!targetDepartmentId && 
                     targetDepartmentId === divisionId && 
                     targetDepartmentId !== teamId;
  
  // Fetch department areas when enabled and department ID changes
  useEffect(() => {
    if (!enabled) {
      return;
    }
    
    if (!targetDepartmentId) {
      dispatch(setDepartmentAreas(null));
      dispatch(setCurrentDepartmentId(null));
      return;
    }
    
    // 🔥 FIX: Always fetch when targetDepartmentId changes, even if already loaded
    // This ensures that when user selects a different department, we fetch new data
    if (departmentAreas.isLoading) {
      return; // Skip if already loading
    }
    
    // Check if we need to fetch (different department or no data)
    const needsFetch = departmentAreas.currentDepartmentId !== targetDepartmentId;
    
    if (!needsFetch && departmentAreas.data) {
      return;
    }
    
    async function loadDepartmentAreas() {
      if (!targetDepartmentId) return; // Type guard
      
      dispatch(setCurrentDepartmentId(targetDepartmentId));
      dispatch(setLoading(true));
      
      try {
        let data;
        
        // 🔥 FIX: If it's a division, fetch all department IDs first, then fetch areas for all
        if (isDivision) {
          const departmentIds = await fetchDepartmentIdsByDivision(targetDepartmentId);
          
          if (departmentIds.length === 0) {
            dispatch(setDepartmentAreas(null));
            dispatch(setError('No departments found for this division'));
            return;
          }
          
          data = await fetchDepartmentAreas(departmentIds);
        } else {
          // Single department (team or selected department)
          data = await fetchDepartmentAreas(targetDepartmentId);
        }
        
        dispatch(setDepartmentAreas(data));
      } catch (error: any) {
        console.error('❌ useDepartmentAreas: Failed to fetch department areas:', error);
        const errorMessage = error?.message ? String(error.message) : 'Failed to fetch department areas';
        dispatch(setError(errorMessage));
        dispatch(setDepartmentAreas(null));
      }
    }
    
    loadDepartmentAreas();
  }, [enabled, targetDepartmentId, selectedDepartmentId, departmentId, isDivision, dispatch, departmentAreas.isLoading, departmentAreas.currentDepartmentId, departmentAreas.data]);
  
  return {
    departmentAreas: departmentAreas.data,
    isLoading: departmentAreas.isLoading,
    error: departmentAreas.error,
    currentDepartmentId: departmentAreas.currentDepartmentId,
  };
}
