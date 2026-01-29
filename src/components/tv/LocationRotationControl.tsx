import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTvData, PRIORITY_LOCATIONS } from '@/contexts/TvDataContext';

interface LocationRotationControlProps {
  compact?: boolean;
}

export default function LocationRotationControl({ compact = false }: LocationRotationControlProps) {
  const {
    autoRotationEnabled,
    setAutoRotationEnabled,
    currentLocationIndex,
    timeUntilNextRotation,
    goToNextLocation,
    goToPreviousLocation,
    selectLocation,
  } = useTvData();

  // Early return if context is not available (should not happen but safety check)
  if (!setAutoRotationEnabled || !goToNextLocation || !goToPreviousLocation || !selectLocation) {
    return null;
  }

  const progressPercent = ((20 - timeUntilNextRotation) / 20) * 100;

  const containerPadding = compact ? '8px 12px' : '12px 16px';
  const containerGap = compact ? '10px' : '12px';
  const controlSize = compact ? 30 : 36;
  const arrowSize = compact ? 28 : 32;
  const pillHeight = compact ? 28 : 32;
  const pillFontSize = compact ? '11px' : 'var(--text-xs)';
  const timerHeight = compact ? 28 : 32;
  const timerMinWidth = compact ? 44 : 48;
  const iconSize = compact ? 14 : 16;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: containerGap,
        padding: containerPadding,
        backgroundColor: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Play/Pause Button */}
      <button
        onClick={() => setAutoRotationEnabled(!autoRotationEnabled)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${controlSize}px`,
          height: `${controlSize}px`,
          padding: 0,
          backgroundColor: autoRotationEnabled ? 'var(--primary)' : 'var(--muted)',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        title={autoRotationEnabled ? 'Tạm dừng tự động' : 'Bật tự động chuyển'}
      >
        {autoRotationEnabled ? (
          <Pause style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: 'white' }} />
        ) : (
          <Play style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: 'var(--foreground)' }} />
        )}
      </button>

      {/* Previous Button */}
      <button
        onClick={goToPreviousLocation}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${arrowSize}px`,
          height: `${arrowSize}px`,
          padding: 0,
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--muted)';
          e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
        title="Địa bàn trước"
      >
        <ChevronLeft style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: 'var(--foreground)' }} />
      </button>

      {/* Location Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: 1,
        }}
      >
        {PRIORITY_LOCATIONS.map((location, index) => {
          const isActive = index === currentLocationIndex;
          const isPast = autoRotationEnabled && index < currentLocationIndex;
          
          return (
            <div
              key={location.code}
              onClick={() => selectLocation(index)}
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${pillHeight}px`,
                padding: '0 12px',
                fontSize: pillFontSize,
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                color: isActive ? 'white' : 'var(--foreground)',
                backgroundColor: isActive ? 'var(--primary)' : 'var(--muted)',
                border: '1px solid',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                overflow: 'hidden',
                transition: 'all 0.2s',
                opacity: isPast ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'var(--card)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }
              }}
              title={location.name}
            >
              {/* Progress bar background for active location */}
              {isActive && autoRotationEnabled && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${progressPercent}%`,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transition: 'width 1s linear',
                  }}
                />
              )}
              
              <span style={{ position: 'relative', zIndex: 1 }}>
                {location.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={goToNextLocation}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${arrowSize}px`,
          height: `${arrowSize}px`,
          padding: 0,
          backgroundColor: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--muted)';
          e.currentTarget.style.borderColor = 'var(--primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
        title="Địa bàn tiếp theo"
      >
        <ChevronRight style={{ width: `${iconSize}px`, height: `${iconSize}px`, color: 'var(--foreground)' }} />
      </button>

      {/* Timer Display */}
      {autoRotationEnabled && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: `${timerMinWidth}px`,
            height: `${timerHeight}px`,
            padding: '0 10px',
            fontSize: compact ? '12px' : 'var(--text-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--primary)',
            backgroundColor: 'rgba(0, 92, 182, 0.1)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius)',
          }}
          title="Thời gian đến địa bàn tiếp theo"
        >
          {timeUntilNextRotation}s
        </div>
      )}
    </div>
  );
}
