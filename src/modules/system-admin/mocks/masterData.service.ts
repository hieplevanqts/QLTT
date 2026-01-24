/**
 * MOCK SERVICE - Master Data CRUD Operations
 * Simulates async operations with validation
 */

import type { OrgUnit, Department, Catalog, CatalogItem } from '../sa-master-data/types';
import type {
  ListRequest,
  ListResponse,
  ServiceResponse,
  ValidationResult,
  CreateOrgUnitPayload,
  UpdateOrgUnitPayload,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  CreateAreaPayload,
  UpdateAreaPayload,
  CreateCatalogPayload,
  UpdateCatalogPayload,
  CreateCatalogItemPayload,
  UpdateCatalogItemPayload
} from './masterData.types';

import {
  getMockOrgUnits,
  setMockOrgUnits,
  addMockOrgUnit,
  getNextOrgUnitId,
  getMockDepartments,
  setMockDepartments,
  addMockDepartment,
  getNextDepartmentId,
  getMockAreas,
  setMockAreas,
  addMockArea,
  getNextAreaId,
  getMockCatalogs,
  setMockCatalogs,
  getMockCatalogItems,
  setMockCatalogItems,
  addMockCatalogItem,
  getNextCatalogItemId,
  type Area
} from './masterData.mock';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ===== VALIDATION HELPERS =====

function validateOrgUnit(payload: CreateOrgUnitPayload | UpdateOrgUnitPayload, isUpdate = false, existingId?: string): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate || payload.code !== undefined) {
    if (!payload.code || payload.code.trim() === '') {
      errors.push({ field: 'code', message: 'Mã đơn vị là bắt buộc' });
    } else {
      // Check unique code
      const orgUnits = getMockOrgUnits();
      const duplicate = orgUnits.find(u => u.code === payload.code && u.id !== existingId);
      if (duplicate) {
        errors.push({ field: 'code', message: 'Mã đơn vị đã tồn tại' });
      }
    }
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim() === '') {
      errors.push({ field: 'name', message: 'Tên đơn vị là bắt buộc' });
    }
  }

  if (!isUpdate || payload.parentId !== undefined) {
    if (payload.parentId && payload.parentId === existingId) {
      errors.push({ field: 'parentId', message: 'Đơn vị không thể là cha của chính nó' });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateDepartment(payload: CreateDepartmentPayload | UpdateDepartmentPayload, isUpdate = false, existingId?: string): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate || payload.code !== undefined) {
    if (!payload.code || payload.code.trim() === '') {
      errors.push({ field: 'code', message: 'Mã phòng ban là bắt buộc' });
    } else {
      const departments = getMockDepartments();
      const duplicate = departments.find(d => d.code === payload.code && d.id !== existingId);
      if (duplicate) {
        errors.push({ field: 'code', message: 'Mã phòng ban đã tồn tại' });
      }
    }
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim() === '') {
      errors.push({ field: 'name', message: 'Tên phòng ban là bắt buộc' });
    }
  }

  if (!isUpdate) {
    if (!payload.orgUnitId) {
      errors.push({ field: 'orgUnitId', message: 'Đơn vị trực thuộc là bắt buộc' });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateArea(payload: CreateAreaPayload | UpdateAreaPayload, isUpdate = false, existingId?: string): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate || payload.code !== undefined) {
    if (!payload.code || payload.code.trim() === '') {
      errors.push({ field: 'code', message: 'Mã địa bàn là bắt buộc' });
    } else {
      const areas = getMockAreas();
      const duplicate = areas.find(a => a.code === payload.code && a.id !== existingId);
      if (duplicate) {
        errors.push({ field: 'code', message: 'Mã địa bàn đã tồn tại' });
      }
    }
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim() === '') {
      errors.push({ field: 'name', message: 'Tên địa bàn là bắt buộc' });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateCatalog(payload: CreateCatalogPayload | UpdateCatalogPayload, isUpdate = false, existingKey?: string): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate || payload.key !== undefined) {
    if (!payload.key || payload.key.trim() === '') {
      errors.push({ field: 'key', message: 'Khóa danh mục là bắt buộc' });
    } else {
      const catalogs = getMockCatalogs();
      const duplicate = catalogs.find(c => c.key === payload.key && c.key !== existingKey);
      if (duplicate) {
        errors.push({ field: 'key', message: 'Khóa danh mục đã tồn tại' });
      }
    }
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim() === '') {
      errors.push({ field: 'name', message: 'Tên danh mục là bắt buộc' });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateCatalogItem(payload: CreateCatalogItemPayload | UpdateCatalogItemPayload, isUpdate = false, existingId?: string): ValidationResult {
  const errors: Array<{ field: string; message: string }> = [];

  if (!isUpdate || payload.code !== undefined) {
    if (!payload.code || payload.code.trim() === '') {
      errors.push({ field: 'code', message: 'Mã mục là bắt buộc' });
    } else {
      const items = getMockCatalogItems();
      const catalogKey = isUpdate ? items.find(i => i.id === existingId)?.catalogKey : payload.catalogKey;
      const duplicate = items.find(i => 
        i.code === payload.code && 
        i.catalogKey === catalogKey && 
        i.id !== existingId
      );
      if (duplicate) {
        errors.push({ field: 'code', message: 'Mã mục đã tồn tại trong danh mục này' });
      }
    }
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim() === '') {
      errors.push({ field: 'name', message: 'Tên mục là bắt buộc' });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ===== ORG UNITS =====

export async function listOrgUnits(request: ListRequest = {}): Promise<ServiceResponse<ListResponse<OrgUnit>>> {
  await delay(250);

  try {
    let data = getMockOrgUnits();

    // Search
    if (request.search) {
      const query = request.search.toLowerCase();
      data = data.filter(unit =>
        unit.code.toLowerCase().includes(query) ||
        unit.name.toLowerCase().includes(query) ||
        unit.shortName.toLowerCase().includes(query)
      );
    }

    // Filters
    if (request.filters) {
      if (request.filters.status) {
        data = data.filter(u => u.status === request.filters!.status);
      }
      if (request.filters.type) {
        data = data.filter(u => u.type === request.filters!.type);
      }
      if (request.filters.level) {
        data = data.filter(u => u.level === request.filters!.level);
      }
    }

    // Sort
    if (request.sort) {
      const { field, order } = request.sort;
      data.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi tải danh sách đơn vị'
    };
  }
}

export async function getOrgUnitById(id: string): Promise<ServiceResponse<OrgUnit>> {
  await delay(200);

  const orgUnits = getMockOrgUnits();
  const unit = orgUnits.find(u => u.id === id);

  if (!unit) {
    return {
      success: false,
      error: 'Không tìm thấy đơn vị'
    };
  }

  return {
    success: true,
    data: unit
  };
}

export async function createOrgUnit(payload: CreateOrgUnitPayload): Promise<ServiceResponse<OrgUnit>> {
  await delay(300);

  const validation = validateOrgUnit(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const newUnit: OrgUnit = {
    id: getNextOrgUnitId(),
    code: payload.code,
    name: payload.name,
    shortName: payload.shortName,
    type: payload.type,
    level: payload.level,
    parentId: payload.parentId || null,
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  addMockOrgUnit(newUnit);

  return {
    success: true,
    data: newUnit
  };
}

export async function updateOrgUnit(id: string, payload: UpdateOrgUnitPayload): Promise<ServiceResponse<OrgUnit>> {
  await delay(300);

  const orgUnits = getMockOrgUnits();
  const index = orgUnits.findIndex(u => u.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy đơn vị'
    };
  }

  const validation = validateOrgUnit(payload, true, id);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const updatedUnit: OrgUnit = {
    ...orgUnits[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  orgUnits[index] = updatedUnit;
  setMockOrgUnits(orgUnits);

  return {
    success: true,
    data: updatedUnit
  };
}

export async function deleteOrgUnit(id: string, hardDelete = false): Promise<ServiceResponse<void>> {
  await delay(250);

  const orgUnits = getMockOrgUnits();
  const index = orgUnits.findIndex(u => u.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy đơn vị'
    };
  }

  if (hardDelete) {
    orgUnits.splice(index, 1);
  } else {
    // Soft delete
    orgUnits[index] = {
      ...orgUnits[index],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };
  }

  setMockOrgUnits(orgUnits);

  return {
    success: true
  };
}

// ===== DEPARTMENTS =====

export async function listDepartments(request: ListRequest = {}): Promise<ServiceResponse<ListResponse<Department>>> {
  await delay(250);

  try {
    let data = getMockDepartments();

    // Search
    if (request.search) {
      const query = request.search.toLowerCase();
      data = data.filter(dept =>
        dept.code.toLowerCase().includes(query) ||
        dept.name.toLowerCase().includes(query)
      );
    }

    // Filters
    if (request.filters) {
      if (request.filters.status) {
        data = data.filter(d => d.status === request.filters!.status);
      }
      if (request.filters.orgUnitId) {
        data = data.filter(d => d.orgUnitId === request.filters!.orgUnitId);
      }
    }

    // Sort
    if (request.sort) {
      const { field, order } = request.sort;
      data.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi tải danh sách phòng ban'
    };
  }
}

export async function getDepartmentById(id: string): Promise<ServiceResponse<Department>> {
  await delay(200);

  const departments = getMockDepartments();
  const dept = departments.find(d => d.id === id);

  if (!dept) {
    return {
      success: false,
      error: 'Không tìm thấy phòng ban'
    };
  }

  return {
    success: true,
    data: dept
  };
}

export async function createDepartment(payload: CreateDepartmentPayload): Promise<ServiceResponse<Department>> {
  await delay(300);

  const validation = validateDepartment(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const newDept: Department = {
    id: getNextDepartmentId(),
    code: payload.code,
    name: payload.name,
    orgUnitId: payload.orgUnitId,
    headId: null,
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  addMockDepartment(newDept);

  return {
    success: true,
    data: newDept
  };
}

export async function updateDepartment(id: string, payload: UpdateDepartmentPayload): Promise<ServiceResponse<Department>> {
  await delay(300);

  const departments = getMockDepartments();
  const index = departments.findIndex(d => d.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy phòng ban'
    };
  }

  const validation = validateDepartment(payload, true, id);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const updatedDept: Department = {
    ...departments[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  departments[index] = updatedDept;
  setMockDepartments(departments);

  return {
    success: true,
    data: updatedDept
  };
}

export async function deleteDepartment(id: string, hardDelete = false): Promise<ServiceResponse<void>> {
  await delay(250);

  const departments = getMockDepartments();
  const index = departments.findIndex(d => d.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy phòng ban'
    };
  }

  if (hardDelete) {
    departments.splice(index, 1);
  } else {
    departments[index] = {
      ...departments[index],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };
  }

  setMockDepartments(departments);

  return {
    success: true
  };
}

// ===== AREAS =====

export async function listAreas(request: ListRequest = {}): Promise<ServiceResponse<ListResponse<Area>>> {
  await delay(250);

  try {
    let data = getMockAreas();

    // Search
    if (request.search) {
      const query = request.search.toLowerCase();
      data = data.filter(area =>
        area.code.toLowerCase().includes(query) ||
        area.name.toLowerCase().includes(query) ||
        (area.provinceName && area.provinceName.toLowerCase().includes(query))
      );
    }

    // Filters
    if (request.filters) {
      if (request.filters.status) {
        data = data.filter(a => a.status === request.filters!.status);
      }
      if (request.filters.type) {
        data = data.filter(a => a.type === request.filters!.type);
      }
    }

    // Sort
    if (request.sort) {
      const { field, order } = request.sort;
      data.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi tải danh sách địa bàn'
    };
  }
}

export async function getAreaById(id: string): Promise<ServiceResponse<Area>> {
  await delay(200);

  const areas = getMockAreas();
  const area = areas.find(a => a.id === id);

  if (!area) {
    return {
      success: false,
      error: 'Không tìm thấy địa bàn'
    };
  }

  return {
    success: true,
    data: area
  };
}

export async function createArea(payload: CreateAreaPayload): Promise<ServiceResponse<Area>> {
  await delay(300);

  const validation = validateArea(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const newArea: Area = {
    id: getNextAreaId(),
    code: payload.code,
    name: payload.name,
    type: payload.type,
    parentId: payload.parentId || null,
    provinceName: payload.provinceName,
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  addMockArea(newArea);

  return {
    success: true,
    data: newArea
  };
}

export async function updateArea(id: string, payload: UpdateAreaPayload): Promise<ServiceResponse<Area>> {
  await delay(300);

  const areas = getMockAreas();
  const index = areas.findIndex(a => a.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy địa bàn'
    };
  }

  const validation = validateArea(payload, true, id);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const updatedArea: Area = {
    ...areas[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  areas[index] = updatedArea;
  setMockAreas(areas);

  return {
    success: true,
    data: updatedArea
  };
}

export async function deleteArea(id: string, hardDelete = false): Promise<ServiceResponse<void>> {
  await delay(250);

  const areas = getMockAreas();
  const index = areas.findIndex(a => a.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy địa bàn'
    };
  }

  if (hardDelete) {
    areas.splice(index, 1);
  } else {
    areas[index] = {
      ...areas[index],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };
  }

  setMockAreas(areas);

  return {
    success: true
  };
}

// ===== CATALOGS =====

export async function listCatalogs(request: ListRequest = {}): Promise<ServiceResponse<ListResponse<Catalog>>> {
  await delay(250);

  try {
    let data = getMockCatalogs();

    // Search
    if (request.search) {
      const query = request.search.toLowerCase();
      data = data.filter(cat =>
        cat.key.toLowerCase().includes(query) ||
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
      );
    }

    // Filters
    if (request.filters) {
      if (request.filters.status) {
        data = data.filter(c => c.status === request.filters!.status);
      }
    }

    // Sort
    if (request.sort) {
      const { field, order } = request.sort;
      data.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
    }

    // Pagination
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi tải danh sách danh mục'
    };
  }
}

export async function getCatalogByKey(key: string): Promise<ServiceResponse<Catalog>> {
  await delay(200);

  const catalogs = getMockCatalogs();
  const catalog = catalogs.find(c => c.key === key);

  if (!catalog) {
    return {
      success: false,
      error: 'Không tìm thấy danh mục'
    };
  }

  return {
    success: true,
    data: catalog
  };
}

export async function createCatalog(payload: CreateCatalogPayload): Promise<ServiceResponse<Catalog>> {
  await delay(300);

  const validation = validateCatalog(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const newCatalog: Catalog = {
    key: payload.key,
    name: payload.name,
    description: payload.description,
    group: payload.group,
    itemCount: 0,
    hasSchema: false,
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const catalogs = getMockCatalogs();
  catalogs.push(newCatalog);
  setMockCatalogs(catalogs);

  return {
    success: true,
    data: newCatalog
  };
}

export async function updateCatalog(key: string, payload: UpdateCatalogPayload): Promise<ServiceResponse<Catalog>> {
  await delay(300);

  const catalogs = getMockCatalogs();
  const index = catalogs.findIndex(c => c.key === key);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy danh mục'
    };
  }

  const validation = validateCatalog(payload, true, key);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const updatedCatalog: Catalog = {
    ...catalogs[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  catalogs[index] = updatedCatalog;
  setMockCatalogs(catalogs);

  return {
    success: true,
    data: updatedCatalog
  };
}

export async function deleteCatalog(key: string, hardDelete = false): Promise<ServiceResponse<void>> {
  await delay(250);

  const catalogs = getMockCatalogs();
  const index = catalogs.findIndex(c => c.key === key);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy danh mục'
    };
  }

  if (hardDelete) {
    catalogs.splice(index, 1);
  } else {
    catalogs[index] = {
      ...catalogs[index],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };
  }

  setMockCatalogs(catalogs);

  return {
    success: true
  };
}

// ===== CATALOG ITEMS =====

export async function listCatalogItems(catalogKey: string, request: ListRequest = {}): Promise<ServiceResponse<ListResponse<CatalogItem>>> {
  await delay(250);

  try {
    let data = getMockCatalogItems().filter(item => item.catalogKey === catalogKey);

    // Search
    if (request.search) {
      const query = request.search.toLowerCase();
      data = data.filter(item =>
        item.code.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query))
      );
    }

    // Filters
    if (request.filters) {
      if (request.filters.status) {
        data = data.filter(i => i.status === request.filters!.status);
      }
    }

    // Sort
    if (request.sort) {
      const { field, order } = request.sort;
      data.sort((a, b) => {
        const aVal = (a as any)[field];
        const bVal = (b as any)[field];
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return order === 'asc' ? comparison : -comparison;
      });
    } else {
      // Default sort by order
      data.sort((a, b) => a.order - b.order);
    }

    // Pagination
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;
    const total = data.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data: {
        data: paginatedData,
        total,
        page,
        pageSize,
        totalPages
      }
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi tải danh sách mục'
    };
  }
}

export async function getCatalogItemById(id: string): Promise<ServiceResponse<CatalogItem>> {
  await delay(200);

  const items = getMockCatalogItems();
  const item = items.find(i => i.id === id);

  if (!item) {
    return {
      success: false,
      error: 'Không tìm thấy mục'
    };
  }

  return {
    success: true,
    data: item
  };
}

export async function createCatalogItem(payload: CreateCatalogItemPayload): Promise<ServiceResponse<CatalogItem>> {
  await delay(300);

  const validation = validateCatalogItem(payload);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  // Get max order for this catalog
  const items = getMockCatalogItems().filter(i => i.catalogKey === payload.catalogKey);
  const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : 0;

  const newItem: CatalogItem = {
    id: getNextCatalogItemId(),
    catalogKey: payload.catalogKey,
    code: payload.code,
    name: payload.name,
    value: payload.value,
    description: payload.description,
    order: payload.order !== undefined ? payload.order : maxOrder + 1,
    badgeColor: payload.badgeColor,
    isDefault: payload.isDefault,
    metadata: payload.metadata,
    status: payload.status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  addMockCatalogItem(newItem);

  // Update catalog item count
  const catalogs = getMockCatalogs();
  const catalogIndex = catalogs.findIndex(c => c.key === payload.catalogKey);
  if (catalogIndex !== -1) {
    catalogs[catalogIndex].itemCount++;
    setMockCatalogs(catalogs);
  }

  return {
    success: true,
    data: newItem
  };
}

export async function updateCatalogItem(id: string, payload: UpdateCatalogItemPayload): Promise<ServiceResponse<CatalogItem>> {
  await delay(300);

  const items = getMockCatalogItems();
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy mục'
    };
  }

  const validation = validateCatalogItem(payload, true, id);
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.map(e => e.message).join(', ')
    };
  }

  const updatedItem: CatalogItem = {
    ...items[index],
    ...payload,
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  setMockCatalogItems(items);

  return {
    success: true,
    data: updatedItem
  };
}

export async function deleteCatalogItem(id: string, hardDelete = false): Promise<ServiceResponse<void>> {
  await delay(250);

  const items = getMockCatalogItems();
  const index = items.findIndex(i => i.id === id);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy mục'
    };
  }

  const catalogKey = items[index].catalogKey;

  if (hardDelete) {
    items.splice(index, 1);
  } else {
    items[index] = {
      ...items[index],
      status: 'inactive',
      updatedAt: new Date().toISOString()
    };
  }

  setMockCatalogItems(items);

  // Update catalog item count
  if (hardDelete) {
    const catalogs = getMockCatalogs();
    const catalogIndex = catalogs.findIndex(c => c.key === catalogKey);
    if (catalogIndex !== -1) {
      catalogs[catalogIndex].itemCount--;
      setMockCatalogs(catalogs);
    }
  }

  return {
    success: true
  };
}

// ===== ADDITIONAL CATALOG OPERATIONS =====

/**
 * Toggle catalog status (active <-> inactive)
 */
export async function toggleCatalogStatus(key: string): Promise<ServiceResponse<Catalog>> {
  await delay(250);

  const catalogs = getMockCatalogs();
  const index = catalogs.findIndex(c => c.key === key);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy danh mục'
    };
  }

  const newStatus = catalogs[index].status === 'active' ? 'inactive' : 'active';
  catalogs[index] = {
    ...catalogs[index],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  setMockCatalogs(catalogs);

  return {
    success: true,
    data: catalogs[index]
  };
}

/**
 * Toggle catalog item status (active <-> inactive)
 */
export async function toggleItemStatus(catalogKey: string, id: string): Promise<ServiceResponse<CatalogItem>> {
  await delay(250);

  const items = getMockCatalogItems();
  const index = items.findIndex(i => i.id === id && i.catalogKey === catalogKey);

  if (index === -1) {
    return {
      success: false,
      error: 'Không tìm thấy mục'
    };
  }

  const newStatus = items[index].status === 'active' ? 'inactive' : 'active';
  items[index] = {
    ...items[index],
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  setMockCatalogItems(items);

  return {
    success: true,
    data: items[index]
  };
}

/**
 * Set an item as default (unset all others in same catalog)
 */
export async function setDefaultItem(catalogKey: string, id: string): Promise<ServiceResponse<CatalogItem>> {
  await delay(250);

  const items = getMockCatalogItems();
  const targetIndex = items.findIndex(i => i.id === id && i.catalogKey === catalogKey);

  if (targetIndex === -1) {
    return {
      success: false,
      error: 'Không tìm thấy mục'
    };
  }

  // Unset all defaults in this catalog
  items.forEach((item, index) => {
    if (item.catalogKey === catalogKey) {
      items[index] = {
        ...item,
        isDefault: index === targetIndex,
        updatedAt: new Date().toISOString()
      };
    }
  });

  setMockCatalogItems(items);

  return {
    success: true,
    data: items[targetIndex]
  };
}

/**
 * Reorder items by updating sort_order
 */
export async function reorderItems(
  catalogKey: string,
  updates: Array<{ id: string; order: number }>
): Promise<ServiceResponse<CatalogItem[]>> {
  await delay(300);

  const items = getMockCatalogItems();
  const catalogItems = items.filter(i => i.catalogKey === catalogKey);

  if (catalogItems.length === 0) {
    return {
      success: false,
      error: 'Không tìm thấy mục nào trong danh mục'
    };
  }

  // Apply order updates
  updates.forEach(update => {
    const index = items.findIndex(i => i.id === update.id && i.catalogKey === catalogKey);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        order: update.order,
        updatedAt: new Date().toISOString()
      };
    }
  });

  setMockCatalogItems(items);

  // Return updated items
  const updatedItems = items.filter(i => i.catalogKey === catalogKey);

  return {
    success: true,
    data: updatedItems
  };
}