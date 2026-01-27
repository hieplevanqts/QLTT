import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CustomCalendar.module.css';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface CustomCalendarProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onApply: () => void;
  mode?: 'range' | 'single'; // New prop for selection mode
}

const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export default function CustomCalendar({ value, onChange, onApply, mode = 'range' }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const prevMonthDays = getDaysInMonth(month - 1, year);
    
    const days: Array<{ date: number; month: 'prev' | 'current' | 'next'; dateString: string }> = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      days.push({
        date: day,
        month: 'prev',
        dateString: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month: 'current',
        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      days.push({
        date: i,
        month: 'next',
        dateString: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDateClick = (dateString: string) => {
    if (mode === 'single') {
      // Single date mode: one click selects and auto-applies
      onChange({ startDate: dateString, endDate: dateString });
      setHoverDate(null);
      
      setTimeout(() => {
        onApply();
      }, 100); // Faster delay for single selection
    } else {
      // Range mode: two clicks required
      if (!value.startDate || (value.startDate && value.endDate)) {
        // Start new selection
        onChange({ startDate: dateString, endDate: null });
        setHoverDate(null);
      } else {
        // Set end date
        const start = new Date(value.startDate);
        const end = new Date(dateString);
        
        let finalRange: DateRange;
        if (end >= start) {
          finalRange = { startDate: value.startDate, endDate: dateString };
        } else {
          // If end is before start, swap them
          finalRange = { startDate: dateString, endDate: value.startDate };
        }
        
        onChange(finalRange);
        setHoverDate(null);
        
        // Auto-apply when both dates are selected
        setTimeout(() => {
          onApply();
        }, 150); // Small delay for visual feedback
      }
    }
  };

  const isDateInRange = (dateString: string) => {
    if (!value.startDate || !value.endDate) return false;
    const date = new Date(dateString);
    const start = new Date(value.startDate);
    const end = new Date(value.endDate);
    return date >= start && date <= end;
  };

  const isDateInHoverRange = (dateString: string) => {
    if (!value.startDate || value.endDate || !hoverDate) return false;
    const date = new Date(dateString);
    const start = new Date(value.startDate);
    const hover = new Date(hoverDate);
    
    if (hover >= start) {
      return date >= start && date <= hover;
    } else {
      return date >= hover && date <= start;
    }
  };

  const handleDateHover = (dateString: string) => {
    // Only show hover preview in range mode
    if (mode === 'range' && value.startDate && !value.endDate) {
      setHoverDate(dateString);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const isStartDate = (dateString: string) => {
    return value.startDate === dateString;
  };

  const isEndDate = (dateString: string) => {
    return value.endDate === dateString;
  };



  const month1Days = useMemo(() => generateCalendarDays(currentMonth, currentYear), [currentMonth, currentYear]);
  const month2Days = useMemo(() => {
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    return generateCalendarDays(nextMonth, nextYear);
  }, [currentMonth, currentYear]);

  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const renderCalendar = (days: ReturnType<typeof generateCalendarDays>, month: number, year: number, isFirstMonth: boolean) => (
    <div className={styles.calendarMonth}>
      <div className={styles.monthHeader}>
        {isFirstMonth && (
          <button type="button" className={styles.navButton} onClick={handlePrevMonth}>
            <ChevronLeft size={16} />
          </button>
        )}
        <span className={styles.monthTitle}>{MONTHS[month]} {year}</span>
        {!isFirstMonth && (
          <button type="button" className={styles.navButton} onClick={handleNextMonth}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
      <div className={styles.weekdaysHeader}>
        {WEEKDAYS.map((day) => (
          <div key={day} className={styles.weekday}>{day}</div>
        ))}
      </div>
      <div className={styles.daysGrid} onMouseLeave={handleMouseLeave}>
        {days.map((day, index) => {
          const isInRange = isDateInRange(day.dateString);
          const isInHover = isDateInHoverRange(day.dateString);
          const isStart = isStartDate(day.dateString);
          const isEnd = isEndDate(day.dateString);
          const isOtherMonth = day.month !== 'current';
          
          return (
            <button
              key={index}
              type="button"
              className={`${styles.day} ${isOtherMonth ? styles.otherMonth : ''} ${isInRange ? styles.inRange : ''} ${isInHover ? styles.hoverRange : ''} ${isStart ? styles.startDate : ''} ${isEnd ? styles.endDate : ''}`}
              onClick={() => !isOtherMonth && handleDateClick(day.dateString)}
              disabled={isOtherMonth}
              onMouseEnter={() => !isOtherMonth && handleDateHover(day.dateString)}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.calendars}>
        {renderCalendar(month1Days, currentMonth, currentYear, true)}
        {renderCalendar(month2Days, nextMonth, nextYear, false)}
      </div>
    </div>
  );
}