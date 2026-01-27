/**
 * Locations API - Fetch provinces and wards from Supabase REST API using axios
 */

import axios from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';

export interface ProvinceApiData {
  _id: string;
  code: string;
  name: string;
}

export interface WardApiData {
  _id: string;
  code: string;
  name: string;
  province_id?: string;  // 🔥 FIX: Database uses snake_case 'province_id'
  provinceId?: string;   // Keep for backward compatibility if Supabase transforms it
}

export interface ProvinceCoordinates {
  province_id: string;
  center_lat: number;
  center_lng: number;
  bounds?: [[number, number], [number, number]]; // [[south, west], [north, east]]
  area?: number;
  officer?: string;
}

export interface WardCoordinates {
  ward_id: string;
  center_lat?: number;
  center_lng?: number;
  bounds?: [[number, number], [number, number]];
  area?: number;
  officer?: string;
}

/**
 * Fetch all provinces from Supabase provinces table using axios
 */
export async function fetchProvinces(): Promise<ProvinceApiData[]> {
  try {
    const response = await axios.get<ProvinceApiData[]>(
      `${SUPABASE_REST_URL}/provinces`,
      {
        params: {
          select: '_id,code,name',
          order: 'code.asc'
        },
        headers: getHeaders()
      }
    );

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error fetching provinces:', error);
    if (error.response) {
      throw new Error(`Failed to fetch provinces: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch provinces: ${error.message}`);
  }
}

/**
 * Fetch all wards from Supabase wards table using axios
 * Supports pagination for large datasets
 */
export async function fetchAllWards(): Promise<WardApiData[]> {
  try {
    let allWards: WardApiData[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const start = page * pageSize;

      const response = await axios.get<WardApiData[]>(
        `${SUPABASE_REST_URL}/wards`,
        {
          params: {
            select: '_id,code,name,province_id',
            order: 'code.asc',
            limit: pageSize,
            offset: start
          },
          headers: getHeaders()
        }
      );

      const data = response.data || [];

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allWards = [...allWards, ...data];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return allWards;
  } catch (error: any) {
    console.error('❌ Error fetching wards:', error);
    if (error.response) {
      throw new Error(`Failed to fetch wards: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch wards: ${error.message}`);
  }
}

/**
 * Fetch wards by province ID from Supabase wards table using axios
 * Supports pagination for large datasets
 */
export async function fetchWardsByProvinceId(provinceId: string): Promise<WardApiData[]> {
  try {
    let allWards: WardApiData[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const start = page * pageSize;

      const response = await axios.get<WardApiData[]>(
        `${SUPABASE_REST_URL}/wards`,
        {
          params: {
            select: '_id,code,name,province_id',
            province_id: `eq.${provinceId}`,
            order: 'code.asc',
            limit: pageSize,
            offset: start
          },
          headers: getHeaders()
        }
      );

      const data = response.data || [];

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allWards = [...allWards, ...data];
        if (data.length < pageSize) {
          hasMore = false;
        } else {
          page++;
        }
      }
    }

    return allWards;
  } catch (error: any) {
    console.error(`❌ Error fetching wards for province ${provinceId}:`, error);
    if (error.response) {
      throw new Error(`Failed to fetch wards: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch wards: ${error.message}`);
  }
}

/**
 * Fetch wards by province ID from Supabase wards table using axios
 * This is a simpler version without pagination for backward compatibility
 * For large datasets, use fetchWardsByProvinceId instead
 */
export async function fetchWardsByProvince(provinceId: string): Promise<WardApiData[]> {
  try {
    if (!provinceId || provinceId.trim() === '') {
      console.warn('⚠️ Province ID is empty');
      return [];
    }

    console.log('📡 Fetching wards for province ID:', provinceId);
    
    const response = await axios.get<WardApiData[]>(
      `${SUPABASE_REST_URL}/wards`,
      {
        params: {
          select: '_id,code,name,province_id',
          province_id: `eq.${provinceId.trim()}`,
          order: 'code.asc',
          limit: 10000
        },
        headers: getHeaders()
      }
    );

    const data = response.data || [];
    console.log('✅ Wards fetched for province ID:', provinceId, '-', data.length, 'wards');
    
    return data || [];
  } catch (error: any) {
    console.error(`❌ Error fetching wards for province ${provinceId}:`, error);
    if (error.response) {
      console.error(`Failed to fetch wards: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    return [];
  }
}

/**
 * Fetch wards by province code from Supabase wards table using axios
 */
export async function fetchWardsByProvinceCode(provinceCode: string): Promise<WardApiData[]> {
  try {
    // First, get province ID from code
    const response = await axios.get<ProvinceApiData[]>(
      `${SUPABASE_REST_URL}/provinces`,
      {
        params: {
          select: '_id,code',
          code: `eq.${provinceCode}`,
          limit: 1
        },
        headers: getHeaders()
      }
    );

    const provincesData = response.data || [];

    if (!provincesData || provincesData.length === 0) {
      return [];
    }

    const provinceId = provincesData[0]._id;

    // Use the new function to fetch wards by province ID
    return await fetchWardsByProvinceId(provinceId);
  } catch (error: any) {
    console.error(`❌ Error fetching wards for province ${provinceCode}:`, error);
    if (error.response) {
      throw new Error(`Failed to fetch wards: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch wards: ${error.message}`);
  }
}

/**
 * Fetch province by ID from Supabase provinces table using axios
 */
export async function fetchProvinceById(provinceId: string): Promise<ProvinceApiData | null> {
  try {
    if (!provinceId || provinceId.trim() === '') {
      console.warn('⚠️ Province ID is empty');
      return null;
    }

    console.log('📡 Fetching province by ID:', provinceId);
    
    const response = await axios.get<ProvinceApiData[]>(
      `${SUPABASE_REST_URL}/provinces`,
      {
        params: {
          select: '_id,code,name',
          _id: `eq.${provinceId.trim()}`,
          limit: 1
        },
        headers: getHeaders()
      }
    );

    const data = response.data || [];
    if (data && data.length > 0) {
      console.log('✅ Province found:', data[0].name);
      return data[0];
    }
    
    console.warn('⚠️ Province not found with ID:', provinceId);
    return null;
  } catch (error: any) {
    console.error(`❌ Error fetching province ${provinceId}:`, error);
    if (error.response) {
      console.error(`Failed to fetch province: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    return null;
  }
}

/**
 * Fetch ward by ID from Supabase wards table using axios
 */
export async function fetchWardById(wardId: string): Promise<WardApiData | null> {
  try {
    if (!wardId || wardId.trim() === '') {
      console.warn('⚠️ Ward ID is empty');
      return null;
    }

    console.log('📡 Fetching ward by ID:', wardId);
    
    const response = await axios.get<WardApiData[]>(
      `${SUPABASE_REST_URL}/wards`,
      {
        params: {
          select: '_id,code,name,province_id',
          _id: `eq.${wardId.trim()}`,
          limit: 1
        },
        headers: getHeaders()
      }
    );

    const data = response.data || [];
    if (data && data.length > 0) {
      console.log('✅ Ward found:', data[0].name);
      return data[0];
    }
    
    console.warn('⚠️ Ward not found with ID:', wardId);
    return null;
  } catch (error: any) {
    console.error(`❌ Error fetching ward ${wardId}:`, error);
    if (error.response) {
      console.error(`Failed to fetch ward: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    return null;
  }
}

/**
 * Fetch province coordinates from province_coordinates table
 */
export async function fetchProvinceCoordinates(provinceId: string): Promise<ProvinceCoordinates | null> {
  if (!provinceId) return null;
  
  try {
    const response = await axios.get<ProvinceCoordinates[]>(
      `${SUPABASE_REST_URL}/province_coordinates`,
      {
        params: {
          select: 'province_id,center_lat,center_lng,bounds,area,officer',
          province_id: `eq.${provinceId}`,
          limit: 1
        },
        headers: getHeaders()
      }
    );

    const data = response.data || [];
    if (data.length === 0) {
      return null;
    }

    const coords = data[0];
    // Parse bounds if it's a string
    if (coords.bounds && typeof coords.bounds === 'string') {
      coords.bounds = JSON.parse(coords.bounds);
    }

    return coords;
  } catch (error: any) {
    console.error(`❌ Error fetching province coordinates for ${provinceId}:`, error);
    if (error.response) {
      throw new Error(`Failed to fetch province coordinates: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch province coordinates: ${error.message}`);
  }
}

/**
 * Fetch ward coordinates from ward_coordinates table by ward ID(s)
 * @param wardIds - Single ward ID or array of ward IDs
 * @returns Array of ward coordinates
 */
export async function fetchWardCoordinatesByWardIds(wardIds: string | string[]): Promise<Array<WardCoordinates & { ward_id: string }>> {
  try {
    const wardIdsArray = Array.isArray(wardIds) ? wardIds : [wardIds];
    
    if (wardIdsArray.length === 0) {
      return [];
    }
    
    // Filter out invalid IDs
    const validIds = wardIdsArray.filter(id => id && typeof id === 'string' && id.trim() !== '');
    if (validIds.length === 0) {
      return [];
    }

    // Query for multiple ward IDs using PostgREST 'in' operator
    const idsParam = validIds.join(',');
    const url = `${SUPABASE_REST_URL}/ward_coordinates?select=ward_id,center_lat,center_lng,bounds,area,officer&ward_id=in.(${idsParam})`;
    
    const response = await axios.get<Array<WardCoordinates & { ward_id: string }>>(url, {
      headers: getHeaders()
    });

    const data = response.data || [];
    
    // Filter only valid coordinates and ensure types are correct
    return data.filter((coord): coord is WardCoordinates & { ward_id: string } => {
      if (!coord.ward_id) return false;
      if (coord.center_lat === null || coord.center_lat === undefined) return false;
      if (coord.center_lng === null || coord.center_lng === undefined) return false;
      if (typeof coord.center_lat !== 'number' || typeof coord.center_lng !== 'number') return false;
      if (isNaN(coord.center_lat) || isNaN(coord.center_lng)) return false;
      return true;
    });
  } catch (error: any) {
    console.error('❌ Error fetching ward coordinates by ward IDs:', error);
    throw error;
  }
}

/**
 * Fetch ward coordinates from ward_coordinates table
 */
export async function fetchWardCoordinates(wardId: string): Promise<WardCoordinates | null> {
  if (!wardId) return null;
  
  try {
    const response = await axios.get<WardCoordinates[]>(
      `${SUPABASE_REST_URL}/ward_coordinates`,
      {
        params: {
          select: 'ward_id,center_lat,center_lng,bounds,area,officer',
          ward_id: `eq.${wardId}`,
          limit: 1
        },
        headers: getHeaders()
      }
    );

    const data = response.data || [];
    if (data.length === 0) {
      return null;
    }

    const coords = data[0];
    // Parse bounds if it's a string
    if (coords.bounds && typeof coords.bounds === 'string') {
      coords.bounds = JSON.parse(coords.bounds);
    }

    return coords;
  } catch (error: any) {
    console.error(`❌ Error fetching ward coordinates for ${wardId}:`, error);
    if (error.response) {
      throw new Error(`Failed to fetch ward coordinates: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw new Error(`Failed to fetch ward coordinates: ${error.message}`);
  }
}
