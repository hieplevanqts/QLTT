import React from 'react';
import { X } from 'lucide-react';
import styles from './MapLegend.module.css';

interface MapLegendProps {
  categoryData: Array<{
    key: string;
    label: string;
    color: string;
    count: number;
  }>;
  onClose: () => void;
}

export const MapLegend = React.forwardRef<HTMLDivElement, MapLegendProps>(
  ({ categoryData, onClose }, ref) => {
    return (
      <div className={styles.legend} ref={ref}>
        <div className={styles.legendItems}>
          {categoryData.map(({ key, label, color, count }) => (
            <div key={key} className={styles.legendItem}>
              <div 
                className={styles.marker} 
                style={{ background: color }}
              />
              <span className={styles.label}>{label}</span>
              <span className={styles.count}>({count})</span>
            </div>
          ))}
        </div>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Đóng chú giải"
          title="Đóng chú giải"
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>
    );
  }
);

MapLegend.displayName = 'MapLegend';