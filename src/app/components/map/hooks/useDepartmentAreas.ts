import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { setDepartmentAreas, setLoading, setError, setCurrentDepartmentId } from '../../../../store/slices/departmentAreasSlice';
import { getWardCoordinatesByDepartment } from '../../../../utils/api/departmentAreasApi';

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
  
  // Fetch department areas when enabled and department ID changes
  useEffect(() => {
    if (!enabled) {
      return;
    }
    
    // 🔥 NEW: If no divisionId, fetch all departments' areas
    // If no targetDepartmentId and no divisionId, fetch all departments
    const shouldFetchAll = !targetDepartmentId && !divisionId;
    
    if (!targetDepartmentId && !shouldFetchAll) {
      dispatch(setDepartmentAreas(null));
      dispatch(setCurrentDepartmentId(null));
      return;
    }
    
    // 🔥 FIX: Prevent infinite loop - check if already loading
    if (departmentAreas.isLoading) {
      return; // Skip if already loading
    }
    
    // Check if we need to fetch (different department or no data)
    const currentId = shouldFetchAll ? 'all' : targetDepartmentId;
    const needsFetch = departmentAreas.currentDepartmentId !== currentId;
    
    // 🔥 FIX: Only check needsFetch, don't check departmentAreas.data in condition
    // because checking data in condition will cause re-render when data changes
    if (!needsFetch) {
      return; // Already fetched for this department
    }
    
    async function loadDepartmentAreas() {
      dispatch(setCurrentDepartmentId(currentId || null));
      dispatch(setLoading(true));
      
      try {
        // 🔥 FIX: RPC function get_ward_coordinates_by_department tự động xử lý child departments
        // Chỉ cần gọi RPC một lần với departmentId gốc, không cần loop qua từng department
        
        if (shouldFetchAll) {
          // Trường hợp fetch all: cần xử lý khác (có thể không có departmentId gốc)
          console.log('📋 useDepartmentAreas: Fetching all departments - need to handle differently');
          dispatch(setDepartmentAreas(null));
          dispatch(setError('Fetching all departments not supported with RPC'));
          dispatch(setLoading(false));
          return;
        }
        
        if (!targetDepartmentId) {
          dispatch(setDepartmentAreas(null));
          dispatch(setError('No department ID provided'));
          dispatch(setLoading(false));
          return;
        }
        
        // 🔥 NEW: Gọi RPC một lần với departmentId gốc
        // RPC function sẽ tự động lấy tất cả child departments và ward coordinates
        console.log('🔄 useDepartmentAreas: Calling RPC get_ward_coordinates_by_department with departmentId:', targetDepartmentId);
        
        const wardCoordinates = await getWardCoordinatesByDepartment(targetDepartmentId);
        
        if (wardCoordinates.length === 0) {
          console.warn('⚠️ useDepartmentAreas: No ward coordinates found for department');
          dispatch(setDepartmentAreas(null));
          dispatch(setError('No ward coordinates found for department'));
          dispatch(setLoading(false));
          return;
        }
        
        console.log('✅ useDepartmentAreas: RPC returned', wardCoordinates.length, 'ward coordinates');
        
        // 🔥 NEW: Group by ward_id to avoid duplicates (multiple departments might manage same ward)
        const uniqueWardCoordsMap = new Map<string, typeof wardCoordinates[0]>();
        wardCoordinates.forEach(coord => {
          if (coord.ward_id && !uniqueWardCoordsMap.has(coord.ward_id)) {
            uniqueWardCoordsMap.set(coord.ward_id, coord);
          }
        });
        
        console.log('✅ useDepartmentAreas: Unique ward coordinates:', {
          total: wardCoordinates.length,
          unique: uniqueWardCoordsMap.size,
          sample: Array.from(uniqueWardCoordsMap.values()).slice(0, 3).map(c => ({
            ward_id: c.ward_id,
            center: [c.center_lat, c.center_lng]
          }))
        });
        
        // 🔥 NEW: Transform to areas format
        const transformedAreas = Array.from(uniqueWardCoordsMap.values()).map(coord => ({
          province_id: coord.province_id || '',
          ward_id: coord.ward_id,
          wards_with_coordinates: {
            center_lat: coord.center_lat,
            center_lng: coord.center_lng,
            bounds: coord.bounds || null,
            area: coord.area || null,
            officer: coord.officer || null,
          }
        }));
        
        console.log('✅ useDepartmentAreas: Transformed to areas format:', transformedAreas.length, 'areas');
        
        const data = {
          areas: transformedAreas
        };
        
        dispatch(setDepartmentAreas(data as any));
        
        dispatch(setLoading(false));
      } catch (error: any) {
        console.error('❌ useDepartmentAreas: Failed to fetch department areas:', error);
        const errorMessage = error?.message ? String(error.message) : 'Failed to fetch department areas';
        dispatch(setError(errorMessage));
        dispatch(setDepartmentAreas(null));
        dispatch(setLoading(false));
      }
    }
    
    loadDepartmentAreas();
    // 🔥 FIX: Remove departmentAreas.data from dependencies to prevent infinite loop
    // Only depend on values that should trigger a new fetch
  }, [enabled, targetDepartmentId, selectedDepartmentId, departmentId, divisionId, teamId, dispatch]);
  
  return {
    departmentAreas: departmentAreas.data,
    isLoading: departmentAreas.isLoading,
    error: departmentAreas.error,
    currentDepartmentId: departmentAreas.currentDepartmentId,
  };
}
