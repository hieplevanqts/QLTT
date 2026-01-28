### 📂 Đề xuất cấu trúc thư mục chuẩn (Module-Based Architecture)

Dựa trên cấu trúc hiện tại của dự án VHV-QLTT, tài liệu này đề xuất một cấu trúc thư mục chuyên nghiệp hơn nhằm tăng tính đóng gói, dễ bảo trì và mở rộng.

#### 🏗️ Cây thư mục đề xuất

```text
src/
├── api/                  # Cấu hình API chung (axios instance, interceptors, endpoints)
├── assets/               # Hình ảnh, fonts, global styles
├── components/           # UI Components dùng chung toàn hệ thống (Button, Modal, Input, Table...)
│   └── ui/               # Base UI components (thường từ Shadcn hoặc thư viện UI)
├── constants/            # Các hằng số, enum dùng chung
├── contexts/             # React Contexts (Theme, Layout, Auth...)
├── hooks/                # Custom hooks dùng chung (useLocalStorage, useDebounce...)
├── layouts/              # Các layout chính của ứng dụng (MainLayout, AuthLayout, Sidebar...)
├── modules/              # Nơi chứa logic nghiệp vụ chính theo từng module (Quan trọng nhất)
│   ├── auth/             # Module xác thực
│   ├── lead-risk/        # Module nguồn tin & rủi ro
│   ├── map/              # Module bản đồ điều hành
│   ├── system-admin/     # Module quản trị hệ thống
│   └── [feature-name]/   # Cấu trúc bên trong mỗi module:
│       ├── components/   # Components chỉ dùng riêng cho module này
│       ├── hooks/        # Hooks xử lý logic nghiệp vụ của module
│       ├── services/     # Các hàm gọi API riêng của module
│       ├── types/        # TypeScript interfaces/types của module
│       ├── utils/        # Helper functions riêng của module
│       └── pages/        # Các trang thuộc module này
├── pages/                # Nơi định nghĩa các trang chính hoặc ghép nối các module
├── routes/               # Cấu hình routing (Public, Private routes, Route guards)
├── store/                # [GIỮ NGUYÊN] Redux Toolkit (Slices, Sagas, Root Reducer)
├── types/                # Các kiểu dữ liệu global
└── utils/                # Các hàm tiện ích dùng chung (format date, validation...)
```

#### 💡 Các điểm chính trong đề xuất

1.  **Chuyển từ "Page-Centric" sang "Module-Centric":** Tập trung toàn bộ logic của một tính năng vào trong thư mục `modules/[module-name]`. Điều này giúp tăng tính đóng gói và dễ tìm kiếm code.
2.  **Phân loại Components rõ ràng:** 
    *   `src/components`: Chứa các thành phần tái sử dụng ở quy mô toàn dự án.
    *   `src/modules/[module]/components`: Chứa các thành phần đặc thù chỉ dùng cho nghiệp vụ đó.
3.  **Tách biệt API và Services:** Cấu hình gốc nằm ở `src/api`, logic gọi dữ liệu theo nghiệp vụ nằm ở `src/modules/[module]/services`.
4.  **Quy hoạch lại src/app:** Gộp các thành phần từ `src/app` vào đúng vị trí mới (ví dụ: `src/app/hooks` -> `src/hooks` hoặc `src/modules/x/hooks`).
5.  **Bảo toàn Store:** Thư mục `store` được giữ nguyên cấu trúc hiện tại để đảm bảo không ảnh hưởng đến luồng dữ liệu Redux Saga đang chạy ổn định.

#### 🚀 Lợi ích mang lại
*   **Dễ mở rộng (Scalable):** Thêm tính năng mới chỉ cần thêm một thư mục trong `modules`.
*   **Dễ bảo trì:** Logic nghiệp vụ không bị phân tán ở quá nhiều nơi.
*   **Hợp tác nhóm tốt hơn:** Các thành viên có thể làm việc trên các module khác nhau mà ít bị xung đột file.
