# Hướng dẫn thêm KPI-QLTT vào Menu Navigation

Module KPI-QLTT đã được tích hợp vào routing. Để thêm vào menu điều hướng, làm theo hướng dẫn sau:

## 📋 Module Metadata

Các thông tin từ `module.json`:
- **Module ID:** `kpi-qltt`
- **Module Name:** KPI & Thống kê QLTT
- **Version:** 0.2.1
- **Base Path:** `/kpi`
- **Route Export:** `kpiQlttRoute`
- **Menu Label:** KPI QLTT
- **Menu Path:** `/kpi`
- **Permissions:** `reports:read`

## 📍 Thêm vào Horizontal Navigation Bar

### File: `/src/layouts/HorizontalNavBar.tsx`

Tìm section menu items (thường là một array định nghĩa các menu items) và thêm:

```tsx
{
  label: 'KPI QLTT',
  path: '/kpi',
  icon: <BarChart3 size={18} />, // Hoặc icon phù hợp từ lucide-react
  children: [
    {
      label: 'Dashboard',
      path: '/kpi',
    },
    {
      label: 'Danh sách báo cáo',
      path: '/kpi/list',
    },
    {
      label: 'Tạo báo cáo mới',
      path: '/kpi/builder',
    }
  ]
}
```

### Import icon (nếu chưa có):

```tsx
import { BarChart3 } from 'lucide-react';
// hoặc
import { FileText } from 'lucide-react';
// hoặc
import { TrendingUp } from 'lucide-react';
```

## 📍 Thêm vào Vertical Sidebar (nếu có)

Tương tự, tìm file sidebar component và thêm menu item theo cấu trúc tương ứng.

## 🎨 Icon suggestions

Các icon phù hợp từ lucide-react:
- `BarChart3` - Biểu tượng biểu đồ
- `FileText` - Biểu tượng báo cáo
- `TrendingUp` - Xu hướng tăng
- `PieChart` - Biểu đồ tròn
- `Activity` - Hoạt động

## 🔧 Active State

Đảm bảo menu item được highlight khi đang ở route `/kpi/*`:

```tsx
const isActive = location.pathname.startsWith('/kpi');
```

## ✅ Verification

Sau khi thêm, kiểm tra:
- [ ] Menu item hiển thị đúng
- [ ] Icon hiển thị
- [ ] Click vào navigate đúng route
- [ ] Active state hoạt động
- [ ] Submenu (nếu có) hoạt động

## 📝 Notes

- Module đã sẵn sàng và routes đã được đăng ký
- Chỉ cần thêm UI navigation link
- Không cần thêm dependency hay config gì khác
