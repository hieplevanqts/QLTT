import { useState, forwardRef } from 'react';
import { X, Save, ShieldCheck, Flame, Calendar, Check } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { Restaurant } from '@/utils/data/restaurantData';
import { PointStatus } from '@/utils/api/pointStatusApi';
import { Category } from '@/utils/api/categoriesApi';
import { Department } from '@/utils/api/departmentsApi';
import { CategoryFilterSection } from './CategoryFilterSection';
import { LocationFilterSection } from './LocationFilterSection';
import { BusinessTypeFilterSection } from './BusinessTypeFilterSection';

type CategoryFilter = { [key: string]: boolean };
type BusinessTypeFilter = { [key: string]: boolean };
type DepartmentFilter = { [key: string]: boolean };


interface MapFilterPanelProps {
  isOpen: boolean;
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  restaurants: Restaurant[];
  pointStatuses: PointStatus[];
  categories: Category[];
  departments: Department[];
  departmentFilters: DepartmentFilter;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  onFilterChange: (key: keyof CategoryFilter) => void;
  onBusinessTypeFilterChange: (type: string) => void;
  onBusinessTypeToggleAll: (checked: boolean) => void;
  onDepartmentFilterChange: (departmentId: string) => void;
  onDepartmentToggleAll: (checked: boolean) => void;
  onProvinceChange?: (province: string) => void;
  onDistrictChange?: (district: string) => void;
  onWardChange?: (ward: string) => void;
  filteredCount: number;
  onClose: () => void;
  onApplyFilters?: () => void;
  hasUnappliedChanges?: boolean;
  onSaveFilters?: () => void;
}

export const MapFilterPanel = forwardRef<HTMLDivElement, MapFilterPanelProps>(
  ({ 
    isOpen, 
    filters, 
    businessTypeFilters,
    restaurants,
    pointStatuses,
    categories,
    departments,
    departmentFilters,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onFilterChange, 
    onBusinessTypeFilterChange,
    onBusinessTypeToggleAll,
    onDepartmentFilterChange,
    onDepartmentToggleAll,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    filteredCount, 
    onClose,
    onApplyFilters,
    hasUnappliedChanges,
    onSaveFilters,
  }, ref) => {
    const [expandedSections, setExpandedSections] = useState({
      category: true,
      location: true,
      businessType: false,
      department: false
    });

    if (!isOpen) return null;

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Prepare category data for CategoryFilterSection
    const colorMap: { [key: string]: string } = {
      'certified': '#22c55e',
      'hotspot': '#ef4444',
      'scheduled': '#f59e0b',
      'inspected': '#005cb6',
    };

    const iconMap: { [key: string]: any } = {
      'certified': ShieldCheck,
      'hotspot': Flame,
      'scheduled': Calendar,
      'inspected': Check,
    };

    const categoryData = (pointStatuses || []).map(status => ({
      key: status.code as keyof CategoryFilter,
      label: status.name,
      icon: iconMap[status.code] || Check,
      color: colorMap[status.code] || '#005cb6',
    }));

    return (
      <div className={styles.panel} ref={ref}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bộ lọc</h3>
          <div className={styles.resultCount}>{filteredCount} điểm</div>
          <button className={styles.closeButton} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={styles.scrollableContent}>
          <CategoryFilterSection
            isExpanded={expandedSections.category}
            onToggle={() => toggleSection('category')}
            filters={filters}
            categoryData={categoryData}
            onFilterChange={onFilterChange}
          />

          <LocationFilterSection
            isExpanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
            selectedProvince={selectedProvince}
            selectedWard={selectedWard}
            onProvinceChange={onProvinceChange}
            onWardChange={onWardChange}
          />

          <BusinessTypeFilterSection
            isExpanded={expandedSections.businessType}
            onToggle={() => toggleSection('businessType')}
            businessTypeFilters={businessTypeFilters}
            categories={categories}
            onBusinessTypeFilterChange={onBusinessTypeFilterChange}
          />
        </div>

        {hasUnappliedChanges && (
          <div className={styles.applyFiltersWrapper}>
            <button className={styles.applyFiltersButton} onClick={onApplyFilters}>Áp dụng bộ lọc</button>
          </div>
        )}
        
        <div className={styles.saveFiltersWrapper}>
          <button className={styles.saveFiltersButton} onClick={onSaveFilters}>
            <Save size={16} />
            <span>Lưu bộ lọc</span>
          </button>
        </div>
      </div>
    );
  }
);

MapFilterPanel.displayName = 'MapFilterPanel';
