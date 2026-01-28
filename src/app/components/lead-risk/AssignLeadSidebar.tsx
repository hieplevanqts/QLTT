/**
 * MAPPA Portal - Assign Lead Sidebar Component
 * Sidebar for assigning leads to inspectors
 */

import { useState } from 'react';
import {
  X,
  UserPlus,
  MapPin,
  Clock,
  AlertCircle,
  Send,
  User,
  Users,
  CheckCircle,
  Calendar,
  FileText,
  Paperclip,
  Target,
  Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import styles from './AssignLeadSidebar.module.css';
import type { Lead } from '@/data/lead-risk/types';

interface Inspector {
  id: string;
  name: string;
  role: string;
  team: string;
  currentLoad: number;
  maxCapacity: number;
  activeLeads: number;
  completedToday: number;
  availability: 'available' | 'busy' | 'offline';
}

interface AssignLeadSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAssign: (inspectorId: string, note: string) => void;
}

// Mock inspectors data
const MOCK_INSPECTORS: Inspector[] = [
  {
    id: 'USR-001',
    name: 'Nguyễn Văn A',
    role: 'Thanh tra viên cấp cao',
    team: 'Đội 1 - Quản lý Thực phẩm',
    currentLoad: 5,
    maxCapacity: 10,
    activeLeads: 5,
    completedToday: 2,
    availability: 'available',
  },
  {
    id: 'USR-002',
    name: 'Trần Thị B',
    role: 'Thanh tra viên',
    team: 'Đội 2 - Quản lý Dược phẩm',
    currentLoad: 8,
    maxCapacity: 10,
    activeLeads: 8,
    completedToday: 1,
    availability: 'busy',
  },
  {
    id: 'USR-003',
    name: 'Lê Văn C',
    role: 'Thanh tra viên',
    team: 'Đội 1 - Quản lý Thực phẩm',
    currentLoad: 3,
    maxCapacity: 10,
    activeLeads: 3,
    completedToday: 3,
    availability: 'available',
  },
  {
    id: 'USR-004',
    name: 'Phạm Thị D',
    role: 'Thanh tra viên cấp cao',
    team: 'Đội 3 - Quản lý Mỹ phẩm',
    currentLoad: 6,
    maxCapacity: 10,
    activeLeads: 6,
    completedToday: 2,
    availability: 'available',
  },
  {
    id: 'USR-005',
    name: 'Hoàng Văn E',
    role: 'Thanh tra viên',
    team: 'Đội 2 - Quản lý Dược phẩm',
    currentLoad: 4,
    maxCapacity: 10,
    activeLeads: 4,
    completedToday: 1,
    availability: 'available',
  },
];

export default function AssignLeadSidebar({
  isOpen,
  onClose,
  lead,
  onAssign,
}: AssignLeadSidebarProps) {
  const [selectedInspectorId, setSelectedInspectorId] = useState<string>('');
  const [note, setNote] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [kraSession, setKraSession] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Reset form when closed
  const handleClose = () => {
    setSelectedInspectorId('');
    setNote('');
    setTeamFilter('all');
    setDeadline('');
    setDescription('');
    setKraSession('');
    setPriority('medium');
    setAttachments([]);
    onClose();
  };

  // Handle file attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (!selectedInspectorId) {
      toast.error('Vui lòng chọn người xử lý');
      return;
    }

    if (!deadline) {
      toast.error('Vui lòng chọn hạn xử lý');
      return;
    }

    if (!lead) {
      toast.error('Không tìm thấy thông tin nguồn tin');
      return;
    }

    // Log all data
    console.log('📋 [AssignLeadSidebar] Assignment data:', {
      inspectorId: selectedInspectorId,
      deadline,
      description,
      note,
      kraSession,
      priority,
      attachments: attachments.map(f => f.name),
    });

    // Call parent handler
    onAssign(selectedInspectorId, note);

    // Show success toast
    const inspector = MOCK_INSPECTORS.find(i => i.id === selectedInspectorId);
    toast.success(`Đã giao việc cho ${inspector?.name}`, {
      description: `Hạn xử lý: ${new Date(deadline).toLocaleDateString('vi-VN')}`,
    });

    // Close sidebar
    handleClose();
  };

  // Get unique teams
  const teams = Array.from(new Set(MOCK_INSPECTORS.map(i => i.team)));

  // Filter inspectors
  const filteredInspectors = MOCK_INSPECTORS.filter(inspector => {
    if (teamFilter === 'all') return true;
    return inspector.team === teamFilter;
  });

  if (!isOpen || !lead) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={handleClose} />

      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <UserPlus className={styles.headerIcon} />
            <h2 className={styles.headerTitle}>Giao xử lý cho người khác</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Lead Info Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Thông tin nguồn tin</h3>
            <div className={styles.leadInfo}>
              <p className={styles.leadCode}>{lead.code}</p>
              <p className={styles.leadTitle}>{lead.title}</p>
              <div className={styles.leadMeta}>
                <div className={styles.metaItem}>
                  <MapPin className={styles.metaIcon} />
                  <span>{lead.location.district}, {lead.location.province}</span>
                </div>
                <div className={styles.metaItem}>
                  <Clock className={styles.metaIcon} />
                  <span>
                    {lead.sla.isOverdue
                      ? 'Quá hạn'
                      : `Còn ${lead.sla.remainingHours}h`}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <AlertCircle className={styles.metaIcon} />
                  <span>
                    {lead.urgency === 'critical'
                      ? 'Khẩn cấp'
                      : lead.urgency === 'high'
                        ? 'Cao'
                        : lead.urgency === 'medium'
                          ? 'Trung bình'
                          : 'Thấp'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Filter */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Users size={16} />
                Lọc theo đội
              </label>
              <select
                className={styles.select}
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
              >
                <option value="all">Tất cả đội</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Inspector Selection */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Chọn người xử lý <span className={styles.required}>*</span>
            </h3>
            <div className={styles.inspectorList}>
              {filteredInspectors.length === 0 ? (
                <div className={styles.emptyState}>
                  <User className={styles.emptyIcon} />
                  <p className={styles.emptyText}>Không có thanh tra viên nào</p>
                </div>
              ) : (
                filteredInspectors.map((inspector) => {
                  const loadPercentage = (inspector.currentLoad / inspector.maxCapacity) * 100 || 0;
                  const isSelected = selectedInspectorId === inspector.id;

                  return (
                    <div
                      key={inspector.id}
                      className={`${styles.inspectorCard} ${isSelected ? styles.selected : ''}`}
                      onClick={() => setSelectedInspectorId(inspector.id)}
                    >
                      <input
                        type="radio"
                        className={styles.inspectorRadio}
                        checked={isSelected}
                        onChange={() => setSelectedInspectorId(inspector.id)}
                      />
                      <div className={styles.inspectorInfo}>
                        <div className={styles.inspectorHeader}>
                          <p className={styles.inspectorName}>{inspector.name}</p>
                          <span
                            className={`${styles.inspectorBadge} ${styles[inspector.availability]}`}
                          >
                            {inspector.availability === 'available' && (
                              <>
                                <CheckCircle size={12} />
                                Sẵn sàng
                              </>
                            )}
                            {inspector.availability === 'busy' && 'Bận'}
                            {inspector.availability === 'offline' && 'Offline'}
                          </span>
                        </div>
                        <p className={styles.inspectorRole}>
                          {inspector.role} • {inspector.team}
                        </p>
                        <div className={styles.inspectorStats}>
                          <div className={styles.statItem}>
                            <p className={styles.statValue}>{inspector.activeLeads}</p>
                            <p className={styles.statLabel}>Đang xử lý</p>
                          </div>
                          <div className={styles.statItem}>
                            <p className={styles.statValue}>{inspector.completedToday}</p>
                            <p className={styles.statLabel}>Hoàn thành hôm nay</p>
                          </div>
                          <div className={styles.statItem}>
                            <p className={styles.statValue}>
                              {inspector.currentLoad}/{inspector.maxCapacity}
                            </p>
                            <p className={styles.statLabel}>Khối lượng</p>
                          </div>
                        </div>
                        <div className={styles.loadingBar}>
                          <div className={styles.loadingBarFill}>
                            <div
                              className={`${styles.loadingBarProgress} ${loadPercentage >= 90
                                  ? styles.full
                                  : loadPercentage >= 70
                                    ? styles.high
                                    : ''
                                }`}
                              style={{ width: `${loadPercentage}%` }}
                            />
                          </div>
                          <span className={styles.loadingBarText}>
                            {Math.round(loadPercentage)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Note Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ghi chú (tùy chọn)</label>
              <textarea
                className={styles.textarea}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú về việc giao lead này (nếu có)..."
              />
            </div>
          </div>

          {/* Deadline Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Calendar size={16} />
                Hạn xử lý <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                className={styles.input}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          {/* Description Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <FileText size={16} />
                Mô tả công việc
              </label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả công việc (nếu có)..."
              />
            </div>
          </div>

          {/* KRA Session Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Target size={16} />
                Phiên KRA
              </label>
              <input
                type="text"
                className={styles.input}
                value={kraSession}
                onChange={(e) => setKraSession(e.target.value)}
                placeholder="Nhập tên phiên KRA (nếu có)..."
              />
            </div>
          </div>

          {/* Priority Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Flag size={16} />
                Mức độ ưu tiên
              </label>
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'critical')}
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="critical">Khẩn cấp</option>
              </select>
            </div>
          </div>

          {/* Attachments Section */}
          <div className={styles.section}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <Paperclip size={16} />
                Tệp đính kèm
              </label>
              <input
                type="file"
                className={styles.fileInput}
                multiple
                onChange={handleFileChange}
              />
              {attachments.length > 0 && (
                <div className={styles.attachmentList}>
                  {attachments.map((file, index) => (
                    <div key={index} className={styles.attachmentItem}>
                      <FileText className={styles.attachmentIcon} />
                      <p className={styles.attachmentName}>{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={`${styles.button} ${styles.buttonCancel}`} onClick={handleClose}>
            Hủy
          </button>
          <button
            className={`${styles.button} ${styles.buttonSubmit}`}
            onClick={handleSubmit}
            disabled={!selectedInspectorId || !deadline}
          >
            <Send size={16} />
            Giao việc
          </button>
        </div>
      </div>
    </>
  );
}