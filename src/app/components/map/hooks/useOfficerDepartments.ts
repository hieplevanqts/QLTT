import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../app/hooks';
import { setDepartments, setLoading, setError } from '../../../../store/slices/officerFilterSlice';
import { fetchOfficerDepartments } from '../../../../utils/api/officerFilterApi';

/**
 * Custom hook to manage officer departments fetching
 */
export function useOfficerDepartments(isOpen: boolean) {
  const dispatch = useAppDispatch();
  
  // Get divisionId and teamId from Redux store
  const reduxQLTTScope = useAppSelector((state) => state.qlttScope);
  const divisionId = reduxQLTTScope?.scope?.divisionId;
  const teamId = reduxQLTTScope?.scope?.teamId;
  
  // Get departments and loading state from Redux store
  const officerFilter = useAppSelector((state) => state.officerFilter);
  const departments = officerFilter.departments;
  const isLoadingDepartments = officerFilter.isLoading;
  
  // Fetch departments from API when panel opens
  useEffect(() => {
    if (!isOpen) return;
    
    // Priority: teamId > divisionId
    const targetId = teamId || divisionId;
    
    if (!targetId) {
      dispatch(setDepartments([]));
      return;
    }
    
    // Type guard: ensure targetId is a valid string
    const validTargetId: string = typeof targetId === 'string' && targetId.trim() !== '' 
      ? targetId 
      : '';
    
    if (!validTargetId) {
      dispatch(setDepartments([]));
      return;
    }
    
    // Fetch departments using service
    async function loadDepartments() {
      dispatch(setLoading(true));
      try {
        const departments = await fetchOfficerDepartments(validTargetId);
        dispatch(setDepartments(departments));
      } catch (error: any) {
        console.error('❌ OfficerFilterPanel: Failed to fetch departments:', error);
        const errorMessage = error?.message ? String(error.message) : 'Failed to fetch departments';
        dispatch(setError(errorMessage));
        dispatch(setDepartments([]));
      }
    }
    
    loadDepartments();
  }, [isOpen, teamId, divisionId, dispatch]);
  
  return {
    departments,
    isLoadingDepartments,
  };
}
