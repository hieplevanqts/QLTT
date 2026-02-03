/**
 * Import Template Generator
 * Generates CSV/Excel template for store import
 */

import * as XLSX from 'xlsx';
import { Store } from '../data/mockStores';

/**
 * Parsed store row from import file
 */
export interface ParsedStoreRow {
  rowIndex: number;
  name: string;
  ownerName: string;
  taxCode: string;
  phone: string;
  province: string;
  ward: string;
  address: string;
  industryName: string;
  managementUnit: string;
  notes?: string;
}

/**
 * Validation error
 */
export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

/**
 * Parse result
 */
export interface ParseResult {
  success: boolean;
  data: ParsedStoreRow[];
  errors: ValidationError[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
}

/**
 * Download CSV template for importing stores
 */
export function downloadStoreImportTemplate(): void {
  // Define template headers
  const headers = [
    'Tên cửa hàng',
    'Chủ hộ / Người đại diện',
    'Mã số thuế',
    'Số điện thoại',
    'Tỉnh / Thành phố',
    'Phường / Xã',
    'Địa chỉ chi tiết',
    'Ngành hàng chính',
    'Đơn vị quản lý',
    'Ghi chú (nếu có)',
  ];

  // Sample data rows for reference
  const sampleRows = [
    [
      'Nhà hàng Phở Hà Nội',
      'Nguyễn Văn A',
      '0123456789',
      '0901234567',
      'TP. Hồ Chí Minh',
      'Phường Bến Nghé',
      '123 Nguyễn Huệ',
      'Thực phẩm',
      'Chi cục QLTT Phường 1',
      'Ví dụ mẫu - Xóa dòng này trước khi import',
    ],
    [
      'Cà phê Sài Gòn',
      'Trần Thị B',
      '0987654321',
      '0912345678',
      'TP. Hồ Chí Minh',
      'Phường Võ Thị Sáu',
      '456 Lê Lợi',
      'Đồ uống',
      'Chi cục QLTT Phường 3',
      '',
    ],
  ];

  // Combine headers and sample data
  const csvLines = [
    headers.map(escapeCSV).join(','),
    ...sampleRows.map(row => row.map(escapeCSV).join(',')),
  ];

  // Add BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  const csvContent = BOM + csvLines.join('\n');

  // Create and download file
  downloadFile(csvContent, `mau-import-cua-hang-${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Download Excel template with sample data (XLSX format)
 */
export function downloadExcelTemplate(): void {
  // Create headers
  const headers = [
    'Tên cửa hàng',
    'Chủ hộ / Người đại diện',
    'Mã số thuế',
    'Số điện thoại',
    'Tỉnh / Thành phố',
    'Phường / Xã',
    'Địa chỉ chi tiết',
    'Ngành hàng chính',
    'Đơn vị quản lý',
    'Ghi chú (nếu có)',
  ];

  // Create demo data rows with proper data
  const demoData = [
    [
      'Nhà hàng Phở Hà Nội',
      'Nguyễn Văn An',
      '0123456789',
      '0901234567',
      'TP. Hồ Chí Minh',
      'Phường Bến Nghé',
      '123 Nguyễn Huệ, Phường 1',
      'Thực phẩm',
      'Chi cục QLTT Phường 1',
      'Nhà hàng phở truyền thống',
    ],
    [
      'Cà phê Sài Gòn',
      'Trần Thị Bình',
      '0987654321',
      '0912345678',
      'TP. Hồ Chí Minh',
      'Phường Võ Thị Sáu',
      '456 Lê Lợi, Phường 3',
      'Đồ uống',
      'Chi cục QLTT Phường 3',
      'Cà phê take away',
    ],
    [
      'Cửa hàng Mỹ phẩm Beauty',
      'Lê Thị Cúc',
      '1234567890',
      '0903456789',
      'TP. Hồ Chí Minh',
      'Phường Phạm Ngũ Lão',
      '789 Nguyễn Trãi, Phường 5',
      'Mỹ phẩm',
      'Chi cục QLTT Phường 5',
      'Bán mỹ phẩm chính hãng',
    ],
    [
      'Nhà thuốc An Khang',
      'Phạm Văn Dũng',
      '2345678901',
      '0914567890',
      'TP. Hồ Chí Minh',
      'Phường 14',
      '234 Lý Thường Kiệt, Phường 10',
      'Dược phẩm',
      'Chi cục QLTT Phường 10',
      'Nhà thuốc GPP đạt chuẩn',
    ],
    [
      'Shop Thời trang Teen',
      'Ngô Thị Em',
      '3456789012',
      '0925678901',
      'TP. Hồ Chí Minh',
      'Phường 1',
      '567 Phan Đăng Lưu, Phú Nhuận',
      'Thời trang',
      'Chi cục QLTT Phú Nhuận',
      'Chuyên thời trang teen',
    ],
  ];

  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Create worksheet data (header + demo data)
  const wsData = [headers, ...demoData];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Tên cửa hàng
    { wch: 25 }, // Chủ hộ
    { wch: 15 }, // Mã số thuế
    { wch: 15 }, // Số điện thoại
    { wch: 20 }, // Tỉnh/TP
    { wch: 20 }, // Phường/Xã
    { wch: 30 }, // Địa chỉ
    { wch: 18 }, // Ngành hàng
    { wch: 25 }, // Đơn vị quản lý
    { wch: 30 }, // Ghi chú
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Danh sách cửa hàng');
  
  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  // Download file
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `mau-import-cua-hang-${getTimestamp()}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse CSV/Excel file with proper Excel support using xlsx library
 */
export async function parseImportFile(file: File): Promise<ParseResult> {
  try {
    let dataRows: string[][];
    
    // Check if file is Excel (.xlsx or .xls)
    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    
    if (isExcel) {
      // Parse Excel file using xlsx library
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get first sheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to array of arrays
      const allRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Skip header row
      dataRows = allRows.slice(1).map(row => 
        row.map((cell: any) => cell !== null && cell !== undefined ? String(cell).trim() : '')
      );
    } else {
      // Parse CSV file
      const text = await file.text();
      const cleanText = text.replace(/^\uFEFF/, ''); // Remove BOM
      const lines = cleanText.split('\n');
      const rows = lines.map(line => parseCSVLine(line));
      dataRows = rows.slice(1); // Skip header
    }
    
    const validData: ParsedStoreRow[] = [];
    const errors: ValidationError[] = [];

    dataRows.forEach((row, index) => {
      const rowNum = index + 2; // Excel row number (1-based + header)

      // Skip empty rows
      if (!row || row.length === 0 || !row[0] || row[0].trim() === '') {
        return;
      }

      const rowData: ParsedStoreRow = {
        rowIndex: rowNum,
        name: row[0]?.trim() || '',
        ownerName: row[1]?.trim() || '',
        taxCode: row[2]?.trim() || '',
        phone: row[3]?.trim() || '',
        province: row[4]?.trim() || '',
        ward: row[5]?.trim() || '',
        address: row[6]?.trim() || '',
        industryName: row[7]?.trim() || '',
        managementUnit: row[8]?.trim() || '',
        notes: row[9]?.trim() || '',
      };

      // Validate required fields
      const requiredFields: Array<{ key: keyof ParsedStoreRow; label: string }> = [
        { key: 'name', label: 'Tên cửa hàng' },
        { key: 'ownerName', label: 'Chủ hộ / Người đại diện' },
        { key: 'taxCode', label: 'Mã số thuế' },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'province', label: 'Tỉnh / Thành phố' },
        { key: 'ward', label: 'Phường / Xã' },
        { key: 'address', label: 'Địa chỉ chi tiết' },
        { key: 'industryName', label: 'Ngành hàng chính' },
        { key: 'managementUnit', label: 'Đơn vị quản lý' },
      ];

      let hasError = false;

      requiredFields.forEach(({ key, label }) => {
        if (!rowData[key]) {
          errors.push({
            row: rowNum,
            field: label,
            message: `${label} không được để trống`,
          });
          hasError = true;
        }
      });

      // Validate tax code format (10-13 digits)
      if (rowData.taxCode && !/^\d{10,13}$/.test(rowData.taxCode)) {
        errors.push({
          row: rowNum,
          field: 'Mã số thuế',
          message: 'Mã số thuế phải là 10-13 chữ số',
        });
        hasError = true;
      }

      // Validate phone number format
      if (rowData.phone && !/^0\d{9,10}$/.test(rowData.phone)) {
        errors.push({
          row: rowNum,
          field: 'Số điện thoại',
          message: 'Số điện thoại không đúng định dạng (phải bắt đầu bằng 0 và có 10-11 số)',
        });
        hasError = true;
      }

      if (!hasError) {
        validData.push(rowData);
      }
    });

    return {
      success: errors.length === 0,
      data: validData,
      errors,
      summary: {
        total: dataRows.filter(row => row && row[0] && row[0].trim()).length,
        valid: validData.length,
        invalid: errors.length,
      },
    };
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Không thể đọc file. Vui lòng kiểm tra định dạng file.');
  }
}

/**
 * Helper: Parse CSV line (handles quotes and commas)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current); // Add last field
  return result;
}

/**
 * Escape CSV values to prevent CSV injection
 */
function escapeCSV(value: string): string {
  if (!value) return '';
  
  const stringValue = String(value);
  
  // If value contains comma, newline, or double quote, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Download file with given content and filename
 */
function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get current timestamp in YYYYMMDDHHMMSS format
 */
function getTimestamp(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
    String(now.getSeconds()).padStart(2, '0'),
  ].join('');
}

/**
 * Download reference data (categories)
 */
export function downloadReferenceData(): void {
  const lines: string[] = [];

  // Section 1: Industries
  lines.push('DANH SÁCH NGÀNH HÀNG HỢP LỆ');
  lines.push('');
  lines.push('Ngành hàng');
  lines.push('Thực phẩm');
  lines.push('Đồ uống');
  lines.push('Mỹ phẩm');
  lines.push('Dược phẩm');
  lines.push('Thời trang');
  lines.push('Điện tử');
  lines.push('Nội thất');
  lines.push('Xây dựng');
  lines.push('Ô tô - Xe máy');
  lines.push('Dịch vụ');
  lines.push('');
  lines.push('');

  // Section 2: Management Units
  lines.push('DANH SÁCH ĐƠN VỊ QUẢN LÝ HỢP LỆ');
  lines.push('');
  lines.push('Đơn vị quản lý');
  const districts = [
    'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5',
    'Phường 6', 'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10',
    'Phường 11', 'Phường 12', 'Thủ Đức', 'Bình Thạnh',
    'Tân Bình', 'Tân Phú', 'Phú Nhuận', 'Gò Vấp', 'Bình Tân',
  ];
  districts.forEach(district => {
    lines.push(`Chi cục QLTT ${district}`);
  });
  lines.push('');
  lines.push('');

  // Section 3: Instructions
  lines.push('HƯỚNG DẪN NHẬP DỮ LIỆU');
  lines.push('');
  lines.push('1. Không để trống các trường bắt buộc (9 cột đầu tiên)');
  lines.push('2. Mã số thuế không được trùng trong hệ thống');
  lines.push('3. Mã số thuế phải là 10-13 chữ số');
  lines.push('4. Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số');
  lines.push('5. Tỉnh/Thành phố phải nằm trong phạm vi quản lý');
  lines.push('6. Ngành hàng chính chỉ chọn từ danh mục trên');
  lines.push('7. Đơn vị quản lý không được vượt phạm vi quản lý');
  lines.push('8. Sau khi import thành công, tất cả cửa hàng ở trạng thái "Chờ duyệt"');
  lines.push('9. Hệ thống tự sinh Mã cửa hàng, Ngày tạo, Ngày cập nhật');

  const BOM = '\uFEFF';
  const csvContent = BOM + lines.join('\n');

  downloadFile(csvContent, `danh-muc-tham-chieu-${getTimestamp()}.csv`, 'text/csv;charset=utf-8;');
}
