/**
 * Xây dựng báo cáo - Report Builder Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Eye, ChevronRight } from 'lucide-react';
import { reportService } from '../services/reportService';
import { ReportTemplate, provinces, topics, mockReportTemplates } from '../data/mock';
import styles from './ReportBuilderPage.module.css';

export const ReportBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const templates = reportService.getTemplates();
  
  const [formData, setFormData] = useState({
    title: '',
    templateId: '',
    location: '',
    province: '',
    topic: '',
    createdBy: 'Người dùng hiện tại'
  });

  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      templateId: template.id
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveDraft = () => {
    if (!formData.title || !formData.templateId || !formData.province || !formData.topic) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const newReport = reportService.createReport({
      title: formData.title,
      templateId: formData.templateId,
      templateName: selectedTemplate?.name || '',
      location: formData.location || formData.province,
      province: formData.province,
      topic: formData.topic,
      status: 'draft',
      createdBy: formData.createdBy,
      data: {}
    });

    alert('Đã lưu báo cáo nháp thành công!');
    navigate(`/kpi/${newReport.id}`);
  };

  const handleBack = () => {
    navigate('/kpi/list');
  };

  const isFormValid = formData.title && formData.templateId && formData.province && formData.topic;

  return (
    <div className={styles.builderPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbs} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666',
        padding: '12px 0'
      }}>
        <Link to="/" className={styles.breadcrumbLink} style={{ color: '#666', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <Link to="/kpi" className={styles.breadcrumbLink} style={{ color: '#666', textDecoration: 'none' }}>Báo cáo & KPI</Link>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <Link to="/kpi/list" className={styles.breadcrumbLink} style={{ color: '#666', textDecoration: 'none' }}>Danh sách báo cáo</Link>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <span style={{ color: '#101828', fontWeight: '500' }}>Tạo báo cáo mới</span>
      </div>

      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={18} />
          Quay lại
        </button>
        
        <div className={styles.headerActions}>
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className={styles.previewButton}
            disabled={!isFormValid}
          >
            <Eye size={18} />
            {showPreview ? 'Ẩn xem trước' : 'Xem trước'}
          </button>
          <button 
            onClick={handleSaveDraft} 
            className={styles.saveButton}
            disabled={!isFormValid}
          >
            <Save size={18} />
            Lưu nháp
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Chọn mẫu báo cáo</h2>
            <div className={styles.templateGrid}>
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`${styles.templateCard} ${
                    selectedTemplate?.id === template.id ? styles.templateCardSelected : ''
                  }`}
                >
                  <div className={styles.templateHeader}>
                    <span className={styles.templateCategory}>{template.category}</span>
                  </div>
                  <h3 className={styles.templateName}>{template.name}</h3>
                  <p className={styles.templateDescription}>{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Thông tin báo cáo</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tiêu đề báo cáo <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nhập tiêu đề báo cáo"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tỉnh/Thành phố <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleInputChange('province', e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="">Chọn địa bàn</option>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Địa bàn cụ thể
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Ví dụ: Quận Ba Đình"
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Chuyên đề <span className={styles.required}>*</span>
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className={styles.formSelect}
                >
                  <option value="">Chọn chuyên đề</option>
                  {topics.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {showPreview && isFormValid && (
          <div className={styles.previewSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Xem trước</h2>
              <div className={styles.previewContent}>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Tiêu đề:</span>
                  <span className={styles.previewValue}>{formData.title}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Mẫu:</span>
                  <span className={styles.previewValue}>{selectedTemplate?.name}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Loại:</span>
                  <span className={styles.previewValue}>{selectedTemplate?.category}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Địa bàn:</span>
                  <span className={styles.previewValue}>
                    {formData.location || formData.province}
                  </span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Tỉnh/TP:</span>
                  <span className={styles.previewValue}>{formData.province}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Chuyên đề:</span>
                  <span className={styles.previewValue}>{formData.topic}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Người tạo:</span>
                  <span className={styles.previewValue}>{formData.createdBy}</span>
                </div>
                <div className={styles.previewRow}>
                  <span className={styles.previewLabel}>Trạng thái:</span>
                  <span className={styles.previewValue}>Nháp</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
