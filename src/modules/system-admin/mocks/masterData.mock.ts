/**
 * MOCK DATA STORAGE
 * In-memory data store cho Master Data entities
 */

import type { OrgUnit, Department, Catalog, CatalogItem } from '../sa-master-data/types';
import type { Status, OrgUnitType, AreaType } from './masterData.types';
import { seedCatalogs, seedCatalogItems } from './masterData.seed.full';

// Extended Area type for mock
export interface Area {
  id: string;
  code: string;
  name: string;
  type: AreaType;
  parentId: string | null;
  provinceName?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage
let mockOrgUnits: OrgUnit[] = [
  {
    id: '1',
    code: 'CUC-QLTT',
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
  },
  {
    id: '5',
    code: 'DOI-HN-02',
    name: 'Đội Quản lý thị trường số 2 Hà Nội',
    shortName: 'Đội 02 HN',
    type: 'team',
    level: 3,
    parentId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    code: 'CCQLTT-DN',
    name: 'Chi cục Quản lý thị trường Đà Nẵng',
    shortName: 'Chi cục ĐN',
    type: 'provincial',
    level: 2,
    parentId: '1',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    code: 'DOI-HCM-01',
    name: 'Đội Quản lý thị trường số 1 TP.HCM',
    shortName: 'Đội 01 HCM',
    type: 'team',
    level: 3,
    parentId: '3',
    status: 'inactive',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

let mockDepartments: Department[] = [
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
  },
  {
    id: '4',
    code: 'PHONG-HC',
    name: 'Phòng Hành chính - Tổ chức',
    orgUnitId: '2',
    headId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'PHONG-QLTT-HN',
    name: 'Phòng Quản lý thị trường địa bàn',
    orgUnitId: '2',
    headId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

let mockAreas: Area[] = [
  {
    id: '1',
    code: 'HN',
    name: 'Hà Nội',
    type: 'province',
    parentId: null,
    provinceName: 'Hà Nội',
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
    provinceName: 'TP. Hồ Chí Minh',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'HN-HK',
    name: 'Quận Hoàn Kiếm',
    type: 'district',
    parentId: '1',
    provinceName: 'Hà Nội',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'HN-BD',
    name: 'Quận Ba Đình',
    type: 'district',
    parentId: '1',
    provinceName: 'Hà Nội',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'HCM-Q1',
    name: 'Quận 1',
    type: 'district',
    parentId: '2',
    provinceName: 'TP. Hồ Chí Minh',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    code: 'HN-HK-HANG-DAO',
    name: 'Phường Hàng Đào',
    type: 'ward',
    parentId: '3',
    provinceName: 'Hà Nội',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

let mockCatalogs: Catalog[] = [...seedCatalogs];

let mockCatalogItems: CatalogItem[] = [...seedCatalogItems];

// Auto-incrementing ID counters
let orgUnitIdCounter = mockOrgUnits.length + 1;
let departmentIdCounter = mockDepartments.length + 1;
let areaIdCounter = mockAreas.length + 1;
let catalogItemIdCounter = seedCatalogItems.length + 1;

// Export getters and setters
export const getMockOrgUnits = () => [...mockOrgUnits];
export const setMockOrgUnits = (data: OrgUnit[]) => { mockOrgUnits = [...data]; };
export const addMockOrgUnit = (unit: OrgUnit) => { mockOrgUnits.push(unit); };
export const getNextOrgUnitId = () => String(orgUnitIdCounter++);

export const getMockDepartments = () => [...mockDepartments];
export const setMockDepartments = (data: Department[]) => { mockDepartments = [...data]; };
export const addMockDepartment = (dept: Department) => { mockDepartments.push(dept); };
export const getNextDepartmentId = () => String(departmentIdCounter++);

export const getMockAreas = () => [...mockAreas];
export const setMockAreas = (data: Area[]) => { mockAreas = [...data]; };
export const addMockArea = (area: Area) => { mockAreas.push(area); };
export const getNextAreaId = () => String(areaIdCounter++);

export const getMockCatalogs = () => [...mockCatalogs];
export const setMockCatalogs = (data: Catalog[]) => { mockCatalogs = [...data]; };

export const getMockCatalogItems = () => [...mockCatalogItems];
export const setMockCatalogItems = (data: CatalogItem[]) => { mockCatalogItems = [...data]; };
export const addMockCatalogItem = (item: CatalogItem) => { mockCatalogItems.push(item); };
export const getNextCatalogItemId = () => String(catalogItemIdCounter++);