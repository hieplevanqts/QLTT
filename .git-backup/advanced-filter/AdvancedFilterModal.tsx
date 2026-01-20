import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from '../../app/components/ui/dialog';
import { Button } from '../../app/components/ui/button';
import { ConditionGroup } from './ConditionGroup';
import { FilterPresetPanel } from './FilterPresetPanel';
import {
  FilterGroup,
  FilterPreset,
  PresetScope,
  createEmptyGroup,
  generateFilterId,
} from '../../types/advancedFilter';
import { Store } from '../../data/mockStores';
import styles from './AdvancedFilterModal.module.css';

interface AdvancedFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filterGroup: FilterGroup) => void;
  initialFilter?: FilterGroup;
  currentUserId?: string;
  userRole?: 'user' | 'unit_manager' | 'admin';
}

const STORAGE_KEY = 'mappa_filter_presets';

export function AdvancedFilterModal({
  open,
  onOpenChange,
  onApplyFilter,
  initialFilter,
  currentUserId = 'current_user',
  userRole = 'user',
}: AdvancedFilterModalProps) {
  const [filterGroup, setFilterGroup] = useState<FilterGroup>(
    initialFilter || createEmptyGroup()
  );
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  // Load presets from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPresets(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  }, []);

  // Save presets to localStorage
  const savePresetsToStorage = (newPresets: FilterPreset[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  };

  const handleApply = () => {
    onApplyFilter(filterGroup);
    onOpenChange(false);
  };

  const handleReset = () => {
    setFilterGroup(createEmptyGroup());
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleSavePreset = (name: string, description: string, scope: PresetScope) => {
    const newPreset: FilterPreset = {
      id: generateFilterId(),
      name,
      description,
      filter: filterGroup,
      scope,
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isStandard: scope === 'unit' && (userRole === 'unit_manager' || userRole === 'admin'),
    };

    savePresetsToStorage([...presets, newPreset]);
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setFilterGroup(preset.filter);
  };

  const handleDeletePreset = (presetId: string) => {
    const newPresets = presets.filter(p => p.id !== presetId);
    savePresetsToStorage(newPresets);
  };

  const handleSharePreset = (presetId: string) => {
    // Generate shareable link (mock implementation)
    const shareUrl = `${window.location.origin}/registry/stores?preset=${presetId}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Đã copy link chia sẻ vào clipboard!');
    }).catch(() => {
      alert(`Link chia sẻ: ${shareUrl}`);
    });
  };

  // Check if filter has conditions
  const hasConditions = 
    filterGroup.conditions.length > 0 || 
    filterGroup.groups.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className={styles.modalContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.headerIcon}>
                <Filter size={24} />
              </div>
              <div>
                <h2 className={styles.title}>Lọc nâng cao</h2>
                <p className={styles.subtitle}>
                  Xây dựng điều kiện lọc chính xác với logic AND/OR
                </p>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={handleCancel}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Left Panel - Filter Builder */}
            <div className={styles.filterPanel}>
              <div className={styles.filterBuilder}>
                <ConditionGroup
                  group={filterGroup}
                  onUpdate={setFilterGroup}
                  level={0}
                />
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <div className={styles.actionsLeft}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={!hasConditions}
                  >
                    <RotateCcw size={16} />
                    Reset
                  </Button>
                </div>
                <div className={styles.actionsRight}>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <Button size="sm" onClick={handleApply}>
                    <Check size={16} />
                    Áp dụng bộ lọc
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel - Saved Presets */}
            <div className={styles.presetsPanel}>
              <div className={styles.presetsPanelHeader}>
                <h3 className={styles.presetsPanelTitle}>Bộ lọc đã lưu</h3>
              </div>
              <FilterPresetPanel
                presets={presets}
                onLoadPreset={handleLoadPreset}
                onSavePreset={handleSavePreset}
                onDeletePreset={handleDeletePreset}
                onSharePreset={handleSharePreset}
                currentUserId={currentUserId}
                userRole={userRole}
              />
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

/**
 * Helper function to apply filter to stores array
 */
export function applyAdvancedFilter(stores: Store[], filterGroup: FilterGroup): Store[] {
  return stores.filter(store => evaluateGroup(store, filterGroup));
}

function evaluateGroup(store: Store, group: FilterGroup): boolean {
  const conditionResults = group.conditions.map(condition => 
    evaluateCondition(store, condition)
  );

  const groupResults = group.groups.map(childGroup => 
    evaluateGroup(store, childGroup)
  );

  const allResults = [...conditionResults, ...groupResults];

  if (group.logic === 'AND') {
    return allResults.every(result => result);
  } else {
    return allResults.some(result => result);
  }
}

function evaluateCondition(store: any, condition: any): boolean {
  if (!condition.field || condition.value === null || condition.value === undefined) {
    return true; // Empty condition always passes
  }

  const fieldValue = getFieldValue(store, condition.field);
  const conditionValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === conditionValue;
    
    case 'notEquals':
      return fieldValue !== conditionValue;
    
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
    
    case 'notContains':
      return !String(fieldValue).toLowerCase().includes(String(conditionValue).toLowerCase());
    
    case 'greaterThan':
      return Number(fieldValue) > Number(conditionValue);
    
    case 'lessThan':
      return Number(fieldValue) < Number(conditionValue);
    
    case 'greaterOrEqual':
      return Number(fieldValue) >= Number(conditionValue);
    
    case 'lessOrEqual':
      return Number(fieldValue) <= Number(conditionValue);
    
    case 'between':
      if (Array.isArray(conditionValue) && conditionValue.length === 2) {
        return Number(fieldValue) >= Number(conditionValue[0]) && 
               Number(fieldValue) <= Number(conditionValue[1]);
      }
      return true;
    
    case 'in':
      if (Array.isArray(conditionValue)) {
        return conditionValue.includes(fieldValue);
      }
      return true;
    
    case 'notIn':
      if (Array.isArray(conditionValue)) {
        return !conditionValue.includes(fieldValue);
      }
      return true;
    
    case 'has':
      return Boolean(fieldValue);
    
    case 'hasNot':
      return !Boolean(fieldValue);
    
    default:
      return true;
  }
}

function getFieldValue(store: Store, fieldId: string): any {
  switch (fieldId) {
    case 'status':
      return store.status;
    case 'industry':
      return store.industry;
    case 'jurisdiction':
      return store.jurisdiction;
    case 'riskLevel':
      return store.riskLevel;
    case 'createdDate':
      return store.createdAt;
    case 'updatedDate':
      return store.updatedAt;
    case 'hasViolations':
      return store.violationCount && store.violationCount > 0;
    case 'hasComplaints':
      return store.complaintCount && store.complaintCount > 0;
    case 'name':
      return store.name;
    case 'taxCode':
      return store.taxCode;
    case 'ownerName':
      return store.ownerName;
    default:
      return null;
  }
}
