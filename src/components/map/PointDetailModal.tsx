import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, MapPin, Building2, Calendar, Shield, Clock, Users, Phone, Mail, User, ChevronRight, Info, FileText, CheckCircle2, AlertCircle, Star, Utensils, Hash, FileCheck, BookOpen, Scale, Award, ChevronDown, MessageSquare, Image as ImageIcon } from 'lucide-react';
import styles from './PointDetailModal.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { ImageLightbox } from './ImageLightbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { fetchMerchantInspectionResults, updateInspectionChecklistResultStatus } from '@/utils/api/merchantsApi';
import { SUPABASE_REST_URL } from '@/utils/api/config';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui-kit/ConfirmDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import { RootState } from '@/store/rootReducer';
import { fetchMerchantDetailRequest, clearCurrentMerchant, fetchInspectionHistoryRequest, fetchMerchantLicensesRequest } from '@/store/slices/merchantSlice';

interface PointDetailModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

// Định nghĩa types và config cho các loại giấy tờ
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

// Helper functions
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

  // States
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
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  interface DocumentResult {
    _id: string;
    document_type_id: string;
    document_type_name: string;
    status: DocumentStatus;
  }
  const [documentResults, setDocumentResults] = useState<Record<string, DocumentResult>>({});
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    documentTypeId: string | null;
    newStatus: DocumentStatus | null;
    docTypeLabel: string;
  }>({
    open: false,
    documentTypeId: null,
    newStatus: null,
    docTypeLabel: '',
  });

  const justOpenedRef = useRef(false);
  const openTimeRef = useRef(0);


  // Fetch data
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

  // Handle prevention of immediate close
  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true;
      openTimeRef.current = Date.now();
      const timer = setTimeout(() => {
        justOpenedRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Load inspection results
  useEffect(() => {
    if (!isOpen || !point?.id) {
      setDocumentResults({});
      return;
    }

    const loadInspectionResults = async () => {
      setIsLoadingDocuments(true);
      try {
        const results = await fetchMerchantInspectionResults(point.id);
        if (results && results.length > 0) {
          const newResults: Record<string, DocumentResult> = {};
          results.forEach((result) => {
            if (result.document_type_id && result._id && result.status) {
              newResults[result.document_type_id] = {
                _id: result._id,
                document_type_id: result.document_type_id,
                document_type_name: result.document_type_name || result.document_type_id,
                status: result.status,
              };
            }
          });
          setDocumentResults(newResults);
        }
      } catch (error) {
        console.error('Failed to load inspection results:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    loadInspectionResults();
  }, [isOpen, point?.id]);

  // Map Redux data for display
  const displayData = useMemo(() => {
    const inspectionCount = inspectionHistory?.length ?? 0;
    const actualViolations = inspectionHistory?.filter(item => item.status === 'failed').length ?? 0;

    return {
      name: currentMerchant?.business_name || point?.name || '',
      taxCode: currentMerchant?.tax_code || point?.taxCode || 'N/A',
      businessType: currentMerchant?.business_type || point?.type || 'N/A',
      license: currentMerchant?.merchant_licenses?.[0]?.license_number || point?.taxCode || 'N/A',
      owner: currentMerchant?.owner_name ?? 'N/A',
      phone: currentMerchant?.owner_phone || point?.hotline || 'N/A',
      email: currentMerchant?.email ?? 'N/A',
      address: currentMerchant?.address || point?.address || '',
      ward: currentMerchant?.ward || point?.ward,
      district: currentMerchant?.district || point?.district,
      province: currentMerchant?.province || point?.province,
      establishedDate: currentMerchant?.created_at ? new Date(currentMerchant.created_at) : null,
      employees: currentMerchant?.merchant_staff?.length ?? currentMerchant?.employee_count ?? 0,
      capacity: currentMerchant?.capacity ?? 0,
      inspectionCount,
      violationCount: actualViolations,
      rating: currentMerchant?.rating || (point?.category === 'certified' ? 'A' : point?.category === 'hotspot' ? 'C' : 'B'),
      lastInspectionDate: currentMerchant?.last_inspection_date ? new Date(currentMerchant.last_inspection_date) : null,
      nextInspectionDate: currentMerchant?.next_inspection_date ? new Date(currentMerchant.next_inspection_date) : null,
      attpCertificateNumber: currentMerchant?.attp_certificate_number || `CN-ATTP ${Math.floor(1000 + (point?.id?.charCodeAt(0) || 0) % 9000)}/${new Date().getFullYear()}`,
      storeArea: currentMerchant?.store_area || 'N/A',
    };
  }, [currentMerchant, point, inspectionHistory]);

 const alertInfo = useMemo(() => {
    const type = displayData.businessType.toLowerCase();
    const count = displayData.violationCount;

    if (count === 0) {
      return null; // No alert if no violations
    }

    const categories = [
      { keywords: ['restaurant', 'đồ uống', 'uống', 'ăn', 'thực phẩm'], subject: 'Cơ sở dịch vụ ăn uống', focus: 'vệ sinh khu vực chế biến và nguồn gốc thực phẩm' },
      { keywords: ['grocery', 'tiện lợi', 'retail', 'bán lẻ', 'tổng hợp', 'tạp hóa'], subject: 'Cơ sở kinh doanh bán lẻ', focus: 'hạn sử dụng và điều kiện bảo quản hàng hóa' },
      { keywords: ['pharmacy', 'thuốc'], subject: 'Nhà thuốc/Dược phẩm', focus: 'chứng chỉ hành nghề và điều kiện bảo quản thuốc' },
      { keywords: ['electronics', 'fashion', 'service', 'điện tử', 'thời trang'], subject: 'Cơ sở kinh doanh dịch vụ', focus: 'giấy phép kinh doanh và an toàn phòng chống cháy nổ' }
    ];

    const match = categories.find(cat => cat.keywords.some(key => type.includes(key)));
    const finalSubject = match ? match.subject : 'Cơ sở kinh doanh';
    const finalFocus = match ? match.focus : 'tiêu chuẩn an toàn và pháp lý';

    let title = '';
    let severity: 'high' | 'medium' = 'medium';

    if (count >= 3) {
      title = `Cảnh báo Rủi ro Cao: ${finalSubject}`;
      severity = 'high';
    } else { // count > 0
      title = `Cảnh báo Rủi ro: ${finalSubject}`;
      severity = 'medium';
    }

    return {
      title,
      severity,
      message: `${displayData.businessType} này đã phát hiện ${count} lỗi vi phạm. Cần tập trung kiểm tra ${finalFocus}.`
    };
  }, [displayData.businessType, displayData.violationCount]);

  // Handlers
  const mapStatusToApi = (status: DocumentStatus): 0 | 1 | 2 => {
    if (status === 'passed') return 1;
    if (status === 'failed') return 0;
    return 2;
  };

  const handleStatusChange = (documentTypeId: string, newStatus: DocumentStatus) => {
    const currentResult = documentResults[documentTypeId];
    if (currentResult?.status === newStatus) return;

    setConfirmDialog({
      open: true,
      documentTypeId,
      newStatus,
      docTypeLabel: currentResult?.document_type_name || 'Giấy tờ',
    });
  };

  const handleConfirmStatusUpdate = async () => {
    if (!confirmDialog.documentTypeId || !confirmDialog.newStatus) return;
    const { documentTypeId, newStatus } = confirmDialog;
    const currentResult = documentResults[documentTypeId];

    if (!currentResult?._id) {
      toast.error('Không tìm thấy bản ghi để cập nhật');
      return;
    }

    try {
      const statusNumber = mapStatusToApi(newStatus);
      const result = await updateInspectionChecklistResultStatus(currentResult._id, statusNumber);
      if (result.success) {
        setDocumentResults(prev => ({
          ...prev,
          [documentTypeId]: { ...prev[documentTypeId], status: newStatus }
        }));
        toast.success(`Đã cập nhật trạng thái ${confirmDialog.docTypeLabel} thành công`);
      } else {
        toast.error(result.error || 'Cập nhật thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setConfirmDialog({ open: false, documentTypeId: null, newStatus: null, docTypeLabel: '' });
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'passed': return <CheckCircle2 size={14} style={{ color: '#16a34a' }} />;
      case 'failed': return <X size={14} style={{ color: '#dc2626' }} />;
      default: return <AlertCircle size={14} style={{ color: '#eab308' }} />;
    }
  };

  const getLicenseStatusConfig = (status: string, isATTP: boolean) => {
    const s = status?.toLowerCase() || '';
    if (s === 'valid' || s === 'active' || s === 'còn hiệu lực') {
      return { text: 'Còn hiệu lực', bg: isATTP ? '#dcfce7' : '#dbeafe', color: isATTP ? '#166534' : '#1e40af' };
    }
    if (s === 'expiring' || s === 'sắp hết hạn') return { text: 'Sắp hết hạn', bg: '#fef3c7', color: '#92400e' };
    if (s === 'expired' || s === 'hết hiệu lực') return { text: 'Hết hiệu lực', bg: '#fee2e2', color: '#991b1b' };
    return { text: status || 'N/A', bg: '#f3f4f6', color: '#374151' };
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeSinceOpen = Date.now() - openTimeRef.current;
    if (justOpenedRef.current || timeSinceOpen < 500) return;
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button') || target.closest('a') || target.closest('[role="button"]')) return;
    if (e.target === e.currentTarget) onClose();
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Lifecycle for UI
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !point) return null;

  const statusBadge = getStatusBadge(point.category);
  const overlayClassName = justOpenedRef.current ? `${styles.overlay} ${styles.overlayDisabled}` : styles.overlay;

  return (
      <div className={overlayClassName} onClick={handleOverlayClick} style={justOpenedRef.current ? { pointerEvents: 'auto' } : undefined}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng"><X size={18} /></button>

          {/* Staff Modal Overlay */}
          {showStaffModal && (
              <div className={styles.staffModalOverlay}>
                <div className={styles.staffModalHeader}>
                  <div className={styles.staffModalTitle}><Users size={20} /> <span>Danh sách nhân viên ({currentMerchant?.merchant_staff?.length || 0})</span></div>
                  <button className={styles.staffModalClose} onClick={() => setShowStaffModal(false)} title="Quay lại"><X size={18} /></button>
                </div>
                <div className={styles.staffModalBody}>
                  {currentMerchant?.merchant_staff && currentMerchant.merchant_staff.length > 0 ? (
                      <div className={styles.staffGrid}>
                        {currentMerchant.merchant_staff.map((staff: any, index: number) => (
                            <div key={staff._id || index} className={styles.staffCard}>
                              <div className={styles.staffAvatar}><User size={24} /></div>
                              <div className={styles.staffInfo}>
                                <div className={styles.staffName}>{staff.full_name || staff.name || 'N/A'}</div>
                                <div className={styles.staffRole}>{staff.position || staff.role || 'Nhân viên'}</div>
                                <div className={styles.staffDetailItem}><Phone size={14} /> <span>{staff.phone_number || staff.phone || 'N/A'}</span></div>
                                <div className={styles.staffDetailItem}><Mail size={14} /> <span>{staff.email || 'N/A'}</span></div>
                              </div>
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className={styles.noStaffMessage}><Users size={48} strokeWidth={1} /><p>Không có dữ liệu nhân viên</p></div>
                  )}
                </div>
              </div>
          )}

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerBadge} style={{ background: statusBadge.bg, color: statusBadge.color }}>
              {statusBadge.icon} <span>{statusBadge.text}</span>
            </div>
            <div className={styles.headerTitleRow}>
              <h1 className={styles.headerTitle}>{displayData.name}</h1>
              <div className={styles.compactStats}>
                <div className={`${styles.compactStatItem} ${styles.clickableStatItem}`} onClick={() => setShowStaffModal(true)}>
                  <Users size={14} /> <span>{displayData.employees} NV</span>
                </div>
                <div className={styles.compactStatItem}><Utensils size={14} /> <span>{displayData.capacity} chỗ</span></div>
                <div className={styles.compactStatItem}><Shield size={14} /> <span>{displayData.inspectionCount} Lần</span></div>
                <div className={styles.compactStatItem} style={{ color: displayData.violationCount > 0 ? '#dc2626' : '#16a34a' }}>
                  <AlertCircle size={14} /> <span>{displayData.violationCount} Vi phạm</span>
                </div>
              </div>
            </div>
            <div className={styles.headerMeta}>
              <span>MST: {displayData.taxCode}</span> <span className={styles.metaDivider}>•</span>
              <span>{getCategoryLabel(point.category)}</span> <span className={styles.metaDivider}>•</span>
              <span>Xếp loại: {displayData.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className={styles.content}>
            {isMerchantLoading && <div className="flex items-center justify-center py-4 text-sm text-muted-foreground"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" /> Đang tải dữ liệu...</div>}

            {alertInfo && (
                <div className={styles.alertCard} style={{
                  background: alertInfo.severity === 'high' ? '#fee2e2' : '#fef3c7',
                  borderColor: alertInfo.severity === 'high' ? '#dc2626' : '#f59e0b',
                }}>
                  <div className={styles.alertIcon} style={{ color: alertInfo.severity === 'high' ? '#dc2626' : '#f59e0b' }}>
                    <AlertCircle size={20} />
                  </div>
                  <div className={styles.alertContent}>
                    <div className={styles.alertTitle} style={{ color: alertInfo.severity === 'high' ? '#991b1b' : '#92400e' }}>
                      {alertInfo.title}
                    </div>
                    <div className={styles.alertText} style={{ color: alertInfo.severity === 'high' ? '#b91c1c' : '#b45309' }}>
                      {alertInfo.message}
                    </div>
                  </div>
                </div>
            )}

            <div className={styles.twoColumnGrid}>
              <div className={styles.leftColumn}>
                {/* Business Info */}
                <div className={styles.card}>
                  <div className={styles.cardHeader} onClick={() => toggleSection('business')}>
                    <Building2 size={16} /> <h3 className={styles.cardTitle}>Thông tin cơ sở</h3>
                    <ChevronDown size={16} style={{ transform: collapsedSections.business ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                  </div>
                  {!collapsedSections.business && (
                      <div className={styles.cardBody}>
                        <div className={styles.infoGrid}>
                          <div className={styles.infoItem}><div className={styles.infoLabel}>Loại hình</div><div className={styles.infoValue}>{displayData.businessType}</div></div>
                          <div className={styles.infoItem}><div className={styles.infoLabel}>Diện tích</div><div className={styles.infoValue}>{displayData.storeArea}</div></div>
                          <div className={styles.infoItem}><div className={styles.infoLabel}>Xếp loại ATTP</div><div className={styles.infoValue}><span className={styles.ratingBadge} style={{ background: displayData.rating === 'A' ? '#dcfce7' : '#fee2e2', color: displayData.rating === 'A' ? '#166534' : '#991b1b' }}>{displayData.rating}</span></div></div>
                        </div>
                      </div>
                  )}
                </div>

                {/* Address & Contact */}
                <div className={styles.card}>
                  <div className={styles.cardHeader} onClick={() => toggleSection('address')}>
                    <MapPin size={16} /> <h3 className={styles.cardTitle}>Địa chỉ & Liên hệ</h3>
                    <ChevronDown size={16} style={{ transform: collapsedSections.address ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                  </div>
                  {!collapsedSections.address && (
                      <div className={styles.cardBody}>
                        <div className={styles.addressFull}>{displayData.address}</div>
                        <div className={styles.contactCompact}>
                          <div className={styles.contactRow}><User size={14} /> <span>{displayData.owner}</span></div>
                          <div className={styles.contactRow}><Phone size={14} /> <span>{displayData.phone}</span></div>
                        </div>
                      </div>
                  )}
                </div>

                {/* Inspection Results */}
                <div className={styles.card}>
                  <div className={styles.cardHeader} onClick={() => toggleSection('results')}>
                    <FileText size={16} /> <h3 className={styles.cardTitle}>Kết quả kiểm tra</h3>
                    <ChevronDown size={16} style={{ transform: collapsedSections.results ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                  </div>
                  {!collapsedSections.results && (
                      <div className={styles.cardBody}>
                        <div className={styles.resultCompact}>
                          {isLoadingDocuments ? <div className="text-center py-4">Đang tải...</div> :
                              Object.values(documentResults).map((result) => {
                                const docType = DOCUMENT_TYPES.find(d => d.id === result.document_type_id) || DOCUMENT_TYPES[0];
                                return (
                                  <div key={result.document_type_id} className={styles.resultRow}>
                                    {getStatusIcon(result.status)}
                                    <span>{result.document_type_name}</span>
                                    <div onClick={(e) => e.stopPropagation()}>
                                      <Select value={result.status} onValueChange={(val) => handleStatusChange(result.document_type_id, val as DocumentStatus)}>
                                        <SelectTrigger className={styles.selectTrigger} style={{ width: 120, marginLeft: 'auto' }}><SelectValue /></SelectTrigger>
                                        <SelectContent className={styles.selectContent}>{docType.options.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                );
                              })
                          }
                        </div>
                      </div>
                  )}
                </div>
              </div>

              <div className={styles.rightColumn}>
                {/* History Timeline */}
                <div className={styles.card}>
                  <div className={styles.cardHeader} onClick={() => toggleSection('timeline')}>
                    <Calendar size={16} /> <h3 className={styles.cardTitle}>Lịch sử</h3>
                    <ChevronDown size={16} style={{ transform: collapsedSections.timeline ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                  </div>
                  {!collapsedSections.timeline && (
                      <div className={styles.cardBody}>
                        <div className={styles.timeline}>
                          {inspectionHistory?.map((item, idx) => (
                              <div key={item._id || idx} className={styles.timelineItem}>
                                <div className={styles.timelineDot} style={{ background: item.status === 'passed' ? '#22c55e' : '#ef4444' }} />
                                <div className={styles.timelineContent}>
                                  <div className={styles.timelineTitle}>{item.document_type_name}</div>
                                  <div className={styles.timelineDate}>{item.inspection_date ? new Date(item.inspection_date).toLocaleDateString('vi-VN') : 'N/A'}</div>
                                  <div className={styles.timelineResult}>KQ: <strong>{item.status === 'passed' ? 'Đạt' : 'Không đạt'}</strong></div>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </div>

                {/* Licenses */}
                <div className={styles.card}>
                  <div className={styles.cardHeader} onClick={() => toggleSection('certificates')}>
                    <Award size={16} /> <h3 className={styles.cardTitle}>Giấy chứng nhận</h3>
                    <ChevronDown size={16} style={{ transform: collapsedSections.certificates ? 'rotate(-90deg)' : 'rotate(0deg)' }} />
                  </div>
                  {!collapsedSections.certificates && (
                      <div className={styles.cardBody}>
                        {licenses?.map((license, idx) => {
                          const isATTP = license.license_type?.toLowerCase().includes('attp');
                          const config = getLicenseStatusConfig(license.status, isATTP);
                          return (
                              <div key={license._id || idx} className={styles.certItem}>
                                <div className={styles.certItemHeader}>
                                  <FileCheck size={14} color={isATTP ? '#16a34a' : '#005cb6'} />
                                  <div className={styles.certTitleSmall}>{license.license_type}</div>
                                  <span className={styles.certStatusBadge} style={{ background: config.bg, color: config.color }}>{config.text}</span>
                                </div>
                                <div className={styles.certMeta}>Số: {license.license_number} • Hết hạn: {license.expiry_date ? new Date(license.expiry_date).toLocaleDateString('vi-VN') : 'N/A'}</div>
                              </div>
                          );
                        })}
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmDialog
            open={confirmDialog.open}
            onOpenChange={(open) => !open && setConfirmDialog({ ...confirmDialog, open: false })}
            title="Xác nhận thay đổi"
            description={`Cập nhật "${confirmDialog.docTypeLabel}" sang trạng thái mới?`}
            onConfirm={handleConfirmStatusUpdate}
        />

        {isLightboxOpen && (
            <ImageLightbox
                images={lightboxImages}
                currentIndex={lightboxIndex}
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
                onPrev={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
            />
        )}
      </div>
  );
}
