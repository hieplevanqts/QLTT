# Master Data Mock Service

Mock service cho module Master Data của MAPPA Portal. Service này cung cấp CRUD operations đầy đủ với in-memory storage, validation, và async simulation.

## Cấu trúc

```
mocks/
├── masterData.types.ts     # TypeScript types & interfaces
├── masterData.mock.ts      # In-memory data storage & seed data
├── masterData.service.ts   # CRUD service functions
└── index.ts               # Exports
```

## Entities

### 1. Org Units (Đơn vị tổ chức)
- CRUD: ✅ Full support
- Soft delete: ✅ Yes
- Validation: Code uniqueness, parent reference

### 2. Departments (Phòng ban)
- CRUD: ✅ Full support
- Soft delete: ✅ Yes
- Validation: Code uniqueness, org unit reference

### 3. Areas (Địa bàn quản lý)
- CRUD: ✅ Full support
- Soft delete: ✅ Yes
- Validation: Code uniqueness

### 4. Catalogs (Danh mục)
- CRUD: ✅ Full support
- Soft delete: ✅ Yes
- Validation: Key uniqueness, key format (lowercase, numbers, hyphens only)

### 5. Catalog Items (Mục trong danh mục)
- CRUD: ✅ Full support
- Hard delete: ✅ Yes (items are deleted permanently)
- Validation: Code uniqueness within catalog

## Service Functions

### List Operations
```typescript
await listOrgUnits({ page: 1, pageSize: 10, search: 'query', sort: { field: 'name', order: 'asc' } });
await listDepartments({ page: 1, pageSize: 10, filters: { orgUnitId: '1' } });
await listAreas({ page: 1, pageSize: 10 });
await listCatalogs({ page: 1, pageSize: 10 });
await listCatalogItems('violation-types', { page: 1, pageSize: 10 });
```

### Get by ID
```typescript
await getOrgUnitById('1');
await getDepartmentById('1');
await getAreaById('1');
await getCatalogByKey('violation-types');
await getCatalogItemById('1');
```

### Create
```typescript
await createOrgUnit({ code: 'TEST', name: 'Test Unit', shortName: 'TU', type: 'central', level: 1 });
await createDepartment({ code: 'DEPT', name: 'Department', orgUnitId: '1' });
await createArea({ code: 'AREA', name: 'Area', type: 'province' });
await createCatalog({ key: 'test-catalog', name: 'Test', description: 'Test catalog' });
await createCatalogItem({ catalogKey: 'test', code: 'ITEM', name: 'Item' });
```

### Update
```typescript
await updateOrgUnit('1', { name: 'Updated Name' });
await updateDepartment('1', { status: 'inactive' });
await updateArea('1', { name: 'New Name' });
await updateCatalog('key', { description: 'New desc' });
await updateCatalogItem('1', { order: 5 });
```

### Delete
```typescript
// Soft delete (default)
await deleteOrgUnit('1', false);
await deleteDepartment('1', false);
await deleteArea('1', false);
await deleteCatalog('key', false);

// Hard delete
await deleteCatalogItem('1', true); // Items are always hard deleted
```

## Features

### ✅ Network Simulation
- Random delay: 200-400ms
- Simulates real API latency

### ✅ Validation
- Required fields validation
- Uniqueness checks (code, key)
- Format validation (catalog keys)
- Parent reference validation
- Detailed error messages

### ✅ Search & Filter
- Full-text search across multiple fields
- Status filtering
- Type filtering
- Org unit filtering (for departments)

### ✅ Sorting
- Sort by any field
- Ascending/descending order

### ✅ Pagination
- Page-based pagination
- Configurable page size
- Total count & total pages

### ✅ Data Persistence
- In-memory storage
- Data persists across operations (until page refresh)
- Auto-incrementing IDs

## Response Format

### Success Response
```typescript
{
  success: true,
  data: {
    data: [...],      // Array of items
    total: 50,        // Total items
    page: 1,          // Current page
    pageSize: 10,     // Items per page
    totalPages: 5     // Total pages
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: "Error message"
}
```

## Validation Errors

Service returns detailed validation errors:

```typescript
{
  success: false,
  error: "Mã đơn vị là bắt buộc, Mã đơn vị đã tồn tại"
}
```

## Integration with Supabase

⚠️ **IMPORTANT**: This is a mock service for development/testing only.

When integrating with Supabase:
1. Replace service imports from `mocks/masterData.service` with real Supabase client calls
2. Keep the same function signatures and response formats
3. Update entity types if needed based on Supabase schema
4. Implement server-side validation
5. Add proper error handling

## Testing

The mock service is used by all Master Data pages:
- OrgUnitsPage
- DepartmentsPage
- JurisdictionsPage
- CatalogsPage
- CatalogItemsPage

All CRUD operations are fully tested via the UI.

## Notes

- **No Supabase**: This service does NOT use Supabase client or make any real API calls
- **In-memory only**: Data resets on page refresh
- **Development only**: For production, replace with real backend integration
