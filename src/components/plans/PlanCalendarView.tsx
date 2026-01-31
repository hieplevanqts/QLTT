import React, { useState, useMemo } from 'react';
import { Popover } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/vi';
import { Plan } from '@/utils/data/kehoach-mock-data';
import styles from './PlanCalendarView.module.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, MapPin, Building2, ExternalLink } from 'lucide-react';
import { cn } from '@/components/ui/utils';

// Set locale to Vietnamese
dayjs.locale('vi');
dayjs.extend(isBetween);

interface PlanCalendarViewProps {
  plans: Plan[];
}


const PlanCalendarView: React.FC<PlanCalendarViewProps> = ({ plans }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Navigation Logic
  const handleNavigate = (direction: 'prev' | 'next') => {
    const val = direction === 'next' ? 1 : -1; 
    let unit: 'month' | 'week' | 'day' | 'year' = 'month';
    if (viewMode === 'week') unit = 'week';
    if (viewMode === 'day') unit = 'day';
    if (viewMode === 'year') unit = 'year';
    setCurrentDate(curr => curr.add(val, unit));
  };

  // Header Title
  const headerTitle = useMemo(() => {
    if (viewMode === 'year') return `Năm ${currentDate.format('YYYY')}`;
    if (viewMode === 'week') {
        const start = currentDate.startOf('week');
        const end = currentDate.endOf('week');
        if (start.format('M') === end.format('M')) return `Tháng ${start.format('M')}, ${currentDate.format('YYYY')}`;
        return `Tháng ${start.format('M')} - ${end.format('M')}, ${currentDate.format('YYYY')}`;
    }
    if (viewMode === 'day') return currentDate.format('dddd, DD MMMM YYYY');
    return `Tháng ${currentDate.format('M')}, ${currentDate.format('YYYY')}`;
  }, [viewMode, currentDate]);

  // Data Generation
  const calendarData = useMemo(() => {
    if (viewMode === 'year') {
        return Array.from({length: 12}, (_, i) => currentDate.month(i).startOf('month'));
    }

    let start = currentDate.startOf('month').startOf('week');
    let count = 42; // month view

    if (viewMode === 'week') {
        start = currentDate.startOf('week');
        count = 7;
    } else if (viewMode === 'day') {
        start = currentDate.startOf('day');
        count = 1;
    }

    const days: Dayjs[] = [];
    let day = start;
    for (let i = 0; i < count; i++) {
        days.push(day);
        day = day.add(1, 'day');
    }
    return days;
  }, [currentDate, viewMode]);

  const getPlansForDate = (date: Dayjs) => {
    return plans.filter((plan) => {
      const start = dayjs(plan.startDate).startOf('day');
      const end = dayjs(plan.endDate).endOf('day');
      return date.isBetween(start, end, 'day', '[]');
    });
  };

  const getPlansForMonth = (monthDate: Dayjs) => {
      const startOfMonth = monthDate.startOf('month');
      const endOfMonth = monthDate.endOf('month');
      return plans.filter(plan => {
          const start = dayjs(plan.startDate);
          const end = dayjs(plan.endDate);
          // Check for overlap
          return (start.isBefore(endOfMonth) || start.isSame(endOfMonth)) && 
                 (end.isAfter(startOfMonth) || end.isSame(startOfMonth));
      });
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
      case 'approved':
        return styles.active_bg;
      case 'pending_approval':
      case 'paused':
        return styles.pending_bg;
      case 'rejected':
      case 'cancelled':
        return styles.urgent_bg;
      default:
        return styles.default_bg;
    }
  };

  const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  return (
    <div className={styles.customCalendarWrapper}>
      {/* Header */}
      <div className={styles.calendarHeader}>
        <h2 className={styles.headerTitle}>{headerTitle}</h2>

        <div className={styles.viewSelector}>
          {['Ngày', 'Tuần', 'Tháng', 'Năm'].map((label, idx) => {
             const modes: (typeof viewMode)[] = ['day', 'week', 'month', 'year'];
             return (
                <button 
                  key={label}
                  className={cn(styles.viewBtn, viewMode === modes[idx] && styles.active)}
                  onClick={() => setViewMode(modes[idx])}
                >
                  {label}
                </button>
             )
          })}
        </div>

        <div className={styles.headerNav}>
          <button className={styles.navBtn} onClick={() => handleNavigate('prev')}>
            <ChevronLeft size={18} />
          </button>
          <button className={styles.todayBtn} onClick={() => setCurrentDate(dayjs())}>Hôm nay</button>
          <button className={styles.navBtn} onClick={() => handleNavigate('next')}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.gridContainer}>
        {/* Year View */}
        {viewMode === 'year' && (
            <div className={styles.yearGrid}>
                {calendarData.map(month => {
                    const monthPlans = getPlansForMonth(month);
                    const isCurrentMonth = month.isSame(dayjs(), 'month');
                    return (
                        <div 
                            key={month.toString()} 
                            className={cn(styles.monthCellItem, isCurrentMonth && styles.activeMonth)}
                            onClick={() => {
                                setCurrentDate(month);
                                setViewMode('month');
                            }}
                        >
                            <span className={styles.monthName}>tháng {month.format('M')}</span>
                            <span className={styles.monthMeta}>{monthPlans.length} kế hoạch</span>
                        </div>
                    );
                })}
            </div>
        )}

        {/* Day/Week/Month View */}
        {viewMode !== 'year' && (
            <>
                {/* Weekday Row (Hide for Day view maybe? No, keep context) */}
                <div className={styles.weekdayRow} style={viewMode === 'day' ? { gridTemplateColumns: '1fr' } : {}}>
                  {viewMode === 'day' ? (
                      <div className={styles.weekdayLabel}>{currentDate.format('dddd')}</div>
                  ) : (
                      weekdays.map(day => (
                        <div key={day} className={styles.weekdayLabel}>{day}</div>
                      ))
                  )}
                </div>

                <div className={styles.daysGrid} style={viewMode === 'day' ? { gridTemplateColumns: '1fr' } : {}}>
                  {calendarData.map((date) => {
                    const isCurrentMonth = date.isSame(currentDate, 'month');
                    const isToday = date.isSame(dayjs(), 'day');
                    const dayPlans = getPlansForDate(date);
                    
                    // Specific class for day view to allow full height expansion if needed
                    const isDayView = viewMode === 'day';

                    return (
                      <div 
                        key={date.toString()} 
                        className={cn(
                            styles.dayCell, 
                            (!isCurrentMonth && viewMode === 'month') && styles.notInMonth,
                        )}
                        style={isDayView ? { minHeight: 400 } : {}}
                      >
                        <div className={cn(styles.dateNum, isToday && styles.todayNum)}>
                          <span>{date.date()}</span>
                        </div>
                        
                        <div className={styles.cellContent}>
                          {dayPlans.slice(0, isDayView ? 20 : 3).map((plan) => (
                            <Popover
                              key={plan.id}
                              content={
                                <div className={styles.popoverCard}>
                                  <h4 className={styles.popoverTitle}>{plan.name}</h4>
                                  <div className={styles.popoverInfo}>
                                    <div className={styles.popoverRow}><Clock size={16} /> <span><strong>Thời gian:</strong> {dayjs(plan.startDate).format('HH:mm DD/MM/YYYY')} - {dayjs(plan.endDate).format('HH:mm DD/MM/YYYY')}</span></div>
                                    <div className={styles.popoverRow}><MapPin size={16} /> <span><strong>Cơ quan:</strong> {plan.responsibleUnit}</span></div>
                                    <div className={styles.popoverRow}><Building2 size={16} /> <span><strong>Mã kế hoạch:</strong> {plan.code}</span></div>
                                  </div>
                                  <div className={styles.popoverFooter}>
                                    <button className={styles.viewBtnLink} onClick={() => navigate(`/plans/${encodeURIComponent(plan.id)}`)}>
                                      Xem chi tiết <ExternalLink size={14} style={{ marginLeft: 6 }} />
                                    </button>
                                  </div>
                                </div>
                              }
                              trigger="click"
                              placement="top" // Changed default placement for safety
                              overlayInnerStyle={{ padding: 0 }}
                            >
                              <div className={cn(styles.eventItem, getStatusBg(plan.status))}>
                                <span className={styles.eventCode}>{plan.code}</span>
                                <div className={styles.eventMeta}>
                                  <span className={styles.eventTime}>{dayjs(plan.startDate).format('HH:mm')}</span>
                                  <span className={styles.planName}>{plan.name}</span>
                                </div>
                              </div>
                            </Popover>
                          ))}
                          {dayPlans.length > (isDayView ? 20 : 3) && (
                            <div className={styles.moreLabel}>+{dayPlans.length - (isDayView ? 20 : 3)} thêm</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default PlanCalendarView;
