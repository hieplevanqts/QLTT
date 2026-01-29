/**
 * MAPPA Portal - Supabase Helpers
 * Utility functions for Supabase operations
 */

import { supabase } from '@/api/supabaseClient';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

// Supabase configuration
export const SUPABASE_URL = `https://${projectId}.supabase.co`;
export const SUPABASE_ANON_KEY = publicAnonKey;

// Create and export Supabase client singleton
export { supabase };

/**
 * Log Supabase connection info (for debugging)
 */
export function logSupabaseInfo() {
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id:_id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err);
    return false;
  }
}

/**
 * Check if table exists
 */
export async function checkTableExists(tableName: string) {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('*, id:_id')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        return false;
      }
      throw error;
    }

    return true;
  } catch (err) {
    console.error(`❌ Error checking table "${tableName}":`, err);
    return false;
  }
}

/**
 * Get table row count
 */
export async function getTableRowCount(tableName: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*, id:_id', { count: 'exact', head: true });

    if (error) throw error;

    return count ?? 0;
  } catch (err) {
    console.error(`❌ Error getting row count for "${tableName}":`, err);
    return 0;
  }
}

/**
 * Check RLS status (Row Level Security)
 * Note: This requires elevated permissions to query pg_tables
 */
export async function checkRLSStatus(tableName: string) {
  try {
    // This query requires superuser or specific permissions
    // May not work with anon key
    const { data, error } = await supabase
      .rpc('check_rls_status', { table_name: tableName });

    if (error) {
      return null;
    }

    return data;
  } catch (err) {
    return null;
  }
}
