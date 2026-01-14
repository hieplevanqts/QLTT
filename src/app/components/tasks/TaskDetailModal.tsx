import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Flag, 
  FileText, 
  CheckSquare,
  AlertCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Building2,
  MapPinned,
  UserCircle2,
  ClipboardList,
  Activity,
  RefreshCcw
} from 'lucide-react';
import { InspectionTask, TaskStatus } from '../../data/inspection-tasks-mock-data';
import { InspectionTaskStatusBadge } from './InspectionTaskStatusBadge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import styles from './TaskDetailModal.module.css';

interface TaskDetailModalProps {
  task: InspectionTask | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (task: InspectionTask) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete, onStatusChange }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'history'>('overview');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | null>(null);

  // Reset tab and status when modal opens
  React.useEffect(() => {
    if (isOpen && task) {
      setActiveTab('overview');
      setSelectedStatus(task.status);
    }
  }, [isOpen, task]);

  if (!isOpen) return null;
  if (!task) return null;

  const getSLAStatus = () => {
    if (!task?.dueDate) return { label: 'Chưa có hạn', color: '#64748b', icon: '⏱️' };
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (task.status === 'completed') return { label: 'Đã hoàn thành', color: '#10b981', icon: '✅' };
    if (diffDays < 0) return { label: 'Quá hạn', color: '#ef4444', icon: '🔴' };
    if (diffDays <= 2) return { label: 'Sắp hết hạn', color: '#f59e0b', icon: '⏱️' };
    return { label: 'Đúng hạn', color: '#10b981', icon: '✅' };
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case 'not_started':
        return 'Chưa bắt đầu';
      case 'in_progress':
        return 'Đang thực hiện';
      case 'pending_review':
        return 'Chờ kiểm tra';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const slaStatus = getSLAStatus();

  // Mock checklist data
  const checklistItems = [
    { id: 1, title: 'Kiểm tra giấy phép kinh doanh', completed: true },
    { id: 2, title: 'Kiểm tra vệ sinh an toàn thực phẩm', completed: true },
    { id: 3, title: 'Kiểm tra nguồn gốc nguyên liệu', completed: false },
    { id: 4, title: 'Kiểm tra quy trình chế biến', completed: false },
    { id: 5, title: 'Lập biên bản kiểm tra', completed: false },
  ];

  // Mock history data
  const historyItems = [
    { id: 1, action: 'Tạo nhiệm vụ', user: 'Nguyễn Văn A', timestamp: '2024-01-08 09:30', icon: FileText },
    { id: 2, action: 'Phân công cho Trần Thị B', user: 'Nguyễn Văn A', timestamp: '2024-01-08 10:15', icon: User },
    { id: 3, action: 'Cập nhật tiến độ 40%', user: 'Trần Thị B', timestamp: '2024-01-09 14:20', icon: Activity },
    { id: 4, action: 'Cập nhật tiến độ 60%', user: 'Trần Thị B', timestamp: '2024-01-10 11:45', icon: Activity },
  ];

  const handleEdit = () => {
    // Apply status change if it was modified
    if (selectedStatus && selectedStatus !== task.status && onStatusChange) {
      const oldStatusLabel = getStatusLabel(task.status);
      const newStatusLabel = getStatusLabel(selectedStatus);
      onStatusChange(task.id, selectedStatus);
      toast.success(`Đã chuyển trạng thái từ "${oldStatusLabel}" sang "${newStatusLabel}"`, {
        duration: 2000,
      });
    }
    
    if (onEdit) {
      onEdit(task);
    }
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && confirm('Bạn có chắc chắn muốn xóa nhiệm vụ này?')) {
      onDelete(task.id);
      onClose();
    }
  };

  const handleStatusDropdownChange = (newStatus: TaskStatus) => {
    setSelectedStatus(newStatus);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FileText size={20} />
            </div>
            <div className={styles.headerText}>
              <h2 className={styles.title}>{task.title}</h2>
              <span className={styles.taskCode}>{task.code}</span>
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <div className={styles.statusItem}>
            <InspectionTaskStatusBadge type="status" value={task.status} />
          </div>
          <div className={styles.statusItem}>
            <InspectionTaskStatusBadge type="priority" value={task.priority} />
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FileText size={16} />
            Tổng quan
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'checklist' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <CheckSquare size={16} />
            Checklist ({task.checklistCompleted}/{task.checklistTotal})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Activity size={16} />
            Lịch sử
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              {/* Status Change Section */}
              <div className={styles.statusChangeSection}>
                <label className={styles.statusChangeLabel}>
                  Trạng thái
                  {selectedStatus && selectedStatus !== task.status && (
                    <span className={styles.statusChangeIndicator}>
                      (Chưa lưu)
                    </span>
                  )}
                </label>
                <Select 
                  value={selectedStatus || task.status} 
                  onValueChange={handleStatusDropdownChange}
                >
                  <SelectTrigger className={styles.statusChangeSelect}>
                    <SelectValue>
                      {getStatusLabel(selectedStatus || task.status)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Chưa bắt đầu</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="pending_review">Chờ kiểm tra</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              {task.description && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <FileText size={16} />
                    Mô tả
                  </h3>
                  <p className={styles.description}>{task.description}</p>
                </div>
              )}

              {/* Target Information */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Building2 size={16} />
                  Đối tượng kiểm tra
                </h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>
                      <Building2 size={14} />
                      Tên cơ sở
                    </div>
                    <div className={styles.infoValue}>{task.targetName}</div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>
                      <MapPinned size={14} />
                      Địa chỉ
                    </div>
                    <div className={styles.infoValue}>{task.targetAddress}</div>
                  </div>
                </div>
              </div>

              {/* Task Information */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <ClipboardList size={16} />
                  Thông tin nhiệm vụ
                </h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>
                      <User size={14} />
                      Người thực hiện
                    </div>
                    <div className={styles.infoValue}>
                      <div className={styles.assigneeInfo}>
                        <div className={styles.avatar}>
                          <UserCircle2 size={16} />
                        </div>
                        <div>
                          <div className={styles.assigneeName}>{task.assignee?.name || 'N/A'}</div>
                          {task.assignee?.role && (
                            <div className={styles.assigneeRole}>{task.assignee.role}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>
                      <FileText size={14} />
                      Đợt kiểm tra
                    </div>
                    <div className={styles.infoValue}>
                      <a href="#" className={styles.link}>
                        {task.roundId}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  {task.planId && (
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <FileText size={14} />
                        Kế hoạch
                      </div>
                      <div className={styles.infoValue}>
                        <a href="#" className={styles.link}>
                          {task.planId}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Calendar size={16} />
                  Thời gian
                </h3>
                <div className={styles.infoGrid}>
                  {task.startDate && (
                    <div className={styles.infoItem}>
                      <div className={styles.infoLabel}>
                        <Calendar size={14} />
                        Ngày bắt đầu
                      </div>
                      <div className={styles.infoValue}>
                        {new Date(task.startDate).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  )}
                  <div className={styles.infoItem}>
                    <div className={styles.infoLabel}>
                      <Clock size={14} />
                      Hạn hoàn thành
                    </div>
                    <div className={styles.infoValue}>
                      {new Date(task.dueDate).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Activity size={16} />
                  Tiến độ thực hiện
                </h3>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressText}>{task.progress}% hoàn thành</span>
                    <span className={styles.progressText}>
                      {task.checklistCompleted}/{task.checklistTotal} bước
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className={styles.checklistContent}>
              <div className={styles.checklistHeader}>
                <div className={styles.checklistStats}>
                  <span>Đã hoàn thành: {checklistItems.filter(i => i.completed).length}/{checklistItems.length}</span>
                </div>
              </div>
              <div className={styles.checklistItems}>
                {checklistItems.map((item) => (
                  <div 
                    key={item.id} 
                    className={`${styles.checklistItem} ${item.completed ? styles.checklistItemCompleted : ''}`}
                  >
                    <div className={styles.checkbox}>
                      {item.completed && '✓'}
                    </div>
                    <span className={styles.checklistItemText}>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className={styles.historyContent}>
              <div className={styles.timeline}>
                {historyItems.map((item, index) => (
                  <div key={item.id} className={styles.timelineItem}>
                    <div className={styles.timelineIcon}>
                      <item.icon size={14} />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineAction}>{item.action}</div>
                      <div className={styles.timelineMeta}>
                        <span>{item.user}</span>
                        <span className={styles.timelineDot}>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                    {index < historyItems.length - 1 && <div className={styles.timelineLine} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <button className={styles.deleteButton} onClick={handleDelete}>
              <Trash2 size={16} />
              Xóa
            </button>
          </div>
          <div className={styles.footerRight}>
            <button className={styles.cancelButton} onClick={onClose}>
              Đóng
            </button>
            <button className={styles.editButton} onClick={handleEdit}>
              <Edit2 size={16} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailModal;