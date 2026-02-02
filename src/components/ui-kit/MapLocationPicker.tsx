import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, Locate, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import styles from './MapLocationPicker.module.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapLocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address?: string;
    province?: string;
    ward?: string;
  }) => void;
  disabled?: boolean;
}

interface GeocodeSuggestion {
  address: string;
  latitude: number;
  longitude: number;
  type: 'street' | 'district' | 'city';
}

// Map click handler component
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Reverse geocoding using Nominatim API (free, no key required)
async function reverseGeocode(lat: number, lng: number): Promise<{ address: string; province?: string; ward?: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`,
      {
        headers: {
          'User-Agent': 'MAPPA-StoreLocator/1.0',
        },
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const address = data.address;
      
      // Build street address
      let streetAddress = '';
      if (address?.road) {
        streetAddress = address.road + (address.house_number ? ' ' + address.house_number : '');
      } else if (address?.address_line1) {
        streetAddress = address.address_line1;
      }
      
      // Extract province/city and ward/district
      const province = address?.city || address?.town || 'TP. Hồ Chí Minh';
      const ward = address?.ward || address?.village || address?.hamlet || '';
      
      const fullAddress = [streetAddress, ward, province].filter(p => p).join(', ');
      
      return {
        address: fullAddress || data.address_line1 || '',
        province,
        ward,
      };
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
  }
  return null;
}

export function MapLocationPicker({
  address,
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
}: MapLocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState({ lat: latitude || 10.8231, lng: longitude || 106.6297 });
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [geocodeSuggestions, setGeocodeSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPinConfirmed, setIsPinConfirmed] = useState(!!latitude && !!longitude);
  const [validationMessage, setValidationMessage] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const mapRef = useRef(null);

  // Forward geocoding using Nominatim API
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        value + ', Vietnam'
      )}&viewbox=102,8,110,24&bounded=1&limit=5&accept-language=vi`;

      fetch(searchUrl, {
        headers: {
          'User-Agent': 'MAPPA-StoreLocator/1.0',
        },
      })
        .then((res) => res.json())
        .then((results) => {
          const suggestions: GeocodeSuggestion[] = results.map((result: any) => ({
            address: result.display_name || result.name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            type: result.type === 'street' || result.type === 'house' ? 'street' : 'district',
          }));
          setGeocodeSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        })
        .catch((error) => {
          console.error('Search error:', error);
          setShowSuggestions(false);
        });
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: GeocodeSuggestion) => {
    setSearchQuery(suggestion.address);
    setMarkerPosition({ lat: suggestion.latitude, lng: suggestion.longitude });
    setShowSuggestions(false);
    setIsPinConfirmed(true);
    setValidationMessage('');
    
    onLocationChange({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      address: suggestion.address,
    });
  };

  // Handle map click to place marker
  const handleMapClick = async (lat: number, lng: number) => {
    if (disabled) return;

    setMarkerPosition({ lat, lng });
    setIsPinConfirmed(true);
    setValidationMessage('');
    setIsLoadingAddress(true);

    // Get address from coordinates
    const result = await reverseGeocode(lat, lng);
    setIsLoadingAddress(false);
    
    if (result) {
      setSearchQuery(result.address);
      onLocationChange({
        latitude: lat,
        longitude: lng,
        address: result.address,
        province: result.province,
        ward: result.ward,
      });
    } else {
      onLocationChange({
        latitude: lat,
        longitude: lng,
      address: result.address,
        province: result.province,
        ward: result.ward,
      });
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
          setIsPinConfirmed(true);
          setValidationMessage('');
          setIsLoadingAddress(true);

          const result = await reverseGeocode(lat, lng);
          setIsLoadingAddress(false);
          
          if (result) {
            setSearchQuery(result.address);
            onLocationChange({
              latitude: lat,
              longitude: lng,
              address: result.address,
              province: result.province,
              ward: result.ward,
            });
          } else {
            onLocationChange({
              latitude: lat,
              longitude: lng,
            });
          }
        },
        (error) => {
          setValidationMessage('Không thể xác định vị trí hiện tại');
        }
      );
    } else {
      setValidationMessage('Trình duyệt không hỗ trợ định vị GPS');
    }
  };

  // Validate coordinates
  const isValidCoordinate = (lat?: number, lng?: number) => {
    if (lat === undefined || lng === undefined) return false;
    // Vietnam bounds (approximate)
    return lat >= 8.0 && lat <= 24.0 && lng >= 102.0 && lng <= 110.0;
  };

  // Update marker when external lat/lng changes
  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      if (isValidCoordinate(latitude, longitude)) {
        setMarkerPosition({ lat: latitude, lng: longitude });
        setIsPinConfirmed(true);
        setValidationMessage('');
      } else {
        setValidationMessage('Tọa độ nằm ngoài phạm vi Việt Nam');
      }
    }
  }, [latitude, longitude]);

  // Auto-search address when address prop changes (from form selections)
  useEffect(() => {
    if (address && address.length >= 3 && address !== searchQuery) {
      console.log('🔍 Auto-searching address:', address);
      setSearchQuery(address);
      
      const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address + ', Vietnam'
      )}&viewbox=102,8,110,24&bounded=1&limit=5&accept-language=vi`;

      fetch(searchUrl, {
        headers: {
          'User-Agent': 'MAPPA-StoreLocator/1.0',
        },
      })
        .then((res) => res.json())
        .then((results) => {
          if (results && results.length > 0) {
            // Auto-select the first result
            const firstResult = results[0];
            const lat = parseFloat(firstResult.lat);
            const lng = parseFloat(firstResult.lon);
            
            console.log('✅ Auto-found address:', firstResult.display_name);
            setMarkerPosition({ lat, lng });
            setIsPinConfirmed(true);
            setValidationMessage('');
            
            // Optionally auto-update coordinates
            onLocationChange({
              latitude: lat,
              longitude: lng,
              address: firstResult.display_name || address,
            });
          }
        })
        .catch((error) => {
          console.error('Auto-search error:', error);
        });
    }
  }, [address]);

  return (
    <div className={styles.container}>
      {/* Search & Address Input */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchInputWrapper}>
            <Input
              id="map-search"
              type="text"
              placeholder="Nhập địa chỉ để tìm kiếm..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={disabled}
              className={styles.searchInput}
            />
          </div>

          {/* Geocode Suggestions */}
          {showSuggestions && geocodeSuggestions.length > 0 && (
            <div className={styles.suggestions}>
              {geocodeSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  type="button"
                >
                  <MapPin size={16} className={styles.suggestionIcon} />
                  <div className={styles.suggestionText}>
                    <div className={styles.suggestionAddress}>{suggestion.address}</div>
                    <div className={styles.suggestionCoords}>
                      {suggestion.latitude.toFixed(6)}, {suggestion.longitude.toFixed(6)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Get Current Location */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={disabled || isLoadingAddress}
          type="button"
          className={styles.currentLocationButton}
        >
          <Locate size={16} />
          {isLoadingAddress ? 'Đang xác định...' : 'Vị trí hiện tại'}
        </Button>
      </div>

      {/* Map Container */}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          {/* Leaflet Map */}
          <MapContainer
            center={[markerPosition.lat, markerPosition.lng]}
            zoom={15}
            style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[markerPosition.lat, markerPosition.lng]}>
              <Popup>
                {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                {searchQuery && <br />}
                {searchQuery}
              </Popup>
            </Marker>
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>

          {/* Status Indicator */}
          <div className={styles.statusIndicator}>
            {isPinConfirmed ? (
              <div className={styles.statusConfirmed}>
                <CheckCircle2 size={16} />
                <span>Vị trí đã xác nhận</span>
              </div>
            ) : (
              <div className={styles.statusPending}>
                <AlertCircle size={16} />
                <span>Click vào bản đồ để chọn vị trí</span>
              </div>
            )}
          </div>
        </div>

        {/* Validation Message */}
        {validationMessage && (
          <div className={styles.validationError}>
            <AlertCircle size={16} />
            {validationMessage}
          </div>
        )}

        {/* Help Text */}
        <p className={styles.helpText}>
          Bạn có thể tìm kiếm địa chỉ, nhập tọa độ, hoặc click trực tiếp trên bản đồ để chọn vị trí.
          {isLoadingAddress && ' Đang lấy địa chỉ...'}
        </p>
      </div>

      {/* Coordinates Display */}
      <div className={styles.coordsDisplay}>
        <div className={styles.coordField}>
          <Label htmlFor="map-lat">Vĩ độ (Latitude)</Label>
          <Input
            id="map-lat"
            type="number"
            step="0.000001"
            value={markerPosition.lat.toFixed(6)}
            onChange={(e) => {
              const lat = parseFloat(e.target.value);
              if (!isNaN(lat)) {
                setMarkerPosition(prev => ({ ...prev, lat }));
                onLocationChange({
                  latitude: lat,
                  longitude: markerPosition.lng,
                });
              }
            }}
            disabled={disabled}
          />
        </div>

        <div className={styles.coordField}>
          <Label htmlFor="map-lng">Kinh độ (Longitude)</Label>
          <Input
            id="map-lng"
            type="number"
            step="0.000001"
            value={markerPosition.lng.toFixed(6)}
            onChange={(e) => {
              const lng = parseFloat(e.target.value);
              if (!isNaN(lng)) {
                setMarkerPosition(prev => ({ ...prev, lng }));
                onLocationChange({
                  latitude: markerPosition.lat,
                  longitude: lng,
                });
              }
            }}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
