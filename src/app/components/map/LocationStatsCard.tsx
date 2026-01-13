import React from 'react';
import { User, Building2, AlertTriangle, CheckCircle2, Map, X, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './LocationStatsCard.module.css';
import { provinces, districts, wards } from '../../../data/vietnamLocations';
import { Restaurant } from '../../../data/restaurantData';
import { Category } from '../../../utils/api/categoriesApi';

interface LocationStatsCardProps {
  selectedProvince?: string;
  selectedDistrict?: string;
  selectedWard?: string;
  filteredRestaurants: Restaurant[];
  businessTypeFilters: { [key: string]: boolean };
  categories: Category[];  // 🔥 NEW: Categories for mapping ID to name
  onClose: () => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
  isFullscreen?: boolean; // Differentiate between main screen and fullscreen mode
}

export const LocationStatsCard = React.forwardRef<HTMLDivElement, LocationStatsCardProps>(
  ({
    selectedProvince,
    selectedDistrict,
    selectedWard,
    filteredRestaurants,
    businessTypeFilters,
    categories,  // 🔥 NEW: Categories for mapping ID to name
    onClose,
    isVisible,
    onVisibilityChange,
    isFullscreen = false
  }, ref) => {
    // Don't render if not visible
    if (!isVisible) return null;
    
    // 🔥 NEW: State for showing/hiding business types list
    const [showAllBusinessTypes, setShowAllBusinessTypes] = React.useState(false);
    const MAX_VISIBLE_TYPES = 2; // Show only 2 types initially (less clutter)

    // Default to Hà Nội if no province selected
    const defaultProvince = 'Hà Nội';
    const activeProvince = selectedProvince || defaultProvince;

    // Get location data
    const provinceData = activeProvince ? provinces[activeProvince] : null;
    const districtData = selectedDistrict 
      ? districts[activeProvince]?.find(d => d.name === selectedDistrict)
      : null;
    const wardData = selectedWard 
      ? wards[selectedDistrict]?.find(w => w.name === selectedWard)
      : null;

    // Determine current location level
    const currentLocation = wardData || districtData || provinceData;
    const locationName = selectedWard || selectedDistrict || activeProvince;
    const officer = currentLocation?.officer || 'Chưa phân công';
    const area = currentLocation?.area;

    // Calculate stats
    const totalBusinesses = filteredRestaurants.length;
    const certifiedCount = filteredRestaurants.filter(r => r.category === 'certified').length;
    const hotspotCount = filteredRestaurants.filter(r => r.category === 'hotspot').length;
    const scheduledCount = filteredRestaurants.filter(r => r.category === 'scheduled').length;
    const inspectedCount = filteredRestaurants.filter(r => r.category === 'inspected').length;

    // Calculate population stats
    const totalPopulation = filteredRestaurants.reduce((sum, r) => sum + (r.nearbyPopulation || 0), 0);
    const avgPopulationPerBusiness = totalBusinesses > 0 ? Math.round(totalPopulation / totalBusinesses) : 0;
    const estimatedHouseholds = totalPopulation > 0 ? Math.round(totalPopulation / 3.5) : 0; // Avg 3.5 people per household in Vietnam

    // Format number with thousand separators
    const formatNumber = (num: number): string => {
      if (!num || isNaN(num)) return '0';
      return num.toLocaleString('vi-VN');
    };

    // Get active business type filters
    const activeBusinessTypes = Object.entries(businessTypeFilters)
      .filter(([_, isActive]) => isActive)
      .map(([type, _]) => type);
    const hasBusinessTypeFilter = activeBusinessTypes.length > 0;
    
    // 🔥 Map category IDs to names
    const activeBusinessTypeNames = activeBusinessTypes
      .map(categoryId => {
        const category = categories.find(cat => cat.id === categoryId);
        return category?.name || categoryId; // Fallback to ID if not found
      });
    
    // 🐛 DEBUG: Log data for debugging count issues
    console.log('📊 LocationStatsCard Stats:');
    console.log('  - filteredRestaurants.length:', filteredRestaurants.length);
    console.log('  - Certified count:', certifiedCount);
    console.log('  - Hotspot count:', hotspotCount);
    console.log('  - Scheduled count:', scheduledCount);
    console.log('  - Inspected count:', inspectedCount);
    console.log('  - Active business types:', activeBusinessTypeNames);
    console.log('  - Sample restaurants:', filteredRestaurants.slice(0, 3).map(r => ({ 
      name: r.name, 
      category: r.category, 
      businessType: r.businessType 
    })));

    const handleClose = () => {
      onVisibilityChange(false);
      onClose();
    };

    return (
      <div className={`${styles.card} ${isFullscreen ? styles.fullscreen : ''}`} ref={ref}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Map size={16} className={styles.titleIcon} />
            <span className={styles.titleText}>{locationName}</span>
          </div>
          <button 
            className={styles.closeIcon} 
            onClick={handleClose}
            aria-label="Đóng"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Business Type Filters (if any) */}
          {hasBusinessTypeFilter && (() => {
            const hasMore = activeBusinessTypeNames.length > MAX_VISIBLE_TYPES;
            
            // When collapsed: show only first 2 types
            const visibleTypes = showAllBusinessTypes 
              ? activeBusinessTypeNames 
              : activeBusinessTypeNames.slice(0, MAX_VISIBLE_TYPES);
            
            return (
              <div className={styles.businessTypesRow}>
                <Building2 size={14} className={styles.icon} />
                <div className={styles.businessTypesList}>
                  {visibleTypes.map((type) => (
                    <span key={type} className={styles.businessTypeBadge}>
                      {type}
                    </span>
                  ))}
                  {hasMore && !showAllBusinessTypes && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  {hasMore && (
                    <button
                      className={styles.showMoreButton}
                      onClick={() => setShowAllBusinessTypes(!showAllBusinessTypes)}
                      title={showAllBusinessTypes ? 'Thu gọn' : `Xem thêm ${activeBusinessTypeNames.length - MAX_VISIBLE_TYPES} ngành nghề`}
                    >
                      {showAllBusinessTypes ? (
                        <>
                          <ChevronUp size={12} />
                          <span>Thu gọn</span>
                        </>
                      ) : (
                        <>
                          <span>Xem thêm</span>
                          <ChevronDown size={12} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Officer Info */}
          <div className={styles.officerRow}>
            <User size={14} className={styles.icon} />
            <span className={styles.label}>Cán bộ quản lý:</span>
            <span className={styles.value}>{officer}</span>
          </div>

          {/* Stats Grid */}
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <Building2 size={14} className={styles.statIcon} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>{totalBusinesses}</div>
                <div className={styles.statLabel}>Hộ kinh doanh</div>
              </div>
            </div>

            <div className={styles.statItem}>
              <CheckCircle2 size={14} className={styles.statIcon} style={{ color: '#22c55e' }} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>{certifiedCount}</div>
                <div className={styles.statLabel}>Đạt chuẩn</div>
              </div>
            </div>

            <div className={styles.statItem}>
              <AlertTriangle size={14} className={styles.statIcon} style={{ color: '#ef4444' }} />
              <div className={styles.statContent}>
                <div className={styles.statValue}>{hotspotCount}</div>
                <div className={styles.statLabel}>Vi phạm</div>
              </div>
            </div>

            {area && (
              <div className={styles.statItem}>
                <Map size={14} className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{area.toFixed(2)}</div>
                  <div className={styles.statLabel}>km²</div>
                </div>
              </div>
            )}
          </div>

          {/* Additional row */}
          <div className={styles.additionalStats}>
            <div className={styles.smallStat}>
              <span className={styles.smallStatLabel}>Sắp kiểm tra:</span>
              <span className={styles.smallStatValue}>{scheduledCount}</span>
            </div>
            <div className={styles.smallStat}>
              <span className={styles.smallStatLabel}>Đã kiểm tra:</span>
              <span className={styles.smallStatValue}>{inspectedCount}</span>
            </div>
            <div className={styles.smallStat}>
              <span className={styles.smallStatLabel}>Tổng dân số:</span>
              <span className={styles.smallStatValue}>{formatNumber(totalPopulation)}</span>
            </div>
            <div className={styles.smallStat}>
              <span className={styles.smallStatLabel}>TB dân số/hộ:</span>
              <span className={styles.smallStatValue}>{formatNumber(avgPopulationPerBusiness)}</span>
            </div>
            <div className={styles.smallStat}>
              <span className={styles.smallStatLabel}>Ước lượng hộ dân:</span>
              <span className={styles.smallStatValue}>{formatNumber(estimatedHouseholds)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LocationStatsCard.displayName = 'LocationStatsCard';