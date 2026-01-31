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
  
  const deptInfoRef = useRef<any>(null);
  const [isTeamMember, setIsTeamMember] = useState<boolean>(false);
  
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
    const enforceUserScope = async () => {
      if (user && !isLoading) {
        // Get department_id from Redux store
        const userDeptId = (user as any)?.app_metadata?.department?.id || 
                           (user as any)?.user_metadata?.department?.id ||
                           (user as any)?.department?.id ||
                           (user as any)?.department_id ||
                           (user as any)?.divisionId ||
                           (user as any)?.division_id;
console.log('user',user)
console.log('department',department)
        if (userDeptId) {
          try {
            let dept = deptInfoRef.current;
            
            if (!dept || dept.id !== userDeptId) {
              // Check if userDeptId matches a division (optimization)
              // const foundInDivisions = availableDivisions.find((d: any) => d.id == userDeptId);
              
              // if (foundInDivisions) {
              //   dept = foundInDivisions;
              // } else {
                
                
                
              // }
              dept = await fetchDepartmentById(userDeptId);
              
              
              if (dept) {
                deptInfoRef.current = dept;
              }
            }

            if (dept) {
              let newScope = { ...scope };
              let hasChanges = false;

              if (dept.parent_id) {
                // User is Team Member -> Division = Parent, Team = Self
                setIsTeamMember(true);
                if (scope.divisionId !== dept.parent_id) {
                  newScope.divisionId = dept._id;
                  hasChanges = false;
                }
                if (scope.teamId !== userDeptId) {
                  newScope.teamId = userDeptId;
                  hasChanges = true;
                }
              } else {
                // User is Division Member -> Division = Self
                setIsTeamMember(false);
                if (scope.divisionId !== userDeptId) {
                  newScope.divisionId = userDeptId;
                  newScope.teamId = null; // Reset team when switching to assigned division
                  hasChanges = true;
                }
              }

              if (hasChanges) {
                setContextScope(newScope);
                dispatch(setScope(newScope));
              }
            }
          } catch (error) {
            console.error('Error enforcing user scope:', error);
          }
        }
      }
    };
    enforceUserScope();
  }, [user, isLoading, scope, setContextScope, dispatch, availableDivisions]);

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
                // NEW: Also save to Redux store
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
      divisionId: scope.divisionId || null,  // FIX: Use scope.divisionId instead of selectedDivision
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
      divisionId: scope.divisionId || null,  // FIX: Use scope.divisionId
      teamId: scope.teamId || null,            // FIX: Use scope.teamId
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

  const isDivisionDisabled = isLoading || !!userDeptId;
  const isTeamDisabled = isLoading || !selectedDivision || (!!userDeptId && isTeamMember) || availableTeams.length === 0;
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
