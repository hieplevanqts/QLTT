import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Eye,
  FileText,
  Link as LinkIcon,
  Clock,
  ShieldCheck,
  Download,
  Share2,
  MoreVertical,
  Lock,
  Edit,
  Hash,
  MapPin,
  Calendar,
  User,
  HardDrive,
  Tag,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Maximize,
  Image as ImageIcon,
  Video as VideoIcon,
  Upload,
  FileCheck,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import PageHeader from '../../../layouts/PageHeader';
import { toast } from 'sonner';
import type { EvidenceItem, CustodyEvent } from '../../types/evidence.types';
import { getStatusLabel, getStatusColor, getTypeLabel } from '../../types/evidence.types';

export default function EvidenceDetailPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'viewer' | 'metadata' | 'links' | 'custody' | 'review'>('overview');

  // Mock data
  const evidenceData = {
    id: evidenceId || 'EVD-2026-1252',
    fileName: 'anh_vi_pham_ve_sinh.jpg',
    type: 'image' as const,
    status: 'Approved' as const,
    sensitivityLabel: 'Restricted' as const,
    hash_algorithms: ['SHA-256', 'SHA-512', 'MD5'],
    hash_values: {
      sha256: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      sha512: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9',
      md5: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    hash_computed_at: '10/01/2026 09:30:20',
    computed_by: 'System',
    integrityStatus: 'verified' as const,
    location: 'Quận 1, TP.HCM',
    capturedAt: '10/01/2026 09:00',
    uploadedAt: '10/01/2026 09:30',
    submitter: 'Nguyễn Văn A',
    source: 'Mobile App',
    deviceInfo: 'iPhone 14 Pro - iOS 17.2',
    notes: 'Vi phạm vệ sinh tại bếp chế biến, phát hiện côn trùng trong khu vực lưu trữ thực phẩm',
    linkedEntities: [
      { type: 'lead' as const, id: 'CASE-2026-048', name: 'Vi phạm ATTP tại Quận 1' },
      { type: 'task' as const, id: 'TASK-2026-091', name: 'Thanh tra cơ sở kinh doanh thực phẩm' }
    ],
    size: '2.4 MB'
  };

  const custodyEvents = [
    {
      id: '1',
      eventType: 'Upload' as const,
      actor: 'Nguyễn Văn A',
      timestamp: '10/01/2026 09:30:15',
      action: 'Tải lên chứng cứ từ Mobile App',
      ipAddress: '113.161.xxx.xxx',
      device: 'iPhone 14 Pro'
    },
    {
      id: '2',
      eventType: 'View' as const,
      actor: 'Trần Thị B',
      timestamp: '10/01/2026 10:15:42',
      action: 'Xem chi tiết chứng cứ',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11'
    },
    {
      id: '3',
      eventType: 'Review' as const,
      actor: 'Lê Văn C (Reviewer)',
      timestamp: '10/01/2026 11:20:33',
      action: 'Bắt đầu xét duyệt',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11'
    },
    {
      id: '4',
      eventType: 'Edit' as const,
      actor: 'Lê Văn C',
      timestamp: '10/01/2026 11:22:10',
      action: 'Cập nhật metadata - Thêm nhãn bảo mật: Confidential',
      ipAddress: '14.231.xxx.xxx',
      device: 'Chrome - Windows 11'
    },
  ];

  const getSensitivityBadge = (label: string) => {
    const labelConfig: Record<string, { label: string; color: string; bg: string }> = {
      Public: { label: 'Công khai', color: '#22c55e', bg: '#22c55e15' },
      Internal: { label: 'Nội bộ', color: '#f59e0b', bg: '#f59e0b15' },
      Restricted: { label: 'Hạn chế', color: '#ef4444', bg: '#ef444415' },
      'Secret-lite': { label: 'Bảo mật', color: '#991b1b', bg: '#991b1b15' }
    };
    const config = labelConfig[label] || labelConfig.Internal;
    return (
      <Badge variant="outline" style={{ borderColor: config.color, color: config.color, background: config.bg }}>
        <ShieldCheck size={12} />
        {config.label}
      </Badge>
    );
  };

  const getEventIcon = (eventType: string) => {
    const icons: Record<string, React.ReactNode> = {
      Upload: <Upload size={16} />,
      Submit: <Upload size={16} />,
      View: <Eye size={16} />,
      Edit: <Edit size={16} />,
      Review: <ShieldCheck size={16} />,
      Approve: <CheckCircle size={16} />,
      Reject: <AlertCircle size={16} />,
      Download: <Download size={16} />,
      Export: <Download size={16} />,
      Seal: <Lock size={16} />,
      Unseal: <Lock size={16} />,
      Archive: <HardDrive size={16} />,
    };
    return icons[eventType] || <Clock size={16} />;
  };

  const getEventColor = (eventType: string) => {
    const colors: Record<string, string> = {
      Upload: '#005cb6',
      Submit: '#005cb6',
      Approve: '#22c55e',
      Reject: '#ef4444',
      Seal: '#8b5cf6',
      Unseal: '#8b5cf6',
      Archive: '#9ca3af',
    };
    return colors[eventType] || '#6b7280';
  };

  const statusConfig = getStatusColor(evidenceData.status);

  return (
    <div style={{ padding: 0, maxWidth: '100%', margin: 0 }}>
      <PageHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Kho chứng cứ', href: '/evidence' },
          { label: evidenceData.id }
        ]}
        title={evidenceData.fileName}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => toast.info('Tính năng đang phát triển')}>
              <Share2 size={16} />
              Chia sẻ
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Đang tải xuống...')}>
              <Download size={16} />
              Tải xuống
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical size={16} />
            </Button>
          </>
        }
      />

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Info Card */}
        <Card>
          <CardContent style={{ padding: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '24px', alignItems: 'start' }}>
              
              {/* File Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#005cb615',
                color: '#005cb6',
                borderRadius: 'var(--radius-lg)',
                flexShrink: 0,
              }}>
                {evidenceData.type === 'image' && <ImageIcon size={40} />}
                {evidenceData.type === 'video' && <VideoIcon size={40} />}
                {evidenceData.type === 'document' && <FileText size={40} />}
              </div>

              {/* File Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                <div>
                  <div style={{ 
                    fontSize: 'var(--text-xs)', 
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px',
                  }}>
                    Mã chứng cứ
                  </div>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    {evidenceData.id}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={14} />
                    <span style={{ fontWeight: 500 }}>{evidenceData.size}</span>
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    {evidenceData.submitter}
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} />
                    {evidenceData.location}
                  </div>
                  <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    {evidenceData.capturedAt}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <Badge 
                  variant="outline"
                  style={{
                    borderColor: statusConfig.color,
                    color: statusConfig.color,
                    background: statusConfig.bg,
                  }}
                >
                  {getStatusLabel(evidenceData.status)}
                </Badge>
                {getSensitivityBadge(evidenceData.sensitivityLabel)}
                <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e', background: '#22c55e15' }}>
                  <CheckCircle size={12} />
                  Verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '2px solid var(--border)',
          overflowX: 'auto',
        }}>
          {[
            { key: 'overview', label: 'Tổng quan', icon: <Eye size={16} /> },
            { key: 'viewer', label: 'Xem chứng cứ', icon: <ImageIcon size={16} /> },
            { key: 'metadata', label: 'Metadata', icon: <FileText size={16} /> },
            { key: 'links', label: 'Liên kết', icon: <LinkIcon size={16} /> },
            { key: 'custody', label: 'Chain of Custody', icon: <Clock size={16} /> },
            { key: 'review', label: 'Review', icon: <ShieldCheck size={16} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #005cb6' : '2px solid transparent',
                marginBottom: '-2px',
                fontSize: 'var(--text-sm)',
                fontWeight: activeTab === tab.key ? 600 : 500,
                color: activeTab === tab.key ? '#005cb6' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '400px' }}>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              
              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                
                {/* Basic Info */}
                <Card>
                  <CardContent style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 16px 0',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      Thông tin cơ bản
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {[
                        { label: 'Mã chứng cứ', value: evidenceData.id },
                        { label: 'Loại file', value: 'Ảnh' },
                        { label: 'Kích thước', value: evidenceData.size },
                        { label: 'Người nộp', value: evidenceData.submitter },
                        { label: 'Nguồn', value: evidenceData.source },
                        { label: 'Thiết bị', value: evidenceData.deviceInfo },
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600,
                            color: 'var(--text-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            {item.label}
                          </div>
                          <div style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 500,
                            color: 'var(--text-primary)',
                          }}>
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Timestamps */}
                <Card>
                  <CardContent style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 16px 0',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <Calendar size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                      Thời gian
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Ngày chụp/thu thập
                        </div>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}>
                          {evidenceData.capturedAt}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          Ngày tải lên
                        </div>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          fontWeight: 500,
                          color: 'var(--text-primary)',
                        }}>
                          {evidenceData.uploadedAt}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Hash & Integrity */}
              <Card>
                <CardContent style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 20px 0',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <Hash size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    Hash & Integrity (SWGDE Compliant)
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Hash values */}
                    {[
                      { algo: 'SHA-256', value: evidenceData.hash_values.sha256, badge: 'Verified' },
                      { algo: 'SHA-512', value: evidenceData.hash_values.sha512, badge: 'Verified' },
                      { algo: 'MD5', value: evidenceData.hash_values.md5, badge: 'Legacy' },
                    ].map((hash, idx) => (
                      <div key={idx} style={{
                        padding: '16px',
                        background: 'var(--background-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}>
                          <span style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                          }}>
                            {hash.algo}
                          </span>
                          {hash.badge === 'Verified' ? (
                            <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e', background: '#22c55e15' }}>
                              <CheckCircle size={12} />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" style={{ borderColor: '#f59e0b', color: '#f59e0b' }}>
                              Legacy
                            </Badge>
                          )}
                        </div>
                        <div style={{
                          fontFamily: 'monospace',
                          fontSize: 'var(--text-xs)',
                          color: 'var(--text-secondary)',
                          padding: '10px 12px',
                          background: 'var(--background)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                          wordBreak: 'break-all',
                        }}>
                          {hash.value}
                        </div>
                      </div>
                    ))}

                    {/* Verification status */}
                    <div style={{
                      padding: '16px',
                      background: '#22c55e15',
                      border: '1px solid #22c55e',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: 'var(--text-sm)',
                        color: '#22c55e',
                        fontWeight: 500,
                      }}>
                        <Clock size={16} />
                        <span>Lần xác thực cuối: {evidenceData.hash_computed_at} bởi {evidenceData.computed_by}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.success('Đang xác thực hash... Integrity check passed!')}
                      >
                        <CheckCircle size={14} />
                        Re-verify Integrity
                      </Button>
                    </div>

                    {/* Compliance notice */}
                    <div style={{
                      padding: '14px',
                      background: '#005cb615',
                      border: '1px solid #005cb6',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      gap: '10px',
                      color: '#005cb6',
                    }}>
                      <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ fontSize: 'var(--text-xs)', lineHeight: '1.6', fontWeight: 500 }}>
                        SWGDE: Multiple hash algorithms để giảm rủi ro va chạm | 
                        ISO/IEC 27037: Acquisition hash đảm bảo integrity
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardContent style={{ padding: '20px' }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    margin: '0 0 16px 0',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    Ghi chú
                  </h3>
                  <p style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    margin: 0,
                  }}>
                    {evidenceData.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Viewer Tab */}
          {activeTab === 'viewer' && (
            <Card>
              <CardContent style={{ padding: '24px' }}>
                {/* Toolbar */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Zoom In')}>
                      <ZoomIn size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Zoom Out')}>
                      <ZoomOut size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Rotate')}>
                      <RotateCw size={16} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast.info('Fullscreen')}>
                      <Maximize size={16} />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Đang tải xuống...')}>
                    <Download size={16} />
                    Tải xuống
                  </Button>
                </div>

                {/* Image viewer */}
                <div style={{
                  background: 'var(--background-secondary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '20px',
                  minHeight: '600px',
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1720213620000-83166fc0af2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzY4MDMyMDkwfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                    alt={evidenceData.fileName}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '600px',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      objectFit: 'contain',
                    }}
                  />
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                  }}>
                    <ImageIcon size={16} />
                    <span>{evidenceData.fileName}</span>
                    <Badge variant="secondary">{evidenceData.size}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata Tab */}
          {activeTab === 'metadata' && (
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    Chi tiết Metadata
                  </h3>
                  <Button variant="outline" size="sm">
                    <Edit size={14} />
                    Chỉnh sửa
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  {[
                    {
                      title: 'Thông tin file',
                      fields: [
                        { label: 'Loại chứng cứ', value: 'Ảnh hiện trường' },
                        { label: 'Nguồn', value: evidenceData.source },
                        { label: 'Thiết bị', value: evidenceData.deviceInfo },
                      ]
                    },
                    {
                      title: 'Thời gian & Địa điểm',
                      fields: [
                        { label: 'Ngày chụp/thu thập', value: evidenceData.capturedAt },
                        { label: 'Ngày tải lên', value: evidenceData.uploadedAt },
                        { label: 'Vị trí GPS', value: '10.7769, 106.7009' },
                        { label: 'Địa bàn', value: evidenceData.location },
                      ]
                    },
                  ].map((section, idx) => (
                    <div key={idx}>
                      <h4 style={{
                        fontSize: 'var(--text-md)',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        margin: '0 0 16px 0',
                        paddingBottom: '8px',
                        borderBottom: '1px solid var(--border)',
                      }}>
                        {section.title}
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '16px',
                      }}>
                        {section.fields.map((field, fIdx) => (
                          <div key={fIdx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{
                              fontSize: 'var(--text-sm)',
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                            }}>
                              {field.label}
                            </label>
                            <input
                              type="text"
                              value={field.value}
                              readOnly
                              style={{
                                padding: '10px 12px',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--text-sm)',
                                color: 'var(--text-primary)',
                                background: 'var(--background-secondary)',
                                cursor: 'not-allowed',
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Notes */}
                  <div>
                    <h4 style={{
                      fontSize: 'var(--text-md)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      margin: '0 0 16px 0',
                      paddingBottom: '8px',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      Ghi chú
                    </h4>
                    <textarea
                      value={evidenceData.notes}
                      readOnly
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        background: 'var(--background-secondary)',
                        cursor: 'not-allowed',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  marginTop: '24px',
                  display: 'flex',
                  gap: '12px',
                  padding: '16px',
                  background: '#f59e0b15',
                  border: '1px solid #f59e0b',
                  borderRadius: 'var(--radius-md)',
                  color: '#f59e0b',
                  fontSize: 'var(--text-sm)',
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0 }}>
                    Chỉnh sửa metadata nhạy cảm yêu cầu reason code và có thể cần xét duyệt lại.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links Tab */}
          {activeTab === 'links' && (
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    Liên kết vụ việc
                  </h3>
                  <Button variant="outline" size="sm">
                    <LinkIcon size={14} />
                    Thêm liên kết
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {evidenceData.linkedEntities.map((entity, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '20px',
                      background: 'var(--background-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#005cb6';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 92, 182, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#005cb615',
                        color: '#005cb6',
                        borderRadius: 'var(--radius-md)',
                        flexShrink: 0,
                      }}>
                        <FileCheck size={24} />
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {entity.type === 'lead' ? 'Vụ việc' :
                           entity.type === 'task' ? 'Nhiệm vụ' :
                           entity.type === 'plan' ? 'Kế hoạch' : 'Cơ sở'}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-md)',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                        }}>
                          {entity.name}
                        </div>
                        <div style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                        }}>
                          {entity.id}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast.info(`Mở ${entity.type}: ${entity.id}`)}
                      >
                        <ExternalLink size={14} />
                        Mở
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Chain of Custody Tab */}
          {activeTab === 'custody' && (
            <Card>
              <CardContent style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}>
                  <h3 style={{
                    fontSize: 'var(--text-xl)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}>
                    Chain of Custody Log
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      background: 'var(--background)',
                    }}>
                      <option value="">Tất cả sự kiện</option>
                      <option value="upload">Upload</option>
                      <option value="view">View</option>
                      <option value="edit">Edit</option>
                      <option value="review">Review</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download size={14} />
                      Export Log
                    </Button>
                  </div>
                </div>

                {/* Timeline */}
                <div style={{ position: 'relative' }}>
                  {custodyEvents.map((event, idx) => (
                    <div key={event.id} style={{
                      display: 'flex',
                      gap: '20px',
                      paddingBottom: idx === custodyEvents.length - 1 ? '0' : '32px',
                      position: 'relative',
                    }}>
                      {/* Timeline line */}
                      {idx < custodyEvents.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '19px',
                          top: '44px',
                          bottom: '0',
                          width: '2px',
                          background: 'var(--border)',
                        }} />
                      )}
                      
                      {/* Icon */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: `${getEventColor(event.eventType)}15`,
                        color: getEventColor(event.eventType),
                        border: `2px solid ${getEventColor(event.eventType)}`,
                        position: 'relative',
                        zIndex: 1,
                      }}>
                        {getEventIcon(event.eventType)}
                      </div>

                      {/* Content */}
                      <div style={{
                        flex: 1,
                        padding: '8px 0',
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '6px',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}>
                          <span style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}>
                            {event.actor}
                          </span>
                          <span style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                          }}>
                            {event.timestamp}
                          </span>
                        </div>
                        <p style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--text-secondary)',
                          margin: '0 0 8px 0',
                        }}>
                          {event.action}
                        </p>
                        {(event.ipAddress || event.device) && (
                          <div style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-tertiary)',
                          }}>
                            {event.ipAddress && <span>IP: {event.ipAddress}</span>}
                            {event.device && <span>Device: {event.device}</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Tab */}
          {activeTab === 'review' && (
            <Card>
              <CardContent style={{
                padding: '60px 40px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                textAlign: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '16px 20px',
                  background: '#005cb610',
                  border: '1px solid #005cb6',
                  borderRadius: 'var(--radius-md)',
                  color: '#005cb6',
                  fontSize: 'var(--text-sm)',
                  maxWidth: '600px',
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, textAlign: 'left' }}>
                    Chứng cứ này đang trong quá trình xét duyệt. Vui lòng truy cập trang Review Detail để thực hiện xét duyệt.
                  </p>
                </div>
                <Button onClick={() => navigate(`/evidence/review/${evidenceData.id}`)}>
                  <ShieldCheck size={16} />
                  Đi tới Review Detail
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}