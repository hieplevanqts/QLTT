import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import { AlertTriangle, MapPin, Clipboard } from 'lucide-react';
import { useTvData } from '@/contexts/TvDataContext';
import { LOCATION_BOUNDS } from '@/constants/locationBounds';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string, size: number) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width: ${size}px; height: ${size}px; background: ${color}; border-radius: 50%; opacity: 0.8; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

interface LiveMapPanelProps {
  scene: number;
}

export default function LiveMapPanel({ scene }: LiveMapPanelProps) {
  const { filteredHotspots, filteredLeads, filteredTasks, filteredEvidences, layers, setLayers, filters } = useTvData();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Update last update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [16.0, 106.0],
      zoom: 5,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map view when province filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const province = filters.province;

    if (!province || province === 'all') {
      // Show all Vietnam - zoom level 5
      map.setView([16.0, 106.0], 5);
    } else if (LOCATION_BOUNDS[province]) {
      // Use predefined bounds for major provinces
      const bounds = LOCATION_BOUNDS[province].bounds;
      if (bounds) {
        map.fitBounds(bounds as any, { padding: [30, 30] });
      }
    } else {
      // Calculate bounds from filtered data points
      const allPoints = [
        ...filteredHotspots.map((h: any) => ({ lat: h.lat, lng: h.lng })),
        ...filteredLeads.map((l: any) => ({ lat: l.lat, lng: l.lng })),
        ...filteredTasks.map((t: any) => ({ lat: t.lat, lng: t.lng })),
      ];

      if (allPoints.length > 0) {
        const latLngs = allPoints.map((p: any) => [p.lat, p.lng] as [number, number]);
        map.fitBounds(latLngs, { padding: [30, 30] });
      }
    }

    // Trigger map invalidate after 120ms
    const timeoutId = setTimeout(() => {
      if (mapRef.current && map) {
        try {
          map.invalidateSize();
        } catch (error) {
          // Silently handle if map is unmounted
        }
      }
    }, 120);
    
    return () => clearTimeout(timeoutId);
  }, [filters.province, filteredHotspots, filteredLeads, filteredTasks]);

  // Update markers when data or layers change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add hotspot markers
    if (layers.hotspots) {
      filteredHotspots.forEach((hotspot: any) => {
        const size = hotspot.severity === 'P1' ? 16 : hotspot.severity === 'P2' ? 12 : 8;
        const marker = L.marker([hotspot.lat, hotspot.lng], {
          icon: createCustomIcon('#ef4444', size)
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 11px;">
            <div style="font-weight: 600;">${hotspot.title}</div>
            <div style="color: #64748b;">${hotspot.dia_ban.ward || hotspot.dia_ban.district}</div>
            <div style="color: #ef4444; font-weight: 600;">${hotspot.severity}</div>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

    // Add lead markers
    if (layers.leads) {
      filteredLeads.forEach((lead: any) => {
        const size = lead.risk_score > 70 ? 12 : 8;
        const marker = L.marker([lead.lat, lead.lng], {
          icon: createCustomIcon('#3b82f6', size)
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 11px;">
            <div style="font-weight: 600;">${lead.title}</div>
            <div style="color: #64748b;">${lead.dia_ban.ward || lead.dia_ban.district}</div>
            <div>Risk: ${Math.round(lead.risk_score)}/100</div>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

    // Add overdue task markers
    if (layers.tasks) {
      filteredTasks.filter((t: any) => t.is_overdue).forEach((task: any) => {
        const size = task.priority === 'P1' ? 14 : 10;
        const marker = L.marker([task.lat, task.lng], {
          icon: createCustomIcon('#f97316', size)
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 11px;">
            <div style="font-weight: 600;">${task.title}</div>
            <div style="color: #64748b;">${task.dia_ban.ward || task.dia_ban.district}</div>
            <div style="color: #f97316;">Quá hạn - ${task.priority}</div>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }

    // Add evidence markers
    if (layers.evidences) {
      filteredEvidences.forEach((evidence: any) => {
        const marker = L.marker([evidence.lat, evidence.lng], {
          icon: createCustomIcon('#8b5cf6', 8)
        }).addTo(map);

        marker.bindPopup(`
          <div style="font-size: 11px;">
            <div style="font-weight: 600;">${evidence.title}</div>
            <div style="color: #64748b;">${evidence.dia_ban.ward || evidence.dia_ban.district}</div>
            <div>${evidence.status}</div>
          </div>
        `);

        markersRef.current.push(marker);
      });
    }
  }, [filteredHotspots, filteredLeads, filteredTasks, filteredEvidences, layers]);

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Calculate counts based on layer visibility
  const activeHotspotsCount = layers.hotspots ? filteredHotspots.length : 0;
  const activeLeadsCount = layers.leads ? filteredLeads.length : 0;
  const overdueTasksCount = filteredTasks.filter(t => t.is_overdue).length;
  const activeTasksCount = layers.tasks ? overdueTasksCount : 0;

  const stats = [
    { label: 'Điểm nóng', value: activeHotspotsCount, icon: AlertTriangle, color: '#ef4444', active: layers.hotspots },
    { label: 'Nguồn tin mới', value: activeLeadsCount, icon: MapPin, color: '#3b82f6', active: layers.leads },
    { label: 'Nhiệm vụ quá hạn/SLA', value: activeTasksCount, icon: Clipboard, color: '#f97316', active: layers.tasks },
  ];

  const isHighlighted = scene === 1;

  const toggleLayer = (layer: keyof typeof layers) => {
    setLayers({ ...layers, [layer]: !layers[layer] });
  };

  return (
    <div 
      className={`flex-1 bg-card rounded-lg border border-border overflow-hidden transition-all ${
        isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      <div className="h-12 bg-muted/50 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
        <h2 className="text-base font-semibold text-foreground">Bản đồ điều hành</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Cập nhật lần cuối: {formatLastUpdate(lastUpdate)}
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs text-muted-foreground">Đang cập nhật</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 bg-muted/20" style={{ minHeight: '480px' }}>
        {/* Map container */}
        <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />

        {/* Stats overlay - positioned to not overlap with dropdowns */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-[400]">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg transition-all count-up pointer-events-auto ${ 
                !stat.active ? 'opacity-50' : ''
              }`}
              style={{ borderLeftColor: stat.color, borderLeftWidth: '3px', padding: '10px 12px' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-lg flex items-center justify-center"
                  style={{ width: '36px', height: '36px', backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon style={{ width: '18px', height: '18px', color: stat.color }} />
                </div>
                <div>
                  <div className="font-bold text-foreground tabular-nums" style={{ fontSize: '22px' }}>
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground leading-tight" style={{ fontSize: '11px' }}>
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Layer controls */}
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-lg pointer-events-auto z-[400]" style={{ padding: '12px' }}>
          <div className="font-semibold text-foreground mb-2" style={{ fontSize: '11px' }}>Lớp dữ liệu</div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => toggleLayer('hotspots')}
              className={`flex items-center gap-2 rounded transition-colors ${
                layers.hotspots ? 'bg-destructive/10' : 'opacity-50 hover:opacity-75'
              }`}
              style={{ padding: '6px 8px' }}
            >
              <div className={`rounded-full ${layers.hotspots ? 'bg-destructive' : 'bg-muted-foreground'}`} style={{ width: '10px', height: '10px' }}></div>
              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Điểm nóng</span>
            </button>
            <button
              onClick={() => toggleLayer('leads')}
              className={`flex items-center gap-2 rounded transition-colors ${
                layers.leads ? 'bg-blue-500/10' : 'opacity-50 hover:opacity-75'
              }`}
              style={{ padding: '6px 8px' }}
            >
              <div className={`rounded-full ${layers.leads ? 'bg-blue-500' : 'bg-muted-foreground'}`} style={{ width: '10px', height: '10px' }}></div>
              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Nguồn tin</span>
            </button>
            <button
              onClick={() => toggleLayer('tasks')}
              className={`flex items-center gap-2 rounded transition-colors ${
                layers.tasks ? 'bg-orange-500/10' : 'opacity-50 hover:opacity-75'
              }`}
              style={{ padding: '6px 8px' }}
            >
              <div className={`rounded-full ${layers.tasks ? 'bg-orange-500' : 'bg-muted-foreground'}`} style={{ width: '10px', height: '10px' }}></div>
              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Nhiệm vụ quá hạn</span>
            </button>
            <button
              onClick={() => toggleLayer('evidences')}
              className={`flex items-center gap-2 rounded transition-colors ${
                layers.evidences ? 'bg-purple-500/10' : 'opacity-50 hover:opacity-75'
              }`}
              style={{ padding: '6px 8px' }}
            >
              <div className={`rounded-full ${layers.evidences ? 'bg-purple-500' : 'bg-muted-foreground'}`} style={{ width: '10px', height: '10px' }}></div>
              <span className="text-muted-foreground" style={{ fontSize: '11px' }}>Chứng cứ</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}