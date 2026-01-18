import { Store } from '../data/mockStores';
import { FacilityStatus } from '../ui-kit/FacilityStatusBadge';

/**
 * Export stores data to CSV file
 * Follows QLTT specification with 13 columns
 */

// Status mapping for CSV export
const STATUS_MAP: Record<FacilityStatus, string> = {
  active: 'Hoạt động',
  pending: 'Chờ duyệt',
  suspended: 'Tạm ngừng',
  closed: 'Ngừng hoạt động',
  rejected: 'Từ chối phê duyệt',
};

/**
 * Convert a value to CSV-safe string
 */
function toCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, newline, or double quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Format date to DD/MM/YYYY
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Generate store code from ID
 */
function generateStoreCode(store: Store): string {
  // Format: CH-YYYYMMDD-XXXXX
  // CH = Cửa hàng, YYYYMMDD = today, XXXXX = padded ID
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  const paddedId = store.id.toString().padStart(5, '0');
  
  return `CH-${year}${month}${day}-${paddedId}`;
}

/**
 * Export stores to CSV with specification format
 */
export function exportStoresToCSV(stores: Store[], filename: string = 'danh-sach-cua-hang.csv'): void {
  // Define CSV headers (13 columns)
  const headers = [
    'Mã cửa hàng',
    'Tên cửa hàng',
    'Chủ hộ / Người đại diện',
    'Mã số thuế',
    'Số điện thoại',
    'Tỉnh / Thành phố',
    'Phường / Xã',
    'Địa chỉ chi tiết',
    'Ngành hàng chính',
    'Trạng thái hoạt động',
    'Đơn vị quản lý',
    'Ngày tạo',
    'Ngày cập nhật gần nhất',
  ];

  // Create CSV rows
  const rows = stores.map(store => {
    const storeCode = generateStoreCode(store);
    const storeName = store.name || '';
    const ownerName = store.ownerName || '';
    const taxCode = store.taxCode || '';
    const phone = store.phone || store.businessPhone || store.ownerPhone || '';
    
    // Extract province from address
    let province = store.province || '';
    if (!province && store.address) {
      // Try to extract from address (e.g., "123 Street, District, TP.HCM")
      const addressParts = store.address.split(',');
      if (addressParts.length >= 3) {
        province = addressParts[addressParts.length - 1].trim();
      } else {
        province = 'TP. Hồ Chí Minh';
      }
    }
    
    // Ward/Commune (Phường/Xã)
    const ward = store.ward || '';
    
    // Detailed address (Street address without province)
    let detailedAddress = store.address || '';
    if (detailedAddress.includes(',')) {
      const parts = detailedAddress.split(',');
      detailedAddress = parts.slice(0, -1).join(',').trim();
    }
    
    // Main industry (Ngành hàng chính)
    const industry = store.industryName || store.type || store.businessType || '';
    
    // Operation status
    const status = STATUS_MAP[store.status] || store.status;
    
    // Management unit
    const managementUnit = store.managementUnit || `Chi cục QLTT ${store.jurisdiction}`;
    
    // Created date (mock - use current date for demo)
    const createdDate = formatDate(new Date().toISOString());
    
    // Last updated date (mock - use current date for demo)
    const updatedDate = formatDate(new Date().toISOString());

    return [
      storeCode,
      storeName,
      ownerName,
      taxCode,
      phone,
      province,
      ward,
      detailedAddress,
      industry,
      status,
      managementUnit,
      createdDate,
      updatedDate,
    ].map(toCSVValue);
  });

  // Combine headers and rows
  const csvLines = [
    headers.map(toCSVValue).join(','),
    ...rows.map(row => row.join(',')),
  ];

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const csvContent = BOM + csvLines.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generate reference data CSV (Sheet 2 equivalent)
 * This creates a separate CSV file with reference data
 */
export function exportReferenceDataCSV(filename: string = 'danh-muc-tham-chieu.csv'): void {
  // Define reference data
  const industryList = [
    'Thực phẩm',
    'ồ uống',
    'Mỹ phẩm',
    'Dược phẩm',
    'Thời trang',
    'Điện tử',
    'Nội thất',
    'Xây dựng',
    'Ô tô - Xe máy',
    'Dịch vụ',
  ];

  const statusList = [
    'Hoạt động',
    'Chờ duyệt',
    'Tạm ngưng',
    'Ngừng hoạt động',
  ];

  const managementUnitList = [
    'Chi cục QLTT Quận 1',
    'Chi cục QLTT Quận 2',
    'Chi cục QLTT Quận 3',
    'Chi cục QLTT Quận 4',
    'Chi cục QLTT Quận 5',
    'Chi cục QLTT Quận 6',
    'Chi cục QLTT Quận 7',
    'Chi cục QLTT Quận 8',
    'Chi cục QLTT Quận 9',
    'Chi cục QLTT Quận 10',
    'Chi cục QLTT Quận 11',
    'Chi cục QLTT Quận 12',
    'Chi cục QLTT Thủ Đức',
    'Chi cục QLTT Bình Thạnh',
    'Chi cục QLTT Tân Bình',
    'Chi cục QLTT Tân Phú',
    'Chi cục QLTT Phú Nhuận',
    'Chi cục QLTT Gò Vấp',
    'Chi cục QLTT Bình Tân',
  ];

  const notes = [
    'Hướng dẫn nhập dữ liệu:',
    '- Không để trống các trường bắt buộc',
    '- Mã số thuế không được trùng trong hệ thống',
    '- Tỉnh/Thành phố phải nằm trong phạm vi quản lý',
    '- Ngành hàng chính chỉ chọn từ danh mục',
    '- Đơn vị quản lý không được vượt phạm vi quản lý',
    '- Sau khi import, tất cả cửa hàng ở trạng thái Chờ duyệt',
  ];

  // Create sections
  const lines: string[] = [];
  
  // Section 1: Industry list
  lines.push('DANH SÁCH NGÀNH HÀNG HỢP LỆ');
  lines.push('Ngành hàng');
  industryList.forEach(industry => lines.push(toCSVValue(industry)));
  lines.push(''); // Empty line
  
  // Section 2: Status list
  lines.push('DANH SÁCH TRẠNG THÁI HỢP LỆ');
  lines.push('Trạng thái');
  statusList.forEach(status => lines.push(toCSVValue(status)));
  lines.push(''); // Empty line
  
  // Section 3: Management unit list
  lines.push('DANH SÁCH ĐƠN VỊ QUẢN LÝ HỢP LỆ');
  lines.push('Đơn vị quản lý');
  managementUnitList.forEach(unit => lines.push(toCSVValue(unit)));
  lines.push(''); // Empty line
  
  // Section 4: Notes
  lines.push('GHI CHÚ HƯỚNG DẪN NHẬP DỮ LIỆU');
  lines.push('Nội dung');
  notes.forEach(note => lines.push(toCSVValue(note)));

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const csvContent = BOM + lines.join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export both data and reference CSVs
 */
export function exportStoresPackage(stores: Store[], baseFilename?: string): void {
  // Generate timestamp
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // Use custom filename or default
  const mainFilename = baseFilename 
    ? `${baseFilename}.csv`
    : `danh-sach-cua-hang-${timestamp}.csv`;
  
  const referenceFilename = baseFilename 
    ? `${baseFilename}_danh-muc-tham-chieu.csv`
    : `danh-muc-tham-chieu-${timestamp}.csv`;
  
  // Export main data
  exportStoresToCSV(stores, mainFilename);
  
  // Export reference data after a short delay
  setTimeout(() => {
    exportReferenceDataCSV(referenceFilename);
  }, 500);
}