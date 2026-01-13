import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, User, Building2, FileText } from 'lucide-react';
import { InspectionRecord, getInspectionStatusInfo } from '../data/mockInspections';
import styles from './InspectionTimeline.module.css';

interface InspectionTimelineProps {
  inspections: InspectionRecord[];
  loading?: boolean;
}

export function InspectionTimeline({ inspections, loading = false }: InspectionTimelineProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className={styles.timeline}>
        <div className={styles.timelineList}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineConnector}>
                <div className={`${styles.timelineIconWrapper} ${styles.skeleton}`}>
                  <div className={styles.skeletonCircle} />
                </div>
                {i < 3 && <div className={styles.timelineLine} />}
              </div>
              <div className={styles.timelineContent}>
                <div className={`${styles.inspectionCard} ${styles.skeleton}`}>
                  <div className={styles.skeletonHeader}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonBadge} />
                  </div>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (inspections.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <FileText size={48} />
        </div>
        <div className={styles.emptyTitle}>Chưa có lịch sử kiểm tra</div>
        <div className={styles.emptyText}>
          Lịch sử kiểm tra của cơ sở sẽ được hiển thị tại đây khi có dữ liệu.
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: InspectionRecord['status']) => {
    const statusInfo = getInspectionStatusInfo(status);
    
    switch (status) {
      case 'passed':
        return <CheckCircle2 size={20} style={{ color: statusInfo.iconColor }} />;
      case 'conditional':
        return <AlertCircle size={20} style={{ color: statusInfo.iconColor }} />;
      case 'failed':
        return <XCircle size={20} style={{ color: statusInfo.iconColor }} />;
      default:
        return <CheckCircle2 size={20} />;
    }
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.timelineList}>
        {inspections.map((inspection, index) => {
          const statusInfo = getInspectionStatusInfo(inspection.status);
          const isLast = index === inspections.length - 1;
          const isFirst = index === 0;

          return (
            <div 
              key={inspection.id} 
              className={`${styles.timelineItem} ${isFirst ? styles.timelineItemFirst : ''}`}
            >
              {/* Timeline connector (icon + line) */}
              <div className={styles.timelineConnector}>
                <div 
                  className={styles.timelineIconWrapper}
                  style={{ borderColor: statusInfo.iconColor }}
                >
                  {getStatusIcon(inspection.status)}
                </div>
                {!isLast && <div className={styles.timelineLine} />}
              </div>

              {/* Content card */}
              <div className={styles.timelineContent}>
                <div className={styles.inspectionCard}>
                  {/* Header: Type + Status Badge */}
                  <div className={styles.inspectionHeader}>
                    <div className={styles.inspectionMain}>
                      <h4 className={styles.inspectionType}>{inspection.type}</h4>
                      <div className={styles.inspectionDate}>{inspection.displayDate}</div>
                    </div>
                    <div 
                      className={styles.statusBadge}
                      style={{ 
                        backgroundColor: statusInfo.bgColor,
                        color: statusInfo.color 
                      }}
                    >
                      {statusInfo.label}
                    </div>
                  </div>

                  {/* Details */}
                  <div className={styles.inspectionDetails}>
                    <div className={styles.detailRow}>
                      <Building2 size={14} className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Đơn vị:</span>
                      <span className={styles.detailValue}>{inspection.unit}</span>
                    </div>

                    <div className={styles.detailRow}>
                      <User size={14} className={styles.detailIcon} />
                      <span className={styles.detailLabel}>Thanh tra viên:</span>
                      <span className={styles.detailValue}>{inspection.inspector}</span>
                    </div>

                    {/* Violation count - highlighted if exists */}
                    {inspection.violationCount !== undefined && inspection.violationCount > 0 && (
                      <div className={styles.violationRow}>
                        <div className={styles.violationBadge}>
                          Số vi phạm: <strong>{inspection.violationCount}</strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes - separated section */}
                  <div className={styles.notesSection}>
                    <div className={styles.notesLabel}>Ghi chú kết luận:</div>
                    <div className={styles.notesText}>{inspection.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
