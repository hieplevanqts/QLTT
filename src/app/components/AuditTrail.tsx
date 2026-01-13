import React from 'react';
import { 
  Clock, 
  User, 
  FileText, 
  UserPlus, 
  AlertTriangle, 
  CheckCircle2,
  Eye,
  RotateCcw,
  MapPin,
} from 'lucide-react';
import styles from './AuditTrail.module.css';

interface AuditEntry {
  id: string;
  action: 'created' | 'triaged' | 'assigned' | 'escalated' | 'closed' | 'reopened' | 'updated' | 'commented';
  userId: string;
  userName: string;
  timestamp: string;
  details?: any;
  location?: string;
}

interface AuditTrailProps {
  entries: AuditEntry[];
}

export function AuditTrail({ entries }: AuditTrailProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created': return <FileText size={16} />;
      case 'triaged': return <Eye size={16} />;
      case 'assigned': return <UserPlus size={16} />;
      case 'escalated': return <AlertTriangle size={16} />;
      case 'closed': return <CheckCircle2 size={16} />;
      case 'reopened': return <RotateCcw size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'created': return 'Tạo tín hiệu';
      case 'triaged': return 'Phân loại';
      case 'assigned': return 'Phân công';
      case 'escalated': return 'Báo cáo cấp trên';
      case 'closed': return 'Đóng tín hiệu';
      case 'reopened': return 'Mở lại';
      case 'updated': return 'Cập nhật';
      case 'commented': return 'Bình luận';
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'created': return 'var(--primary)';
      case 'triaged': return 'var(--chart-3)';
      case 'assigned': return 'var(--chart-4)';
      case 'escalated': return 'var(--chart-2)';
      case 'closed': return 'var(--chart-4)';
      case 'reopened': return 'var(--chart-1)';
      default: return 'var(--muted-foreground)';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Vừa xong';
    if (hours < 24) return `${hours}h trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Clock size={18} />
        <h3>Nhật ký kiểm toán</h3>
        <span className={styles.count}>{entries.length} bản ghi</span>
      </div>

      <div className={styles.timeline}>
        {entries.map((entry, idx) => (
          <div key={entry.id} className={styles.entry}>
            <div className={styles.marker} style={{ background: getActionColor(entry.action) }}>
              {getActionIcon(entry.action)}
            </div>
            <div className={styles.content}>
              <div className={styles.entryHeader}>
                <span className={styles.action} style={{ color: getActionColor(entry.action) }}>
                  {getActionLabel(entry.action)}
                </span>
                <span className={styles.timestamp}>{formatTimestamp(entry.timestamp)}</span>
              </div>
              
              <div className={styles.entryBody}>
                <div className={styles.user}>
                  <User size={14} />
                  <span>{entry.userName}</span>
                  <span className={styles.userId}>({entry.userId})</span>
                </div>
                
                {entry.details && (
                  <div className={styles.details}>
                    {entry.action === 'triaged' && (
                      <>
                        <p><strong>Tình trạng:</strong> {entry.details.status}</p>
                        <p><strong>Mức độ:</strong> {entry.details.urgency}</p>
                        {entry.details.reason && <p><strong>Lý do:</strong> {entry.details.reason}</p>}
                      </>
                    )}
                    {entry.action === 'assigned' && (
                      <>
                        <p><strong>Giao cho:</strong> {entry.details.assignedTo}</p>
                        <p><strong>Hạn xử lý:</strong> {entry.details.deadline}</p>
                        {entry.details.instructions && <p><strong>Hướng dẫn:</strong> {entry.details.instructions}</p>}
                      </>
                    )}
                    {entry.action === 'escalated' && (
                      <>
                        <p><strong>Báo cáo đến:</strong> {entry.details.escalateTo}</p>
                        <p><strong>Lý do:</strong> {entry.details.reason}</p>
                      </>
                    )}
                    {entry.action === 'closed' && (
                      <>
                        <p><strong>Kết quả:</strong> {
                          entry.details.outcome === 'true' ? 'Dương tính thật' :
                          entry.details.outcome === 'false' ? 'Dương tính giả' :
                          'Theo dõi tiếp'
                        }</p>
                        <p><strong>Lý do:</strong> {entry.details.reason}</p>
                        <p><strong>Tác động rủi ro:</strong> {
                          entry.details.riskImpact === 'increase' ? '↑ Tăng' :
                          entry.details.riskImpact === 'decrease' ? '↓ Giảm' :
                          '→ Giữ nguyên'
                        }</p>
                      </>
                    )}
                  </div>
                )}

                {entry.location && (
                  <div className={styles.location}>
                    <MapPin size={12} />
                    <span>{entry.location}</span>
                  </div>
                )}
              </div>
            </div>
            {idx < entries.length - 1 && <div className={styles.connector} />}
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        🔒 Audit trail không thể chỉnh sửa hoặc xóa
      </div>
    </div>
  );
}