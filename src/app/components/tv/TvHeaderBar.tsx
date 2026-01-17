import React, { useState, useEffect } from 'react';
import { Monitor, Maximize, X, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useQLTTScope } from '@/contexts/QLTTScopeContext';
import mappaLogo from 'figma:asset/79505e63e97894ec2d06837c57cf53a19680f611.png';

interface TvHeaderBarProps {
  onExitTV: () => void;
  onFullscreen: () => void;
}

export default function TvHeaderBar({ onExitTV, onFullscreen }: TvHeaderBarProps) {
  const { user } = useAuth();
  const { scope } = useQLTTScope();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
  };

  const getScopeDisplay = () => {
    if (scope && scope.id !== 'all') {
      const parts = [];
      if (scope.name) parts.push(scope.name);
      if (scope.parentName) parts.push(scope.parentName);
      return parts.length > 0 ? parts.join(' • ') : 'Đơn vị: Toàn quốc';
    }
    return 'Đơn vị: Toàn quốc';
  };

  return (
    <div className="bg-card border-b border-border flex items-center gap-6 flex-shrink-0" style={{ height: '64px', padding: '0 20px' }}>
      <div className="flex items-center gap-3">
        <img src={mappaLogo} alt="Mappa Logo" className="object-contain" style={{ width: '48px', height: '48px' }} />
        <div className="flex flex-col">
          <h1 className="font-bold text-foreground" style={{ fontSize: '18px' }}>Trung tâm điều hành</h1>
          <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Hệ thống MAPPA</span>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="font-semibold text-foreground" style={{ fontSize: '14px' }}>
            {getScopeDisplay()}
          </div>
          <div className="text-muted-foreground" style={{ fontSize: '11px' }}>
            Đơn vị đang xem
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end">
          <div className="font-bold text-foreground tabular-nums" style={{ fontSize: '22px' }}>
            {formatTime(currentTime)}
          </div>
          <div className="text-muted-foreground" style={{ fontSize: '11px' }}>
            {formatDate(currentTime)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div 
            className={`flex items-center gap-1.5 rounded-md font-medium ${
              isConnected 
                ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                : 'bg-destructive/10 text-destructive border border-destructive/20'
            }`}
            style={{ fontSize: '11px', padding: '6px 10px' }}
          >
            {isConnected ? (
              <>
                <Wifi style={{ width: '14px', height: '14px' }} />
                Đang cập nhật
              </>
            ) : (
              <>
                <WifiOff style={{ width: '14px', height: '14px' }} />
                Mất kết nối
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onFullscreen}
            title="Toàn màn hình"
            style={{ padding: '6px 10px' }}
          >
            <Maximize style={{ width: '16px', height: '16px' }} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExitTV}
            title="Thoát chế độ TV"
            style={{ padding: '6px 10px', fontSize: '12px', gap: '6px' }}
          >
            <X style={{ width: '16px', height: '16px' }} />
            <span>Thoát TV</span>
          </Button>
        </div>
      </div>
    </div>
  );
}