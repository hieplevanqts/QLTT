/**
 * Import Job Timeline Component
 */

import React from 'react';
import type { ImportJobTimelineEntry } from '../types';
import styles from './ImportJobTimeline.module.css';

interface ImportJobTimelineProps {
  events: ImportJobTimelineEntry[];
}

const statusLabels: Record<ImportJobTimelineEntry["status"], string> = {
  pending: 'Đang chờ',
  validating: 'Đang kiểm tra',
  importing: 'Đang cài',
  completed: 'Hoàn tất',
  failed: 'Thất bại',
  rolled_back: 'Đã rollback',
};

export function ImportJobTimeline({ events }: ImportJobTimelineProps) {
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.timeline}>
      {events.map((event, index) => (
        <div key={index} className={styles.timelineItem}>
          <div className={`${styles.timelineDot} ${styles[event.status]}`} />
          <div className={styles.timelineContent}>
            <div className={`${styles.timelineStatus} ${styles[event.status]}`}>
              {statusLabels[event.status]}
            </div>
            <div className={styles.timelineMessage}>{event.message}</div>
            <div className={styles.timelineTimestamp}>
              {formatTimestamp(event.timestamp)}
            </div>
            {event.details && (
              <div className={styles.timelineDetails}>{event.details}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
