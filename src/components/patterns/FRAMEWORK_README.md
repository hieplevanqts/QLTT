# MAPPA Portal Framework - Master Template Documentation

## Tổng quan

Framework này được xây dựng từ trang "Cơ sở quản lý" và được chuẩn hóa để sử dụng lại cho toàn bộ các module trong hệ thống MAPPA Portal.

## Nguyên tắc thiết kế

1. **Giữ nguyên bố cục** - Không thay đổi cấu trúc tổng thể
2. **Dùng chung Design Tokens** - Tất cả màu sắc, kích thước, font từ `/src/styles/theme.css`
3. **CSS Modules** - Tránh xung đột khi tích hợp
4. **Tiếng Việt đầy đủ** - Tất cả nhãn, trạng thái, thông báo
5. **Hỗ trợ phân quyền** - Mọi component có prop `permission` để ẩn/hiện

## Cấu trúc Framework

### 1. Summary Cards (Thẻ thống kê nhanh)

**File:** `/src/patterns/SummaryCard.tsx`

**Mục đích:** Hiển thị các chỉ số tổng quan, cho phép lọc nhanh khi click.

**Props:**
```typescript
{
  label: string;              // Nhãn hiển thị
  value: number | string;      // Giá trị
  icon: LucideIcon;           // Icon từ lucide-react
  variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  trend?: {                   // Xu hướng tăng/giảm (optional)
    value: string;
    direction: 'up' | 'down';
  };
  active?: boolean;           // Đang được chọn để lọc
  onClick?: () => void;       // Xử lý click để lọc
}
```

**Cách dùng:**
```tsx
<SummaryCard
  label="Tổng số cơ sở"
  value={125}
  icon={Building2}
  variant="info"
  active={activeFilter === 'all'}
  onClick={() => setActiveFilter('all')}
/>
```

**Biến thể màu sắc:**
- `success` - Xanh lá (#10b981) - Cho trạng thái tích cực
- `warning` - Vàng cam (#f59e0b) - Cho cảnh báo
- `danger` - Đỏ (--destructive) - Cho rủi ro cao
- `info` - Tím (--primary) - Cho thông tin chung
- `neutral` - Xám (--muted-foreground) - Cho dữ liệu trung lập

---

### 2. Advanced Filter Bar (Bộ lọc nâng cao)

**File:** `/src/patterns/AdvancedFilterBar.tsx`

**Mục đích:** Thay thế FilterBar cũ, hỗ trợ bộ lọc nâng cao có thể ẩn/hiện.

**Props:**
```typescript
{
  filters: FilterConfig[];              // Danh sách bộ lọc
  onFilterChange?: (filters: Record<string, string>) => void;
  onReset?: () => void;
}

interface FilterConfig {
  key: string;                          // ID của filter
  label: string;                        // Nhãn hiển thị
  placeholder: string;                  // Placeholder cho dropdown
  options: FilterOption[];              // Danh sách lựa chọn
  advanced?: boolean;                   // Có phải filter nâng cao không
}
```

**Cách dùng:**
```tsx
const filters: FilterConfig[] = [
  {
    key: 'jurisdiction',
    label: 'Địa bàn',
    placeholder: 'Tất cả địa bàn',
    options: [
      { value: 'q1', label: 'Phường 1' },
      { value: 'q3', label: 'Phường 3' },
    ],
  },
  {
    key: 'riskLevel',
    label: 'Mức độ rủi ro',
    placeholder: 'Tất cả mức độ',
    options: [...],
    advanced: true,  // Sẽ ẩn trong bộ lọc nâng cao
  },
];

<AdvancedFilterBar
  filters={filters}
  onFilterChange={(values) => console.log(values)}
  onReset={() => console.log('Reset')}
/>
```

**Tính năng:**
- Bộ lọc chính luôn hiển thị
- Bộ lọc nâng cao (`advanced: true`) ẩn mặc định
- Đếm số lượng filter đang active
- Nút "Đặt lại" chỉ hiện khi có filter active

---

### 3. Quick Actions (Hành động nhanh)

**File:** `/src/patterns/QuickActions.tsx`

**Mục đích:** Hiển thị các hành động thường dùng ở đầu trang danh sách.

**Props:**
```typescript
{
  title?: string;                       // Tiêu đề (mặc định: "Hành động nhanh")
  actions: QuickAction[];               // Danh sách hành động
}

interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  permission?: string;                  // Cho phân quyền
}
```

**Cách dùng:**
```tsx
const actions: QuickAction[] = [
  {
    label: 'Thêm cơ sở',
    icon: <Plus size={16} />,
    onClick: () => console.log('Add'),
    variant: 'default',
    permission: 'store.create',
  },
  {
    label: 'Nhập từ Excel',
    icon: <Upload size={16} />,
    onClick: () => console.log('Import'),
    variant: 'outline',
    permission: 'store.import',
  },
];

<QuickActions actions={actions} />
```

**Hành động thường dùng:**
- Thêm mới
- Nhập từ Excel
- Xuất dữ liệu
- Gắn rủi ro nhanh
- Tạo kế hoạch kiểm tra

---

### 4. Bulk Action Bar (Thanh hành động hàng loạt)

**File:** `/src/patterns/BulkActionBar.tsx`

**Mục đích:** Hiển thị thanh nổi khi người dùng chọn nhiều dòng trong bảng.

**Props:**
```typescript
{
  selectedCount: number;                // Số lượng dòng đã chọn
  actions: BulkAction[];                // Danh sách hành động
  onClear: () => void;                  // Xóa toàn bộ lựa chọn
}

interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'destructive';
  icon?: React.ReactNode;
}
```

**Cách dùng:**
```tsx
const bulkActions: BulkAction[] = [
  {
    label: 'Gán rủi ro',
    onClick: () => console.log('Bulk assign risk'),
    variant: 'default',
    icon: <TriangleAlert size={16} />,
  },
  {
    label: 'Phân công',
    onClick: () => console.log('Bulk assign'),
    variant: 'secondary',
    icon: <UserCog size={16} />,
  },
];

<BulkActionBar
  selectedCount={selectedRows.size}
  actions={bulkActions}
  onClear={() => setSelectedRows(new Set())}
/>
```

**Tính năng:**
- Tự động ẩn khi không có dòng nào được chọn
- Hiển thị dạng thanh nổi ở dưới màn hình
- Animation slide-up khi xuất hiện
- Nút X để clear toàn bộ selection

---

### 5. Action Column (Cột thao tác)

**File:** `/src/patterns/ActionColumn.tsx`

**Mục đích:** Cột thao tác trong bảng danh sách với icon buttons và dropdown menu.

**Props:**
```typescript
{
  actions: Action[];                    // Các hành động trong dropdown
  quickActions?: Action[];              // Hiển thị ngoài dạng icon button
}

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  permission?: string;
  separator?: boolean;                  // Thêm separator sau action này
}
```

**Cách dùng:**
```tsx
import ActionColumn, { CommonActions } from '@/components/patterns/ActionColumn';

// Trong column definition:
{
  key: 'actions',
  label: 'Thao tác',
  render: (item) => (
    <ActionColumn
      quickActions={[
        CommonActions.view(() => setSelected(item)),
      ]}
      actions={[
        CommonActions.edit(() => console.log('Edit', item.id)),
        CommonActions.assignRisk(() => console.log('Risk', item.id)),
        CommonActions.delete(() => console.log('Delete', item.id)),
      ]}
    />
  ),
}
```

**CommonActions có sẵn:**
- `view` - Xem chi tiết (icon: Eye)
- `edit` - Chỉnh sửa (icon: Edit)
- `delete` - Xóa (icon: Trash2, variant: destructive)
- `assignRisk` - Gắn rủi ro (icon: TriangleAlert)
- `assign` - Phân công quản lý (icon: UserCog)
- `pause` - Tạm ngưng hoạt động (icon: PauseCircle)
- `resume` - Khôi phục hoạt động (icon: PlayCircle)
- `viewDocs` - Xem hồ sơ pháp lý (icon: FileText)
- `viewHistory` - Xem lịch sử kiểm tra (icon: History)

**Tooltip:**
- Quick actions hiển thị tooltip khi hover
- Dropdown actions không cần tooltip

---

### 6. Facility Status Badge (Trạng thái cơ sở)

**File:** `/src/ui-kit/FacilityStatusBadge.tsx`

**Mục đích:** Hiển thị trạng thái cơ sở với màu sắc và icon chuẩn hóa.

**Props:**
```typescript
{
  status: FacilityStatus;               // Trạng thái
  showIcon?: boolean;                   // Hiển thị icon (mặc định: true)
}

type FacilityStatus = 
  | 'pending'           // Chờ duyệt
  | 'active'            // Đang hoạt động
  | 'underInspection'   // Đang xử lý kiểm tra
  | 'suspended'         // Tạm ngưng hoạt động
  | 'closed';           // Ngừng hoạt động
```

**Cách dùng:**
```tsx
<FacilityStatusBadge status="active" />
<FacilityStatusBadge status="suspended" showIcon={false} />
```

**Trạng thái và màu sắc:**

| Trạng thái | Label | Icon | Màu |
|-----------|-------|------|-----|
| `pending` | Chờ duyệt | Clock | Vàng cam (#f59e0b) |
| `active` | Đang hoạt động | CheckCircle | Xanh lá (#10b981) |
| `underInspection` | Đang xử lý kiểm tra | Search | Xanh dương (#3b82f6) |
| `suspended` | Tạm ngưng hoạt động | PauseCircle | Đỏ (#ef4444) |
| `closed` | Ngừng hoạt động | XCircle | Xám (--muted-foreground) |

**Hành động hợp lệ theo trạng thái:**
```typescript
// Export từ FacilityStatusBadge.tsx
import { statusConfig } from '@/components/ui-kit/FacilityStatusBadge';

const allowedActions = statusConfig[store.status].allowedActions;
// Trả về: ['view', 'edit', 'assignRisk', ...]
```

---

### 7. Data Table với Checkboxes

**File:** `/src/ui-kit/DataTable.tsx` (đã có sẵn)

**Mục đích:** Bảng dữ liệu hỗ trợ selection hàng loạt.

**Props bổ sung:**
```typescript
{
  selectable?: boolean;                 // Bật checkbox
  selectedRows?: Set<string | number>;  // Danh sách ID đã chọn
  onSelectRow?: (id: string | number) => void;
  onSelectAll?: (selected: boolean) => void;
  getRowId?: (item: T) => string | number;
}
```

**Cách dùng:**
```tsx
const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

const handleSelectRow = (id: number) => {
  const newSelected = new Set(selectedRows);
  if (newSelected.has(id)) {
    newSelected.delete(id);
  } else {
    newSelected.add(id);
  }
  setSelectedRows(newSelected);
};

<DataTable
  columns={columns}
  data={data}
  selectable={true}
  selectedRows={selectedRows}
  onSelectRow={handleSelectRow}
  onSelectAll={(selected) => {
    if (selected) {
      setSelectedRows(new Set(data.map(d => d.id)));
    } else {
      setSelectedRows(new Set());
    }
  }}
  getRowId={(item) => item.id}
/>
```

---

## Template sử dụng Framework

### Cấu trúc trang chuẩn:

```tsx
export default function ModulePage() {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="flex flex-col">
      {/* 1. Page Header */}
      <PageHeader
        breadcrumbs={[...]}
        title="Tên Module"
      />

      {/* 2. Summary Cards */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          <SummaryCard {...} />
          {/* Tối đa 6 cards */}
        </div>

        {/* 3. Advanced Filter Bar */}
        <AdvancedFilterBar filters={filterConfigs} />
      </div>

      {/* 4. Quick Actions */}
      <div className="px-6">
        <QuickActions actions={quickActions} />
      </div>

      {/* 5. Data Table */}
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="p-6">
            <SearchInput {...} />
            <DataTable
              columns={columns}
              data={data}
              selectable={true}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
            />
          </CardContent>
        </Card>
      </div>

      {/* 6. Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedRows.size}
        actions={bulkActions}
        onClear={() => setSelectedRows(new Set())}
      />

      {/* 7. Entity Drawer */}
      <EntityDrawer
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        tabs={[
          { value: 'overview', label: 'Tổng quan', content: <...> },
          { value: 'history', label: 'Lịch sử thay đổi', content: <...> },
          { value: 'inspections', label: 'Lịch sử kiểm tra', content: <...> },
          { value: 'files', label: 'Hồ sơ pháp lý', content: <...> },
        ]}
      />
    </div>
  );
}
```

---

## Phân quyền (Role-based Permissions)

Mọi component đều có prop `permission` để hỗ trợ phân quyền:

```tsx
// Quick Actions
const actions: QuickAction[] = [
  {
    label: 'Thêm cơ sở',
    icon: <Plus size={16} />,
    onClick: () => {},
    permission: 'store.create',  // Chỉ hiển thị nếu user có quyền này
  },
];

// Action Column
const actions: Action[] = [
  {
    label: 'Xóa',
    icon: <Trash2 size={16} />,
    onClick: () => {},
    permission: 'store.delete',  // Chỉ hiển thị nếu user có quyền này
  },
];
```

**Cách triển khai phân quyền:**
```tsx
// 1. Tạo hook kiểm tra quyền
const usePermissions = () => {
  const userRole = 'admin'; // Lấy từ context hoặc store
  
  const hasPermission = (permission: string) => {
    // Logic kiểm tra quyền
    return true;
  };
  
  return { hasPermission };
};

// 2. Filter actions theo quyền
const { hasPermission } = usePermissions();

const filteredActions = quickActions.filter(action => 
  !action.permission || hasPermission(action.permission)
);

<QuickActions actions={filteredActions} />
```

---

## Audit & Lịch sử

Tab "Lịch sử thay đổi" trong EntityDrawer theo format chuẩn:

```tsx
{
  value: 'history',
  label: 'Lịch sử thay đổi',
  content: (
    <div className="space-y-4">
      <div className="text-sm">
        {/* Entry mới nhất */}
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
          <div className="flex-1">
            <div className="font-medium">Tên hành động</div>
            <div className="text-muted-foreground text-xs mt-1">
              Chi tiết thay đổi
            </div>
            <div className="text-muted-foreground text-xs mt-1">
              Bởi: Tên người dùng • Ngày giờ
            </div>
          </div>
        </div>
        
        {/* Entry cũ hơn */}
        <div className="flex items-start gap-3 pb-4 border-b border-border pt-4">
          <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1.5" />
          {/* ... */}
        </div>
      </div>
    </div>
  ),
}
```

**Các hành động cần ghi log:**
- Thay đổi trạng thái
- Gắn rủi ro
- Phân công quản lý
- Chỉnh sửa thông tin
- Tạo/Xóa entity

---

## CSS Modules & Design Tokens

Tất cả component dùng CSS Modules và design tokens từ `/src/styles/theme.css`:

**Màu sắc:**
- `var(--primary)` - Màu chủ đạo
- `var(--destructive)` - Màu nguy hiểm
- `var(--muted-foreground)` - Text phụ
- `var(--border)` - Viền
- `var(--card)` - Nền card

**Typography:**
- `var(--text-xs)` - 12px
- `var(--text-sm)` - 14px
- `var(--text-base)` - 16px
- `var(--text-lg)` - 20px
- `var(--text-xl)` - 24px
- `var(--text-2xl)` - 30px

**Font weights:**
- `var(--font-weight-normal)` - 400
- `var(--font-weight-medium)` - 500
- `var(--font-weight-semibold)` - 600
- `var(--font-weight-bold)` - 700

**Border radius:**
- `var(--radius)` - 8px
- `var(--radius-card)` - 16px

**Shadow:**
- `var(--elevation-sm)` - Shadow nhỏ

---

## Responsive Design

Framework hỗ trợ responsive với breakpoints:

**Summary Cards:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
  {/* Mobile: 1 cột, Tablet: 3 cột, Desktop: 6 cột */}
</div>
```

**Filter Bar:**
- Desktop: Hiển thị inline
- Mobile: Tự động wrap xuống dòng

**Bulk Action Bar:**
- Desktop: min-width 600px
- Mobile: Full width với padding

---

## Migration từ trang cũ

1. Thay `FilterBar` → `AdvancedFilterBar`
2. Thêm `SummaryCard` section
3. Thêm `QuickActions` section
4. Thêm `selectable={true}` vào DataTable
5. Thêm `BulkActionBar`
6. Thêm `ActionColumn` vào column cuối
7. Thay `StatusBadge` → `FacilityStatusBadge` (nếu dùng cho cơ sở)
8. Thêm tab "Lịch sử thay đổi" vào EntityDrawer

---

## Checklist khi tạo module mới

- [ ] PageHeader với breadcrumbs
- [ ] 6 Summary Cards (hoặc ít hơn)
- [ ] AdvancedFilterBar với ít nhất 4 filters
- [ ] QuickActions với 3-5 actions
- [ ] DataTable với selectable=true
- [ ] Action Column với quick actions + dropdown
- [ ] BulkActionBar với 3-5 bulk actions
- [ ] EntityDrawer với 4 tabs: Tổng quan, Lịch sử thay đổi, Lịch sử kiểm tra, Hồ sơ
- [ ] Tất cả nhãn đều tiếng Việt
- [ ] Dùng design tokens từ theme.css
- [ ] CSS Modules cho component mới
- [ ] Props `permission` cho tất cả actions

---

## Ví dụ module khác

Framework này có thể áp dụng cho:

1. **Nguồn tin / Risk** - Quản lý nguồn tin báo rủi ro
2. **Kế hoạch tác nghiệp** - Quản lý kế hoạch kiểm tra
3. **Biên bản** - Quản lý biên bản kiểm tra
4. **Đội kiểm tra** - Quản lý đội ngũ kiểm tra
5. **Báo cáo** - Quản lý báo cáo định kỳ

Chỉ cần thay đổi:
- Data interface
- Column definitions
- Status types (nếu cần)
- Filter configs
- Actions theo nghiệp vụ

---

## Liên hệ & Hỗ trợ

Tài liệu này là phiên bản 1.0 của MAPPA Portal Framework.

Mọi góp ý, báo lỗi, hoặc đề xuất cải tiến vui lòng liên hệ team phát triển.
