import { Clock, AlertTriangle } from 'lucide-react';
import styles from './SLATimer.module.css';

interface SLATimerProps {
  deadline: Date;
  remainingHours: number;
  isOverdue: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SLATimer({ deadline, remainingHours, isOverdue, size = 'md' }: SLATimerProps) {
  // Safeguard: Ensure remainingHours is a valid number
  const safeRemainingHours = typeof remainingHours === 'number' && !isNaN(remainingHours) ? remainingHours : 24;

  const getStatus = () => {
    if (isOverdue) return 'overdue';
    if (safeRemainingHours <= 4) return 'critical';
    if (safeRemainingHours <= 24) return 'warning';
    return 'normal';
  };

  const formatRemaining = () => {
    if (isOverdue) {
      const overdueHours = Math.abs(safeRemainingHours);
      if (overdueHours < 24) {
        return `Quá hạn ${Math.floor(overdueHours)}h`;
      }
      const days = Math.floor(overdueHours / 24);
      return `Quá hạn ${days} ngày`;
    }

    if (safeRemainingHours < 24) {
      return `Còn ${Math.floor(safeRemainingHours)}h`;
    }

    const days = Math.floor(safeRemainingHours / 24);
    const hours = Math.floor(safeRemainingHours % 24);
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
