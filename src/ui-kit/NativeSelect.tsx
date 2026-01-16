import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './NativeSelect.module.css';

interface NativeSelectOption {
  value: string;
  label: string;
  element?: React.ReactNode; // For custom rendering like risk levels
}

interface NativeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: NativeSelectOption[];
  placeholder?: string;
  className?: string;
}

/**
 * NativeSelect - Native HTML select with custom styling
 * 
 * Sử dụng native <select> để tránh conflict với popup
 * Styled theo design system với Inter font và design tokens
 */
export function NativeSelect({
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  className = '',
}: NativeSelectProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.select}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className={styles.icon} size={16} />
    </div>
  );
}

export default NativeSelect;
