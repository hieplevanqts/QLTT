# Hệ thống Thông báo Công việc - MAPPA Portal

## Tổng quan

Module "Nhật ký công việc" (i-todolist) đã được tích hợp hệ thống thông báo thông minh để cảnh báo người dùng về các công việc sắp hết hạn.

## Tính năng

### 1. Toast Notifications (In-App)
- ✅ Thông báo hiển thị ở góc phải màn hình
- ✅ 4 loại thông báo: Success, Error, Warning, Info
- ✅ Auto-dismiss sau 5-8 giây (tùy chỉnh được)
- ✅ Có thể đóng thủ công
- ✅ Animation slide-in mượt mà
- ✅ Responsive trên mọi thiết bị

### 2. Browser Notifications (Desktop)
- ✅ Thông báo native của trình duyệt
- ✅ Hoạt động ngay cả khi tab đang ở background
- ✅ Click vào notification sẽ focus vào tab
- ✅ Yêu cầu permission từ người dùng

### 3. Notification Banner
- ✅ Banner thân thiện để yêu cầu permission
- ✅ Có thể dismiss (ẩn vĩnh viễn)
- ✅ Chỉ hiển thị 1 lần cho mỗi user

### 4. Smart Detection
- ✅ Tự động kiểm tra tasks sắp hết hạn (trong vòng 24h)
- ✅ Phát hiện tasks quá hạn
- ✅ Không spam - tối thiểu 5 phút giữa các lần check
- ✅ Auto-refresh mỗi 10 phút

## Cách sử dụng

### Cho Developer

#### 1. Import và Setup
\`\`\`typescript
import { useNotifications } from '../hooks/useNotifications';
import { ToastContainer } from '../components/Toast';

function MyPage() {
  const { toasts, notify, closeToast } = useNotifications();
  
  return (
    <>
      {/* Your page content */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </>
  );
}
\`\`\`

#### 2. Hiển thị thông báo
\`\`\`typescript
// Toast notification only
notify('success', 'Thành công', 'Công việc đã được lưu');

// Toast + Browser notification
notify('warning', 'Sắp hết hạn', 'Công việc X sẽ hết hạn trong 3 giờ', {
  duration: 8000,
  browserNotification: true,
});
\`\`\`

#### 3. Kiểm tra tasks sắp hết hạn
\`\`\`typescript
import { checkTasksForNotifications, getNotificationMessage } from '../utils/taskNotifications';

const notifications = checkTasksForNotifications(tasks);

notifications.forEach((notification) => {
  const { title, message } = getNotificationMessage(notification);
  notify(notification.type === 'overdue' ? 'error' : 'warning', title, message);
});
\`\`\`

### Cho User

#### Bật Browser Notifications:
1. Khi lần đầu vào trang, sẽ có banner hỏi "Bật thông báo công việc?"
2. Click "Bật ngay" 
3. Trình duyệt sẽ hỏi permission → Click "Allow"
4. Hoàn tất! Bạn sẽ nhận thông báo ngay cả khi tab đang ở background

#### Tắt Notifications:
- **Toast notifications**: Click nút X ở mỗi toast
- **Browser notifications**: Vào Settings của trình duyệt → Site settings → Notifications → Chặn

## Cấu trúc Files

\`\`\`
/src/modules/i-todolist/
├── components/
│   ├── Toast.tsx                    # Toast component
│   ├── ToastContainer.tsx          # Container cho toasts
│   └── NotificationBanner.tsx      # Permission banner
├── hooks/
│   └── useNotifications.ts         # Hook quản lý notifications
├── utils/
│   └── taskNotifications.ts        # Logic check tasks sắp hết hạn
└── styles.css                       # CSS cho toasts và banner
\`\`\`

## Design Tokens

Hệ thống notification sử dụng 100% design tokens từ theme.css:

### Colors:
- \`--success\`: rgba(15, 202, 122, 1) - Success notifications
- \`--destructive\`: rgba(217, 45, 32, 1) - Error notifications
- \`--warning\`: rgba(251, 146, 60, 1) - Warning notifications
- \`--info\`: rgba(59, 130, 246, 1) - Info notifications
- \`--card\`: Background
- \`--border\`: Borders

### Spacing:
- \`--spacing-1\` đến \`--spacing-12\`
- \`--spacing-0-5\`: 2px (mới thêm)

### Typography:
- \`--font-family-base\`: 'Inter', sans-serif
- \`--font-size-xs\`, \`--font-size-sm\`, \`--font-size-base\`
- \`--font-weight-normal\`, \`--font-weight-medium\`, \`--font-weight-semibold\`

### Shadows:
- \`--shadow-lg\`: 0 10px 15px -3px rgba(0, 0, 0, 0.1)

## Customization

### Thay đổi thời gian kiểm tra:
\`\`\`typescript
// CalendarPage.tsx
useEffect(() => {
  const interval = setInterval(() => {
    checkForDueTasks();
  }, 5 * 60 * 1000); // Thay đổi từ 10 phút → 5 phút
  
  return () => clearInterval(interval);
}, [tasks]);
\`\`\`

### Thay đổi ngưỡng cảnh báo:
\`\`\`typescript
// utils/taskNotifications.ts
export function checkTasksForNotifications(tasks: Task[]): TaskNotification[] {
  // ...
  // Task is due within 48 hours (thay vì 24 hours)
  else if (hoursUntilDue <= 48 && hoursUntilDue > 0) {
    // ...
  }
}
\`\`\`

### Thay đổi màu sắc:
Cập nhật file \`/src/styles/theme.css\`:
\`\`\`css
:root {
  --success: rgba(34, 197, 94, 1);  /* Màu xanh lá khác */
  --warning: rgba(245, 158, 11, 1);  /* Màu vàng khác */
}
\`\`\`

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (yêu cầu macOS 12+)
- ⚠️ Safari iOS: Không hỗ trợ browser notifications
- ✅ Mobile: Toast notifications hoạt động tốt

## Testing

### Mock data với tasks sắp hết hạn:
File \`/src/modules/i-todolist/data/mock.ts\` đã có:
- Task #1: Hết hạn trong 3 giờ
- Task #3: Hết hạn trong 12 giờ

Để test:
1. Load trang
2. Click "Bật ngay" ở notification banner
3. Allow browser permission
4. Đợi vài giây → Toast và browser notification sẽ xuất hiện

## Troubleshooting

**Q: Không thấy browser notification?**
- A: Kiểm tra browser permission, có thể bị block
- A: Thử hard refresh (Ctrl+Shift+R)

**Q: Toast không tự động biến mất?**
- A: Kiểm tra duration parameter trong notify()

**Q: Banner cứ hiện lại mãi?**
- A: Click "Để sau" hoặc clear localStorage

**Q: Muốn reset notification permission?**
- A: Clear localStorage: \`localStorage.removeItem('notification_banner_dismissed')\`

## Future Enhancements

- [ ] Email notifications
- [ ] SMS notifications (via API)
- [ ] Customizable notification sound
- [ ] Notification history
- [ ] Snooze functionality
- [ ] Group notifications
