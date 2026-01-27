/**
 * Department Users API - Fetch users from department_users table
 */

import axios from 'axios';
import { SUPABASE_REST_URL, getHeaders } from './config';

export interface DepartmentUser {
  _id: string;
  user_id: string;
  department_id: string;
  users?: {
    _id: string;
    full_name: string;
    email?: string;
    phone?: string;
  } | null;
}

/**
 * Fetch users from department_users table by department_id
 * Priority: teamId > divisionId
 * 
 * @param teamId - Optional team ID (priority)
 * @param divisionId - Optional division ID (fallback)
 * @returns Array of users with their information
 */
export async function fetchDepartmentUsers(
  teamId?: string | null,
  divisionId?: string | null
): Promise<DepartmentUser[]> {
  try {
    // Priority: teamId > divisionId
    const departmentId = teamId && typeof teamId === 'string' && teamId.trim() !== ''
      ? teamId
      : divisionId && typeof divisionId === 'string' && divisionId.trim() !== ''
        ? divisionId
        : null;

    if (!departmentId) {
      return [];
    }

    const url = new URL(`${SUPABASE_REST_URL}/department_users`);
    url.searchParams.set('select', '_id,user_id,department_id,users(_id,full_name,email,phone)');
    url.searchParams.set('department_id', `eq.${departmentId}`);

    const response = await axios.get<DepartmentUser[]>(url.toString(), {
      headers: getHeaders()
    });

    const data = response.data || [];

    // Map data to ensure correct structure
    // Supabase REST API returns users as an array, but we only need the first one
    return data.map((item: any) => {
      const userData = Array.isArray(item.users) && item.users.length > 0 
        ? item.users[0] 
        : item.users || null;
      
      return {
        _id: item._id,
        user_id: item.user_id,
        department_id: item.department_id,
        users: userData,
      };
    });
  } catch (error: any) {
    console.error('❌ Error fetching department users:', error);
    throw error;
  }
}

/**
 * Get the first user (manager) from department_users
 * Priority: teamId > divisionId
 * 
 * @param teamId - Optional team ID (priority)
 * @param divisionId - Optional division ID (fallback)
 * @returns User information or null
 */
export async function getDepartmentManager(
  teamId?: string | null,
  divisionId?: string | null
): Promise<{ id: string; full_name: string; email?: string; phone?: string } | null> {
  try {
    const users = await fetchDepartmentUsers(teamId, divisionId);
    
    if (users.length === 0) {
      return null;
    }

    // Get first user
    const firstUser = users[0];
    if (!firstUser.users) {
      return null;
    }

    return {
      id: firstUser.users._id,  // Map _id to id for application compatibility
      full_name: firstUser.users.full_name,
      email: firstUser.users.email,
      phone: firstUser.users.phone,
    };
  } catch (error: any) {
    console.error('❌ Error getting department manager:', error);
    return null;
  }
}

