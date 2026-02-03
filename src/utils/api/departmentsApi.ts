/**
 * Departments API - Fetch departments from Supabase
 */

import { supabase } from '@/api/supabaseClient';

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
    
    // 🔥 FIX: Validate UUID format and resolve department name to UUID if needed
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };
    
    let actualFilterId: { type: string; value: string } | null = null;
    
    if (filterId) {
      // Check if value is a valid UUID
      if (isValidUUID(filterId.value)) {
        actualFilterId = filterId;
        console.log(`🔍 Filtering departments by ${filterId.type} (UUID):`, filterId.value);
      } else {
        // Value is not a UUID, try to find department by name
        console.log(`⚠️ ${filterId.type} is not a UUID, searching by name:`, filterId.value);
        const { data: deptByName, error: searchError } = await supabase
          .from('departments')
          .select('_id')
          .eq('name', filterId.value)
          .is('deleted_at', null)
          .single();
        
        if (searchError || !deptByName) {
          console.error(`❌ Department not found by name "${filterId.value}":`, searchError);
          // Return empty array if department not found
          return [];
        }
        
        actualFilterId = { type: filterId.type, value: deptByName._id };
        console.log(`✅ Found department UUID:`, deptByName._id);
      }
    }
    
    let data: any[] = [];
    let error: any = null;
    
    if (actualFilterId) {
      // 🔥 FIX: Fetch twice and merge to avoid .or() issues with _id field
      // Query 1: _id = actualFilterId.value
      const query1 = supabase
        .from('departments')
        .select('_id, name, code, level, path, parent_id')
        .is('deleted_at', null)
        .eq('_id', actualFilterId.value);
      
      // Query 2: parent_id = actualFilterId.value
      const query2 = supabase
        .from('departments')
        .select('_id, name, code, level, path, parent_id')
        .is('deleted_at', null)
        .eq('parent_id', actualFilterId.value);
      
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
      const result = await query.select('_id, name, code, level, path, parent_id').order('name', { ascending: true });
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
    // 🔥 FIX: Validate UUID format and resolve department name to UUID if needed
    const isValidUUID = (str: string): boolean => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidRegex.test(str);
    };
    
    let actualDepartmentId = departmentId;
    
    // Check if departmentId is a valid UUID
    if (!isValidUUID(departmentId)) {
      console.log(`⚠️ fetchDepartmentById: departmentId is not a UUID, searching by name:`, departmentId);
      
      // Try to find department by name
      const { data: deptByName, error: searchError } = await supabase
        .from('departments')
        .select('_id')
        .eq('name', departmentId)
        .is('deleted_at', null)
        .single();
      
      if (searchError || !deptByName) {
        console.error(`❌ fetchDepartmentById: Department not found by name "${departmentId}":`, searchError);
        return null; // Return null if department not found
      }
      
      actualDepartmentId = deptByName._id;
      console.log(`✅ fetchDepartmentById: Found department UUID:`, actualDepartmentId);
    }
    
    const { data, error } = await supabase
      .from('departments')
      .select('_id, name, code, level, path, parent_id, address, latitude, longitude, created_at, updated_at')
      .eq('_id', actualDepartmentId)
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
export async function fetchDepartmentByParentId(parent_id: string) {
  // Thực hiện truy vấn trực tiếp
  const { data, error } = await supabase
    .from('departments')
    .select('*') // Chỉ lấy field _id
    .eq('_id', parent_id) // Khớp đúng cột và biến truyền vào
    .is('deleted_at', null);

  if (error) {
    console.error('Lỗi lấy dữ liệu:', error.message);
    return { data: null, error };
  }

  console.log('Dữ liệu phòng ban:', data);
  return { data, error: null };
}

export async function fetchDepartmentByPath(path: string) {
  // Thực hiện truy vấn trực tiếp
  const { data, error } = await supabase
    .from('departments')
    .select('*') // Chỉ lấy field _id
    .like('path', `${path}%`) // Lấy tất cả các path bắt đầu bằng cụm này
    .neq('path', path)        // LOẠI TRỪ: Không lấy chính xác cái path truyền vào
    .is('deleted_at', null);

  if (error) {
    console.error('Lỗi lấy dữ liệu:', error.message);
    return { data: null, error };
  }

  console.log('Dữ liệu phòng ban:', data);
  return { data, error: null };
}