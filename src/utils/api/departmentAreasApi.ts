/**
 * Department Areas API - Fetch department areas with coordinates for map display
 */

import axios from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';
import { supabase } from '@/api/supabaseClient';

/**
 * User interface for department users
 */
export interface DepartmentUser {
  _id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  role?: string;
  department_id?: string;
  [key: string]: any; // Allow additional fields
}

export interface WardCoordinates {
  center_lat: number | null;
  center_lng: number | null;
  bounds: [[number, number], [number, number]] | null;
  area: number | null;
  officer: string | null;
}

export interface Area {
  province_id: string;
  ward_id: string;
  wards_with_coordinates: WardCoordinates | null;
}

export interface DepartmentArea {
  areas: Area[];
}

export interface DepartmentAreasResponse {
  areas: Area[];
}

/**
 * Fetch department IDs by divisionId (including divisionId itself and all child departments)
 * @param divisionId - Division ID
 * @returns Array of department IDs
 */
export async function fetchDepartmentIdsByDivision(divisionId: string): Promise<string[]> {
  try {
    if (!divisionId || typeof divisionId !== 'string' || divisionId.trim() === '') {
      return [];
    }

    // Query 1: Get divisionId itself
    const url1 = `${SUPABASE_REST_URL}/departments?select=_id&_id=eq.${divisionId}&deleted_at=is.null`;
    
    // Query 2: Get all departments with parent_id = divisionId
    const url2 = `${SUPABASE_REST_URL}/departments?select=_id&parent_id=eq.${divisionId}&deleted_at=is.null`;
    
    const [response1, response2] = await Promise.all([
      axios.get(url1, { headers: getHeaders() }),
      axios.get(url2, { headers: getHeaders() })
    ]);
    
    const data1 = response1.data || [];
    const data2 = response2.data || [];
    
    // Merge and extract unique IDs
    const allIds = [
      ...data1.map((d: any) => d._id),
      ...data2.map((d: any) => d._id)
    ];
    
    const uniqueIds = Array.from(new Set(allIds));
    
    return uniqueIds;
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to fetch department IDs:', error);
    throw error;
  }
}

/**
 * Fetch child department IDs by parent department ID (including parent itself and all children)
 * @param parentDepartmentId - Parent department ID
 * @returns Array of department IDs (parent + all children)
 */
export async function fetchChildDepartmentIds(parentDepartmentId: string): Promise<string[]> {
  try {
    if (!parentDepartmentId || typeof parentDepartmentId !== 'string' || parentDepartmentId.trim() === '') {
      return [];
    }

    // Query 1: Get parent department itself
    const url1 = `${SUPABASE_REST_URL}/departments?select=_id&_id=eq.${parentDepartmentId}&deleted_at=is.null`;
    
    // Query 2: Get all departments with parent_id = parentDepartmentId
    const url2 = `${SUPABASE_REST_URL}/departments?select=_id&parent_id=eq.${parentDepartmentId}&deleted_at=is.null`;
    
    const [response1, response2] = await Promise.all([
      axios.get(url1, { headers: getHeaders() }),
      axios.get(url2, { headers: getHeaders() })
    ]);
    
    const data1 = response1.data || [];
    const data2 = response2.data || [];
    
    // Merge and extract unique IDs
    const allIds = [
      ...data1.map((d: any) => d._id),
      ...data2.map((d: any) => d._id)
    ];
    
    const uniqueIds = Array.from(new Set(allIds));
    
    console.log('📋 DepartmentAreasAPI: Fetched child departments:', {
      parentId: parentDepartmentId,
      parentCount: data1.length,
      childrenCount: data2.length,
      totalCount: uniqueIds.length
    });
    
    return uniqueIds;
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to fetch child department IDs:', error);
    throw error;
  }
}

/**
 * Fetch all department IDs (when no divisionId is available)
 * @returns Array of all department IDs
 */
export async function fetchAllDepartmentIds(): Promise<string[]> {
  try {
    const url = `${SUPABASE_REST_URL}/departments?select=_id&deleted_at=is.null`;
    
    const response = await axios.get(url, { headers: getHeaders() });
    
    const data = response.data || [];
    
    // Extract unique IDs
    const allIds: string[] = data
      .map((d: any) => d._id)
      .filter((id: any): id is string => id && typeof id === 'string' && id.trim() !== '');
    
    const uniqueIds: string[] = Array.from(new Set(allIds));
    
    console.log('📋 DepartmentAreasAPI: Fetched all department IDs:', uniqueIds.length);
    
    return uniqueIds;
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to fetch all department IDs:', error);
    throw error;
  }
}

/**
 * Fetch departments with coordinates (latitude, longitude) by department ID(s)
 * @param departmentIds - Single department ID or array of department IDs
 * @returns Array of departments with coordinates
 */
export async function fetchDepartmentsWithCoordinates(
  departmentId: string | string[]
): Promise<Array<{ id: string; name: string; latitude: number | null; longitude: number | null }>> {
  try {
    const departmentIds = Array.isArray(departmentId) ? departmentId : [departmentId];
    
    if (departmentIds.length === 0) {
      return [];
    }
    
    const validIds = departmentIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
    if (validIds.length === 0) {
      return [];
    }

    const idsParam = validIds.join(',');
    const url = `${SUPABASE_REST_URL}/departments?select=_id,name,latitude,longitude&_id=in.(${idsParam})&deleted_at=is.null`;
    
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    
    const data = response.data || [];
    
    return data.map((dept: any) => ({
      id: dept._id,
      name: dept.name || '',
      latitude: dept.latitude !== null && dept.latitude !== undefined ? Number(dept.latitude) : null,
      longitude: dept.longitude !== null && dept.longitude !== undefined ? Number(dept.longitude) : null,
    })).filter((dept: any) => dept.latitude !== null && dept.longitude !== null);
  } catch (error: any) {
    console.error('DepartmentAreasAPI: Failed to fetch departments with coordinates:', error);
    throw error;
  }
}

/**
 * Fetch ward coordinates by department ID using RPC function
 * @param departmentId - Department ID
 * @returns Array of ward coordinates with department info
 */
export async function getWardCoordinatesByDepartment(departmentId: string): Promise<Array<{
  ward_id: string;
  province_id: string;
  center_lat: number;
  center_lng: number;
  bounds?: [[number, number], [number, number]] | null;
  area?: number | null;
  officer?: string | null;
}>> {
  try {
    if (!departmentId || typeof departmentId !== 'string' || departmentId.trim() === '') {
      console.warn('⚠️ DepartmentAreasAPI: Invalid departmentId for RPC call');
      return [];
    }

    // 🔥 FIX: Validate UUID format and resolve department name to UUID if needed
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };
    
    let actualDepartmentId = departmentId;
    
    // Check if departmentId is a valid UUID
    if (!isValidUUID(departmentId)) {
      console.log(`⚠️ DepartmentAreasAPI: departmentId is not a UUID, searching by name:`, departmentId);
      
      // Try to find department by name
      const { data: deptByName, error: searchError } = await supabase
        .from('departments')
        .select('_id')
        .eq('name', departmentId)
        .is('deleted_at', null)
        .single();
      
      if (searchError || !deptByName) {
        console.error(`❌ DepartmentAreasAPI: Department not found by name "${departmentId}":`, searchError);
        return []; // Return empty array if department not found
      }
      
      actualDepartmentId = deptByName._id;
      console.log(`✅ DepartmentAreasAPI: Found department UUID:`, actualDepartmentId);
    }

    console.log('🔄 DepartmentAreasAPI: Calling RPC get_ward_coordinates_by_department via axios');
    console.log('📋 DepartmentAreasAPI: Parameters:', { 
      originalDepartmentId: departmentId, 
      actualDepartmentId,
      type: typeof actualDepartmentId 
    });
    
    // Call RPC function via REST API (PostgREST)
    // Endpoint: POST /rest/v1/rpc/{function_name}
    const rpcUrl = `${SUPABASE_REST_URL}/rpc/get_ward_coordinates_by_department`;
    
    // Try with department_id (snake_case) first
    const requestBody = { department_id: actualDepartmentId };
    
    try {
      console.log('📤 DepartmentAreasAPI: Sending POST request to:', rpcUrl);
      console.log('📤 DepartmentAreasAPI: Request body:', requestBody);
      
      const response = await axios.post(rpcUrl, requestBody, {
        headers: getHeaders()
      });

      const data = response.data;

      console.log('📦 DepartmentAreasAPI: RPC response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!data,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataLength: Array.isArray(data) ? data.length : 'N/A',
        dataSample: Array.isArray(data) && data.length > 0 ? data[0] : data
      });

      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ DepartmentAreasAPI: RPC returned invalid data:', data);
        // Try with departmentId (camelCase) parameter name
        console.log('🔄 DepartmentAreasAPI: Retrying with departmentId parameter name...');
        const retryResponse = await axios.post(rpcUrl, { departmentId: actualDepartmentId }, {
          headers: getHeaders()
        });
        
        const retryData = retryResponse.data;
        
        if (!retryData || !Array.isArray(retryData)) {
          console.warn('⚠️ DepartmentAreasAPI: Retry returned invalid data:', retryData);
          return [];
        }
        
        console.log('✅ DepartmentAreasAPI: Retry successful, returned', retryData.length, 'ward coordinates');
        return retryData.filter((item: any) => {
          return item.ward_id && 
                 item.center_lat !== null && 
                 item.center_lng !== null &&
                 typeof item.center_lat === 'number' &&
                 typeof item.center_lng === 'number' &&
                 !isNaN(item.center_lat) &&
                 !isNaN(item.center_lng);
        });
      }

      console.log('✅ DepartmentAreasAPI: RPC returned', data.length, 'ward coordinates');
      console.log('📊 DepartmentAreasAPI: First item sample:', data[0]);
      
      // Filter and validate coordinates
      const filtered = data.filter((item: any) => {
        return item.ward_id && 
               item.center_lat !== null && 
               item.center_lng !== null &&
               typeof item.center_lat === 'number' &&
               typeof item.center_lng === 'number' &&
               !isNaN(item.center_lat) &&
               !isNaN(item.center_lng);
      });
      
      console.log('✅ DepartmentAreasAPI: Filtered to', filtered.length, 'valid ward coordinates');
      
      return filtered;
    } catch (error: any) {
      console.error('❌ DepartmentAreasAPI: RPC call failed:', error);
      
      if (error.response) {
        console.error('❌ DepartmentAreasAPI: Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // 🔥 FIX: Handle 403 session_not_found error gracefully
        if (error.response.status === 403) {
          const errorData = error.response.data;
          if (errorData?.error_code === 'session_not_found') {
            console.warn('⚠️ DepartmentAreasAPI: Session not found (403), returning empty array');
            return []; // Return empty array instead of throwing
          }
        }
        
        // Try with departmentId (camelCase) parameter name if first attempt failed
        if (error.response.status === 400 || error.response.status === 404) {
          console.log('🔄 DepartmentAreasAPI: Retrying with departmentId parameter name...');
          try {
            const retryResponse = await axios.post(rpcUrl, { departmentId: actualDepartmentId }, {
              headers: getHeaders()
            });
            
            const retryData = retryResponse.data;
            
            if (!retryData || !Array.isArray(retryData)) {
              console.warn('⚠️ DepartmentAreasAPI: Retry returned invalid data:', retryData);
              return []; // Return empty array instead of throwing
            }
            
            console.log('✅ DepartmentAreasAPI: Retry successful, returned', retryData.length, 'ward coordinates');
            return retryData.filter((item: any) => {
              return item.ward_id && 
                     item.center_lat !== null && 
                     item.center_lng !== null &&
                     typeof item.center_lat === 'number' &&
                     typeof item.center_lng === 'number' &&
                     !isNaN(item.center_lat) &&
                     !isNaN(item.center_lng);
            });
          } catch (retryError) {
            console.error('❌ DepartmentAreasAPI: Retry also failed:', retryError);
            return []; // Return empty array instead of throwing
          }
        }
      }
      
      // 🔥 FIX: Return empty array instead of throwing to prevent app crash
      console.warn('⚠️ DepartmentAreasAPI: Returning empty array due to error');
      return [];
    }
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to call RPC get_ward_coordinates_by_department:', error);
    throw error;
  }
}

/**
 * Department interface for departments by ward
 */
export interface DepartmentByWard {
  _id?: string;
  department_id?: string; // API may return department_id instead of _id
  department_name?: string; // API returns department_name
  name?: string; // Fallback
  code?: string;
  department_code?: string; // API may return department_code
  parent_id?: string;
  type?: string;
  [key: string]: any; // Allow additional fields
}

/**
 * Fetch departments by ward ID using RPC function
 * @param wardId - Ward ID
 * @returns Array of departments managing the ward
 */
export async function getDepartmentsByWard(wardId: string): Promise<DepartmentByWard[]> {
  try {
    if (!wardId || typeof wardId !== 'string' || wardId.trim() === '') {
      console.warn('DepartmentAreasAPI: Invalid wardId for RPC call');
      return [];
    }

    console.log('DepartmentAreasAPI: Calling RPC get_departments_by_ward via axios');
    console.log('DepartmentAreasAPI: Parameters:', { wardId, type: typeof wardId });
    
    // Call RPC function via REST API (PostgREST)
    const rpcUrl = `${SUPABASE_REST_URL}/rpc/get_departments_by_ward`;
    
    // Try with ward_id (snake_case) first
    const requestBody = { ward_id: wardId };
    
    try {
      console.log('📤 DepartmentAreasAPI: Sending POST request to:', rpcUrl);
      console.log('📤 DepartmentAreasAPI: Request body:', requestBody);
      
      const response = await axios.post(rpcUrl, requestBody, {
        headers: getHeaders()
      });

      const data = response.data;

      console.log('DepartmentAreasAPI: RPC response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!data,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataLength: Array.isArray(data) ? data.length : 'N/A',
        dataSample: Array.isArray(data) && data.length > 0 ? data[0] : data
      });

      if (!data || !Array.isArray(data)) {
        console.warn('DepartmentAreasAPI: RPC returned invalid data:', data);
        // Try with wardId (camelCase) parameter name
        console.log('DepartmentAreasAPI: Retrying with wardId parameter name...');
        const retryResponse = await axios.post(rpcUrl, { wardId: wardId }, {
          headers: getHeaders()
        });
        
        const retryData = retryResponse.data;
        
        if (!retryData || !Array.isArray(retryData)) {
          console.warn('DepartmentAreasAPI: Retry returned invalid data:', retryData);
          return [];
        }
        
        console.log('DepartmentAreasAPI: Retry successful, returned', retryData.length, 'departments');
        return retryData;
      }

      console.log('DepartmentAreasAPI: RPC returned', data.length, 'departments');
      console.log('DepartmentAreasAPI: First department sample:', data[0]);
      
      return data;
    } catch (error: any) {
      console.error('DepartmentAreasAPI: RPC call failed:', error);
      
      if (error.response) {
        console.error('DepartmentAreasAPI: Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // 🔥 FIX: Handle 403 session_not_found error gracefully
        if (error.response.status === 403) {
          const errorData = error.response.data;
          if (errorData?.error_code === 'session_not_found') {
            console.warn('DepartmentAreasAPI: Session not found (403), returning empty array');
            return []; // Return empty array instead of throwing
          }
        }
        
        // Try with wardId (camelCase) parameter name if first attempt failed
        if (error.response.status === 400 || error.response.status === 404) {
          console.log('🔄 DepartmentAreasAPI: Retrying with wardId parameter name...');
          try {
            const retryResponse = await axios.post(rpcUrl, { wardId: wardId }, {
              headers: getHeaders()
            });
            
            const retryData = retryResponse.data;
            
            if (!retryData || !Array.isArray(retryData)) {
              console.warn('⚠️ DepartmentAreasAPI: Retry returned invalid data:', retryData);
              return []; // Return empty array instead of throwing
            }
            
            console.log('✅ DepartmentAreasAPI: Retry successful, returned', retryData.length, 'departments');
            return retryData;
          } catch (retryError) {
            console.error('❌ DepartmentAreasAPI: Retry also failed:', retryError);
            return []; // Return empty array instead of throwing
          }
        }
      }
      
      // 🔥 FIX: Return empty array instead of throwing to prevent app crash
      console.warn('⚠️ DepartmentAreasAPI: Returning empty array due to error');
      return [];
    }
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to call RPC get_departments_by_ward:', error);
    throw error;
  }
}

/**
 * Fetch users by department ID using RPC function
 * @param departmentId - Department ID
 * @returns Array of users belonging to the department
 */
export async function getUsersByDepartment(departmentId: string): Promise<DepartmentUser[]> {
  try {
    if (!departmentId || typeof departmentId !== 'string' || departmentId.trim() === '') {
      console.warn('⚠️ DepartmentAreasAPI: Invalid departmentId for RPC call');
      return [];
    }

    console.log('🔄 DepartmentAreasAPI: Calling RPC get_users_by_department via axios');
    console.log('📋 DepartmentAreasAPI: Parameters:', { departmentId, type: typeof departmentId });
    
    // Call RPC function via REST API (PostgREST)
    const rpcUrl = `${SUPABASE_REST_URL}/rpc/get_users_by_department`;
    
    // Try with department_id (snake_case) first
    const requestBody = { department_id: departmentId };
    
    try {
      console.log('📤 DepartmentAreasAPI: Sending POST request to:', rpcUrl);
      console.log('📤 DepartmentAreasAPI: Request body:', requestBody);
      
      const response = await axios.post(rpcUrl, requestBody, {
        headers: getHeaders()
      });

      const data = response.data;

      console.log('📦 DepartmentAreasAPI: RPC response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!data,
        dataType: Array.isArray(data) ? 'array' : typeof data,
        dataLength: Array.isArray(data) ? data.length : 'N/A',
        dataSample: Array.isArray(data) && data.length > 0 ? data[0] : data
      });

      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ DepartmentAreasAPI: RPC returned invalid data:', data);
        // Try with departmentId (camelCase) parameter name
        console.log('🔄 DepartmentAreasAPI: Retrying with departmentId parameter name...');
        const retryResponse = await axios.post(rpcUrl, { departmentId: departmentId }, {
          headers: getHeaders()
        });
        
        const retryData = retryResponse.data;
        
        if (!retryData || !Array.isArray(retryData)) {
          console.warn('⚠️ DepartmentAreasAPI: Retry returned invalid data:', retryData);
          return [];
        }
        
        console.log('✅ DepartmentAreasAPI: Retry successful, returned', retryData.length, 'users');
        return retryData;
      }

      console.log('✅ DepartmentAreasAPI: RPC returned', data.length, 'users');
      console.log('📊 DepartmentAreasAPI: First user sample:', data[0]);
      
      return data;
    } catch (error: any) {
      console.error('❌ DepartmentAreasAPI: RPC call failed:', error);
      
      if (error.response) {
        console.error('❌ DepartmentAreasAPI: Response error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // 🔥 FIX: Handle 403 session_not_found error gracefully
        if (error.response.status === 403) {
          const errorData = error.response.data;
          if (errorData?.error_code === 'session_not_found') {
            console.warn('⚠️ DepartmentAreasAPI: Session not found (403), returning empty array');
            return []; // Return empty array instead of throwing
          }
        }
        
        // Try with departmentId (camelCase) parameter name if first attempt failed
        if (error.response.status === 400 || error.response.status === 404) {
          console.log('🔄 DepartmentAreasAPI: Retrying with departmentId parameter name...');
          try {
            const retryResponse = await axios.post(rpcUrl, { departmentId: actualDepartmentId }, {
              headers: getHeaders()
            });
            
            const retryData = retryResponse.data;
            
            if (!retryData || !Array.isArray(retryData)) {
              console.warn('⚠️ DepartmentAreasAPI: Retry returned invalid data:', retryData);
              return []; // Return empty array instead of throwing
            }
            
            console.log('✅ DepartmentAreasAPI: Retry successful, returned', retryData.length, 'users');
            return retryData;
          } catch (retryError) {
            console.error('❌ DepartmentAreasAPI: Retry also failed:', retryError);
            return []; // Return empty array instead of throwing
          }
        }
      }
      
      // 🔥 FIX: Return empty array instead of throwing to prevent app crash
      console.warn('⚠️ DepartmentAreasAPI: Returning empty array due to error');
      return [];
    }
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to call RPC get_users_by_department:', error);
    // 🔥 FIX: Return empty array instead of throwing to prevent app crash
    return [];
  }
}

/**
 * Fetch department areas with coordinates by department ID(s)
 * @param departmentIds - Single department ID or array of department IDs
 * @param groupByWardId - If true, group areas by wardId to avoid duplicates (default: false)
 * @returns Array of department areas with coordinates
 */
export async function fetchDepartmentAreas(
  departmentId: string | string[], 
  groupByWardId: boolean = false
): Promise<DepartmentAreasResponse | null> {
  try {
    // Handle array of department IDs
    const departmentIds = Array.isArray(departmentId) ? departmentId : [departmentId];
    
    if (departmentIds.length === 0) {
      return null;
    }
    
    // Filter out invalid IDs
    const validIds = departmentIds.filter(id => id && typeof id === 'string' && id.trim() !== '');
    if (validIds.length === 0) {
      return null;
    }

    // 🔥 FIX: Query for multiple department IDs using PostgREST 'in' operator
    // Format: department_id=in.(id1,id2,id3)
    // 🔥 NEW: Include department_id in select to track which department each area belongs to
    const idsParam = validIds.join(',');
    const url = `${SUPABASE_REST_URL}/department_areas?select=department_id,areas(province_id,ward_id,wards_with_coordinates(center_lat,center_lng,bounds,area,officer))&department_id=in.(${idsParam})`;
    
    console.log('🔍 DepartmentAreasAPI: Fetching from URL:', url);
    
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    
    const data = response.data || [];
    
    console.log('📦 DepartmentAreasAPI: Raw response:', {
      dataType: Array.isArray(data) ? 'array' : typeof data,
      dataLength: Array.isArray(data) ? data.length : 'N/A',
      sample: Array.isArray(data) && data.length > 0 ? JSON.stringify(data[0], null, 2) : JSON.stringify(data, null, 2)
    });
    
    // 🔥 FIX: Handle response structure
    // API returns array of department_areas records, each with an 'areas' object (not array)
    // Structure: [{ areas: { ward_id, province_id, wards_with_coordinates } }, ...]
    // We need to extract all areas objects and combine them into an array
    if (Array.isArray(data) && data.length > 0) {
      const areasArray: Area[] = [];
      
      for (const item of data) {
        if (item && typeof item === 'object' && 'areas' in item) {
          const areasObj = item.areas;
          const departmentId = item.department_id || item.departmentId || null;
          // Check if areas is an object (not array) with ward_id or province_id
          if (areasObj && typeof areasObj === 'object' && !Array.isArray(areasObj)) {
            if ('ward_id' in areasObj || 'province_id' in areasObj) {
              // 🔥 NEW: Add department_id to area object
              const areaWithDeptId = { ...areasObj, department_id: departmentId } as any;
              areasArray.push(areaWithDeptId);
            }
          }
        }
      }
      
      if (areasArray.length > 0) {
        // 🔥 NEW: If groupByWardId is true, group areas by wardId to avoid duplicates
        // This is used when fetching all departments' areas (no divisionId)
        if (groupByWardId) {
          const areasByWardId = new Map<string, Area>();
          
          for (const area of areasArray) {
            // Use ward_id as key (or province_id if ward_id is not available)
            const key = area.ward_id || area.province_id || '';
            
            if (key) {
              // If this wardId already exists, keep the first one (or merge if needed)
              if (!areasByWardId.has(key)) {
                areasByWardId.set(key, area);
              } else {
                // If duplicate, prefer the one with coordinates if current doesn't have them
                const existing = areasByWardId.get(key)!;
                if (!existing.wards_with_coordinates && area.wards_with_coordinates) {
                  areasByWardId.set(key, area);
                }
              }
            }
          }
          
          const uniqueAreas = Array.from(areasByWardId.values());
          console.log(`📋 DepartmentAreasAPI: Grouped areas by wardId: ${areasArray.length} → ${uniqueAreas.length} unique areas`);
          return { areas: uniqueAreas } as DepartmentAreasResponse;
        }
        
        return { areas: areasArray } as DepartmentAreasResponse;
      }
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Single object response
      if ('areas' in data) {
        const areasObj = data.areas;
        // If areas is an object, wrap it in array
        if (areasObj && typeof areasObj === 'object' && !Array.isArray(areasObj)) {
          return { areas: [areasObj as Area] } as DepartmentAreasResponse;
        } else if (Array.isArray(areasObj)) {
          return { areas: areasObj } as DepartmentAreasResponse;
        }
      }
    }
    
    console.warn('⚠️ DepartmentAreasAPI: Unexpected response structure:', data);
    return null;
  } catch (error: any) {
    console.error('❌ DepartmentAreasAPI: Failed to fetch department areas:', error);
    throw error;
  }
}
