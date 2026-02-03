import { useState, useRef, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Target, 
  Store, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  UserCheck,
  FileCheck,
  Filter,
  X,
  Award,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import styles from './KpiQlttDashboard.module.css';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/components/ui/utils';
import { MarketAnalysisSections } from '../components/MarketAnalysisSections';
import InspectionDashboard from './InspectionDashboard';
import RiskDashboard from './RiskDashboard';
import FeedbackDashboard from './FeedbackDashboard';
import { 
  InspectionFilterPopup, 
  RiskFilterPopup, 
  FeedbackFilterPopup,
  type InspectionFilters as ImportedInspectionFilters,
  type RiskFilters as ImportedRiskFilters,
  type FeedbackFilters as ImportedFeedbackFilters
} from '../components/DashboardFilterPopups';

type TimeRange = '7' | '30' | '90';
type TabValue = 'market' | 'tasks' | 'teams' | 'inspection' | 'risk' | 'feedback';

// Filter Types
interface MarketFilters {
  industries: string[];
  businessTypes: string[];
  statuses: string[];
  districts: string[]; // Add district filter
}

interface TasksFilters {
  statuses: string[];
  teams: string[];
  priorities: string[];
}

interface TeamsFilters {
  teams: string[];
  teamStatuses: string[];
  performances: string[];
}

// Filter interfaces for remaining tabs  
type InspectionFilters = ImportedInspectionFilters;
type RiskFilters = ImportedRiskFilters;
type FeedbackFilters = ImportedFeedbackFilters;

// Raw Data Types
interface StoreData {
  id: number;
  name: string;
  industry: string;
  businessType: string;
  status: string;
  area: number;
  revenue: number;
  district: string;
}

interface TaskData {
  id: number;
  title: string;
  status: string;
  team: string;
  priority: string;
  daysOld: number;
  fine: number;
}

interface TeamData {
  team: string;
  tasks: number;
  completed: number;
  completionRate: number;
  avgTime: number;
  overdueRate: number;
  violations: number;
  fines: number;
}

// Mock Raw Data - Stores
const RAW_STORES: StoreData[] = [
  // Thực phẩm
  { id: 1, name: 'Cửa hàng Thực phẩm A', industry: 'Thực phẩm và đồ uống', businessType: 'Công ty TNHH', status: 'Đang hoạt động', area: 45, revenue: 180, district: 'Q1' },
  { id: 2, name: 'Cửa hàng Thực phẩm B', industry: 'Thực phẩm và đồ uống', businessType: 'Hộ kinh doanh cá thể', status: 'Đang hoạt động', area: 38, revenue: 150, district: 'Q1' },
  { id: 3, name: 'Cửa hàng Thực phẩm C', industry: 'Thực phẩm và đồ uống', businessType: 'Công ty cổ phần', status: 'Tạm ngừng hoạt động', area: 52, revenue: 220, district: 'Q2' },
  // ... nhiều store khác cho các ngành khác
  // Dược phẩm
  { id: 4, name: 'Nhà thuốc A', industry: 'Y tế', businessType: 'Doanh nghiệp tư nhân', status: 'Đang hoạt động', area: 35, revenue: 250, district: 'Q2' },
  { id: 5, name: 'Nhà thuốc B', industry: 'Y tế', businessType: 'Công ty TNHH', status: 'Đang hoạt động', area: 40, revenue: 280, district: 'Q3' },
  // Hàng tiêu dùng
  { id: 6, name: 'Cửa hàng Tiêu dùng A', industry: 'Bán lẻ', businessType: 'Hộ kinh doanh cá thể', status: 'Đang hoạt động', area: 28, revenue: 190, district: 'Q3' },
  { id: 7, name: 'Siêu thị Mini B', industry: 'Bán lẻ', businessType: 'Công ty TNHH', status: 'Đang hoạt động', area: 55, revenue: 320, district: 'Q4' },
  // Điện tử
  { id: 8, name: 'Cửa hàng Điện tử A', industry: 'Công nghệ', businessType: 'Công ty cổ phần', status: 'Đang hoạt động', area: 48, revenue: 420, district: 'Q4' },
  { id: 9, name: 'Cửa hàng Điện tử B', industry: 'Công nghệ', businessType: 'Công ty TNHH', status: 'Ngừng hoạt động', area: 35, revenue: 0, district: 'Q5' },
  // Thêm các stores khác
  { id: 10, name: 'Cửa hàng Thực phẩm D', industry: 'Thực phẩm và đồ uống', businessType: 'Công ty TNHH', status: 'Đang hoạt động', area: 42, revenue: 185, district: 'Q5' },
];

// Mock Raw Data - Tasks
const RAW_TASKS: TaskData[] = [
  { id: 1, title: 'Kiểm tra ATTP quán ăn', status: 'Mới', team: 'Đội 1', priority: 'Cao', daysOld: 2, fine: 0 },
  { id: 2, title: 'Thanh tra cửa hàng thuốc', status: 'Đang xử lý', team: 'Đội 2', priority: 'Khẩn cấp', daysOld: 5, fine: 15 },
  { id: 3, title: 'Xử lý vi phạm bản quyền', status: 'Đang xử lý', team: 'Đội 3', priority: 'Trung bình', daysOld: 12, fine: 25 },
  { id: 4, title: 'Kiểm tra giá cả siêu thị', status: 'Hoàn thành', team: 'Đội 1', priority: 'Thấp', daysOld: 3, fine: 10 },
  { id: 5, title: 'Thanh tra nhà hàng', status: 'Quá hạn', team: 'Đội 4', priority: 'Khẩn cấp', daysOld: 18, fine: 50 },
  { id: 6, title: 'Kiểm tra hàng giả', status: 'Hoàn thành', team: 'Đội 2', priority: 'Cao', daysOld: 4, fine: 30 },
  { id: 7, title: 'Xử lý khiếu nại người tiêu dùng', status: 'Đang xử lý', team: 'Đội 5', priority: 'Trung bình', daysOld: 8, fine: 0 },
  { id: 8, title: 'Thanh tra cửa hàng điện tử', status: 'Mới', team: 'Đội 3', priority: 'Cao', daysOld: 1, fine: 0 },
];

// Mock Raw Data - Teams  
const RAW_TEAMS: TeamData[] = [
  { team: 'Đội 1', tasks: 51, completed: 43, completionRate: 91.3, avgTime: 3.8, overdueRate: 15, violations: 102, fines: 25.5 },
  { team: 'Đội 2', tasks: 50, completed: 46, completionRate: 92.3, avgTime: 3.5, overdueRate: 28, violations: 187, fines: 42.3 },
  { team: 'Đội 3', tasks: 38, completed: 36, completionRate: 94.7, avgTime: 2.9, overdueRate: 22, violations: 98, fines: 18.7 },
  { team: 'Đội 4', tasks: 41, completed: 37, completionRate: 90.2, avgTime: 4.1, overdueRate: 31, violations: 156, fines: 35.2 },
  { team: 'Đội 5', tasks: 47, completed: 45, completionRate: 95.7, avgTime: 3.5, overdueRate: 26, violations: 134, fines: 24.1 },
];

const industryFilterOptions = [
  'Bán lẻ',
  'Thực phẩm và đồ uống',
  'Sản xuất',
  'Dịch vụ',
  'Công nghệ',
  'Giáo dục và đào tạo',
  'Y tế',
  'Xây dựng và bất động sản',
  'Nông nghiệp',
  'Năng lượng',
  'Vận tải và logistics',
  'Tài chính và bảo hiểm',
  'Quảng cáo và truyền thông',
  'Viễn thông',
  'Thời trang và mỹ phẩm',
  'Nghệ thuật và giải trí',
  'Các lĩnh vực khác'
];

// District options for analysis filters
const districtOptions = [
  'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10', 'Q11', 'Q12',
  'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Tân Bình', 'Quận Phú Nhuận'
];

// Industry standards data - chuẩn cho từng ngành
interface IndustryStandard {
  industry: string;
  requiredArea: number; // Diện tích tối thiểu (m²)
  optimalDensity: number; // Mật độ tối ưu (cửa hàng/1000 dân)
  avgRevenue: number; // Doanh thu trung bình kỳ vọng (triệu đồng)
}

const INDUSTRY_STANDARDS: IndustryStandard[] = [
  { industry: 'Thực phẩm và đồ uống', requiredArea: 45, optimalDensity: 0.40, avgRevenue: 180 },
  { industry: 'Y tế', requiredArea: 35, optimalDensity: 0.20, avgRevenue: 260 },
  { industry: 'Bán lẻ', requiredArea: 40, optimalDensity: 0.35, avgRevenue: 200 },
  { industry: 'Công nghệ', requiredArea: 30, optimalDensity: 0.18, avgRevenue: 350 },
  { industry: 'Dịch vụ', requiredArea: 25, optimalDensity: 0.25, avgRevenue: 150 },
  { industry: 'Thời trang và mỹ phẩm', requiredArea: 35, optimalDensity: 0.30, avgRevenue: 220 },
];

export default function KpiQlttDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const [activeTab, setActiveTab] = useState<TabValue>('market');
  const [showFilters, setShowFilters] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterPopupRef = useRef<HTMLDivElement>(null);

  // Filter States for each tab
  const [marketFilters, setMarketFilters] = useState<MarketFilters>({
    industries: [],
    businessTypes: [],
    statuses: [],
    districts: []
  });

  const [tasksFilters, setTasksFilters] = useState<TasksFilters>({
    statuses: [],
    teams: [],
    priorities: []
  });

  const [teamsFilters, setTeamsFilters] = useState<TeamsFilters>({
    teams: [],
    teamStatuses: [],
    performances: []
  });

  const [inspectionFilters, setInspectionFilters] = useState<InspectionFilters>({
    dateFrom: '',
    dateTo: '',
    teams: [],
    violationTypes: []
  });

  const [riskFilters, setRiskFilters] = useState<RiskFilters>({
    violationCategories: [],
    riskStatuses: [],
    businessTypes: [],
    industries: []
  });

  const [feedbackFilters, setFeedbackFilters] = useState<FeedbackFilters>({
    sourceTypes: [],
    processingStatuses: [],
    updatePeriods: []
  });

  const tabs = [
    { value: 'market' as TabValue, label: 'Dashboard Thị trường', icon: <Store className="w-4 h-4" /> },
    { value: 'tasks' as TabValue, label: 'Dashboard Thực thi nhiệm vụ', icon: <Target className="w-4 h-4" /> },
    { value: 'teams' as TabValue, label: 'Dashboard Đội QLTT', icon: <Users className="w-4 h-4" /> },
    { value: 'inspection' as TabValue, label: 'Dashboard Kiểm tra', icon: <FileCheck className="w-4 h-4" /> },
    { value: 'risk' as TabValue, label: 'Dashboard Rủi ro', icon: <ShieldAlert className="w-4 h-4" /> },
    { value: 'feedback' as TabValue, label: 'Dashboard Nguồn tin', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  // Count active filters
  const getActiveFilterCount = () => {
    if (activeTab === 'market') {
      return marketFilters.industries.length + marketFilters.businessTypes.length + marketFilters.statuses.length + marketFilters.districts.length;
    } else if (activeTab === 'tasks') {
      return tasksFilters.statuses.length + tasksFilters.teams.length + tasksFilters.priorities.length;
    } else if (activeTab === 'teams') {
      return teamsFilters.teams.length + teamsFilters.teamStatuses.length + teamsFilters.performances.length;
    } else if (activeTab === 'inspection') {
      const dateCount = (inspectionFilters.dateFrom ? 1 : 0) + (inspectionFilters.dateTo ? 1 : 0);
      return dateCount + inspectionFilters.teams.length + inspectionFilters.violationTypes.length;
    } else if (activeTab === 'risk') {
      return riskFilters.violationCategories.length + riskFilters.riskStatuses.length + riskFilters.businessTypes.length + riskFilters.industries.length;
    } else if (activeTab === 'feedback') {
      return feedbackFilters.sourceTypes.length + feedbackFilters.processingStatuses.length + feedbackFilters.updatePeriods.length;
    }
    return 0;
  };

  const activeFilterCount = getActiveFilterCount();

  // Get active filter labels
  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    if (activeTab === 'market') {
      labels.push(...marketFilters.industries);
      labels.push(...marketFilters.businessTypes);
      labels.push(...marketFilters.statuses);
      labels.push(...marketFilters.districts);
    } else if (activeTab === 'tasks') {
      labels.push(...tasksFilters.statuses);
      labels.push(...tasksFilters.teams);
      labels.push(...tasksFilters.priorities);
    } else if (activeTab === 'teams') {
      labels.push(...teamsFilters.teams);
      labels.push(...teamsFilters.teamStatuses);
      labels.push(...teamsFilters.performances);
    } else if (activeTab === 'inspection') {
      if (inspectionFilters.dateFrom) labels.push(`Từ ${inspectionFilters.dateFrom}`);
      if (inspectionFilters.dateTo) labels.push(`Đến ${inspectionFilters.dateTo}`);
      labels.push(...inspectionFilters.teams);
      labels.push(...inspectionFilters.violationTypes);
    } else if (activeTab === 'risk') {
      labels.push(...riskFilters.violationCategories);
      labels.push(...riskFilters.riskStatuses);
      labels.push(...riskFilters.businessTypes);
      labels.push(...riskFilters.industries);
    } else if (activeTab === 'feedback') {
      labels.push(...feedbackFilters.sourceTypes);
      labels.push(...feedbackFilters.processingStatuses);
      labels.push(...feedbackFilters.updatePeriods);
    }
    return labels;
  };

  // Handle clear all filters
  const handleClearAllFilters = () => {
    if (activeTab === 'market') {
      setMarketFilters({ industries: [], businessTypes: [], statuses: [], districts: [] });
    } else if (activeTab === 'tasks') {
      setTasksFilters({ statuses: [], teams: [], priorities: [] });
    } else if (activeTab === 'teams') {
      setTeamsFilters({ teams: [], teamStatuses: [], performances: [] });
    } else if (activeTab === 'inspection') {
      setInspectionFilters({ dateFrom: '', dateTo: '', teams: [], violationTypes: [] });
    } else if (activeTab === 'risk') {
      setRiskFilters({ violationCategories: [], riskStatuses: [], businessTypes: [], industries: [] });
    } else if (activeTab === 'feedback') {
      setFeedbackFilters({ sourceTypes: [], processingStatuses: [], updatePeriods: [] });
    }
  };

  // Handle remove individual filter
  const handleRemoveFilter = (filterValue: string) => {
    if (activeTab === 'market') {
      setMarketFilters({
        industries: marketFilters.industries.filter(v => v !== filterValue),
        businessTypes: marketFilters.businessTypes.filter(v => v !== filterValue),
        statuses: marketFilters.statuses.filter(v => v !== filterValue),
        districts: marketFilters.districts.filter(v => v !== filterValue)
      });
    } else if (activeTab === 'tasks') {
      setTasksFilters({
        statuses: tasksFilters.statuses.filter(v => v !== filterValue),
        teams: tasksFilters.teams.filter(v => v !== filterValue),
        priorities: tasksFilters.priorities.filter(v => v !== filterValue),
      });
    } else if (activeTab === 'teams') {
      setTeamsFilters({
        teams: teamsFilters.teams.filter(v => v !== filterValue),
        teamStatuses: teamsFilters.teamStatuses.filter(v => v !== filterValue),
        performances: teamsFilters.performances.filter(v => v !== filterValue),
      });
    } else if (activeTab === 'inspection') {
      // Handle date filters
      if (filterValue.startsWith('Từ ')) {
        setInspectionFilters({ ...inspectionFilters, dateFrom: '' });
      } else if (filterValue.startsWith('Đến ')) {
        setInspectionFilters({ ...inspectionFilters, dateTo: '' });
      } else {
        setInspectionFilters({
          ...inspectionFilters,
          teams: inspectionFilters.teams.filter(v => v !== filterValue),
          violationTypes: inspectionFilters.violationTypes.filter(v => v !== filterValue),
        });
      }
    } else if (activeTab === 'risk') {
      setRiskFilters({
        violationCategories: riskFilters.violationCategories.filter(v => v !== filterValue),
        riskStatuses: riskFilters.riskStatuses.filter(v => v !== filterValue),
        businessTypes: riskFilters.businessTypes.filter(v => v !== filterValue),
        industries: riskFilters.industries.filter(v => v !== filterValue),
      });
    } else if (activeTab === 'feedback') {
      setFeedbackFilters({
        sourceTypes: feedbackFilters.sourceTypes.filter(v => v !== filterValue),
        processingStatuses: feedbackFilters.processingStatuses.filter(v => v !== filterValue),
        updatePeriods: feedbackFilters.updatePeriods.filter(v => v !== filterValue),
      });
    }
  };

  // Close filter popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showFilters &&
        filterPopupRef.current &&
        filterButtonRef.current &&
        !filterPopupRef.current.contains(event.target as Node) &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard KPI QLTT</h1>
          <p className={styles.pageSubtitle}>Tổng hợp chỉ số hiệu suất quản lý thị trường</p>
        </div>
        
        <div className={styles.timeFilter}>
          <Button
            variant={timeRange === '7' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7')}
          >
            7 ngày
          </Button>
          <Button
            variant={timeRange === '30' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30')}
          >
            30 ngày
          </Button>
          <Button
            variant={timeRange === '90' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90')}
          >
            90 ngày
          </Button>
        </div>
      </div>

      {/* Tabs Navigation with Filter Button */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabsHeader}>
          <div className={styles.tabsList}>
            {tabs.map((tab) => (
              <button
                key={tab.value}
                className={cn(
                  styles.tabButton,
                  activeTab === tab.value && styles.tabButtonActive
                )}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          
          {/* Filter Toggle Button */}
          <div className={styles.filterButtonWrapper}>
            <button
              ref={filterButtonRef}
              className={cn(styles.filterToggle, (showFilters || activeFilterCount > 0) && styles.filterToggleActive)}
              onClick={() => setShowFilters(!showFilters)}
              title="Bộ lọc"
            >
              {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
              <span>Bộ lọc</span>
              {activeFilterCount > 0 && (
                <span className={styles.filterBadge}>{activeFilterCount}</span>
              )}
            </button>

            {/* Filter Popup */}
            {showFilters && (
              <div ref={filterPopupRef} className={styles.filterPopup}>
                {activeTab === 'market' && (
                  <MarketFilterPopup
                    filters={marketFilters}
                    onFiltersChange={setMarketFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
                {activeTab === 'tasks' && (
                  <TasksFilterPopup
                    filters={tasksFilters}
                    onFiltersChange={setTasksFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
                {activeTab === 'teams' && (
                  <TeamsFilterPopup
                    filters={teamsFilters}
                    onFiltersChange={setTeamsFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
                {activeTab === 'inspection' && (
                  <InspectionFilterPopup
                    filters={inspectionFilters}
                    onFiltersChange={setInspectionFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
                {activeTab === 'risk' && (
                  <RiskFilterPopup
                    filters={riskFilters}
                    onFiltersChange={setRiskFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
                {activeTab === 'feedback' && (
                  <FeedbackFilterPopup
                    filters={feedbackFilters}
                    onFiltersChange={setFeedbackFilters}
                    onClose={() => setShowFilters(false)}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className={styles.activeFiltersBar}>
            <span className={styles.activeFiltersLabel}>Đang lọc theo:</span>
            <div className={styles.activeFiltersList}>
              {getActiveFilterLabels().map((label) => (
                <div key={label} className={styles.activeFilterBadge}>
                  <span>{label}</span>
                  <button
                    className={styles.removeFilterBtn}
                    onClick={() => handleRemoveFilter(label)}
                    aria-label={`Xóa filter ${label}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                className={styles.clearAllFiltersBtn}
                onClick={handleClearAllFilters}
              >
                <X className="w-4 h-4" />
                Xóa tất cả
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'market' && <MarketDashboard timeRange={timeRange} filters={marketFilters} />}
      {activeTab === 'tasks' && <TasksDashboard timeRange={timeRange} filters={tasksFilters} />}
      {activeTab === 'teams' && <TeamsDashboard timeRange={timeRange} filters={teamsFilters} />}
      {activeTab === 'inspection' && <InspectionDashboard timeRange={timeRange} />}
      {activeTab === 'risk' && <RiskDashboard timeRange={timeRange} />}
      {activeTab === 'feedback' && <FeedbackDashboard timeRange={timeRange} />}
    </div>
  );
}

// Tab 1: Market Dashboard Component
function MarketDashboard({ timeRange, filters }: { timeRange: TimeRange; filters: MarketFilters }) {
  // Filter stores based on active filters
  const filteredStores = useMemo(() => {
    let stores = [...RAW_STORES];
    
    // Filter by industries
    if (filters.industries.length > 0) {
      stores = stores.filter(store => filters.industries.includes(store.industry));
    }
    
    // Filter by business types
    if (filters.businessTypes.length > 0) {
      stores = stores.filter(store => filters.businessTypes.includes(store.businessType));
    }
    
    // Filter by statuses
    if (filters.statuses.length > 0) {
      stores = stores.filter(store => filters.statuses.includes(store.status));
    }
    
    // Filter by districts
    if (filters.districts.length > 0) {
      stores = stores.filter(store => filters.districts.includes(store.district));
    }
    
    return stores;
  }, [filters]);

  // Calculate KPIs from filtered data
  const totalStores = filteredStores.length;
  const totalArea = filteredStores.reduce((sum, store) => sum + store.area, 0);
  const totalRevenue = filteredStores.reduce((sum, store) => sum + store.revenue, 0);
  const avgArea = totalStores > 0 ? (totalArea / totalStores).toFixed(1) : '0';
  const avgRevenue = totalStores > 0 ? (totalRevenue / totalStores).toFixed(1) : '0';

  // Calculate store distribution by industry
  const storeDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    filteredStores.forEach(store => {
      distribution[store.industry] = (distribution[store.industry] || 0) + 1;
    });
    
    // Map to chart format
    const colors = ['#695cfb', '#0fc87a', '#f7a23b', '#f94144', '#4ecdc4'];
    return Object.entries(distribution).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [filteredStores]);

  // Calculate revenue by district
  const revenueByDistrict = useMemo(() => {
    const districtRevenue: { [key: string]: number } = {};
    filteredStores.forEach(store => {
      districtRevenue[store.district] = (districtRevenue[store.district] || 0) + store.revenue;
    });
    
    return Object.entries(districtRevenue)
      .map(([district, revenue]) => ({ district, revenue: parseFloat((revenue / 1000).toFixed(1)) }))
      .sort((a, b) => a.district.localeCompare(b.district));
  }, [filteredStores]);

  return (
    <div className={styles.tabContent}>
      {/* KPI Section 1: Chỉ số dân cư & cửa hàng */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionSubtitle}>Chỉ số cơ bản địa bàn</h3>
      </div>
      <div className={styles.kpiGridCompact}>
        <KpiCard
          title="Tổng dân số địa bàn"
          value="1.245.678"
          unit="người"
          icon={<Users className="w-5 h-5" />}
          trend={2.3}
        />
        
        <KpiCard
          title="Mật độ dân cư"
          value="12.456"
          unit="người/km²"
          icon={<Target className="w-5 h-5" />}
          trend={1.8}
        />
        
        <KpiCard
          title="Tổng số cửa hàng"
          value={totalStores.toString()}
          unit="cửa hàng"
          icon={<Store className="w-5 h-5" />}
          trend={5.2}
          status="success"
        />
        
        <KpiCard
          title="Mật độ cửa hàng"
          value={(totalStores / 1245.678).toFixed(2)}
          unit="/ 1,000 dân"
          icon={<Target className="w-5 h-5" />}
        />
      </div>

      {/* KPI Section 2: Diện tích & Doanh thu */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionSubtitle}>Chỉ số kinh doanh</h3>
      </div>
      <div className={styles.kpiGridCompact}>
        <KpiCard
          title="Tổng diện tích kinh doanh"
          value={totalArea.toLocaleString()}
          unit="m²"
          icon={<Store className="w-5 h-5" />}
          trend={3.4}
        />
        
        <KpiCard
          title="Diện tích TB/cửa hàng"
          value={avgArea}
          unit="m²"
          icon={<Target className="w-5 h-5" />}
          trend={-2.1}
          status="warning"
        />
        
        <KpiCard
          title="Tổng doanh thu khai báo"
          value={(totalRevenue / 1000).toFixed(1)}
          unit="tỷ đồng"
          icon={<DollarSign className="w-5 h-5" />}
          trend={8.5}
          status="success"
        />
        
        <KpiCard
          title="Doanh thu TB/cửa hàng"
          value={avgRevenue}
          unit="triệu đồng"
          icon={<DollarSign className="w-5 h-5" />}
          trend={6.2}
          status="success"
        />
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Store Distribution by Industry */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Phân bố cửa hàng theo ngành</h3>
          {storeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={storeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {storeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
        </div>

        {/* Revenue by District */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Doanh thu theo địa bàn (tỷ đồng)</h3>
          {revenueByDistrict.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByDistrict}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="district" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
        </div>
      </div>

      {/* Dynamic Analysis Sections with Filters */}
      <MarketAnalysisSections 
        stores={filteredStores} 
        hasActiveFilters={
          filters.industries.length > 0 || 
          filters.businessTypes.length > 0 || 
          filters.statuses.length > 0 ||
          filters.districts.length > 0
        }
      />
    </div>
  );
}

// Tab 2: Tasks Dashboard Component
function TasksDashboard({ timeRange, filters }: { timeRange: TimeRange; filters: TasksFilters }) {
  // Filter tasks based on active filters
  const filteredTasks = useMemo(() => {
    let tasks = [...RAW_TASKS];
    
    // Filter by statuses
    if (filters.statuses.length > 0) {
      tasks = tasks.filter(task => filters.statuses.includes(task.status));
    }
    
    // Filter by teams
    if (filters.teams.length > 0) {
      tasks = tasks.filter(task => filters.teams.includes(task.team));
    }
    
    // Filter by priorities
    if (filters.priorities.length > 0) {
      tasks = tasks.filter(task => filters.priorities.includes(task.priority));
    }
    
    return tasks;
  }, [filters]);

  // Calculate KPIs from filtered data
  const tasksInProgress = filteredTasks.filter(t => t.status === 'Đang xử lý').length;
  const tasksCompleted = filteredTasks.filter(t => t.status === 'Hoàn thành').length;
  const tasksOverdue = filteredTasks.filter(t => t.status === 'Quá hạn').length;
  const totalFines = filteredTasks.reduce((sum, t) => sum + t.fine, 0);

  // Calculate task status distribution
  const taskStatusData = useMemo(() => {
    const statusCount: { [key: string]: number } = {};
    filteredTasks.forEach(task => {
      statusCount[task.status] = (statusCount[task.status] || 0) + 1;
    });
    
    const statusColors: { [key: string]: string } = {
      'Mới': '#695cfb',
      'Đang xử lý': '#f7a23b',
      'Hoàn thành': '#0fc87a',
      'Quá hạn': '#f94144',
    };
    
    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      color: statusColors[name] || '#695cfb'
    }));
  }, [filteredTasks]);

  // Calculate task aging data
  const taskAgingData = useMemo(() => {
    const agingGroups = {
      '≤ 3 ngày': 0,
      '4-7 ngày': 0,
      '8-15 ngày': 0,
      '> 15 ngày': 0,
    };
    
    filteredTasks.forEach(task => {
      if (task.daysOld <= 3) agingGroups['≤ 3 ngày']++;
      else if (task.daysOld <= 7) agingGroups['4-7 ngày']++;
      else if (task.daysOld <= 15) agingGroups['8-15 ngày']++;
      else agingGroups['> 15 ngày']++;
    });
    
    return [
      { period: '≤ 3 ngày', count: agingGroups['≤ 3 ngày'], color: '#0fc87a' },
      { period: '4-7 ngày', count: agingGroups['4-7 ngày'], color: '#f7a23b' },
      { period: '8-15 ngày', count: agingGroups['8-15 ngày'], color: '#f94144' },
      { period: '> 15 ngày', count: agingGroups['> 15 ngày'], color: '#f94144' },
    ];
  }, [filteredTasks]);

  return (
    <div className={styles.tabContent}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard
          title="Nhiệm vụ đang xử lý"
          value={tasksInProgress.toString()}
          unit="nhiệm vụ"
          icon={<Clock className="w-5 h-5" />}
          trend={-5.2}
          status="warning"
        />
        
        <KpiCard
          title="Nhiệm vụ hoàn thành"
          value={tasksCompleted.toString()}
          unit="nhiệm vụ"
          icon={<CheckCircle className="w-5 h-5" />}
          trend={12.8}
          status="success"
        />
        
        <KpiCard
          title="Nhiệm vụ quá hạn"
          value={tasksOverdue.toString()}
          unit="nhiệm vụ"
          icon={<AlertCircle className="w-5 h-5" />}
          trend={-15.4}
          status="danger"
        />
        
        <KpiCard
          title="Tổng số tiền phạt"
          value={totalFines.toFixed(1)}
          unit="triệu đồng"
          icon={<DollarSign className="w-5 h-5" />}
          trend={18.3}
          status="success"
        />
      </div>

      {/* Chart Section - Only Task Status */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Trạng thái nhiệm vụ</h3>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Nhiệm vụ tồn theo thời gian xử lý (Aging)</h3>
          <p className={styles.chartSubtitle}>
            Phân tích độ tuổi nhiệm vụ để phát hiện nhiệm vụ bị "ngâm" và cần đôn đốc
          </p>
          {taskAgingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskAgingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="period" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill="#695cfb" name="Số nhiệm vụ" radius={[8, 8, 0, 0]}>
                  {taskAgingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
          
          {/* Aging Analysis Summary */}
          <div className={styles.agingAnalysis}>
            <div className={styles.agingItem}>
              <span className={cn(styles.agingDot, styles.agingNormal)}></span>
              <span className={styles.agingLabel}>≤ 3 ngày: Trong hạn xử lý</span>
            </div>
            <div className={styles.agingItem}>
              <span className={cn(styles.agingDot, styles.agingWarning)}></span>
              <span className={styles.agingLabel}>4-7 ngày: Cần theo dõi</span>
            </div>
            <div className={styles.agingItem}>
              <span className={cn(styles.agingDot, styles.agingCritical)}></span>
              <span className={styles.agingLabel}>8-15 ngày: Cần đôn đốc</span>
            </div>
            <div className={styles.agingItem}>
              <span className={cn(styles.agingDot, styles.agingOverdue)}></span>
              <span className={styles.agingLabel}>{'>'} 15 ngày: Cần xử lý khẩn cấp</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Analysis */}
      <div className={styles.analysisCard}>
        <h3 className={styles.sectionTitle}>Đánh giá tiến độ xử lý</h3>
        <div className={styles.progressStats}>
          <div className={styles.progressItem}>
            <FileCheck className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            <div className={styles.progressContent}>
              <span className={styles.progressLabel}>Thời gian xử lý trung bình</span>
              <span className={styles.progressValue}>3.5 ngày</span>
            </div>
          </div>
          
          <div className={styles.progressItem}>
            <CheckCircle className="w-5 h-5" style={{ color: '#0fc87a' }} />
            <div className={styles.progressContent}>
              <span className={styles.progressLabel}>Tỷ lệ hoàn thành đúng hạn</span>
              <span className={styles.progressValue}>91.2%</span>
            </div>
          </div>
          
          <div className={styles.progressItem}>
            <AlertCircle className="w-5 h-5" style={{ color: '#f94144' }} />
            <div className={styles.progressContent}>
              <span className={styles.progressLabel}>Tỷ lệ nhiệm vụ quá hạn</span>
              <span className={styles.progressValue}>5.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab 3: Teams Dashboard Component
function TeamsDashboard({ timeRange, filters }: { timeRange: TimeRange; filters: TeamsFilters }) {
  // Filter teams based on active filters
  const filteredTeams = useMemo(() => {
    let teams = [...RAW_TEAMS];
    
    // Filter by team names
    if (filters.teams.length > 0) {
      teams = teams.filter(team => filters.teams.includes(team.team));
    }
    
    // Filter by team statuses - simplified logic
    if (filters.teamStatuses.length > 0) {
      teams = teams.filter(team => {
        const status = team.overdueRate > 30 ? 'Quá tải' : team.overdueRate < 15 ? 'Nhàn rỗi' : 'Cân bằng';
        return filters.teamStatuses.includes(status);
      });
    }
    
    // Filter by performance
    if (filters.performances.length > 0) {
      teams = teams.filter(team => {
        const perf = team.completionRate >= 95 ? 'Xuất sắc (>95%)' :
                     team.completionRate >= 85 ? 'Tốt (85-95%)' :
                     team.completionRate >= 70 ? 'Trung bình (70-85%)' :
                     'Cần cải thiện (<70%)';
        return filters.performances.includes(perf);
      });
    }
    
    return teams;
  }, [filters]);

  // Calculate KPIs from filtered data
  const totalTeams = filteredTeams.length;
  const avgTasks = totalTeams > 0 ? (filteredTeams.reduce((sum, t) => sum + t.tasks, 0) / totalTeams).toFixed(1) : '0';
  const avgPerformance = totalTeams > 0 ? (filteredTeams.reduce((sum, t) => sum + t.completionRate, 0) / totalTeams).toFixed(1) : '0';
  const avgTime = totalTeams > 0 ? (filteredTeams.reduce((sum, t) => sum + t.avgTime, 0) / totalTeams).toFixed(1) : '0';

  return (
    <div className={styles.tabContent}>
      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KpiCard
          title="Tổng số đội QLTT"
          value={totalTeams.toString()}
          unit="đội"
          icon={<Users className="w-5 h-5" />}
          status="default"
        />
        
        <KpiCard
          title="Nhiệm vụ trung bình/đội"
          value={avgTasks}
          unit="nhiệm vụ"
          icon={<FileCheck className="w-5 h-5" />}
          trend={3.2}
        />
        
        <KpiCard
          title="Hiệu suất trung bình"
          value={avgPerformance}
          unit="%"
          icon={<Award className="w-5 h-5" />}
          trend={5.8}
          status="success"
        />
        
        <KpiCard
          title="Thời gian xử lý TB"
          value={avgTime}
          unit="ngày"
          icon={<Clock className="w-5 h-5" />}
          trend={-8.2}
        />
      </div>

      {/* Team Performance Table */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>So sánh hiệu suất giữa các đội</h3>
        {filteredTeams.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.performanceTable}>
              <thead>
                <tr>
                  <th>Đội</th>
                  <th>Nhiệm vụ hoàn thành / Tổng (nghiệp vụ)</th>
                  <th>Tỷ lệ hoàn thành (%)</th>
                  <th>Thời gian xử lý TB (ngày)</th>
                  <th>Tỉ lệ quá hạn (%)</th>
                  <th>Số vi phạm phát hiện</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeams.map((team, index) => {
                  const isOverloaded = team.overdueRate > 30;
                  const isEfficient = team.completionRate >= 95;
                  
                  let status = 'Cần bằng';
                  let statusClass = styles.statusBalanced;
                  
                  if (isEfficient && team.avgTime < 3.0) {
                    status = 'Nhanh rồi';
                    statusClass = styles.statusEfficient;
                  } else if (!isEfficient || team.overdueRate > 25) {
                    status = 'Cần bằng';
                    statusClass = styles.statusBalanced;
                  }
                  
                  return (
                    <tr key={index}>
                      <td className={styles.teamName}>{team.team}</td>
                      <td>
                        <span className={styles.taskRatio}>
                          {team.completed} / {team.tasks}
                        </span>
                      </td>
                      <td>
                        <span className={styles.completionRate}>{team.completionRate}%</span>
                      </td>
                      <td>{team.avgTime}</td>
                      <td>{team.overdueRate}</td>
                      <td>{team.violations}</td>
                      <td>
                        <span className={cn(styles.statusBadge, statusClass)}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
        )}
      </div>

      {/* Team Workload Chart */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Khối lượng công việc theo đội</h3>
          {filteredTeams.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredTeams}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="team" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Bar dataKey="tasks" fill="#695cfb" name="Tổng nhiệm vụ" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#0fc87a" name="Hoàn thành" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Kết quả xử lý theo đội</h3>
          {filteredTeams.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredTeams}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="team" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)'
                  }}
                />
                <Legend />
                <Bar dataKey="violations" fill="#f94144" name="Vi phạm" radius={[8, 8, 0, 0]} />
                <Bar dataKey="fines" fill="#f7a23b" name="Tiền phạt (tr.đ)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.noDataMessage}>Không có dữ liệu phù hợp với bộ lọc</div>
          )}
        </div>
      </div>
    </div>
  );
}

interface KpiCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: number;
  icon: React.ReactNode;
  sparklineData?: { value: number }[];
  sparklineColor?: string;
  status?: 'default' | 'success' | 'warning' | 'danger';
}

function KpiCard({ title, value, unit, trend, icon, sparklineData, sparklineColor, status = 'default' }: KpiCardProps) {
  const hasSparkline = sparklineData && sparklineColor;
  const hasTrend = trend !== undefined;
  const isPositive = trend && trend > 0;
  
  const statusColors = {
    default: '',
    success: '#10ca7a',
    warning: '#f7a23b',
    danger: '#f94144',
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiHeader}>
        <div className={styles.kpiTitleRow}>
          <div className={styles.kpiIcon} style={{ color: statusColors[status] || 'var(--primary)' }}>
            {icon}
          </div>
          <span className={styles.kpiTitle}>{title}</span>
        </div>
        {hasTrend && (
          <span className={cn(styles.kpiTrend, isPositive ? styles.trendUp : styles.trendDown)}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <div className={styles.kpiValue}>
        <span className={styles.kpiNumber}>{value}</span>
        <span className={styles.kpiUnit}>{unit}</span>
      </div>

      {hasSparkline && (
        <div className={styles.sparklineContainer}>
          <ResponsiveContainer width="100%" height={50}>
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={sparklineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// Filter Popups with Controlled State
interface MarketFilterPopupProps {
  filters: MarketFilters;
  onFiltersChange: (filters: MarketFilters) => void;
  onClose: () => void;
}

function MarketFilterPopup({ filters, onFiltersChange, onClose }: MarketFilterPopupProps) {
  const [tempFilters, setTempFilters] = useState<MarketFilters>(filters);

  const businessTypeOptions = [
    'Hộ kinh doanh cá thể',
    'Doanh nghiệp tư nhân',
    'Công ty TNHH',
  ];
  const statusOptions = ['Đang hoạt động', 'Tạm ngừng hoạt động', 'Ngừng hoạt động'];

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearAll = () => {
    const emptyFilters = { industries: [], businessTypes: [], statuses: [], districts: [] };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <>
      {/* Header */}
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button 
          className={styles.filterCloseBtn}
          onClick={onClose}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={styles.filterPopupContent}>
        <MultiSelect
          label="Ngành hàng"
          options={industryFilterOptions}
          selectedValues={tempFilters.industries}
          onChange={(values) => setTempFilters({ ...tempFilters, industries: values })}
          placeholder="Chọn ngành hàng"
          allOptionLabel="Tất cả ngành"
        />
        
        <MultiSelect
          label="Loại hình kinh doanh"
          options={businessTypeOptions}
          selectedValues={tempFilters.businessTypes}
          onChange={(values) => setTempFilters({ ...tempFilters, businessTypes: values })}
          placeholder="Chọn loại hình"
          allOptionLabel="Tất cả loại hình"
        />
        
        <MultiSelect
          label="Trạng thái hoạt động"
          options={statusOptions}
          selectedValues={tempFilters.statuses}
          onChange={(values) => setTempFilters({ ...tempFilters, statuses: values })}
          placeholder="Chọn trạng thái"
          allOptionLabel="Tất cả trạng thái"
        />
        
        <MultiSelect
          label="Quận/Huyện"
          options={districtOptions}
          selectedValues={tempFilters.districts}
          onChange={(values) => setTempFilters({ ...tempFilters, districts: values })}
          placeholder="Chọn quận/huyện"
          allOptionLabel="Tất cả quận/huyện"
        />
      </div>

      {/* Footer */}
      <div className={styles.filterPopupFooter}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
        >
          Xóa bộ lọc
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleApply}
        >
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}

interface TasksFilterPopupProps {
  filters: TasksFilters;
  onFiltersChange: (filters: TasksFilters) => void;
  onClose: () => void;
}

function TasksFilterPopup({ filters, onFiltersChange, onClose }: TasksFilterPopupProps) {
  const [selectedStatus, setSelectedStatus] = useState('Tất cả trạng thái');
  const [selectedTeam, setSelectedTeam] = useState('Tất cả đội');
  const [selectedPriority, setSelectedPriority] = useState('Tất cả mức độ');

  const taskStatusOptions = ['Tất cả trạng thái', 'Mới', 'Đang xử lý', 'Hoàn thành', 'Quá hạn'];
  const teamOptions = ['Tất cả đội', 'Đội 1', 'Đội 2', 'Đội 3', 'Đội 4', 'Đội 5'];
  const priorityOptions = ['Tất cả mức độ', 'Khẩn cấp', 'Cao', 'Trung bình', 'Thấp'];

  const handleClearAll = () => {
    setSelectedStatus('Tất cả trạng thái');
    setSelectedTeam('Tất cả đội');
    setSelectedPriority('Tất cả mức độ');
  };

  return (
    <>
      {/* Header */}
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button 
          className={styles.filterCloseBtn}
          onClick={onClose}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={styles.filterPopupContent}>
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Trạng thái</label>
          <select 
            className={styles.filterSelect}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {taskStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Đội thực hiện</label>
          <select 
            className={styles.filterSelect}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teamOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Mức độ ưu tiên</label>
          <select 
            className={styles.filterSelect}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.filterPopupFooter}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
        >
          <X className="w-4 h-4" />
          Xóa tất cả
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
        >
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}

interface TeamsFilterPopupProps {
  filters: TeamsFilters;
  onFiltersChange: (filters: TeamsFilters) => void;
  onClose: () => void;
}

function TeamsFilterPopup({ filters, onFiltersChange, onClose }: TeamsFilterPopupProps) {
  const [selectedTeam, setSelectedTeam] = useState('Tất cả đội');
  const [selectedTeamStatus, setSelectedTeamStatus] = useState('Tất cả trạng thái');
  const [selectedPerformance, setSelectedPerformance] = useState('Tất cả mức độ');

  const teamOptions = ['Tất cả đội', 'Đội 1', 'Đội 2', 'Đội 3', 'Đội 4', 'Đội 5'];
  const teamStatusOptions = ['Tất cả trạng thái', 'Quá tải', 'Cân bằng', 'Nhàn rỗi'];
  const performanceOptions = ['Tất cả mức độ', 'Xuất sắc (>95%)', 'Tốt (85-95%)', 'Trung bình (70-85%)', 'Cần cải thiện (<70%)'];

  const handleClearAll = () => {
    setSelectedTeam('Tất cả đội');
    setSelectedTeamStatus('Tất cả trạng thái');
    setSelectedPerformance('Tất cả mức độ');
  };

  return (
    <>
      {/* Header */}
      <div className={styles.filterPopupHeader}>
        <h3 className={styles.filterPopupTitle}>Bộ lọc nâng cao</h3>
        <button 
          className={styles.filterCloseBtn}
          onClick={onClose}
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className={styles.filterPopupContent}>
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Đội QLTT</label>
          <select 
            className={styles.filterSelect}
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            {teamOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Trạng thái</label>
          <select 
            className={styles.filterSelect}
            value={selectedTeamStatus}
            onChange={(e) => setSelectedTeamStatus(e.target.value)}
          >
            {teamStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div className={styles.filterGroupVertical}>
          <label className={styles.filterLabel}>Hiệu suất hoàn thành</label>
          <select 
            className={styles.filterSelect}
            value={selectedPerformance}
            onChange={(e) => setSelectedPerformance(e.target.value)}
          >
            {performanceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.filterPopupFooter}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
        >
          <X className="w-4 h-4" />
          Xóa tất cả
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onClose}
        >
          <CheckCircle className="w-4 h-4" />
          Áp dụng
        </Button>
      </div>
    </>
  );
}
