/**
 * MOCK SERVICE TYPES
 * Types cho Master Data mock service
 */

// Entity types
export type EntityType = 'org-units' | 'departments' | 'areas' | 'catalogs' | 'catalog-items';

// Status type
export type Status = 'active' | 'inactive';

// Org Unit types
export type OrgUnitType = 'central' | 'provincial' | 'team' | 'other';

// Area/Jurisdiction types
export type AreaType = 'province' | 'district' | 'ward';

// Request/Response types
export interface ListRequest {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Validation errors
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Create/Update payloads
export interface CreateOrgUnitPayload {
  code: string;
  name: string;
  shortName: string;
  type: OrgUnitType;
  level: number;
  parentId?: string | null;
  status?: Status;
}

export interface UpdateOrgUnitPayload extends Partial<CreateOrgUnitPayload> {}

export interface CreateDepartmentPayload {
  code: string;
  name: string;
  orgUnitId: string;
  description?: string;
  status?: Status;
}

export interface UpdateDepartmentPayload extends Partial<CreateDepartmentPayload> {}

export interface CreateAreaPayload {
  code: string;
  name: string;
  type: AreaType;
  parentId?: string | null;
  provinceName?: string;
  status?: Status;
}

export interface UpdateAreaPayload extends Partial<CreateAreaPayload> {}

export interface CreateCatalogPayload {
  key: string;
  name: string;
  description: string;
  group: 'COMMON' | 'DMS' | 'SYSTEM';
  status?: Status;
}

export interface UpdateCatalogPayload extends Partial<CreateCatalogPayload> {}

export interface CreateCatalogItemPayload {
  catalogKey: string;
  code: string;
  name: string;
  value?: string;
  description?: string;
  order?: number;
  badgeColor?: string;
  isDefault?: boolean;
  metadata?: Record<string, any>;
  status?: Status;
}

export interface UpdateCatalogItemPayload extends Partial<CreateCatalogItemPayload> {}
