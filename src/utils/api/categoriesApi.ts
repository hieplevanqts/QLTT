/**
 * Categories API
 * Fetch business categories from Supabase
 */

import { SUPABASE_REST_URL, getHeaders } from './config';

export interface Category {
  id: string;
  name: string;
  code: string;
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
