# Module Báo cáo động (Dynamic Reports)

Module Report Builder cho phép người dùng tự tạo báo cáo bằng cách chọn dataset, cột, lọc, nhóm và tổng hợp dữ liệu. Hỗ trợ lưu mẫu, chia sẻ và xuất báo cáo.

## 🎯 Tính năng chính

### 1. **Landing Page (Báo cáo động)**
- **4 Tabs:**
  - Báo cáo hệ thống: 10 mẫu báo cáo chuẩn theo nhóm dataset
  - Báo cáo của tôi: Mẫu báo cáo cá nhân
  - Báo cáo đơn vị: Mẫu chia sẻ trong đơn vị
  - Đã xuất: Lịch sử export
- **Template Cards:** Hiển thị thông tin dataset, mô tả, số lần chạy
- **Quick Actions:** Chạy, Chỉnh sửa, Sao chép, Chia sẻ, Xóa

### 2. **Report Builder (Tạo báo cáo mới)**
- **Layout 3 phần:**
  - **Left Sidebar:** Cấu hình báo cáo (accordion panels)
  - **Center:** Bảng kết quả với summary bar
  - **Top Bar:** Save, Export, Run buttons
  
- **Chọn nguồn dữ liệu (Dataset):**
  - Dropdown có nhóm: Cơ sở quản lý, Nguồn tin, Kế hoạch, Đợt kiểm tra, Phiên làm việc
  - Khi đổi dataset: tự động reset cột/lọc
  
- **Chọn cột hiển thị:**
  - Checklist với search field
  - Nhóm theo category (Thông tin chung, Địa bàn, Thời gian, Trạng thái...)
  - Quick actions: Chọn tất cả / Bỏ chọn tất cả
  - Hiển thị dạng chips trên đầu bảng
  
- **Bộ lọc (Filters):**
  - Filter builder: [Field] [Operator] [Value]
  - Operators theo type (text/number/date/enum/boolean)
  - Time presets: Hôm nay / 7 ngày / 30 ngày / Tháng này / Quý này
  - Thêm/Xóa điều kiện động
  
- **Nhóm & Tổng hợp:**
  - Group by: chọn 1-2 trường
  - Aggregations: Count / Sum / Avg
  
- **Kết quả:**
  - Sticky header table
  - Pagination (20/50/100)
  - Summary bar: Dataset, Số bản ghi, Bộ lọc, Cập nhật
  - Loading/Empty/Error states

### 3. **Report Result (Xem kết quả)**
- Hiển thị kết quả báo cáo đã lưu
- Breadcrumbs navigation
- Actions: Làm mới, Sao chép, Chỉnh sửa, Xuất
- Summary bar với thông tin chi tiết
- Phân trang kết quả

### 4. **Modals**
- **Save Template Modal:**
  - Tên báo cáo
  - Mô tả
  - Phạm vi: Cá nhân / Đơn vị
  
- **Export Report Modal:**
  - Định dạng: Excel (.xlsx) / PDF (.pdf)
  - Tên file tùy chỉnh
  - Hiển thị phạm vi dữ liệu

## 📂 Cấu trúc thư mục

```
/src/modules/dynamic-reports/
├── pages/
│   ├── DynamicReportsLanding.tsx  # Landing page với tabs
│   ├── ReportBuilder.tsx          # Màn hình tạo/sửa báo cáo
│   └── ReportResult.tsx           # Xem kết quả báo cáo
├── components/
│   ├── SaveTemplateModal.tsx      # Modal lưu mẫu
│   └── ExportReportModal.tsx      # Modal xuất báo cáo
├── DynamicReports.module.css      # CSS Module
├── routes.tsx                     # Route definitions
└── README.md                      # Tài liệu này
```

## 🗄️ Datasets hỗ trợ

1. **Cơ sở quản lý (facility)**
   - 15 cột: Tên, Địa chỉ, Loại hình, Ngành hàng, Trạng thái, Diện tích, Doanh thu, Địa bàn, Thời gian...

2. **Nguồn tin phản ánh (leads)**
   - 14 cột: Tiêu đề, Nội dung, Nguồn, Danh mục, Ưu tiên, Trạng thái, Cơ sở, Người phản ánh...

3. **Kế hoạch kiểm tra (plans)**
   - 11 cột: Tên, Loại, Ưu tiên, Trạng thái, Phê duyệt, Người chủ trì, Đội, Số cơ sở...

4. **Đợt kiểm tra (campaigns)**
   - 10 cột: Tên đợt, Kế hoạch, Trạng thái, Người chủ trì, Số cơ sở, Hoàn thành, Vi phạm...

5. **Phiên làm việc (sessions)**
   - 12 cột: Mã phiên, Đợt kiểm tra, Cơ sở, Trạng thái, Thanh tra viên, Vi phạm, Tiền phạt...

## 🎨 Design System

Module sử dụng CSS Variables từ design system:
- Colors: `--primary`, `--foreground`, `--background`, `--card`, `--border`...
- Spacing: `--spacing-*` (1-12)
- Typography: `--font-size-*`, `--font-weight-*`
- Radius: `--radius`, `--radius-sm`, `--radius-lg`, `--radius-full`

## 🚀 Routes

```
/bao-cao-dong                      → Landing page
/bao-cao-dong/tao-moi              → Tạo báo cáo mới
/bao-cao-dong/chinh-sua/:templateId → Chỉnh sửa mẫu
/bao-cao-dong/ket-qua/:reportId    → Xem kết quả
```

## 📊 Mẫu báo cáo hệ thống (10 templates)

**Cơ sở quản lý:**
1. Cơ sở chờ duyệt
2. Cơ sở chưa đồng bộ thuế

**Nguồn tin:**
3. Nguồn tin mới 30 ngày
4. Top cửa hàng bị phản ánh

**Kế hoạch:**
5. Kế hoạch nháp/chờ duyệt
6. Kế hoạch ưu tiên cao/khẩn cấp

**Đợt kiểm tra:**
7. Đợt đang kiểm tra
8. Tiến độ theo người chủ trì

**Phiên làm việc:**
9. Phiên trễ hạn
10. SLA đúng hạn theo cán bộ

## 🔐 Phân quyền

- **Role-based permissions:** Dữ liệu tự động scope theo địa bàn/đơn vị
- **Template sharing:**
  - Cá nhân: Chỉ người tạo xem được
  - Đơn vị: Tất cả thành viên đơn vị xem được
  - Hệ thống: Chỉ xem, có thể sao chép

## 💡 Tính năng nổi bật

✅ Enterprise UI: Rõ ràng, dễ dùng, nhiều whitespace  
✅ Responsive: Desktop first (1440px → 1280px)  
✅ Accordion sidebar: Tiết kiệm không gian  
✅ Dynamic filtering: Thêm/xóa điều kiện tự do  
✅ Column management: Search, group, quick select  
✅ Export: Excel & PDF với preview  
✅ Template system: Save, share, reuse  
✅ State management: Loading, empty, error  
✅ Mock data: Realistic Vietnamese data  
✅ CSS Modules: Tránh xung đột styles

## 🎯 User Flow

1. **Tạo báo cáo:**
   Landing → Tạo mới → Chọn dataset → Chọn cột → Lọc → Chạy → Lưu mẫu → Xuất

2. **Sử dụng mẫu có sẵn:**
   Landing → Tab "Báo cáo hệ thống" → Click card → Xem kết quả → Xuất

3. **Chỉnh sửa mẫu:**
   Landing → Tab "Báo cáo của tôi" → Edit → Thay đổi cấu hình → Lưu

## 🔮 Future Enhancements

- [ ] Advanced filters: AND/OR grouping
- [ ] Chart visualization
- [ ] Schedule reports (auto-run)
- [ ] Email export
- [ ] Custom SQL query builder
- [ ] Report versioning
- [ ] Collaboration (comments)
- [ ] API integration for real data
