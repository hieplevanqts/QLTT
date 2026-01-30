/**
 * Point Status API - Fetch từ bảng point_status
 * Dùng cho MapLegend và MapFilterPanel
 */

import { FEATURES } from '@/constants/features';
import { apiKey, SUPABASE_REST_URL } from './config';

/**
 * Point Status Interface
 */
export interface PointStatus {
  id: string;
  name: string;          // Tên hiển thị (VD: "Đã kiểm tra")
  code: string;          // Code (VD: "inspected")
  color?: string;        // Màu hex (OPTIONAL - dùng hardcoded colorMap trong components)
  description?: string;  // Mô tả (optional)
  icon?: string;         // Icon name (optional)
  order?: number;        // Thứ tự hiển thị (optional)
  isActive?: boolean;    // Trạng thái active (optional)
}

/**
 * Default/fallback statuses nếu không lấy được từ backend
 * ⚠️ NOTE: Không set color ở đây - components sẽ dùng hardcoded colorMap
 */
const DEFAULT_STATUSES: PointStatus[] = [
  {
    id: '1',
    code: 'certified',
    name: 'Chứng nhận ATTP',
    description: 'Đạt chứng nhận an toàn thực phẩm',
    order: 1,
    isActive: true,
  },
  {
    id: '2',
    code: 'hotspot',
    name: 'Điểm nóng',
    description: 'Có phản ánh từ người dân',
    order: 2,
    isActive: true,
  },
  {
    id: '3',
    code: 'scheduled',
    name: 'Lên lịch kiểm tra',
    description: 'Đã lên lịch kiểm tra',
    order: 3,
    isActive: true,
  },
  {
    id: '4',
    code: 'inspected',
    name: 'Đã kiểm tra',
    description: 'Đã kiểm tra cơ bản',
    order: 4,
    isActive: true,
  },
];

/**
 * Map database status codes to standardized app codes
 * Database may use different codes (PASS, DANGER, PLAN, CHECKED, or numeric 1,2,3,4)
 * App uses: certified, hotspot, scheduled, inspected
 */
function mapStatusCode(dbCode: string | number): string {
  if (!dbCode) return 'inspected';
  
  const code = String(dbCode).toUpperCase();
  
  // Map DB codes to app codes
  if (code === 'PASS' || code === 'CERTIFIED' || code === '1') return 'certified';
  if (code === 'DANGER' || code === 'HOTSPOT' || code === 'ALERT' || code === '2') return 'hotspot';
  if (code === 'PLAN' || code === 'SCHEDULED' || code === 'SCHEDULE' || code === '3') return 'scheduled';
  if (code === 'CHECKED' || code === 'INSPECTED' || code === 'INSPECT' || code === '4') return 'inspected';
  
  // Default fallback
  return 'inspected';
}

/**
 * Fetch point statuses from Supabase
 */
export async function fetchPointStatuses(): Promise<PointStatus[]> {
  // If Supabase is disabled, return default statuses
  if (!FEATURES.USE_SUPABASE_BACKEND) {
    return DEFAULT_STATUSES;
  }

  try {

    const baseUrl = SUPABASE_REST_URL;
    const endpoint = `${baseUrl}/point_status`;

    // Build query params
    const params = new URLSearchParams({
      select: '*',
      limit: '100',
    });

    const url = `${endpoint}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // 🔥 Transform Supabase data to PointStatus format
    // ⚠️ NOTE: color KHÔNG lấy từ DB - sẽ dùng hardcoded colorMap trong components
    const statuses: PointStatus[] = data.map((item: any, index: number) => {
      const originalCode = item.code || item.status_code || 'inspected';
      const mappedCode = mapStatusCode(originalCode);
      
      if (index < 3) {
      }
      
      return {
        id: item.id || item._id || String(item.order || Math.random()),
        code: mappedCode,
        name: item.name || item.status_name || 'Không rõ',
        // color: KHÔNG set từ DB - components sẽ dùng hardcoded colorMap
        description: item.description || item.status_description || undefined,
        icon: item.icon || item.status_icon || undefined,
        order: typeof item.order === 'number' ? item.order : undefined,
        isActive: item.is_active !== undefined ? item.is_active : true,
      };
    });

    // Filter only active statuses
    const activeStatuses = statuses.filter(s => s.isActive !== false);

    if (activeStatuses.length === 0) {
      return DEFAULT_STATUSES;
    }

    return activeStatuses;

  } catch (error: any) {
    console.error('❌ Failed to fetch point statuses:', error.message);
    return DEFAULT_STATUSES;
  }
}

/**
 * Get status by code
 */
export function getStatusByCode(statuses: PointStatus[], code: string): PointStatus | undefined {
  return statuses.find(s => s.code === code);
}

/**
 * Get color by status code
 */
export function getColorByCode(statuses: PointStatus[], code: string): string {
  const status = getStatusByCode(statuses, code);
  return status?.color || '#005cb6';  // Default MAPPA blue
}

/**
 * Build filter object from statuses
 * Returns object like { certified: false, hotspot: true, ... }
 * 🔥 DEFAULT: Only hotspot status enabled on initial load
 */
export function buildFilterObjectFromStatuses(statuses: PointStatus[]): { [key: string]: boolean } {
  const filters: { [key: string]: boolean } = {};
  // Find hotspot status index
  const hotspotIndex = statuses.findIndex(s => s.code === 'hotspot');
  const defaultIndex = hotspotIndex >= 0 ? hotspotIndex : 0;  // Use hotspot if found, else first status
  statuses.forEach((status, index) => {
    filters[status.code] = index === defaultIndex;  // 🔥 Only hotspot (or first) enabled by default
  });
  return filters;
}
