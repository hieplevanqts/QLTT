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
  Edit,
  Hash,
  MapPin,
  Calendar,
  User,
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PageHeader from '@/layouts/PageHeader';
import { toast } from 'sonner';
import type { EvidenceItem, CustodyEvent } from '@/types/evidence.types';
import { getStatusLabel, getStatusColor, getTypeLabel } from '@/types/evidence.types';
import EvidenceOverviewTab from '@/components/evidence/EvidenceOverviewTab';
import EvidenceFileViewerTab from '@/components/evidence/EvidenceFileViewerTab';
import { getFileTypeInfo, getFileExtension, formatFileSize } from '@/utils/fileUtils';

export default function EvidenceDetailPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'viewer' | 'metadata' | 'links'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    type: 'lead' as 'lead' | 'task' | 'plan' | 'store',
    id: '',
    name: '',
  });
  const [linkedEntities, setLinkedEntities] = useState([
    { type: 'lead' as const, id: 'LEAD-2026-048', name: 'Tố giác vi phạm ATTP từ người dân' },
    { type: 'task' as const, id: 'TASK-2026-091', name: 'Nguy cơ ngộ độc thực phẩm cao' },
    { type: 'plan' as const, id: 'PLAN-2026-015', name: 'Thanh tra cơ sở kinh doanh thực phẩm - Quận 1' },
    { type: 'store' as const, id: 'STORE-2026-234', name: 'Nhà hàng Phố Việt - 123 Nguyễn Huệ' }
  ]);

  // Mock data
  const evidenceData = {
    id: evidenceId || 'EVD-2026-1252',
    fileName: 'anh_vi_pham_ve_sinh.jpg',
    files: [
      { 
        filename: 'anh_vi_pham_ve_sinh.jpg', 
        sizeBytes: 2457600, 
        mimeType: 'image/jpeg',
        imageUrl: 'https://images.unsplash.com/photo-1720213620000-83166fc0af2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwa2l0Y2hlbiUyMGluc3BlY3Rpb258ZW58MXx8fHwxNzY4MjE1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080' 
      },
      { 
        filename: 'anh_vi_pham_close_up.jpg', 
        sizeBytes: 1834500, 
        mimeType: 'image/jpeg',
        imageUrl: 'https://images.unsplash.com/photo-1758369636932-36fdcf1314fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwc2FmZXR5JTIwa2l0Y2hlbixlbnwxfHx8fDE3NjgyMTU2Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080' 
      },
      { 
        filename: 'khu_vuc_luu_tru.jpg', 
        sizeBytes: 2156700, 
        mimeType: 'image/jpeg',
        imageUrl: 'https://images.unsplash.com/photo-1589109807644-924edf14ee09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwa2l0Y2hlbiUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NjgxODg4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080' 
      },
      { 
        filename: 'khu_vuc_che_bien.jpg', 
        sizeBytes: 3124800, 
        mimeType: 'image/jpeg',
        imageUrl: 'https://images.unsplash.com/photo-1763219805214-91fa634e6006?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcHJlcGFyYXRpb24lMjBhcmVhfGVufDF8fHx8MTc2ODIxNTc2Nnww&ixlib=rb-4.1.0&q=80&w=1080' 
      },
      { 
        filename: 'thiet_bi_bep_ban.jpg', 
        sizeBytes: 2892100, 
        mimeType: 'image/jpeg',
        imageUrl: 'https://images.unsplash.com/photo-1727591092022-c43808617daa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwc3RvcmFnZSUyMHJvb218ZW58MXx8fHwxNzY4MjE1NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080' 
      },
    ],
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
    size: '2.4 MB'
  };

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

  const statusConfig = getStatusColor(evidenceData.status);

  return (
    <div style={{ padding: 0, maxWidth: '100%', margin: 0 }}>
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '24px',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            ×
          </button>

          {/* Previous Button */}
          {selectedImageIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex - 1);
              }}
              style={{
                position: 'absolute',
                left: '40px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {selectedImageIndex < evidenceData.files.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImageIndex(selectedImageIndex + 1);
              }}
              style={{
                position: 'absolute',
                right: '40px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                transform: 'rotate(180deg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft size={28} />
            </button>
          )}

          {/* Image */}
          <div 
            style={{ 
              maxWidth: '90%', 
              maxHeight: '90%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={evidenceData.files[selectedImageIndex].imageUrl} 
              alt={evidenceData.files[selectedImageIndex].filename}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(90vh - 100px)',
                objectFit: 'contain',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              }}
            />
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '16px 24px',
              borderRadius: 'var(--radius-md)',
              color: 'white',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <span>{selectedImageIndex + 1} / {evidenceData.files.length}</span>
              <span style={{ opacity: 0.5 }}>•</span>
              <span>{evidenceData.files[selectedImageIndex].filename}</span>
            </div>
          </div>
        </div>
      )}
      
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
            <EvidenceOverviewTab 
              evidenceData={evidenceData}
              onImageClick={(index) => {
                setSelectedImageIndex(index);
                setIsLightboxOpen(true);
              }}
              onViewAllFiles={() => setActiveTab('viewer')}
            />
          )}

          {/* Viewer Tab */}
          {activeTab === 'viewer' && (
            <EvidenceFileViewerTab
              evidenceData={evidenceData}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
              isLightboxOpen={isLightboxOpen}
              setIsLightboxOpen={setIsLightboxOpen}
            />
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
                  <Button variant="outline" size="sm" onClick={() => setIsAddLinkModalOpen(true)}>
                    <LinkIcon size={14} />
                    Thêm liên kết
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {linkedEntities.map((entity, idx) => (
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
                          {entity.type === 'lead' ? 'Nguồn tin' :
                           entity.type === 'task' ? 'Rủi ro' :
                           entity.type === 'plan' ? 'Phiên kiểm tra' : 'Cửa hàng'}
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


        </div>
      </div>

      {/* Add Link Modal */}
      {isAddLinkModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
          onClick={() => {
            setIsAddLinkModalOpen(false);
            setNewLink({ type: 'lead', id: '', name: '' });
          }}
        >
          <div 
            style={{ 
              width: '100%',
              maxWidth: '500px',
              background: 'var(--background)',
              borderRadius: 'var(--radius-lg)',
              padding: '32px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 24px 0',
            }}>
              Thêm Liên Kết
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Entity Type Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  Loại liên kết
                </label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)',
                    }} 
                  />
                  <select
                    value={newLink.type}
                    onChange={(e) => setNewLink({ ...newLink, type: e.target.value as 'lead' | 'task' | 'plan' | 'store' })}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      background: 'var(--background)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="lead">Nguồn tin</option>
                    <option value="task">Rủi ro</option>
                    <option value="plan">Phiên kiểm tra</option>
                    <option value="store">Cửa hàng</option>
                  </select>
                </div>
              </div>

              {/* ID Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  Mã ID
                </label>
                <div style={{ position: 'relative' }}>
                  <Hash 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)',
                    }} 
                  />
                  <input
                    type="text"
                    value={newLink.id}
                    onChange={(e) => setNewLink({ ...newLink, id: e.target.value })}
                    placeholder="VD: CASE-2026-048"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      background: 'var(--background)',
                    }}
                  />
                </div>
              </div>

              {/* Name Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}>
                  Tên mô tả
                </label>
                <div style={{ position: 'relative' }}>
                  <FileText 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      left: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)',
                      color: 'var(--text-tertiary)',
                    }} 
                  />
                  <input
                    type="text"
                    value={newLink.name}
                    onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                    placeholder="VD: Vi phạm ATTP tại Quận 1"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 40px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      background: 'var(--background)',
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddLinkModalOpen(false);
                  setNewLink({ type: 'lead', id: '', name: '' });
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  if (!newLink.id.trim() || !newLink.name.trim()) {
                    toast.error('Vui lòng nhập đầy đủ thông tin');
                    return;
                  }
                  setLinkedEntities([...linkedEntities, { ...newLink }]);
                  setNewLink({ type: 'lead', id: '', name: '' });
                  setIsAddLinkModalOpen(false);
                  toast.success('Liên kết đã được thêm');
                }}
              >
                <LinkIcon size={14} />
                Thêm liên kết
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


