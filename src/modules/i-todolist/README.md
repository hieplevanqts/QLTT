# Module Nhật ký công việc (i-todolist)

**Version**: `1.0.1` | **Status**: ✅ Active | **Compatibility**: MAPPA Portal 0.1.0 - 0.9.0

## Tổng quan

Module quản lý nhật ký công việc cá nhân với khả năng xem theo lịch và danh sách, phân loại theo chủ đề/phiên, theo dõi tiến độ và ghi chú chi tiết.

## Release Information

- **Current Version**: `1.0.1` (PATCH)
- **Release Type**: Metadata standardization
- **Breaking Changes**: None
- **Min App Version**: `0.1.0`
- **Max App Version**: `0.9.0`

### Latest Changes (v1.0.1 - 2026-01-22)
- ✨ Chuẩn hóa metadata `release` và `compat` theo tiêu chuẩn Codex
- ✅ Thêm trường `release` với type, notes, breaking changes
- ✅ Thêm trường `compat` với minAppVersion và maxAppVersion
- ✅ Cập nhật tài liệu INTEGRATION.md với Release & Compatibility section
- ✅ Thêm Upgrade Notes cho version transition
- 🔧 Không có thay đổi về UI, logic xử lý, hoặc routes
- ✅ Tương thích ngược hoàn toàn với v1.0.0

## Cấu trúc module

```
i-todolist/
├── components/              # UI Components
│   ├── CommentSection       # Component hiển thị và quản lý bình luận
│   ├── PriorityIndicator    # Chỉ báo mức độ ưu tiên
│   ├── TaskCalendar         # Calendar view hiển thị tasks theo tháng
│   ├── TaskStatusBadge      # Badge hiển thị trạng thái task
│   └── TopicsPanel          # Sidebar quản lý chủ đề/phiên
├── data/                    # Mock data
│   └── mock.ts             
├── pages/                   # Page components
│   ├── CalendarPage         # View lịch với topics panel
│   ├── DashboardPage        # Trang tổng quan (deprecated)
│   ├── TaskDetailPage       # Chi tiết task
│   ├── TaskFormPage         # Form tạo/sửa task
│   └── TaskListPage         # View danh sách với topics panel
├── services/                # Business logic
│   └── taskService.ts       # CRUD operations cho tasks
├── types/                   # TypeScript types
│   └── index.ts             # Task, Comment, Topic, Statistics
├── index.ts                 # Module entry point
├── module.json              # Module metadata
└── routes.tsx               # Route definitions

```

## Tính năng chính

### 1. **Topics Panel (Chủ đề / Phiên)**
- Hiển thị tất cả chủ đề/phiên trong sidebar
- Tạo chủ đề mới với màu sắc tùy chỉnh
- Lọc tasks theo chủ đề
- Hiển thị số lượng task trong mỗi chủ đề
- View "Tất cả nhiệm vụ" để xem toàn bộ

### 2. **Calendar View**
- Hiển thị tasks theo lịch tháng
- Navigation qua các tháng (prev/next)
- Nút "Hôm nay" để quay về ngày hiện tại
- Hiển thị indicators cho ngày có tasks
- Preview tasks trong mỗi ngày (tối đa 3 tasks)
- Click vào task để xem chi tiết
- Highlight ngày hôm nay

### 3. **List View**
- Hiển thị danh sách tasks với thông tin đầy đủ
- Search theo tiêu đề và mô tả
- Filter theo trạng thái (Chưa bắt đầu, Đang làm, Hoàn thành, Tạm dừng)
- Filter theo mức độ ưu tiên (Urgent, High, Medium, Low)
- Hiển thị tags và metadata
- Actions: Xem chi tiết, Chỉnh sửa, Xóa
- Badge đỏ cho tasks quá hạn

### 4. **Task Management**
- Tạo task mới với form đầy đủ
- Cập nhật task
- Xem chi tiết task với comments
- Xóa task với confirmation
- Gán task vào chủ đề/phiên

### 5. **Design System Integration**
- Sử dụng 100% design tokens từ `theme.css`
- Font Inter cho toàn bộ text
- Color palette MAPPA với primary color #005cb6
- Responsive design với breakpoints chuẩn
- CSS Modules để tránh xung đột

## Routes

| Path | Component | Mô tả |
|------|-----------|-------|
| `/todolist` | CalendarPage | Trang chủ - Calendar view |
| `/todolist/list` | TaskListPage | Danh sách tasks |
| `/todolist/create` | TaskFormPage | Tạo task mới |
| `/todolist/:id` | TaskDetailPage | Chi tiết task |

## Data Types

### Task
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'paused';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string; // ISO date
  tags: string[];
  topicId?: string; // Link to topic/session
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
}
```

### Topic
```typescript
interface Topic {
  id: string;
  name: string;
  color: string; // Hex color
  icon?: 'folder' | 'briefcase' | 'target' | 'users';
  taskCount: number;
  createdAt: string;
}
```

## Storage

Module sử dụng localStorage để lưu trữ:
- `todolist_tasks`: Array of tasks
- `todolist_topics`: Array of topics
- `todolist_comments`: Array of comments

## Module Configuration

**module.json:**
```json
{
  "id": "i-todolist",
  "name": "Nhật ký công việc",
  "version": "1.0.0",
  "basePath": "/todolist",
  "entry": "src/modules/i-todolist/index.ts",
  "routes": "src/modules/i-todolist/routes.tsx",
  "routeExport": "iTodolistRoute",
  "permissions": ["todolist:read", "todolist:write"],
  "ui": {
    "menuLabel": "Nhiệm vụ",
    "menuPath": "/todolist"
  }
}
```

## Design Tokens Usage

Module tuân thủ 100% design system với các tokens:

### Colors
- Primary: `var(--color-primary)` - #005cb6
- Background: `var(--color-background)`
- Card: `var(--color-card)`
- Border: `var(--color-border)`
- Muted: `var(--color-muted)`

### Typography
- Font: `var(--font-family-base)` - Inter
- Sizes: `var(--font-size-xs|sm|base|lg|xl)`
- Weights: `var(--font-weight-normal|medium|semibold|bold)`

### Spacing
- `var(--spacing-1)` đến `var(--spacing-12)`
- `var(--spacing-xs|sm|md|lg|xl)`

### Border Radius
- `var(--radius-sm|md|lg|xl|full)`

## Future Enhancements

- [ ] Tích hợp với API backend
- [ ] Notifications cho tasks sắp đến hạn
- [ ] Recurring tasks
- [ ] File attachments thực tế
- [ ] Subtasks
- [ ] Time tracking
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Collaborative tasks
- [ ] Task templates
- [ ] Export reports

## Version History

### v1.0.1 (2026-01-22) - PATCH
**Metadata Standardization**
- ✨ Chuẩn hóa metadata `release` và `compat` theo tiêu chuẩn Codex
- ✅ Thêm trường `release` với type, notes, breaking changes
- ✅ Thêm trường `compat` với minAppVersion và maxAppVersion
- ✅ Cập nhật tài liệu INTEGRATION.md với Release & Compatibility section
- ✅ Thêm Upgrade Notes cho version transition
- 🔧 Không có thay đổi về UI, logic xử lý, hoặc routes
- ✅ Tương thích ngược hoàn toàn với v1.0.0

### v1.0.0 (2026-01-21) - INITIAL
**Initial Release**
- ✨ Calendar view với navigation tháng
- ✨ List view với search và filters
- ✨ Topics/Phiên management với sidebar panel
- ✨ CRUD operations đầy đủ cho tasks
- ✨ Comment system
- ✨ Responsive design
- ✨ CSS Modules với design tokens integration
- ✨ localStorage persistence
