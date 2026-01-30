import { useEffect, useRef, useCallback } from 'react';
import { Restaurant } from '../../../../data/restaurantData';
import { fetchProvinceCoordinates, fetchWardCoordinates } from '../../../../utils/api/locationsApi';

interface UseMapZoomProps {
  mapInstance: any;
  leafletRef: any;
  searchQuery: string;
  selectedRestaurant: Restaurant | null | undefined;
  selectedProvince?: string;
  selectedWard?: string;
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  selectedMarkerRef: React.MutableRefObject<any>;
  userInteractedRef: React.MutableRefObject<boolean>;
  previousSearchQueryRef: React.MutableRefObject<string>;
  previousSelectedRestaurantIdRef: React.MutableRefObject<string | null>;
  previousSelectedProvinceRef: React.MutableRefObject<string | undefined>;
  previousSelectedWardRef: React.MutableRefObject<string | undefined>;
}

export const useMapZoom = ({
  mapInstance,
  leafletRef,
  searchQuery,
  selectedRestaurant,
  selectedProvince,
  selectedWard,
  restaurants,
  filteredRestaurants,
  selectedMarkerRef,
  userInteractedRef,
  previousSearchQueryRef,
  previousSelectedRestaurantIdRef,
  previousSelectedProvinceRef,
  previousSelectedWardRef,
}: UseMapZoomProps) => {
  // Handle auto-zoom (separate from marker rendering)
  const handleAutoZoom = useCallback(() => {
    if (!mapInstance || !leafletRef) return;
    if (userInteractedRef.current) return; // Don't auto-zoom if user has manually interacted
    
    const L = leafletRef;
    
    // Check if search query changed
    const searchQueryChanged = previousSearchQueryRef.current !== searchQuery;
    
    // Check if selected restaurant changed
    const selectedRestaurantId = selectedRestaurant?.id || null;
    const selectedRestaurantChanged = previousSelectedRestaurantIdRef.current !== selectedRestaurantId;
    
    // Handle selected restaurant (from autocomplete)
    if (selectedRestaurantChanged && selectedRestaurant && selectedMarkerRef.current) {
      // Zoom to selected restaurant
      mapInstance.setView(
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
          mapInstance.setView(
            [filteredRestaurants[0].lat, filteredRestaurants[0].lng], 
            15,
            { animate: true, duration: 0.5 }
          );
        } else {
          // Fit bounds for multiple markers
          const bounds = L.latLngBounds(
            filteredRestaurants.map(r => [r.lat, r.lng] as [number, number])
          );
          mapInstance.fitBounds(bounds, { 
            padding: [50, 50],
            animate: true,
            duration: 0.5
          });
        }
      } else if (previousSearchQueryRef.current && !searchQuery.trim()) {
        // User cleared the search - reset to default view
        mapInstance.setView(
          [21.0285, 105.8542], 
          12,
          { animate: true, duration: 0.5 }
        );
      }
      
      previousSearchQueryRef.current = searchQuery;
      // Reset user interaction flag when search changes
      userInteractedRef.current = false;
    }
  }, [mapInstance, leafletRef, searchQuery, selectedRestaurant, filteredRestaurants, selectedMarkerRef, userInteractedRef, previousSearchQueryRef, previousSelectedRestaurantIdRef]);

  // Handle auto-zoom when filters/search/selection changes
  useEffect(() => {
    if (!mapInstance || !leafletRef) return;
    handleAutoZoom();
  }, [handleAutoZoom, mapInstance, leafletRef]);

  // Zoom to province or ward when selected
  useEffect(() => {
    if (!mapInstance || !leafletRef) return;
    
    // Wait a bit for map to be fully ready and for merchants to be loaded
    const timeoutId = setTimeout(() => {
      // Check if province or ward changed
      const provinceChanged = selectedProvince !== previousSelectedProvinceRef.current;
      const wardChanged = selectedWard !== previousSelectedWardRef.current;
      
      if (!provinceChanged && !wardChanged) {
        return;
      }
      
      // Priority: ward > province
      if (selectedWard && wardChanged) {
        // Try using merchants' coordinates first (if available) before calling API
        const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
        const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
        
        if (validMerchants.length > 0) {
          // Use merchants' coordinates directly (skip API call)
          const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
          const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
          const center: [number, number] = [avgLat, avgLng];
          
          if (mapInstance) {
            mapInstance.setView(center, 15, {
              animate: true,
              duration: 0.8
            });
          }
          previousSelectedWardRef.current = selectedWard;
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
              bounds = leafletRef.latLngBounds([south, west], [north, east]);
            }
          } else {
            // Fallback: Calculate center from merchants
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
          
          if (center && mapInstance) {
            if (bounds) {
              mapInstance.fitBounds(bounds, {
                padding: [50, 50],
                animate: true,
                duration: 0.8
              });
            } else {
              mapInstance.setView(center, 15, {
                animate: true,
                duration: 0.8
              });
            }
          }
        }).catch((error) => {
          console.error('❌ Error fetching ward coordinates:', error);
          // Fallback: use merchants
          const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
          if (merchantsToUse.length > 0 && mapInstance) {
            const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
            if (validMerchants.length > 0) {
              const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
              const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
              mapInstance.setView([avgLat, avgLng], 15, {
                animate: true,
                duration: 0.8
              });
            }
          }
        });
        previousSelectedWardRef.current = selectedWard;
      } else if (selectedProvince && provinceChanged && !selectedWard) {
        // Try using merchants' coordinates first (if available) before calling API
        const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
        const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
        
        if (validMerchants.length > 0) {
          // Use merchants' coordinates directly (skip API call)
          const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
          const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
          const center: [number, number] = [avgLat, avgLng];
          
          if (mapInstance) {
            mapInstance.setView(center, 12, {
              animate: true,
              duration: 0.8
            });
          }
          previousSelectedProvinceRef.current = selectedProvince;
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
              bounds = leafletRef.latLngBounds([south, west], [north, east]);
            }
          } else {
            // Fallback: Calculate center from merchants
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
          
          if (center && mapInstance) {
            if (bounds) {
              mapInstance.fitBounds(bounds, {
                padding: [50, 50],
                animate: true,
                duration: 0.8
              });
            } else {
              mapInstance.setView(center, 11, {
                animate: true,
                duration: 0.8
              });
            }
          }
        }).catch((error) => {
          console.error('❌ Error fetching province coordinates:', error);
          // Fallback: use merchants
          const merchantsToUse = restaurants.length > 0 ? restaurants : filteredRestaurants;
          if (merchantsToUse.length > 0 && mapInstance) {
            const validMerchants = merchantsToUse.filter(m => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);
            if (validMerchants.length > 0) {
              const avgLat = validMerchants.reduce((sum, m) => sum + (m.lat || 0), 0) / validMerchants.length;
              const avgLng = validMerchants.reduce((sum, m) => sum + (m.lng || 0), 0) / validMerchants.length;
              mapInstance.setView([avgLat, avgLng], 11, {
                animate: true,
                duration: 0.8
              });
            }
          }
        });
        previousSelectedProvinceRef.current = selectedProvince;
      } else if (!selectedProvince && !selectedWard && (provinceChanged || wardChanged)) {
        // Reset zoom when filters are cleared
        // Could reset to default view here if needed
      }
      
      // Update previous refs
      previousSelectedProvinceRef.current = selectedProvince;
      previousSelectedWardRef.current = selectedWard;
    }, 300); // Small delay to ensure map is ready
    
    return () => clearTimeout(timeoutId);
  }, [selectedProvince, selectedWard, restaurants.length, filteredRestaurants.length, mapInstance, leafletRef, restaurants, filteredRestaurants, previousSelectedProvinceRef, previousSelectedWardRef]);

  return { handleAutoZoom };
};

