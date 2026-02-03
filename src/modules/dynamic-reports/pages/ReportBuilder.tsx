import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Save,
  Play,
  Download,
  Search,
  Database,
  Columns,
  Filter as FilterIcon,
  Group,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import styles from '../DynamicReports.module.css';
import SaveTemplateModal from '../components/SaveTemplateModal';
import ExportReportModal from '../components/ExportReportModal';
import { templateStorage, getDatasetGroup, type SavedReportTemplate } from '../utils/templateStorage';

type DatasetValue = '' | 'facility' | 'leads' | 'plans' | 'campaigns' | 'sessions' | 'violations' | 'reports' | 'summary';

interface ColumnDef {
  id: string;
  name: string;
  group: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'enum';
}

interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

// Mock column definitions for different datasets
const COLUMN_DEFINITIONS: Record<string, ColumnDef[]> = {
  facility: [
    { id: 'name', name: 'Tên cơ sở', group: 'Thông tin chung', type: 'text' },
    { id: 'address', name: 'Địa chỉ', group: 'Thông tin chung', type: 'text' },
    { id: 'business_type', name: 'Loại hình kinh doanh', group: 'Thông tin chung', type: 'enum' },
    { id: 'industry', name: 'Ngành hàng', group: 'Thông tin chung', type: 'enum' },
    { id: 'status', name: 'Trạng thái', group: 'Trạng thái', type: 'enum' },
    { id: 'approval_status', name: 'Trạng thái phê duyệt', group: 'Trạng thái', type: 'enum' },
    { id: 'area', name: 'Diện tích (m²)', group: 'Thông tin chung', type: 'number' },
    { id: 'revenue', name: 'Doanh thu khai báo', group: 'Thông tin chung', type: 'number' },
    { id: 'ward', name: 'Phường/Xã', group: 'Địa bàn', type: 'text' },
    { id: 'district', name: 'Quận/Huyện', group: 'Địa bàn', type: 'text' },
    { id: 'city', name: 'Tỉnh/Thành phố', group: 'Địa bàn', type: 'text' },
    { id: 'created_date', name: 'Ngày tạo', group: 'Thời gian', type: 'date' },
    { id: 'approved_date', name: 'Ngày phê duyệt', group: 'Thời gian', type: 'date' },
    { id: 'owner_name', name: 'Chủ cơ sở', group: 'Người liên quan', type: 'text' },
    { id: 'owner_phone', name: 'Số điện thoại', group: 'Người liên quan', type: 'text' },
  ],
  leads: [
    { id: 'title', name: 'Tiêu đề phản ánh', group: 'Thông tin chung', type: 'text' },
    { id: 'description', name: 'Nội dung', group: 'Thông tin chung', type: 'text' },
    { id: 'source', name: 'Nguồn', group: 'Thông tin chung', type: 'enum' },
    { id: 'category', name: 'Danh mục', group: 'Thông tin chung', type: 'enum' },
    { id: 'priority', name: 'Mức độ ưu tiên', group: 'Trạng thái', type: 'enum' },
    { id: 'status', name: 'Trạng thái xử lý', group: 'Trạng thái', type: 'enum' },
    { id: 'facility_name', name: 'Cơ sở bị phản ánh', group: 'Liên quan', type: 'text' },
    { id: 'reporter_name', name: 'Người phản ánh', group: 'Người liên quan', type: 'text' },
    { id: 'reporter_phone', name: 'SĐT người phản ánh', group: 'Người liên quan', type: 'text' },
    { id: 'assignee', name: 'Người xử lý', group: 'Người liên quan', type: 'text' },
    { id: 'ward', name: 'Phường/Xã', group: 'Địa bàn', type: 'text' },
    { id: 'district', name: 'Quận/Huyện', group: 'Địa bàn', type: 'text' },
    { id: 'created_date', name: 'Ngày tiếp nhận', group: 'Thời gian', type: 'date' },
    { id: 'resolved_date', name: 'Ngày xử l xong', group: 'Thời gian', type: 'date' },
  ],
  plans: [
    { id: 'name', name: 'Tên kế hoạch', group: 'Thông tin chung', type: 'text' },
    { id: 'type', name: 'Loại kế hoạch', group: 'Thông tin chung', type: 'enum' },
    { id: 'priority', name: 'Mức độ ưu tiên', group: 'Trạng thái', type: 'enum' },
    { id: 'status', name: 'Trạng thái', group: 'Trạng thái', type: 'enum' },
    { id: 'approval_status', name: 'Trạng thái phê duyệt', group: 'Trạng thái', type: 'enum' },
    { id: 'owner', name: 'Người chủ trì', group: 'Người liên quan', type: 'text' },
    { id: 'team', name: 'Đội thực hiện', group: 'Đơn vị', type: 'text' },
    { id: 'facility_count', name: 'Số cơ sở', group: 'Thông tin chung', type: 'number' },
    { id: 'start_date', name: 'Ngày bắt đầu', group: 'Thời gian', type: 'date' },
    { id: 'end_date', name: 'Ngày kết thúc', group: 'Thời gian', type: 'date' },
    { id: 'created_date', name: 'Ngày tạo', group: 'Thời gian', type: 'date' },
  ],
  campaigns: [
    { id: 'name', name: 'Tên đợt', group: 'Thông tin chung', type: 'text' },
    { id: 'plan_name', name: 'Kế hoạch', group: 'Liên quan', type: 'text' },
    { id: 'status', name: 'Trạng thái', group: 'Trạng thái', type: 'enum' },
    { id: 'owner', name: 'Người chủ trì', group: 'Người liên quan', type: 'text' },
    { id: 'team', name: 'Đội thực hiện', group: 'Đơn vị', type: 'text' },
    { id: 'facility_count', name: 'Số cơ sở', group: 'Thông tin chung', type: 'number' },
    { id: 'completed_count', name: 'Số hoàn thành', group: 'Thông tin chung', type: 'number' },
    { id: 'violation_count', name: 'Số vi phạm', group: 'Thông tin chung', type: 'number' },
    { id: 'start_date', name: 'Ngày bắt đầu', group: 'Thời gian', type: 'date' },
    { id: 'end_date', name: 'Ngày kết thúc', group: 'Thời gian', type: 'date' },
  ],
  sessions: [
    { id: 'session_code', name: 'Mã phiên', group: 'Thông tin chung', type: 'text' },
    { id: 'campaign_name', name: 'Đợt kiểm tra', group: 'Liên quan', type: 'text' },
    { id: 'facility_name', name: 'Cơ sở', group: 'Liên quan', type: 'text' },
    { id: 'status', name: 'Trạng thái', group: 'Trạng thái', type: 'enum' },
    { id: 'inspector', name: 'Thanh tra viên', group: 'Người liên quan', type: 'text' },
    { id: 'team', name: 'Đội', group: 'Đơn vị', type: 'text' },
    { id: 'has_violation', name: 'Có vi phạm', group: 'Kết quả', type: 'boolean' },
    { id: 'violation_count', name: 'Số vi phạm', group: 'Kết quả', type: 'number' },
    { id: 'fine_amount', name: 'Tiền phạt', group: 'Kết quả', type: 'number' },
    { id: 'scheduled_date', name: 'Ngày hẹn', group: 'Thời gian', type: 'date' },
    { id: 'completed_date', name: 'Ngày hoàn thành', group: 'Thời gian', type: 'date' },
    { id: 'is_overdue', name: 'Trễ hạn', group: 'Trạng thái', type: 'boolean' },
  ],
  violations: [
    { id: 'violation_code', name: 'Mã vi phạm', group: 'Thông tin chung', type: 'text' },
    { id: 'session_code', name: 'Mã phiên', group: 'Liên quan', type: 'text' },
    { id: 'facility_name', name: 'Cơ sở', group: 'Liên quan', type: 'text' },
    { id: 'description', name: 'Mô tả vi phạm', group: 'Thông tin chung', type: 'text' },
    { id: 'severity', name: 'Độ nghiêm trọng', group: 'Trạng thái', type: 'enum' },
    { id: 'status', name: 'Trạng thái xử lý', group: 'Trạng thái', type: 'enum' },
    { id: 'inspector', name: 'Thanh tra viên', group: 'Ngưi liên quan', type: 'text' },
    { id: 'team', name: 'Đội', group: 'Đơn vị', type: 'text' },
    { id: 'fine_amount', name: 'Tiền phạt', group: 'Kết quả', type: 'number' },
    { id: 'scheduled_date', name: 'Ngày hẹn', group: 'Thời gian', type: 'date' },
    { id: 'completed_date', name: 'Ngày hoàn thành', group: 'Thời gian', type: 'date' },
    { id: 'is_overdue', name: 'Trễ hạn', group: 'Trạng thái', type: 'boolean' },
  ],
  reports: [
    { id: 'report_code', name: 'Mã báo cáo', group: 'Thông tin chung', type: 'text' },
    { id: 'session_code', name: 'Mã phiên', group: 'Liên quan', type: 'text' },
    { id: 'facility_name', name: 'Cơ sở', group: 'Liên quan', type: 'text' },
    { id: 'description', name: 'Mô tả báo cáo', group: 'Thông tin chung', type: 'text' },
    { id: 'status', name: 'Trạng thái xử lý', group: 'Trạng thái', type: 'enum' },
    { id: 'inspector', name: 'Thanh tra viên', group: 'Người liên quan', type: 'text' },
    { id: 'team', name: 'Đội', group: 'Đơn vị', type: 'text' },
    { id: 'fine_amount', name: 'Tiền phạt', group: 'Kết quả', type: 'number' },
    { id: 'scheduled_date', name: 'Ngày hn', group: 'Thời gian', type: 'date' },
    { id: 'completed_date', name: 'Ngày hoàn thành', group: 'Thời gian', type: 'date' },
    { id: 'is_overdue', name: 'Trễ hạn', group: 'Trạng thái', type: 'boolean' },
  ],
  summary: [
    { id: 'total_facilities', name: 'Tổng số cơ sở', group: 'Tóm tắt', type: 'number' },
    { id: 'active_facilities', name: 'Cơ sở hoạt động', group: 'Tóm tắt', type: 'number' },
    { id: 'inactive_facilities', name: 'Cơ sở không hoạt động', group: 'Tóm tắt', type: 'number' },
    { id: 'total_leads', name: 'Tổng số phản ánh', group: 'Tóm tắt', type: 'number' },
    { id: 'resolved_leads', name: 'Phản ánh đã giải quyết', group: 'Tóm tắt', type: 'number' },
    { id: 'total_plans', name: 'Tổng số kế hoạch', group: 'Tóm tắt', type: 'number' },
    { id: 'active_plans', name: 'Kế hoạch đang thực hiện', group: 'Tóm tắt', type: 'number' },
    { id: 'total_campaigns', name: 'Tổng số đợt kiểm tra', group: 'Tóm tắt', type: 'number' },
    { id: 'completed_campaigns', name: 'Đợt kiểm tra hoàn thành', group: 'Tóm tắt', type: 'number' },
    { id: 'total_sessions', name: 'Tng số phiên làm việc', group: 'Tóm tắt', type: 'number' },
    { id: 'completed_sessions', name: 'Phiên làm việc hoàn thành', group: 'Tóm tắt', type: 'number' },
    { id: 'total_violations', name: 'Tổng số vi phạm', group: 'Tóm tắt', type: 'number' },
    { id: 'resolved_violations', name: 'Vi phạm đã xử lý', group: 'Tóm tắt', type: 'number' },
    { id: 'total_reports', name: 'Tổng số báo cáo', group: 'Tóm tắt', type: 'number' },
    { id: 'resolved_reports', name: 'Báo cáo đã xử lý', group: 'Tóm tắt', type: 'number' },
  ],
};

// Mock result data
const MOCK_RESULTS: any[] = [
  { id: 1, name: 'Cửa hàng thực phẩm ABC', address: '123 Nguyễn Huệ, Q1', status: 'Đang hoạt động', area: 45, created_date: '2024-01-15' },
  { id: 2, name: 'Siêu thị Mini Mart', address: '456 Lê Lợi, Q1', status: 'Đang hoạt động', area: 120, created_date: '2024-01-18' },
  { id: 3, name: 'Cửa hàng điện tử XYZ', address: '789 Trần Hưng Đạo, Q5', status: 'Tạm ngừng', area: 60, created_date: '2024-01-20' },
  { id: 4, name: 'Nhà thuốc Sức Khỏe', address: '321 Hai Bà Trưng, Q3', status: 'Đang hoạt động', area: 38, created_date: '2024-01-22' },
  { id: 5, name: 'Cửa hàng thời trang Fashion', address: '654 Nam Kỳ Khởi Nghĩa, Q1', status: 'Đang hoạt động', area: 55, created_date: '2024-01-25' },
];

// Mock data by dataset
const MOCK_DATA_BY_DATASET: Record<string, any[]> = {
  facility: [
    { id: 1, name: 'Cửa hàng thực phẩm ABC', address: '123 Nguyễn Huệ, Q1', business_type: 'Cửa hàng', industry: 'Thực phẩm', status: 'Đang hoạt động', area: 45, created_date: '2024-01-15', ward: 'Phường Bến Nghé', district: 'Quận 1', owner_name: 'Nguyễn Văn A', owner_phone: '0901234567' },
    { id: 2, name: 'Siêu thị Mini Mart', address: '456 Lê Lợi, Q1', business_type: 'Siêu thị', industry: 'Bán lẻ', status: 'Đang hoạt động', area: 120, created_date: '2024-01-18', ward: 'Phường Bến Thành', district: 'Quận 1', owner_name: 'Trần Thị B', owner_phone: '0912345678' },
    { id: 3, name: 'Cửa hàng điện tử XYZ', address: '789 Trần Hưng Đạo, Q5', business_type: 'Cửa hàng', industry: 'Điện tử', status: 'Tạm ngừng', area: 60, created_date: '2024-01-20', ward: 'Phường 2', district: 'Quận 5', owner_name: 'Lê Văn C', owner_phone: '0923456789' },
    { id: 4, name: 'Nhà thuốc Sức Khỏe', address: '321 Hai Bà Trưng, Q3', business_type: 'Nhà thuốc', industry: 'Y tế', status: 'Đang hoạt động', area: 38, created_date: '2024-01-22', ward: 'Phường Võ Thị Sáu', district: 'Quận 3', owner_name: 'Phạm Thị D', owner_phone: '0934567890' },
    { id: 5, name: 'Cửa hàng thời trang Fashion', address: '654 Nam Kỳ Khởi Nghĩa, Q1', business_type: 'Cửa hàng', industry: 'Thời trang', status: 'Đang hoạt động', area: 55, created_date: '2024-01-25', ward: 'Phường Bến Nghé', district: 'Quận 1', owner_name: 'Hoàng Văn E', owner_phone: '0945678901' },
  ],
  leads: [
    { id: 1, title: 'Phản ánh về VSATTP tại cửa hàng ABC', description: 'Phát hiện thực phẩm không rõ nguồn gốc', source: 'Hotline 1900', category: 'VSATTP', priority: 'Cao', status: 'Đang xử lý', facility_name: 'Cửa hàng ABC', reporter_name: 'Nguyễn Thị X', reporter_phone: '0901111111', assignee: 'Thanh tra viên A', ward: 'Phường 1', district: 'Quận 1', created_date: '2024-01-20', resolved_date: null },
    { id: 2, title: 'Khiếu nại về giá cả', description: 'Bán hàng cao hơn giá niêm yết', source: 'Email', category: 'Giá cả', priority: 'Trung bình', status: 'Đã giải quyết', facility_name: 'Siêu thị XYZ', reporter_name: 'Trần Văn Y', reporter_phone: '0902222222', assignee: 'Thanh tra viên B', ward: 'Phường 2', district: 'Quận 2', created_date: '2024-01-18', resolved_date: '2024-01-25' },
    { id: 3, title: 'Vi phạm quy định kinh doanh', description: 'Kinh doanh không đúng ngành nghề đăng ký', source: 'Thanh tra định kỳ', category: 'Giấy phép', priority: 'Cao', status: 'Đang xử lý', facility_name: 'Cửa hàng 123', reporter_name: null, reporter_phone: null, assignee: 'Thanh tra viên C', ward: 'Phường 3', district: 'Quận 3', created_date: '2024-01-22', resolved_date: null },
    { id: 4, title: 'Phản ánh gây ô nhiễm môi trường', description: 'Xả nước thải ra đường', source: 'Cổng thông tin', category: 'Môi trường', priority: 'Cao', status: 'Chờ phê duyệt', facility_name: 'Nhà máy ABC', reporter_name: 'Lê Thị Z', reporter_phone: '0903333333', assignee: null, ward: 'Phường 4', district: 'Quận 4', created_date: '2024-01-24', resolved_date: null },
    { id: 5, title: 'Khiếu nại chất lượng sản phẩm', description: 'Sản phẩm kém chất lượng, không đúng mô tả', source: 'Hotline 1900', category: 'Chất lượng', priority: 'Trung bình', status: 'Đã giải quyết', facility_name: 'Cửa hàng XYZ', reporter_name: 'Phạm Văn K', reporter_phone: '0904444444', assignee: 'Thanh tra viên D', ward: 'Phường 5', district: 'Quận 5', created_date: '2024-01-26', resolved_date: '2024-01-30' },
  ],
};

export default function ReportBuilder() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const isEditing = !!templateId;

  // State
  const [selectedDataset, setSelectedDataset] = useState<DatasetValue>('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [groupBy, setGroupBy] = useState<string>('');
  const [aggregation, setAggregation] = useState<string>('count');
  const [columnSearch, setColumnSearch] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dataset: true,
    columns: true,
    filters: true,
    group: false,
  });
  const [shouldRunAfterSave, setShouldRunAfterSave] = useState(false);

  const currentColumns = selectedDataset ? COLUMN_DEFINITIONS[selectedDataset] || [] : [];
  const filteredColumns = currentColumns.filter(col => 
    col.name.toLowerCase().includes(columnSearch.toLowerCase())
  );
  
  // Get current dataset results
  const currentResults = selectedDataset && MOCK_DATA_BY_DATASET[selectedDataset] 
    ? MOCK_DATA_BY_DATASET[selectedDataset] 
    : [];

  // Group columns by category
  const groupedColumns = filteredColumns.reduce((acc, col) => {
    if (!acc[col.group]) acc[col.group] = [];
    acc[col.group].push(col);
    return acc;
  }, {} as Record<string, ColumnDef[]>);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDatasetChange = (dataset: DatasetValue) => {
    setSelectedDataset(dataset);
    setSelectedColumns([]);
    setFilters([]);
    setGroupBy('');
  };

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(currentColumns.map(col => col.id));
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleAddFilter = () => {
    const newFilter: FilterCondition = {
      id: `filter-${Date.now()}`,
      field: currentColumns[0]?.id || '',
      operator: 'contains',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const handleFilterChange = (filterId: string, key: keyof FilterCondition, value: string) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, [key]: value } : f
    ));
  };

  const handleRunReport = () => {
    if (!selectedDataset) {
      toast.error('Vui lòng chọn nguồn dữ liệu');
      return;
    }
    if (selectedColumns.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 cột hiển thị');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setHasResults(true);
      toast.success('Báo cáo đã được chạy thành công!');
    }, 1000);
  };

  const handleSaveTemplate = (name: string, description: string, scope: 'personal' | 'unit') => {
    if (!selectedDataset) {
      toast.error('Vui lòng chọn nguồn dữ liệu trước khi lưu');
      return;
    }
    if (selectedColumns.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 cột');
      return;
    }

    const template: SavedReportTemplate = {
      id: `temp-${Date.now()}`,
      name,
      description,
      dataset: selectedDataset,
      datasetGroup: getDatasetGroup(selectedDataset),
      columns: selectedColumns,
      filters,
      groupBy,
      aggregation,
      scope,
      createdAt: new Date().toISOString(),
    };

    templateStorage.save(template);
    toast.success(`Đã lưu mẫu báo cáo "${name}" thành công!`);
    setShowSaveModal(false);
    
    // If triggered from "Save & Run", run the report after saving
    if (shouldRunAfterSave) {
      setShouldRunAfterSave(false);
      setTimeout(() => {
        handleRunReport();
      }, 500);
    }
  };

  const handleSaveAndRun = () => {
    if (!selectedDataset) {
      toast.error('Vui lòng chọn nguồn dữ liệu');
      return;
    }
    if (selectedColumns.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 cột hiển thị');
      return;
    }
    setShouldRunAfterSave(true);
    setShowSaveModal(true);
  };

  const handleExport = (format: 'excel' | 'pdf', filename: string) => {
    if (!hasResults) {
      toast.error('Vui lòng chạy báo cáo trước khi xuất');
      return;
    }

    // Mock export - TODO: Implement actual export
    const exportData = {
      filename: `${filename}.${format === 'excel' ? 'xlsx' : 'pdf'}`,
      format,
      dataset: selectedDataset,
      columns: selectedColumns,
      filters,
      data: MOCK_RESULTS,
      timestamp: new Date().toISOString(),
    };

    console.log('Exporting:', exportData);
    
    // Simulate download
    toast.success(`Đang tải xuống file "${exportData.filename}"...`);
    
    setShowExportModal(false);
  };

  const getOperatorsByType = (type: string) => {
    switch (type) {
      case 'text':
        return ['contains', 'equals', 'startsWith'];
      case 'number':
        return ['equals', '>=', '<=', 'between'];
      case 'date':
        return ['equals', 'before', 'after', 'between'];
      case 'enum':
        return ['equals', 'in'];
      case 'boolean':
        return ['equals'];
      default:
        return ['equals'];
    }
  };

  const getOperatorLabel = (operator: string) => {
    const labels: Record<string, string> = {
      'contains': 'Chứa',
      'equals': 'Bằng',
      'startsWith': 'Bắt đầu bằng',
      '>=': 'Lớn hơn hoặc bằng',
      '<=': 'Nhỏ hơn hoặc bằng',
      'between': 'Trong khoảng',
      'before': 'Trước ngày',
      'after': 'Sau ngày',
      'in': 'Trong danh sách',
    };
    return labels[operator] || operator;
  };

  return (
    <>
      <div className={styles.builderContainer}>
        {/* Header */}
        <div className={styles.builderHeader}>
          <div className={styles.breadcrumbs}>
            <Link to="/bao-cao-dong" className={styles.breadcrumbLink}>Báo co động</Link>
            <ChevronRight className={`${styles.breadcrumbSeparator} w-4 h-4`} />
            <span className={styles.breadcrumbCurrent}>
              {isEditing ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}
            </span>
          </div>
          <div className={styles.builderActions}>
            <Button variant="outline" size="sm" onClick={() => setShowSaveModal(true)}>
              <Save className="w-4 h-4" />
              Lưu mẫu
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </Button>
            <Button variant="default" size="sm" onClick={handleRunReport}>
              <Play className="w-4 h-4" />
              Chạy báo cáo
            </Button>
            <Button variant="default" size="sm" onClick={handleSaveAndRun}>
              <Save className="w-4 h-4" />
              Lưu & Chạy
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className={styles.builderBody}>
          {/* Left Sidebar */}
          <div className={styles.builderSidebar}>
            {/* Dataset Selector */}
            <div className={styles.sidebarSection}>
              <div 
                className={styles.sidebarSectionHeader}
                onClick={() => toggleSection('dataset')}
              >
                <div className={styles.sidebarSectionTitle}>
                  <Database className="w-4 h-4" />
                  <span>Nguồn dữ liệu</span>
                </div>
                {expandedSections.dataset ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
              {expandedSections.dataset && (
                <div className={styles.sidebarSectionContent}>
                  <select 
                    className={styles.datasetSelect}
                    value={selectedDataset}
                    onChange={(e) => handleDatasetChange(e.target.value as DatasetValue)}
                  >
                    <option value="">-- Chọn nguồn dữ liệu --</option>
                    <optgroup label="Cơ sở quản lý">
                      <option value="facility">Cơ sở quản lý (Cửa hàng/HKD)</option>
                    </optgroup>
                    <optgroup label="Nguồn tin">
                      <option value="leads">Nguồn tin phản ánh</option>
                    </optgroup>
                    <optgroup label="Kế hoạch kiểm tra">
                      <option value="plans">Kế hoạch kiểm tra</option>
                    </optgroup>
                    <optgroup label="Đợt kiểm tra">
                      <option value="campaigns">Đợt kiểm tra</option>
                    </optgroup>
                    <optgroup label="Phiên làm việc">
                      <option value="sessions">Phiên làm việc</option>
                    </optgroup>
                    <optgroup label="Vi phạm">
                      <option value="violations">Vi phạm</option>
                    </optgroup>
                    <optgroup label="Báo cáo">
                      <option value="reports">Báo cáo</option>
                    </optgroup>
                    <optgroup label="Tóm tắt">
                      <option value="summary">Tóm tắt</option>
                    </optgroup>
                  </select>
                </div>
              )}
            </div>

            {/* Column Selector */}
            {selectedDataset && (
              <div className={styles.sidebarSection}>
                <div 
                  className={styles.sidebarSectionHeader}
                  onClick={() => toggleSection('columns')}
                >
                  <div className={styles.sidebarSectionTitle}>
                    <Columns className="w-4 h-4" />
                    <span>Cột hiển thị ({selectedColumns.length})</span>
                  </div>
                  {expandedSections.columns ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                {expandedSections.columns && (
                  <div className={styles.sidebarSectionContent}>
                    <input
                      type="text"
                      placeholder="Tìm cột..."
                      className={styles.columnSearch}
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                    />
                    <div className={styles.columnQuickActions}>
                      <button className={styles.quickActionBtn} onClick={handleSelectAllColumns}>
                        Chọn tất cả
                      </button>
                      <button className={styles.quickActionBtn} onClick={handleDeselectAllColumns}>
                        Bỏ chọn tất cả
                      </button>
                    </div>
                    {Object.entries(groupedColumns).map(([groupName, cols]) => (
                      <div key={groupName} className={styles.columnGroup}>
                        <div className={styles.columnGroupTitle}>{groupName}</div>
                        {cols.map(col => (
                          <label key={col.id} className={styles.columnCheckbox}>
                            <input
                              type="checkbox"
                              checked={selectedColumns.includes(col.id)}
                              onChange={() => handleColumnToggle(col.id)}
                            />
                            <span>{col.name}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Filters */}
            {selectedDataset && (
              <div className={styles.sidebarSection}>
                <div 
                  className={styles.sidebarSectionHeader}
                  onClick={() => toggleSection('filters')}
                >
                  <div className={styles.sidebarSectionTitle}>
                    <FilterIcon className="w-4 h-4" />
                    <span>Bộ lọc ({filters.length})</span>
                  </div>
                  {expandedSections.filters ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                {expandedSections.filters && (
                  <div className={styles.sidebarSectionContent}>
                    {filters.map(filter => {
                      const field = currentColumns.find(c => c.id === filter.field);
                      const operators = field ? getOperatorsByType(field.type) : [];
                      
                      return (
                        <div key={filter.id} className={styles.filterCard}>
                          <div className={styles.filterCardHeader}>
                            <span className={styles.filterCardTitle}>Điều kiện {filters.indexOf(filter) + 1}</span>
                            <button 
                              className={styles.iconButton}
                              onClick={() => handleRemoveFilter(filter.id)}
                              title="Xóa điều kiện"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className={styles.filterCardField}>
                            <label className={styles.filterCardLabel}>Trường dữ liệu</label>
                            <select 
                              className={styles.filterSelect}
                              value={filter.field}
                              onChange={(e) => handleFilterChange(filter.id, 'field', e.target.value)}
                            >
                              {currentColumns.map(col => (
                                <option key={col.id} value={col.id}>{col.name}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className={styles.filterCardField}>
                            <label className={styles.filterCardLabel}>Toán tử</label>
                            <select 
                              className={styles.filterSelect}
                              value={filter.operator}
                              onChange={(e) => handleFilterChange(filter.id, 'operator', e.target.value)}
                            >
                              {operators.map(op => (
                                <option key={op} value={op}>{getOperatorLabel(op)}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className={styles.filterCardField}>
                            <label className={styles.filterCardLabel}>Giá trị</label>
                            <input
                              type="text"
                              className={styles.filterInput}
                              placeholder="Nhập giá trị..."
                              value={filter.value}
                              onChange={(e) => handleFilterChange(filter.id, 'value', e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <button className={styles.addFilterBtn} onClick={handleAddFilter}>
                      <Plus className="w-4 h-4" />
                      <span>Thêm điều kiện</span>
                    </button>
                    
                    <div className={styles.timePresets}>
                      <button className={styles.timePresetBtn}>Hôm nay</button>
                      <button className={styles.timePresetBtn}>7 ngày</button>
                      <button className={styles.timePresetBtn}>30 ngày</button>
                      <button className={styles.timePresetBtn}>Tháng này</button>
                      <button className={styles.timePresetBtn}>Quý này</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Group & Aggregation */}
            {selectedDataset && (
              <div className={styles.sidebarSection}>
                <div 
                  className={styles.sidebarSectionHeader}
                  onClick={() => toggleSection('group')}
                >
                  <div className={styles.sidebarSectionTitle}>
                    <Group className="w-4 h-4" />
                    <span>Nhóm & Tổng hợp</span>
                  </div>
                  {expandedSections.group ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                {expandedSections.group && (
                  <div className={styles.sidebarSectionContent}>
                    <div className={styles.groupField}>
                      <label className={styles.groupLabel}>Nhóm theo</label>
                      <select 
                        className={styles.datasetSelect}
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value)}
                      >
                        <option value="">Không nhóm</option>
                        {currentColumns.filter(c => c.type === 'text' || c.type === 'enum').map(col => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.groupField}>
                      <label className={styles.groupLabel}>T��ng hợp</label>
                      <div className={styles.aggregationList}>
                        <div className={styles.aggregationItem}>
                          <input type="radio" name="agg" value="count" checked={aggregation === 'count'} onChange={(e) => setAggregation(e.target.value)} />
                          <span>Đếm số bản ghi (Count)</span>
                        </div>
                        <div className={styles.aggregationItem}>
                          <input type="radio" name="agg" value="sum" checked={aggregation === 'sum'} onChange={(e) => setAggregation(e.target.value)} />
                          <span>Tổng (Sum)</span>
                        </div>
                        <div className={styles.aggregationItem}>
                          <input type="radio" name="agg" value="avg" checked={aggregation === 'avg'} onChange={(e) => setAggregation(e.target.value)} />
                          <span>Trung bình (Avg)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Result Table */}
          <div className={styles.builderMain}>
            {!selectedDataset ? (
              <div className={styles.emptyState}>
                <Database className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>Chọn nguồn dữ liệu để bắt đầu</h3>
                <p className={styles.emptyStateDescription}>
                  Chọn dataset từ panel bên trái để cấu hình báo cáo
                </p>
              </div>
            ) : selectedColumns.length === 0 ? (
              <div className={styles.emptyState}>
                <Columns className={styles.emptyStateIcon} />
                <h3 className={styles.emptyStateTitle}>Chọn cột hiển thị</h3>
                <p className={styles.emptyStateDescription}>
                  Chọn ít nhất 1 cột để xem dữ liệu
                </p>
              </div>
            ) : isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Đang tải dữ liệu...</p>
              </div>
            ) : (
              <>
                {/* Summary Bar */}
                <div className={styles.resultSummary}>
                  <div className={styles.summaryItem}>
                    <Database className="w-4 h-4" />
                    <span>Dataset: <strong>{selectedDataset}</strong></span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Số bản ghi: <strong>{MOCK_RESULTS.length}</strong></span>
                  </div>
                  <div className={styles.summaryItem}>
                    <span>Bộ lọc: <strong>{filters.length} điều kiện</strong></span>
                  </div>
                  <div className={styles.summaryItem}>
                    <Clock className="w-4 h-4" />
                    <span>Preview - Click "Chạy báo cáo" để refresh</span>
                  </div>
                </div>

                {/* Selected Columns Chips */}
                <div className={styles.selectedColumns}>
                  <span className={styles.selectedColumnsLabel}>Cột đã chọn:</span>
                  <div className={styles.columnChips}>
                    {selectedColumns.map(colId => {
                      const col = currentColumns.find(c => c.id === colId);
                      return col ? (
                        <span key={colId} className={styles.columnChip}>
                          {col.name}
                          <button 
                            className={styles.columnChipRemove}
                            onClick={() => handleColumnToggle(colId)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                  <table className={styles.resultTable}>
                    <thead>
                      <tr>
                        {selectedColumns.map(colId => {
                          const col = currentColumns.find(c => c.id === colId);
                          return col ? <th key={colId}>{col.name}</th> : null;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {currentResults.map(row => (
                        <tr key={row.id}>
                          {selectedColumns.map(colId => (
                            <td key={colId}>{row[colId] || '-'}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Hiển thị 1-{currentResults.length} của {currentResults.length} bản ghi
                  </div>
                  <div className={styles.paginationControls}>
                    <button className={styles.paginationButton} disabled>Trước</button>
                    <button className={styles.paginationButton}>1</button>
                    <button className={styles.paginationButton} disabled>Sau</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSaveModal && (
        <SaveTemplateModal 
          onClose={() => setShowSaveModal(false)}
          onSave={handleSaveTemplate}
          dataset={selectedDataset}
          columnsCount={selectedColumns.length}
          filtersCount={filters.length}
        />
      )}

      {showExportModal && (
        <ExportReportModal 
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          dataset={selectedDataset}
          columnsCount={selectedColumns.length}
          rowsCount={currentResults.length}
          hasResults={hasResults}
        />
      )}
    </>
  );
}
