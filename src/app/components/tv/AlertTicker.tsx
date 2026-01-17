import React, { useEffect, useState, useMemo } from 'react';
import { AlertTriangle, Clock, FileBox, TrendingUp } from 'lucide-react';
import { useTvData } from '@/contexts/TvDataContext';

interface AlertTickerProps {
  scene: number;
}

export default function AlertTicker({ scene }: AlertTickerProps) {
  const [offset, setOffset] = useState(0);
  const { filteredTasks, filteredLeads, filteredEvidences } = useTvData();

  const alerts = useMemo(() => {
    const result: any[] = [];

    const overdueTasks = filteredTasks.filter(t => t.is_overdue).slice(0, 5);
    overdueTasks.forEach(task => {
      result.push({
        id: task.id,
        icon: Clock,
        color: '#f97316',
        priority: task.priority,
        message: `Nhiệm vụ ${task.id} quá hạn tại ${task.dia_ban.ward || task.dia_ban.district}`,
      });
    });

    const pendingEvidences = filteredEvidences.filter(e => e.status === 'Chờ duyệt').slice(0, 3);
    if (pendingEvidences.length > 0) {
      result.push({
        id: 'evidence-pending',
        icon: FileBox,
        color: '#8b5cf6',
        priority: 'P2',
        message: `Chứng cứ mới chờ duyệt: ${pendingEvidences.length} mục`,
      });
    }

    const highRiskLeads = filteredLeads.filter(l => l.risk_score > 70).slice(0, 3);
    highRiskLeads.forEach(lead => {
      result.push({
        id: lead.id,
        icon: AlertTriangle,
        color: '#ef4444',
        priority: 'P1',
        message: `Nguồn tin rủi ro cao tại ${lead.dia_ban.ward || lead.dia_ban.district} (${Math.round(lead.risk_score)}/100)`,
      });
    });

    if (filteredLeads.length > 0) {
      const recentCount = filteredLeads.filter(l => {
        const diff = Date.now() - new Date(l.created_at).getTime();
        return diff < 7 * 24 * 60 * 60 * 1000;
      }).length;
      
      if (recentCount > 10) {
        result.push({
          id: 'leads-trending',
          icon: TrendingUp,
          color: '#10b981',
          priority: 'P3',
          message: `Nguồn tin mới tăng +${recentCount} trong 7 ngày`,
        });
      }
    }

    return result.length > 0 ? result : [{
      id: 'no-alerts',
      icon: AlertTriangle,
      color: '#10b981',
      priority: 'P3',
      message: 'Không có cảnh báo khẩn cấp',
    }];
  }, [filteredTasks, filteredLeads, filteredEvidences]);

  useEffect(() => {
    const animation = setInterval(() => {
      setOffset((prev) => {
        const newOffset = prev - 1;
        if (newOffset < -2000) {
          return 0;
        }
        return newOffset;
      });
    }, 30);

    return () => clearInterval(animation);
  }, []);

  return (
    <div className="bg-card border-t border-border flex items-center overflow-hidden flex-shrink-0" style={{ height: '48px' }}>
      <div className="flex-shrink-0 bg-primary/10 border-r border-border flex items-center gap-2" style={{ padding: '0 12px' }}>
        <AlertTriangle style={{ width: '16px', height: '16px' }} className="text-primary" />
        <span className="font-semibold text-primary whitespace-nowrap" style={{ fontSize: '12px' }}>
          Thông báo & cảnh báo
        </span>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-8 whitespace-nowrap"
          style={{
            transform: `translateX(${offset}px)`,
            transition: 'transform 0.03s linear',
          }}
        >
          {[...alerts, ...alerts, ...alerts].map((alert, index) => (
            <div
              key={`${alert.id}-${index}`}
              className="flex items-center gap-3"
              style={{ padding: '0 12px' }}
            >
              <div
                className="rounded-full flex items-center justify-center flex-shrink-0"
                style={{ width: '24px', height: '24px', backgroundColor: `${alert.color}20` }}
              >
                <alert.icon style={{ width: '14px', height: '14px', color: alert.color }} />
              </div>
              
              <div className="flex items-center gap-2">
                <span
                  className="font-bold rounded"
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    backgroundColor: `${alert.color}20`,
                    color: alert.color,
                  }}
                >
                  {alert.priority}
                </span>
                <span className="text-foreground" style={{ fontSize: '12px' }}>
                  {alert.message}
                </span>
              </div>

              <div className="bg-border flex-shrink-0" style={{ width: '1px', height: '16px' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}