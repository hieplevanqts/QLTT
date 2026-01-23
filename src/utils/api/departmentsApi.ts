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
 * Fetch departments matching regex pattern for "Đội QLTT số (1-25)"
 * Actual data format: "Đội QLTT số 1", "Đội QLTT số 2", etc.
 * Pattern: ^ĐỘI\s+QLTT\s+SỐ\s+([1-9]|1[0-9]|2[0-5])$ (case-insensitive)
 * 
 * @param options - Optional configuration
 * @param options.strictPattern - If false, uses a more flexible pattern that matches any department containing "ĐỘI" and "QLTT"
 * @param options.returnAllIfNoMatch - If true, returns all departments if no match found (for debugging)
 * @param options.divisionId - Optional division ID to filter departments by division (id = divisionId OR parent_id = divisionId)
 * @param options.teamId - Optional team ID to filter departments by team (id = teamId OR parent_id = teamId)
 */
export async function fetchMarketManagementTeams(options?: {
  strictPattern?: boolean;
  returnAllIfNoMatch?: boolean;
  divisionId?: string | null;
  teamId?: string | null;
}): Promise<Department[]> {
  try {
   
    let query = supabase
      .from('departments')
      .select('_id, name, code, level, path, parent_id')
      .is('deleted_at', null);
    
    // 🔥 CHANGED: Priority: teamId > divisionId
    // If teamId is provided, filter by teamId
    // Otherwise, if divisionId is provided, filter by divisionId
    const filterId = options?.teamId && typeof options.teamId === 'string' && options.teamId.trim() !== ''
      ? { type: 'teamId', value: options.teamId }
      : options?.divisionId && typeof options.divisionId === 'string' && options.divisionId.trim() !== ''
        ? { type: 'divisionId', value: options.divisionId }
        : null;
    
    let data: any[] = [];
    let error: any = null;
    
    if (filterId) {
      console.log(`🔍 Filtering departments by ${filterId.type}:`, filterId.value);
      // 🔥 FIX: Fetch twice and merge to avoid .or() issues with _id field
      // Query 1: _id = filterId.value
      const query1 = supabase
        .from('departments')
        .select('_id, name, code, level, path, parent_id')
        .is('deleted_at', null)
        .eq('_id', filterId.value);
      
      // Query 2: parent_id = filterId.value
      const query2 = supabase
        .from('departments')
        .select('_id, name, code, level, path, parent_id')
        .is('deleted_at', null)
        .eq('parent_id', filterId.value);
      
      // Execute both queries in parallel
      const [result1, result2] = await Promise.all([
        query1.order('name', { ascending: true }),
        query2.order('name', { ascending: true })
      ]);
      
      if (result1.error) {
        error = result1.error;
      } else if (result2.error) {
        error = result2.error;
      } else {
        // Merge results and remove duplicates
        const merged = [...(result1.data || []), ...(result2.data || [])];
        const uniqueMap = new Map();
        merged.forEach((dept: any) => {
          uniqueMap.set(dept._id, dept);
        });
        data = Array.from(uniqueMap.values());
      }
    } else {
      console.log('📋 No filter - fetching all departments');
      const result = await query.order('name', { ascending: true });
      data = result.data || [];
      error = result.error;
    }
   
    if (error) {
      console.error('❌ Error fetching market management teams:', error);
      throw new Error(`Failed to fetch departments: ${error.message}`);
    }
    
    // 🔥 MAP _id to id for application compatibility
    const mappedData = (data || []).map((dept: any) => ({
      ...dept,
      id: dept._id
    }));

    // 🔥 CHANGED: If filter was applied but Supabase .or() didn't work,
    // apply client-side filtering as fallback
    let filteredData = mappedData || [];
    if (filterId && mappedData && mappedData.length > 0) {
      filteredData = mappedData.filter((dept: Department) => {
        return dept.id === filterId.value || dept.parent_id === filterId.value;
      });
      console.log('🔍 Client-side filter applied. Before:', mappedData.length, 'After:', filteredData.length);
      if (filteredData.length !== mappedData.length) {
        console.log('⚠️ Supabase .or() filter may not have worked, using client-side filter');
      }
    }

    
    // 🔥 TEMP: Bỏ điều kiện filter theo name (regex pattern)
    // Chỉ trả về departments đã được filter theo teamId hoặc divisionId
    return filteredData;
  } catch (error: any) {
    console.error('❌ Error fetching market management teams:', error);
    throw error;
  }
}

/**
 * Fetch department by ID
 */
export async function fetchDepartmentById(departmentId: string): Promise<Department | null> {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('_id, name, code, level, path, parent_id, address, latitude, longitude, created_at, updated_at')
      .eq('_id', departmentId)
      .is('deleted_at', null)
      .single();

    if (error) {
      console.error('❌ Error fetching department by ID:', error);
      throw new Error(`Failed to fetch department: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    // Map _id to id for application compatibility
    return {
      ...data,
      id: data._id,
      _id: data._id,
    };
  } catch (error: any) {
    console.error('❌ Error fetching department by ID:', error);
    throw error;
  }
}
