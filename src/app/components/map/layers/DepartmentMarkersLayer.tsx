import { useEffect, useRef, useCallback } from 'react';
import { DepartmentMapData } from '../utils/departmentAreasUtils';

interface DepartmentMarkersLayerProps {
  mapInstance: any;
  leafletRef: any;
  departmentMapData: DepartmentMapData | null;
  isLoading: boolean;
  error: any;
  markersRef: React.MutableRefObject<any[]>;
  wardBoundariesLayerRef: React.MutableRefObject<any[]>;
}

export const DepartmentMarkersLayer: React.FC<DepartmentMarkersLayerProps> = ({
  mapInstance,
  leafletRef,
  departmentMapData,
  isLoading,
  error,
  markersRef,
  wardBoundariesLayerRef,
}) => {
  const updateMarkers = useCallback(() => {
    if (!mapInstance || !leafletRef) return;

    const L = leafletRef;

    // Remove old ward boundaries (polygons)
    wardBoundariesLayerRef.current.forEach(polygon => polygon.remove());
    wardBoundariesLayerRef.current = [];

    if (isLoading) {
      // Show loading state (optional - can add loading indicator)
      return;
    }

    if (error) {
      // Show error message
      return;
    }

    if (!departmentMapData) {
      return;
    }

    // 🔥 NEW: Render markers for each ward (from ward coordinates)
    // Logic: departmentIds -> wardIds (from department_areas) -> ward coordinates (from ward_coordinates)
    // Each marker represents a ward with coordinates from ward_coordinates table

    console.log('🗺️ DepartmentMarkersLayer: Rendering department markers', {
      hasMapData: !!departmentMapData,
      areasCount: departmentMapData.areas?.length || 0,
      areasSample: departmentMapData.areas?.slice(0, 2).map(a => ({
        wardId: a.wardId,
        provinceId: a.provinceId,
        hasCenter: !!a.coordinates.center,
        center: a.coordinates.center
      })) || []
    });

    if (!departmentMapData.areas || departmentMapData.areas.length === 0) {
      console.warn('⚠️ DepartmentMarkersLayer: No areas in departmentMapData');
      return;
    }

    // Create department icon (SVG - person/group icon)
    const departmentIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005cb6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    `;

    const departmentIcon = L.divIcon({
      html: `
        <div style="
          background: white;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          border: 2px solid #005cb6;
        ">
          ${departmentIconSvg}
        </div>
      `,
      className: 'department-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    // 🔥 NEW: Group areas by wardId to avoid duplicate markers for the same ward
    // (Multiple departments might manage the same ward)
    const wardMarkersMap = new Map<string, {
      center: [number, number];
      wardId: string;
      provinceId: string;
      areas: Array<{
        provinceId: string;
        wardId: string;
        coordinates: {
          center: [number, number] | null;
          bounds: [[number, number], [number, number]] | null;
          area: number | null;
          officer: string | null;
        };
      }>;
    }>();

    departmentMapData.areas.forEach((area, index) => {
      if (area.coordinates.center) {
        const key = area.wardId || area.provinceId || '';
        if (key && !wardMarkersMap.has(key)) {
          wardMarkersMap.set(key, {
            center: area.coordinates.center,
            wardId: area.wardId,
            provinceId: area.provinceId,
            areas: [area]
          });
        } else if (key && wardMarkersMap.has(key)) {
          // Add area to existing ward marker
          wardMarkersMap.get(key)!.areas.push(area);
        }
      } else {
        if (index < 3) { // Log first 3 areas without center
          console.warn('⚠️ DepartmentMarkersLayer: Area missing center coordinates:', {
            wardId: area.wardId,
            provinceId: area.provinceId,
            coordinates: area.coordinates
          });
        }
      }
    });

    console.log('🗺️ DepartmentMarkersLayer: Ward markers map created:', {
      totalAreas: departmentMapData.areas.length,
      uniqueWards: wardMarkersMap.size,
      sampleWards: Array.from(wardMarkersMap.entries()).slice(0, 3).map(([key, data]) => ({
        key,
        center: data.center,
        areasCount: data.areas.length
      }))
    });

    // 🔥 NEW: Render one marker for each unique ward
    wardMarkersMap.forEach((wardData) => {
      const wardMarker = L.marker(wardData.center, { icon: departmentIcon });

      // Create tooltip content with ward information
      const areaCount = wardData.areas.length;
      const officers = wardData.areas
        .map(area => area.coordinates.officer)
        .filter((officer): officer is string => officer !== null && officer !== '');
      const uniqueOfficers = Array.from(new Set(officers));

      const tooltipContent = `
        <div style="
          font-family: 'Inter', sans-serif;
          max-width: 300px;
          padding: 8px;
        ">
          <div style="
            font-weight: 600;
            font-size: 14px;
            color: #005cb6;
            margin-bottom: 8px;
            border-bottom: 2px solid #005cb6;
            padding-bottom: 4px;
          ">
            Địa bàn phụ trách
          </div>
          <div style="font-size: 12px; margin-bottom: 6px;">
            <strong>Số khu vực:</strong> ${areaCount}
          </div>
          ${uniqueOfficers.length > 0 ? `
            <div style="font-size: 12px; margin-bottom: 6px;">
              <strong>Cán bộ phụ trách:</strong> ${uniqueOfficers.length} người
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 8px; max-height: 120px; overflow-y: auto;">
              <strong>Danh sách cán bộ:</strong><br/>
              ${uniqueOfficers.map(officer => `• ${officer}`).join('<br/>')}
            </div>
          ` : ''}
        </div>
      `;

      wardMarker.bindTooltip(tooltipContent, {
        permanent: false,
        direction: 'top',
        className: 'department-tooltip',
        offset: [0, -10],
      });

      // Add click handler to open department detail modal
      wardMarker.on('click', () => {
        if (typeof (window as any).openDepartmentDetail === 'function') {
          (window as any).openDepartmentDetail(departmentMapData.departmentId, {
            ...departmentMapData,
            wardId: wardData.wardId,
            areas: wardData.areas
          });
        }
      });

      wardMarker.addTo(mapInstance);
      markersRef.current.push(wardMarker);
    });

    console.log('✅ DepartmentMarkersLayer: Rendered', wardMarkersMap.size, 'ward markers from', departmentMapData.areas.length, 'areas');
  }, [
    mapInstance,
    leafletRef,
    departmentMapData,
    isLoading,
    error,
    markersRef,
    wardBoundariesLayerRef,
  ]);

  useEffect(() => {
    if (!mapInstance || !leafletRef) return;
    updateMarkers();
  }, [updateMarkers, mapInstance, leafletRef]);

  return null; // This component doesn't render anything directly
};

