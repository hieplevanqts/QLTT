# MAPPA Portal

**Hệ thống quản lý thị trường thông minh - Vietnamese Government Information Management System**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Tính năng](#tính-năng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Sử dụng](#sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Scripts](#scripts)
- [Tài liệu](#tài-liệu)
- [Đóng góp](#đóng-góp)
- [License](#license)

## 🎯 Giới thiệu

MAPPA Portal là hệ thống quản lý thông tin thị trường toàn diện được phát triển cho các cơ quan quản lý nhà nước tại Việt Nam. Hệ thống cung cấp các công cụ quản lý, giám sát và báo cáo cho nhiều lĩnh vực khác nhau, từ quản lý cơ sở kinh doanh đến theo dõi chứng cứ và báo cáo KPI.

### Các module chính

- **Tổng quan** (`/overview`) - Dashboard tổng hợp với các chỉ số KPI
- **Bản đồ điều hành** (`/map`) - Bản đồ tương tác với dữ liệu địa lý
- **Cơ sở & Địa bàn** (`/stores`) - Quản lý danh sách cơ sở kinh doanh
- **Nguồn tin / Risk** (`/leads`) - Quản lý nguồn tin và đánh giá rủi ro
- **Kế hoạch tác nghiệp** (`/plans`) - Lập và quản lý kế hoạch kiểm tra
- **Nhiệm vụ hiện trường** (`/tasks`) - Theo dõi và quản lý nhiệm vụ
- **Kho chứng cứ** (`/evidence`) - Quản lý chứng cứ và tài liệu
- **Báo cáo & KPI** (`/reports`) - Báo cáo và phân tích dữ liệu
- **Quản trị** (`/admin`) - Quản lý người dùng, phân quyền và cấu hình hệ thống

## ✨ Tính năng

### 🔐 Xác thực & Phân quyền

- Đăng nhập bằng số điện thoại/email
- Xác thực OTP 6 số
- Quản lý phân quyền theo vai trò (RBAC)
- Chọn đơn vị/jurisdiction
- Quản lý session và timeout

### 🗺️ Bản đồ & Địa lý

- Bản đồ tương tác với Leaflet
- Hiển thị marker và cluster
- Lọc theo địa bàn, loại hình
- Thống kê theo khu vực
- Tích hợp Google Maps API

### 📊 Quản lý Dữ liệu

- CRUD đầy đủ cho các module
- Import/Export dữ liệu (Excel, CSV)
- Tìm kiếm và lọc nâng cao
- Phân trang và sắp xếp
- Validation và error handling

### 📈 Báo cáo & Thống kê

- Dashboard với biểu đồ và chỉ số
- Xuất báo cáo đa định dạng
- Phân tích xu hướng
- KPI tracking
- Custom reports

### 🎨 Giao diện

- Responsive design (Mobile, Tablet, Desktop)
- Dark/Light theme
- Layout ngang/dọc linh hoạt
- UI Kit đầy đủ với CSS Modules
- Accessibility support

## 🛠️ Công nghệ sử dụng

### Core Framework

- **React** 18.3.1 - UI Library
- **TypeScript** - Type safety
- **Vite** 6.3.5 - Build tool & Dev server
- **React Router** 7.11.0 - Routing

### Styling

- **Tailwind CSS** 4.1.12 - Utility-first CSS
- **CSS Modules** - Scoped styling
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library

### State Management & Data

- **React Hooks** - State management
- **Local Storage** - Client-side persistence
- **Supabase** - Backend & Database (KV Store)
- **React Hook Form** 7.55.0 - Form handling

### Maps & Charts

- **Leaflet** ^1.9.4 - Maps
- **React Leaflet** ^4.2.1 - React wrapper for Leaflet
- **Recharts** 2.15.2 - Chart library
- **@react-google-maps/api** ^2.20.8 - Google Maps integration

### Utilities

- **date-fns** 3.6.0 - Date manipulation
- **xlsx** ^0.18.5 - Excel file handling
- **bcryptjs** ^3.0.3 - Password hashing
- **sonner** 2.0.3 - Toast notifications

## 📦 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn** >= 1.22.x
- **Git** >= 2.x

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd MAPPA-PORTAL-01-COMMAND-MAP
```

### 2. Cài đặt dependencies

```bash
npm install
```

hoặc

```bash
yarn install
```

### 3. Cấu hình biến môi trường

Tạo file `.env` trong thư mục root (xem [Cấu hình](#cấu-hình) bên dưới)

### 4. Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## ⚙️ Cấu hình

### Biến môi trường

Tạo file `.env` trong thư mục root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Cấu hình Supabase

1. Tạo project trên [Supabase](https://supabase.com)
2. Lấy URL và Anon Key từ project settings
3. Cấu hình KV Store (xem `docs/kv-store-structure.md`)
4. Thiết lập authentication providers

## 💻 Sử dụng

### Development

```bash
# Chạy development server
npm run dev

# Build cho production
npm run build

# Preview production build
npm run preview
```

### Cấu trúc routing

- `/auth/login` - Trang đăng nhập
- `/overview` - Dashboard tổng quan
- `/map` - Bản đồ điều hành
- `/stores` - Quản lý cơ sở
- `/leads` - Quản lý nguồn tin
- `/plans` - Kế hoạch tác nghiệp
- `/tasks` - Nhiệm vụ hiện trường
- `/evidence` - Kho chứng cứ
- `/reports` - Báo cáo & KPI
- `/admin` - Quản trị hệ thống

## 📁 Cấu trúc dự án

```
MAPPA-PORTAL-01-COMMAND-MAP/
├── public/                 # Static assets
├── src/
│   ├── app/               # Core application
│   │   ├── components/    # Shared components
│   │   ├── pages/         # Page components (auth, evidence)
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic & APIs
│   │   └── types/         # TypeScript types
│   ├── assets/            # Images, icons
│   ├── components/        # Reusable components
│   ├── contexts/          # React contexts
│   ├── data/              # Mock data & generators
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── patterns/          # Reusable patterns
│   ├── routes/            # Route configurations
│   ├── styles/            # Global styles & themes
│   ├── ui-kit/            # Design system components
│   ├── utils/             # Utility functions
│   └── main.tsx           # Application entry point
├── docs/                  # Documentation
├── documentation/         # Additional documentation
├── supabase/              # Supabase functions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Thư mục quan trọng

- `src/app/` - Core application logic
- `src/pages/` - Page-level components
- `src/ui-kit/` - Design system components
- `src/layouts/` - Layout wrappers
- `src/styles/` - Global styles và design tokens
- `docs/` - Technical documentation

## 📜 Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build ứng dụng cho production |
| `npm run preview` | Preview production build |

## 📚 Tài liệu

### Tài liệu chính

- [Database Documentation](docs/README.md) - Cấu trúc database và KV Store
- [Migration Guide](docs/MIGRATION-GUIDE.md) - Hướng dẫn migration từ mock data
- [TypeScript Interfaces](docs/typescript-interfaces.md) - Định nghĩa types
- [Framework Documentation](src/patterns/FRAMEWORK_README.md) - Hướng dẫn sử dụng framework

### Tài liệu bổ sung

Xem thư mục `documentation/` để biết thêm chi tiết về:
- Cấu hình API
- Troubleshooting
- Security best practices
- Performance optimization

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Quy tắc code

- Tuân thủ TypeScript strict mode
- Sử dụng CSS Modules cho styling
- Viết comments cho code phức tạp
- Follow React best practices
- Maintain type safety

## 📝 License

This project is proprietary and confidential.

## 👥 Liên hệ

Để biết thêm thông tin, vui lòng liên hệ team phát triển.

---

**Made with ❤️ for Vietnamese Government**
