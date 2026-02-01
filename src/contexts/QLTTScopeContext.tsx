import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '../store/rootReducer';
import { supabase } from '@/api/supabaseClient';

export interface QLTTScope {
  divisionId: string | null; // Chi cục (departments level 2)
  teamId: string | null;     // Đội (departments level 3)
  areaId: string | null;     // areas._id
  province: string | null;   // province code (for downstream filters)
  ward: string | null;       // ward code (for downstream filters)
}

interface ScopeDepartment {
  id: string;
  parent_id: string | null;
  name: string;
  code?: string | null;
  level?: number | null;
}

interface AreaRow {
  id: string; // Mapped from _id
  _id?: string; // Original from DB
  code: string;
  name: string;
  level: string;
  province_id?: string | null;
  ward_id?: string | null;
}

interface DepartmentAreaRow {
  department_id: string;
  area_id: string;
}

interface WardRow {
  id: string;
  code: string;
  name: string;
  province_id: string;
}

interface ProvinceRow {
  id: string;
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
            .select('id:_id, parent_id, name, code, level')
            .is('deleted_at', null)
            .order('path', { ascending: true }),
          supabase
            .from('department_areas')
            .select('department_id, area_id'),
          supabase
            .from('areas')
            .select('id:_id, code, name, level, province_id, ward_id'),
          supabase
            .from('wards')
            .select('id:_id, code, name, province_id'),
          supabase
            .from('provinces')
            .select('id:_id, code, name'),
        ]);

      

        if (!isMounted) return;

        setDepartments((departmentsData || []).map((dept: any) => ({
          id: dept.id,
          parent_id: dept.parent_id,
          name: dept.name,
          code: dept.code,
          level: dept.level,
        })));

        setDepartmentAreas(departmentAreasData || []);
        setAreas((areasData || []).map((area: any) => ({
          id: area.id,
          code: area.code,
          name: area.name,
          level: area.level,
          province_id: area.province_id,
          ward_id: area.ward_id,
        })));

        setWards((wardsData || []).map((ward: any) => ({
          id: ward.id,
          code: ward.code,
          name: ward.name,
          province_id: ward.province_id,
        })));

        setProvinces((provincesData || []).map((province: any) => ({
          id: province.id,
          code: province.code,
          name: province.name,
        })));
      } catch (error: any) {
       
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

  const metadataDepartmentId = user?.app_metadata?.department?.id || null;
  const userDepartmentId = user?.departmentInfo?.id || metadataDepartmentId || null;
  const userDepartment = userDepartmentId ? departmentsById.get(userDepartmentId) : undefined;
  const userLevel =
    user?.departmentInfo?.level
    ?? getDepartmentLevelFromCode(user?.departmentInfo?.code)
    ?? userDepartment?.level
    ?? getDepartmentLevelFromCode(userDepartment?.code);

  const userStandaloneDivision = useMemo(() => {
    if (!userDepartmentId || !userDepartment) return null;
    const hasParent = Boolean(userDepartment.parent_id);
    const hasChild = departments.some((dept) => dept.parent_id === userDepartmentId);
    if (hasParent || hasChild) return null;
    return userDepartment;
  }, [departments, userDepartment, userDepartmentId]);

  const userDivisionId = useMemo(() => {
    if (userStandaloneDivision) {
      return userStandaloneDivision.id;
    }
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
  }, [
    userStandaloneDivision,
    userDepartment,
    userLevel,
    userDepartmentId,
    user?.departmentInfo?.parent_id,
    user?.departmentInfo?.code,
    allDivisions,
  ]);

  const locks: ScopeLocks = useMemo(
    () => ({
      division: Boolean(userLevel && userLevel >= 2),
      team: Boolean(userLevel && userLevel >= 3),
    }),
    [userLevel],
  );

  const availableDivisions = useMemo(() => {
    if (userStandaloneDivision) {
      return [userStandaloneDivision];
    }
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
  }, [allDivisions, userLevel, userDepartment, userDepartmentId, userDivisionId, userStandaloneDivision]);

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
        const ward = area.ward_id ? wardsById.get(area.ward_id) : undefined;
        const provinceFromWard = ward ? provincesById.get(ward.province_id) : undefined;
        const provinceFromArea = area.province_id ? provincesById.get(area.province_id) : undefined;
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
    if (userStandaloneDivision) {
      return {
        divisionId: userStandaloneDivision.id,
        teamId: null,
        areaId: null,
        province: null,
        ward: null,
      };
    }
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
       
        // Validate saved scope structure
        if (savedScope && typeof savedScope === 'object') {
          setScope(savedScope);
          setHasInitialized(true);
          return;
        }
      }
    } catch (error) {
     
    }
    
    // If no saved scope or error, use default scope
    const defaultScope = buildDefaultScope();
   
    setScope(defaultScope);
    setHasInitialized(true);
  }, [user, isLoading, hasInitialized, userDepartment, userLevel]);

  const handleSetScope = (newScope: QLTTScope) => {
    
    setScope(newScope);
    try {
      localStorage.setItem('mappa-scope', JSON.stringify(newScope));
      
    } catch (error) {
      
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
