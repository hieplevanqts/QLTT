import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BUSINESS_TYPES } from '@/constants/businessTypes';
import { SearchableSelect, SearchableSelectOption } from './SearchableSelect';
import { NativeSelect } from './NativeSelect';
import styles from './AdvancedFilterPopup.module.css';

export interface AdvancedFilters {
  hasViolations?: 'all' | 'yes' | 'no';
  hasComplaints?: 'all' | 'yes' | 'no';
  riskLevel?: 'all' | 'low' | 'medium' | 'high' | 'none';
}

interface AdvancedFilterPopupProps {
  appliedFilters: AdvancedFilters;
  onApply: (filters: AdvancedFilters) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  iconOnly?: boolean; // New prop to show only icon
}

/**
 * AdvancedFilterPopup - Bộ lọc nâng cao dạng popup
 * 
 * Popup nổi với temp state - KHÔNG tự động đóng khi chọn giá trị
 * Chỉ apply khi user click "Áp dụng"
 * UX: Giữ popup mở để thử nhiều filter trước khi apply
 */
export function AdvancedFilterPopup({
  appliedFilters,
  onApply,
  onClear,
  hasActiveFilters,
  iconOnly,
}: AdvancedFilterPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<AdvancedFilters>(appliedFilters);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Sync temp filters when applied filters change from outside
  useEffect(() => {
    if (!isOpen) {
      setTempFilters(appliedFilters);
    }
  }, [appliedFilters, isOpen]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Kiểm tra xem click có phải vào Popover (SearchableSelect) không
      // Popover được render trong Portal, nên cần check đặc biệt
      const isClickInPopoverContent = (target as Element).closest('[data-slot="popover-content"]');
      
      if (
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(target) &&
        !buttonRef.current.contains(target) &&
        !isClickInPopoverContent // KHÔNG đóng nếu click vào SearchableSelect dropdown
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    onApply(tempFilters);
    // ❌ KHÔNG đóng popup - để user tiếp tục chọn filter nếu muốn
    // setIsOpen(false);
  };

  const handleClearLocal = () => {
    const emptyFilters: AdvancedFilters = {
      hasViolations: 'all',
      hasComplaints: 'all',
      riskLevel: 'all',
      businessType: 'all',
    };
    setTempFilters(emptyFilters);
    onClear();
    // ❌ KHÔNG đóng popup - để user thấy filters đã được clear
    // setIsOpen(false);
  };

  // Count active filters
  const activeCount = [
    appliedFilters.hasViolations,
    appliedFilters.hasComplaints,
    appliedFilters.riskLevel,
    appliedFilters.businessType,
  ]
    .filter((f) => f && f !== 'all')
    .length;

  return (
    <div className={styles.container}>
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        className={`${styles.toggleButton} ${hasActiveFilters ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <Filter size={16} />
        {iconOnly ? (
          <ChevronDown 
            size={16} 
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        ) : (
          <>
            <span>Bộ lọc</span>
            {hasActiveFilters && activeCount > 0 && (
              <span className={styles.badge}>{activeCount}</span>
            )}
            <ChevronDown 
              size={16} 
              className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            />
          </>
        )}
      </button>

      {/* Popup Card */}
      {isOpen && (
        <div ref={popupRef} className={styles.popup}>
          <div className={styles.popupHeader}>
            <h4 className={styles.popupTitle}>Bộ lọc nâng cao</h4>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              type="button"
              aria-label="Đóng"
            >
              <X size={16} />
            </button>
          </div>

          <div className={styles.popupContent}>
            {/* Vi phạm Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Vi phạm</label>
              <NativeSelect
                value={tempFilters.hasViolations || 'all'}
                onChange={(value) => 
                  setTempFilters({ ...tempFilters, hasViolations: value as AdvancedFilters['hasViolations'] })
                }
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'yes', label: 'Có vi phạm' },
                  { value: 'no', label: 'Không có vi phạm' },
                ]}
              />
            </div>

            {/* Phản ánh Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Phản ánh</label>
              <NativeSelect
                value={tempFilters.hasComplaints || 'all'}
                onChange={(value) => 
                  setTempFilters({ ...tempFilters, hasComplaints: value as AdvancedFilters['hasComplaints'] })
                }
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'yes', label: 'Có phản ánh' },
                  { value: 'no', label: 'Không có phản ánh' },
                ]}
              />
            </div>

            {/* Mức độ rủi ro Filter */}
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Mức độ rủi ro</label>
              <NativeSelect
                value={tempFilters.riskLevel || 'all'}
                onChange={(value) => 
                  setTempFilters({ ...tempFilters, riskLevel: value as AdvancedFilters['riskLevel'] })
                }
                options={[
                  { value: 'all', label: 'Tất cả mức độ' },
                  { value: 'none', label: 'Không có rủi ro' },
                  { value: 'low', label: '🟢 Thấp' },
                  { value: 'medium', label: '🟡 Trung bình' },
                  { value: 'high', label: '🔴 Cao' },
                ]}
              />
            </div>

            {/* NOTE: 'Loại kinh doanh' moved to main filter bar per UX requirement */}
          </div>

          {/* Popup Actions */}
          <div className={styles.popupActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLocal}
              className={styles.clearButton}
            >
              <X size={16} />
              Xóa tất cả
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleApply}
              className={styles.applyButton}
            >
              <Check size={16} />
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedFilterPopup;
