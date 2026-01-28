import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, MapPin, Building2, Calendar, Shield, Clock, Users, Phone, Mail, User, ChevronRight, Info, FileText, CheckCircle2, AlertCircle, Star, Utensils, Hash, FileCheck, BookOpen, Scale, Award, ChevronDown, MessageSquare, Image as ImageIcon } from 'lucide-react';
import styles from './PointDetailModal.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { ImageLightbox } from './ImageLightbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { fetchMerchantInspectionResults, updateInspectionChecklistResultStatus } from '../../../utils/api/merchantsApi';
import { SUPABASE_REST_URL } from '../../../utils/api/config';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../../ui-kit/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { RootState } from '../../../store/rootReducer';
import { fetchMerchantDetailRequest, clearCurrentMerchant, fetchInspectionHistoryRequest, fetchMerchantLicensesRequest } from '../../../store/slices/merchantSlice';

interface PointDetailModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

// 🔥 Tối ưu: Định nghĩa types và config cho các loại giấy tờ
type DocumentStatus = 'passed' | 'failed' | 'pending';

type DocumentTypeId = 've-sinh' | 'giay-phep-kd' | 'an-toan-thuc-pham' | 'dao-tao-nv';

interface DocumentType {
  id: DocumentTypeId;
  label: string;
  defaultStatus: DocumentStatus;
  options: {
    value: DocumentStatus;
    label: string;
  }[];
}

// 🔥 Tối ưu: Config các loại giấy tờ (dễ mở rộng)
const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 've-sinh',
    label: 'Vệ sinh cơ sở',
    defaultStatus: 'pending',
    options: [
      { value: 'passed', label: 'Đạt' },
      { value: 'failed', label: 'Chưa đạt' },
      { value: 'pending', label: 'Chưa kiểm tra' },
    ],
  },
  {
    id: 'giay-phep-kd',
    label: 'Giấy phép KD',
    defaultStatus: 'passed',
    options: [
      { value: 'passed', label: 'Hợp lệ' },
      { value: 'failed', label: 'Không hợp lệ' },
      { value: 'pending', label: 'Chưa kiểm tra' },
    ],
  },
  {
    id: 'an-toan-thuc-pham',
    label: 'An toàn thực phẩm',
    defaultStatus: 'passed',
    options: [
      { value: 'passed', label: 'Tốt' },
      { value: 'failed', label: 'Cảnh báo' },
      { value: 'pending', label: 'Chưa kiểm tra' },
    ],
  },
  {
    id: 'dao-tao-nv',
    label: 'Đào tạo NV',
    defaultStatus: 'passed',
    options: [
      { value: 'passed', label: 'Đầy đủ' },
      { value: 'failed', label: 'Thiếu' },
      { value: 'pending', label: 'Chưa kiểm tra' },
    ],
  },
];

// Get color by category
function getCategoryColor(category: Restaurant['category']): string {
  switch (category) {
    case 'certified': return '#22c55e';
    case 'hotspot': return '#ef4444';
    case 'scheduled': return '#eab308';
    case 'inspected': return '#005cb6';
    default: return '#005cb6';
  }
}

function getCategoryLabel(category: Restaurant['category']): string {
  switch (category) {
    case 'certified': return 'Chứng nhận ATTP';
    case 'hotspot': return 'Điểm nóng';
    case 'scheduled': return 'Kế hoạch kiểm tra';
    case 'inspected': return 'Đã kiểm tra';
    default: return category;
  }
}

function getStatusBadge(category: Restaurant['category']) {
  switch (category) {
    case 'certified':
      return { text: 'Đạt chuẩn ATTP', bg: '#dcfce7', color: '#166534', icon: <CheckCircle2 size={14} /> };
    case 'hotspot':
      return { text: 'Cảnh báo điểm nóng', bg: '#fee2e2', color: '#991b1b', icon: <AlertCircle size={14} /> };
    case 'scheduled':
      return { text: 'Theo dõi định kỳ', bg: '#fef3c7', color: '#92400e', icon: <Clock size={14} /> };
    case 'inspected':
      return { text: 'Đã kiểm tra gần đây', bg: '#dbeafe', color: '#1e40af', icon: <Shield size={14} /> };
    default:
      return { text: 'Đang hoạt động', bg: '#f3f4f6', color: '#374151', icon: <Info size={14} /> };
  }
}

export function PointDetailModal({ point, isOpen, onClose }: PointDetailModalProps) {
  const dispatch = useAppDispatch();
  const { currentMerchant, inspectionHistory, licenses, isLoading: isMerchantLoading, isHistoryLoading, isLicensesLoading } = useAppSelector((state: RootState) => state.merchant);

  // 🔥 Fetch merchant detail when modal opens
  useEffect(() => {
    if (isOpen && point?.id) {
      dispatch(fetchMerchantDetailRequest({ merchantId: point.id }));
      dispatch(fetchInspectionHistoryRequest(point.id));
      dispatch(fetchMerchantLicensesRequest(point.id));
    }
    return () => {
      if (!isOpen) {
        dispatch(clearCurrentMerchant());
      }
    };
  }, [isOpen, point?.id, dispatch]);

  // 🔥 FIX: Prevent immediate close after opening (click event from popup button may bubble up)
  const justOpenedRef = useRef(false);
  const openTimeRef = useRef(0);

  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true;
      openTimeRef.current = Date.now();
      // Reset after a delay to allow click event to complete and prevent bubble-up click
      const timer = setTimeout(() => {
        justOpenedRef.current = false;
      }, 500); // 🔥 FIX: Increased delay to 500ms to prevent immediate close
      return () => clearTimeout(timer);
    } else {
      justOpenedRef.current = false;
      openTimeRef.current = 0;
    }
  }, [isOpen]);

  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    business: false,
    address: false,
    contact: false,
    results: false,
    timeline: false,
    certificates: false,
    legal: false,
    citizenReports: false,
  });

  // Lightbox state for citizen report images
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Staff list modal state
  const [showStaffModal, setShowStaffModal] = useState(false);

  // Close staff modal when parent modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowStaffModal(false);
    }
  }, [isOpen]);

  // 🔥 Lưu data từ API - key là document_type_id từ Backend (không map)
  interface DocumentResult {
    _id: string; // ID của record để update
    document_type_id: string; // ID từ Backend (giữ nguyên)
    document_type_name: string; // Tên để hiển thị
    status: DocumentStatus; // Status hiện tại
  }

  const [documentResults, setDocumentResults] = useState<Record<string, DocumentResult>>({});
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  
  // 🔥 State cho confirm dialog - dùng document_type_id từ Backend
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    documentTypeId: string | null; // document_type_id từ Backend
    newStatus: DocumentStatus | null;
    docTypeLabel: string;
  }>({
    open: false,
    documentTypeId: null,
    newStatus: null,
    docTypeLabel: '',
  });

  // 🔥 Mapping giữa document_type_id từ API và id trong DOCUMENT_TYPES
  // Có thể cần điều chỉnh mapping này dựa trên response thực tế từ API
  const mapDocumentTypeId = (apiDocumentTypeId: string, apiDocumentTypeName: string): DocumentTypeId | null => {
    console.log('🔍 mapDocumentTypeId called', { apiDocumentTypeId, apiDocumentTypeName });
    
    // Map bằng tên (case-insensitive) - ưu tiên cao nhất
    if (apiDocumentTypeName) {
      const nameLower = apiDocumentTypeName.toLowerCase().trim();
      if (nameLower.includes('vệ sinh') || nameLower.includes('ve sinh') || nameLower.includes('vesinh')) {
        console.log('✅ Mapped by name: ve-sinh');
        return 've-sinh';
      }
      if (nameLower.includes('giấy phép') || nameLower.includes('kinh doanh') || nameLower.includes('giayphep')) {
        console.log('✅ Mapped by name: giay-phep-kd');
        return 'giay-phep-kd';
      }
      if (nameLower.includes('an toàn thực phẩm') || nameLower.includes('atp') || nameLower.includes('antoan')) {
        console.log('✅ Mapped by name: an-toan-thuc-pham');
        return 'an-toan-thuc-pham';
      }
      if (nameLower.includes('đào tạo') || nameLower.includes('nhân viên') || nameLower.includes('daotao')) {
        console.log('✅ Mapped by name: dao-tao-nv');
        return 'dao-tao-nv';
      }
    }
    
    // Map bằng ID nếu có pattern
    if (apiDocumentTypeId) {
      const idLower = apiDocumentTypeId.toLowerCase().trim();
      if (idLower.includes('ve-sinh') || idLower.includes('vesinh') || idLower === 've-sinh') {
        console.log('✅ Mapped by ID: ve-sinh');
        return 've-sinh';
      }
      if (idLower.includes('giay-phep') || idLower.includes('giayphep') || idLower === 'giay-phep-kd') {
        console.log('✅ Mapped by ID: giay-phep-kd');
        return 'giay-phep-kd';
      }
      if (idLower.includes('an-toan') || idLower.includes('antoan') || idLower === 'an-toan-thuc-pham') {
        console.log('✅ Mapped by ID: an-toan-thuc-pham');
        return 'an-toan-thuc-pham';
      }
      if (idLower.includes('dao-tao') || idLower.includes('daotao') || idLower === 'dao-tao-nv') {
        console.log('✅ Mapped by ID: dao-tao-nv');
        return 'dao-tao-nv';
      }
    }
    
    console.warn('⚠️ Could not map document type', { apiDocumentTypeId, apiDocumentTypeName });
    return null;
  };

  // 🔥 Load inspection results từ API khi modal mở - giữ nguyên document_type_id từ Backend
  useEffect(() => {
    if (!isOpen || !point?.id) {
      // Reset về empty khi đóng modal
      setDocumentResults({});
      return;
    }

    const loadInspectionResults = async () => {
      setIsLoadingDocuments(true);
      console.log('🔄 Loading inspection results for merchant:', point.id);
      
      try {
        const results = await fetchMerchantInspectionResults(point.id);
        console.log('📥 Received results from API:', { count: results.length, results });
        
        if (results && results.length > 0) {
          console.log('📥 PointDetailModal: Received results from API', { 
            count: results.length, 
            results 
          });
          
          const newResults: Record<string, DocumentResult> = {};
          
          results.forEach((result, index) => {
            console.log(`🔍 Processing result ${index + 1}/${results.length}:`, { 
              result, 
              document_type_id: result.document_type_id,
              document_type_name: result.document_type_name,
              _id: result._id,
              status: result.status,
              hasDocumentTypeId: !!result.document_type_id,
              hasId: !!result._id,
              hasStatus: !!result.status
            });
            
            // 🔥 Kiểm tra và lưu result - document_type_id là inspection_item từ API
            if (result.document_type_id && result._id && result.status) {
              newResults[result.document_type_id] = {
                _id: result._id,
                document_type_id: result.document_type_id,
                document_type_name: result.document_type_name || result.document_type_id,
                status: result.status,
              };
              console.log('✅ Loaded result into state', { 
                document_type_id: result.document_type_id, 
                _id: result._id, 
                document_type_name: result.document_type_name,
                status: result.status
              });
            } else {
              console.warn('⚠️ Result missing required fields - SKIPPED', { 
                result,
                missing: {
                  document_type_id: !result.document_type_id,
                  _id: !result._id,
                  status: !result.status
                }
              });
            }
          });
          
          console.log('📋 Final document results state:', { 
            count: Object.keys(newResults).length,
            keys: Object.keys(newResults),
            results: newResults
          });
          setDocumentResults(newResults);
        } else {
          console.warn('⚠️ No results returned from API', { results });
          setDocumentResults({});
        }
      } catch (error) {
        console.error('❌ Failed to load inspection results:', error);
        setDocumentResults({});
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    loadInspectionResults();
  }, [isOpen, point?.id]);

  // 🔥 Map status từ UI sang API format: passed=1, failed=0, pending=2
  const mapStatusToApi = (status: DocumentStatus): 0 | 1 | 2 => {
    switch (status) {
      case 'passed': return 1;
      case 'failed': return 0;
      case 'pending': return 2;
      default: return 2;
    }
  };

  // 🔥 Map status từ API format sang UI: 1=passed, 0=failed, 2=pending
  const mapStatusFromApi = (status: number): DocumentStatus => {
    switch (status) {
      case 1: return 'passed';
      case 0: return 'failed';
      case 2: return 'pending';
      default: return 'pending';
    }
  };

  // 🔥 Handler khi user chọn status mới - hiển thị confirm dialog
  const handleStatusChange = (documentTypeId: string, newStatus: DocumentStatus) => {
    const currentResult = documentResults[documentTypeId];
    const currentStatus = currentResult?.status;
    
    // Nếu status không đổi thì không làm gì
    if (currentStatus === newStatus) {
      return;
    }

    // Hiển thị confirm dialog
    setConfirmDialog({
      open: true,
      documentTypeId, // Giữ nguyên document_type_id từ Backend
      newStatus,
      docTypeLabel: currentResult?.document_type_name || 'Giấy tờ',
    });
  };

  // 🔥 Xác nhận và update status - tìm bản ghi theo document_type_id từ Backend
  const handleConfirmStatusUpdate = async () => {
    console.log('🔵 handleConfirmStatusUpdate called', { confirmDialog, documentResults });
    
    if (!confirmDialog.documentTypeId || !confirmDialog.newStatus) {
      console.warn('⚠️ Missing documentTypeId or newStatus', { 
        documentTypeId: confirmDialog.documentTypeId, 
        newStatus: confirmDialog.newStatus 
      });
      return;
    }

    const { documentTypeId, newStatus } = confirmDialog;
    const currentResult = documentResults[documentTypeId];

    console.log('🔵 Preparing to update', { 
      documentTypeId, 
      newStatus, 
      currentResult,
      allResults: documentResults 
    });

    // Tìm _id của record theo document_type_id
    if (!currentResult || !currentResult._id) {
      console.warn('⚠️ No result found for documentTypeId:', documentTypeId);
      toast.error('Không tìm thấy bản ghi để cập nhật. Vui lòng thử lại.');
      setConfirmDialog({ open: false, documentTypeId: null, newStatus: null, docTypeLabel: '' });
      return;
    }

    try {
      // 🔥 Map từ text (string) sang int: 'passed'=1, 'failed'=0, 'pending'=2
      const statusNumber = mapStatusToApi(newStatus);
      console.log('🔵 Status mapping (text to int)', { 
        newStatus, 
        statusNumber, 
        statusType: typeof statusNumber,
        resultId: currentResult._id,
        url: `${SUPABASE_REST_URL}/map_inspection_checklist_results?_id=eq.${currentResult._id}` 
      });
      
      const result = await updateInspectionChecklistResultStatus(currentResult._id, statusNumber);

      console.log('🔵 API response', result);

      if (result.success) {
        // Update local state - giữ nguyên document_type_id từ Backend
        setDocumentResults(prev => ({
          ...prev,
          [documentTypeId]: {
            ...prev[documentTypeId],
            status: newStatus,
          }
        }));
        toast.success(`Đã cập nhật trạng thái ${confirmDialog.docTypeLabel} thành công`);
      } else {
        toast.error(result.error || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setConfirmDialog({ open: false, documentTypeId: null, newStatus: null, docTypeLabel: '' });
    }
  };

  // 🔥 Helper function để render icon dựa trên status
  const getStatusIcon = (status: DocumentStatus, documentTypeId?: string) => {
    // Có thể thêm logic đặc biệt dựa trên documentTypeId nếu cần
    switch (status) {
      case 'passed':
        return <CheckCircle2 size={14} style={{ color: '#16a34a' }} />;
      case 'failed':
        return <X size={14} style={{ color: '#dc2626' }} />;
      case 'pending':
        return <AlertCircle size={14} style={{ color: '#eab308' }} />;
      default:
        return <CheckCircle2 size={14} style={{ color: '#16a34a' }} />;
    }
  };

  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !point) return null;

  const categoryColor = getCategoryColor(point.category);
  const statusBadge = getStatusBadge(point.category);

  // 🔥 Map Redux data to display variables
  const displayData = {
    name: currentMerchant?.business_name || point.name,
    taxCode: currentMerchant?.tax_code || point.taxCode || 'N/A',
    businessType: currentMerchant?.business_type || point.type || 'N/A',
    license: currentMerchant?.merchant_licenses?.[0]?.license_number || point.taxCode || 'N/A',
    owner: currentMerchant?.owner_name || 'N/A',
    phone: currentMerchant?.owner_phone || point.hotline || 'N/A',
    email: currentMerchant?.email || 'N/A',
    address: currentMerchant?.address || point.address,
    ward: currentMerchant?.ward || point.ward,
    district: currentMerchant?.district || point.district,
    province: currentMerchant?.province || point.province,
    establishedDate: currentMerchant?.created_at ? new Date(currentMerchant.created_at) : null,
    employees: currentMerchant?.merchant_staff?.length || currentMerchant?.employee_count || 0,
    capacity: currentMerchant?.capacity || 0,
    inspectionCount: currentMerchant?.inspection_count || 0,
    violationCount: currentMerchant?.violation_count || 0,
    rating: currentMerchant?.rating || (point.category === 'certified' ? 'A' : point.category === 'hotspot' ? 'C' : 'B'),
    lastInspectionDate: currentMerchant?.last_inspection_date ? new Date(currentMerchant.last_inspection_date) : null,
    nextInspectionDate: currentMerchant?.next_inspection_date ? new Date(currentMerchant.next_inspection_date) : null,
    attpCertificateNumber: currentMerchant?.attp_certificate_number || `CN-ATTP ${Math.floor(1000 + (point?.id?.charCodeAt(0) || 0) % 9000)}/${new Date().getFullYear()}`,
  };

  // mapping certificate status to Vietnamese and colors
  const getLicenseStatusConfig = (status: string, isATTP: boolean) => {
    const s = status?.toLowerCase() || '';
    
    // Check if status is already in Vietnamese (from fallback or other sources)
    if (s === 'còn hiệu lực') {
      return { 
        text: 'Còn hiệu lực', 
        bg: isATTP ? '#dcfce7' : '#dbeafe', 
        color: isATTP ? '#166534' : '#1e40af' 
      };
    }

    switch (s) {
      case 'valid':
      case 'active':
        return { 
          text: 'Còn hiệu lực', 
          bg: isATTP ? '#dcfce7' : '#dbeafe', 
          color: isATTP ? '#166534' : '#1e40af' 
        };
      case 'expiring':
        return { 
          text: 'Sắp hết hạn', 
          bg: '#fef3c7', 
          color: '#92400e' 
        };
      case 'expired':
        return { 
          text: 'Hết hiệu lực', 
          bg: '#fee2e2', 
          color: '#991b1b' 
        };
      case 'revoked':
        return { 
          text: 'Bị thu hồi', 
          bg: '#f3f4f6', 
          color: '#374151' 
        };
      default:
        return { 
          text: status || 'N/A', 
          bg: '#f3f4f6', 
          color: '#374151' 
        };
    }
  };

  // 🔥 FIX: Handle overlay click - only close if clicking directly on overlay, not from event bubbling
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 🔥 FIX: Prevent closing if modal just opened (click event from popup button may bubble up)
    const timeSinceOpen = Date.now() - openTimeRef.current;
    if (justOpenedRef.current || timeSinceOpen < 500) { // 🔥 FIX: Increased to 500ms
      return;
    }

    // Only close if clicking directly on the overlay (not on a child element)
    // Also check if click came from a button or interactive element
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return; // Don't close if clicking on buttons
    }

    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 🔥 FIX: Temporarily disable overlay click during initial opening period
  const overlayClassName = justOpenedRef.current
    ? `${styles.overlay} ${styles.overlayDisabled}`
    : styles.overlay;

  return (
    <div
      className={overlayClassName}
      onClick={handleOverlayClick}
      style={justOpenedRef.current ? { pointerEvents: 'auto' } : undefined} // Allow modal content to be clickable
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>

        {/* Employee List Modal Overlay */}
        {showStaffModal && (
          <div className={styles.staffModalOverlay}>
            <div className={styles.staffModalHeader}>
              <div className={styles.staffModalTitle}>
                <Users size={20} />
                <span>Danh sách nhân viên ({currentMerchant?.merchant_staff?.length || 0})</span>
              </div>
              <button 
                className={styles.staffModalClose} 
                onClick={() => setShowStaffModal(false)}
                title="Quay lại"
              >
                <X size={18} />
              </button>
            </div>
            <div className={styles.staffModalBody}>
              {currentMerchant?.merchant_staff && currentMerchant.merchant_staff.length > 0 ? (
                <div className={styles.staffGrid}>
                  {currentMerchant.merchant_staff.map((staff: any, index: number) => (
                    <div key={staff._id || index} className={styles.staffCard}>
                      <div className={styles.staffAvatar}>
                        <User size={24} />
                      </div>
                      <div className={styles.staffInfo}>
                        <div className={styles.staffName}>{staff.full_name || staff.name || 'N/A'}</div>
                        <div className={styles.staffRole}>{staff.position || staff.role || 'Nhân viên'}</div>
                        
                        <div className={styles.staffDetailItem}>
                          <Phone size={14} />
                          <span>{staff.phone_number || staff.phone || 'N/A'}</span>
                        </div>
                        
                        <div className={styles.staffDetailItem}>
                          <Mail size={14} />
                          <span>{staff.email || 'N/A'}</span>
                        </div>

                        {staff.staff_code && (
                          <div className={styles.staffDetailItem}>
                            <Hash size={14} />
                            <span>Mã Nhân viên: {staff.staff_code}</span>
                          </div>
                        )}

                        {staff.citizen_id && (
                          <div className={styles.staffDetailItem}>
                            <FileText size={14} />
                            <span>CCCD: {staff.citizen_id}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noStaffMessage}>
                  <Users size={48} strokeWidth={1} />
                  <p>Không có dữ liệu nhân viên</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Header Section - Compact */}
        <div className={styles.header}>
          <div className={styles.headerBadge} style={{ background: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.icon}
            <span>{statusBadge.text}</span>
          </div>
          <div className={styles.headerTitleRow}>
            <h1 className={styles.headerTitle}>{displayData.name}</h1>
            {/* Compact Stats - Inline with title */}
            <div className={styles.compactStats}>
              <div 
                className={`${styles.compactStatItem} ${styles.clickableStatItem}`}
                onClick={() => setShowStaffModal(true)}
                title="Xem danh sách nhân viên"
              >
                <Users size={14} />
                <span>{displayData.employees} Nhân viên</span>
              </div>
              <div className={styles.compactStatItem}>
                <Utensils size={14} />
                <span>{displayData.capacity} chỗ</span>
              </div>
              <div className={styles.compactStatItem}>
                <Shield size={14} />
                <span>{displayData.inspectionCount} Lần kiểm tra</span>
              </div>
              <div className={styles.compactStatItem} style={{
                color: displayData.violationCount > 2 ? '#dc2626' : displayData.violationCount > 0 ? '#eab308' : '#16a34a'
              }}>
                <AlertCircle size={14} />
                <span>{displayData.violationCount} Vi phạm</span>
              </div>
            </div>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.metaId}>MST: {displayData.taxCode}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaCategory}>{getCategoryLabel(point.category)}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaRating}>Xếp loại: {displayData.rating}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.content}>
          {isMerchantLoading && (
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              Đang cập nhật dữ liệu mới nhất...
            </div>
          )}
          {/* Alert for Hotspots - Move to top */}
          {point.category === 'hotspot' && (
            <div className={styles.alertCard}>
              <div className={styles.alertIcon}>
                <AlertCircle size={20} />
              </div>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>Cảnh báo điểm nóng ATTP</div>
                <div className={styles.alertText}>
                  Cơ sở này đã được xác định là điểm nóng về an toàn thực phẩm.
                  Phát hiện {displayData.violationCount} vi phạm trong lần kiểm tra gần nhất.
                  Cần tiến hành kiểm tra và giám sát chặt chẽ.
                </div>
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className={styles.twoColumnGrid}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
              {/* Business Info */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('business')}
                  style={{ cursor: 'pointer' }}
                >
                  <Building2 size={16} />
                  <h3 className={styles.cardTitle}>Thông tin cơ sở</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.business ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.business && (
                  <div className={styles.cardBody}>
                    <div className={styles.infoGrid}>
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Loại hình</div>
                        <div className={styles.infoValue}>{displayData.businessType}</div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Giấy phép</div>
                        <div className={styles.infoValue}>{displayData.license}</div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Ngày thành lập</div>
                        <div className={styles.infoValue}>
                          {displayData.establishedDate ? displayData.establishedDate.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Xếp loại ATTP</div>
                        <div className={styles.infoValue}>
                          <span className={styles.ratingBadge} style={{
                            background: displayData.rating === 'A' ? '#dcfce7' : displayData.rating === 'C' ? '#fee2e2' : '#fef3c7',
                            color: displayData.rating === 'A' ? '#166534' : displayData.rating === 'C' ? '#991b1b' : '#92400e'
                          }}>
                            {displayData.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Info - Compact */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('address')}
                  style={{ cursor: 'pointer' }}
                >
                  <MapPin size={16} />
                  <h3 className={styles.cardTitle}>Địa chỉ</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.address ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.address && (
                  <div className={styles.cardBody}>
                    <div className={styles.addressFull}>{displayData.address}</div>
                    <div className={styles.addressCompact}>
                      {displayData.ward && <span>{displayData.ward}</span>}
                      {displayData.ward && <span className={styles.addressSep}>•</span>}
                      <span>{displayData.district}</span>
                      <span className={styles.addressSep}>•</span>
                      <span>{displayData.province}</span>
                    </div>
                    <div className={styles.gpsCoords}>
                      GPS: {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Info - Compact */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('contact')}
                  style={{ cursor: 'pointer' }}
                >
                  <Phone size={16} />
                  <h3 className={styles.cardTitle}>Liên hệ</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.contact ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.contact && (
                  <div className={styles.cardBody}>
                    <div className={styles.contactCompact}>
                      <div className={styles.contactRow}>
                        <User size={14} />
                        <span className={styles.contactLabel}>Đại diện:</span>
                        <span className={styles.contactValue}>{displayData.owner}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <Phone size={14} />
                        <span className={styles.contactLabel}>SĐT:</span>
                        <span className={styles.contactValue}>{displayData.phone}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <Mail size={14} />
                        <span className={styles.contactLabel}>Email:</span>
                        <span className={styles.contactValue}>{displayData.email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Inspection Results - Compact */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('results')}
                  style={{ cursor: 'pointer' }}
                >
                  <FileText size={16} />
                  <h3 className={styles.cardTitle}>Kết quả kiểm tra</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.results ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.results && (
                  <div className={styles.cardBody}>
                    <div className={styles.resultCompact}>
                      {isLoadingDocuments ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                          Đang tải dữ liệu...
                        </div>
                      ) : Object.keys(documentResults).length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                          Chưa có dữ liệu kết quả kiểm tra
                        </div>
                      ) : (
                        // 🔥 Render từ data thực tế từ API - giữ nguyên document_type_id từ Backend
                        Object.values(documentResults).map((result) => {
                          const status = result.status;
                          // Tìm options từ DOCUMENT_TYPES dựa trên document_type_name hoặc dùng default
                          const docType = DOCUMENT_TYPES.find(dt => 
                            dt.label.toLowerCase().includes(result.document_type_name.toLowerCase()) ||
                            result.document_type_name.toLowerCase().includes(dt.label.toLowerCase())
                          );
                          const options = docType?.options || [
                            { value: 'passed', label: 'Đạt' },
                            { value: 'failed', label: 'Chưa đạt' },
                            { value: 'pending', label: 'Chưa kiểm tra' },
                          ];
                          
                          return (
                            <div key={result.document_type_id} className={styles.resultRow}>
                              {getStatusIcon(status, result.document_type_id as any)}
                              <span>{result.document_type_name}</span>
                              <Select
                                value={status}
                                onValueChange={(value) => {
                                  handleStatusChange(result.document_type_id, value as DocumentStatus);
                                }}
                              >
                                <SelectTrigger 
                                  className={styles.selectTrigger}
                                  size="sm"
                                  style={{ width: 120, marginLeft: 'auto' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent 
                                  className={styles.selectContent}
                                  onPointerDownOutside={(e) => e.preventDefault()}
                                >
                                  {options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
              {/* Inspection Timeline */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('timeline')}
                  style={{ cursor: 'pointer' }}
                >
                  <Calendar size={16} />
                  <h3 className={styles.cardTitle}>Lịch sử kiểm tra</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.timeline ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.timeline && (
                  <div className={styles.cardBody}>
                    <div className={styles.timeline}>
                      {isHistoryLoading ? (
                        <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                          Đang tải lịch sử...
                        </div>
                      ) : inspectionHistory && inspectionHistory.length > 0 ? (
                        inspectionHistory.map((item, index) => (
                          <div key={item._id || index} className={styles.timelineItem}>
                            <div 
                              className={styles.timelineDot} 
                              style={{ 
                                background: item.status === 'passed' ? '#22c55e' : item.status === 'failed' ? '#ef4444' : '#94a3b8' 
                              }} 
                            />
                            <div className={styles.timelineContent}>
                              <div className={styles.timelineTitle}>{item.document_type_name || 'Kiểm tra'}</div>
                              <div className={styles.timelineDate}>
                                {item.inspection_date ? new Date(item.inspection_date).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric'
                                }) : 'N/A'}
                              </div>
                              {item.notes && <div className={styles.timelineMeta}>{item.notes}</div>}
                              <div className={styles.timelineResult}>
                                KQ: <strong style={{ color: item.status === 'passed' ? '#16a34a' : item.status === 'failed' ? '#dc2626' : 'inherit' }}>
                                  {item.status === 'passed' ? 'Đạt' : item.status === 'failed' ? 'Không đạt' : 'Chưa có kết quả'}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.timelineItem}>
                          <div className={styles.timelineDot} style={{ background: '#22c55e' }} />
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineTitle}>Kiểm tra gần nhất</div>
                            <div className={styles.timelineDate}>
                              {displayData.lastInspectionDate ? displayData.lastInspectionDate.toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }) : 'N/A'}
                            </div>
                            <div className={styles.timelineMeta}>
                              Chi cục QLTT {point.district}
                            </div>
                            <div className={styles.timelineResult}>
                              KQ: <strong>{point.category === 'hotspot' ? 'Không đạt' : 'Đạt yêu cầu'}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {displayData.nextInspectionDate && (
                        <div className={styles.timelineItem}>
                          <div className={styles.timelineDot} style={{ background: '#eab308' }} />
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineTitle}>Kiểm tra tiếp theo</div>
                            <div className={styles.timelineDate}>
                              {displayData.nextInspectionDate.toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </div>
                            <div className={styles.timelineMeta}>Đã lên lịch</div>
                          </div>
                        </div>
                      )}

                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: '#94a3b8' }} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTitle}>Cấp giấy phép</div>
                          <div className={styles.timelineDate}>
                            {displayData.establishedDate ? displayData.establishedDate.toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }) : 'N/A'}
                          </div>
                          <div className={styles.timelineMeta}>
                            Sở Y tế {point.province}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificates - Compact */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('certificates')}
                  style={{ cursor: 'pointer' }}
                >
                  <Award size={16} />
                  <h3 className={styles.cardTitle}>Giấy chứng nhận</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.certificates ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.certificates && (
                  <div className={styles.cardBody}>
                    <div className={styles.certCompact}>
                      {isLicensesLoading ? (
                        <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                          Đang tải giấy chứng nhận...
                        </div>
                      ) : licenses && licenses.length > 0 ? (
                        licenses.map((license, index) => {
                          const isATTP = license.license_type?.toLowerCase().includes('an toàn thực phẩm') || 
                                       license.license_type?.toLowerCase().includes('attp');
                          const statusConfig = getLicenseStatusConfig(license.status, isATTP);
                          
                          return (
                            <div key={license._id || index} className={styles.certItem}>
                              <div className={styles.certItemHeader}>
                                <div 
                                  className={styles.certIconSmall} 
                                  style={{ 
                                    background: isATTP ? '#dcfce7' : '#dbeafe', 
                                    color: isATTP ? '#16a34a' : '#005cb6' 
                                  }}
                                >
                                  {isATTP ? <FileCheck size={14} /> : <FileCheck size={14} />}
                                </div>
                                <div>
                                  <div className={styles.certTitleSmall}>{license.license_type || 'Giấy chứng nhận'}</div>
                                  <div className={styles.certNumber}>{license.license_number || 'N/A'}</div>
                                </div>
                                <span 
                                  className={styles.certStatusBadge} 
                                  style={{ 
                                    background: statusConfig.bg, 
                                    color: statusConfig.color 
                                  }}
                                >
                                  {statusConfig.text}
                                </span>
                              </div>
                              <div className={styles.certMeta}>
                                {license.issued_by_name && `Cấp bởi: ${license.issued_by_name} • `}
                                Cấp: {license.issued_date ? new Date(license.issued_date).toLocaleDateString('vi-VN') : 'N/A'} 
                                {license.expiry_date && ` • HH: ${new Date(license.expiry_date).toLocaleDateString('vi-VN')}`}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <>
                          {/* ATTP Certificate Fallback */}
                          <div className={styles.certItem}>
                            <div className={styles.certItemHeader}>
                              <div className={styles.certIconSmall} style={{ background: '#dcfce7', color: '#16a34a' }}>
                                <FileCheck size={14} />
                              </div>
                              <div>
                                <div className={styles.certTitleSmall}>Chứng nhận ATTP</div>
                                <div className={styles.certNumber}>{displayData.attpCertificateNumber}</div>
                              </div>
                              <span className={styles.certStatusBadge} style={{ background: '#dcfce7', color: '#166534' }}>
                                Còn hiệu lực
                              </span>
                            </div>
                            <div className={styles.certMeta}>
                              Cấp bởi: Sở Y tế {point.province} • Cấp: {displayData.establishedDate ? displayData.establishedDate.toLocaleDateString('vi-VN') : 'N/A'} • HH: {displayData.establishedDate ? new Date(displayData.establishedDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN') : 'N/A'}
                            </div>
                          </div>

                          {/* Business License Fallback */}
                          <div className={styles.certItem}>
                            <div className={styles.certItemHeader}>
                              <div className={styles.certIconSmall} style={{ background: '#dbeafe', color: '#005cb6' }}>
                                <FileCheck size={14} />
                              </div>
                              <div>
                                <div className={styles.certTitleSmall}>Giấy phép KD</div>
                                <div className={styles.certNumber}>{displayData.license}</div>
                              </div>
                              <span className={styles.certStatusBadge} style={{ background: '#dbeafe', color: '#1e40af' }}>
                                Còn hiệu lực
                              </span>
                            </div>
                            <div className={styles.certMeta}>
                              Cấp bởi: Phòng ĐKKD {point.district} • Loại hình: {point.type}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Legal Documents - Simplified */}
              <div className={styles.card}>
                <div
                  className={styles.cardHeader}
                  onClick={() => toggleSection('legal')}
                  style={{ cursor: 'pointer' }}
                >
                  <Scale size={16} />
                  <h3 className={styles.cardTitle}>Văn bản pháp lý</h3>
                  <ChevronDown
                    size={16}
                    className={styles.chevron}
                    style={{
                      transform: collapsedSections.legal ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
                {!collapsedSections.legal && (
                  <div className={styles.cardBody}>
                    <div className={styles.legalCompact}>
                      {currentMerchant?.merchant_law_docs && currentMerchant.merchant_law_docs.length > 0 ? (
                        currentMerchant.merchant_law_docs.map((doc: any, index: number) => (
                          <div key={doc._id || index} className={styles.legalItemCompact}>
                            <BookOpen size={14} />
                            <div>
                              <div className={styles.legalTitleCompact}>{doc.title || doc.name || 'N/A'}</div>
                              <div className={styles.legalMetaCompact}>
                                {doc.document_number && <span>{doc.document_number}</span>}
                                {doc.document_number && (doc.description || doc.effective_date) && <span> • </span>}
                                {doc.description && <span>{doc.description}</span>}
                                {!doc.description && doc.effective_date && <span>Hiệu lực: {new Date(doc.effective_date).toLocaleDateString('vi-VN')}</span>}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noDataCompact}>Không có dữ liệu văn bản pháp lý</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Citizen Reports - Only for hotspots */}
              {point.category === 'hotspot' && point.citizenReports && point.citizenReports.length > 0 && (
                <div className={styles.card}>
                  <div
                    className={styles.cardHeader}
                    onClick={() => toggleSection('citizenReports')}
                    style={{ cursor: 'pointer' }}
                  >
                    <MessageSquare size={16} />
                    <h3 className={styles.cardTitle}>Phản ánh của người dân</h3>
                    <span className={styles.reportCount}>{point.citizenReports.length}</span>
                    <ChevronDown
                      size={16}
                      className={styles.chevron}
                      style={{
                        transform: collapsedSections.citizenReports ? 'rotate(-90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>
                  {!collapsedSections.citizenReports && (
                    <div className={styles.cardBody}>
                      <div className={styles.citizenReportsContainer}>
                        {point.citizenReports.map((report) => {
                          const reportDate = new Date(report.reportDate);
                          const daysAgo = Math.floor((Date.now() - reportDate.getTime()) / (1000 * 60 * 60 * 24));

                          return (
                            <div key={report.id} className={styles.reportItem}>
                              <div className={styles.reportHeader}>
                                <div className={styles.reportMeta}>
                                  <User size={14} />
                                  <span className={styles.reporterName}>{report.reporterName}</span>
                                  <span className={styles.reportDivider}>•</span>
                                  <span className={styles.reportDate}>
                                    {daysAgo === 0 ? 'Hôm nay' : daysAgo === 1 ? 'Hôm qua' : `${daysAgo} ngày trước`}
                                  </span>
                                </div>
                                <div className={styles.violationBadge}>
                                  <AlertCircle size={12} />
                                  <span>{report.violationType}</span>
                                </div>
                              </div>

                              <div className={styles.reportContent}>
                                {report.content}
                              </div>

                              {report.images && report.images.length > 0 && (
                                <div className={styles.reportMedia}>
                                  <div className={styles.reportMediaHeader}>
                                    <ImageIcon size={14} />
                                    <span>{report.images.length} hình ảnh đính kèm</span>
                                  </div>
                                  <div className={styles.reportImageGrid}>
                                    {report.images.map((image, idx) => (
                                      <div
                                        key={idx}
                                        className={styles.reportImageWrapper}
                                        onClick={() => {
                                          openLightbox(report.images, idx);
                                        }}
                                      >
                                        <img
                                          src={image}
                                          alt={`Phản ánh ${idx + 1}`}
                                          className={styles.reportImage}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Confirm Dialog for Status Update */}
      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setConfirmDialog({ open: false, documentTypeId: null, newStatus: null, docTypeLabel: '' });
          }
        }}
        title="Xác nhận thay đổi trạng thái"
        description={`Bạn có chắc chắn muốn thay đổi trạng thái "${confirmDialog.docTypeLabel}" thành "${confirmDialog.newStatus === 'passed' ? 'Đạt' : confirmDialog.newStatus === 'failed' ? 'Chưa đạt' : 'Chưa kiểm tra'}"?`}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy"
        variant="default"
        onConfirm={handleConfirmStatusUpdate}
      />

      {isLightboxOpen && (
        <ImageLightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
}