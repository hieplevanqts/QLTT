/**
 * Categories API
 * Fetch business categories from Supabase
 */

import { SUPABASE_REST_URL, getHeaders } from './config';

export interface Category {
  _id: string;
  name: string;
  icon?: string;
  id?: string; // Backward compatibility for existing code
  code?: string; // Backward compatibility for existing code
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all categories from Supabase
 * GET /categories?limit=10000
 */
export async function fetchCategories(): Promise<Category[]> {
  try {
    const url = `${SUPABASE_REST_URL}/categories?limit=10000`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ fetchCategories: HTTP error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error('❌ fetchCategories: Error:', error);
    throw error;
  }
}

/**
 * Search categories by name (case-insensitive)
 * GET /categories?name=ilike.*{searchTerm}*&limit=20
 */
export async function searchCategories(searchTerm: string, limit: number = 20): Promise<Category[]> {
  try {
    const trimmed = searchTerm.trim();
    const query = trimmed ? `name=ilike.${encodeURIComponent(`*${trimmed}*`)}` : '';
    const url = `${SUPABASE_REST_URL}/categories?${query}${query ? '&' : ''}limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ searchCategories: HTTP error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Category[] = await response.json();
    return data;
  } catch (error) {
    console.error('❌ searchCategories: Error:', error);
    throw error;
  }
}
