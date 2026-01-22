import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
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
import { useQLTTScope } from '../contexts/QLTTScopeContext';
import { useAppSelector, useAppDispatch } from '../app/hooks';
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
  setInitializing,
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
  
  // Log Redux state khi component mount
  useEffect(() => {
    console.log('📊 Redux Auth State:', reduxAuth);
    console.log('📊 Redux QLTT Scope State:', reduxQLTTScope);
    
  }, [reduxAuth, reduxQLTTScope, dispatch]);
  
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
      console.log('⏳ MapPage: Waiting for scope to load from Redux...', { isScopeLoading, isScopeInitialized });
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
      console.log('⏭️ MapPage: Skipping merchants fetch - No active layer');
      return;
    }
    
    async function loadMerchants() {
      console.log('🔄 MapPage: Starting merchants fetch...', {
        filtersKey,
        selectedProvince,
        selectedWard,
        showMerchants,
        showMapPoints
      });
      
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
        // 🔥 FIX: Get enabled business types (true), not disabled ones (false)
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
        
        const businessTypes = allCategoriesSelected
          ? undefined  // 🔥 ALL selected = no filter (get all merchants)
          : businessTypeNames.length > 0 
            ? businessTypeNames  // 🔥 SOME selected = filter by names
            : undefined;  // 🔥 NONE selected = no filter
        
        
        // 🔥 FIX: Get enabled department IDs from departmentFilters (UI checkboxes)
        const enabledDepartmentIds = Object.keys(departmentFilters).filter(id => departmentFilters[id] === true);
        const totalDepartmentFilters = Object.keys(departmentFilters).length;
        
        let departmentIdsToFilter: string[] | undefined = undefined;
        
        if (teamId) {
          // 🔥 Case 1: User selected a team in scope → filter by THIS TEAM ONLY
          departmentIdsToFilter = [teamId];
          
        } else if (divisionId) {
          // 🔥 Case 2: User selected a division → filter by ALL TEAMS under this division
          const teamsUnderDivision = departments.filter(
            (d: Department) => d.parent_id === divisionId || d.id === divisionId
          );
          departmentIdsToFilter = teamsUnderDivision.map((d: Department) => d.id);
          
        } else if (totalDepartmentFilters > 0) {
          // 🔥 Case 3: Use UI checkbox filters
          if (enabledDepartmentIds.length === totalDepartmentFilters) {
            // All departments selected (= "Tất cả") → filter by all department IDs from departments list
            departmentIdsToFilter = departments.map((d: Department) => d.id);
            
          } else if (enabledDepartmentIds.length > 0) {
            // Some departments selected → filter by enabled IDs only
            departmentIdsToFilter = enabledDepartmentIds;
            
          } else {
            // No departments selected → no merchants (empty array)
            departmentIdsToFilter = [];
            
          }
        } else {
          // 🔥 Case 4: No scope filter & no UI filter → undefined (no filter, show ALL merchants)
          departmentIdsToFilter = undefined;
          
        }
        
        // Convert businessTypeFilters object to array of keys with true values
        const businessTypeFiltersArray = businessTypeFilters 
          ? Object.keys(businessTypeFilters).filter(key => businessTypeFilters[key] === true)
          : null;
        
        console.log('🔄 MapPage: Fetching merchants with filters:', {
          filters, // 🔥 DEBUG: Show raw filters from Redux
          activeFilterCodes, // 🔥 DEBUG: Show active filter codes
          merchantStatusCodes,
          businessTypeFilters, // 🔥 DEBUG: Show raw businessTypeFilters from Redux
          activeBusinessTypes, // 🔥 DEBUG: Show active business type keys
          businessTypeNames, // 🔥 DEBUG: Show mapped business type names
          businessTypes,
          departmentFilters, // 🔥 DEBUG: Show raw departmentFilters from Redux
          departmentIdsToFilter,
          selectedProvince,
          selectedWard,
          showMerchants,
          showMapPoints
        });
        
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
            province: selectedProvince || undefined,
            ward: selectedWard || undefined
          }
        );
        
        console.log('✅ MapPage: Merchants fetched:', {
          count: merchants.length,
          withProvince: selectedProvince ? merchants.filter(m => m.province).length : 'N/A',
          withWard: selectedWard ? merchants.filter(m => m.ward).length : 'N/A'
        });
        
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
  }, [filtersKey, pointStatuses.length, showMerchants, showMapPoints, showOfficers, departments.length, isScopeLoading, isScopeInitialized, divisionId, teamId, filters, businessTypeFilters, departmentFilters, categories.length, selectedProvince, selectedWard]); // 🔥 Include all filter dependencies
  
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
    
    return () => {
      delete (window as any).openPointDetail;
      delete (window as any).openPointReview;
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

  const handleFilterChange = (category: keyof CategoryFilter) => {
    const newFilters = {
      ...filters,
      [category]: !filters[category]
    };
    
    dispatch(setFilters(newFilters));
    dispatch(setPendingFilters(newFilters));  // Keep pending in sync
  };

  const handleBusinessTypeFilterChange = (key: string) => {
    
    const newFilters = {
      ...businessTypeFilters,
      [key]: !businessTypeFilters[key]
    };
    console.log('newFilters', newFilters);
    dispatch(setBusinessTypeFilters(newFilters));
    dispatch(setPendingBusinessTypeFilters(newFilters));  // Keep pending in sync
  };
  
  // 🔥 NEW: Handle "Tất cả" checkbox for business types
  const handleBusinessTypeToggleAll = (checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(businessTypeFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    dispatch(setBusinessTypeFilters(newFilters));
    dispatch(setPendingBusinessTypeFilters(newFilters));  // Keep pending in sync
  };
  
  // 🔥 NEW: Handle department filter change
  const handleDepartmentFilterChange = (departmentId: string) => {
    const newFilters = {
      ...departmentFilters,
      [departmentId]: !departmentFilters[departmentId]
    };
    
    dispatch(setDepartmentFilters(newFilters));
    dispatch(setPendingDepartmentFilters(newFilters));  // Keep pending in sync
  };
  
  // 🔥 NEW: Handle "Tất cả" checkbox for departments
  const handleDepartmentToggleAll = (checked: boolean) => {
    const newFilters: { [key: string]: boolean } = {};
    Object.keys(departmentFilters).forEach(key => {
      newFilters[key] = checked;
    });
    
    dispatch(setDepartmentFilters(newFilters));
    dispatch(setPendingDepartmentFilters(newFilters));  // Keep pending in sync
  };
  
  // 🔥 NEW: Apply pending filters to actual filters
  const handleApplyFilters = () => {
    
    dispatch(applyPendingFilters());  // Apply all pending filters at once
    
  };
  
  // 🔥 REMOVED: Save filters to localStorage - now using Redux store only
  // Filters are automatically saved to Redux store when dispatch actions are called
  const handleSaveFilters = () => {
    // No-op: Filters are already in Redux store
    // This function is kept for compatibility with existing code that calls it
  };
  
  // 🔥 NEW: Reset all filters to default
  const handleResetAllFilters = () => {
    
    // Reset status filters - enable all
    const defaultFilters = buildFilterObjectFromStatuses(pointStatuses);
    dispatch(setFilters(defaultFilters));
    dispatch(setPendingFilters(defaultFilters));
    
    // Reset business type filters - enable all
    const defaultBusinessTypeFilters: { [key: string]: boolean } = {};
    categories.forEach((cat) => {
      defaultBusinessTypeFilters[cat.id] = true;
    });
    dispatch(setBusinessTypeFilters(defaultBusinessTypeFilters));
    dispatch(setPendingBusinessTypeFilters(defaultBusinessTypeFilters));
    
    // Reset location filters
    dispatch(setSelectedProvince(''));
    dispatch(setSelectedDistrict(''));
    dispatch(setSelectedWard(''));
    
    // Reset date range
    setCustomStartDate('');
    setCustomEndDate('');
    
    // Reset search query
    setSearchQuery('');
    
    // Clear localStorage (handled by resetFilters action)
    dispatch(resetFilters());
    
  };
  
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
    // Use restaurants directly from fetchMerchants (already filtered by backend)
    if (!restaurants || restaurants.length === 0) {
      return [];
    }
    
    // Only apply search filter (client-side)
    if (searchQuery.trim() === '') {
      return restaurants;
    }
    
    const searchLower = searchQuery.toLowerCase();
    return restaurants.filter((restaurant) => {
      const nameLower = restaurant.name.toLowerCase();
      const addressLower = restaurant.address.toLowerCase();
      const typeLower = restaurant.type.toLowerCase();
      
      return nameLower.includes(searchLower) ||
             addressLower.includes(searchLower) ||
             typeLower.includes(searchLower);
    });
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
                // 🔥 REMOVED: Auto-save - filters are in Redux store
              }}
              onApply={() => {}}  // 🔥 REMOVED: Auto-save - filters are in Redux store
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
                onClick={() => dispatch(setFilterPanelOpen(!isFilterPanelOpen))}
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
                onClose={() => dispatch(setFilterPanelOpen(false))}
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
        allRestaurants={restaurants}  // 🔥 Pass restaurants from fetchMerchants (already filtered)
        pointStatuses={pointStatuses}  // 🔥 PASS: Dynamic statuses to fullscreen modal
        categories={categories}  // 🔥 NEW: Pass categories for mapping ID to name
        merchantStats={merchantStats}  // 🔥 NEW: Pass merchant statistics to fullscreen modal
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