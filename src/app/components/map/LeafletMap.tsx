import { useEffect, useRef, useMemo, useCallback, memo } from 'react';
import styles from './LeafletMap.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { districtBoundaries } from '../../../data/districtBoundaries';
import { getWardByName, wardBoundariesData } from '../../../data/wardBoundaries';
import { fetchProvinceCoordinates, fetchWardCoordinates } from '../../../utils/api/locationsApi';
// Import utility functions
import { getMarkerSize, getIconSize } from './utils/markerUtils';
import { generatePopupContent } from './utils/popupUtils';
import { generateMarkerIconHtml, hasAlertStyling } from './utils/markerRenderer';
// Import hooks and utils for department areas
import { useDepartmentAreas } from './hooks/useDepartmentAreas';
import { transformDepartmentAreasToMapData, calculateAverageCenter, getValidCenters } from './utils/departmentAreasUtils';
import { useAppSelector } from '../../../app/hooks';
// Import layers
import { DepartmentMarkersLayer } from './layers/DepartmentMarkersLayer';

type CategoryFilter = {
  [key: string]: boolean;  // Dynamic keys from point_status table
};

interface LeafletMapProps {
  filters: CategoryFilter;
  businessTypeFilters?: { [key: string]: boolean };
  searchQuery: string;
  selectedRestaurant?: Restaurant | null;
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  restaurants?: Restaurant[]; // Add restaurants prop
  showWardBoundaries?: boolean; // 🔥 NEW: Show ward boundaries instead of points
  showMerchants?: boolean; // 🔥 NEW: Show merchants layer
  selectedTeamId?: string; // 🔥 NEW: Selected team ID for officers layer
  onPointClick?: (point: Restaurant) => void;
  onWardClick?: (wardName: string, district: string) => void; // 🔥 NEW: Ward click handler
  onFullscreenClick?: () => void;
}

export function LeafletMap({ filters, businessTypeFilters, searchQuery, selectedRestaurant, selectedProvince, selectedDistrict, selectedWard, restaurants = [], showWardBoundaries = false, showMerchants = false, selectedTeamId, onPointClick, onWardClick, onFullscreenClick }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]); // Merchant markers
  const departmentMarkersRef = useRef<any[]>([]); // 🔥 NEW: Department markers (separate from merchant markers)
  const selectedMarkerRef = useRef<any>(null);
  const boundaryLayerRef = useRef<any>(null); // Track boundary layer
  const boundaryHighlightRef = useRef<any>(null); // Track highlight boundary
  const wardBoundariesLayerRef = useRef<any[]>([]); // 🔥 Track ward boundaries polygons
  const previousSearchQueryRef = useRef<string>('');
  const previousDistrictRef = useRef<string>(''); // Track previous district
  const previousWardRef = useRef<string>(''); // Track previous ward
  const currentZoomRef = useRef<number>(12);
  const userInteractedRef = useRef<boolean>(false); // Track if user manually zoomed/panned
  const previousSelectedRestaurantIdRef = useRef<string | null>(null); // Track selected restaurant changes
  const updateMarkersRef = useRef<(() => void) | null>(null); // 🔥 NEW: Ref to hold updateMarkers function
  const previousShowMerchantsRef = useRef<boolean>(false); // Track previous showMerchants state
  const previousSelectedProvinceRef = useRef<string | undefined>(undefined); // Track previous selected province
  const previousSelectedWardRef = useRef<string | undefined>(undefined); // Track previous selected ward
  
  // 🔥 Get divisionId and teamId from Redux store for department areas
  const reduxQLTTScope = useAppSelector((state) => state.qlttScope);
  const divisionId = reduxQLTTScope?.scope?.divisionId;
  const teamId = reduxQLTTScope?.scope?.teamId;
  
  // 🔥 Fetch department areas from API (priority: selectedTeamId > teamId > divisionId)
  // 🔥 FIX: Always fetch when we have divisionId/teamId, not just when showWardBoundaries is true
  // This ensures data is available when user switches to officers layer
  // 🔥 NEW: If no divisionId, fetch all departments' areas
  const targetDepartmentId = selectedTeamId || teamId || divisionId;
  const { departmentAreas, isLoading: isLoadingDepartmentAreas, error: departmentAreasError, currentDepartmentId } = useDepartmentAreas(
    targetDepartmentId || null,
    true // Always enabled - fetch data whenever we have a department ID or when no divisionId (to fetch all)
  );
  
  // 🔥 Transform department areas data to map-friendly format
  const departmentMapData = useMemo(() => {
    // 🔥 NEW: Allow rendering even when no targetDepartmentId (if we fetched all departments)
    // Only skip if we're still loading and have no data
    if (isLoadingDepartmentAreas && !departmentAreas) {
      return null;
    }
    
    if (isLoadingDepartmentAreas) {
      return null;
    }
    
    if (departmentAreasError) {
      return null;
    }
    
    if (!departmentAreas) {
      return null;
    }
    
    // 🔥 NEW: Extract departments info from data if available
    const departments = (departmentAreas as any)?.departments || null;
    
    const transformed = transformDepartmentAreasToMapData(departmentAreas, targetDepartmentId || 'all', departments);
    return transformed;
  }, [departmentAreas, targetDepartmentId, currentDepartmentId, isLoadingDepartmentAreas, departmentAreasError]);

  // Marker size and icon size are now imported from utils

  // 🔥 NEW LOGIC: LeafletMap receives PRE-FILTERED restaurants from MapPage
  // MapPage handles ALL filtering (status, business type, location, search)
  // LeafletMap just renders the markers for whatever restaurants it receives
  const filteredRestaurants = useMemo(() => {
    
    if (!restaurants || restaurants.length === 0) {
      return [];
    }
    
    // Just return what we received - filtering is done in MapPage
    return restaurants;
  }, [restaurants]);

  // Function to update markers
  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;
    const currentZoom = currentZoomRef.current;
    const markerSize = getMarkerSize(currentZoom);
    const iconSize = getIconSize(currentZoom);

    // 🔥 FIX: When switching to department layer, remove all merchant markers first
    // Department markers are managed by DepartmentMarkersLayer component and use separate ref
    if (showWardBoundaries && !showMerchants) {
      // Remove all merchant markers before showing department markers
      // Note: departmentMarkersRef is managed by DepartmentMarkersLayer, don't touch it here
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      selectedMarkerRef.current = null;
      // Don't render merchant markers - DepartmentMarkersLayer will handle department markers
      return;
    }

    // Remove old markers (only restaurant/merchant markers)
    // Note: Don't remove departmentMarkersRef - it's managed by DepartmentMarkersLayer
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    selectedMarkerRef.current = null;

    // 🔥 DEBUG: Log restaurants count
    console.log('🗺️ LeafletMap updateMarkers:', {
      showWardBoundaries,
      showMerchants,
      restaurantsCount: filteredRestaurants.length,
      restaurants: filteredRestaurants.slice(0, 3).map(r => ({ id: r.id, name: r.name, lat: r.lat, lng: r.lng }))
    });

    // 🔥 FIX: Render department markers ONLY when showWardBoundaries is true AND showMerchants is false
    // Department markers should NOT appear on merchants layer
    // Department markers are now handled by DepartmentMarkersLayer component
    if (showWardBoundaries && !showMerchants) {
      // 🔥 FIX: Exit early - don't render restaurant markers when showing department markers
      // Department markers should ONLY appear when showWardBoundaries = true AND showMerchants = false
      return;
    }
    
    // 🔥 FIX: Only render merchant markers when showMerchants is true
    // This ensures department markers don't appear on merchants layer
    if (!showMerchants) {
      // If we're not showing merchants and not showing departments, remove department markers too
      if (!showWardBoundaries) {
        departmentMarkersRef.current.forEach(marker => marker.remove());
        departmentMarkersRef.current = [];
      }
      return; // Exit early - don't render restaurant markers
    }
    
    // 🔥 FIX: When switching to merchant layer, remove department markers first
    if (showMerchants && !showWardBoundaries) {
      departmentMarkersRef.current.forEach(marker => marker.remove());
      departmentMarkersRef.current = [];
    }
    
   
    // Add new markers
    // 🔥 FIX: Only filter out NaN, null, undefined - allow 0,0 coordinates
    let validCount = 0;
    let invalidCount = 0;
    filteredRestaurants.forEach((restaurant) => {
      // Skip invalid coordinates (NaN, null, undefined) but allow 0,0
      const hasValidLat = restaurant.lat !== null && restaurant.lat !== undefined && !isNaN(restaurant.lat);
      const hasValidLng = restaurant.lng !== null && restaurant.lng !== undefined && !isNaN(restaurant.lng);
      if (!hasValidLat || !hasValidLng) {
        invalidCount++;
        return;
      }
      validCount++;
      
      // Generate marker icon HTML using utility function
      const iconHtml = generateMarkerIconHtml(restaurant, markerSize, iconSize);
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: hasAlertStyling(restaurant) ? 'custom-marker-icon has-citizen-reports' : 'custom-marker-icon',
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize],
        popupAnchor: [0, -markerSize]
      });

      const marker = L.marker([restaurant.lat, restaurant.lng], { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(generatePopupContent(restaurant), {
          maxWidth: 320,
          className: 'custom-leaflet-popup'
        });

      markersRef.current.push(marker);
      
      // Store reference if this is the selected restaurant
      if (selectedRestaurant && restaurant.id === selectedRestaurant.id) {
        selectedMarkerRef.current = marker;
      }
    });
  }, [filteredRestaurants, selectedRestaurant, showWardBoundaries, departmentMapData, isLoadingDepartmentAreas, departmentAreasError]); // 🔥 FIX: Added departmentMapData and loading states to dependencies

  // 🔥 Store updateMarkers in ref for map init to use
  useEffect(() => {
    updateMarkersRef.current = updateMarkers;
  }, [updateMarkers]);

  // Handle auto-zoom (separate from marker rendering)
  const handleAutoZoom = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    if (userInteractedRef.current) return; // Don't auto-zoom if user has manually interacted
    
    const L = leafletRef.current;
    
    // Check if search query changed
    const searchQueryChanged = previousSearchQueryRef.current !== searchQuery;
    
    // Check if selected restaurant changed
    const selectedRestaurantId = selectedRestaurant?.id || null;
    const selectedRestaurantChanged = previousSelectedRestaurantIdRef.current !== selectedRestaurantId;
    
    // Handle selected restaurant (from autocomplete)
    if (selectedRestaurantChanged && selectedRestaurant && selectedMarkerRef.current) {
      // Zoom to selected restaurant
      mapInstanceRef.current.setView(
        [selectedRestaurant.lat, selectedRestaurant.lng],
        16,
        { animate: true, duration: 0.6 }
      );
      
      // Open popup after a short delay
      setTimeout(() => {
        if (selectedMarkerRef.current) {
          selectedMarkerRef.current.openPopup();
        }
      }, 700);
      
      previousSelectedRestaurantIdRef.current = selectedRestaurantId;
      // Reset user interaction flag when programmatic zoom happens
      userInteractedRef.current = false;
      return;
    }
    
    // Handle search query change
    if (searchQueryChanged) {
      if (searchQuery.trim() && filteredRestaurants.length > 0) {
        if (filteredRestaurants.length === 1) {
          // Zoom to single marker
          mapInstanceRef.current.setView(
            [filteredRestaurants[0].lat, filteredRestaurants[0].lng], 
            15,
            { animate: true, duration: 0.5 }
          );
        } else {
          // Fit bounds for multiple markers
          const bounds = L.latLngBounds(
            filteredRestaurants.map(r => [r.lat, r.lng] as [number, number])
          );
          mapInstanceRef.current.fitBounds(bounds, { 
            padding: [50, 50],
            animate: true,
            duration: 0.5
          });
        }
      } else if (previousSearchQueryRef.current && !searchQuery.trim()) {
        // User cleared the search - reset to default view
        mapInstanceRef.current.setView(
          [21.0285, 105.8542], 
          12,
          { animate: true, duration: 0.5 }
        );
      }
      
      previousSearchQueryRef.current = searchQuery;
      // Reset user interaction flag when search changes
      userInteractedRef.current = false;
    }
  }, [searchQuery, selectedRestaurant, filteredRestaurants]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double initialization

    // Check if map container already has _leaflet_id (already initialized)
    if ((mapRef.current as any)._leaflet_id) {
      return;
    }

    // Dynamic import leaflet CSS first
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Dynamic import leaflet
    import('leaflet').then((L) => {
      // Double-check after async import
      if (mapInstanceRef.current) return;
      if ((mapRef.current as any)?._leaflet_id) return;
      
      // 🔥 CRITICAL: Check if mapRef still exists after async import
      if (!mapRef.current) {
        return;
      }

      // Store Leaflet reference
      leafletRef.current = L;

      // Fix icon issue with Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Create map instance
      const map = L.map(mapRef.current!).setView([21.0285, 105.8542], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
      
      // Listen to user interactions (manual zoom/pan)
      map.on('zoomstart', (e: any) => {
        // Check if zoom was triggered by user (not programmatic)
        if (!e.sourceTarget._animatingZoom) {
          userInteractedRef.current = true;
        }
      });
      
      map.on('movestart', (e: any) => {
        // Check if move was triggered by user (not programmatic)
        if (!e.sourceTarget._animatingZoom) {
          userInteractedRef.current = true;
        }
      });
      
      map.on('dragstart', () => {
        // User is dragging the map
        userInteractedRef.current = true;
      });
      
      // Listen to zoom events to rescale markers
      map.on('zoomend', () => {
        const newZoom = map.getZoom();
        if (newZoom !== currentZoomRef.current) {
          currentZoomRef.current = newZoom;
          // 🔥 Use ref to avoid dependency issues
          if (updateMarkersRef.current) {
            updateMarkersRef.current();
          } else {
          }
        } else {
        }
      });
      
      // Wait for map to be fully loaded, then add markers
      map.whenReady(() => {
        // Small delay to ensure everything is ready
        setTimeout(() => {
          // 🔥 Use ref to avoid dependency issues
          if (updateMarkersRef.current) {
            updateMarkersRef.current();
          }
        }, 200);
      });
    });

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      leafletRef.current = null;
      // Remove _leaflet_id from DOM element to allow re-initialization
      if (mapRef.current) {
        delete (mapRef.current as any)._leaflet_id;
      }
    };
  }, []); // 🔥 CRITICAL: Empty array - map should ONLY init once, never recreate!

  // Update markers when filters/search/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    updateMarkers();
  }, [updateMarkers]);

  // Handle auto-zoom when filters/search/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    handleAutoZoom();
  }, [handleAutoZoom]);

  // 🔥 NEW: Zoom to selected department when departmentMapData changes (for officers layer)
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current || !showWardBoundaries) return;
    if (!departmentMapData || departmentMapData.areas.length === 0) return;
    
    const validCenters = getValidCenters(departmentMapData);
    if (validCenters.length === 0) return;
    
    const departmentCenter = calculateAverageCenter(validCenters);
    if (!departmentCenter) return;
    
    // Zoom to department center
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView(departmentCenter, 14, {
          animate: true,
          duration: 0.8
        });
      }
    }, 300); // Delay to ensure markers are rendered first
  }, [departmentMapData, showWardBoundaries]);

  // Handle district boundary highlighting and zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    const L = leafletRef.current;
    
    
    // 🔥 FIX: Reset user interaction flag when location selection changes
    // This ensures auto-zoom works even after user has manually interacted with map
    userInteractedRef.current = false;
    
    // Remove old boundary layer if exists
    if (boundaryHighlightRef.current) {
      mapInstanceRef.current.removeLayer(boundaryHighlightRef.current);
      boundaryHighlightRef.current = null;
    }
    
    // Priority: Ward > District > Province
    // CASE 1: Ward is selected - show ward boundary
    if (selectedWard && selectedWard.trim()) {
      const wardBoundary = getWardByName(selectedWard);
      
      
      if (wardBoundary) {
        // Create polygon as non-interactive filled region (vùng tô màu, không bắt chuột)
        const polygon = L.polygon(wardBoundary.polygon, {
          color: '#dc2626', // Border color (will be transparent)
          weight: 0, // 🎨 No border
          opacity: 0, // 🎨 Border fully transparent
          fillColor: '#dc2626', // Red fill for ward
          fillOpacity: 0.30, // 🎨 Moderate opacity for clean look
          smoothFactor: 1.0,
          interactive: false, // 🔥 Disable all mouse events - polygon won't capture pointer
        }).addTo(mapInstanceRef.current);
        
        // 🔥 REMOVED: tooltip - polygon is now non-interactive
        
        boundaryHighlightRef.current = polygon;
        
        // Zoom to ward boundary only if ward changed
        const wardChanged = previousWardRef.current !== selectedWard;
        if (wardChanged && !userInteractedRef.current) {
          const bounds = L.latLngBounds(wardBoundary.bounds);
          mapInstanceRef.current.fitBounds(bounds, {
            padding: [50, 50],
            animate: true,
            duration: 0.8,
            maxZoom: 16 // Closer zoom for ward level
          });
          
          previousWardRef.current = selectedWard;
          previousDistrictRef.current = selectedDistrict || '';
          
        }
        return; // Don't process district if ward is selected
      } else {
        
        // 🔥 FALLBACK: If ward has no boundary data, show district boundary instead
        // (Only 31/168 wards have polygon data currently)
        // Will continue to CASE 2 below to handle district boundary + zoom
      }
    }
    
    // CASE 2: District is selected - show district boundary
    // Also handles ward selections that don't have boundary data (fallback)
    if (selectedDistrict && districtBoundaries[selectedDistrict]) {
      const boundary = districtBoundaries[selectedDistrict];
      
      // Create polygon as filled region without border (vùng tô màu)
      const polygon = L.polygon(boundary.polygon, {
        color: '#005cb6', // Border color (will be transparent)
        weight: 0, // 🎨 No border
        opacity: 0, // 🎨 Border fully transparent
        fillColor: '#005cb6', // MAPPA primary fill color
        fillOpacity: 0.30, // 🎨 Moderate opacity for clean look
        smoothFactor: 1.0,
        interactive: false, // 🔥 Disable all mouse events - polygon won't capture pointer
      }).addTo(mapInstanceRef.current);
      
      // 🔥 REMOVED: tooltip - polygon is now non-interactive
      
      boundaryHighlightRef.current = polygon;
      
      // 🔥 UPDATED: Zoom logic for both district-only selection AND ward fallback
      const districtChanged = previousDistrictRef.current !== selectedDistrict;
      const wardChanged = previousWardRef.current !== selectedWard;
      
      
      // Check if we should zoom
      if (!userInteractedRef.current) {
        if (selectedWard) {
          // Ward fallback case - zoom if ward OR district changed
          const shouldZoom = wardChanged || districtChanged;
          if (shouldZoom) {
            const bounds = L.latLngBounds(boundary.bounds);
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
          }
        } else {
          // District-only case - zoom only if district changed
          const shouldZoom = districtChanged;
          if (shouldZoom) {
            const bounds = L.latLngBounds(boundary.bounds);
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
          }
        }
      } else {
      }
      
      // Update previous refs AFTER zoom decision
      previousDistrictRef.current = selectedDistrict;
      previousWardRef.current = selectedWard || '';
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // 🔥 NEW: Handle zoom to Hà Nội when merchants layer is activated
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    // Check if showMerchants changed from false to true
    if (showMerchants && !previousShowMerchantsRef.current) {
      
      // Hà Nội coordinates: 21.0285, 105.8542
      // Zoom level 15 for a closer view of Hà Nội
      mapInstanceRef.current.setView(
        [21.0285, 105.8542], 
        15,
        { animate: true, duration: 0.8 }
      );
      
      // Reset user interaction flag to allow auto-zoom
      userInteractedRef.current = false;
    }
    
    // Update previous state
    previousShowMerchantsRef.current = showMerchants;
  }, [showMerchants]);

  // 🔥 NEW: Zoom to province or ward when selected
  useEffect(() => {
    // Wait a bit for map to be fully ready and for merchants to be loaded
    const timeoutId = setTimeout(() => {
      if (!mapInstanceRef.current || !leafletRef.current) {
        return;
      }
      
      // Check if province or ward changed
      const provinceChanged = selectedProvince !== previousSelectedProvinceRef.current;
      const wardChanged = selectedWard !== previousSelectedWardRef.current;
      
      if (!provinceChanged && !wardChanged) {
        return;
      }
      
    // Priority: ward > province
    // 🔥 NOTE: ward_coordinates API is called for map zooming (getting boundaries), NOT for filtering merchants
    // Merchants are already filtered by ward_id in fetchMerchants API
    // We can optimize by using merchants' coordinates first, only call API if needed for accurate boundaries
    if (selectedWard && wardChanged) {
      // 🔥 OPTIMIZATION: Try using merchants' coordinates first (if available) before calling API
      const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
      const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
      
      if (validMerchants.length > 0) {
        // Use merchants' coordinates directly (skip API call)
        const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
        const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
        const center: [number, number] = [avgLat, avgLng];
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(center, 15, {
            animate: true,
            duration: 0.8
          });
        }
        return; // Skip API call
      }
      
      // Only call API if we don't have merchants (for accurate boundaries)
      fetchWardCoordinates(selectedWard).then((coords) => {
        let center: [number, number] | null = null;
        let bounds: any = null;
        
        // Try to get coordinates from database first
        if (coords && coords.center_lat && coords.center_lng) {
          center = [coords.center_lat, coords.center_lng];
          if (coords.bounds && Array.isArray(coords.bounds) && coords.bounds.length === 2) {
            const [[south, west], [north, east]] = coords.bounds;
            bounds = leafletRef.current.latLngBounds([south, west], [north, east]);
          }
        } else {
          // Fallback: Calculate center from merchants that are already filtered by ward_id
          // Use restaurants prop directly as it's already filtered by MapPage
          const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
          
          if (merchantsToUse.length > 0) {
            const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
            
            if (validMerchants.length > 0) {
              const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
              const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
              center = [avgLat, avgLng];
            }
          }
        }
        
        if (center && mapInstanceRef.current) {
          if (bounds) {
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
          } else {
            mapInstanceRef.current.setView(center, 15, {
              animate: true,
              duration: 0.8
            });
          }
        }
      }).catch((error) => {
        // Fallback: use merchants that are already filtered by ward_id
        const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
        if (merchantsToUse.length > 0 && mapInstanceRef.current) {
          const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
          if (validMerchants.length > 0) {
            const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
            const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
            mapInstanceRef.current.setView([avgLat, avgLng], 15, {
              animate: true,
              duration: 0.8
            });
          }
        }
      });
    } else if (selectedProvince && provinceChanged && !selectedWard) {
      // 🔥 NOTE: province_coordinates API is called for map zooming (getting boundaries), NOT for filtering merchants
      // Merchants are already filtered by province_id in fetchMerchants API
      // We can optimize by using merchants' coordinates first, only call API if needed for accurate boundaries
      
      // 🔥 OPTIMIZATION: Try using merchants' coordinates first (if available) before calling API
      const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
      const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
      
      if (validMerchants.length > 0) {
        // Use merchants' coordinates directly (skip API call)
        const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
        const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
        const center: [number, number] = [avgLat, avgLng];
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(center, 12, {
            animate: true,
            duration: 0.8
          });
        }
        return; // Skip API call
      }
      
      // Only call API if we don't have merchants (for accurate boundaries)
      fetchProvinceCoordinates(selectedProvince).then((coords) => {
        let center: [number, number] | null = null;
        let bounds: any = null;
        
        // Try to get coordinates from database first
        if (coords && coords.center_lat && coords.center_lng) {
          center = [coords.center_lat, coords.center_lng];
          if (coords.bounds && Array.isArray(coords.bounds) && coords.bounds.length === 2) {
            const [[south, west], [north, east]] = coords.bounds;
            bounds = leafletRef.current.latLngBounds([south, west], [north, east]);
          }
        } else {
          // Fallback: Calculate center from merchants that are already filtered by province_id
          // Use restaurants prop directly as it's already filtered by MapPage
          const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
          
          if (merchantsToUse.length > 0) {
            const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
            
            if (validMerchants.length > 0) {
              const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
              const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
              center = [avgLat, avgLng];
            }
          }
        }
        
        if (center && mapInstanceRef.current) {
          if (bounds) {
            mapInstanceRef.current.fitBounds(bounds, {
              padding: [50, 50],
              animate: true,
              duration: 0.8
            });
          } else {
            mapInstanceRef.current.setView(center, 11, {
              animate: true,
              duration: 0.8
            });
          }
        }
      }).catch((error) => {
        // Fallback: use merchants that are already filtered by province_id
        const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
        if (merchantsToUse.length > 0 && mapInstanceRef.current) {
          const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
          if (validMerchants.length > 0) {
            const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
            const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
            mapInstanceRef.current.setView([avgLat, avgLng], 11, {
              animate: true,
              duration: 0.8
            });
          }
        }
      });
      }
      
      // Update previous refs
      previousSelectedProvinceRef.current = selectedProvince;
      previousSelectedWardRef.current = selectedWard;
    }, 300); // Small delay to ensure map is ready
    
    return () => clearTimeout(timeoutId);
  }, [selectedProvince, selectedWard, restaurants.length, filteredRestaurants.length]); // Add restaurants.length to trigger when merchants are loaded

  return (
    <>
      <div ref={mapRef} className={styles.map} />
      {/* Department Markers Layer - Only render when showWardBoundaries is true and showMerchants is false */}
      {showWardBoundaries && !showMerchants && (
        <DepartmentMarkersLayer
          mapInstance={mapInstanceRef.current}
          leafletRef={leafletRef.current}
          departmentMapData={departmentMapData}
          isLoading={isLoadingDepartmentAreas}
          error={departmentAreasError}
          markersRef={departmentMarkersRef}
          wardBoundariesLayerRef={wardBoundariesLayerRef}
        />
      )}
      {onFullscreenClick && (
        <button 
          onClick={onFullscreenClick}
          className={styles.fullscreenButton}
          aria-label="Fullscreen"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>
      )}
    </>
  );
}

// 🔥 PERFORMANCE OPTIMIZATION: Wrap with React.memo
// Map sẽ CHỈ re-render khi props thực sự thay đổi
// Khi filter thay đổi -> restaurants array thay đổi -> updateMarkers() chạy
// Map instance KHÔNG bị recreate, chỉ markers được update
export default memo(LeafletMap);