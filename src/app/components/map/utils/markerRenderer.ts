import { Restaurant } from '../../../../data/restaurantData';
import { getBusinessIconWithSize } from './markerUtils';
import { getCategoryColor } from './categoryUtils';

/**
 * Generate marker icon HTML
 */
export function generateMarkerIconHtml(
  restaurant: Restaurant,
  markerSize: number,
  iconSize: number
): string {
  const color = getCategoryColor(restaurant.category);
  
  // Check if restaurant has citizen reports
  const hasCitizenReports = restaurant.citizenReports && restaurant.citizenReports.length > 0;
  
  // Check if it's a hotspot (red marker)
  const isHotspot = restaurant.category === 'hotspot';
  
  // Create darker shade for subtle border effect
  const darkerColor = color === '#22c55e' ? '#16a34a' : 
                     color === '#ef4444' ? '#dc2626' : 
                     color === '#eab308' ? '#ca8a04' : 
                     color === '#005cb6' ? '#004a94' : color;
  
  // Calculate proportional values
  const highlightHeight = Math.round(markerSize * 0.3);
  const highlightTop = Math.round(markerSize * 0.08);
  
  // Add pulse ring for markers with citizen reports or hotspot markers
  const alertElements = (hasCitizenReports || isHotspot) ? '<div class="alert-pulse-ring"></div>' : '';
  
  return `
    <div class="marker-wrapper" style="
      width: ${markerSize}px;
      height: ${markerSize}px;
      background: linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.15),
        0 4px 16px rgba(0, 0, 0, 0.1),
        inset 0 -1px 2px rgba(0, 0, 0, 0.1);
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    ">
      ${alertElements}
      <div style="
        position: absolute;
        top: ${highlightTop}px;
        left: ${highlightTop}px;
        right: ${highlightTop}px;
        height: ${highlightHeight}px;
        background: linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%);
        border-radius: 50% 50% 0 0;
        pointer-events: none;
      "></div>
      <div style="
        transform: rotate(45deg);
        position: relative;
        z-index: 1;
      ">
        ${getBusinessIconWithSize(restaurant.type, iconSize)}
      </div>
    </div>
  `;
}

/**
 * Check if marker should have alert styling (citizen reports or hotspot)
 */
export function hasAlertStyling(restaurant: Restaurant): boolean {
  const hasCitizenReports = restaurant.citizenReports && restaurant.citizenReports.length > 0;
  const isHotspot = restaurant.category === 'hotspot';
  return hasCitizenReports || isHotspot;
}

