import React, { useState, forwardRef, useEffect } from 'react';
import { ShieldCheck, Flame, Calendar, Check, X, Store, Coffee, Utensils, Soup, Croissant, UtensilsCrossed, Plus, Minus, MapPin, ChevronDown, Search, Save, Building2 } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { PointStatus } from '../../../utils/api/pointStatusApi';
import { Category } from '../../../utils/api/categoriesApi';
import { Department } from '../../../utils/api/departmentsApi';
import { fetchProvinces, fetchWardsByProvinceId, ProvinceApiData, WardApiData } from '../../../utils/api/locationsApi';

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
    selectedProvince,
    selectedDistrict,
    selectedWard,
    onFilterChange,
    onBusinessTypeFilterChange,
    onBusinessTypeToggleAll,
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

    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [businessTypeSearch, setBusinessTypeSearch] = useState('');
    const [provinceSearch, setProvinceSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [provincesDB, setProvincesDB] = useState<ProvinceApiData[]>([]);
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingWards, setIsLoadingWards] = useState(false);
    const [districtsDB, setDistrictsDB] = useState<any[]>([]);
    const [wardsDB, setWardsDB] = useState<WardApiData[]>([]);

    // Load danh sách tỉnh khi mở panel
    useEffect(() => {
      const loadProvinces = async () => {
        if (!isOpen) return;
        setIsLoadingProvinces(true);
        try {
          const data = await fetchProvinces();
          setProvincesDB(data);
        } catch (error) {
          console.error('Error loading provinces:', error);
        } finally {
          setIsLoadingProvinces(false);
        }
      };
      loadProvinces();
    }, [isOpen]);

    // Load danh sách xã khi chọn tỉnh
    useEffect(() => {
      const fetchWards = async () => {
        if (selectedProvince) {
          setIsLoadingWards(true);
          try {
            const data = await fetchWardsByProvinceId(selectedProvince);
            setWardsDB(data);
          } catch (error) {
            console.error('Error loading wards:', error);
            setWardsDB([]);
          } finally {
            setIsLoadingWards(false);
          }
        } else {
          setWardsDB([]);
        }
      };

      fetchWards();
    }, [selectedProvince]);

    if (!isOpen) return null;

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // const availableDistricts = selectedProvince
    //   ? getWardsByProvinceFromDb(selectedProvince).map(d => d._id)
    //   : [];

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

    const businessTypeIconMap: { [key: string]: { icon: typeof Store, color: string } } = {
      'Nhà hàng': { icon: UtensilsCrossed, color: '#6366f1' },
      'Quán cà phê': { icon: Coffee, color: '#ec4899' },
      'Quán ăn nhanh': { icon: Utensils, color: '#f97316' },
      'Quán phở': { icon: Soup, color: '#34d399' }
    };

    const businessTypeData = (categories || []).map(cat => ({
      key: cat._id,
      label: cat.name,
      icon: businessTypeIconMap[cat.name]?.icon || Store,
      color: businessTypeIconMap[cat.name]?.color || '#9ca3af'
    }));

    const filteredBusinessTypes = businessTypeSearch.trim()
      ? businessTypeData.filter(i => i.label.toLowerCase().includes(businessTypeSearch.toLowerCase()))
      : businessTypeData;
// console.log('selectedWard', selectedWard);
// console.log('selectedDistrict', selectedDistrict);
// console.log('selectedProvince', selectedProvince);
    return (
      <div className={styles.panel} ref={ref}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bộ lọc</h3>
          <div className={styles.resultCount}>{filteredCount} điểm</div>
          <button className={styles.closeButton} onClick={onClose}><X size={16} /></button>
        </div>

        <div className={styles.scrollableContent}>
          <div className={styles.filterSection}>
            <button className={styles.sectionHeader} onClick={() => toggleSection('category')}>
              <div className={styles.sectionTitle}>Phân loại</div>
              {expandedSections.category ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div className={`${styles.filterList} ${expandedSections.category ? styles.filterListExpanded : styles.filterListCollapsed}`}>
              {categoryData.map(({ key, label, icon: Icon, color }) => (
                <label key={key} className={styles.filterItem}>
                  <div className={styles.checkboxWrapper}>
                    <input type="checkbox" checked={filters[key]} onChange={() => onFilterChange(key)} className={styles.checkbox} />
                    <div className={styles.customCheckbox} style={{ borderColor: filters[key] ? color : undefined }}>
                      {filters[key] && <div className={styles.checkmark} style={{ background: color }}><Check size={10} color="white" /></div>}
                    </div>
                  </div>
                  <Icon size={16} style={{ color }} />
                  <span className={styles.filterLabel}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <button className={styles.sectionHeader} onClick={() => toggleSection('location')}>
              <div className={styles.sectionTitle}><MapPin size={16} /> Vị trí</div>
              {expandedSections.location ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div className={`${styles.filterList} ${expandedSections.location ? styles.filterListExpanded : styles.filterListCollapsed}`}>

              <div className={styles.locationDropdownWrapper}>
                <button type="button" onClick={() => setShowProvinceDropdown(!showProvinceDropdown)} className={styles.locationSelect} disabled={isLoadingProvinces}>
                  <span className={selectedProvince ? styles.locationSelectValue : styles.locationSelectPlaceholder}>
                    {isLoadingProvinces ? 'Đang tải...' : (provincesDB.find(p => p._id === selectedProvince)?.name || 'Chọn Tỉnh')}
                  </span>
                  <ChevronDown size={16} />
                </button>
                {showProvinceDropdown && !isLoadingProvinces && (
                  <div className={styles.locationDropdown}>
                    <div className={styles.locationSearchWrapper}>
                      <Search size={16} />
                      <input type="text" value={provinceSearch} onChange={(e) => setProvinceSearch(e.target.value)} placeholder="Tìm kiếm..." className={styles.locationSearchInput} />
                    </div>
                    <button className={styles.locationOption} onClick={() => { onProvinceChange?.(''); onWardChange?.(''); setShowProvinceDropdown(false); }}>Tất cả</button>
                    {provincesDB.filter(p => p.name.toLowerCase().includes(provinceSearch.toLowerCase())).map(p => (
                      <button key={p._id} className={styles.locationOption} onClick={() => { onProvinceChange?.(p._id); onWardChange?.(''); setShowProvinceDropdown(false); }}>{p.name}</button>
                    ))}
                  </div>
                )}
              </div>

              {selectedProvince && (
                <div className={styles.locationDropdownWrapper} style={{ marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowDistrictDropdown(!showDistrictDropdown)} className={styles.locationSelect} disabled={isLoadingWards}>
                    <span className={selectedWard ? styles.locationSelectValue : styles.locationSelectPlaceholder}>
                      {isLoadingWards ? 'Đang tải...' : (wardsDB.find(w => w._id === selectedWard)?.name || 'Chọn Xã')}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                  {showDistrictDropdown && !isLoadingWards && (
                    <div className={styles.locationDropdown}>
                      <div className={styles.locationSearchWrapper}>
                        <Search size={16} />
                        <input type="text" value={districtSearch} onChange={(e) => setDistrictSearch(e.target.value)} placeholder="Tìm kiếm..." className={styles.locationSearchInput} />
                      </div>
                      <button className={styles.locationOption} onClick={() => { onWardChange?.(''); setShowDistrictDropdown(false); }}>Tất cả</button>
                      {wardsDB.filter(w => w.name.toLowerCase().includes(districtSearch.toLowerCase())).map(w => (
                        <button key={w._id} className={styles.locationOption} onClick={() => { 
                          onWardChange?.(w._id); 
                          setShowDistrictDropdown(false);
                        }}>{w.name}</button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.filterSection}>
            <button className={styles.sectionHeader} onClick={() => toggleSection('businessType')}>
              <div className={styles.sectionTitle}>Loại hình kinh doanh</div>
              {expandedSections.businessType ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <div className={`${styles.filterList} ${expandedSections.businessType ? styles.filterListExpanded : styles.filterListCollapsed}`}>
              <div className={styles.searchWrapper}>
                <Search size={16} />
                <input type="text" value={businessTypeSearch} onChange={(e) => setBusinessTypeSearch(e.target.value)} placeholder="Tìm kiếm..." className={styles.searchInput} />
              </div>
              {filteredBusinessTypes.map(({ key, label, icon: Icon, color }) => (
                <label key={key} className={styles.filterItem}>
                  <div className={styles.checkboxWrapper}>
                    <input type="checkbox" checked={businessTypeFilters[key] || false} onChange={() => onBusinessTypeFilterChange(key)} className={styles.checkbox} />
                    <div className={styles.customCheckbox} style={{ borderColor: businessTypeFilters[key] ? color : undefined }}>
                      {businessTypeFilters[key] && <div className={styles.checkmark} style={{ background: color }}><Check size={10} color="white" /></div>}
                    </div>
                  </div>
                  <Icon size={16} style={{ color }} />
                  <span className={styles.filterLabel}>{label}</span>
                </label>
              ))}
            </div>
          </div>
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