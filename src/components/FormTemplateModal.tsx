/**
 * Form Template Modal - MAPPA Portal
 * Modal để thêm/sửa biểu mẫu với chức năng quản lý tiêu chí
 * 100% CSS Variables từ theme.css + Inter font
 */

import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Save,
  GripVertical,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { FormTemplate, FormCriterion } from '@/utils/data/formCriteriaTemplates';
import { toast } from 'sonner';

interface FormTemplateModalProps {
  mode: 'add' | 'edit' | 'view';
  template?: FormTemplate | null;
  onClose: () => void;
  onSave: (data: Partial<FormTemplate>) => void;
}

export const FormTemplateModal: React.FC<FormTemplateModalProps> = ({
  mode,
  template,
  onClose,
  onSave,
}) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  // Form state
  const [formData, setFormData] = useState({
    code: template?.code || '',
    name: template?.name || '',
    description: template?.description || '',
    status: template?.status || 'active',
  });

  // Criteria state
  const [criteria, setCriteria] = useState<FormCriterion[]>(
    template?.criteria || []
  );

  // Add new criterion
  const handleAddCriterion = () => {
    const newCriterion: FormCriterion = {
      id: `CRIT_${Date.now()}`,
      order: criteria.length + 1,
      code: '',
      name: '',
      description: '',
      inputType: 'text',
      required: 'TÙY CHỌN',
      completionRule: 'optional',
      defaultValue: '',
      options: [],
    };
    setCriteria([...criteria, newCriterion]);
  };

  // Update criterion
  const handleUpdateCriterion = (
    id: string,
    field: keyof FormCriterion,
    value: any
  ) => {
    setCriteria(
      criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  // Delete criterion
  const handleDeleteCriterion = (id: string) => {
    const updatedCriteria = criteria
      .filter((c) => c.id !== id)
      .map((c, index) => ({ ...c, order: index + 1 }));
    setCriteria(updatedCriteria);
    toast.success('Đã xóa tiêu chí');
  };

  // Save form
  const handleSave = () => {
    // Validation
    if (!formData.code.trim()) {
      toast.error('Vui lòng nhập mã biểu mẫu');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên biểu mẫu');
      return;
    }

    // Check criteria
    const incompleteCriteria = criteria.filter(
      (c) => !c.code.trim() || !c.name.trim()
    );
    if (incompleteCriteria.length > 0) {
      toast.error('Vui lòng hoàn thiện thông tin tất cả tiêu chí');
      return;
    }

    const templateData: Partial<FormTemplate> = {
      ...formData,
      criteria,
    };

    onSave(templateData);
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
          width: '1000px',
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 32px)',
          background: 'var(--card, #ffffff)',
          borderRadius: 'var(--radius, 8px)',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid var(--border, #d0d5dd)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius, 8px)',
                background: 'var(--primary-light, #e6f0fa)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary, #005cb6)',
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'var(--text-lg, 20px)',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                  margin: 0,
                  lineHeight: '30px',
                }}
              >
                {mode === 'add'
                  ? 'Thêm biểu mẫu mới'
                  : mode === 'edit'
                  ? 'Chỉnh sửa biểu mẫu'
                  : 'Xem chi tiết biểu mẫu'}
              </h2>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'var(--text-sm, 14px)',
                  color: 'var(--muted-foreground, #667085)',
                  margin: 0,
                  marginTop: '2px',
                }}
              >
                {mode === 'add'
                  ? 'Tạo biểu mẫu mới và thêm tiêu chí kiểm tra'
                  : mode === 'edit'
                  ? 'Cập nhật thông tin và quản lý tiêu chí'
                  : 'Thông tin chi tiết của biểu mẫu'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              minWidth: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius, 8px)',
              cursor: 'pointer',
              color: 'var(--muted-foreground, #667085)',
              transition: 'all 0.2s',
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

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {/* Basic Info Section */}
          <div
            style={{
              marginBottom: '32px',
            }}
          >
            <h3
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'var(--text-base, 16px)',
                fontWeight: 600,
                color: 'var(--foreground, #101828)',
                margin: '0 0 16px 0',
              }}
            >
              Thông tin cơ bản
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              {/* Code */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 500,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '6px',
                  }}
                >
                  Mã biểu mẫu <span style={{ color: 'var(--destructive, #d92d20)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  disabled={isView}
                  placeholder="VD: KT-HANG-001"
                  style={{
                    width: '100%',
                    height: '43px',
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    color: 'var(--foreground, #101828)',
                    background: isView ? 'var(--muted, #f2f4f7)' : 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius, 8px)',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    if (!isView) {
                      e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border, #d0d5dd)';
                  }}
                />
              </div>

              {/* Status */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 500,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '6px',
                  }}
                >
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                  }
                  disabled={isView}
                  style={{
                    width: '100%',
                    height: '43px',
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    color: 'var(--foreground, #101828)',
                    background: isView ? 'var(--muted, #f2f4f7)' : 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius, 8px)',
                    outline: 'none',
                    cursor: isView ? 'not-allowed' : 'pointer',
                  }}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>

              {/* Name */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 500,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '6px',
                  }}
                >
                  Tên biểu mẫu <span style={{ color: 'var(--destructive, #d92d20)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isView}
                  placeholder="VD: Kiểm tra Cơ sở Kinh doanh Hàng giả"
                  style={{
                    width: '100%',
                    height: '43px',
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    color: 'var(--foreground, #101828)',
                    background: isView ? 'var(--muted, #f2f4f7)' : 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius, 8px)',
                    outline: 'none',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    if (!isView) {
                      e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border, #d0d5dd)';
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 500,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '6px',
                  }}
                >
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isView}
                  placeholder="Nhập mô tả chi tiết về biểu mẫu..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    color: 'var(--foreground, #101828)',
                    background: isView ? 'var(--muted, #f2f4f7)' : 'var(--card, #ffffff)',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius, 8px)',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    if (!isView) {
                      e.currentTarget.style.borderColor = 'var(--primary, #005cb6)';
                    }
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border, #d0d5dd)';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Criteria Section */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'var(--text-base, 16px)',
                  fontWeight: 600,
                  color: 'var(--foreground, #101828)',
                  margin: 0,
                }}
              >
                Danh sách tiêu chí ({criteria.length})
              </h3>
              {!isView && (
                <button
                  onClick={handleAddCriterion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    height: '36px',
                    padding: '8px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    fontWeight: 500,
                    color: 'var(--primary, #005cb6)',
                    background: 'var(--primary-light, #e6f0fa)',
                    border: 'none',
                    borderRadius: 'var(--radius, 8px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary, #005cb6)';
                    e.currentTarget.style.color = 'var(--primary-foreground, #ffffff)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--primary-light, #e6f0fa)';
                    e.currentTarget.style.color = 'var(--primary, #005cb6)';
                  }}
                >
                  <Plus size={16} />
                  Thêm tiêu chí
                </button>
              )}
            </div>

            {criteria.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '48px 16px',
                  background: 'var(--muted, #f2f4f7)',
                  borderRadius: 'var(--radius, 8px)',
                  border: '2px dashed var(--border, #d0d5dd)',
                  textAlign: 'center',
                }}
              >
                <AlertCircle
                  size={48}
                  style={{ color: 'var(--muted-foreground, #667085)', marginBottom: '12px' }}
                />
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-base, 16px)',
                    fontWeight: 500,
                    color: 'var(--foreground, #101828)',
                    margin: '0 0 4px 0',
                  }}
                >
                  Chưa có tiêu chí nào
                </p>
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 'var(--text-sm, 14px)',
                    color: 'var(--muted-foreground, #667085)',
                    margin: 0,
                  }}
                >
                  Nhấn "Thêm tiêu chí" để bắt đầu thêm tiêu chí kiểm tra
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {criteria.map((criterion, index) => (
                  <div
                    key={criterion.id}
                    style={{
                      padding: '16px',
                      background: 'var(--muted, #f2f4f7)',
                      borderRadius: 'var(--radius, 8px)',
                      border: '1px solid var(--border, #d0d5dd)',
                    }}
                  >
                    {/* Criterion Header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <GripVertical size={16} style={{ color: 'var(--muted-foreground, #667085)' }} />
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            fontWeight: 600,
                            color: 'var(--foreground, #101828)',
                          }}
                        >
                          Tiêu chí #{criterion.order}
                        </span>
                      </div>
                      {!isView && (
                        <button
                          onClick={() => handleDeleteCriterion(criterion.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            height: '32px',
                            padding: '6px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--destructive, #d92d20)',
                            background: 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius, 8px)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--destructive-light, #fee)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      )}
                    </div>

                    {/* Criterion Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--muted-foreground, #667085)',
                            marginBottom: '4px',
                          }}
                        >
                          Mã tiêu chí
                        </label>
                        <input
                          type="text"
                          value={criterion.code}
                          onChange={(e) =>
                            handleUpdateCriterion(criterion.id, 'code', e.target.value.toUpperCase())
                          }
                          disabled={isView}
                          placeholder="VD: STEP_01"
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '8px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            color: 'var(--foreground, #101828)',
                            background: isView ? 'var(--background, #f9fafb)' : 'var(--card, #ffffff)',
                            border: '1px solid var(--border, #d0d5dd)',
                            borderRadius: 'var(--radius, 8px)',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--muted-foreground, #667085)',
                            marginBottom: '4px',
                          }}
                        >
                          Loại input
                        </label>
                        <select
                          value={criterion.inputType}
                          onChange={(e) =>
                            handleUpdateCriterion(criterion.id, 'inputType', e.target.value)
                          }
                          disabled={isView}
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '8px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            color: 'var(--foreground, #101828)',
                            background: isView ? 'var(--background, #f9fafb)' : 'var(--card, #ffffff)',
                            border: '1px solid var(--border, #d0d5dd)',
                            borderRadius: 'var(--radius, 8px)',
                            outline: 'none',
                            cursor: isView ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="select">Select</option>
                          <option value="multiselect">Multi-select</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                          <option value="textarea">Textarea</option>
                          <option value="date">Date</option>
                          <option value="photo">Photo</option>
                          <option value="gps">GPS</option>
                        </select>
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--muted-foreground, #667085)',
                            marginBottom: '4px',
                          }}
                        >
                          Tên tiêu chí
                        </label>
                        <input
                          type="text"
                          value={criterion.name}
                          onChange={(e) =>
                            handleUpdateCriterion(criterion.id, 'name', e.target.value)
                          }
                          disabled={isView}
                          placeholder="VD: Xác nhận địa điểm kiểm tra"
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '8px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            color: 'var(--foreground, #101828)',
                            background: isView ? 'var(--background, #f9fafb)' : 'var(--card, #ffffff)',
                            border: '1px solid var(--border, #d0d5dd)',
                            borderRadius: 'var(--radius, 8px)',
                            outline: 'none',
                          }}
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--muted-foreground, #667085)',
                            marginBottom: '4px',
                          }}
                        >
                          Mô tả
                        </label>
                        <textarea
                          value={criterion.description}
                          onChange={(e) =>
                            handleUpdateCriterion(criterion.id, 'description', e.target.value)
                          }
                          disabled={isView}
                          placeholder="Mô tả chi tiết về tiêu chí..."
                          rows={2}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            color: 'var(--foreground, #101828)',
                            background: isView ? 'var(--background, #f9fafb)' : 'var(--card, #ffffff)',
                            border: '1px solid var(--border, #d0d5dd)',
                            borderRadius: 'var(--radius, 8px)',
                            outline: 'none',
                            resize: 'vertical',
                          }}
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-xs, 12px)',
                            fontWeight: 500,
                            color: 'var(--muted-foreground, #667085)',
                            marginBottom: '4px',
                          }}
                        >
                          Bắt buộc
                        </label>
                        <select
                          value={criterion.required}
                          onChange={(e) =>
                            handleUpdateCriterion(criterion.id, 'required', e.target.value)
                          }
                          disabled={isView}
                          style={{
                            width: '100%',
                            height: '36px',
                            padding: '8px 10px',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: 'var(--text-sm, 14px)',
                            color: 'var(--foreground, #101828)',
                            background: isView ? 'var(--background, #f9fafb)' : 'var(--card, #ffffff)',
                            border: '1px solid var(--border, #d0d5dd)',
                            borderRadius: 'var(--radius, 8px)',
                            outline: 'none',
                            cursor: isView ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="BẮT BUỘC">BẮT BUỘC</option>
                          <option value="TÙY CHỌN">TÙY CHỌN</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid var(--border, #d0d5dd)',
            background: 'var(--muted, #f2f4f7)',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'var(--text-sm, 14px)',
              color: 'var(--muted-foreground, #667085)',
              margin: 0,
            }}
          >
            {criteria.length} tiêu chí
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                height: '41px',
                padding: '10px 18px',
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
              Hủy
            </button>
            {!isView && (
              <button
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
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
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <Save size={16} />
                {mode === 'add' ? 'Tạo biểu mẫu' : 'Lưu thay đổi'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
