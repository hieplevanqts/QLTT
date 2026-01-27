/**
 * ExportCsvButton - Nút xuất CSV
 */

import React from 'react';
import { Download } from 'lucide-react';
import styles from './ExportCsvButton.module.css';

interface ExportCsvButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export const ExportCsvButton: React.FC<ExportCsvButtonProps> = ({ 
  onClick, 
  disabled = false,
  label = "Xuất CSV"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.exportButton}
    >
      <Download size={18} />
      {label}
    </button>
  );
};
