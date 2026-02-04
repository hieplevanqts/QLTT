import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  List,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize,
  Eye,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import styles from './LeadMapView.module.css';

interface Lead {
  id: string;
  title: string;
  lat: number;
  lng: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved';
  area: string;
  timestamp: string;
}

export default function LeadMapView() {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [mapView, setMapView] = useState<'markers' | 'heatmap' | 'cluster'>('markers');
  const [showFilters, setShowFilters] = useState(false);
  const [splitRatio, setSplitRatio] = useState(40); // % width for list

  // Mock data - leads with coordinates in HCM City
  const mockLeads: Lead[] = Array.from({ length: 50 }, (_, i) => ({
    id: `L-2024-${(1500 + i).toString().padStart(4, '0')}`,
    title: [
      'Phát hiện cửa hàng kinh doanh hàng giả',
      'Khiếu nại về chất lượng sản phẩm',
      'Vi phạm niêm yết giá',
      'Hàng không rõ nguồn gốc',
    ][i % 4],
    lat: 10.762622 + (Math.random() - 0.5) * 0.1,
    lng: 106.660172 + (Math.random() - 0.5) * 0.1,
    priority: (['critical', 'high', 'medium', 'low'] as const)[i % 4],
    status: (['new', 'in_progress', 'resolved'] as const)[i % 3],
    area: ['Phường 1', 'Phường 3', 'Phường 7', 'Phường 10'][i % 4],
    timestamp: new Date(Date.now() - i * 86400000).toISOString(),
  }));

  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'rgba(239, 68, 68, 1)',
      high: 'rgba(251, 146, 60, 1)',
      medium: 'rgba(234, 179, 8, 1)',
      low: 'rgba(148, 163, 184, 1)',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityClass = (priority: string) => {
    const classes = {
      critical: styles.priorityCritical,
      high: styles.priorityHigh,
      medium: styles.priorityMedium,
      low: styles.priorityLow,
    };
    return classes[priority as keyof typeof classes] || '';
  };

  const getStatusClass = (status: string) => {
    const classes = {
      new: styles.statusNew,
      in_progress: styles.statusInProgress,
      resolved: styles.statusResolved,
    };
    return classes[status as keyof typeof classes] || '';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: 'Mới',
      in_progress: 'Đang xử lý',
      resolved: 'Đã xử lý',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      critical: 'Khẩn cấp',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp',
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vừa xong';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffHours < 48) return 'Hôm qua';
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Bản đồ Lead</h1>
          <p className={styles.subtitle}>Phân tích nguồn tin theo địa bàn</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.viewButton} ${mapView === 'markers' ? styles.viewButtonActive : ''}`}
            onClick={() => setMapView('markers')}
          >
            <MapPin size={16} />
            Markers
          </button>
          <button
            className={`${styles.viewButton} ${mapView === 'cluster' ? styles.viewButtonActive : ''}`}
            onClick={() => setMapView('cluster')}
          >
            <Layers size={16} />
            Cluster
          </button>
          <button
            className={`${styles.viewButton} ${mapView === 'heatmap' ? styles.viewButtonActive : ''}`}
            onClick={() => setMapView('heatmap')}
          >
            <Layers size={16} />
            Heatmap
          </button>
        </div>
      </div>

      {/* Split View */}
      <div className={styles.splitView}>
        {/* Lead List Panel */}
        <div className={styles.listPanel} style={{ width: `${splitRatio}%` }}>
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>
              <List size={18} />
              Danh sách Lead ({mockLeads.length})
            </h2>
            <button
              className={styles.filterButton}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
            </button>
          </div>

          <div className={styles.listContent}>
            {mockLeads.map((lead) => (
              <div
                key={lead.id}
                className={`${styles.leadCard} ${
                  selectedLead?.id === lead.id ? styles.leadCardActive : ''
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <div className={styles.leadCardHeader}>
                  <span className={styles.leadId}>{lead.id}</span>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(lead.priority)}`}>
                    {getPriorityLabel(lead.priority)}
                  </span>
                </div>

                <h3 className={styles.leadTitle}>{lead.title}</h3>

                <div className={styles.leadMeta}>
                  <div className={styles.leadArea}>
                    <MapPin size={14} />
                    <span>{lead.area}</span>
                  </div>
                  <span className={`${styles.statusBadge} ${getStatusClass(lead.status)}`}>
                    {getStatusLabel(lead.status)}
                  </span>
                </div>

                <div className={styles.leadFooter}>
                  <span className={styles.leadTime}>{formatDate(lead.timestamp)}</span>
                  <button
                    className={styles.viewButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/lead-risk/lead/${lead.id}`);
                    }}
                  >
                    <Eye size={14} />
                    Xem
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={styles.resizeHandle}
          onMouseDown={(e) => {
            const startX = e.clientX;
            const startRatio = splitRatio;

            const handleMouseMove = (e: MouseEvent) => {
              const deltaX = e.clientX - startX;
              const containerWidth = window.innerWidth - 48; // minus margins
              const newRatio = startRatio + (deltaX / containerWidth) * 100;
              setSplitRatio(Math.max(25, Math.min(60, newRatio)));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        >
          <div className={styles.resizeHandleBar}></div>
        </div>

        {/* Map Panel */}
        <div className={styles.mapPanel}>
          {/* Map Controls */}
          <div className={styles.mapControls}>
            <button className={styles.mapControlButton}>
              <ZoomIn size={18} />
            </button>
            <button className={styles.mapControlButton}>
              <ZoomOut size={18} />
            </button>
            <button className={styles.mapControlButton}>
              <Maximize size={18} />
            </button>
          </div>

          {/* Map Container - Placeholder */}
          <div className={styles.mapContainer}>
            {/* SVG Map Placeholder */}
            <svg className={styles.mapSvg} viewBox="0 0 800 600">
              {/* Background */}
              <rect width="800" height="600" fill="#f8f9fa" />
              
              {/* Grid */}
              {Array.from({ length: 10 }).map((_, i) => (
                <g key={`grid-${i}`}>
                  <line
                    x1={i * 80}
                    y1="0"
                    x2={i * 80}
                    y2="600"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <line
                    x1="0"
                    y1={i * 60}
                    x2="800"
                    y2={i * 60}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                </g>
              ))}

              {/* Map Markers or Heatmap */}
              {mapView === 'markers' &&
                mockLeads.map((lead) => {
                  const x = ((lead.lng - 106.6) * 8000) % 800;
                  const y = ((10.85 - lead.lat) * 6000) % 600;
                  const color = getPriorityColor(lead.priority);

                  return (
                    <g
                      key={lead.id}
                      transform={`translate(${x}, ${y})`}
                      className={styles.mapMarker}
                      onClick={() => setSelectedLead(lead)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle
                        cx="0"
                        cy="0"
                        r={selectedLead?.id === lead.id ? '12' : '8'}
                        fill={color}
                        opacity="0.8"
                        stroke="white"
                        strokeWidth="2"
                      />
                      {selectedLead?.id === lead.id && (
                        <circle
                          cx="0"
                          cy="0"
                          r="20"
                          fill="none"
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.4"
                        />
                      )}
                    </g>
                  );
                })}

              {/* Heatmap view */}
              {mapView === 'heatmap' &&
                mockLeads.map((lead) => {
                  const x = ((lead.lng - 106.6) * 8000) % 800;
                  const y = ((10.85 - lead.lat) * 6000) % 600;
                  const color = getPriorityColor(lead.priority);

                  return (
                    <circle
                      key={lead.id}
                      cx={x}
                      cy={y}
                      r="40"
                      fill={color}
                      opacity="0.2"
                    />
                  );
                })}

              {/* Cluster view */}
              {mapView === 'cluster' && (
                <>
                  {/* Group 1: Critical cluster */}
                  <g transform="translate(200, 150)">
                    <circle cx="0" cy="0" r="30" fill="rgba(239, 68, 68, 0.3)" />
                    <circle cx="0" cy="0" r="20" fill="rgba(239, 68, 68, 1)" />
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      12
                    </text>
                  </g>

                  {/* Group 2: High cluster */}
                  <g transform="translate(500, 300)">
                    <circle cx="0" cy="0" r="25" fill="rgba(251, 146, 60, 0.3)" />
                    <circle cx="0" cy="0" r="16" fill="rgba(251, 146, 60, 1)" />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      8
                    </text>
                  </g>

                  {/* Group 3: Medium cluster */}
                  <g transform="translate(600, 450)">
                    <circle cx="0" cy="0" r="22" fill="rgba(234, 179, 8, 0.3)" />
                    <circle cx="0" cy="0" r="14" fill="rgba(234, 179, 8, 1)" />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      5
                    </text>
                  </g>
                </>
              )}
            </svg>

            {/* Selected Lead Info */}
            {selectedLead && (
              <div className={styles.selectedLeadInfo}>
                <div className={styles.selectedLeadHeader}>
                  <span className={styles.selectedLeadId}>{selectedLead.id}</span>
                  <button
                    className={styles.viewDetailButton}
                    onClick={() => navigate(`/lead-risk/lead/${selectedLead.id}`)}
                  >
                    <Eye size={14} />
                    Chi tiết
                    <ChevronRight size={14} />
                  </button>
                </div>
                <h3 className={styles.selectedLeadTitle}>{selectedLead.title}</h3>
                <div className={styles.selectedLeadMeta}>
                  <span className={`${styles.priorityBadge} ${getPriorityClass(selectedLead.priority)}`}>
                    {getPriorityLabel(selectedLead.priority)}
                  </span>
                  <span className={`${styles.statusBadge} ${getStatusClass(selectedLead.status)}`}>
                    {getStatusLabel(selectedLead.status)}
                  </span>
                </div>
                <div className={styles.selectedLeadLocation}>
                  <MapPin size={14} />
                  <span>{selectedLead.area}</span>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className={styles.mapLegend}>
              <h4 className={styles.legendTitle}>Mức độ ưu tiên</h4>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ backgroundColor: 'rgba(239, 68, 68, 1)' }}
                  ></div>
                  <span>Khẩn cấp</span>
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ backgroundColor: 'rgba(251, 146, 60, 1)' }}
                  ></div>
                  <span>Cao</span>
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ backgroundColor: 'rgba(234, 179, 8, 1)' }}
                  ></div>
                  <span>Trung bình</span>
                </div>
                <div className={styles.legendItem}>
                  <div
                    className={styles.legendDot}
                    style={{ backgroundColor: 'rgba(148, 163, 184, 1)' }}
                  ></div>
                  <span>Thấp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
