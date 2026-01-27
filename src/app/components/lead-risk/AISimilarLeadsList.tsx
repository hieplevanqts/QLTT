import { useState } from 'react';
import {
  Eye,
  Link2,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import styles from './AISimilarLeadsList.module.css';

interface SimilarLead {
  id: string;
  code: string;
  title: string;
  similarity: number;
  reasons: string[];
  status: 'new' | 'in-progress' | 'completed' | 'rejected';
  createdAt: string;
  reporter: string;
}

interface AISimilarLeadsListProps {
  leads: SimilarLead[];
  onViewDetail: (id: string) => void;
  onCompare: (id: string) => void;
  onMerge: (id: string) => void;
  onLink: (id: string) => void;
  onMarkNotDuplicate: (id: string) => void;
}

export function AISimilarLeadsList({
  leads,
  onViewDetail,
  onCompare,
  onMerge,
  onLink,
  onMarkNotDuplicate,
}: AISimilarLeadsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusConfig = (status: string) => {
    const configs = {
      new: {
        icon: Clock,
        text: 'Mới',
        color: 'rgb(59, 130, 246)',
        bgColor: 'rgba(59, 130, 246, 0.1)',
      },
      'in-progress': {
        icon: Clock,
        text: 'Đang xử lý',
        color: 'rgb(245, 158, 11)',
        bgColor: 'rgba(245, 158, 11, 0.1)',
      },
      completed: {
        icon: CheckCircle2,
        text: 'Hoàn thành',
        color: 'rgb(34, 197, 94)',
        bgColor: 'rgba(34, 197, 94, 0.1)',
      },
      rejected: {
        icon: XCircle,
        text: 'Đã từ chối',
        color: 'rgb(107, 114, 128)',
        bgColor: 'rgba(107, 114, 128, 0.1)',
      },
    };
    return configs[status as keyof typeof configs] || configs.new;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return { color: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' };
    if (similarity >= 70) return { color: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' };
    return { color: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h3 className={styles.title}>🔍 Nguồn tin tương tự ({leads.length})</h3>
          <p className={styles.subtitle}>AI tự động phát hiện dựa trên nội dung, hình ảnh, địa điểm</p>
        </div>
      </div>

      <div className={styles.leadsList}>
        {leads.map((lead) => {
          const statusConfig = getStatusConfig(lead.status);
          const similarityColor = getSimilarityColor(lead.similarity);
          const StatusIcon = statusConfig.icon;
          const isExpanded = expandedId === lead.id;

          return (
            <div key={lead.id} className={styles.leadCard}>
              {/* Header */}
              <div className={styles.leadHeader}>
                <div className={styles.leadInfo}>
                  <div className={styles.leadCodeRow}>
                    <span className={styles.leadCode}>{lead.code}</span>
                    <div
                      className={styles.statusBadge}
                      style={{
                        color: statusConfig.color,
                        backgroundColor: statusConfig.bgColor,
                      }}
                    >
                      <StatusIcon size={14} />
                      <span>{statusConfig.text}</span>
                    </div>
                  </div>
                  <h4 className={styles.leadTitle}>{lead.title}</h4>
                  <div className={styles.leadMeta}>
                    <span>👤 {lead.reporter}</span>
                    <span>📅 {lead.createdAt}</span>
                  </div>
                </div>

                <div
                  className={styles.similarityBadge}
                  style={{
                    color: similarityColor.color,
                    backgroundColor: similarityColor.bg,
                  }}
                >
                  <span className={styles.similarityPercent}>{lead.similarity}%</span>
                  <span className={styles.similarityLabel}>Tương đồng</span>
                </div>
              </div>

              {/* AI Reasons */}
              <div className={styles.aiReasons}>
                <div className={styles.aiReasonsHeader}>
                  <span className={styles.aiIcon}>🤖</span>
                  <strong>Lý do AI cho rằng trùng:</strong>
                </div>
                <ul className={styles.reasonsList}>
                  {lead.reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => onCompare(lead.id)}
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }}
                >
                  <Eye size={16} />
                  So sánh
                </button>

                <button
                  className={styles.actionBtn}
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  style={{
                    backgroundColor: 'var(--secondary)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {isExpanded ? 'Thu gọn' : 'Thao tác'}
                  <ChevronRight
                    size={16}
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>
              </div>

              {/* Expanded Actions */}
              {isExpanded && (
                <div className={styles.expandedActions}>
                  <div className={styles.expandedActionsHeader}>
                    <strong>Hành động xử lý:</strong>
                  </div>
                  <div className={styles.expandedActionsList}>
                    <button
                      className={styles.expandedActionBtn}
                      onClick={() => onMerge(lead.id)}
                    >
                      <Link2 size={16} />
                      <div>
                        <strong>Gộp nguồn tin</strong>
                        <p>Gộp nguồn tin này vào nguồn tin hiện tại</p>
                      </div>
                    </button>

                    <button
                      className={styles.expandedActionBtn}
                      onClick={() => onLink(lead.id)}
                    >
                      <Link2 size={16} />
                      <div>
                        <strong>Liên kết tham chiếu</strong>
                        <p>Giữ riêng nhưng liên kết để theo dõi</p>
                      </div>
                    </button>

                    <button
                      className={styles.expandedActionBtn}
                      onClick={() => onMarkNotDuplicate(lead.id)}
                    >
                      <Trash2 size={16} />
                      <div>
                        <strong>Đánh dấu không trùng</strong>
                        <p>AI sẽ không gợi ý nguồn tin này nữa</p>
                      </div>
                    </button>

                    <button
                      className={styles.expandedActionBtn}
                      onClick={() => onViewDetail(lead.id)}
                    >
                      <Eye size={16} />
                      <div>
                        <strong>Xem chi tiết</strong>
                        <p>Mở trang chi tiết nguồn tin này</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {leads.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>🎉</p>
          <p className={styles.emptyText}>Không phát hiện nguồn tin trùng lặp</p>
        </div>
      )}
    </div>
  );
}
