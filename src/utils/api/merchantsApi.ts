// API functions for merchants table
// Fetch merchants data from Supabase REST API

import { Restaurant } from '../../data/restaurantData';
import { SUPABASE_REST_URL, getHeaders } from './config';
import { supabase } from '../../lib/supabase';


/**
 * 🏪 Fetch merchants from merchants table with comprehensive filtering
 * ALL filtering is done at the backend - no frontend filtering needed
 * 
 * @param options - Filtering options object
 * @param options.statusCodes - Optional array of status codes ('active', 'pending', 'suspended', 'rejected')
 * @param options.businessTypes - Optional array of business types to filter by
 * @param options.departmentIds - Optional array of department IDs to filter by
 * @param options.province - Optional province name to filter by
 * @param options.district - Optional district name to filter by
 * @param options.ward - Optional ward name to filter by
 * @param options.searchQuery - Optional search text (searches name, address, tax code)
 * @returns Array of merchants mapped to Restaurant interface (already filtered)
 */
export interface FetchMerchantsOptions {
  statusCodes?: string[];
  businessTypes?: string[];
  departmentIds?: string[];
  province?: string;
  district?: string;
  ward?: string;
  searchQuery?: string;
  data?: any;
  departments?: any;
}

export async function fetchMerchants(p0: string[] | undefined, businessTypes: string[] | undefined, departmentIdsToFilter: string[] | undefined, teamId: string | null, divisionId: string, departmentIds: string[] | null, options?: FetchMerchantsOptions): Promise<Restaurant[]> {
  const opts = options || {};

  try {
    // Build query with all filters
    let url = `${SUPABASE_REST_URL}/merchants?limit=1000&order=created_at.desc&select=*`;

    // 🔥 Backend Filter 1: Status codes
    if (opts.statusCodes && opts.statusCodes.length > 0) {
      const statusFilter = opts.statusCodes.map(code => `status.eq.${code}`).join(',');
      url += `&or=(${statusFilter})`;
    }

    // 🔥 Backend Filter 2: Business types
    if (opts.businessTypes && opts.businessTypes.length > 0) {
      const typeFilter = opts.businessTypes.map(type => `business_type.eq.${encodeURIComponent(type)}`).join(',');
      url += `&or=(${typeFilter})`;
    }

    if (Array.isArray(departmentIds) && departmentIds.length > 0) {
      const idString = departmentIds.join(',');
      url += `&department_id=in.(${idString})`;
    }
    if (teamId && teamId !== null) {
      url += `&department_id=eq.${teamId}`;
    }

    if (divisionId) {
      const { data: departments } = await supabase
        .from('departments')
        .select('_id')
        .eq('parent_id', divisionId);

      const ids = [divisionId, ...(departments?.map(d => d._id) || [])];
      const idString = ids.join(',');
      url += `&department_id=in.(${idString})`;

      console.log('URL mới tối ưu:', url);
    }
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
    let merchants = data
      .filter((merchant: any) => {
        const hasCoords = typeof merchant.latitude === 'number' && typeof merchant.longitude === 'number';
        return hasCoords;
      })
      .map((merchant: any, index: number): Restaurant => {
        const lat = parseFloat(merchant.latitude);
        const lng = parseFloat(merchant.longitude);
        if (isNaN(lat) || isNaN(lng)) {
          console.error('❌ Invalid coordinates:', { lat: merchant.latitude, lng: merchant.longitude });
        }
        const businessType = merchant.business_type || 'Doanh nghiệp';
        const category = mapMerchantStatusToCategory(merchant.status);
        const statusName = getMerchantStatusName(merchant.status, merchant.license_status);
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

          // Tax code from backend
          taxCode: merchant.tax_code || undefined,

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

    // 🔥 Client-side Filter: Search query (since Supabase REST doesn't have full-text search)
    // This is the ONLY client-side filtering - all other filters done at backend
    if (opts.searchQuery && opts.searchQuery.trim()) {
      const searchLower = opts.searchQuery.toLowerCase();
      merchants = merchants.filter(merchant => {
        const nameLower = merchant.name.toLowerCase();
        const addressLower = merchant.address.toLowerCase();
        const taxCodeLower = (merchant.taxCode || '').toLowerCase();

        return nameLower.includes(searchLower) ||
          addressLower.includes(searchLower) ||
          taxCodeLower.includes(searchLower);
      });

    }

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

/**
 * 📊 Fetch statistics for merchants (total count and certified count)
 * Runs in background - no UI blocking
 * 
 * @param province - Optional province filter
 * @param district - Optional district filter
 * @param ward - Optional ward filter
 * @returns Statistics object with total and certified counts
 */
export interface MerchantStats {
  total: number;
  certified: number; // active status
  hotspot: number;  // suspended status
}

export async function fetchMerchantStats(
  province?: string,
  district?: string,
  ward?: string
): Promise<MerchantStats> {
  try {

    // Build location filters
    let url = `${SUPABASE_REST_URL}/merchants?select=status`;

    // Add location filters if provided
    if (province) {
      url += `&province=eq.${encodeURIComponent(province)}`;
    }
    if (district) {
      url += `&district=eq.${encodeURIComponent(district)}`;
    }
    if (ward) {
      url += `&ward=eq.${encodeURIComponent(ward)}`;
    }


    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch stats failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      // Return default stats on error (don't throw - background call)
      return { total: 0, certified: 0, hotspot: 0 };
    }

    const data = await response.json();

    // Count by status
    const total = data.length;
    const certified = data.filter((m: any) => m.status === 'active').length;
    const hotspot = data.filter((m: any) => m.status === 'suspended').length;


    return { total, certified, hotspot };
  } catch (error: any) {
    console.error('❌ Error fetching merchant stats (background):', error);
    // Return default stats on error (don't throw - background call)
    return { total: 0, certified: 0, hotspot: 0 };
  }
}