# Registry Components - MAPPA Portal

## Tổng quan

Registry Components là bộ components tái sử dụng được thiết kế đặc biệt cho các trang quản lý danh mục (CRUD operations) trong MAPPA Portal. Phù hợp cho: Cơ sở quản lý, Doanh nghiệp, Sản phẩm, Người dùng, v.v.

## Nguyên tắc thiết kế

1. **Generic & Reusable** - Không hard-code logic nghiệp vụ
2. **Type-safe** - Full TypeScript support
3. **Design System** - Sử dụng design tokens từ `/src/styles/theme.css`
4. **Accessible** - WCAG 2.1 compliant
5. **Vietnamese First** - Tất cả text mặc định là tiếng Việt

## Component Architecture

```
registry-components/
├── RegistryTable/              # Bảng danh sách với selection
├── RegistryFilterBar/          # Bộ lọc nâng cao
├── RegistrySavedViews/         # Lưu/tải bộ lọc đã lưu
├── RegistryWizard/             # Wizard flow cho thêm mới
├── RegistryDetailTabs/         # Chi tiết entity với tabs
├── RegistryBulkActions/        # Hành động hàng loạt
├── RegistrySummaryCards/       # Thẻ thống kê tổng quan
├── RegistryActionColumn/       # Cột thao tác trong bảng
├── RegistryImportExport/       # Import/Export dialog
├── DiffViewer/                 # So sánh thay đổi
├── VerificationForm/           # Form xác minh/phê duyệt
├── MergeWorkbench/             # Gộp duplicate records
└── index.ts                    # Exports
```

## Component Matrix

| Component | Mục đích | Tái sử dụng | Trạng thái |
|-----------|----------|-------------|------------|
| RegistryTable | Bảng danh sách có selection, sorting, pagination | ✅ 100% | ✅ Done |
| RegistryFilterBar | Bộ lọc với saved views, export config | ✅ 100% | ✅ Done |
| RegistrySavedViews | Quản lý bộ lọc đã lưu (giống Google Sheets) | ✅ 100% | 🚧 Planned |
| RegistryWizard | Multi-step wizard cho thêm mới phức tạp | ✅ 90% | 🚧 Planned |
| RegistryDetailTabs | Drawer/Modal với tabs cho chi tiết | ✅ 100% | ✅ Done |
| RegistryBulkActions | Thanh hành động hàng loạt nổi | ✅ 100% | ✅ Done |
| RegistrySummaryCards | Grid cards hiển thị metrics | ✅ 100% | ✅ Done |
| RegistryActionColumn | Cột thao tác với dropdown | ✅ 100% | ✅ Done |
| RegistryImportExport | Import/Export với preview | ✅ 80% | 🚧 Planned |
| DiffViewer | So sánh 2 versions (before/after) | ✅ 100% | 🚧 Planned |
| VerificationForm | Form phê duyệt với comment & status | ✅ 90% | 🚧 Planned |
| MergeWorkbench | UI gộp duplicate với conflict resolution | ✅ 80% | 🚧 Planned |

## Migration Plan

### Phase 1: Rename & Reorganize (Đã có sẵn)

Map components hiện tại sang Registry pattern:

```typescript
// Before (scattered)
import DataTable from '@/components/ui-kit/DataTable';
import FilterActionBar from '@/components/patterns/FilterActionBar';
import EntityDrawer from '@/components/patterns/EntityDrawer';
import SummaryCard from '@/components/patterns/SummaryCard';
import BulkActionBar from '@/components/patterns/BulkActionBar';
import ActionColumn from '@/components/patterns/ActionColumn';

// After (organized)
import {
  RegistryTable,
  RegistryFilterBar,
  RegistryDetailTabs,
  RegistrySummaryCards,
  RegistryBulkActions,
  RegistryActionColumn,
} from '../registry-components';
```

**Ánh xạ components:**
- `DataTable` → `RegistryTable`
- `FilterActionBar` → `RegistryFilterBar`
- `EntityDrawer` → `RegistryDetailTabs`
- `SummaryCard` → `RegistrySummaryCards` (wrapper)
- `BulkActionBar` → `RegistryBulkActions`
- `ActionColumn` → `RegistryActionColumn`

### Phase 2: Add Missing Components (Cần phát triển)

**Priority High:**
1. **RegistrySavedViews** - Lưu bộ lọc như Google Sheets
   - Save current filter as view
   - Load saved view
   - Share view with team
   - Default view per user

2. **DiffViewer** - So sánh thay đổi
   - Side-by-side diff
   - Inline diff
   - Highlight changes
   - Used in audit log, merge conflicts

3. **VerificationForm** - Phê duyệt/Xác minh
   - Approve/Reject với lý do
   - Comment thread
   - File attachments
   - Status workflow

**Priority Medium:**
4. **RegistryWizard** - Wizard cho thêm mới phức tạp
   - Multi-step form
   - Progress indicator
   - Validation per step
   - Draft save/resume

5. **MergeWorkbench** - Gộp duplicate
   - Side-by-side comparison
   - Field-by-field selection
   - Conflict resolution
   - Preview before merge

## Usage Examples

### RegistryTable (was DataTable)

```typescript
import { RegistryTable } from '../registry-components';

<RegistryTable<Store>
  columns={columns}
  data={stores}
  selectable
  selectedRows={selectedRows}
  onSelectRow={handleSelectRow}
  onSelectAll={handleSelectAll}
  getRowId={(store) => store.id}
  emptyState={{
    title: "Chưa có cơ sở nào",
    description: "Bắt đầu bằng cách thêm cơ sở đầu tiên"
  }}
/>
```

### RegistrySavedViews (NEW)

```typescript
import { RegistrySavedViews } from '../registry-components';

<RegistrySavedViews
  views={[
    { id: '1', name: 'Cơ sở rủi ro cao', filters: {...}, isDefault: true },
    { id: '2', name: 'Chờ duyệt Q1', filters: {...} },
  ]}
  currentView="1"
  onViewChange={(viewId) => applyFilters(views[viewId].filters)}
  onSaveView={(name, filters) => saveNewView(name, filters)}
  onDeleteView={(viewId) => deleteView(viewId)}
  onSetDefault={(viewId) => setDefaultView(viewId)}
/>
```

### DiffViewer (NEW)

```typescript
import { DiffViewer } from '../registry-components';

<DiffViewer
  before={{
    name: "Cửa hàng A",
    status: "active",
    address: "123 Lê Lợi"
  }}
  after={{
    name: "Cửa hàng A - Chi nhánh 1",
    status: "suspended",
    address: "123 Lê Lợi, Q1"
  }}
  labels={{
    before: "Trước khi sửa",
    after: "Sau khi sửa"
  }}
  mode="side-by-side" // or "inline"
/>
```

### VerificationForm (NEW)

```typescript
import { VerificationForm } from '../registry-components';

<VerificationForm
  title="Xác minh cơ sở mới"
  entityName="Cửa hàng ABC"
  data={storeData}
  onApprove={(comment, files) => {
    approveStore(storeId, comment, files);
  }}
  onReject={(reason, files) => {
    rejectStore(storeId, reason, files);
  }}
  onRequestChanges={(changes, comment) => {
    requestChanges(storeId, changes, comment);
  }}
  allowedActions={['approve', 'reject', 'request_changes']}
/>
```

### MergeWorkbench (NEW)

```typescript
import { MergeWorkbench } from '../registry-components';

<MergeWorkbench
  duplicates={[
    { id: 1, name: "Cửa hàng A", address: "123 Lê Lợi", source: "import" },
    { id: 2, name: "CH A", address: "123 Lê Lợi Q1", source: "manual" },
  ]}
  fields={[
    { key: 'name', label: 'Tên cơ sở', type: 'text' },
    { key: 'address', label: 'Địa chỉ', type: 'text' },
  ]}
  onMerge={(mergedData, idsToDelete) => {
    mergeRecords(mergedData, idsToDelete);
  }}
  onDismiss={() => dismissDuplicates()}
/>
```

## Type Definitions

```typescript
// Core types used across Registry components

export interface RegistryColumn<T> {
  key: keyof T | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface RegistryFilter {
  key: string;
  label: string;
  type: 'select' | 'multiselect' | 'daterange' | 'text';
  options?: { value: string; label: string }[];
  advanced?: boolean;
}

export interface RegistrySavedView {
  id: string;
  name: string;
  filters: Record<string, any>;
  sorting?: { key: string; direction: 'asc' | 'desc' };
  isDefault?: boolean;
  isShared?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface RegistryAction<T = any> {
  label: string;
  icon: React.ReactNode;
  onClick: (item?: T) => void;
  variant?: 'default' | 'destructive' | 'secondary';
  permission?: string;
  separator?: boolean;
}

export interface VerificationAction {
  type: 'approve' | 'reject' | 'request_changes';
  comment: string;
  attachments?: File[];
  changes?: Record<string, any>;
}
```

## Best Practices

### 1. Generic Types
Luôn sử dụng TypeScript generics:

```typescript
// ✅ Good - Reusable
<RegistryTable<Store> data={stores} />
<RegistryTable<Product> data={products} />

// ❌ Bad - Hard-coded
<StoreTable data={stores} />
```

### 2. Composition over Configuration
Dùng slots/children thay vì giant props object:

```typescript
// ✅ Good
<RegistryFilterBar>
  <RegistryFilterBar.SavedViews />
  <RegistryFilterBar.Filters filters={filters} />
  <RegistryFilterBar.Search />
  <RegistryFilterBar.Actions>
    <Button>Export</Button>
  </RegistryFilterBar.Actions>
</RegistryFilterBar>

// ❌ Bad
<RegistryFilterBar
  showSavedViews
  filters={filters}
  showSearch
  actions={[{ label: 'Export', onClick: ... }]}
/>
```

### 3. Controlled vs Uncontrolled
Hỗ trợ cả 2 modes:

```typescript
// Controlled (parent manages state)
<RegistryTable
  selectedRows={selectedRows}
  onSelectRow={setSelectedRows}
/>

// Uncontrolled (internal state)
<RegistryTable
  defaultSelectedRows={[1, 2, 3]}
  onSelectionChange={(rows) => console.log(rows)}
/>
```

### 4. Accessibility
Luôn có:
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

```typescript
<RegistryTable
  ariaLabel="Danh sách cơ sở"
  announceSelection={(count) => `Đã chọn ${count} cơ sở`}
/>
```

## Migration Checklist

Khi refactor một trang sang dùng Registry components:

- [ ] Thay đổi imports sang `registry-components`
- [ ] Rename component instances (DataTable → RegistryTable)
- [ ] Thêm generic types (`<Store>`, `<Product>`)
- [ ] Implement SavedViews nếu có nhiều filters
- [ ] Thêm DiffViewer vào audit log
- [ ] Thêm VerificationForm nếu có workflow phê duyệt
- [ ] Thêm MergeWorkbench nếu có duplicate detection
- [ ] Test responsive trên mobile
- [ ] Test keyboard navigation
- [ ] Test screen reader

## Performance Tips

1. **Virtualization** - Dùng virtual scrolling cho > 100 rows
2. **Memoization** - Memo expensive column renders
3. **Lazy Loading** - Code-split dialogs/modals
4. **Debounce** - Debounce filter/search inputs
5. **Pagination** - Server-side pagination cho large datasets

## Questions?

Liên hệ team Platform hoặc xem examples trong `/src/pages/StoresListPage.tsx`
