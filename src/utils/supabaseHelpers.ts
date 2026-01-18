/**
 * MAPPA Portal - Supabase Helpers
 * Utility functions for Supabase operations
 */

import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '@/utils/supabase/info';

// Supabase configuration
export const SUPABASE_URL = `https://${projectId}.supabase.co`;
export const SUPABASE_ANON_KEY = publicAnonKey;

// Create and export Supabase client singleton
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Log Supabase connection info (for debugging)
 */
export function logSupabaseInfo() {
  console.log('🔌 Supabase Connection Info:');
  console.log('  URL:', SUPABASE_URL);
  console.log('  Project ID:', projectId);
  console.log('  Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful!');
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
      .select('*')
      .limit(1);

    if (error) {
      if (error.message.includes('does not exist')) {
        console.warn(`⚠️ Table "${tableName}" does not exist`);
        return false;
      }
      throw error;
    }

    console.log(`✅ Table "${tableName}" exists`);
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
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    console.log(`📊 Table "${tableName}" has ${count ?? 0} rows`);
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
      console.warn('⚠️ Cannot check RLS status (requires elevated permissions)');
      return null;
    }

    return data;
  } catch (err) {
    console.warn('⚠️ Cannot check RLS status:', err);
    return null;
  }
}
