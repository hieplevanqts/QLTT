import React, { useState, useEffect, useMemo } from 'react';
import { Lock, MapPin } from 'lucide-react';
import { useQLTTScope } from '../../../contexts/QLTTScopeContext';
import styles from './ScopeSelector.module.css';

export function ScopeSelector() {
  const { scope, setScope, canChangeScope, availableProvinces, getScopeDisplayText } = useQLTTScope();
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');

  // Sync local state with scope context
  useEffect(() => {
    setSelectedProvince(scope.province || '');
    setSelectedWard(scope.ward || '');
  }, [scope.province, scope.ward]);

  // Get wards for selected province
  const selectedProvinceData = useMemo(() => {
    return availableProvinces.find(p => p.code === selectedProvince);
  }, [availableProvinces, selectedProvince]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();  // Prevent event bubbling
    const provinceCode = e.target.value || null;
    setSelectedProvince(provinceCode || '');
    setSelectedWard('');  // Reset ward when province changes
    
    setScope({
      province: provinceCode,
      ward: null,
    });
  };

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();  // Prevent event bubbling
    const wardCode = e.target.value || null;
    setSelectedWard(wardCode || '');
    
    setScope({
      province: selectedProvince || null,
      ward: wardCode,
    });
  };

  const displayText = getScopeDisplayText();
  const isLocked = !canChangeScope;

  return (
    <div 
      className={styles.scopeSelector} 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      data-scope-selector="true"
    >
      {isLocked ? (
        <div className={`${styles.trigger} ${styles.locked}`}>
          <MapPin className={styles.triggerIcon} size={16} />
          <span className={styles.triggerText}>{displayText}</span>
          <Lock className={styles.lockIcon} size={14} />
        </div>
      ) : (
        <div className={styles.selectWrapper}>
          <MapPin className={styles.selectIcon} size={16} />
          <select
            value={selectedProvince || ''}
            onChange={handleProvinceChange}
            className={styles.select}
            disabled={!canChangeScope}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <option value="">Toàn quốc</option>
            {availableProvinces.map(province => (
              <option key={province.code} value={province.code}>
                {province.name}
              </option>
            ))}
          </select>
          
          {selectedProvince && selectedProvinceData && selectedProvinceData.wards.length > 0 && (
            <select
              value={selectedWard || ''}
              onChange={handleWardChange}
              className={styles.select}
              disabled={!canChangeScope}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="">Tất cả xã/phường</option>
              {selectedProvinceData.wards.map(ward => (
                <option key={ward.code} value={ward.code}>
                  {ward.fullName || ward.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
