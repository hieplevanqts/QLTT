import React from 'react';
import { MapPin, X } from 'lucide-react';
import { useQLTTScope } from '../../../contexts/QLTTScopeContext';
import { Button } from '../ui/button';
import styles from './ScopeBanner.module.css';

/**
 * ScopeBanner - Banner hiển thị phạm vi địa bàn đang áp dụng
 * 
 * Hiển thị khi người dùng đã chọn phạm vi địa bàn cụ thể (không phải "Toàn quốc")
 * Cho phép xóa bộ lọc để quay về "Toàn quốc"
 */
export function ScopeBanner() {
  const { scope, setScope, getScopeDisplayText, canChangeScope } = useQLTTScope();

  // Only show banner if a specific scope is selected
  if (!scope.province) {
    return null;
  }

  const handleClearScope = () => {
    if (canChangeScope) {
      setScope({ province: null, ward: null });
    }
  };

  return (
    <div className={styles.scopeBanner}>
      <div className={styles.scopeContent}>
        <MapPin className={styles.scopeIcon} />
        <div className={styles.scopeText}>
          <span className={styles.scopeLabel}>Đang hiển thị dữ liệu theo phạm vi:</span>
          <strong className={styles.scopeValue}>{getScopeDisplayText()}</strong>
        </div>
      </div>
      {canChangeScope && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearScope}
          className={styles.clearButton}
        >
          <X className="h-4 w-4 mr-1" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
