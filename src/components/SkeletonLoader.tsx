import React from 'react';
import styles from './SkeletonLoader.module.css';

export function SkeletonCardGroup() {
    return (
        <div className={styles.cardGroup}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`${styles.card} ${styles.skeleton}`} />
            ))}
        </div>
    );
}

export function SkeletonFilterBar() {
    return (
        <div className={styles.filterBar}>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`${styles.filterItem} ${styles.skeleton}`} />
            ))}
        </div>
    );
}

export function SkeletonTable() {
    return (
        <div className={styles.tableContainer}>
            <div className={`${styles.tableHeader} ${styles.skeleton}`} />
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={styles.tableRow}>
                    <div className={`${styles.tableCell} ${styles.w30} ${styles.skeleton}`} />
                    <div className={`${styles.tableCell} ${styles.w20} ${styles.skeleton}`} />
                    <div className={`${styles.tableCell} ${styles.w30} ${styles.skeleton}`} />
                    <div className={`${styles.tableCell} ${styles.w15} ${styles.skeleton}`} />
                </div>
            ))}
        </div>
    );
}
