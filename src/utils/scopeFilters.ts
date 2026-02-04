import { QLTTScope } from '../contexts/QLTTScopeContext';

/**
 * Interface cho entities có thông tin địa bàn
 */
export interface ScopedEntity {
  provinceCode?: string | null;
  wardCode?: string | null;
  jurisdiction?: string; // Fallback for legacy data
}

/**
 * Lọc dữ liệu theo scope địa bàn
 * 
 * @param data - Mảng dữ liệu cần lọc
 * @param scope - Scope hiện tại từ QLTTScopeContext
 * @returns Mảng dữ liệu đã được lọc theo scope
 */
export function filterByScope<T extends ScopedEntity>(
  data: T[],
  scope: QLTTScope
): T[] {
  // Nếu scope là "Toàn quốc" (province = null), trả về toàn bộ dữ liệu
  if (!scope.province) {
    return data;
  }

  // Lọc theo province
  let filtered = data.filter(item => {
    // Nếu item có provinceCode, so sánh trực tiếp
    if (item.provinceCode) {
      return item.provinceCode === scope.province;
    }
    
    // Fallback: nếu không có provinceCode nhưng có jurisdiction
    // (để tương thích với dữ liệu cũ)
    // TODO: Remove this fallback when all data has provinceCode/wardCode
    return true;
  });

  // Nếu có ward được chọn, lọc thêm theo ward
  if (scope.ward) {
    filtered = filtered.filter(item => {
      if (item.wardCode) {
        return item.wardCode === scope.ward;
      }
      return true;
    });
  }

  return filtered;
}

/**
 * Map jurisdiction text sang province code
 * Hàm này chỉ dùng tạm cho mock data, production sẽ có provinceCode từ database
 */
export function jurisdictionToProvinceCode(jurisdiction: string): string | null {
  // Map các Phường của Hà Nội
  const hcmDistricts = [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
    'Phường 11', 'Phường 12', 'Thủ Đức', 'Bình Thạnh',
    'Tân Bình', 'Tân Phú', 'Phú Nhuận', 'Gò Vấp', 'Bình Tân'
  ];

  if (hcmDistricts.includes(jurisdiction)) {
    return '79'; // Mã tỉnh Hà Nội
  }

  // Map các Phường của Hà Nội
  const hanoiDistricts = [
    'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên',
    'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai',
    'Thanh Xuân', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Hà Đông'
  ];

  if (hanoiDistricts.includes(jurisdiction)) {
    return '01'; // Mã tỉnh Hà Nội
  }

  return null;
}

/**
 * Enrich mock data với provinceCode và wardCode
 * Hàm này sẽ thêm provinceCode/wardCode vào dữ liệu cũ dựa trên jurisdiction
 */
export function enrichWithScopeData<T extends ScopedEntity>(items: T[]): T[] {
  return items.map(item => {
    // Nếu đã có provinceCode, không cần enrich
    if (item.provinceCode) {
      return item;
    }

    // Thêm provinceCode dựa trên jurisdiction
    const provinceCode = item.jurisdiction 
      ? jurisdictionToProvinceCode(item.jurisdiction)
      : null;

    return {
      ...item,
      provinceCode,
      // wardCode có thể map sau nếu cần
    };
  });
}
