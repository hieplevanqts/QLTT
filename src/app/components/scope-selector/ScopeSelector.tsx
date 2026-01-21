import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useQLTTScope } from '../../../contexts/QLTTScopeContext';
import { useAppDispatch, useQLTTScope as useReduxQLTTScope } from '../../hooks';
import { setScope } from '../../../store/slices/qlttScopeSlice';
import styles from './ScopeSelector.module.css';

export function ScopeSelector() {
  const {
    scope,
    setScope: setContextScope,
    availableDivisions,
    availableTeams,
    availableAreas,
    isLoading,
  } = useQLTTScope();
  
  // Redux dispatch and selector for Redux store
  const dispatch = useAppDispatch();
  const reduxScope = useReduxQLTTScope();
  
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(scope.divisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [scope.divisionId, scope.teamId, scope.areaId]);

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
                console.log('💾 ScopeSelector: Restored from localStorage and saved to Redux:', newScope);
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
    console.log('💾 ScopeSelector: Division changed and saved to Redux:', newScope);
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const rawValue = e.target.value;
    console.log('🔄 ScopeSelector: handleTeamChange - e.target.value:', rawValue);
    console.log('🔄 ScopeSelector: handleTeamChange - typeof e.target.value:', typeof rawValue);
    console.log('🔄 ScopeSelector: handleTeamChange - e.target.value === "":', rawValue === '');
    
    // 🔥 FIX: Convert empty string to null, but keep valid teamId strings
    const teamId = rawValue && rawValue.trim() !== '' ? rawValue : null;
    console.log('🔄 ScopeSelector: handleTeamChange - teamId after processing:', teamId);
    
    setSelectedTeam(teamId || '');
    setSelectedArea('');

    // 🔥 FIX: Use scope.divisionId from context instead of selectedDivision from local state
    // to ensure we have the latest value
    console.log('🔄 ScopeSelector: Current scope.divisionId:', scope.divisionId);
    
    const newScope = {
      divisionId: scope.divisionId || null,  // 🔥 FIX: Use scope.divisionId instead of selectedDivision
      teamId,
      areaId: null,
      province: null,
      ward: null,
    };
    
    console.log('🔄 ScopeSelector: setScope called with:', newScope);
    setContextScope(newScope);
    // 🔥 NEW: Save to Redux store
    dispatch(setScope(newScope));
    console.log('💾 ScopeSelector: Team changed and saved to Redux:', newScope);
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
    console.log('💾 ScopeSelector: Area changed and saved to Redux:', newScope);
  };

  const isDivisionDisabled = isLoading;
  const isTeamDisabled = isLoading || !selectedDivision;
  const isAreaDisabled = isLoading || !selectedTeam;
  
  // 🔥 DEBUG: Log availableTeams
  useEffect(() => {
    console.log('🔄 ScopeSelector: availableTeams:', availableTeams.length, availableTeams.map(t => ({ id: t.id, name: t.name })));
    console.log('🔄 ScopeSelector: scope.divisionId:', scope.divisionId);
    console.log('🔄 ScopeSelector: selectedDivision:', selectedDivision);
    console.log('🔄 ScopeSelector: selectedTeam:', selectedTeam);
  }, [availableTeams, scope.divisionId, selectedDivision, selectedTeam]);

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
          {availableDivisions.map((division) => (
            <option key={division.id} value={division.id}>
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
          {availableTeams.map((team) => (
            <option key={team.id} value={team.id}>
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
          {availableAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
