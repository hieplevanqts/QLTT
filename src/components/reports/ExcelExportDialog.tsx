import React, { useState, useEffect } from 'react';
import { X, Download, CheckCircle2, Loader2, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface ExcelExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: () => void;
  fileName: string;
}

export function ExcelExportDialog({ open, onClose, onExport, fileName }: ExcelExportDialogProps) {
  const [exportStatus, setExportStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setExportStatus('idle');
      setProgress(0);
    }
  }, [open]);

  const handleExport = async () => {
    setExportStatus('processing');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate export delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      try {
        onExport();
        setExportStatus('success');
        
        // Auto close after success
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (error) {
        setExportStatus('error');
      }
    }, 2000);
  };

  if (!open) return null;

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
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={() => exportStatus !== 'processing' && onClose()}
      />

      {/* Dialog */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--card, #ffffff)',
          borderRadius: 'var(--radius, 6px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          width: '90%',
          maxWidth: '480px',
          zIndex: 9999,
          fontFamily: 'Inter, sans-serif',
          animation: 'slideUp 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-5, 20px)',
            borderBottom: '1px solid var(--border, #e5e7eb)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3, 12px)' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                background: 'rgba(0, 92, 182, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSpreadsheet size={20} style={{ color: 'var(--primary, #005cb6)' }} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--foreground, #111827)',
                  margin: 0,
                }}
              >
                Xuất dữ liệu Excel
              </h3>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--muted-foreground, #6b7280)',
                  margin: '2px 0 0 0',
                }}
              >
                Tạo file báo cáo Excel
              </p>
            </div>
          </div>
          {exportStatus !== 'processing' && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                color: 'var(--muted-foreground, #6b7280)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--muted, #f9fafb)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--spacing-6, 24px)' }}>
          {exportStatus === 'idle' && (
            <>
              {/* File info */}
              <div
                style={{
                  padding: 'var(--spacing-4, 16px)',
                  background: 'var(--muted, #f9fafb)',
                  borderRadius: 'var(--radius, 6px)',
                  marginBottom: 'var(--spacing-4, 16px)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--muted-foreground, #6b7280)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}
                >
                  Tên file
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--foreground, #111827)',
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {fileName}
                </div>
              </div>

              {/* Export details */}
              <div style={{ marginBottom: 'var(--spacing-5, 20px)' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--foreground, #111827)',
                    marginBottom: 'var(--spacing-3, 12px)',
                  }}
                >
                  Nội dung file sẽ bao gồm:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    padding: '0 0 0 20px',
                    fontSize: '13px',
                    color: 'var(--muted-foreground, #6b7280)',
                    lineHeight: 1.8,
                  }}
                >
                  <li>Sheet 1: Tổng hợp theo khu vực</li>
                  <li>Sheet 2: Chi tiết cơ sở</li>
                  <li>Sheet 3: Phân loại theo loại hình</li>
                  <li>Sheet 4: Dữ liệu biểu đồ tổng hợp</li>
                </ul>
              </div>

              {/* Note */}
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-2, 8px)',
                  padding: 'var(--spacing-3, 12px)',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '12px',
                  color: 'var(--muted-foreground, #6b7280)',
                }}
              >
                <AlertCircle size={16} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  Dữ liệu xuất sẽ trùng khớp với bộ lọc và dashboard hiện tại. File Excel sẽ được tải xuống máy tính của bạn.
                </div>
              </div>
            </>
          )}

          {exportStatus === 'processing' && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4, 16px)' }}>
              <Loader2
                size={48}
                style={{
                  color: 'var(--primary, #005cb6)',
                  animation: 'spin 1s linear infinite',
                  marginBottom: 'var(--spacing-4, 16px)',
                }}
              />
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--foreground, #111827)',
                  marginBottom: 'var(--spacing-2, 8px)',
                }}
              >
                Đang xử lý dữ liệu...
              </div>
              
              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  background: 'var(--muted, #f3f4f6)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: 'var(--spacing-2, 8px)',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: 'var(--primary, #005cb6)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
              
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--muted-foreground, #6b7280)',
                }}
              >
                {progress}%
              </div>
            </div>
          )}

          {exportStatus === 'success' && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4, 16px)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#10b98115',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-4, 16px)',
                }}
              >
                <CheckCircle2 size={32} style={{ color: '#10b981' }} />
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--foreground, #111827)',
                  marginBottom: 'var(--spacing-2, 8px)',
                }}
              >
                Xuất dữ liệu thành công!
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--muted-foreground, #6b7280)',
                }}
              >
                File Excel đã được tải xuống
              </div>
            </div>
          )}

          {exportStatus === 'error' && (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4, 16px)' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#ef444415',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-4, 16px)',
                }}
              >
                <AlertCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--foreground, #111827)',
                  marginBottom: 'var(--spacing-2, 8px)',
                }}
              >
                Xuất dữ liệu thất bại
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--muted-foreground, #6b7280)',
                }}
              >
                Vui lòng thử lại sau
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {exportStatus === 'idle' && (
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-3, 12px)',
              justifyContent: 'flex-end',
              padding: 'var(--spacing-5, 20px)',
              borderTop: '1px solid var(--border, #e5e7eb)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                background: 'var(--card, #ffffff)',
                color: 'var(--foreground, #111827)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--muted, #f9fafb)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card, #ffffff)';
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2, 8px)',
                padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                background: 'var(--primary, #005cb6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#004a93';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--primary, #005cb6)';
              }}
            >
              <Download size={16} />
              Xuất Excel
            </button>
          </div>
        )}

        {exportStatus === 'error' && (
          <div
            style={{
              display: 'flex',
              gap: 'var(--spacing-3, 12px)',
              justifyContent: 'flex-end',
              padding: 'var(--spacing-5, 20px)',
              borderTop: '1px solid var(--border, #e5e7eb)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                background: 'var(--card, #ffffff)',
                color: 'var(--foreground, #111827)',
                border: '1px solid var(--border, #e5e7eb)',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Đóng
            </button>
            <button
              onClick={handleExport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2, 8px)',
                padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                background: 'var(--primary, #005cb6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius, 6px)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Thử lại
            </button>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
}
