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
    return { 
      success: true, 
      count: restaurants.length, 
      message: 'Mock mode - no seeding needed' 
    };
  }

  try {
    
    const response = await fetch(`${API_BASE_URL}/seed-restaurants`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ restaurants })
    });


    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API: Seed failed:', error);
      throw new Error(error.error || 'Failed to seed restaurants');
    }

    const result = await response.json();
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
    return mockStores;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      return mockStores;
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return mockStores;
  }
}

/**
 * Fetch single restaurant by ID from Supabase KV store
 */
export async function fetchRestaurantById(id: string): Promise<Restaurant | null> {
  if (!USE_SUPABASE) {
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
