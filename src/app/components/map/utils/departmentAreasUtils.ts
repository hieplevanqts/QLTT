import { DepartmentAreasResponse, Area, WardCoordinates } from '../../../../utils/api/departmentAreasApi';

/**
 * Transform department areas data to map-friendly format
 */
export interface DepartmentMapData {
  departmentId: string;
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
}

/**
 * Transform API response to map-friendly format
 */
export function transformDepartmentAreasToMapData(
  data: DepartmentAreasResponse | null,
  departmentId: string
): DepartmentMapData | null {
  if (!data) {
    return null;
  }
  
  // 🔥 FIX: Handle different data structures from API
  // API might return areas as array or as JSONB object
  let areasArray: Area[] = [];
  
  if (data.areas) {
    // Check if areas is an array
    if (Array.isArray(data.areas)) {
      areasArray = data.areas;
    } else if (typeof data.areas === 'object' && data.areas !== null) {
      // If areas is an object, try to convert it to array
      // This handles JSONB fields that might be returned as objects
      console.log('🔍 DepartmentAreasUtils: areas is object, structure:', {
        keys: Object.keys(data.areas),
        firstKeyValue: Object.keys(data.areas).length > 0 ? data.areas[Object.keys(data.areas)[0]] : null,
        isArrayLike: Array.isArray(Object.values(data.areas))
      });
      
      // 🔥 FIX: Always try to extract values from object first
      // JSONB arrays are often returned as objects with numeric/string keys
      const keys = Object.keys(data.areas);
      const values = Object.values(data.areas);
      
      console.log('🔍 DepartmentAreasUtils: Extracting from object:', {
        keysCount: keys.length,
        keys: keys,
        valuesCount: values.length,
        firstValue: values[0],
        firstValueType: typeof values[0],
        firstValueIsObject: values[0] && typeof values[0] === 'object',
        firstValueHasProvinceId: values[0] && typeof values[0] === 'object' && 'province_id' in values[0],
        firstValueHasWardId: values[0] && typeof values[0] === 'object' && 'ward_id' in values[0],
        rootHasProvinceId: 'province_id' in data.areas,
        rootHasWardId: 'ward_id' in data.areas
      });
      
      // Strategy 1: Check if values are area objects (most common case for JSONB arrays)
      // Filter out null/undefined values first
      const validValues = values.filter((v: any) => v !== null && v !== undefined);
      const valuesAreAreaObjects = validValues.length > 0 && 
        validValues.every((v: any) => typeof v === 'object' && (v.province_id || v.ward_id));
      
      if (valuesAreAreaObjects) {
        console.log('✅ DepartmentAreasUtils: All values are area objects, extracting', validValues.length, 'areas (filtered from', values.length, 'total)');
        areasArray = validValues as any[];
      } 
      // Strategy 2: Check if root object itself is a single area (has province_id/ward_id directly)
      else if (('province_id' in data.areas || 'ward_id' in data.areas) && keys.length <= 5) {
        // Single area object (keys might be: province_id, ward_id, wards_with_coordinates, etc.)
        console.log('✅ DepartmentAreasUtils: Root object is a single area');
        areasArray = [data.areas as any];
      }
      // Strategy 3: Try to find nested arrays or objects
      else {
        console.log('🔍 DepartmentAreasUtils: Searching for nested structures...');
        for (const value of values) {
          if (Array.isArray(value)) {
            console.log('✅ DepartmentAreasUtils: Found nested array with', value.length, 'items');
            areasArray = [...areasArray, ...value.filter((item: any) => 
              item && typeof item === 'object' && ('province_id' in item || 'ward_id' in item)
            )];
          } else if (value && typeof value === 'object' && ('province_id' in value || 'ward_id' in value)) {
            console.log('✅ DepartmentAreasUtils: Found nested area object');
            areasArray.push(value as any);
          }
        }
      }
    }
  }
  
  if (!Array.isArray(areasArray) || areasArray.length === 0) {
    console.warn('⚠️ DepartmentAreasUtils: No valid areas found in data:', data);
    return null;
  }
  
  console.log('🔍 DepartmentAreasUtils: Processing', areasArray.length, 'areas');
  console.log('🔍 DepartmentAreasUtils: Raw areasArray:', areasArray);
  
  const transformedAreas = areasArray
    .map((area: any, index: number) => {
      // Log each area for debugging
      console.log(`🔍 DepartmentAreasUtils: Processing Area ${index}:`, {
        province_id: area?.province_id,
        ward_id: area?.ward_id,
        has_wards_with_coordinates: !!area?.wards_with_coordinates,
        wards_with_coordinates_type: typeof area?.wards_with_coordinates,
        wards_with_coordinates_value: area?.wards_with_coordinates,
        center_lat: area?.wards_with_coordinates?.center_lat,
        center_lng: area?.wards_with_coordinates?.center_lng,
      });
      
      // 🔥 FIX: Check if wards_with_coordinates exists and is an object
      if (!area || !area.wards_with_coordinates || typeof area.wards_with_coordinates !== 'object') {
        console.log(`⚠️ DepartmentAreasUtils: Area ${index} skipped - no wards_with_coordinates`);
        return null;
      }
      
      const coords = area.wards_with_coordinates;
      
      // 🔥 FIX: Check if center_lat and center_lng are valid numbers
      const hasValidCoords = 
        coords.center_lat !== null && 
        coords.center_lat !== undefined && 
        typeof coords.center_lat === 'number' &&
        !isNaN(coords.center_lat) &&
        coords.center_lng !== null && 
        coords.center_lng !== undefined && 
        typeof coords.center_lng === 'number' &&
        !isNaN(coords.center_lng);
      
      const center: [number, number] | null = hasValidCoords
        ? [coords.center_lat, coords.center_lng]
        : null;
      
      if (!hasValidCoords) {
        console.log(`⚠️ DepartmentAreasUtils: Area ${index} has invalid coordinates:`, {
          center_lat: coords.center_lat,
          center_lng: coords.center_lng,
          center_lat_type: typeof coords.center_lat,
          center_lng_type: typeof coords.center_lng
        });
      } else {
        console.log(`✅ DepartmentAreasUtils: Area ${index} has valid coordinates:`, center);
      }
      
      return {
        provinceId: area.province_id || '',
        wardId: area.ward_id || '',
        coordinates: {
          center,
          bounds: coords?.bounds || null,
          area: coords?.area || null,
          officer: coords?.officer || null,
        },
      };
    })
    .filter((area): area is NonNullable<typeof area> => {
      const isValid = area !== null && area.coordinates.center !== null;
      if (!isValid && area !== null) {
        console.log(`⚠️ DepartmentAreasUtils: Filtered out area with null center:`, area);
      }
      return isValid;
    });
  
  console.log('✅ DepartmentAreasUtils: Transformed', transformedAreas.length, 'areas with valid coordinates');
  console.log('🔍 DepartmentAreasUtils: Transformed areas details:', transformedAreas.map(a => ({
    provinceId: a.provinceId,
    wardId: a.wardId,
    center: a.coordinates.center,
    hasCenter: a.coordinates.center !== null
  })));
  
  if (transformedAreas.length === 0) {
    console.warn('⚠️ DepartmentAreasUtils: No areas with valid coordinates found. Raw areas data:', areasArray);
    return null;
  }
  
  return {
    departmentId,
    areas: transformedAreas,
  };
}

/**
 * Calculate average center from multiple coordinates
 */
export function calculateAverageCenter(coordinates: [number, number][]): [number, number] | null {
  if (coordinates.length === 0) return null;
  
  const avgLat = coordinates.reduce((sum, [lat]) => sum + lat, 0) / coordinates.length;
  const avgLng = coordinates.reduce((sum, [, lng]) => sum + lng, 0) / coordinates.length;
  
  return [avgLat, avgLng];
}

/**
 * Get all valid centers from department map data
 */
export function getValidCenters(mapData: DepartmentMapData | null): [number, number][] {
  if (!mapData) return [];
  
  return mapData.areas
    .map(area => area.coordinates.center)
    .filter((center): center is [number, number] => center !== null);
}
