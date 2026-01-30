import { Restaurant } from '../../data/restaurantData';
import { SUPABASE_REST_URL, getHeaders } from './config';
import { restaurants as mockRestaurants } from '../../data/restaurantData';  // 🔥 Import correct mock data
import { mockMapPoints } from '../../data/mockMapPoints';  // 🔥 NEW: Import 500 mock points with coordinates
import { FEATURES } from '../../config/features';

// Toggle this to enable/disable Supabase backend
const USE_SUPABASE = FEATURES.USE_SUPABASE_BACKEND;

// Use consistent naming
const baseUrl = SUPABASE_REST_URL;
const endpoint = '/map_points';

/**
 * Cache for category ID to name mapping (to avoid repeated API calls)
 */
const categoryNameCache: {[id: string]: string} = {};

/**
 * Fetch category name by ID from Supabase
 */
async function fetchCategoryName(categoryId: string): Promise<string> {
  // Check cache first
  if (categoryNameCache[categoryId]) {
    return categoryNameCache[categoryId];
  }
  
  try {
    const response = await fetch(`${baseUrl}/categories?id=eq.${categoryId}&select=name`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      return categoryId; // Return ID as fallback
    }
    
    const data = await response.json();
    if (data && data.length > 0 && data[0].name) {
      categoryNameCache[categoryId] = data[0].name;
      return data[0].name;
    }
    
    return categoryId; // Return ID as fallback
  } catch (error) {
    console.error(`❌ Error fetching category name for ${categoryId}:`, error);
    return categoryId; // Return ID as fallback
  }
}

/**
 * Test if Supabase REST API is available
 */
async function isServerAvailable(): Promise<boolean> {
  // Skip server check if Supabase is disabled
  if (!USE_SUPABASE) {
    return false;
  }

  try {
    // Simple query to check if table exists
    const response = await fetch(`${baseUrl}${endpoint}?limit=1`, {
      method: 'HEAD',
      headers: getHeaders(),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Fetch all map points from Supabase REST API (with fallback to mock data)
 * @param statusIds - Optional array of point_status IDs to filter by
 * @param categoryIds - Optional array of category IDs to filter by
 */
export async function fetchMapPoints(statusIds?: string[], categoryIds?: string[]): Promise<Restaurant[]> {
  // Use mock data if Supabase is disabled
  if (!USE_SUPABASE) {
    return mockMapPoints;  // 🔥 Use new mock data with 500 points
  }

  try {
    // If statusIds OR categoryIds provided, use filtered endpoints
    if ((statusIds && statusIds.length > 0) || (categoryIds && categoryIds.length > 0)) {
      return await fetchMapPointsWithFilters(statusIds, categoryIds);
    }
    
    // Otherwise fetch all points (original behavior)
    
    // Log headers for debugging
    const headers = getHeaders();
    console.log({
      hasContentType: !!headers['Content-Type'],
      hasAuthorization: !!headers['Authorization'],
      hasApiKey: !!headers['apikey'],
      authorizationPreview: headers['Authorization']?.substring(0, 30) + '...',
      apiKeyPreview: headers['apikey']?.substring(0, 30) + '...'
    });
    
    // Check if server is available first
    const serverAvailable = await isServerAvailable();
    if (!serverAvailable) {
      return mockRestaurants;
    }
    
    // Fetch from Supabase using PostgREST syntax
    // No limit on records, order by creation time
    // 🔥 FILTER: Only fetch points with non-null location (to skip invalid coordinates)
    // 🔥 Include category_map_points (LEFT JOIN) to get category names
    // 🔥 Include map_point_status to get status code and name
    const url = `${baseUrl}${endpoint}?location=not.is.null&limit=10000&order=createdtime.desc&select=*,category_map_points(categories:category_id(name)),map_point_status(point_status(code,name))`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Failed to fetch map points:', response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      return mockRestaurants;
    }

    const data = await response.json();
    
    const transformed = await transformSupabaseDataAsync(data);
    
    return transformed;
  } catch (error) {
    console.error('❌ Error fetching map points:', error);
    return mockRestaurants;
  }
}

/**
 * Fetch single map point by ID from Supabase REST API (with fallback to mock data)
 */
export async function fetchMapPointById(id: string): Promise<Restaurant | null> {
  // Use mock data if Supabase is disabled
  if (!USE_SUPABASE) {
    return mockRestaurants.find(store => store.id === id) || null;
  }

  try {
    
    // Check if server is available first
    const serverAvailable = await isServerAvailable();
    if (!serverAvailable) {
      return mockRestaurants.find(store => store.id === id) || null;
    }
    
    // Fetch single point using PostgREST filter
    const response = await fetch(`${baseUrl}${endpoint}?_id=eq.${id}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      if (response.status === 404 || response.status === 406) {
        return mockRestaurants.find(store => store.id === id) || null;
      }
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Failed to fetch map point:', response.status, errorText);
      return mockRestaurants.find(store => store.id === id) || null;
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      return mockRestaurants.find(store => store.id === id) || null;
    }
    
    
    // Transform and return first result
    const transformed = transformSupabaseDataAsync(data);
    return transformed[0] || null;
  } catch (error) {
    console.error('❌ Error fetching map point:', error);
    return mockRestaurants.find(store => store.id === id) || null;
  }
}

/**
 * Fetch map points from Supabase
 */
export async function fetchMapPointsFromSupabase(): Promise<Restaurant[]> {
  try {
    console.log({
      hasContentType: !!getHeaders()['Content-Type'],
      hasAuthorization: !!getHeaders()['Authorization'],
      hasApiKey: !!getHeaders()['apikey'],
      authorizationPreview: getHeaders()['Authorization']?.substring(0, 30) + '...',
      apiKeyPreview: getHeaders()['apikey']?.substring(0, 30) + '...',
    });
    
    const url = `${baseUrl}${endpoint}?limit=10000&order=createdtime.desc`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Supabase API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url,
      });
      throw new Error(`Supabase API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    const transformed = await transformSupabaseDataAsync(data);
    
    return transformed;
  } catch (error) {
    console.error('❌ Error fetching map points:', error);
    return getMockMapPoints();
  }
}

/**
 * Fetch map points by status IDs using the map_point_status junction table
 * Uses PostgREST nested select: /map_point_status?point_status_id=in.(id1,id2)&select=map_points(*)
 * @param statusIds - Array of point_status IDs to filter by
 */
async function fetchMapPointsByStatusIds(statusIds: string[]): Promise<Restaurant[]> {
  try {
    
    // Log headers for debugging
    const headers = getHeaders();
    console.log({
      hasContentType: !!headers['Content-Type'],
      hasAuthorization: !!headers['Authorization'],
      hasApiKey: !!headers['apikey'],
      authorizationPreview: headers['Authorization']?.substring(0, 30) + '...',
      apiKeyPreview: headers['apikey']?.substring(0, 30) + '...'
    });
    
    // Build filter for multiple status IDs
    // Format: point_status_id=in.(id1,id2,id3)
    const statusFilter = statusIds.length === 1 
      ? `point_status_id=eq.${statusIds[0]}`
      : `point_status_id=in.(${statusIds.join(',')})`;
    
    // 🔥 Include category_map_points in nested map_points select to get category names
    url = `${baseUrl}/map_point_status?${statusFilter}&select=map_points(*,category_map_points(categories:category_id(name))),point_status(code,name)`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Failed to fetch map points via junction table:', response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      // Fallback: fetch all points without filter
      return await fetchAllMapPointsDirect();
    }

    const data = await response.json();
    
    // Transform nested response: data is [{map_points: {...}, point_status: {code: 'PASS', name: '...'}}, ...]
    // Need to extract the nested map_points objects AND attach status code
    const mapPoints = data
      .map((record: any) => {
        if (!record.map_points) return null;
        
        // 🔥 CRITICAL: Attach status code from point_status to map_points object
        return {
          ...record.map_points,
          _statusCode: record.point_status?.code  // Preserve status code for mapping
        };
      })
      .filter((point: any) => point !== null && point !== undefined);
    
    console.log({
      id: mapPoints[0]?._id, 
      name: mapPoints[0]?.title,
      _statusCode: mapPoints[0]?._statusCode,
      originalStatus: mapPoints[0]?.status
    });
    
    if (mapPoints.length === 0) {
      return [];
    }
    
    // Transform to Restaurant format
    return transformSupabaseDataAsync(mapPoints);
  } catch (error) {
    console.error('❌ Error fetching map points by status:', error);
    // Fallback: fetch all points without filter
    return await fetchAllMapPointsDirect();
  }
}

/**
 * Fetch map points with filters (status IDs and/or category IDs)
 * Uses PostgREST nested select with inner join
 * @param statusIds - Optional array of point_status IDs to filter by
 * @param categoryIds - Optional array of category IDs to filter by
 */
async function fetchMapPointsWithFilters(statusIds?: string[], categoryIds?: string[]): Promise<Restaurant[]> {
  try {
    
    // Log headers for debugging
    const headers = getHeaders();
    console.log({
      hasContentType: !!headers['Content-Type'],
      hasAuthorization: !!headers['Authorization'],
      hasApiKey: !!headers['apikey'],
      authorizationPreview: headers['Authorization']?.substring(0, 30) + '...',
      apiKeyPreview: headers['apikey']?.substring(0, 30) + '...'
    });
    
    // Build query based on what filters are provided
    let url = '';
    let select = '';
    
    // If ONLY category filter (no status filter)
    if (categoryIds && categoryIds.length > 0 && (!statusIds || statusIds.length === 0)) {
      // Query from map_points with inner join to category_map_points
      // 🔥 IMPORTANT: Also need to include map_point_status to get status codes!
      // 🔥 Include nested categories select to get category names
      const categoryFilter = categoryIds.length === 1
        ? `category_map_points.category_id=eq.${categoryIds[0]}`
        : `category_map_points.category_id=in.(${categoryIds.join(',')})`;
      
      select = '*,category_map_points!inner(categories:category_id(name)),map_point_status!inner(point_status(*))';
      url = `${baseUrl}/map_points?${categoryFilter}&select=${select}&limit=10000`;
      
    }
    // If ONLY status filter (no category filter)
    else if (statusIds && statusIds.length > 0 && (!categoryIds || categoryIds.length === 0)) {
      // Use existing status filter logic
      const statusFilter = statusIds.length === 1 
        ? `point_status_id=eq.${statusIds[0]}`
        : `point_status_id=in.(${statusIds.join(',')})`;
      
      // 🔥 Include category_map_points in nested map_points select to get category names
      url = `${baseUrl}/map_point_status?${statusFilter}&select=map_points(*,category_map_points(categories:category_id(name))),point_status(code,name)`;
      
    }
    // If BOTH status AND category filters
    else if (statusIds && statusIds.length > 0 && categoryIds && categoryIds.length > 0) {
      // Query from map_points with BOTH joins
      // Format: /map_points?category_map_points.category_id=in.(cat1,cat2)&map_point_status.point_status_id=in.(status1,status2)&select=*,category_map_points!inner(*),map_point_status!inner(*)
      const categoryFilter = categoryIds.length === 1
        ? `category_map_points.category_id=eq.${categoryIds[0]}`
        : `category_map_points.category_id=in.(${categoryIds.join(',')})`;
      
      const statusFilter = statusIds.length === 1
        ? `map_point_status.point_status_id=eq.${statusIds[0]}`
        : `map_point_status.point_status_id=in.(${statusIds.join(',')})`;
      
      select = '*,category_map_points!inner(*),map_point_status!inner(point_status(*))';
      url = `${baseUrl}/map_points?${categoryFilter}&${statusFilter}&select=${select}&limit=10000`;
      
    }
    
    
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('❌ Failed to fetch map points with filters:', response.status, response.statusText);
      console.error('❌ Error details:', errorText);
      // Fallback: fetch all points without filter
      return await fetchAllMapPointsDirect();
    }

    const data = await response.json();
    
    // Check if data is from map_point_status junction (has nested map_points)
    if (data.length > 0 && data[0].map_points) {
      // Transform nested response from status query
      const mapPoints = data
        .map((record: any) => {
          if (!record.map_points) return null;
          
          // Attach status code from point_status to map_points object
          return {
            ...record.map_points,
            _statusCode: record.point_status?.code  // Preserve status code for mapping
          };
        })
        .filter((point: any) => point !== null && point !== undefined);
      
      
      if (mapPoints.length === 0) {
        return [];
      }
      
      // Transform to Restaurant format
      return transformSupabaseDataAsync(mapPoints);
    }
    
    // 🔥 NEW: Check if data has nested map_point_status array (when filtering by category)
    // Response structure: map_points with map_point_status[0].point_status.code
    if (data.length > 0 && Array.isArray(data[0].map_point_status) && data[0].map_point_status.length > 0) {
      
      // Extract status code from nested structure and attach to point
      const mapPoints = data.map((point: any) => {
        const statusCode = point.map_point_status?.[0]?.point_status?.code;
        
        return {
          ...point,
          _statusCode: statusCode  // Attach status code for transform
        };
      });
      
      // Transform to Restaurant format
      return transformSupabaseDataAsync(mapPoints);
    }
    
    // Otherwise, data is direct map_points array (no nested structures)
    if (data.length === 0) {
      return [];
    }
    
    // Transform to Restaurant format
    return transformSupabaseDataAsync(data);
  } catch (error) {
    console.error('❌ Error fetching map points with filters:', error);
    // Fallback: fetch all points without filter
    return await fetchAllMapPointsDirect();
  }
}

/**
 * Fetch all map points directly (no filtering) - used as fallback
 */
async function fetchAllMapPointsDirect(): Promise<Restaurant[]> {
  try {
    const url = `${baseUrl}${endpoint}?limit=10000&order=createdtime.desc`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      return mockRestaurants;
    }

    const data = await response.json();
    return transformSupabaseDataAsync(data);
  } catch (error) {
    console.error('❌ Error in fallback fetch:', error);
    return mockRestaurants;
  }
}

/**
 * Transform Supabase map_points data to Restaurant format
 */
async function transformSupabaseDataAsync(supabaseData: any[]): Promise<Restaurant[]> {
  
  // 🔥 Check if ALL points have null coordinates
  const pointsWithNullCoords = supabaseData.filter(p => 
    (!p.location || p.location === null) && 
    (!p.geo_location || p.geo_location === null) &&
    (!p.latitude || p.latitude === null) &&
    (!p.longitude || p.longitude === null)
  ).length;
  
  if (pointsWithNullCoords === supabaseData.length) {
    console.error('❌ CRITICAL: ALL map points have NULL coordinates in database!');
    console.error('📋 Database fields checked: location, geo_location, latitude, longitude');
    console.error('💡 SOLUTION: Update database records with valid coordinates');
    console.error('💡 SQL Example: UPDATE map_points SET geo_location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)');
  } else if (pointsWithNullCoords > 0) {
  }
  
  const transformed = await Promise.all(supabaseData.map(async (point: any, index: number) => {
    try {
      // 🔥 EARLY VALIDATION: Skip points with invalid coordinates FIRST
      // Check multiple possible coordinate sources
      const hasValidGeoLocation = point.geo_location?.coordinates?.[0] && point.geo_location?.coordinates?.[1];
      const hasValidLocation = (Array.isArray(point.location) && point.location.length === 2) || (point.location?.latitude && point.location?.longitude);
      const hasValidTopLevel = point.latitude && point.longitude;
      
      if (!hasValidGeoLocation && !hasValidLocation && !hasValidTopLevel) {
        // Silently skip - don't log warning to avoid console spam
        return null;
      }
      
      // Log first point's location structure
      if (index === 0) {
      }
      
      // Try multiple ways to extract lat/lng
      let lat = 0;
      let lng = 0;
      
      // 🔥 PRIORITY 1: location field as ARRAY [longitude, latitude] (GeoJSON format)
      if (Array.isArray(point.location) && point.location.length === 2) {
        const [longitude, latitude] = point.location;
        if (typeof longitude === 'number' && typeof latitude === 'number') {
          lng = longitude;
          lat = latitude;
        }
      }
      
      // 🔥 PRIORITY 2: geo_location field (PostGIS geography/geometry type)
      // PostGIS returns: { type: "Point", coordinates: [lng, lat] }
      if (lat === 0 && lng === 0 && point.geo_location && typeof point.geo_location === 'object') {
        // GeoJSON Point format
        if (point.geo_location.type === 'Point' && Array.isArray(point.geo_location.coordinates)) {
          lng = typeof point.geo_location.coordinates[0] === 'number' ? point.geo_location.coordinates[0] : parseFloat(point.geo_location.coordinates[0]);
          lat = typeof point.geo_location.coordinates[1] === 'number' ? point.geo_location.coordinates[1] : parseFloat(point.geo_location.coordinates[1]);
        }
        // Alternative: Direct lat/lng properties
        else if (point.geo_location.latitude && point.geo_location.longitude) {
          lat = typeof point.geo_location.latitude === 'number' ? point.geo_location.latitude : parseFloat(point.geo_location.latitude);
          lng = typeof point.geo_location.longitude === 'number' ? point.geo_location.longitude : parseFloat(point.geo_location.longitude);
        }
      }
      
      // 🔥 PRIORITY 3: location.latitude/longitude (nested object)
      if (lat === 0 && lng === 0 && point.location && typeof point.location === 'object' && !Array.isArray(point.location)) {
        if (typeof point.location.latitude === 'number') {
          lat = point.location.latitude;
        }
        if (typeof point.location.longitude === 'number') {
          lng = point.location.longitude;
        }
      }
      
      // Method 2: Top-level lat/lng
      if (lat === 0 && typeof point.latitude === 'number') {
        lat = point.latitude;
      }
      if (lng === 0 && typeof point.longitude === 'number') {
        lng = point.longitude;
      }
      
      // Method 3: location.lat/lng (alternative naming)
      if (lat === 0 && point.location?.lat) {
        lat = typeof point.location.lat === 'number' ? point.location.lat : parseFloat(point.location.lat);
      }
      if (lng === 0 && point.location?.lng) {
        lng = typeof point.location.lng === 'number' ? point.location.lng : parseFloat(point.location.lng);
      }
      
      // Method 4: location.lon (alternative naming)
      if (lng === 0 && point.location?.lon) {
        lng = typeof point.location.lon === 'number' ? point.location.lon : parseFloat(point.location.lon);
      }
      
      // Method 5: GeoJSON coordinates [lng, lat]
      if (lat === 0 && Array.isArray(point.location?.coordinates) && point.location.coordinates.length === 2) {
        lng = typeof point.location.coordinates[0] === 'number' ? point.location.coordinates[0] : parseFloat(point.location.coordinates[0]);
        lat = typeof point.location.coordinates[1] === 'number' ? point.location.coordinates[1] : parseFloat(point.location.coordinates[1]);
      }
      
      // Log first point's extracted coordinates
      if (index === 0) {
      }
      
      // Extract business type from multiple possible sources
      // 🔥 PRIORITY 1: category_map_points[0].categories.name from nested select !inner join
      // 🔥 PRIORITY 2: categories.name from nested select (when query includes categories:mappointtypeid(name))
      // 🔥 PRIORITY 3: mappointtypename field (legacy)
      // 🔥 FALLBACK: mappointtypeid or default
      const businessType = 
        point.category_map_points?.[0]?.categories?.name ||  // From !inner join: category_map_points!inner(categories:category_id(name))
        point.categories?.name ||                            // From nested select: categories:mappointtypeid(name)
        point.mappointtypename ||                            // Legacy field
        point.properties?.businessType ||                    // From properties JSON
        point.mappointtypeid ||                              // Fallback to ID
        'Nhà hàng';                                          // Ultimate fallback
      
      // 🔥 Extract category ID for filtering
      const categoryId = 
        point.category_map_points?.[0]?.category_id ||      // From !inner join: category_map_points!inner(categories:category_id(name))
        point.mappointtypeid ||                              // Legacy field
        undefined;
      
      // 🔥 Extract status name from multiple possible sources
      // PRIORITY 1: map_point_status[0].point_status.name from nested select
      // PRIORITY 2: point_status.name (when queried from map_point_status junction)
      // FALLBACK: status field or undefined
      const statusName = 
        point.map_point_status?.[0]?.point_status?.name ||  // From query: map_point_status(point_status(code,name))
        point.point_status?.name ||                          // From junction table query
        point.status ||                                      // Legacy status field
        undefined;
      
      if (index === 0) {
        console.log({
          categoryMapPointsName: point.category_map_points?.[0]?.categories?.name,
          categoriesName: point.categories?.name,
          mappointtypename: point.mappointtypename,
          mappointtypeid: point.mappointtypeid,
          categoryMapPoints: point.category_map_points,
          finalBusinessType: businessType,
          mapPointStatusName: point.map_point_status?.[0]?.point_status?.name,
          pointStatusName: point.point_status?.name,
          legacyStatus: point.status,
          finalStatusName: statusName
        });
      }
      
      return {
        // Core identity
        id: point._id || point.id || `point-${Math.random()}`,
        name: point.title || 'Untitled',
        address: point.address || '',
        lat,
        lng,
        
        // Business type (CRITICAL for icon rendering!)
        type: businessType,
        businessType: businessType,
        
        //  🔥 Category ID for filtering
        categoryId: categoryId,
        
        // Category/Status (for filtering and color)
        category: (() => {
          // Map từ status number sang category string
          // 🔥 IMPORTANT: Lấy status từ map_point_status table
          const statusId = point.map_point_status?.point_status_id;
          
          // Map status_id từ database sang category code
          // Based on point_status table: 1=certified, 2=hotspot, 3=scheduled, 4=inspected
          let category: 'certified' | 'hotspot' | 'scheduled' | 'inspected';
          
          switch(statusId) {
            case 1:
              category = 'certified';
              break;
            case 2:
              category = 'hotspot';
              break;
            case 3:
              category = 'scheduled';
              break;
            case 4:
              category = 'inspected';
              break;
            default:
              category = 'certified'; // Default fallback
          }
          
          if (index < 3) {
          }
          
          return category;
        })() as 'certified' | 'hotspot' | 'scheduled' | 'inspected',
        
        // Location hierarchy
        province: point.properties?.province || 'Hà Nội',
        district: point.properties?.district || '',
        ward: point.properties?.ward || '',
        
        // Contact info (optional in interface)
        hotline: point.hotline || undefined,
        
        // Media (optional in interface)
        logo: point.logo || undefined,
        images: point.images || undefined,
        
        // Review data (optional in interface)
        reviewScore: typeof point.reviewscore === 'number' ? point.reviewscore : undefined,
        reviewCount: typeof point.reviewcount === 'number' ? point.reviewcount : undefined,
        
        // Hours (optional in interface)
        openingHours: point.openinghours || undefined,
        
        // Status (optional in interface)
        status: point.status || undefined,
        
        // 🔥 Status name from database (for display in popup)
        statusName: statusName || undefined,
        
        // Citizen reports (optional in interface)
        citizenReports: Array.isArray(point.properties?.citizenReports) ? point.properties.citizenReports : undefined,
        
        // Population data (optional in interface)
        nearbyPopulation: typeof point.properties?.nearbyPopulation === 'number' ? point.properties.nearbyPopulation : undefined,
      };
    } catch (error) {
      console.error('❌ Error transforming point:', point, error);
      // Return a minimal valid object if transformation fails
      return {
        id: point._id || point.id || `error-${Math.random()}`,
        name: 'Error loading data',
        address: '',
        lat: 0,
        lng: 0,
        type: 'Nhà hàng',
        businessType: 'Nhà hàng',
        category: 'inspected' as const,
        province: 'Hà Nội',
        district: '',
        ward: '',
      };
    }
  }));
  
  // Filter out null points (invalid coordinates)
  const validPoints = transformed.filter(p => p !== null) as Restaurant[];
  
  // Count valid points
  
  // 🔥 DEBUG: Check status/category distribution
  const categoryDistribution: { [key: string]: number } = {};
  
  validPoints.forEach(p => {
    categoryDistribution[p.category] = (categoryDistribution[p.category] || 0) + 1;
  });
  
  
  if (validPoints.length > 0) {
  }
  
  // 🔥 RETURN ONLY VALID POINTS (filter out invalid coordinates)
  return validPoints;
}

/**
 * Map Supabase status to app category format
 * CRITICAL: Must return ONLY values that exist in CategoryFilter!
 * CategoryFilter keys: certified, hotspot, scheduled, inspected
 */
let statusMappingCallCount = 0; // Track calls for logging
function mapSupabaseStatus(status?: string | number | object): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  const shouldLog = statusMappingCallCount < 3; // Only log first 3 calls
  statusMappingCallCount++;
  
  // Handle null, undefined, or non-string values
  if (!status) {
    return 'inspected';  // ← Changed from 'pending' to 'inspected'
  }
  
  // Convert to string if it's not already
  const statusStr = typeof status === 'string' ? status : String(status);
  const statusLower = statusStr.toLowerCase();
  
  
  // 🔥 NEW: Map numeric status codes (1, 2, 3, 4)
  if (statusStr === '1') {
    return 'certified';
  }
  if (statusStr === '2') {
    return 'hotspot';
  }
  if (statusStr === '3') {
    return 'scheduled';
  }
  if (statusStr === '4') {
    return 'inspected';
  }
  
  // Map text-based status codes
  if (statusLower.includes('certif') || statusLower === 'pass') {
    return 'certified';
  }
  if (statusLower.includes('hotspot') || statusLower.includes('alert') || statusLower === 'danger') {
    return 'hotspot';
  }
  if (statusLower.includes('schedul') || statusLower.includes('plan')) {
    return 'scheduled';
  }
  if (statusLower.includes('inspect') || statusLower === 'checked') {
    return 'inspected';
  }
  
  // Map other statuses to appropriate categories
  if (statusLower.includes('violat') || statusLower.includes('warning') || statusLower.includes('danger')) {
    return 'hotspot';  // Violations → hotspot
  }
  if (statusLower.includes('pend') || statusLower.includes('wait') || statusLower.includes('queue')) {
    return 'scheduled';  // Pending → scheduled
  }
  if (statusLower.includes('active') || statusLower.includes('open')) {
    return 'inspected';  // Active → inspected
  }
  
  // Safe default that exists in filters
  return 'inspected';
}

/**
 * Get mock map points
 */
function getMockMapPoints(): Restaurant[] {
  return mockMapPoints;
}
