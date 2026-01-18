import React from 'react';
import { Eye } from 'lucide-react';
import {
  ComplaintRecord,
  getComplaintSeverityInfo,
  getComplaintStatusInfo,
  getComplaintSourceLabel,
} from '../data/mockComplaints';
import styles from './ComplaintsTable.module.css';

interface ComplaintsTableProps {
  complaints: ComplaintRecord[];
  loading?: boolean;
  onViewDetail?: (complaintId: string) => void;
}

export function ComplaintsTable({
  complaints,
  loading = false,
  onViewDetail,
}: ComplaintsTableProps) {
  // Loading state with skeleton
  if (loading) {
    return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.th}>Số phản ánh</th>
              <th className={styles.th}>Loại phản ánh</th>
              <th className={styles.th}>Ngày nhận</th>
              <th className={styles.th}>Nguồn</th>
              <th className={styles.th}>Mức độ</th>
              <th className={styles.th}>Đơn vị xử lý</th>
              <th className={styles.th}>Trạng thái</th>
              <th className={styles.thAction}>Thao tác</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {[1, 2, 3].map((i) => (
              <tr key={i} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '100px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonDesc} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '80px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '70px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonBadge} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonText} style={{ width: '120px' }} />
                </td>
                <td className={styles.td}>
                  <div className={styles.skeletonBadge} />
                </td>
                <td className={styles.tdAction}>
                  <div className={styles.skeletonIcon} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Empty state
  if (complaints.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <line x1="9" y1="10" x2="15" y2="10" />
            <line x1="12" y1="7" x2="12" y2="13" />
          </svg>
        </div>
        <div className={styles.emptyTitle}>Chưa có phản ánh</div>
        <div className={styles.emptyText}>
          Phản ánh và kiến nghị từ khách hàng sẽ được hiển thị tại đây.
        </div>
      </div>
    );
  }

  const handleViewClick = (complaintId: string) => {
    if (onViewDetail) {
      onViewDetail(complaintId);
    } else {
      // Placeholder: Navigate to detail page
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.tableHeader}>
          <tr>
            <th className={styles.th}>Số phản ánh</th>
            <th className={styles.th}>Loại phản ánh</th>
            <th className={styles.th}>Ngày nhận</th>
            <th className={styles.th}>Nguồn</th>
            <th className={styles.th}>Mức độ</th>
            <th className={styles.th}>Đơn vị xử lý</th>
            <th className={styles.th}>Trạng thái</th>
            <th className={styles.thAction}>Thao tác</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {complaints.map((complaint) => {
            const severityInfo = getComplaintSeverityInfo(complaint.severity);
            const statusInfo = getComplaintStatusInfo(complaint.status);

            return (
              <tr key={complaint.id} className={styles.tr}>
                {/* Số phản ánh - Clickable */}
                <td className={styles.td}>
                  <button
                    className={styles.complaintNumber}
                    onClick={() => handleViewClick(complaint.id)}
                    aria-label={`Xem chi tiết phản ánh ${complaint.complaintNumber}`}
                  >
                    {complaint.complaintNumber}
                  </button>
                </td>

                {/* Loại phản ánh - Title + Description */}
                <td className={styles.td}>
                  <div className={styles.complaintType}>
                    <div className={styles.complaintTitle}>{complaint.title}</div>
                    <div className={styles.complaintDesc}>{complaint.description}</div>
                  </div>
                </td>

                {/* Ngày nhận */}
                <td className={styles.td}>
                  <span className={styles.dateText}>{complaint.displayDate}</span>
                </td>

                {/* Nguồn */}
                <td className={styles.td}>
                  <span className={styles.sourceText}>
                    {getComplaintSourceLabel(complaint.source)}
                  </span>
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

                {/* Đơn vị xử lý */}
                <td className={styles.td}>
                  <span className={styles.unitText}>{complaint.assignedUnit}</span>
                </td>

                {/* Trạng thái - Badge */}
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

                {/* Thao tác - Icon */}
                <td className={styles.tdAction}>
                  <button
                    className={styles.actionButton}
                    onClick={() => handleViewClick(complaint.id)}
                    aria-label={`Xem chi tiết phản ánh ${complaint.complaintNumber}`}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
