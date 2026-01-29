import React from 'react';
import { X, Phone, Mail, User, AlertCircle, FileText, DollarSign, MessageSquare, GraduationCap, MapPin, Briefcase, Target, Shield, Calendar, BarChart3 } from 'lucide-react';
import { Officer } from '../../../data/officerTeamData';

interface OfficerInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  officer: Officer | null;
  wardName: string;
}

export function OfficerInfoModal({ isOpen, onClose, officer, wardName }: OfficerInfoModalProps) {
  if (!isOpen || !officer) return null;

  // Calculate success rate
  const successRate = officer.criteria.totalInspections > 0 
    ? ((officer.criteria.violationsCaught / officer.criteria.totalInspections) * 100).toFixed(1)
    : '0';
  
  const resolutionRate = officer.criteria.finesIssued > 0
    ? ((officer.criteria.finesIssued / officer.criteria.violationsCaught) * 100).toFixed(1)
    : '0';

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
              <User size={35} color="white" strokeWidth={1.5} />
            </div>

            {/* Officer Info - Inline */}
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: 0,
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'white',
                marginBottom: 'var(--spacing-1)',
              }}>
                {officer.fullName}
              </h2>
              
              <div style={{
                fontSize: 'var(--font-size-sm)',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: 'var(--spacing-1)',
              }}>
                {officer.position}
              </div>
              
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: 'rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-1)',
              }}>
                <MapPin size={12} />
                {wardName} • Quận {officer.district} • {officer.yearsOfService} năm kinh nghiệm
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
                  {successRate}%
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
                  Phát hiện
                </div>
              </div>
              
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-2) var(--spacing-3)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'white' }}>
                  {resolutionRate}%
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.8)' }}>
                  Xử phạt
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
          {/* Contact & Specialization - Side by Side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-5)',
          }}>
            {/* Contact Info - Compact */}
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
                <Phone size={16} color="var(--color-primary)" />
                Liên hệ
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
                  <Phone size={16} color="var(--color-primary)" />
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{officer.phone}</span>
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
                    {officer.email}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-2)',
                  padding: 'var(--spacing-2)',
                  background: 'var(--color-background-muted)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                }}>
                  <Calendar size={16} color="var(--color-primary)" />
                  <span style={{ fontWeight: 'var(--font-weight-medium)' }}>Mã: {officer.id}</span>
                </div>
              </div>
            </div>

            {/* Specialization - Compact */}
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
                <Target size={16} color="var(--color-primary)" />
                Chuyên môn
              </h3>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-2)',
              }}>
                {officer.specialization.map((spec, index) => (
                  <div key={index} style={{
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
                    <Shield size={14} color="var(--color-primary)" />
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>

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
              Kết quả công tác năm 2024
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--spacing-3)',
            }}>
              {/* Metric Card 1 */}
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
                  <FileText size={16} color="white" strokeWidth={2.5} />
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#1e3a8a',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  {officer.criteria.totalInspections}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#1e40af',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Lần kiểm tra
                </div>
              </div>

              {/* Metric Card 2 */}
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
                  <AlertCircle size={16} color="white" strokeWidth={2.5} />
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#991b1b',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  {officer.criteria.violationsCaught}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#b91c1c',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Vi phạm
                </div>
              </div>

              {/* Metric Card 3 */}
              <div style={{
                padding: 'var(--spacing-3)',
                background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #fde047',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: '#eab308',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-2)',
                }}>
                  <FileText size={16} color="white" strokeWidth={2.5} />
                </div>
                <div style={{
                  fontSize: 'var(--font-size-2xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: '#854d0e',
                  marginBottom: 'var(--spacing-1)',
                }}>
                  {officer.criteria.finesIssued}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#a16207',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Xử phạt
                </div>
              </div>

              {/* Metric Card 4 */}
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
                  {(officer.criteria.totalFineAmount / 1000000).toFixed(0)}M
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#15803d',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Tiền phạt (VNĐ)
                </div>
              </div>

              {/* Metric Card 5 */}
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
                  {officer.criteria.complaintsResolved}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#7e22ce',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Khiếu nại
                </div>
              </div>

              {/* Metric Card 6 */}
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
                  {officer.criteria.educationSessions}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: '#c2410c',
                  fontWeight: 'var(--font-weight-medium)',
                }}>
                  Tuyên truyền
                </div>
              </div>
            </div>
          </div>
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
