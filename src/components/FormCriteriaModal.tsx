/**
 * Form Criteria Modal - MAPPA Portal
 * Modal hiển thị danh sách tiêu chí của biểu mẫu
 * Design: Simple list với blue circle numbers
 * Based on Figma: MappaPortal06ReportAdmin-2258-6805
 * Sử dụng 100% CSS Variables từ theme.css + Inter font
 */

import React, { useState } from 'react';
import { X, FileText, Search, FileDown, ChevronDown } from 'lucide-react';
import { FormTemplate } from '@/utils/data/formCriteriaTemplates';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface FormCriteriaModalProps {
  template: FormTemplate | null;
  onClose: () => void;
}

export const FormCriteriaModal: React.FC<FormCriteriaModalProps> = ({ template, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!template) return null;

  const criteria = template.criteria || [];

  // Filter criteria by search
  const filteredCriteria = criteria.filter((criterion) =>
    criterion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criterion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    criterion.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to Excel
  const handleExportExcel = () => {
    try {
      if (criteria.length === 0) {
        toast.error('Không có tiêu chí nào để xuất');
        return;
      }

      const exportData = criteria.map((criterion) => ({
        'STT': criterion.order,
        'Mã Tiêu Chí': criterion.code,
        'Tên Tiêu Chí': criterion.name,
        'Mô Tả': criterion.description,
        'Loại Input': criterion.inputType,
        'Bắt Buộc': criterion.required,
        'Quy Tắc Hoàn Thành': criterion.completionRule,
        'Giá Trị Mặc Định': criterion.defaultValue || '—',
        'Options': criterion.options ? criterion.options.join('; ') : '—',
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tiêu chí');

      const maxWidth = 50;
      const wscols = Object.keys(exportData[0] || {}).map(() => ({ wch: maxWidth }));
      ws['!cols'] = wscols;

      XLSX.writeFile(wb, `${template.code}_Tieu_Chi_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Xuất Excel thành công');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Lỗi khi xuất Excel');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '900px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
          background: 'var(--card, #ffffff)',
          borderRadius: 'var(--radius, 8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '24px 24px 16px 24px',
          }}
        >
          <div style={{ flex: 1 }}>
            {/* Title */}
            <h3
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-lg, 20px)',
                fontWeight: 600,
                color: 'var(--foreground, #101828)',
                margin: 0,
                marginBottom: '8px',
                lineHeight: '30px',
              }}
            >
              {template.name}
            </h3>
            
            {/* Subtitle: Code + Count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                color: 'var(--muted-foreground, #667085)',
              }}
            >
              <code
                style={{
                  background: 'var(--muted, #f2f4f7)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius, 8px)',
                  fontFamily: 'JetBrains Mono, Courier New, monospace',
                  fontSize: 'var(--text-xs, 12px)',
                  color: 'var(--muted-foreground, #667085)',
                  fontWeight: 400,
                }}
              >
                {template.code}
              </code>
              <span>•</span>
              <span>{criteria.length} tiêu chí</span>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              minWidth: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius, 8px)',
              cursor: 'pointer',
              color: 'var(--muted-foreground, #667085)',
              transition: 'all 0.2s',
              marginLeft: '16px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
              e.currentTarget.style.color = 'var(--foreground, #101828)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--muted-foreground, #667085)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        {template.description && (
          <div
            style={{
              background: 'var(--muted, #f2f4f7)',
              padding: '16px 20px',
              borderLeft: '4px solid var(--primary, #005cb6)',
              margin: '0 24px 24px 24px',
              borderRadius: 'var(--radius, 8px)',
            }}
          >
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                color: 'var(--foreground, #101828)',
                lineHeight: '22.4px',
                margin: 0,
              }}
            >
              {template.description}
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            padding: '0 24px 16px 24px',
            flexWrap: 'wrap',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--muted-foreground, #667085)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu chí..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '43px',
                padding: '10px 14px 10px 42px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                color: 'var(--foreground, #101828)',
                background: 'var(--background, #f9fafb)',
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 8px)',
                outline: 'none',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                e.currentTarget.style.background = 'var(--card, #ffffff)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border, #d0d5dd)';
                e.currentTarget.style.background = 'var(--background, #f9fafb)';
              }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '43px',
                padding: '10px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                fontWeight: 500,
                color: 'var(--foreground, #101828)',
                background: 'var(--card, #ffffff)',
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 8px)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card, #ffffff)';
              }}
            >
              <ChevronDown size={16} />
              Mở rộng tất cả
            </button>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '43px',
                padding: '10px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                fontWeight: 500,
                color: 'var(--foreground, #101828)',
                background: 'var(--card, #ffffff)',
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 8px)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card, #ffffff)';
              }}
            >
              <ChevronDown size={16} style={{ transform: 'rotate(180deg)' }} />
              Thu gọn tất cả
            </button>
            <button
              onClick={handleExportExcel}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '43px',
                padding: '10px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-sm, 14px)',
                fontWeight: 500,
                color: 'var(--foreground, #101828)',
                background: 'var(--card, #ffffff)',
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 8px)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--muted, #f2f4f7)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--card, #ffffff)';
              }}
            >
              <FileDown size={16} />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Criteria List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '0 24px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {filteredCriteria.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '64px 16px',
                color: 'var(--muted-foreground, #667085)',
                textAlign: 'center',
              }}
            >
              <FileText size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'var(--text-base, 16px)', margin: 0 }}>
                Không tìm thấy tiêu chí nào
              </p>
            </div>
          ) : (
            filteredCriteria.map((criterion, index) => (
              <div
                key={criterion.id}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderBottom: index < filteredCriteria.length - 1 ? '1px solid var(--border, #d0d5dd)' : 'none',
                }}
              >
                {/* Blue Circle Number */}
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    borderRadius: '16px',
                    background: 'var(--primary, #005cb6)',
                    color: 'var(--primary-foreground, #ffffff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 600,
                  }}
                >
                  {criterion.order}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title + Code */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <h4
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: 'var(--text-base, 16px)',
                        fontWeight: 600,
                        color: 'var(--foreground, #101828)',
                        margin: 0,
                        lineHeight: '24px',
                      }}
                    >
                      {criterion.name}
                    </h4>
                    <code
                      style={{
                        background: 'var(--muted, #f2f4f7)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius, 8px)',
                        fontFamily: 'JetBrains Mono, Courier New, monospace',
                        fontSize: 'var(--text-xs, 12px)',
                        color: 'var(--muted-foreground, #667085)',
                        fontWeight: 400,
                        lineHeight: '18px',
                      }}
                    >
                      {criterion.code}
                    </code>
                  </div>
                  
                  {/* Description */}
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-sm, 14px)',
                      color: 'var(--muted-foreground, #667085)',
                      lineHeight: '21px',
                      margin: 0,
                    }}
                  >
                    {criterion.description}
                  </p>
                </div>

                {/* Badge + Chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span
                    style={{
                      padding: '4px 12px',
                      height: '26px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: '999px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'var(--text-xs, 12px)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      lineHeight: '18px',
                      background:
                        criterion.required === 'BẮT BUỘC'
                          ? 'rgba(217, 45, 32, 0.1)'
                          : 'rgba(0, 92, 182, 0.1)',
                      color:
                        criterion.required === 'BẮT BUỘC'
                          ? 'var(--destructive, #d92d20)'
                          : 'var(--primary, #005cb6)',
                    }}
                  >
                    {criterion.required}
                  </span>
                  <ChevronDown size={20} style={{ color: 'var(--muted-foreground, #667085)' }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid var(--border, #d0d5dd)',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              color: 'var(--muted-foreground, #667085)',
              margin: 0,
              lineHeight: '21px',
            }}
          >
            Hiển thị {filteredCriteria.length} / {criteria.length} tiêu chí
          </p>
          <button
            onClick={onClose}
            style={{
              height: '41px',
              padding: '10px 18px',
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              fontWeight: 500,
              color: 'var(--primary-foreground, #ffffff)',
              background: 'var(--primary, #005cb6)',
              border: 'none',
              borderRadius: 'var(--radius, 8px)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              lineHeight: '21px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};
