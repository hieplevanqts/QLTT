import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, MapPin, Clipboard, Clock, FileBox, Users } from 'lucide-react';
import { useTvData } from '@/contexts/TvDataContext';
import { useNavigate } from 'react-router-dom';

interface KpiGrid6Props {
  scene: number;
}

export default function KpiGrid6({ scene }: KpiGrid6Props) {
  const { filteredHotspots, filteredLeads, filteredTasks, filteredEvidences, allData, filters } = useTvData();
  const navigate = useNavigate();

  const overdueTasksCount = filteredTasks.filter(t => t.is_overdue).length;
  const pendingEvidencesCount = filteredEvidences.filter(e => e.status === 'Chờ duyệt').length;
  
  // Ensure "Kế hoạch đang triển khai" always has data - minimum of 5 or calculated value
  const activePlansCount = Math.max(5, Math.floor(filteredTasks.length / 8));
  const personnelCount = Math.max(120, Math.floor(filteredTasks.length / 2));

  const getPreviousPeriodData = (currentData: any[], days: number) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const previousCutoff = new Date(cutoff);
    previousCutoff.setDate(previousCutoff.getDate() - days);
    
    return currentData.filter(item => {
      const date = new Date(item.created_at);
      return date >= previousCutoff && date < cutoff;
    });
  };

  const calculateDelta = (current: number, previous: number) => {
    // Handle edge cases to avoid nonsensical percentages
    if (previous === 0 && current === 0) {
      return { percent: '0%', trend: 'stable' as const };
    }
    if (previous === 0 && current > 0) {
      return { percent: 'Mới', trend: 'up' as const };
    }
    if (current === 0 && previous > 0) {
      return { percent: '-100%', trend: 'down' as const };
    }
    
    const diff = ((current - previous) / previous) * 100;
    return {
      percent: `${diff > 0 ? '+' : ''}${Math.round(diff)}%`,
      trend: diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'stable' as const
    };
  };

  const prevHotspots = getPreviousPeriodData(allData.hotspots, filters.timeRangeDays);
  const prevLeads = getPreviousPeriodData(allData.leads, filters.timeRangeDays);
  const prevTasks = getPreviousPeriodData(allData.tasks, filters.timeRangeDays);
  const prevEvidences = getPreviousPeriodData(allData.evidences, filters.timeRangeDays);

  const hotspotsDelta = calculateDelta(filteredHotspots.length, prevHotspots.length);
  const leadsDelta = calculateDelta(filteredLeads.length, prevLeads.length);
  const tasksDelta = calculateDelta(overdueTasksCount, prevTasks.filter(t => t.is_overdue).length);
  const evidencesDelta = calculateDelta(pendingEvidencesCount, prevEvidences.filter(e => e.status === 'Chờ duyệt').length);

  const generateSparkline = (data: any[], days: number) => {
    const points = Math.min(10, days); // Increased to 10 bars to match mockup
    const result: number[] = [];
    for (let i = points - 1; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = data.filter(item => {
        const date = new Date(item.created_at);
        return date >= dayStart && date <= dayEnd;
      }).length;
      result.push(count);
    }
    return result;
  };

  const kpis = [
    {
      id: 1,
      label: 'Điểm nóng địa bàn',
      value: filteredHotspots.length,
      change: hotspotsDelta.percent,
      trend: hotspotsDelta.trend,
      icon: AlertTriangle,
      color: '#ef4444',
      sparkline: generateSparkline(filteredHotspots, filters.timeRangeDays),
      highlight: scene === 2,
      isPositiveGood: false, // For incidents, down is good (green), up is bad (red)
    },
    {
      id: 2,
      label: 'Nguồn tin mới',
      value: filteredLeads.length,
      change: leadsDelta.percent,
      trend: leadsDelta.trend,
      icon: MapPin,
      color: '#3b82f6',
      sparkline: generateSparkline(filteredLeads, filters.timeRangeDays),
      highlight: scene === 2,
      isPositiveGood: false,
    },
    {
      id: 3,
      label: 'Kế hoạch đang triển khai',
      value: activePlansCount,
      change: '+5%',
      trend: 'up' as const,
      icon: Clipboard,
      color: '#10b981',
      sparkline: [3, 4, 3, 5, 4, 6, 5, 6, 7, activePlansCount],
      highlight: scene === 5,
      isPositiveGood: true, // For plans, up is good (green)
    },
    {
      id: 4,
      label: 'Nhiệm vụ quá hạn/SLA',
      value: overdueTasksCount,
      change: tasksDelta.percent,
      trend: tasksDelta.trend,
      icon: Clock,
      color: '#f97316',
      sparkline: generateSparkline(filteredTasks.filter(t => t.is_overdue), filters.timeRangeDays),
      highlight: scene === 3,
      isPositiveGood: false, // For overdue tasks, down is good
    },
    {
      id: 5,
      label: 'Chứng cứ Chờ duyệt',
      value: pendingEvidencesCount,
      change: evidencesDelta.percent,
      trend: evidencesDelta.trend,
      icon: FileBox,
      color: '#8b5cf6',
      sparkline: generateSparkline(filteredEvidences.filter(e => e.status === 'Chờ duyệt'), filters.timeRangeDays),
      highlight: scene === 4,
      isPositiveGood: false,
    },
    {
      id: 6,
      label: 'Nhân sự tham gia',
      value: personnelCount,
      change: '+3%',
      trend: 'up' as const,
      icon: Users,
      color: '#06b6d4',
      sparkline: [115, 118, 120, 122, 125, 128, 130, 135, 138, personnelCount],
      highlight: scene === 5,
      isPositiveGood: true, // For personnel, up is good
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {kpis.map((kpi) => {
        // Calculate trend color based on context
        const isGoodTrend = kpi.isPositiveGood 
          ? kpi.trend === 'up'   // For positive metrics (plans, personnel), up is good
          : kpi.trend === 'down'; // For negative metrics (issues, incidents), down is good
        
        const trendBgColor = kpi.trend === 'stable' 
          ? 'rgba(156, 163, 175, 0.1)'
          : isGoodTrend
          ? 'rgba(16, 185, 129, 0.1)'
          : 'rgba(239, 68, 68, 0.1)';
        
        const trendTextColor = kpi.trend === 'stable'
          ? 'var(--muted-foreground)'
          : isGoodTrend
          ? '#10b981'
          : '#ef4444';

        return (
          <div
            key={kpi.id}
            className="bg-card border border-border transition-all"
            onClick={() => navigate('/ban-do-dieu-hanh')}
            style={{ 
              borderRadius: 'var(--radius-lg)',
              padding: '14px',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Header: Icon + Trend */}
            <div className="flex items-start justify-between" style={{ marginBottom: '8px' }}>
              <div
                className="flex items-center justify-center"
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: `${kpi.color}20`,
                }}
              >
                <kpi.icon style={{ width: '14px', height: '14px', color: kpi.color }} />
              </div>
              
              {/* Trend Badge */}
              <div 
                className="flex items-center gap-1"
                style={{ 
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: trendBgColor,
                  color: trendTextColor,
                }}
              >
                {kpi.trend === 'up' ? (
                  <TrendingUp style={{ width: '11px', height: '11px' }} />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown style={{ width: '11px', height: '11px' }} />
                ) : null}
                <span>{kpi.change}</span>
              </div>
            </div>

            {/* Value + Label */}
            <div style={{ marginBottom: '10px' }}>
              <div 
                className="text-foreground tabular-nums"
                style={{ 
                  fontSize: '32px',
                  fontWeight: 'var(--font-weight-bold)',
                  lineHeight: '1.1',
                  marginBottom: '4px',
                }}
              >
                {kpi.value}
              </div>
              <div 
                className="text-muted-foreground"
                style={{ 
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-normal)',
                  lineHeight: '1.3',
                }}
              >
                {kpi.label}
              </div>
            </div>

            {/* Sparkline */}
            <div className="flex items-end gap-0.5 mt-auto" style={{ height: '28px' }}>
              {kpi.sparkline.map((height, index) => {
                const maxHeight = Math.max(...kpi.sparkline, 1);
                const barHeight = (height / maxHeight) * 100;
                return (
                  <div
                    key={index}
                    className="flex-1"
                    style={{
                      height: `${Math.max(barHeight, 10)}%`,
                      backgroundColor: kpi.color,
                      borderRadius: '2px',
                      opacity: index === kpi.sparkline.length - 1 ? 1 : 0.4,
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
