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
    console.log('🔄 useDepartmentAreas: Effect triggered', {
      enabled,
      targetDepartmentId,
      selectedDepartmentId,
      departmentId,
      currentDepartmentId: departmentAreas.currentDepartmentId,
      isLoading: departmentAreas.isLoading,
      hasData: !!departmentAreas.data
    });
    
    if (!enabled) {
      console.log('⚠️ useDepartmentAreas: Not enabled, skipping fetch');
      return;
    }
    
    if (!targetDepartmentId) {
      console.log('⚠️ useDepartmentAreas: No targetDepartmentId, clearing data');
      dispatch(setDepartmentAreas(null));
      dispatch(setCurrentDepartmentId(null));
      return;
    }
    
    // 🔥 FIX: Always fetch when targetDepartmentId changes, even if already loaded
    // This ensures that when user selects a different department, we fetch new data
    if (departmentAreas.isLoading) {
      console.log('⏳ useDepartmentAreas: Already loading, skipping');
      return; // Skip if already loading
    }
    
    // Check if we need to fetch (different department or no data)
    const needsFetch = departmentAreas.currentDepartmentId !== targetDepartmentId;
    
    if (!needsFetch && departmentAreas.data) {
      console.log('✅ useDepartmentAreas: Data already loaded for department:', targetDepartmentId);
      return;
    }
    
    console.log('🔄 useDepartmentAreas: Fetching data for department:', targetDepartmentId, {
      previousDepartmentId: departmentAreas.currentDepartmentId,
      selectedDepartmentId,
      departmentId,
      needsFetch
    });
    
    async function loadDepartmentAreas() {
      if (!targetDepartmentId) return; // Type guard
      
      console.log('🔄 useDepartmentAreas: Starting fetch for department:', targetDepartmentId, { isDivision });
      dispatch(setCurrentDepartmentId(targetDepartmentId));
      dispatch(setLoading(true));
      
      try {
        let data;
        
        // 🔥 FIX: If it's a division, fetch all department IDs first, then fetch areas for all
        if (isDivision) {
          console.log('🔄 useDepartmentAreas: Fetching department IDs for division:', targetDepartmentId);
          const departmentIds = await fetchDepartmentIdsByDivision(targetDepartmentId);
          
          if (departmentIds.length === 0) {
            console.warn('⚠️ useDepartmentAreas: No department IDs found for division:', targetDepartmentId);
            dispatch(setDepartmentAreas(null));
            dispatch(setError('No departments found for this division'));
            return;
          }
          
          console.log('✅ useDepartmentAreas: Found', departmentIds.length, 'department IDs, fetching areas...');
          data = await fetchDepartmentAreas(departmentIds);
        } else {
          // Single department (team or selected department)
          data = await fetchDepartmentAreas(targetDepartmentId);
        }
        
        console.log('✅ useDepartmentAreas: Fetch completed, data:', data);
        dispatch(setDepartmentAreas(data));
        console.log('✅ useDepartmentAreas: Data loaded and dispatched for department:', targetDepartmentId);
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
