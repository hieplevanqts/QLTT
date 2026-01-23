import React from 'react';
import { Shield } from 'lucide-react';
import styles from '../DepartmentDetailModal.module.css';
import { FakeOfficer } from '../utils/departmentDetailUtils';

interface DepartmentOfficerItemProps {
  name: string;
  details?: FakeOfficer;
}

export function DepartmentOfficerItem({ name, details }: DepartmentOfficerItemProps) {
  return (
    <div className={styles.officerItem}>
      <div className={styles.officerInfo}>
        <Shield size={14} color="var(--color-primary)" />
        <div className={styles.officerDetails}>
          <div className={styles.officerName}>
            {name}
          </div>
          {details && (
            <div className={styles.officerMeta}>
              <span>{details.position}</span>
              <span>•</span>
              <span>{details.phone}</span>
              <span>•</span>
              <span>{details.yearsOfService} năm kinh nghiệm</span>
            </div>
          )}
        </div>
      </div>
      {details && (
        <div className={styles.officerStats}>
          <div className={styles.officerStatItem}>
            <div className={`${styles.officerStatValue} ${styles.officerStatValuePrimary}`}>
              {details.criteria.totalInspections}
            </div>
            <div>Kiểm tra</div>
          </div>
          <div className={styles.officerStatItem}>
            <div className={`${styles.officerStatValue} ${styles.officerStatValueDanger}`}>
              {details.criteria.violationsCaught}
            </div>
            <div>Vi phạm</div>
          </div>
        </div>
      )}
    </div>
  );
}
