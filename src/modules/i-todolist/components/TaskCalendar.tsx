import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Task } from '../types';
import { TaskStatusBadge } from './TaskStatusBadge';
import { PriorityIndicator } from './PriorityIndicator';
import { Button } from '@/app/components/ui/button';
import styles from './TaskCalendar.module.css';

interface TaskCalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskCalendar({ tasks = [], onTaskClick }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendar();
  }, [currentDate]);

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    while (days.length < 42) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    setCalendarDays(days);
  };

  const getTasksForDate = (date: Date) => {
    if (!Array.isArray(tasks)) {
      return [];
    }
    return tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const monthName = currentDate.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={styles.container}>
      {/* Calendar header */}
      <div className={styles.header}>
        <h2 className={styles.monthName}>{monthName}</h2>
        <div className={styles.controls}>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon-sm" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className={styles.weekdays}>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.grid}>
        {calendarDays.map((date, index) => {
          const dateTasks = getTasksForDate(date);
          const isOtherMonth = !isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`${styles.day} ${isOtherMonth ? styles.otherMonth : ''} ${
                isTodayDate ? styles.today : ''
              }`}
            >
              <div className={styles.dayHeader}>
                <span className={styles.dayNumber}>{date.getDate()}</span>
                {dateTasks.length > 0 && (
                  <span className={styles.taskCount}>{dateTasks.length}</span>
                )}
              </div>
              <div className={styles.dayTasks}>
                {dateTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick?.(task)}
                    className={styles.taskItem}
                    title={task.title}
                  >
                    <PriorityIndicator priority={task.priority} size="sm" />
                    <span className={styles.taskTitle}>{task.title}</span>
                  </button>
                ))}
                {dateTasks.length > 3 && (
                  <div className={styles.moreTasksText}>
                    +{dateTasks.length - 3} công việc khác
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}