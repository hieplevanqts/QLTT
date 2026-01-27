import { useState, useMemo, useRef, useEffect } from 'react';
import {
  X,
  Map,
  Users,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from 'lucide-react';
import ZoomableMapView from './ZoomableMapView';
import styles from './SLAOperationMap.module.css';

type SLAStatus = 'onTrack' | 'atRisk' | 'overdue';
type LeadStatus = 'assigned' | 'inVerification' | 'escalated';
type Urgency = 'low' | 'medium' | 'high' | 'critical';
type TimeWindow = 'today' | '24h' | '48h' | 'overdue';

interface MapFilters {
  slaStatus: SLAStatus[];
  organizations: string[];
  leadStatus: LeadStatus[];
  urgency: Urgency[];
  timeWindow: TimeWindow[];
  areas: string[];
  topics: string[];
}

interface Team {
  id: string;
  name: string;
  position: { top: string; left: string };
  compliance: number;
  total: number;
  withinSLA: number;
  atRisk: number;
  breached: number;
  activeMembers: number;
  address: string;
  organization: string;
  area: string;
}

interface Lead {
  id: string;
  title: string;
  position: { top: string; left: string };
  urgency: Urgency;
  slaStatus: SLAStatus;
  assignedTo: string;
  deadline: string;
  status: LeadStatus;
  topic: string;
  area: string;
  organization: string;
}

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

// Mock data with CSS positions
const mockTeams: Team[] = [
  {
    id: 'team-24',
    name: 'Đội 24 - TP.HCM số 4',
    position: { top: '78%', left: '52%' },
    compliance: 71.1,
    total: 45,
    withinSLA: 32,
    atRisk: 8,
    breached: 5,
    activeMembers: 8,
    address: 'Quận 1, TP.HCM',
    organization: 'Chi cục TP.HCM',
    area: 'TP.HCM',
  },
  {
    id: 'team-01',
    name: 'Đội 01 - QLTT số 1',
    position: { top: '20%', left: '54%' },
    compliance: 89.5,
    total: 38,
    withinSLA: 34,
    atRisk: 3,
    breached: 1,
    activeMembers: 6,
    address: 'Hoàn Kiếm, Hà Nội',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
  },
  {
    id: 'team-02',
    name: 'Đội 02 - QLTT số 2',
    position: { top: '18%', left: '52%' },
    compliance: 90.6,
    total: 32,
    withinSLA: 29,
    atRisk: 2,
    breached: 1,
    activeMembers: 5,
    address: 'Ba Đình, Hà Nội',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
  },
  {
    id: 'team-15',
    name: 'Đội 15 - Hà Nội số 3',
    position: { top: '22%', left: '53%' },
    compliance: 82.1,
    total: 28,
    withinSLA: 23,
    atRisk: 3,
    breached: 2,
    activeMembers: 7,
    address: 'Đống Đa, Hà Nội',
    organization: 'Chi cục Hà Nội',
    area: 'Hà Nội',
  },
  {
    id: 'team-07',
    name: 'Đội 07 - Đà Nẵng số 1',
    position: { top: '48%', left: '55%' },
    compliance: 76.9,
    total: 13,
    withinSLA: 10,
    atRisk: 2,
    breached: 1,
    activeMembers: 4,
    address: 'Hải Châu, Đà Nẵng',
    organization: 'Chi cục Đà Nẵng',
    area: 'Đà Nẵng',
  },
];

const mockLeads: Lead[] = [
  {
    id: 'LEAD-2025-0156',
    title: 'Cửa hàng bán hàng giả - Quận 1',
    position: { top: '77%', left: '53%' },
    urgency: 'critical',
    slaStatus: 'overdue',
    assignedTo: 'Đội 24',
    deadline: '2h trước',
    status: 'assigned',
    topic: 'Hàng giả',
    area: 'TP.HCM',
    organization: 'Chi cục TP.HCM',
  },
  {
    id: 'LEAD-2025-0157',
    title: 'Kinh doanh không phép - Bến Thành',
    position: { top: '79%', left: '51%' },
    urgency: 'high',
    slaStatus: 'atRisk',
    assignedTo: 'Đội 24',
    deadline: '2h',
    status: 'inVerification',
    topic: 'Kinh doanh không phép',
    area: 'TP.HCM',
    organization: 'Chi cục TP.HCM',
  },
  {
    id: 'LEAD-2025-0158',
    title: 'An toàn thực phẩm - Quận 3',
    position: { top: '76%', left: '54%' },
    urgency: 'medium',
    slaStatus: 'onTrack',
    assignedTo: 'Đội 24',
    deadline: '18h',
    status: 'assigned',
    topic: 'An toàn thực phẩm',
    area: 'TP.HCM',
    organization: 'Chi cục TP.HCM',
  },
  {
    id: 'LEAD-2025-0142',
    title: 'Kinh doanh không phép - Đống Đa',
    position: { top: '23%', left: '52%' },
    urgency: 'high',
    slaStatus: 'atRisk',
    assignedTo: 'Đội 15',
    deadline: '4h',
    status: 'escalated',
    topic: 'Kinh doanh không phép',
    area: 'Hà Nội',
    organization: 'Chi cục Hà Nội',
  },
  {
    id: 'LEAD-2025-0143',
    title: 'Hàng kém chất lượng - Hoàn Kiếm',
    position: { top: '21%', left: '55%' },
    urgency: 'critical',
    slaStatus: 'overdue',
    assignedTo: 'Đội 01',
    deadline: '1h trước',
    status: 'assigned',
    topic: 'Hàng kém chất lượng',
    area: 'Hà Nội',
    organization: 'Chi cục Hà Nội',
  },
  {
    id: 'LEAD-2025-0144',
    title: 'An toàn thực phẩm - Ba Đình',
    position: { top: '19%', left: '51%' },
    urgency: 'low',
    slaStatus: 'onTrack',
    assignedTo: 'Đội 02',
    deadline: '2 ngày',
    status: 'inVerification',
    topic: 'An toàn thực phẩm',
    area: 'Hà Nội',
    organization: 'Chi cục Hà Nội',
  },
  {
    id: 'LEAD-2025-0138',
    title: 'Hàng kém chất lượng - Hải Châu',
    position: { top: '49%', left: '56%' },
    urgency: 'high',
    slaStatus: 'atRisk',
    assignedTo: 'Đội 07',
    deadline: '6h',
    status: 'assigned',
    topic: 'Hàng kém chất lượng',
    area: 'Đà Nẵng',
    organization: 'Chi cục Đà Nẵng',
  },
];

export default function SLAOperationMap({ isOpen = true, onClose = () => {} }: Props) {
  const [filters, setFilters] = useState<MapFilters>({
    slaStatus: ['atRisk', 'overdue'],
    organizations: [],
    leadStatus: [],
    urgency: ['high', 'critical'],
    timeWindow: [],
    areas: [],
    topics: [],
  });

  const [expandedSections, setExpandedSections] = useState<string[]>([
    'slaStatus',
    'urgency',
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredTeams = useMemo(() => {
    return mockTeams.filter(team => {
      if (filters.organizations.length > 0 && !filters.organizations.includes(team.organization)) {
        return false;
      }
      if (filters.areas.length > 0 && !filters.areas.includes(team.area)) {
        return false;
      }
      if (searchTerm && !team.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [filters, searchTerm]);

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      if (filters.slaStatus.length > 0 && !filters.slaStatus.includes(lead.slaStatus)) {
        return false;
      }
      if (filters.urgency.length > 0 && !filters.urgency.includes(lead.urgency)) {
        return false;
      }
      if (filters.leadStatus.length > 0 && !filters.leadStatus.includes(lead.status)) {
        return false;
      }
      if (filters.organizations.length > 0 && !filters.organizations.includes(lead.organization)) {
        return false;
      }
      if (filters.areas.length > 0 && !filters.areas.includes(lead.area)) {
        return false;
      }
      if (filters.topics.length > 0 && !filters.topics.includes(lead.topic)) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const toggleFilter = <K extends keyof MapFilters>(
    key: K,
    value: MapFilters[K][number]
  ) => {
    setFilters(prev => {
      const current = prev[key] as any[];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      slaStatus: ['atRisk', 'overdue'],
      organizations: [],
      leadStatus: [],
      urgency: ['high', 'critical'],
      timeWindow: [],
      areas: [],
      topics: [],
    });
  };

  const getTeamSLAStatus = (team: Team): SLAStatus => {
    if (team.compliance >= 85) return 'onTrack';
    if (team.compliance >= 70) return 'atRisk';
    return 'overdue';
  };

  const getSLAColor = (status: SLAStatus) => {
    switch (status) {
      case 'onTrack': return 'var(--chart-4)';
      case 'atRisk': return 'var(--chart-2)';
      case 'overdue': return 'var(--chart-1)';
    }
  };

  const getUrgencyColor = (urgency: Urgency) => {
    switch (urgency) {
      case 'critical': return 'var(--chart-1)';
      case 'high': return 'var(--chart-2)';
      case 'medium': return 'var(--chart-5)';
      case 'low': return 'var(--muted-foreground)';
    }
  };

  const getUrgencySize = (urgency: Urgency) => {
    switch (urgency) {
      case 'critical': return '16px';
      case 'high': return '12px';
      case 'medium': return '10px';
      case 'low': return '8px';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.mapModal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.mapModalHeader}>
          <div className={styles.mapModalTitle}>
            <Map size={24} />
            <div>
              <h2>Bản đồ giám sát SLA - Operation Map</h2>
              <p>Theo dõi real-time vị trí đội và tín hiệu đang xử lý trên bản đồ Việt Nam</p>
            </div>
          </div>
          <button className={styles.mapModalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.mapContent}>
          {/* Filter Panel */}
          <div className={styles.filterPanel}>
            <div className={styles.filterHeader}>
              <div className={styles.filterTitle}>
                <Filter size={16} />
                <span>Bộ lọc</span>
              </div>
              <button className={styles.clearBtn} onClick={clearAllFilters}>
                Xóa tất cả
              </button>
            </div>

            {/* Search */}
            <div className={styles.filterSection}>
              <div className={styles.searchBox}>
                <Search size={16} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Tìm kiếm đội..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {/* SLA Status Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('slaStatus')}
              >
                <span>Trạng thái SLA</span>
                {expandedSections.includes('slaStatus') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('slaStatus') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.slaStatus.includes('onTrack')}
                      onChange={() => toggleFilter('slaStatus', 'onTrack')}
                    />
                    <CheckCircle2 size={14} color="var(--chart-4)" />
                    <span>On Track (≥85%)</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.slaStatus.includes('atRisk')}
                      onChange={() => toggleFilter('slaStatus', 'atRisk')}
                    />
                    <AlertTriangle size={14} color="var(--chart-2)" />
                    <span>At Risk (70-85%)</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.slaStatus.includes('overdue')}
                      onChange={() => toggleFilter('slaStatus', 'overdue')}
                    />
                    <XCircle size={14} color="var(--chart-1)" />
                    <span>Overdue (&lt;70%)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Urgency Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('urgency')}
              >
                <span>Mức độ khẩn</span>
                {expandedSections.includes('urgency') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('urgency') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.urgency.includes('critical')}
                      onChange={() => toggleFilter('urgency', 'critical')}
                    />
                    <div className={styles.urgencyDot} style={{ background: 'var(--chart-1)' }} />
                    <span>Critical</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.urgency.includes('high')}
                      onChange={() => toggleFilter('urgency', 'high')}
                    />
                    <div className={styles.urgencyDot} style={{ background: 'var(--chart-2)' }} />
                    <span>High</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.urgency.includes('medium')}
                      onChange={() => toggleFilter('urgency', 'medium')}
                    />
                    <div className={styles.urgencyDot} style={{ background: 'var(--chart-5)' }} />
                    <span>Medium</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.urgency.includes('low')}
                      onChange={() => toggleFilter('urgency', 'low')}
                    />
                    <div className={styles.urgencyDot} style={{ background: 'var(--muted-foreground)' }} />
                    <span>Low</span>
                  </label>
                </div>
              )}
            </div>

            {/* Lead Status Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('leadStatus')}
              >
                <span>Trạng thái tín hiệu</span>
                {expandedSections.includes('leadStatus') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('leadStatus') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.leadStatus.includes('assigned')}
                      onChange={() => toggleFilter('leadStatus', 'assigned')}
                    />
                    <span>Đã giao</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.leadStatus.includes('inVerification')}
                      onChange={() => toggleFilter('leadStatus', 'inVerification')}
                    />
                    <span>Đang kiểm tra</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.leadStatus.includes('escalated')}
                      onChange={() => toggleFilter('leadStatus', 'escalated')}
                    />
                    <span>Đã báo cáo cấp trên</span>
                  </label>
                </div>
              )}
            </div>

            {/* Organization Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('organization')}
              >
                <span>Đơn vị</span>
                {expandedSections.includes('organization') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('organization') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.organizations.includes('Chi cục TP.HCM')}
                      onChange={() => toggleFilter('organizations', 'Chi cục TP.HCM')}
                    />
                    <span>Chi cục TP.HCM</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.organizations.includes('Chi cục Hà Nội')}
                      onChange={() => toggleFilter('organizations', 'Chi cục Hà Nội')}
                    />
                    <span>Chi cục Hà Nội</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.organizations.includes('Chi cục Đà Nẵng')}
                      onChange={() => toggleFilter('organizations', 'Chi cục Đà Nẵng')}
                    />
                    <span>Chi cục Đà Nẵng</span>
                  </label>
                </div>
              )}
            </div>

            {/* Area Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('area')}
              >
                <span>Địa bàn</span>
                {expandedSections.includes('area') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('area') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.areas.includes('TP.HCM')}
                      onChange={() => toggleFilter('areas', 'TP.HCM')}
                    />
                    <span>TP. Hồ Chí Minh</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.areas.includes('Hà Nội')}
                      onChange={() => toggleFilter('areas', 'Hà Nội')}
                    />
                    <span>Hà Nội</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.areas.includes('Đà Nẵng')}
                      onChange={() => toggleFilter('areas', 'Đà Nẵng')}
                    />
                    <span>Đà Nẵng</span>
                  </label>
                </div>
              )}
            </div>

            {/* Topic Filter */}
            <div className={styles.filterSection}>
              <button
                className={styles.filterSectionHeader}
                onClick={() => toggleSection('topic')}
              >
                <span>Loại vi phạm</span>
                {expandedSections.includes('topic') ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
              {expandedSections.includes('topic') && (
                <div className={styles.filterOptions}>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.topics.includes('An toàn thực phẩm')}
                      onChange={() => toggleFilter('topics', 'An toàn thực phẩm')}
                    />
                    <span>An toàn thực phẩm</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.topics.includes('Hàng giả')}
                      onChange={() => toggleFilter('topics', 'Hàng giả')}
                    />
                    <span>Hàng giả</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.topics.includes('Hàng kém chất lượng')}
                      onChange={() => toggleFilter('topics', 'Hàng kém chất lượng')}
                    />
                    <span>Hàng kém chất lượng</span>
                  </label>
                  <label className={styles.filterCheckbox}>
                    <input
                      type="checkbox"
                      checked={filters.topics.includes('Kinh doanh không phép')}
                      onChange={() => toggleFilter('topics', 'Kinh doanh không phép')}
                    />
                    <span>Kinh doanh không phép</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <ZoomableMapView>
            <div className={styles.mapBackground}>
              {/* OpenStreetMap Embedded - Full Vietnam with Real Streets */}
              <iframe
                className={styles.embeddedMap}
                src="https://www.openstreetmap.org/export/embed.html?bbox=102.1,8.5,109.5,23.5&layer=mapnik&marker=16.0,106.0"
                style={{ border: 0 }}
                title="Vietnam Map"
              />
              
              {/* Marker Overlay - sits on top of iframe */}
              <div className={styles.markerOverlay}>
                {/* Lead Markers - Render first (below teams) */}
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={styles.leadMarker}
                    style={{
                      top: lead.position.top,
                      left: lead.position.left,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLead(lead);
                      setSelectedTeam(null);
                    }}
                  >
                    <div
                      className={styles.leadDot}
                      style={{
                        width: getUrgencySize(lead.urgency),
                        height: getUrgencySize(lead.urgency),
                        background: getUrgencyColor(lead.urgency),
                      }}
                    />
                    
                    {/* Lead Tooltip */}
                    <div className={styles.leadTooltip}>
                      <div className={styles.leadId}>{lead.id}</div>
                      <div className={styles.leadTitle}>{lead.title}</div>
                      <div className={styles.leadMeta}>
                        <div className={styles.leadMetaRow}>
                          <span className={styles.leadLabel}>Mức độ khẩn:</span>
                          <span 
                            className={styles.leadUrgency}
                            style={{ color: getUrgencyColor(lead.urgency) }}
                          >
                            {lead.urgency.toUpperCase()}
                          </span>
                        </div>
                        <div className={styles.leadMetaRow}>
                          <span className={styles.leadLabel}>Trạng thái:</span>
                          <strong>
                            {lead.status === 'assigned' ? 'Đã giao' : 
                             lead.status === 'inVerification' ? 'Đang kiểm tra' : 'Đã báo cáo'}
                          </strong>
                        </div>
                        <div className={styles.leadMetaRow}>
                          <span className={styles.leadLabel}>Giao cho:</span>
                          <strong>{lead.assignedTo}</strong>
                        </div>
                        <div className={styles.leadMetaRow}>
                          <span className={styles.leadLabel}>Thời hạn:</span>
                          <strong style={{ 
                            color: lead.slaStatus === 'overdue' ? 'var(--chart-1)' : 
                                   lead.slaStatus === 'atRisk' ? 'var(--chart-2)' : 'inherit'
                          }}>
                            {lead.deadline}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Team Markers */}
                {filteredTeams.map((team) => {
                  const slaStatus = getTeamSLAStatus(team);
                  const color = getSLAColor(slaStatus);

                  return (
                    <div
                      key={team.id}
                      className={styles.teamMarker}
                      style={{
                        top: team.position.top,
                        left: team.position.left,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTeam(team);
                        setSelectedLead(null);
                      }}
                    >
                      <div className={styles.markerPin}>
                        <div className={styles.markerDot} style={{ background: color }}>
                          <Users size={18} color="white" />
                        </div>
                        <div className={styles.markerPulse} style={{ borderColor: color }} />
                      </div>

                      {/* Team Tooltip */}
                      <div className={styles.markerTooltip}>
                        <div className={styles.tooltipHeader}>
                          <strong>{team.name}</strong>
                          <span 
                            className={styles.tooltipBadge}
                            style={{ background: color }}
                          >
                            {team.compliance}%
                          </span>
                        </div>
                        <div className={styles.tooltipBody}>
                          <div className={styles.tooltipRow}>
                            <MapPin size={14} />
                            <span>{team.address}</span>
                          </div>
                          <div className={styles.tooltipRow}>
                            <Users size={14} />
                            <span>{team.activeMembers} thành viên</span>
                          </div>
                          <div className={styles.tooltipDivider} />
                          <div className={styles.tooltipStats}>
                            <div className={styles.tooltipStat}>
                              <span>Tổng:</span>
                              <span>{team.total}</span>
                            </div>
                            <div className={styles.tooltipStat}>
                              <span>Trong hạn:</span>
                              <span style={{ color: 'var(--chart-4)' }}>{team.withinSLA}</span>
                            </div>
                            <div className={styles.tooltipStat}>
                              <span>Sắp hạn:</span>
                              <span style={{ color: 'var(--chart-2)' }}>{team.atRisk}</span>
                            </div>
                            <div className={styles.tooltipStat}>
                              <span>Quá hạn:</span>
                              <span style={{ color: 'var(--chart-1)' }}>{team.breached}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className={styles.mapLegend}>
              <div className={styles.legendTitle}>Chú thích</div>
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={styles.legendIcon} style={{ background: 'var(--chart-4)' }} />
                  <span>Trong hạn (≥85%)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendIcon} style={{ background: 'var(--chart-2)' }} />
                  <span>Sắp hạn (70-85%)</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendIcon} style={{ background: 'var(--chart-1)' }} />
                  <span>Quá hạn (&lt;70%)</span>
                </div>
              </div>
              <div className={styles.legendDivider} />
              <div className={styles.legendItems}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ width: '16px', height: '16px', background: 'var(--chart-1)' }} />
                  <span>Critical</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ width: '12px', height: '12px', background: 'var(--chart-2)' }} />
                  <span>High</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ width: '10px', height: '10px', background: 'var(--chart-5)' }} />
                  <span>Medium</span>
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ width: '8px', height: '8px', background: 'var(--muted-foreground)' }} />
                  <span>Low</span>
                </div>
              </div>
            </div>

            {/* Results Counter */}
            <div className={styles.mapCounter}>
              <AlertCircle size={14} />
              <span>{filteredTeams.length} đội, {filteredLeads.length} tín hiệu</span>
            </div>
          </ZoomableMapView>
        </div>
      </div>
    </div>
  );
}