import React, { useEffect, useState, useMemo } from 'react';
import { X, Building2, MapPin, Users, FileText, AlertCircle, DollarSign, MessageSquare, GraduationCap, Calendar, BarChart3, Phone, Mail, Target, Shield } from 'lucide-react';
import { fetchDepartmentById } from '../../../utils/api/departmentsApi';
import { DepartmentAreasResponse } from '../../../utils/api/departmentAreasApi';
import { fetchDepartmentAreas } from '../../../utils/api/departmentAreasApi';

interface DepartmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  departmentData?: any; // Optional initial data from map
}

// Helper function to generate deterministic fake data based on departmentId
function generateFakeData(departmentId: string) {
  // Use departmentId as seed for consistent fake data
  const seed = departmentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Vietnamese names
  const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đỗ', 'Bùi', 'Đặng', 'Ngô', 'Cao', 'Trịnh', 'Đinh', 'Phan', 'Mai'];
  const firstNames = ['Văn', 'Thị', 'Minh', 'Hải', 'Lan', 'Anh', 'Tuấn', 'Hương', 'Đức', 'Mai', 'Long', 'Hoa', 'Nam', 'Thu', 'Phương'];
  const middleNames = ['Văn', 'Thị', 'Đức', 'Minh', 'Quang', 'Thị', 'Văn', 'Thị', 'Đức', 'Minh'];
  
  // Generate officer names
  const numOfficers = 3 + (seed % 3); // 3-5 officers
  const officers = [];
  for (let i = 0; i < numOfficers; i++) {
    const nameSeed = (seed + i * 7) % 1000;
    const lastName = lastNames[nameSeed % lastNames.length];
    const firstName = firstNames[(nameSeed * 3) % firstNames.length];
    const middleName = middleNames[(nameSeed * 2) % middleNames.length];
    const fullName = `${lastName} ${middleName} ${firstName}`;
    
    // Generate phone
    const phonePrefixes = ['091', '092', '093', '094', '095', '096', '097', '098', '099'];
    const phonePrefix = phonePrefixes[(nameSeed * 5) % phonePrefixes.length];
    const phoneNumber = Math.floor(1000000 + (nameSeed * 123) % 9000000);
    const phone = `${phonePrefix}${phoneNumber}`;
    
    // Generate email
    const nameParts = fullName.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .split(' ')
      .filter(p => p.length > 0);
    const lastNamePart = nameParts[nameParts.length - 1];
    const firstNamePart = nameParts[0];
    const email = `${lastNamePart}${firstNamePart.charAt(0)}${i + 1}@qltt.hanoi.gov.vn`;
    
    // Generate criteria
    const baseInspections = 100 + (nameSeed % 100);
    const violationsRate = 0.2 + (nameSeed % 20) / 100; // 20-40%
    const finesRate = 0.7 + (nameSeed % 20) / 100; // 70-90%
    
    officers.push({
      id: `OFF${String(i + 1).padStart(4, '0')}`,
      fullName,
      position: i === 0 ? 'Đội trưởng' : 'Cán bộ',
      phone,
      email,
      isTeamLeader: i === 0,
      criteria: {
        totalInspections: baseInspections,
        violationsCaught: Math.floor(baseInspections * violationsRate),
        finesIssued: Math.floor(baseInspections * violationsRate * finesRate),
        totalFineAmount: Math.floor(100000000 + (nameSeed * 1000000) % 400000000),
        complaintsResolved: Math.floor(10 + (nameSeed % 20)),
        educationSessions: Math.floor(5 + (nameSeed % 10)),
      },
      yearsOfService: 3 + (nameSeed % 17),
      specialization: [
        'An toàn thực phẩm',
        'Hàng giả hàng nhái',
        'Hàng hóa kém chất lượng',
        'Nhãn mác hàng hóa',
      ].slice(0, 2 + (nameSeed % 3)),
    });
  }
  
  // Generate department statistics
  const totalInspections = officers.reduce((sum, o) => sum + o.criteria.totalInspections, 0);
  const totalViolations = officers.reduce((sum, o) => sum + o.criteria.violationsCaught, 0);
  const totalFines = officers.reduce((sum, o) => sum + o.criteria.finesIssued, 0);
  const totalFineAmount = officers.reduce((sum, o) => sum + o.criteria.totalFineAmount, 0);
  const totalComplaints = officers.reduce((sum, o) => sum + o.criteria.complaintsResolved, 0);
  const totalEducation = officers.reduce((sum, o) => sum + o.criteria.educationSessions, 0);
  
  return {
    officers,
    statistics: {
      totalInspections,
      totalViolations,
      totalFines,
      totalFineAmount,
      totalComplaints,
      totalEducation,
      successRate: totalInspections > 0 ? ((totalViolations / totalInspections) * 100).toFixed(1) : '0',
      resolutionRate: totalViolations > 0 ? ((totalFines / totalViolations) * 100).toFixed(1) : '0',
    },
    contact: {
      phone: `024${Math.floor(3000000 + (seed % 1000000))}`,
      email: `dept${seed % 100}@qltt.hanoi.gov.vn`,
      address: `Số ${10 + (seed % 90)}, Phố ${['Hàng', 'Lý Thường Kiệt', 'Trần Phú', 'Nguyễn Trãi', 'Lê Duẩn'][seed % 5]}, Quận ${['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Hai Bà Trưng', 'Cầu Giấy'][seed % 5]}, Hà Nội`,
    },
  };
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
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={handleBackdropClick}
      />

      {/* Modal - Compact Layout */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'var(--card)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '95%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          zIndex: 9999,
          animation: 'slideUpFade 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
        }}
        onClick={handleModalClick}
      >
        {/* Compact Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, #003d82 100%)',
          padding: 'var(--spacing-5)',
          position: 'relative',
        }}>
          {/* Close Button - Fixed */}
          <button
            type="button"
            onClick={handleCloseClick}
            style={{
              position: 'absolute',
              top: 'var(--spacing-3)',
              right: 'var(--spacing-3)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'white',
              zIndex: 10,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg) scale(1)';
            }}
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            {/* Smaller Avatar */}
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              flexShrink: 0,
            }}>
              <Building2 size={35} color="white" strokeWidth={1.5} />
            </div>

            {/* Department Info - Inline */}
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'white',
                marginBottom: 'var(--spacing-1)',
              }}>
                {isLoading ? 'Đang tải...' : (department?.name || 'Phòng ban')}
              </h2>
              
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 'var(--spacing-1)',
              }}>
                {department?.parent_id ? 'Phòng ban trực thuộc' : 'Phòng ban chính'}
              </div>
              
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
              }}>
                <MapPin size={12} />
                {totalAreas} khu vực phụ trách • {totalOfficers} cán bộ
              </div>
            </div>

            {/* Quick Stats - Inline */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              flexShrink: 0,
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'white' }}>
                  {totalAreas}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
                  Khu vực
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'white' }}>
                  {totalOfficers}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
                  Cán bộ
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content - Compact & Scrollable */}
        <div style={{ 
          flex: 1, 
          overflow: 'auto',
          padding: 'var(--spacing-5)',
        }}>
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-text-muted)' }}>
              Đang tải dữ liệu...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-8)', color: 'var(--color-error)' }}>
              {error}
            </div>
          ) : (
            <>
              {/* Department Info - Side by Side */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-4)',
                marginBottom: 'var(--spacing-5)',
              }}>
                {/* Department Details - Compact */}
                <div>
                  <h3 style={{
                    margin: '0 0 var(--spacing-3) 0',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                  }}>
                    <Building2 size={16} color="var(--color-primary)" />
                    Thông tin
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                    }}>
                      <FileText size={16} color="var(--color-primary)" />
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>ID: {departmentId.substring(0, 8)}...</span>
                    </div>

                    {department?.name && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-2)',
                        padding: 'var(--spacing-2)',
                        background: 'var(--color-background-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                      }}>
                        <Building2 size={16} color="var(--color-primary)" />
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{department.name}</span>
                      </div>
                    )}
                    
                    {/* Contact Info - Fake if not available */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-sm)',
                    }}>
                      <Phone size={16} color="var(--color-primary)" />
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{fakeData.contact.phone}</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-xs)',
                    }}>
                      <Mail size={16} color="var(--color-primary)" />
                      <span style={{ 
                        fontWeight: 'var(--font-weight-medium)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {fakeData.contact.email}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-xs)',
                    }}>
                      <MapPin size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{fakeData.contact.address}</span>
                    </div>
                  </div>
                </div>

                {/* Managed Areas - Compact */}
                <div>
                  <h3 style={{
                    margin: '0 0 var(--spacing-3) 0',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                  }}>
                    <MapPin size={16} color="var(--color-primary)" />
                    Địa bàn
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-2)',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                    }}>
                      <MapPin size={14} color="var(--color-primary)" />
                      {totalAreas} khu vực phụ trách
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--color-background-muted)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                    }}>
                      <Users size={14} color="var(--color-primary)" />
                      {totalOfficers} cán bộ phụ trách
                    </div>
                  </div>
                </div>
              </div>

              {/* Officers List */}
              {displayOfficers.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-5)' }}>
                  <h3 style={{
                    margin: '0 0 var(--spacing-3) 0',
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                  }}>
                    <Users size={16} color="var(--color-primary)" />
                    Danh sách cán bộ ({displayOfficers.length} người)
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-2)',
                    maxHeight: '300px',
                    overflow: 'auto',
                  }}>
                    {displayOfficers.map((officer, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 'var(--spacing-2)',
                        padding: 'var(--spacing-3)',
                        background: 'var(--color-background-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--font-size-sm)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flex: 1 }}>
                          <Shield size={14} color="var(--color-primary)" />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text)', marginBottom: '2px' }}>
                              {officer.name}
                            </div>
                            {officer.details && (
                              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                                <span>{officer.details.position}</span>
                                <span>•</span>
                                <span>{officer.details.phone}</span>
                                <span>•</span>
                                <span>{officer.details.yearsOfService} năm kinh nghiệm</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {officer.details && (
                          <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-2)',
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--color-text-muted)',
                          }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-primary)' }}>
                                {officer.details.criteria.totalInspections}
                              </div>
                              <div>Kiểm tra</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 'var(--font-weight-semibold)', color: '#ef4444' }}>
                                {officer.details.criteria.violationsCaught}
                              </div>
                              <div>Vi phạm</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Performance Metrics - Compact Grid */}
              <div>
                <h3 style={{
                  margin: '0 0 var(--spacing-3) 0',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                }}>
                  <BarChart3 size={16} color="var(--color-primary)" />
                  {hasRealStats ? 'Thống kê địa bàn' : 'Kết quả công tác năm 2024'}
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: hasRealStats ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
                  gap: 'var(--spacing-3)',
                }}>
                  {/* Metric Card 1 - Total Areas or Inspections */}
                  <div style={{
                    padding: 'var(--spacing-3)',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #93c5fd',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      background: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--spacing-2)',
                    }}>
                      {hasRealStats ? <MapPin size={16} color="white" strokeWidth={2.5} /> : <FileText size={16} color="white" strokeWidth={2.5} />}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#1e3a8a',
                      marginBottom: 'var(--spacing-1)',
                    }}>
                      {hasRealStats ? totalAreas : (stats?.totalInspections || 0)}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: '#1e40af',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {hasRealStats ? 'Tổng khu vực' : 'Lần kiểm tra'}
                    </div>
                  </div>

                  {/* Metric Card 2 - Areas with Coordinates or Violations */}
                  <div style={{
                    padding: 'var(--spacing-3)',
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #fca5a5',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      background: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--spacing-2)',
                    }}>
                      {hasRealStats ? <MapPin size={16} color="white" strokeWidth={2.5} /> : <AlertCircle size={16} color="white" strokeWidth={2.5} />}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: '#991b1b',
                      marginBottom: 'var(--spacing-1)',
                    }}>
                      {hasRealStats ? areasWithCoordinates : (stats?.totalViolations || 0)}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: '#b91c1c',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {hasRealStats ? 'Có tọa độ' : 'Vi phạm'}
                    </div>
                  </div>

                  {/* Metric Card 3 - Officers or Fines */}
                  <div style={{
                    padding: 'var(--spacing-3)',
                    background: hasRealStats 
                      ? 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)'
                      : 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                    borderRadius: 'var(--radius-md)',
                    border: hasRealStats ? '1px solid #d8b4fe' : '1px solid #fde047',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-md)',
                      background: hasRealStats ? '#a855f7' : '#eab308',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--spacing-2)',
                    }}>
                      {hasRealStats ? <Users size={16} color="white" strokeWidth={2.5} /> : <FileText size={16} color="white" strokeWidth={2.5} />}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: hasRealStats ? '#581c87' : '#854d0e',
                      marginBottom: 'var(--spacing-1)',
                    }}>
                      {hasRealStats ? totalOfficers : (stats?.totalFines || 0)}
                    </div>
                    <div style={{
                      fontSize: 'var(--font-size-xs)',
                      color: hasRealStats ? '#7e22ce' : '#a16207',
                      fontWeight: 'var(--font-weight-medium)',
                    }}>
                      {hasRealStats ? 'Cán bộ' : 'Xử phạt'}
                    </div>
                  </div>
                  
                  {/* Additional fake stats cards */}
                  {!hasRealStats && stats && (
                    <>
                      {/* Metric Card 4 - Fine Amount */}
                      <div style={{
                        padding: 'var(--spacing-3)',
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #86efac',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          background: '#22c55e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--spacing-2)',
                        }}>
                          <DollarSign size={16} color="white" strokeWidth={2.5} />
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-lg)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: '#14532d',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          {(stats.totalFineAmount / 1000000).toFixed(0)}M
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: '#15803d',
                          fontWeight: 'var(--font-weight-medium)',
                        }}>
                          Tiền phạt (VNĐ)
                        </div>
                      </div>

                      {/* Metric Card 5 - Complaints */}
                      <div style={{
                        padding: 'var(--spacing-3)',
                        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #d8b4fe',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          background: '#a855f7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--spacing-2)',
                        }}>
                          <MessageSquare size={16} color="white" strokeWidth={2.5} />
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-2xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: '#581c87',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          {stats.totalComplaints}
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: '#7e22ce',
                          fontWeight: 'var(--font-weight-medium)',
                        }}>
                          Khiếu nại
                        </div>
                      </div>

                      {/* Metric Card 6 - Education */}
                      <div style={{
                        padding: 'var(--spacing-3)',
                        background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #fdba74',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-md)',
                          background: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto var(--spacing-2)',
                        }}>
                          <GraduationCap size={16} color="white" strokeWidth={2.5} />
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-2xl)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: '#7c2d12',
                          marginBottom: 'var(--spacing-1)',
                        }}>
                          {stats.totalEducation}
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: '#c2410c',
                          fontWeight: 'var(--font-weight-medium)',
                        }}>
                          Tuyên truyền
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes slideUpFade {
              from {
                opacity: 0;
                transform: translate(-50%, -45%);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%);
              }
            }
          `}
        </style>
      </div>
    </>
  );
}
