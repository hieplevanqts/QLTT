/**
 * Officer Filter API - Fetch departments for officer filter panel
 */

import axios from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';

export interface OfficerDepartment {
  _id: string;
  name: string;
}

/**
 * Fetch departments by parent_id
 * @param parentId - Parent department ID (divisionId or teamId)
 * @returns Array of departments
 */
export async function fetchOfficerDepartments(parentId: string): Promise<OfficerDepartment[]> {
  try {
    if (!parentId || typeof parentId !== 'string' || parentId.trim() === '') {
      return [];
    }

    const url = `${SUPABASE_REST_URL}/departments?select=_id,name&parent_id=eq.${parentId}`;
    
    const response = await axios.get(url, {
      headers: getHeaders()
    });
    
    const data = response.data || [];
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('❌ OfficerFilterAPI: Failed to fetch departments:', error);
    throw error;
  }
}
