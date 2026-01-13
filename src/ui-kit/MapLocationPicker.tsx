import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Locate, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import styles from './MapLocationPicker.module.css';

interface MapLocationPickerProps {
  address: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  disabled?: boolean;
}

interface GeocodeSuggestion {
  address: string;
  latitude: number;
  longitude: number;
  type: 'street' | 'district' | 'city';
}

export function MapLocationPicker({
  address,
  latitude,
  longitude,
  onLocationChange,
  disabled = false,
}: MapLocationPickerProps) {
  const [mapCenter, setMapCenter] = useState({ lat: latitude || 10.8231, lng: longitude || 106.6297 }); // Default: TP.HCM
  const [markerPosition, setMarkerPosition] = useState({ lat: latitude || 10.8231, lng: longitude || 106.6297 });
  const [zoomLevel, setZoomLevel] = useState(15);
  const [searchQuery, setSearchQuery] = useState(address || '');
  const [geocodeSuggestions, setGeocodeSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPinConfirmed, setIsPinConfirmed] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Mock geocoding function
  const mockGeocode = (query: string): GeocodeSuggestion[] => {
    if (!query || query.length < 3) return [];

    const lowerQuery = query.toLowerCase();
    const suggestions: GeocodeSuggestion[] = [];

    // Mock data for Vietnam addresses
    if (lowerQuery.includes('nguyễn') || lowerQuery.includes('nguyen')) {
      suggestions.push({
        address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
        latitude: 10.7745,
        longitude: 106.7008,
        type: 'street',
      });
    }

    if (lowerQuery.includes('quận 1') || lowerQuery.includes('q1')) {
      suggestions.push({
        address: 'Quận 1, TP. Hồ Chí Minh',
        latitude: 10.7756,
        longitude: 106.7019,
        type: 'district',
      });
    }

    if (lowerQuery.includes('lê lợi') || lowerQuery.includes('le loi')) {
      suggestions.push({
        address: '45 Lê Lợi, Quận 1, TP.HCM',
        latitude: 10.7734,
        longitude: 106.6986,
        type: 'street',
      });
    }

    if (lowerQuery.includes('bến thành') || lowerQuery.includes('ben thanh')) {
      suggestions.push({
        address: 'Chợ Bến Thành, Quận 1, TP.HCM',
        latitude: 10.7723,
        longitude: 106.6980,
        type: 'street',
      });
    }

    if (lowerQuery.includes('thủ đức') || lowerQuery.includes('thu duc')) {
      suggestions.push({
        address: 'Thành phố Thủ Đức, TP.HCM',
        latitude: 10.8509,
        longitude: 106.7717,
        type: 'city',
      });
    }

    // Default suggestion based on input
    if (suggestions.length === 0 && query.length >= 3) {
      suggestions.push({
        address: `${query}, TP. Hồ Chí Minh`,
        latitude: 10.8231 + (Math.random() - 0.5) * 0.1,
        longitude: 106.6297 + (Math.random() - 0.5) * 0.1,
        type: 'street',
      });
    }

    return suggestions;
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 3) {
      const suggestions = mockGeocode(value);
      setGeocodeSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: GeocodeSuggestion) => {
    setSearchQuery(suggestion.address);
    setMarkerPosition({ lat: suggestion.latitude, lng: suggestion.longitude });
    setMapCenter({ lat: suggestion.latitude, lng: suggestion.longitude });
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
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert pixel coordinates to lat/lng (simplified)
    // In real implementation, use proper map projection math
    const mapWidth = rect.width;
    const mapHeight = rect.height;

    const latOffset = ((y / mapHeight) - 0.5) * 0.01; // Adjust based on zoom
    const lngOffset = ((x / mapWidth) - 0.5) * 0.01;

    const newLat = mapCenter.lat - latOffset;
    const newLng = mapCenter.lng + lngOffset;

    setMarkerPosition({ lat: newLat, lng: newLng });
    setIsPinConfirmed(true);
    setValidationMessage('');

    onLocationChange({
      latitude: newLat,
      longitude: newLng,
    });
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 5));
  };

  // Recenter to marker
  const handleRecenter = () => {
    setMapCenter({ ...markerPosition });
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMarkerPosition({ lat, lng });
          setMapCenter({ lat, lng });
          setIsPinConfirmed(true);
          setValidationMessage('');
          
          onLocationChange({
            latitude: lat,
            longitude: lng,
          });
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
        setMapCenter({ lat: latitude, lng: longitude });
        setIsPinConfirmed(true);
        setValidationMessage('');
      } else {
        setValidationMessage('Tọa độ nằm ngoài phạm vi Việt Nam');
      }
    }
  }, [latitude, longitude]);

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
          disabled={disabled}
          type="button"
          className={styles.currentLocationButton}
        >
          <Locate size={16} />
          Vị trí hiện tại
        </Button>
      </div>

      {/* Map Container */}
      <div className={styles.mapSection}>
        <div className={styles.mapContainer}>
          {/* Map */}
          <div 
            className={styles.mapCanvas} 
            onClick={handleMapClick}
            style={{ cursor: disabled ? 'default' : 'crosshair' }}
          >
            {/* Map Grid Background */}
            <div className={styles.mapGrid}></div>

            {/* Marker */}
            <div
              className={styles.marker}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -100%)',
              }}
            >
              <MapPin 
                size={32} 
                className={isPinConfirmed ? styles.markerConfirmed : styles.markerUnconfirmed} 
                fill={isPinConfirmed ? 'var(--color-primary)' : 'var(--color-warning)'}
              />
            </div>

            {/* Coordinates Overlay */}
            <div className={styles.coordsOverlay}>
              <span className={styles.coordsText}>
                {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
              </span>
            </div>
          </div>

          {/* Map Controls */}
          <div className={styles.mapControls}>
            <button
              className={styles.mapControlButton}
              onClick={handleZoomIn}
              disabled={disabled || zoomLevel >= 20}
              type="button"
              title="Phóng to"
            >
              <ZoomIn size={18} />
            </button>
            <button
              className={styles.mapControlButton}
              onClick={handleZoomOut}
              disabled={disabled || zoomLevel <= 5}
              type="button"
              title="Thu nhỏ"
            >
              <ZoomOut size={18} />
            </button>
            <button
              className={styles.mapControlButton}
              onClick={handleRecenter}
              disabled={disabled}
              type="button"
              title="Về giữa"
            >
              <Navigation size={18} />
            </button>
          </div>

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
          Marker sẽ được đặt tại vị trí bạn chọn.
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