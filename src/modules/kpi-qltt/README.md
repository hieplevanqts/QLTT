# Module KPI & Thống kê QLTT

## 🎯 Mục đích

Module quản lý KPI và thống kê cho hệ thống Quản lý Thị trường (QLTT), cung cấp dashboard tổng quan, quản lý báo cáo và xuất dữ liệu.

## 📦 Cấu trúc

```
kpi-qltt/
├── module.json                 # Metadata
├── index.ts                    # Entry point
├── routes.tsx                  # Route definitions
├── INTEGRATION.md              # Tài liệu tích hợp đầy đủ
├── README.md                   # File này
├── components/                 # UI Components
│   ├── KpiLayout.tsx
│   ├── KpiCards.tsx
│   ├── MiniTrend.tsx
│   ├── FilterBar.tsx
│   ├── DataTable.tsx
│   └── ExportCsvButton.tsx
├── pages/                      # Trang chính
│   ├── DashboardPage.tsx
│   ├── ReportsListPage.tsx
│   ├── ReportBuilderPage.tsx
│   └── ReportDetailPage.tsx
├── services/
│   └── reportService.ts        # Business logic
└── data/
    └── mock.ts                 # Mock data & types
```

## 🚀 Routes

- `/kpi` - Dashboard KPI
- `/kpi/list` - Danh sách báo cáo
- `/kpi/builder` - Tạo báo cáo mới
- `/kpi/:id` - Chi tiết báo cáo

## 🔧 Tech Stack

- React 18 + TypeScript
- React Router v6
- CSS Modules
- LocalStorage
- SVG Charts (native, no libraries)

## 📊 Features

### Dashboard
- 4 KPI cards với mini charts
- Bộ chọn thời gian (7/30/90 ngày)
- Xu hướng và khuyến nghị

### Quản lý báo cáo
- Filters đa tiêu chí
- Pagination
- Search
- Export CSV
- CRUD operations

### Tạo báo cáo
- Chọn từ 4 templates
- Form validation
- Preview
- Lưu vào localStorage

## 🎨 Design System

Module tuân thủ 100% design system MAPPA:
- CSS Variables từ `theme.css`
- Inter font
- MAPPA Blue (#005cb6)
- Consistent spacing & radius
- Responsive design

## 📖 Xem thêm

Chi tiết đầy đủ trong [INTEGRATION.md](./INTEGRATION.md)
