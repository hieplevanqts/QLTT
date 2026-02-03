import React, { useEffect, useMemo, useState, useRef } from 'react';
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
    locks,
  } = useQLTTScope();
  // Get user from Redux instead of AuthContext
    const { user,department } = useAppSelector((state: RootState) => state.auth);
  console.log('user',user)
  // Redux dispatch and selector for Redux store
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  
  const deptInfoRef = useRef<any>(null);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  const [isValidUserScope, setIsValidUserScope] = useState<boolean>(false);
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

const [departmentDetail, setDepartmentDetail] = useState(null);

useEffect(() => {
  const getDeptData = async () => {
    if (user?.department_id) {
      try {
        const data = await fetchDepartmentById(user?.department_id);
        setDepartmentDetail(data);
        deptInfoRef.current = data;
        setSelectedTeam(data?._id);
        console.log('data',data);
        
      } catch (error) {
      }
    }
  };

  getDeptData();
}, [user?.department_id]); 

  const userDivision = useMemo(() => {
    const id =
      (authUser as any)?.departmentInfo?.id
      // || (authUser as any)?.departmentInfo?.id
      || (authUser as any)?.department
      || null;
    if (!id) return null;
    const name =
      (authUser as any)?.app_metadata?.department?.name
      || (authUser as any)?.departmentInfo?.name
      || 'Đơn vị';
    return { id, name };
  }, [authUser]);

  const divisionOptions = useMemo(() => {
    if (!userDivision) return availableDivisions;
    const exists = availableDivisions.some((division) => division.id === userDivision.id);
    return exists ? availableDivisions : [...availableDivisions, userDivision];
  }, [availableDivisions, userDivision]);

  const fallbackDivisionId =
    !scope.divisionId && divisionOptions.length === 1
      ? divisionOptions[0].id
      : null;
  const userDivisionId = userDivision?.id || null;
  const hasUserDivisionOption = Boolean(
    userDivisionId && divisionOptions.some((division) => division.id === userDivisionId),
  );
  const effectiveDivisionId = scope.divisionId || (hasUserDivisionOption ? userDivisionId : null) || fallbackDivisionId;

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(effectiveDivisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [effectiveDivisionId, scope.teamId, scope.areaId]);

  // Prefer division from auth user department when scope is empty
  useEffect(() => {
    if (isLoading || !userDivisionId) return;
    if (scope.divisionId === userDivisionId) return;
    if (scope.teamId || scope.areaId) return;

    const divisionExists = divisionOptions.some((d: any) => d.id === userDivisionId);
    if (!divisionExists) return;

    const newScope = {
      divisionId: userDivisionId,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    };

    localStorage.setItem('division_id', userDivisionId);
    setContextScope(newScope);
    dispatch(setScope(newScope));
  }, [
    isLoading,
    userDivisionId,
    divisionOptions,
    scope.divisionId,
    scope.teamId,
    scope.areaId,
    setContextScope,
    dispatch,
  ]);

  // Restore saved division from localStorage
  useEffect(() => {
    if (
      !isLoading
      && divisionOptions.length > 0
      && !scope.divisionId
      && !scope.teamId
      && !scope.areaId
      && !userDivisionId
    ) {
        const savedDivisionId = localStorage.getItem('division_id');
        if (savedDivisionId) {
            const divisionExists = divisionOptions.some((d: any) => d.id === savedDivisionId);
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
    divisionOptions,
    isLoading,
    scope.divisionId,
    scope.teamId,
    scope.areaId,
    userDivisionId,
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

  const isDivisionDisabled = isLoading || locks.division;
  const isTeamDisabled = isLoading || locks.team || !scope.divisionId;
  const isAreaDisabled = isLoading || locks.team || !scope.teamId;
  console.log('selectedDivision', selectedDivision);
  console.log('selectedTeam', selectedTeam);
  console.log('availableTeams', availableTeams);
  console.log('divisionOptions', divisionOptions);
  let disabled_division = selectedDivision ? true : false;
  let disabled_team = selectedTeam ? true : false;

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
          disabled={disabled_division}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* <option value="">Tất cả chi cục</option> */}
          {divisionOptions.map((division, index) => {
            let selected = selectedDivision === division.id ? true : false;
            return (
            <option key={`${division.id || 'div'}-${index}`} value={division.id} selected={selected}>
              {division.name}
            </option>
          )
          })}
        </select>
        
        <select
          value={selectedTeam || ''}
          onChange={handleTeamChange}
          className={styles.select}
          disabled={disabled_team}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <option value="">Tất cả đội</option>
          {availableTeams.map((team, index) => {
            let selectedTeam = team.id ? true : false;
            return (
            <option key={`${team.id || 'team'}-${index}`} value={team.id} selected={selectedTeam}>
              {team.name}
            </option>
          )
          })}
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
