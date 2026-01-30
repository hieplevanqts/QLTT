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
 * API: 'active', 'pending', 'suspended', 'rejected', 'closed'
 */
function mapStatus(status: string | null | undefined) {
  if (!status) return 'pending';
  const validStatuses = ['active', 'pending', 'suspended', 'rejected', 'closed'];
  return validStatuses.includes(status) ? status : 'pending';
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
  limit: number = 10000,
  offset: number = 0,
  filters?: {
    status?: string;
    province_id?: string;
    district?: string;
    businessType?: string;
    hasViolations?: boolean;
    hasComplaints?: boolean;
    riskLevel?: string;
  }
): Promise<Store[]> {
  try {
    // Build base URL with pagination (supports unlimited records)
    let url = `${SUPABASE_REST_URL}/merchants?limit=${limit}&offset=${offset}&order=created_at.desc&select=*`;

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

    // Fetch from API
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Fetch stores failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(`Failed to fetch stores: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Fetched merchants data:', data.length, 'records');
    if (filters?.province_id) {
      console.log('📍 Filtered by province_id:', filters.province_id);
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
        ward: merchant.ward || '',
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

      // Debug log for first record
      if (index === 0) {
        console.log('✅ First store mapped:', {
          business_name: merchant.business_name,
          owner_name: merchant.owner_name,
          owner_phone: merchant.owner_phone,
          status: merchant.status,
          mapped_to: {
            name: store.name,
            ownerName: store.ownerName,
            ownerPhone: store.ownerPhone,
            status: store.status,
          },
        });
      }

      return store;
    });

    console.log('✅ Successfully mapped', stores.length, 'stores');
    return stores;
  } catch (error: any) {
    console.error('❌ Error fetching stores:', error);
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

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch store stats: ${response.status}`);
    }

    const data = await response.json();

    // Count by status
    const total = data.length;
    const active = data.filter((m: any) => m.status === 'active').length;
    const pending = data.filter((m: any) => m.status === 'pending').length;
    const suspended = data.filter((m: any) => m.status === 'suspended').length;
    const closed = data.filter((m: any) => m.status === 'closed').length;
    const rejected = data.filter((m: any) => m.status === 'rejected').length;

    console.log('✅ Store stats:', { total, active, pending, suspended, closed, rejected });

    return {
      total,
      active,
      pending,
      suspended,
      closed,
      rejected,
    };
  } catch (error: any) {
    console.error('❌ Error fetching store stats:', error);
    // Return default stats on error
    return {
      total: 0,
      active: 0,
      pending: 0,
      suspended: 0,
      closed: 0,
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

    console.log('✅ [fetchStoreById] API returned merchant:', {
      url_query_id: storeId,
      merchant_id_uuid: merchant._id,
      business_name: merchant.business_name,
      numeric_id: numericId,
      timestamp: new Date().toISOString(),
    });

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
    console.error('❌ Error fetching store by ID:', error);
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
  p_province_id: string;
  p_ward_id: string;
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
  p_owner_email?: string;
}): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/create_merchant_full`;

    console.log('📤 Creating merchant with data:', data);

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

    console.log('📤 Complete payload with all parameters:', payload);

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Create merchant failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      throw new Error(
        `Failed to create merchant: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();
    console.log('✅ Merchant created successfully:', result);

    return result;
  } catch (error: any) {
    console.error('❌ Error creating merchant:', error);
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
    p_validity_status?: number;
    p_approval_status?: number;
  }
): Promise<any> {
  try {
    const url = `${SUPABASE_REST_URL}/rpc/update_merchant_full`;

    console.log('� [updateMerchant] Calling API:', {
      merchant_id: merchantId,
      endpoint: '/rpc/update_merchant_full',
      fields_updating: Object.keys(data).filter(k => data[k as keyof typeof data] !== undefined).length,
      timestamp: new Date().toISOString(),
    });

    // Create payload with merchant_id and all parameters
    const payload = {
      p_merchant_id: merchantId,
      p_business_name: data.p_business_name || null,
      p_owner_name: data.p_owner_name || null,
      p_owner_phone: data.p_owner_phone || null,
      p_license_status: data.p_license_status || 'valid',
      p_tax_code: data.p_tax_code || null,
      p_business_type: data.p_business_type || null,
      p_province_id: data.p_province_id || null,
      p_ward_id: data.p_ward_id || null,
      p_address: data.p_address || null,
      p_latitude: data.p_latitude || null,
      p_longitude: data.p_longitude || null,
      p_status: data.p_status || 'active',
      p_established_date: data.p_established_date || null,
      p_fax: data.p_fax || null,
      p_department_id: data.p_department_id || null,
      p_note: data.p_note || null,
      p_business_phone: data.p_business_phone || null,
      p_business_email: data.p_business_email || null,
      p_website: data.p_website || null,
      p_store_area: data.p_store_area || null,
      p_owner_phone_2: data.p_owner_phone_2 || null,
      p_owner_birth_year: data.p_owner_birth_year || null,
      p_owner_identity_no: data.p_owner_identity_no || null,
      p_owner_email: data.p_owner_email || null,
      p_approval_status: data.p_approval_status || null,
      p_validity_status: data.p_validity_status || null,
    };

    console.log('📤 [updateMerchant] Request payload:', {
      p_merchant_id: payload.p_merchant_id,
      p_business_name: payload.p_business_name,
      p_owner_name: payload.p_owner_name,
      p_province_id: payload.p_province_id,
      p_ward_id: payload.p_ward_id,
      timestamp: new Date().toISOString(),
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [updateMerchant] API error:', {
        merchant_id: merchantId,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        timestamp: new Date().toISOString(),
      });
      throw new Error(
        `Failed to update merchant: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const result = await response.json();

    console.log('✅ [updateMerchant] Success response:', {
      merchant_id: merchantId,
      result: result,
      timestamp: new Date().toISOString(),
    });

    return result;
  } catch (error: any) {
    console.error('❌ [updateMerchant] Error:', {
      merchant_id: merchantId,
      error_message: error.message,
      timestamp: new Date().toISOString(),
    });
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
      console.error('❌ [fetchMerchantLicenses] API error:', {
        merchant_id: merchantId,
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      throw new Error(`Failed to fetch merchant licenses: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    console.log('✅ [fetchMerchantLicenses] Fetched licenses:', {
      merchant_id: merchantId,
      count: data.length,
      types: data.map((l: any) => l.license_type),
    });

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

    console.log('📤 [upsertMerchantLicense] Calling API:', {
      endpoint: '/rpc/upsert_merchant_license',
      payload: data,
    });

    const body = JSON.stringify(data);
    console.log('📦 [upsertMerchantLicense] Request body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [upsertMerchantLicense] API error:', {
        status: response.status,
        error: errorText,
      });
      throw new Error(`Failed to upsert merchant license: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const result = await response.json();
    console.log('✅ [upsertMerchantLicense] Success:', result);
    return result;
  } catch (error: any) {
    console.error('❌ [upsertMerchantLicense] Error:', error);
    throw error;
  }
}
