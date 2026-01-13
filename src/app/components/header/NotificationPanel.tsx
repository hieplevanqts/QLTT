import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, FileCheck, UserPlus, TrendingUp, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationPanel.module.css';

interface Notification {
  id: string;
  type: 'plan-approved' | 'plan-rejected' | 'task-assigned' | 'risk-created' | 'evidence-deadline' | 'file-pending';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'plan-approved',
    title: 'Kế hoạch đã được phê duyệt',
    message: 'Kế hoạch kiểm tra quý 1/2026 đã được lãnh đạo phê duyệt',
    timestamp: '5 phút trước',
    read: false,
  },
  {
    id: '2',
    type: 'task-assigned',
    title: 'Nhiệm vụ mới được phân công',
    message: 'Bạn được phân công kiểm tra cơ sở ABC Company',
    timestamp: '15 phút trước',
    read: false,
  },
  {
    id: '3',
    type: 'evidence-deadline',
    title: 'Gói chứng cứ sắp hết hạn',
    message: 'Gói chứng cứ GCC-234 cần chuyển hồ sơ trong 2 ngày',
    timestamp: '1 giờ trước',
    read: false,
  },
  {
    id: '4',
    type: 'risk-created',
    title: 'Rủi ro mới được tạo',
    message: 'Rủi ro "Hàng giả" được xác nhận tại cơ sở CS-045',
    timestamp: '2 giờ trước',
    read: true,
  },
  {
    id: '5',
    type: 'file-pending',
    title: 'Hồ sơ chờ duyệt',
    message: 'Hồ sơ pháp lý HS-2026-15 đang chờ phê duyệt',
    timestamp: '3 giờ trước',
    read: true,
  },
  {
    id: '6',
    type: 'plan-rejected',
    title: 'Kế hoạch bị từ chối',
    message: 'Kế hoạch KH-2026-02 cần chỉnh sửa theo góp ý',
    timestamp: 'Hôm qua',
    read: true,
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  const iconProps = { size: 20 };
  switch (type) {
    case 'plan-approved':
      return <FileCheck {...iconProps} className={styles.iconSuccess} />;
    case 'plan-rejected':
      return <AlertCircle {...iconProps} className={styles.iconError} />;
    case 'task-assigned':
      return <UserPlus {...iconProps} className={styles.iconInfo} />;
    case 'risk-created':
      return <TrendingUp {...iconProps} className={styles.iconWarning} />;
    case 'evidence-deadline':
      return <Clock {...iconProps} className={styles.iconWarning} />;
    case 'file-pending':
      return <FileCheck {...iconProps} className={styles.iconInfo} />;
    default:
      return <Bell {...iconProps} />;
  }
};

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <Bell size={20} />
          <h3 className={styles.panelTitle}>
            Thông báo {unreadCount > 0 && `(${unreadCount} mới)`}
          </h3>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.filterBar}>
        <button
          className={`${styles.filterButton} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          Tất cả
        </button>
        <button
          className={`${styles.filterButton} ${filter === 'unread' ? styles.filterActive : ''}`}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc
        </button>
        {unreadCount > 0 && (
          <button className={styles.markAllButton} onClick={handleMarkAllAsRead}>
            <CheckCheck size={16} />
            Đọc tất cả
          </button>
        )}
      </div>

      <div className={styles.notificationList}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Không có thông báo</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${styles.notificationItem} ${
                !notification.read ? styles.unread : ''
              }`}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <div className={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className={styles.notificationContent}>
                <div className={styles.notificationTitle}>{notification.title}</div>
                <div className={styles.notificationMessage}>{notification.message}</div>
                <div className={styles.notificationTime}>{notification.timestamp}</div>
              </div>
              {!notification.read && <div className={styles.unreadDot} />}
            </div>
          ))
        )}
      </div>

      <div className={styles.panelFooter}>
        <button 
          className={styles.viewAllButton} 
          onClick={() => {
            onClose();
            navigate('/notifications');
          }}
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  );
}