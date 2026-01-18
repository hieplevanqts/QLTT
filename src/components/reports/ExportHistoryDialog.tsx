import React from 'react';
import { X, Download, CheckCircle2, AlertCircle, Clock, FileText, User, Calendar } from 'lucide-react';

export interface ExportHistoryItem {
  id: string;
  reportName: string;
  format: string;
  status: 'completed' | 'failed' | 'processing';
  createdBy: string;
  createdAt: string;
  fileSize?: string;
}

interface ExportHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  history: ExportHistoryItem[];
}

export function ExportHistoryDialog({ open, onClose, history }: ExportHistoryDialogProps) {
  if (!open) return null;

  const getStatusBadge = (status: ExportHistoryItem['status']) => {
    const config = {
      completed: {
        icon: CheckCircle2,
        color: '#10b981',
        bg: '#10b98115',
        text: 'Hoàn thành',
      },
      failed: {
        icon: AlertCircle,
        color: '#ef4444',
        bg: '#ef444415',
        text: 'Thất bại',
      },
      processing: {
        icon: Clock,
        color: '#f59e0b',
        bg: '#f59e0b15',
        text: 'Đang xử lý',
      },
    };

    const { icon: Icon, color, bg, text } = config[status];

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 10px',
          borderRadius: 'calc(var(--radius, 6px) * 0.75)',
          background: bg,
          fontSize: '11px',
          fontWeight: 600,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        <Icon size={12} />
        {text}
      </div>
    );
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
        onClick={onClose}
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
          maxWidth: '800px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
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
              Lịch sử xuất dữ liệu
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #6b7280)',
                margin: 0,
              }}
            >
              Xem các hoạt động xuất dữ liệu đã thực hiện
            </p>
          </div>
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
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 'var(--spacing-5, 20px)',
          }}
        >
          {history.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-3, 12px)',
                padding: 'var(--spacing-8, 32px)',
                color: 'var(--muted-foreground, #6b7280)',
              }}
            >
              <FileText size={48} style={{ opacity: 0.3 }} />
              <div style={{ fontSize: '13px' }}>Chưa có lịch sử xuất dữ liệu</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3, 12px)' }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-4, 16px)',
                    padding: 'var(--spacing-4, 16px)',
                    background: 'var(--muted, #f9fafb)',
                    border: '1px solid var(--border, #e5e7eb)',
                    borderRadius: 'var(--radius, 6px)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--card, #ffffff)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--muted, #f9fafb)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                      background: 'rgba(0, 92, 182, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={20} style={{ color: 'var(--primary, #005cb6)' }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: 'var(--spacing-3, 12px)',
                        marginBottom: 'var(--spacing-2, 8px)',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--foreground, #111827)',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.reportName}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--muted-foreground, #9ca3af)',
                          }}
                        >
                          Định dạng: {item.format.toUpperCase()}
                          {item.fileSize && ` • Kích thước: ${item.fileSize}`}
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    {/* Metadata */}
                    <div
                      style={{
                        display: 'flex',
                        gap: 'var(--spacing-4, 16px)',
                        flexWrap: 'wrap',
                        fontSize: '11px',
                        color: 'var(--muted-foreground, #6b7280)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} />
                        {item.createdBy}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        {item.createdAt}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  {item.status === 'completed' && (
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        background: 'var(--primary, #005cb6)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'calc(var(--radius, 6px) * 0.75)',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
                      }}
                      title="Tải xuống"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#004a94';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--primary, #005cb6)';
                      }}
                    >
                      <Download size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: 'var(--spacing-5, 20px)',
            borderTop: '1px solid var(--border, #e5e7eb)',
            display: 'flex',
            justifyContent: 'flex-end',
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
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
            }}
          >
            Đóng
          </button>
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
