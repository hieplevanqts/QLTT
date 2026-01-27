/**
 * MOCK DATA - SA Master Data Module
 */

import type {
  OrgUnit,
  Department,
  Jurisdiction,
  Catalog,
  CatalogItem,
  CatalogSchema
} from './types';

// Mock Org Units
export const MOCK_ORG_UNITS: OrgUnit[] = [
  {
    id: '1',
    code: 'CUC',
    name: 'Cục Quản lý thị trường',
    shortName: 'Cục QLTT',
    type: 'central',
    level: 1,
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'CCQLTT-HN',
    name: 'Chi cục Quản lý thị trường Hà Nội',
    shortName: 'Chi cục HN',
    type: 'provincial',
    level: 2,
    parentId: '1',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'CCQLTT-HCM',
    name: 'Chi cục Quản lý thị trường TP.HCM',
    shortName: 'Chi cục HCM',
    type: 'provincial',
    level: 2,
    parentId: '1',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'DOI-HN-01',
    name: 'Đội Quản lý thị trường số 1 Hà Nội',
    shortName: 'Đội 01 HN',
    type: 'team',
    level: 3,
    parentId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Departments
export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: '1',
    code: 'PHONG-TCKT',
    name: 'Phòng Tổng hợp - Kế hoạch - Tài chính',
    orgUnitId: '1',
    headId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'PHONG-QLTT',
    name: 'Phòng Quản lý thị trường nội địa',
    orgUnitId: '1',
    headId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'PHONG-CNTT',
    name: 'Phòng Công nghệ thông tin',
    orgUnitId: '1',
    headId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Jurisdictions
export const MOCK_JURISDICTIONS: Jurisdiction[] = [
  {
    id: '1',
    code: 'HN',
    name: 'Hà Nội',
    type: 'province',
    parentId: null,
    orgUnitId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'HCM',
    name: 'TP. Hồ Chí Minh',
    type: 'province',
    parentId: null,
    orgUnitId: '3',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'HN-HBT',
    name: 'Quận Hoàn Kiếm',
    type: 'district',
    parentId: '1',
    orgUnitId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Catalogs
export const MOCK_CATALOGS: Catalog[] = [
  // COMMON - Danh mục dùng chung
  {
    key: 'document-types',
    name: 'Loại văn bản',
    description: 'Danh mục loại văn bản pháp lý',
    group: 'COMMON',
    itemCount: 28,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    key: 'provinces',
    name: 'Tỉnh/Thành phố',
    description: 'Danh sách 63 tỉnh thành',
    group: 'COMMON',
    itemCount: 63,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    key: 'document-statuses',
    name: 'Trạng thái văn bản',
    description: 'Trạng thái xử lý văn bản',
    group: 'COMMON',
    itemCount: 8,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  // DMS - Danh mục nghiệp vụ QLTT
  {
    key: 'violation-types',
    name: 'Loại vi phạm',
    description: 'Danh mục các loại vi phạm hành chính',
    group: 'DMS',
    itemCount: 45,
    hasSchema: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    key: 'product-categories',
    name: 'Nhóm sản phẩm',
    description: 'Phân loại sản phẩm hàng hóa',
    group: 'DMS',
    itemCount: 120,
    hasSchema: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    key: 'inspection-types',
    name: 'Loại thanh tra',
    description: 'Phân loại hình thức thanh tra kiểm tra',
    group: 'DMS',
    itemCount: 15,
    hasSchema: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    key: 'evidence-types',
    name: 'Loại chứng cứ',
    description: 'Phân loại chứng cứ vi phạm',
    group: 'DMS',
    itemCount: 22,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  // SYSTEM - Danh mục kỹ thuật
  {
    key: 'user-roles',
    name: 'Vai trò người dùng',
    description: 'Phân loại vai trò trong hệ thống',
    group: 'SYSTEM',
    itemCount: 12,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    key: 'log-types',
    name: 'Loại nhật ký',
    description: 'Phân loại log hệ thống',
    group: 'SYSTEM',
    itemCount: 18,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    key: 'notification-templates',
    name: 'Mẫu thông báo',
    description: 'Templates cho hệ thống thông báo',
    group: 'SYSTEM',
    itemCount: 25,
    hasSchema: true,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    key: 'api-endpoints',
    name: 'API Endpoints',
    description: 'Danh sách endpoints và permissions',
    group: 'SYSTEM',
    itemCount: 87,
    hasSchema: false,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
];

// Mock Catalog Items
export const MOCK_CATALOG_ITEMS: Record<string, CatalogItem[]> = {
  'violation-types': [
    {
      id: '1',
      catalogKey: 'violation-types',
      code: 'VP-001',
      name: 'Vi phạm về giá',
      description: 'Không niêm yết giá, bán vượt giá niêm yết',
      order: 1,
      metadata: { severity: 'medium', fineMin: 1000000, fineMax: 5000000 },
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      catalogKey: 'violation-types',
      code: 'VP-002',
      name: 'Vi phạm về chất lượng hàng hóa',
      description: 'Kinh doanh hàng giả, hàng nhái, hàng kém chất lượng',
      order: 2,
      metadata: { severity: 'high', fineMin: 5000000, fineMax: 50000000 },
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ],
  'product-categories': [
    {
      id: '3',
      catalogKey: 'product-categories',
      code: 'SP-THUCPHAM',
      name: 'Thực phẩm',
      order: 1,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      catalogKey: 'product-categories',
      code: 'SP-DIENTU',
      name: 'Điện tử - Điện lạnh',
      order: 2,
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ]
};

// Mock Catalog Schema
export const MOCK_CATALOG_SCHEMAS: Record<string, CatalogSchema> = {
  'violation-types': {
    catalogKey: 'violation-types',
    fields: [
      {
        key: 'severity',
        label: 'Mức độ nghiêm trọng',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Thấp' },
          { value: 'medium', label: 'Trung bình' },
          { value: 'high', label: 'Cao' }
        ]
      },
      {
        key: 'fineMin',
        label: 'Mức phạt tối thiểu (VNĐ)',
        type: 'number',
        required: true,
        validation: { min: 0 }
      },
      {
        key: 'fineMax',
        label: 'Mức phạt tối đa (VNĐ)',
        type: 'number',
        required: true,
        validation: { min: 0 }
      }
    ],
    updatedAt: '2024-01-15T00:00:00Z'
  },
  'product-categories': {
    catalogKey: 'product-categories',
    fields: [
      {
        key: 'riskLevel',
        label: 'Mức độ rủi ro',
        type: 'select',
        required: false,
        options: [
          { value: 'low', label: 'Thấp' },
          { value: 'medium', label: 'Trung bình' },
          { value: 'high', label: 'Cao' }
        ]
      },
      {
        key: 'requiresCert',
        label: 'Yêu cầu chứng nhận',
        type: 'boolean',
        required: false,
        defaultValue: false
      }
    ],
    updatedAt: '2024-01-10T00:00:00Z'
  }
};
