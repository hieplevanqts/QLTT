import { 
  X, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Building2,
  FileText,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { UrgencyBadge } from './UrgencyBadge';
import { SLATimer } from './SLATimer';
import type { Lead } from '../../../data/lead-risk/types';
import styles from './LeadPreviewPanel.module.css';

interface LeadPreviewPanelProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFull: () => void;
}

export function LeadPreviewPanel({ lead, isOpen, onClose, onViewFull }: LeadPreviewPanelProps) {
  if (!isOpen || !lead) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FileText size={20} />
            <h2 className={styles.title}>Chi tiết nguồn tin</h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Code & Title */}
          <div className={styles.section}>
            <div className={styles.leadCode}>{lead.code}</div>
            <h3 className={styles.leadTitle}>{lead.title}</h3>
          </div>

          {/* Status & SLA */}
          <div className={styles.section}>
            <div className={styles.badges}>
              <StatusBadge status={lead.status} />
              <UrgencyBadge urgency={lead.urgency} />
            </div>
            <div className={styles.slaSection}>
              <div className={styles.slaLabel}>Thời hạn SLA:</div>
              <SLATimer
                deadline={lead.sla.deadline}
                remainingHours={lead.sla.remainingHours}
                isOverdue={lead.sla.isOverdue}
                size="md"
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Mô tả</h4>
            <p className={styles.description}>{lead.description}</p>
          </div>

          {/* Reporter Info */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <User size={16} />
              Người báo cáo
            </h4>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Họ tên:</span>
                <span className={styles.value}>{lead.reporterName || 'Ẩn danh'}</span>
              </div>
              {lead.reporterPhone && (
                <div className={styles.infoRow}>
                  <Phone size={14} />
                  <a href={`tel:${lead.reporterPhone}`} className={styles.link}>
                    {lead.reporterPhone}
                  </a>
                </div>
              )}
              {lead.reporterEmail && (
                <div className={styles.infoRow}>
                  <Mail size={14} />
                  <a href={`mailto:${lead.reporterEmail}`} className={styles.link}>
                    {lead.reporterEmail}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <MapPin size={16} />
              Địa điểm
            </h4>
            <div className={styles.infoCard}>
              {lead.storeName && (
                <div className={styles.infoRow}>
                  <Building2 size={14} />
                  <span className={styles.value}>{lead.storeName}</span>
                </div>
              )}
              <div className={styles.infoRow}>
                <span className={styles.label}>Địa chỉ:</span>
                <span className={styles.value}>{lead.location.address}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.label}>Khu vực:</span>
                <span className={styles.value}>
                  {lead.location.ward}, {lead.location.district}, {lead.location.province}
                </span>
              </div>
            </div>
          </div>

          {/* Assignment */}
          {lead.assignedTo && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>
                <User size={16} />
                Phân công
              </h4>
              <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Cán bộ:</span>
                  <span className={styles.value}>{lead.assignedTo.userName}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Đội:</span>
                  <span className={styles.value}>{lead.assignedTo.teamName}</span>
                </div>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <Calendar size={16} />
              Thông tin hệ thống
            </h4>
            <div className={styles.infoCard}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Tiếp nhận:</span>
                <span className={styles.value}>
                  {new Date(lead.reportedAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              {lead.updatedAt && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>Cập nhật:</span>
                  <span className={styles.value}>
                    {new Date(lead.updatedAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {lead.isWatched && (
                <div className={styles.infoRow}>
                  <Eye size={14} style={{ color: 'var(--primary)' }} />
                  <span className={styles.value} style={{ color: 'var(--primary)' }}>
                    Đang theo dõi
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={onViewFull} className={styles.viewFullBtn}>
            <ExternalLink size={16} />
            Xem toàn bộ chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
