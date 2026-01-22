import React, { useState, forwardRef, useEffect } from 'react';
import { ShieldCheck, Flame, Calendar, Check, X, Store, Coffee, Utensils, Soup, Croissant, UtensilsCrossed, Plus, Minus, MapPin, ChevronDown, ChevronRight, Search, Save, Building2 } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { getProvinceNames, getProvincesFromDb, getDistrictsByProvince, getWardsByDistrict } from '../../../data/vietnamLocations';
import { PointStatus } from '../../../utils/api/pointStatusApi';
import { Category } from '../../../utils/api/categoriesApi';
import { Department, fetchMarketManagementTeams } from '../../../utils/api/departmentsApi';

type CategoryFilter = {
  [key: string]: boolean;  // Dynamic keys from point_status table
};

type BusinessTypeFilter = {
  [key: string]: boolean;
};

type DepartmentFilter = {
  [key: string]: boolean;  // department.id -> boolean
};

interface MapFilterPanelProps {
  isOpen: boolean;
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  restaurants: Restaurant[];
  pointStatuses: PointStatus[];  // 🔥 ADD: Dynamic statuses từ database
  categories: Category[];        // 🔥 ADD: Categories từ database
  departments: Department[];     // 🔥 NEW: Departments từ database
  departmentFilters: DepartmentFilter;  // 🔥 NEW: Department filters state
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  startDate?: string;            // 🔥 NEW: Date range start
  endDate?: string;              // 🔥 NEW: Date range end
  onFilterChange: (key: keyof CategoryFilter) => void;
  onBusinessTypeFilterChange: (type: string) => void;
  onBusinessTypeToggleAll: (checked: boolean) => void;  // 🔥 NEW: Toggle all business types
  onDepartmentFilterChange: (departmentId: string) => void;  // 🔥 NEW: Department filter change
  onDepartmentToggleAll: (checked: boolean) => void;  // 🔥 NEW: Toggle all departments
  onProvinceChange?: (province: string) => void;
  onDistrictChange?: (district: string) => void;
  onWardChange?: (ward: string) => void;
  filteredCount: number;
  onClose: () => void;
  onApplyFilters?: () => void;  // 🔥 NEW: Apply filters callback
  hasUnappliedChanges?: boolean;  // 🔥 NEW: Show if there are pending changes
  onSaveFilters?: () => void;  // 🔥 NEW: Save filters to localStorage callback
}
interface Province {
  _id: string;
  name: string;
}
export const MapFilterPanel = forwardRef<HTMLDivElement, MapFilterPanelProps>(
  ({
    isOpen,
    filters,
    businessTypeFilters,
    restaurants,
    pointStatuses,  // 🔥 RECEIVE: Dynamic point statuses
    categories,     // 🔥 RECEIVE: Categories from database
    departments,    // 🔥 NEW: Departments from database
    departmentFilters,  // 🔥 NEW: Department filters state
    selectedProvince,
    selectedDistrict,
    selectedWard,
    startDate,
    endDate,
    onFilterChange,
    onBusinessTypeFilterChange,
    onBusinessTypeToggleAll,  // 🔥 NEW: Toggle all business types
    onDepartmentFilterChange,  // 🔥 NEW: Department filter change
    onDepartmentToggleAll,  // 🔥 NEW: Toggle all departments
    onProvinceChange,
    onDistrictChange,
    onWardChange,
    filteredCount,
    onClose,
    onApplyFilters,  // 🔥 NEW: Apply filters callback
    hasUnappliedChanges,  // 🔥 NEW: Show if there are pending changes
    onSaveFilters,  // 🔥 NEW: Save filters to localStorage callback
  }, ref) => {
    const [expandedSections, setExpandedSections] = useState({
      category: true,
      location: true,
      businessType: false,
      department: false,  // 🔥 FIX: Add department section state
      legend: true
    });

    // 🔥 NEW: State for expanded department groups (by parent_id)
    const [expandedDepartmentGroups, setExpandedDepartmentGroups] = useState<Set<string>>(new Set());

    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [showWardDropdown, setShowWardDropdown] = useState(false);

    // 🔥 NEW: State for business type search
    const [businessTypeSearch, setBusinessTypeSearch] = useState('');

    // 🔥 NEW: State for location search
    const [provinceSearch, setProvinceSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [wardSearch, setWardSearch] = useState([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    if (!isOpen) return null;

    // 🔥 DEBUG: Log department data
    console.log('📊 MapFilterPanel: Component rendered');
    console.log('  - departments array:', departments?.length || 0, departments);
    console.log('  - departmentFilters:', departmentFilters);
    console.log('  - isOpen:', isOpen);

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    // Get location data

    const provincesDB = getProvincesFromDb();

    const availableDistricts = selectedProvince
      ? getDistrictsByProvince(selectedProvince).map(d => d.name)
      : [];
    const availableWards = selectedDistrict
      ? getWardsByDistrict(selectedDistrict).map(w => w.name)
      : [];

    // 🔥 Color mapping - HARDCODED (giữ nguyên theo design system)
    const colorMap: { [key: string]: string } = {
      'certified': '#22c55e',   // Green
      'hotspot': '#ef4444',      // Red  
      'scheduled': '#f59e0b',    // Yellow/Orange
      'inspected': '#005cb6',    // MAPPA Blue
    };

    // 🔥 Icon mapping - HARDCODED
    const iconMap: { [key: string]: any } = {
      'certified': ShieldCheck,
      'hotspot': Flame,
      'scheduled': Calendar,
      'inspected': Check,
    };

    // 🔥 Build dynamic category data from pointStatuses
    // Lấy name từ DB, nhưng màu + icon vẫn hardcoded theo code
    const categoryData = (pointStatuses || []).map(status => {
      const count = (restaurants || []).filter(r => r.category === status.code).length;

      return {
        key: status.code as keyof CategoryFilter,
        label: status.name,                           // 📦 FROM DB
        icon: iconMap[status.code] || Check,          // 🎨 HARDCODED
        color: colorMap[status.code] || '#005cb6',    // 🎨 HARDCODED
        count: count,
      };
    });

    // 🔥 Build business type data from categories table
    // Categories từ DB thay vì hardcoded uniqueBusinessTypes

    // Icon mapping for business types (vẫn hardcoded cho icons)
    const businessTypeIconMap: { [key: string]: { icon: typeof Store, color: string } } = {
      'Nhà hàng': { icon: UtensilsCrossed, color: '#6366f1' },
      'Quán cà phê': { icon: Coffee, color: '#ec4899' },
      'Quán ăn nhanh': { icon: Utensils, color: '#f97316' },
      'Quán phở': { icon: Soup, color: '#34d399' },
      'Quán bún': { icon: Soup, color: '#a78bfa' },
      'Buffet': { icon: UtensilsCrossed, color: '#fb923c' },
      'Quán lẩu': { icon: Soup, color: '#f43f5e' },
      'Bánh mì': { icon: Croissant, color: '#fbbf24' }
    };

    // Build business type data from categories
    // 🔥 FIX: Use category.id as key (for API filtering), but display category.name
    const businessTypeData = (categories || []).map(category => ({
      key: category._id,  // 🔥 Changed to category.id for API
      label: category.name,                                  // 📦 FROM DB
      icon: businessTypeIconMap[category.name]?.icon || Store,  // 🎨 HARDCODED (fallback to Store)
      color: businessTypeIconMap[category.name]?.color || '#9ca3af',  // 🎨 HARDCODED
      count: (restaurants || []).filter(r => r.businessType === category.name).length
    }));

    // 🔥 NEW: Separate "Tất cả" from other business types
    const allCategoryItem = businessTypeData.find(item => item.label === 'Tất cả');
    const otherBusinessTypes = businessTypeData.filter(item => item.label !== 'Tất cả');

    // 🔥 NEW: Calculate if all business types are selected
    const allBusinessTypesSelected = otherBusinessTypes.length > 0 &&
      otherBusinessTypes.every(item => businessTypeFilters[item.key] !== false);

    // 🔥 NEW: Filter business types by search query
    const filteredBusinessTypeData = businessTypeSearch.trim()
      ? otherBusinessTypes.filter(item =>
        item.label.toLowerCase().includes(businessTypeSearch.toLowerCase())
      )
      : otherBusinessTypes;

    // 🔥 NEW: Build department tree recursively by parent_id
    interface DepartmentNode extends Department {
      children: DepartmentNode[];
    }

    const buildDepartmentTree = (): DepartmentNode[] => {
      const deptMap = new Map<string, DepartmentNode>();
      const rootNodes: DepartmentNode[] = [];

      // First pass: create all nodes
      (departments || []).forEach((dept) => {
        deptMap.set(dept.id, { ...dept, children: [] });
      });

      // Second pass: build tree structure
      (departments || []).forEach((dept) => {
        const node = deptMap.get(dept.id)!;
        if (dept.parent_id && deptMap.has(dept.parent_id)) {
          // Has parent in the list - add to parent's children
          const parent = deptMap.get(dept.parent_id)!;
          parent.children.push(node);
        } else {
          // No parent or parent not in list - it's a root node
          rootNodes.push(node);
        }
      });

      // Sort recursively
      const sortNode = (node: DepartmentNode) => {
        node.children.sort((a, b) => a.name.localeCompare(b.name));
        node.children.forEach(sortNode);
      };
      rootNodes.forEach(sortNode);
      rootNodes.sort((a, b) => a.name.localeCompare(b.name));

      return rootNodes;
    };

    const departmentTree = buildDepartmentTree();

    // Convert tree to flat structure for rendering
    const flattenTreeForRender = (nodes: DepartmentNode[]): {
      rootDepartments: Department[];
      groupedDepartments: Array<{ parent: Department; children: Department[] }>;
    } => {
      const rootDepartments: Department[] = [];
      const groupedDepartments: Array<{ parent: Department; children: Department[] }> = [];

      nodes.forEach((node) => {
        if (node.children.length > 0) {
          // Has children - create group
          groupedDepartments.push({
            parent: node,
            children: node.children.map(child => {
              // Flatten children recursively
              const childData: Department = { ...child };
              return childData;
            })
          });
        } else {
          // No children - add to root
          rootDepartments.push(node);
        }
      });

      return { rootDepartments, groupedDepartments };
    };

    const { rootDepartments, groupedDepartments } = flattenTreeForRender(departmentTree);

    // 🔥 NEW: Toggle department group expand/collapse
    const toggleDepartmentGroup = (parentId: string) => {
      setExpandedDepartmentGroups((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(parentId)) {
          newSet.delete(parentId);
        } else {
          newSet.add(parentId);
        }
        return newSet;
      });
    };

    // 🔥 NEW: Check if all departments in a group are selected
    const isGroupAllSelected = (deptIds: string[]) => {
      return deptIds.every(id => departmentFilters[id] !== false);
    };

    // 🔥 NEW: Toggle all departments in a group
    const toggleGroupAll = (deptIds: string[], checked: boolean) => {
      deptIds.forEach(id => {
        if (departmentFilters[id] === !checked) {
          onDepartmentFilterChange(id);
        }
      });
    };

    return (
      <div className={styles.panel} ref={ref}>
        <div className={styles.header}>
          <h3 className={styles.title}>Bộ lọc</h3>
          <div className={styles.resultCount}>
            {filteredCount} điểm
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Đóng">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.scrollableContent}>
          {/* Filter Checkboxes */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection('category')}
              aria-expanded={expandedSections.category}
            >
              <div className={styles.sectionTitle}>Phân loại</div>
              {expandedSections.category ? (
                <Minus size={16} className={styles.toggleIcon} />
              ) : (
                <Plus size={16} className={styles.toggleIcon} />
              )}
            </button>
            <div className={`${styles.filterList} ${expandedSections.category ? styles.filterListExpanded : styles.filterListCollapsed}`}>
              {categoryData.map(({ key, label, icon: Icon, color, count }) => (
                <label key={key} className={styles.filterItem}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={filters[key]}
                      onChange={() => onFilterChange(key)}
                      className={styles.checkbox}
                    />
                    <div
                      className={styles.customCheckbox}
                      style={{ borderColor: filters[key] ? color : undefined }}
                    >
                      {filters[key] && (
                        <div className={styles.checkmark} style={{ background: color }}>
                          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <Icon size={15} style={{ color }} />
                  <span className={styles.filterLabel}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection('location')}
              aria-expanded={expandedSections.location}
            >
              <div className={styles.sectionTitle}>
                <MapPin size={14} style={{ display: 'inline-block', marginRight: '6px' }} />
                Lọc theo địa bàn
              </div>
              {expandedSections.location ? (
                <Minus size={16} className={styles.toggleIcon} />
              ) : (
                <Plus size={16} className={styles.toggleIcon} />
              )}
            </button>
            <div className={`${styles.filterList} ${expandedSections.location ? styles.filterListExpanded : styles.filterListCollapsed}`}>
              {/* Province Dropdown */}
              <div className={styles.locationDropdownWrapper}>
                <button
                  type="button"
                  onClick={() => {
                    setShowProvinceDropdown(!showProvinceDropdown);
                    setShowDistrictDropdown(false);
                    setShowWardDropdown(false);
                  }}
                  className={styles.locationSelect}
                >
                  <span className={selectedProvince ? styles.locationSelectValue : styles.locationSelectPlaceholder}>
                    {selectedProvince || 'Chọn tỉnh/thành phố'}
                  </span>
                  <ChevronDown className={styles.locationSelectIcon} size={16} />
                </button>

                {showProvinceDropdown && (
                  <div className={styles.locationDropdown}>
                    {/* 🔥 NEW: Search input */}
                    <div className={styles.locationSearchWrapper}>
                      <Search size={14} className={styles.searchIcon} />
                      <input
                        type="text"
                        value={provinceSearch}
                        onChange={(e) => setProvinceSearch(e.target.value)}
                        placeholder="Tìm tỉnh/thành phố..."
                        className={styles.locationSearchInput}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <button
                      className={styles.locationOption}
                      onClick={() => {
                        onProvinceChange?.('');
                        onDistrictChange?.('');
                        onWardChange?.('');
                        setShowProvinceDropdown(false);
                        setProvinceSearch('');
                      }}
                    >
                      <span>Tất cả</span>
                    </button>
                    {provincesDB && provincesDB
                      .filter(province =>
                        !provinceSearch.trim() ||
                        province.toLowerCase().includes(provinceSearch.toLowerCase())
                      )
                      .map((province) => (
                        <button
                          key={province._id}
                          className={styles.locationOption}
                          onClick={() => {
                            onProvinceChange?.(province._id);
                            onDistrictChange?.(''); // Reset district when province changes
                            onWardChange?.(''); // Reset ward when province changes
                            setShowProvinceDropdown(false);
                            setProvinceSearch('');
                          }}
                        >
                          <span>{province?.name}</span>
                        </button>
                      ))}
                  </div>
                )}
              </div>

              {/* District Dropdown (only show when province is selected) */}
              {selectedProvince && (
                <div className={styles.locationDropdownWrapper}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDistrictDropdown(!showDistrictDropdown);
                      setShowProvinceDropdown(false);
                      setShowWardDropdown(false);
                    }}
                    className={styles.locationSelect}
                  >
                    <span className={selectedDistrict ? styles.locationSelectValue : styles.locationSelectPlaceholder}>
                      {selectedDistrict || 'Chọn xã phường'}
                    </span>
                    <ChevronDown className={styles.locationSelectIcon} size={16} />
                  </button>

                  {showDistrictDropdown && (
                    <div className={styles.locationDropdown}>
                      {/* 🔥 NEW: Search input */}
                      <div className={styles.locationSearchWrapper}>
                        <Search size={14} className={styles.searchIcon} />
                        <input
                          type="text"
                          value={districtSearch}
                          onChange={(e) => setDistrictSearch(e.target.value)}
                          placeholder="Tìm xã phường..."
                          className={styles.locationSearchInput}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <button
                        className={styles.locationOption}
                        onClick={() => {
                          onDistrictChange?.('');
                          onWardChange?.('');
                          setShowDistrictDropdown(false);
                          setDistrictSearch('');
                        }}
                      >
                        <span>Tất cả</span>
                      </button>
                      {availableDistricts
                        .filter(district =>
                          !districtSearch.trim() ||
                          district.toLowerCase().includes(districtSearch.toLowerCase())
                        )
                        .map((district) => (
                          <button
                            key={district}
                            className={styles.locationOption}
                            onClick={() => {
                              onDistrictChange?.(district);
                              onWardChange?.(''); // Reset ward when district changes
                              setShowDistrictDropdown(false);
                              setDistrictSearch('');
                            }}
                          >
                            <span>{district}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Business Type Filter Checkboxes */}
          <div className={styles.filterSection}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection('businessType')}
              aria-expanded={expandedSections.businessType}
            >
              <div className={styles.sectionTitle}>Loại hình kinh doanh</div>
              {expandedSections.businessType ? (
                <Minus size={16} className={styles.toggleIcon} />
              ) : (
                <Plus size={16} className={styles.toggleIcon} />
              )}
            </button>
            <div className={`${styles.filterList} ${expandedSections.businessType ? styles.filterListExpanded : styles.filterListCollapsed}`}>
              {/* 🔥 NEW: Search input for business types */}
              <div className={styles.searchWrapper}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  value={businessTypeSearch}
                  onChange={(e) => {
                    setBusinessTypeSearch(e.target.value);
                  }}
                  placeholder="Tìm kiếm loại hình..."
                  className={styles.searchInput}
                />
              </div>

              {/* 🔥 NEW: "Tất cả" checkbox - Toggle all business types */}
              {allCategoryItem && !businessTypeSearch.trim() && (
                <label
                  key="__all_business_types__"
                  className={styles.filterItem}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '8px',
                    marginBottom: '4px'
                  }}
                >
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={allBusinessTypesSelected}
                      onChange={() => onBusinessTypeToggleAll(!allBusinessTypesSelected)}
                      className={styles.checkbox}
                    />
                    <div
                      className={styles.customCheckbox}
                      style={{ borderColor: allBusinessTypesSelected ? allCategoryItem.color : undefined }}
                    >
                      {allBusinessTypesSelected && (
                        <div className={styles.checkmark} style={{ background: allCategoryItem.color }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path
                              d="M2 6L5 9L10 3"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <allCategoryItem.icon size={16} style={{ color: allCategoryItem.color }} />
                  <span className={styles.filterLabel} style={{ fontWeight: 600 }}>{allCategoryItem.label}</span>
                </label>
              )}

              {/* Individual business type checkboxes */}
              {filteredBusinessTypeData.length > 0 ? (
                filteredBusinessTypeData.map(({ key, label, icon: Icon, color, count }) => (
                  <label key={key} className={styles.filterItem}>
                    <div className={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        checked={businessTypeFilters[key] || false}
                        onChange={() => onBusinessTypeFilterChange(key)}
                        className={styles.checkbox}
                      />
                      <div
                        className={styles.customCheckbox}
                        style={{ borderColor: businessTypeFilters[key] ? color : undefined }}
                      >
                        {businessTypeFilters[key] && (
                          <div className={styles.checkmark} style={{ background: color }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <Icon size={16} style={{ color }} />
                    <span className={styles.filterLabel}>{label}</span>
                  </label>
                ))
              ) : (
                <div className={styles.noResults}>
                  <span>Không tìm thấy loại hình phù hợp</span>
                </div>
              )}
            </div>
          </div>

          {/* 🔥 NEW: Department Filter Checkboxes - Grouped by parent_id */}
          <div className={styles.filterSection} style={{ display: 'none' }}>
            <button
              className={styles.sectionHeader}
              onClick={() => toggleSection('department')}
              aria-expanded={expandedSections.department}
            >
              <div className={styles.sectionTitle}>
                <Building2 size={14} style={{ display: 'inline-block', marginRight: '6px' }} />
                Đội quản lý thị trường
              </div>
              {expandedSections.department ? (
                <Minus size={16} className={styles.toggleIcon} />
              ) : (
                <Plus size={16} className={styles.toggleIcon} />
              )}
            </button>
            <div
              className={`${styles.filterList} ${expandedSections.department ? styles.filterListExpanded : styles.filterListCollapsed} ${expandedSections.department ? styles.departmentFilterList : ''}`}
            >
              {(departments || []).length > 0 ? (
                <>
                  {/* Toggle all departments */}
                  <label
                    className={styles.filterItem}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      paddingBottom: '8px',
                      marginBottom: '8px'
                    }}
                  >
                    <div className={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        checked={(departments || []).every(dept => departmentFilters[dept.id] !== false)}
                        onChange={(e) => onDepartmentToggleAll(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <div
                        className={styles.customCheckbox}
                        style={{ borderColor: (departments || []).every(dept => departmentFilters[dept.id] !== false) ? '#005cb6' : undefined }}
                      >
                        {(departments || []).every(dept => departmentFilters[dept.id] !== false) && (
                          <div className={styles.checkmark} style={{ background: '#005cb6' }}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path
                                d="M2 6L5 9L10 3"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <Building2 size={16} style={{ color: '#005cb6' }} />
                    <span className={styles.filterLabel} style={{ fontWeight: 600 }}>Tất cả</span>
                  </label>

                  {/* Root departments (no parent) */}
                  {rootDepartments.map((dept) => (
                    <label key={dept.id} className={styles.filterItem}>
                      <div className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          checked={departmentFilters[dept.id] !== false}
                          onChange={() => onDepartmentFilterChange(dept.id)}
                          className={styles.checkbox}
                        />
                        <div
                          className={styles.customCheckbox}
                          style={{ borderColor: departmentFilters[dept.id] !== false ? '#005cb6' : undefined }}
                        >
                          {departmentFilters[dept.id] !== false && (
                            <div className={styles.checkmark} style={{ background: '#005cb6' }}>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path
                                  d="M2 6L5 9L10 3"
                                  stroke="white"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                      <Building2 size={16} style={{ color: '#005cb6' }} />
                      <span className={styles.filterLabel}>{dept.name}</span>
                    </label>
                  ))}

                  {/* Grouped departments (with parent) */}
                  {groupedDepartments.map(({ parent, children }) => {
                    const isExpanded = expandedDepartmentGroups.has(parent.id);
                    const childIds = children.map(c => c.id);
                    const allChildrenSelected = isGroupAllSelected(childIds);
                    const parentSelected = departmentFilters[parent.id] !== false;

                    return (
                      <div key={parent.id} style={{ marginBottom: '4px' }}>
                        {/* Parent department with expand/collapse */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => toggleDepartmentGroup(parent.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: 'var(--color-text-secondary)',
                              transition: 'transform 0.2s ease'
                            }}
                            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
                          >
                            {isExpanded ? (
                              <ChevronDown size={14} style={{ transform: 'rotate(0deg)' }} />
                            ) : (
                              <ChevronRight size={14} style={{ transform: 'rotate(0deg)' }} />
                            )}
                          </button>

                          <label
                            className={styles.filterItem}
                            style={{
                              flex: 1,
                              marginBottom: 0,
                              paddingLeft: '0px'
                            }}
                            onClick={(e) => {
                              // Prevent label click from toggling checkbox when clicking expand button
                              if ((e.target as HTMLElement).closest('button')) {
                                e.preventDefault();
                              }
                            }}
                          >
                            <div className={styles.checkboxWrapper}>
                              <input
                                type="checkbox"
                                checked={parentSelected}
                                onChange={() => onDepartmentFilterChange(parent.id)}
                                className={styles.checkbox}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div
                                className={styles.customCheckbox}
                                style={{ borderColor: parentSelected ? '#005cb6' : undefined }}
                              >
                                {parentSelected && (
                                  <div className={styles.checkmark} style={{ background: '#005cb6' }}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path
                                        d="M2 6L5 9L10 3"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                            <Building2 size={16} style={{ color: '#005cb6' }} />
                            <span className={styles.filterLabel} style={{ fontWeight: 500 }}>{parent.name}</span>
                          </label>
                        </div>

                        {/* Children departments (collapsible) */}
                        <div
                          style={{
                            maxHeight: isExpanded ? '1000px' : '0',
                            overflow: 'hidden',
                            transition: 'max-height 0.3s ease-out',
                            marginLeft: '24px',
                            marginTop: '4px',
                            marginBottom: '4px'
                          }}
                        >
                          {/* Individual child departments */}
                          {children.map((child) => (
                            <label
                              key={child.id}
                              className={styles.filterItem}
                              style={{
                                marginBottom: '2px',
                                paddingLeft: '8px',
                                opacity: isExpanded ? 1 : 0,
                                transition: 'opacity 0.2s ease'
                              }}
                            >
                              <div className={styles.checkboxWrapper}>
                                <input
                                  type="checkbox"
                                  checked={departmentFilters[child.id] !== false}
                                  onChange={() => onDepartmentFilterChange(child.id)}
                                  className={styles.checkbox}
                                />
                                <div
                                  className={styles.customCheckbox}
                                  style={{ borderColor: departmentFilters[child.id] !== false ? '#005cb6' : undefined }}
                                >
                                  {departmentFilters[child.id] !== false && (
                                    <div className={styles.checkmark} style={{ background: '#005cb6' }}>
                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path
                                          d="M2 6L5 9L10 3"
                                          stroke="white"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Building2 size={14} style={{ color: '#005cb6', opacity: 0.7 }} />
                              <span className={styles.filterLabel} style={{ fontSize: '13px' }}>{child.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className={styles.noResults}>
                  <span>Đang tải dữ liệu...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔥 NEW: Apply filters button */}
        {hasUnappliedChanges && (
          <div className={styles.applyFiltersWrapper}>
            <button
              className={styles.applyFiltersButton}
              onClick={onApplyFilters}
            >
              Áp dụng bộ lọc
            </button>
          </div>
        )}

        {/* 🔥 NEW: Save filters button */}
        <div className={styles.saveFiltersWrapper}>
          <button
            className={styles.saveFiltersButton}
            onClick={onSaveFilters}
            title="Lưu cấu hình bộ lọc hiện tại"
          >
            <Save size={16} strokeWidth={2} />
            <span>Lưu bộ lọc</span>
          </button>
        </div>
      </div>
    );
  }
);

MapFilterPanel.displayName = 'MapFilterPanel';