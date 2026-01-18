/**
 * Departments API - Fetch departments from Supabase
 */

import { supabase } from '../../lib/supabase';

export interface Department {
  id: string;
  name: string;
  code?: string;
  level?: number;
  path?: string;
  parent_id?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

/**
 * Fetch departments matching regex pattern for "ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ (1-25)"
 * Pattern: ^ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ ([1-9]|1[0-9]|2[0-5])$
 */
export async function fetchMarketManagementTeams(): Promise<Department[]> {
  try {
    
    // 🔥 FIX: Supabase JS client doesn't support regex operator ~ directly
    // Fetch all departments starting with "ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ" then filter with regex
    const { data, error } = await supabase
      .from('departments')
      .select('id, name, code, level, path, parent_id')
      .ilike('name', 'ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ%')  // Pre-filter with ilike for performance
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ Error fetching market management teams:', error);
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }

    if (data && data.length > 0) {
    }

    // 🔥 FIX: Filter with regex in JavaScript (pattern: ^ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ ([1-9]|1[0-9]|2[0-5])$)
    const regexPattern = /^ĐỘI QUẢN LÝ THỊ TRƯỜNG SỐ ([1-9]|1[0-9]|2[0-5])$/;
    const filteredData = (data || []).filter(dept => {
      const matches = regexPattern.test(dept.name);
      if (!matches && data && data.length < 50) {  // Only log if dataset is small (for debugging)
      }
      return matches;
    });

    if (filteredData.length > 0) {
    } else if (data && data.length > 0) {
    }
    
    return filteredData;
  } catch (error: any) {
    console.error('❌ Error fetching market management teams:', error);
    throw error;
  }
}

