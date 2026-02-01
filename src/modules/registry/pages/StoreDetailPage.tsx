import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import type { RootState } from '@/store/store';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  FileText,
  ExternalLink,
  Target,
  AlertTriangle,
  Eye,
  Camera,
  TrendingUp,
  CheckCircle2,
  Edit,
  Activity,
  Play,
  StopCircle,
  XCircle,
  PauseCircle,
  RotateCcw,
  FileSearch,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockStores, Store } from '@/utils/data/mockStores';
import { getProvinceByCode, getDistrictByName, getWardByCode } from '@/utils/data/vietnamLocations';
import { fetchProvinceById, fetchWardById } from '@/utils/api/locationsApi';
import { fetchStoreById, fetchMerchantLicenses, upsertMerchantLicense, updateMerchantStatus } from '@/utils/api/storesApi';
import { generateLegalDocuments, LegalDocumentData } from '@/utils/data/mockLegalDocuments';
import { LegalDocumentItem, ApprovalStatus } from '@/components/ui-kit/LegalDocumentItem';
import { DocumentUploadDialog } from '@/components/ui-kit/DocumentUploadDialog';
import { IDCardUploadDialog } from '../components/IDCardUploadDialog';
import { DocumentViewDialog } from '@/components/ui-kit/DocumentViewDialog';
import { getDocumentTypeById } from '@/utils/data/documentTypes';
import { MiniMapEmbed } from '@/components/ui-kit/MiniMapEmbed';
import { InspectionTimeline } from '@/components/ui-kit/InspectionTimeline';
import { getInspectionsByStoreId } from '@/utils/data/mockInspections';
import { ViolationsTable } from '@/components/ui-kit/ViolationsTable';
import { getViolationsByStoreId } from '@/utils/data/mockViolations';
import { ComplaintsTable } from '@/components/ui-kit/ComplaintsTable';
import { getComplaintsByStoreId } from '@/utils/data/mockComplaints';
import { RiskAssessment } from '@/components/ui-kit/RiskAssessment';
import { getRiskAssessmentByStoreId } from '@/utils/data/mockRiskAssessment';
import { ImageGallery } from '@/components/ui-kit/ImageGallery';
import { ApproveDialog, RejectDialog } from '@/components/ui-kit/ApprovalDialogs';
import { uploadFile } from '@/utils/api/storageApi';
import { buildLicensePayload, DOCUMENT_TYPE_TO_KEY } from '@/utils/licenseHelper';
import styles from './StoreDetailPage.module.css';


// --- Optimization Config ---
// Constants moved to ../utils/licenseHelper

export default function StoreDetailPage() {
  // Redux State - Get user and department info
  const dispatch = useAppDispatch();
  const { user, department } = useAppSelector((state: RootState) => state.auth);
  const departmentId = department?.id;

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<LegalDocumentData | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocumentData[]>([]);

  // Approval Dialog states
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  // State for close (refuse) reason dialog
  const [closeReasonDialog, setCloseReasonDialog] = useState<{
    open: boolean;
    reason: string;
  }>({ open: false, reason: '' });

  // Store data from API
  const [store, setStore] = useState<Store | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  // Location data from API
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [wardName, setWardName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Read tab from query param on mount and when searchParams change
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      // Map query params to valid tab values
      const validTabs = ['overview', 'legal', 'violations', 'inspections', 'photos', 'risk', 'images', 'history'];
      if (validTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [searchParams]);

  // Auto-scroll to section after tab is active
  useEffect(() => {
    const tabParam = searchParams.get('tab');

    if (tabParam && activeTab === tabParam) {
      // Wait for DOM to render the tab content
      const timeoutId = setTimeout(() => {
        const sectionId = `${tabParam}-section`;
        const section = document.getElementById(sectionId);

        if (section) {
          // Calculate offset for sticky header (if any)
          const headerOffset = 80; // Adjust based on your header height
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure DOM is ready

      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, searchParams]);

  // Fetch store data from API when ID changes
  useEffect(() => {
    const loadStoreData = async () => {
      if (!id) return;

      setIsLoadingStore(true);
      try {
        console.log('📥 [StoreDetailPage] Loading store data for ID:', id);

        // Try to fetch from API first
        const storeFromApi = await fetchStoreById(id);

        if (storeFromApi) {
          console.log('✅ [StoreDetailPage] Loaded store from API:', storeFromApi.name);
          setStore(storeFromApi);
        } else {
          // Fallback to localStorage
          console.log('⚠️ [StoreDetailPage] API returned null, trying localStorage fallback');
          try {
            const savedStores = localStorage.getItem('mappa_stores');
            const stores = savedStores ? JSON.parse(savedStores) : mockStores;
            const storeFromStorage = stores.find((s: any) => s.id === Number(id));

            if (storeFromStorage) {
              console.log('✅ [StoreDetailPage] Loaded store from localStorage:', storeFromStorage.name);
              setStore(storeFromStorage);
            } else {
              console.error('❌ [StoreDetailPage] Store not found in localStorage');
              setStore(null);
            }
          } catch (error) {
            console.error('❌ [StoreDetailPage] Error loading from localStorage:', error);
            setStore(null);
          }
        }
      } catch (error) {
        console.error('❌ [StoreDetailPage] Error loading store:', error);
        toast.error('Không thể tải dữ liệu cơ sở');
        setStore(null);
      } finally {
        setIsLoadingStore(false);
      }
    };

    loadStoreData();
  }, [id]); // Re-fetch when ID changes

  // Fetch province and ward names from API (by ID)
  useEffect(() => {
    if (!store) return;

    const loadLocationNames = async () => {
      setLoadingLocation(true);
      try {
        // Fetch province by ID if store has province_id or province (UUID)
        if (store.province && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(store.province)) {
          const pName = await fetchProvinceById(store.province);
          if (pName) {
            setProvinceName(pName.name);
          }
        }

        // Fetch ward by ID if store has ward_id or ward (UUID)
        if (store.ward && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(store.ward)) {
          const w = await fetchWardById(store.ward);
          if (w) {
            setWardName(w.name);
          }
        }
      } catch (error) {
        console.error('Error loading location names:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    loadLocationNames();
  }, [store?.province, store?.ward]);

  // Fetch merchant licenses function to be reused
  const loadMerchantLicenses = useCallback(async () => {
    if (!store?.merchantId) return;

    try {
      console.log('📄 [StoreDetailPage] Fetching licenses for merchant:', store.merchantId);

      // Required types config
      const requiredTypes = [
        { id: 'cccd', title: 'CCCD / CMND chủ hộ', apiName: 'CCCD / CMND chủ hộ', dbKey: 'CCCD' },
        { id: 'business-license', title: 'Giấy phép kinh doanh', apiName: 'Giấy phép kinh doanh', dbKey: 'BUSINESS_LICENSE' },
        { id: 'food-safety', title: 'Giấy chứng nhận ATTP', apiName: 'Giấy chứng nhận ATTP', dbKey: 'FOOD_SAFETY' },
        { id: 'lease-contract', title: 'Hợp đồng thuê mặt bằng', apiName: 'Hợp đồng thuê mặt bằng', dbKey: 'RENT_CONTRACT' },
        { id: 'specialized-license', title: 'Giấy phép chuyên ngành', apiName: 'Giấy phép chuyên ngành', dbKey: 'PROFESSIONAL_LICENSE' },
        { id: 'fire-safety', title: 'Giấy phép PCCC', apiName: 'Giấy phép PCCC', dbKey: 'FIRE_PREVENTION' },
      ];

      const licensesFromApi = await fetchMerchantLicenses(store.merchantId || '');

      const approvalStatusMap: Record<number, ApprovalStatus> = {
        0: 'pending',
        1: 'approved',
        2: 'rejected',
      };

      const approvalStatusTextMap: Record<number, string> = {
        0: 'Chờ duyệt',
        1: 'Đã phê duyệt',
        2: 'Từ chối',
      };

      // Combine logic: All API licenses + Placeholders for missing required types
      const processedTypeIds = new Set<string>();
      const mappedDocs: LegalDocumentData[] = [];

      // 1. Process API licenses
      if (licensesFromApi && licensesFromApi.length > 0) {
        licensesFromApi.forEach((license: any) => {
          // Find matching type info by technical ID or descriptive name
          const typeInfo = requiredTypes.find(rt => rt.id === license.license_type || rt.apiName === license.license_type || rt.dbKey === license.license_type);

          const docType = typeInfo?.id || 'other';
          const docTitle = typeInfo?.title || license.license_type;

          if (typeInfo) {
            processedTypeIds.add(typeInfo.id);
          }

          // Calculate validity and status text
          const isExpiring = license.expiry_date ?
            (new Date(license.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 45
            : false;

          const status = license.validity_status === 0 ? 'missing' : (isExpiring ? 'expiring' : 'valid');
          const statusText = license.validity_status === 0 ? 'Hết hạn/Không hợp lệ' :
            (isExpiring ? `Sắp hết hạn (${Math.ceil((new Date(license.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} ngày)` : 'Còn hiệu lực');

          mappedDocs.push({
            id: license._id,
            type: docType,
            title: docTitle,
            status: status as any,
            statusText,
            approvalStatus: approvalStatusMap[license.approval_status] || 'pending',
            approvalStatusText: approvalStatusTextMap[license.approval_status] || 'Chờ duyệt',
            documentNumber: license.license_number,
            issueDate: license.issued_date ? new Date(license.issued_date).toLocaleDateString('vi-VN') : '',
            expiryDate: license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : '',
            issuingAuthority: license.issued_by_name || license.issued_by || '',
            notes: license.notes || '',
            fileUrl: license.file_url || undefined,
            fileName: license.file_url ? license.file_url.split('/').pop()?.split('?')[0] || 'file' : undefined,
            backFileUrl: license.file_url_2 || undefined,
            backFileName: license.file_url_2 ? license.file_url_2.split('/').pop()?.split('?')[0] || 'file_back' : undefined,
            uploadDate: license.created_at ? new Date(license.created_at).toLocaleString('vi-VN') : '',
            uploadedBy: license.approved_by || 'Hệ thống',
            uploadedData: license, // Store raw data for approvals/updates
          });
        });
        console.log('✅ [StoreDetailPage] Loaded licenses from API:', licensesFromApi.length);
      }

      // 2. Add placeholders for missing required types
      requiredTypes.forEach(rt => {
        if (!processedTypeIds.has(rt.id)) {
          mappedDocs.push({
            id: `missing-${rt.id}-${store.id || 'unknown'}`,
            type: rt.id,
            title: rt.title,
            status: 'missing',
            statusText: 'Chưa có thông tin',
          });
        }
      });

      // 3. Sort by priority (CCCD first, then Business License, then others)
      const sortOrder = ['cccd', 'business-license', 'food-safety', 'lease-contract', 'specialized-license', 'fire-safety'];
      mappedDocs.sort((a, b) => {
        const indexA = sortOrder.indexOf(a.type);
        const indexB = sortOrder.indexOf(b.type);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.title.localeCompare(b.title);
      });

      setLegalDocuments(mappedDocs);
    } catch (error) {
      console.error('❌ [StoreDetailPage] Error loading licenses:', error);
      setLegalDocuments(generateLegalDocuments(store.id || 0));
    }
  }, [store?.merchantId, store?.id]);

  // Initial load
  useEffect(() => {
    loadMerchantLicenses();
  }, [loadMerchantLicenses]);

  // Loading state
  if (isLoadingStore) {
    return (
      <div className={styles.container}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!store) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy cơ sở</h2>
        <Button onClick={() => navigate('/registry/stores')}>Quay lại danh sách</Button>
      </div>
    );
  }

  // Get location data
  const province = getProvinceByCode(store.province);
  const district = getDistrictByName(province?.name || '', store.district);
  const ward = store.wardCode ? getWardByCode(store.wardCode) : undefined;


  // Build clean address without undefined values
  const addressParts = [
    store.address,
    wardName || ward?.name || store.ward,
    district?.name || store.district,
    provinceName || province?.name || store.province
  ].filter(part => part && part !== 'undefined' && part !== 'none');
  const fullAddress = addressParts.join(', ');

  // Get legal documents
  const initialLegalDocuments = generateLegalDocuments(store.id);

  // Use legalDocuments for dynamic list
  const displayedDocuments = legalDocuments.length > 0 ? legalDocuments : initialLegalDocuments;
  const validDocs = displayedDocuments.filter((doc) => doc.status === 'valid').length;
  const expiringDocs = displayedDocuments.filter((doc) => doc.status === 'expiring').length;
  const missingDocs = displayedDocuments.filter((doc) => doc.status === 'missing').length;

  // Handlers for upload/edit
  const handleUploadClick = (docType: string) => {
    setCurrentDocumentType(docType);
    setEditingDocument(null);

    // Check if this is ID Card (CCCD/CMND) - open special dialog
    if (docType === 'cccd') {
      console.log('Opening ID Card Upload Dialog for CCCD');
      setIdCardDialogOpen(true);
    } else {
      console.log('Opening regular Document Upload Dialog for:', docType);
      setUploadDialogOpen(true);
    }
  };

  const handleEditDocument = (doc: LegalDocumentData) => {
    setCurrentDocumentType(doc.type);
    setEditingDocument(doc);

    // Check if this is ID Card (CCCD/CMND) - open special dialog
    if (doc.type === 'cccd') {
      console.log('Opening ID Card Upload Dialog for editing CCCD', doc);
      setIdCardDialogOpen(true);
    } else {
      console.log('Opening regular Document Upload Dialog for editing:', doc.type);
      setUploadDialogOpen(true);
    }
  };

  const handleSaveDocument = async (data: { file: File | null; fields: Record<string, any> }) => {
    const docTypeName = getDocumentTypeById(currentDocumentType || '')?.name || 'Hồ sơ';

    if (!store?.merchantId) {
      toast.error('Không tìm thấy ID thương nhân');
      return;
    }

    setIsSaving(true);
    try {
      let fileUrl = editingDocument?.fileUrl;

      // 1. Upload file if changed
      if (data.file) {
        const fileExt = data.file.name.split('.').pop();
        const filePath = `licenses/${store.merchantId}/${currentDocumentType}_${Date.now()}.${fileExt}`;
        fileUrl = await uploadFile(data.file, 'licenses', filePath);
      }

      // 2. Call RPC to update database
      // 2. Construct Payload based on Document Type
      const typeKey = DOCUMENT_TYPE_TO_KEY[currentDocumentType || ''] || 'BUSINESS_LICENSE'; // Default fallback? or handle unknown?

      const rpcPayload = buildLicensePayload(
        typeKey,
        data.fields,
        store.merchantId,
        fileUrl,
        '' // fileUrl_2 is empty for single docs
      );

      // Add p_id if editing
      if (editingDocument) {
        rpcPayload.p_id = editingDocument.id;
        rpcPayload.p_approval_status = 0;
      }

      // If we couldn't map the type, maybe fallback or log?
      if (!DOCUMENT_TYPE_TO_KEY[currentDocumentType || '']) {
        console.warn(`[handleSaveDocument] Unknown document type: ${currentDocumentType}, falling back to default handling or empty payload.`);
        // For fallback, maybe just set license type to docTypeName if not in config?
        // But our config covers all known types.
        if (!rpcPayload.p_license_type) rpcPayload.p_license_type = docTypeName;
      }

      console.log('📝 [handleSaveDocument] Prepared rpcPayload:', rpcPayload);
      console.log('📊 [handleSaveDocument] data.fields:', data.fields);

      await upsertMerchantLicense(rpcPayload);

      toast.success(editingDocument ? `Đã cập nhật ${docTypeName}` : `Đã tải lên ${docTypeName}`, {
        description: editingDocument ? 'Hồ sơ đã được lưu và chuyển về trạng thái Chờ duyệt' : 'Hồ sơ đang chờ phê duyệt',
      });

      setUploadDialogOpen(false);
      setEditingDocument(null);
      setCurrentDocumentType(null);

      // Re-fetch licenses to ensure local state matches DB
      await loadMerchantLicenses();
    } catch (error) {
      console.error('❌ Error saving document:', error);
      toast.error(`Không thể lưu ${docTypeName}`, {
        description: 'Vui lòng kiểm tra kết nối và thử lại',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for ID Card (2 files: front + back)
  const handleSaveIDCard = async (data: {
    frontFile: File | null;
    backFile: File | null;
    frontFileUrl?: string;
    backFileUrl?: string;
    fields: Record<string, any>;
  }) => {
    const docTypeName = 'CCCD / CMND chủ hộ';

    if (!store?.merchantId) {
      toast.error('Không tìm thấy ID thương nhân');
      return;
    }

    // Validate: Must have both front and back
    if (!data.frontFile && !data.frontFileUrl) {
      toast.error('Thiếu mặt trước CCCD/CMND');
      return;
    }
    if (!data.backFile && !data.backFileUrl) {
      toast.error('Thiếu mặt sau CCCD/CMND');
      return;
    }

    setIsSaving(true);
    try {
      let frontUrl = data.frontFileUrl || editingDocument?.fileUrl;
      let backUrl = data.backFileUrl || editingDocument?.backFileUrl;

      // 1. Upload front file if changed
      if (data.frontFile) {
        const fileExt = data.frontFile.name.split('.').pop();
        const filePath = `licenses/${store.merchantId}/cccd_front_${Date.now()}.${fileExt}`;
        frontUrl = await uploadFile(data.frontFile, 'licenses', filePath);
      }

      // 2. Upload back file if changed
      if (data.backFile) {
        const fileExt = data.backFile.name.split('.').pop();
        const filePath = `licenses/${store.merchantId}/cccd_back_${Date.now()}.${fileExt}`;
        backUrl = await uploadFile(data.backFile, 'licenses', filePath);
      }

      // 3. Call RPC to update database
      // 3. Call RPC to update database
      const rpcPayload = buildLicensePayload(
        'CCCD', // Always CCCD for this handler
        data.fields,
        store.merchantId,
        frontUrl,
        backUrl
      );

      // Add p_id if editing
      if (editingDocument) {
        rpcPayload.p_id = editingDocument.id;
        rpcPayload.p_approval_status = 0;
      }

      console.log('📝 [handleSaveIDCard] Prepared rpcPayload:', rpcPayload);
      console.log('📊 [handleSaveIDCard] data.fields:', data.fields);

      await upsertMerchantLicense(rpcPayload);

      toast.success(editingDocument ? `Đã cập nhật ${docTypeName}` : `Đã tải lên ${docTypeName}`, {
        description: 'Đã upload đầy đủ 2 mặt - Hồ sơ chờ phê duyệt',
      });

      setIdCardDialogOpen(false);
      setEditingDocument(null);
      setCurrentDocumentType(null);

      // Re-fetch licenses to ensure local state matches DB
      await loadMerchantLicenses();
    } catch (error) {
      console.error('❌ Error saving ID card:', error);
      toast.error('Không thể lưu CCCD/CMND', {
        description: 'Vui lòng kiểm tra kết nối và thử lại',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers for approve/reject
  // Handlers for approve/reject
  const handleApproveDocument = async (documentId: string) => {
    const doc = legalDocuments.find(d => d.id === documentId);
    if (!doc || !store?.merchantId) return;

    try {
      // Use raw data if available, otherwise fallback (which shouldn't happen for existing docs)
      // Note: We need to ensure we send the correct p_approval_status
      const rawLicense = doc.uploadedData || {};

      const payload = {
        p_merchant_id: store.merchantId,
        p_id: documentId,
        p_license_type: doc.type === 'cccd' || doc.type === 'CCCD / CMND chủ hộ' ? 'CCCD / CMND chủ hộ' : (doc.title ?? ''),
        p_license_number: rawLicense.license_number || doc.documentNumber || '',
        p_issued_date: rawLicense.issued_date || '',
        p_expiry_date: rawLicense.expiry_date || '2099-12-31',
        p_status: 'valid', // Ensure status is valid when approving
        p_approval_status: 1, // Approved
        p_issued_by: rawLicense.issued_by || doc.issuingAuthority || '',
        p_issued_by_name: rawLicense.issued_by_name || doc.issuingAuthority || '',
        p_file_url: rawLicense.file_url || doc.fileUrl || '',
        p_file_url_2: rawLicense.file_url_2 || doc.backFileUrl || '',
        p_notes: rawLicense.notes || doc.notes || '',
      };

      console.log('📝 [handleApproveDocument] Approving with payload:', payload);
      await upsertMerchantLicense(payload);

      toast.success('Đã phê duyệt hồ sơ');
      await loadMerchantLicenses(); // Reload to update state
      setSelectedDocument(null);
    } catch (error) {
      console.error('❌ Error approving document:', error);
      toast.error('Lỗi khi phê duyệt hồ sơ');
    }
  };

  const handleRejectDocument = async (documentId: string) => {
    const doc = legalDocuments.find(d => d.id === documentId);
    if (!doc || !store?.merchantId) return;

    try {
      const rawLicense = doc.uploadedData || {};

      const payload = {
        p_merchant_id: store.merchantId,
        p_id: documentId,
        p_license_type: doc.type === 'cccd' || doc.type === 'CCCD / CMND chủ hộ' ? 'CCCD / CMND chủ hộ' : (doc.title || ''),
        p_license_number: rawLicense.license_number || doc.documentNumber || '',
        p_issued_date: rawLicense.issued_date || '',
        p_expiry_date: rawLicense.expiry_date || '2099-12-31',
        p_status: 'valid', // Keep valid? Or missing? Usually rejection implies it needs re-upload but the record itself exists. Let's keep valid but rejected approval.
        p_approval_status: 2, // Rejected
        p_issued_by: rawLicense.issued_by || doc.issuingAuthority || '',
        p_issued_by_name: rawLicense.issued_by_name || doc.issuingAuthority || '',
        p_file_url: rawLicense.file_url || doc.fileUrl || '',
        p_file_url_2: rawLicense.file_url_2 || doc.backFileUrl || '',
        p_notes: rawLicense.notes || doc.notes || '',
      };

      console.log('📝 [handleRejectDocument] Rejecting with payload:', payload);
      await upsertMerchantLicense(payload);

      toast.success('Đã từ chối hồ sơ');
      await loadMerchantLicenses(); // Reload to update state
      setViewDialogOpen(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('❌ Error rejecting document:', error);
      toast.error('Lỗi khi từ chối hồ sơ');
    }
  };

  /**
   * 🏪 Handle Store Status Change
   * Standardizes status transitions using the updateMerchant RPC
   */
  const handleUpdateStatus = async (newStatus: string, successMessage: string) => {
    if (!store?.merchantId) {
      toast.error('Không tìm thấy ID cơ sở');
      return;
    }

    setIsSaving(true);
    try {
      console.log(`📤 Updating store status to: ${newStatus}`);
      await updateMerchantStatus(store.merchantId, newStatus);

      toast.success(successMessage);

      // Re-fetch store data to refresh UI
      const updatedStore = await fetchStoreById(id || '');
      if (updatedStore) setStore(updatedStore);
    } catch (error: any) {
      console.error('❌ Error updating store status:', error);
      toast.error('Lỗi khi cập nhật trạng thái cơ sở', {
        description: error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveStore = async () => {
    await handleUpdateStatus('active', 'Đã phê duyệt cơ sở thành công');
    setApproveDialog(false);
  };

  const handleRejectStore = async () => {
    await handleUpdateStatus('rejected', 'Đã từ chối phê duyệt cơ sở');
    setRejectDialog(false);
  };

  // Calculate data quality
  const confidence = store.isVerified ? 95 : 75;
  const precision = store.gpsCoordinates ? 98 : 60;

  // Helper function to translate risk level
  const getRiskLevelText = (level: string | undefined) => {
    if (!level || level === 'undefined' || level === 'none') return null;
    const riskMap: Record<string, string> = {
      'low': 'Thấp',
      'Low': 'Thấp',
      'medium': 'Trung bình',
      'Medium': 'Trung bình',
      'high': 'Cao',
      'High': 'Cao',
      'Cao': 'Cao',
      'Trung bình': 'Trung bình',
      'Thấp': 'Thấp'
    };
    return riskMap[level] || level;
  };

  // Helper function to get status badge class and text
  const getStatusBadge = (status: string) => {
    const statusMapping: Record<string, { class: string; text: string }> = {
      'active': { class: styles.statusActive, text: 'Đang hoạt động' },
      'processing': { class: styles.statusProcessing, text: 'Đang xử lý' },
      'pending': { class: styles.statusPending, text: 'Chờ duyệt' },
      'suspended': { class: styles.statusSuspended, text: 'Tạm ngừng hoạt động' },
      'rejected': { class: styles.statusSuspended, text: 'Từ chối phê duyệt' },
      'refuse': { class: styles.statusInactive, text: 'Ngừng hoạt động' },
    };
    return statusMapping[status] || null;
  };

  if (isLoadingStore || !store) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  // Get status from store data
  const statusBadge = store.status ? getStatusBadge(store.status) : null;
  const riskLevel = getRiskLevelText(store.riskLevel);

  // Get data for stats cards
  const inspections = getInspectionsByStoreId(store.id);
  const violations = getViolationsByStoreId(store.id);
  const complaints = getComplaintsByStoreId(store.id);
  const riskAssessment = getRiskAssessmentByStoreId(store.id);

  // Helper function to handle stat card click
  const handleStatCardClick = (targetTab: string) => {
    // First, switch the tab
    setActiveTab(targetTab);

    // Use requestAnimationFrame to ensure React has finished rendering
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const sectionId = `${targetTab}-section`;
        const section = document.getElementById(sectionId);

        if (section) {
          // Get the element's position
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100; // 100px offset for header

          // Use custom smooth scroll with easing
          smoothScrollTo(offsetPosition, 800);
        }
      });
    });
  };



  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTopRow}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Quay lại
          </Button>



          {/* Only show edit button for active and pending statuses */}
          {(store.status === 'active' || store.status === 'pending') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/registry/full-edit/${store.id}`)}
              className={styles.editButton}
            >
              <Edit size={16} />
              Chỉnh sửa
            </Button>
          )}
        </div>

        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            {/* Icon */}
            <div className={styles.headerIcon}>
              <Building2 size={24} />
            </div>

            {/* Left Content */}
            <div className={styles.headerLeft}>
              <div className={styles.headerTop}>
                <h1 className={styles.storeName}>{store.name}</h1>

                {/* Status Badges - only show if data exists */}
                <div className={styles.headerActions}>
                  {statusBadge && (
                    <span className={`${styles.statusBadge} ${statusBadge.class}`}>
                      {statusBadge.text}
                    </span>
                  )}
                  {riskLevel && (
                    <span className={styles.riskBadge}>
                      {riskLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className={styles.addressRow}>
                <MapPin size={14} />
                <span>{fullAddress}</span>
              </div>

              {/* Meta Info */}
              <div className={styles.metaRow}>
                {district?.name && (
                  <div className={styles.metaItem}>
                    <span>Địa bàn: {province?.name?.includes('Hồ Chí Minh') ? 'HCM' : province?.name || ''}-Q{district.name.match(/\d+/)?.[0] || district.name}</span>
                  </div>
                )}
                {store.businessType && store.businessType !== 'undefined' && store.businessType !== 'none' && (
                  <div className={styles.metaItem}>
                    <Building2 size={14} />
                    <span>{store.businessType}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Info Cards - MOVED TO OVERVIEW TAB */}
      {/* 
      <div className={styles.coreInfo}>
        <Card>
          <CardHeader>
            <CardTitle>Địa chỉ chuẩn hóa</CardTitle>
          </CardHeader>
          <CardContent className={styles.coreInfoContent}>
            <div className={styles.infoItem}>
              <MapPin size={16} className={styles.infoIcon} />
              <span>{fullAddress}</span>
            </div>
            {store.gpsCoordinates && (
              <div className={styles.infoItem}>
                <Target size={16} className={styles.infoIcon} />
                <span className={styles.coordinates}>{store.gpsCoordinates}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liên hệ</CardTitle>
          </CardHeader>
          <CardContent className={styles.coreInfoContent}>
            <div className={styles.infoItem}>
              <User size={16} className={styles.infoIcon} />
              <span>{store.ownerName}</span>
            </div>
            <div className={styles.infoItem}>
              <Phone size={16} className={styles.infoIcon} />
              <span>{store.phone}</span>
            </div>
            {store.email && (
              <div className={styles.infoItem}>
                <Mail size={16} className={styles.infoIcon} />
                <span>{store.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nhãn & Phân loại</CardTitle>
          </CardHeader>
          <CardContent className={styles.coreInfoContent}>
            <div className={styles.tagList}>
              {riskLevel && (
                <Badge variant={riskLevel === 'Cao' ? 'destructive' : 'secondary'}>
                  {riskLevel}
                </Badge>
              )}
              {store.businessType && store.businessType !== 'undefined' && store.businessType !== 'none' && (
                <Badge variant="outline">{store.businessType}</Badge>
              )}
              {store.isVerified && <Badge variant="secondary">Đã xác minh</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>
      */}

      {/* Stats Cards Row - 6 columns */}
      <div className={styles.statsCards}>
        {/* Giấy phép */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('legal')}>
          <div className={styles.statIcon}>
            <FileText size={16} />
          </div>
          <div className={styles.statLabel}>Giấy phép</div>
          <div className={styles.statValue}>{validDocs + expiringDocs}</div>
          {expiringDocs > 0 && (
            <div className={`${styles.statMeta} ${styles.statWarning}`}>
              {expiringDocs} sắp hết hạn
            </div>
          )}
        </div>

        {/* Kiểm tra */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('inspections')}>
          <div className={styles.statIcon}>
            <Eye size={16} />
          </div>
          <div className={styles.statLabel}>Kiểm tra</div>
          <div className={styles.statValue}>{inspections.length}</div>
          <div className={styles.statMeta}>Lần gần nhất: {inspections.length > 0 ? inspections[0].date : 'Chưa có'}</div>
        </div>

        {/* Vi phạm */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('violations')}>
          <div className={styles.statIcon}>
            <AlertTriangle size={16} />
          </div>
          <div className={styles.statLabel}>Vi phạm</div>
          <div className={styles.statValue}>{violations.length}</div>
          {missingDocs > 0 && (
            <div className={`${styles.statMeta} ${styles.statWarning}`}>
              {missingDocs} đang xử lý
            </div>
          )}
        </div>

        {/* Phản ánh */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('photos')}>
          <div className={styles.statIcon}>
            <Camera size={16} />
          </div>
          <div className={styles.statLabel}>Phản ánh</div>
          <div className={styles.statValue}>{complaints.length}</div>
          <div className={`${styles.statMeta} ${styles.statWarning}`}>{complaints.filter(c => c.status !== 'resolved').length} chưa xử lý</div>
        </div>

        {/* Rủi ro */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('risk')}>
          <div className={styles.statIcon}>
            <TrendingUp size={16} />
          </div>
          <div className={styles.statLabel}>Rủi ro</div>
          <div className={styles.statValue} style={{ fontSize: 'var(--text-base)' }}>
            {riskLevel || 'Trung bình'}
          </div>
          <div className={styles.statScore}>
            <span className={styles.statMeta}>Điểm:</span>
            <span className={styles.statScoreLabel}>{riskAssessment?.riskScore ?? 50}/100</span>
          </div>
        </div>

        {/* Theo dõi */}
        <div className={styles.statCard} onClick={() => handleStatCardClick('risk')}>
          <div className={styles.statIcon}>
            <CheckCircle2 size={16} />
          </div>
          <div className={styles.statLabel}>Theo dõi</div>
          <div className={styles.statValue} style={{ fontSize: 'var(--text-base)' }}>
            {store.isVerified ? 'Đã xác minh' : 'Chờ duyệt'}
          </div>
          <div className={styles.statMeta}>20/11/2024</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className={styles.tabs}>
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="legal">Hồ sơ pháp lý</TabsTrigger>
          <TabsTrigger value="violations">Vi phạm & xử lý</TabsTrigger>
          <TabsTrigger value="inspections">Lịch sử kiểm tra</TabsTrigger>
          <TabsTrigger value="photos">Phản ánh</TabsTrigger>
          <TabsTrigger value="risk">Rủi ro & theo dõi</TabsTrigger>
          <TabsTrigger value="images">Ảnh</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className={styles.tabContent}>
          <Card>
            <div className={styles.detailGrid}>
              {/* NHÓM 1 - THÔNG TIN HỘ KINH DOANH */}
              <div className={styles.twoColumnLayout}>
                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Thông tin hộ kinh doanh</h3>

                  <div className={styles.infoRowInline}>
                    <Building2 size={14} />
                    <span className={styles.infoLabel}>
                      Tên hộ kinh doanh<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.name}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <FileText size={14} />
                    <span className={styles.infoLabel}>
                      Mã số thuế<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.taxCode || 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Building2 size={14} />
                    <span className={styles.infoLabel}>
                      Tên ngành kinh doanh<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.industryName || 'Chưa phân loại'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Calendar size={14} />
                    <span className={styles.infoLabel}>
                      Ngày thành lập<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.establishedDate || 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Activity size={14} />
                    <span className={styles.infoLabel}>
                      Tình trạng hoạt động<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.operationStatus || 'Đang hoạt động'}</span>
                  </div>
                </div>

                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>&nbsp;</h3>

                  <div className={styles.infoRowInline}>
                    <Phone size={14} />
                    <span className={styles.infoLabel}>
                      SĐT hộ kinh doanh<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.businessPhone || store.phone || 'Chưa có thông tin'}</span>
                  </div>
                </div>
              </div>

              {/* NHÓM 2 - THÔNG TIN CHỦ HỘ */}
              <div className={styles.twoColumnLayout}>
                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Thông tin chủ hộ</h3>

                  <div className={styles.infoRowInline}>
                    <User size={14} />
                    <span className={styles.infoLabel}>
                      Tên Chủ cơ sở :
                    </span>
                    <span className={styles.infoValue}>{store.ownerName || 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Calendar size={14} />
                    <span className={styles.infoLabel}>
                      Năm sinh chủ hộ :
                    </span>
                    <span className={styles.infoValue}>{store.ownerBirthYear || 'Chưa có thông tin'}</span>
                  </div>
                </div>

                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>&nbsp;</h3>

                  <div className={styles.infoRowInline}>
                    <FileText size={14} />
                    <span className={styles.infoLabel}>
                      Số CMTND / CCCD / ĐDCN :
                    </span>
                    <span className={styles.infoValue}>{store.ownerIdNumber || 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Phone size={14} />
                    <span className={styles.infoLabel}>
                      SĐT chủ hộ<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.ownerPhone || store.phone || 'Chưa có thông tin'}</span>
                  </div>
                </div>
              </div>

              {/* NHÓM 3 - ĐỊA CHỈ HOẠT ĐỘNG */}
              <div className={styles.twoColumnLayout}>
                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Địa chỉ hoạt động</h3>

                  <div className={styles.infoRowInline}>
                    <MapPin size={14} />
                    <span className={styles.infoLabel}>
                      Địa chỉ đăng ký kinh doanh<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.registeredAddress || fullAddress}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <MapPin size={14} />
                    <span className={styles.infoLabel}>Tỉnh / Thành phố :</span>
                    <span className={styles.infoValue}>
                      {provinceName || store.province || province?.name || 'TP. Hồ Chí Minh'}
                      {loadingLocation && provinceName === null && ' (đang tải...)'}
                    </span>
                  </div>

                  {store.gpsCoordinates && (
                    <div className={styles.infoRowInline}>
                      <Target size={14} />
                      <span className={styles.infoLabel}>Tọa độ GPS :</span>
                      <span className={styles.infoValue}>{store.gpsCoordinates}</span>
                    </div>
                  )}

                  {store.headquarterAddress && (
                    <div className={styles.infoRowInline}>
                      <Building2 size={14} />
                      <span className={styles.infoLabel}>Địa chỉ trụ sở chính :</span>
                      <span className={styles.infoValue}>{store.headquarterAddress}</span>
                    </div>
                  )}
                </div>

                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>&nbsp;</h3>

                  {store.productionAddress && (
                    <div className={styles.infoRowInline}>
                      <Building2 size={14} />
                      <span className={styles.infoLabel}>Địa chỉ cơ sở sản xuất :</span>
                      <span className={styles.infoValue}>{store.productionAddress}</span>
                    </div>
                  )}

                  {store.branchAddresses && store.branchAddresses.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      <div className={styles.infoLabel} style={{ padding: 'var(--spacing-2) 0' }}>Địa chỉ chi nhánh KD:</div>
                      {store.branchAddresses.map((branch, index) => (
                        <div key={index} className={styles.infoRowInline}>
                          <Building2 size={14} />
                          <span className={styles.infoLabel}>Chi nhánh {index + 1} :</span>
                          <span className={styles.infoValue}>{branch}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {store.branchPhone && (
                    <div className={styles.infoRowInline}>
                      <Phone size={14} />
                      <span className={styles.infoLabel}>Điện thoại cơ sở :</span>
                      <span className={styles.infoValue}>{store.branchPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* THÔNG TIN BỔ SUNG - Nhãn & Ghi chú */}
              <div className={styles.twoColumnLayout}>
                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Nhãn & Phân loại</h3>

                  <div className={styles.infoRow}>
                    <div className={styles.infoRowLabel}>Nhãn hệ thống</div>
                    <div className={styles.infoRowValue} style={{ flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                      {riskLevel && (
                        <Badge variant={riskLevel === 'Cao' ? 'destructive' : riskLevel === 'Trung bình' ? 'default' : 'secondary'}>
                          Rủi ro: {riskLevel}
                        </Badge>
                      )}
                      {store.businessType && store.businessType !== 'undefined' && store.businessType !== 'none' && (
                        <Badge variant="outline">{store.businessType}</Badge>
                      )}
                      {store.isVerified && <Badge variant="secondary">✓ Đã xác minh</Badge>}
                      {statusBadge && (
                        <Badge variant="outline">{statusBadge.text}</Badge>
                      )}
                    </div>
                  </div>

                  {store.tags && store.tags.length > 0 && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoRowLabel}>Tags tùy chỉnh</div>
                      <div className={styles.infoRowValue} style={{ flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                        {store.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Ghi chú</h3>

                  {store.notes ? (
                    <div className={styles.infoRow}>
                      <div className={styles.infoRowValue} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {store.notes}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.infoRow}>
                      <div className={styles.infoRowValue} style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                        Chưa có ghi chú
                      </div>
                    </div>
                  )}

                  {store.sourceNotes && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoRowLabel}>Nguồn ghi chú</div>
                      <div className={styles.infoRowValue} style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {store.sourceNotes}
                      </div>
                    </div>
                  )}

                  {store.attachmentLinks && (
                    <div className={styles.infoRow}>
                      <div className={styles.infoRowLabel}>Tệp đính kèm</div>
                      <div className={styles.infoRowValue}>
                        <ExternalLink size={14} />
                        <a href={store.attachmentLinks} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                          Xem tệp đính kèm
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className={styles.tabContent}>
          <div id="legal-section" className={styles.legalSummary}>
            <Card>
              <CardContent className={styles.summaryCard}>
                <div className={styles.summaryValue}>{validDocs}</div>
                <div className={styles.summaryLabel}>Còn hiệu lực</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={styles.summaryCard}>
                <div className={styles.summaryValue}>{expiringDocs}</div>
                <div className={styles.summaryLabel}>Sắp hết hạn</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className={styles.summaryCard}>
                <div className={styles.summaryValue}>{missingDocs}</div>
                <div className={styles.summaryLabel}>Thiếu hồ sơ</div>
              </CardContent>
            </Card>
          </div>

          <div className={styles.legalDocuments}>
            {displayedDocuments.map((doc) => (
              <LegalDocumentItem
                key={doc.id}
                document={doc}
                onClick={() => setSelectedDocument(doc)}
                onUploadClick={handleUploadClick}
                onEditClick={handleEditDocument}
                onApprove={handleApproveDocument}
                onReject={handleRejectDocument}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="violations" className={styles.tabContent}>
          <Card id="violations-section">
            <CardHeader>
              <CardTitle>Vi phạm & xử lý</CardTitle>
            </CardHeader>
            <CardContent>
              <ViolationsTable violations={getViolationsByStoreId(store.id)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspections" className={styles.tabContent}>
          <Card id="inspections-section">
            <CardHeader>
              <CardTitle>Lịch sử kiểm tra</CardTitle>
            </CardHeader>
            <CardContent>
              <InspectionTimeline inspections={getInspectionsByStoreId(store.id)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className={styles.tabContent}>
          <Card id="photos-section">
            <CardHeader>
              <CardTitle>Phản ánh</CardTitle>
            </CardHeader>
            <CardContent>
              <ComplaintsTable complaints={getComplaintsByStoreId(store.id)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className={styles.tabContent}>
          <Card id="risk-section">
            <CardHeader>
              <CardTitle>Rủi ro & theo dõi</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskAssessment assessment={getRiskAssessmentByStoreId(store.id)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className={styles.tabContent}>
          <Card id="images-section">
            <CardHeader>
              <CardTitle>Ảnh</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageGallery storeId={store.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className={styles.tabContent}>
          <Card id="history-section">
            <CardHeader>
              <CardTitle>Lịch sử thay đổi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.historyEmpty}>
                <Calendar size={48} className={styles.emptyIcon} />
                <p>Cha có lịch sử thay đổi</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Map & Data Quality Section */}
      <div className={styles.mapSection}>
        <h3 className={styles.mapTitle}>Vị trí trên bản đồ</h3>
        <div className={styles.mapContainer}>
          <MiniMapEmbed
            storeName={store.name}
            address={fullAddress}
            latitude={store.latitude || 10.8231}
            longitude={store.longitude || 106.6296}
            height="280px"
          />
        </div>

        <div className={styles.qualityIndicators}>
          <div className={styles.compactIndicator}>
            <div className={styles.indicatorValue}>{confidence}%</div>
            <div className={styles.indicatorLabel}>Độ tin cậy</div>
          </div>
          <div className={styles.compactIndicator}>
            <div className={styles.indicatorValue}>{precision}%</div>
            <div className={styles.indicatorLabel}>Độ chính xác vị trí</div>
          </div>
        </div>
      </div>

      {/* Document View Dialog (for approval) */}
      <DocumentViewDialog
        open={!!selectedDocument}
        onOpenChange={(open) => !open && setSelectedDocument(null)}
        document={selectedDocument}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
      />

      {/* Document Upload Dialog */}
      <DocumentUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        documentType={currentDocumentType}
        editingDocument={editingDocument}
        isSaving={isSaving}
        onSave={handleSaveDocument}
      />

      {/* ID Card Upload Dialog */}
      <IDCardUploadDialog
        open={idCardDialogOpen}
        onOpenChange={setIdCardDialogOpen}
        editingDocument={editingDocument}
        isSaving={isSaving}
        onSave={handleSaveIDCard}
      />

      {/* Approval Dialogs */}
      <ApproveDialog
        open={approveDialog}
        onOpenChange={setApproveDialog}
        storeName={store.name}
        onConfirm={handleApproveStore}
      />

      <RejectDialog
        open={rejectDialog}
        onOpenChange={setRejectDialog}
        storeName={store.name}
        onConfirm={handleRejectStore}
      />

      {/* Close Store (Refuse) Reason Dialog */}
      {closeReasonDialog.open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Ngừng hoạt động cơ sở</h2>
            <p className="text-sm text-gray-600 mb-4">
              Cơ sở: <strong>{store?.name}</strong>
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
                onClick={() => setCloseReasonDialog({ open: false, reason: '' })}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleUpdateStatus('refuse', 'Đã xác nhận cơ sở Ngừng hoạt động');
                  setCloseReasonDialog({ open: false, reason: '' });
                }}
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

// Custom smooth scroll function with easing (easeInOutCubic for professional feel)
const smoothScrollTo = (targetPosition: number, duration: number = 800) => {
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Easing function - easeInOutCubic for smooth acceleration and deceleration
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);

    // Apply easing
    const ease = easeInOutCubic(progress);

    // Calculate new position
    window.scrollTo(0, startPosition + distance * ease);

    // Continue animation if not complete
    if (progress < 1) {
      requestAnimationFrame(animation);
    }
  };

  requestAnimationFrame(animation);
};
