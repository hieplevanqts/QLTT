import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';
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

interface TvFiltersBarProps {
  autoPlay: boolean;
  onAutoPlayChange: (value: boolean) => void;
  currentScene: number;
  totalScenes: number;
  onSceneChange: (direction: 'prev' | 'next') => void;
}

const TOPICS = [
  'Buôn lậu',
  'Vệ sinh an toàn thực phẩm',
  'Hàng giả, hàng nhái',
  'Nguồn gốc xuất xứ',
  'Vi phạm TMĐT',
  'Gian lận thương mại',
  'Quảng cáo sai sự thật',
  'Thuốc lá điếu',
  'Rượu, bia không rõ nguồn gốc',
  'Thiết bị y tế',
  'Vi phạm quyền sở hữu trí tuệ',
  'Hàng cấm lưu thông',
];

export default function TvFiltersBar({
  autoPlay,
  onAutoPlayChange,
  currentScene,
  totalScenes,
  onSceneChange,
}: TvFiltersBarProps) {
  const { filters, setFilters } = useTvData();

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
    <>
      {/* Location Rotation Control Bar - Full Width */}
      <div 
        className="bg-card border-b border-border flex items-center justify-center flex-shrink-0" 
        style={{ height: '60px', padding: '0 20px', position: 'relative', zIndex: 100 }}
      >
        <LocationRotationControl />
      </div>

      {/* Filters Bar - Original */}
      <div 
        className="bg-card border-b border-border flex items-center gap-4 flex-shrink-0" 
        style={{ height: '56px', padding: '0 20px', position: 'relative', zIndex: 100 }}
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
                height: '36px', 
                fontSize: '12px',
                border: '1px solid var(--border)',
                borderColor: filters.topic ? 'var(--primary)' : 'var(--border)',
                borderWidth: filters.topic ? '2px' : '1px',
              }}
            >
              <SelectValue placeholder="Chuyên đề" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên đề</SelectItem>
              {TOPICS.map(topic => (
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
                height: '36px', 
                fontSize: '12px',
                border: '1px solid var(--border)',
                borderColor: filters.timeRangeDays !== 7 ? 'var(--primary)' : 'var(--border)',
                borderWidth: filters.timeRangeDays !== 7 ? '2px' : '1px',
              }}
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
            style={{ height: '36px', fontSize: '12px', padding: '0 12px', gap: '6px' }}
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

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={autoPlay ? "default" : "outline"}
              size="sm"
              onClick={() => onAutoPlayChange(!autoPlay)}
              style={{ height: '36px', fontSize: '12px', padding: '0 12px', gap: '6px' }}
            >
              {autoPlay ? (
                <>
                  <Pause style={{ width: '14px', height: '14px' }} />
                  Tự chạy
                </>
              ) : (
                <>
                  <Play style={{ width: '14px', height: '14px' }} />
                  Tắt
                </>
              )}
            </Button>

            <div className="bg-muted rounded-md font-medium text-foreground" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Cảnh {currentScene}/{totalScenes}
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSceneChange('prev')}
                disabled={autoPlay}
                style={{ height: '36px', width: '36px' }}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onSceneChange('next')}
                disabled={autoPlay}
                style={{ height: '36px', width: '36px' }}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}