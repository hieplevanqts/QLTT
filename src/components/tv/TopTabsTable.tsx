import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useTvData } from '@/contexts/TvDataContext';

interface TopTabsTableProps {
  scene: number;
}

export default function TopTabsTable({ scene }: TopTabsTableProps) {
  const [activeTab, setActiveTab] = useState<'hotspots' | 'overdue' | 'leads'>('hotspots');
  const { filteredHotspots, filteredLeads, filteredTasks, filters } = useTvData();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scene === 2) {
      setActiveTab('hotspots');
    } else if (scene === 3) {
      setActiveTab('overdue');
    }
  }, [scene]);

  const tabs = [
    { id: 'hotspots', label: 'Top điểm nóng' },
    { id: 'overdue', label: 'Top quá hạn/SLA' },
    { id: 'leads', label: 'Top nguồn tin' },
  ];

  const getGroupingLevel = () => {
    if (filters.ward) return 'ward';
    if (filters.district) return 'district';
    if (filters.province) return 'province';
    return 'province';
  };

  const groupByLocation = (data: any[]) => {
    const level = getGroupingLevel();
    const grouped: Record<string, { count: number; items: any[] }> = {};

    data.forEach(item => {
      let key = '';
      if (level === 'ward') {
        key = item.dia_ban.ward;
      } else if (level === 'district') {
        // If district is empty, use ward instead (fallback for new data structure)
        key = item.dia_ban.district || item.dia_ban.ward;
      } else {
        key = item.dia_ban.province;
      }

      if (!grouped[key]) {
        grouped[key] = { count: 0, items: [] };
      }
      grouped[key].count++;
      grouped[key].items.push(item);
    });

    // Limit to top 10 records
    return Object.entries(grouped)
      .map(([name, data]) => ({ name, count: data.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const calculateTrend = (current: number) => {
    const change = Math.floor(Math.random() * 5) - 2;
    if (change > 0) return { trend: 'up' as const, change: `+${change}` };
    if (change < 0) return { trend: 'down' as const, change: String(change) };
    return { trend: 'stable' as const, change: '0' };
  };

  const hotspotsData = useMemo(() => {
    const grouped = groupByLocation(filteredHotspots);
    return grouped.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      value: item.count,
      ...calculateTrend(item.count),
    }));
  }, [filteredHotspots, filters]);

  const overdueData = useMemo(() => {
    const overdueTasks = filteredTasks.filter(t => t.is_overdue);
    const grouped = groupByLocation(overdueTasks);
    return grouped.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      value: item.count,
      ...calculateTrend(item.count),
    }));
  }, [filteredTasks, filters]);

  const leadsData = useMemo(() => {
    const grouped = groupByLocation(filteredLeads);
    return grouped.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      value: item.count,
      ...calculateTrend(item.count),
    }));
  }, [filteredLeads, filters]);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'hotspots':
        return hotspotsData;
      case 'overdue':
        return overdueData;
      case 'leads':
        return leadsData;
      default:
        return hotspotsData;
    }
  };

  const data = getCurrentData();
  
  // Duplicate data 5 times for seamless infinite scroll - ensure enough content
  const infiniteData = data.length > 0 ? [...data, ...data, ...data, ...data, ...data] : [];
  
  const isHighlighted = scene === 2 || scene === 3;

  // Auto-scroll effect - seamless infinite loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || data.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.8; // pixels per frame
    let rafId: number;

    const animate = () => {
      if (!container) return;

      const { scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;

      // If content is not scrollable, don't scroll
      if (maxScroll <= 0) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      scrollPosition += scrollSpeed;

      // Calculate one-fifth of scroll height (where first duplicate ends)
      const oneFifthScroll = scrollHeight / 5;

      // Reset when reaching one-fifth mark for seamless loop
      if (scrollPosition >= oneFifthScroll) {
        scrollPosition = 0;
      }

      container.scrollTop = scrollPosition;
      rafId = requestAnimationFrame(animate);
    };

    // Start animation after a short delay to ensure DOM is ready
    const startTimer = setTimeout(() => {
      container.scrollTop = 0;
      scrollPosition = 0;
      rafId = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(startTimer);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [activeTab, data.length]);

  return (
    <div 
      className={`bg-card rounded-lg border border-border overflow-hidden transition-all ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{ height: '220px', display: 'flex', flexDirection: 'column' }}
    >
      <div className="border-b border-border flex-shrink-0" style={{ height: '40px' }}>
        <div className="flex h-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/5 border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              style={{ fontSize: '13px', fontWeight: 600, padding: '0 12px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto flex-1" ref={scrollContainerRef}>
        {data.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Không có dữ liệu phù hợp với bộ lọc</p>
            <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>Thử điều chỉnh bộ lọc địa bàn hoặc thời gian</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="text-left text-muted-foreground" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600, width: '50px' }}>
                  #
                </th>
                <th className="text-left text-muted-foreground" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600 }}>
                  Địa bàn
                </th>
                <th className="text-right text-muted-foreground" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600, width: '80px' }}>
                  Số lượng
                </th>
                <th className="text-center text-muted-foreground" style={{ padding: '8px 14px', fontSize: '12px', fontWeight: 600, width: '90px' }}>
                  Xu hướng
                </th>
              </tr>
            </thead>
            <tbody>
              {infiniteData.map((row, index) => (
                <tr
                  key={`${row.rank}-${index}`}
                  className={`border-t border-border hover:bg-muted/30 transition-colors ${
                    row.rank <= 3 ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="font-semibold text-foreground" style={{ padding: '10px 14px', fontSize: '13px' }}>
                    {row.rank}
                  </td>
                  <td className="text-foreground" style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 500 }}>
                    {row.name}
                  </td>
                  <td className="text-right font-semibold text-foreground tabular-nums" style={{ padding: '10px 14px', fontSize: '13px' }}>
                    {row.value}
                  </td>
                  <td className="text-center" style={{ padding: '10px 14px' }}>
                    <div className="inline-flex items-center gap-1">
                      {row.trend === 'up' && (
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp style={{ width: '13px', height: '13px' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.change}</span>
                        </div>
                      )}
                      {row.trend === 'down' && (
                        <div className="flex items-center gap-1 text-red-600">
                          <TrendingDown style={{ width: '13px', height: '13px' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.change}</span>
                        </div>
                      )}
                      {row.trend === 'stable' && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Minus style={{ width: '13px', height: '13px' }} />
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{row.change}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
