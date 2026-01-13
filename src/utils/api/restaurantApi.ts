import { Restaurant } from '../../data/restaurantData';
import { API_BASE_URL, getHeaders } from './config';
import { mockStores } from '../../data/mockStores';
import { FEATURES } from '../../config/features';

// Toggle this to enable/disable Supabase backend
const USE_SUPABASE = FEATURES.USE_SUPABASE_BACKEND;

/**
 * Seed restaurants data to Supabase KV store
 */
export async function seedRestaurants(restaurants: Restaurant[]): Promise<{ success: boolean; count: number; message: string }> {
  if (!USE_SUPABASE) {
    console.log('📦 Supabase disabled - seed operation skipped');
    return { 
      success: true, 
      count: restaurants.length, 
      message: 'Mock mode - no seeding needed' 
    };
  }

  try {
    console.log('📤 API: Sending seed request...');
    console.log(`📍 API endpoint: ${API_BASE_URL}/seed-restaurants`);
    console.log(`📊 Payload size: ${restaurants.length} restaurants`);
    
    const response = await fetch(`${API_BASE_URL}/seed-restaurants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ restaurants })
    });

    console.log(`📥 API: Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API: Seed failed:', error);
      throw new Error(error.error || 'Failed to seed restaurants');
    }

    const result = await response.json();
    console.log('✅ API: Seed successful:', result);
    return result;
  } catch (error) {
    console.error('❌ API: Error seeding restaurants:', error);
    throw error;
  }
}

/**
 * Fetch all restaurants from Supabase KV store
 */
export async function fetchRestaurants(): Promise<Restaurant[]> {
  if (!USE_SUPABASE) {
    console.log('📦 Using mock restaurants (Supabase disabled)');
    return mockStores;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('⚠️ Failed to fetch from Supabase, using mock data');
      return mockStores;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    console.warn('⚠️ Using mock data as fallback');
    return mockStores;
  }
}

/**
 * Fetch single restaurant by ID from Supabase KV store
 */
export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  if (!USE_SUPABASE) {
    console.log(`📦 Finding in mock restaurants: ${id} (Supabase disabled)`);
    return mockStores.find(store => store.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      if (response.status === 404) {
        return mockStores.find(store => store.id === id) || null;
      }
      const error = await response.json();
      console.warn('⚠️ Failed to fetch from Supabase, searching mock data');
      return mockStores.find(store => store.id === id) || null;
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return mockStores.find(store => store.id === id) || null;
  }
}

/**
 * Delete all restaurants from KV store (for re-seeding)
 */
export async function deleteAllRestaurants(): Promise<{ success: boolean; count: number; message: string }> {
  if (!USE_SUPABASE) {
    console.log('📦 Supabase disabled - delete operation skipped');
    return { 
      success: true, 
      count: 0, 
      message: 'Mock mode - no deletion needed' 
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'DELETE',
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete restaurants');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting restaurants:', error);
    throw error;
  }
}