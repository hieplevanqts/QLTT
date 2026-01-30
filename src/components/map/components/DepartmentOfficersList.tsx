import React from 'react';
import { Users } from 'lucide-react';
import { DepartmentOfficerItem } from './DepartmentOfficerItem';
import styles from '../DepartmentDetailModal.module.css';

interface DisplayOfficer {
  name: string;
  isReal: boolean;
  details?: any;
  email?: string;
  phone?: string;
}

interface DepartmentOfficersListProps {
  displayOfficers: DisplayOfficer[];
  isLoadingUsers: boolean;
}

export function DepartmentOfficersList({ displayOfficers, isLoadingUsers }: DepartmentOfficersListProps) {
  // Don't render if no officers and not loading
  if (displayOfficers.length === 0 && !isLoadingUsers) {
    return null;
  }

  return (
    <div className={styles.officersSection}>
      <h3 className={styles.sectionTitle}>
        <Users size={16} color="var(--color-primary)" />
        Danh sách cán bộ ({isLoadingUsers ? '...' : displayOfficers.length} người)
      </h3>
      
      {isLoadingUsers ? (
        <div className={styles.loadingState}>
          Đang tải danh sách cán bộ...
        </div>
      ) : (
        <div className={styles.officersList}>
          {displayOfficers.map((officer, index) => (
            <DepartmentOfficerItem
              key={officer.details?._id || index}
              name={officer.name}
              details={officer.details}
              email={officer.email}
              phone={officer.phone}
            />
          ))}
        </div>
      )}
    </div>
  );
}

