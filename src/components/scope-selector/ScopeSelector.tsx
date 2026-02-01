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
  const [isValidUserScope, setIsValidUserScope] = useState<boolean>(false);
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  const fallbackDivisionId =
    !scope.divisionId && scope.teamId && availableDivisions.length === 1
      ? availableDivisions[0].id
      : null;
  const effectiveDivisionId = scope.divisionId || fallbackDivisionId;

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(effectiveDivisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [effectiveDivisionId, scope.teamId, scope.areaId]);

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

        if (userDeptId) {
          try {
            // (2) Call API lấy department theo _id = department của user
            const userDept = await fetchDepartmentById(userDeptId);

            if (userDept) {
              let divisionIdToSet = userDept._id;
              let teamIdToSet = null;
              let isMember = false;

              // (1) Call API lấy department theo parent_id = department của user (nếu có)
              if (userDept.parent_id) {
                const parentDept = await fetchDepartmentById(userDept.parent_id);
                
                if (parentDept) {
                  // Cả 2 đều có giá trị -> Active bình thường (User là Team Member)
                  divisionIdToSet = parentDept._id;
                  teamIdToSet = userDept._id;
                  isMember = true;
                } else {
                  // (1) không có giá trị -> Đưa giá trị (2) thay cho (1) (User là Division Member hoặc root)
                  divisionIdToSet = userDept._id;
                  teamIdToSet = null;
                  isMember = false;
                }
              } else {
                // Không có parent -> Đưa giá trị (2) thay cho (1)
                divisionIdToSet = userDept._id;
                teamIdToSet = null;
                isMember = false;
              }

              // Apply scope changes
              setIsTeamMember(isMember);
              setIsValidUserScope(true);

              let newScope = { ...scope };
              let hasChanges = false;

              if (scope.divisionId !== divisionIdToSet) {
                newScope.divisionId = divisionIdToSet;
                // Reset team if division changes and user is not a team member (Division Manager view)
                if (!isMember) newScope.teamId = null;
                hasChanges = true;
              }

              if (isMember && scope.teamId !== teamIdToSet) {
                newScope.teamId = teamIdToSet;
                hasChanges = true;
              }

              if (hasChanges) {
                setContextScope(newScope);
                dispatch(setScope(newScope));
              }
            } else {
              // Trường hợp cả 2 đều không tồn tại (userDept fetch fail) -> Không active, không disable
              setIsValidUserScope(false);
            }
          } catch (error) {
            console.error('Error enforcing user scope:', error);
            setIsValidUserScope(false);
          }
        }
      }
    };
    enforceUserScope();
  }, [user, isLoading, scope, setContextScope, dispatch]);

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

  // Ensure division is active when only team is provided
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
