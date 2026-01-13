import React, { useState, useMemo, useEffect, useRef } from 'react';
import PageHeader from '../layouts/PageHeader';
import { Button } from '../app/components/ui/button';
import { MapPin, SlidersHorizontal, BarChart3 } from 'lucide-react';
import LeafletMap from '../app/components/map/LeafletMap';
import { PointDetailModal } from '../app/components/map/PointDetailModal';
import { ReviewModal } from '../app/components/map/ReviewModal';
import { FullscreenMapModal } from '../app/components/map/FullscreenMapModal';
import { MapFilterPanel } from '../app/components/map/MapFilterPanel';
import { LocationStatsCard } from '../app/components/map/LocationStatsCard';
import { MapLegend } from '../app/components/map/MapLegend';
import { OfficerInfoModal } from '../app/components/map/OfficerInfoModal';
import { DateRangePicker } from '../app/components/map/DateRangePicker';
import styles from './MapPage.module.css';
import { Restaurant } from '../data/restaurantData';
import { getProvinceNames, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';
import { fetchMapPoints } from '../utils/api/mapPointsApi';
import { fetchPointStatuses, PointStatus, buildFilterObjectFromStatuses } from '../utils/api/pointStatusApi';
import { fetchCategories, Category } from '../utils/api/categoriesApi';
import { fetchMerchants } from '../utils/api/merchantsApi';
import { officersData, Officer } from '../data/officerData';

type CategoryFilter = {
  [key: string]: boolean;  // Dynamic keys from point_status table
};

export default function MapPage() {
  // Point statuses from point_status table
  const [pointStatuses, setPointStatuses] = useState<PointStatus[]>([]);
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true);
  
  // Categories from categories table
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // Data state - fetch from Postgres table map_points
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // 🔥 NEW: Store ALL restaurants (unfiltered) - fetch once, never refetch
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  
  // 🔥 NEW: Flag to prevent auto-save during initial load
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  
  const [filters, setFilters] = useState<CategoryFilter>({});
  
  const [businessTypeFilters, setBusinessTypeFilters] = useState<{ [key: string]: boolean }>({});
  
  // 🔥 NEW: Pending filters - chỉ apply khi user bấm nút "Áp dụng"
  const [pendingFilters, setPendingFilters] = useState<CategoryFilter>({});
  const [pendingBusinessTypeFilters, setPendingBusinessTypeFilters] = useState<{ [key: string]: boolean }>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof CategoryFilter | 'all'>('all');
  
  // 🔥 DISABLED: Auto-save search query (causes localStorage stale closure issues)
  // Users must click "Reset" or change filters to trigger save
  
  // Modal state
  const [detailModalPoint, setDetailModalPoint] = useState<Restaurant | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Review modal state
  const [reviewModalPoint, setReviewModalPoint] = useState<Restaurant | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Fullscreen map modal state
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState(false);
  
  // 🔥 NEW: Officer modal state
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [selectedWardName, setSelectedWardName] = useState<string>('');
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  
  // Map UI state (similar to FullscreenMapModal)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [isStatsCardVisible, setIsStatsCardVisible] = useState(true);
  
  // 🔥 NEW: Map layer toggles
  const [showMapPoints, setShowMapPoints] = useState(true);  // MapPoint layer
  const [showMerchants, setShowMerchants] = useState(false);  // Merchant layer
  const [showOfficers, setShowOfficers] = useState(false);  // Officers layer (Cán bộ quản lý)
  
  // Refs for click outside logic
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterToggleBtnRef = useRef<HTMLButtonElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // 🔥 Fetch point statuses from point_status table on mount
  useEffect(() => {
    async function loadPointStatuses() {
      console.log('📍 MapPage: Fetching point statuses from Postgres...');
      try {
        const statuses = await fetchPointStatuses();
        console.log('📦 MapPage: Raw data from fetchPointStatuses:', statuses.length, 'statuses');
        console.log('📍 MapPage: First status after fetch:', statuses[0]);
        
        setPointStatuses(statuses);
        
        // Build initial filters from statuses (all enabled by default)
        const initialFilters = buildFilterObjectFromStatuses(statuses);
        console.log('✅ MapPage: Initial filters built:', initialFilters);
        setFilters(initialFilters);
        setPendingFilters(initialFilters);  // 🔥 Sync pending filters
        
        setIsLoadingStatuses(false);
        console.log('✅ MapPage: Successfully loaded', statuses.length, 'point statuses');
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load point statuses:', error);
        setIsLoadingStatuses(false);
      }
    }
    
    loadPointStatuses();
  }, []); // Run once on mount
  
  // 🔥 Fetch categories from categories table on mount
  useEffect(() => {
    async function loadCategories() {
      console.log('📍 MapPage: Fetching categories from Postgres...');
      try {
        const cats = await fetchCategories();
        console.log('📦 MapPage: Raw data from fetchCategories:', cats.length, 'categories');
        console.log('📍 MapPage: First category after fetch:', cats[0]);
        
        setCategories(cats);
        
        // 🔥 FIX: Initialize businessTypeFilters with ALL categories enabled (= "Tất cả")
        if (cats.length > 0) {
          const initialBusinessTypeFilters: { [key: string]: boolean } = {};
          cats.forEach((cat) => {
            initialBusinessTypeFilters[cat.id] = true;  // 🔥 ALL categories enabled by default
          });
          setBusinessTypeFilters(initialBusinessTypeFilters);
          setPendingBusinessTypeFilters(initialBusinessTypeFilters);  // 🔥 Sync pending
          console.log('✅ MapPage: Initial business type filters (ALL enabled):', initialBusinessTypeFilters);
        }
        
        setIsLoadingCategories(false);
        console.log('✅ MapPage: Successfully loaded', cats.length, 'categories');
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load categories:', error);
        setIsLoadingCategories(false);
      }
    }
    
    loadCategories();
  }, []); // Run once on mount
  
  // 🔥 NEW: Load saved filters from localStorage on mount
  useEffect(() => {
    // Only load saved filters after statuses and categories are loaded
    if (pointStatuses.length === 0 || categories.length === 0) {
      console.log('⏳ Waiting for statuses and categories to load before applying saved filters...');
      return;
    }
    
    try {
      const savedFiltersStr = localStorage.getItem('mappa_map_filters');
      if (savedFiltersStr) {
        const savedFilters = JSON.parse(savedFiltersStr);
        console.log('💾 Loaded saved filters from localStorage:', savedFilters);
        
        // 🔥 VALIDATE: Check if saved filters match current point statuses
        if (savedFilters.filters) {
          const savedFilterKeys = Object.keys(savedFilters.filters);
          const validStatusCodes = pointStatuses.map(s => s.code);
          const isValidFilter = savedFilterKeys.every(key => validStatusCodes.includes(key));
          
          console.log('🔍 Validating saved filters:', {
            savedFilterKeys,
            validStatusCodes,
            isValidFilter
          });
          
          if (isValidFilter) {
            setFilters(savedFilters.filters);
            setPendingFilters(savedFilters.filters);
            console.log('✅ Applied saved status filters');
          } else {
            console.warn('⚠️ Saved status filters are invalid, skipping');
          }
        }
        
        // 🔥 VALIDATE: Check if saved business type filters match current categories
        if (savedFilters.businessTypeFilters) {
          const savedBusinessTypeKeys = Object.keys(savedFilters.businessTypeFilters);
          const validCategoryIds = categories.map(c => c.id);
          const isValidBusinessTypeFilter = savedBusinessTypeKeys.every(key => validCategoryIds.includes(key));
          
          console.log('🔍 Validating saved business type filters:', {
            savedBusinessTypeKeys,
            validCategoryIds,
            isValidBusinessTypeFilter
          });
          
          if (isValidBusinessTypeFilter) {
            setBusinessTypeFilters(savedFilters.businessTypeFilters);
            setPendingBusinessTypeFilters(savedFilters.businessTypeFilters);
            console.log('✅ Applied saved business type filters');
          } else {
            console.warn('⚠️ Saved business type filters are invalid, skipping');
          }
        }
        
        if (savedFilters.selectedProvince) {
          setSelectedProvince(savedFilters.selectedProvince);
        }
        
        if (savedFilters.selectedDistrict) {
          setSelectedDistrict(savedFilters.selectedDistrict);
        }
        
        if (savedFilters.selectedWard) {
          setSelectedWard(savedFilters.selectedWard);
        }
        
        // 🔥 NEW: Apply saved date range
        if (savedFilters.startDate) {
          setCustomStartDate(savedFilters.startDate);
        }
        
        if (savedFilters.endDate) {
          setCustomEndDate(savedFilters.endDate);
        }
        
        // 🔥 NEW: Apply saved search query
        if (savedFilters.searchQuery) {
          setSearchQuery(savedFilters.searchQuery);
        }
        
        console.log('✅ Applied saved filters successfully!');
      } else {
        console.log('ℹ️ No saved filters found in localStorage');
      }
    } catch (error) {
      console.error('❌ Failed to load saved filters:', error);
    }
    
    // 🔥 CRITICAL: Mark initial load complete AFTER loading saved filters
    // This prevents auto-save from overwriting the saved filters during load
    setTimeout(() => {
      setIsInitialLoadComplete(true);
      console.log('✅ Initial load complete - auto-save enabled');
    }, 100);
  }, [pointStatuses, categories]); // Run after statuses and categories are loaded
  
  // 🔥 Fetch map points from map_points table on mount AND when filters change
  useEffect(() => {
    async function loadMapPoints() {
      console.log('🗺️ MapPage: Fetching ALL map points from Postgres (ONE TIME)...');
      setIsLoadingData(true);
      setDataError(null);
      
      try {
        // 🔥 NEW: Fetch ALL points without filters (one-time fetch)
        const points = await fetchMapPoints();  // No statusIds, no categoryIds = get ALL
        
        console.log('📦 MapPage: Received', points.length, 'map points from API');
        console.log('📍 MapPage: First 3 points:', points.slice(0, 3));
        
        setAllRestaurants(points);  // 🔥 Store ALL points
        setIsLoadingData(false);
        console.log('✅ MapPage: Successfully loaded', points.length, 'map points (ALL data)');
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load map points:', error);
        setDataError(error.message || 'Khng thể tải dữ liệu điểm kinh doanh');
        setIsLoadingData(false);
      }
    }
    
    // Only fetch ONCE if pointStatuses is loaded and showMapPoints is true
    if (pointStatuses.length > 0 && showMapPoints && !showMerchants && !showOfficers && allRestaurants.length === 0) {
      loadMapPoints();
    }
  }, [pointStatuses, showMapPoints, showMerchants, showOfficers, allRestaurants.length]); // 🔥 REMOVED: filters, businessTypeFilters, categories
  
  // 🔥 NEW: Fetch merchants from merchants table when Merchants layer is selected
  useEffect(() => {
    async function loadMerchants() {
      console.log('🏪 MapPage: Fetching merchants from Postgres...');
      setIsLoadingData(true);
      setDataError(null);
      
      try {
        // 🔥 Map point_status codes to merchant status codes
        // point_status: certified, hotspot, scheduled, inspected
        // merchant status: active, pending, suspended, rejected
        const activeFilterCodes = Object.keys(filters).filter(key => filters[key] === true);
        console.log('🎯 MapPage: Active filter codes (point_status):', activeFilterCodes);
        
        // Map to merchant status codes
        const merchantStatusCodes = activeFilterCodes.map(code => {
          switch (code) {
            case 'certified': return 'active';
            case 'scheduled': return 'pending';
            case 'hotspot': return 'suspended';
            case 'inspected': return 'rejected';
            default: return code;
          }
        });
        
        console.log('🆔 MapPage: Merchant status codes for query:', merchantStatusCodes);
        
        // 🔥 Get business types from categories
        // For merchants, we filter by business_type field (text) instead of category IDs
        const activeBusinessTypes = Object.keys(businessTypeFilters).filter(key => businessTypeFilters[key] === true);
        
        // Map category IDs to category names
        const businessTypeNames = activeBusinessTypes
          .map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return category?.name;
          })
          .filter((name): name is string => name !== undefined);
        
        // 🔥 NEW LOGIC: Check if ALL categories are selected (= "Tất cả")
        const totalCategories = categories.length;
        const allCategoriesSelected = activeBusinessTypes.length === totalCategories && totalCategories > 0;
        
        // 🔥 FIX: Smart category filtering logic:
        // - If ALL categories selected → undefined (no filter, get ALL merchants)
        // - If SOME categories selected → array of names (filter by selected)
        // - If NO categories selected → undefined (no filter)
        const businessTypes = allCategoriesSelected
          ? undefined  // 🔥 ALL selected = no filter (get all merchants)
          : businessTypeNames.length > 0 
            ? businessTypeNames  // 🔥 SOME selected = filter by names
            : undefined;  // 🔥 NONE selected = no filter
        
        console.log('🆔 MapPage: Business types for merchants query:', businessTypes);
        
        const merchants = merchantStatusCodes.length > 0 
          ? await fetchMerchants(merchantStatusCodes, businessTypes)
          : [];
        
        console.log('📦 MapPage: Received', merchants.length, 'merchants from API');
        console.log('📍 MapPage: First 3 merchants:', merchants.slice(0, 3));
        
        setRestaurants(merchants);
        setIsLoadingData(false);
        console.log('✅ MapPage: Successfully loaded', merchants.length, 'merchants');
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load merchants:', error);
        setDataError(error.message || 'Không thể tải dữ liệu merchants');
        setIsLoadingData(false);
      }
    }
    
    // Only fetch merchants if Merchants layer is selected
    if (pointStatuses.length > 0 && showMerchants && !showMapPoints && !showOfficers) {
      loadMerchants();
    }
  }, [filters, pointStatuses, businessTypeFilters, showMerchants, showMapPoints, showOfficers, categories]); // Re-fetch when layer changes
  
  // 🔥 NEW: Clear restaurants when Officers layer is selected (ward boundaries don't need points)
  useEffect(() => {
    if (showOfficers) {
      console.log('👮 MapPage: Officers layer selected - clearing restaurants');
      setRestaurants([]);
      setIsLoadingData(false);
    }
  }, [showOfficers]);
  
  // Setup global function for popup button click
  useEffect(() => {
    (window as any).openPointDetail = (pointId: string) => {
      console.log('🔍 openPointDetail called with ID:', pointId);
      console.log('📊 Current restaurants count:', restaurants.length);
      console.log('📊 All restaurants count:', allRestaurants.length);
      
      // 🔥 FIX: Search in allRestaurants (unfiltered) instead of restaurants (filtered)
      // This ensures popup buttons work even when point is filtered out from map
      const point = allRestaurants.find(r => r.id === pointId) || restaurants.find(r => r.id === pointId);
      
      if (point) {
        console.log('✅ Found point:', point.name);
        setDetailModalPoint(point);
        setIsDetailModalOpen(true);
      } else {
        console.warn('❌ Point not found for ID:', pointId);
        console.warn('❌ Searched in', allRestaurants.length, 'allRestaurants and', restaurants.length, 'restaurants');
      }
    };
    
    (window as any).openPointReview = (pointId: string) => {
      console.log('🔍 openPointReview called with ID:', pointId);
      console.log('📊 Current restaurants count:', restaurants.length);
      console.log('📊 All restaurants count:', allRestaurants.length);
      
      // 🔥 FIX: Search in allRestaurants (unfiltered) instead of restaurants (filtered)
      const point = allRestaurants.find(r => r.id === pointId) || restaurants.find(r => r.id === pointId);
      
      if (point) {
        console.log('✅ Found point for review:', point.name);
        setReviewModalPoint(point);
        setIsReviewModalOpen(true);
      } else {
        console.warn('❌ Point not found for review ID:', pointId);
        console.warn('❌ Searched in', allRestaurants.length, 'allRestaurants and', restaurants.length, 'restaurants');
      }
    };
    
    return () => {
      delete (window as any).openPointDetail;
      delete (window as any).openPointReview;
    };
  }, [restaurants, allRestaurants]); // ✅ Add both dependencies
  
  // Location filters
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  
  // 🔥 NEW: Date range filter
  const [dateRange, setDateRange] = useState<string>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  
  // Get unique provinces (currently only Hà Ni)
  const provinces = getProvinceNames();
  
  // Get districts for selected province
  const availableDistricts = selectedProvince 
    ? getDistrictsByProvince(selectedProvince).map(d => d.name)
    : [];
  
  // Get wards for selected district
  const availableWards = selectedDistrict 
    ? getWardsByDistrict(selectedDistrict).map(w => w.name)
    : [];
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown-trigger]')) {
        setShowProvinceDropdown(false);
        setShowDistrictDropdown(false);
        setShowWardDropdown(false);
        setShowSearchDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        (event.target as HTMLElement).classList.contains(styles.mapContainer)
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

  // Reset stats card visibility when business type filters change
  useEffect(() => {
    const hasBusinessTypeFilter = Object.values(businessTypeFilters).some(v => v);
    if (hasBusinessTypeFilter) {
      setIsStatsCardVisible(true);
    }
  }, [businessTypeFilters]);

  // 🔥 NEW: Handle ward polygon click to show officer info
  const handleWardClick = (wardName: string, district: string) => {
    console.log('👮 Ward clicked:', wardName, district);
    
    // Find officer for this ward
    const officer = officersData.find(o => o.ward === wardName && o.district === district);
    
    if (officer) {
      console.log('✅ Found officer:', officer.fullName);
      setSelectedOfficer(officer);
      setSelectedWardName(wardName);
      setIsOfficerModalOpen(true);
    } else {
      console.warn('⚠️ No officer found for ward:', wardName, district);
      // Show first officer as fallback
      if (officersData.length > 0) {
        setSelectedOfficer(officersData[0]);
        setSelectedWardName(wardName);
        setIsOfficerModalOpen(true);
      }
    }
  };

  const handleFilterChange = (category: keyof CategoryFilter) => {
    const newFilters = {
      ...filters,
      [category]: !filters[category]
    };
    
    setFilters(newFilters);
    setPendingFilters(newFilters);  // Keep pending in sync
  };

  const handleBusinessTypeFilterChange = (type: string) => {
    const newFilters = {
      ...businessTypeFilters,
      [type]: !businessTypeFilters[type]
    };
    
    setBusinessTypeFilters(newFilters);
    setPendingBusinessTypeFilters(newFilters);  // Keep pending in sync
  };
  
  // 🔥 NEW: Handle "Tất cả" checkbox for business types
  const handleBusinessTypeToggleAll = (checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(businessTypeFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    setBusinessTypeFilters(newFilters);
    setPendingBusinessTypeFilters(newFilters);  // Keep pending in sync
  };
  
  // 🔥 NEW: Apply pending filters to actual filters
  const handleApplyFilters = () => {
    console.log('🔥 Applying filters...');
    console.log('📍 Before apply - filters:', filters);
    console.log('📍 Before apply - pendingFilters:', pendingFilters);
    console.log('📍 Before apply - businessTypeFilters:', businessTypeFilters);
    console.log('📍 Before apply - pendingBusinessTypeFilters:', pendingBusinessTypeFilters);
    
    setFilters(pendingFilters);
    setBusinessTypeFilters(pendingBusinessTypeFilters);
    
    console.log('✅ Filters applied!');
  };
  
  // 🔥 NEW: Save filters to localStorage
  const handleSaveFilters = () => {
    try {
      const filterState = {
        filters: pendingFilters,
        businessTypeFilters: pendingBusinessTypeFilters,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        startDate: customStartDate,  // 🔥 NEW: Save date range
        endDate: customEndDate,      // 🔥 NEW: Save date range
        searchQuery,                 // 🔥 NEW: Save search query
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('mappa_map_filters', JSON.stringify(filterState));
      console.log('💾 Filters saved to localStorage:', filterState);
    } catch (error) {
      console.error('❌ Failed to save filters:', error);
    }
  };
  
  // 🔥 NEW: Auto-save filters when they change (debounced)
  useEffect(() => {
    // 🔥 CRITICAL: Skip auto-save during initial load to prevent race condition
    if (!isInitialLoadComplete) {
      console.log('⏸️ Skipping auto-save: initial load not complete');
      return;
    }
    
    // Only auto-save if filters are fully loaded (to avoid saving empty state)
    if (pointStatuses.length > 0 && categories.length > 0 && 
        Object.keys(filters).length > 0 && Object.keys(businessTypeFilters).length > 0) {
      const timer = setTimeout(() => {
        handleSaveFilters();
        console.log('💾 Auto-saved filters after change');
      }, 500); // Debounce 500ms
      
      return () => clearTimeout(timer);
    }
  }, [filters, businessTypeFilters, selectedProvince, selectedDistrict, selectedWard, customStartDate, customEndDate, pointStatuses.length, categories.length, isInitialLoadComplete]);
  
  // 🔥 NEW: Reset all filters to default
  const handleResetAllFilters = () => {
    console.log('🔄 Resetting all filters to default...');
    
    // Reset status filters - enable all
    const defaultFilters = buildFilterObjectFromStatuses(pointStatuses);
    setFilters(defaultFilters);
    setPendingFilters(defaultFilters);
    
    // Reset business type filters - enable all
    const defaultBusinessTypeFilters: { [key: string]: boolean } = {};
    categories.forEach((cat) => {
      defaultBusinessTypeFilters[cat.id] = true;
    });
    setBusinessTypeFilters(defaultBusinessTypeFilters);
    setPendingBusinessTypeFilters(defaultBusinessTypeFilters);
    
    // Reset location filters
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    
    // Reset date range
    setCustomStartDate('');
    setCustomEndDate('');
    
    // Reset search query
    setSearchQuery('');
    
    // Clear localStorage
    localStorage.removeItem('mappa_map_filters');
    
    console.log('✅ All filters reset to default!');
    console.log('📊 Default status filters:', defaultFilters);
    console.log('📊 Default business type filters:', defaultBusinessTypeFilters);
  };
  
  // Handle stat card click to filter by category
  const handleStatCardClick = (category: keyof CategoryFilter | 'all') => {
    if (selectedCategory === category) {
      // Deselect - show all
      setSelectedCategory('all');
      setFilters({
        certified: true,
        hotspot: true,
        scheduled: true,
        inspected: true,
      });
    } else {
      // Select category - filter to only that category
      setSelectedCategory(category);
      if (category === 'all') {
        setFilters({
          certified: true,
          hotspot: true,
          scheduled: true,
          inspected: true,
        });
      } else {
        setFilters({
          certified: category === 'certified',
          hotspot: category === 'hotspot',
          scheduled: category === 'scheduled',
          inspected: category === 'inspected',
        });
      }
    }
  };
  
  // 🔥 NEW LOGIC: Frontend filtering from allRestaurants (no API calls)
  // Filter by: status filters + business type filters
  const filteredByFilters = useMemo(() => {
    console.log('🔍 MapPage: Applying frontend filters...');
    
    // 🔥 NEW: Determine data source based on active layer
    let dataSource: Restaurant[] = [];
    
    if (showMapPoints) {
      dataSource = allRestaurants;  // MapPoint layer uses allRestaurants
      console.log('📊 Data source: MapPoints (allRestaurants) - ', dataSource.length, 'points');
    } else if (showMerchants) {
      dataSource = restaurants;     // Merchant layer uses restaurants (from fetchMerchants)
      console.log('📊 Data source: Merchants (restaurants) - ', dataSource.length, 'merchants');
    } else if (showOfficers) {
      dataSource = [];               // Officers layer has no points
      console.log('📊 Data source: Officers (no points)');
    }
    
    console.log('📊 filters:', filters);
    console.log('📊 businessTypeFilters:', businessTypeFilters);
    
    if (!dataSource || dataSource.length === 0) {
      console.log('⚠️ No data to filter!');
      return [];
    }
    
    // 🔥 DEBUG: Check first item's structure
    console.log('🐛 First data item:', dataSource[0]);
    
    // 🔥 Count how many business type filters are enabled
    const enabledBusinessTypes = Object.keys(businessTypeFilters).filter(key => businessTypeFilters[key] === true);
    const totalBusinessTypes = Object.keys(businessTypeFilters).length;
    console.log(`🐛 Enabled business types: ${enabledBusinessTypes.length} / ${totalBusinessTypes}`);
    
    const filtered = dataSource.filter((restaurant) => {
      // 🔥 Filter by status (category field)
      if (!filters[restaurant.category]) {
        return false;
      }
      
      // 🔥 SKIP business type filtering if no filters are set (initial load)
      if (!businessTypeFilters || Object.keys(businessTypeFilters).length === 0) {
        return true; // Show all when no business type filters loaded yet
      }
      
      // 🔥 Filter by business type
      // Check if restaurant has categoryIds (Supabase data) or categoryId (mock data)
      const hasBusinessTypeData = Array.isArray((restaurant as any).categoryIds) || restaurant.categoryId;
      
      // Get enabled business type filter IDs
      const enabledFilterIds = Object.keys(businessTypeFilters).filter(id => businessTypeFilters[id] === true);
      
      // 🔥 FIX: If no business types are enabled, hide all restaurants (not show all)
      if (enabledFilterIds.length === 0) {
        return false;  // ← CHANGED: Hide all when no business types selected
      }
      
      // 🔥 NEW: Check if categoryId is a mock ID (not a UUID)
      // Mock IDs: 'mock-cat-1', 'mock-cat-2', etc.
      // Real UUIDs: '6e6c5511-6809-44f5-98bc-6e1a9c334278', etc.
      const categoryId = restaurant.categoryId;
      const isMockData = categoryId && typeof categoryId === 'string' && categoryId.startsWith('mock-');
      
      if (isMockData) {
        // 🔥 For mock data: Filter by TYPE field (name) instead of categoryId (UUID)
        // Map enabled category IDs → category names
        const enabledCategoryNames = enabledFilterIds
          .map(filterId => {
            const category = categories.find(c => c.id === filterId);
            return category?.name;
          })
          .filter((name): name is string => name !== undefined);
        
        // Check if restaurant.type matches any enabled category name
        const typeMatches = enabledCategoryNames.some(categoryName => 
          restaurant.type === categoryName
        );
        
        return typeMatches;
      }
      
      // 🔥 For Supabase data: Filter by categoryIds (UUIDs)
      if (!hasBusinessTypeData) {
        return true; // Don't filter out data without categoryIds
      }
      
      // Check if restaurant matches any enabled business type
      const restaurantCategoryIds = (restaurant as any).categoryIds || (restaurant.categoryId ? [restaurant.categoryId] : []);
      const hasActiveBusinessType = enabledFilterIds.some(filterId => 
        restaurantCategoryIds.includes(filterId)
      );
      
      return hasActiveBusinessType;
    });
    
    console.log(`✅ Filtered by filters: ${filtered.length} / ${dataSource.length}`);
    return filtered;
  }, [allRestaurants, restaurants, showMapPoints, showMerchants, showOfficers, filters, businessTypeFilters, categories]);
  
  // Apply location and search filters on top of filter results
  const filteredRestaurants = useMemo(() => {
    console.log('🔍 MapPage: Applying location/search filters...');
    console.log('📊 filteredByFilters.length:', filteredByFilters.length);
    console.log('🔎 searchQuery:', searchQuery);
    
    if (!filteredByFilters || filteredByFilters.length === 0) {
      console.log('⚠️ No restaurants to filter!');
      return [];
    }
    
    // 🐛 DEBUG: Log all restaurant names to check data
    if (searchQuery.trim() !== '') {
      console.log('🐛 All available restaurant names:', filteredByFilters.map(r => r.name));
      console.log('🐛 Searching for:', searchQuery);
    }
    
    return filteredByFilters.filter((restaurant) => {
      // Filter by province
      if (selectedProvince && restaurant.province !== selectedProvince) {
        return false;
      }
      
      // Filter by district
      if (selectedDistrict && restaurant.district !== selectedDistrict) {
        return false;
      }
      
      // Filter by ward
      if (selectedWard && restaurant.ward !== selectedWard) {
        return false;
      }
      
      // Filter by search query (name or address or type)
      if (searchQuery.trim() === '') return true;
      
      const searchLower = searchQuery.toLowerCase();
      const nameLower = restaurant.name.toLowerCase();
      const addressLower = restaurant.address.toLowerCase();
      const typeLower = restaurant.type.toLowerCase();
      
      const searchMatch = 
        nameLower.includes(searchLower) ||
        addressLower.includes(searchLower) ||
        typeLower.includes(searchLower);
      
      // 🐛 DEBUG: Log each match attempt
      if (searchQuery.trim() !== '') {
        console.log(`🔍 Checking "${restaurant.name}":`, {
          name: nameLower,
          searchQuery: searchLower,
          nameMatch: nameLower.includes(searchLower),
          addressMatch: addressLower.includes(searchLower),
          typeMatch: typeLower.includes(searchLower),
          finalMatch: searchMatch
        });
      }
      
      return searchMatch;
    });
  }, [filteredByFilters, searchQuery, selectedProvince, selectedDistrict, selectedWard]);
  
  // 🔥 NEW: Log final search results
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      console.log(`🔎 Search results for "${searchQuery}": ${filteredRestaurants.length} matches`);
      console.log('📍 Active layer:', showMapPoints ? 'MapPoints' : showMerchants ? 'Merchants' : 'Officers');
      console.log(' Matched items:', filteredRestaurants.slice(0, 5).map(r => ({ name: r.name, type: r.type, category: r.category })));
    }
  }, [searchQuery, filteredRestaurants, showMapPoints, showMerchants]);
  
  // 🔥 NEW: Check if there are unapplied changes
  const hasUnappliedChanges = useMemo(() => {
    // 🔥 DISABLED: Real-time filtering - no need for "Apply" button
    return false;
    
    // Check if filters differ
    const filtersDiffer = Object.keys(filters).some(key => {
      return filters[key as keyof CategoryFilter] !== pendingFilters[key as keyof CategoryFilter];
    });
    
    // Check if business type filters differ
    const businessTypeFiltersDiffer = Object.keys(businessTypeFilters).some(key => {
      return businessTypeFilters[key] !== pendingBusinessTypeFilters[key];
    });
    
    return filtersDiffer || businessTypeFiltersDiffer;
  }, [filters, pendingFilters, businessTypeFilters, pendingBusinessTypeFilters]);

  // Get autocomplete suggestions (limit to 8 results)
  const autocompleteSuggestions = searchQuery.trim() 
    ? filteredRestaurants.slice(0, 8)
    : [];

  const handleSelectSuggestion = (restaurant: Restaurant) => {
    setSearchQuery(restaurant.name);
    setShowSearchDropdown(false);
    setSelectedRestaurant(restaurant);
  };

  const handleSearchChange = (value: string) => {
    console.log('🔎 Search query changed:', value);
    setSearchQuery(value);
    if (!value.trim()) {
      setSelectedRestaurant(null);
    }
  };
  
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7.5rem)' }}>
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ điều hành' }]}
        title="Bản đồ điều hành"
        actions={
          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <DateRangePicker
              startDate={customStartDate}
              endDate={customEndDate}
              onStartDateChange={setCustomStartDate}
              onEndDateChange={setCustomEndDate}
              onClear={() => {
                setCustomStartDate('');
                setCustomEndDate('');
                // 🔥 NEW: Auto-save when clearing date range
                setTimeout(() => handleSaveFilters(), 100);
              }}
              onApply={handleSaveFilters}  // 🔥 NEW: Auto-save when applying date range
            />
            
            {/* Map Layer Select */}
            <div style={{ position: 'relative' }}>
              <select
                value={
                  showMapPoints ? 'mappoint' : 
                  showMerchants ? 'merchant' : 
                  showOfficers ? 'officers' : 'mappoint'
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === 'mappoint') {
                    setShowMapPoints(true);
                    setShowMerchants(false);
                    setShowOfficers(false);
                  } else if (value === 'merchant') {
                    setShowMapPoints(false);
                    setShowMerchants(true);
                    setShowOfficers(false);
                  } else if (value === 'officers') {
                    setShowMapPoints(false);
                    setShowMerchants(false);
                    setShowOfficers(true);
                  }
                }}
                style={{
                  fontFamily: 'var(--font-family-base)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: '500',
                  padding: '0 var(--spacing-4) 0 var(--spacing-3)',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  cursor: 'pointer',
                  outline: 'none',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right var(--spacing-2) center',
                  backgroundSize: '16px',
                  minWidth: '160px',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 92, 182, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="mappoint">📍 MapPoint</option>
                <option value="merchant">🏪 Merchant</option>
                <option value="officers">👮 Cán bộ quản lý</option>
              </select>
            </div>
            <Button variant="outline" onClick={handleResetAllFilters}>🔄 Reset</Button>
            <Button variant="outline">Xuất bản đồ</Button>
            <Button>Thêm điểm</Button>
          </div>
        }
      />

      {/* Loading State */}
      {isLoadingData && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-family-base)',
          fontSize: 'var(--font-size-base)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid var(--color-border)',
              borderTop: '4px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto var(--spacing-4)'
            }} />
            <div>Đang tải dữ liệu bản đồ...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {dataError && !isLoadingData && (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-background)',
          padding: 'var(--spacing-6)'
        }}>
          <div style={{
            maxWidth: '500px',
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
            fontFamily: 'var(--font-family-base)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: 'var(--spacing-4)' }}>⚠️</div>
            <h3 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-3)',
              color: 'var(--color-text)'
            }}>
              Không thể tải dữ liệu
            </h3>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-5)',
              lineHeight: 1.6
            }}>
              {dataError}
            </p>
            <Button onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </div>
      )}

      {/* Map Content - Only show when data is loaded */}
      {!isLoadingData && !dataError && (
        <div style={{ flex: 1, display: 'flex', padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-6) var(--spacing-6)' }}>
          {/* Map Canvas - Now takes full width */}
          <div className={styles.mapContainer} style={{ position: 'relative', width: '100%', height: '100%' }} ref={mapContainerRef}>
            {/* Map Legend - Horizontal at Top */}
            {!showOfficers && isLegendVisible && (() => {
              // 🔥 Color mapping - HARDCODED (giữ nguyên theo design system)
              const colorMap: { [key: string]: string } = {
                'certified': '#22c55e',   // Green
                'hotspot': '#ef4444',      // Red  
                'scheduled': '#f59e0b',    // Yellow/Orange
                'inspected': '#005cb6',    // MAPPA Blue
              };
              
              // 🐛 DEBUG: Log status codes để check matching
              console.log('🎨 MapLegend - Point statuses:', pointStatuses.map(s => ({ code: s.code, name: s.name })));
              console.log('🎨 MapLegend - ColorMap keys:', Object.keys(colorMap));
              
              const categoryData = pointStatuses.map(status => {
                const color = colorMap[status.code] || '#005cb6';
                console.log(`🎨 MapLegend - status.code="${status.code}" → color="${color}"`);
                return {
                  key: status.code,
                  label: status.name,                                 // 📦 FROM DB
                  color: color,                                       // 🎨 HARDCODED
                  count: filteredRestaurants.filter(r => r.category === status.code).length
                };
              });
              
              return (
                <MapLegend 
                  categoryData={categoryData}
                  onClose={() => setIsLegendVisible(false)}
                  ref={legendRef}
                />
              );
            })()}

            {/* 🔥 Only show Location Stats Card when NOT on Officers layer */}
            {!showOfficers && (
              <LocationStatsCard
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWard={selectedWard}
                filteredRestaurants={filteredRestaurants}
                businessTypeFilters={businessTypeFilters}
                categories={categories}
                onClose={() => {
                  setSelectedProvince('');
                  setSelectedDistrict('');
                  setSelectedWard('');
                }}
                isVisible={isStatsCardVisible}
                onVisibilityChange={setIsStatsCardVisible}
                ref={statsCardRef}
              />
            )}

            <LeafletMap 
              filters={filters}
              businessTypeFilters={businessTypeFilters}
              searchQuery={searchQuery} 
              selectedRestaurant={selectedRestaurant}
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              restaurants={filteredRestaurants}  // 🔥 CRITICAL: Pass filtered array, not restaurants
              showWardBoundaries={showOfficers}
              onPointClick={(point) => {
                setDetailModalPoint(point);
                setIsDetailModalOpen(true);
              }}
              onWardClick={handleWardClick}
              onFullscreenClick={() => setIsFullscreenMapOpen(true)}
            />

            {/* Filter Panel with Toggle Buttons */}
            <div style={{
              position: 'absolute',
              top: '80px', // Below zoom controls (+ and - buttons)
              left: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              zIndex: 500 // Above all map overlays
            }}>
              {/* Legend Toggle Button */}
              <button
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '4px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'background 0.2s'
                }}
                onClick={() => setIsLegendVisible(!isLegendVisible)}
                aria-label="Mở/Đóng chú giải"
                title="Chú giải bản đồ"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f4f4f4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <MapPin size={18} strokeWidth={2.5} />
              </button>

              {/* Stats Toggle Button */}
              <button
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '4px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'background 0.2s'
                }}
                onClick={() => setIsStatsCardVisible(!isStatsCardVisible)}
                aria-label="Mở/Đóng thống kê"
                title="Thống kê địa bàn"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f4f4f4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                }}
              >
                <BarChart3 size={18} strokeWidth={2.5} />
              </button>

              {/* Filter Toggle Button */}
              <button
                ref={filterToggleBtnRef}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '4px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  background: isFilterPanelOpen ? 'var(--primary)' : 'white',
                  color: isFilterPanelOpen ? 'white' : 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'none',
                  transition: 'background 0.2s'
                }}
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                aria-label="Mở/Đóng bộ lọc"
                title="Bộ lọc nâng cao"
                onMouseEnter={(e) => {
                  if (!isFilterPanelOpen) {
                    e.currentTarget.style.background = '#f4f4f4';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFilterPanelOpen) {
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                <SlidersHorizontal size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Filter Panel */}
            <MapFilterPanel
              isOpen={isFilterPanelOpen}
              filters={pendingFilters}  // 🔥 CHANGED: Use pending filters for UI
              businessTypeFilters={pendingBusinessTypeFilters}  // 🔥 CHANGED: Use pending business type filters
              restaurants={restaurants}
              pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses
              categories={categories}        // 🔥 PASS: Categories from database
              selectedProvince={selectedProvince}
              selectedDistrict={selectedDistrict}
              selectedWard={selectedWard}
              startDate={customStartDate}    //  NEW: Pass date range
              endDate={customEndDate}        // 🔥 NEW: Pass date range
              filteredCount={filteredRestaurants.length}
              onFilterChange={handleFilterChange}  // 🔥 Updates pending filters
              onBusinessTypeFilterChange={handleBusinessTypeFilterChange}  // 🔥 Updates pending filters
              onBusinessTypeToggleAll={handleBusinessTypeToggleAll}
              onProvinceChange={(province) => {
                setSelectedProvince(province);
                setSelectedDistrict(''); // Reset district when province changes
                setSelectedWard(''); // Reset ward when province changes
              }}
              onDistrictChange={(district) => {
                setSelectedDistrict(district);
                setSelectedWard(''); // Reset ward when district changes
              }}
              onWardChange={(ward) => {
                setSelectedWard(ward);
              }}
              onClose={() => setIsFilterPanelOpen(false)}
              onApplyFilters={handleApplyFilters}  // 🔥 NEW: Apply button callback
              onSaveFilters={handleSaveFilters}  // 🔥 NEW: Save button callback
              hasUnappliedChanges={hasUnappliedChanges}  // 🔥 NEW: Show button when changes exist
              ref={filterPanelRef}
            />
          </div>
        </div>
      )}
      
      {/* Point Detail Modal */}
      <PointDetailModal 
        point={detailModalPoint}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      
      {/* Review Modal */}
      <ReviewModal 
        point={reviewModalPoint}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
      
      {/* 🔥 NEW: Officer Info Modal */}
      <OfficerInfoModal 
        isOpen={isOfficerModalOpen}
        onClose={() => setIsOfficerModalOpen(false)}
        officer={selectedOfficer}
        wardName={selectedWardName}
      />
      
      {/* Fullscreen Map Modal */}
      <FullscreenMapModal 
        isOpen={isFullscreenMapOpen}
        onClose={() => setIsFullscreenMapOpen(false)}
        filters={filters}
        businessTypeFilters={businessTypeFilters}
        searchQuery={searchQuery}
        selectedRestaurant={selectedRestaurant}
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        selectedWard={selectedWard}
        restaurants={restaurants}
        pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses to fullscreen modal
        categories={categories}  // 🔥 NEW: Pass categories for mapping ID to name
        onPointClick={(point) => {
          setDetailModalPoint(point);
          setIsDetailModalOpen(true);
        }}
        onFilterChange={handleFilterChange}
        onBusinessTypeFilterChange={handleBusinessTypeFilterChange}
        onBusinessTypeToggleAll={handleBusinessTypeToggleAll}
        onProvinceChange={(province) => {
          setSelectedProvince(province);
          setSelectedDistrict(''); // Reset district when province changes
          setSelectedWard(''); // Reset ward when province changes
        }}
        onDistrictChange={(district) => {
          setSelectedDistrict(district);
          setSelectedWard(''); // Reset ward when district changes
        }}
        onWardChange={(ward) => {
          setSelectedWard(ward);
        }}
      />
    </div>
  );
}