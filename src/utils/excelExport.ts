import * as XLSX from 'xlsx';

interface FacilityData {
  code: string;
  name: string;
  type: string;
  address: string;
  ward: string;
  district: string;
  riskLevel: 'high' | 'medium' | 'low';
  legalStatus: string;
  status: 'active' | 'inactive';
}

interface AreaSummary {
  area: string;
  totalFacilities: number;
  activeFacilities: number;
  highRisk: number;
  violations: number;
  resolved: number;
  riskRate: number;
}

interface TypeSummary {
  type: string;
  total: number;
  highRisk: number;
  violations: number;
}

interface ExportOptions {
  period: string;
  area: string;
  exportDate: string;
}

export function exportFacilityReportToExcel(
  areaSummary: AreaSummary[],
  facilityDetails: FacilityData[],
  typeSummary: TypeSummary[],
  options: ExportOptions
) {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // ============================================
  // SHEET 1: Tổng hợp theo khu vực
  // ============================================
  const sheet1Data = [
    // Header section
    ['BÁO CÁO TÌNH HÌNH CƠ SỞ ATTP THEO KHU VỰC'],
    [`Kỳ báo cáo: ${options.period}`],
    [`Khu vực: ${options.area}`],
    [`Ngày xuất: ${options.exportDate}`],
    [], // Empty row
    
    // Column headers
    [
      'Khu vực',
      'Tổng số cơ sở',
      'Cơ sở đang hoạt động',
      'Cơ sở nguy cơ cao',
      'Cơ sở vi phạm',
      'Đã xử lý',
      'Tỷ lệ nguy cơ (%)',
    ],
    
    // Data rows
    ...areaSummary.map(item => [
      item.area,
      item.totalFacilities,
      item.activeFacilities,
      item.highRisk,
      item.violations,
      item.resolved,
      item.riskRate.toFixed(1),
    ]),
    
    // Summary row
    [],
    [
      'TỔNG CỘNG',
      areaSummary.reduce((sum, item) => sum + item.totalFacilities, 0),
      areaSummary.reduce((sum, item) => sum + item.activeFacilities, 0),
      areaSummary.reduce((sum, item) => sum + item.highRisk, 0),
      areaSummary.reduce((sum, item) => sum + item.violations, 0),
      areaSummary.reduce((sum, item) => sum + item.resolved, 0),
      (
        (areaSummary.reduce((sum, item) => sum + item.highRisk, 0) /
          areaSummary.reduce((sum, item) => sum + item.totalFacilities, 0)) *
        100
      ).toFixed(1),
    ],
  ];

  const sheet1 = XLSX.utils.aoa_to_sheet(sheet1Data);

  // Set column widths
  sheet1['!cols'] = [
    { wch: 20 }, // Khu vực
    { wch: 15 }, // Tổng số
    { wch: 20 }, // Đang hoạt động
    { wch: 18 }, // Nguy cơ cao
    { wch: 15 }, // Vi phạm
    { wch: 12 }, // Đã xử lý
    { wch: 18 }, // Tỷ lệ
  ];

  // Merge cells for title
  sheet1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Title
  ];

  // Style header row (row 5, index 5 in zero-based)
  const headerRow = 5;
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
    const cell = sheet1[`${col}${headerRow + 1}`];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '005CB6' } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }
  });

  XLSX.utils.book_append_sheet(workbook, sheet1, 'Tổng hợp theo khu vực');

  // ============================================
  // SHEET 2: Chi tiết cơ sở
  // ============================================
  const sheet2Data = [
    // Header section
    ['CHI TIẾT CƠ SỞ ATTP'],
    [`Kỳ báo cáo: ${options.period}`],
    [`Khu vực: ${options.area}`],
    [], // Empty row
    
    // Column headers
    [
      'Mã cơ sở',
      'Tên cơ sở',
      'Loại hình',
      'Địa chỉ',
      'Phường/Xã',
      'Phường/Xã',
      'Mức độ rủi ro',
      'Tình trạng pháp lý',
      'Trạng thái hoạt động',
    ],
    
    // Data rows
    ...facilityDetails.map(item => [
      item.code,
      item.name,
      item.type,
      item.address,
      item.ward,
      item.district,
      item.riskLevel === 'high' ? 'Cao' : item.riskLevel === 'medium' ? 'Trung bình' : 'Thấp',
      item.legalStatus,
      item.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động',
    ]),
  ];

  const sheet2 = XLSX.utils.aoa_to_sheet(sheet2Data);

  // Set column widths
  sheet2['!cols'] = [
    { wch: 12 }, // Mã
    { wch: 30 }, // Tên
    { wch: 20 }, // Loại hình
    { wch: 35 }, // Địa chỉ
    { wch: 15 }, // Phường
    { wch: 15 }, // Phường
    { wch: 15 }, // Rủi ro
    { wch: 20 }, // Pháp lý
    { wch: 18 }, // Trạng thái
  ];

  // Merge cells for title
  sheet2['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } }, // Title
  ];

  XLSX.utils.book_append_sheet(workbook, sheet2, 'Chi tiết cơ sở');

  // ============================================
  // SHEET 3: Phân loại theo loại hình
  // ============================================
  const sheet3Data = [
    // Header section
    ['PHÂN LOẠI THEO LOẠI HÌNH'],
    [`Kỳ báo cáo: ${options.period}`],
    [], // Empty row
    
    // Column headers
    ['Loại hình cơ sở', 'Tổng số', 'Nguy cơ cao', 'Vi phạm'],
    
    // Data rows
    ...typeSummary.map(item => [item.type, item.total, item.highRisk, item.violations]),
    
    // Summary row
    [],
    [
      'TỔNG CỘNG',
      typeSummary.reduce((sum, item) => sum + item.total, 0),
      typeSummary.reduce((sum, item) => sum + item.highRisk, 0),
      typeSummary.reduce((sum, item) => sum + item.violations, 0),
    ],
  ];

  const sheet3 = XLSX.utils.aoa_to_sheet(sheet3Data);

  // Set column widths
  sheet3['!cols'] = [
    { wch: 30 }, // Loại hình
    { wch: 12 }, // Tổng số
    { wch: 15 }, // Nguy cơ cao
    { wch: 12 }, // Vi phạm
  ];

  // Merge cells for title
  sheet3['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title
  ];

  XLSX.utils.book_append_sheet(workbook, sheet3, 'Phân loại theo loại hình');

  // ============================================
  // SHEET 4: Biểu đồ tổng hợp (Data for charts)
  // ============================================
  const sheet4Data = [
    // Header section
    ['DỮ LIỆU BIỂU ĐỒ TỔNG HỢP'],
    [`Kỳ báo cáo: ${options.period}`],
    [], // Empty row
    
    // Chart 1: Số cơ sở theo khu vực
    ['SỐ CƠ SỞ THEO KHU VỰC'],
    ['Khu vực', 'Số lượng'],
    ...areaSummary.map(item => [item.area, item.totalFacilities]),
    [],
    
    // Chart 2: Tỷ lệ mức độ rủi ro
    ['TỶ LỆ MỨC ĐỘ RỦI RO'],
    ['Mức độ', 'Số lượng'],
    [
      'Rủi ro cao',
      facilityDetails.filter(f => f.riskLevel === 'high').length,
    ],
    [
      'Rủi ro trung bình',
      facilityDetails.filter(f => f.riskLevel === 'medium').length,
    ],
    [
      'Rủi ro thấp',
      facilityDetails.filter(f => f.riskLevel === 'low').length,
    ],
  ];

  const sheet4 = XLSX.utils.aoa_to_sheet(sheet4Data);

  // Set column widths
  sheet4['!cols'] = [
    { wch: 25 }, // Column 1
    { wch: 15 }, // Column 2
  ];

  XLSX.utils.book_append_sheet(workbook, sheet4, 'Dữ liệu biểu đồ');

  // ============================================
  // Generate file name and save
  // ============================================
  const fileName = `BC_TinhHinhCoSo_TheoKhuVuc_${options.period.replace(/\//g, '-')}_${options.area.replace(/\s+/g, '')}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, fileName);

  return fileName;
}

// Helper function to format date
export function formatExportDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Example usage function
export function generateSampleExport() {
  const areaSummary: AreaSummary[] = [
    {
      area: 'Phường 1',
      totalFacilities: 245,
      activeFacilities: 232,
      highRisk: 28,
      violations: 12,
      resolved: 10,
      riskRate: 11.4,
    },
    {
      area: 'Phường 3',
      totalFacilities: 198,
      activeFacilities: 185,
      highRisk: 22,
      violations: 8,
      resolved: 7,
      riskRate: 11.1,
    },
    {
      area: 'Phường 5',
      totalFacilities: 312,
      activeFacilities: 298,
      highRisk: 35,
      violations: 15,
      resolved: 12,
      riskRate: 11.2,
    },
  ];

  const facilityDetails: FacilityData[] = [
    {
      code: 'CS-001',
      name: 'Nhà hàng Hương Việt',
      type: 'Nhà hàng',
      address: '123 Nguyễn Huệ',
      ward: 'Phường Bến Nghé',
      district: 'Phường 1',
      riskLevel: 'high',
      legalStatus: 'Đầy đủ',
      status: 'active',
    },
    {
      code: 'CS-002',
      name: 'Siêu thị ABC',
      type: 'Siêu thị',
      address: '456 Lê Lợi',
      ward: 'Phường Bến Thành',
      district: 'Phường 1',
      riskLevel: 'medium',
      legalStatus: 'Đầy đủ',
      status: 'active',
    },
  ];

  const typeSummary: TypeSummary[] = [
    { type: 'Nhà hàng', total: 350, highRisk: 42, violations: 18 },
    { type: 'Siêu thị', total: 180, highRisk: 15, violations: 6 },
    { type: 'Chợ', total: 85, highRisk: 12, violations: 5 },
    { type: 'Cơ sở chế biến', total: 140, highRisk: 16, violations: 8 },
  ];

  const options: ExportOptions = {
    period: 'Tháng 01/2025',
    area: 'Toàn thành phố',
    exportDate: formatExportDate(),
  };

  return exportFacilityReportToExcel(areaSummary, facilityDetails, typeSummary, options);
}
