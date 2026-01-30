# KPI-QLTT Module - Integration Guide

## 📋 Tổng quan

Module **KPI & Thống kê QLTT** đã được tích hợp thành công vào MAPPA Portal. Module cung cấp dashboard KPI, quản lý báo cáo, tạo báo cáo mới và xuất dữ liệu ra CSV.

## 🗂️ Cấu trúc Module

```
src/modules/kpi-qltt/
├── module.json                     # Metadata của module
├── index.ts                        # Entry point
├── routes.tsx                      # Định nghĩa routes
├── INTEGRATION.md                  # Tài liệu này
├── data/
│   └── mock.ts                     # Mock data và types
├── services/
│   └── reportService.ts            # Service quản lý báo cáo
├── components/
│   ├── KpiLayout.tsx              # Layout wrapper
│   ├── KpiCards.tsx               # Thẻ KPI
│   ├── KpiCards.module.css
│   ├── MiniTrend.tsx              # Mini chart xu hướng
│   ├── MiniTrend.module.css
│   ├── FilterBar.tsx              # Bộ lọc
│   ├── FilterBar.module.css
│   ├── DataTable.tsx              # Bảng dữ liệu với pagination
│   ├── DataTable.module.css
│   ├── ExportCsvButton.tsx        # Nút xuất CSV
│   └── ExportCsvButton.module.css
└── pages/
    ├── DashboardPage.tsx          # Dashboard KPI
    ├── DashboardPage.module.css
    ├── ReportsListPage.tsx        # Danh sách báo cáo
    ├── ReportsListPage.module.css
    ├── ReportBuilderPage.tsx      # Tạo báo cáo mới
    ├── ReportBuilderPage.module.css
    ├── ReportDetailPage.tsx       # Chi tiết báo cáo
    └── ReportDetailPage.module.css
```

## 🔗 Routes

Module đã được tích hợp vào `src/routes/routes.tsx` với các routes sau:

| Path | Component | Mô tả |
|------|-----------|-------|
| `/kpi` | DashboardPage | Dashboard KPI (trang chủ) |
| `/kpi/list` | ReportsListPage | Danh sách báo cáo |
| `/kpi/builder` | ReportBuilderPage | Tạo báo cáo mới |
| `/kpi/compare` | CompareKpiPage | So sánh KPI (mới v0.2.0) |
| `/kpi/:id` | ReportDetailPage | Chi tiết báo cáo |

## 🎯 Tính năng chính

### 1. Dashboard KPI (`/kpi`)
- Hiển thị 4 KPI cards chính:
  - Tổng số cơ sở
  - Cuộc thanh tra
  - Vi phạm phát hiện
  - Tổng tiền phạt
- Mỗi card có:
  - Giá trị hiện tại
  - Xu hướng % thay đổi
  - Mini chart 7 ngày (SVG)
- Bộ chọn thời gian: 7/30/90 ngày
- Phần thông tin xu hướng và khuyến nghị

### 2. Danh sách báo cáo (`/kpi/list`)
- Bộ lọc đa tiêu chí:
  - Tìm kiếm theo tiêu đề
  - Lọc theo địa bàn (tỉnh/TP)
  - Lọc theo chuyên đề
  - Lọc theo trạng thái (Nháp/Hoàn thành/Lưu trữ)
  - Lọc theo khoảng thời gian
- Bảng dữ liệu với:
  - Hiển thị đầy đủ thông tin báo cáo
  - Pagination (10 items/page)
  - Các thao tác: Xem chi tiết, Xuất CSV
- Nút "Tạo báo cáo mới"

### 3. Tạo báo cáo (`/kpi/builder`)
- Chọn mẫu báo cáo từ 4 templates:
  - Báo cáo tổng hợp tuần
  - Báo cáo tháng
  - Báo cáo chuyên đề
  - Báo cáo đột xuất
- Form nhập thông tin:
  - Tiêu đề báo cáo (bắt buộc)
  - Tỉnh/Thành phố (bắt buộc)
  - Địa bàn cụ thể
  - Chuyên đề (bắt buộc)
- Chức năng xem trước
- Lưu nháp vào localStorage

### 4. Chi tiết báo cáo (`/kpi/:id`)
- Hiển thị đầy đủ thông tin báo cáo
- Các thông tin bao gồm:
  - Tiêu đề, trạng thái, ID
  - Mẫu báo cáo, địa bàn, người tạo, thời gian
  - Dữ liệu báo cáo (nếu có)
- Nút xuất CSV
- Nút quay lại danh sách

### 5. So sánh KPI (`/kpi/compare`) - **MỚI v0.2.0**
- **Bộ lọc so sánh:**
  - Khoảng thời gian: 7/30/90 ngày (tabs)
  - Chế độ so sánh: Theo đơn vị / Theo nhóm ngành hàng (radio)
  - Địa bàn: Dropdown chọn tỉnh/TP
  - Chuyên đề: Dropdown chọn chuyên đề
  - KPI Metric: Nguồn tin / Nhiệm vụ / Quá hạn / Vi phạm / Điểm nóng
  - Nút "Áp dụng" để recompute
- **Bảng so sánh:**
  - Tìm kiếm trong bảng (client-side)
  - Sorting theo tất cả các cột
  - Hiển thị số liệu: Nguồn tin, Nhiệm vụ, Quá hạn, Vi phạm, Điểm nóng, Tổng
  - Cột "Xu hướng": Mini-bar chart + % thay đổi
  - Cột "Chênh lệch": % so với trung bình (màu xanh/đỏ)
  - Empty state khi không có dữ liệu
- **Export:**
  - Nút "Tải CSV" xuất bảng so sánh hiện tại
  - File CSV bao gồm metadata (thời gian, chế độ, địa bàn)

## 💾 Data Management

### Mock Data
Module sử dụng mock data trong `data/mock.ts`:
- `mockKpiMetrics`: 4 KPI metrics với dữ liệu xu hướng
- `mockReportTemplates`: 4 mẫu báo cáo
- `mockReports`: 6 báo cáo mẫu
- `provinces`: 10 tỉnh/TP
- `topics`: 6 chuyên đề

### LocalStorage
Báo cáo được lưu trong localStorage với key: `mappa_kpi_reports`

Service `reportService` cung cấp các methods:
- `getReports(filters, pagination)`: Lấy danh sách với filter & pagination
- `getReportById(id)`: Lấy báo cáo theo ID
- `createReport(data)`: Tạo báo cáo mới
- `updateReport(id, data)`: Cập nhật báo cáo
- `deleteReport(id)`: Xóa báo cáo
- `exportReportToCSV(report)`: Xuất CSV
- `getTemplates()`: Lấy danh sách templates
- `getKpiMetrics(period)`: Lấy KPI metrics theo thời gian

## 🎨 Styling

Module tuân thủ design system của MAPPA:
- Sử dụng **CSS Modules** cho tất cả components
- Sử dụng **CSS variables** từ `/src/styles/theme.css`:
  - Colors: `--primary`, `--card`, `--border`, `--muted`, etc.
  - Typography: `--text-*`, `--font-weight-*`
  - Spacing & Radius: `--radius`, `--radius-card`
  - Shadows: `--elevation-sm`
- Font: **Inter** (từ design system)
- Màu chính: MAPPA Blue `#005cb6` (`var(--primary)`)

## 🔧 Không cần dependencies mới

Module không thêm dependency nào, chỉ sử dụng:
- React & React Router (đã có sẵn)
- lucide-react icons (đã có sẵn)
- CSS Modules (built-in Vite)
- SVG cho charts (native)

## 🚀 Cách sử dụng

### Truy cập module
1. Đăng nhập vào MAPPA Portal
2. Truy cập `/kpi` để vào Dashboard
3. Hoặc click vào menu "KPI QLTT" (cần thêm vào navigation)

### Tạo báo cáo mới
1. Vào `/kpi/list`
2. Click "Tạo báo cáo mới"
3. Chọn mẫu báo cáo
4. Điền thông tin
5. Xem trước (optional)
6. Lưu nháp

### Xem và xuất báo cáo
1. Vào `/kpi/list`
2. Sử dụng bộ lọc nếu cần
3. Click icon "Xem" để xem chi tiết
4. Click icon "Download" hoặc nút "Xuất CSV" để export

### Lọc báo cáo
1. Nhập từ khóa tìm kiếm
2. Chọn địa bàn, chuyên đề, trạng thái
3. Chọn khoảng thời gian
4. Click "Xóa bộ lọc" để reset

## 🔐 Permissions

Module khai báo permission: `reports:read` trong `module.json`

Hiện tại chưa implement logic kiểm tra permission (có thể thêm PermissionProtectedRoute wrapper sau).

## 📝 Files đã thay đổi

### File duy nhất được sửa (ngoài module):
- `/src/routes/routes.tsx`: Thêm import và route `kpiQlttRoute`

### Không thay đổi:
- ❌ App.tsx
- ❌ main.tsx
- ❌ config files
- ❌ styles lõi
- ❌ route `reports` hiện có (giữ nguyên)

## 🧪 Testing

Để test module:
1. Chạy dev server: `npm run dev`
2. Đăng nhập vào hệ thống
3. Truy cập `/kpi`
4. Test các tính năng:
   - ✅ Dashboard hiển thị KPI
   - ✅ Chuyển đổi thời gian (7/30/90 ngày)
   - ✅ Danh sách báo cáo với pagination
   - ✅ Bộ lọc hoạt động
   -  Tạo báo cáo mới
   - ✅ Xem chi tiết báo cáo
   - ✅ Xuất CSV

## 🔮 Mở rộng trong tương lai

1. **Backend Integration**
   - Thay mock data bằng API calls
   - Sử dụng React Query/SWR cho data fetching
   - Xác thực permission từ backend

2. **Advanced Features**
   - Charts phức tạp hơn (có thể dùng recharts)
   - Export PDF
   - Báo cáo theo template động
   - Workflow approval cho báo cáo
   - Real-time collaboration

3. **UI Enhancements**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Confirmation dialogs

4. **Navigation**
   - Thêm link vào HorizontalNavBar
   - Thêm vào menu chính
   - Breadcrumbs

## ✅ Checklist Integration

- ✅ Module structure tạo trong `/src/modules/kpi-qltt/`
- ✅ Tất cả files sử dụng CSS Modules
- ✅ Sử dụng design tokens từ theme.css
- ✅ Font Inter từ design system
- ✅ Không thêm dependencies mới
- ✅ Chỉ sửa 1 file: `routes.tsx`
- ✅ Không đụng vào route `reports` hiện có
- ✅ UI hoàn toàn tiếng Việt
- ✅ Mock data + localStorage
- ✅ 4 pages đầy đủ chức năng
- ✅ Components tái sử dụng
- ✅ Export CSV hoạt động
- ✅ Pagination hoạt động
- ✅ Filters hoạt động
- ✅ Mini charts với SVG

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console browser
2. Xác nhận đã đăng nhập
3. Kiểm tra routes trong React Router DevTools
4. Xóa localStorage nếu cần: `localStorage.removeItem('mappa_kpi_reports')`

---

**Module version:** 0.2.1  
**Ngày tích hợp:** 2026-01-19  
**Status:** ✅ Ready for use

---

## 📦 Release & Compatibility Information

### Current Release
- **Version:** 0.2.1
- **Release Type:** PATCH
- **Release Notes:** Chuẩn hóa metadata module.json theo yêu cầu importer (release/compat); đồng bộ tài liệu tích hợp.
- **Breaking Changes:** Không có

### Compatibility
- **Minimum App Version:** 0.1.0
- **Maximum App Version:** 0.9.0
- **Compatible với:** MAPPA Portal v0.1.x - v0.9.x

### Export Information
- **Route Export Name:** `kpiQlttRoute`
- **Base Path:** `/kpi`
- **Menu Label:** KPI QLTT
- **Menu Path:** `/kpi`

---

## 📦 Version History & Upgrade Notes

### v0.2.1 (2026-01-21) - PATCH UPDATE

**🔧 Cập nhật metadata:**
- ✅ Chuẩn hóa `module.json` theo schema mới của BE importer
- ✅ Bổ sung field `release` với type: "patch"
- ✅ Bổ sung field `compat` với minAppVersion/maxAppVersion
- ✅ Bổ sung field `routeExport` = "kpiQlttRoute"
- ✅ Đồng bộ tài liệu INTEGRATION.md và NAVIGATION_SETUP.md

**📝 Files cập nhật:**
- `module.json`: Thêm release/compat metadata
- `INTEGRATION.md`: Thêm section Release & Compatibility
- `NAVIGATION_SETUP.md`: Đồng bộ menuLabel/menuPath

**🔄 Backward Compatibility:**
- ✅ **YES** - Hoàn toàn tương thích ngược
- Không thay đổi UI/routes/logic
- Chỉ cập nhật metadata để hỗ trợ module import/export
- Không ảnh hưởng đến dữ liệu hiện có

**🚀 Migration:**
- **KHÔNG CẦN** migration
- Module tự động hoạt động sau khi cập nhật
- Không yêu cầu thay đổi code integration

---

### v0.2.0 (2026-01-21) - MINOR UPDATE

**✨ Tính năng mới:**
- ➕ **So sánh KPI** (`/kpi/compare`)
  - So sánh KPI theo đơn vị QLTT (Cục/Chi cục/Đội)
  - So sánh KPI theo nhóm ngành hàng (Ăn uống, Dịch vụ, Bán lẻ, Sản xuất, Vận tải, Khác)
  - Bộ lọc đa tiêu chí: thời gian (7/30/90 ngày), địa bàn, chuyên đề, KPI metric
  - Bảng so sánh với sorting, search, mini-bars xu hướng
  - Tính toán chênh lệch so với trung bình
  - Export CSV

**📂 Files mới:**
- `pages/CompareKpiPage.tsx` + CSS module
- `components/CompareKpiFilterBar.tsx` + CSS module
- `components/CompareKpiTable.tsx` + CSS module
- `components/CompareMiniBars.tsx` + CSS module
- `types.ts` (type definitions)

**📝 Files cập nhật:**
- `module.json`: version 0.1.0 → 0.2.0
- `routes.tsx`: Thêm route `/kpi/compare`
- `data/mock.ts`: Bổ sung ~200 records mock data cho compare
- `services/reportService.ts`: Thêm methods `getCompareByUnit()`, `getCompareByCategory()`, `exportCompareToCSV()`
- `INTEGRATION.md`: Cập nhật documentation

**🔄 Backward Compatibility:**
- ✅ **YES** - Hoàn toàn tương thích ngược
- Không thay đổi routes hiện có
- Không thay đổi localStorage keys
- Không thay đổi API contracts hiện có

**🚀 Migration:**
- **KHÔNG CẦN** migration
- Module tự động generate mock data khi khởi động
- Không ảnh hưởng đến dữ liệu báo cáo hiện có

**📌 Menu Integration:**
Nếu backend/frontend có menu export, thêm item:
```json
{
  "label": "So sánh KPI",
  "path": "/kpi/compare",
  "permissions": ["reports:read"]
}
```

---

### v0.1.0 (2026-01-19) - INITIAL RELEASE
- Dashboard KPI
- Quản lý báo cáo
- Tạo báo cáo mới
- Xuất CSV
