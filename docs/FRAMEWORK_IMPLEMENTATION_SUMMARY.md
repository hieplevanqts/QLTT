# MAPPA Portal Framework - Implementation Summary

## Tổng quan
Đã hoàn thành việc chuẩn hóa và mở rộng trang "Cơ sở & Địa bàn" thành **Master Framework** để sử dụng chung cho toàn bộ hệ thống MAPPA Portal.

## Các thành phần đã tạo

### 1. **SummaryCard** - Thẻ thống kê nhanh
- **File**: `/src/patterns/SummaryCard.tsx` + `.module.css`
- **Chức năng**: Hiển thị các chỉ số tổng quan (tổng số, đang hoạt động, chờ xác minh, etc.)
- **Tính năng**:
  - Click để lọc dữ liệu tương ứng
  - 5 biến thể màu sắc: success, warning, danger, info, neutral
  - Hỗ trợ hiển thị xu hướng (trend) tùy chọn
  - Active state khi được chọn
- **Responsive**: Grid 1 cột (mobile) → 3 cột (tablet) → 6 cột (desktop)

### 2. **AdvancedFilterBar** - Bộ lọc nâng cao
- **File**: `/src/patterns/AdvancedFilterBar.tsx` + `.module.css`
- **Chức năng**: Thay thế FilterBar cũ với khả năng mở rộng
- **Tính năng**:
  - Bộ lọc chính luôn hiển thị
  - Bộ lọc nâng cao ẩn mặc định (toggle với nút)
  - Đếm số filter đang active
  - Nút "Đặt lại" chỉ hiện khi có filter
  - Cấu hình linh hoạt qua `FilterConfig[]`

### 3. **QuickActions** - Hành động nhanh
- **File**: `/src/patterns/QuickActions.tsx` + `.module.css`
- **Chức năng**: Hiển thị các hành động thường dùng
- **Tính năng**:
  - Hỗ trợ prop `permission` cho phân quyền
  - 3 biến thể: default, outline, secondary
  - Responsive với flex-wrap

### 4. **BulkActionBar** - Thanh hành động hàng loạt
- **File**: `/src/patterns/BulkActionBar.tsx` + `.module.css`
- **Chức năng**: Thanh nổi ở cuối màn hình khi chọn nhiều dòng
- **Tính năng**:
  - Tự động ẩn/hiện dựa trên `selectedCount`
  - Animation slide-up
  - Hiển thị số lượng đã chọn
  - Nút X để clear selection
  - Fixed position ở giữa màn hình

### 5. **ActionColumn** - Cột thao tác
- **File**: `/src/patterns/ActionColumn.tsx`
- **Chức năng**: Cột thao tác trong bảng danh sách
- **Tính năng**:
  - Quick actions: Icon buttons với tooltip
  - More actions: Dropdown menu
  - CommonActions có sẵn 9 hành động chuẩn
  - Hỗ trợ separator giữa các action
  - Hỗ trợ variant destructive

**CommonActions có sẵn:**
- `view` - Xem chi tiết
- `edit` - Chỉnh sửa
- `delete` - Xóa
- `assignRisk` - Gắn rủi ro
- `assign` - Phân công quản lý
- `pause` - Tạm ngưng hoạt động
- `resume` - Khôi phục hoạt động
- `viewDocs` - Xem hồ sơ pháp lý
- `viewHistory` - Xem lịch sử kiểm tra

### 6. **FacilityStatusBadge** - Trạng thái cơ sở
- **File**: `/src/ui-kit/FacilityStatusBadge.tsx` + `.module.css`
- **Chức năng**: Badge hiển thị trạng thái với màu sắc và icon chuẩn hóa
- **5 trạng thái chuẩn**:
  1. **pending** (Chờ xác minh) - Vàng cam, Clock icon
  2. **active** (Đang hoạt động) - Xanh lá, CircleCheck icon
  3. **underInspection** (Đang xử lý kiểm tra) - Xanh dương, Search icon
  4. **suspended** (Tạm ngưng hoạt động) - Đỏ, CirclePause icon
  5. **closed** (Ngừng hoạt động) - Xám, CircleX icon
- **Export `statusConfig`**: Chứa `allowedActions` cho mỗi trạng thái

## Cải tiến trang "Cơ sở & Địa bàn"

### Cấu trúc mới:
```
1. PageHeader (breadcrumbs + title)
2. Summary Cards (6 thẻ thống kê)
3. Advanced Filter Bar (4 bộ lọc + 3 bộ lọc nâng cao)
4. Quick Actions (5 hành động)
5. Data Table với:
   - Checkbox để chọn hàng loạt
   - 8 cột dữ liệu
   - Cột thao tác với quick actions + dropdown
6. Bulk Action Bar (hiện khi chọn dòng)
7. Entity Drawer với 4 tabs:
   - Tổng quan
   - Lịch sử thay đổi (audit trail)
   - Lịch sử kiểm tra
   - Hồ sơ pháp lý
```

### Dữ liệu mẫu:
- 8 cơ sở với đầy đủ 5 trạng thái
- Bao gồm tất cả mức độ rủi ro
- Nhiều địa bàn khác nhau
- Đơn vị quản lý

## Design System Compliance

### CSS Modules
Tất cả component mới đều sử dụng CSS Modules:
- `SummaryCard.module.css`
- `BulkActionBar.module.css`
- `QuickActions.module.css`
- `AdvancedFilterBar.module.css`
- `FacilityStatusBadge.module.css`

### Design Tokens
Tất cả styles sử dụng tokens từ `/src/styles/theme.css`:
- Colors: `var(--primary)`, `var(--destructive)`, `var(--muted-foreground)`, etc.
- Typography: `var(--text-xs)` đến `var(--text-2xl)`
- Font weights: `var(--font-weight-normal)` đến `var(--font-weight-bold)`
- Border radius: `var(--radius)`, `var(--radius-card)`
- Shadow: `var(--elevation-sm)`

### Font Family
Tất cả text sử dụng `font-family: 'Inter', sans-serif;` từ theme.css

## Phân quyền (Permission Framework)

Mọi component hỗ trợ prop `permission`:
```typescript
// QuickAction
{
  label: 'Thêm cơ sở',
  icon: <Plus size={16} />,
  onClick: () => {},
  permission: 'store.create',
}

// Action in ActionColumn
{
  label: 'Xóa',
  icon: <Trash2 size={16} />,
  onClick: () => {},
  permission: 'store.delete',
}
```

## Tài liệu

### 1. Framework README
- **File**: `/src/patterns/FRAMEWORK_README.md`
- **Nội dung**: 
  - Hướng dẫn sử dụng từng component
  - Props và variants
  - Code examples
  - Template trang chuẩn
  - Migration guide
  - Checklist cho module mới

### 2. Implementation Summary
- **File**: `/FRAMEWORK_IMPLEMENTATION_SUMMARY.md` (file này)
- **Nội dung**: Tóm tắt những gì đã làm

## Responsive Design

Tất cả components đều responsive:
- **Summary Cards**: 1 col (mobile) → 3 cols (tablet) → 6 cols (desktop)
- **Filter Bar**: Tự động wrap
- **Quick Actions**: Flex-wrap
- **Bulk Action Bar**: min-width 600px (desktop), full-width (mobile)
- **Data Table**: Horizontal scroll trên mobile

## Icons sử dụng

Tất cả icons từ `lucide-react`:
- Building2, CircleCheck, Clock, CirclePause, CircleX
- AlertTriangle, TriangleAlert
- Eye, SquarePen, Trash2
- UserCog, CirclePlay
- FileText, History
- Plus, Upload, Download, ClipboardList
- EllipsisVertical
- Search

## Trạng thái & Hành động

### Status-based Actions
Hệ thống tự động quyết định actions dựa trên trạng thái:
- **pending**: edit, delete
- **active**: assignRisk, viewDocs, viewHistory, pause, edit
- **underInspection**: viewHistory only
- **suspended**: resume, close
- **closed**: viewHistory only

## Có thể mở rộng cho các module khác

Framework này dễ dàng áp dụng cho:
1. **Nguồn tin / Risk** - Quản lý nguồn tin báo rủi ro
2. **Kế hoạch tác nghiệp** - Quản lý kế hoạch kiểm tra
3. **Biên bản** - Quản lý biên bản kiểm tra
4. **Đội kiểm tra** - Quản lý đội ngũ
5. **Báo cáo** - Quản lý báo cáo định kỳ

Chỉ cần thay đổi:
- Data interface
- Column definitions
- Status types (nếu cần)
- Filter configs
- Actions theo nghiệp vụ

## Kiểm tra hoàn thành

✅ Giữ nguyên bố cục tổng thể  
✅ Không đổi màu, font, grid  
✅ Sử dụng design tokens từ theme.css  
✅ CSS Modules cho tất cả components  
✅ Toàn bộ tiếng Việt  
✅ Hỗ trợ phân quyền  
✅ Summary Cards (6 thẻ)  
✅ Advanced Filter Bar  
✅ Quick Actions  
✅ Bulk Actions  
✅ Action Column với dropdown  
✅ Enhanced Status System  
✅ Audit History trong drawer  
✅ Tài liệu đầy đủ  
✅ Responsive  

## Kết luận

Trang "Cơ sở & Địa bàn" đã được chuẩn hóa và mở rộng thành **Master Framework** hoàn chỉnh với:
- 6 reusable components mới
- 1 enhanced status system
- Tài liệu đầy đủ
- Responsive design
- Permission support
- CSS Modules
- Design token compliance

Framework này sẵn sàng để các module khác trong hệ thống MAPPA sử dụng lại.
