import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { Button } from '../app/components/ui/button';
import { BUSINESS_TYPES } from '../constants/businessTypes';
import { SearchableSelect, SearchableSelectOption } from './SearchableSelect';
import styles from './AdvancedFilterInline.module.css';

export interface AdvancedFilters {
  hasViolations?: 'all' | 'yes' | 'no';
  hasComplaints?: 'all' | 'yes' | 'no';
  riskLevel?: 'all' | 'low' | 'medium' | 'high' | 'none';
  businessType?: string; // 'all' or business type value
}

interface AdvancedFilterInlineProps {
  isExpanded: boolean;
  onToggle: () => void;
  appliedFilters: AdvancedFilters;
  onApply: (filters: AdvancedFilters) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export function AdvancedFilterInline({
  isExpanded,
  onToggle,
  appliedFilters,
  onApply,
  onClear,
  hasActiveFilters,
}: AdvancedFilterInlineProps) {
  // Local state for draft filters (before apply)
  const [draftFilters, setDraftFilters] = useState<AdvancedFilters>(appliedFilters);

  // Update draft when applied filters change
  React.useEffect(() => {
    setDraftFilters(appliedFilters);
  }, [appliedFilters]);

  const handleViolationChange = (value: string) => {
    setDraftFilters({
      ...draftFilters,
      hasViolations: value as AdvancedFilters['hasViolations'],
    });
  };

  const handleComplaintChange = (value: string) => {
    setDraftFilters({
      ...draftFilters,
      hasComplaints: value as AdvancedFilters['hasComplaints'],
    });
  };

  const handleRiskLevelChange = (value: string) => {
    setDraftFilters({
      ...draftFilters,
      riskLevel: value as AdvancedFilters['riskLevel'],
    });
  };

  const handleBusinessTypeChange = (value: string) => {
    setDraftFilters({
      ...draftFilters,
      businessType: value as AdvancedFilters['businessType'],
    });
  };

  const handleApply = () => {
    onApply(draftFilters);
  };

  const handleClearLocal = () => {
    const emptyFilters: AdvancedFilters = {
      hasViolations: 'all',
      hasComplaints: 'all',
      riskLevel: 'all',
      businessType: 'all',
    };
    setDraftFilters(emptyFilters);
    onClear();
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

  // Prepare business type options for SearchableSelect
  const businessTypeOptions: SearchableSelectOption[] = [
    { value: 'all', label: 'Tất cả loại kinh doanh' },
    ...BUSINESS_TYPES.map((type) => ({
      value: type.value,
      label: type.label,
    })),
  ];

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant={hasActiveFilters ? 'default' : 'outline'}
        size="sm"
        onClick={onToggle}
        className={styles.toggleButton}
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Lọc nâng cao
        {hasActiveFilters && activeCount > 0 && (
          <span className={styles.badge}>{activeCount}</span>
        )}
      </Button>

      {/* Expanded Filters - NO BOX, just inline fields */}
      {isExpanded && (
        <>
          {/* Vi phạm Filter */}
          <Select
            value={draftFilters.hasViolations || 'all'}
            onValueChange={handleViolationChange}
          >
            <SelectTrigger style={{ width: '180px' }}>
              <SelectValue placeholder="Vi phạm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (Vi phạm)</SelectItem>
              <SelectItem value="yes">Có vi phạm</SelectItem>
              <SelectItem value="no">Không có vi phạm</SelectItem>
            </SelectContent>
          </Select>

          {/* Phản ánh Filter */}
          <Select
            value={draftFilters.hasComplaints || 'all'}
            onValueChange={handleComplaintChange}
          >
            <SelectTrigger style={{ width: '180px' }}>
              <SelectValue placeholder="Phản ánh" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả (Phản ánh)</SelectItem>
              <SelectItem value="yes">Có phản ánh</SelectItem>
              <SelectItem value="no">Không có phản ánh</SelectItem>
            </SelectContent>
          </Select>

          {/* Mức độ rủi ro Filter */}
          <Select
            value={draftFilters.riskLevel || 'all'}
            onValueChange={handleRiskLevelChange}
          >
            <SelectTrigger style={{ width: '180px' }}>
              <SelectValue placeholder="Mức độ rủi ro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="none">Không có rủi ro</SelectItem>
              <SelectItem value="low">
                <div className={styles.riskOption}>
                  <div className={`${styles.riskDot} ${styles.riskLow}`} />
                  Thấp
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className={styles.riskOption}>
                  <div className={`${styles.riskDot} ${styles.riskMedium}`} />
                  Trung bình
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className={styles.riskOption}>
                  <div className={`${styles.riskDot} ${styles.riskHigh}`} />
                  Cao
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Loại kinh doanh Filter */}
          <SearchableSelect
            value={draftFilters.businessType || 'all'}
            onValueChange={handleBusinessTypeChange}
            options={businessTypeOptions}
            placeholder="Loại kinh doanh"
            searchPlaceholder="Tìm kiếm loại kinh doanh..."
            emptyText="Không tìm thấy loại kinh doanh"
            width="220px"
          />

          {/* Action Buttons - Inline */}
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            className={styles.applyButton}
          >
            <Check size={16} />
            Áp dụng
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearLocal}
            className={styles.clearButton}
          >
            <X size={16} />
            Xoá lọc
          </Button>
        </>
      )}
    </>
  );
}

export default AdvancedFilterInline;