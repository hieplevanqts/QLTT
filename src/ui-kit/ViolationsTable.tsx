import React, { useState } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import {
  ViolationRecord,
  getViolationSeverityInfo,
  getViolationStatusInfo,
  formatCurrency,
} from '../data/mockViolations';
import styles from './ViolationsTable.module.css';

interface ViolationsTableProps {
  violations: ViolationRecord[];
  loading?: boolean;
  onCaseClick?: (caseNumber: string) => void;
}

export function ViolationsTable({ violations, loading = false, onCaseClick }: ViolationsTableProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.th}>Số vụ việc</th>
              <th className={styles.th}>Loại vi phạm</th>
              <th className={styles.th}>Ngày phát hiện</th>
              <th className={styles.th}>Đơn vị phát hiện</th>
              <th className={styles.th}>Mức độ</th>
              <th className={styles.th}>Trạng thái xử lý</th>
              <th className={styles.th}>Xử phạt</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className={styles.skeletonRow}>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '100px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '180px' }} />
                  <div className={styles.skeletonText} style={{ width: '220px', marginTop: '4px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '80px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '120px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonBadge} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonBadge} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '100px' }} />
                  <div className={styles.skeletonText} style={{ width: '90px', marginTop: '4px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (violations.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <AlertTriangle size={48} />
        </div>
        <div className={styles.emptyTitle}>Chưa có vụ việc vi phạm</div>
        <div className={styles.emptyText}>
          Cơ sở chưa có hồ sơ vi phạm nào được ghi nhận.
        </div>
      </div>
    );
  }

  const handleCaseClick = (caseNumber: string) => {
    if (onCaseClick) {
      onCaseClick(caseNumber);
    } else {
      // Default behavior: log to console or show placeholder
    }
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.th}>Số vụ việc</th>
            <th className={styles.th}>Loại vi phạm</th>
            <th className={styles.th}>Ngày phát hiện</th>
            <th className={styles.th}>Đơn vị phát hiện</th>
            <th className={styles.th}>Mức độ</th>
            <th className={styles.th}>Trạng thái xử lý</th>
            <th className={styles.th}>Xử phạt</th>
          </tr>
        </thead>
        <tbody>
          {violations.map((violation) => {
            const severityInfo = getViolationSeverityInfo(violation.severity);
            const statusInfo = getViolationStatusInfo(violation.status);

            return (
              <tr key={violation.id} className={styles.tr}>
                {/* Số vụ việc - Clickable */}
                <td className={styles.td}>
                  <button
                    className={styles.caseNumberLink}
                    onClick={() => handleCaseClick(violation.caseNumber)}
                    aria-label={`Xem chi tiết vụ việc ${violation.caseNumber}`}
                  >
                    {violation.caseNumber}
                    <ExternalLink size={12} className={styles.linkIcon} />
                  </button>
                </td>

                {/* Loại vi phạm - Title + Description */}
                <td className={styles.td}>
                  <div className={styles.violationType}>
                    <div className={styles.violationTitle}>{violation.title}</div>
                    <div className={styles.violationDescription}>{violation.description}</div>
                  </div>
                </td>

                {/* Ngày phát hiện */}
                <td className={styles.td}>
                  <span className={styles.dateText}>{violation.displayDate}</span>
                </td>

                {/* Đơn vị phát hiện */}
                <td className={styles.td}>
                  <span className={styles.unitText}>{violation.detectedBy}</span>
                </td>

                {/* Mức độ - Badge */}
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: severityInfo.bgColor,
                      color: severityInfo.color,
                    }}
                  >
                    {severityInfo.label}
                  </span>
                </td>

                {/* Trạng thái xử lý - Badge */}
                <td className={styles.td}>
                  <span
                    className={styles.badge}
                    style={{
                      backgroundColor: statusInfo.bgColor,
                      color: statusInfo.color,
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </td>

                {/* Xử phạt - Amount + Decision */}
                <td className={styles.td}>
                  {violation.fineAmount ? (
                    <div className={styles.fineInfo}>
                      <div className={styles.fineAmount}>
                        {formatCurrency(violation.fineAmount)}
                      </div>
                      {violation.decisionNumber && (
                        <div className={styles.fineDecision}>{violation.decisionNumber}</div>
                      )}
                    </div>
                  ) : (
                    <span className={styles.noFine}>Chưa xử phạt</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
