import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  StopCircle,
  Bell,
  AlertTriangle,
  Map,
} from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/layouts/PageHeader';
import { ExportDialog, ExportOptions } from '@/components/ui-kit/ExportDialog';
import { ImportDialog } from '@/components/ui-kit/ImportDialog';
import { AddStoreDialog, NewStoreData } from '@/components/ui-kit/AddStoreDialog';
import DataTable, { Column } from '@/components/ui-kit/DataTable';
import { SearchInput } from '@/components/ui-kit/SearchInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SummaryCard from '@/components/patterns/SummaryCard';
import BulkActionBar, { BulkAction } from '@/components/patterns/BulkActionBar';
import ActionColumn, { CommonActions, Action } from '@/components/patterns/ActionColumn';
import FacilityStatusBadge, { FacilityStatus } from '@/components/ui-kit/FacilityStatusBadge';
import TableFooter from '@/components/ui-kit/TableFooter';
import { ConfirmDialog, ConfirmVariant } from '@/components/ui-kit/ConfirmDialog';
import { RiskDialog, RiskLevel } from '@/components/ui-kit/RiskDialog';
import { QuickEditDialog, QuickEditData } from '@/components/ui-kit/QuickEditDialog';
import { AddStoreDialogTabbed, NewStoreData as NewStoreDataTabbed } from '@/components/ui-kit/AddStoreDialogTabbed';
import { AdvancedFilterPopup, AdvancedFilters } from '@/components/ui-kit/AdvancedFilterPopup';
import { adminUnitsService, type ProvinceRecord } from '@/modules/system-admin/sa-master-data/services/adminUnits.service';
import { ApproveDialog, RejectDialog } from '@/components/ui-kit/ApprovalDialogs';
import { Store, addStore } from '@/utils/data/mockStores';
import { LegalDocument } from '@/components/ui-kit/LegalDocumentItem';
import { LegalDocumentDialog } from '@/components/ui-kit/LegalDocumentDialog';
import { BulkActionModal, BulkActionType } from '@/components/ui-kit/BulkActionModal';
import { StoreImportDialog } from '@/components/ui-kit/StoreImportDialog';
import { exportStoresPackage } from '@/utils/exportStoresCSV';
import { downloadExcelTemplate, parseImportFile } from '@/utils/importTemplate';
import { getViolationsByStoreId } from '@/utils/data/mockViolations';
import { getComplaintsByStoreId } from '@/utils/data/mockComplaints';
import { PendingUpdatesDialog } from '@/components/ui-kit/PendingUpdatesDialog';
import { getTotalPendingCount } from '@/utils/data/mockPendingUpdates';
import { fetchStores, fetchStoresStats, createMerchant, updateMerchant, updateMerchantStatus } from '@/utils/api/storesApi';
import styles from './StoresListPage.module.css';

export default function StoresListPage() {
  // Router & Search Params
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Helper to get param with default
  const getParam = (key: string, defaultValue: string) => searchParams.get(key) || defaultValue;

  // State management initialized from URL
  const [searchValue, setSearchValue] = useState(getParam('q', ''));
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<string | null>(getParam('status', 'all') === 'all' ? null : getParam('status', 'all'));

  // Filter states
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>(getParam('province', 'all'));
  const [statusFilter, setStatusFilter] = useState<string>(getParam('status', 'all'));
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(getParam('q', ''));

  // Pagination states
  const [currentPage, setCurrentPage] = useState(parseInt(getParam('page', '1'), 10));
  const [pageSize, setPageSize] = useState(parseInt(getParam('size', '20'), 10));
  const [totalRecords, setTotalRecords] = useState(0);

  // Sync state to URL
  useEffect(() => {
    const params: Record<string, string> = {};
    if (currentPage > 1) params.page = currentPage.toString();
    if (pageSize !== 20) params.size = pageSize.toString();
    if (statusFilter !== 'all') params.status = statusFilter;
    if (jurisdictionFilter !== 'all') params.province = jurisdictionFilter;
    if (debouncedSearchValue) params.q = debouncedSearchValue;

    setSearchParams(params, { replace: true });
  }, [currentPage, pageSize, statusFilter, jurisdictionFilter, debouncedSearchValue, setSearchParams]);

  // Sync state FROM URL when searchParams change (handling back/forward browser buttons)
  useEffect(() => {
    const page = parseInt(getParam('page', '1'), 10);
    const status = getParam('status', 'all');
    const province = getParam('province', 'all');
    const query = getParam('q', '');

    if (page !== currentPage) setCurrentPage(page);
    if (status !== statusFilter) setStatusFilter(status);
    if (province !== jurisdictionFilter) setJurisdictionFilter(province);
    if (query !== searchValue) setSearchValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Debounce search value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue]);

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
    onConfirm: () => { },
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
  
  // State for close (refuse) reason dialog
  const [closeReasonDialog, setCloseReasonDialog] = useState<{
    open: boolean;
    store: Store | null;
    reason: string;
  }>({ open: false, store: null, reason: '' });

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

  // Data state - Fetch from API
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [provinces, setProvinces] = useState<ProvinceRecord[]>([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    refuse: 0,
    rejected: 0,
  });

  // Fetch stats separately or when filters change if needed
  const loadStats = useCallback(async () => {
    try {
      const data = await fetchStoresStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Load stores from API when pagination or filters change
  useEffect(() => {
    const loadStores = async () => {
      try {
        setIsLoadingStores(true);
        setStoreError(null);
        console.log('📥 Fetching stores from API...', { currentPage, pageSize, statusFilter, debouncedSearchValue });

        const offset = (currentPage - 1) * pageSize;
        const filters: any = {};

        if (statusFilter && statusFilter !== 'all') {
          filters.status = statusFilter;
        }
        if (jurisdictionFilter && jurisdictionFilter !== 'all') {
          filters.province_id = jurisdictionFilter;
        }
        if (debouncedSearchValue) {
          filters.search = debouncedSearchValue;
        }

        const { data, total } = await fetchStores(pageSize, offset, filters);
        console.log('Successfully loaded', data.length, '/', total, 'stores from API');

        setStores(data);
        setTotalRecords(total);

        // Save to localStorage for offline backup
        try {
          localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
          console.warn('Could not save to localStorage:', e);
        }
      } catch (error: any) {
        console.error('Error loading stores:', error);
        setStoreError(error.message || 'Failed to load stores');

        // Fallback handling...
        try {
          const savedStores = localStorage.getItem(STORES_STORAGE_KEY);
          if (savedStores) {
            const parsedStores = JSON.parse(savedStores);
            setStores(parsedStores);
            setTotalRecords(parsedStores.length);
          }
        } catch (e) {
          console.error('Fallback error:', e);
        }
      } finally {
        setIsLoadingStores(false);
      }
    };

    loadStores();
  }, [currentPage, pageSize, statusFilter, jurisdictionFilter, debouncedSearchValue]);

  // Load provinces from API on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setIsLoadingProvinces(true);
        console.log('📥 Fetching provinces from API...');

        const data = await adminUnitsService.listProvinces();
        console.log('Successfully loaded', data.length, 'provinces from API');

        setProvinces(data);
      } catch (error: any) {
        console.error('Error loading provinces:', error);
        // Fallback to hardcoded list if API fails
        setProvinces([
          { id: '1', code: 'HCM', name: 'Quận 1' },
          { id: '2', code: 'HCM', name: 'Quận 3' },
          { id: '3', code: 'HCM', name: 'Quận 5' },
          { id: '4', code: 'HCM', name: 'Quận 10' },
        ]);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Save stores to localStorage whenever they change (for local updates)
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

    console.log('📝 Approval Request Created:', approvalRequest);

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
      onConfirm: async () => {
        if (!store.merchantId) {
          toast.error('Không tìm thấy ID cơ sở để cập nhật');
          return;
        }
        try {
          await updateMerchantStatus(store.merchantId, 'suspended');
          setStores((prev) =>
            prev.map(s => (s.id === store.id ? { ...s, status: 'suspended' as FacilityStatus } : s))
          );
          toast.success('Tạm ngừng cơ sở thành công');
          loadStats();
        } catch (error: any) {
          toast.error('Lỗi khi tạm ngưng cơ sở: ' + error.message);
        }
      },
    });
  };

  const handleClose = (store: Store) => {
    // Open reason dialog instead of confirm dialog
    setCloseReasonDialog({
      open: true,
      store: store,
      reason: '',
    });
  };

  const handleCloseConfirm = async (reason: string) => {
    const store = closeReasonDialog.store;
    if (!store || !store.merchantId) {
      toast.error('Không tìm thấy ID cơ sở để cập nhật');
      setCloseReasonDialog({ open: false, store: null, reason: '' });
      return;
    }
    try {
      await updateMerchantStatus(store.merchantId, 'refuse');
      setStores(prev =>
        prev.map(s => (s.id === store.id ? { ...s, status: 'refuse' as FacilityStatus } : s))
      );
      toast.success('Ngừng hoạt động cơ sở thành công');
      loadStats();
    } catch (error: any) {
      toast.error('Lỗi khi ngừng hoạt động cơ sở: ' + error.message);
    } finally {
      setCloseReasonDialog({ open: false, store: null, reason: '' });
    }
  };

  const handleResume = (store: Store) => {
    setConfirmDialog({
      open: true,
      title: 'Khôi phục hoạt động',
      description: `Bạn có chắc chắn muốn khôi phục hoạt động cơ sở "${store.name}"?`,
      variant: 'default',
      onConfirm: async () => {
        if (!store.merchantId) {
          toast.error('Không tìm thấy ID cơ sở để cập nhật');
          return;
        }
        try {
          await updateMerchantStatus(store.merchantId, 'active');
          setStores(prev =>
            prev.map(s => (s.id === store.id ? { ...s, status: 'active' as FacilityStatus } : s))
          );
          toast.success('Khôi phục cơ sở thành công');
          loadStats();
        } catch (error: any) {
          toast.error('Lỗi khi khôi phục cơ sở: ' + error.message);
        }
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

  const handleApproveConfirm = async (reason: string, verifyText: string) => {
    const store = stores.find(s => s.id === approveDialog.storeId);
    if (!store || !store.merchantId) {
      toast.error('Không tìm thấy ID cơ sở để cập nhật');
      return;
    }

    try {
      await updateMerchantStatus(store.merchantId, 'active');

      // Update local state
      setStores(prev =>
        prev.map(s => (s.id === approveDialog.storeId ? { ...s, status: 'active' as FacilityStatus } : s))
      );

      toast.success(`Đã phê duyệt cửa hàng "${approveDialog.storeName}"`, {
        description: 'Cửa hàng đã chuyển sang trạng thái "Đang hoạt động"',
        duration: 5000,
      });

      setApproveDialog({ open: false, storeId: 0, storeName: '' });
      loadStats();
    } catch (error: any) {
      toast.error('Lỗi khi phê duyệt cửa hàng: ' + error.message);
    }
  };

  const handleRejectConfirm = async (reason: string, verifyText: string) => {
    const store = stores.find(s => s.id === rejectDialog.storeId);
    if (!store || !store.merchantId) {
      toast.error('Không tìm thấy ID cơ sở để cập nhật');
      return;
    }

    try {
      await updateMerchantStatus(store.merchantId, 'rejected');

      // Update local state
      setStores(prev =>
        prev.map(s => (s.id === rejectDialog.storeId ? { ...s, status: 'rejected' as FacilityStatus } : s))
      );

      toast.error(`Đã từ chối phê duyệt cửa hàng "${rejectDialog.storeName}"`, {
        description: 'Cửa hàng đã chuyển sang trạng thái "Từ chối phê duyệt"',
        duration: 5000,
      });

      setRejectDialog({ open: false, storeId: 0, storeName: '' });
      loadStats();
    } catch (error: any) {
      toast.error('Lỗi khi từ chối phê duyệt cửa hàng: ' + error.message);
    }
  };

  // No client-side filtering needed for Stores anymore as it's handled by API
  const filteredData = stores;
  const paginatedData = stores;
  const totalPages = Math.ceil(totalRecords / pageSize);

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
      try {
        const updatePromises = validStoreIds.map(async (id) => {
          const store = stores.find(s => s.id === id);
          if (!store?.merchantId) return null;

          let newStatus: FacilityStatus = store.status;
          switch (actionType) {
            case 'approve': newStatus = 'active'; break;
            case 'reject': newStatus = 'rejected'; break;
            case 'suspend': newStatus = 'suspended'; break;
            case 'activate': newStatus = 'active'; break;
            case 'close': newStatus = 'refuse'; break;
          }

          await updateMerchantStatus(store.merchantId, newStatus);
          return { id, newStatus };
        });

        const results = await Promise.all(updatePromises);

        setStores(prev =>
          prev.map(store => {
            const updateResult = results.find(r => r?.id === store.id);
            if (!updateResult) return store;
            return { ...store, status: updateResult.newStatus };
          })
        );
        loadStats();
      } catch (error: any) {
        toast.error('Lỗi khi cập nhật hàng loạt: ' + error.message);
      }
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
      console.log('📥 Exporting stores:', selectedStores);
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

      case 'suspended':
        // Tạm ngưng: Xem chi tiết, Kích hoạt lại, Ngừng hoạt động (3 actions - show all)
        actions.push(
          CommonActions.view(() => navigate(`/registry/stores/${store.id}`)),
          CommonActions.resume(() => handleResume(store)),
          { ...CommonActions.delete(() => handleClose(store)), label: 'Ngừng hoạt động', separator: true }
        );
        break;

      case 'refuse':
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
      render: (store: Store) => {
        // Find index from paginatedData
        const index = paginatedData.findIndex(s => s.id === store.id);
        // Calculate STT based on pagination
        const stt = (currentPage - 1) * pageSize + (index >= 0 ? index : 0) + 1;
        return <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{stt}</div>;
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
          console.log('Store 1 data:', { ownerName: store.ownerName, ownerPhone: store.ownerPhone });
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
  const handleSelectRow = (id: string | number) => {
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(numId)) {
      newSelected.delete(numId);
    } else {
      newSelected.add(numId);
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
    if (advancedFilter.hasViolations && advancedFilter.hasViolations !== 'all') {
      mapFilters.hasViolations = advancedFilter.hasViolations;
    }
    if (advancedFilter.hasComplaints && advancedFilter.hasComplaints !== 'all') {
      mapFilters.hasComplaints = advancedFilter.hasComplaints;
    }
    if (advancedFilter.riskLevel && advancedFilter.riskLevel !== 'all') {
      mapFilters.riskLevel = advancedFilter.riskLevel;
    }
    if (advancedFilter.businessType && advancedFilter.businessType !== 'all') {
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
              setCurrentPage(1);
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
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
          />
          <SummaryCard
            label="Ngừng hoạt động"
            value={stats.refuse}
            icon={CircleX}
            variant="neutral"
            active={activeFilter === 'refuse'}
            onClick={() => {
              setActiveFilter('refuse');
              setStatusFilter('refuse'); // Sync với filter dropdown
              setCurrentPage(1);
            }}
          />
          {stats.rejected > 0 && (
            <SummaryCard
              label="Từ chối"
              value={stats.rejected}
              icon={CircleX}
              variant="danger"
              active={activeFilter === 'rejected'}
              onClick={() => {
                setActiveFilter('rejected');
                setStatusFilter('rejected');
                setCurrentPage(1);
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
              setCurrentPage(1);
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
          <Select
            value={jurisdictionFilter}
            onValueChange={(val) => {
              setJurisdictionFilter(val);
              setCurrentPage(1);
            }}
            disabled={isLoadingProvinces}
          >
            <SelectTrigger style={{ width: '200px', border: '1px solid #e5e7eb' }}>
              <SelectValue placeholder={isLoadingProvinces ? 'Đang tải...' : 'Chọn địa bàn'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả địa bàn</SelectItem>
              {provinces.map((province) => (
                <SelectItem key={province.id} value={province.id}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 3. Trạng thái */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger style={{ width: '200px', border: '1px solid #e5e7eb' }}>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="suspended">Tạm ngưng</SelectItem>
              <SelectItem value="rejected">Từ chối phê duyệt</SelectItem>
              <SelectItem value="refuse">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>

          {/* 4. Tên cơ sở (medium width) */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <SearchInput
              placeholder="Tên cơ sở"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

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
        {isLoadingStores ? (
          <Card>
            <CardContent style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '16px', color: '#666' }}>Đang tải dữ liệu cơ sở...</p>
              </div>
            </CardContent>
          </Card>
        ) : storeError ? (
          <Card>
            <CardContent style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', color: '#d32f2f' }}>
                <AlertTriangle size={32} />
                <p style={{ fontSize: '16px' }}>Lỗi khi tải dữ liệu: {storeError}</p>
                <Button size="sm" onClick={() => window.location.reload()}>
                  Tải lại trang
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                totalRecords={totalRecords}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </CardContent>
          </Card>
        )}
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
          console.log('Export with options:', options);
          toast.success('Xuất dữ liệu thành công');
        }}
      />

      <AddStoreDialogTabbed
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={async (data: NewStoreDataTabbed) => {
          try {
            console.log('📝 AddStoreDialogTabbed submitted data:', data);

            // Validate required fields
            if (!data.business_name) {
              toast.error('Vui lòng nhập tên cơ sở');
              return;
            }
            if (!data.taxCode) {
              toast.error('Vui lòng nhập mã số thuế');
              return;
            }
            if (!data.registeredAddress) {
              toast.error('Vui lòng nhập địa chỉ');
              return;
            }
            if (!data.province) {
              toast.error('Vui lòng chọn tỉnh/thành phố');
              return;
            }
            if (!data.ward) {
              toast.error('Vui lòng chọn phường/xã');
              return;
            }
            if (!data.latitude || !data.longitude) {
              toast.error('Vui lòng chọn vị trí trên bản đồ');
              return;
            }

            // Get district name from code - districtName is already provided in data
            const districtName = data.jurisdiction || 'Quận 1';

            // Prepare API payload matching create_merchant_full RPC parameters
            // IMPORTANT: Send ALL parameters with null for empty optional fields
            const apiPayload = {
              p_business_name: data.business_name,
              p_owner_name: data.ownerName || '',
              p_owner_phone: data.ownerPhone || '',
              p_license_status: 'valid',
              p_tax_code: data.taxCode || '',
              p_business_type: data.industryName || 'retail',
              p_province_id: data.province || null,
              p_ward_id: data.ward || null,
              p_address: data.registeredAddress || '',
              p_latitude: data.latitude || 0,
              p_longitude: data.longitude || 0,
              p_status: data.status || 'pending',
              p_established_date: data.establishedDate || undefined,
              p_fax: data.fax || undefined,
              p_department_id: '0c081448-e64b-4d8e-a332-b79f743823c7',
              p_note: data.notes || undefined,
              p_business_phone: data.businessPhone || undefined,
              p_business_email: data.email || undefined,
              p_website: data.website || undefined,
              p_store_area: data.area_name ? parseFloat(data.area_name) : undefined,
              p_owner_phone_2: data.ownerPhone2 || undefined,
              p_owner_birth_year: data.ownerBirthYear ? parseInt(data.ownerBirthYear) : undefined,
              p_owner_identity_no: data.ownerIdNumber || undefined,
              p_owner_email: null,
            };

            console.log('📤 Sending API payload:', apiPayload);

            // Call API to create merchant
            const result = await createMerchant(apiPayload);

            console.log('✅ Merchant created via API:', result);

            // Create local Store object for display
            const numericId = Math.random() * 1000000 | 0;
            const newStore: Store = {
              id: numericId,
              name: data.business_name,
              type: data.industryName || 'Chưa xác định',
              address: data.registeredAddress || '',
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
              area_name: result?.area_name || '0',
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
              businessArea: result?.area_name || data.businessArea || undefined,  // Use area_name from API response
              businessPhone: data.businessPhone,
              email: data.email,
              website: data.website,
              fax: data.fax,
              notes: data.notes,
              // Tab 2: Thông tin chủ hộ
              ownerName: data.ownerName,
              ownerBirthYear: data.ownerBirthYear ? parseInt(data.ownerBirthYear) : undefined,
              ownerIdNumber: data.ownerIdNumber,
              ownerPhone: data.ownerPhone,
              // Tab 3: Địa chỉ
              registeredAddress: data.registeredAddress || '',
              headquarterAddress: data.headquarterAddress,
              productionAddress: data.productionAddress,
              // Compatibility fields
              phone: data.ownerPhone,
              businessType: data.industryName,
              isVerified: false,
            };

            console.log('✅ New store object:', newStore);

            // Add to global store registry
            addStore(newStore);

            // Thêm vào đầu danh sách (prepend)
            setStores(prev => [newStore, ...prev]);
            // Chuyển về trang 1 để thấy dữ liệu mới
            setCurrentPage(1);

            // Close dialog
            setAddDialogOpen(false);

            toast.success('Thêm cửa hàng thành công', {
              description: 'Cửa hàng mới đã được thêm vào hệ thống',
            });
          } catch (error: any) {
            console.error('❌ Error creating merchant:', error);
            toast.error('Lỗi khi thêm cửa hàng', {
              description: error.message || 'Vui lòng thử lại',
            });
          }
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

      {/* Close Store (Refuse) Reason Dialog */}
      {closeReasonDialog.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Ngừng hoạt động cơ sở</h2>
            <p className="text-sm text-gray-600 mb-4">
              Cơ sở: <strong>{closeReasonDialog.store?.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Lý do ngừng hoạt động</label>
              <textarea
                value={closeReasonDialog.reason}
                onChange={(e) =>
                  setCloseReasonDialog({ ...closeReasonDialog, reason: e.target.value })
                }
                placeholder="Vui lòng nhập lý do..."
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCloseReasonDialog({ open: false, store: null, reason: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={() => handleCloseConfirm(closeReasonDialog.reason)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
