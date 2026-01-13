import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import styles from './DateRangePicker.module.css';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
  onApply?: () => void;  // 🔥 NEW: Callback when user applies date range
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClear,
  onApply,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
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

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Display text for button
  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    } else if (startDate) {
      return `Từ ${formatDate(startDate)}`;
    } else if (endDate) {
      return `Đến ${formatDate(endDate)}`;
    }
    return 'Chọn khoảng thời gian';
  };

  const hasDateSelected = startDate || endDate;

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <Calendar size={16} className={styles.calendarIcon} />
        <span className={styles.displayText}>{getDisplayText()}</span>
        {hasDateSelected && (
          <X
            size={16}
            className={styles.clearIcon}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          />
        )}
      </button>

      {isOpen && (
        <div ref={dropdownRef} className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <Calendar size={16} />
            <span>Chọn khoảng thời gian</span>
          </div>

          <div className={styles.dateInputs}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Từ ngày</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                max={endDate || undefined}
                className={styles.dateInput}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Đến ngày</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate || undefined}
                className={styles.dateInput}
              />
            </div>
          </div>

          <div className={styles.quickOptions}>
            <button
              type="button"
              className={styles.quickButton}
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onStartDateChange(today);
                onEndDateChange(today);
                setIsOpen(false);
                // 🔥 NEW: Auto-save after selecting quick option
                if (onApply) {
                  setTimeout(() => onApply(), 100); // Small delay to ensure state updates
                }
              }}
            >
              Hôm nay
            </button>
            <button
              type="button"
              className={styles.quickButton}
              onClick={() => {
                const today = new Date();
                const weekAgo = new Date(today);
                weekAgo.setDate(today.getDate() - 7);
                onStartDateChange(weekAgo.toISOString().split('T')[0]);
                onEndDateChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
                // 🔥 NEW: Auto-save after selecting quick option
                if (onApply) {
                  setTimeout(() => onApply(), 100);
                }
              }}
            >
              7 ngày qua
            </button>
            <button
              type="button"
              className={styles.quickButton}
              onClick={() => {
                const today = new Date();
                const monthAgo = new Date(today);
                monthAgo.setMonth(today.getMonth() - 1);
                onStartDateChange(monthAgo.toISOString().split('T')[0]);
                onEndDateChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
                // 🔥 NEW: Auto-save after selecting quick option
                if (onApply) {
                  setTimeout(() => onApply(), 100);
                }
              }}
            >
              30 ngày qua
            </button>
            <button
              type="button"
              className={styles.quickButton}
              onClick={() => {
                const today = new Date();
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                onStartDateChange(firstDayOfMonth.toISOString().split('T')[0]);
                onEndDateChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
                // 🔥 NEW: Auto-save after selecting quick option
                if (onApply) {
                  setTimeout(() => onApply(), 100);
                }
              }}
            >
              Tháng này
            </button>
          </div>

          <div className={styles.dropdownFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className={styles.applyButton}
              onClick={() => {
                if (onApply) {
                  onApply();
                }
                setIsOpen(false);
              }}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};