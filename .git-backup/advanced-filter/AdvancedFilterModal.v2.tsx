import React, { useState, useEffect } from 'react';
import { X, Search, RotateCcw, Save, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
} from '../../app/components/ui/dialog';
import { Button } from '../../app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../app/components/ui/select';
import { FilterPresetPanel } from './FilterPresetPanel';
import {
  FilterGroup,
  FilterPreset,
  PresetScope,
  createEmptyGroup,
  generateFilterId,
  REGISTRY_FILTER_FIELDS,
} from '../../types/advancedFilter';
import { Store } from '../../data/mockStores';
import styles from './AdvancedFilterModal.v2.module.css';

interface AdvancedFilterFormData {
  name: string;
  taxCode: string;
  ownerName: string;
  status: string;
  industry: string[];
  jurisdiction: string;
  riskLevel: string;
  createdDateFrom: string;
  createdDateTo: string;
  updatedDateFrom: string;
  updatedDateTo: string;
  hasViolations: string;
  hasComplaints: string;
}

interface AdvancedFilterModalV2Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilter: (filterGroup: FilterGroup) => void;
  initialFilter?: FilterGroup;
  currentUserId?: string;
  userRole?: 'user' | 'unit_manager' | 'admin';
  resultsCount?: number;
}

const STORAGE_KEY = 'mappa_filter_presets';

export function AdvancedFilterModalV2({
  open,
  onOpenChange,
  onApplyFilter,
  initialFilter,
  currentUserId = 'current_user',
  userRole = 'user',
  resultsCount = 0,
}: AdvancedFilterModalV2Props) {
  const [formData, setFormData] = useState<AdvancedFilterFormData>({
    name: '',
    taxCode: '',
    ownerName: '',
    status: '',
    industry: [],
    jurisdiction: '',
    riskLevel: '',
    createdDateFrom: '',
    createdDateTo: '',
    updatedDateFrom: '',
    updatedDateTo: '',
    hasViolations: '',
    hasComplaints: '',
  });

  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [showPresets, setShowPresets] = useState(false);

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

  const handleInputChange = (field: keyof AdvancedFilterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: '',
      taxCode: '',
      ownerName: '',
      status: '',
      industry: [],
      jurisdiction: '',
      riskLevel: '',
      createdDateFrom: '',
      createdDateTo: '',
      updatedDateFrom: '',
      updatedDateTo: '',
      hasViolations: '',
      hasComplaints: '',
    });
  };

  const handleSearch = () => {
    const filterGroup = formDataToFilterGroup(formData);
    onApplyFilter(filterGroup);
    onOpenChange(false);
  };

  const handleSavePreset = (name: string, description: string, scope: PresetScope) => {
    const filterGroup = formDataToFilterGroup(formData);
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
    const formDataFromFilter = filterGroupToFormData(preset.filter);
    setFormData(formDataFromFilter);
    setShowPresets(false);
  };

  const handleDeletePreset = (presetId: string) => {
    const newPresets = presets.filter(p => p.id !== presetId);
    savePresetsToStorage(newPresets);
  };

  const handleSharePreset = (presetId: string) => {
    const shareUrl = `${window.location.origin}/registry/stores?preset=${presetId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Đã copy link chia sẻ vào clipboard!');
    }).catch(() => {
      alert(`Link chia sẻ: ${shareUrl}`);
    });
  };

  const hasActiveFilters = Object.values(formData).some(val => 
    Array.isArray(val) ? val.length > 0 : Boolean(val)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className={styles.modalContent}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h2 className={styles.title}>Tìm kiếm nâng cao</h2>
              <p className={styles.subtitle}>
                Tìm kiếm theo metadata và các tiêu chí chi tiết
              </p>
            </div>
            <button
              className={styles.closeButton}
              onClick={() => onOpenChange(false)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {/* Filter Form */}
            <div className={styles.filterForm}>
              <div className={styles.formGrid}>
                {/* Row 1 */}
                <div className={styles.formField}>
                  <label className={styles.label}>Tên cơ sở</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Nhập tên..."
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Mã số thuế</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Nhập mã số thuế..."
                    value={formData.taxCode}
                    onChange={(e) => handleInputChange('taxCode', e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Loại hình</label>
                  <Select
                    value={formData.industry[0] || 'all'}
                    onValueChange={(value) => handleInputChange('industry', value === 'all' ? [] : [value])}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="food">Thực phẩm</SelectItem>
                      <SelectItem value="beverage">Đồ uống</SelectItem>
                      <SelectItem value="cosmetics">Mỹ phẩm</SelectItem>
                      <SelectItem value="pharmacy">Dược phẩm</SelectItem>
                      <SelectItem value="fashion">Thời trang</SelectItem>
                      <SelectItem value="electronics">Điện tử</SelectItem>
                      <SelectItem value="furniture">Nội thất</SelectItem>
                      <SelectItem value="service">Dịch vụ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Trạng thái</label>
                  <Select
                    value={formData.status || 'all'}
                    onValueChange={(value) => handleInputChange('status', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="pending">Chờ duyệt</SelectItem>
                      <SelectItem value="suspended">Tạm ngưng</SelectItem>
                      <SelectItem value="closed">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 2 */}
                <div className={styles.formField}>
                  <label className={styles.label}>Chủ hộ</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Nhập tên..."
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Ngày tạo</label>
                  <input
                    type="date"
                    className={styles.input}
                    value={formData.createdDateFrom}
                    onChange={(e) => handleInputChange('createdDateFrom', e.target.value)}
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Địa bàn</label>
                  <Select
                    value={formData.jurisdiction || 'all'}
                    onValueChange={(value) => handleInputChange('jurisdiction', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn địa bàn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="q1">Chi cục QLTT Phường 1</SelectItem>
                      <SelectItem value="q2">Chi cục QLTT Phường 2</SelectItem>
                      <SelectItem value="q3">Chi cục QLTT Phường 3</SelectItem>
                      <SelectItem value="q7">Chi cục QLTT Phường 7</SelectItem>
                      <SelectItem value="td">Chi cục QLTT Thủ Đức</SelectItem>
                      <SelectItem value="bt">Chi cục QLTT Bình Thạnh</SelectItem>
                      <SelectItem value="tb">Chi cục QLTT Tân Bình</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Mức độ rủi ro</label>
                  <Select
                    value={formData.riskLevel || 'all'}
                    onValueChange={(value) => handleInputChange('riskLevel', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn mức độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="low">Thấp</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="high">Cao</SelectItem>
                      <SelectItem value="critical">Rất cao</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 3 */}
                <div className={styles.formField}>
                  <label className={styles.label}>Vi phạm</label>
                  <Select
                    value={formData.hasViolations || 'all'}
                    onValueChange={(value) => handleInputChange('hasViolations', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="yes">Có vi phạm</SelectItem>
                      <SelectItem value="no">Không vi phạm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Phản ánh</label>
                  <Select
                    value={formData.hasComplaints || 'all'}
                    onValueChange={(value) => handleInputChange('hasComplaints', value === 'all' ? '' : value)}
                  >
                    <SelectTrigger className={styles.select}>
                      <SelectValue placeholder="Chọn..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="yes">Có phản ánh</SelectItem>
                      <SelectItem value="no">Không phản ánh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <div className={styles.actionsLeft}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPresets(!showPresets)}
                    className={styles.presetsToggle}
                  >
                    <Save size={16} />
                    Bộ lọc đã lưu
                    {showPresets ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>
                </div>
                <div className={styles.actionsRight}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={!hasActiveFilters}
                  >
                    <RotateCcw size={16} />
                    Xóa bộ lọc
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSearch}
                  >
                    <Search size={16} />
                    Tìm kiếm
                  </Button>
                </div>
              </div>
            </div>

            {/* Collapsible Presets Panel */}
            {showPresets && (
              <div className={styles.presetsSection}>
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
            )}
          </div>

          {/* Footer - Results Count */}
          {resultsCount > 0 && (
            <div className={styles.footer}>
              <span className={styles.resultsCount}>{resultsCount} kết quả</span>
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

// Helper: Convert form data to FilterGroup
function formDataToFilterGroup(formData: AdvancedFilterFormData): FilterGroup {
  const conditions = [];

  if (formData.name) {
    conditions.push({
      id: generateFilterId(),
      field: 'name',
      operator: 'contains' as const,
      value: formData.name,
    });
  }

  if (formData.taxCode) {
    conditions.push({
      id: generateFilterId(),
      field: 'taxCode',
      operator: 'contains' as const,
      value: formData.taxCode,
    });
  }

  if (formData.ownerName) {
    conditions.push({
      id: generateFilterId(),
      field: 'ownerName',
      operator: 'contains' as const,
      value: formData.ownerName,
    });
  }

  if (formData.status) {
    conditions.push({
      id: generateFilterId(),
      field: 'status',
      operator: 'equals' as const,
      value: formData.status,
    });
  }

  if (formData.industry.length > 0) {
    conditions.push({
      id: generateFilterId(),
      field: 'industry',
      operator: 'in' as const,
      value: formData.industry,
    });
  }

  if (formData.jurisdiction) {
    conditions.push({
      id: generateFilterId(),
      field: 'jurisdiction',
      operator: 'equals' as const,
      value: formData.jurisdiction,
    });
  }

  if (formData.riskLevel) {
    conditions.push({
      id: generateFilterId(),
      field: 'riskLevel',
      operator: 'equals' as const,
      value: formData.riskLevel,
    });
  }

  if (formData.createdDateFrom || formData.createdDateTo) {
    if (formData.createdDateFrom && formData.createdDateTo) {
      conditions.push({
        id: generateFilterId(),
        field: 'createdDate',
        operator: 'between' as const,
        value: [formData.createdDateFrom, formData.createdDateTo],
      });
    } else if (formData.createdDateFrom) {
      conditions.push({
        id: generateFilterId(),
        field: 'createdDate',
        operator: 'greaterOrEqual' as const,
        value: formData.createdDateFrom,
      });
    } else if (formData.createdDateTo) {
      conditions.push({
        id: generateFilterId(),
        field: 'createdDate',
        operator: 'lessOrEqual' as const,
        value: formData.createdDateTo,
      });
    }
  }

  if (formData.hasViolations === 'yes') {
    conditions.push({
      id: generateFilterId(),
      field: 'hasViolations',
      operator: 'has' as const,
      value: true,
    });
  } else if (formData.hasViolations === 'no') {
    conditions.push({
      id: generateFilterId(),
      field: 'hasViolations',
      operator: 'hasNot' as const,
      value: false,
    });
  }

  if (formData.hasComplaints === 'yes') {
    conditions.push({
      id: generateFilterId(),
      field: 'hasComplaints',
      operator: 'has' as const,
      value: true,
    });
  } else if (formData.hasComplaints === 'no') {
    conditions.push({
      id: generateFilterId(),
      field: 'hasComplaints',
      operator: 'hasNot' as const,
      value: false,
    });
  }

  return {
    id: generateFilterId(),
    logic: 'AND',
    conditions,
    groups: [],
  };
}

// Helper: Convert FilterGroup to form data
function filterGroupToFormData(filterGroup: FilterGroup): AdvancedFilterFormData {
  const formData: AdvancedFilterFormData = {
    name: '',
    taxCode: '',
    ownerName: '',
    status: '',
    industry: [],
    jurisdiction: '',
    riskLevel: '',
    createdDateFrom: '',
    createdDateTo: '',
    updatedDateFrom: '',
    updatedDateTo: '',
    hasViolations: '',
    hasComplaints: '',
  };

  filterGroup.conditions.forEach(condition => {
    switch (condition.field) {
      case 'name':
        formData.name = condition.value;
        break;
      case 'taxCode':
        formData.taxCode = condition.value;
        break;
      case 'ownerName':
        formData.ownerName = condition.value;
        break;
      case 'status':
        formData.status = condition.value;
        break;
      case 'industry':
        formData.industry = Array.isArray(condition.value) ? condition.value : [condition.value];
        break;
      case 'jurisdiction':
        formData.jurisdiction = condition.value;
        break;
      case 'riskLevel':
        formData.riskLevel = condition.value;
        break;
      case 'createdDate':
        if (condition.operator === 'between' && Array.isArray(condition.value)) {
          formData.createdDateFrom = condition.value[0];
          formData.createdDateTo = condition.value[1];
        } else if (condition.operator === 'greaterOrEqual') {
          formData.createdDateFrom = condition.value;
        } else if (condition.operator === 'lessOrEqual') {
          formData.createdDateTo = condition.value;
        }
        break;
      case 'hasViolations':
        formData.hasViolations = condition.operator === 'has' ? 'yes' : 'no';
        break;
      case 'hasComplaints':
        formData.hasComplaints = condition.operator === 'has' ? 'yes' : 'no';
        break;
    }
  });

  return formData;
}

// Re-export filter application helper
export { applyAdvancedFilter } from './AdvancedFilterModal';