import { Clock, AlertTriangle } from 'lucide-react';
import styles from './SLATimer.module.css';

interface SLATimerProps {
  deadline: Date;
  remainingHours: number;
  isOverdue: boolean;
  size?: 'sm' | 'md';
}

export function SLATimer({ deadline, remainingHours, isOverdue, size = 'md' }: SLATimerProps) {
  const getStatus = () => {
    if (isOverdue) return 'overdue';
    if (remainingHours <= 4) return 'critical';
    if (remainingHours <= 24) return 'warning';
    return 'normal';
  };

  const formatRemaining = () => {
    if (isOverdue) {
      const overdueHours = Math.abs(remainingHours);
      if (overdueHours < 24) {
        return `Quá hạn ${overdueHours}h`;
      }
      const days = Math.floor(overdueHours / 24);
      return `Quá hạn ${days} ngày`;
    }

    if (remainingHours < 24) {
      return `Còn ${remainingHours}h`;
    }
    
    const days = Math.floor(remainingHours / 24);
    const hours = remainingHours % 24;
    if (hours === 0) {
      return `Còn ${days} ngày`;
    }
    return `Còn ${days}d ${hours}h`;
  };

  const status = getStatus();

  return (
    <div className={`${styles.timer} ${styles[status]} ${styles[size]}`}>
      {status === 'overdue' ? (
        <AlertTriangle className={styles.icon} />
      ) : (
        <Clock className={styles.icon} />
      )}
      <span className={styles.text}>{formatRemaining()}</span>
    </div>
  );
}
