import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { TrendingDownIcon } from './icons/TrendingDownIcon';
import { Minus } from 'lucide-react';
import styles from './TrendIndicator.module.css';

type TrendDirection = 'up' | 'down' | 'stable';

interface TrendIndicatorProps {
  direction: TrendDirection;
  value?: string | number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showValue?: boolean;
}

export function TrendIndicator({ 
  direction, 
  value,
  label,
  size = 'md',
  showIcon = true,
  showValue = true
}: TrendIndicatorProps) {
  const sizeMap = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const iconSize = sizeMap[size];

  return (
    <div className={`${styles.container} ${styles[size]} ${styles[direction]}`}>
      {showIcon && (
        <span className={styles.icon}>
          {direction === 'up' && <TrendingUpIcon size={iconSize} />}
          {direction === 'down' && <TrendingDownIcon size={iconSize} />}
          {direction === 'stable' && <Minus size={iconSize} />}
        </span>
      )}
      
      {showValue && value !== undefined && (
        <span className={styles.value}>
          {typeof value === 'number' && direction !== 'stable' ? (
            direction === 'up' ? `+${value}%` : `${value}%`
          ) : (
            value
          )}
        </span>
      )}
      
      {label && (
        <span className={styles.label}>{label}</span>
      )}
    </div>
  );
}
