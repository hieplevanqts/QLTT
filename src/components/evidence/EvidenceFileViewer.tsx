import React from 'react';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getFileTypeInfo, formatFileSize } from '@/utils/fileUtils';

interface EvidenceFileViewerProps {
  file: {
    filename: string;
    sizeBytes: number;
    mimeType: string;
    imageUrl?: string;
    fileUrl?: string;
  };
  maxHeight?: string;
}

export default function EvidenceFileViewer({ file, maxHeight = '500px' }: EvidenceFileViewerProps) {
  const fileInfo = getFileTypeInfo(file.mimeType);
  const fileUrl = file.fileUrl || file.imageUrl || '';

  // Image viewer
  if (fileInfo.category === 'image' && file.imageUrl) {
    return (
      <img 
        src={file.imageUrl} 
        alt={file.filename}
        style={{
          maxWidth: '100%',
          maxHeight,
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          objectFit: 'contain',
        }}
      />
    );
  }

  // PDF viewer
  if (fileInfo.category === 'pdf' && fileUrl) {
    return (
      <div style={{
        width: '100%',
        height: maxHeight,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        <iframe
          src={`${fileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={file.filename}
        />
      </div>
    );
  }

  // Document viewer (Word, Excel, PowerPoint via Google Docs Viewer)
  if (fileInfo.category === 'document' && fileUrl) {
    return (
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          padding: '16px',
          background: '#3b82f615',
          border: '1px solid #3b82f6',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#3b82f6',
          fontSize: 'var(--text-sm)',
        }}>
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Xem trước tài liệu</p>
            <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)', opacity: 0.9 }}>
              Tài liệu được hiển thị qua Google Docs Viewer. Để chỉnh sửa, vui lòng tải xuống.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(fileUrl, '_blank')}
            style={{ borderColor: '#3b82f6', color: '#3b82f6' }}
          >
            <Download size={14} style={{ marginRight: '6px' }} />
            Tải xuống
          </Button>
        </div>
        
        <div style={{
          width: '100%',
          height: maxHeight,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title={file.filename}
          />
        </div>
      </div>
    );
  }

  // Video viewer
  if (fileInfo.category === 'video' && fileUrl) {
    return (
      <video
        controls
        style={{
          maxWidth: '100%',
          maxHeight,
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <source src={fileUrl} type={file.mimeType} />
        Trình duyệt của bạn không hỗ trợ phát video.
      </video>
    );
  }

  // Fallback for non-previewable files
  const Icon = fileInfo.icon;
  return (
    <div style={{
      width: '100%',
      minHeight: maxHeight,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '48px 24px',
      background: 'var(--background-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: fileInfo.bgColor,
        color: fileInfo.color,
        borderRadius: 'var(--radius-lg)',
      }}>
        <Icon size={64} />
      </div>

      <div style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <h4 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          margin: 0,
          wordBreak: 'break-all',
        }}>
          {file.filename}
        </h4>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'center',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}>
          <Badge variant="secondary" style={{ background: fileInfo.bgColor, color: fileInfo.color }}>
            {file.mimeType}
          </Badge>
          <Badge variant="secondary">
            {formatFileSize(file.sizeBytes)}
          </Badge>
        </div>
      </div>

      <div style={{
        padding: '16px 24px',
        background: '#f59e0b15',
        border: '1px solid #f59e0b',
        borderRadius: 'var(--radius-md)',
        color: '#f59e0b',
        fontSize: 'var(--text-sm)',
        textAlign: 'center',
        maxWidth: '500px',
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          Không thể xem trước file này
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: 'var(--text-xs)' }}>
          Vui lòng tải xuống để xem nội dung
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button 
          variant="outline"
          onClick={() => fileUrl && window.open(fileUrl, '_blank')}
        >
          <Download size={16} style={{ marginRight: '8px' }} />
          Tải xuống
        </Button>
        {fileUrl && (
          <Button 
            variant="ghost"
            onClick={() => window.open(fileUrl, '_blank')}
          >
            <ExternalLink size={16} style={{ marginRight: '8px' }} />
            Mở trong tab mới
          </Button>
        )}
      </div>
    </div>
  );
}
