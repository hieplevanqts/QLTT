/**
 * Locations API - Fetch provinces and wards from Supabase REST API
 * Using direct REST API calls with Bearer token authentication
 */

import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const baseUrl = `https://${projectId}.supabase.co/rest/v1`;

export interface ProvinceApiData {
  _id: string;
  code: string;
  name: string;
}

export interface WardApiData {
  _id: string;
  code: string;
  name: string;
  province_id?: string;
  provinceId?: string;
}

/**
 * Fetch all provinces from Supabase provinces table via REST API
 */
export async function fetchProvinces(): Promise<ProvinceApiData[]> {
  try {
    console.log('📡 Fetching provinces from:', `${baseUrl}/provinces`);
    
    const response = await fetch(`${baseUrl}/provinces?select=_id,code,name&order=code.asc&limit=10000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'apikey': publicAnonKey,
      },
    });

    console.log('📡 Provinces response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching provinces:', response.status, errorText);
      throw new Error(`Failed to fetch provinces: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Provinces fetched:', data?.length || 0, 'provinces');
    
    // Debug: Log all province IDs
    if (data && data.length > 0) {
      console.log('📊 Province IDs and names:', data.map((p: any) => ({ _id: p._id, name: p.name })));
    }
    
    return data || [];
  } catch (error: any) {
    console.error('❌ Error fetching provinces:', error.message);
    throw error;
  }
}

/**
 * Fetch all wards from Supabase areas table via REST API with pagination
 */
export async function fetchAllWards(): Promise<WardApiData[]> {
  try {
    console.log('📡 Fetching all wards from:', `${baseUrl}/areas`);
    
    let allWards: WardApiData[] = [];
    let offset = 0;
    const pageSize = 1000; // REST API default limit
    let hasMore = true;

    while (hasMore) {
      console.log(`📄 Fetching page - offset: ${offset}, limit: ${pageSize}`);
      
      const response = await fetch(
        `${baseUrl}/areas?select=_id,code,name,province_id&order=code.asc&limit=${pageSize}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'apikey': publicAnonKey,
          },
        }
      );

      console.log(`📡 Page response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error fetching wards page:', response.status, errorText);
        throw new Error(`Failed to fetch wards: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ Page fetched: ${data?.length || 0} wards`);

      if (!data || data.length === 0) {
        hasMore = false;
        console.log('✅ All pages fetched!');
      } else {
        allWards = [...allWards, ...data];
        if (data.length < pageSize) {
          hasMore = false;
          console.log('✅ Final page reached!');
        }
        offset += pageSize;
      }
    }

    console.log('✅ Total wards fetched:', allWards.length);
    
    // Debug: Log province_id distribution
    if (allWards.length > 0) {
      const provinceIdCount = new Map<string, number>();
      allWards.forEach((w: any) => {
        const pid = w.province_id || 'null';
        provinceIdCount.set(pid, (provinceIdCount.get(pid) || 0) + 1);
      });
      console.log('📊 Wards distribution by province_id:', Array.from(provinceIdCount.entries()));
      console.log('🔍 Sample wards from each province:');
      const sampledProvinces = new Set<string>();
      allWards.slice(0, 20).forEach((w: any) => {
        if (!sampledProvinces.has(w.province_id) && w.province_id) {
          sampledProvinces.add(w.province_id);
          console.log(`   Province ${w.province_id}: ${w.name}`);
        }
      });
    }
    
    return allWards;
  } catch (error: any) {
    console.error('❌ Error fetching wards:', error.message);
    throw error;
  }
}

/**
 * Fetch wards by province ID from Supabase wards table via REST API
 */
export async function fetchWardsByProvince(provinceId: string): Promise<WardApiData[]> {
  try {
    if (!provinceId || provinceId.trim() === '') {
      console.warn('⚠️ Province ID is empty');
      return [];
    }

    console.log('📡 Fetching wards for province ID:', provinceId);
    
    const response = await fetch(
      `${baseUrl}/wards?select=_id,code,name,province_id&province_id=eq.${provinceId.trim()}&order=code.asc&limit=1000`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      }
    );

    console.log('📡 Wards response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching wards:', response.status, errorText);
      throw new Error(`Failed to fetch wards: ${response.statusText}`);
    }

    const wards = await response.json();
    console.log('✅ Wards fetched for province ID:', provinceId, '-', wards?.length || 0, 'wards');
    
    return wards || [];
  } catch (error: any) {
    console.error(`❌ Error fetching wards for province ${provinceId}:`, error.message);
    return [];
  }
}

/**
 * Fetch wards by province code from Supabase areas table via REST API
 */
export async function fetchWardsByProvinceCode(provinceCode: string): Promise<WardApiData[]> {
  try {
    console.log('📡 Fetching wards for province:', provinceCode);
    
    // First, get province ID from code
    const provinceResponse = await fetch(
      `${baseUrl}/provinces?code=eq.${provinceCode.trim()}&select=_id`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      }
    );

    if (!provinceResponse.ok) {
      const errorText = await provinceResponse.text();
      console.error('❌ Error fetching province:', provinceResponse.status, errorText);
      throw new Error(`Failed to fetch province: ${provinceResponse.statusText}`);
    }

    const provinces = await provinceResponse.json();
    if (!provinces || provinces.length === 0) {
      console.warn('⚠️ Province not found:', provinceCode);
      return [];
    }

    const provinceId = provinces[0]._id;
    console.log('✅ Province ID found:', provinceId);

    // Now fetch wards by province_id
    const wardsResponse = await fetch(
      `${baseUrl}/areas?province_id=eq.${provinceId}&select=_id,code,name,province_id&order=code.asc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      }
    );

    console.log('📡 Wards response status:', wardsResponse.status);

    if (!wardsResponse.ok) {
      const errorText = await wardsResponse.text();
      console.error('❌ Error fetching wards:', wardsResponse.status, errorText);
      throw new Error(`Failed to fetch wards: ${wardsResponse.statusText}`);
    }

    const wards = await wardsResponse.json();
    console.log('✅ Wards fetched for province:', wards?.length || 0, 'wards');
    
    return wards || [];
  } catch (error: any) {
    console.error(`❌ Error fetching wards for province ${provinceCode}:`, error.message);
    throw error;
  }
}

/**
 * Fetch province by ID from Supabase provinces table via REST API
 */
export async function fetchProvinceById(provinceId: string): Promise<ProvinceApiData | null> {
  try {
    if (!provinceId || provinceId.trim() === '') {
      console.warn('⚠️ Province ID is empty');
      return null;
    }

    console.log('📡 Fetching province by ID:', provinceId);
    
    const response = await fetch(
      `${baseUrl}/provinces?_id=eq.${provinceId.trim()}&select=_id,code,name&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      }
    );

    console.log('📡 Province response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching province:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      console.log('✅ Province found:', data[0].name);
      return data[0];
    }
    
    console.warn('⚠️ Province not found with ID:', provinceId);
    return null;
  } catch (error: any) {
    console.error(`❌ Error fetching province ${provinceId}:`, error.message);
    return null;
  }
}

/**
 * Fetch ward by ID from Supabase wards table via REST API
 */
export async function fetchWardById(wardId: string): Promise<WardApiData | null> {
  try {
    if (!wardId || wardId.trim() === '') {
      console.warn('⚠️ Ward ID is empty');
      return null;
    }

    console.log('📡 Fetching ward by ID:', wardId);
    
    const response = await fetch(
      `${baseUrl}/wards?_id=eq.${wardId.trim()}&select=_id,code,name,province_id&limit=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
          'apikey': publicAnonKey,
        },
      }
    );

    console.log('📡 Ward response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching ward:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      console.log('✅ Ward found:', data[0].name);
      return data[0];
    }
    
    console.warn('⚠️ Ward not found with ID:', wardId);
    return null;
  } catch (error: any) {
    console.error(`❌ Error fetching ward ${wardId}:`, error.message);
    return null;
  }
}
