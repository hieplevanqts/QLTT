import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Province, Ward } from '../data/qltt-structure';
import { fetchProvinces, fetchAllWards, ProvinceApiData, WardApiData } from '../utils/api/locationsApi';

export interface QLTTScope {
  province: string | null;    // null = "Toàn quốc"
  ward: string | null;        // null = "Tất cả xã/phường"
}

export type { Province, Ward };

interface QLTTScopeContextType {
  scope: QLTTScope;
  setScope: (scope: QLTTScope) => void;
  canChangeScope: boolean;
  availableProvinces: Province[];
  getScopeDisplayText: () => string;
}

const QLTTScopeContext = createContext<QLTTScopeContextType | undefined>(undefined);

export function QLTTScopeProvider({ children }: { children: ReactNode }) {
  const authContext = useAuth();
  const user = authContext?.user || null;
  
  // 🔥 Default to Hà Nội (code: '01') instead of "Toàn quốc"
  const [scope, setScope] = useState<QLTTScope>({
    province: '01',  // Hà Nội code
    ward: null,
  });

  // 🔥 NEW: State for provinces and wards from API
  const [provincesData, setProvincesData] = useState<ProvinceApiData[]>([]);
  const [wardsData, setWardsData] = useState<WardApiData[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  // Determine if user can change scope based on their role
  const canChangeScope = user?.level === 'cuc' || user?.level === 'chicuc';

  // 🔥 NEW: Fetch provinces and wards from API on mount
  useEffect(() => {
    async function loadLocations() {
      try {
        setIsLoadingLocations(true);
        
        // Fetch provinces and wards in parallel
        const [provinces, wards] = await Promise.all([
          fetchProvinces(),
          fetchAllWards(),
        ]);


        setProvincesData(provinces);
        setWardsData(wards);
      } catch (error: any) {
        console.error('❌ QLTTScopeContext: Failed to load locations:', error);
        console.error('❌ QLTTScopeContext: Error details:', {
          message: error.message,
          stack: error.stack,
        });
        // Fallback to empty arrays on error
        setProvincesData([]);
        setWardsData([]);
      } finally {
        setIsLoadingLocations(false);
      }
    }

    loadLocations();
  }, []);

  // 🔥 NEW: Transform API data to component format
  const availableProvinces = React.useMemo(() => {

    if (isLoadingLocations) {
      return [];
    }

    if (!user) {
      return [];
    }

    // Transform provinces with their wards
    const provincesWithWards: Province[] = provincesData.map((province) => {
      // Find all wards for this province by matching province_id
      const provinceWards = wardsData
        .filter(ward => {
          // 🔥 FIX: Use 'province_id' (snake_case) as that's the database field name
          const wardProvinceId = ward.province_id || (ward as any).provinceId;
          return wardProvinceId === province.id;
        })
        .map(ward => ({
          code: ward.code,
          name: ward.name,
          fullName: ward.name, // Use name as fullName if not available
        }));


      return {
        code: province.code,
        name: province.name,
        fullName: province.name, // Use name as fullName if not available
        wards: provinceWards,
      };
    });

    // Filter based on user's permission
    let filteredProvinces: Province[];
    if (user.level === 'cuc') {
      // Central admin sees all provinces
      filteredProvinces = provincesWithWards;
    } else if (user.level === 'chicuc' && user.provinceCode) {
      // Provincial director (chi cuc) sees only their province
      filteredProvinces = provincesWithWards.filter(p => p.code === user.provinceCode);
    } else {
      // Ward/Team level sees nothing (locked to their ward)
      filteredProvinces = [];
    }

    return filteredProvinces;
  }, [user, provincesData, wardsData, isLoadingLocations]);

  // Initialize scope based on user's level
  useEffect(() => {
    if (!user) return;

    // Set default scope based on user level (ALWAYS reset on user change)
    if (user.level === 'cuc') {
      // Central admin: default to Hà Nội (code: '01')
      setScope({ province: '01', ward: null });
    } else if (user.level === 'chicuc') {
      // Provincial director: locked to their province, all wards
      setScope({
        province: user.provinceCode || null,
        ward: null,
      });
    } else if (user.level === 'doi') {
      // Ward/Team level: locked to their specific ward
      setScope({
        province: user.provinceCode || null,
        ward: user.wardCode || null,
      });
    }
  }, [user]);

  // Save scope to localStorage when it changes
  const handleSetScope = (newScope: QLTTScope) => {
    setScope(newScope);
    if (canChangeScope) {
      localStorage.setItem('mappa-scope', JSON.stringify(newScope));
    }
  };

  // Generate display text for current scope
  const getScopeDisplayText = () => {
    if (!scope.province) {
      return 'Toàn quốc';
    }

    const province = availableProvinces.find(p => p.code === scope.province);
    
    // 🔥 DEBUG: Log when province not found
    if (!province) {
      
      // 🔥 FALLBACK: If still loading, show default text
      if (isLoadingLocations) {
        return 'Đang tải...';
      }
      
      // 🔥 FALLBACK: Try to get province name from raw data
      const rawProvince = provincesData.find(p => p.code === scope.province);
      if (rawProvince) {
        return `Toàn quốc / ${rawProvince.name}`;
      }
      
      return 'Toàn quốc';
    }

    // If ward is selected, show full ward info
    if (scope.ward) {
      const ward = province.wards.find(w => w.code === scope.ward);
      if (ward) {
        // Use fullName for complete address, fallback to name if fullName not available
        const wardDisplay = ward.fullName || ward.name;
        return `Toàn quốc / ${province.name} / ${wardDisplay}`;
      }
    }

    // Only province selected
    return `Toàn quốc / ${province.name}`;
  };

  return (
    <QLTTScopeContext.Provider
      value={{
        scope,
        setScope: handleSetScope,
        canChangeScope,
        availableProvinces,
        getScopeDisplayText,
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