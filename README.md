# MAPPA Portal

> Hệ thống quản lý thị trường thông minh - Vietnamese Government Information Management System

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-2.90.1-green.svg)](https://supabase.com/)

MAPPA Portal là hệ thống quản lý thông tin thị trường toàn diện được phát triển cho các cơ quan quản lý nhà nước Việt Nam. Hệ thống cung cấp các công cụ quản lý cơ sở, giám sát rủi ro, xử lý nguồn tin, quản lý kế hoạch tác nghiệp và kho chứng cứ.

## ✨ Tính năng chính

### 🎯 Các module chính

- **📊 Tổng quan** - Dashboard với thống kê và KPI
- **🗺️ Bản đồ điều hành** - Bản đồ tương tác với Leaflet, hiển thị cơ sở và điểm nóng
- **🏢 Cơ sở & Địa bàn** - Quản lý CRUD đầy đủ cho cơ sở, quận/huyện, phường/xã
- **⚠️ Nguồn tin / Risk** - Hệ thống quản lý nguồn tin và đánh giá rủi ro với 25+ trang chức năng
  - Xử lý nguồn tin hằng ngày
  - Tổng quan rủi ro
  - Phân tích điểm nóng
  - Quản lý công việc & SLA
- **📋 Kế hoạch tác nghiệp** - Lập và quản lý kế hoạch kiểm tra
- **📍 Nhiệm vụ hiện trường** - Quản lý nhiệm vụ và phiên kiểm tra
- **📦 Kho chứng cứ** - Quản lý, xem xét và xuất chứng cứ
- **📈 Báo cáo & KPI** - Báo cáo thống kê và chỉ số hiệu suất
- **⚙️ Quản trị** - Quản lý người dùng, phân quyền, cấu hình hệ thống

### 🎨 Design System & UI

- **CSS Modules** - Styling modular, tránh xung đột
- **Design Tokens** - Hệ thống biến CSS thống nhất
- **Responsive Design** - Tối ưu cho desktop, tablet và mobile
- **Dark/Light Mode** - Hỗ trợ chế độ sáng/tối
- **Vietnamese-First** - Giao diện tiếng Việt, hỗ trợ đa ngôn ngữ

### 🔐 Bảo mật & Xác thực

- Xác thực đa yếu tố (MFA) với OTP
- Phân quyền dựa trên vai trò (RBAC)
- Bảo vệ route với ProtectedRoute
- Quản lý session và timeout

## 🚀 Bắt đầu

### Yêu cầu hệ thống

**Cách 1: Chạy trực tiếp (Development)**
- Node.js >= 20.x
- npm, yarn hoặc pnpm
- Git

**Cách 2: Chạy với Docker (Recommended)**
- Docker >= 20.x
- Docker Compose >= 2.x

### Cài đặt

```bash
# Clone repository
git clone <repository-url>
cd MAPPA-PORTAL-01-COMMAND-MAP

# Cài đặt dependencies
npm install
# hoặc
yarn install
# hoặc
pnpm install

# Khởi chạy development server
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

Files build sẽ được tạo trong thư mục `dist/`

### Chạy với Docker

**⚠️ Lưu ý quan trọng:** 
- Tất cả services trong `docker-compose.yml` đều sử dụng **profiles** (`dev` hoặc `prod`)
- **Bắt buộc** phải chỉ định profile khi chạy, nếu không sẽ gặp lỗi "no service selected"
- Docker Compose v2 không cần dòng `version` trong file `docker-compose.yml`

#### Development mode

```bash
# Chạy development server trong Docker
docker-compose --profile dev up

# Hoặc build và chạy (khuyến nghị cho lần đầu)
docker-compose --profile dev up --build
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

#### Production mode

```bash
# Build và chạy production
docker-compose --profile prod up --build

# Chạy ở background (detached mode)
docker-compose --profile prod up -d
```

Ứng dụng sẽ chạy tại `http://localhost:80`

#### Environment Variables

1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

2. Chỉnh sửa file `.env` và điền thông tin Supabase của bạn:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Lưu ý:** 
- File `.env` đã được ignore trong `.gitignore`, không được commit lên repository
- Lấy thông tin Supabase tại: https://app.supabase.com/project/_/settings/api
- Docker Compose sẽ tự động load các biến môi trường từ file `.env`

#### Docker Commands hữu ích

```bash
# Xem logs (với profile)
docker-compose --profile dev logs -f
docker-compose --profile prod logs -f

# Dừng containers (với profile)
docker-compose --profile dev down
docker-compose --profile prod down

# Dừng và xóa volumes
docker-compose --profile dev down -v
docker-compose --profile prod down -v

# Rebuild images
docker-compose --profile dev build --no-cache
docker-compose --profile prod build --no-cache
```

#### Xử lý lỗi thường gặp

**Lỗi "no service selected":**
- Nguyên nhân: Chạy `docker-compose up` mà không chỉ định profile
- Giải pháp: Luôn sử dụng `--profile dev` hoặc `--profile prod`

**Lỗi Node.js version incompatible:**
- Nguyên nhân: Package `@supabase/supabase-js@2.90.1` yêu cầu Node.js >= 20.0.0
- Giải pháp: Đảm bảo Dockerfile sử dụng `node:20-alpine` (đã được cập nhật)

## 🏗️ Kiến trúc

### Cấu trúc thư mục

```
src/
├── app/                    # Application core
│   ├── components/         # Shared components
│   │   ├── ui/            # UI primitives (Radix UI)
│   │   ├── lead-risk/     # Lead & Risk components
│   │   └── ...
│   ├── pages/             # Page components
│   └── routes/            # Route configurations
│
├── layouts/               # Layout components
│   ├── HorizontalLayout.tsx
│   ├── VerticalSidebar.tsx
│   ├── HorizontalNavBar.tsx
│   └── MainLayout.tsx
│
├── pages/                 # Feature pages
│   ├── overview/          # Dashboard
│   ├── map/               # Map view
│   ├── stores/            # Store management
│   ├── lead-risk/         # Lead & Risk management (25+ pages)
│   ├── plans/             # Operational plans
│   ├── tasks/             # Field tasks
│   ├── evidence/          # Evidence repository
│   ├── reports/           # Reports & KPI
│   ├── admin/             # System administration
│   ├── account/           # User account pages
│   └── auth/              # Authentication pages
│
├── ui-kit/                # Design System
│   ├── foundations/       # Design tokens
│   └── components/        # Reusable UI components
│
├── patterns/              # Reusable patterns
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── utils/                 # Utility functions
├── data/                  # Mock data & types
├── constants/             # Constants
├── types/                 # TypeScript types
└── styles/                # Global styles & theme
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **React Router 7.11.0** - Routing
- **Tailwind CSS 4.1.12** - Utility-first CSS
- **CSS Modules** - Scoped styling

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

### Maps & Visualization
- **Leaflet 1.9.4** - Interactive maps
- **React Leaflet 4.2.1** - React wrapper for Leaflet

### Backend Integration
- **Supabase 2.90.1** - Backend as a Service
- **PostgREST** - REST API for PostgreSQL

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📚 Documentation

Tài liệu chi tiết được lưu trữ trong thư mục [`docs/`](./docs/):

- **[CURRENT_STATUS.md](./docs/CURRENT_STATUS.md)** - Trạng thái hiện tại và cấu hình
- **[PROJECT-README.md](./docs/PROJECT-README.md)** - Tài liệu chi tiết về project
- **[SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Hướng dẫn setup Supabase
- **[API_CONFIGURATION.md](./docs/API_CONFIGURATION.md)** - Cấu hình API
- **[TROUBLESHOOTING_CORS.md](./docs/TROUBLESHOOTING_CORS.md)** - Xử lý lỗi CORS

Xem thêm các file documentation khác trong thư mục `docs/`.

## ⚙️ Cấu hình

### Environment Variables

1. Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
# Trên Windows:
copy .env.example .env
```

2. Chỉnh sửa file `.env` với thông tin Supabase của bạn:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Lấy thông tin Supabase:**
- Truy cập: https://app.supabase.com/project/_/settings/api
- Copy `Project URL` → `VITE_SUPABASE_URL`
- Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`

**Lưu ý:** File `.env` không được commit lên repository (đã được ignore trong `.gitignore`)

### Feature Toggles

Cấu hình features trong `src/config/features.ts`:

```typescript
export const FEATURES = {
  USE_SUPABASE_BACKEND: true,
  ENABLE_ANALYTICS: false,
  ENABLE_REALTIME: false,
  DEBUG_MODE: true,
};
```

## 🔄 Development Workflow

### Tạo component mới

```bash
# Tạo component với CSS Module
src/
  ├── components/
  │   └── MyComponent/
  │       ├── MyComponent.tsx
  │       └── MyComponent.module.css
```

### Thêm route mới

Chỉnh sửa `src/routes/routes.tsx`:

```typescript
{
  path: 'my-route',
  element: <MyPage />,
}
```

### Sử dụng Design System

```typescript
import { Button, Card, Input } from '@/ui-kit';

function MyComponent() {
  return (
    <Card>
      <CardHeader title="My Title" />
      <CardContent>
        <Input label="Name" placeholder="Enter name" />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

## 📱 Responsive Design

Hệ thống hỗ trợ đầy đủ responsive:

- **Mobile** (< 640px): UI tối ưu cho mobile
- **Tablet** (640px - 1024px): Layout điều chỉnh
- **Desktop** (> 1024px): Layout đầy đủ với sidebar/horizontal nav

Menu ngang sẽ tự động chuyển sang drawer trên màn hình < 1024px.

## 🌐 Đa ngôn ngữ

- **Ngôn ngữ chính**: Tiếng Việt
- **Ngôn ngữ phụ**: Tiếng Anh (chuẩn bị sẵn, chưa implement)
- Cấu trúc i18n đã được chuẩn bị sẵn

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

This project is private and proprietary.

## 📞 Liên hệ

Để biết thêm thông tin, vui lòng xem tài liệu trong thư mục [`docs/`](./docs/).

---

**Built with ❤️ for Vietnamese Government Market Management**
