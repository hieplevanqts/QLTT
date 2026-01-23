import React, { useEffect, useState, useMemo } from 'react';
import { X, Building2, MapPin, Users, FileText, AlertCircle, DollarSign, MessageSquare, GraduationCap, BarChart3, Phone, Mail } from 'lucide-react';
import { fetchDepartmentById } from '../../../utils/api/departmentsApi';
import { DepartmentAreasResponse } from '../../../utils/api/departmentAreasApi';
import { fetchDepartmentAreas } from '../../../utils/api/departmentAreasApi';
import { generateFakeData } from './utils/departmentDetailUtils';
import { DepartmentMetricCard } from './components/DepartmentMetricCard';
import { DepartmentOfficerItem } from './components/DepartmentOfficerItem';
import styles from './DepartmentDetailModal.module.css';

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentData?: any; // Optional initial data from map
}

export function DepartmentDetailModal({ isOpen, onClose, departmentId, departmentData }: DepartmentDetailModalProps) {
  const [department, setDepartment] = useState<any>(null);
  const [areas, setAreas] = useState<DepartmentAreasResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !departmentId) return;

    async function loadDepartmentData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch department details
        const dept = await fetchDepartmentById(departmentId);
        setDepartment(dept);

        // Fetch department areas
        const areasData = await fetchDepartmentAreas(departmentId);
        setAreas(areasData);
      } catch (err: any) {
        console.error('❌ Error loading department data:', err);
        setError(err?.message || 'Không thể tải dữ liệu phòng ban');
      } finally {
        setIsLoading(false);
      }
    }

    loadDepartmentData();
  }, [isOpen, departmentId]);

  // Use initial data if available
  useEffect(() => {
    if (departmentData && !department) {
      setDepartment({ name: departmentData.departmentId, _id: departmentId });
      if (departmentData.areas) {
        setAreas({ areas: departmentData.areas.map((a: any) => ({
          province_id: a.provinceId,
          ward_id: a.wardId,
          wards_with_coordinates: a.coordinates ? {
            center_lat: a.coordinates.center?.[0] || null,
            center_lng: a.coordinates.center?.[1] || null,
            bounds: a.coordinates.bounds || null,
            area: a.coordinates.area || null,
            officer: a.coordinates.officer || null,
          } : null
        })) });
      }
    }
  }, [departmentData, department, departmentId]);

  // Generate fake data if needed - MUST be before early return
  const fakeData = useMemo(() => generateFakeData(departmentId), [departmentId]);

  if (!isOpen) return null;
  
  // Calculate statistics from real data
  const totalAreas = areas?.areas?.length || 0;
  const areasWithCoordinates = areas?.areas?.filter(a => a.wards_with_coordinates?.center_lat && a.wards_with_coordinates?.center_lng).length || 0;
  const realOfficers = areas?.areas
    ?.map(a => a.wards_with_coordinates?.officer)
    .filter((o): o is string => o !== null && o !== undefined && o !== '') || [];
  const uniqueRealOfficers = Array.from(new Set(realOfficers));
  
  // Use fake officers if real data is insufficient
  const displayOfficers = uniqueRealOfficers.length > 0 
    ? uniqueRealOfficers.map(name => ({ name, isReal: true }))
    : fakeData.officers.map(o => ({ name: o.fullName, isReal: false, details: o }));
  const totalOfficers = displayOfficers.length;
  
  // Use fake statistics if real data is insufficient
  const hasRealStats = totalAreas > 0 || uniqueRealOfficers.length > 0;
  const stats = hasRealStats ? null : fakeData.statistics;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  // Handle modal content click - prevent closing
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle close button click
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleBackdropClick} />

      {/* Modal - Compact Layout */}
      <div className={styles.modal} onClick={handleModalClick}>
        {/* Compact Header */}
        <div className={styles.header}>
          {/* Close Button - Fixed */}
          <button
            type="button"
            onClick={handleCloseClick}
            className={styles.closeButton}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div className={styles.headerContent}>
            {/* Smaller Avatar */}
            <div className={styles.avatar}>
              <Building2 size={35} color="white" strokeWidth={1.5} />
            </div>

            {/* Department Info - Inline */}
            <div className={styles.departmentInfo}>
              <h2 className={styles.departmentTitle}>
                {isLoading ? 'Đang tải...' : (department?.name || 'Phòng ban')}
              </h2>
              
              <div className={styles.departmentSubtitle}>
                {department?.parent_id ? 'Phòng ban trực thuộc' : 'Phòng ban chính'}
              </div>
              
              <div className={styles.departmentMeta}>
                <MapPin size={12} />
                {totalAreas} khu vực phụ trách • {totalOfficers} cán bộ
              </div>
            </div>

            {/* Quick Stats - Inline */}
            <div className={styles.quickStats}>
              <div className={styles.statBadge}>
                <div className={styles.statValue}>
                  {totalAreas}
                </div>
                <div className={styles.statLabel}>
                  Khu vực
                </div>
              </div>
              
              <div className={styles.statBadge}>
                <div className={styles.statValue}>
                  {totalOfficers}
                </div>
                <div className={styles.statLabel}>
                  Cán bộ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Compact & Scrollable */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingState}>
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              {error}
            </div>
          ) : (
            <>
              {/* Department Info - Side by Side */}
              <div className={styles.infoGrid}>
                {/* Department Details - Compact */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <Building2 size={16} color="var(--color-primary)" />
                    Thông tin
                  </h3>
                  
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <FileText size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>ID: {departmentId.substring(0, 8)}...</span>
                    </div>

                    {department?.name && (
                      <div className={styles.infoItem}>
                        <Building2 size={16} color="var(--color-primary)" />
                        <span className={styles.infoItemText}>{department.name}</span>
                      </div>
                    )}
                    
                    {/* Contact Info - Fake if not available */}
                    <div className={styles.infoItem}>
                      <Phone size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{fakeData.contact.phone}</span>
                    </div>
                    
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <Mail size={16} color="var(--color-primary)" />
                      <span className={styles.infoItemTextEllipsis}>
                        {fakeData.contact.email}
                      </span>
                    </div>
                    
                    <div className={styles.infoItemAddress}>
                      <MapPin size={16} color="var(--color-primary)" className={styles.infoItemAddressIcon} />
                      <span className={styles.infoItemText}>{fakeData.contact.address}</span>
                    </div>
                  </div>
                </div>

                {/* Managed Areas - Compact */}
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>
                    <MapPin size={16} color="var(--color-primary)" />
                    Địa bàn
                  </h3>
                  
                  <div className={styles.infoList}>
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <MapPin size={14} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{totalAreas} khu vực phụ trách</span>
                    </div>
                    <div className={`${styles.infoItem} ${styles.infoItemSmall}`}>
                      <Users size={14} color="var(--color-primary)" />
                      <span className={styles.infoItemText}>{totalOfficers} cán bộ phụ trách</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Officers List */}
              {displayOfficers.length > 0 && (
                <div className={styles.officersSection}>
                  <h3 className={styles.sectionTitle}>
                    <Users size={16} color="var(--color-primary)" />
                    Danh sách cán bộ ({displayOfficers.length} người)
                  </h3>
                  
                  <div className={styles.officersList}>
                    {displayOfficers.map((officer, index) => (
                      <DepartmentOfficerItem
                        key={index}
                        name={officer.name}
                        details={officer.details}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics - Compact Grid */}
              <div>
                <h3 className={styles.sectionTitle}>
                  <BarChart3 size={16} color="var(--color-primary)" />
                  {hasRealStats ? 'Thống kê địa bàn' : 'Kết quả công tác năm 2024'}
                </h3>

                <div className={styles.metricsGrid}>
                  {/* Metric Card 1 - Total Areas or Inspections */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? MapPin : FileText}
                    value={hasRealStats ? totalAreas : (stats?.totalInspections || 0)}
                    label={hasRealStats ? 'Tổng khu vực' : 'Lần kiểm tra'}
                    variant="blue"
                  />

                  {/* Metric Card 2 - Areas with Coordinates or Violations */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? MapPin : AlertCircle}
                    value={hasRealStats ? areasWithCoordinates : (stats?.totalViolations || 0)}
                    label={hasRealStats ? 'Có tọa độ' : 'Vi phạm'}
                    variant="red"
                  />

                  {/* Metric Card 3 - Officers or Fines */}
                  <DepartmentMetricCard
                    icon={hasRealStats ? Users : FileText}
                    value={hasRealStats ? totalOfficers : (stats?.totalFines || 0)}
                    label={hasRealStats ? 'Cán bộ' : 'Xử phạt'}
                    variant={hasRealStats ? 'purple' : 'yellow'}
                  />
                  
                  {/* Additional fake stats cards */}
                  {!hasRealStats && stats && (
                    <>
                      {/* Metric Card 4 - Fine Amount */}
                      <DepartmentMetricCard
                        icon={DollarSign}
                        value={`${(stats.totalFineAmount / 1000000).toFixed(0)}M`}
                        label="Tiền phạt (VNĐ)"
                        variant="green"
                        valueSize="large"
                      />

                      {/* Metric Card 5 - Complaints */}
                      <DepartmentMetricCard
                        icon={MessageSquare}
                        value={stats.totalComplaints}
                        label="Khiếu nại"
                        variant="purple"
                      />

                      {/* Metric Card 6 - Education */}
                      <DepartmentMetricCard
                        icon={GraduationCap}
                        value={stats.totalEducation}
                        label="Tuyên truyền"
                        variant="orange"
                      />
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
