import React from 'react';
import { Check, Plus, Minus } from 'lucide-react';
import styles from './MapFilterPanel.module.css';

type CategoryFilter = { [key: string]: boolean };

interface CategoryFilterSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  filters: CategoryFilter;
  categoryData: Array<{
    key: keyof CategoryFilter;
    label: string;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    color: string;
  }>;
  onFilterChange: (key: keyof CategoryFilter) => void;
}

export const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({
  isExpanded,
  onToggle,
  filters,
  categoryData,
  onFilterChange,
}) => {
  return (
    <div className={styles.filterSection}>
      <button className={styles.sectionHeader} onClick={onToggle}>
        <div className={styles.sectionTitle}>Phân loại</div>
        {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
      </button>
      <div className={`${styles.filterList} ${isExpanded ? styles.filterListExpanded : styles.filterListCollapsed}`}>
        {categoryData.map(({ key, label, icon: Icon, color }) => (
          <label key={key as string} className={styles.filterItem}>
            <div className={styles.checkboxWrapper}>
              <input 
                type="checkbox" 
                checked={filters[key]} 
                onChange={() => onFilterChange(key)} 
                className={styles.checkbox} 
              />
              <div className={styles.customCheckbox} style={{ borderColor: filters[key] ? color : undefined }}>
                {filters[key] && (
                  <div className={styles.checkmark} style={{ background: color }}>
                    <Check size={10} color="white" />
                  </div>
                )}
              </div>
            </div>
            <Icon size={16} style={{ color }} />
            <span className={styles.filterLabel}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

