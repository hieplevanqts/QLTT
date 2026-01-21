/**
 * Locations API - Fetch provinces and wards from Supabase
 */

import { supabase } from '../../lib/supabase';

export interface ProvinceApiData {
  id: string;
  code: string;
  name: string;
}

export interface WardApiData {
  id: string;
  code: string;
  name: string;
  province_id?: string;  // 🔥 FIX: Database uses snake_case 'province_id'
  provinceId?: string;   // Keep for backward compatibility if Supabase transforms it
}

/**
 * Fetch all provinces from Supabase provinces table
 */
export async function fetchProvinces(): Promise<ProvinceApiData[]> {
  try {
    
    const { data, error } = await supabase
      .from('provinces')
      .select('id:_id, code, name')
      .order('code', { ascending: true });

    if (error) {
      console.error('❌ Error fetching provinces:', error);
      throw new Error(`Failed to fetch provinces: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error('❌ Error fetching provinces:', error);
    throw error;
  }
}

/**
 * Fetch all wards from Supabase wards table
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
      const end = start + pageSize - 1;

      // 🔥 FIX: Use 'province_id' (snake_case) as that's the database field name
      const { data, error } = await supabase
        .from('wards')
        .select('id:_id, code, name, province_id')
        .order('code', { ascending: true })
        .range(start, end);

      // 🔥 DEBUG: Log field names in first ward
      if (data && data.length > 0 && page === 0 && start === 0) {
        console.log({
          keys: Object.keys(data[0]),
          provinceId: data[0].provinceId,
          province_id: (data[0] as any).province_id,
          provinceid: (data[0] as any).provinceid,
          fullObject: data[0],
        });
      }

      if (error) {
        console.error('❌ Error fetching wards:', error);
        throw new Error(`Failed to fetch wards: ${error.message}`);
      }

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
    throw error;
  }
}

/**
 * Fetch wards by province code from Supabase wards table
 */
export async function fetchWardsByProvinceCode(provinceCode: string): Promise<WardApiData[]> {
  try {
    
    // First, get province ID from code
    const { data: provincesData, error: provinceError } = await supabase
      .from('provinces')
      .select('id:_id, code')
      .eq('code', provinceCode)
      .limit(1);

    if (provinceError) {
      console.error('❌ Error fetching province:', provinceError);
      throw new Error(`Failed to fetch province: ${provinceError.message}`);
    }

    if (!provincesData || provincesData.length === 0) {
      return [];
    }

    const provinceId = provincesData[0].id;

    // Then fetch wards by provinceId
    let allWards: WardApiData[] = [];
    let page = 0;
    const pageSize = 1000;
    let hasMore = true;

    while (hasMore) {
      const start = page * pageSize;
      const end = start + pageSize - 1;

      // 🔥 FIX: Use 'province_id' (snake_case) as that's the database field name
      const { data, error } = await supabase
        .from('wards')
        .select('id:_id, code, name, province_id')
        .eq('province_id', provinceId)
        .order('code', { ascending: true })
        .range(start, end);

      if (error) {
        console.error('❌ Error fetching wards:', error);
        throw new Error(`Failed to fetch wards: ${error.message}`);
      }

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
    console.error(`❌ Error fetching wards for province ${provinceCode}:`, error);
    throw error;
  }
}

