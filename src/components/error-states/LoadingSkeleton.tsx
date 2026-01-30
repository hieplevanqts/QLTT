import styles from './ErrorStates.module.css';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'list' | 'detail';
  rows?: number;
}

export function LoadingSkeleton({ type = 'table', rows = 5 }: LoadingSkeletonProps) {
  if (type === 'table') {
    return (
      <div className={styles.skeletonTable}>
        <div className={styles.skeletonTableHeader}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCell}></div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.skeletonTableRow}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className={styles.skeletonCell}></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonCardHeader}>
              <div className={styles.skeletonAvatar}></div>
              <div className={styles.skeletonText} style={{ width: '60%' }}></div>
            </div>
            <div className={styles.skeletonText} style={{ width: '100%' }}></div>
            <div className={styles.skeletonText} style={{ width: '80%' }}></div>
            <div className={styles.skeletonCardFooter}>
              <div className={styles.skeletonBadge}></div>
              <div className={styles.skeletonBadge}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className={styles.skeletonList}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={styles.skeletonListItem}>
            <div className={styles.skeletonAvatar}></div>
            <div className={styles.skeletonListContent}>
              <div className={styles.skeletonText} style={{ width: '70%' }}></div>
              <div className={styles.skeletonText} style={{ width: '50%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className={styles.skeletonDetail}>
        <div className={styles.skeletonDetailHeader}>
          <div className={styles.skeletonText} style={{ width: '40%', height: '32px' }}></div>
          <div className={styles.skeletonText} style={{ width: '60%' }}></div>
        </div>
        <div className={styles.skeletonDetailBody}>
          <div className={styles.skeletonText} style={{ width: '100%' }}></div>
          <div className={styles.skeletonText} style={{ width: '90%' }}></div>
          <div className={styles.skeletonText} style={{ width: '95%' }}></div>
          <div className={styles.skeletonText} style={{ width: '85%' }}></div>
        </div>
      </div>
    );
  }

  return null;
}
