import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';
import styles from './MultiSelectDropdown.module.css';

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  showLabel?: boolean;
}

export default function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Chọn...',
  showLabel = true,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedLabels = options
    .filter(opt => selectedValues.includes(opt.value))
    .map(opt => opt.label);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div 
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerContent}>
          {showLabel ? <span className={styles.label}>{label}:</span> : null}
          {selectedValues.length > 0 ? (
            <div className={styles.selectedBadges}>
              {selectedValues.length === 1 ? (
                <span className={styles.selectedText}>{selectedLabels[0]}</span>
              ) : (
                <span className={styles.selectedCount}>
                  {selectedValues.length} đã chọn
                </span>
              )}
            </div>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <div className={styles.triggerActions}>
          {selectedValues.length > 0 && (
            <button
              className={styles.clearButton}
              onClick={clearAll}
              title="Xóa tất cả"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown 
            size={16} 
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Gõ để tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
          </div>

          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <div
                    key={option.value}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className={styles.checkbox}>
                      {isSelected && <Check size={14} />}
                    </div>
                    <span className={styles.optionLabel}>
                      {option.label}
                      {option.count !== undefined && (
                        <span className={styles.optionCount}>({option.count})</span>
                      )}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                Không tìm thấy kết quả
              </div>
            )}
          </div>

          {selectedValues.length > 0 && (
            <div className={styles.dropdownFooter}>
              <button
                className={styles.footerClearButton}
                onClick={clearAll}
              >
                Xóa tất cả
              </button>
              <span className={styles.footerCount}>
                {selectedValues.length} đã chọn
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
