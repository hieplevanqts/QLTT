import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, X } from 'lucide-react';
import CustomCalendar from './CustomCalendar';
import styles from './DateRangePicker.module.css';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  className?: string;
  mode?: 'range' | 'single'; // New prop for selection mode
}

export default function DateRangePicker({ 
  value, 
  onChange, 
  placeholder = 'Chọn khoảng thời gian',
  className = '',
  mode = 'range'
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ensure value is always a valid DateRange object
  const safeValue: DateRange = value || { startDate: null, endDate: null };

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const dropdownHeight = 320; // Reduced (no footer)
        const dropdownWidth = 490;
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;

        let top = rect.bottom + 8;
        let left = rect.left;

        // Check if dropdown goes below viewport
        if (top + dropdownHeight > viewportHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        // Check if dropdown goes beyond right edge
        if (left + dropdownWidth > viewportWidth) {
          left = viewportWidth - dropdownWidth - 16;
        }

        // Check if dropdown goes beyond left edge
        if (left < 16) {
          left = 16;
        }

        setDropdownPosition({ top, left });
      };

      updatePosition();

      // Update position on scroll or resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange({
      startDate: null,
      endDate: null
    });
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!safeValue.startDate && !safeValue.endDate) return '';
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (mode === 'single') {
      // Single mode: show only one date
      if (safeValue.startDate) {
        return formatDate(safeValue.startDate);
      }
    } else {
      // Range mode: show range or partial
      if (safeValue.startDate && safeValue.endDate) {
        // If both dates are the same, show only one (edge case)
        if (safeValue.startDate === safeValue.endDate) {
          return formatDate(safeValue.startDate);
        }
        return `${formatDate(safeValue.startDate)} - ${formatDate(safeValue.endDate)}`;
      } else if (safeValue.startDate) {
        return `Từ ${formatDate(safeValue.startDate)}`;
      } else if (safeValue.endDate) {
        return `Đến ${formatDate(safeValue.endDate)}`;
      }
    }
    return '';
  };

  const hasValue = safeValue.startDate || safeValue.endDate;
  const displayText = formatDateRange() || placeholder;

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      <button
        type="button"
        className={`${styles.trigger} ${hasValue ? styles.hasValue : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={16} className={styles.icon} />
        <span className={styles.text}>{displayText}</span>
        {hasValue && (
          <X 
            size={16} 
            className={styles.clearIcon}
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          />
        )}
      </button>

      {isOpen && (
        createPortal(
          <div ref={dropdownRef} className={styles.dropdown} style={{ top: dropdownPosition.top, left: dropdownPosition.left }}>
            <CustomCalendar
              value={safeValue}
              onChange={onChange}
              onApply={handleApply}
              mode={mode}
            />
          </div>,
          document.body
        )
      )}
    </div>
  );
}