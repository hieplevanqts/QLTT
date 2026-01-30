import React from 'react';
import { Shield } from 'lucide-react';
import styles from '../DepartmentDetailModal.module.css';
import { FakeOfficer } from '../utils/departmentDetailUtils';

interface DepartmentOfficerItemProps {
  name: string;
  details?: FakeOfficer | any; // Allow DepartmentUser type
  email?: string;
  phone?: string;
}

export function DepartmentOfficerItem({ name, details, email, phone }: DepartmentOfficerItemProps) {
  // Check if details is a real user (has _id) or fake officer (has position)
  const isRealUser = details && typeof details === 'object' && '_id' in details && !('position' in details);
  const isFakeOfficer = details && typeof details === 'object' && 'position' in details;
  
  return (
    <div className={styles.officerItem}>
      <div className={styles.officerInfo}>
        <Shield size={14} color="var(--color-primary)" />
        <div className={styles.officerDetails}>
          <div className={styles.officerName}>
            {name}
          </div>
          {isRealUser && (
            <div className={styles.officerMeta}>
              {email && <span>{email}</span>}
              {email && phone && <span>•</span>}
              {phone && <span>{phone}</span>}
            </div>
          )}
          {isFakeOfficer && (
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
      {isFakeOfficer && details.criteria && (
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
