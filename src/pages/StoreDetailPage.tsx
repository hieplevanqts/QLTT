import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
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
  Map,
  ListTodo,
  ExternalLink,
  Shield,
  Target,
  AlertTriangle,
  Eye,
  Camera,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Edit,
  Trash2,
  Activity
} from 'lucide-react';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import FacilityStatusBadge from '../ui-kit/FacilityStatusBadge';
import { mockStores } from '../data/mockStores';
import { getProvinceByCode, getDistrictByName, getWardByCode } from '../data/vietnamLocations';
import { fetchProvinceById, fetchWardById } from '../utils/api/locationsApi';
import { generateLegalDocuments, LegalDocumentData } from '../data/mockLegalDocuments';
import { LegalDocumentItem } from '../ui-kit/LegalDocumentItem';
import { LegalDocumentDialog } from '../ui-kit/LegalDocumentDialog';
import { DocumentUploadDialog } from '../ui-kit/DocumentUploadDialog';
import { IDCardUploadDialog } from '../ui-kit/IDCardUploadDialog';
import { DocumentViewDialog } from '../ui-kit/DocumentViewDialog';
import { getDocumentTypeById } from '../data/documentTypes';
import { MiniMapEmbed } from '../ui-kit/MiniMapEmbed';
import { InspectionTimeline } from '../ui-kit/InspectionTimeline';
import { getInspectionsByStoreId } from '../data/mockInspections';
import { ViolationsTable } from '../ui-kit/ViolationsTable';
import { getViolationsByStoreId } from '../data/mockViolations';
import { ComplaintsTable } from '../ui-kit/ComplaintsTable';
import { getComplaintsByStoreId } from '../data/mockComplaints';
import { RiskAssessment } from '../ui-kit/RiskAssessment';
import { getRiskAssessmentByStoreId } from '../data/mockRiskAssessment';
import { ImageGallery } from '../ui-kit/ImageGallery';
import { ApproveDialog, RejectDialog } from '../ui-kit/ApprovalDialogs';
import { FacilityStatus } from '../ui-kit/FacilityStatusBadge';
import styles from './StoreDetailPage.module.css';

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [idCardDialogOpen, setIdCardDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<LegalDocumentData | null>(null);
  const [currentDocumentType, setCurrentDocumentType] = useState<string | null>(null);
  const [legalDocuments, setLegalDocuments] = useState<LegalDocumentData[]>([]);

  // Approval Dialog states
  const [approveDialog, setApproveDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);

  // Location data from API
  const [provinceName, setProvinceName] = useState<string | null>(null);
  const [wardName, setWardName] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

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

  // Load stores from localStorage
  const stores = (() => {
    try {
      const savedStores = localStorage.getItem('mappa_stores');
      if (savedStores) {
        return JSON.parse(savedStores);
      }
    } catch (error) {
      console.error('Error loading stores from localStorage:', error);
    }
    return mockStores;
  })();

  // Find store by id
  const store = stores.find((s: any) => s.id === Number(id));

  if (!store) {
    return (
      <div className={styles.notFound}>
        <h2>Không tìm thấy cơ sở</h2>
        <Button onClick={() => navigate('/stores')}>Quay lại danh sách</Button>
      </div>
    );
  }

  // Fetch province and ward names from API (by ID)
  useEffect(() => {
    const loadLocationNames = async () => {
      setLoadingLocation(true);
      try {
        // Fetch province by ID if store has province_id or province (UUID)
        if (store.province && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(store.province)) {
          const prov = await fetchProvinceById(store.province);
          if (prov) {
            setProvinceName(prov.name);
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
  }, [store.province, store.ward]);

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

  // Initialize legalDocuments state on mount or when store changes
  useEffect(() => {
    setLegalDocuments(initialLegalDocuments);
  }, [store.id]);

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

  const handleSaveDocument = (data: { file: File | null; fields: Record<string, any> }) => {
    const now = new Date().toLocaleString('vi-VN');
    const docTypeName = getDocumentTypeById(currentDocumentType || '')?.name || 'Hồ sơ';
    
    if (editingDocument) {
      // Update existing document - save old version for comparison
      setLegalDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocument.id
            ? {
                ...doc,
                ...data.fields,
                uploadedData: data.fields,
                uploadDate: now,
                uploadedBy: 'Admin User',
                fileUrl: data.file ? URL.createObjectURL(data.file) : doc.fileUrl,
                fileName: data.file?.name || doc.fileName,
                status: 'valid' as const,
                statusText: 'Còn hiệu lực',
                approvalStatus: 'pending' as const,
                approvalStatusText: 'Chờ duyệt',
                // Save previous version for comparison
                previousVersion: {
                  ...editingDocument.uploadedData,
                  fileUrl: editingDocument.fileUrl,
                  fileName: editingDocument.fileName,
                  uploadDate: editingDocument.uploadDate,
                  uploadedBy: editingDocument.uploadedBy,
                },
              }
            : doc
        )
      );
      
      // Show toast notification for update
      toast.success(`Đã cập nhật ${docTypeName}`, {
        description: 'Hồ sơ đã được chuyển về trạng thái chờ duyệt',
      });
    } else {
      // Add new document (convert missing to uploaded) - set as pending
      setLegalDocuments((prev) =>
        prev.map((doc) =>
          doc.type === currentDocumentType && doc.status === 'missing'
            ? {
                ...doc,
                ...data.fields,
                uploadedData: data.fields,
                uploadDate: now,
                uploadedBy: 'Admin User',
                fileUrl: data.file ? URL.createObjectURL(data.file) : undefined,
                fileName: data.file?.name,
                status: 'valid' as const,
                statusText: 'Còn hiệu lực',
                approvalStatus: 'pending' as const,
                approvalStatusText: 'Chờ duyệt',
              }
            : doc
        )
      );
      
      // Show toast notification for new upload
      toast.success(`Đã tải lên ${docTypeName}`, {
        description: 'Hồ sơ đang chờ phê duyệt',
      });
    }

    setUploadDialogOpen(false);
    setEditingDocument(null);
    setCurrentDocumentType(null);
  };

  // Handler for ID Card (2 files: front + back)
  const handleSaveIDCard = (data: {
    frontFile: File | null;
    backFile: File | null;
    frontFileUrl?: string;
    backFileUrl?: string;
    fields: Record<string, any>;
  }) => {
    const now = new Date().toLocaleString('vi-VN');
    const docTypeName = 'CCCD / CMND chủ hộ';

    // Validate: Must have both front and back
    if (!data.frontFile && !data.frontFileUrl) {
      toast.error('Thiếu mặt trước CCCD/CMND');
      return;
    }
    if (!data.backFile && !data.backFileUrl) {
      toast.error('Thiếu mặt sau CCCD/CMND');
      return;
    }

    if (editingDocument) {
      // Update existing ID Card
      setLegalDocuments((prev) =>
        prev.map((doc) =>
          doc.id === editingDocument.id
            ? {
                ...doc,
                ...data.fields,
                uploadedData: data.fields,
                uploadDate: now,
                uploadedBy: 'Admin User',
                // Front file
                fileUrl: data.frontFile
                  ? URL.createObjectURL(data.frontFile)
                  : data.frontFileUrl || doc.fileUrl,
                fileName: data.frontFile?.name || doc.fileName,
                // Back file
                backFileUrl: data.backFile
                  ? URL.createObjectURL(data.backFile)
                  : data.backFileUrl || doc.backFileUrl,
                backFileName: data.backFile?.name || doc.backFileName,
                status: 'valid' as const,
                statusText: 'Còn hiệu lực',
                approvalStatus: 'pending' as const,
                approvalStatusText: 'Chờ duyệt',
                // Save previous version
                previousVersion: {
                  ...editingDocument.uploadedData,
                  fileUrl: editingDocument.fileUrl,
                  fileName: editingDocument.fileName,
                  backFileUrl: editingDocument.backFileUrl,
                  backFileName: editingDocument.backFileName,
                  uploadDate: editingDocument.uploadDate,
                  uploadedBy: editingDocument.uploadedBy,
                },
              }
            : doc
        )
      );

      toast.success(`Đã cập nhật ${docTypeName}`, {
        description: 'Đã upload đầy đủ 2 mặt - Hồ sơ chờ phê duyệt',
      });
    } else {
      // Add new ID Card
      setLegalDocuments((prev) =>
        prev.map((doc) =>
          doc.type === 'cccd' && doc.status === 'missing'
            ? {
                ...doc,
                ...data.fields,
                uploadedData: data.fields,
                uploadDate: now,
                uploadedBy: 'Admin User',
                // Front file
                fileUrl: data.frontFile
                  ? URL.createObjectURL(data.frontFile)
                  : data.frontFileUrl,
                fileName: data.frontFile?.name || 'cccd-mat-truoc.pdf',
                // Back file
                backFileUrl: data.backFile
                  ? URL.createObjectURL(data.backFile)
                  : data.backFileUrl,
                backFileName: data.backFile?.name || 'cccd-mat-sau.pdf',
                status: 'valid' as const,
                statusText: 'Còn hiệu lực',
                approvalStatus: 'pending' as const,
                approvalStatusText: 'Chờ duyệt',
              }
            : doc
        )
      );

      toast.success(`Đã tải lên ${docTypeName}`, {
        description: 'Đã upload đầy đủ 2 mặt - Hồ sơ chờ phê duyệt',
      });
    }

    setIdCardDialogOpen(false);
    setEditingDocument(null);
    setCurrentDocumentType(null);
  };

  // Handlers for approve/reject
  const handleApproveDocument = (documentId: string) => {
    setLegalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              approvalStatus: 'approved' as const,
              approvalStatusText: 'Đã phê duyệt',
            }
          : doc
      )
    );
    setViewDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleRejectDocument = (documentId: string) => {
    setLegalDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              approvalStatus: 'rejected' as const,
              approvalStatusText: 'Từ chối',
              status: 'missing' as const,
              statusText: undefined,
            }
          : doc
      )
    );
    setViewDialogOpen(false);
    setSelectedDocument(null);
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
    const statusMapping = {
      'active': { class: styles.statusActive, text: 'Đang hoạt động' },
      'processing': { class: styles.statusProcessing, text: 'Đang xử lý' },
      'pending': { class: styles.statusPending, text: 'Chờ duyệt' },
      'suspended': { class: styles.statusSuspended, text: 'Tạm ngừng hoạt động' },
      'inactive': { class: styles.statusInactive, text: 'Ngừng hoạt động' },
    };
    return statusMapping[status] || null;
  };

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

  const handleOpenMap = () => {
    // Deep link to map view
    console.log('Opening store on map:', store.id);
  };

  const handleRelatedTasks = () => {
    // Link to related leads/tasks
    console.log('Opening related tasks for store:', store.id);
    // In production: navigate to tasks/leads view
  };

  // Handle delete store (only available for closed status)
  const handleDeleteStore = () => {
    // Show confirmation dialog
    if (!confirm(`Bạn có chắc chắn muốn xóa cơ sở "${store.name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    try {
      // Load current stores from localStorage
      const savedStores = localStorage.getItem('mappa_stores');
      let currentStores = savedStores ? JSON.parse(savedStores) : mockStores;

      // Remove store from array
      currentStores = currentStores.filter((s: any) => s.id !== store.id);

      // Save back to localStorage
      localStorage.setItem('mappa_stores', JSON.stringify(currentStores));

      // Show success message
      toast.success('Đã xóa cơ sở', {
        description: `Cơ sở "${store.name}" đã được xóa khỏi hệ thống`,
      });

      // Navigate back to stores list
      navigate('/registry/stores');
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Lỗi khi xóa cơ sở', {
        description: 'Vui lòng thử lại sau',
      });
    }
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

          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/registry/full-edit/${store.id}`)}
              className={styles.editButton}
            >
              <Edit size={16} />
              Chỉnh sửa đầy đủ
            </Button>

            {/* Show delete button only for closed stores */}
            {store.status === 'closed' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteStore}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)'
                }}
              >
                <Trash2 size={16} />
                Xóa cơ sở
              </Button>
            )}
          </div>
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
          <div className={`${styles.statMeta} ${styles.statWarning}`}>{complaints.filter(c => !c.resolved).length} chưa xử lý</div>
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
            {store.isVerified ? 'Đã xác minh' : 'Chờ xác minh'}
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

                  <div className={styles.infoRowInline}>
                    <Building2 size={14} />
                    <span className={styles.infoLabel}>Diện tích cửa hàng :</span>
                    <span className={styles.infoValue}>{store.businessArea ? `${store.businessArea} m²` : 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Mail size={14} />
                    <span className={styles.infoLabel}>Email :</span>
                    <span className={styles.infoValue}>{store.email || 'Chưa có thông tin'}</span>
                  </div>

                  {store.website && (
                    <div className={styles.infoRowInline}>
                      <ExternalLink size={14} />
                      <span className={styles.infoLabel}>Website :</span>
                      <span className={styles.infoValue}>{store.website}</span>
                    </div>
                  )}

                  {store.fax && (
                    <div className={styles.infoRowInline}>
                      <Phone size={14} />
                      <span className={styles.infoLabel}>Fax :</span>
                      <span className={styles.infoValue}>{store.fax}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* NHÓM 2 - THÔNG TIN CHỦ HỘ */}
              <div className={styles.twoColumnLayout}>
                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>Thông tin chủ hộ</h3>
                  
                  <div className={styles.infoRowInline}>
                    <User size={14} />
                    <span className={styles.infoLabel}>
                      Tên chủ hộ kinh doanh<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.ownerName || 'Chưa có thông tin'}</span>
                  </div>

                  <div className={styles.infoRowInline}>
                    <Calendar size={14} />
                    <span className={styles.infoLabel}>
                      Năm sinh chủ hộ<span className={styles.required}>*</span> :
                    </span>
                    <span className={styles.infoValue}>{store.ownerBirthYear || 'Chưa có thông tin'}</span>
                  </div>
                </div>

                <div className={styles.columnSection}>
                  <h3 className={styles.sectionTitle}>&nbsp;</h3>
                  
                  <div className={styles.infoRowInline}>
                    <FileText size={14} />
                    <span className={styles.infoLabel}>
                      Số CMTND / CCCD / ĐDCN<span className={styles.required}>*</span> :
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
        onSave={handleSaveDocument}
      />

      {/* ID Card Upload Dialog */}
      <IDCardUploadDialog
        open={idCardDialogOpen}
        onOpenChange={setIdCardDialogOpen}
        editingDocument={editingDocument}
        onSave={handleSaveIDCard}
      />
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