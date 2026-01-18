import React, { useEffect, useState, useRef, useMemo } from 'react';
import { X, MapPin, Building2, Calendar, Shield, Clock, Users, Phone, Mail, User, ChevronRight, Info, FileText, CheckCircle2, AlertCircle, Star, Utensils, Hash, FileCheck, BookOpen, Scale, Award, ChevronDown, MessageSquare, Image as ImageIcon } from 'lucide-react';
import styles from './PointDetailModal.module.css';
import { Restaurant } from '../../../data/restaurantData';
import { ImageLightbox } from './ImageLightbox';

interface PointDetailModalProps {
  point: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

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

  // 🔥 FIX: Memoize mock data to prevent re-generation on every render (causes content jumping)
  // Generate mock data based on point.id for consistency
  // Must be called BEFORE early return (React Hooks rule)
  const mockData = useMemo(() => {
    if (!point) return null;
    // Use point.id as seed for pseudo-random values (consistent per point)
    const seed = point.id.charCodeAt(0) + point.id.charCodeAt(point.id.length - 1);
    const random1 = (seed * 9301 + 49297) % 233280 / 233280;
    const random2 = ((seed * 9301 + 49297) * 9301 + 49297) % 233280 / 233280;
    const random3 = (((seed * 9301 + 49297) * 9301 + 49297) * 9301 + 49297) % 233280 / 233280;
    const random4 = ((((seed * 9301 + 49297) * 9301 + 49297) * 9301 + 49297) * 9301 + 49297) % 233280 / 233280;
    
    return {
      businessLicense: `GP${Math.floor(random1 * 9000 + 1000)}-${new Date().getFullYear()}`,
      attpCertificateNumber: `CN-ATTP ${Math.floor(random1 * 9000 + 1000)}/${new Date().getFullYear()}`, // 🔥 FIX: Add certificate number to mockData
      establishedDate: new Date(Date.now() - random1 * 5 * 365 * 24 * 60 * 60 * 1000),
      lastInspection: new Date(Date.now() - random2 * 60 * 24 * 60 * 60 * 1000),
      nextInspection: point.category === 'scheduled' 
        ? new Date(Date.now() + random3 * 30 * 24 * 60 * 60 * 1000)
        : null,
      ownerName: `Nguyễn Văn ${String.fromCharCode(65 + Math.floor(random1 * 26))}`,
      phone: `0${Math.floor(random2 * 9 + 1)}${Math.floor(random3 * 100000000 + 100000000)}`,
      email: `contact@${point.name.toLowerCase().replace(/\s+/g, '').slice(0, 15)}.vn`,
      employees: Math.floor(random2 * 30 + 5),
      capacity: Math.floor(random3 * 150 + 50),
      inspectionCount: Math.floor(random4 * 10 + 1),
      rating: point.category === 'certified' ? 'A' : point.category === 'hotspot' ? 'C' : 'B',
      violationCount: point.category === 'hotspot' ? Math.floor(random4 * 3 + 2) : Math.floor(random4 * 2)
    };
  }, [point?.id, point?.category, point?.name]); // 🔥 Only regenerate when point changes

  if (!isOpen || !point) return null;

  const categoryColor = getCategoryColor(point.category);
  const statusBadge = getStatusBadge(point.category);
  
  const { businessLicense, attpCertificateNumber, establishedDate, lastInspection, nextInspection, ownerName, phone, email, employees, capacity, inspectionCount, rating, violationCount } = mockData || {};

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

        {/* Header Section - Compact */}
        <div className={styles.header}>
          <div className={styles.headerBadge} style={{ background: statusBadge.bg, color: statusBadge.color }}>
            {statusBadge.icon}
            <span>{statusBadge.text}</span>
          </div>
          <div className={styles.headerTitleRow}>
            <h1 className={styles.headerTitle}>{point.name}</h1>
            {/* Compact Stats - Inline with title */}
            <div className={styles.compactStats}>
              <div className={styles.compactStatItem}>
                <Users size={14} />
                <span>{employees} NV</span>
              </div>
              <div className={styles.compactStatItem}>
                <Utensils size={14} />
                <span>{capacity} chỗ</span>
              </div>
              <div className={styles.compactStatItem}>
                <Shield size={14} />
                <span>{inspectionCount} lần KT</span>
              </div>
              <div className={styles.compactStatItem} style={{
                color: violationCount > 2 ? '#dc2626' : violationCount > 0 ? '#eab308' : '#16a34a'
              }}>
                <AlertCircle size={14} />
                <span>{violationCount} VP</span>
              </div>
            </div>
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.metaId}>MST: {point.taxCode || 'N/A'}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaCategory}>{getCategoryLabel(point.category)}</span>
            <span className={styles.metaDivider}>•</span>
            <span className={styles.metaRating}>Xếp loại: {rating}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className={styles.content}>
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
                  Phát hiện {violationCount} vi phạm trong lần kiểm tra gần nhất. 
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
                        <div className={styles.infoValue}>{point.type}</div>
                      </div>
                      
                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Giấy phép</div>
                        <div className={styles.infoValue}>{businessLicense}</div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Ngày thành lập</div>
                        <div className={styles.infoValue}>
                          {establishedDate.toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                      </div>

                      <div className={styles.infoItem}>
                        <div className={styles.infoLabel}>Xếp loại ATTP</div>
                        <div className={styles.infoValue}>
                          <span className={styles.ratingBadge} style={{
                            background: rating === 'A' ? '#dcfce7' : rating === 'C' ? '#fee2e2' : '#fef3c7',
                            color: rating === 'A' ? '#166534' : rating === 'C' ? '#991b1b' : '#92400e'
                          }}>
                            {rating}
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
                    <div className={styles.addressFull}>{point.address}</div>
                    <div className={styles.addressCompact}>
                      {point.ward && <span>{point.ward}</span>}
                      {point.ward && <span className={styles.addressSep}>•</span>}
                      <span>{point.district}</span>
                      <span className={styles.addressSep}>•</span>
                      <span>{point.province}</span>
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
                        <span className={styles.contactValue}>{ownerName}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <Phone size={14} />
                        <span className={styles.contactLabel}>SĐT:</span>
                        <span className={styles.contactValue}>{phone}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <Mail size={14} />
                        <span className={styles.contactLabel}>Email:</span>
                        <span className={styles.contactValue}>{email}</span>
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
                      <div className={styles.resultRow}>
                        {point.category === 'hotspot' ? (
                          <X size={14} style={{ color: '#dc2626' }} />
                        ) : (
                          <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        )}
                        <span>Vệ sinh cơ sở</span>
                        <span className={styles.resultBadge} style={{
                          background: point.category === 'hotspot' ? '#fee2e2' : '#dcfce7',
                          color: point.category === 'hotspot' ? '#991b1b' : '#166534'
                        }}>
                          {point.category === 'hotspot' ? 'Chưa đạt' : 'Đạt'}
                        </span>
                      </div>
                      <div className={styles.resultRow}>
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <span>Giấy phép KD</span>
                        <span className={styles.resultBadge} style={{
                          background: '#dcfce7',
                          color: '#166534'
                        }}>
                          Hợp lệ
                        </span>
                      </div>
                      <div className={styles.resultRow}>
                        {violationCount > 0 ? (
                          <AlertCircle size={14} style={{ color: '#eab308' }} />
                        ) : (
                          <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        )}
                        <span>An toàn thực phẩm</span>
                        <span className={styles.resultBadge} style={{
                          background: violationCount > 0 ? '#fef3c7' : '#dcfce7',
                          color: violationCount > 0 ? '#92400e' : '#166534'
                        }}>
                          {violationCount > 0 ? 'Cảnh báo' : 'Tốt'}
                        </span>
                      </div>
                      <div className={styles.resultRow}>
                        <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                        <span>Đào tạo NV</span>
                        <span className={styles.resultBadge} style={{
                          background: '#dcfce7',
                          color: '#166534'
                        }}>
                          Đầy đủ
                        </span>
                      </div>
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
                      <div className={styles.timelineItem}>
                        <div className={styles.timelineDot} style={{ background: '#22c55e' }} />
                        <div className={styles.timelineContent}>
                          <div className={styles.timelineTitle}>Kiểm tra gần nhất</div>
                          <div className={styles.timelineDate}>
                            {lastInspection.toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <div className={styles.timelineMeta}>
                            Chi cục QLTT {point.district}
                          </div>
                          <div className={styles.timelineResult}>
                            KQ: <strong>{point.category === 'hotspot' ? 'Không đạt' : 'Đạt yêu cầu'}</strong>
                          </div>
                        </div>
                      </div>

                      {nextInspection && (
                        <div className={styles.timelineItem}>
                          <div className={styles.timelineDot} style={{ background: '#eab308' }} />
                          <div className={styles.timelineContent}>
                            <div className={styles.timelineTitle}>Kiểm tra tiếp theo</div>
                            <div className={styles.timelineDate}>
                              {nextInspection.toLocaleDateString('vi-VN', {
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
                            {establishedDate.toLocaleDateString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
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
                      {/* ATTP Certificate */}
                      <div className={styles.certItem}>
                        <div className={styles.certItemHeader}>
                          <div className={styles.certIconSmall} style={{ background: '#dcfce7', color: '#16a34a' }}>
                            <FileCheck size={14} />
                          </div>
                          <div>
                            <div className={styles.certTitleSmall}>Chứng nhận ATTP</div>
                            <div className={styles.certNumber}>{attpCertificateNumber || `CN-ATTP ${Math.floor(1000 + (point?.id?.charCodeAt(0) || 0) % 9000)}/${new Date().getFullYear()}`}</div>
                          </div>
                          <span className={styles.certStatusBadge} style={{ background: '#dcfce7', color: '#166534' }}>
                            Còn hiệu lực
                          </span>
                        </div>
                        <div className={styles.certMeta}>
                          Cấp bởi: Sở Y tế {point.province} • 
                          Cấp: {establishedDate.toLocaleDateString('vi-VN')} • 
                          HH: {new Date(establishedDate.getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      {/* Business License */}
                      <div className={styles.certItem}>
                        <div className={styles.certItemHeader}>
                          <div className={styles.certIconSmall} style={{ background: '#dbeafe', color: '#005cb6' }}>
                            <FileCheck size={14} />
                          </div>
                          <div>
                            <div className={styles.certTitleSmall}>Giấy phép KD</div>
                            <div className={styles.certNumber}>{businessLicense}</div>
                          </div>
                          <span className={styles.certStatusBadge} style={{ background: '#dbeafe', color: '#1e40af' }}>
                            Còn hiệu lực
                          </span>
                        </div>
                        <div className={styles.certMeta}>
                          Cấp bởi: Phòng ĐKKD {point.district} • Loại hình: {point.type}
                        </div>
                      </div>

                      {/* Training Certificate - only for certified */}
                      {point.category === 'certified' && (
                        <div className={styles.certItem}>
                          <div className={styles.certItemHeader}>
                            <div className={styles.certIconSmall} style={{ background: '#fef3c7', color: '#ca8a04' }}>
                              <Award size={14} />
                            </div>
                            <div>
                              <div className={styles.certTitleSmall}>Chứng chỉ đào tạo VSATTP</div>
                              <div className={styles.certNumber}>DT-ATTP {Math.floor(Math.random() * 9000 + 1000)}</div>
                            </div>
                            <span className={styles.certStatusBadge} style={{ background: '#fef3c7', color: '#92400e' }}>
                              Còn hiệu lực
                            </span>
                          </div>
                          <div className={styles.certMeta}>
                            Cấp bởi: TTYT dự phòng {point.province} • {employees} nhân viên đã đào tạo
                          </div>
                        </div>
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
                      <div className={styles.legalItemCompact}>
                        <BookOpen size={14} />
                        <div>
                          <div className={styles.legalTitleCompact}>Luật An toàn thực phẩm 2010</div>
                          <div className={styles.legalMetaCompact}>55/2010/QH12 • Hiệu lực: 01/07/2011</div>
                        </div>
                      </div>
                      <div className={styles.legalItemCompact}>
                        <BookOpen size={14} />
                        <div>
                          <div className={styles.legalTitleCompact}>Nghị định 15/2018/NĐ-CP</div>
                          <div className={styles.legalMetaCompact}>Quy định chi tiết Luật ATTP</div>
                        </div>
                      </div>
                      <div className={styles.legalItemCompact}>
                        <BookOpen size={14} />
                        <div>
                          <div className={styles.legalTitleCompact}>Thông tư 16/2019/TT-BYT</div>
                          <div className={styles.legalMetaCompact}>Điều kiện ATTP cơ sở KD thực phẩm</div>
                        </div>
                      </div>
                      <div className={styles.legalItemCompact}>
                        <BookOpen size={14} />
                        <div>
                          <div className={styles.legalTitleCompact}>Thông tư 19/2013/TT-BYT</div>
                          <div className={styles.legalMetaCompact}>Chương trình đào tạo ATTP</div>
                        </div>
                      </div>
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