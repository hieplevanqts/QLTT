import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import styles from './SingleSelectDropdown.module.css';

export interface SingleSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface SingleSelectDropdownProps {
  label: string;
  options: SingleSelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SingleSelectDropdown({
  label,
  options,
  selectedValue,
  onChange,
  placeholder = 'Chọn...',
}: SingleSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.triggerContent}>
          <span className={styles.label}>{label}:</span>
          {selectedOption ? (
            <span className={styles.selectedText}>{selectedOption.label}</span>
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </div>
        <div className={styles.triggerActions}>
          <ChevronDown
            size={16}
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          {/* Search Box - Only show if many options */}
          {options.length > 6 && (
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {/* Options List */}
          <div className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={styles.emptyState}>Không tìm thấy kết quả</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <div
                    key={option.value}
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <div className={styles.checkbox}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
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
            )}
          </div>

          {/* Footer */}
          {selectedValue && (
            <div className={styles.dropdownFooter}>
              <button
                type="button"
                className={styles.footerClearButton}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                Xóa lựa chọn
              </button>
              <span className={styles.footerCount}>
                {filteredOptions.length} tùy chọn
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
