import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Download,
  RefreshCw,
  Building2,
  CircleCheck,
  Clock,
  CirclePause,
  CircleX,
  Upload,
  History,
  FileText,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  StopCircle,
  Filter,
  X,
  Bell,
  AlertTriangle,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '../layouts/PageHeader';
import EmptyState from '../ui-kit/EmptyState';
import DataTable, { Column } from '../ui-kit/DataTable';
import { SearchInput } from '../ui-kit/SearchInput';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import SummaryCard from '../patterns/SummaryCard';
import BulkActionBar, { BulkAction } from '../patterns/BulkActionBar';
import FilterActionBar from '../patterns/FilterActionBar';
import ActionColumn, { CommonActions, Action } from '../patterns/ActionColumn';
import FacilityStatusBadge, { FacilityStatus } from '../ui-kit/FacilityStatusBadge';
import TableFooter from '../ui-kit/TableFooter';
import { ConfirmDialog, ConfirmVariant } from '../ui-kit/ConfirmDialog';
import { RiskDialog, RiskLevel } from '../ui-kit/RiskDialog';
import { QuickEditDialog, QuickEditData } from '../ui-kit/QuickEditDialog';
import { ImportDialog } from '../ui-kit/ImportDialog';
import { ExportDialog, ExportOptions } from '../ui-kit/ExportDialog';
import { AddStoreDialog, NewStoreData } from '../ui-kit/AddStoreDialog';
import { AddStoreDialogTabbed, NewStoreData as NewStoreDataTabbed } from '../ui-kit/AddStoreDialogTabbed';
import { AdvancedFilterPopup, AdvancedFilters } from '../ui-kit/AdvancedFilterPopup';
import { ApproveDialog, RejectDialog } from '../ui-kit/ApprovalDialogs';
import { mockStores, Store, addStore } from '../data/mockStores';
import { getProvinceByCode, getDistrictByName, getWardByCode } from '../data/vietnamLocations';
import { generateLegalDocuments } from '../data/mockLegalDocuments';
import { LegalDocumentItem, LegalDocument } from '../ui-kit/LegalDocumentItem';
import { LegalDocumentDialog } from '../ui-kit/LegalDocumentDialog';
import { BulkActionModal, BulkActionType } from '../ui-kit/BulkActionModal';
import { StoreImportDialog } from '../ui-kit/StoreImportDialog';
import { exportStoresToCSV, exportStoresPackage } from '../utils/exportStoresCSV';
import { downloadStoreImportTemplate, downloadExcelTemplate, parseImportFile, type ParsedStoreRow, type ValidationError } from '../utils/importTemplate';
import { getViolationsByStoreId } from '../data/mockViolations';
import { getComplaintsByStoreId } from '../data/mockComplaints';
import { PendingUpdatesDialog } from '../ui-kit/PendingUpdatesDialog';
import { getTotalPendingCount } from '../data/mockPendingUpdates';
import styles from './StoresListPage.module.css';

export default function StoresListPage() {
  // Router
  const navigate = useNavigate();
  
  // State management
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>('active'); // Default to 'active'
  
  // Filter states
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active'); // Default to 'active'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: ConfirmVariant;
    onConfirm: () => void;
    requireDoubleConfirm?: boolean;
  }>({
    open: false,
    title: '',
    description: '',
    variant: 'default',
    onConfirm: () => {},
  });
  const [riskDialog, setRiskDialog] = useState<{
    open: boolean;
    storeId: number;
    storeName: string;
  }>({ open: false, storeId: 0, storeName: '' });
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    store: Store | null;
  }>({ open: false, store: null });

  // New dialog states
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilters>({
    hasViolations: 'all',
    hasComplaints: 'all',
    riskLevel: 'all',
    businessType: 'all',
  });
  const [legalDocDialog, setLegalDocDialog] = useState<{
    open: boolean;
    document: LegalDocument | null;
  }>({ open: false, document: null });
  
  // Bulk Action Modal state
  const [bulkActionModal, setBulkActionModal] = useState<{
    open: boolean;
    actionType: BulkActionType;
    loading: boolean;
  }>({
    open: false,
    actionType: 'export',
    loading: false,
  });

  // Approval Dialog states
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    storeId: number;
    storeName: string;
  }>({ open: false, storeId: 0, storeName: '' });

  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    storeId: number;
    storeName: string;
  }>({ open: false, storeId: 0, storeName: '' });
  
  // Pending Updates Dialog state
  const [pendingUpdatesDialogOpen, setPendingUpdatesDialogOpen] = useState(false);
  
  // LocalStorage key
  const STORES_STORAGE_KEY = 'mappa_stores';

  // Data state - Load from localStorage or use mock data
  const [stores, setStores] = useState<Store[]>(() => {
    try {
      const savedStores = localStorage.getItem(STORES_STORAGE_KEY);
      if (savedStores) {
        return JSON.parse(savedStores);
      }
    } catch (error) {
      console.error('Error loading stores from localStorage:', error);
    }
    return mockStores;
  });

  // Save stores to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores));
    } catch (error) {
      console.error('Error saving stores to localStorage:', error);
    }
  }, [stores]);

  // Helper function to apply advanced filters
  const applyAdvancedFilter = (data: Store[], filters: AdvancedFilters): Store[] => {
    let filtered = data;

    // Filter by violations
    if (filters.hasViolations && filters.hasViolations !== 'all') {
      filtered = filtered.filter(store => {
        const violations = getViolationsByStoreId(store.id);
        const hasViolations = violations.length > 0;
        return filters.hasViolations === 'yes' ? hasViolations : !hasViolations;
      });
    }

    // Filter by complaints
    if (filters.hasComplaints && filters.hasComplaints !== 'all') {
      filtered = filtered.filter(store => {
        const complaints = getComplaintsByStoreId(store.id);
        const hasComplaints = complaints.length > 0;
        return filters.hasComplaints === 'yes' ? hasComplaints : !hasComplaints;
      });
    }

    // Filter by risk level
    if (filters.riskLevel && filters.riskLevel !== 'all') {
      filtered = filtered.filter(store => {
        if (filters.riskLevel === 'none') {
          // "Không có rủi ro" means riskLevel is null/undefined or explicitly 'none'
          return !store.riskLevel || store.riskLevel === 'none';
        }
        return store.riskLevel === filters.riskLevel;
      });
    }

    // Filter by business type
    if (filters.businessType && filters.businessType !== 'all') {
      filtered = filtered.filter(store => {
        return store.businessType === filters.businessType;
      });
    }

    return filtered;
  };

  // Action handlers
  const handleEdit = (store: Store) => {
    setEditDialog({ open: true, store });
  };

  const handleEditConfirm = (data: QuickEditData) => {
    // Create approval request (mock)
    const approvalRequest = {
      id: Date.now(),
      storeId: editDialog.store?.id,
      storeName: editDialog.store?.name,
      type: 'quick-edit',
      changedFields: Object.keys(data).filter(key => 
        key !== 'changeReason' && data[key as keyof QuickEditData] !== (editDialog.store as any)?.[key]
      ),
      newData: data,
      changeReason: data.changeReason,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      submittedBy: 'Current User', // In production, get from auth context
    };


    // In production:
    // - Save to approval queue
    // - Show pending badge on store
    // - Send notification to approver
    
    // For now, just update the store data immediately (for demo)
    // In production, data only updates after approval
    setStores(prev =>
      prev.map(s => (s.id === editDialog.store?.id ? { 
        ...s, 
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes,
        tags: data.tags,
        // Add pending approval indicator
        hasPendingApproval: true,
        pendingApprovalType: 'quick-edit',
      } : s))
    );
    
    toast.success(
      'Thay đổi đã được gửi và đang chờ phê duyệt',
      {
        description: 'Bạn sẽ nhận được thông báo khi yêu cầu được xử lý.',
        duration: 5000,
      }
    );
  };

  const handleAssignRisk = (store: Store) => {
    setRiskDialog({ open: true, storeId: store.id, storeName: store.name });
  };

  const handleRiskConfirm = (data: {
    level: RiskLevel;
    reason: string;
    note: string;
  }) => {
    setStores(prev =>
      prev.map(s => (s.id === riskDialog.storeId ? { ...s, riskLevel: data.level } : s))
    );
    toast.success(
      `Gắn rủi ro mức độ ${data.level === 'high' ? 'Cao' : data.level === 'medium' ? 'Trung bình' : 'Thấp'} thành công`
    );
  };

  const handleSuspend = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Tạm ngừng hoạt động',
      description: `Bạn có chắc chắn muốn tạm ngừng hoạt động của cơ sở "${store.name}"?`,
      variant: 'warning',
      onConfirm: () => {
        setStores((prev) =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'suspended' as FacilityStatus } : s))
        );
        toast.success('Tạm ngừng cơ sở thành công');
      },
    });
  };

  const handleClose = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Ngừng hoạt động',
      description: `Bạn có chắc chắn muốn ngừng hoạt động vĩnh viễn cơ sở "${store.name}"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      requireDoubleConfirm: true,
      onConfirm: () => {
        setStores(prev =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'closed' as FacilityStatus } : s))
        );
        toast.success('Ngừng hoạt động cơ sở thành công');
      },
    });
  };

  const handleResume = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Khôi phục hoạt động',
      description: `Bạn có chắc chn muốn khôi phục hoạt động cơ sở "${store.name}"?`,
      variant: 'default',
      onConfirm: () => {
        setStores(prev =>
          prev.map(s => (s.id === store.id ? { ...s, status: 'active' as FacilityStatus } : s))
        );
        toast.success('Khôi phục cơ sở thành công');
      },
    });
  };

  const handleDelete = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Xóa cơ sở',
      description: `Bạn có chắc chắn muốn xóa cơ sở \"${store.name}\"? Hành động này không thể hoàn tác.`,
      variant: 'danger',
      onConfirm: () => {
        setStores(prev => prev.filter(s => s.id !== store.id));
        toast.success('Xóa cơ sở thành công');
      },
    });
  };

  // Approval handlers
  const handleApprove = (storeId: number) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;
    
    setApproveDialog({
      open: true,
      storeId: store.id,
      storeName: store.name,
    });
  };

  const handleReject = (storeId: number) => {
    const store = stores.find(s => s.id === storeId);
    if (!store) return;
    
    setRejectDialog({
      open: true,
      storeId: store.id,
      storeName: store.name,
    });
  };

  const handleApproveConfirm = (reason: string, verifyText: string) => {
    const store = stores.find(s => s.id === approveDialog.storeId);
    if (!store) return;

    // Update store status to active
    setStores(prev =>
      prev.map(s => (s.id === approveDialog.storeId ? { ...s, status: 'active' as FacilityStatus } : s))
    );

    // Audit log (in production, send to backend)
    // {
    //   storeId: approveDialog.storeId,
    //   storeName: approveDialog.storeName,
    //   action: 'approve',
    //   oldStatus: store.status,
    //   newStatus: 'active',
    //   reason,
    //   verifyText,
    //   timestamp: new Date().toISOString(),
    //   performedBy: 'Current User',
    // }

    toast.success(`Đã phê duyệt cửa hàng "${approveDialog.storeName}"`, {
      description: 'Cửa hàng đã chuyển sang trạng thái "Đang hoạt động"',
      duration: 5000,
    });

    setApproveDialog({ open: false, storeId: 0, storeName: '' });
  };

  const handleRejectConfirm = (reason: string, verifyText: string) => {
    const store = stores.find(s => s.id === rejectDialog.storeId);
    if (!store) return;

    // Update store status to rejected
    setStores(prev =>
      prev.map(s => (s.id === rejectDialog.storeId ? { ...s, status: 'rejected' as FacilityStatus } : s))
    );

    // Audit log (in production, send to backend)
    // {
    //   storeId: rejectDialog.storeId,
    //   storeName: rejectDialog.storeName,
    //   action: 'reject',
    //   oldStatus: store.status,
    //   newStatus: 'rejected',
    //   reason,
    //   verifyText,
    //   timestamp: new Date().toISOString(),
    //   performedBy: 'Current User',
    // }

    toast.error(`Đã từ chối phê duyệt cửa hàng "${rejectDialog.storeName}"`, {
      description: 'Cửa hàng đã chuyển sang trạng thái "Từ chối phê duyệt"',
      duration: 5000,
    });

    setRejectDialog({ open: false, storeId: 0, storeName: '' });
  };
  
  // Calculate summary stats
  const stats = {
    total: stores.length,
    active: stores.filter(s => s.status === 'active').length,
    pending: stores.filter(s => s.status === 'pending').length,
    suspended: stores.filter(s => s.status === 'suspended').length,
    closed: stores.filter(s => s.status === 'closed').length,
    other: stores.filter(s => 
      s.status !== 'active' && 
      s.status !== 'pending' && 
      s.status !== 'suspended' && 
      s.status !== 'closed'
    ).length,
    highRisk: stores.filter(s => s.riskLevel === 'high').length,
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    let filtered = stores;

    // Apply basic filters
    if (jurisdictionFilter !== 'all') {
      filtered = filtered.filter(s => s.jurisdiction === jurisdictionFilter);
    }
    
    // Handle status filter - including "other" category
    if (statusFilter !== 'all') {
      if (statusFilter === 'other') {
        // "Other" is a group of statuses that are not in the main categories
        filtered = filtered.filter(s => 
          s.status !== 'active' && 
          s.status !== 'pending' && 
          s.status !== 'suspended' && 
          s.status !== 'closed'
        );
      } else {
        // Normal status filter (active, pending, suspended, closed, etc.)
        filtered = filtered.filter(s => s.status === statusFilter);
      }
    }
    
    if (searchValue) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        s.address.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (activeFilter) {
      if (activeFilter === 'highRisk') {
        filtered = filtered.filter(s => s.riskLevel === 'high');
      } else if (activeFilter === 'other') {
        // Filter for "other" statuses (not active, pending, suspended, closed)
        filtered = filtered.filter(s => 
          s.status !== 'active' && 
          s.status !== 'pending' && 
          s.status !== 'suspended' && 
          s.status !== 'closed'
        );
      } else {
        filtered = filtered.filter(s => s.status === activeFilter);
      }
    }

    // Apply advanced filter if present
    if (advancedFilter) {
      filtered = applyAdvancedFilter(filtered, advancedFilter);
    }

    return filtered;
  }, [jurisdictionFilter, statusFilter, searchValue, activeFilter, advancedFilter, stores]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Get selected stores objects
  const selectedStores = useMemo(() => {
    return stores.filter(store => selectedRows.has(store.id));
  }, [stores, selectedRows]);

  // Bulk action handlers
  const handleBulkAction = (actionType: BulkActionType) => {
    setBulkActionModal({
      open: true,
      actionType,
      loading: false,
    });
  };

  const handleBulkActionConfirm = async (reason?: string) => {
    setBulkActionModal(prev => ({ ...prev, loading: true }));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const { actionType } = bulkActionModal;
    const validStoreIds = selectedStores
      .filter(store => {
        // Apply validation rules
        switch (actionType) {
          case 'approve':
            return store.status === 'pending';
          case 'reject':
            return store.status === 'pending' || store.status === 'active';
          case 'suspend':
            return store.status === 'active';
          case 'activate':
            return store.status === 'suspended';
          case 'close':
            return store.status === 'suspended' || store.status === 'active';
          case 'export':
            return true;
          default:
            return false;
        }
      })
      .map(s => s.id);

    const processedCount = validStoreIds.length;

    // Apply bulk changes
    if (actionType !== 'export') {
      setStores(prev =>
        prev.map(store => {
          if (!validStoreIds.includes(store.id)) return store;

          let newStatus: FacilityStatus = store.status;
          switch (actionType) {
            case 'approve':
              newStatus = 'active';
              break;
            case 'reject':
              newStatus = 'pending';
              break;
            case 'suspend':
              newStatus = 'suspended';
              break;
            case 'activate':
              newStatus = 'active';
              break;
            case 'close':
              newStatus = 'closed';
              break;
          }

          // Audit log (in production, send to backend)
          // {
          //   storeId: store.id,
          //   storeName: store.name,
          //   action: actionType,
          //   oldStatus: store.status,
          //   newStatus,
          //   reason,
          //   timestamp: new Date().toISOString(),
          //   performedBy: 'Current User', // In production, get from auth context
          // }

          return { ...store, status: newStatus };
        })
      );
    }

    // Success feedback
    const actionLabels: Record<BulkActionType, string> = {
      approve: 'phê duyệt',
      reject: 'từ chi',
      suspend: 'tạm ngừng',
      activate: 'kích hoạt lại',
      close: 'ngừng hoạt động',
      export: 'xuất',
    };

    if (actionType === 'export') {
      toast.success(`Xuất ${processedCount} cơ sở thành công`);
    } else {
      toast.success(
        `${actionLabels[actionType].charAt(0).toUpperCase() + actionLabels[actionType].slice(1)} ${processedCount} cơ sở thành công`,
        {
          description: reason ? `Lý do: ${reason}` : undefined,
          duration: 5000,
        }
      );
    }

    // Close modal and clear selection
    setBulkActionModal({ open: false, actionType: 'export', loading: false });
    setSelectedRows(new Set());
  };

  // Bulk actions configuration
  const bulkActions: BulkAction[] = [
    {
      label: 'Xuất CSV',
      onClick: () => handleBulkAction('export'),
      variant: 'secondary',
      icon: <Download size={16} />,
    },
    {
      label: 'Phê duyệt',
      onClick: () => handleBulkAction('approve'),
      variant: 'default',
      icon: <CheckCircle2 size={16} />,
    },
    {
      label: 'Từ chối',
      onClick: () => handleBulkAction('reject'),
      variant: 'secondary',
      icon: <XCircle size={16} />,
    },
    {
      label: 'Tạm ngừng',
      onClick: () => handleBulkAction('suspend'),
      variant: 'secondary',
      icon: <Pause size={16} />,
    },
    {
      label: 'Kích hoạt lại',
      onClick: () => handleBulkAction('activate'),
      variant: 'default',
      icon: <Play size={16} />,
    },
    {
      label: 'Ngừng hoạt động',
      onClick: () => handleBulkAction('close'),
      variant: 'destructive',
      icon: <StopCircle size={16} />,
    },
  ];

  // Get actions for a store based on its status
  const getStoreActions = (store: Store): Action[] => {
    const actions: Action[] = [];

    switch (store.status) {
      case 'pending':
      case 'rejected':
        // Chờ duyệt & Từ chối phê duyệt: Xem chi tiết, Chỉnh sửa, Xóa (3 actions - show all)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.edit(() => handleEdit(store)),
          CommonActions.delete(() => handleDelete(store))
        );
        break;
      
      case 'active':
        // Đang hoạt động: Full actions (7 actions - show top 3 + menu)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.edit(() => handleEdit(store)),
          CommonActions.assignRisk(() => handleAssignRisk(store)),
          CommonActions.viewHistory(() => navigate(`/registry/stores/${store.id}?tab=inspections`)),
          CommonActions.viewViolations(() => navigate(`/registry/stores/${store.id}?tab=violations`)),
          CommonActions.viewLegal(() => navigate(`/registry/stores/${store.id}?tab=legal`)),
          { ...CommonActions.pause(() => handleSuspend(store)), separator: true }
        );
        break;
      
      case 'underInspection':
        // Đang xử lý kiểm tra: Xem chi tiết, Lịch sử (2 actions - show all)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.viewHistory(() => navigate(`/registry/stores/${store.id}?tab=history`))
        );
        break;
      
      case 'suspended':
        // Tạm ngưng: Xem chi tiết, Kích hoạt lại, Ngừng hoạt động (3 actions - show all)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.resume(() => handleResume(store)),
          { ...CommonActions.delete(() => handleClose(store)), label: 'Ngừng hoạt động', separator: true }
        );
        break;
      
      case 'closed':
        // Ngừng hoạt động: Xem chi tiết, Lịch sử và Xóa (3 actions - show all)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.viewHistory(() => navigate(`/registry/stores/${store.id}?tab=history`)),
          { ...CommonActions.delete(() => handleDelete(store)), separator: true }
        );
        break;
    }

    return actions;
  };

  // Define table columns
  const columns: Column<Store>[] = [
    {
      key: 'stt',
      label: 'STT',
      width: '60px',
      render: (store, index) => {
        // Calculate STT based on pagination
        const stt = (currentPage - 1) * pageSize + (index || 0) + 1;
        return <div style={{ textAlign: 'center', fontWeight: 'var(--font-weight-medium)' }}>{stt}</div>;
      },
    },
    {
      key: 'name',
      label: 'Tên cơ sở',
      sortable: true,
      width: '300px', // Increased to 300px to prevent text overflow
      render: (store) => (
        <div>
          <div className={styles.storeName}>{store.name}</div>
          <div className={styles.storeType}>{store.type}</div>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Chủ hộ kinh doanh',
      sortable: true,
      width: '190px', // Adjusted for better balance
      render: (store) => {
        // Debug log to verify ownerPhone exists
        if (store.id === 1) {
        }
        return (
          <div>
            <div>{store.ownerName || '—'}</div>
            {store.ownerPhone && (
              <div className={styles.ownerPhone}>{store.ownerPhone}</div>
            )}
          </div>
        );
      },
    },
    {
      key: 'taxCode',
      label: 'Mã số thuế',
      sortable: true,
      width: '140px', // Optimized for 10-13 digit tax codes
      truncate: true,
      render: (store) => store.taxCode || '—',
    },
    {
      key: 'address',
      label: 'Địa chỉ',
      sortable: true,
      width: '300px', // Keep at 300px for addresses
      truncate: true,
      render: (store) => store.address,
    },
    {
      key: 'jurisdiction',
      label: 'Địa bàn',
      sortable: true,
      width: '110px', // Reduced slightly for balance
      render: (store) => store.jurisdiction,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      width: '180px', // Increased for full status badge text
      render: (store) => <FacilityStatusBadge status={store.status} />,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      width: '160px', // Increased from 120px to fit 4 icons + gaps + padding
      sticky: 'right',
      render: (store) => (
        <ActionColumn
          actions={getStoreActions(store)}
        />
      ),
    },
  ];

  // Handle row selection
  const handleSelectRow = (id: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(paginatedData.map(s => s.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [jurisdictionFilter, statusFilter, searchValue, activeFilter]);

  // Sync activeFilter when statusFilter changes from dropdown
  useEffect(() => {
    if (statusFilter === 'all') {
      setActiveFilter(null);
    } else {
      setActiveFilter(statusFilter);
    }
  }, [statusFilter]);

  // Handler to navigate to map with filters
  const handleNavigateToMap = () => {
    // Prepare filters to pass to map page (exclude searchValue which is "Tên cơ sở")
    const mapFilters: Record<string, string> = {};
    
    // Add jurisdiction filter
    if (jurisdictionFilter && jurisdictionFilter !== 'all') {
      mapFilters.jurisdiction = jurisdictionFilter;
    }
    
    // Add status filter
    if (statusFilter && statusFilter !== 'all') {
      mapFilters.status = statusFilter;
    }
    
    // Add advanced filters
    if (advancedFilter.hasViolations !== 'all') {
      mapFilters.hasViolations = advancedFilter.hasViolations;
    }
    if (advancedFilter.hasComplaints !== 'all') {
      mapFilters.hasComplaints = advancedFilter.hasComplaints;
    }
    if (advancedFilter.riskLevel !== 'all') {
      mapFilters.riskLevel = advancedFilter.riskLevel;
    }
    if (advancedFilter.businessType !== 'all') {
      mapFilters.businessType = advancedFilter.businessType;
    }
    
    // Navigate to map page with filters as state
    navigate('/map', { 
      state: { 
        filters: mapFilters,
        fromPage: 'stores-list'
      } 
    });
  };

  // Check if there are any filters applied (for disabling map button)
  const hasFiltersApplied = 
    jurisdictionFilter !== 'all' || 
    statusFilter !== 'all' ||
    advancedFilter.hasViolations !== 'all' ||
    advancedFilter.hasComplaints !== 'all' ||
    advancedFilter.riskLevel !== 'all' ||
    advancedFilter.businessType !== 'all';

  return (
    <div className={styles.pageContainer}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Cơ sở & Địa bàn' }
        ]}
        title="Tra cứu cơ sở"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => {
              setSearchValue('');
              setJurisdictionFilter('all');
              setStatusFilter('all');
              setActiveFilter(null);
              toast.success('Đã tải lại dữ liệu');
            }}>
              <RefreshCw size={16} />
              Tải lại
            </Button>
            <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
              <Upload size={16} />
              Nhập dữ liệu
            </Button>
            <Button variant="outline" size="sm" onClick={() => {
              // Export based on current filters and selection
              let storesToExport = stores;
              
              // If rows are selected, only export selected
              if (selectedRows.size > 0) {
                storesToExport = stores.filter(store => selectedRows.has(store.id));
              }
              
              // Generate filename with timestamp
              const timestamp = new Date().toISOString().split('T')[0];
              const filename = `danh-sach-cua-hang_${timestamp}`;
              
              exportStoresPackage(storesToExport, filename);
              
              const filterDesc = selectedRows.size > 0 
                ? `${selectedRows.size} cửa hàng được chọn`
                : filteredData.length < stores.length 
                  ? `${filteredData.length} cửa hàng (đã lọc)`
                  : `${stores.length} cửa hàng`;
              
              toast.success(
                `Xuất dữ liệu thành công`,
                {
                  description: `Đã xuất ${filterDesc} sang file CSV`,
                  duration: 5000,
                }
              );
            }}>
              <Download size={16} />
              Xuất dữ liệu
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => setPendingUpdatesDialogOpen(true)}
              className={styles.pendingButton}
              title="Danh sách thông tin cơ sở & hồ sơ pháp lý đang chờ phê duyệt"
            >
              <Bell size={16} />
              Chờ duyệt
              <Badge 
                variant="destructive" 
                className={styles.pendingBadge}
              >
                {getTotalPendingCount()}
              </Badge>
            </Button>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus size={16} />
              Thêm mới
            </Button>
          </>
        }
      />

      {/* Filters Section */}
      <div className={styles.summaryContainer}>
        {/* Summary Cards - Reordered: Tổng số cơ sở moved to last */}
        <div className={styles.summaryGrid}>
          <SummaryCard
            label="Đang hoạt động"
            value={stats.active}
            icon={CircleCheck}
            variant="success"
            active={activeFilter === 'active'}
            onClick={() => {
              setActiveFilter('active');
              setStatusFilter('active'); // Sync với filter dropdown
            }}
          />
          <SummaryCard
            label="Chờ duyệt"
            value={stats.pending}
            icon={Clock}
            variant="warning"
            active={activeFilter === 'pending'}
            onClick={() => {
              setActiveFilter('pending');
              setStatusFilter('pending'); // Sync với filter dropdown
            }}
          />
          <SummaryCard
            label="Tạm ngừng"
            value={stats.suspended}
            icon={CirclePause}
            variant="danger"
            active={activeFilter === 'suspended'}
            onClick={() => {
              setActiveFilter('suspended');
              setStatusFilter('suspended'); // Sync với filter dropdown
            }}
          />
          <SummaryCard
            label="Ngừng hoạt động"
            value={stats.closed}
            icon={CircleX}
            variant="neutral"
            active={activeFilter === 'closed'}
            onClick={() => {
              setActiveFilter('closed');
              setStatusFilter('closed'); // Sync với filter dropdown
            }}
          />
          {stats.other > 0 && (
            <SummaryCard
              label="Khác"
              value={stats.other}
              icon={AlertTriangle}
              variant="warning"
              active={activeFilter === 'other'}
              onClick={() => {
                setActiveFilter('other');
                setStatusFilter('other'); // Fixed: Use 'other' instead of 'all'
              }}
            />
          )}
          <SummaryCard
            label="Tổng số cơ sở"
            value={stats.total}
            icon={Building2}
            variant="info"
            active={activeFilter === null}
            onClick={() => {
              setActiveFilter(null);
              setStatusFilter('all'); // Sync với filter dropdown
            }}
          />
        </div>

        {/* QLTT Standard: Filters Layout - Advanced | Địa bàn | Trạng thái | Tên cơ sở | Bản đồ */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--spacing-3)', 
          padding: 'var(--spacing-4) 0',
          width: '100%'
        }}>
          {/* 1. Advanced Filter (icon only) */}
          <AdvancedFilterPopup
            appliedFilters={advancedFilter}
            onApply={(filters) => {
              setAdvancedFilter(filters);
              toast.success('Đã áp dụng bộ lọc nâng cao');
            }}
            onClear={() => {
              setAdvancedFilter({
                hasViolations: 'all',
                hasComplaints: 'all',
                riskLevel: 'all',
                businessType: 'all',
              });
              toast.success('Đã xoá bộ lọc nâng cao');
            }}
            hasActiveFilters={
              advancedFilter.hasViolations !== 'all' ||
              advancedFilter.hasComplaints !== 'all' ||
              advancedFilter.riskLevel !== 'all' ||
              advancedFilter.businessType !== 'all'
            }
            iconOnly={true}
          />

          {/* 2. Địa bàn */}
          <Select value={jurisdictionFilter} onValueChange={setJurisdictionFilter}>
            <SelectTrigger style={{ width: '200px' }}>
              <SelectValue placeholder="-- Địa bàn --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả địa bàn</SelectItem>
              <SelectItem value="Quận 1">Quận 1</SelectItem>
              <SelectItem value="Quận 3">Quận 3</SelectItem>
              <SelectItem value="Quận 5">Quận 5</SelectItem>
              <SelectItem value="Quận 10">Quận 10</SelectItem>
            </SelectContent>
          </Select>

          {/* 3. Trạng thái */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger style={{ width: '200px' }}>
              <SelectValue placeholder="-- Trạng thái --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="underInspection">Đang xử lý kiểm tra</SelectItem>
              <SelectItem value="suspended">Tạm ngưng</SelectItem>
              <SelectItem value="rejected">Từ chối phê duyệt</SelectItem>
              <SelectItem value="closed">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>

          {/* 4. Tên cơ sở (medium width) */}
          <SearchInput
            placeholder="Tên cơ sở"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: '280px' }}
          />

          {/* 5. Bản đồ Button (secondary, gọn) */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNavigateToMap}
            disabled={!hasFiltersApplied}
            title={!hasFiltersApplied ? 'Vui lòng chọn ít nhất một bộ lọc để xem bản đồ' : 'Xem trên bản đồ điều hành'}
            style={{
              height: '38px',
              padding: '0 var(--spacing-4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
            }}
          >
            <Map size={16} />
            Bản đồ
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className={styles.tableContainer}>
        <Card>
          <CardContent className={styles.tableCard}>
            {/* Bulk Action Bar - inline in table */}
            {selectedRows.size > 0 && (
              <BulkActionBar
                selectedCount={selectedRows.size}
                actions={bulkActions}
                onClear={() => setSelectedRows(new Set())}
              />
            )}
            
            <DataTable
              columns={columns}
              data={paginatedData}
              selectable={true}
              selectedRows={selectedRows}
              onSelectRow={handleSelectRow}
              onSelectAll={handleSelectAll}
              getRowId={(store) => store.id}
            />
            
            {/* QLTT Standard: Footer with Pagination */}
            <TableFooter
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={filteredData.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        requireDoubleConfirm={confirmDialog.requireDoubleConfirm}
      />

      <RiskDialog
        open={riskDialog.open}
        onOpenChange={(open) => setRiskDialog({ ...riskDialog, open })}
        storeName={riskDialog.storeName}
        onConfirm={handleRiskConfirm}
      />

      <QuickEditDialog
        open={editDialog.open}
        onOpenChange={(open) => setEditDialog({ ...editDialog, open })}
        store={editDialog.store}
        onConfirm={handleEditConfirm}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <StoreImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onDownloadTemplate={() => {
          downloadExcelTemplate(); // Download Excel với demo data
          toast.success('Đã tải file mẫu Excel với dữ liệu demo');
        }}
        onImport={async (file: File) => {
          try {
            // Parse file
            const result = await parseImportFile(file);
            
            // Close import dialog
            setImportDialogOpen(false);
            
            // Navigate to review page with result
            navigate('/registry/import-review', { 
              state: { importResult: result } 
            });
          } catch (error: any) {
            console.error('Import failed:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi xử lý file');
          }
        }}
      />

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        totalRecords={stores.length}
        selectedCount={selectedRows.size}
        onExport={(options: ExportOptions) => {
          toast.success('Xuất dữ liệu thành công');
        }}
      />

      <AddStoreDialogTabbed
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={(data: NewStoreDataTabbed) => {
          
          // Get district name from code
          const districtName = getDistrictByName(data.jurisdiction)?.name || data.jurisdiction;
          
          // Generate new ID (highest existing ID + 1)
          const maxId = Math.max(...stores.map(s => s.id), 0);
          const newId = maxId + 1;
          
          const newStore: Store = {
            id: newId,
            name: data.name,
            type: data.industryName || 'Chưa xác định',
            address: data.registeredAddress,
            province: data.province,
            provinceCode: data.province,
            jurisdiction: districtName,
            jurisdictionCode: data.jurisdiction,
            ward: data.ward,
            wardCode: data.ward,
            managementUnit: data.managementUnit || `Chi cục QLTT ${districtName}`,
            status: (data.status || 'pending') as FacilityStatus,
            riskLevel: 'none',
            lastInspection: 'Chưa kiểm tra',
            latitude: data.latitude,
            longitude: data.longitude,
            gpsCoordinates: data.latitude && data.longitude 
              ? `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}` 
              : undefined,
            // Tab 1: Thông tin HKD
            taxCode: data.taxCode,
            industryName: data.industryName,
            establishedDate: data.establishedDate,
            operationStatus: data.operationStatus,
            businessArea: data.businessArea,
            businessPhone: data.businessPhone,
            email: data.email,
            website: data.website,
            fax: data.fax,
            notes: data.notes,
            // Tab 2: Thông tin chủ hộ
            ownerName: data.ownerName,
            ownerBirthYear: data.ownerBirthYear,
            ownerIdNumber: data.ownerIdNumber,
            ownerPhone: data.ownerPhone,
            // Tab 3: Địa chỉ
            registeredAddress: data.registeredAddress,
            headquarterAddress: data.headquarterAddress,
            productionAddress: data.productionAddress,
            // Compatibility fields
            phone: data.ownerPhone,
            businessType: data.industryName,
            isVerified: false,
          };
          
          
          // Add to global store registry
          addStore(newStore);
          
          // Thêm vào đầu danh sách (prepend)
          setStores(prev => [newStore, ...prev]);
          // Chuyển về trang 1 để thấy dữ liệu mới
          setCurrentPage(1);
          toast.success('Thêm cửa hàng thành công', {
            description: 'Cửa hàng mới đã được thêm và đang chờ phê duyệt',
          });
        }}
      />

      <LegalDocumentDialog
        open={legalDocDialog.open}
        onOpenChange={(open) => setLegalDocDialog({ ...legalDocDialog, open })}
        document={legalDocDialog.document}
      />

      <BulkActionModal
        open={bulkActionModal.open}
        onOpenChange={(open) => setBulkActionModal({ ...bulkActionModal, open })}
        actionType={bulkActionModal.actionType}
        selectedStores={selectedStores}
        loading={bulkActionModal.loading}
        onConfirm={handleBulkActionConfirm}
      />

      <ApproveDialog
        open={approveDialog.open}
        onOpenChange={(open) => setApproveDialog({ ...approveDialog, open })}
        storeName={approveDialog.storeName}
        onConfirm={handleApproveConfirm}
      />

      <RejectDialog
        open={rejectDialog.open}
        onOpenChange={(open) => setRejectDialog({ ...rejectDialog, open })}
        storeName={rejectDialog.storeName}
        onConfirm={handleRejectConfirm}
      />

      <PendingUpdatesDialog
        open={pendingUpdatesDialogOpen}
        onClose={() => setPendingUpdatesDialogOpen(false)}
      />
    </div>
  );
}