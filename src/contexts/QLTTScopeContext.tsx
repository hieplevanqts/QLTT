import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';
import { RootState } from '../store/rootReducer';
import { supabase } from '../lib/supabase';

export interface QLTTScope {
  divisionId: string | null; // Chi cục (departments level 2)
  teamId: string | null;     // Đội (departments level 3)
  areaId: string | null;     // areas._id
  province: string | null;   // province code (for downstream filters)
  ward: string | null;       // ward code (for downstream filters)
}

interface ScopeDepartment {
  _id: string;
  parent_id: string | null;
  name: string;
  code?: string | null;
  level?: number | null;
}

interface AreaRow {
  _id: string;
  code: string;
  name: string;
  level: string;
  provinceId?: string | null;
  wardId?: string | null;
}

interface DepartmentAreaRow {
  department_id: string;
  area_id: string;
}

interface WardRow {
  _id: string;
  code: string;
  name: string;
  province_id: string;
}

interface ProvinceRow {
  _id: string;
  code: string;
  name: string;
}

export interface ScopeArea {
  id: string;
  name: string;
  code?: string;
  wardCode?: string | null;
  provinceCode?: string | null;
}

interface ScopeLocks {
  division: boolean;
  team: boolean;
}

interface QLTTScopeContextType {
  scope: QLTTScope;
  setScope: (scope: QLTTScope) => void;
  resetScope: () => void;
  canChangeScope: boolean;
  locks: ScopeLocks;
  availableDivisions: ScopeDepartment[];
  availableTeams: ScopeDepartment[];
  availableAreas: ScopeArea[];
  getScopeDisplayText: () => string;
  isLoading: boolean;
  hasInitialized: boolean;  // 🔥 NEW: Track if scope has been initialized
}

const QLTTScopeContext = createContext<QLTTScopeContextType | undefined>(undefined);

const getDepartmentLevelFromCode = (code?: string | null): number | undefined => {
  if (!code) return undefined;
  const trimmed = code.trim();
  if (trimmed.length < 2 || trimmed.length % 2 !== 0) return undefined;
  return trimmed.length / 2;
};

export function QLTTScopeProvider({ children }: { children: ReactNode }) {
  // Get user from Redux instead of AuthContext
  const { user } = useAppSelector((state: RootState) => state.auth);

  const [scope, setScope] = useState<QLTTScope>({
    divisionId: null,
    teamId: null,
    areaId: null,
    province: null,
    ward: null,
  });

  const [departments, setDepartments] = useState<ScopeDepartment[]>([]);
  const [departmentAreas, setDepartmentAreas] = useState<DepartmentAreaRow[]>([]);
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [wards, setWards] = useState<WardRow[]>([]);
  const [provinces, setProvinces] = useState<ProvinceRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    setHasInitialized(false);
  }, [user?.username]);

  useEffect(() => {
    let isMounted = true;

    async function loadScopeData() {
      try {
        setIsLoading(true);

        const [
          { data: departmentsData, error: departmentsError },
          { data: departmentAreasData, error: departmentAreasError },
          { data: areasData, error: areasError },
          { data: wardsData, error: wardsError },
          { data: provincesData, error: provincesError },
        ] = await Promise.all([
          supabase
            .from('departments')
            .select('_id, parent_id, name, code, level')
            .is('deleted_at', null)
            .order('path', { ascending: true }),
          supabase
            .from('department_areas')
            .select('department_id, area_id'),
          supabase
            .from('areas')
            .select('_id, code, name, level, province_id, ward_id'),
          supabase
            .from('wards')
            .select('_id, code, name, province_id'),
          supabase
            .from('provinces')
            .select('_id, code, name'),
        ]);

        if (departmentsError) {
          console.error('❌ QLTTScopeContext: Failed to load departments:', departmentsError);
        }
        if (departmentAreasError) {
          console.error('❌ QLTTScopeContext: Failed to load department_areas:', departmentAreasError);
        }
        if (areasError) {
          console.error('❌ QLTTScopeContext: Failed to load areas:', areasError);
        }
        if (wardsError) {
          console.error('❌ QLTTScopeContext: Failed to load wards:', wardsError);
        }
        if (provincesError) {
          console.error('❌ QLTTScopeContext: Failed to load provinces:', provincesError);
        }

        if (!isMounted) return;

        setDepartments((departmentsData || []).map((dept) => ({
          id: dept._id,
          parent_id: dept.parent_id,
          name: dept.name,
          code: dept.code,
          level: dept.level,
        })));

        setDepartmentAreas(departmentAreasData || []);
        setAreas((areasData || []).map((area) => ({
          id: area._id,
          code: area.code,
          name: area.name,
          level: area.level,
          provinceId: area.province_id,
          wardId: area.ward_id,
        })));

        setWards((wardsData || []).map((ward) => ({
          id: ward._id,
          code: ward.code,
          name: ward.name,
          province_id: ward.province_id,
        })));

        setProvinces((provincesData || []).map((province) => ({
          id: province._id,
          code: province.code,
          name: province.name,
        })));
      } catch (error: any) {
        console.error('❌ QLTTScopeContext: Failed to load scope data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadScopeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const departmentsById = useMemo(() => {
    return new Map(departments.map((dept) => [dept.id, dept]));
  }, [departments]);

  const areasById = useMemo(() => {
    return new Map(areas.map((area) => [area.id, area]));
  }, [areas]);

  const wardsById = useMemo(() => {
    return new Map(wards.map((ward) => [ward.id, ward]));
  }, [wards]);

  const provincesById = useMemo(() => {
    return new Map(provinces.map((province) => [province.id, province]));
  }, [provinces]);

  const getDepartmentLevel = (dept: ScopeDepartment) => {
    return dept.level ?? getDepartmentLevelFromCode(dept.code);
  };

  const allDivisions = useMemo(
    () => departments.filter((dept) => getDepartmentLevel(dept) === 2),
    [departments],
  );

  const allTeams = useMemo(
    () => departments.filter((dept) => getDepartmentLevel(dept) === 3),
    [departments],
  );

  const findDivisionIdByTeamCode = (teamCode?: string | null) => {
    if (!teamCode) return null;
    const normalizedCode = teamCode.trim().toUpperCase();
    const division = allDivisions.find((dept) => {
      const divisionCode = dept.code?.trim().toUpperCase();
      return divisionCode ? normalizedCode.startsWith(divisionCode) : false;
    });
    return division?.id || null;
  };

  const userDepartmentId = user?.departmentInfo?.id || null;
  const userDepartment = userDepartmentId ? departmentsById.get(userDepartmentId) : undefined;
  const userLevel = user?.departmentInfo?.level ?? getDepartmentLevelFromCode(user?.departmentInfo?.code);

  const userDivisionId = useMemo(() => {
    if (userLevel === 2) {
      return userDepartment?.id || userDepartmentId;
    }
    if (userLevel && userLevel >= 3) {
      return userDepartment?.parent_id
        || user?.departmentInfo?.parent_id
        || findDivisionIdByTeamCode(userDepartment?.code || user?.departmentInfo?.code)
        || null;
    }
    return null;
  }, [userDepartment, userLevel, userDepartmentId, user?.departmentInfo?.parent_id, user?.departmentInfo?.code, allDivisions]);

  const locks: ScopeLocks = useMemo(
    () => ({
      division: Boolean(userLevel && userLevel >= 2),
      team: Boolean(userLevel && userLevel >= 3),
    }),
    [userLevel],
  );

  const availableDivisions = useMemo(() => {
    if (!userLevel || userLevel <= 1) {
      return allDivisions;
    }
    if (userLevel === 2) {
      const divisionId = userDepartment?.id || userDepartmentId;
      return divisionId ? allDivisions.filter((dept) => dept.id === divisionId) : [];
    }
    if (userLevel >= 3 && userDivisionId) {
      return allDivisions.filter((dept) => dept.id === userDivisionId);
    }
    return [];
  }, [allDivisions, userLevel, userDepartment, userDepartmentId, userDivisionId]);

  const availableTeams = useMemo(() => {
    if (!scope.divisionId) return [];
    const division = departmentsById.get(scope.divisionId);
    const divisionCode = division?.code?.trim().toUpperCase() || null;
    const teamsInDivision = allTeams.filter((team) => {
      if (team.parent_id && team.parent_id === scope.divisionId) {
        return true;
      }
      if (divisionCode && team.code) {
        return team.code.trim().toUpperCase().startsWith(divisionCode);
      }
      return false;
    });

    if (userLevel && userLevel >= 3 && userDepartment) {
      return teamsInDivision.filter((team) => team.id === userDepartment.id);
    }
    return teamsInDivision;
  }, [allTeams, scope.divisionId, userLevel, userDepartment, departmentsById]);

  const departmentAreasByDepartment = useMemo(() => {
    const map = new Map<string, string[]>();
    departmentAreas.forEach((item) => {
      if (!map.has(item.department_id)) {
        map.set(item.department_id, []);
      }
      map.get(item.department_id)!.push(item.area_id);
    });
    return map;
  }, [departmentAreas]);

  const availableAreas = useMemo(() => {
    if (!scope.teamId) return [];
    const areaIds = departmentAreasByDepartment.get(scope.teamId) || [];
    return areaIds
      .map((areaId) => areasById.get(areaId))
      .filter((area): area is AreaRow => Boolean(area))
      .map((area) => {
        const ward = area.wardId ? wardsById.get(area.wardId) : undefined;
        const provinceFromWard = ward ? provincesById.get(ward.province_id) : undefined;
        const provinceFromArea = area.provinceId ? provincesById.get(area.provinceId) : undefined;
        return {
          id: area.id,
          name: ward?.name || area.name,
          code: area.code,
          wardCode: ward?.code || null,
          provinceCode: provinceFromWard?.code || provinceFromArea?.code || null,
        };
      });
  }, [scope.teamId, departmentAreasByDepartment, areasById, wardsById, provincesById]);

  const buildDefaultScope = (): QLTTScope => {
    if (userLevel === 2) {
      return {
        divisionId: userDepartment?.id || userDepartmentId,
        teamId: null,
        areaId: null,
        province: null,
        ward: null,
      };
    }

    if (userLevel && userLevel >= 3) {
      return {
        divisionId: userDepartment?.parent_id
          || user?.departmentInfo?.parent_id
          || findDivisionIdByTeamCode(userDepartment?.code || user?.departmentInfo?.code)
          || null,
        teamId: userDepartment?.id || userDepartmentId,
        areaId: null,
        province: null,
        ward: null,
      };
    }

    return {
      divisionId: null,
      teamId: null,
      areaId: null,
      province: null,
      ward: null,
    };
  };

  useEffect(() => {
    if (!user || isLoading || hasInitialized) return;
    
    // 🔥 FIX: Try to load scope from localStorage first
    try {
      const savedScopeStr = localStorage.getItem('mappa-scope');
      if (savedScopeStr) {
        const savedScope = JSON.parse(savedScopeStr) as QLTTScope;
        console.log('🔄 QLTTScopeContext: Loading scope from localStorage:', savedScope);
        // Validate saved scope structure
        if (savedScope && typeof savedScope === 'object') {
          setScope(savedScope);
          setHasInitialized(true);
          return;
        }
      }
    } catch (error) {
      console.error('❌ QLTTScopeContext: Failed to load scope from localStorage:', error);
    }
    
    // If no saved scope or error, use default scope
    const defaultScope = buildDefaultScope();
    console.log('🔄 QLTTScopeContext: Using default scope:', defaultScope);
    setScope(defaultScope);
    setHasInitialized(true);
  }, [user, isLoading, hasInitialized, userDepartment, userLevel]);

  const handleSetScope = (newScope: QLTTScope) => {
    console.log('🔄 QLTTScopeContext: handleSetScope called with:', newScope);
    setScope(newScope);
    try {
      localStorage.setItem('mappa-scope', JSON.stringify(newScope));
      console.log('✅ QLTTScopeContext: Scope saved to localStorage');
    } catch (error) {
      console.error('❌ QLTTScopeContext: Failed to save scope to localStorage:', error);
    }
  };

  const resetScope = () => {
    const defaultScope = buildDefaultScope();
    setScope(defaultScope);
  };

  const getScopeDisplayText = () => {
    const divisionName = scope.divisionId ? departmentsById.get(scope.divisionId)?.name : null;
    const teamName = scope.teamId ? departmentsById.get(scope.teamId)?.name : null;
    const areaName = scope.areaId
      ? availableAreas.find((area) => area.id === scope.areaId)?.name || areasById.get(scope.areaId)?.name
      : null;

    const parts = [divisionName, teamName, areaName].filter(Boolean);
    return parts.length > 0 ? parts.join(' / ') : 'Toàn quốc';
  };

  const canChangeScope = Boolean(userLevel && userLevel <= 2);

  return (
    <QLTTScopeContext.Provider
      value={{
        scope,
        setScope: handleSetScope,
        resetScope,
        canChangeScope,
        locks,
        availableDivisions,
        availableTeams,
        availableAreas,
        getScopeDisplayText,
        isLoading,
        hasInitialized,  // 🔥 NEW: Export hasInitialized
      }}
    >
      {children}
    </QLTTScopeContext.Provider>
  );
}

export function useQLTTScope() {
  const context = useContext(QLTTScopeContext);
  if (context === undefined) {
    throw new Error('useQLTTScope must be used within a QLTTScopeProvider');
  }
  return context;
}
