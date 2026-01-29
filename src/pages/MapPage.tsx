import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import PageHeader from '../layouts/PageHeader';
import { Button } from '../app/components/ui/button';
import { MapPin, SlidersHorizontal, BarChart3 } from 'lucide-react';
import LeafletMap from '../app/components/map/LeafletMap';
import { PointDetailModal } from '../app/components/map/PointDetailModal';
import { ReviewModal } from '../app/components/map/ReviewModal';
import { FullscreenMapModal } from '../app/components/map/FullscreenMapModal';
import { FullscreenOfficerMapModal } from '../app/components/map/FullscreenOfficerMapModal';
import { MapFilterPanel } from '../app/components/map/MapFilterPanel';
import { OfficerFilterPanel } from '../app/components/map/OfficerFilterPanel';
import { OfficerStatsOverlay } from '../app/components/map/OfficerStatsOverlay';
import { LocationStatsCard } from '../app/components/map/LocationStatsCard';
import { MapLegend } from '../app/components/map/MapLegend';
import { OfficerInfoModal } from '../app/components/map/OfficerInfoModal';
import { DepartmentDetailModal } from '../app/components/map/DepartmentDetailModal';
import { DateRangePicker } from '../app/components/map/DateRangePicker';
import { UploadExcelModal } from '../app/components/map/UploadExcelModal';
import { Toaster } from 'sonner';
import { Error403 } from '../app/components/error-states/Error403';
import styles from './MapPage.module.css';
import { Restaurant } from '../data/restaurantData';
// Import utility functions
import { formatTime, formatDate } from './utils/dateUtils';
import {
  mapStatusCodesToMerchantStatus,
  calculateBusinessTypes,
  calculateDepartmentIdsToFilter,
  calculateBusinessTypeFiltersArray,
  filterRestaurantsBySearch,
} from './utils/filterUtils';
import { useMapFilters } from './hooks/useMapFilters';
import { getProvinceNames } from '../data/vietnamLocations';
import { fetchPointStatuses, PointStatus, buildFilterObjectFromStatuses } from '../utils/api/pointStatusApi';
import { fetchCategories, Category } from '../utils/api/categoriesApi';
import { fetchMerchants, fetchMerchantStats, MerchantStats } from '../utils/api/merchantsApi';
import { fetchMarketManagementTeams, Department } from '../utils/api/departmentsApi';
import { officersData, Officer, teamsData } from '../data/officerTeamData';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { usePermissions } from '../modules/system-admin/_shared/usePermissions';
import {
  setFilters,
  setBusinessTypeFilters,
  setDepartmentFilters,
  setPendingFilters,
  setPendingBusinessTypeFilters,
  setPendingDepartmentFilters,
  applyPendingFilters,
  resetFilters,
  setSelectedProvince,
  setSelectedDistrict,
  setSelectedWard,
  setFilterPanelOpen,
  setLimit,
} from '../store/slices/mapFiltersSlice';

type CategoryFilter = {
  [key: string]: boolean;  // Dynamic keys from point_status table
};

export default function MapPage() {
  // 🔥 Redux Store - Logging dữ liệu từ store
  const reduxAuth = useAppSelector((state) => state.auth);
  const reduxQLTTScope = useAppSelector((state) => state.qlttScope);
  const mapFilters = useAppSelector((state) => state.mapFilters);
  const dispatch = useAppDispatch();
  const { hasPermission } = usePermissions();
  
  // 🔥 Redux Auth Check
  const canEditMap = hasPermission('map.page.edit') || hasPermission('ADMIN_VIEW');
  const canViewMap = hasPermission('map.page.read') || hasPermission('ADMIN_VIEW');
  
  // 🔥 NEW: Get scope from Redux store (not from context anymore)
  const divisionId = reduxQLTTScope?.scope?.divisionId;
  const teamId = reduxQLTTScope?.scope?.teamId;
  const isScopeLoading = reduxQLTTScope?.isLoading || false;
  const isScopeInitialized = reduxQLTTScope?.hasInitialized || false;
  
  // 🔥 Get filters from Redux store
  const filters = mapFilters.filters;
  const businessTypeFilters = mapFilters.businessTypeFilters;
  const departmentFilters = mapFilters.departmentFilters;
  const pendingFilters = mapFilters.pendingFilters;
  const pendingBusinessTypeFilters = mapFilters.pendingBusinessTypeFilters;
  const pendingDepartmentFilters = mapFilters.pendingDepartmentFilters;
  const selectedProvince = mapFilters.selectedProvince;
  const selectedDistrict = mapFilters.selectedDistrict;
  const selectedWard = mapFilters.selectedWard;
  const isFilterPanelOpen = mapFilters.isFilterPanelOpen;
  const limit = mapFilters.limit;
  
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
  
  // 🔥 REMOVED: allRestaurants - all data now comes from fetchMerchants (already filtered)
  
  // 🔥 NEW: Flag to prevent auto-save during initial load
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  
  // 🔥 FIX: Use refs to track if filters are being initialized (prevent API calls during init)
  const isInitializingFiltersRef = useRef(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof CategoryFilter | 'all'>('all');
  
  // 🔥 NEW: Department detail modal state
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState<any>(null);
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  
  // 🔥 NEW: Realtime clock for header
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // 🔥 Permission Check - If no map.page.read permission, show 403
  if (!canViewMap && isScopeInitialized) {
    return <Error403 />;
  }
  
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
  const [isFullscreenOfficerMapOpen, setIsFullscreenOfficerMapOpen] = useState(false);
  
  // 🔥 NEW: Officer modal state
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [selectedWardName, setSelectedWardName] = useState<string>('');
  const [isOfficerModalOpen, setIsOfficerModalOpen] = useState(false);
  
  // 🔥 NEW: Upload Excel modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Map UI state (similar to FullscreenMapModal) - isFilterPanelOpen now from Redux store
  const [isLegendVisible, setIsLegendVisible] = useState(false);  // 🔥 Hidden by default, show on icon click
  const [isStatsCardVisible, setIsStatsCardVisible] = useState(true);
  const [isOfficerStatsVisible, setIsOfficerStatsVisible] = useState(true); // 🔥 NEW: Officer stats overlay visibility
  
  // 🔥 NEW: Map layer toggles
  const [showMapPoints, setShowMapPoints] = useState(false);  // MapPoint layer (tạm ẩn)
  const [showMerchants, setShowMerchants] = useState(true);  // Merchant layer (hiển thị với tên "Chủ Hộ Kinh Doanh")
  // 🔥 FIX: Default to false on initial load - Merchants layer is the default, Officers layer can be enabled manually
  const [showOfficers, setShowOfficers] = useState(false);  // Officers layer (Cán bộ quản lý)
  
  // 🔥 NEW: Selected team for officers layer filter
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  
  // 🔥 NEW: Statistics from API (background fetch)
  const [merchantStats, setMerchantStats] = useState<MerchantStats | null>(null);
  const [hasFetchedStats, setHasFetchedStats] = useState(false);
  
  // Location filters - now from Redux store
  
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
        dispatch(setFilters(initialFilters));
        dispatch(setPendingFilters(initialFilters));  // 🔥 Sync pending filters
        
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
          dispatch(setBusinessTypeFilters(initialBusinessTypeFilters));
          dispatch(setPendingBusinessTypeFilters(initialBusinessTypeFilters));  // 🔥 Sync pending
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
  
  // 🔥 CHANGED: Fetch departments from departments table on mount and when teamId or divisionId changes
  useEffect(() => {
    // 🔥 FIX: Wait for scope to be loaded from Redux store before fetching
    if (isScopeLoading || !isScopeInitialized) {
      return;
    }
    
    async function loadDepartments() {
      try {
        setIsLoadingDepartments(true);
        
        // 🔥 CHANGED: Priority: teamId > divisionId
        // Handle null, undefined, and empty string properly
        const teamIdToPass = teamId && typeof teamId === 'string' && teamId.trim() !== '' 
          ? teamId 
          : undefined;
        const divisionIdToPass = divisionId && typeof divisionId === 'string' && divisionId.trim() !== '' 
          ? divisionId 
          : undefined;
        
        // 🔥 CHANGED: Filter by teamId (priority) or divisionId from scope if available
        const options: { teamId?: string; divisionId?: string } = {};
        if (teamIdToPass !== undefined) {
          options.teamId = teamIdToPass;
        } else if (divisionIdToPass !== undefined) {
          options.divisionId = divisionIdToPass;
        }
        
        const depts = await fetchMarketManagementTeams(
          Object.keys(options).length > 0 ? options : undefined
        );
        
        setDepartments(depts);
        
        // 🔥 Initialize departmentFilters with ALL departments enabled (= "Tất cả")
        if (depts.length > 0) {
          isInitializingFiltersRef.current = true; // 🔥 FIX: Mark as initializing
          const initialDepartmentFilters: { [key: string]: boolean } = {};
          depts.forEach((dept) => {
            initialDepartmentFilters[dept.id] = true;  // 🔥 ALL departments enabled by default
          });
          dispatch(setDepartmentFilters(initialDepartmentFilters));
          dispatch(setPendingDepartmentFilters(initialDepartmentFilters));  // 🔥 Sync pending
          // Reset flag after state update
          setTimeout(() => {
            isInitializingFiltersRef.current = false;
          }, 0);
        }
        
        setIsLoadingDepartments(false);
        
        // 🔥 FIX: Reset lastFiltersKeyRef to force merchants reload when departments are loaded
        // This ensures merchants are fetched with the correct department filter
        if (depts.length > 0 && (teamIdToPass || divisionIdToPass)) {
          
          lastFiltersKeyRef.current = '';
          
          // 🔥 FIX: Also reset hasFetchedMerchantsRef to force reload on initial load
          if (!hasFetchedMerchantsRef.current) {
            
            hasFetchedMerchantsRef.current = false;
          }
        }
      } catch (error: any) {
        console.error('❌ MapPage: Failed to load departments:', error);
        setIsLoadingDepartments(false);
      }
    }
    
    loadDepartments();
  }, [teamId, divisionId, isScopeLoading, isScopeInitialized]); // 🔥 FIX: Use Redux scope values from divisionId and teamId
  
  // 🔥 NEW: Initialize limit from URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLimit = urlParams.get('limit');
    if (urlLimit) {
      const parsedLimit = parseInt(urlLimit, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        dispatch(setLimit(parsedLimit));
      }
    }
    // If no limit in URL, Redux store already has default value (100)
  }, [dispatch]);
  
  // 🔥 REMOVED: Load saved filters from localStorage - now using Redux store only
  // Filters are already in Redux store, no need to load from localStorage
  // Mark initial load complete immediately
  useEffect(() => {
    setIsInitialLoadComplete(true);
  }, []);
  
  // 🔥 REMOVED: Separate fetchMapPoints - now all points come from fetchMerchants
  // Both showMapPoints and showMerchants use fetchMerchants with filters
  
  // 🔥 FIX: Use ref to track if initial fetch has been done (prevent infinite loop)
  const hasFetchedMerchantsRef = useRef(false);
  
  
  // 🔥 FIX: Force merchants reload when departments array changes
  // This ensures when departments list changes, merchants are reloaded
  useEffect(() => {
    // Trigger when departments array changes (not just length, but actual content)
    if (departments.length > 0 && !isScopeLoading && isScopeInitialized) {
      
      // Reset refs to force merchants reload when departments change
      // This ensures API is called again when departments list changes
      lastFiltersKeyRef.current = '';
      hasFetchedMerchantsRef.current = false;
    }
  }, [departments, isScopeLoading, isScopeInitialized]);
  
  // 🔥 FIX: Serialize filters to string for comparison (prevent unnecessary API calls)
  const filtersKey = useMemo(() => {
    // Serialize filters with their values to detect actual changes
    const filtersStr = JSON.stringify(filters);
    const businessTypeFiltersStr = JSON.stringify(businessTypeFilters);
    const departmentFiltersStr = JSON.stringify(departmentFilters);
    
    return JSON.stringify({
      filters: filtersStr,
      businessTypeFilters: businessTypeFiltersStr,
      departmentFilters: departmentFiltersStr,  // 🔥 FIX: departmentFilters already contains the selected IDs
      categoriesLength: categories.length,
      showMerchants,
      showMapPoints,
      showOfficers,
      departmentsIds: JSON.stringify(departments.map((d: Department) => d.id).sort()),  // 🔥 FIX: Include departments IDs array to trigger when departments list changes
      divisionId: divisionId || '',  // 🔥 NEW: Include divisionId to trigger when scope division changes
      teamId: teamId || '',  // 🔥 NEW: Include teamId to trigger when scope team changes
      selectedProvince: selectedProvince || '',  // 🔥 NEW: Include selectedProvince to trigger when location changes
      selectedWard: selectedWard || ''  // 🔥 NEW: Include selectedWard to trigger when location changes
    });
  }, [filters, businessTypeFilters, departmentFilters, categories.length, showMerchants, showMapPoints, showOfficers, departments, divisionId, teamId, selectedProvince, selectedWard]);
  
  // 🔥 FIX: Auto-enable showOfficers when divisionId or teamId is available (on initial load)
  // This ensures department points are visible when user first loads the page
  useEffect(() => {
      if ((divisionId || teamId) && !showOfficers && !showMerchants && !showMapPoints) {
        // Only auto-enable if no other layers are active
        setShowOfficers(true);
      }
  }, [divisionId, teamId, showOfficers, showMerchants, showMapPoints]);
  
  // 🔥 FIX: Use ref to track last filters key (prevent duplicate API calls)
  const lastFiltersKeyRef = useRef<string>('');
  
  // 🔥 NEW: Reset merchants refs when divisionId or teamId changes (scope change)
  // This ensures merchants are refetched when user changes department
  useEffect(() => {
    lastFiltersKeyRef.current = '';
    hasFetchedMerchantsRef.current = false;
  }, [divisionId, teamId]);
  
  // 🔥 NEW: Fetch merchants from merchants table when any layer is active (Merchants or MapPoints)
  useEffect(() => {
    // Fetch if Merchants OR MapPoints layer is active
    if (!showMerchants && !showMapPoints) {
      return;
    }
    
    // 🔥 FIX: Wait for essential data to be loaded before fetching merchants
    if (isScopeLoading || !isScopeInitialized) {
      return;
    }
    
    // 🔥 FIX: Wait for pointStatuses and categories to be loaded (needed for filters)
    if (pointStatuses.length === 0 || categories.length === 0) {
      return;
    }
    
    // 🔥 FIX: Wait for departments to be loaded if we need them for filtering
    // Only wait if we don't have departmentIds in filters yet and we have teamId/divisionId
    if (Object.keys(departmentFilters).length === 0 && departments.length === 0 && (teamId || divisionId)) {
      return; // Wait for departments to load when we have teamId/divisionId
    }
    
    // 🔥 FIX: Check if filters key has changed or if this is the first fetch
    // Allow first fetch even if filtersKey hasn't changed yet
    if (lastFiltersKeyRef.current === filtersKey && hasFetchedMerchantsRef.current) {
      return; // Skip if filters haven't changed and we've already fetched
    }
    
    async function loadMerchants() {
      if (!hasFetchedMerchantsRef.current) {
        setIsLoadingData(true);
      }
      setDataError(null);
      
      try {
        // Map point_status codes to merchant status codes
        const activeFilterCodes = Object.keys(filters).filter(key => filters[key] === true);
        const merchantStatusCodes = mapStatusCodesToMerchantStatus(activeFilterCodes);
        
        // Calculate business types filter
        const activeBusinessTypes = Object.keys(businessTypeFilters).filter(key => businessTypeFilters[key] === true);
        const businessTypes = calculateBusinessTypes(activeBusinessTypes, categories);
        
        // Calculate department IDs to filter
        const departmentIdsToFilter = calculateDepartmentIdsToFilter(
          departmentFilters,
          departments,
          teamId,
          divisionId
        );
        
        // Calculate business type filters array for category_merchants join
        const businessTypeFiltersArray = calculateBusinessTypeFiltersArray(businessTypeFilters, categories);
        
        const merchants = await fetchMerchants(
          merchantStatusCodes.length > 0 ? merchantStatusCodes : undefined,
          businessTypes,
          departmentIdsToFilter,
          teamId,
          divisionId || '',
          departments.map(d => d.id), // departmentIds: string[]
          businessTypeFiltersArray,
          {
            statusCodes: merchantStatusCodes.length > 0 ? merchantStatusCodes : undefined, // 🔥 FIX: Pass statusCodes to options
            businessTypes: businessTypes,
            departmentIds: departmentIdsToFilter,
            categoryIds: businessTypeFiltersArray && businessTypeFiltersArray.length > 0 ? businessTypeFiltersArray : undefined, // 🔥 NEW: Pass category IDs to options
            province: selectedProvince || undefined,
            ward: selectedWard || undefined,
            limit: limit // 🔥 NEW: Pass limit from Redux store
          }
        );
        
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
  }, [filtersKey, pointStatuses.length, showMerchants, showMapPoints, departments.length, isScopeLoading, isScopeInitialized, divisionId, teamId, filters, businessTypeFilters, departmentFilters, categories.length, selectedProvince, selectedWard]); // 🔥 Include all filter dependencies
  
  // 🔥 NEW: Clear restaurants when Officers layer is selected (ward boundaries don't need points)
  // Only clear if Officers layer is active AND merchants/mappoints layers are not active
  useEffect(() => {
    if (showOfficers && !showMerchants && !showMapPoints) {
      setRestaurants([]);
      setIsLoadingData(false);
    }
  }, [showOfficers, showMerchants, showMapPoints]);
  
  // 🔥 FIX: Track previous layer state to detect actual layer changes
  const previousShowOfficersRef = useRef<boolean>(false);
  const previousShowMerchantsRef = useRef<boolean>(true);
  
  // 🔥 FIX: Reset UI states when switching between layers (only on actual change, not initial load)
  useEffect(() => {
    const officersChanged = previousShowOfficersRef.current !== showOfficers;
    const merchantsChanged = previousShowMerchantsRef.current !== showMerchants;
    
    // Only reset if there was an actual layer change
    if (officersChanged || merchantsChanged) {
      if (showOfficers && !showMerchants) {
        // When switching TO Officers layer (and Merchants is off), hide merchants layer UI components
        setIsLegendVisible(false);
        setIsStatsCardVisible(false);
        dispatch(setFilterPanelOpen(false)); // Close filter panel when switching layers
      } else if (showMerchants && !showOfficers) {
        // When switching TO Merchants layer (and Officers is off), hide officers layer UI components
        setIsOfficerStatsVisible(false);
        dispatch(setFilterPanelOpen(false)); // Close filter panel when switching layers
      }
      
      // Update refs
      previousShowOfficersRef.current = showOfficers;
      previousShowMerchantsRef.current = showMerchants;
    }
  }, [showOfficers, showMerchants, dispatch]);
  
  // Setup global function for popup button click
  useEffect(() => {
    (window as any).openPointDetail = (pointId: string, event?: Event) => {
      // 🔥 FIX: Stop event propagation to prevent bubble-up click from closing modal
      if (event) {
        event.stopPropagation();
        event.preventDefault();
      }
      
      
      // Search in restaurants (from fetchMerchants)
      const point = restaurants.find(r => r.id === pointId);
      
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
      
      // Search in restaurants (from fetchMerchants)
      const point = restaurants.find(r => r.id === pointId);
      
      if (point) {
        setReviewModalPoint(point);
        setIsReviewModalOpen(true);
      } else {
      }
    };
    
    // 🔥 NEW: Setup global function for department detail modal
    (window as any).openDepartmentDetail = (departmentId: string, departmentData?: any) => {
      setSelectedDepartmentId(departmentId);
      setSelectedDepartmentData(departmentData);
      setIsDepartmentModalOpen(true);
    };
    
    return () => {
      delete (window as any).openPointDetail;
      delete (window as any).openPointReview;
      delete (window as any).openDepartmentDetail;
    };
  }, [restaurants]);
  
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
  // const availableDistricts = selectedProvince 
  //   ? getDistrictsByProvince(selectedProvince).map(d => d.name)
  //   : [];
  
  // Get wards for selected district
  // const availableWards = selectedDistrict 
  //   ? getWardsByDistrict(selectedDistrict).map(w => w.name)
  //   : [];
  
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
          dispatch(setFilterPanelOpen(false));
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

  // Use filter handlers hook
  const {
    handleFilterChange,
    handleBusinessTypeFilterChange,
    handleBusinessTypeToggleAll,
    handleDepartmentFilterChange,
    handleDepartmentToggleAll,
    handleApplyFilters,
    handleSaveFilters,
    handleResetAllFilters,
  } = useMapFilters({
    filters,
    businessTypeFilters,
    departmentFilters,
    pendingFilters,
    pendingBusinessTypeFilters,
    pendingDepartmentFilters,
    pointStatuses,
    categories,
    setCustomStartDate,
    setCustomEndDate,
    setSearchQuery,
  });
  
  // Handle stat card click to filter by category
  const handleStatCardClick = (category: keyof CategoryFilter | 'all') => {
    if (selectedCategory === category) {
      // Deselect - show all
      setSelectedCategory('all');
      const allFilters = {
        certified: true,
        hotspot: true,
        scheduled: true,
        inspected: true,
      };
      dispatch(setFilters(allFilters));
      dispatch(setPendingFilters(allFilters));
    } else {
      // Select category - filter to only that category
      setSelectedCategory(category);
      if (category === 'all') {
        const allFilters = {
          certified: true,
          hotspot: true,
          scheduled: true,
          inspected: true,
        };
        dispatch(setFilters(allFilters));
        dispatch(setPendingFilters(allFilters));
      } else {
        const categoryFilters = {
          certified: category === 'certified',
          hotspot: category === 'hotspot',
          scheduled: category === 'scheduled',
          inspected: category === 'inspected',
        };
        dispatch(setFilters(categoryFilters));
        dispatch(setPendingFilters(categoryFilters));
      }
    }
  };
  
  // 🔥 REMOVED: Frontend filtering - all filtering is now done by fetchMerchants API
  
  // 🔥 NEW: Calculate statistics data - use restaurants from fetchMerchants
  // Stats will show businesses based on current filters (including location)
  const restaurantsForStats = useMemo(() => {
    return restaurants; // Use restaurants from fetchMerchants (already filtered by backend)
  }, [restaurants]);
  
  // Apply search filter only (location filtering is done by backend via fetchMerchants)
  const filteredRestaurants = useMemo(() => {
    return filterRestaurantsBySearch(restaurants, searchQuery);
  }, [restaurants, searchQuery]);
  
  // 🔥 NEW: Log final search results
  useEffect(() => {
    if (searchQuery.trim() !== '') {
    }
  }, [searchQuery, filteredRestaurants, showMapPoints, showMerchants]);
  
  // 🔥 NEW: Check if there are unapplied changes
  const hasUnappliedChanges = useMemo(() => {
    // 🔥 DISABLED: Real-time filtering - no need for "Apply" button
    // return false;
    
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
    <div className={`flex flex-col ${styles.pageContainer}`}>
      <PageHeader
        breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Bản đồ điều hành' }]}
        title={
          <div className={styles.headerTitleContainer}>
            <span>Bản đồ điều hành</span>
            <div className={styles.headerClockContainer}>
              <div className={styles.headerClockTime}>
                <div className={styles.headerClockTimeValue}>
                  {formatTime(currentTime)}
                </div>
                <div className={styles.headerClockDateValue}>
                  {formatDate(currentTime)}
                </div>
              </div>
              <div className={styles.headerClockDot}></div>
            </div>
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
                // 🔥 REMOVED: Auto-save - filters are in Redux store
              }}
              onApply={() => {}}  // 🔥 REMOVED: Auto-save - filters are in Redux store
            />
            
            {/* Map Layer Select */}
            <div className={styles.mapLayerSelectWrapper}>
              <select
                className={styles.mapLayerSelect}
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
              >
                {/* Tạm ẩn map_points layer */}
                {/* <option value="mappoint">📍 Chủ hộ kinh doanh</option> */}
                <option value="merchant">📍 Chủ hộ kinh doanh</option>
                <option value="officers">👮 Cán bộ quản lý</option>
              </select>
            </div>
            <Button variant="outline" onClick={handleResetAllFilters}>🔄 Tải Lại</Button>
            {/* Thêm điểm button - hiển thị dựa trên quyền map.page.edit */}
            {canEditMap && (
              <Button onClick={() => setIsUploadModalOpen(true)}>Thêm điểm</Button>
            )}
          </div>
        }
      />

      {/* Error State */}
      {dataError && !isLoadingData && (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h3 className={styles.errorTitle}>
              Không thể tải dữ liệu
            </h3>
            <p className={styles.errorMessage}>
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
        <div className={styles.mapContentContainer}>
          {/* Map Canvas - Now takes full width */}
          <div className={`${styles.mapContainer} ${styles.mapWrapper}`} ref={mapContainerRef}>
            {/* Loading Overlay - Centered on map with opacity 0.5, no background */}
            {isLoadingData && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingContent}>
                  <div className={styles.loadingSpinner} />
                  <div className={styles.loadingText}>
                    Đang tải dữ liệu bản đồ...
                  </div>
                </div>
              </div>
            )}
            {/* Map Legend - Horizontal at Top - Only show on Merchants layer */}
            {showMerchants && !showOfficers && isLegendVisible && (() => {
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

            {/* 🔥 Only show Location Stats Card when Merchants layer is active AND Officers layer is NOT active */}
            {showMerchants && !showOfficers && (
              <LocationStatsCard
                selectedProvince={selectedProvince}
                selectedDistrict={selectedDistrict}
                selectedWard={selectedWard}
                filteredRestaurants={restaurantsForStats}
                businessTypeFilters={businessTypeFilters}
                categories={categories}
                merchantStats={merchantStats}
                divisionId={divisionId}
                teamId={teamId}
                onClose={() => {
                  dispatch(setSelectedProvince(''));
                  dispatch(setSelectedDistrict(''));
                  dispatch(setSelectedWard(''));
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
              onFullscreenClick={() => {
                if (showOfficers) {
                  setIsFullscreenOfficerMapOpen(true);
                } else {
                  setIsFullscreenMapOpen(true);
                }
              }}
            />

            {/* Officer Stats Overlay - Only show when Officers layer is active AND Merchants layer is NOT active */}
            {showOfficers && !showMerchants && (
              <OfficerStatsOverlay
                selectedTeamId={selectedTeamId}
                isVisible={isOfficerStatsVisible}
                onClose={() => setIsOfficerStatsVisible(false)}
              />
            )}

            {/* Filter Panel with Toggle Buttons */}
            <div className={styles.mapControls}>
              {/* Legend Toggle Button - Only show on Merchants layer */}
              {showMerchants && !showOfficers && (
                <button
                  className={styles.mapControlButton}
                  onClick={() => setIsLegendVisible(!isLegendVisible)}
                  aria-label="Mở/Đóng chú giải"
                  title="Chú giải bản đồ"
                >
                  <MapPin size={18} strokeWidth={2.5} />
                </button>
              )}

              {/* Stats Toggle Button - Only show on Merchants layer */}
              {showMerchants && !showOfficers && (
                <button
                  className={styles.mapControlButton}
                  onClick={() => setIsStatsCardVisible(!isStatsCardVisible)}
                  aria-label="Mở/Đóng thống kê"
                  title="Thống kê địa bàn"
                >
                  <BarChart3 size={18} strokeWidth={2.5} />
                </button>
              )}

              {/* Filter Toggle Button - Show on both layers but different panels */}
              {(showMerchants || showOfficers) && (
                <button
                  ref={filterToggleBtnRef}
                  className={`${styles.mapControlButton} ${isFilterPanelOpen ? styles.mapControlButtonActive : ''}`}
                  onClick={() => dispatch(setFilterPanelOpen(!isFilterPanelOpen))}
                  aria-label="Mở/Đóng bộ lọc"
                  title={showOfficers ? "Bộ lọc cán bộ" : "Bộ lọc nâng cao"}
                >
                  <SlidersHorizontal size={18} strokeWidth={2.5} />
                </button>
              )}

              {/* Officer Stats Toggle Button - Only show when Officers layer is active AND Merchants layer is NOT active */}
              {showOfficers && !showMerchants && (
                <button
                  className={`${styles.mapControlButton} ${isOfficerStatsVisible ? styles.mapControlButtonActive : ''}`}
                  onClick={() => setIsOfficerStatsVisible(!isOfficerStatsVisible)}
                  aria-label="Mở/Đóng thống kê cán bộ"
                  title="Thống kê cán bộ quản lý"
                >
                  <BarChart3 size={18} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Filter Panel - Different panel for each layer */}
            {showOfficers && !showMerchants ? (
              <OfficerFilterPanel
                isOpen={isFilterPanelOpen}
                selectedTeamId={selectedTeamId}
                onClose={() => dispatch(setFilterPanelOpen(false))}
                onTeamChange={(teamId) => {
                  setSelectedTeamId(teamId);
                }}
                ref={filterPanelRef}
              />
            ) : showMerchants && !showOfficers ? (
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
                filteredCount={filteredRestaurants.length}
                onFilterChange={handleFilterChange}  // 🔥 Updates pending filters
                onBusinessTypeFilterChange={handleBusinessTypeFilterChange}  // 🔥 Updates pending filters
                onBusinessTypeToggleAll={handleBusinessTypeToggleAll}
                onDepartmentFilterChange={handleDepartmentFilterChange}  // 🔥 NEW: Department filter change
                onDepartmentToggleAll={handleDepartmentToggleAll}  // 🔥 NEW: Toggle all departments
                onProvinceChange={(province) => {
                  dispatch(setSelectedProvince(province));
                  dispatch(setSelectedDistrict('')); // Reset district when province changes
                  dispatch(setSelectedWard('')); // Reset ward when province changes
                }}
                onDistrictChange={(district) => {
                  setSelectedDistrict(district);
                  dispatch(setSelectedWard('')); // Reset ward when district changes
                }}
                onWardChange={(ward) => {
                  dispatch(setSelectedWard(ward));
                }}
                onClose={() => dispatch(setFilterPanelOpen(false))}
                onApplyFilters={handleApplyFilters}  // 🔥 NEW: Apply button callback
                onSaveFilters={handleSaveFilters}  // 🔥 NEW: Save button callback
                hasUnappliedChanges={hasUnappliedChanges}  // 🔥 NEW: Show button when changes exist
                ref={filterPanelRef}
              />
            ) : null}
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
      
      {/* 🔥 NEW: Department Detail Modal */}
      <DepartmentDetailModal
        isOpen={isDepartmentModalOpen}
        onClose={() => setIsDepartmentModalOpen(false)}
        departmentId={selectedDepartmentId || ''}
        departmentData={selectedDepartmentData}
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
        allRestaurants={restaurants}  // 🔥 Pass restaurants from fetchMerchants (already filtered)
        pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses to fullscreen modal
        categories={categories}  // 🔥 NEW: Pass categories for mapping ID to name
        merchantStats={merchantStats}  // 🔥 NEW: Pass merchant statistics to fullscreen modal
        divisionId={divisionId}
        teamId={teamId}
        onPointClick={handlePointClick}
        onFilterChange={handleFilterChange}
        onBusinessTypeFilterChange={handleBusinessTypeFilterChange}
        onBusinessTypeToggleAll={handleBusinessTypeToggleAll}
        onProvinceChange={(province) => {
          dispatch(setSelectedProvince(province));
          dispatch(setSelectedDistrict('')); // Reset district when province changes
          dispatch(setSelectedWard('')); // Reset ward when province changes
        }}
        onDistrictChange={(district) => {
          setSelectedDistrict(district);
          dispatch(setSelectedWard('')); // Reset ward when district changes
        }}
        onWardChange={(ward) => {
          dispatch(setSelectedWard(ward));
        }}
      />
      
      {/* 🔥 NEW: Fullscreen Officer Map Modal */}
      <FullscreenOfficerMapModal 
        isOpen={isFullscreenOfficerMapOpen}
        onClose={() => setIsFullscreenOfficerMapOpen(false)}
        selectedTeamId={selectedTeamId}
        onTeamChange={(teamId) => {
          setSelectedTeamId(teamId);
          // Scope is managed by Redux store (qlttScope), no need to update here
        }}
        onWardClick={handleWardClick}
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