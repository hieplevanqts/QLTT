// API functions for stores (merchants table)
// Fetch stores data from Supabase REST API and map to Store interface

import { Store } from '../../data/mockStores';
import { SUPABASE_REST_URL, getHeaders } from './config';

/**
 * Map risk level from API (number) to Store interface (string)
 * API: risk_level is 0, 1, 2, 3 or null
 * Store: 'low' | 'medium' | 'high' | 'none'
 */
function mapRiskLevel(riskLevel: number | null | undefined): 'low' | 'medium' | 'high' | 'none' {
  if (!riskLevel) return 'none';
  switch (riskLevel) {
    case 1:
      return 'high';
    case 2:
      return 'medium';
    case 3:
      return 'low';
    default:
      return 'none';
  }
}

/**
 * Map status from API to FacilityStatus
 * API: 'active', 'pending', 'suspended', 'rejected', 'refuse'
 */
function mapStatus(status: string | null | undefined) {
  if (!status) return 'pending';
  // Map database aliases to frontend-supported statuses
  const statusAliases: Record<string, string> = {
    'inactive': 'refuse',
    'cancelled': 'refuse',
    'underInspection': 'processing',
    'declined': 'rejected',
  };

  const mappedStatus = statusAliases[status] || status;
  const validStatuses = ['active', 'pending', 'suspended', 'rejected', 'refuse', 'processing'];
  return validStatuses.includes(mappedStatus) ? mappedStatus : 'pending';
}

/**
 * 🏪 Fetch stores from merchants table via Supabase REST API
 * Maps merchant data to Store interface
 * 
 * @param limit - Maximum number of records to fetch
 * @param offset - Pagination offset
 * @param filters - Optional filters (status, province_id, district, businessType, etc.)
 * @returns Array of stores mapped from merchants data
 */
export async function fetchStores(
  limit: number = 20,
  offset: number = 0,
  filters?: {
    status?: string;
    province_id?: string;
    district?: string;
    businessType?: string;
    hasViolations?: boolean;
    hasComplaints?: boolean;
    riskLevel?: string;
    search?: string;
  },
  department_path?: string,
): Promise<{ data: Store[]; total: number }> {
  try {
    // Build base URL with pagination (supports unlimited records)
    // Join with wards table to get ward name
    // let url = `${SUPABASE_REST_URL}/merchants?limit=${limit}&offset=${offset}&order=created_at.desc&select=*,wards(_id,name)`;
    let url = `${SUPABASE_REST_URL}/merchant_filter_view_ext?limit=${limit}&offset=${offset}&order=created_at.desc&select=*,wards(_id,name)&department_path=like.${encodeURIComponent(department_path)}*`;

    // Apply filters if provided
    if (filters?.status) {
      url += `&status=eq.${encodeURIComponent(filters.status)}`;
    }
    // Filter by province_id (UUID field)
    if (filters?.province_id) {
      url += `&province_id=eq.${encodeURIComponent(filters.province_id)}`;
    }
    if (filters?.district) {
      url += `&district=eq.${encodeURIComponent(filters.district)}`;
    }
    if (filters?.businessType) {
      url += `&business_type=eq.${encodeURIComponent(filters.businessType)}`;
    }

    // Risk level filter (if needed)
    if (filters?.riskLevel && filters.riskLevel !== 'all') {
      const riskLevelNum = filters.riskLevel === 'high' ? 1 : filters.riskLevel === 'medium' ? 2 : 3;
      url += `&risk_level=eq.${riskLevelNum}`;
    }

    // Search filter - searches business_name, tax_code, and address simultaneously
    if (filters?.search) {
      const searchTerms = encodeURIComponent(`*${filters.search}*`);
      url += `&or=(business_name.ilike.${searchTerms},tax_code.ilike.${searchTerms},address.ilike.${searchTerms})`;
    }

    // Department path filter (Supabase 'like' syntax expected in caller)
    // if (filters?.department_path) {
    //   url += `&department_path=${encodeURIComponent(filters.department_path)}`;
    // }

    // Fetch from API
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getHeaders(),
        'Prefer': 'count=exact'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const total = parseInt(response.headers.get('content-range')?.split('/')?.[1] || '0', 10);

    if (filters?.province_id) {
    }

    // Map merchant data to Store interface
    const stores: Store[] = data.map((merchant: any, index: number): Store => {
      // Get numeric ID from merchant id (UUID)
      const numericId = parseInt(merchant.id.split('-')[0], 16) % 100000000 || index;

      // Parse GPS coordinates
      const latitude = parseFloat(merchant.latitude) || undefined;
      const longitude = parseFloat(merchant.longitude) || undefined;
      const gpsCoordinates =
        latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : undefined;

      // Create Store object
      const store: Store = {
        // Basic info
        id: numericId,
        merchantId: merchant._id, // UUID from database
        name: merchant.business_name || 'Unnamed Store',
        address: merchant.address || '',
        type: merchant.business_type || 'Chưa xác định',

        // Status & Risk
        status: mapStatus(merchant.status) as any,
        riskLevel: mapRiskLevel(merchant.risk_level),

        // Location
        province: merchant.province || 'TP. Hồ Chí Minh',
        provinceCode: merchant.province_id || '',
        jurisdiction: merchant.district || 'Quận 1',
        jurisdictionCode: merchant.province_id || '',
        ward: merchant.wards?.name || '',  // Get ward name from joined wards table
        wardCode: merchant.ward_id || '',
        managementUnit: `Chi cục QLTT ${merchant.district || 'Quận 1'}`,

        // GPS
        latitude,
        longitude,
        gpsCoordinates,

        // Business Info
        taxCode: merchant.tax_code || '',
        businessType: merchant.business_type || '',
        ownerName: merchant.owner_name || '',
        ownerPhone: merchant.owner_phone || '',
        ownerPhone2: merchant.owner_phone_2 || '',
        ownerBirthYear: merchant.owner_birth_year,
        ownerIdNumber: merchant.owner_identity_no || '',
        ownerEmail: merchant.owner_email || '',
        businessPhone: merchant.business_phone || '',
        email: merchant.business_email || '',
        website: merchant.website || '',
        fax: merchant.fax || '',
        businessArea: merchant.store_area?.toString() || '',
        area_name: merchant.store_area?.toString() || '',
        notes: merchant.note || '',

        // Last inspection
        lastInspection: merchant.last_inspection ? new Date(merchant.last_inspection).toLocaleDateString('vi-VN') : 'Chưa kiểm tra',

        // Verification & flags
        isVerified: merchant.verified || false,

        // Compatibility fields
        phone: merchant.owner_phone || '',
        district: merchant.district || '',

        // Additional from API
        establishedDate: merchant.established_date || '',
        operationStatus: 'Đang hoạt động',
        sourceType: 'import',
      };

   

      return store;
    });

    return { data: stores, total };
  } catch (error: any) {
    throw error;
  }
}

/**
 * 📊 Fetch store statistics
 * @param filters - Optional filters
 * @returns Statistics object with counts by status
 */
export async function fetchStoresStats(filters?: {
  district?: string;
}): Promise<{
  total: number;
  active: number;
  pending: number;
  suspended: number;
  closed: number;
  rejected: number;
}> {
  try {
    // Build URL with simple select to count by status
    let url = `${SUPABASE_REST_URL}/merchants?select=status`;

    if (filters?.district) {
      url += `&district=eq.${encodeURIComponent(filters.district)}`;
    }

    // Optimization: Just get counts by status using count=exact and limit=0
    const fetchStatusCount = async (status: string) => {
      const statusUrl = `${SUPABASE_REST_URL}/merchants?select=*&status=eq.${status}&limit=1`;
      const res = await fetch(statusUrl, {
        method: 'GET',
        headers: { ...getHeaders(), 'Prefer': 'count=exact' },
      });
      const range = res.headers.get('content-range');
      return parseInt(range?.split('/')?.[1] || '0', 10);
    };

    const fetchTotalCount = async () => {
      const totalUrl = `${SUPABASE_REST_URL}/merchants?select=*&limit=1`;
      const res = await fetch(totalUrl, {
        method: 'GET',
        headers: { ...getHeaders(), 'Prefer': 'count=exact' },
      });
      const range = res.headers.get('content-range');
      return parseInt(range?.split('/')?.[1] || '0', 10);
    };

    const [total, active, pending, suspended, refuse, rejected] = await Promise.all([
      fetchTotalCount(),
      fetchStatusCount('active'),
      fetchStatusCount('pending'),
      fetchStatusCount('suspended'),
      fetchStatusCount('refuse'),
      fetchStatusCount('rejected'),
    ]);


    return {
      total,
      active,
      pending,
      suspended,
      refuse,
      rejected,
    };
  } catch (error: any) {
    // Return default stats on error
    return {
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
      refuse: 0,
      rejected: 0,
    };
  }
}

/**
 * 🔍 Get a single store by ID
 */
export async function fetchStoreById(storeId: string | number): Promise<Store | null> {
  try {
    const url = `${SUPABASE_REST_URL}/merchants?_id=eq.${storeId}&select=*&limit=1`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store: ${response.status}`);
    }

    const data = await response.json();
    if (!data || data.length === 0) {
      return null;
    }

    const merchant = data[0];
    const numericId = parseInt(merchant.id.split('-')[0], 16) % 100000000 || 0;

    const latitude = parseFloat(merchant.latitude) || undefined;
    const longitude = parseFloat(merchant.longitude) || undefined;

    return {
      id: numericId,
      merchantId: merchant._id,  // 🔴 CRITICAL: UUID for API updates
      name: merchant.business_name || '',
      address: merchant.address || '',
      type: merchant.business_type || '',
      status: mapStatus(merchant.status) as any,
      riskLevel: mapRiskLevel(merchant.risk_level),
      area_name: merchant.store_area?.toString() || '',
      province: merchant.province || '',
      provinceCode: merchant.province_id || '',
      jurisdiction: merchant.district || '',
      jurisdictionCode: merchant.province_id || '',
      ward: merchant.ward || '',
      wardCode: merchant.ward_id || '',
      managementUnit: `Chi cục QLTT ${merchant.district || 'Quận 1'}`,
      latitude,
      longitude,
      gpsCoordinates: latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : undefined,
      taxCode: merchant.tax_code || '',
      businessType: merchant.business_type || '',
      ownerName: merchant.owner_name || '',
      ownerPhone: merchant.owner_phone || '',
      businessPhone: merchant.business_phone || '',
      email: merchant.business_email || '',
      website: merchant.website || '',
      fax: merchant.fax || '',
      lastInspection: merchant.last_inspection ? new Date(merchant.last_inspection).toLocaleDateString('vi-VN') : 'Chưa kiểm tra',
      isVerified: merchant.verified || false,
      phone: merchant.owner_phone || '',
      district: merchant.district || '',
    };
  } catch (error: any) {
    return null;
  }
}

/**
 * 🆕 Create a new merchant via RPC function
 * @param data - Merchant data matching create_merchant_full RPC parameters
 * @returns Created merchant data
 */
export async function createMerchant(data: {
  p_business_name: string;
  p_owner_name: string;
  p_owner_phone: string;
  p_license_status?: string;
  p_tax_code: string;
  p_business_type: string;
  p_province_id: string | null;
  p_ward_id: string | null;
  p_address: string;
  p_latitude: number;
  p_longitude: number;
  p_status?: string;
  p_established_date?: string;
  p_fax?: string;
  p_department_id: string;
  p_note?: string;
  p_business_phone?: string;
  p_business_email?: string;
  p_website?: string;
  p_store_area?: number;
  p_owner_phone_2?: string;
  p_owner_birth_year?: number;
  p_owner_identity_no?: string;
  p_owner_email?: string | null;
}): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/create_merchant_full`;


    // Create payload with ALL parameters - convert undefined to null for RPC
    const payload = {
      p_business_name: data.p_business_name,
      p_owner_name: data.p_owner_name,
      p_owner_phone: data.p_owner_phone,
      p_license_status: data.p_license_status || 'valid',
      p_tax_code: data.p_tax_code,
      p_business_type: data.p_business_type,
      p_province_id: data.p_province_id,
      p_ward_id: data.p_ward_id,
      p_address: data.p_address,
      p_latitude: data.p_latitude,
      p_longitude: data.p_longitude,
      p_status: data.p_status || 'pending',
      p_established_date: data.p_established_date || null,
      p_fax: data.p_fax || null,
      p_department_id: data.p_department_id,
      p_note: data.p_note || null,
      p_business_phone: data.p_business_phone || null,
      p_business_email: data.p_business_email || null,
      p_website: data.p_website || null,
      p_store_area: data.p_store_area || null,
      p_owner_phone_2: data.p_owner_phone_2 || null,
      p_owner_birth_year: data.p_owner_birth_year || null,
      p_owner_identity_no: data.p_owner_identity_no || null,
      p_owner_email: data.p_owner_email || null,
    };


    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
     
      throw new Error(
        `Failed to create merchant: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();

    return result;
  } catch (error: any) {
    throw error;
  }
}

/**
 * 📝 Update merchant via update_merchant_full RPC
 * @param merchantId - The merchant UUID to update
 * @param data - Updated merchant data
 * @returns Updated merchant data
 */
export async function updateMerchant(
  merchantId: string,
  data: {
    p_business_name?: string;
    p_owner_name?: string;
    p_owner_phone?: string;
    p_license_status?: string;
    p_tax_code?: string;
    p_business_type?: string;
    p_province_id?: string;
    p_ward_id?: string;
    p_address?: string;
    p_latitude?: number;
    p_longitude?: number;
    p_status?: string;
    p_established_date?: string;
    p_fax?: string;
    p_department_id?: string;
    p_note?: string;
    p_business_phone?: string;
    p_business_email?: string;
    p_website?: string;
    p_store_area?: number;
    p_owner_phone_2?: string;
    p_owner_birth_year?: number;
    p_owner_identity_no?: string;
    p_owner_email?: string;
  }
): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/update_merchant_full`;


    // Create payload with merchant_id and all parameters
    const payload = {
      p_address: data.p_address ?? null,
      p_business_email: data.p_business_email ?? null,
      p_business_name: data.p_business_name ?? null,
      p_business_phone: data.p_business_phone ?? null,
      p_business_type: data.p_business_type ?? null,
      p_department_id: data.p_department_id ?? null,
      p_established_date: data.p_established_date ?? null,
      p_fax: data.p_fax ?? null,
      p_latitude: data.p_latitude ?? null,
      p_license_status: data.p_license_status ?? 'valid',
      p_longitude: data.p_longitude ?? null,
      p_merchant_id: merchantId,
      p_note: data.p_note ?? null,
      p_owner_birth_year: data.p_owner_birth_year ?? null,
      p_owner_email: data.p_owner_email ?? null,
      p_owner_identity_no: data.p_owner_identity_no ?? null,
      p_owner_name: data.p_owner_name ?? null,
      p_owner_phone: data.p_owner_phone ?? null,
      p_owner_phone_2: data.p_owner_phone_2 ?? null,
      p_province_id: data.p_province_id ?? null,
      p_status: data.p_status ?? 'active',
      p_store_area: data.p_store_area ?? null,
      p_tax_code: data.p_tax_code ?? null,
      p_ward_id: data.p_ward_id ?? null,
      p_website: data.p_website ?? null,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(
        `Failed to update merchant: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();


    return result;
  } catch (error: any) {
    
    throw error;
  }
}

/**
 * ⚡ Update only the merchant status via specialized RPC
 * @param merchantId - The merchant UUID to update
 * @param status - New status ('active', 'pending', 'suspended', 'rejected', 'refuse')
 *                 Note: Backend constraint allows these 5 statuses. 'refuse' = permanently closed
 * @returns Result from API
 */
export async function updateMerchantStatus(
  merchantId: string,
  status: string
): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/update_merchant_status`;

    // Validate status on client side before sending to API
    const validStatuses = ['active', 'pending', 'suspended', 'rejected', 'refuse'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }


    // Normalize older 'closed' value to new 'refuse'
    const normalizedStatus = status === 'closed' ? 'refuse' : status;

    const payload = {
      p_merchant_id: merchantId,
      p_status: normalizedStatus,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
     
      throw new Error(`Failed to update merchant status: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    
    return result;
  } catch (error: any) {
    throw error;
  }
}

/**
 * 📄 Fetch merchant licenses (legal documents) by merchant ID
 * @param merchantId - The merchant UUID
 * @returns Array of legal documents/licenses
 */
export async function fetchMerchantLicenses(merchantId: string): Promise<any[]> {
  try {
    const url = `${SUPABASE_REST_URL}/merchant_licenses?merchant_id=eq.${merchantId}&order=license_type.asc,created_at.desc,_id.desc&limit=100`;

    console.log('📄 [fetchMerchantLicenses] Fetching licenses for merchant:', merchantId);

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch merchant licenses: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return data;
  } catch (error: any) {
    console.error('❌ [fetchMerchantLicenses] Error:', {
      merchant_id: merchantId,
      error_message: error.message,
    });
    // Return empty array on error instead of throwing
    return [];
  }
}
/**
 * 📝 Upsert a merchant license via RPC
 * @param data - License data matching upsert_merchant_license RPC parameters
 * @returns Result from API
 */
export async function upsertMerchantLicense(data: {
  p_merchant_id: string;
  p_license_type: string;
  p_license_number: string;
  p_issued_date?: string;
  p_expiry_date?: string;
  p_approval_status: number;
  p_status: string;
  p_issued_by?: string;
  p_issued_by_name?: string;
  p_file_url?: string;
  p_file_url_2?: string;
  p_notes?: string;
  p_holder_name?: string;
  p_permanent_address?: string;
  p_business_field?: string;
  p_activity_scope?: string;
  p_lessor_name?: string;
  p_lessee_name?: string;
  p_rent_price_monthly?: number;
  p_rent_start_date?: string;
  p_rent_end_date?: string;
  p_property_address?: string;
  p_inspection_result?: string;
  p_validity_status?: number;
}): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/upsert_merchant_license`;

    const body = JSON.stringify(data);
    console.log('📦 [upsertMerchantLicense] Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`Failed to upsert merchant license: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
   
    return result;
  } catch (error: any) {
    
    throw error;
  }
}
