import React, { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useQLTTScope } from '../../../contexts/QLTTScopeContext';
import styles from './ScopeSelector.module.css';

export function ScopeSelector() {
  const {
    scope,
    setScope,
    availableDivisions,
    availableTeams,
    availableAreas,
    isLoading,
  } = useQLTTScope();
  const [selectedDivision, setSelectedDivision] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');

  // Sync local state with scope context
  useEffect(() => {
    setSelectedDivision(scope.divisionId || '');
    setSelectedTeam(scope.teamId || '');
    setSelectedArea(scope.areaId || '');
  }, [scope.divisionId, scope.teamId, scope.areaId]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const divisionId = e.target.value || null;
    setSelectedDivision(divisionId || '');
    setSelectedTeam('');
    setSelectedArea('');

    setScope({
      divisionId,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    });
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const teamId = e.target.value || null;
    setSelectedTeam(teamId || '');
    setSelectedArea('');

    setScope({
      divisionId: selectedDivision || null,
      teamId,
      areaId: null,
      province: null,
      ward: null,
    });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const areaId = e.target.value || null;
    setSelectedArea(areaId || '');

    const area = availableAreas.find((item) => item.id === areaId);
    setScope({
      divisionId: selectedDivision || null,
      teamId: selectedTeam || null,
      areaId,
      province: area?.provinceCode || null,
      ward: area?.wardCode || null,
    });
  };

  const isDivisionDisabled = isLoading;
  const isTeamDisabled = isLoading || !selectedDivision;
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
