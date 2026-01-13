// API functions for merchants table
// Fetch merchants data from Supabase REST API

import { Restaurant } from '../../data/restaurantData';
import { SUPABASE_REST_URL, getHeaders } from './config';

/**
 * 🏪 Fetch merchants from merchants table
 * Optional filters by status and business type
 * 
 * @param statusCodes - Optional array of status codes to filter by ('active', 'pending', 'suspended', 'rejected')
 * @param businessTypes - Optional array of business types to filter by
 * @returns Array of merchants mapped to Restaurant interface
 */
export async function fetchMerchants(
  statusCodes?: string[],
  businessTypes?: string[]
): Promise<Restaurant[]> {
  console.log('🏪 fetchMerchants: Called with statusCodes:', statusCodes, 'businessTypes:', businessTypes);
  console.log('🔑 fetchMerchants: SUPABASE_REST_URL:', SUPABASE_REST_URL);

  try {
    // Build query - simple select without nested joins
    let url = `${SUPABASE_REST_URL}/merchants?limit=1000&order=created_at.desc&select=*`;
    
    // 🔥 Filter by status if provided (direct field filter)
    // status field: 'active', 'pending', 'suspended', 'rejected'
    if (statusCodes && statusCodes.length > 0) {
      const statusFilter = statusCodes.map(code => `status.eq.${code}`).join(',');
      url += `&or=(${statusFilter})`;
    }
    
    // 🔥 Filter by business_type if provided (direct field filter)
    if (businessTypes && businessTypes.length > 0) {
      const typeFilter = businessTypes.map(type => `business_type.eq.${encodeURIComponent(type)}`).join(',');
      url += `&or=(${typeFilter})`;
    }
    
    console.log('📡 Fetching merchants from:', url);
    console.log('🔑 Using project:', SUPABASE_REST_URL);

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`Failed to fetch merchants: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw merchants data:', data.length, 'merchants');
    console.log('📍 First merchant raw:', data[0]);

    // Transform Supabase data to Restaurant interface
    const merchants = data
      .filter((merchant: any) => {
        // Filter out merchants without coordinates
        const hasCoords = typeof merchant.latitude === 'number' && typeof merchant.longitude === 'number';
        if (!hasCoords) {
          console.warn('⚠️ Merchant missing coordinates:', merchant.id, merchant.business_name);
        }
        return hasCoords;
      })
      .map((merchant: any, index: number): Restaurant => {
        const lat = parseFloat(merchant.latitude);
        const lng = parseFloat(merchant.longitude);

        if (isNaN(lat) || isNaN(lng)) {
          console.error('❌ Invalid coordinates:', { lat: merchant.latitude, lng: merchant.longitude });
        }

        // business_type is a direct text field
        const businessType = merchant.business_type || 'Doanh nghiệp';

        // Map merchant status to category for color coding
        // status: 'active', 'pending', 'suspended', 'rejected'
        const category = mapMerchantStatusToCategory(merchant.status);
        
        // Get human-readable status name
        const statusName = getMerchantStatusName(merchant.status, merchant.license_status);

        if (index === 0) {
          console.log('🏪 Merchant field mapping:', {
            business_name: merchant.business_name,
            owner_name: merchant.owner_name,
            business_type: merchant.business_type,
            status: merchant.status,
            license_status: merchant.license_status,
            mapped_category: category,
            statusName: statusName
          });
        }

        return {
          // Use business_name as name
          id: merchant.id || `merchant-${Math.random()}`,
          name: merchant.business_name || 'Unnamed Merchant',
          address: merchant.address || '',
          lat,
          lng,
          
          // Business type from direct field
          type: businessType,
          businessType: businessType,
          
          // Map status to category for color coding
          category: category,
          
          // Location from direct fields
          province: merchant.province || 'Hà Nội',
          district: merchant.district || '',
          ward: merchant.ward || '',
          
          // Phone as hotline
          hotline: merchant.owner_phone || undefined,
          
          // No logo field in merchants table
          logo: undefined,
          images: undefined,
          
          // No review fields in merchants table
          reviewScore: undefined,
          reviewCount: undefined,
          
          // No opening hours in merchants table
          openingHours: undefined,
          
          // Store raw status
          status: merchant.status || undefined,
          statusName: statusName || undefined,
        };
      });

    console.log('✅ Transformed', merchants.length, 'merchants to Restaurant format');
    console.log('📍 First 3 merchants:', merchants.slice(0, 3));

    return merchants;
  } catch (error: any) {
    console.error('❌ Error fetching merchants:', error);
    throw error;
  }
}

/**
 * Map status from merchants table to category filter keys
 * Similar to mapSupabaseStatus in mapPointsApi.ts
 */
function mapMerchantStatus(status?: number | string): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  // Default mapping - can be customized based on your business logic
  if (status === 1 || status === 'certified') return 'certified';
  if (status === 2 || status === 'hotspot') return 'hotspot';
  if (status === 3 || status === 'scheduled') return 'scheduled';
  return 'inspected'; // Default
}

/**
 * Map merchant status to category for color coding
 * @param status - Merchant status ('active', 'pending', 'suspended', 'rejected')
 * @returns Category ('certified', 'hotspot', 'scheduled', 'inspected')
 */
function mapMerchantStatusToCategory(status: string): 'certified' | 'hotspot' | 'scheduled' | 'inspected' {
  switch (status) {
    case 'active':
      return 'certified';
    case 'pending':
      return 'scheduled';
    case 'suspended':
      return 'hotspot';
    case 'rejected':
      return 'inspected';
    default:
      return 'inspected'; // Default
  }
}

/**
 * Get human-readable status name
 * @param status - Merchant status ('active', 'pending', 'suspended', 'rejected')
 * @param licenseStatus - License status (optional)
 * @returns Status name
 */
function getMerchantStatusName(status: string, licenseStatus?: string): string {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'pending':
      return 'Đang chờ';
    case 'suspended':
      return 'Tạm dừng';
    case 'rejected':
      return 'Từ chối';
    default:
      return 'Đã kiểm tra'; // Default
  }
}