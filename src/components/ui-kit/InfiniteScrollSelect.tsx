import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, Loader2 } from 'lucide-react';
import styles from './InfiniteScrollSelect.module.css';

export interface InfiniteScrollSelectOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface InfiniteScrollSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: InfiniteScrollSelectOption[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
  searchable?: boolean;
  emptyText?: string;
  className?: string;
}

export default function InfiniteScrollSelect({
  value,
  onChange,
  placeholder = 'Chọn...',
  options,
  onLoadMore,
  hasMore = false,
  loading = false,
  searchable = true,
  emptyText = 'Không có dữ liệu',
  className = '',
}: InfiniteScrollSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search
  const filteredOptions = searchable && searchTerm
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opt.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Update dropdown position
  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const dropdownHeight = 320; // max-height from CSS
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Determine if dropdown should open above or below
      const shouldOpenAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      const top = shouldOpenAbove
        ? rect.top + window.scrollY - dropdownHeight - 4 // 4px gap
        : rect.bottom + window.scrollY + 4; // 4px gap
      
      setDropdownPosition({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current && 
        !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle scroll to load more
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    
    if (bottom && hasMore && !loading && onLoadMore) {
      onLoadMore();
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
        onClick={handleToggle}
        ref={triggerRef}
      >
        <span className={selectedOption ? styles.triggerValue : styles.triggerPlaceholder}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={16} 
          className={`${styles.triggerIcon} ${isOpen ? styles.triggerIconOpen : ''}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        createPortal(
          <div
            className={styles.dropdown}
            ref={dropdownRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {/* Search Input */}
            {searchable && (
              <div className={styles.searchContainer}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  ref={searchInputRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options List */}
            <div 
              ref={listRef}
              className={styles.optionsList}
              onScroll={handleScroll}
            >
              {/* "All" option */}
              <button
                type="button"
                className={`${styles.option} ${value === 'all' ? styles.optionSelected : ''}`}
                onClick={() => handleSelect('all')}
              >
                <div className={styles.optionContent}>
                  <span className={styles.optionLabel}>Tất cả</span>
                </div>
              </button>

              {/* Filtered Options */}
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.option} ${value === option.value ? styles.optionSelected : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <div className={styles.optionContent}>
                    <span className={styles.optionLabel}>{option.label}</span>
                    {option.subtitle && (
                      <span className={styles.optionSubtitle}>{option.subtitle}</span>
                    )}
                  </div>
                </button>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className={styles.loadingContainer}>
                  <Loader2 size={16} className={styles.loadingIcon} />
                  <span className={styles.loadingText}>Đang tải...</span>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredOptions.length === 0 && (
                <div className={styles.emptyState}>
                  {emptyText}
                </div>
              )}
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
}
