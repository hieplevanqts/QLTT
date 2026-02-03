# SA Master Data Module

Module quản lý Dữ liệu nền (Master Data) cho hệ thống MAPPA Portal.

## Cấu trúc

```
sa-master-data/
├── pages/              # Các trang UI
│   ├── OrgUnitsPage.tsx           # Quản lý đơn vị tổ chức
│   ├── DepartmentsPage.tsx        # Quản lý phòng ban
│   ├── JurisdictionsPage.tsx      # Quản lý địa bàn
│   ├── JurisdictionMapPage.tsx    # Bản đồ địa bàn
│   ├── CatalogsPage.tsx           # Quản lý danh mục
│   ├── CatalogItemsPage.tsx       # Các mục trong danh mục
│   ├── CatalogSchemaPage.tsx      # Schema danh mục
│   └── index.ts
├── types.ts            # TypeScript interfaces
├── mock-data.ts        # Dữ liệu mock cho development
├── routes.tsx          # Route configuration
├── index.ts            # Module exports
└── README.md
```

## Routes

Base path: `/system-admin/master-data`

| Route | Component | Permission | Mô tả |
|-------|-----------|-----------|-------|
| `org-units` | OrgUnitsPage | `sa.masterdata.orgunit.read` | Quản lý đơn vị tổ chức |
| `departments` | DepartmentsPage | `sa.masterdata.department.read` | Quản lý phòng ban |
| `jurisdictions` | JurisdictionsPage | `sa.masterdata.jurisdiction.read` | Danh sách địa bàn |
| `jurisdictions/:id/map` | JurisdictionMapPage | `sa.masterdata.jurisdiction.read` | Bản đồ địa bàn |
| `catalogs` | CatalogsPage | `sa.masterdata.catalog.read` | Danh sách danh mục |
| `catalogs/:catalogKey/items` | CatalogItemsPage | `sa.masterdata.catalog.read` | Các mục trong danh mục |
| `catalogs/:catalogKey/schema` | CatalogSchemaPage | `sa.masterdata.catalog.read` | Cấu hình schema |

## Permissions

### Org Units
- `sa.masterdata.orgunit.read` - Xem danh sách
- `sa.masterdata.orgunit.create` - Thêm mới
- `sa.masterdata.orgunit.update` - Chỉnh sửa
- `sa.masterdata.orgunit.delete` - Xóa

### Departments
- `sa.masterdata.department.read` - Xem danh sách
- `sa.masterdata.department.create` - Thêm mới
- `sa.masterdata.department.update` - Chỉnh sửa
- `sa.masterdata.department.delete` - Xóa

### Jurisdictions
- `sa.masterdata.jurisdiction.read` - Xem danh sách và bản đồ
- `sa.masterdata.jurisdiction.create` - Thêm mới
- `sa.masterdata.jurisdiction.update` - Chỉnh sửa (bao gồm vẽ ranh giới)
- `sa.masterdata.jurisdiction.delete` - Xóa

### Catalogs
- `sa.masterdata.catalog.read` - Xem danh mục và items
- `sa.masterdata.catalog.create` - Thêm mới danh mục/item
- `sa.masterdata.catalog.update` - Chỉnh sửa schema/item
- `sa.masterdata.catalog.delete` - Xóa danh mục/item

## Data Types

### OrgUnit (Đơn vị tổ chức)
- Phân cấp: Cục (central) → Chi cục (provincial) → Đội (team)
- Cấu trúc cây (parent-child relationship)

### Department (Phòng ban)
- Thuộc một OrgUnit
- Có trưởng phòng (headId)

### Jurisdiction (Địa bàn)
- Phân loại: Tỉnh/TP, Phường/Xã, Phường/Xã
- Có ranh giới (boundary) dạng GeoJSON Polygon
- Được quản lý bởi một OrgUnit

### Catalog (Danh mục)
- Chứa nhiều CatalogItem
- Có thể có Schema tùy chỉnh (metadata structure)

### CatalogItem (Mục trong danh mục)
- Có thứ tự (order)
- Metadata theo schema nếu catalog có schema

### CatalogSchema
- Định nghĩa cấu trúc metadata cho CatalogItem
- Các loại field: text, number, boolean, date, select

## Features

### ✅ Hoàn thành
- [x] Permission-based access control với PermissionGate
- [x] Search và pagination cho tất cả danh sách
- [x] Mock data đầy đủ
- [x] UI responsive với design system
- [x] Breadcrumbs navigation
- [x] Empty states
- [x] Disable buttons theo quyền

### 🚧 Placeholder (Chưa implement)
- [ ] Bản đồ thực tế cho Jurisdiction (hiện tại là placeholder)
- [ ] Form thêm/sửa cho tất cả entities
- [ ] API integration
- [ ] Validation
- [ ] Import/Export Excel
- [ ] Bulk operations
- [ ] Audit trail

## Usage

### Tích hợp vào app routes

```typescript
import { saMasterDataRoutes } from '@/modules/system-admin/sa-master-data';

const routes: RouteObject[] = [
  // ... other routes
  saMasterDataRoutes,
  // ... other routes
];
```

### Sử dụng shared components

```typescript
import { PermissionGate, ModuleShell, EmptyState } from '../_shared';

function MyPage() {
  return (
    <PermissionGate permission="sa.masterdata.read">
      <ModuleShell title="My Page">
        <EmptyState title="No data" />
      </ModuleShell>
    </PermissionGate>
  );
}
```

## Development Notes

- Tất cả components sử dụng CSS variables từ `/src/styles/global.css`
- Typography sử dụng `--font-heading` và `--font-body`
- Spacing sử dụng `--spacing-*` tokens
- Colors sử dụng `--text-*`, `--bg-*`, `--border-*` tokens
- Import sử dụng relative paths (không dùng `@/` alias)
- Mỗi page bọc trong PermissionGate
- Buttons disable theo quyền thực tế của user
