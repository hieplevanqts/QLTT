import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useTvData } from '@/contexts/TvDataContext';
import TvLocationSelector from './TvLocationSelector';
import LocationRotationControl from './LocationRotationControl';
import styles from './TvFiltersBar.module.css';

export default function TvFiltersBar() {
  const { filters, setFilters, topics } = useTvData();

  const handleReset = () => {
    setFilters({
      timeRangeDays: 7,
    });
  };

  // Count active filters for visual feedback
  const activeFiltersCount = [
    filters.province,
    filters.district,
    filters.ward,
    filters.topic,
  ].filter(Boolean).length;

  return (
    <div
      className={`bg-card border-b border-border flex items-center gap-4 flex-shrink-0 ${styles.barBase} ${styles.filtersBar}`}
    >
        <div className="flex items-center gap-3">
          <TvLocationSelector />

          <Select
            value={filters.topic || 'all'}
            onValueChange={(value) => setFilters({ ...filters, topic: value === 'all' ? undefined : value })}
          >
            <SelectTrigger 
              style={{ 
                width: '180px', 
                border: '1px solid var(--border)',
                borderColor: filters.topic ? 'var(--primary)' : 'var(--border)',
                borderWidth: filters.topic ? '2px' : '1px',
              }}
              className={styles.selectTriggerBase}
            >
              <SelectValue placeholder="Chuyên đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên đề</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(filters.timeRangeDays)}
            onValueChange={(value) => setFilters({ ...filters, timeRangeDays: parseInt(value) })}
          >
            <SelectTrigger 
              style={{ 
                width: '150px', 
                border: '1px solid var(--border)',
                borderColor: filters.timeRangeDays !== 7 ? 'var(--primary)' : 'var(--border)',
                borderWidth: filters.timeRangeDays !== 7 ? '2px' : '1px',
              }}
              className={styles.selectTriggerBase}
            >
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 ngày</SelectItem>
              <SelectItem value="30">30 ngày</SelectItem>
              <SelectItem value="90">90 ngày</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className={styles.controlButton}
          >
            <RotateCcw style={{ width: '14px', height: '14px' }} />
            Đặt lại
            {activeFiltersCount > 0 && (
              <span 
                className="bg-primary text-primary-foreground rounded-full font-semibold" 
                style={{ 
                  padding: '2px 6px', 
                  fontSize: '10px',
                  minWidth: '18px',
                  height: '18px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        <div className="ml-auto flex items-center shrink-0">
          <LocationRotationControl compact />
        </div>
      </div>
    </>
  );
}
