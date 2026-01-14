import React, { useState, forwardRef, useEffect } from 'react';
import { ShieldCheck, Flame, Calendar, Check, X, Store, Coffee, Utensils, Soup, Croissant, UtensilsCrossed, Plus, Minus, MapPin, ChevronDown, Search, Save } from 'lucide-react';
import styles from './MapFilterPanel.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { getProvinceNames, getDistrictsByProvince, getWardsByDistrict } from '../../../data/vietnamLocations';
import { PointStatus } from '../../../utils/api/pointStatusApi';
import { Category } from '../../../utils/api/categoriesApi';

type CategoryFilter = {
  certified: boolean;
  hotspot: boolean;
  scheduled: boolean;
  inspected: boolean;
};

type BusinessTypeFilter = {
  [key: string]: boolean;
};

interface MapFilterPanelProps {
  isOpen: boolean;
  filters: CategoryFilter;
  businessTypeFilters: BusinessTypeFilter;
  restaurants: Restaurant[];
  pointStatuses: PointStatus[];  // 🔥 ADD: Dynamic statuses từ database
  categories: Category[];        // 🔥 ADD: Categories từ database
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  startDate?: string;            // 🔥 NEW: Date range start
  endDate?: string;              // 🔥 NEW: Date range end
  onFilterChange: (key: keyof CategoryFilter) => void;
  onBusinessTypeFilterChange: (type: string) => void;
  onBusinessTypeToggleAll: (checked: boolean) => void;  // 🔥 NEW: Toggle all business types
  onProvinceChange?: (province: string) => void;
  onDistrictChange?: (district: string) => void;
  onWardChange?: (ward: string) => void;
  filteredCount: number;
  onClose: () => void;
  onApplyFilters?: () => void;  // 🔥 NEW: Apply filters callback
  hasUnappliedChanges?: boolean;  // 🔥 NEW: Show if there are pending changes
  onSaveFilters?: () => void;  // 🔥 NEW: Save filters to localStorage callback
}

export const MapFilterPanel = forwardRef<HTMLDivElement, MapFilterPanelProps>(
  ({ 
    isOpen, 
    filters, 
    businessTypeFilters,
    restaurants,
    pointStatuses,  // 🔥 RECEIVE: Dynamic point statuses
    categories,     // 🔥 RECEIVE: Categories from database
    selectedProvince,
    selectedDistrict,
    selectedWard,
    startDate,
    endDate,
    onFilterChange, 
    onBusinessTypeFilterChange,
    onBusinessTypeToggleAll,  // 🔥 NEW: Toggle all business types
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
      businessType: true,
      legend: true
    });
    
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [showWardDropdown, setShowWardDropdown] = useState(false);
    
    // 🔥 NEW: State for business type search
    const [businessTypeSearch, setBusinessTypeSearch] = useState('');
    
    // 🔥 NEW: State for location search
    const [provinceSearch, setProvinceSearch] = useState('');
    const [districtSearch, setDistrictSearch] = useState('');
    const [wardSearch, setWardSearch] = useState('');

    if (!isOpen) return null;

    const toggleSection = (section: keyof typeof expandedSections) => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };
    
    // Get location data
    const provinces = getProvinceNames();
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
    const categoryData = pointStatuses.map(status => {
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
    console.log('📦 MapFilterPanel: categories:', categories);
    
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
    const businessTypeData = categories.map(category => ({
      key: category.id,  // 🔥 Changed to category.id for API
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
                  <span className={styles.filterCount}>({count})</span>
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
                    {provinces
                      .filter(province => 
                        !provinceSearch.trim() || 
                        province.toLowerCase().includes(provinceSearch.toLowerCase())
                      )
                      .map((province) => (
                        <button
                          key={province}
                          className={styles.locationOption}
                          onClick={() => {
                            onProvinceChange?.(province);
                            onDistrictChange?.(''); // Reset district when province changes
                            onWardChange?.(''); // Reset ward when province changes
                            setShowProvinceDropdown(false);
                            setProvinceSearch('');
                          }}
                        >
                          <span>{province}</span>
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
                      {selectedDistrict || 'Chọn quận/huyện'}
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
                          placeholder="Tìm quận/huyện..."
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
              
              {/* Ward Dropdown (only show when district is selected) */}
              {selectedDistrict && (
                <div className={styles.locationDropdownWrapper}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWardDropdown(!showWardDropdown);
                      setShowProvinceDropdown(false);
                      setShowDistrictDropdown(false);
                    }}
                    className={styles.locationSelect}
                  >
                    <span className={selectedWard ? styles.locationSelectValue : styles.locationSelectPlaceholder}>
                      {selectedWard || 'Chọn phường/xã'}
                    </span>
                    <ChevronDown className={styles.locationSelectIcon} size={16} />
                  </button>
                  
                  {showWardDropdown && (
                    <div className={styles.locationDropdown}>
                      {/* 🔥 NEW: Search input */}
                      <div className={styles.locationSearchWrapper}>
                        <Search size={14} className={styles.searchIcon} />
                        <input
                          type="text"
                          value={wardSearch}
                          onChange={(e) => setWardSearch(e.target.value)}
                          placeholder="Tìm phường/xã..."
                          className={styles.locationSearchInput}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      
                      <button
                        className={styles.locationOption}
                        onClick={() => {
                          onWardChange?.('');
                          setShowWardDropdown(false);
                          setWardSearch('');
                        }}
                      >
                        <span>Tất cả</span>
                      </button>
                      {availableWards
                        .filter(ward => 
                          !wardSearch.trim() || 
                          ward.toLowerCase().includes(wardSearch.toLowerCase())
                        )
                        .map((ward) => (
                          <button
                            key={ward}
                            className={styles.locationOption}
                            onClick={() => {
                              onWardChange?.(ward);
                              setShowWardDropdown(false);
                              setWardSearch('');
                            }}
                          >
                            <span>{ward}</span>
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
                  <span className={styles.filterCount}>({allCategoryItem.count})</span>
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
                    <span className={styles.filterCount}>({count})</span>
                  </label>
                ))
              ) : (
                <div className={styles.noResults}>
                  <span>Không tìm thấy loại hình phù hợp</span>
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