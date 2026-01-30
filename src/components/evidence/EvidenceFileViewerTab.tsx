import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize, 
  Download,
  Image as ImageIcon,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { toast } from 'sonner';
import EvidenceFileViewer from './EvidenceFileViewer';
import { getFileTypeInfo, formatFileSize, getFileExtension } from '@/utils/fileUtils';

interface EvidenceFile {
  filename: string;
  sizeBytes: number;
  mimeType: string;
  imageUrl?: string;
  fileUrl?: string;
}

interface EvidenceFileViewerTabProps {
  evidenceData: {
    files: EvidenceFile[];
  };
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  isLightboxOpen: boolean;
  setIsLightboxOpen: (open: boolean) => void;
}

export default function EvidenceFileViewerTab({
  evidenceData,
  selectedImageIndex,
  setSelectedImageIndex,
  isLightboxOpen,
  setIsLightboxOpen,
}: EvidenceFileViewerTabProps) {
  const currentFile = evidenceData.files[selectedImageIndex];
  const fileInfo = getFileTypeInfo(currentFile.mimeType);

  return (
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
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}>
              {selectedImageIndex + 1} / {evidenceData.files.length}
            </span>
            <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="sm" onClick={() => toast.info('Phóng to')}>
                <ZoomIn size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Thu nhỏ')}>
                <ZoomOut size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Xoay ảnh')}>
                <RotateCw size={16} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsLightboxOpen(true)}>
                <Maximize size={16} />
              </Button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => toast.success('Đang tải xuống...')}>
            <Download size={16} />
            Tải xuống
          </Button>
        </div>

        {/* Thumbnail Gallery - Moved to Top */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{
            fontSize: 'var(--text-md)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            Tất cả file ({evidenceData.files.length})
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {(evidenceData.files || []).map((file, idx) => {
              const thumbFileInfo = getFileTypeInfo(file.mimeType);
              const ThumbIcon = thumbFileInfo.icon;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedImageIndex === idx ? '3px solid #005cb6' : '2px solid var(--border)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedImageIndex !== idx) {
                      e.currentTarget.style.borderColor = '#005cb680';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedImageIndex !== idx) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
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
                      background: thumbFileInfo.bgColor,
                      gap: '8px',
                    }}>
                      <ThumbIcon size={40} color={thumbFileInfo.color} />
                      <div style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: thumbFileInfo.color,
                        textTransform: 'uppercase',
                      }}>
                        {getFileExtension(file.filename)}
                      </div>
                    </div>
                  )}
                  {selectedImageIndex === idx && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      background: '#005cb6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 700,
                    }}>
                      <CheckCircle size={18} />
                    </div>
                  )}
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
        </div>

        {/* Main File viewer */}
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
          minHeight: '500px',
          position: 'relative',
        }}>
          {/* Previous Button */}
          {selectedImageIndex > 0 && (
            <button
              onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
              style={{
                position: 'absolute',
                left: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--background)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#005cb6';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#005cb6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--background)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <ArrowLeft size={24} />
            </button>
          )}

          {/* Next Button */}
          {selectedImageIndex < evidenceData.files.length - 1 && (
            <button
              onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%) rotate(180deg)',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--background)',
                border: '2px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.2s',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#005cb6';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#005cb6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--background)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <ArrowLeft size={24} />
            </button>
          )}

          {/* File Viewer */}
          <EvidenceFileViewer 
            file={currentFile} 
            maxHeight="500px"
          />

          {/* File Info Footer */}
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
            <span>{currentFile.filename}</span>
            <Badge variant="secondary">{formatFileSize(currentFile.sizeBytes)}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
