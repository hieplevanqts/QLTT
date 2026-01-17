import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Shield,
  GitBranch,
  MapPin,
  Layers,
  Database,
  Settings,
  TrendingUp,
  CheckSquare,
  Bell,
  Download,
  FileText,
  Activity,
  Lock,
  Link as LinkIcon,
  Server,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  X,
  ChevronRight,
  Check,
  Clock,
  XCircle,
  MoreVertical,
  Copy,
  Unlock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  FileDown,
  Upload,
  History,
  UserCheck,
  UserX,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import styles from './AdminPage.module.css';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UniversalModal } from './AdminModal';
import { UserListTabNew } from './UserListTabNew';
import { RolesManagementTab } from './RolesManagementTab';
import { PermissionsMatrixTabNew } from './PermissionsMatrixTabNew';
import { TerritoryTabNew } from './TerritoryTabNew';
import { ChecklistTabNew } from './ChecklistTabNew';
import { FormTemplatesTab } from './FormTemplatesTab';
import { NotificationRulesTab } from './NotificationRulesTab';
import { ExportCenterTab } from './ExportCenterTab';
import { AuditLogTab } from './AuditLogTab';
import { DataChangesTab } from './DataChangesTab';
import { ExportLogTab } from './ExportLogTab';
import { SecurityConfigTab } from './SecurityConfigTab';
import { IntegrationStatusTab } from './IntegrationStatusTab';
import { SystemMonitorTab } from './SystemMonitorTab';
import { SystemHealthTab } from './SystemHealthTab';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import {
  UserListTab,
  TeamsTab,
  CommonCategoriesTab,
  CategoryManagementTab,
  RiskConfigTab,
  ProtectionMeasuresTab,
} from './AdminTabComponents';
import { DepartmentsTab } from './DepartmentsTab';
import { RolesTabWrapper } from './RolesTabWrapper';
import { LocalityModal } from '../components/LocalityModal';
import {
  generateUsers,
  generateRoles,
  generateTerritories,
  generateTeams,
  generateCategories,
  generateRiskIndicators,
  generateChecklists,
  generateNotificationRules
} from '../data/generateFakeData';

type MainTab = 'users' | 'categories' | 'audit';
type SubTab = string;

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  roleId: string;
  unit: string;
  unitId: string;
  territory: string;
  territoryId: string;
  status: 'active' | 'locked' | 'pending';
  lastLogin?: string;
  createdAt: string;
  createdBy: string;
}

interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  userCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  permissions?: Array<{
    module: string;
    permissions: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  }>;
}

interface Territory {
  id: string;
  code: string;
  name: string;
  level: 'province' | 'district' | 'ward';
  parentId?: string;
  status: 'active' | 'inactive';
  userCount: number;
}

interface Team {
  id: string;
  code: string;
  name: string;
  type: 'department' | 'team' | 'group';
  leader: string;
  memberCount: number;
  parentId?: string;
  status: 'active' | 'inactive';
}

interface CategoryItem {
  id: string;
  code: string;
  name: string;
  type: string;
  order: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  description?: string;
}

interface RiskIndicator {
  id: string;
  code: string;
  name: string;
  type: 'high' | 'medium' | 'low';
  description: string;
  threshold: number;
  status: 'active' | 'inactive';
  effectiveFrom: string;
}

interface Checklist {
  id: string;
  code: string;
  name: string;
  topic: string;
  itemCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  description?: string;
  formTemplateId?: string; // ID của biểu mẫu liên kết
}

interface NotificationRule {
  id: string;
  name: string;
  event: string;
  condition: string;
  recipients: string;
  status: 'active' | 'inactive';
  description?: string;
}

interface ExportFile {
  id: string;
  filename: string;
  type: string;
  size: string;
  createdBy: string;
  createdAt: string;
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
}

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  result: 'success' | 'failed';
  details?: string;
}

interface DataChange {
  id: string;
  timestamp: string;
  table: string;
  recordId: string;
  action: 'create' | 'update' | 'delete';
  actor: string;
  fieldChanged: string;
  oldValue: string;
  newValue: string;
}

interface IntegrationStatus {
  id: string;
  name: string;
  type: 'INS' | 'VNeID' | 'Maps';
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
  message?: string;
}

const MAIN_TABS = [
  { id: 'users', label: 'Quản trị Người dùng & Phân quyền', icon: Users },
  { id: 'categories', label: 'Danh mục & Cấu hình', icon: Database },
  { id: 'audit', label: 'Audit – Giám sát – Tình trạng', icon: Activity },
] as const;

const SUB_TABS = {
  users: [
    { id: 'user-list', label: 'Quản lý người dùng', icon: Users },
    { id: 'roles', label: 'Vai trò', icon: Shield },
    { id: 'permissions-matrix', label: 'Ma trận quyền', icon: GitBranch },
    { id: 'territory', label: 'Địa bàn & phạm vi', icon: MapPin },
    { id: 'teams', label: 'Đơn vị / Đội', icon: Layers },
  ],
  categories: [
    { id: 'common-categories', label: 'Danh mục dùng chung', icon: Database },
    { id: 'risk-config', label: 'Cấu hình chỉ báo rủi ro', icon: TrendingUp },
    { id: 'checklist', label: 'Checklist theo chuyên đề', icon: CheckSquare },
    { id: 'form-templates', label: 'Thiết lập biểu mẫu', icon: FileText },
    { id: 'notification-rules', label: 'Quy tắc thông báo', icon: Bell },
  ],
  audit: [
    { id: 'export-center', label: 'Trung tâm xuất dữ liệu', icon: Download },
    { id: 'system-logs', label: 'Nhật ký hệ thống', icon: FileText },
    { id: 'data-changes', label: 'Biến động dữ liệu', icon: Activity },
    { id: 'export-logs', label: 'Nhật ký tải / xuất', icon: FileDown },
    { id: 'security-config', label: 'Cấu hình bảo mật', icon: Lock },
    { id: 'integration-status', label: 'Trạng thái tích hợp', icon: LinkIcon },
    { id: 'system-monitoring', label: 'Giám sát hệ thống', icon: Server },
    { id: 'system-status', label: 'Trạng thái hệ thống', icon: AlertCircle },
  ],
};

// Initial sample data - Generate lots of fake data
const INITIAL_USERS: User[] = generateUsers(250);
const INITIAL_ROLES: Role[] = generateRoles(20);
const INITIAL_TERRITORIES: Territory[] = generateTerritories(80);
const INITIAL_TEAMS: Team[] = generateTeams(50);
const INITIAL_CATEGORIES: CategoryItem[] = generateCategories(100);
const INITIAL_RISK_INDICATORS: RiskIndicator[] = generateRiskIndicators(35);
const INITIAL_CHECKLISTS: Checklist[] = generateChecklists(45);
const INITIAL_NOTIFICATION_RULES: NotificationRule[] = generateNotificationRules(30);

// Helper function to generate ID
const generateId = (prefix: string) => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Helper function to format date
const formatDate = () => {
  const now = new Date();
  return now.toISOString().slice(0, 16).replace('T', ' ');
};

export default function AdminPage() {
  const [activeMainTab, setActiveMainTab] = useState<MainTab>('users');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('user-list');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'view' | 'delete' | 'assign'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // 🎯 NEW: Ref to store refresh callback from TerritoryTabNew
  const territoryRefreshRef = React.useRef<(() => void) | null>(null);

  // Local storage for all data
  const [users, setUsers] = useLocalStorage<User[]>('mappa_admin_users', INITIAL_USERS);
  const [roles, setRoles] = useLocalStorage<Role[]>('mappa_admin_roles', INITIAL_ROLES);
  const [territories, setTerritories] = useLocalStorage<Territory[]>('mappa_admin_territories', INITIAL_TERRITORIES);
  const [teams, setTeams] = useLocalStorage<Team[]>('mappa_admin_teams', INITIAL_TEAMS);
  const [categories, setCategories] = useLocalStorage<CategoryItem[]>('mappa_admin_categories', INITIAL_CATEGORIES);
  const [riskIndicators, setRiskIndicators] = useLocalStorage<RiskIndicator[]>('mappa_admin_risks', INITIAL_RISK_INDICATORS);
  const [checklists, setChecklists] = useLocalStorage<Checklist[]>('mappa_admin_checklists_v2', INITIAL_CHECKLISTS);
  const [notificationRules, setNotificationRules] = useLocalStorage<NotificationRule[]>('mappa_admin_notifications', INITIAL_NOTIFICATION_RULES);

  const handleMainTabChange = (tabId: MainTab) => {
    setActiveMainTab(tabId);
    setActiveSubTab(SUB_TABS[tabId][0].id);
  };

  const handleOpenModal = (type: 'add' | 'edit' | 'view' | 'delete' | 'assign', item?: any) => {
    setModalType(type);
    setSelectedItem(item || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // CRUD handlers for Users
  const handleSaveUser = (formData: any) => {
    if (modalType === 'add') {
      const newUser: User = {
        id: generateId('U'),
        username: formData.username || '',
        fullName: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        role: formData.role || 'Cng dân',
        roleId: formData.roleId || 'R001',
        unit: formData.unit || 'N/A',
        unitId: formData.unitId || '',
        territory: formData.territory || 'N/A',
        territoryId: formData.territoryId || '',
        status: formData.status || 'pending',
        createdAt: formatDate(),
        createdBy: 'admin',
      };
      setUsers([...users, newUser]);
      toast.success('Người dng đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setUsers(users.map(u => u.id === selectedItem.id ? { ...u, ...formData } : u));
      toast.success('Người dùng đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteUser = () => {
    if (selectedItem) {
      setUsers(users.filter(u => u.id !== selectedItem.id));
      toast.success('Người dùng đã được xóa thành công');
    }
    handleCloseModal();
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'locked' : 'active' };
      }
      return u;
    }));
  };

  // CRUD handlers for Territories
  const handleSaveTerritory = async (formData: any) => {
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
      
      if (modalType === 'add') {
        // Create new area
        const response = await fetch(`${baseUrl}/areas`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: formData.code || '',
            name: formData.name || '',
            level: formData.level || 'PROVINCE',
            description: formData.description || null,
            status: formData.status !== undefined ? formData.status : 1,
            parentId: formData.parentId || null,
            managerId: formData.managerId || null,
            provinceId: formData.provinceId || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create area');
        }

        toast.success('Địa bàn đã được thêm thành công');
      } else if (modalType === 'edit' && selectedItem) {
        // Update existing area
        const response = await fetch(`${baseUrl}/areas/${selectedItem.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update area');
        }

        toast.success('Địa bàn đã được cập nhật thành công');
      }
    } catch (error: any) {
      console.error('Error saving territory:', error);
      toast.error(`Lỗi lưu dữ liệu: ${error.message}`);
    }
    handleCloseModal();
  };

  const handleDeleteTerritory = async () => {
    if (selectedItem) {
      try {
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e994bb5d`;
        const response = await fetch(`${baseUrl}/areas/${selectedItem.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete area');
        }

        toast.success('Địa bàn đã được xóa thành công');
      } catch (error: any) {
        console.error('Error deleting territory:', error);
        toast.error(`Lỗi xóa dữ liệu: ${error.message}`);
      }
    }
    handleCloseModal();
  };

  // CRUD handlers for Teams
  const handleSaveTeam = (formData: any) => {
    if (modalType === 'add') {
      const newTeam: Team = {
        id: generateId('T'),
        code: formData.code || '',
        name: formData.name || '',
        type: formData.type || 'team',
        leader: formData.leader || '',
        memberCount: 0,
        status: formData.status || 'active',
      };
      setTeams([...teams, newTeam]);
      toast.success('Đơn vị / Đội đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setTeams(teams.map(t => t.id === selectedItem.id ? { ...t, ...formData } : t));
      toast.success('Đơn vị / Đội đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteTeam = () => {
    if (selectedItem) {
      setTeams(teams.filter(t => t.id !== selectedItem.id));
      toast.success('Đơn vị / Đội đã được xóa thành công');
    }
    handleCloseModal();
  };

  // CRUD handlers for Categories
  const handleSaveCategory = (formData: any) => {
    if (modalType === 'add') {
      const newCategory: CategoryItem = {
        id: generateId('C'),
        code: formData.code || '',
        name: formData.name || '',
        type: formData.type || 'Loại hình cơ sở',
        order: categories.length + 1,
        effectiveFrom: formData.effectiveFrom || formatDate().split(' ')[0],
        version: 'v1.0',
        status: formData.status || 'draft',
        createdBy: 'admin',
        createdAt: formatDate(),
        description: formData.description || '',
      };
      setCategories([...categories, newCategory]);
      toast.success('Danh mục đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setCategories(categories.map(c => c.id === selectedItem.id ? { ...c, ...formData } : c));
      toast.success('Danh mục đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteCategory = () => {
    if (selectedItem) {
      setCategories(categories.filter(c => c.id !== selectedItem.id));
      toast.success('Danh mục đã được xóa thành công');
    }
    handleCloseModal();
  };

  // CRUD handlers for Risk Indicators
  const handleSaveRiskIndicator = (formData: any) => {
    if (modalType === 'add') {
      const newIndicator: RiskIndicator = {
        id: generateId('RI'),
        code: formData.code || '',
        name: formData.name || '',
        type: formData.type || 'low',
        description: formData.description || '',
        threshold: parseInt(formData.threshold) || 0,
        status: formData.status || 'active',
        effectiveFrom: formData.effectiveFrom || formatDate().split(' ')[0],
      };
      setRiskIndicators([...riskIndicators, newIndicator]);
      toast.success('Chỉ báo rủi ro đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setRiskIndicators(riskIndicators.map(r => r.id === selectedItem.id ? { ...r, ...formData } : r));
      toast.success('Chỉ báo rủi ro đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteRiskIndicator = () => {
    if (selectedItem) {
      setRiskIndicators(riskIndicators.filter(r => r.id !== selectedItem.id));
      toast.success('Chỉ báo rủi ro đã được xóa thành công');
    }
    handleCloseModal();
  };

  // CRUD handlers for Checklists
  const handleSaveChecklist = (formData: any) => {
    if (modalType === 'add') {
      const newChecklist: Checklist = {
        id: generateId('CL'),
        code: formData.code || '',
        name: formData.name || '',
        topic: formData.topic || '',
        itemCount: parseInt(formData.itemCount) || 0,
        status: formData.status || 'active',
        createdAt: formatDate(),
        description: formData.description || '',
        formTemplateId: formData.formTemplateId || null, // Liên kết với biểu mẫu
      };
      setChecklists([...checklists, newChecklist]);
      toast.success('Checklist đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setChecklists(checklists.map(c => c.id === selectedItem.id ? { ...c, ...formData } : c));
      toast.success('Checklist đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteChecklist = () => {
    if (selectedItem) {
      setChecklists(checklists.filter(c => c.id !== selectedItem.id));
      toast.success('Checklist đã được xóa thành công');
    }
    handleCloseModal();
  };

  // CRUD handlers for Notification Rules
  const handleSaveNotificationRule = (formData: any) => {
    if (modalType === 'add') {
      const newRule: NotificationRule = {
        id: generateId('NR'),
        name: formData.name || '',
        event: formData.event || '',
        condition: formData.condition || '',
        recipients: formData.recipients || '',
        status: formData.status || 'active',
        description: formData.description || '',
      };
      setNotificationRules([...notificationRules, newRule]);
      toast.success('Quy tắc thông báo đã được thêm thành công');
    } else if (modalType === 'edit' && selectedItem) {
      setNotificationRules(notificationRules.map(r => r.id === selectedItem.id ? { ...r, ...formData } : r));
      toast.success('Quy tắc thông báo đã được cập nhật thành công');
    }
    handleCloseModal();
  };

  const handleDeleteNotificationRule = () => {
    if (selectedItem) {
      setNotificationRules(notificationRules.filter(r => r.id !== selectedItem.id));
      toast.success('Quy tắc thông báo đã được xóa thành công');
    }
    handleCloseModal();
  };

  // CRUD handlers for Form Templates
  const handleSaveFormTemplate = (formData: any) => {
    if (modalType === 'add') {
      toast.info('Chức năng thêm biểu mẫu đang được phát triển');
      // TODO: Implement add form template logic
    } else if (modalType === 'edit' && selectedItem) {
      toast.info('Chức năng sửa biểu mẫu đang được phát triển');
      // TODO: Implement edit form template logic
    }
    handleCloseModal();
  };

  const handleDeleteFormTemplate = () => {
    if (selectedItem) {
      toast.info('Chức năng xóa biểu mẫu đang được phát triển');
      // TODO: Implement delete form template logic
    }
    handleCloseModal();
  };

  const handleSave = (formData: any) => {
    switch (activeSubTab) {
      case 'user-list':
        handleSaveUser(formData);
        break;
      case 'territory':
        handleSaveTerritory(formData);
        break;
      case 'teams':
        handleSaveTeam(formData);
        break;
      case 'risk-config':
        handleSaveRiskIndicator(formData);
        break;
      case 'checklist':
        handleSaveChecklist(formData);
        break;
      case 'notification-rules':
        handleSaveNotificationRule(formData);
        break;
      case 'form-templates':
        handleSaveFormTemplate(formData);
        break;
      default:
        handleCloseModal();
    }
  };

  const handleDelete = () => {
    switch (activeSubTab) {
      case 'user-list':
        handleDeleteUser();
        break;
      case 'territory':
        handleDeleteTerritory();
        break;
      case 'teams':
        handleDeleteTeam();
        break;
      case 'risk-config':
        handleDeleteRiskIndicator();
        break;
      case 'checklist':
        handleDeleteChecklist();
        break;
      case 'notification-rules':
        handleDeleteNotificationRule();
        break;
      case 'form-templates':
        handleDeleteFormTemplate();
        break;
      default:
        handleCloseModal();
    }
  };

  const renderContent = () => {
    // TAB 1: QUẢN TRỊ NGƯỜI DÙNG & PHÂN QUYỀN
    if (activeSubTab === 'user-list') return <UserListTabNew />;
    if (activeSubTab === 'roles') return <RolesManagementTab />;
    if (activeSubTab === 'permissions-matrix') return <PermissionsMatrixTabNew />;
    if (activeSubTab === 'territory') return (
      <TerritoryTabNew 
        territories={territories} 
        onOpenModal={handleOpenModal}
        onRefreshReady={(refreshFn) => {
          territoryRefreshRef.current = refreshFn;
        }}
      />
    );
    if (activeSubTab === 'teams') return <DepartmentsTab />;

    // TAB 2: DANH MỤC & CẤU HÌNH
    if (activeSubTab === 'common-categories') return <CommonCategoriesTab />;
    if (activeSubTab === 'risk-config') return <RiskConfigTab indicators={riskIndicators} onOpenModal={handleOpenModal} />;
    if (activeSubTab === 'checklist') return <ChecklistTabNew checklists={checklists} onOpenModal={handleOpenModal} />;
    if (activeSubTab === 'form-templates') return <FormTemplatesTab onOpenModal={handleOpenModal} />;
    if (activeSubTab === 'notification-rules') return <NotificationRulesTab rules={notificationRules} onOpenModal={handleOpenModal} />;

    // TAB 3: AUDIT – GIÁM SÁT
    if (activeSubTab === 'export-center') return <ExportCenterTab />;
    if (activeSubTab === 'system-logs') return <AuditLogTab />;
    if (activeSubTab === 'data-changes') return <DataChangesTab />;
    if (activeSubTab === 'export-logs') return <ExportLogTab />;
    if (activeSubTab === 'security-config') return <SecurityConfigTab />;
    if (activeSubTab === 'integration-status') return <IntegrationStatusTab />;
    if (activeSubTab === 'system-monitoring') return <SystemMonitorTab />;
    if (activeSubTab === 'system-status') return <SystemHealthTab />;

    return <div className={styles.placeholder}>Nội dung đang phát triển</div>;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>Trang chủ</span>
        <ChevronRight size={14} />
        <span className={styles.active}>Quản trị</span>
      </div>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Quản trị</h1>
          <p className={styles.pageSubtitle}>
            Quản lý người dùng, phân quyền, danh mục, cấu hình và giám sát hệ thống
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className={styles.mainTabs}>
        {MAIN_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`${styles.mainTab} ${activeMainTab === tab.id ? styles.mainTabActive : ''}`}
              onClick={() => handleMainTabChange(tab.id)}
            >
              <Icon size={20} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className={styles.contentContainer}>
        {/* Sub Tabs */}
        <div className={styles.subTabs}>
          {SUB_TABS[activeMainTab].map((subTab) => {
            const Icon = subTab.icon;
            return (
              <button
                key={subTab.id}
                className={`${styles.subTab} ${activeSubTab === subTab.id ? styles.subTabActive : ''}`}
                onClick={() => setActiveSubTab(subTab.id)}
              >
                <Icon size={16} />
                {subTab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {renderContent()}
        </div>
      </div>

      {/* Modal Rendering */}
      {showModal && (() => {
        // 🎯 SPECIAL: Use LocalityModal for territory tab
        if (activeSubTab === 'territory') {
          console.log('🔧 Opening LocalityModal - modalType:', modalType, 'selectedItem:', selectedItem);
          return (
            <LocalityModal
              mode={modalType === 'add' ? 'add' : modalType === 'edit' ? 'edit' : 'view'}
              data={selectedItem}
              onClose={handleCloseModal}
              onSave={() => {
                // 🎯 Trigger refresh using callback ref instead of window.location.reload()
                if (territoryRefreshRef.current) {
                  territoryRefreshRef.current();
                }
                handleCloseModal();
              }}
            />
          );
        }

        // Universal Modal for other tabs
        let currentItem = selectedItem;
        if (selectedItem && modalType !== 'add') {
          if (activeSubTab === 'user-list' && selectedItem.id) {
            currentItem = users.find(u => u.id === selectedItem.id) || selectedItem;
          } else if (activeSubTab === 'teams' && selectedItem.id) {
            currentItem = teams.find(t => t.id === selectedItem.id) || selectedItem;
          } else if (activeSubTab === 'category-management' && selectedItem.id) {
            currentItem = categories.find(c => c.id === selectedItem.id) || selectedItem;
          } else if (activeSubTab === 'risk-config' && selectedItem.id) {
            currentItem = riskIndicators.find(r => r.id === selectedItem.id) || selectedItem;
          } else if (activeSubTab === 'checklist' && selectedItem.id) {
            currentItem = checklists.find(c => c.id === selectedItem.id) || selectedItem;
          } else if (activeSubTab === 'notification-rules' && selectedItem.id) {
            currentItem = notificationRules.find(n => n.id === selectedItem.id) || selectedItem;
          }
        }

        return (
          <UniversalModal
            type={modalType}
            item={currentItem}
            subTab={activeSubTab}
            onClose={handleCloseModal}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        );
      })()}
    </div>
  );
}