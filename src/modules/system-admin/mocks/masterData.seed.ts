/**
 * MASTER DATA - COMPREHENSIVE SEED DATA
 * 24-30 catalogs across 3 groups with realistic items
 */

import type { Catalog, CatalogItem } from '../sa-master-data/types';

// ============================================
// CATALOGS SEED DATA
// ============================================

export const seedCatalogs: Catalog[] = [
  // ===== GROUP: COMMON (Dùng chung) =====
  {
    key: 'risk-level',
    name: 'Mức độ rủi ro',
    description: 'Phân loại mức độ rủi ro trong hoạt động kiểm tra',
    group: 'COMMON',
    itemCount: 4,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'priority-level',
    name: 'Mức độ ưu tiên',
    description: 'Phân loại mức độ ưu tiên xử lý công việc',
    group: 'COMMON',
    itemCount: 4,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'data-source',
    name: 'Nguồn dữ liệu',
    description: 'Nguồn gốc thông tin và dữ liệu trong hệ thống',
    group: 'COMMON',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'business-type',
    name: 'Loại hình kinh doanh',
    description: 'Phân loại hình thức kinh doanh của cơ sở',
    group: 'COMMON',
    itemCount: 10,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'document-types',
    name: 'Loại giấy tờ',
    description: 'Danh mục các loại giấy tờ, chứng từ',
    group: 'COMMON',
    itemCount: 12,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'contact-channel',
    name: 'Kênh liên hệ',
    description: 'Các kênh liên hệ với công dân, doanh nghiệp',
    group: 'COMMON',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'product-categories',
    name: 'Nhóm hàng hóa',
    description: 'Phân loại nhóm hàng hóa, sản phẩm',
    group: 'COMMON',
    itemCount: 18,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    key: 'measurement-unit',
    name: 'Đơn vị tính',
    description: 'Đơn vị đo lường hàng hóa, sản phẩm',
    group: 'COMMON',
    itemCount: 15,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'attachment-type',
    name: 'Loại tệp đính kèm',
    description: 'Phân loại file đính kèm trong hệ thống',
    group: 'COMMON',
    itemCount: 10,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },

  // ===== GROUP: DMS (Nghiệp vụ QLTT) =====
  {
    key: 'task-status',
    name: 'Trạng thái nhiệm vụ',
    description: 'Trạng thái xử lý nhiệm vụ kiểm tra',
    group: 'DMS',
    itemCount: 7,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'task-type',
    name: 'Loại nhiệm vụ',
    description: 'Phân loại nhiệm vụ kiểm tra, thanh tra',
    group: 'DMS',
    itemCount: 9,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    key: 'lead-status',
    name: 'Trạng thái đầu mối',
    description: 'Trạng thái xử lý nguồn tin tố giác',
    group: 'DMS',
    itemCount: 6,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'lead-source',
    name: 'Nguồn tin báo',
    description: 'Nguồn gốc tin báo, tố giác vi phạm',
    group: 'DMS',
    itemCount: 10,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'violation-types',
    name: 'Loại vi phạm',
    description: 'Danh mục các loại vi phạm hành chính',
    group: 'DMS',
    itemCount: 20,
    hasSchema: true,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'inspection-theme',
    name: 'Chuyên đề kiểm tra',
    description: 'Các chuyên đề, chiến dịch kiểm tra đặc biệt',
    group: 'DMS',
    itemCount: 12,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'result-type',
    name: 'Kết quả xử lý',
    description: 'Kết quả xử lý sau kiểm tra',
    group: 'DMS',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    key: 'penalty-level',
    name: 'Mức xử phạt',
    description: 'Phân loại mức độ xử phạt vi phạm',
    group: 'DMS',
    itemCount: 5,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    key: 'merchant-category',
    name: 'Phân loại thương nhân',
    description: 'Phân loại doanh nghiệp, hộ kinh doanh',
    group: 'DMS',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'evidence-type',
    name: 'Loại bằng chứng',
    description: 'Phân loại bằng chứng vi phạm',
    group: 'DMS',
    itemCount: 9,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },

  // ===== GROUP: SYSTEM (Kỹ thuật - Hiển thị) =====
  {
    key: 'map-marker-type',
    name: 'Loại marker bản đồ',
    description: 'Cấu hình marker trên bản đồ',
    group: 'SYSTEM',
    itemCount: 8,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'map-layer',
    name: 'Lớp bản đồ',
    description: 'Cấu hình các lớp hiển thị trên bản đồ',
    group: 'SYSTEM',
    itemCount: 6,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    key: 'status-color-map',
    name: 'Bảng màu trạng thái',
    description: 'Mapping màu sắc cho từng trạng thái',
    group: 'SYSTEM',
    itemCount: 15,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'dashboard-kpi',
    name: 'KPI Dashboard',
    description: 'Cấu hình các chỉ số KPI hiển thị',
    group: 'SYSTEM',
    itemCount: 12,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'notification-template',
    name: 'Mẫu thông báo',
    description: 'Template cho các loại thông báo hệ thống',
    group: 'SYSTEM',
    itemCount: 10,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    key: 'pagination-config',
    name: 'Cấu hình phân trang',
    description: 'Cấu hình số bản ghi mỗi trang',
    group: 'SYSTEM',
    itemCount: 5,
    hasSchema: false,
    isLocked: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'export-format',
    name: 'Định dạng xuất file',
    description: 'Các định dạng file khi xuất báo cáo',
    group: 'SYSTEM',
    itemCount: 6,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'chart-type',
    name: 'Loại biểu đồ',
    description: 'Các loại biểu đồ trong báo cáo, dashboard',
    group: 'SYSTEM',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'ui-theme',
    name: 'Giao diện hệ thống',
    description: 'Cấu hình theme màu sắc giao diện',
    group: 'SYSTEM',
    itemCount: 4,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  }
];

// ============================================
// CATALOG ITEMS SEED DATA
// ============================================

export const seedCatalogItems: CatalogItem[] = [
  // ===== RISK LEVEL =====
  {
    id: 'item-risk-1',
    catalogKey: 'risk-level',
    code: 'LOW',
    name: 'Thấp',
    value: 'low',
    order: 1,
    badgeColor: '#28C76F',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-risk-2',
    catalogKey: 'risk-level',
    code: 'MEDIUM',
    name: 'Trung bình',
    value: 'medium',
    order: 2,
    badgeColor: '#FF9F43',
    isDefault: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-risk-3',
    catalogKey: 'risk-level',
    code: 'HIGH',
    name: 'Cao',
    value: 'high',
    order: 3,
    badgeColor: '#EA5455',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-risk-4',
    catalogKey: 'risk-level',
    code: 'CRITICAL',
    name: 'Nghiêm trọng',
    value: 'critical',
    order: 4,
    badgeColor: '#D32F2F',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== PRIORITY LEVEL =====
  {
    id: 'item-priority-1',
    catalogKey: 'priority-level',
    code: 'LOW',
    name: 'Thấp',
    value: 'low',
    order: 1,
    badgeColor: '#9E9E9E',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-priority-2',
    catalogKey: 'priority-level',
    code: 'NORMAL',
    name: 'Trung bình',
    value: 'normal',
    order: 2,
    badgeColor: '#00CFE8',
    isDefault: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-priority-3',
    catalogKey: 'priority-level',
    code: 'HIGH',
    name: 'Cao',
    value: 'high',
    order: 3,
    badgeColor: '#FF9F43',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-priority-4',
    catalogKey: 'priority-level',
    code: 'URGENT',
    name: 'Khẩn cấp',
    value: 'urgent',
    order: 4,
    badgeColor: '#EA5455',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== DATA SOURCE =====
  {
    id: 'item-datasource-1',
    catalogKey: 'data-source',
    code: 'CITIZEN',
    name: 'Người dân',
    description: 'Thông tin từ người dân báo cáo',
    order: 1,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-2',
    catalogKey: 'data-source',
    code: 'STAFF',
    name: 'Cán bộ',
    description: 'Dữ liệu do cán bộ nhập',
    order: 2,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-3',
    catalogKey: 'data-source',
    code: 'INS',
    name: 'Hệ thống INS',
    description: 'Tích hợp từ hệ thống INS',
    order: 3,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-4',
    catalogKey: 'data-source',
    code: 'POS',
    name: 'Hệ thống POS',
    description: 'Tích hợp từ máy tính tiền',
    order: 4,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-5',
    catalogKey: 'data-source',
    code: 'EXTERNAL_API',
    name: 'API bên ngoài',
    description: 'Dữ liệu từ hệ thống bên thứ ba',
    order: 5,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-6',
    catalogKey: 'data-source',
    code: 'IMPORT',
    name: 'Import từ file',
    description: 'Nhập từ Excel, CSV',
    order: 6,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-7',
    catalogKey: 'data-source',
    code: 'MOBILE_APP',
    name: 'Ứng dụng di động',
    description: 'Thu thập từ app mobile',
    order: 7,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-datasource-8',
    catalogKey: 'data-source',
    code: 'OTHER',
    name: 'Nguồn khác',
    description: 'Nguồn dữ liệu khác',
    order: 8,
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== BUSINESS TYPE =====
  {
    id: 'item-biz-1',
    catalogKey: 'business-type',
    code: 'SHOP',
    name: 'Cửa hàng',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-2',
    catalogKey: 'business-type',
    code: 'MARKET',
    name: 'Chợ',
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-3',
    catalogKey: 'business-type',
    code: 'SUPERMARKET',
    name: 'Siêu thị',
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-4',
    catalogKey: 'business-type',
    code: 'WAREHOUSE',
    name: 'Kho hàng',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-5',
    catalogKey: 'business-type',
    code: 'RESTAURANT',
    name: 'Nhà hàng',
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-6',
    catalogKey: 'business-type',
    code: 'CAFE',
    name: 'Quán cà phê',
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-7',
    catalogKey: 'business-type',
    code: 'FACTORY',
    name: 'Nhà máy',
    order: 7,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-8',
    catalogKey: 'business-type',
    code: 'ECOMMERCE',
    name: 'Thương mại điện tử',
    order: 8,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-9',
    catalogKey: 'business-type',
    code: 'STREET_VENDOR',
    name: 'Bán hàng rong',
    order: 9,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-biz-10',
    catalogKey: 'business-type',
    code: 'OTHER',
    name: 'Khác',
    order: 10,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== DOCUMENT TYPES =====
  {
    id: 'item-doc-1',
    catalogKey: 'document-types',
    code: 'CCCD',
    name: 'Căn cước công dân',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-2',
    catalogKey: 'document-types',
    code: 'MST',
    name: 'Mã số thuế',
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-3',
    catalogKey: 'document-types',
    code: 'BUSINESS_LICENSE',
    name: 'Giấy phép kinh doanh',
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-4',
    catalogKey: 'document-types',
    code: 'INVOICE',
    name: 'Hóa đơn',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-5',
    catalogKey: 'document-types',
    code: 'COO',
    name: 'Giấy chứng nhận xuất xứ',
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-6',
    catalogKey: 'document-types',
    code: 'QUALITY_CERT',
    name: 'Giấy chứng nhận chất lượng',
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-7',
    catalogKey: 'document-types',
    code: 'SAFETY_CERT',
    name: 'Giấy chứng nhận an toàn',
    order: 7,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-8',
    catalogKey: 'document-types',
    code: 'IMPORT_PERMIT',
    name: 'Giấy phép nhập khẩu',
    order: 8,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-9',
    catalogKey: 'document-types',
    code: 'TRANSPORT_PERMIT',
    name: 'Giấy phép vận chuyển',
    order: 9,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-10',
    catalogKey: 'document-types',
    code: 'RECEIPT',
    name: 'Biên nhận',
    order: 10,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-11',
    catalogKey: 'document-types',
    code: 'CONTRACT',
    name: 'Hợp đồng',
    order: 11,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-doc-12',
    catalogKey: 'document-types',
    code: 'OTHER',
    name: 'Giấy tờ khác',
    order: 12,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== CONTACT CHANNEL =====
  {
    id: 'item-contact-1',
    catalogKey: 'contact-channel',
    code: 'PHONE',
    name: 'Điện thoại',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-2',
    catalogKey: 'contact-channel',
    code: 'EMAIL',
    name: 'Email',
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-3',
    catalogKey: 'contact-channel',
    code: 'ZALO',
    name: 'Zalo',
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-4',
    catalogKey: 'contact-channel',
    code: 'FACEBOOK',
    name: 'Facebook',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-5',
    catalogKey: 'contact-channel',
    code: 'SMS',
    name: 'SMS',
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-6',
    catalogKey: 'contact-channel',
    code: 'WEBSITE',
    name: 'Website',
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-7',
    catalogKey: 'contact-channel',
    code: 'IN_PERSON',
    name: 'Trực tiếp',
    order: 7,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-contact-8',
    catalogKey: 'contact-channel',
    code: 'OTHER',
    name: 'Kênh khác',
    order: 8,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== TASK STATUS (DMS) =====
  {
    id: 'item-task-status-1',
    catalogKey: 'task-status',
    code: 'NEW',
    name: 'Mới tạo',
    value: 'new',
    order: 1,
    badgeColor: '#9E9E9E',
    isDefault: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-2',
    catalogKey: 'task-status',
    code: 'ASSIGNED',
    name: 'Đã giao',
    value: 'assigned',
    order: 2,
    badgeColor: '#00CFE8',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-3',
    catalogKey: 'task-status',
    code: 'IN_PROGRESS',
    name: 'Đang thực hiện',
    value: 'in_progress',
    order: 3,
    badgeColor: '#7367F0',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-4',
    catalogKey: 'task-status',
    code: 'OVERDUE',
    name: 'Quá hạn',
    value: 'overdue',
    order: 4,
    badgeColor: '#FF9F43',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-5',
    catalogKey: 'task-status',
    code: 'COMPLETED',
    name: 'Hoàn thành',
    value: 'completed',
    order: 5,
    badgeColor: '#28C76F',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-6',
    catalogKey: 'task-status',
    code: 'CANCELLED',
    name: 'Đã hủy',
    value: 'cancelled',
    order: 6,
    badgeColor: '#EA5455',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-status-7',
    catalogKey: 'task-status',
    code: 'PENDING_REVIEW',
    name: 'Chờ duyệt',
    value: 'pending_review',
    order: 7,
    badgeColor: '#FF9F43',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== TASK TYPE =====
  {
    id: 'item-task-type-1',
    catalogKey: 'task-type',
    code: 'INSPECTION',
    name: 'Kiểm tra thường xuyên',
    description: 'Nhiệm vụ kiểm tra định kỳ',
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-2',
    catalogKey: 'task-type',
    code: 'VERIFY_TIP',
    name: 'Xác minh nguồn tin',
    description: 'Kiểm tra thông tin tố giác, tin báo',
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-3',
    catalogKey: 'task-type',
    code: 'POST_INSPECTION',
    name: 'Hậu kiểm',
    description: 'Kiểm tra sau xử lý vi phạm',
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-4',
    catalogKey: 'task-type',
    code: 'COORDINATION',
    name: 'Phối hợp liên ngành',
    description: 'Nhiệm vụ phối hợp với đơn vị khác',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-5',
    catalogKey: 'task-type',
    code: 'CAMPAIGN',
    name: 'Chiến dịch chuyên đề',
    description: 'Chiến dịch kiểm tra quy mô lớn',
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-6',
    catalogKey: 'task-type',
    code: 'URGENT_RESPONSE',
    name: 'Ứng phó khẩn cấp',
    description: 'Xử lý tình huống khẩn cấp',
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-7',
    catalogKey: 'task-type',
    code: 'MONITORING',
    name: 'Giám sát thường xuyên',
    description: 'Theo dõi, giám sát liên tục',
    order: 7,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-8',
    catalogKey: 'task-type',
    code: 'INVESTIGATION',
    name: 'Điều tra chuyên sâu',
    description: 'Điều tra vụ việc phức tạp',
    order: 8,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-task-type-9',
    catalogKey: 'task-type',
    code: 'OTHER',
    name: 'Loại khác',
    description: 'Nhiệm vụ khác',
    order: 9,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== LEAD STATUS =====
  {
    id: 'item-lead-status-1',
    catalogKey: 'lead-status',
    code: 'NEW',
    name: 'Mới tiếp nhận',
    value: 'new',
    order: 1,
    badgeColor: '#9E9E9E',
    isDefault: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-lead-status-2',
    catalogKey: 'lead-status',
    code: 'VERIFYING',
    name: 'Đang xác minh',
    value: 'verifying',
    order: 2,
    badgeColor: '#00CFE8',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-lead-status-3',
    catalogKey: 'lead-status',
    code: 'VERIFIED',
    name: 'Đã xác minh',
    value: 'verified',
    order: 3,
    badgeColor: '#7367F0',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-lead-status-4',
    catalogKey: 'lead-status',
    code: 'ASSIGNED',
    name: 'Đã chuyển xử lý',
    value: 'assigned',
    order: 4,
    badgeColor: '#FF9F43',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-lead-status-5',
    catalogKey: 'lead-status',
    code: 'CLOSED',
    name: 'Đã đóng',
    value: 'closed',
    order: 5,
    badgeColor: '#28C76F',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-lead-status-6',
    catalogKey: 'lead-status',
    code: 'REJECTED',
    name: 'Từ chối',
    value: 'rejected',
    order: 6,
    badgeColor: '#EA5455',
    isDefault: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== VIOLATION TYPES =====
  {
    id: 'item-violation-1',
    catalogKey: 'violation-types',
    code: 'VP-GIA',
    name: 'Vi phạm về giá',
    description: 'Không niêm yết giá, bán vượt giá niêm yết',
    order: 1,
    metadata: { severity: 'medium', fineMin: 1000000, fineMax: 5000000 },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-violation-2',
    catalogKey: 'violation-types',
    code: 'VP-CHATLUONG',
    name: 'Vi phạm chất lượng hàng hóa',
    description: 'Kinh doanh hàng giả, hàng nhái, hàng kém chất lượng',
    order: 2,
    metadata: { severity: 'high', fineMin: 5000000, fineMax: 50000000 },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-violation-3',
    catalogKey: 'violation-types',
    code: 'VP-VSATTP',
    name: 'Vi phạm an toàn thực phẩm',
    description: 'Thực phẩm không đảm bảo ATTP',
    order: 3,
    metadata: { severity: 'critical', fineMin: 10000000, fineMax: 100000000 },
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-violation-4',
    catalogKey: 'violation-types',
    code: 'VP-XUATXU',
    name: 'Vi phạm nguồn gốc xuất xứ',
    description: 'Gian lận về nguồn gốc, xuất xứ hàng hóa',
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-violation-5',
    catalogKey: 'violation-types',
    code: 'VP-NHANMAC',
    name: 'Vi phạm nhãn mác',
    description: 'Không đúng quy cách nhãn mác hàng hóa',
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-violation-6',
    catalogKey: 'violation-types',
    code: 'VP-BUONLAU',
    name: 'Buôn lậu',
    description: 'Vận chuyển, kinh doanh hàng lậu',
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== MAP MARKER TYPE (SYSTEM) =====
  {
    id: 'item-marker-1',
    catalogKey: 'map-marker-type',
    code: 'MERCHANT',
    name: 'Thương nhân',
    value: JSON.stringify({ icon: 'store', color: '#7367F0' }),
    order: 1,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-2',
    catalogKey: 'map-marker-type',
    code: 'HOTSPOT',
    name: 'Điểm nóng',
    value: JSON.stringify({ icon: 'alert-triangle', color: '#EA5455' }),
    order: 2,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-3',
    catalogKey: 'map-marker-type',
    code: 'LEAD',
    name: 'Nguồn tin',
    value: JSON.stringify({ icon: 'info', color: '#00CFE8' }),
    order: 3,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-4',
    catalogKey: 'map-marker-type',
    code: 'TASK',
    name: 'Nhiệm vụ',
    value: JSON.stringify({ icon: 'map-pin', color: '#FF9F43' }),
    order: 4,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-5',
    catalogKey: 'map-marker-type',
    code: 'VIOLATION',
    name: 'Vi phạm',
    value: JSON.stringify({ icon: 'x-circle', color: '#D32F2F' }),
    order: 5,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-6',
    catalogKey: 'map-marker-type',
    code: 'WAREHOUSE',
    name: 'Kho hàng',
    value: JSON.stringify({ icon: 'package', color: '#9E9E9E' }),
    order: 6,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-7',
    catalogKey: 'map-marker-type',
    code: 'MARKET',
    name: 'Chợ',
    value: JSON.stringify({ icon: 'shopping-bag', color: '#28C76F' }),
    order: 7,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-marker-8',
    catalogKey: 'map-marker-type',
    code: 'CHECKPOINT',
    name: 'Chốt kiểm tra',
    value: JSON.stringify({ icon: 'shield', color: '#005CB6' }),
    order: 8,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // ===== STATUS COLOR MAP (SYSTEM) =====
  {
    id: 'item-color-1',
    catalogKey: 'status-color-map',
    code: 'ACTIVE',
    name: 'Hoạt động',
    value: '#28C76F',
    order: 1,
    badgeColor: '#28C76F',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-color-2',
    catalogKey: 'status-color-map',
    code: 'INACTIVE',
    name: 'Ngừng hoạt động',
    value: '#9E9E9E',
    order: 2,
    badgeColor: '#9E9E9E',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-color-3',
    catalogKey: 'status-color-map',
    code: 'PENDING',
    name: 'Chờ xử lý',
    value: '#FF9F43',
    order: 3,
    badgeColor: '#FF9F43',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-color-4',
    catalogKey: 'status-color-map',
    code: 'COMPLETED',
    name: 'Hoàn thành',
    value: '#00CFE8',
    order: 4,
    badgeColor: '#00CFE8',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'item-color-5',
    catalogKey: 'status-color-map',
    code: 'CANCELLED',
    name: 'Đã hủy',
    value: '#EA5455',
    order: 5,
    badgeColor: '#EA5455',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Helper to get items count by catalog
export function getItemsCountByCatalog(catalogKey: string): number {
  return seedCatalogItems.filter(item => item.catalogKey === catalogKey).length;
}
