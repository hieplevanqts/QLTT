# Migration Guide: Component Architecture → Registry Pattern

## Tổng quan

Hướng dẫn này giúp bạn migrate từ cấu trúc component hiện tại sang **Registry Components Pattern** - một kiến trúc component rõ ràng hơn, dễ tái sử dụng hơn cho các trang quản lý danh mục (CRUD).

---

## Tại sao cần Registry Pattern?

### ❌ Vấn đề hiện tại

1. **Naming không rõ ràng**
   - `DataTable` - Quá chung chung, không biết dùng cho gì
   - `FilterActionBar` - Tên dài, không thể hiện mục đích
   - `EntityDrawer` - Entity là gì?

2. **Components phân tán**
   - `patterns/` - ActionColumn, BulkActionBar, FilterActionBar
   - `ui-kit/` - DataTable, TableFooter, EmptyState
   - Khó tìm, khó nhớ

3. **Thiếu components quan trọng**
   - Không có SavedViews (lưu bộ lọc)
   - Không có DiffViewer (so sánh thay đổi)
   - Không có VerificationForm (phê duyệt)
   - Không có MergeWorkbench (gộp duplicate)

### ✅ Registry Pattern giải quyết

1. **Naming convention rõ ràng**
   - `RegistryTable` - Bảng cho quản lý danh mục
   - `RegistryFilterBar` - Bộ lọc cho registry
   - `RegistryDetailTabs` - Chi tiết entity

2. **Tổ chức tập trung**
   - Tất cả trong `/src/registry-components/`
   - Import từ 1 nơi: `import { ... } from 'registry-components'`
   - Easy to discover

3. **Đầy đủ components**
   - Có roadmap cho tất cả components cần thiết
   - Phân loại rõ: Core, Support, Dialogs, Advanced

---

## Migration Steps

### Step 1: Cập nhật Imports

**Before:**
```typescript
// Scattered imports
import DataTable from '@/components/ui-kit/DataTable';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import EntityDrawer from '@/components/patterns/EntityDrawer';
import BulkActionBar from '@/components/patterns/BulkActionBar';
import ActionColumn, { CommonActions } from '@/components/patterns/ActionColumn';
import SummaryCard from '@/components/patterns/SummaryCard';
import EmptyState from '@/components/ui-kit/EmptyState';
import TableFooter from '@/components/ui-kit/TableFooter';
import FacilityStatusBadge from '@/components/ui-kit/FacilityStatusBadge';
```

**After:**
```typescript
// Centralized import
import {
  RegistryTable,
  RegistryFilterBar,
  RegistryDetailTabs,
  RegistryBulkActions,
  RegistryActionColumn,
  RegistrySummaryCard,
  RegistryEmptyState,
  RegistryTableFooter,
  RegistryStatusBadge,
  RegistryCommonActions,
  
  // Types
  type RegistryColumn,
  type RegistryBulkAction,
} from '../registry-components';
```

### Step 2: Rename Component Usage

**Before:**
```tsx
<DataTable
  columns={columns}
  data={data}
  selectable={true}
  selectedRows={selectedRows}
  onSelectRow={handleSelectRow}
/>
```

**After:**
```tsx
<RegistryTable
  columns={columns}
  data={data}
  selectable
  selectedRows={selectedRows}
  onSelectRow={handleSelectRow}
/>
```

### Step 3: Update Type Imports

**Before:**
```typescript
import DataTable, { Column } from '@/components/ui-kit/DataTable';

const columns: Column<Store>[] = [
  { key: 'name', label: 'Tên' },
];
```

**After:**
```typescript
import { RegistryTable, type RegistryColumn } from '../registry-components';

const columns: RegistryColumn<Store>[] = [
  { key: 'name', label: 'Tên' },
];
```

### Step 4: Complete Component Mapping

| Old Component | New Component | Notes |
|---------------|---------------|-------|
| `DataTable` | `RegistryTable` | ✅ Ready |
| `FilterActionBar` | `RegistryFilterBar` | ✅ Ready |
| `EntityDrawer` | `RegistryDetailTabs` | ✅ Ready |
| `BulkActionBar` | `RegistryBulkActions` | ✅ Ready |
| `ActionColumn` | `RegistryActionColumn` | ✅ Ready |
| `SummaryCard` | `RegistrySummaryCard` | ✅ Ready |
| `EmptyState` | `RegistryEmptyState` | ✅ Ready |
| `TableFooter` | `RegistryTableFooter` | ✅ Ready |
| `FacilityStatusBadge` | `RegistryStatusBadge` | ✅ Ready |
| `CommonActions` | `RegistryCommonActions` | ✅ Ready |
| `ConfirmDialog` | `RegistryConfirmDialog` | ✅ Ready |
| `ImportDialog` | `RegistryImportDialog` | ✅ Ready |
| `ExportDialog` | `RegistryExportDialog` | ✅ Ready |
| ❌ N/A | `RegistrySavedViews` | 🚧 Planned |
| ❌ N/A | `RegistryWizard` | 🚧 Planned |
| ❌ N/A | `DiffViewer` | 🚧 Planned |
| ❌ N/A | `VerificationForm` | 🚧 Planned |
| ❌ N/A | `MergeWorkbench` | 🚧 Planned |

---

## Full Example: Before & After

### BEFORE (StoresListPage.tsx - Current)

```typescript
// ❌ Old way: Scattered imports
import DataTable, { Column } from '@/components/ui-kit/DataTable';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import EntityDrawer from '@/components/patterns/EntityDrawer';
import BulkActionBar, { BulkAction } from '@/components/patterns/BulkActionBar';
import ActionColumn, { CommonActions } from '@/components/patterns/ActionColumn';
import SummaryCard from '@/components/patterns/SummaryCard';
import EmptyState from '@/components/ui-kit/EmptyState';
import TableFooter from '@/components/ui-kit/TableFooter';
import FacilityStatusBadge from '@/components/ui-kit/FacilityStatusBadge';

export default function StoresListPage() {
  const columns: Column<Store>[] = [...];
  const bulkActions: BulkAction[] = [...];
  
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        <SummaryCard label="Tổng số" value={100} icon={Building2} variant="info" />
      </div>
      
      {/* Filters */}
      <FilterActionBar filters={<>...</>} searchInput={<>...</>} />
      
      {/* Table */}
      <DataTable
        columns={columns}
        data={data}
        selectable={true}
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
      />
      
      <TableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {/* Bulk Actions */}
      <BulkActionBar
        selectedCount={selectedRows.size}
        actions={bulkActions}
        onClear={() => setSelectedRows(new Set())}
      />
      
      {/* Detail */}
      <EntityDrawer
        open={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        tabs={[...]}
      />
    </div>
  );
}
```

### AFTER (New way with Registry Pattern)

```typescript
// ✅ New way: Centralized imports
import {
  RegistryTable,
  RegistryFilterBar,
  RegistryDetailTabs,
  RegistryBulkActions,
  RegistryActionColumn,
  RegistrySummaryCard,
  RegistryEmptyState,
  RegistryTableFooter,
  RegistryStatusBadge,
  RegistryCommonActions,
  type RegistryColumn,
  type RegistryBulkAction,
} from '../registry-components';

export default function StoresListPage() {
  const columns: RegistryColumn<Store>[] = [...];
  const bulkActions: RegistryBulkAction[] = [...];
  
  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-6 gap-4">
        <RegistrySummaryCard label="Tổng số" value={100} icon={Building2} variant="info" />
      </div>
      
      {/* Filters */}
      <RegistryFilterBar filters={<>...</>} searchInput={<>...</>} />
      
      {/* Table */}
      <RegistryTable
        columns={columns}
        data={data}
        selectable
        selectedRows={selectedRows}
        onSelectRow={handleSelectRow}
      />
      
      <RegistryTableFooter
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      {/* Bulk Actions */}
      <RegistryBulkActions
        selectedCount={selectedRows.size}
        actions={bulkActions}
        onClear={() => setSelectedRows(new Set())}
      />
      
      {/* Detail */}
      <RegistryDetailTabs
        open={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        tabs={[...]}
      />
    </div>
  );
}
```

---

## Benefits Summary

### 🎯 Clarity (Rõ ràng)
- Nhìn vào tên component là biết mục đích: `RegistryTable` = bảng cho registry
- Không còn confusion: "EntityDrawer là gì? Drawer cho entity nào?"

### 🔄 Reusability (Tái sử dụng)
- Dễ dàng copy/paste sang module mới
- Template rõ ràng: `/src/pages/REGISTRY_COMPONENTS_EXAMPLE.tsx`
- Components được thiết kế generic từ đầu

### 📦 Maintainability (Dễ maintain)
- Tất cả ở 1 nơi: `/src/registry-components/`
- Document đầy đủ: README.md, MIGRATION_GUIDE.md
- Version control dễ dàng

### 🚀 Scalability (Mở rộng)
- Có roadmap rõ ràng cho components mới
- Architecture sẵn sàng cho: SavedViews, DiffViewer, VerificationForm, MergeWorkbench
- Dễ thêm component mới vào ecosystem

### 🎨 Consistency (Nhất quán)
- Tất cả registry pages dùng chung components
- Design consistent across modules
- Behavior predictable

---

## Checklist Migration

Khi migrate một trang:

- [ ] Đọc `/src/registry-components/README.md`
- [ ] Xem example: `/src/pages/REGISTRY_COMPONENTS_EXAMPLE.tsx`
- [ ] Update imports từ scattered → centralized
- [ ] Rename components (DataTable → RegistryTable)
- [ ] Update type imports (Column → RegistryColumn)
- [ ] Test functionality hoạt động bình thường
- [ ] Test responsive trên mobile
- [ ] Test accessibility (keyboard, screen reader)
- [ ] Update documentation nếu cần

---

## Roadmap

### Phase 1: ✅ Foundation (Completed)
- [x] Tạo `/src/registry-components/` folder
- [x] Export all existing components với naming mới
- [x] Tạo README.md và MIGRATION_GUIDE.md
- [x] Tạo example page

### Phase 2: 🚧 New Components (In Progress)
- [ ] `RegistrySavedViews` - Lưu/tải bộ lọc
- [ ] `DiffViewer` - So sánh thay đổi
- [ ] `VerificationForm` - Phê duyệt workflow

### Phase 3: 📋 Advanced Features (Planned)
- [ ] `RegistryWizard` - Multi-step wizard
- [ ] `MergeWorkbench` - Gộp duplicates
- [ ] `RegistryAdvancedSearch` - Tìm kiếm nâng cao
- [ ] `RegistryTemplates` - Template system

### Phase 4: 🎯 Migration (Ongoing)
- [ ] Migrate "Cơ sở quản lý" page
- [ ] Migrate các module khác (Doanh nghiệp, Sản phẩm, etc.)
- [ ] Deprecate old components
- [ ] Update all documentation

---

## FAQ

**Q: Có bắt buộc phải migrate ngay không?**
A: Không. Old components vẫn hoạt động. Nhưng nên migrate để:
- Dễ maintain hơn
- Có access tới components mới (SavedViews, DiffViewer, etc.)
- Consistent với các module mới

**Q: Registry components có khác gì old components?**
A: Về functionality thì giống nhau, chỉ khác:
- Naming convention rõ ràng hơn
- Tổ chức tốt hơn
- Documentation đầy đủ hơn

**Q: Có cần update CSS không?**
A: Không. Registry components vẫn sử dụng design tokens từ `/src/styles/theme.css` như cũ.

**Q: Làm sao biết component nào map sang component nào?**
A: Xem bảng "Complete Component Mapping" ở trên hoặc check `/src/registry-components/index.ts`

---

## Support

Có câu hỏi? Xem:
- `/src/registry-components/README.md` - Chi tiết từng component
- `/src/pages/REGISTRY_COMPONENTS_EXAMPLE.tsx` - Example đầy đủ
- `/src/patterns/FRAMEWORK_README.md` - Framework documentation gốc

Hoặc liên hệ team Platform.
