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
 * @param businessTypeFiltersArray
 * @returns Array of merchants mapped to Restaurant interface (already filtered)
 */

export async function fetchMerchants(
  statusCodes?: string[],
  businessTypes?: string[],
  departmentIds?: string[],
  provinceId?: string,
  wardId?: string,
  targetDepartmentPath?: string,
  businessTypeFiltersArray?: string[],
  searchQuery?: any,
): Promise<Restaurant[] | null> { 
  if (!targetDepartmentPath || targetDepartmentPath.trim() === '') {
    console.log('⏳ Skip fetchMerchants: targetDepartmentPath not ready');
    return null; 
  }
  try {
    const baseUrl = `${SUPABASE_REST_URL}/merchant_filter_view`;
    const params = new URLSearchParams();
    params.append(
      'select',
      '_id,business_name,address,business_type,latitude,longitude,status,category_ids,tax_code'
    );
    params.append('limit', searchQuery?.limit ? String(searchQuery.limit) : '100');
    params.append('order', '_id.desc');
    const pathFilter = `${targetDepartmentPath}*`;
    params.append('department_path', `like.${pathFilter}`);
    // if (departmentIds?.length) {
    //   params.append('department_id', `in.(${departmentIds.join(',')})`);
    // }
    if (statusCodes?.length) {
      params.append('status', `in.(${statusCodes.join(',')})`);
    }
    if (businessTypes?.length) {
      params.append('category_ids', `cs.{${businessTypes.join(',')}}`);
    }
    const finalUrl = `${baseUrl}?${params.toString()}`;
    const response = await axios.get(finalUrl, {
      headers: getHeaders()
    });
    const data = response.data;
    if (!Array.isArray(data)) return [];
    return data.map((m: any) => ({
      id: m._id,
      name: m.business_name,
      address: m.address,
      businessType: m.business_type,
      lat: m.latitude,
      lng: m.longitude,
      category: mapMerchantStatusToCategory(m.status),
      merchant_staff: m.merchant_staff,
      merchant_law_docs: m.merchant_law_docs,
      status: m.status,
      taxCode: m.tax_code
    }));

  } catch (error) {
    throw error;
  }
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
 * @returns Status name
 */
function getMerchantStatusName(status: string): string {
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

export async function fetchMerchantDetail(merchantId: string, licenseType: string = 'Giấy phép kinh doanh'): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/merchants?or=(id.eq.${merchantId},_id.eq.${merchantId})&select=*,merchant_licenses!merchant_licenses_merchant_id_fkey!inner(*)&merchant_licenses.license_type=ilike.*${encodeURIComponent(licenseType)}*`;
    
    console.log('🔍 fetchMerchantDetail API call (axios):', url);

    const response = await axios.get(url, {
      headers: getHeaders()
    });

    const data = response.data;
    return data && data.length > 0 ? data[0] : null;
  } catch (error: any) {
    console.error('❌ Error in fetchMerchantDetail:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * 📜 Fetch merchant licenses
 * 
 * @param merchantId - Merchant ID (UUID)
 * @returns Array of merchant licenses
 */
export async function fetchMerchantLicenses(merchantId: string): Promise<any[]> {
  try {
    const url = `${SUPABASE_REST_URL}/merchant_licenses?select=_id,merchant_id,license_type,license_number,issued_date,expiry_date,status,issued_by,issued_by_name,file_url,notes,created_at,updated_at&merchant_id=eq.${merchantId}`;
    
    console.log('🔍 fetchMerchantLicenses API call (axios):', url);

    const response = await axios.get(url, {
      headers: getHeaders()
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Error in fetchMerchantLicenses:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * 📋 Fetch merchant inspection results (giấy tờ kiểm tra)
 * Calls RPC function: get_merchant_inspection_results
 * 
 * @param merchantId - Merchant ID (UUID)
 * @returns Array of inspection results with document statuses
 */
export interface MerchantInspectionResult {
  _id: string; // result_id từ API
  document_type_id: string; // inspection_item (dùng làm key)
  document_type_name: string; // inspection_item
  status: 'passed' | 'failed' | 'pending';
  inspection_date?: string;
  notes?: string;
}

export async function fetchMerchantInspectionResults(
  merchantId: string
): Promise<MerchantInspectionResult[]> {
  try {
    if (!merchantId) {
      console.warn('⚠️ MerchantsAPI: Invalid merchantId for RPC call');
      return [];
    }

    const rpcUrl = `${SUPABASE_REST_URL}/rpc/get_merchant_inspection_results`;
    const requestBody = { merchant_id: merchantId };

    console.log('📤 MerchantsAPI: Calling RPC', { rpcUrl, requestBody });

    const response = await axios.post(rpcUrl, requestBody, {
      headers: getHeaders()
    });

    console.log('📥 MerchantsAPI: Response received', { 
      status: response.status, 
      statusText: response.statusText,
      hasData: !!response.data 
    });

    const data = response.data;

    console.log('📦 MerchantsAPI: Raw RPC response data:', {
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : 'N/A',
      firstItem: Array.isArray(data) && data.length > 0 ? data[0] : null,
      fullData: data
    });

    if (!data || !Array.isArray(data)) {
      console.warn('⚠️ MerchantsAPI: RPC returned invalid data:', data);
      return [];
    }

    const mapped = data.map((item: any) => {
      // 🔥 Map check_status từ string ("0"/"1"/"2") sang DocumentStatus
      let status: 'passed' | 'failed' | 'pending' = 'pending';
      const statusValue = item.check_status || item.status || item.document_status;
      
      if (typeof statusValue === 'string') {
        // API trả về string: "0" = failed, "1" = passed, "2" = pending
        const statusNum = parseInt(statusValue, 10);
        if (statusNum === 0) status = 'failed';
        else if (statusNum === 1) status = 'passed';
        else if (statusNum === 2) status = 'pending';
      } else if (typeof statusValue === 'number') {
        // API trả về số: 0 = failed, 1 = passed, 2 = pending
        if (statusValue === 0) status = 'failed';
        else if (statusValue === 1) status = 'passed';
        else if (statusValue === 2) status = 'pending';
      }

      // 🔥 Map từ API response format thực tế:
      // - result_id → _id
      // - inspection_item → document_type_id và document_type_name (dùng làm key)
      // - check_status → status
      const inspectionItem = item.inspection_item || '';
      const mappedItem = {
        _id: item.result_id || item._id || item.id || '',
        document_type_id: inspectionItem, // Dùng inspection_item làm key
        document_type_name: inspectionItem, // Dùng inspection_item làm tên hiển thị
        status: status,
        inspection_date: item.inspection_date || item.inspectionDate,
        notes: item.note || item.notes || item.notes_text || '',
      };
      console.log('🔍 Mapping item:', { 
        original: item, 
        mapped: mappedItem,
        statusValue,
        statusType: typeof statusValue,
        check_status: item.check_status
      });
      return mappedItem;
    });

    console.log('✅ MerchantsAPI: Mapped results:', mapped);
    return mapped;

  } catch (error: any) {
    console.error('❌ MerchantsAPI: Failed to fetch merchant inspection results:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

/**
 * 📝 Update inspection checklist result status
 * Updates status in map_inspection_checklist_results table
 * 
 * @param resultId - _id of the checklist result record
 * @param status - Status value: 0 (failed), 1 (passed), 2 (pending)
 * @returns Success status
 */
export async function updateInspectionChecklistResultStatus(
  resultId: string,
  status: 0 | 1 | 2
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!resultId) {
      console.warn('⚠️ MerchantsAPI: Invalid result ID');
      return { success: false, error: 'Invalid result ID' };
    }

    const url = `${SUPABASE_REST_URL}/map_inspection_checklist_results?_id=eq.${resultId}`;
    
    // 🔥 Đảm bảo status là số (int), không phải string
    const statusNumber = typeof status === 'string' 
      ? (status === 'passed' ? 1 : status === 'failed' ? 0 : 2)
      : Number(status);
    
    const requestBody = { status: statusNumber };

    console.log('📤 MerchantsAPI: Sending PATCH request', { 
      url, 
      requestBody, 
      resultId, 
      status,
      statusType: typeof statusNumber,
      statusNumber 
    });

    const response = await axios.patch(url, requestBody, {
      headers: getHeaders()
    });

    console.log('📦 MerchantsAPI: Response received', { 
      status: response.status, 
      statusText: response.statusText,
      data: response.data 
    });

    if (response.status === 200 || response.status === 204) {
      console.log('✅ MerchantsAPI: Update successful');
      return { success: true };
    }

    console.warn('⚠️ MerchantsAPI: Unexpected status', response.status);
    return { success: false, error: `Unexpected status: ${response.status}` };
  } catch (error: any) {
    console.error('❌ MerchantsAPI: Failed to update inspection result status:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      return { success: false, error: error.response.data?.message || 'Update failed' };
    }
    return { success: false, error: error.message || 'Unknown error' };
  }
}

export const fetchBusinessTypes = async () => {
  try {
    // Lấy danh sách business_type không trùng lặp
    const response = await fetch(
        `${SUPABASE_REST_URL}/merchants?select=business_type`,
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Content-Type': 'application/json'
          }
        }
    );
    const data = await response.json();

    // Lọc lấy các giá trị duy nhất và bỏ qua null/empty
    const types = [...new Set(data.map((m: any) => m.business_type))]
        .filter(Boolean) as string[];

    return { data: types, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};
