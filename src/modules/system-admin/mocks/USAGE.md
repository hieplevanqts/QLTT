# Mock Service - Quick Reference

## Import

```typescript
import {
  // Org Units
  listOrgUnits,
  getOrgUnitById,
  createOrgUnit,
  updateOrgUnit,
  deleteOrgUnit,

  // Departments
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,

  // Areas
  listAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,

  // Catalogs
  listCatalogs,
  getCatalogByKey,
  createCatalog,
  updateCatalog,
  deleteCatalog,

  // Catalog Items
  listCatalogItems,
  getCatalogItemById,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem
} from '../../mocks/masterData.service';

// Types
import type {
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
} from '../../mocks/masterData.types';
```

## Basic Usage

### Load Data
```typescript
const loadData = async () => {
  setLoading(true);
  try {
    const response = await listOrgUnits({
      page: currentPage,
      pageSize: 10,
      search: searchQuery,
      sort: { field: 'name', order: 'asc' }
    });

    if (response.success && response.data) {
      setItems(response.data.data);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } else {
      toast.error(response.error || 'Error loading data');
    }
  } catch (error) {
    toast.error('Error loading data');
  } finally {
    setLoading(false);
  }
};
```

### Create Item
```typescript
const handleCreate = async () => {
  setSubmitting(true);
  try {
    const payload: CreateOrgUnitPayload = {
      code: formData.code,
      name: formData.name,
      shortName: formData.shortName,
      type: formData.type,
      level: formData.level,
      status: 'active'
    };

    const response = await createOrgUnit(payload);

    if (response.success) {
      toast.success('Created successfully');
      loadData(); // Reload
    } else {
      toast.error(response.error || 'Error creating');
    }
  } catch (error) {
    toast.error('Error creating');
  } finally {
    setSubmitting(false);
  }
};
```

### Update Item
```typescript
const handleUpdate = async (id: string) => {
  setSubmitting(true);
  try {
    const payload: UpdateOrgUnitPayload = {
      name: formData.name,
      status: formData.status
    };

    const response = await updateOrgUnit(id, payload);

    if (response.success) {
      toast.success('Updated successfully');
      loadData();
    } else {
      toast.error(response.error || 'Error updating');
    }
  } catch (error) {
    toast.error('Error updating');
  } finally {
    setSubmitting(false);
  }
};
```

### Delete Item
```typescript
const handleDelete = async (id: string) => {
  setSubmitting(true);
  try {
    const response = await deleteOrgUnit(id, false); // soft delete

    if (response.success) {
      toast.success('Deleted successfully');
      loadData();
    } else {
      toast.error(response.error || 'Error deleting');
    }
  } catch (error) {
    toast.error('Error deleting');
  } finally {
    setSubmitting(false);
  }
};
```

## Request Options

### ListRequest
```typescript
interface ListRequest {
  page?: number;        // Default: 1
  pageSize?: number;    // Default: 10
  search?: string;      // Full-text search
  filters?: {
    status?: 'active' | 'inactive';
    type?: string;
    orgUnitId?: string;
    // ... entity-specific filters
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}
```

### Examples
```typescript
// Basic list
await listOrgUnits();

// With search
await listOrgUnits({ search: 'Cục' });

// With filters
await listDepartments({
  filters: { orgUnitId: '1', status: 'active' }
});

// With pagination
await listAreas({
  page: 2,
  pageSize: 20
});

// With sorting
await listCatalogs({
  sort: { field: 'name', order: 'asc' }
});

// Combined
await listOrgUnits({
  page: 1,
  pageSize: 10,
  search: 'query',
  filters: { status: 'active' },
  sort: { field: 'createdAt', order: 'desc' }
});
```

## Response Format

### Success
```typescript
{
  success: true,
  data: {
    data: [...],      // Array of items
    total: 50,        // Total count
    page: 1,          // Current page
    pageSize: 10,     // Items per page
    totalPages: 5     // Total pages
  }
}
```

### Error
```typescript
{
  success: false,
  error: "Error message"
}
```

## Validation

Service automatically validates:
- Required fields
- Unique constraints (code, key)
- Format rules (catalog keys)
- Parent references

Example error:
```typescript
{
  success: false,
  error: "Mã đơn vị là bắt buộc, Mã đơn vị đã tồn tại"
}
```

## Tips

1. **Always check response.success**
```typescript
if (response.success) {
  // Handle success
} else {
  // Handle error
}
```

2. **Use toast for feedback**
```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error(response.error || 'Error occurred');
```

3. **Reload after mutations**
```typescript
const response = await createItem(payload);
if (response.success) {
  await loadData(); // Refresh list
}
```

4. **Handle loading states**
```typescript
setLoading(true);
try {
  // API call
} finally {
  setLoading(false);
}
```

5. **Soft vs Hard delete**
```typescript
// Soft delete (status = 'inactive')
await deleteOrgUnit(id, false);

// Hard delete (permanent removal)
await deleteCatalogItem(id, true);
```
