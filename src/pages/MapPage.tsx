import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import PageHeader from '../layouts/PageHeader';
import { Button } from '../app/components/ui/button';
import { MapPin, SlidersHorizontal, BarChart3 } from 'lucide-react';
import LeafletMap from '../app/components/map/LeafletMap';
import { PointDetailModal } from '../app/components/map/PointDetailModal';
import { ReviewModal } from '../app/components/map/ReviewModal';
import { FullscreenMapModal } from '../app/components/map/FullscreenMapModal';
import { MapFilterPanel } from '../app/components/map/MapFilterPanel';
import { OfficerFilterPanel } from '../app/components/map/OfficerFilterPanel';
import { OfficerStatsOverlay } from '../app/components/map/OfficerStatsOverlay';
import { LocationStatsCard } from '../app/components/map/LocationStatsCard';
import { MapLegend } from '../app/components/map/MapLegend';
import { OfficerInfoModal } from '../app/components/map/OfficerInfoModal';
import { DateRangePicker } from '../app/components/map/DateRangePicker';
import { UploadExcelModal } from '../app/components/map/UploadExcelModal';
import { Toaster } from 'sonner';
import styles from './MapPage.module.css';
import { Restaurant } from '../data/restaurantData';
import { getProvinceNames, getDistrictsByProvince, getWardsByDistrict } from '../data/vietnamLocations';
import { fetchMapPoints } from '../utils/api/mapPointsApi';
import { fetchPointStatuses, PointStatus, buildFilterObjectFromStatuses } from '../utils/api/pointStatusApi';
import { fetchCategories, Category } from '../utils/api/categoriesApi';
import { fetchMerchants, fetchMerchantStats, MerchantStats } from '../utils/api/merchantsApi';
import { fetchMarketManagementTeams, Department } from '../utils/api/departmentsApi';
import { officersData, Officer, teamsData, departmentData } from '../data/officerTeamData';

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
  
  // 🔥 NEW: Departments from departments table
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  
  // Data state - fetch from Postgres table map_points
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);  // 🔥 Track if initial data has loaded
  
  // 🔥 NEW: Store ALL restaurants (unfiltered) - fetch once, never refetch
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  
  // 🔥 NEW: Flag to prevent auto-save during initial load
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  
  // 🔥 FIX: Use refs to track if filters are being initialized (prevent API calls during init)
  const isInitializingFiltersRef = useRef(false);
  
  const [filters, setFilters] = useState<CategoryFilter>({});
  
  const [businessTypeFilters, setBusinessTypeFilters] = useState<{ [key: string]: boolean }>({});
  
  // 🔥 NEW: Department filters
  const [departmentFilters, setDepartmentFilters] = useState<{ [key: string]: boolean }>({});
  
  // 🔥 NEW: Pending filters - chỉ apply khi user bấm nút "Áp dụng"
  const [pendingFilters, setPendingFilters] = useState<CategoryFilter>({});
  const [pendingBusinessTypeFilters, setPendingBusinessTypeFilters] = useState<{ [key: string]: boolean }>({});
  const [pendingDepartmentFilters, setPendingDepartmentFilters] = useState<{ [key: string]: boolean }>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof CategoryFilter | 'all'>('all');
  
  // 🔥 NEW: Realtime clock for header
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time display
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const formatDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };
  
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
  
  // 🔥 NEW: Upload Excel modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Map UI state (similar to FullscreenMapModal)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isLegendVisible, setIsLegendVisible] = useState(false);  // 🔥 Hidden by default, show on icon click
  const [isStatsCardVisible, setIsStatsCardVisible] = useState(true);
  const [isOfficerStatsVisible, setIsOfficerStatsVisible] = useState(true); // 🔥 NEW: Officer stats overlay visibility
  
  // 🔥 NEW: Map layer toggles
  const [showMapPoints, setShowMapPoints] = useState(false);  // MapPoint layer (tạm ẩn)
  const [showMerchants, setShowMerchants] = useState(true);  // Merchant layer (hiển thị với tên "Chủ Hộ Kinh Doanh")
  const [showOfficers, setShowOfficers] = useState(false);  // Officers layer (Cán bộ quản lý)
  
  // 🔥 NEW: Selected team for officers layer filter
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  // 🔥 NEW: Statistics from API (background fetch)
  const [merchantStats, setMerchantStats] = useState<MerchantStats | null>(null);
  const [hasFetchedStats, setHasFetchedStats] = useState(false);
  
  // Refs for click outside logic
  const filterPanelRef = useRef<HTMLDivElement>(null);
  const filterToggleBtnRef = useRef<HTMLButtonElement>(null);
  const legendRef = useRef<HTMLDivElement>(null);
  const statsCardRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // 🔥 Fetch point statuses from point_status table on mount
  useEffect(() => {
    async function loadPointStatuses() {
      try {
        const statuses = await fetchPointStatuses();
        
        setPointStatuses(statuses);
        
        // Build initial filters from statuses (all enabled by default)
        const initialFilters = buildFilterObjectFromStatuses(statuses);
        setFilters(initialFilters);
        setPendingFilters(initialFilters);  // 🔥 Sync pending filters
        
        setIsLoadingStatuses(false);
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
      try {
        const cats = await fetchCategories();
        
        setCategories(cats);
        
        // 🔥 FIX: Initialize businessTypeFilters with ALL categories enabled (= "Tất cả")
        if (cats.length > 0) {
          isInitializingFiltersRef.current = true; // 🔥 FIX: Mark as initializing
          const initialBusinessTypeFilters: { [key: string]: boolean } = {};
          cats.forEach((cat) => {
            initialBusinessTypeFilters[cat.id] = true;  // 🔥 ALL categories enabled by default
          });
          setBusinessTypeFilters(initialBusinessTypeFilters);
          setPendingBusinessTypeFilters(initialBusinessTypeFilters);  // 🔥 Sync pending
          // Reset flag after state update
          setTimeout(() => {
            isInitializingFiltersRef.current = false;
          }, 0);
        }
        
        setIsLoadingCategories(false);
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load categories:', error);
        setIsLoadingCategories(false);
      }
    }
    
    loadCategories();
  }, []); // Run once on mount
  
  // 🔥 NEW: Fetch departments from departments table on mount
  useEffect(() => {
    async function loadDepartments() {
      try {
        const depts = await fetchMarketManagementTeams();
        
        setDepartments(depts);
        
        // 🔥 Initialize departmentFilters with ALL departments enabled (= "Tất cả")
        if (depts.length > 0) {
          isInitializingFiltersRef.current = true; // 🔥 FIX: Mark as initializing
          const initialDepartmentFilters: { [key: string]: boolean } = {};
          depts.forEach((dept) => {
            initialDepartmentFilters[dept.id] = true;  // 🔥 ALL departments enabled by default
          });
          setDepartmentFilters(initialDepartmentFilters);
          setPendingDepartmentFilters(initialDepartmentFilters);  // 🔥 Sync pending
          // Reset flag after state update
          setTimeout(() => {
            isInitializingFiltersRef.current = false;
          }, 0);
        }
        
        setIsLoadingDepartments(false);
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load departments:', error);
        setIsLoadingDepartments(false);
      }
    }
    
    loadDepartments();
  }, []); // Run once on mount
  
  // 🔥 NEW: Load saved filters from localStorage on mount
  useEffect(() => {
    // Only load saved filters after statuses and categories are loaded
    if (pointStatuses.length === 0 || categories.length === 0) {
      return;
    }
    
    try {
      const savedFiltersStr = localStorage.getItem('mappa_map_filters');
      if (savedFiltersStr) {
        const savedFilters = JSON.parse(savedFiltersStr);
        
        // 🔥 VALIDATE: Check if saved filters match current point statuses
        if (savedFilters.filters) {
          const savedFilterKeys = Object.keys(savedFilters.filters);
          const validStatusCodes = pointStatuses.map(s => s.code);
          const isValidFilter = savedFilterKeys.every(key => validStatusCodes.includes(key));
          
          if (isValidFilter) {
            isInitializingFiltersRef.current = true; // 🔥 FIX: Mark as initializing
            setFilters(savedFilters.filters);
            setPendingFilters(savedFilters.filters);
            setTimeout(() => {
              isInitializingFiltersRef.current = false;
            }, 0);
          } else {
          }
        }
        
        // 🔥 VALIDATE: Check if saved business type filters match current categories
        if (savedFilters.businessTypeFilters) {
          const savedBusinessTypeKeys = Object.keys(savedFilters.businessTypeFilters);
          const validCategoryIds = categories.map(c => c.id);
          const isValidBusinessTypeFilter = savedBusinessTypeKeys.every(key => validCategoryIds.includes(key));
          
          if (isValidBusinessTypeFilter) {
            isInitializingFiltersRef.current = true; // 🔥 FIX: Mark as initializing
            setBusinessTypeFilters(savedFilters.businessTypeFilters);
            setPendingBusinessTypeFilters(savedFilters.businessTypeFilters);
            setTimeout(() => {
              isInitializingFiltersRef.current = false;
            }, 0);
          } else {
          }
        }
        
        if (savedFilters.selectedProvince) {
          setSelectedProvince(savedFilters.selectedProvince);
        } else {
          // Default to Hà Nội if no saved province
          setSelectedProvince('Hà Nội');
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
        
      } else {
        // Default to Hà Nội when no saved filters
        setSelectedProvince('Hà Nội');
      }
    } catch (error) {
      console.error('❌ Failed to load saved filters:', error);
    }
    
    // 🔥 CRITICAL: Mark initial load complete AFTER loading saved filters
    // This prevents auto-save from overwriting the saved filters during load
    setTimeout(() => {
      setIsInitialLoadComplete(true);
    }, 100);
  }, [pointStatuses, categories]); // Run after statuses and categories are loaded
  
  // 🔥 Fetch map points from map_points table on mount AND when filters change
  useEffect(() => {
    async function loadMapPoints() {
      setIsLoadingData(true);
      setDataError(null);
      
      try {
        // 🔥 NEW: Fetch ALL points without filters (one-time fetch)
        const points = await fetchMapPoints();  // No statusIds, no categoryIds = get ALL
        
        
        setAllRestaurants(points);  // 🔥 Store ALL points
        setIsLoadingData(false);
        setHasInitialDataLoaded(true);  // 🔥 Mark initial data as loaded
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
  
  // 🔥 FIX: Use ref to track if initial fetch has been done (prevent infinite loop)
  const hasFetchedMerchantsRef = useRef(false);
  
  // 🔥 FIX: Serialize filters to string for comparison (prevent unnecessary API calls)
  const filtersKey = useMemo(() => {
    // Serialize filters with their values to detect actual changes
    const filtersStr = JSON.stringify(filters);
    const businessTypeFiltersStr = JSON.stringify(businessTypeFilters);
    const departmentFiltersStr = JSON.stringify(departmentFilters);
    return JSON.stringify({
      filters: filtersStr,
      businessTypeFilters: businessTypeFiltersStr,
      departmentFilters: departmentFiltersStr,
      categoriesLength: categories.length,
      showMerchants,
      showMapPoints,
      showOfficers
    });
  }, [filters, businessTypeFilters, departmentFilters, categories.length, showMerchants, showMapPoints, showOfficers]);
  
  // 🔥 FIX: Use ref to track last filters key (prevent duplicate API calls)
  const lastFiltersKeyRef = useRef<string>('');
  
  // 🔥 NEW: Fetch merchants from merchants table when Merchants layer is selected
  useEffect(() => {
    // 🔥 FIX: Skip API call if filters are being initialized (prevent unnecessary calls)
    if (isInitializingFiltersRef.current) {
      return;
    }
    
    // 🔥 FIX: Skip API call if filters haven't actually changed
    if (filtersKey === lastFiltersKeyRef.current) {
      return;
    }
    
    // 🔥 FIX: Only fetch if Merchants layer is selected
    if (!showMerchants || showMapPoints || showOfficers || pointStatuses.length === 0) {
      return;
    }
    
    async function loadMerchants() {
      
      // 🔥 Only show loading if initial data hasn't loaded yet (first time)
      // When filters change, don't show loading - just update data silently
      if (!hasFetchedMerchantsRef.current) {
        setIsLoadingData(true);
      }
      setDataError(null);
      
      try {
        // 🔥 Map point_status codes to merchant status codes
        // point_status: certified, hotspot, scheduled, inspected
        // merchant status: active, pending, suspended, rejected
        const activeFilterCodes = Object.keys(filters).filter(key => filters[key] === true);
        
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
        
        
        // 🔥 NEW: Get enabled department IDs from departmentFilters
        const enabledDepartmentIds = Object.keys(departmentFilters).filter(id => departmentFilters[id] === true);
        const totalDepartmentFilters = Object.keys(departmentFilters).length;
        
        // Only filter by department if there are filters set AND not all are enabled
        const departmentIdsToFilter = (totalDepartmentFilters > 0 && enabledDepartmentIds.length < totalDepartmentFilters)
          ? enabledDepartmentIds
          : undefined;  // If all enabled or no filters, don't filter by department
        
        const merchants = merchantStatusCodes.length > 0 || businessTypes || departmentIdsToFilter
          ? await fetchMerchants(merchantStatusCodes, businessTypes, departmentIdsToFilter)
          : [];
        
        
        setRestaurants(merchants);
        setIsLoadingData(false);
        hasFetchedMerchantsRef.current = true;  // 🔥 FIX: Use ref instead of state to prevent infinite loop
        setHasInitialDataLoaded(true);  // 🔥 Keep for other UI checks
        lastFiltersKeyRef.current = filtersKey; // 🔥 FIX: Update last filters key after successful fetch
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load merchants:', error);
        setDataError(error.message || 'Không thể tải dữ liệu merchants');
        setIsLoadingData(false);
        // Don't set hasFetchedMerchantsRef on error - will retry
      }
    }
    
    // Don't update lastFiltersKeyRef here - only update after successful API call
    loadMerchants();
  }, [filtersKey, pointStatuses.length, showMerchants, showMapPoints, showOfficers]); // 🔥 FIX: Use serialized filters key instead of raw objects
  
  // 🔥 NEW: Clear restaurants when Officers layer is selected (ward boundaries don't need points)
  useEffect(() => {
    if (showOfficers) {
      setRestaurants([]);
      setIsLoadingData(false);
    }
  }, [showOfficers]);
  
  // Setup global function for popup button click
  useEffect(() => {
    (window as any).openPointDetail = (pointId: string, event?: Event) => {
      // 🔥 FIX: Stop event propagation to prevent bubble-up click from closing modal
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      
      
      // 🔥 FIX: Search in allRestaurants (unfiltered) instead of restaurants (filtered)
      // This ensures popup buttons work even when point is filtered out from map
      const point = allRestaurants.find(r => r.id === pointId) || restaurants.find(r => r.id === pointId);
      
      if (point) {
        // 🔥 FIX: Use setTimeout with delay to ensure modal opens after all click events complete
        // This prevents the click event from bubble-up popup close from closing the modal
        setTimeout(() => {
          setDetailModalPoint(point);
          setIsDetailModalOpen(true);
        }, 50); // 🔥 FIX: Small delay to let Leaflet popup close event complete
      } else {
      }
    };
    
    (window as any).openPointReview = (pointId: string) => {
      
      // 🔥 FIX: Search in allRestaurants (unfiltered) instead of restaurants (filtered)
      const point = allRestaurants.find(r => r.id === pointId) || restaurants.find(r => r.id === pointId);
      
      if (point) {
        setReviewModalPoint(point);
        setIsReviewModalOpen(true);
      } else {
      }
    };
    
    return () => {
      delete (window as any).openPointDetail;
      delete (window as any).openPointReview;
    };
  }, [restaurants, allRestaurants]); // ✅ Add both dependencies
  
  // Location filters
  const [selectedProvince, setSelectedProvince] = useState<string>('Hà Nội');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  
  // 🔥 NEW: Fetch merchant statistics in background on first load and when location changes
  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch stats with all statuses (no filter) for total count
        const stats = await fetchMerchantStats(selectedProvince || undefined, selectedDistrict || undefined, selectedWard || undefined);
        setMerchantStats(stats);
        if (!hasFetchedStats) {
          setHasFetchedStats(true);
        }
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load stats (background, non-blocking):', error);
      }
    }
    
    // Run in background (don't await) - fetch on mount and when location changes
    loadStats();
  }, [selectedProvince, selectedDistrict, selectedWard]); // Re-fetch when location changes
  
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
      
      // 🔥 FIX: Don't close if clicking on ScopeSelector (in header)
      if (
        target.closest('[data-scope-selector="true"]') ||
        target.closest('[data-scope-dropdown="true"]')
      ) {
        return;
      }
      
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
      const targetElement = event.target as HTMLElement;
      
      // Don't close if clicking inside filter panel or its toggle button
      if (
        filterPanelRef.current?.contains(target) ||
        filterToggleBtnRef.current?.contains(target)
      ) {
        return;
      }

      // Don't close if clicking on other UI boxes (including ScopeSelector in header)
      if (
        legendRef.current?.contains(target) ||
        statsCardRef.current?.contains(target) ||
        targetElement.closest('[data-scope-selector="true"]') ||  // 🔥 FIX: Exclude ScopeSelector by data attribute
        targetElement.closest('[data-scope-dropdown="true"]') ||  // 🔥 FIX: Exclude ScopeSelector dropdown
        targetElement.closest('button[aria-label="Chọn phạm vi giám sát"]')  // 🔥 FIX: Exclude ScopeSelector trigger
      ) {
        return;
      }

      // Don't close if clicking on markers/points (they have data-marker attribute)
      if (
        targetElement.closest('[class*="marker"]') ||
        targetElement.closest('[class*="point"]') ||
        targetElement.closest('.leaflet-marker-icon') ||
        targetElement.closest('.leaflet-popup')
      ) {
        return;
      }

      // Only close if clicking directly on map container (the Leaflet map itself)
      // Do NOT close if clicking outside the map area (header, sidebar, background, etc.)
      if (mapContainerRef.current?.contains(target)) {
        // Check if it's a direct click on the map canvas (not on other elements inside map container)
        const isMapClick = targetElement.closest('.leaflet-container') !== null;
        if (isMapClick) {
          setIsFilterPanelOpen(false);
        }
      }
      // If click is outside map container entirely, do nothing (don't close)
    };

    if (isFilterPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterPanelOpen]);

  // 🔥 FIX: Memoize onPointClick handler to prevent unnecessary re-renders
  const handlePointClick = useCallback((point: Restaurant) => {
    setDetailModalPoint(point);
    setIsDetailModalOpen(true);
  }, []); // Empty deps - function doesn't depend on any state

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
    
    // Find team that manages this ward
    const team = teamsData.find(t => 
      t.managedWards.some(w => w.name === wardName && w.district === district)
    );
    
    if (team) {
      // Get team leader (first officer) or first officer
      const officer = team.officers.find(o => o.isTeamLeader) || team.officers[0];
      setSelectedOfficer(officer);
      setSelectedWardName(wardName);
      setIsOfficerModalOpen(true);
    } else {
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
  
  // 🔥 NEW: Handle department filter change
  const handleDepartmentFilterChange = (departmentId: string) => {
    const newFilters = {
      ...departmentFilters,
      [departmentId]: !departmentFilters[departmentId]
    };
    
    setDepartmentFilters(newFilters);
    setPendingDepartmentFilters(newFilters);  // Keep pending in sync
  };
  
  // 🔥 NEW: Handle "Tất cả" checkbox for departments
  const handleDepartmentToggleAll = (checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(departmentFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    setDepartmentFilters(newFilters);
    setPendingDepartmentFilters(newFilters);  // Keep pending in sync
  };
  
  // 🔥 NEW: Apply pending filters to actual filters
  const handleApplyFilters = () => {
    
    setFilters(pendingFilters);
    setBusinessTypeFilters(pendingBusinessTypeFilters);
    setDepartmentFilters(pendingDepartmentFilters);  // 🔥 NEW: Apply department filters
    
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
    } catch (error) {
      console.error('❌ Failed to save filters:', error);
    }
  };
  
  // 🔥 NEW: Auto-save filters when they change (debounced)
  useEffect(() => {
    // 🔥 CRITICAL: Skip auto-save during initial load to prevent race condition
    if (!isInitialLoadComplete) {
      return;
    }
    
    // Only auto-save if filters are fully loaded (to avoid saving empty state)
    if (pointStatuses.length > 0 && categories.length > 0 && 
        Object.keys(filters).length > 0 && Object.keys(businessTypeFilters).length > 0) {
      const timer = setTimeout(() => {
        handleSaveFilters();
      }, 500); // Debounce 500ms
      
      return () => clearTimeout(timer);
    }
  }, [filters, businessTypeFilters, selectedProvince, selectedDistrict, selectedWard, customStartDate, customEndDate, pointStatuses.length, categories.length, isInitialLoadComplete]);
  
  // 🔥 NEW: Reset all filters to default
  const handleResetAllFilters = () => {
    
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
    
    // 🔥 NEW: Determine data source based on active layer
    let dataSource: Restaurant[] = [];
    
    if (showMapPoints) {
      dataSource = allRestaurants;  // MapPoint layer uses allRestaurants
    } else if (showMerchants) {
      dataSource = restaurants;     // Merchant layer uses restaurants (from fetchMerchants)
    } else if (showOfficers) {
      dataSource = [];               // Officers layer has no points
    }
    
    
    if (!dataSource || dataSource.length === 0) {
      return [];
    }
    
    // 🔥 DEBUG: Check first item's structure
    
    // 🔥 Count how many business type filters are enabled
    const enabledBusinessTypes = Object.keys(businessTypeFilters).filter(key => businessTypeFilters[key] === true);
    const totalBusinessTypes = Object.keys(businessTypeFilters).length;
    if (totalBusinessTypes === 0) {
    }
    
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
      const totalFilterIds = Object.keys(businessTypeFilters).length;
      
      // 🔥 FIX: Only hide all if user has explicitly disabled all business types
      // If categories haven't loaded yet (totalFilterIds === 0), show all
      // If some are enabled, filter normally
      // If all are disabled (enabledFilterIds === 0 && totalFilterIds > 0), hide all
      if (totalFilterIds > 0 && enabledFilterIds.length === 0) {
        return false;  // Hide all when user explicitly disabled all business types
      }
      
      // If no filters are set yet (initial state), show all
      if (totalFilterIds === 0) {
        return true; // Show all when filters haven't been initialized
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
      
      if (!hasActiveBusinessType) {
        return false;
      }
      
      // 🔥 NEW: Filter by department
      if (!departmentFilters || Object.keys(departmentFilters).length === 0) {
        return true; // Show all when no department filters loaded yet
      }
      
      // Get enabled department filter IDs
      const enabledDepartmentIds = Object.keys(departmentFilters).filter(id => departmentFilters[id] === true);
      const totalDepartmentFilters = Object.keys(departmentFilters).length;
      
      // If all departments are disabled (explicitly), hide all
      if (totalDepartmentFilters > 0 && enabledDepartmentIds.length === 0) {
        return false;
      }
      
      // If no filters are set yet (initial state), show all
      if (totalDepartmentFilters === 0) {
        return true;
      }
      
      // 🔥 Check if restaurant has department_id field
      const restaurantDepartmentId = (restaurant as any).department_id || (restaurant as any).departmentId;
      if (!restaurantDepartmentId) {
        return true; // Don't filter out data without department_id
      }
      
      // Check if restaurant matches any enabled department
      const hasActiveDepartment = enabledDepartmentIds.some(deptId => 
        restaurantDepartmentId === deptId
      );
      
      return hasActiveDepartment;
    });
    
    return filtered;
  }, [allRestaurants, restaurants, showMapPoints, showMerchants, showOfficers, filters, businessTypeFilters, departmentFilters, categories]);
  
  // 🔥 NEW: Calculate statistics data - filter by location ONLY (not by status or businessType)
  // This ensures stats show total businesses on the selected area, regardless of filters
  const restaurantsForStats = useMemo(() => {
    
    // Determine data source based on active layer
    let dataSource: Restaurant[] = [];
    if (showMapPoints) {
      dataSource = allRestaurants;
    } else if (showMerchants) {
      dataSource = restaurants;
    } else {
      return [];
    }
    
    if (!dataSource || dataSource.length === 0) {
      return [];
    }
    
    // Filter by location ONLY (province, district, ward)
    // Do NOT filter by status or businessType - stats should show ALL businesses in the area
    if (selectedProvince || selectedDistrict || selectedWard) {
      const filteredByLocation = dataSource.filter((restaurant) => {
        if (selectedProvince && restaurant.province !== selectedProvince) return false;
        if (selectedDistrict && restaurant.district !== selectedDistrict) return false;
        if (selectedWard && restaurant.ward !== selectedWard) return false;
        return true;
      });
      
      return filteredByLocation;
    }
    
    // No location filter - return all data
    return dataSource;
  }, [allRestaurants, restaurants, showMapPoints, showMerchants, selectedProvince, selectedDistrict, selectedWard]);
  
  // Apply location and search filters on top of filter results
  const filteredRestaurants = useMemo(() => {
    
    if (!filteredByFilters || filteredByFilters.length === 0) {
      return [];
    }
    
    // 🐛 DEBUG: Log sample restaurant location data
    if (filteredByFilters.length > 0) {
      const sample = filteredByFilters[0];
      console.log({
        province: sample.province,
        district: sample.district,
        ward: sample.ward,
        name: sample.name
      });
    }
    
    // 🐛 DEBUG: Log all restaurant names to check data
    if (searchQuery.trim() !== '') {
    }
    
    let filteredByLocation = filteredByFilters;
    let locationFilterCount = 0;
    
    // Filter by location
    if (selectedProvince || selectedDistrict || selectedWard) {
      filteredByLocation = filteredByFilters.filter((restaurant) => {
        // Filter by province
        if (selectedProvince && restaurant.province !== selectedProvince) {
          locationFilterCount++;
          return false;
        }
        
        // Filter by district
        if (selectedDistrict && restaurant.district !== selectedDistrict) {
          locationFilterCount++;
          return false;
        }
        
        // Filter by ward
        if (selectedWard && restaurant.ward !== selectedWard) {
          locationFilterCount++;
          return false;
        }
        
        return true;
      });
      
      if (filteredByLocation.length === 0 && filteredByFilters.length > 0) {
        if (filteredByFilters.length > 0) {
          const uniqueProvinces = [...new Set(filteredByFilters.map(r => r.province))];
          const uniqueDistricts = [...new Set(filteredByFilters.map(r => r.district))];
          const uniqueWards = [...new Set(filteredByFilters.map(r => r.ward))];
        }
      }
    }
    
    // Apply search filter
    const finalFiltered = filteredByLocation.filter((restaurant) => {
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
        console.log({
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
    
    
    return finalFiltered;
  }, [filteredByFilters, searchQuery, selectedProvince, selectedDistrict, selectedWard]);
  
  // 🔥 NEW: Log final search results
  useEffect(() => {
    if (searchQuery.trim() !== '') {
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
    setSearchQuery(value);
    if (!value.trim()) {
      setSelectedRestaurant(null);
    }
  };
  
  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 7.5rem)' }}>
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ điều hành' }]}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <span>Bản đồ điều hành</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-3)',
              paddingLeft: 'var(--spacing-4)',
              borderLeft: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-family-mono)',
              fontWeight: '500'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                <div style={{
                  fontSize: 'var(--font-size-base)',
                  color: 'var(--color-text)',
                  fontWeight: '600',
                  lineHeight: 1.2
                }}>
                  {formatTime(currentTime)}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.2
                }}>
                  {formatDate(currentTime)}
                </div>
              </div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#22c55e',
                animation: 'pulse-dot 2s ease-in-out infinite',
                boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)'
              }}></div>
            </div>
            <style>{`
              @keyframes pulse-dot {
                0% {
                  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
                }
                70% {
                  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
                }
              }
            `}</style>
          </div>
        }
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
                    setSelectedTeamId(''); // Reset team selection when switching to officers layer
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
                {/* Tạm ẩn map_points layer */}
                {/* <option value="mappoint">📍 Chủ hộ kinh doanh</option> */}
                <option value="merchant">📍 Chủ hộ kinh doanh</option>
                <option value="officers">👮 Cán bộ quản lý</option>
              </select>
            </div>
            <Button variant="outline" onClick={handleResetAllFilters}>🔄 Tải Lại</Button>
            {/* Hidden: Thêm điểm button */}
            {/* <Button onClick={() => setIsUploadModalOpen(true)}>Thêm điểm</Button> */}
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

      {/* Map Content - Show after initial load (don't hide when filters change) */}
      {(hasInitialDataLoaded || !isLoadingData) && !dataError && (
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
              
              const categoryData = pointStatuses.map(status => {
                const color = colorMap[status.code] || '#005cb6';
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
                filteredRestaurants={restaurantsForStats}
                businessTypeFilters={businessTypeFilters}
                categories={categories}
                merchantStats={merchantStats}
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
              showMerchants={showMerchants}
              selectedTeamId={selectedTeamId}  // 🔥 NEW: Pass selected team ID
              onPointClick={handlePointClick}
              onWardClick={handleWardClick}
              onFullscreenClick={() => setIsFullscreenMapOpen(true)}
            />

            {/* Officer Stats Overlay - Only show when Officers layer is active */}
            {showOfficers && (
              <OfficerStatsOverlay
                selectedTeamId={selectedTeamId}
                isVisible={isOfficerStatsVisible}
                onClose={() => setIsOfficerStatsVisible(false)}
              />
            )}

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
              {/* Legend Toggle Button - Only show when NOT on Officers layer */}
              {!showOfficers && (
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
              )}

              {/* Stats Toggle Button - Only show when NOT on Officers layer */}
              {!showOfficers && (
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
              )}

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

              {/* Officer Stats Toggle Button - Only show when Officers layer is active */}
              {showOfficers && (
                <button
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '4px',
                    border: '2px solid rgba(0,0,0,0.2)',
                    background: isOfficerStatsVisible ? 'var(--primary)' : 'white',
                    color: isOfficerStatsVisible ? 'white' : 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'none',
                    transition: 'background 0.2s'
                  }}
                  onClick={() => setIsOfficerStatsVisible(!isOfficerStatsVisible)}
                  aria-label="Mở/Đóng thống kê cán bộ"
                  title="Thống kê cán bộ quản lý"
                  onMouseEnter={(e) => {
                    if (!isOfficerStatsVisible) {
                      e.currentTarget.style.background = '#f4f4f4';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOfficerStatsVisible) {
                      e.currentTarget.style.background = 'white';
                    }
                  }}
                >
                  <BarChart3 size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Filter Panel - Different panel for Officers layer */}
            {showOfficers ? (
              <OfficerFilterPanel
                isOpen={isFilterPanelOpen}
                selectedTeamId={selectedTeamId}
                onClose={() => setIsFilterPanelOpen(false)}
                onTeamChange={(teamId) => {
                  setSelectedTeamId(teamId);
                }}
                ref={filterPanelRef}
              />
            ) : (
              <MapFilterPanel
                isOpen={isFilterPanelOpen}
                filters={pendingFilters}  // 🔥 CHANGED: Use pending filters for UI
                businessTypeFilters={pendingBusinessTypeFilters}  // 🔥 CHANGED: Use pending business type filters
                departmentFilters={pendingDepartmentFilters}  // 🔥 NEW: Department filters
                restaurants={restaurants}
                pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses
                categories={categories}        // 🔥 PASS: Categories from database
                departments={departments}      // 🔥 NEW: Departments from database
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWard={selectedWard}
                startDate={customStartDate}    //  NEW: Pass date range
                endDate={customEndDate}        // 🔥 NEW: Pass date range
                filteredCount={filteredRestaurants.length}
                onFilterChange={handleFilterChange}  // 🔥 Updates pending filters
                onBusinessTypeFilterChange={handleBusinessTypeFilterChange}  // 🔥 Updates pending filters
                onBusinessTypeToggleAll={handleBusinessTypeToggleAll}
                onDepartmentFilterChange={handleDepartmentFilterChange}  // 🔥 NEW: Department filter change
                onDepartmentToggleAll={handleDepartmentToggleAll}  // 🔥 NEW: Toggle all departments
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
            )}
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
        restaurants={filteredRestaurants}  // 🔥 FIX: Pass filtered restaurants for map display
        allRestaurants={allRestaurants}  // 🔥 NEW: Pass all restaurants for filter panel counts
        pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses to fullscreen modal
        categories={categories}  // 🔥 NEW: Pass categories for mapping ID to name
        onPointClick={handlePointClick}
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
      
      {/* 🔥 NEW: Upload Excel Modal */}
      <UploadExcelModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      
      {/* 🔥 NEW: Toast Notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}