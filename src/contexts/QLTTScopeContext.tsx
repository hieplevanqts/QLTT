import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { VIETNAM_PROVINCES, Province, Ward } from '../data/qltt-structure';

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
  
  const [scope, setScope] = useState<QLTTScope>({
    province: null,
    ward: null,
  });

  // Determine if user can change scope based on their role
  const canChangeScope = user?.level === 'cuc' || user?.level === 'chicuc';

  // Get available provinces based on user's permission
  const availableProvinces = React.useMemo(() => {
    if (!user) return [];

    // Central admin sees all provinces
    if (user.level === 'cuc') {
      return VIETNAM_PROVINCES;
    }

    // Provincial director (chi cuc) sees only their province
    if (user.level === 'chicuc' && user.provinceCode) {
      return VIETNAM_PROVINCES.filter(p => p.code === user.provinceCode);
    }

    // Ward/Team level sees nothing (locked to their ward)
    return [];
  }, [user]);

  // Initialize scope based on user's level
  useEffect(() => {
    if (!user) return;

    // Set default scope based on user level (ALWAYS reset on user change)
    if (user.level === 'cuc') {
      // Central admin: default to "Toàn quốc"
      setScope({ province: null, ward: null });
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

    const province = VIETNAM_PROVINCES.find(p => p.code === scope.province);
    if (!province) return 'Toàn quốc';

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