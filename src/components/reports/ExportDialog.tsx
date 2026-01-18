import React, { useState } from 'react';
import { X, FileText, FileSpreadsheet, Download, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type ExportStatus = 'idle' | 'processing' | 'completed' | 'failed';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  reportName: string;
  onExport: (format: ExportFormat) => void;
}

export function ExportDialog({ open, onClose, reportName, onExport }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('excel');
  const [status, setStatus] = useState<ExportStatus>('idle');
  const [processingMessage, setProcessingMessage] = useState('');

  if (!open) return null;

  const formats = [
    {
      id: 'csv' as ExportFormat,
      icon: FileText,
      label: 'CSV',
      description: 'Định dạng văn bản, phù hợp Excel',
      color: '#10b981',
    },
    {
      id: 'excel' as ExportFormat,
      icon: FileSpreadsheet,
      label: 'Excel',
      description: 'File .xlsx với định dạng đầy đủ',
      color: '#059669',
    },
    {
      id: 'pdf' as ExportFormat,
      icon: FileText,
      label: 'PDF',
      description: 'Phù hợp in ấn và chia sẻ',
      color: '#ef4444',
    },
  ];

  const handleExport = () => {
    setStatus('processing');
    setProcessingMessage('Đang chuẩn bị dữ liệu...');
    
    // Simulate processing
    setTimeout(() => {
      setProcessingMessage('Đang tạo file xuất...');
    }, 1000);

    setTimeout(() => {
      setStatus('completed');
      onExport(selectedFormat);
    }, 2500);
  };

  const handleClose = () => {
    setStatus('idle');
    setProcessingMessage('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease',
        }}
        onClick={handleClose}
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 9999,
          width: '90%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          fontFamily: 'Inter, sans-serif',
          animation: 'slideIn 0.2s ease',
        }}
        onClick={(e) => e.stopPropagation()}
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
          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--foreground, #111827)',
                margin: 0,
                marginBottom: '4px',
              }}
            >
              Xuất dữ liệu báo cáo
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #6b7280)',
                margin: 0,
              }}
            >
              {reportName}
            </p>
          </div>
          <button
            onClick={handleClose}
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
              e.currentTarget.style.background = 'var(--muted, #f3f4f6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--spacing-5, 20px)' }}>
          {status === 'idle' && (
            <>
              {/* Format Selection */}
              <div style={{ marginBottom: 'var(--spacing-4, 16px)' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--foreground, #111827)',
                    marginBottom: 'var(--spacing-3, 12px)',
                  }}
                >
                  Chọn định dạng xuất
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2, 8px)' }}>
                  {formats.map((format) => {
                    const Icon = format.icon;
                    const isSelected = selectedFormat === format.id;

                    return (
                      <button
                        key={format.id}
                        onClick={() => setSelectedFormat(format.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-3, 12px)',
                          padding: 'var(--spacing-4, 16px)',
                          background: isSelected ? `${format.color}10` : 'var(--muted, #f9fafb)',
                          border: `2px solid ${isSelected ? format.color : 'var(--border, #e5e7eb)'}`,
                          borderRadius: 'var(--radius, 6px)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                            background: `${format.color}15`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={20} style={{ color: format.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'var(--foreground, #111827)',
                              marginBottom: '2px',
                            }}
                          >
                            {format.label}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--muted-foreground, #6b7280)',
                            }}
                          >
                            {format.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: format.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <CheckCircle2 size={14} style={{ color: '#ffffff' }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Audit Notice */}
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--spacing-3, 12px)',
                  padding: 'var(--spacing-4, 16px)',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: 'var(--radius, 6px)',
                  marginBottom: 'var(--spacing-4, 16px)',
                }}
              >
                <Info size={18} style={{ color: '#3b82f6', flexShrink: 0, marginTop: '1px' }} />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--muted-foreground, #6b7280)',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Hoạt động này được ghi nhận để phục vụ kiểm soát hệ thống. Dữ liệu đang được xử lý, vui lòng chờ.
                  </p>
                </div>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-4, 16px)',
                padding: 'var(--spacing-8, 32px) 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '4px solid var(--muted, #f3f4f6)',
                  borderTopColor: 'var(--primary, #005cb6)',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--foreground, #111827)',
                    marginBottom: '4px',
                  }}
                >
                  Đang xử lý...
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--muted-foreground, #6b7280)',
                  }}
                >
                  {processingMessage}
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-4, 16px)',
                padding: 'var(--spacing-8, 32px) 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#10b98115',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle2 size={36} style={{ color: '#10b981' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--foreground, #111827)',
                    marginBottom: '4px',
                  }}
                >
                  Xuất dữ liệu thành công
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--muted-foreground, #6b7280)',
                    marginBottom: 'var(--spacing-2, 8px)',
                  }}
                >
                  File của bạn đã sẵn sàng để tải xuống
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--muted-foreground, #9ca3af)',
                  }}
                >
                  Thực hiện bởi: Nguyễn Văn A • {new Date().toLocaleString('vi-VN')}
                </div>
              </div>
            </div>
          )}

          {status === 'failed' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-4, 16px)',
                padding: 'var(--spacing-8, 32px) 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#ef444415',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle size={36} style={{ color: '#ef4444' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--foreground, #111827)',
                    marginBottom: '4px',
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
                  Đã xảy ra lỗi khi xuất dữ liệu. Vui lòng thử lại sau.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-3, 12px)',
            padding: 'var(--spacing-5, 20px)',
            borderTop: '1px solid var(--border, #e5e7eb)',
            justifyContent: 'flex-end',
          }}
        >
          {status === 'idle' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #111827)',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
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
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                <Download size={16} />
                Xuất dữ liệu
              </button>
            </>
          )}
          {status === 'completed' && (
            <button
              onClick={handleClose}
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
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              <Download size={16} />
              Tải xuống
            </button>
          )}
          {status === 'failed' && (
            <>
              <button
                onClick={handleClose}
                style={{
                  padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                  background: 'var(--card, #ffffff)',
                  color: 'var(--foreground, #111827)',
                  border: '1px solid var(--border, #e5e7eb)',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setStatus('idle');
                  setProcessingMessage('');
                }}
                style={{
                  padding: 'var(--spacing-3, 12px) var(--spacing-5, 20px)',
                  background: 'var(--primary, #005cb6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '13px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                Thử lại
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -48%);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
