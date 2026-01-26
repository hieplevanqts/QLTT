/**
 * TYPES - SA Master Data Module
 */

// Org Unit (Đơn vị tổ chức)
export interface OrgUnit {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: 'central' | 'provincial' | 'team';
  level: number;
  parentId: string | null;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Department (Phòng ban)
export interface Department {
  id: string;
  code: string;
  name: string;
  orgUnitId: string;
  headId: string | null; // User ID của trưởng phòng
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Jurisdiction (Địa bàn quản lý)
export interface Jurisdiction {
  id: string;
  code: string;
  name: string;
  type: 'province' | 'district' | 'ward';
  parentId: string | null;
  orgUnitId: string; // Đơn vị quản lý
  boundary?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Catalog (Danh mục)
export interface Catalog {
  key: string;
  name: string;
  description: string;
  group: 'COMMON' | 'DMS' | 'SYSTEM'; // Phân loại danh mục
  itemCount: number;
  hasSchema: boolean;
  isLocked?: boolean; // Danh mục core không cho xóa
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Catalog Item (Mục trong danh mục)
export interface CatalogItem {
  id: string;
  catalogKey: string;
  code: string;
  name: string; // label/display name
  value?: string; // Giá trị (có thể JSON string cho SYSTEM catalogs)
  description?: string;
  order: number; // sort_order
  parentId?: string | null; // For hierarchical items
  badgeColor?: string; // Màu badge cho trạng thái/risk
  isDefault?: boolean; // Mục mặc định
  effectiveFrom?: string; // Ngày hiệu lực
  effectiveTo?: string; // Ngày hết hiệu lực
  metadata?: Record<string, any>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Catalog Schema Field
export interface CatalogSchemaField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select';
  required: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

// Catalog Schema
export interface CatalogSchema {
  catalogKey: string;
  fields: CatalogSchemaField[];
  updatedAt: string;
}
