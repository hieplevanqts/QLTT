import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Send,
  UserPlus,
  Calendar,
  Clock,
  User,
  MapPin,
  Shield,
  X,
  Paperclip,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './AlertAcknowledgement.module.css';

interface Note {
  id: string;
  author: string;
  role: string;
  content: string;
  timestamp: string;
  isPrivate: boolean;
}

interface FollowUpTask {
  action: string;
  assignee: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

export default function AlertAcknowledgement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [acknowledgeNote, setAcknowledgeNote] = useState('');
  const [newNote, setNewNote] = useState('');
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [followUpTasks, setFollowUpTasks] = useState<FollowUpTask[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<FollowUpTask>({
    action: '',
    assignee: '',
    dueDate: '',
    priority: 'medium',
  });

  // Mock alert data
  const alert = {
    id: id || 'ALT-2025-001',
    type: 'critical' as const,
    category: 'lead',
    title: 'Lead mới từ hotline - Vi phạm nghiêm trọng',
    description: 'Phát hiện cửa hàng bán hàng giả quy mô lớn tại 123 Nguyễn Huệ, Quận 1',
    location: {
      address: '123 Nguyễn Huệ',
      district: 'Quận 1',
    },
    timestamp: '2025-01-09T08:30:00',
    source: 'Hotline 1800',
    entityId: 'L-2024-1234',
    entityType: 'lead' as const,
  };

  // Mock notes
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 'N-001',
      author: 'Nguyễn Văn A',
      role: 'Thanh tra viên',
      content:
        'Đã liên hệ với người báo cáo. Thông tin ban đầu có vẻ chính xác. Cần tiến hành thanh tra trong vòng 24h.',
      timestamp: '2025-01-09T09:00:00',
      isPrivate: false,
    },
    {
      id: 'N-002',
      author: 'Trần Thị B',
      role: 'Phó Chi cục trưởng',
      content:
        'Đã phân công thanh tra viên Nguyễn Văn A phụ trách. Vui lòng báo cáo trước 17h hôm nay.',
      timestamp: '2025-01-09T09:15:00',
      isPrivate: true,
    },
  ]);

  // Current user (mock)
  const currentUser = {
    name: 'Lê Văn C',
    role: 'Điều phối viên',
    canAcknowledge: true,
    canAssignTasks: true,
  };

  const handleAcknowledge = () => {
    if (!acknowledgeNote.trim()) {
      toast.error('Vui lòng nhập ghi chú xác nhận');
      return;
    }

    setIsAcknowledged(true);
    toast.success('Đã xác nhận cảnh báo');

    // Add acknowledgement as a note
    const newAckNote: Note = {
      id: `N-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      content: `[Xác nhận] ${acknowledgeNote}`,
      timestamp: new Date().toISOString(),
      isPrivate: false,
    };
    setNotes([...notes, newAckNote]);
    setAcknowledgeNote('');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Vui lòng nhập nội dung ghi chú');
      return;
    }

    const note: Note = {
      id: `N-${Date.now()}`,
      author: currentUser.name,
      role: currentUser.role,
      content: newNote,
      timestamp: new Date().toISOString(),
      isPrivate: isPrivateNote,
    };

    setNotes([...notes, note]);
    setNewNote('');
    setIsPrivateNote(false);
    toast.success('Đã thêm ghi chú');
  };

  const handleAddFollowUpTask = () => {
    if (!newTask.action || !newTask.assignee || !newTask.dueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setFollowUpTasks([...followUpTasks, newTask]);
    setNewTask({ action: '', assignee: '', dueDate: '', priority: 'medium' });
    setShowAddTask(false);
    toast.success('Đã thêm nhiệm vụ theo dõi');
  };

  const handleRemoveTask = (index: number) => {
    setFollowUpTasks(followUpTasks.filter((_, i) => i !== index));
    toast.success('Đã xóa nhiệm vụ');
  };

  const getTypeClass = (type: string) => {
    const classes = {
      critical: styles.alertCritical,
      high: styles.alertHigh,
      medium: styles.alertMedium,
      info: styles.alertInfo,
    };
    return classes[type as keyof typeof classes] || '';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      critical: 'Nghiêm trọng',
      high: 'Cao',
      medium: 'Trung bình',
      info: 'Thông tin',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </button>

        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Xác nhận & Ghi chú Cảnh báo</h1>
          <p className={styles.subtitle}>{alert.id}</p>
        </div>

        {isAcknowledged && (
          <div className={styles.acknowledgedBadge}>
            <CheckCircle size={16} />
            Đã xác nhận
          </div>
        )}
      </div>

      {/* Alert Summary */}
      <div className={`${styles.alertSummary} ${getTypeClass(alert.type)}`}>
        <div className={styles.alertHeader}>
          <div className={styles.alertType}>
            <AlertTriangle size={20} />
            {getTypeLabel(alert.type)}
          </div>
          <div className={styles.alertTime}>
            <Clock size={14} />
            {new Date(alert.timestamp).toLocaleString('vi-VN')}
          </div>
        </div>

        <h2 className={styles.alertTitle}>{alert.title}</h2>
        <p className={styles.alertDescription}>{alert.description}</p>

        <div className={styles.alertMeta}>
          <div className={styles.metaItem}>
            <MapPin size={14} />
            <span>
              {alert.location.address}, {alert.location.district}
            </span>
          </div>
          <div className={styles.metaItem}>
            <User size={14} />
            <span>Nguồn: {alert.source}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* Acknowledgement Section */}
        {!isAcknowledged && currentUser.canAcknowledge && (
          <div className={styles.acknowledgeSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <Shield size={20} />
                Xác nhận cảnh báo
              </h3>
              <p className={styles.sectionDescription}>
                Xác nhận rằng bạn đã nhận và sẽ xử lý cảnh báo này
              </p>
            </div>

            <div className={styles.acknowledgeForm}>
              <textarea
                rows={4}
                placeholder="Nhập ghi chú xác nhận (bắt buộc): Tình trạng hiện tại, kế hoạch xử lý, thời gian dự kiến..."
                value={acknowledgeNote}
                onChange={(e) => setAcknowledgeNote(e.target.value)}
                className={styles.textarea}
              />

              <button className={styles.acknowledgeButton} onClick={handleAcknowledge}>
                <CheckCircle size={16} />
                Xác nhận cảnh báo
              </button>
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>
              <MessageSquare size={20} />
              Ghi chú & Trao đổi ({notes.length})
            </h3>
          </div>

          <div className={styles.notesList}>
            {notes.map((note) => (
              <div key={note.id} className={styles.noteCard}>
                <div className={styles.noteHeader}>
                  <div className={styles.noteAuthor}>
                    <div className={styles.authorAvatar}>
                      <User size={16} />
                    </div>
                    <div>
                      <div className={styles.authorName}>{note.author}</div>
                      <div className={styles.authorRole}>{note.role}</div>
                    </div>
                  </div>

                  <div className={styles.noteTime}>
                    {note.isPrivate && (
                      <span className={styles.privateBadge}>
                        <Shield size={12} />
                        Nội bộ
                      </span>
                    )}
                    <span>{new Date(note.timestamp).toLocaleString('vi-VN')}</span>
                  </div>
                </div>

                <div className={styles.noteContent}>{note.content}</div>
              </div>
            ))}
          </div>

          {/* Add Note Form */}
          <div className={styles.addNoteForm}>
            <textarea
              rows={3}
              placeholder="Nhập ghi chú, cập nhật tiến độ, hoặc trao đổi với đồng nghiệp..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className={styles.textarea}
            />

            <div className={styles.addNoteActions}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isPrivateNote}
                  onChange={(e) => setIsPrivateNote(e.target.checked)}
                />
                <Shield size={14} />
                <span>Ghi chú nội bộ (chỉ quản lý nhìn thấy)</span>
              </label>

              <button className={styles.addNoteButton} onClick={handleAddNote}>
                <Send size={16} />
                Thêm ghi chú
              </button>
            </div>
          </div>
        </div>

        {/* Follow-up Tasks Section */}
        {currentUser.canAssignTasks && (
          <div className={styles.tasksSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                <UserPlus size={20} />
                Nhiệm vụ theo dõi ({followUpTasks.length})
              </h3>
              <p className={styles.sectionDescription}>
                Phân công nhiệm vụ cụ thể để xử lý cảnh báo
              </p>
            </div>

            {followUpTasks.length > 0 && (
              <div className={styles.tasksList}>
                {followUpTasks.map((task, index) => (
                  <div key={index} className={styles.taskCard}>
                    <div className={styles.taskContent}>
                      <div className={styles.taskAction}>{task.action}</div>
                      <div className={styles.taskMeta}>
                        <span>
                          <User size={12} />
                          {task.assignee}
                        </span>
                        <span>
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className={`${styles.priorityBadge} ${styles[`priority${task.priority}`]}`}>
                          {task.priority === 'high' && 'Cao'}
                          {task.priority === 'medium' && 'Trung bình'}
                          {task.priority === 'low' && 'Thấp'}
                        </span>
                      </div>
                    </div>

                    <button
                      className={styles.removeTaskButton}
                      onClick={() => handleRemoveTask(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!showAddTask ? (
              <button className={styles.addTaskButton} onClick={() => setShowAddTask(true)}>
                <UserPlus size={16} />
                Thêm nhiệm vụ
              </button>
            ) : (
              <div className={styles.addTaskForm}>
                <div className={styles.formGroup}>
                  <label>Nhiệm vụ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thanh tra cơ sở trong vòng 24h"
                    value={newTask.action}
                    onChange={(e) => setNewTask({ ...newTask, action: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phân công cho</label>
                    <input
                      type="text"
                      placeholder="Tên người thực hiện"
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Hạn hoàn thành</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Ưu tiên</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value as any })
                      }
                      className={styles.select}
                    >
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowAddTask(false);
                      setNewTask({ action: '', assignee: '', dueDate: '', priority: 'medium' });
                    }}
                  >
                    Hủy
                  </button>
                  <button className={styles.confirmButton} onClick={handleAddFollowUpTask}>
                    Thêm
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
