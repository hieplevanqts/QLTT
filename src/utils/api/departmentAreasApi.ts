/**
 * Department Areas API - Fetch department areas with coordinates for map display
 */

import axios from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';

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
 * Fetch department areas with coordinates by department ID(s)
 * @param departmentIds - Single department ID or array of department IDs
 * @returns Array of department areas with coordinates
 */
export async function fetchDepartmentAreas(departmentId: string | string[]): Promise<DepartmentAreasResponse | null> {
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
    const idsParam = validIds.join(',');
    const url = `${SUPABASE_REST_URL}/department_areas?select=areas(province_id,ward_id,wards_with_coordinates(center_lat,center_lng,bounds,area,officer))&department_id=in.(${idsParam})`;
    
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    
    const data = response.data || [];
    
    // 🔥 FIX: Handle response structure
    // API returns array of department_areas records, each with an 'areas' object (not array)
    // Structure: [{ areas: { ward_id, province_id, wards_with_coordinates } }, ...]
    // We need to extract all areas objects and combine them into an array
    if (Array.isArray(data) && data.length > 0) {
      const areasArray: Area[] = [];
      
      for (const item of data) {
        if (item && typeof item === 'object' && 'areas' in item) {
          const areasObj = item.areas;
          // Check if areas is an object (not array) with ward_id or province_id
          if (areasObj && typeof areasObj === 'object' && !Array.isArray(areasObj)) {
            if ('ward_id' in areasObj || 'province_id' in areasObj) {
              areasArray.push(areasObj as Area);
            }
          }
        }
      }
      
      if (areasArray.length > 0) {
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
