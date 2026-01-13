import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Flag, Calendar, User } from 'lucide-react';
import {
  RiskAssessment as RiskAssessmentType,
  getRiskLevelInfo,
  getMonitoringStatusInfo,
} from '../data/mockRiskAssessment';
import styles from './RiskAssessment.module.css';

interface RiskAssessmentProps {
  assessment?: RiskAssessmentType;
  loading?: boolean;
  hasPermission?: boolean; // Permission to view internal notes
}

export function RiskAssessment({
  assessment,
  loading = false,
  hasPermission = true,
}: RiskAssessmentProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className={styles.container}>
        {/* Overview Skeleton */}
        <div className={styles.card}>
          <div className={styles.overviewGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.overviewItem}>
                <div className={styles.skeletonLabel} />
                <div className={styles.skeletonValue} />
              </div>
            ))}
          </div>
        </div>

        {/* Factors Skeleton */}
        <div className={styles.card}>
          <div className={styles.skeletonTitle} />
          {[1, 2].map((i) => (
            <div key={i} className={styles.skeletonFactorCard} />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!assessment) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <AlertTriangle size={48} />
        </div>
        <div className={styles.emptyTitle}>Chưa có dữ liệu đánh giá rủi ro</div>
        <div className={styles.emptyText}>
          Thông tin đánh giá rủi ro của cơ sở sẽ được hiển thị tại đây khi có dữ liệu.
        </div>
      </div>
    );
  }

  const riskLevelInfo = getRiskLevelInfo(assessment.riskLevel);

  return (
    <div className={styles.container}>
      {/* 1. Khối Đánh giá rủi ro */}
      <div className={styles.card}>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Mức độ rủi ro</div>
            <div className={styles.overviewValue}>
              <span
                className={styles.riskBadge}
                style={{
                  backgroundColor: riskLevelInfo.bgColor,
                  color: riskLevelInfo.color,
                }}
              >
                {riskLevelInfo.label}
              </span>
            </div>
          </div>

          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Điểm rủi ro</div>
            <div className={styles.overviewValue}>
              <span className={styles.scoreText}>{assessment?.riskScore ?? 50}/100</span>
            </div>
          </div>

          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Ngày đánh giá</div>
            <div className={styles.overviewValue}>
              <Calendar size={14} className={styles.overviewIcon} />
              {assessment?.displayAssessmentDate ?? 'Chưa có'}
            </div>
          </div>

          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Người đánh giá</div>
            <div className={styles.overviewValue}>
              <User size={14} className={styles.overviewIcon} />
              {assessment?.assessedBy ?? 'Chưa có'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Khối Các yếu tố đánh giá */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Các yếu tố đánh giá</h3>
        <div className={styles.factorsGrid}>
          {assessment.factors.map((factor) => (
            <div key={factor.id} className={styles.factorCard}>
              <div className={styles.factorHeader}>
                <div className={styles.factorName}>{factor.name}</div>
                <div className={styles.factorScore}>
                  {factor.score}/100
                </div>
              </div>
              <div className={styles.factorDescription}>{factor.description}</div>
              <div className={styles.factorFooter}>
                <div className={styles.factorWeight}>Trọng số: {factor.weight}%</div>
                <div className={styles.factorContribution}>
                  Đóng góp: {Math.round((factor.score * factor.weight) / 100)} điểm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Khối Khuyến nghị */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Khuyến nghị</h3>
        <div className={styles.recommendationsBox}>
          <div className={styles.recommendationsIcon}>
            <Info size={20} />
          </div>
          <div className={styles.recommendationsList}>
            {assessment.recommendations.map((recommendation, index) => (
              <div key={index} className={styles.recommendationItem}>
                <CheckCircle2 size={16} className={styles.recommendationIcon} />
                <span>{recommendation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Khối Ghi chú nội bộ (chỉ hiển thị nếu có quyền) */}
      {hasPermission && assessment.internalNotes && (
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Ghi chú nội bộ (Chi QLTT)</h3>
          <div className={styles.internalNotesBox}>
            <div className={styles.internalNotesIcon}>
              <Flag size={18} />
            </div>
            <div className={styles.internalNotesText}>{assessment.internalNotes}</div>
          </div>
        </div>
      )}

      {/* 5. Khối Lịch sử theo dõi */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Lịch sử theo dõi</h3>
        {assessment.monitoringHistory.length === 0 ? (
          <div className={styles.emptyMonitoring}>
            <Flag size={32} className={styles.emptyMonitoringIcon} />
            <p className={styles.emptyMonitoringText}>Chưa có lịch sử theo dõi</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.th}>Ngày gắn cờ</th>
                  <th className={styles.th}>Người gắn</th>
                  <th className={styles.th}>Lý do theo dõi</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.th}>Ngày bỏ cờ</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {assessment.monitoringHistory.map((record) => {
                  const statusInfo = getMonitoringStatusInfo(record.status);
                  return (
                    <tr key={record.id} className={styles.tr}>
                      <td className={styles.td}>{record.displayFlaggedDate}</td>
                      <td className={styles.td}>{record.flaggedBy}</td>
                      <td className={styles.td}>{record.reason}</td>
                      <td className={styles.td}>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className={styles.td}>
                        {record.displayRemovedDate || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}