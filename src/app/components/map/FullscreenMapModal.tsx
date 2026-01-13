import React, { useEffect, useState, useRef } from 'react';
import { X, SlidersHorizontal, BarChart3, MapPin } from 'lucide-react';
import styles from './FullscreenMapModal.module.css';
import LeafletMap from './LeafletMap';
import { MapFilterPanel } from './MapFilterPanel';
import { LocationStatsCard } from './LocationStatsCard';
import { MapLegend } from './MapLegend';
import { Restaurant } from '../../../data/restaurantData';
import { PointStatus } from '../../../utils/api/pointStatusApi';
import { Category } from '../../../utils/api/categoriesApi';

interface FullscreenMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    certified: boolean;
    hotspot: boolean;
    scheduled: boolean;
    inspected: boolean;
  };
  businessTypeFilters: {
    [key: string]: boolean;
  };
  searchQuery: string;
  selectedRestaurant?: Restaurant | null;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  restaurants: Restaurant[];
  pointStatuses: PointStatus[];  // 🔥 ADD: Dynamic statuses
  categories: Category[];  // 🔥 NEW: Categories for mapping ID to name
  onPointClick?: (point: Restaurant) => void;
  onFilterChange: (key: keyof FullscreenMapModalProps['filters']) => void;
  onBusinessTypeFilterChange: (type: string) => void;
  onBusinessTypeToggleAll: (checked: boolean) => void;  // 🔥 NEW: Toggle all business types
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onWardChange: (ward: string) => void;
}

export function FullscreenMapModal({
  isOpen,
  onClose,
  filters,
  businessTypeFilters,
  searchQuery,
  selectedRestaurant,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  restaurants,
  pointStatuses,  // 🔥 RECEIVE: Dynamic statuses
  categories,  // 🔥 NEW: Categories for mapping ID to name
  onPointClick,
  onFilterChange,
  onBusinessTypeFilterChange,
  onBusinessTypeToggleAll,  // 🔥 NEW: Toggle all business types
  onProvinceChange,
  onDistrictChange,
  onWardChange
}: FullscreenMapModalProps) {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isStatsCardVisible, setIsStatsCardVisible] = useState(true);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterToggleBtnRef = useRef<HTMLButtonElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Calculate filtered count
  const filteredCount = restaurants.filter(r => {
    // Apply category filters
    if (!filters[r.category]) return false;
    
    // Apply business type filters - check if any business type is selected
    const hasBusinessTypeFilter = Object.values(businessTypeFilters).some(v => v);
    if (hasBusinessTypeFilter && !businessTypeFilters[r.businessType]) {
      return false;
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(query) ||
        r.address.toLowerCase().includes(query) ||
        r.businessType.toLowerCase().includes(query)
      );
    }
    return true;
  }).length;

  // Get filtered restaurants for location stats
  const filteredRestaurants = restaurants.filter(r => {
    // Apply category filters
    if (!filters[r.category]) return false;
    
    // Apply business type filters
    const hasBusinessTypeFilter = Object.values(businessTypeFilters).some(v => v);
    if (hasBusinessTypeFilter && !businessTypeFilters[r.businessType]) {
      return false;
    }
    
    // Apply location filters - default to Hà Nội if no province selected
    const activeProvince = selectedProvince || 'Hà Nội';
    if (activeProvince && r.province !== activeProvince) return false;
    if (selectedDistrict && r.district !== selectedDistrict) return false;
    if (selectedWard && r.ward !== selectedWard) return false;
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(query) ||
        r.address.toLowerCase().includes(query) ||
        r.businessType.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle click outside filter panel - only close when clicking on map, not on other boxes
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isFilterPanelOpen) return;

      const target = event.target as Node;
      
      // Don't close if clicking inside filter panel or its toggle button
      if (
        filterPanelRef.current?.contains(target) ||
        filterToggleBtnRef.current?.contains(target)
      ) {
        return;
      }

      // Don't close if clicking on other UI boxes
      if (
        legendRef.current?.contains(target) ||
        statsCardRef.current?.contains(target)
      ) {
        return;
      }

      // Don't close if clicking on markers/points (they have data-marker attribute)
      const targetElement = event.target as HTMLElement;
      if (
        targetElement.closest('[class*="marker"]') ||
        targetElement.closest('[class*="point"]') ||
        targetElement.closest('.leaflet-marker-icon') ||
        targetElement.closest('.leaflet-popup')
      ) {
        return;
      }

      // Only close if clicking on map container or overlay
      if (
        mapContainerRef.current?.contains(target) ||
        (event.target as HTMLElement).classList.contains(styles.overlay) ||
        (event.target as HTMLElement).classList.contains(styles.mapWrapper)
      ) {
        setIsFilterPanelOpen(false);
      }
    };

    if (isFilterPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPanelOpen]);

  // Reset stats card visibility when location filters change
  useEffect(() => {
    if (selectedProvince || selectedDistrict || selectedWard) {
      setIsStatsCardVisible(true);
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // Auto-show stats card when business type filter is applied
  useEffect(() => {
    const hasBusinessTypeFilter = Object.values(businessTypeFilters).some(v => v);
    if (hasBusinessTypeFilter) {
      setIsStatsCardVisible(true);
    }
  }, [businessTypeFilters]);

  // 🔥 Color mapping - HARDCODED (giữ nguyên theo design system)
  const colorMap: { [key: string]: string } = {
    'certified': '#22c55e',   // Green
    'hotspot': '#ef4444',      // Red  
    'scheduled': '#f59e0b',    // Yellow/Orange
    'inspected': '#005cb6',    // MAPPA Blue
  };

  // 🔥 Build dynamic legend data from pointStatuses
  // Lấy name từ DB, nhưng màu vẫn hardcoded theo code
  const legendData = pointStatuses.map(status => ({
    key: status.code,
    label: status.name,                                 // 📦 FROM DB
    color: colorMap[status.code] || '#005cb6',          // 🎨 HARDCODED
    count: filteredRestaurants.filter(r => r.category === status.code).length
  }));

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Map Legend - Horizontal at Top */}
        {isLegendVisible && (
          <MapLegend 
            categoryData={legendData} 
            onClose={() => setIsLegendVisible(false)}
            ref={legendRef}
          />
        )}

        {/* Close Button - Floating */}
        <button 
          className={styles.closeBtn} 
          onClick={onClose}
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        {/* Map Container */}
        <div className={styles.mapWrapper} ref={mapContainerRef}>
          {/* Location Stats Card */}
          <LocationStatsCard
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedWard={selectedWard}
            filteredRestaurants={filteredRestaurants}
            businessTypeFilters={businessTypeFilters}
            categories={categories}  // 🔥 NEW: Categories for mapping ID to name
            onClose={() => {
              // Clear all location filters when closing stats card
              onProvinceChange('');
              onDistrictChange('');
              onWardChange('');
            }}
            isVisible={isStatsCardVisible}
            onVisibilityChange={setIsStatsCardVisible}
            isFullscreen={true}
            ref={statsCardRef}
          />

          <LeafletMap
            filters={filters}
            businessTypeFilters={businessTypeFilters}
            searchQuery={searchQuery}
            selectedRestaurant={selectedRestaurant}
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedWard={selectedWard}
            restaurants={restaurants}
            onPointClick={onPointClick}
          />

          {/* MapFilterPanel - positioned inside mapWrapper */}
          <MapFilterPanel
            isOpen={isFilterPanelOpen}
            filters={filters}
            businessTypeFilters={businessTypeFilters}
            restaurants={restaurants}
            pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses
            categories={categories}  // 🔥 NEW: Categories for mapping ID to name
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            selectedWard={selectedWard}
            onFilterChange={onFilterChange}
            onBusinessTypeFilterChange={onBusinessTypeFilterChange}
            onBusinessTypeToggleAll={onBusinessTypeToggleAll}  // 🔥 NEW: Toggle all business types
            onProvinceChange={onProvinceChange}
            onDistrictChange={onDistrictChange}
            onWardChange={onWardChange}
            filteredCount={filteredCount}
            onClose={() => setIsFilterPanelOpen(false)}
            ref={filterPanelRef}
          />
        </div>

        {/* Toggle Buttons - positioned fixed on screen */}
        <div className={styles.filterPanelWrapper}>
          {/* Legend Toggle Button */}
          <button
            className={styles.legendToggleBtn}
            onClick={() => setIsLegendVisible(!isLegendVisible)}
            aria-label="Mở/Đóng chú giải"
            title="Chú giải bản đồ"
          >
            <MapPin size={20} strokeWidth={2.5} />
          </button>

          {/* Stats Toggle Button */}
          <button
            className={styles.statsToggleBtn}
            onClick={() => setIsStatsCardVisible(!isStatsCardVisible)}
            aria-label="Mở/Đóng thống kê"
            title="Thống kê địa bàn"
          >
            <BarChart3 size={20} strokeWidth={2.5} />
          </button>

          {/* Filter Toggle Button */}
          <button
            className={styles.filterToggleBtn}
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            aria-label="Mở/Đóng bộ lọc"
            ref={filterToggleBtnRef}
          >
            <SlidersHorizontal size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}