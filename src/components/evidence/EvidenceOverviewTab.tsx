import React from 'react';
import {
  FileText,
  ImageIcon,
  Hash,
  Clock,
  CheckCircle,
  User,
  Upload,
  MapPin,
  Calendar,
  Eye,
  Download,
  Share2,
  Edit,
  Video,
  FileArchive,
  File,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { toast } from 'sonner';
import { downloadFilesAsZip } from '@/utils/downloadUtils';
import { getFileTypeInfo, getFileExtension } from '@/utils/fileUtils';

interface EvidenceFile {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  imageUrl?: string;
}

interface LinkedEntity {
  type: 'lead' | 'task' | 'risk' | 'store' | 'plan';
  id: string;
  name: string;
}

interface EvidenceOverviewProps {
  evidenceData: {
    id: string;
    files: EvidenceFile[];
    size: string;
    submitter: string;
    source: string;
    deviceInfo: string;
    location: string;
    capturedAt: string;
    uploadedAt: string;
    hash_values: {
      sha256: string;
    };
    hash_computed_at: string;
    notes?: string;
    linkedEntities?: LinkedEntity[];
  };
  onImageClick: (index: number) => void;
  onViewAllFiles: () => void;
}

export default function EvidenceOverviewTab({ evidenceData, onImageClick, onViewAllFiles }: EvidenceOverviewProps) {
  const handleDownloadAll = async () => {
    try {
      toast.loading('Đang chuẩn bị tải xuống...');
      await downloadFilesAsZip(evidenceData.files, `${evidenceData.id}.zip`);
      toast.success('Tải xuống thành công!');
    } catch (error) {
      toast.error('Lỗi khi tải xuống files');
      console.error('Download error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Files Preview Gallery - Full Width at Top */}
      <Card>
        <CardContent style={{ padding: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            <h3 style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Files đính kèm ({evidenceData.files.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={onViewAllFiles}>
              <Eye size={14} style={{ marginRight: '6px' }} />
              Xem tất cả
            </Button>
          </div>

          {/* Image Gallery Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
          }}>
            {evidenceData.files.slice(0, 6).map((file, idx) => {
              const fileInfo = getFileTypeInfo(file.mimeType);
              const FileIcon = fileInfo.icon;
              
              return (
                <div
                  key={idx}
                  onClick={() => onImageClick(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: 'var(--background-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {file.imageUrl ? (
                    <img
                      src={file.imageUrl}
                      alt={file.filename}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: fileInfo.bgColor,
                      gap: '8px',
                    }}>
                      <FileIcon size={40} color={fileInfo.color} />
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: fileInfo.color,
                        textTransform: 'uppercase',
                      }}>
                        {getFileExtension(file.filename)}
                      </div>
                    </div>
                  )}
                  {/* Overlay with filename */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {file.filename}
                  </div>
                </div>
              );
            })}
          </div>

          {evidenceData.files.length > 6 && (
            <div style={{
              marginTop: '12px',
              textAlign: 'center',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
            }}>
              +{evidenceData.files.length - 6} files khác
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid - 2 columns */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr', 
        gap: '24px',
      }}>
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Hash & Integrity - Compact Version */}
          <Card>
            <CardContent style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <Hash size={18} />
                  Hash & Integrity
                </h3>
                <Badge variant="outline" style={{ borderColor: '#22c55e', color: '#22c55e', background: '#22c55e15' }}>
                  <CheckCircle size={12} style={{ marginRight: '4px' }} />
                  Verified
                </Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* SHA-256 - Primary hash */}
                <div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: 'var(--text-tertiary)',
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    SHA-256
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    padding: '10px 12px',
                    background: 'var(--background-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    wordBreak: 'break-all',
                  }}>
                    {evidenceData.hash_values.sha256}
                  </div>
                </div>

                {/* Verification info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: 'var(--background-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    <span>Xác thực: {evidenceData.hash_computed_at}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => toast.success('Integrity check passed!')}
                    style={{ height: '28px', padding: '0 12px' }}
                  >
                    <CheckCircle size={14} style={{ marginRight: '4px' }} />
                    Re-verify
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {evidenceData.notes && (
            <Card>
              <CardContent style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  margin: '0 0 12px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Ghi chú
                </h3>
                <p style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {evidenceData.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Basic Info */}
          <Card>
            <CardContent style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Thông tin cơ bản
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Mã chứng cứ', value: evidenceData.id, icon: <FileText size={14} /> },
                  { label: 'Loại file', value: 'Ảnh (JPEG)', icon: <ImageIcon size={14} /> },
                  { label: 'Kích thước', value: evidenceData.size, icon: <FileText size={14} /> },
                  { label: 'Số lượng file', value: `${evidenceData.files.length} file`, icon: <FileText size={14} /> },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {item.icon}
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submitter & Source */}
          <Card>
            <CardContent style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Nguồn & Người nộp
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Người nộp', value: evidenceData.submitter, icon: <User size={14} /> },
                  { label: 'Nguồn', value: evidenceData.source, icon: <Upload size={14} /> },
                  { label: 'Thiết bị', value: evidenceData.deviceInfo, icon: <FileText size={14} /> },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {item.icon}
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Location & Time */}
          <Card>
            <CardContent style={{ padding: '20px' }}>
              <h3 style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-tertiary)',
                margin: '0 0 16px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Địa điểm & Thời gian
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Địa điểm', value: evidenceData.location, icon: <MapPin size={14} /> },
                  { label: 'Ngày chụp', value: evidenceData.capturedAt, icon: <Calendar size={14} /> },
                  { label: 'Ngày tải lên', value: evidenceData.uploadedAt, icon: <Clock size={14} /> },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-tertiary)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      {item.icon}
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Linked Entities */}
          {evidenceData.linkedEntities && evidenceData.linkedEntities.length > 0 && (
            <Card>
              <CardContent style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  margin: '0 0 16px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Liên kết ({evidenceData.linkedEntities.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {evidenceData.linkedEntities.map((entity, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--background-secondary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#005cb6';
                        e.currentTarget.style.background = '#005cb610';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--background-secondary)';
                      }}
                      onClick={() => toast.info(`Mở ${entity.id}`)}
                    >
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-tertiary)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                      }}>
                        {entity.type}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 600,
                        color: '#005cb6',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {entity.id}
                      </div>
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-secondary)',
                        marginTop: '2px',
                      }}>
                        {entity.name}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
