import React from 'react';
import { CheckCircle2, FileSpreadsheet, X } from 'lucide-react';

interface ExportSuccessToastProps {
  fileName: string;
  totalSheets: number;
  totalRecords: number;
  onClose: () => void;
}

export function ExportSuccessToast({ fileName, totalSheets, totalRecords, onClose }: ExportSuccessToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 'var(--spacing-6, 24px)',
        right: 'var(--spacing-6, 24px)',
        background: 'var(--card, #ffffff)',
        border: '1px solid var(--border, #e5e7eb)',
        borderRadius: 'var(--radius, 6px)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        padding: 'var(--spacing-5, 20px)',
        minWidth: '380px',
        maxWidth: '450px',
        zIndex: 10000,
        fontFamily: 'Inter, sans-serif',
        animation: 'slideInRight 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--spacing-4, 16px)' }}>
        {/* Icon */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#10b98115',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={24} style={{ color: '#10b981' }} />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-2, 8px)' }}>
            <h4
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--foreground, #111827)',
                margin: 0,
              }}
            >
              Xuất Excel thành công!
            </h4>
            <button
              onClick={onClose}
              style={{
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                borderRadius: 'calc(var(--radius, 6px) * 0.5)',
                color: 'var(--muted-foreground, #6b7280)',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2, 8px)',
              marginBottom: 'var(--spacing-3, 12px)',
            }}
          >
            <FileSpreadsheet size={14} style={{ color: 'var(--muted-foreground, #6b7280)' }} />
            <div
              style={{
                fontSize: '12px',
                color: 'var(--muted-foreground, #6b7280)',
                fontFamily: "'Courier New', monospace",
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {fileName}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-2, 8px)',
              padding: 'var(--spacing-3, 12px)',
              background: 'var(--muted, #f9fafb)',
              borderRadius: 'calc(var(--radius, 6px) * 0.75)',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--muted-foreground, #6b7280)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Sheets
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--foreground, #111827)',
                }}
              >
                {totalSheets}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--muted-foreground, #6b7280)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px',
                }}
              >
                Records
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--foreground, #111827)',
                }}
              >
                {totalRecords}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 'var(--spacing-3, 12px)',
              fontSize: '11px',
              color: '#10b981',
              fontWeight: 500,
            }}
          >
            ✓ File đã được tải xuống thành công
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}
