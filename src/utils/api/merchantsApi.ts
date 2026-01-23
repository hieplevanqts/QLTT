// API functions for merchants table
// Fetch merchants data from Supabase REST API

import { Restaurant } from '../../data/restaurantData';
import { SUPABASE_REST_URL, getHeaders } from './config';
import axios from 'axios';


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
  categoryIds?: string[];  // 🔥 NEW: Category IDs for filtering
  province?: string;
  district?: string;
  ward?: string;
  searchQuery?: string;
  limit?: number;  // 🔥 NEW: Limit for pagination (default: 10000)
  data?: any;
  departments?: any;
}

export async function fetchMerchants(
  p0: string[] | undefined,
  businessTypes: string[] | undefined,
  departmentIdsToFilter: string[] | undefined,
  teamId: string | null, divisionId: string,
  departmentIds: string[],
  businessTypeFilters: string[] | null,
  options?: FetchMerchantsOptions
): Promise<Restaurant[]> {
  const opts = options || {};


  try {
    // --- A. UPDATE BROWSER URL (DO NOT RELOAD PAGE) ---
    const currentBrowserUrl = new URL(window.location.href);

    // 🔥 FIX: Build URL manually to preserve existing params and avoid encoding comma as %2C
    // Get base URL without search params
    const baseUrl = `${currentBrowserUrl.origin}${currentBrowserUrl.pathname}`;

    // Parse existing params manually to preserve them
    const existingParams = new Map<string, string>();
    currentBrowserUrl.searchParams.forEach((value, key) => {
      existingParams.set(key, value);
    });

    // Update or add params
    // Only update/delete if the param is explicitly provided in opts
    if (opts.hasOwnProperty('statusCodes')) {
      if (opts.statusCodes && opts.statusCodes.length > 0) {
        existingParams.set('status', opts.statusCodes.join(','));
      } else {
        existingParams.delete('status');
      }
    }
    // If statusCodes not provided, keep existing value

    if (opts.hasOwnProperty('businessTypes')) {
      if (opts.businessTypes && opts.businessTypes.length > 0) {
        existingParams.set('type', opts.businessTypes.join(','));
      } else {
        existingParams.delete('type');
      }
    }
    // If businessTypes not provided, keep existing value

    // 🔥 NEW: Update or add categories param (category IDs)
    // Filter out undefined, null, empty string, and "undefined" string
    if (opts.hasOwnProperty('categoryIds')) {
      if (opts.categoryIds && Array.isArray(opts.categoryIds)) {
        const validCategoryIds = opts.categoryIds.filter(
          (id): id is string =>
            id !== null &&
            id !== undefined &&
            typeof id === 'string' &&
            id !== 'undefined' &&
            id !== 'null' &&
            id.trim() !== ''
        );

        if (validCategoryIds.length > 0) {
          existingParams.set('categories', validCategoryIds.join(','));
        } else {
          existingParams.delete('categories');
        }
      } else {
        existingParams.delete('categories');
      }
    }
    // If categoryIds not provided, keep existing value

    if (opts.hasOwnProperty('searchQuery')) {
      if (opts.searchQuery?.trim()) {
        existingParams.set('search', opts.searchQuery);
      } else {
        existingParams.delete('search');
      }
    }
    // If searchQuery not provided, keep existing value

    // 🔥 NEW: Update or add province param
    // Only update if province is provided and not empty
    if (opts.province && typeof opts.province === 'string' && opts.province.trim() !== '') {
      existingParams.set('province', opts.province);
    } else {
      // Only delete if explicitly set to empty/undefined (don't delete if not provided)
      if (opts.hasOwnProperty('province')) {
        existingParams.delete('province');
      }
    }

    // 🔥 NEW: Update or add ward param
    // Only update if ward is provided and not empty
    if (opts.ward && typeof opts.ward === 'string' && opts.ward.trim() !== '') {
      existingParams.set('ward', opts.ward);
    } else {
      // Only delete if explicitly set to empty/undefined (don't delete if not provided)
      if (opts.hasOwnProperty('ward')) {
        existingParams.delete('ward');
      }
    }

    // 🔥 NEW: Update or add divisionId param
    if (divisionId && typeof divisionId === 'string' && divisionId.trim() !== '') {
      existingParams.set('divisionId', divisionId);
    } else {
      existingParams.delete('divisionId');
    }

    // 🔥 NEW: Update or add teamId param (priority over divisionId)
    if (teamId && typeof teamId === 'string' && teamId.trim() !== '') {
      existingParams.set('teamId', teamId);
    } else {
      existingParams.delete('teamId');
    }

    // 🔥 NEW: Update or add limit param
    // Priority: opts.limit > URL params > default (10000)
    let finalLimit: number;
    if (opts.hasOwnProperty('limit') && opts.limit !== undefined && opts.limit !== null) {
      finalLimit = opts.limit;
    } else {
      const urlLimit = currentBrowserUrl.searchParams.get('limit');
      finalLimit = urlLimit ? parseInt(urlLimit, 10) : 10000; // Default: 10000
      // Validate limit value
      if (isNaN(finalLimit) || finalLimit < 1) {
        finalLimit = 10000;
      }
    }
    existingParams.set('limit', finalLimit.toString());

    // Build URL string manually to avoid encoding comma
    const paramStrings: string[] = [];
    existingParams.forEach((value, key) => {
      // Only encode value if it contains special characters (not comma)
      // Encode: search, province, ward (UUIDs), divisionId, teamId
      // Don't encode: status, type, categories (comma-separated lists)
      const encodedValue = (key === 'search' || key === 'province' || key === 'ward' || key === 'divisionId' || key === 'teamId')
        ? encodeURIComponent(value)
        : value; // Keep comma unencoded for status/type/categories
      paramStrings.push(`${key}=${encodedValue}`);
    });

    const finalUrl = paramStrings.length > 0
      ? `${baseUrl}?${paramStrings.join('&')}`
      : baseUrl;

    // Update browser address bar
    window.history.pushState({}, '', finalUrl);

    // --- B. HANDLING API BACKEND CALLS (SUPABASE) ---
    const url = new URL(`${SUPABASE_REST_URL}/merchants`);
    
    // 🔥 FIX: Apply all filters FIRST, then set limit and order at the END
    // This ensures filters are applied before limiting results
    
    // 1. 🔥 FIX: Xử lý Select và Join bảng category_merchants
    // businessTypeFilters là array of category IDs (string[])
    // Lấy danh sách ID category hợp lệ, loại bỏ các giá trị undefined/null
    const activeCategoryIds = Array.isArray(businessTypeFilters)
      ? businessTypeFilters.filter((id: string) => id && id !== "undefined" && id !== "null")
      : [];

    // Chỉ join category_merchants!inner khi có filter danh mục (để tối ưu và tránh lỗi resource)
    if (activeCategoryIds.length > 0) {
      url.searchParams.set('select', '*,category_merchants!inner(category_id)');
      url.searchParams.set('category_merchants.category_id', `in.(${activeCategoryIds.join(',')})`);
    } else {
      url.searchParams.set('select', '*');
    }

    // 3. 🔥 FIX: Use departmentIds from options (UI checkboxes) as primary source
    // If options.departmentIds is provided, use it directly (already calculated in MapPage)
    // Otherwise, fall back to teamId/divisionId logic
    let finalDepartmentIds: string[] | undefined = undefined;

    if (opts.departmentIds && Array.isArray(opts.departmentIds) && opts.departmentIds.length > 0) {
      // 🔥 PRIORITY: Use departmentIds from options (from UI checkboxes or calculated from teamId/divisionId)
      finalDepartmentIds = opts.departmentIds.filter(id => id && id !== "undefined");
    } else if (teamId) {
      // Fallback: Use teamId if no departmentIds in options
      finalDepartmentIds = [teamId];
    } else if (divisionId) {
      // Fallback: Use divisionId and fetch sub-departments if no departmentIds in options
      try {
        // 🔥 FIX: Fetch departments where _id = divisionId OR parent_id = divisionId
        // PostgREST or syntax: or=(condition1,condition2)
        // Build URL manually to avoid URLSearchParams encoding issues
        const orCondition = `(_id.eq.${divisionId},parent_id.eq.${divisionId})`;
        const urlString = `${SUPABASE_REST_URL}/departments?select=_id&or=${encodeURIComponent(orCondition)}`;

        const response = await axios.get(urlString, {
          headers: getHeaders()
        });
        const subDepartments = response.data || [];
        const subIds = subDepartments.map((d: any) => d._id).filter((id: any) => id) || [];
        finalDepartmentIds = [divisionId, ...subIds];
      } catch (error: any) {
        console.error('❌ Error fetching sub-departments:', error);
        // Nếu lỗi, vẫn thêm divisionId vào danh sách
        finalDepartmentIds = [divisionId];
      }
    }

    // Apply department_id filter if we have IDs
    if (finalDepartmentIds && finalDepartmentIds.length > 0) {
      const uniqueDeptIds = Array.from(new Set(finalDepartmentIds)).filter(id => id && id !== "undefined");
      if (uniqueDeptIds.length > 0) {
        url.searchParams.set('department_id', `in.(${uniqueDeptIds.join(',')})`);
      }
    }

    // 4. Xử lý Status Codes cho API (Dùng toán tử 'in' thay cho 'or' lồng nhau)
    // Status trong database là TEXT ('active', 'pending', 'suspended', 'rejected'), không phải integer
    if (opts.statusCodes && opts.statusCodes.length > 0) {
      const validStatuses = opts.statusCodes.filter(s => s && s !== "undefined");
      if (validStatuses.length > 0) {
        // Query trực tiếp với string values (không cần map sang integer)
        url.searchParams.set('status', `in.(${validStatuses.join(',')})`);
      }
    }

    // 5. 🔥 REMOVED: Business Types filter by business_type field
    // Không cần filter bằng business_type field vì đã filter bằng category_merchants ở trên
    // Nếu cần filter bằng business_type, chỉ dùng khi không có category filter
    // if (opts.businessTypes && opts.businessTypes.length > 0 && activeCategoryIds.length === 0) {
    //   const validTypes = opts.businessTypes.filter(t => t && t !== "undefined");
    //   if (validTypes.length > 0) {
    //     url.searchParams.set('business_type', `in.(${validTypes.join(',')})`);
    //   }
    // }
    if (opts.province) {
      // Sử dụng province_id cho UUID
      url.searchParams.set('province_id', `eq.${opts.province}`);
    }

    if (opts.ward) {
      // Sử dụng ward_id cho UUID
      url.searchParams.set('ward_id', `eq.${opts.ward}`);
    }
    
    // 🔥 FIX: Set limit and order LAST - after all filters have been applied
    // This ensures PostgREST applies filters first, then limits the filtered results
    url.searchParams.set('limit', finalLimit.toString());
    url.searchParams.set('order', 'created_at.desc');
    
    // 6. Thực hiện Fetch từ Supabase REST API bằng axios
    const response = await axios.get(url.toString(), {
      headers: getHeaders()
    });

    const data = response.data;

    // 7. Mapping dữ liệu về interface Restaurant
    let merchants = data
      .filter((m: any) => {
        // 🔥 FIX: Check for valid coordinates - allow 0,0 but filter out null/undefined/NaN
        const hasLat = m.latitude !== null && m.latitude !== undefined && m.latitude !== '';
        const hasLng = m.longitude !== null && m.longitude !== undefined && m.longitude !== '';
        if (!hasLat || !hasLng) return false;

        const lat = parseFloat(m.latitude);
        const lng = parseFloat(m.longitude);
        // Allow valid numbers (including 0,0) but filter out NaN
        return !isNaN(lat) && !isNaN(lng);
      })
      .map((m: any): Restaurant => {
        const businessType = m.business_type || 'Doanh nghiệp';
        const lat = parseFloat(m.latitude);
        const lng = parseFloat(m.longitude);

        return {
          id: m._id || m.id || `merchant-${Math.random()}`,
          name: m.business_name || 'Unnamed Merchant',
          address: m.address || '',
          lat: lat, // 🔥 FIX: Don't convert NaN to 0, let it be NaN so MerchantsLayer can filter it out
          lng: lng, // 🔥 FIX: Don't convert NaN to 0, let it be NaN so MerchantsLayer can filter it out
          type: businessType,
          businessType: businessType,
          category: mapMerchantStatusToCategory(m.status),
          province: m.province || '',
          district: m.district || '',
          ward: m.ward || '',
          hotline: m.owner_phone || undefined,
          taxCode: m.tax_code || undefined,
          status: m.status || undefined,
          statusName: getMerchantStatusName(m.status, m.license_status) || undefined,
        };
      });

    // 8. Client-side Search (Dành cho tìm kiếm text nhanh)
    if (opts.searchQuery?.trim()) {
      const s = opts.searchQuery.toLowerCase();
      merchants = merchants.filter((m: Restaurant) =>
        m.name.toLowerCase().includes(s) ||
        m.address.toLowerCase().includes(s) ||
        (m.taxCode || '').toLowerCase().includes(s)
      );
    }

    return merchants;

  } catch (error: any) {
    console.error('❌ Error in fetchMerchants:', error);
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


/**
 * 📊 Fetch statistics for merchants
 * GỌI LẠI fetchMerchants để đồng bộ 100% dữ liệu và logic filter
 */
export async function fetchMerchantStats(
  province?: string, // province_id (UUID)
  district?: string, // Tạm thời bỏ qua theo logic hiện tại
  ward?: string      // ward_id (UUID)
): Promise<MerchantStats> {
  try {
    // Gọi hàm fetch chính với options location
    const merchants = await fetchMerchants(
      undefined, undefined, undefined, null, '', [], null,
      { province, ward }
    );

    return {
      total: merchants.length,
      certified: merchants.filter(m => m.category === 'certified').length,
      hotspot: merchants.filter(m => m.category === 'hotspot').length,
    };
  } catch (error) {
    console.error('❌ Error in fetchMerchantStats:', error);
    return { total: 0, certified: 0, hotspot: 0 };
  }
}