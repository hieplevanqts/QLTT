import React, { useEffect, useState, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useQLTTScope } from '@/contexts/QLTTScopeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setScope } from '@/store/slices/qlttScopeSlice';
import styles from './ScopeSelector.module.css';
import { RootState } from '@/store/rootReducer';
import { fetchDepartmentById } from '@/utils/api/departmentsApi';



export function ScopeSelector() {
  const {
    scope,
    setScope: setContextScope,
    availableDivisions,
    availableTeams,
    availableAreas,
    isLoading,
  } = useQLTTScope();
  // Get user from Redux instead of AuthContext
    const { user,department } = useAppSelector((state: RootState) => state.auth);
  
  // Redux dispatch and selector for Redux store
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  
  const deptInfoRef = useRef<any>(null);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  const [isValidUserScope, setIsValidUserScope] = useState<boolean>(false);
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const userDivisionId =
    (authUser as any)?.app_metadata?.department?.id
    || (authUser as any)?.departmentInfo?.id
    || null;

  const fallbackDivisionId =
    !scope.divisionId && availableDivisions.length === 1
      ? availableDivisions[0].id
      : null;
  const effectiveDivisionId = scope.divisionId || userDivisionId || fallbackDivisionId;

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(effectiveDivisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [effectiveDivisionId, scope.teamId, scope.areaId]);

  // Prefer division from auth user department when scope is empty
  useEffect(() => {
    if (isLoading || scope.divisionId || scope.teamId || scope.areaId) return;

    const userDepartmentId =
      userDivisionId;

    if (!userDepartmentId) return;

    const divisionExists = availableDivisions.some((d: any) => d.id === userDepartmentId);
    if (!divisionExists) return;

    const newScope = {
      divisionId: userDepartmentId,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    };

    localStorage.setItem('division_id', userDepartmentId);
    setContextScope(newScope);
    dispatch(setScope(newScope));
  }, [
    authUser,
    isLoading,
    availableDivisions,
    scope.divisionId,
    scope.teamId,
    scope.areaId,
    userDivisionId,
    setContextScope,
    dispatch,
  ]);

  // Restore saved division from localStorage
  useEffect(() => {
    if (
      !isLoading
      && availableDivisions.length > 0
      && !scope.divisionId
      && !scope.teamId
      && !scope.areaId
    ) {
        const savedDivisionId = localStorage.getItem('division_id');
        if (savedDivisionId) {
            const divisionExists = availableDivisions.some((d: any) => d.id === savedDivisionId);
            if (divisionExists) {
                const newScope = {
                    divisionId: savedDivisionId,
                    teamId: null,
                    areaId: null,
                    province: null,
                    ward: null,
                };
                setContextScope(newScope);
                // NEW: Also save to Redux store
                dispatch(setScope(newScope));
                
            }
        }
    }
  }, [
    availableDivisions,
    isLoading,
    scope.divisionId,
    scope.teamId,
    scope.areaId,
    setContextScope,
    dispatch,
  ]);

  // Ensure division is active when only one division exists
  useEffect(() => {
    if (isLoading || !fallbackDivisionId) return;

    const newScope = {
      divisionId: fallbackDivisionId,
      teamId: scope.teamId || null,
      areaId: scope.areaId || null,
      province: scope.province || null,
      ward: scope.ward || null,
    };

    setContextScope(newScope);
    dispatch(setScope(newScope));
  }, [
    fallbackDivisionId,
    isLoading,
    scope.teamId,
    scope.areaId,
    scope.province,
    scope.ward,
    setContextScope,
    dispatch,
  ]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const divisionId = e.target.value || null;
    setSelectedDivision(divisionId || '');
    setSelectedTeam('');
    setSelectedArea('');

    const newScope = {
      divisionId,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    };
    
    setContextScope(newScope);
    // NEW: Save to Redux store
    dispatch(setScope(newScope));
    
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const rawValue = e.target.value;
    
    // FIX: Convert empty string to null, but keep valid teamId strings
    const teamId = rawValue && rawValue.trim() !== '' ? rawValue : null;
    
    setSelectedTeam(teamId || '');
    setSelectedArea('');

    const newScope = {
      divisionId: effectiveDivisionId || null,  // 🔥 FIX: Use effectiveDivisionId
      teamId,
      areaId: null,
      province: null,
      ward: null,
    };
    
    setContextScope(newScope);
    // NEW: Save to Redux store
    dispatch(setScope(newScope));
    
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const areaId = e.target.value || null;
    setSelectedArea(areaId || '');

    const area = availableAreas.find((item) => item.id === areaId);
    // FIX: Use scope values from context instead of local state
    const newScope = {
      divisionId: effectiveDivisionId || null,  // 🔥 FIX: Use effectiveDivisionId
      teamId: scope.teamId || null,            // 🔥 FIX: Use scope.teamId
      areaId,
      province: area?.provinceCode || null,
      ward: area?.wardCode || null,
    };
    
    setContextScope(newScope);
    // NEW: Save to Redux store
    dispatch(setScope(newScope));
   
  };

  const userDeptId = (user as any)?.app_metadata?.department?.id || 
                     (user as any)?.department_id ||
                     (user as any)?.divisionId ||
                     (user as any)?.division_id;

  const isDivisionDisabled = isLoading || (!!userDeptId && isValidUserScope);
  const isTeamDisabled = isLoading || !selectedDivision || (!!userDeptId && isValidUserScope && isTeamMember) || availableTeams.length === 0;
  const isAreaDisabled = isLoading || !selectedTeam;
  

  return (
    <div 
      className={styles.scopeSelector} 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      data-scope-selector="true"
    >
      <div className={styles.selectWrapper}>
        <MapPin className={styles.selectIcon} size={16} />
        <select
          value={selectedDivision || ''}
          onChange={handleDivisionChange}
          className={styles.select}
          disabled={isDivisionDisabled}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="">Tất cả chi cục</option>
          {availableDivisions.map((division, index) => (
            <option key={`${division.id || 'div'}-${index}`} value={division.id}>
              {division.name}
            </option>
          ))}
        </select>
        
        <select
          value={selectedTeam || ''}
          onChange={handleTeamChange}
          className={styles.select}
          disabled={isTeamDisabled}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="">Tất cả đội</option>
          {availableTeams.map((team, index) => (
            <option key={`${team.id || 'team'}-${index}`} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {/* <select
          value={selectedArea || ''}
          onChange={handleAreaChange}
          className={styles.select}
          disabled={isAreaDisabled}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="">Tất cả địa bàn</option>
          {availableAreas.map((area, index) => (
            <option key={`${area.id || 'area'}-${index}`} value={area.id}>
              {area.name}
            </option>
          ))}
        </select> */}
      </div>
    </div>
  );
}
