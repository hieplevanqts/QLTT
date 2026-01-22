# Module i-todolist - Hướng dẫn tích hợp

## Thông tin module

- **ID**: `i-todolist`
- **Tên**: Nhật ký công việc
- **Base Path**: `/todolist`
- **Route Export**: `iTodolistRoute`
- **Permissions**: `['todolist:read', 'todolist:write']`

## Cấu trúc thư mục

```
src/modules/i-todolist/
├── module.json              # Metadata của module
├── routes.tsx               # Route definitions
├── INTEGRATION.md           # File này
├── types/
│   └── index.ts            # TypeScript interfaces
├── data/
│   └── mock.ts             # Mock data
├── services/
│   └── taskService.ts      # Business logic & localStorage API
├── components/
│   ├── TaskStatusBadge.tsx
│   ├── TaskStatusBadge.module.css
│   ├── PriorityIndicator.tsx
│   ├── PriorityIndicator.module.css
│   ├── TaskCalendar.tsx
│   ├── TaskCalendar.module.css
│   ├── CommentSection.tsx
│   └── CommentSection.module.css
└── pages/
    ├── DashboardPage.tsx
    ├── DashboardPage.module.css
    ├── TaskListPage.tsx
    ├── TaskListPage.module.css
    ├── TaskFormPage.tsx
    ├── TaskFormPage.module.css
    ├── TaskDetailPage.tsx
    └── TaskDetailPage.module.css
```

## Các bước tích hợp

### 1. Import route vào router chính

Mở file `/src/routes/routes.tsx` và thêm:

```tsx
// Thêm import ở đầu file
import { iTodolistRoute } from '@/modules/i-todolist/routes';

// Trong mảng children của ProtectedLayout > MainLayout, thêm:
{
  element: <MainLayout />,
  children: [
    // ... các route hiện có
    
    // Thêm route mới
    iTodolistRoute,
  ],
}
```

### 2. Thêm menu item vào navigation (nếu cần)

Nếu bạn có sidebar navigation, thêm menu item:

```tsx
{
  id: 'todolist',
  label: 'Nhật ký công việc',
  icon: <ListTodo className="h-4 w-4" />,
  path: '/todolist',
  permissions: ['todolist:read'],
}
```

### 3. Cấu hình permissions (optional)

Nếu hệ thống có quản lý quyền, đảm bảo permissions được đăng ký:

- `todolist:read` - Xem danh sách và chi tiết công việc
- `todolist:write` - Tạo, sửa, xóa công việc

## Routes có sẵn

| Path | Component | Mô tả |
|------|-----------|-------|
| `/todolist` | DashboardPage | Dashboard với thống kê và calendar |
| `/todolist/list` | TaskListPage | Danh sách công việc với filter |
| `/todolist/create` | TaskFormPage | Form tạo/sửa công việc |
| `/todolist/:id` | TaskDetailPage | Chi tiết công việc + comments |

## Tính năng chính

### Dashboard
- Thống kê tổng quan (tổng công việc, hoàn thành, đang làm, quá hạn)
- Biểu đồ tiến độ (progress bar + bar chart)
- Lịch hiển thị công việc theo ngày

### Danh sách công việc
- Tìm kiếm theo tiêu đề/mô tả
- Lọc theo trạng thái (Chưa bắt đầu, Đang làm, Hoàn thành, Tạm dừng)
- Lọc theo mức độ ưu tiên (Low, Medium, High, Urgent)
- Hiển thị badge trạng thái và priority indicator
- Actions: Xem, Sửa, Xóa

### Form tạo/sửa
- Tiêu đề (required)
- Mô tả chi tiết
- Ngày đến hạn (required)
- Thời gian ước tính (giờ)
- Trạng thái
- Mức độ ưu tiên
- Tags (phân cách bằng dấu phẩy)
- Ghi chú

### Chi tiết công việc
- Hiển thị đầy đủ thông tin
- Thay đổi trạng thái nhanh
- Cảnh báo quá hạn
- Section bình luận (tạo, xem, xóa)
- Hiển thị timestamps (created, updated, completed)

## API Service (localStorage)

Module sử dụng localStorage để lưu trữ dữ liệu. Service cung cấp:

### taskService
```typescript
- getAllTasks(): Promise<Task[]>
- getTaskById(id): Promise<Task | null>
- createTask(data): Promise<Task>
- updateTask(id, updates): Promise<Task | null>
- deleteTask(id): Promise<boolean>
- getStatistics(): Promise<TaskStatistics>
- filterTasks(filters): Promise<Task[]>
```

### commentService
```typescript
- getCommentsByTaskId(taskId): Promise<Comment[]>
- addComment(taskId, content, author): Promise<Comment>
- deleteComment(id): Promise<boolean>
```

## Tích hợp với Backend (Future)

Khi cần tích hợp API backend thực tế:

1. Thay thế localStorage calls trong `taskService.ts` bằng API calls
2. Sử dụng axios hoặc fetch
3. Giữ nguyên interface để không ảnh hưởng components
4. Thêm error handling và loading states

Ví dụ:
```typescript
export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch('/api/tasks');
    return response.json();
  },
  // ...
};
```

## Dependencies

Module sử dụng các dependencies đã có trong dự án:

- `react-router-dom` - Routing
- `lucide-react` - Icons
- Design system components từ `/src/ui-kit/`
- CSS Modules
- Design tokens từ `/src/styles/theme.css`

## Customization

### Thay đổi màu sắc

Tất cả màu sắc được định nghĩa trong CSS variables từ `theme.css`:

- `--primary` - Màu chính (MAPPA blue)
- `--success` - Màu success
- `--warning` - Màu warning
- `--destructive` - Màu destructive
- `--info` - Màu info

### Thay đổi layout

Mỗi page có CSS Module riêng. Điều chỉnh trong các file `.module.css`.

### Thêm fields mới

1. Cập nhật `types/index.ts`
2. Cập nhật form trong `TaskFormPage.tsx`
3. Cập nhật display trong `TaskDetailPage.tsx`
4. Cập nhật mock data nếu cần

## Testing

Module có thể test độc lập:

1. Navigate đến `/todolist`
2. Test các chức năng CRUD
3. Test filters và search
4. Test comments
5. Kiểm tra responsive trên mobile

## Support

Nếu có vấn đề:

1. Kiểm tra console logs
2. Verify localStorage có data không
3. Kiểm tra routes được import đúng không
4. Verify permissions (nếu có)

## Changelog

### v1.0.0 (2026-01-21)
- ✨ Initial release
- ✅ Dashboard với thống kê và calendar
- ✅ CRUD operations đầy đủ
- ✅ Filter và search
- ✅ Comment system
- ✅ Responsive design
- ✅ CSS Modules
- ✅ Design tokens integration
