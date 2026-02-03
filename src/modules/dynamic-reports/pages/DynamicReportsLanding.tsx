import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  FileText, 
  Users, 
  Building2, 
  Download,
  Play,
  Copy,
  Share2,
  Trash2,
  Edit,
  Clock,
  Database,
  TrendingUp,
  BarChart3,
  ClipboardCheck,
  FileSearch,
  AlertTriangle,
  FileBarChart,
  PieChart
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PageHeader from '@/layouts/PageHeader';
import styles from '../DynamicReports.module.css';
import ShareTemplateModal from '../components/ShareTemplateModal';
import { templateStorage, type SavedReportTemplate } from '../utils/templateStorage';

type TabValue = 'system' | 'personal' | 'unit' | 'exported';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  dataset: string;
  datasetGroup: string;
  isSystemTemplate?: boolean;
  lastRun?: string;
  runCount?: number;
}

const SYSTEM_TEMPLATES: ReportTemplate[] = [
  // ===== CƠ SỞ QUẢN LÝ =====
  {
    id: 'sys-001',
    name: 'Cơ sở chờ duyệt',
    description: 'Danh sách các cơ sở kinh doanh đang chờ phê duyệt hồ sơ đăng ký',
    dataset: 'Cơ sở quản lý',
    datasetGroup: 'facility',
    isSystemTemplate: true,
  },
  {
    id: 'sys-002',
    name: 'Cơ sở chưa đồng bộ thuế',
    description: 'Các cơ sở chưa đồng bộ thông tin với cơ quan thuế',
    dataset: 'Cơ sở quản lý',
    datasetGroup: 'facility',
    isSystemTemplate: true,
  },
  {
    id: 'sys-003',
    name: 'Cơ sở hoạt động',
    description: 'Thống kê các cơ sở đang hoạt động theo khu vực hoặc ngành nghề',
    dataset: 'Cơ sở quản lý',
    datasetGroup: 'facility',
    isSystemTemplate: true,
  },
  {
    id: 'sys-004',
    name: 'Cơ sở mới đăng ký',
    description: 'Danh sách các cơ sở mới đăng ký trong tháng/quý',
    dataset: 'Cơ sở quản lý',
    datasetGroup: 'facility',
    isSystemTemplate: true,
  },
  {
    id: 'sys-005',
    name: 'Cơ sở có vi phạm',
    description: 'Danh sách các cơ sở có vi phạm nổi bật cần xử lý',
    dataset: 'Cơ sở quản lý',
    datasetGroup: 'facility',
    isSystemTemplate: true,
  },
  
  // ===== NGUỒN TIN PHẢN ÁNH =====
  {
    id: 'sys-006',
    name: 'Nguồn tin mới 30 ngày',
    description: 'Tất cả nguồn tin phản ánh được tiếp nhận trong 30 ngày gần nhất',
    dataset: 'Nguồn tin phản ánh',
    datasetGroup: 'leads',
    isSystemTemplate: true,
  },
  {
    id: 'sys-007',
    name: 'Top cửa hàng bị phản ánh',
    description: 'Thống kê các cơ sở có số lượng phản ánh nhiều nhất',
    dataset: 'Nguồn tin phản ánh',
    datasetGroup: 'leads',
    isSystemTemplate: true,
  },
  {
    id: 'sys-008',
    name: 'Nguồn tin theo mức độ khẩn cấp',
    description: 'Thống kê các nguồn tin phản ánh theo mức độ khẩn cấp (Cao, Trung bình, Thấp)',
    dataset: 'Nguồn tin phản ánh',
    datasetGroup: 'leads',
    isSystemTemplate: true,
  },
  {
    id: 'sys-009',
    name: 'Nguồn tin theo loại vấn đề',
    description: 'Phân loại các nguồn tin theo vấn đề phản ánh (An toàn thực phẩm, Giá cả, Chất lượng...)',
    dataset: 'Nguồn tin phản ánh',
    datasetGroup: 'leads',
    isSystemTemplate: true,
  },
  
  // ===== KẾ HOẠCH KIỂM TRA =====
  {
    id: 'sys-010',
    name: 'Kế hoạch nháp/chờ duyệt',
    description: 'Danh sách các kế hoạch kiểm tra đang ở trạng thái nháp hoặc chờ phê duyệt',
    dataset: 'Kế hoạch kiểm tra',
    datasetGroup: 'plans',
    isSystemTemplate: true,
  },
  {
    id: 'sys-011',
    name: 'Kế hoạch ưu tiên cao/khẩn cấp',
    description: 'Các kế hoạch có mức độ ưu tiên cao hoặc khẩn cấp cần xử lý gấp',
    dataset: 'Kế hoạch kiểm tra',
    datasetGroup: 'plans',
    isSystemTemplate: true,
  },
  {
    id: 'sys-012',
    name: 'Kế hoạch kiểm tra sắp tới',
    description: 'Liệt kê các kế hoạch kiểm tra dự kiến trong tương lai (30-90 ngày tới)',
    dataset: 'Kế hoạch kiểm tra',
    datasetGroup: 'plans',
    isSystemTemplate: true,
  },
  {
    id: 'sys-013',
    name: 'Kế hoạch đã hoàn thành',
    description: 'Các kế hoạch kiểm tra đã được thực hiện và hoàn thành',
    dataset: 'Kế hoạch kiểm tra',
    datasetGroup: 'plans',
    isSystemTemplate: true,
  },
  {
    id: 'sys-014',
    name: 'Kế hoạch theo độ ưu tiên',
    description: 'Báo cáo các kế hoạch kiểm tra phân loại theo mức độ ưu tiên',
    dataset: 'Kế hoạch kiểm tra',
    datasetGroup: 'plans',
    isSystemTemplate: true,
  },
  
  // ===== ĐỢT KIỂM TRA =====
  {
    id: 'sys-015',
    name: 'Đợt đang kiểm tra',
    description: 'Các đợt kiểm tra đang trong quá trình thực hiện',
    dataset: 'Đợt kiểm tra',
    datasetGroup: 'campaigns',
    isSystemTemplate: true,
  },
  {
    id: 'sys-016',
    name: 'Tiến độ theo người chủ trì',
    description: 'Báo cáo tiến độ đợt kiểm tra theo từng người chủ trì',
    dataset: 'Đợt kiểm tra',
    datasetGroup: 'campaigns',
    isSystemTemplate: true,
  },
  {
    id: 'sys-017',
    name: 'Đợt kiểm tra theo tình trạng',
    description: 'Báo cáo các đợt kiểm tra theo trạng thái (Chưa bắt đầu, Đang thực hiện, Hoàn thành)',
    dataset: 'Đợt kiểm tra',
    datasetGroup: 'campaigns',
    isSystemTemplate: true,
  },
  {
    id: 'sys-018',
    name: 'Đợt kiểm tra theo người chủ trì',
    description: 'Liệt kê các đợt kiểm tra phân nhóm theo người phụ trách chính',
    dataset: 'Đợt kiểm tra',
    datasetGroup: 'campaigns',
    isSystemTemplate: true,
  },
  
  // ===== PHIÊN LÀM VIỆC =====
  {
    id: 'sys-019',
    name: 'Phiên trễ hạn',
    description: 'Danh sách các phiên làm việc bị trễ hạn so với kế hoạch',
    dataset: 'Phiên làm việc',
    datasetGroup: 'sessions',
    isSystemTemplate: true,
  },
  {
    id: 'sys-020',
    name: 'SLA đúng hạn theo cán bộ',
    description: 'Thống kê tỷ lệ hoàn thành đúng hạn theo từng cán bộ',
    dataset: 'Phiên làm việc',
    datasetGroup: 'sessions',
    isSystemTemplate: true,
  },
  {
    id: 'sys-021',
    name: 'Phiên làm việc theo trạng thái',
    description: 'Liệt kê các phiên làm việc theo trạng thái (Chưa bắt đầu, Đang thực hiện, Hoàn thành)',
    dataset: 'Phiên làm việc',
    datasetGroup: 'sessions',
    isSystemTemplate: true,
  },
  {
    id: 'sys-022',
    name: 'Phiên làm việc trễ hạn',
    description: 'Các phiên làm việc chưa hoàn thành đúng hạn cần xử lý khẩn cấp',
    dataset: 'Phiên làm việc',
    datasetGroup: 'sessions',
    isSystemTemplate: true,
  },

  // ===== BÁO CÁO TỔNG HỢP =====
  {
    id: 'sys-023',
    name: 'Tiến độ tổng thể',
    description: 'Báo cáo tiến độ chung của tất cả các đợt kiểm tra và phiên làm việc',
    dataset: 'Tổng hợp',
    datasetGroup: 'summary',
    isSystemTemplate: true,
  },
  {
    id: 'sys-024',
    name: 'Vi phạm phát hiện theo đợt',
    description: 'Tổng hợp các vi phạm phát hiện trong quá trình kiểm tra theo từng đợt',
    dataset: 'Vi phạm',
    datasetGroup: 'violations',
    isSystemTemplate: true,
  },
  {
    id: 'sys-025',
    name: 'Số lượng cơ sở kiểm tra',
    description: 'Báo cáo về tổng số cơ sở đã được kiểm tra và số cơ sở còn lại cần kiểm tra',
    dataset: 'Tổng hợp',
    datasetGroup: 'summary',
    isSystemTemplate: true,
  },
  {
    id: 'sys-026',
    name: 'Tình trạng báo cáo',
    description: 'Báo cáo tình trạng của tất cả các báo cáo (Chưa duyệt, Đang xem xét, Đã duyệt)',
    dataset: 'Báo cáo',
    datasetGroup: 'reports',
    isSystemTemplate: true,
  },
  {
    id: 'sys-027',
    name: 'Phân loại theo ưu tiên',
    description: 'Phân loại các báo cáo, đợt kiểm tra, và phiên làm việc theo mức độ ưu tiên (Thấp, Trung bình, Cao, Khẩn cấp)',
    dataset: 'Tổng hợp',
    datasetGroup: 'summary',
    isSystemTemplate: true,
  },
];

export default function DynamicReportsLanding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('system');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [personalTemplates, setPersonalTemplates] = useState<SavedReportTemplate[]>([]);
  const [unitTemplates, setUnitTemplates] = useState<SavedReportTemplate[]>([]);

  // Load templates from localStorage on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    const personal = templateStorage.getByScope('personal');
    const unit = templateStorage.getByScope('unit');
    setPersonalTemplates(personal);
    setUnitTemplates(unit);
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    if (confirm(`Bạn có chắc muốn xóa báo cáo "${name}"?`)) {
      templateStorage.delete(id);
      toast.success(`Đã xóa báo cáo "${name}"`);
      loadTemplates();
    }
  };

  const handleCopyTemplate = (template: ReportTemplate) => {
    const copiedTemplate: SavedReportTemplate = {
      id: `temp-${Date.now()}`,
      name: `${template.name} (Bản sao)`,
      description: template.description || '',
      dataset: template.dataset,
      datasetGroup: template.datasetGroup,
      columns: [], // System templates don't have columns saved, will need to configure
      filters: [],
      scope: 'personal', // Always copy to personal
      createdAt: new Date().toISOString(),
    };

    templateStorage.save(copiedTemplate);
    toast.success(`Đã sao chép mẫu báo cáo "${template.name}"`);
    loadTemplates();
    
    // Switch to personal tab to show the copied template
    setActiveTab('personal');
  };

  const handleCreateNew = () => {
    navigate('/bao-cao-dong/tao-moi');
  };

  const handleRunReport = (templateId: string) => {
    navigate(`/bao-cao-dong/ket-qua/${templateId}`);
  };

  const handleEditTemplate = (templateId: string) => {
    navigate(`/bao-cao-dong/chinh-sua/${templateId}`);
  };

  const handleShareTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowShareModal(true);
  };

  // Tabs definition
  const tabs = [
    { value: 'system' as TabValue, label: 'Mẫu hệ thống', icon: <FileText className="w-4 h-4" /> },
    { value: 'personal' as TabValue, label: 'Báo cáo của tôi', icon: <Users className="w-4 h-4" /> },
    { value: 'unit' as TabValue, label: 'Báo cáo đơn vị', icon: <Building2 className="w-4 h-4" /> },
    { value: 'exported' as TabValue, label: 'Báo cáo đã xuất', icon: <Download className="w-4 h-4" /> },
  ];

  const renderTemplateCard = (template: ReportTemplate) => (
    <div key={template.id} className={styles.templateCard} onClick={() => handleRunReport(template.id)}>
      <div className={styles.templateCardHeader}>
        <div>
          <h3 className={styles.templateTitle}>
            <FileText className="w-4 h-4" />
            {template.name}
          </h3>
        </div>
        <div className={styles.templateActions} onClick={(e) => e.stopPropagation()}>
          <button className={styles.iconButton} title="Chạy báo cáo" onClick={() => handleRunReport(template.id)}>
            <Play className="w-4 h-4" />
          </button>
          {!template.isSystemTemplate && (
            <>
              <button className={styles.iconButton} title="Chỉnh sửa" onClick={() => handleEditTemplate(template.id)}>
                <Edit className="w-4 h-4" />
              </button>
              <button className={styles.iconButton} title="Chia sẻ" onClick={() => handleShareTemplate(template)}>
                <Share2 className="w-4 h-4" />
              </button>
              <button className={styles.iconButton} title="Xóa" onClick={() => handleDeleteTemplate(template.id, template.name)}>
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          {template.isSystemTemplate && (
            <button className={styles.iconButton} title="Sao chép" onClick={() => handleCopyTemplate(template)}>
              <Copy className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <p className={styles.templateDescription}>{template.description}</p>
      <div className={styles.templateMeta}>
        {template.lastRun && (
          <div className={styles.templateMetaItem}>
            <Clock className="w-3 h-3" />
            <span>Chạy lần cuối {template.lastRun}</span>
          </div>
        )}
        {template.runCount && (
          <div className={styles.templateMetaItem}>
            <span>{template.runCount} lần chạy</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderSystemTemplates = () => {
    const groups = {
      facility: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'facility'),
      leads: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'leads'),
      plans: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'plans'),
      campaigns: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'campaigns'),
      sessions: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'sessions'),
      summary: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'summary'),
      violations: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'violations'),
      reports: SYSTEM_TEMPLATES.filter(t => t.datasetGroup === 'reports'),
    };

    const sectionHeaders = [
      { key: 'facility', icon: Database, label: 'Cơ sở quản lý' },
      { key: 'leads', icon: TrendingUp, label: 'Nguồn tin phản ánh' },
      { key: 'plans', icon: ClipboardCheck, label: 'Kế hoạch kiểm tra' },
      { key: 'campaigns', icon: BarChart3, label: 'Đợt kiểm tra' },
      { key: 'sessions', icon: FileSearch, label: 'Phiên làm việc' },
      { key: 'summary', icon: PieChart, label: 'Báo cáo tổng hợp' },
      { key: 'violations', icon: AlertTriangle, label: 'Vi phạm' },
      { key: 'reports', icon: FileBarChart, label: 'Quản lý báo cáo' },
    ];

    return (
      <div className={styles.tabContent}>
        {sectionHeaders.map(({ key, icon: Icon, label }) => {
          const templates = groups[key as keyof typeof groups];
          if (templates.length === 0) return null;
          
          return (
            <div key={key} className={styles.datasetSection}>
              <div className={styles.datasetSectionHeader}>
                <Icon className="w-5 h-5" />
                <h2>{label}</h2>
              </div>
              <div className={styles.templateGrid}>
                {templates.map(renderTemplateCard)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPersonalTemplates = () => {
    if (personalTemplates.length === 0) {
      return (
        <div className={styles.emptyState}>
          <FileText className={styles.emptyStateIcon} />
          <h3 className={styles.emptyStateTitle}>Chưa có báo cáo cá nhân</h3>
          <p className={styles.emptyStateDescription}>
            Tạo báo cáo mới để lưu các cấu hình tùy chỉnh của bạn
          </p>
          <Button variant="default" onClick={handleCreateNew}>
            <Plus className="w-4 h-4" />
            Tạo báo cáo mới
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.tabContent}>
        <div className={styles.templateGrid}>
          {personalTemplates.map(renderTemplateCard)}
        </div>
      </div>
    );
  };

  const renderUnitTemplates = () => {
    if (unitTemplates.length === 0) {
      return (
        <div className={styles.emptyState}>
          <Building2 className={styles.emptyStateIcon} />
          <h3 className={styles.emptyStateTitle}>Chưa có báo cáo đơn vị</h3>
          <p className={styles.emptyStateDescription}>
            Các báo cáo được chia sẻ trong đơn vị sẽ hiển thị ở đây
          </p>
        </div>
      );
    }

    return (
      <div className={styles.tabContent}>
        <div className={styles.templateGrid}>
          {unitTemplates.map(renderTemplateCard)}
        </div>
      </div>
    );
  };

  const renderExportedReports = () => {
    return (
      <div className={styles.emptyState}>
        <Download className={styles.emptyStateIcon} />
        <h3 className={styles.emptyStateTitle}>Chưa có báo cáo đã xuất</h3>
        <p className={styles.emptyStateDescription}>
          Lịch sử các báo cáo đã xuất Excel/PDF sẽ hiển thị ở đây
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Báo cáo & KPI', href: '/kpi' },
          { label: 'Báo cáo động' },
        ]}
        title="Báo cáo động"
        subtitle="Tạo và quản lý các báo cáo tùy chỉnh từ nhiều nguồn dữ liệu"
        actions={
          <Button variant="default" size="default" onClick={handleCreateNew}>
            <Plus className="w-5 h-5" />
            Tạo báo cáo mới
          </Button>
        }
      />

      <div className="px-6 py-4 space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)} className={styles.tabsRoot}>
          <div className={styles.tabsHeader}>
            <TabsList className={styles.tabsList}>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="system" className={styles.tabsContent}>
            {renderSystemTemplates()}
          </TabsContent>
          <TabsContent value="personal" className={styles.tabsContent}>
            {renderPersonalTemplates()}
          </TabsContent>
          <TabsContent value="unit" className={styles.tabsContent}>
            {renderUnitTemplates()}
          </TabsContent>
          <TabsContent value="exported" className={styles.tabsContent}>
            {renderExportedReports()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Share Template Modal */}
      {showShareModal && selectedTemplate && (
        <ShareTemplateModal
          isOpen={showShareModal}
          templateName={selectedTemplate.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
