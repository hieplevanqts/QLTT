import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useQLTTScope } from '@/contexts/QLTTScopeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { setScope } from '@/store/slices/qlttScopeSlice';
import styles from './ScopeSelector.module.css';
import { RootState } from '@/store/rootReducer';



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
    const { user } = useAppSelector((state: RootState) => state.auth);
  
  // Redux dispatch and selector for Redux store
  const dispatch = useAppDispatch();
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(scope.divisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [scope.divisionId, scope.teamId, scope.areaId]);

  // Enforce user department/team restrictions
  useEffect(() => {
    if (user) {
      const userDeptId = (user as any)?.app_metadata?.department?.id;

      if (userDeptId && !isLoading) {
        // Check if userDeptId matches a division
        const isDivision = availableDivisions.some((d: any) => d.id === userDeptId);
        if (isDivision) {
          if (scope.divisionId !== userDeptId) {
            const newScope = { ...scope, divisionId: userDeptId };
            setContextScope(newScope);
            dispatch(setScope(newScope));
          }
        } else {
          // Check if userDeptId matches a team (if teams are loaded)
          const isTeam = availableTeams.some((t: any) => t.id === userDeptId);
          if (isTeam) {
            if (scope.teamId !== userDeptId) {
              const newScope = { ...scope, teamId: userDeptId };
              setContextScope(newScope);
              dispatch(setScope(newScope));
            }
          }
        }
      }
    }
  }, [user, availableDivisions, availableTeams, isLoading, scope, setContextScope, dispatch]);

  // Restore saved division from localStorage
  useEffect(() => {
    if (!isLoading && availableDivisions.length > 0 && !scope.divisionId) {
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
                // 🔥 NEW: Also save to Redux store
                dispatch(setScope(newScope));
                
            }
        }
    }
  }, [availableDivisions, isLoading, scope.divisionId, setContextScope, dispatch]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const divisionId = e.target.value || null;
    setSelectedDivision(divisionId || '');
    setSelectedTeam('');
    setSelectedArea('');

    if (divisionId) {
        localStorage.setItem('division_id', divisionId);
    } else {
        localStorage.removeItem('division_id');
    }

    const newScope = {
      divisionId,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    };
    
    setContextScope(newScope);
    // 🔥 NEW: Save to Redux store
    dispatch(setScope(newScope));
    
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const rawValue = e.target.value;
    
    // 🔥 FIX: Convert empty string to null, but keep valid teamId strings
    const teamId = rawValue && rawValue.trim() !== '' ? rawValue : null;
    
    setSelectedTeam(teamId || '');
    setSelectedArea('');

    const newScope = {
      divisionId: scope.divisionId || null,  // 🔥 FIX: Use scope.divisionId instead of selectedDivision
      teamId,
      areaId: null,
      province: null,
      ward: null,
    };
    
    setContextScope(newScope);
    // 🔥 NEW: Save to Redux store
    dispatch(setScope(newScope));
    
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const areaId = e.target.value || null;
    setSelectedArea(areaId || '');

    const area = availableAreas.find((item) => item.id === areaId);
    // 🔥 FIX: Use scope values from context instead of local state
    const newScope = {
      divisionId: scope.divisionId || null,  // 🔥 FIX: Use scope.divisionId
      teamId: scope.teamId || null,            // 🔥 FIX: Use scope.teamId
      areaId,
      province: area?.provinceCode || null,
      ward: area?.wardCode || null,
    };
    
    setContextScope(newScope);
    // 🔥 NEW: Save to Redux store
    dispatch(setScope(newScope));
   
  };

  const userDeptId = (user as any)?.app_metadata?.department?.id;

  const isDivisionDisabled = isLoading || !!userDeptId;
  const isTeamDisabled = isLoading || !selectedDivision || (!!userDeptId && scope.teamId === userDeptId);
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

        <select
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
        </select>
      </div>
    </div>
  );
}
