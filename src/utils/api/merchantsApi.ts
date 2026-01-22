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
  province?: string;
  district?: string;
  ward?: string;
  searchQuery?: string;
  data?: any;
  departments?: any;
}

export async function fetchMerchants(p0: string[] | undefined, businessTypes: string[] | undefined, departmentIdsToFilter: string[] | undefined, teamId: string | null, divisionId: string, departmentIds: string[], businessTypeFilters: string[] | null, options?: FetchMerchantsOptions): Promise<Restaurant[]> {
  const opts = options || {};


  try {
    // --- A. CẬP NHẬT URL TRÌNH DUYỆT (KHÔNG TẢI LẠI TRANG) ---
    const currentBrowserUrl = new URL(window.location.href);

    // Gán hoặc xóa params dựa trên giá trị của opts để đồng bộ thanh địa chỉ
    if (opts.statusCodes && opts.statusCodes.length > 0) {
      currentBrowserUrl.searchParams.set('status', opts.statusCodes.join(','));
    } else {
      currentBrowserUrl.searchParams.delete('status');
    }

    if (opts.businessTypes && opts.businessTypes.length > 0) {
      currentBrowserUrl.searchParams.set('type', opts.businessTypes.join(','));
    } else {
      currentBrowserUrl.searchParams.delete('type');
    }

    if (opts.searchQuery?.trim()) {
      currentBrowserUrl.searchParams.set('search', opts.searchQuery);
    } else {
      currentBrowserUrl.searchParams.delete('search');
    }

    // Cập nhật thanh địa chỉ trình duyệt
    window.history.pushState({}, '', currentBrowserUrl.toString());

    // --- B. XỬ LÝ GỌI API BACKEND (SUPABASE) ---
    const url = new URL(`${SUPABASE_REST_URL}/merchants`);

    // 1. Thiết lập các tham số mặc định cho API
    url.searchParams.set('limit', '10000');
    url.searchParams.set('order', 'created_at.desc');

    // 2. Xử lý Select và Join bảng (Khắc phục lỗi PGRST108)
    // Lấy danh sách ID category hợp lệ, loại bỏ các giá trị undefined/null
    const activeCategoryIds = Object.keys(businessTypeFilters ?? {}).filter(
      (key: string) => (businessTypeFilters as any)?.[key] === true && key !== "undefined" && key !== "null"
    );

    // Chỉ join category_merchants!inner khi có filter danh mục (để tối ưu và tránh lỗi resource)
    if (activeCategoryIds.length > 0) {
      url.searchParams.set('select', '*,category_merchants!inner(category_id)');
      url.searchParams.set('category_merchants.category_id', `in.(${activeCategoryIds.join(',')})`);
    } else {
      url.searchParams.set('select', '*');
    }

    // 3. Gom tất cả Department ID (Tránh lặp tham số gây lỗi 400)
    let allDeptIds: string[] = [];

    if (Array.isArray(departmentIds) && departmentIds.length > 0) {
      allDeptIds = [...allDeptIds, ...departmentIds];
    }

    if (teamId) {
      allDeptIds.push(teamId);
    }

    if (divisionId) {
      // Lấy danh sách phòng ban con từ Supabase REST API
      try {
        const response = await axios.get(`${SUPABASE_REST_URL}/departments`, {
          params: {
            select: '_id',
            parent_id: `eq.${divisionId}`
          },
          headers: getHeaders()
        });
        const subDepartments = response.data || [];
        const subIds = subDepartments.map((d: any) => d._id) || [];
        allDeptIds = [...allDeptIds, divisionId, ...subIds];
      } catch (error: any) {
        console.error('❌ Error fetching sub-departments:', error);
        // Nếu lỗi, vẫn thêm divisionId vào danh sách
        allDeptIds.push(divisionId);
      }
    }

    // Loại bỏ các ID trùng lặp, giá trị rỗng hoặc "undefined"
    const uniqueDeptIds = Array.from(new Set(allDeptIds)).filter(id => id && id !== "undefined");
    if (uniqueDeptIds.length > 0) {
      url.searchParams.set('department_id', `in.(${uniqueDeptIds.join(',')})`);
    }

    // 4. Xử lý Status Codes cho API (Dùng toán tử 'in' thay cho 'or' lồng nhau)
    // Map từ string status codes ('active', 'pending', 'suspended', 'rejected') sang integer (1, 2, 3, 4)
    if (opts.statusCodes && opts.statusCodes.length > 0) {
      const validStatuses = opts.statusCodes.filter(s => s && s !== "undefined");
      if (validStatuses.length > 0) {
        // Map string status codes to integers
        const statusMap: { [key: string]: number } = {
          'active': 1,      // certified
          'pending': 3,      // scheduled
          'suspended': 2,   // hotspot
          'rejected': 4     // inspected
        };
        const statusIntegers = validStatuses
          .map(s => statusMap[s])
          .filter((s): s is number => s !== undefined);
        
        if (statusIntegers.length > 0) {
          url.searchParams.set('status', `in.(${statusIntegers.join(',')})`);
        }
      }
    }

    // 5. Xử lý Business Types trực tiếp trên bảng merchants (nếu có)
    if (opts.businessTypes && opts.businessTypes.length > 0) {
      const validTypes = opts.businessTypes.filter(t => t && t !== "undefined");
      if (validTypes.length > 0) {
        // Lưu ý: PostgREST tự động encode khi dùng searchParams.set
        url.searchParams.set('business_type', `in.(${validTypes.join(',')})`);
      }
    }
    if (opts.province) {
      // Sử dụng province_id cho UUID
      url.searchParams.set('province_id', `eq.${opts.province}`);
    }

    if (opts.ward) {
      // Sử dụng ward_id cho UUID
      url.searchParams.set('ward_id', `eq.${opts.ward}`);
    }
    // 6. Thực hiện Fetch từ Supabase REST API bằng axios
    const response = await axios.get(url.toString(), {
      headers: getHeaders()
    });

    const data = response.data;

    // 7. Mapping dữ liệu về interface Restaurant
    let merchants = data
      .filter((m: any) => m.latitude !== null && m.longitude !== null)
      .map((m: any): Restaurant => {
        const businessType = m.business_type || 'Doanh nghiệp';
        const lat = parseFloat(m.latitude);
        const lng = parseFloat(m.longitude);

        return {
          id: m.id || `merchant-${Math.random()}`,
          name: m.business_name || 'Unnamed Merchant',
          address: m.address || '',
          lat: isNaN(lat) ? 0 : lat,
          lng: isNaN(lng) ? 0 : lng,
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